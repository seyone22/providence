import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDashboardData } from "../dashboard-actions";
import { db } from "@/db";

// Mock database
vi.mock("@/db", () => {
  const mockDb = {
    query: {
      requests: {
        findMany: vi.fn(),
      },
    },
  };
  return {
    db: mockDb,
  };
});

// Mock Next.js headers and auth
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: () => "localhost",
  }),
}));

vi.mock("@/utils/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: "admin-1", role: "admin" },
      }),
    },
  },
}));

describe("dashboard-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDashboardData", () => {
    it("should return false if session is unauthorized", async () => {
      const { auth } = await import("@/utils/auth");
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const result = await getDashboardData();
      expect(result.success).toBe(false);
    });

    it("should aggregate data correctly from requests", async () => {
      const mockRequests = [
        {
          id: "req-1",
          name: "John Doe",
          make: "Toyota",
          vehicleModel: "Supra",
          agreedPrice: 15000,
          countryOfImport: "Ireland",
          isDraft: false,
          statusHistory: [
            {
              id: "hist-1",
              performedBy: "Admin",
              action: "Status Updated",
              comment: "Moved to Contacted",
              date: "2026-07-09T10:00:00Z",
            },
          ],
        },
        {
          id: "req-2",
          name: "Jane Smith",
          make: "Nissan",
          vehicleModel: "Skyline",
          agreedPrice: 20000,
          countryOfImport: "UK",
          isDraft: false,
          statusHistory: [],
        },
      ];
      vi.mocked(db.query.requests.findMany).mockResolvedValue(mockRequests as any);

      const result = await getDashboardData();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.grossPipeline).toBe(35000);
        expect(result.data.regionalWeights["Ireland"]).toBe(15000);
        expect(result.data.regionalWeights["UK"]).toBe(20000);
        expect(result.data.activityStream.length).toBe(1);
        expect(result.data.activityStream[0].operator).toBe("Admin");
      }
    });
  });
});
