"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/mongoose";
import { SpecDossier } from "@/models/SpecDossier";

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
    const query: any = { slug: candidate };
    if (currentId) query._id = { $ne: currentId };

    const existing = await SpecDossier.findOne(query).select("_id").lean();
    if (!existing) return candidate;

    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

/**
 * SAVE / UPSERT DOSSIER TEMPLATE
 * Handles creating new templates and updating existing ones based on _id.
 */
export async function saveSpecDossier(payload: any) {
  try {
    await connectToDatabase();

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
      const conflict = await SpecDossier.findOne({
        slug,
        ...(payload._id ? { _id: { $ne: payload._id } } : {}),
      })
        .select("_id")
        .lean();

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
    const { forceSlug, ...rest } = payload;
    payload = { ...rest, slug };

    let savedDossier;

    if (payload._id) {
      // If an ID exists, update the existing template
      savedDossier = await SpecDossier.findByIdAndUpdate(
        payload._id,
        { $set: payload },
        {
          new: true,
          runValidators: true,
        },
      );
    } else {
      // If no ID exists, create a brand new template
      savedDossier = await SpecDossier.create(payload);
    }

    revalidatePath("/admin/dossiers");
    revalidatePath("/admin/specs");
    revalidatePath("/b2c/gallery");

    return {
      success: true,
      message: "Template synchronized successfully.",
      data: JSON.parse(JSON.stringify(savedDossier)),
    };
  } catch (error: any) {
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
export async function getSpecDossierById(id: any) {
  const actionName = "[getSpecDossierById]";
  try {
    await connectToDatabase();

    // Resolve by Mongo _id when the value looks like an ObjectId,
    // otherwise (or as a fallback) treat it as a public URL slug.
    let dossier = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      dossier = await SpecDossier.findById(id);
    }
    if (!dossier) {
      dossier = await SpecDossier.findOne({ slug: id });
    }

    if (!dossier) {
      return { success: false, message: "Template not found." };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(dossier)),
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
    await connectToDatabase();
    console.log(
      `${actionName} STEP 1 COMPLETE: Database connection established successfully.`,
    );

    // Step 2: Query Execution
    console.log(
      `${actionName} STEP 2: Executing find() query on SpecDossier collection...`,
    );
    const dossiers = await SpecDossier.find({}).sort({ createdAt: -1 });
    console.log(
      `${actionName} STEP 2 COMPLETE: Query successful. Found ${dossiers?.length || 0} template(s).`,
    );

    // Step 3: Payload Parsing and Return
    console.log(`${actionName} STEP 3: Parsing payload for client...`);
    const parsedData = JSON.parse(JSON.stringify(dossiers));

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
    };
  }
}

/**
 * UPDATE STATUS (Quick Action)
 * Useful for switching between 'Draft', 'Active', 'Archived' without sending the whole payload.
 */
export async function updateDossierStatus(id: string, status: string) {
  try {
    await connectToDatabase();
    await SpecDossier.findByIdAndUpdate(id, { $set: { status } });

    revalidatePath("/admin/dossiers");
    return { success: true, message: `Status updated to ${status}` };
  } catch (error) {
    return { success: false, message: "Failed to update status." };
  }
}

/**
 * DELETE DOSSIER
 */
export async function deleteSpecDossier(id: string) {
  try {
    await connectToDatabase();
    const result = await SpecDossier.findByIdAndDelete(id);

    if (!result) return { success: false, message: "Template not found." };

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
    await connectToDatabase();

    // Convert tags to lowercase to ensure match compatibility
    const normalizedTags = tags.map((t) => t.toLowerCase());

    const dossiers = await SpecDossier.find({
      status: "Active",
      searchTags: { $in: normalizedTags },
    }).sort({ createdAt: -1 });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(dossiers)),
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
