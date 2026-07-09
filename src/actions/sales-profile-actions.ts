// @/actions/sales-profile-actions.ts
"use server";

import crypto from "node:crypto";
import { and, desc, eq, gte, inArray, lte, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db, requests, salesProfiles, specDossiers } from "@/db";
import { pathnameToSource } from "@/lib/leadSource";
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

/** Map and format raw Drizzle salesProfile record to expected return type. */
function mapSalesProfile(raw: typeof salesProfiles.$inferSelect) {
  return {
    ...raw,
    _id: raw.id,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
    expertise: (raw.expertise || []) as {
      icon: string;
      title: string;
      desc: string;
    }[],
    sourcingCountries: (raw.sourcingCountries || []) as {
      country: string;
      flag: string;
      note: string;
    }[],
    trackRecord: (raw.trackRecord || []) as { value: string; label: string }[],
    testimonials: (raw.testimonials || []) as {
      name: string;
      title: string;
      text: string;
      rating: number;
    }[],
  };
}

/**
 * PUBLIC — fetch a published profile by slug for /team/[slug], with its
 * featured vehicles populated (published/active dossiers only).
 */
export async function getPublishedProfileBySlug(slug: string) {
  try {
    const slugValue = slugify(slug);
    const profiles = await db
      .select()
      .from(salesProfiles)
      .where(
        and(
          eq(salesProfiles.slug, slugValue),
          eq(salesProfiles.isPublished, true),
        ),
      )
      .limit(1);

    const rawProfile = profiles[0];
    if (!rawProfile) return { success: false, message: "Profile not found" };

    const profile = mapSalesProfile(rawProfile);

    // Resolve featured vehicles, preserving the member's chosen order and
    // dropping any that are no longer live (draft/archived/deleted).
    let featuredVehicles: any[] = [];
    const ids = profile.featuredDossierIds || [];
    if (ids.length > 0) {
      const dossiers = await db
        .select()
        .from(specDossiers)
        .where(
          and(
            inArray(specDossiers.id, ids),
            inArray(specDossiers.status, ["Active", "Published"]),
          ),
        );

      const mappedDossiers = dossiers.map((d) => ({
        ...d,
        _id: d.id,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
      }));

      const byId = new Map(mappedDossiers.map((d) => [d.id.toString(), d]));
      featuredVehicles = ids
        .map((id) => byId.get(id.toString()))
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

    const profiles = await db
      .select()
      .from(salesProfiles)
      .where(eq(salesProfiles.userId, session.user.id))
      .limit(1);

    let profile = profiles[0];

    if (!profile) {
      // Seed a sensible default slug + identity from the user record.
      const base = slugify(session.user.name || "member") || "member";
      let candidate = base;
      let n = 2;
      while (true) {
        if (RESERVED_SLUGS.has(candidate)) {
          candidate = `${base}-${n++}`;
          continue;
        }
        const existingSlug = await db
          .select({ id: salesProfiles.id })
          .from(salesProfiles)
          .where(eq(salesProfiles.slug, candidate))
          .limit(1);
        if (existingSlug.length > 0) {
          candidate = `${base}-${n++}`;
          continue;
        }
        break;
      }

      const newId = crypto.randomUUID();
      const [created] = await db
        .insert(salesProfiles)
        .values({
          id: newId,
          userId: session.user.id,
          slug: candidate,
          isPublished: false,
          displayName: session.user.name || "",
          whatsappNumber: (session.user as any).whatsappNumber || "",
          photoUrl: session.user.image || "",
          headline: "",
          tagline: "",
          bio: "",
          coverImageUrl: "",
          yearsExperience: 0,
          languages: [],
          expertise: [],
          sourcingCountries: [],
          trackRecord: [],
          testimonials: [],
          featuredDossierIds: [],
        })
        .returning();

      profile = created;
    }

    const mappedProfile = mapSalesProfile(profile);

    return { success: true, data: plain(mappedProfile) };
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

    // Owner scope: members edit only their own; admins may target another.
    const ownerId =
      role === "admin" && input.targetUserId
        ? input.targetUserId
        : session.user.id;

    const profiles = await db
      .select()
      .from(salesProfiles)
      .where(eq(salesProfiles.userId, ownerId))
      .limit(1);

    const existing = profiles[0];
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
        const conflict = await db
          .select({ id: salesProfiles.id })
          .from(salesProfiles)
          .where(
            and(
              eq(salesProfiles.slug, requested),
              ne(salesProfiles.id, existing.id),
            ),
          )
          .limit(1);
        if (conflict.length > 0) {
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
    const updateData: Partial<typeof salesProfiles.$inferInsert> = {
      slug,
      updatedAt: new Date(),
    };

    if (input.isPublished !== undefined)
      updateData.isPublished = input.isPublished;
    if (input.displayName !== undefined)
      updateData.displayName = input.displayName;
    if (input.headline !== undefined) updateData.headline = input.headline;
    if (input.tagline !== undefined) updateData.tagline = input.tagline;
    if (input.bio !== undefined) updateData.bio = input.bio;
    if (input.photoUrl !== undefined) updateData.photoUrl = input.photoUrl;
    if (input.coverImageUrl !== undefined)
      updateData.coverImageUrl = input.coverImageUrl;
    if (input.yearsExperience !== undefined)
      updateData.yearsExperience = input.yearsExperience;
    if (input.languages !== undefined) updateData.languages = input.languages;
    if (input.expertise !== undefined) updateData.expertise = input.expertise;
    if (input.sourcingCountries !== undefined)
      updateData.sourcingCountries = input.sourcingCountries;
    if (input.trackRecord !== undefined)
      updateData.trackRecord = input.trackRecord.slice(0, 3);
    if (input.testimonials !== undefined)
      updateData.testimonials = input.testimonials;
    if (input.whatsappNumber !== undefined)
      updateData.whatsappNumber = input.whatsappNumber;
    if (input.featuredDossierIds !== undefined) {
      updateData.featuredDossierIds = input.featuredDossierIds.filter(
        (id) => typeof id === "string" && id.trim() !== "",
      );
    }

    const [updated] = await db
      .update(salesProfiles)
      .set(updateData)
      .where(eq(salesProfiles.id, existing.id))
      .returning();

    revalidatePath(`/team/${slug}`);
    revalidatePath("/admin/my-profile");

    const mappedUpdated = mapSalesProfile(updated);

    return {
      success: true,
      message: "Profile saved.",
      data: plain(mappedUpdated),
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
    const profiles = await db
      .select({
        slug: salesProfiles.slug,
        updatedAt: salesProfiles.updatedAt,
      })
      .from(salesProfiles)
      .where(eq(salesProfiles.isPublished, true));

    const mappedProfiles = profiles.map((p) => ({
      slug: p.slug,
      updatedAt: p.updatedAt.toISOString(),
    }));

    return plain(mappedProfiles) as { slug: string; updatedAt: string }[];
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

    const dossiers = await db
      .select({
        id: specDossiers.id,
        make: specDossiers.make,
        model: specDossiers.model,
        year: specDossiers.year,
        trim: specDossiers.trim,
        heroImageUrl: specDossiers.heroImageUrl,
        images: specDossiers.images,
        status: specDossiers.status,
        slug: specDossiers.slug,
        createdAt: specDossiers.createdAt,
      })
      .from(specDossiers)
      .orderBy(desc(specDossiers.createdAt));

    const mappedDossiers = dossiers.map((d) => ({
      ...d,
      _id: d.id,
      createdAt: d.createdAt.toISOString(),
    }));

    return { success: true, data: plain(mappedDossiers) };
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
    const baseConditions = [
      eq(requests.assignedToId, session.user.id),
      ne(requests.isDraft, true),
    ];

    const IN_TRANSIT = ["Shipped", "Arrived at Port", "Cleared Customs"];

    const [
      assignedLeadsRes,
      assignedThisMonthRes,
      actionRequiredRes,
      followUpsDueRes,
      inTransitRes,
      closedWonRes,
      pipelineRes,
      bySourceAgg,
    ] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(requests)
        .where(and(...baseConditions)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(requests)
        .where(and(...baseConditions, gte(requests.createdAt, startOfMonth))),
      db
        .select({ count: sql<number>`count(*)` })
        .from(requests)
        .where(
          and(...baseConditions, eq(requests.leadStatus, "Action required")),
        ),
      db
        .select({ count: sql<number>`count(*)` })
        .from(requests)
        .where(and(...baseConditions, lte(requests.followUpAt, endOfToday))),
      db
        .select({ count: sql<number>`count(*)` })
        .from(requests)
        .where(and(...baseConditions, inArray(requests.status, IN_TRANSIT))),
      db
        .select({ count: sql<number>`count(*)` })
        .from(requests)
        .where(
          and(
            ...baseConditions,
            sql`lower(${requests.leadStatus}) LIKE '%closed%' OR lower(${requests.leadStatus}) LIKE '%won%'`,
          ),
        ),
      db
        .select({
          total: sql<number>`sum(coalesce(${requests.agreedPrice}, 0))`,
        })
        .from(requests)
        .where(and(...baseConditions)),
      db
        .select({
          source: requests.source,
          count: sql<number>`count(*)`,
        })
        .from(requests)
        .where(and(...baseConditions))
        .groupBy(requests.source),
    ]);

    const assignedLeads = Number(assignedLeadsRes[0]?.count || 0);
    const assignedThisMonth = Number(assignedThisMonthRes[0]?.count || 0);
    const actionRequired = Number(actionRequiredRes[0]?.count || 0);
    const followUpsDue = Number(followUpsDueRes[0]?.count || 0);
    const inTransit = Number(inTransitRes[0]?.count || 0);
    const closedWon = Number(closedWonRes[0]?.count || 0);
    const pipelineValue = Number(pipelineRes[0]?.total || 0);

    // Fold raw source values into their display labels ("My Profile Page",
    // "Home Page", "Campaign: …") and sum counts per label.
    const bySourceMap = new Map<string, number>();
    for (const row of bySourceAgg) {
      const label = pathnameToSource(row.source || "") || "Unknown";
      bySourceMap.set(label, (bySourceMap.get(label) || 0) + Number(row.count));
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
