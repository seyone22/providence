import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { db as dbClient, requests } from "@/db";
import { emailService } from "@/lib/email";
import {
  getTrackingData,
  markLeadAsOpened,
  markLeadAsQualified,
} from "../tracking-actions";

// The @/db module is fully mocked below; alias the imported client to a
// permissive mock shape so the update/returning/query mocks type-check.
type MockedDb = Record<string, Mock> & {
  query: Record<string, Record<string, Mock>>;
};
const db = dbClient as unknown as MockedDb;

// Mock the dependencies
vi.mock("@/db", () => {
  const mockDb = {
    query: {
      requests: {
        findFirst: vi.fn(),
      },
      users: {
        findFirst: vi.fn(),
      },
      specDossiers: {
        findMany: vi.fn(),
      },
    },
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  };
  return {
    db: mockDb,
    requests: { id: "requests_id_col", leadStatus: "requests_leadStatus_col" },
  };
});

vi.mock("@/lib/email", () => ({
  emailService: {
    sendLeadQualifiedAlert: vi.fn().mockResolvedValue(true),
  },
}));

describe("tracking-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTrackingData", () => {
    it("should return null if request is not found", async () => {
      vi.mocked(db.query.requests.findFirst).mockResolvedValue(
        undefined as any,
      );

      const result = await getTrackingData("non-existent-id");
      expect(result).toBeNull();
    });

    it("should return request and agent details if found", async () => {
      const mockRequest = {
        id: "req-1",
        vehicleModel: "Model 3",
        assignedToId: "agent-1",
        dossierIds: ["dossier-1"],
        createdAt: new Date("2026-07-09T10:00:00Z"),
        updatedAt: new Date("2026-07-09T10:00:00Z"),
        eta: new Date("2026-07-15T00:00:00Z"),
        statusUpdatedAt: null,
        preferredContactAt: null,
        followUpAt: null,
        followUpSetAt: null,
        statusHistory: [],
      };

      const mockAgent = {
        id: "agent-1",
        name: "Test Agent",
        email: "agent@test.com",
        image: "image.png",
        whatsappNumber: "+123456",
      };

      const mockDossier = {
        id: "dossier-1",
        make: "Tesla",
        model: "Model 3",
        createdAt: new Date("2026-07-09T09:00:00Z"),
        updatedAt: new Date("2026-07-09T09:00:00Z"),
      };

      vi.mocked(db.query.requests.findFirst).mockResolvedValue(
        mockRequest as any,
      );
      vi.mocked(db.query.users.findFirst).mockResolvedValue(mockAgent as any);
      vi.mocked(db.query.specDossiers.findMany).mockResolvedValue([
        mockDossier,
      ] as any);

      const result = await getTrackingData("req-1");
      expect(result).not.toBeNull();
      expect(result?.request.vehicle_model).toBe("Model 3");
      expect(result?.request._id).toBe("req-1");
      expect(result?.agent?.name).toBe("Test Agent");
      expect(result?.request.dossierIds[0]._id).toBe("dossier-1");
    });
  });

  describe("markLeadAsQualified", () => {
    it("should update status and trigger email if request is found", async () => {
      const mockRequest = { id: "req-1", leadStatus: "Qualified" };
      vi.mocked(db.update(requests).returning).mockResolvedValue([
        mockRequest,
      ] as any);

      await markLeadAsQualified("req-1");

      expect(db.update).toHaveBeenCalledWith(requests);
      expect(db.update(requests).set).toHaveBeenCalledWith({
        leadStatus: "Qualified",
      });
      expect(emailService.sendLeadQualifiedAlert).toHaveBeenCalled();
    });

    it("should log warning if request is not found", async () => {
      vi.mocked(db.update(requests).returning).mockResolvedValue([] as any);

      await markLeadAsQualified("req-1");

      expect(emailService.sendLeadQualifiedAlert).not.toHaveBeenCalled();
    });
  });

  describe("markLeadAsOpened", () => {
    it("should trigger status update to Opened", async () => {
      await markLeadAsOpened("req-1");

      expect(db.update).toHaveBeenCalledWith(requests);
      expect(db.update(requests).set).toHaveBeenCalledWith({
        leadStatus: "Opened",
      });
    });
  });
});
