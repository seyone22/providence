import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { db as dbClient, specDossiers } from "@/db";
import {
  deleteSpecDossier,
  getAllSpecDossiers,
  getSpecDossierById,
  getSpecDossiersByTags,
  saveSpecDossier,
  updateDossierStatus,
} from "../spec-actions";

// The @/db module is fully mocked below; alias the imported client to a
// permissive mock shape so the insert/update/returning mocks type-check.
type MockedDb = Record<string, Mock> & {
  query: Record<string, Record<string, Mock>>;
};
const db = dbClient as unknown as MockedDb;

// Mock database
vi.mock("@/db", () => {
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    query: {
      specDossiers: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
  };
  return {
    db: mockDb,
    specDossiers: {
      id: "spec_id_col",
      slug: "spec_slug_col",
      status: "spec_status_col",
      searchTags: "spec_search_tags_col",
    },
  };
});

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("spec-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveSpecDossier", () => {
    it("should fail if live status but slug is missing", async () => {
      const result = await saveSpecDossier({ status: "Active", slug: "" });
      expect(result.success).toBe(false);
      expect(result.message).toContain("slug is required");
    });

    it("should insert a new dossier if no _id is provided", async () => {
      const mockSavedDossier = {
        id: "new-spec-id",
        slug: "toyota-supra",
        status: "Draft",
      };
      vi.mocked(db.query.specDossiers.findFirst).mockResolvedValue(null as any);
      vi.mocked(db.insert(specDossiers).returning).mockResolvedValue([
        mockSavedDossier,
      ] as any);

      const result = await saveSpecDossier({
        make: "Toyota",
        model: "Supra",
        status: "Draft",
        slug: "toyota-supra",
      });

      expect(result.success).toBe(true);
      expect(db.insert).toHaveBeenCalled();
    });

    it("should update an existing dossier if _id is provided", async () => {
      const mockSavedDossier = {
        id: "spec-123",
        slug: "toyota-supra",
        status: "Draft",
      };
      vi.mocked(db.query.specDossiers.findFirst).mockResolvedValue(null as any);
      vi.mocked(db.update(specDossiers).returning).mockResolvedValue([
        mockSavedDossier,
      ] as any);

      const result = await saveSpecDossier({
        _id: "spec-123",
        make: "Toyota",
        model: "Supra",
        status: "Draft",
        slug: "toyota-supra",
      });

      expect(result.success).toBe(true);
      expect(db.update).toHaveBeenCalled();
    });

    it("should handle slug conflict and suggest alternative slug", async () => {
      const mockConflict = { id: "spec-other", slug: "toyota-supra" };

      // First findFirst call (conflict check) returns the conflicting dossier
      vi.mocked(db.query.specDossiers.findFirst)
        .mockResolvedValueOnce(mockConflict as any) // conflict check
        .mockResolvedValueOnce(mockConflict as any) // findAvailableSlug base check
        .mockResolvedValueOnce(null as any); // findAvailableSlug base-2 check

      const result = await saveSpecDossier({
        make: "Toyota",
        model: "Supra",
        status: "Draft",
        slug: "toyota-supra",
      });

      expect(result.success).toBe(false);
      expect(result.conflict).toBe(true);
      expect(result.suggestedSlug).toBe("toyota-supra-2");
    });
  });

  describe("getSpecDossierById", () => {
    it("should retrieve a dossier by ID and serialize it", async () => {
      const mockDossier = { id: "spec-123", make: "Nissan" };
      vi.mocked(db.query.specDossiers.findFirst).mockResolvedValue(
        mockDossier as any,
      );

      const result = await getSpecDossierById("spec-123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data._id).toBe("spec-123");
        expect(result.data.make).toBe("Nissan");
      }
    });
  });

  describe("updateDossierStatus", () => {
    it("should update status in DB", async () => {
      const mockDossier = { id: "spec-123", status: "Active" };
      vi.mocked(db.update(specDossiers).returning).mockResolvedValue([
        mockDossier,
      ] as any);

      const result = await updateDossierStatus("spec-123", "Active");
      expect(result.success).toBe(true);
      expect(db.update).toHaveBeenCalled();
    });
  });

  describe("deleteSpecDossier", () => {
    it("should delete dossier from DB", async () => {
      const mockDeleted = { id: "spec-123" };
      vi.mocked(db.delete(specDossiers).where).mockReturnThis();
      vi.mocked(db.returning).mockResolvedValueOnce([mockDeleted] as any);

      const result = await deleteSpecDossier("spec-123");
      expect(result.success).toBe(true);
      expect(db.delete).toHaveBeenCalled();
    });
  });
});
