import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { db as dbClient } from "@/db";
import { createDealerProfile, getDealerDashboardData } from "../dealer-actions";

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
    limit: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    then: vi.fn((onFulfilled) => onFulfilled([])),
    query: {},
  };
  return {
    db: mockDb,
    dealerProfiles: {
      id: "dealerProfiles_id_col",
      userId: "dealerProfiles_userId_col",
      dealerId: "dealerProfiles_dealerId_col",
      companyName: "dealerProfiles_companyName_col",
    },
    requests: {
      id: "requests_id_col",
      source: "requests_source_col",
      createdAt: "requests_createdAt_col",
    },
    users: {
      id: "users_id_col",
      role: "users_role_col",
    },
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
        user: { id: "dealer-user-1", role: "dealer" },
      }),
    },
  },
}));

describe("dealer-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createDealerProfile", () => {
    it("should fail if the user is not found", async () => {
      // Mock db.select returning empty array (user not found)
      vi.mocked(db.then).mockImplementationOnce((onFulfilled) =>
        onFulfilled([]),
      );

      const result = await createDealerProfile({
        userId: "non-existent-user",
        companyName: "Test Dealership",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("User not found");
    });

    it("should succeed and create dealer profile if user exists", async () => {
      const mockUser = { id: "user-123", name: "John Contact" };

      // 1st then: users select (user exists)
      // 2nd then: dealerProfiles select check for dealerId uniqueness (not exists)
      // 3rd then: dealerProfiles insert
      // 4th then: users update role
      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockUser]))
        .mockImplementationOnce((onFulfilled) => onFulfilled([])) // unique check returns empty
        .mockImplementationOnce((onFulfilled) => onFulfilled([])) // insert returns empty
        .mockImplementationOnce((onFulfilled) => onFulfilled([])); // update returns empty

      const result = await createDealerProfile({
        userId: "user-123",
        companyName: "Apex Motors",
        website: "https://apex.com",
      });

      expect(result.success).toBe(true);
      expect(result.dealerId).toMatch(/^DL-\d{5}$/);
      expect(db.insert).toHaveBeenCalled();
      expect(db.update).toHaveBeenCalled();
    });
  });

  describe("getDealerDashboardData", () => {
    it("should fail if unauthorized (no session)", async () => {
      const { auth } = await import("@/utils/auth");
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

      const result = await getDealerDashboardData();
      expect(result.success).toBe(false);
      expect(result.error).toBe("Unauthorized");
    });

    it("should fail if no dealer profile is associated with user", async () => {
      // Mock dealerProfiles check returning empty (profile not found)
      vi.mocked(db.then).mockImplementationOnce((onFulfilled) =>
        onFulfilled([]),
      );

      const result = await getDealerDashboardData();
      expect(result.success).toBe(false);
      expect(result.error).toBe("Dealer profile not found");
    });

    it("should successfully retrieve metrics and leads for dealer", async () => {
      const mockProfile = {
        id: "prof-1",
        userId: "dealer-user-1",
        dealerId: "DL-12345",
        companyName: "Elite Motors",
        website: "https://elite.com",
        commissionRate: 10.0,
      };

      const mockLeads = [
        {
          id: "req-1",
          name: "Alice Jenkins",
          make: "Toyota",
          vehicleModel: "Supra",
          agreedPrice: 50000,
          status: "New",
          isDraft: false,
          source: "DL-12345",
          createdAt: new Date(),
        },
        {
          id: "req-2",
          name: "Bob Builder",
          make: "Nissan",
          vehicleModel: "Skyline",
          agreedPrice: 40000,
          status: "Sourcing",
          isDraft: false,
          source: "DL-12345",
          createdAt: new Date(),
        },
        {
          id: "req-3",
          name: "Charlie Brown",
          make: "Ford",
          vehicleModel: "Mustang",
          agreedPrice: 30000,
          status: "Shipped",
          isDraft: false,
          source: "DL-12345",
          createdAt: new Date(),
        },
      ];

      // 1st then: dealerProfiles select
      // 2nd then: requests select
      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockProfile]))
        .mockImplementationOnce((onFulfilled) => onFulfilled(mockLeads));

      const result = await getDealerDashboardData();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.profile?.dealerId).toBe("DL-12345");
        expect(result.profile?.companyName).toBe("Elite Motors");
        expect(result.stats?.activeLeadsCount).toBe(2); // New and Sourcing
        expect(result.stats?.vehiclesSourcingCount).toBe(1); // Sourcing
        expect(result.stats?.successfullyShippedCount).toBe(1); // Shipped
        expect(result.stats?.estimatedCommission).toBe(12000); // 10% of 50k + 40k + 30k = 12k
        expect(result.leads?.length).toBe(3);
      }
    });
  });
});
