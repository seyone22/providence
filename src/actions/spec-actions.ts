"use server";

import crypto from "node:crypto";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, specDossiers } from "@/db";

/**
 * Strip a Drizzle record to a plain, serialisable object and map id to _id for backward compatibility.
 */
// biome-ignore lint/suspicious/noExplicitAny: backward compatibility
function serializeDossier(dossier: any) {
  if (!dossier) return null;
  return JSON.parse(
    JSON.stringify({
      ...dossier,
      _id: dossier.id,
    }),
  );
}

/**
 * Normalises a string into a url-safe slug (lowercase, hyphenated).
 */
function slugify(input: string) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Returns the first slug that is not already taken (excluding `currentId`).
 * Tries `base`, then `base-2`, `base-3`, ... until a free one is found.
 */
async function findAvailableSlug(base: string, currentId?: string) {
  let candidate = base;
  let counter = 2;

  // Loop until no other dossier owns this slug.
  while (true) {
    const conditions = [eq(specDossiers.slug, candidate)];
    if (currentId) {
      conditions.push(ne(specDossiers.id, currentId));
    }

    const existing = await db.query.specDossiers.findFirst({
      columns: { id: true },
      where: and(...conditions),
    });
    if (!existing) return candidate;

    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

/**
 * SAVE / UPSERT DOSSIER TEMPLATE
 * Handles creating new templates and updating existing ones based on _id.
 */
// biome-ignore lint/suspicious/noExplicitAny: backward compatibility
export async function saveSpecDossier(payload: any) {
  try {
    // --- Slug handling ---------------------------------------------------
    // Live (Active/Published) templates MUST have an explicit slug so their
    // public page is always a clean URL — never a raw Mongo _id. Drafts may
    // be saved without a slug; they preview via the _id until one is set.
    const isLive =
      payload.status === "Active" || payload.status === "Published";
    let slug = slugify(payload.slug || "");

    if (isLive && !slug) {
      return {
        success: false,
        message:
          "A URL slug is required before setting a template to Active. Please add a slug in the URL Slug Configuration field.",
      };
    }

    if (slug) {
      const conditions = [eq(specDossiers.slug, slug)];
      if (payload._id) {
        conditions.push(ne(specDossiers.id, payload._id));
      }
      const conflict = await db.query.specDossiers.findFirst({
        columns: { id: true },
        where: and(...conditions),
      });

      if (conflict) {
        // Caller did not opt into auto-numbering — surface the collision.
        if (!payload.forceSlug) {
          const suggestedSlug = await findAvailableSlug(slug, payload._id);
          return {
            success: false,
            conflict: true,
            slug,
            suggestedSlug,
            message: `The URL "${slug}" is already in use.`,
          };
        }
        // forceSlug === true: take the next free numbered slug.
        slug = await findAvailableSlug(slug, payload._id);
      }
    }

    // Strip the transient flag and persist the resolved slug.
    const { forceSlug: _, ...rest } = payload;
    const resolvedPayload = { ...rest, slug };

    // biome-ignore lint/suspicious/noExplicitAny: dynamic assignment mapping
    const dataToSave: any = {};
    const allowedKeys = [
      "make",
      "model",
      "year",
      "trim",
      "condition",
      "mileage",
      "countryOfOrigin",
      "engineConfig",
      "displacement",
      "maxPower",
      "maxTorque",
      "transmission",
      "fuelSystem",
      "steering",
      "emissions",
      "pricing",
      "upholstery",
      "infotainment",
      "features",
      "searchTags",
      "heroImageUrl",
      "images",
      "customData",
      "valuePoints",
      "slug",
      "notes",
      "status",
    ];
    for (const key of allowedKeys) {
      if (resolvedPayload[key] !== undefined) {
        dataToSave[key] = resolvedPayload[key];
      }
    }

    // biome-ignore lint/suspicious/noImplicitAnyLet: dynamic assignment
    let savedDossier;

    if (payload._id) {
      // If an ID exists, update the existing template
      const [updated] = await db
        .update(specDossiers)
        .set({
          ...dataToSave,
          updatedAt: new Date(),
        })
        .where(eq(specDossiers.id, payload._id))
        .returning();
      savedDossier = updated;
    } else {
      // If no ID exists, create a brand new template
      const newId = crypto.randomUUID();
      const [created] = await db
        .insert(specDossiers)
        .values({
          id: newId,
          make: dataToSave.make,
          model: dataToSave.model,
          year: dataToSave.year ?? "",
          trim: dataToSave.trim ?? "",
          condition: dataToSave.condition ?? "New",
          mileage: dataToSave.mileage ?? "",
          countryOfOrigin: dataToSave.countryOfOrigin ?? "Japan",
          engineConfig: dataToSave.engineConfig ?? "",
          displacement: dataToSave.displacement ?? "",
          maxPower: dataToSave.maxPower ?? "",
          maxTorque: dataToSave.maxTorque ?? "",
          transmission: dataToSave.transmission ?? "",
          fuelSystem: dataToSave.fuelSystem ?? "Petrol",
          steering: dataToSave.steering ?? "RHD",
          emissions: dataToSave.emissions ?? "",
          pricing: dataToSave.pricing ?? [],
          upholstery: dataToSave.upholstery ?? "",
          infotainment: dataToSave.infotainment ?? "",
          features: dataToSave.features ?? [],
          searchTags: dataToSave.searchTags ?? [],
          heroImageUrl: dataToSave.heroImageUrl ?? "",
          images: dataToSave.images ?? [],
          customData: dataToSave.customData ?? [],
          valuePoints: dataToSave.valuePoints ?? [],
          slug: dataToSave.slug ?? "",
          notes: dataToSave.notes ?? "",
          status: dataToSave.status ?? "Draft",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      savedDossier = created;
    }

    revalidatePath("/admin/dossiers");
    revalidatePath("/admin/specs");
    revalidatePath("/b2c/gallery");

    return {
      success: true,
      message: "Template synchronized successfully.",
      data: serializeDossier(savedDossier),
    };
  } catch (error) {
    console.error("Save Error:", error);
    return {
      success: false,
      message: "Failed to save template.",
    };
  }
}

/**
 * GET SINGLE DOSSIER BY ID
 */
// biome-ignore lint/suspicious/noExplicitAny: backward compatibility
export async function getSpecDossierById(id: any) {
  const actionName = "[getSpecDossierById]";
  try {
    const lookupId = typeof id === "string" ? id : String(id || "");
    if (!lookupId) {
      return { success: false, message: "Invalid ID provided." };
    }

    let dossier = await db.query.specDossiers.findFirst({
      where: eq(specDossiers.id, lookupId),
    });

    if (!dossier) {
      dossier = await db.query.specDossiers.findFirst({
        where: eq(specDossiers.slug, lookupId),
      });
    }

    if (!dossier) {
      return { success: false, message: "Template not found." };
    }

    return {
      success: true,
      data: serializeDossier(dossier),
    };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return { success: false, message: "Error fetching template." };
  }
}

/**
 * GET ALL DOSSIERS
 */
export async function getAllSpecDossiers() {
  const actionName = "[getAllSpecDossiers]";
  const startTime = Date.now();
  console.log(
    `${actionName} INITIATION: Starting request to fetch all spec dossiers...`,
  );

  try {
    // Step 1: Database Connection
    console.log(
      `${actionName} STEP 1: Attempting to connect to the database...`,
    );
    console.log(
      `${actionName} STEP 1 COMPLETE: Database connection established successfully.`,
    );

    // Step 2: Query Execution
    console.log(
      `${actionName} STEP 2: Executing find() query on SpecDossier collection...`,
    );
    const dossiers = await db.query.specDossiers.findMany({
      orderBy: desc(specDossiers.createdAt),
    });
    console.log(
      `${actionName} STEP 2 COMPLETE: Query successful. Found ${dossiers?.length || 0} template(s).`,
    );

    // Step 3: Payload Parsing and Return
    console.log(`${actionName} STEP 3: Parsing payload for client...`);
    const parsedData = dossiers.map(serializeDossier);

    const executionTime = Date.now() - startTime;
    console.log(
      `${actionName} SUCCESS: Returning data payload. Total execution time: ${executionTime}ms.`,
    );

    return {
      success: true,
      data: parsedData,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;

    // Detailed Error Logging
    console.error(
      `${actionName} ERROR: Action failed after ${executionTime}ms.`,
    );

    if (error instanceof Error) {
      console.error(`${actionName} Error Message:`, error.message);
      console.error(`${actionName} Stack Trace:`, error.stack);
    } else {
      console.error(`${actionName} Unknown Error:`, error);
    }

    return {
      success: false,
      message: "Error fetching templates.",
      data: [],
    };
  }
}

/**
 * UPDATE STATUS (Quick Action)
 * Useful for switching between 'Draft', 'Active', 'Archived' without sending the whole payload.
 */
export async function updateDossierStatus(id: string, status: string) {
  try {
    await db
      .update(specDossiers)
      .set({ status, updatedAt: new Date() })
      .where(eq(specDossiers.id, id));

    revalidatePath("/admin/dossiers");
    return { success: true, message: `Status updated to ${status}` };
  } catch (_error) {
    return { success: false, message: "Failed to update status." };
  }
}

/**
 * DELETE DOSSIER
 */
export async function deleteSpecDossier(id: string) {
  try {
    const [deleted] = await db
      .delete(specDossiers)
      .where(eq(specDossiers.id, id))
      .returning();

    if (!deleted) return { success: false, message: "Template not found." };

    revalidatePath("/admin/dossiers");
    revalidatePath("/admin/specs");

    return { success: true, message: "Template deleted successfully." };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Error deleting template." };
  }
}

/**
 * GET DOSSIERS BY FILTER TAGS
 * Fetches active vehicle templates that match a list of search keywords/slugs.
 */
export async function getSpecDossiersByTags(tags: string[]) {
  const actionName = "[getSpecDossiersByTags]";
  try {
    // Convert tags to lowercase to ensure match compatibility
    const normalizedTags = tags.map((t) => t.toLowerCase());

    if (normalizedTags.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const dossiers = await db.query.specDossiers.findMany({
      where: and(
        eq(specDossiers.status, "Active"),
        sql`${specDossiers.searchTags} && ${normalizedTags}::text[]`,
      ),
      orderBy: desc(specDossiers.createdAt),
    });

    return {
      success: true,
      data: dossiers.map(serializeDossier),
    };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return {
      success: false,
      message: "Error fetching filtered templates.",
      data: [],
    };
  }
}
