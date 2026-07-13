import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { accounts, db as dbClient, requests, sessions, users } from "@/db";
import { sendGoogleConversion, sendMetaConversion } from "@/lib/conversions";
import { emailService } from "@/lib/email";
import {
  clearFollowUpTimer,
  createAdminUser,
  deleteAdminUser,
  deleteRequest,
  expireFollowUpTimer,
  getRequests,
  setFollowUpTimer,
  updateAdminUser,
  updateRequestStatus,
} from "../admin-actions";

// The @/db module is fully mocked below, but the imported client keeps its real
// Drizzle type. Alias it to a permissive mock shape so the thenable/query mocks
// used in these tests type-check.
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
    limit: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    then: vi.fn((onFulfilled) => onFulfilled([])),
    query: {
      specDossiers: {
        findMany: vi.fn(),
      },
    },
  };
  return {
    db: mockDb,
    requests: {
      id: "req_id_col",
      isDraft: "req_draft_col",
      createdAt: "req_created_col",
    },
    users: {
      id: "user_id_col",
      email: "user_email_col",
      role: "user_role_col",
    },
    sessions: { userId: "session_user_col" },
    accounts: { userId: "account_user_col" },
    specDossiers: { id: "spec_id_col" },
  };
});

// Mock conversion triggers
vi.mock("@/lib/conversions", () => ({
  sendGoogleConversion: vi.fn().mockResolvedValue(true),
  sendMetaConversion: vi.fn().mockResolvedValue(true),
}));

// Mock email service
vi.mock("@/lib/email", () => ({
  emailService: {
    sendAdminInvitation: vi.fn().mockResolvedValue(true),
    sendAccountAlert: vi.fn().mockResolvedValue(true),
  },
}));

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
        user: {
          id: "admin-1",
          name: "Admin User",
          role: "admin",
          email: "admin@test.com",
        },
      }),
      signUpEmail: vi.fn().mockResolvedValue({
        user: { id: "user-new", name: "New Admin", email: "new@admin.com" },
      }),
    },
  },
}));

describe("admin-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRequests", () => {
    it("should delete old drafts and return active requests", async () => {
      const mockRequest = {
        id: "req-1",
        make: "Toyota",
        isDraft: false,
        createdAt: new Date(),
      };

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled([])) // delete query
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockRequest])); // select query

      const result = await getRequests();
      expect(result.length).toBe(1);
      expect(result[0].make).toBe("Toyota");
    });
  });

  describe("deleteRequest", () => {
    it("should delete the request from DB", async () => {
      vi.mocked(db.then).mockImplementationOnce((onFulfilled) =>
        onFulfilled([{ id: "req-1" }]),
      );

      const result = await deleteRequest("req-1");
      expect(result.success).toBe(true);
    });
  });

  describe("updateRequestStatus", () => {
    it("should append note and update request status", async () => {
      const mockRequest = {
        id: "req-1",
        status: "Contacted",
        notes: "",
        statusHistory: [],
        createdAt: new Date(),
      };

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockRequest])) // select existing
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockRequest])); // update query

      const result = await updateRequestStatus("req-1", "Contacted", {
        salesComment: "Called customer.",
        dossierIds: [],
        deliveryCost: 100,
        sourcingCost: 50,
        customPrice: 20000,
      });

      expect(result.success).toBe(true);
    });

    it("should trigger conversion events when status is Qualified", async () => {
      const mockRequestExisting = {
        id: "req-1",
        leadStatus: "New",
        notes: "",
        statusHistory: [],
        createdAt: new Date(),
      };
      const mockRequestUpdated = {
        id: "req-1",
        leadStatus: "Qualified",
        notes: "",
        statusHistory: [],
        createdAt: new Date(),
      };

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) =>
          onFulfilled([mockRequestExisting]),
        )
        .mockImplementationOnce((onFulfilled) =>
          onFulfilled([mockRequestUpdated]),
        );

      const result = await updateRequestStatus("req-1", "ContactedStage", {
        leadStatus: "Qualified",
        salesComment: "Qualified lead.",
        dossierIds: [],
      });

      expect(sendGoogleConversion).toHaveBeenCalled();
      expect(sendMetaConversion).toHaveBeenCalled();
    });
  });

  describe("setFollowUpTimer", () => {
    it("should set follow up timestamp on request", async () => {
      const mockRequest = { id: "req-1" };
      vi.mocked(db.then).mockImplementationOnce((onFulfilled) =>
        onFulfilled([mockRequest]),
      );

      const result = await setFollowUpTimer("req-1", "2026-07-10T12:00:00Z");
      expect(result.success).toBe(true);
    });
  });

  describe("createAdminUser", () => {
    it("should insert user and trigger invite email", async () => {
      const mockUser = { id: "user-new", email: "new@admin.com" };

      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) => onFulfilled([])) // conflict check select
        .mockImplementationOnce((onFulfilled) => onFulfilled([mockUser])); // update query

      const result = await createAdminUser({
        name: "New Admin",
        email: "new@admin.com",
        role: "admin",
      });

      expect(result.success).toBe(true);
      expect(emailService.sendAdminInvitation).toHaveBeenCalled();
    });
  });

  describe("deleteAdminUser", () => {
    it("should delete sessions, accounts, and user", async () => {
      vi.mocked(db.then)
        .mockImplementationOnce((onFulfilled) =>
          onFulfilled([{ id: "session-1" }]),
        ) // sessions delete
        .mockImplementationOnce((onFulfilled) =>
          onFulfilled([{ id: "account-1" }]),
        ) // accounts delete
        .mockImplementationOnce((onFulfilled) =>
          onFulfilled([{ id: "user-old" }]),
        ); // user delete

      const result = await deleteAdminUser("user-old");
      expect(result.success).toBe(true);
    });
  });
});
