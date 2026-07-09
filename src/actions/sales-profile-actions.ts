// @/actions/sales-profile-actions.ts
"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { pathnameToSource } from "@/lib/leadSource";
import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import SalesProfile from "@/models/SalesProfile";
import { SpecDossier } from "@/models/SpecDossier";
import { auth } from "@/utils/auth";

// Slugs that must never become a member profile (would collide with real routes
// or read as spam). Compared case-insensitively.
const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "auth",
  "request",
  "track",
  "campaigns",
  "b2b",
  "b2c",
  "saas",
  "gallery",
  "team",
  "blog",
  "dealer-dashboard",
  "ireland-cost-calculator",
  "sitemap",
  "robots",
  "signup",
  "sign-in",
  "sign-up",
]);

function slugify(input: string) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Resolve the current session; throws if unauthenticated. */
async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/** Only Sales/admin users may own or edit a profile. */
function canOwnProfile(role?: string) {
  return role === "Sales" || role === "admin";
}

/** Strip a Mongoose doc to a plain, serialisable object for the client. */
function plain<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

/**
 * PUBLIC — fetch a published profile by slug for /team/[slug], with its
 * featured vehicles populated (published/active dossiers only).
 */
export async function getPublishedProfileBySlug(slug: string) {
  try {
    await connectToDatabase();
    const profile = await SalesProfile.findOne({
      slug: slugify(slug),
      isPublished: true,
    }).lean();

    if (!profile) return { success: false, message: "Profile not found" };

    // Resolve featured vehicles, preserving the member's chosen order and
    // dropping any that are no longer live (draft/archived/deleted).
    let featuredVehicles: any[] = [];
    const ids = (profile as any).featuredDossierIds || [];
    if (ids.length > 0) {
      const dossiers = await SpecDossier.find({
        _id: { $in: ids },
        status: { $in: ["Active", "Published"] },
      }).lean();
      const byId = new Map(dossiers.map((d: any) => [d._id.toString(), d]));
      featuredVehicles = ids
        .map((id: any) => byId.get(id.toString()))
        .filter(Boolean);
    }

    return {
      success: true,
      data: {
        profile: plain(profile),
        featuredVehicles: plain(featuredVehicles),
      },
    };
  } catch (error: any) {
    console.error("[getPublishedProfileBySlug] Error:", error);
    return { success: false, message: "Failed to load profile" };
  }
}

/**
 * OWNER — load the signed-in member's own profile for the editor. Creates a
 * blank draft on first open so the editor always has a document to bind to.
 */
export async function getMyProfile() {
  try {
    const session = await requireSession();
    if (!canOwnProfile((session.user as any).role)) {
      return {
        success: false,
        message: "Only sales members have a profile page.",
      };
    }
    await connectToDatabase();

    let profile = await SalesProfile.findOne({
      userId: session.user.id,
    }).lean();

    if (!profile) {
      // Seed a sensible default slug + identity from the user record.
      const base = slugify(session.user.name || "member") || "member";
      let candidate = base;
      let n = 2;
      while (
        RESERVED_SLUGS.has(candidate) ||
        (await SalesProfile.findOne({ slug: candidate }).select("_id").lean())
      ) {
        candidate = `${base}-${n++}`;
      }
      const created = await SalesProfile.create({
        userId: session.user.id,
        slug: candidate,
        isPublished: false,
        displayName: session.user.name || "",
        whatsappNumber: (session.user as any).whatsappNumber || "",
        photoUrl: session.user.image || "",
      });
      profile = created.toObject();
    }

    return { success: true, data: plain(profile) };
  } catch (error: any) {
    console.error("[getMyProfile] Error:", error);
    return {
      success: false,
      message: error.message || "Failed to load profile",
    };
  }
}

/**
 * OWNER — upsert the signed-in member's profile. Admins may edit any profile by
 * passing `targetUserId`. Validates and de-duplicates the slug.
 */
export async function updateMyProfile(input: {
  targetUserId?: string;
  slug?: string;
  isPublished?: boolean;
  displayName?: string;
  headline?: string;
  tagline?: string;
  bio?: string;
  photoUrl?: string;
  coverImageUrl?: string;
  yearsExperience?: number;
  languages?: string[];
  expertise?: { icon: string; title: string; desc: string }[];
  sourcingCountries?: { country: string; flag: string; note: string }[];
  trackRecord?: { value: string; label: string }[];
  testimonials?: {
    name: string;
    title: string;
    text: string;
    rating: number;
  }[];
  featuredDossierIds?: string[];
  whatsappNumber?: string;
}) {
  try {
    const session = await requireSession();
    const role = (session.user as any).role;
    if (!canOwnProfile(role)) {
      return { success: false, message: "Not authorised to edit a profile." };
    }
    await connectToDatabase();

    // Owner scope: members edit only their own; admins may target another.
    const ownerId =
      role === "admin" && input.targetUserId
        ? input.targetUserId
        : session.user.id;

    const existing = await SalesProfile.findOne({ userId: ownerId });
    if (!existing) {
      return {
        success: false,
        message: "Profile not found. Open the editor first.",
      };
    }

    // --- Slug validation --------------------------------------------------
    let slug = existing.slug;
    if (input.slug !== undefined) {
      const requested = slugify(input.slug);
      if (!requested) {
        return { success: false, message: "Slug can't be empty." };
      }
      if (RESERVED_SLUGS.has(requested)) {
        return {
          success: false,
          message: `"${requested}" is a reserved word — pick another slug.`,
        };
      }
      if (requested !== existing.slug) {
        const conflict = await SalesProfile.findOne({
          slug: requested,
          _id: { $ne: existing._id },
        })
          .select("_id")
          .lean();
        if (conflict) {
          return {
            success: false,
            message: `The URL "${requested}" is already taken.`,
          };
        }
      }
      slug = requested;
    }

    // A profile can only go live once it has the essentials.
    if (input.isPublished) {
      const dn = input.displayName ?? existing.displayName;
      const hl = input.headline ?? existing.headline;
      if (!dn || !hl) {
        return {
          success: false,
          message:
            "Add at least a display name and a headline before publishing.",
        };
      }
    }

    // Assign only provided fields (undefined = leave as-is).
    const set = (k: keyof typeof input, v: any) => {
      if (v !== undefined) (existing as any)[k] = v;
    };
    existing.slug = slug;
    set("isPublished", input.isPublished);
    set("displayName", input.displayName);
    set("headline", input.headline);
    set("tagline", input.tagline);
    set("bio", input.bio);
    set("photoUrl", input.photoUrl);
    set("coverImageUrl", input.coverImageUrl);
    set("yearsExperience", input.yearsExperience);
    set("languages", input.languages);
    set("expertise", input.expertise);
    set("sourcingCountries", input.sourcingCountries);
    set("trackRecord", input.trackRecord?.slice(0, 3));
    set("testimonials", input.testimonials);
    set("whatsappNumber", input.whatsappNumber);
    if (input.featuredDossierIds !== undefined) {
      existing.featuredDossierIds = input.featuredDossierIds
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));
    }

    await existing.save();

    revalidatePath(`/team/${slug}`);
    revalidatePath("/admin/my-profile");

    return {
      success: true,
      message: "Profile saved.",
      data: plain(existing.toObject()),
    };
  } catch (error: any) {
    console.error("[updateMyProfile] Error:", error);
    return {
      success: false,
      message: error.message || "Failed to save profile",
    };
  }
}

/**
 * PUBLIC — slugs of all published profiles, for the sitemap.
 */
export async function listPublishedProfileSlugs() {
  try {
    await connectToDatabase();
    const profiles = await SalesProfile.find({ isPublished: true })
      .select("slug updatedAt")
      .lean();
    return plain(profiles) as { slug: string; updatedAt: string }[];
  } catch (error) {
    console.error("[listPublishedProfileSlugs] Error:", error);
    return [];
  }
}

/**
 * OWNER — minimal gallery list for the vehicle picker in the editor.
 */
export async function listGalleryForPicker() {
  try {
    const session = await requireSession();
    if (!canOwnProfile((session.user as any).role)) {
      return { success: false, message: "Not authorised." };
    }
    await connectToDatabase();

    const dossiers = await SpecDossier.find({})
      .select("make model year trim heroImageUrl images status slug")
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, data: plain(dossiers) };
  } catch (error: any) {
    console.error("[listGalleryForPicker] Error:", error);
    return { success: false, message: "Failed to load gallery" };
  }
}

/**
 * OWNER — live stats scoped to the signed-in member's own leads.
 */
export async function getMyStats() {
  try {
    const session = await requireSession();
    await connectToDatabase();

    const meId = new mongoose.Types.ObjectId(session.user.id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    // Owner scope + exclude abandoned drafts, everywhere.
    const base = { assignedToId: meId, isDraft: { $ne: true } };

    const IN_TRANSIT = ["Shipped", "Arrived at Port", "Cleared Customs"];

    const [
      assignedLeads,
      assignedThisMonth,
      actionRequired,
      followUpsDue,
      inTransit,
      closedWon,
      pipelineAgg,
      bySourceAgg,
    ] = await Promise.all([
      Request.countDocuments(base),
      Request.countDocuments({ ...base, createdAt: { $gte: startOfMonth } }),
      Request.countDocuments({ ...base, leadStatus: "Action required" }),
      Request.countDocuments({ ...base, followUpAt: { $lte: endOfToday } }),
      Request.countDocuments({ ...base, status: { $in: IN_TRANSIT } }),
      // "Closed / won" — matches the codebase's closed/won convention.
      Request.countDocuments({
        ...base,
        leadStatus: { $regex: /closed|won/i },
      }),
      Request.aggregate([
        { $match: base },
        {
          $group: {
            _id: null,
            total: { $sum: { $ifNull: ["$agreedPrice", 0] } },
          },
        },
      ]),
      Request.aggregate([
        { $match: base },
        { $group: { _id: "$source", count: { $sum: 1 } } },
      ]),
    ]);

    const pipelineValue = pipelineAgg?.[0]?.total || 0;

    // Fold raw source values into their display labels ("My Profile Page",
    // "Home Page", "Campaign: …") and sum counts per label.
    const bySourceMap = new Map<string, number>();
    for (const row of bySourceAgg as any[]) {
      const label = pathnameToSource(row._id || "") || "Unknown";
      bySourceMap.set(label, (bySourceMap.get(label) || 0) + row.count);
    }
    const inquiriesByLandingPage = Array.from(bySourceMap.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    return {
      success: true,
      data: {
        assignedLeads,
        assignedThisMonth,
        actionRequired,
        followUpsDue,
        inTransit,
        closedWon,
        pipelineValue,
        inquiriesByLandingPage,
      },
    };
  } catch (error: any) {
    console.error("[getMyStats] Error:", error);
    return { success: false, message: error.message || "Failed to load stats" };
  }
}
