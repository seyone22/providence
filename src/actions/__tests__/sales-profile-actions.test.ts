import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPublishedProfileBySlug,
  getMyProfile,
  updateMyProfile,
  listPublishedProfileSlugs,
  listGalleryForPicker,
  getMyStats,
} from "../sales-profile-actions";
import { db, salesProfiles } from "@/db";

// Mock database
vi.mock("@/db", () => {
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    then: vi.fn((onFulfilled) => onFulfilled([])),
    query: {
      salesProfiles: {
        findFirst: vi.fn(),
      },
      specDossiers: {
        findMany: vi.fn(),
      },
    },
  };
  return {
    db: mockDb,
    salesProfiles: { id: "sales_id_col", isPublished: "sales_isPublished_col", slug: "sales_slug_col", userId: "sales_user_id_col" },
    specDossiers: { id: "spec_id_col", status: "spec_status_col" },
    requests: { id: "req_id_col", assignedToId: "req_assigned_to_id_col" },
  };
});

// Mock Next.js headers and auth
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: () => "localhost",
  }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/utils/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: "user-1", name: "Sales User", role: "Sales" },
      }),
    },
  },
}));

describe("sales-profile-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPublishedProfileBySlug", () => {
    it("should return not found if slug is reserved", async () => {
      const result = await getPublishedProfileBySlug("admin");
      expect(result.success).toBe(false);
      expect(result.message).toBe("Profile not found");
    });

    it("should return profile if found and published", async () => {
      const mockProfile = {
        id: "profile-1",
        slug: "test-slug",
        isPublished: true,
        displayName: "Test Display",
        expertise: [],
        sourcingCountries: [],
        trackRecord: [],
        testimonials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(db.then).mockImplementationOnce((onFulfilled) => onFulfilled([mockProfile]));
      vi.mocked(db.query.specDossiers.findMany).mockResolvedValue([] as any);

      const result = await getPublishedProfileBySlug("test-slug");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.profile.displayName).toBe("Test Display");
      }
    });
  });

  describe("getMyProfile", () => {
    it("should return success: false if session is missing", async () => {
      const { auth } = await import("@/utils/auth");
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const result = await getMyProfile();
      expect(result.success).toBe(false);
      expect(result.message).toContain("Unauthorized");
    });

    it("should return profile if user has one", async () => {
      const mockProfile = {
        id: "profile-1",
        userId: "user-1",
        expertise: [],
        sourcingCountries: [],
        trackRecord: [],
        testimonials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(db.then).mockImplementationOnce((onFulfilled) => onFulfilled([mockProfile]));

      const result = await getMyProfile();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.userId).toBe("user-1");
      }
    });
  });

  describe("updateMyProfile", () => {
    it("should validate and update or insert profile", async () => {
      const mockProfile = {
        id: "profile-1",
        userId: "user-1",
        slug: "test-slug",
        displayName: "Test Name",
        headline: "Expert Sourcing",
        expertise: [],
        sourcingCountries: [],
        trackRecord: [],
        testimonials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockProfile])) // getMyProfile select
        .mockImplementationOnce((onFulfilled) => onFulfilled([]))           // slug conflict select
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockProfile])); // update returning

      const result = await updateMyProfile({
        displayName: "Updated Name",
        headline: "Updated Headline",
        bio: "Bio description",
        slug: "updated-slug",
        isPublished: true,
      });

      expect(result.success).toBe(true);
    });
  });
});
