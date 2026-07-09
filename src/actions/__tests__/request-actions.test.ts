import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitCarRequest, submitContactPreferences } from "../request-actions";
import { db, requests, users } from "@/db";
import { emailService } from "@/lib/email";

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
    requests: { id: "requests_id_col", assignmentMethod: "requests_assignmentMethod_col", createdAt: "requests_createdAt_col" },
    users: { id: "users_id_col", role: "users_role_col", name: "users_name_col", isBanned: "users_is_banned_col" },
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
      const mockAgent = { id: "agent-123", name: "John Doe", role: "Sales", isBanned: false };
      const mockResultRequest = { id: "new-req-id" };

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockAgent]))     // users select
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockResultRequest])); // requests insert

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
      expect(result.agent.id).toBe("agent-123");
      expect(result.agent.name).toBe("John Doe");
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
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockResultRequest])); // request insert

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
      expect(result.agent.id).toBe("sales-2");
      expect(result.agent.name).toBe("Bob");
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
