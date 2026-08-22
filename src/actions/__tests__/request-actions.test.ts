import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { db as dbClient, requests, users } from "@/db";
import { emailService } from "@/lib/email";
import { submitCarRequest, submitContactPreferences } from "../request-actions";

// The @/db module is fully mocked below; alias the imported client to a
// permissive mock shape so the thenable/query mocks type-check.
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
    query: {
      requests: {
        findFirst: vi.fn(),
      },
      users: {
        findFirst: vi.fn(),
      },
    },
  };
  return {
    db: mockDb,
    requests: {
      id: "requests_id_col",
      assignmentMethod: "requests_assignmentMethod_col",
      createdAt: "requests_createdAt_col",
    },
    users: {
      id: "users_id_col",
      email: "users_email_col",
      role: "users_role_col",
      name: "users_name_col",
      isBanned: "users_is_banned_col",
    },
  };
});

vi.mock("@/lib/email", () => ({
  emailService: {
    sendCustomerConfirmation: vi.fn().mockResolvedValue(true),
    sendStaffAlert: vi.fn().mockResolvedValue(true),
    sendContactScheduledConfirmation: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock("@/lib/mongoose", () => ({
  default: vi.fn().mockResolvedValue(true),
}));

describe("request-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("submitCarRequest", () => {
    it("should assign a specified agent directly if valid", async () => {
      const mockAgent = {
        id: "agent-123",
        name: "John Doe",
        role: "Sales",
        isBanned: false,
      };
      const mockResultRequest = { id: "new-req-id" };

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockAgent])) // users select
        .mockImplementationOnce((onFulfilled) =>
          onFulfilled([mockResultRequest]),
        ); // requests insert

      const result = await submitCarRequest({
        make: "Toyota",
        vehicle_model: "Supra",
        condition: "Used",
        name: "Test Customer",
        email: "customer@test.com",
        countryCode: "GB",
        phone: "+441234567",
        countryOfImport: "Ireland",
        assignedAgentId: "agent-123",
      });

      expect(result.success).toBe(true);
      expect(result.agent?.id).toBe("agent-123");
      expect(result.agent?.name).toBe("John Doe");
    });

    it("should use round-robin assignment alphabetically if no agent is specified", async () => {
      const mockSalesMembers = [
        { id: "sales-1", name: "Alice", role: "Sales" },
        { id: "sales-2", name: "Bob", role: "Sales" },
      ];
      const mockLastRequest = { id: "req-old", assignedToId: "sales-1" };
      const mockResultRequest = { id: "new-req-id" };

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled(mockSalesMembers)) // staff list select
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockLastRequest])) // last request select
        .mockImplementationOnce((onFulfilled) =>
          onFulfilled([mockResultRequest]),
        ); // request insert

      const result = await submitCarRequest({
        make: "Tesla",
        vehicle_model: "Model Y",
        condition: "New",
        name: "Alice Customer",
        email: "customer2@test.com",
        countryCode: "IE",
        phone: "+353123456",
        countryOfImport: "Ireland",
      });

      expect(result.success).toBe(true);
      expect(result.agent?.id).toBe("sales-2");
      expect(result.agent?.name).toBe("Bob");
    });

    it("routes a Cyprus inquiry to the country owner, bypassing the rotation", async () => {
      // Deliberately an admin: the round-robin pool is role "Sales" only, so
      // this is the case country routing exists to cover.
      const mockCountryOwner = {
        id: "shaq-1",
        name: "Shaqeeq Shahiq",
        email: "shaq@providenceauto.uk.com",
        role: "admin",
        isBanned: false,
      };
      const mockResultRequest = { id: "new-req-id" };

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) =>
          onFulfilled([mockCountryOwner]),
        ) // country owner select
        .mockImplementationOnce((onFulfilled) =>
          onFulfilled([mockResultRequest]),
        ); // request insert

      const result = await submitCarRequest({
        make: "Toyota",
        vehicle_model: "Land Cruiser",
        condition: "Used",
        name: "Cyprus Customer",
        email: "customer3@test.com",
        countryCode: "CY",
        phone: "+35799123456",
        countryOfImport: "Cyprus",
      });

      expect(result.success).toBe(true);
      expect(result.agent?.id).toBe("shaq-1");
      expect(result.agent?.name).toBe("Shaqeeq Shahiq");
      // Only two queries ran: the owner lookup and the insert. No staff-list
      // or last-request query, i.e. the rotation was skipped entirely.
      expect(db.then).toHaveBeenCalledTimes(2);
    });

    it("matches the country owner regardless of the casing submitted", async () => {
      const mockCountryOwner = {
        id: "shaq-1",
        name: "Shaqeeq Shahiq",
        email: "shaq@providenceauto.uk.com",
        role: "admin",
        isBanned: false,
      };

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) =>
          onFulfilled([mockCountryOwner]),
        )
        .mockImplementationOnce((onFulfilled) => onFulfilled([{ id: "r" }]));

      const result = await submitCarRequest({
        make: "Suzuki",
        vehicle_model: "Swift",
        condition: "New",
        name: "Case Test",
        email: "customer4@test.com",
        countryCode: "CY",
        phone: "+35799000000",
        countryOfImport: "  cYpRuS  ",
      });

      expect(result.agent?.id).toBe("shaq-1");
    });

    it("falls back to the rotation when the country owner cannot be resolved", async () => {
      const mockSalesMembers = [
        { id: "sales-1", name: "Alice", role: "Sales" },
        { id: "sales-2", name: "Bob", role: "Sales" },
      ];

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled([])) // owner lookup misses
        .mockImplementationOnce((onFulfilled) => onFulfilled(mockSalesMembers))
        .mockImplementationOnce((onFulfilled) =>
          onFulfilled([{ id: "req-old", assignedToId: "sales-1" }]),
        )
        .mockImplementationOnce((onFulfilled) => onFulfilled([{ id: "r" }]));

      const result = await submitCarRequest({
        make: "Kia",
        vehicle_model: "Sportage",
        condition: "Used",
        name: "Fallback Customer",
        email: "customer5@test.com",
        countryCode: "CY",
        phone: "+35799222222",
        countryOfImport: "Cyprus",
      });

      expect(result.success).toBe(true);
      expect(result.agent?.id).toBe("sales-2");
    });

    it("lets an explicit profile-page pin win over country routing", async () => {
      const mockAgent = {
        id: "agent-123",
        name: "John Doe",
        role: "Sales",
        isBanned: false,
      };

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockAgent])) // direct lookup
        .mockImplementationOnce((onFulfilled) => onFulfilled([{ id: "r" }]));

      const result = await submitCarRequest({
        make: "Nissan",
        vehicle_model: "Qashqai",
        condition: "Used",
        name: "Profile Customer",
        email: "customer6@test.com",
        countryCode: "CY",
        phone: "+35799333333",
        countryOfImport: "Cyprus",
        assignedAgentId: "agent-123",
      });

      expect(result.agent?.id).toBe("agent-123");
    });
  });

  describe("submitContactPreferences", () => {
    it("should update contact preferences and remove draft status", async () => {
      const mockRequest = {
        id: "req-123",
        assignedToId: "agent-123",
        assignedToName: "John Doe",
        assignedToEmail: "john@doe.com",
        name: "Test Customer",
        email: "customer@test.com",
      };

      const mockAgent = {
        id: "agent-123",
        name: "John Doe",
        email: "john@doe.com",
        whatsappNumber: "+123456",
      };

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockRequest])) // request check select
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockRequest])); // update query

      vi.mocked(db.query.users.findFirst).mockResolvedValue(mockAgent as any);

      const result = await submitContactPreferences({
        requestId: "req-123",
        contactMethods: ["WhatsApp"],
        contactDays: ["Weekday"],
        contactTimeWindow: "Morning",
        contactTimezone: "Europe/London",
      });

      expect(result.success).toBe(true);
      expect(db.update).toHaveBeenCalled();
      expect(emailService.sendContactScheduledConfirmation).toHaveBeenCalled();
      expect(emailService.sendStaffAlert).toHaveBeenCalled();
    });
  });
});
