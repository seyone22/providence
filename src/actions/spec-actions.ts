"use server";

import crypto from "node:crypto";
import { and, desc, eq, inArray, ne, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db, specDossiers } from "@/db";
import { auth } from "@/utils/auth";

/**
 * Guard for admin-only mutations. Read helpers below stay public because they
 * power the storefront (gallery, sitemap, campaign carousels), but anything
 * that creates, edits, or deletes a template requires a signed-in session.
 */
async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session;
}

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
  if (!(await requireAuth())) {
    return { success: false, message: "Unauthorized. Please sign in." };
  }
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
      "steeringOptions",
      "emissions",
      "pricing",
      "exteriorColors",
      "interiorColors",
      "grades",
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
      "isUpcoming",
      "expectedAvailability",
      "newsSlug",
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
          steeringOptions: dataToSave.steeringOptions ?? [],
          emissions: dataToSave.emissions ?? "",
          pricing: dataToSave.pricing ?? [],
          exteriorColors: dataToSave.exteriorColors ?? [],
          interiorColors: dataToSave.interiorColors ?? [],
          grades: dataToSave.grades ?? [],
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
          isUpcoming: dataToSave.isUpcoming ?? false,
          expectedAvailability: dataToSave.expectedAvailability ?? "",
          newsSlug: dataToSave.newsSlug ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      savedDossier = created;
    }

    revalidatePath("/admin/dossiers");
    revalidatePath("/admin/specs");
    revalidatePath("/b2c/gallery");
    // The news index carries the upcoming-cars rail, so flipping a dossier's
    // coming-soon flag has to invalidate it too.
    revalidatePath("/latest-news");
    // A new or renamed vehicle changes the URL set, so the sitemap has to be
    // rebuilt rather than served from its hourly ISR cache.
    revalidatePath("/sitemap.xml");

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
  if (!(await requireAuth())) {
    return { success: false, message: "Unauthorized. Please sign in." };
  }
  try {
    await db
      .update(specDossiers)
      .set({ status, updatedAt: new Date() })
      .where(eq(specDossiers.id, id));

    revalidatePath("/admin/dossiers");
    // Status is what makes a dossier public, so it both adds and removes a
    // sitemap URL — and the gallery listing changes with it.
    revalidatePath("/b2c/gallery");
    revalidatePath("/latest-news");
    revalidatePath("/sitemap.xml");
    return { success: true, message: `Status updated to ${status}` };
  } catch (_error) {
    return { success: false, message: "Failed to update status." };
  }
}

/**
 * DELETE DOSSIER
 */
export async function deleteSpecDossier(id: string) {
  if (!(await requireAuth())) {
    return { success: false, message: "Unauthorized. Please sign in." };
  }
  try {
    const [deleted] = await db
      .delete(specDossiers)
      .where(eq(specDossiers.id, id))
      .returning();

    if (!deleted) return { success: false, message: "Template not found." };

    revalidatePath("/admin/dossiers");
    revalidatePath("/admin/specs");
    revalidatePath("/b2c/gallery");
    // Deleting an upcoming car has to clear it from the news rail too,
    // otherwise the card lingers there and links to a 404.
    revalidatePath("/latest-news");
    revalidatePath("/sitemap.xml");

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

/**
 * GET GALLERY PREVIEW CARS
 * Lean read for the horizontally-scrolling preview strips (home page, campaign
 * landings) — these only ever render a handful of cards, so this selects just
 * the columns a card needs, filters and limits in SQL, and skips the heavy
 * JSONB fields (customData/valuePoints/notes/features/etc.) that
 * getAllSpecDossiers/getSpecDossiersByTags return for admin and detail views.
 * That was the source of the strip's slow first paint: those two actions
 * pulled every column for every dossier (getAllSpecDossiers didn't even
 * filter by status in SQL — it fetched everything and filtered client-side)
 * before the component discarded all but 12 of them.
 */
export async function getGalleryPreviewCars(tags?: string[], limit = 12) {
  const actionName = "[getGalleryPreviewCars]";
  try {
    const conditions = [eq(specDossiers.status, "Active")];
    if (tags && tags.length > 0) {
      const normalizedTags = tags.map((t) => t.toLowerCase());
      conditions.push(
        sql`${specDossiers.searchTags} && ${normalizedTags}::text[]`,
      );
    }

    const dossiers = await db.query.specDossiers.findMany({
      columns: {
        id: true,
        make: true,
        model: true,
        year: true,
        slug: true,
        heroImageUrl: true,
        images: true,
        pricing: true,
        isUpcoming: true,
        expectedAvailability: true,
        grades: true,
      },
      where: and(...conditions),
      orderBy: desc(specDossiers.createdAt),
      limit,
    });

    return {
      success: true,
      data: dossiers.map((d) => ({ ...d, _id: d.id })),
    };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return {
      success: false,
      message: "Error fetching preview cars.",
      data: [],
    };
  }
}

/**
 * GET CARS FOR A NEWS ARTICLE
 *
 * Unions the two directions the link can be authored from:
 *  - the dossier's `newsSlug`, set by the admin toggle (the usual path, and
 *    the one that needs no code change to add a car to a story), and
 *  - the article's `linkedVehicleSlugs`, set in the news registry when an
 *    editor wants to name cars explicitly.
 *
 * Only Active dossiers are returned, so a draft car page can't be linked into
 * a published story. Slugs that don't resolve are simply absent — a story
 * naming a car we haven't built a page for yet must not break the article.
 */
export async function getCarsForNewsArticle(
  articleSlug: string,
  linkedVehicleSlugs: string[] = [],
) {
  const actionName = "[getCarsForNewsArticle]";
  try {
    const columns = {
      id: true,
      make: true,
      model: true,
      year: true,
      trim: true,
      slug: true,
      heroImageUrl: true,
      images: true,
      pricing: true,
      expectedAvailability: true,
      newsSlug: true,
      isUpcoming: true,
      grades: true,
    } as const;

    const matchers = [
      // Cars pointed at this article from the admin builder.
      ...(articleSlug ? [eq(specDossiers.newsSlug, articleSlug)] : []),
      // Cars named by the article itself.
      ...(linkedVehicleSlugs.length > 0
        ? [inArray(specDossiers.slug, linkedVehicleSlugs)]
        : []),
    ];

    if (matchers.length === 0) return { success: true, data: [] };

    const dossiers = await db.query.specDossiers.findMany({
      columns,
      where: and(eq(specDossiers.status, "Active"), or(...matchers)),
      orderBy: desc(specDossiers.createdAt),
    });

    return {
      success: true,
      data: dossiers.map((d) => ({ ...d, _id: d.id })),
    };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return { success: false, message: "Error fetching linked cars.", data: [] };
  }
}

/**
 * GET UPCOMING CARS
 * Active dossiers flagged as coming soon, newest first. Powers the "Upcoming
 * cars & new model releases" rail on /latest-news and the coming-soon strip on
 * the gallery, so it selects only the columns a card needs — including the
 * `newsSlug` that links each car back to its launch announcement.
 */
export async function getUpcomingCars(limit = 12) {
  const actionName = "[getUpcomingCars]";
  try {
    const dossiers = await db.query.specDossiers.findMany({
      columns: {
        id: true,
        make: true,
        model: true,
        year: true,
        trim: true,
        slug: true,
        heroImageUrl: true,
        images: true,
        pricing: true,
        expectedAvailability: true,
        newsSlug: true,
        grades: true,
      },
      where: and(
        eq(specDossiers.status, "Active"),
        eq(specDossiers.isUpcoming, true),
      ),
      orderBy: desc(specDossiers.createdAt),
      limit,
    });

    return {
      success: true,
      data: dossiers.map((d) => ({ ...d, _id: d.id })),
    };
  } catch (error) {
    console.error(`${actionName} Error:`, error);
    return {
      success: false,
      message: "Error fetching upcoming cars.",
      data: [],
    };
  }
}
