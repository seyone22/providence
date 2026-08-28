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

// Mock conversion triggers. These resolve to the real success shape, because
// the action only writes its ledger when `result.ok` is true.
vi.mock("@/lib/conversions", () => ({
  sendGoogleConversion: vi
    .fn()
    .mockResolvedValue({ ok: true, eventsReceived: 1, fbtraceId: null }),
  sendMetaConversion: vi
    .fn()
    .mockResolvedValue({ ok: true, eventsReceived: 1, fbtraceId: null }),
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

    // These use the labels the dashboard dropdown actually produces. The
    // previous version of this test used "New" -> "Qualified", neither of
    // which the UI can emit, which is why it stayed green while production
    // uploaded every rejected lead to Meta as a conversion.
    describe("offline conversion uploads", () => {
      const baseLead = {
        id: "req-1",
        notes: "",
        statusHistory: [],
        createdAt: new Date(),
        status: "New",
        metaQualifiedSentAt: null,
        metaPurchaseSentAt: null,
        googleQualifiedSentAt: null,
      };

      /** Prime the select (existing row) and the update's returning() row. */
      function primeDb(existing: object, updated: object) {
        vi.mocked(db.then)
          .mockImplementationOnce((onFulfilled) => onFulfilled([existing]))
          .mockImplementationOnce((onFulfilled) => onFulfilled([updated]));
      }

      const SQL_STATUS = "SQL: Moved to vehicle offering stage";

      it("uploads to both platforms when the team moves a lead to SQL", async () => {
        primeDb(
          { ...baseLead, leadStatus: "Action required" },
          { ...baseLead, leadStatus: SQL_STATUS },
        );

        const result = await updateRequestStatus("req-1", "New", {
          leadStatus: SQL_STATUS,
          salesComment: "Real buyer.",
          dossierIds: [],
        });

        expect(result.success).toBe(true);
        expect(sendMetaConversion).toHaveBeenCalledWith(
          expect.objectContaining({ id: "req-1" }),
          "QualifiedLead",
          expect.anything(),
        );
        expect(sendGoogleConversion).toHaveBeenCalled();
      });

      // The regression this whole change exists for. "Not Qualified" contains
      // the substring "qualified".
      it("uploads NOTHING when the team marks a lead Not Qualified", async () => {
        primeDb(
          { ...baseLead, leadStatus: "Action required" },
          { ...baseLead, leadStatus: "Not Qualified" },
        );

        await updateRequestStatus("req-1", "New", {
          leadStatus: "Not Qualified",
          salesComment: "Tyre kicker.",
          dossierIds: [],
        });

        expect(sendMetaConversion).not.toHaveBeenCalled();
        expect(sendGoogleConversion).not.toHaveBeenCalled();
      });

      it("uploads nothing for Lead Lost", async () => {
        primeDb(
          { ...baseLead, leadStatus: "Active Conversation" },
          { ...baseLead, leadStatus: "Lead Lost" },
        );

        await updateRequestStatus("req-1", "New", {
          leadStatus: "Lead Lost",
          salesComment: "Went elsewhere.",
          dossierIds: [],
        });

        expect(sendMetaConversion).not.toHaveBeenCalled();
        expect(sendGoogleConversion).not.toHaveBeenCalled();
      });

      it("uploads nothing for a lead still in play", async () => {
        primeDb(
          { ...baseLead, leadStatus: "Action required" },
          { ...baseLead, leadStatus: "Active Conversation" },
        );

        await updateRequestStatus("req-1", "New", {
          leadStatus: "Active Conversation",
          salesComment: "Spoke today.",
          dossierIds: [],
        });

        expect(sendMetaConversion).not.toHaveBeenCalled();
        expect(sendGoogleConversion).not.toHaveBeenCalled();
      });

      // Under the old code this lead looked as though it had already
      // converted, so its real qualification was silently dropped.
      it("still uploads a lead rescued from Not Qualified to SQL", async () => {
        primeDb(
          { ...baseLead, leadStatus: "Not Qualified" },
          { ...baseLead, leadStatus: SQL_STATUS },
        );

        await updateRequestStatus("req-1", "New", {
          leadStatus: SQL_STATUS,
          salesComment: "Called back, real budget.",
          dossierIds: [],
        });

        expect(sendMetaConversion).toHaveBeenCalled();
        expect(sendGoogleConversion).toHaveBeenCalled();
      });

      // Without a transition test, the first edit to any historical deal would
      // replay it into a live ad account stamped with today's date.
      it("does not backfill a lead that was already at SQL before this edit", async () => {
        primeDb(
          { ...baseLead, leadStatus: SQL_STATUS },
          { ...baseLead, leadStatus: SQL_STATUS },
        );

        await updateRequestStatus("req-1", "New", {
          leadStatus: SQL_STATUS,
          salesComment: "Just adding a note months later.",
          dossierIds: [],
        });

        expect(sendMetaConversion).not.toHaveBeenCalled();
        expect(sendGoogleConversion).not.toHaveBeenCalled();
      });

      it("does not backfill Purchase for a deal already past the deposit", async () => {
        primeDb(
          { ...baseLead, leadStatus: "Action required", status: "Shipped" },
          {
            ...baseLead,
            leadStatus: "Action required",
            status: "Arrived at Port",
          },
        );

        await updateRequestStatus("req-1", "Arrived at Port", {
          leadStatus: "Action required",
          salesComment: "Docked.",
          dossierIds: [],
        });

        expect(sendMetaConversion).not.toHaveBeenCalled();
      });

      it("does not upload twice for a lead already reported", async () => {
        const alreadySent = {
          ...baseLead,
          leadStatus: SQL_STATUS,
          metaQualifiedSentAt: new Date("2026-08-01"),
          googleQualifiedSentAt: new Date("2026-08-01"),
        };
        primeDb(alreadySent, alreadySent);

        await updateRequestStatus("req-1", "New", {
          leadStatus: SQL_STATUS,
          salesComment: "Adding a note.",
          dossierIds: [],
        });

        expect(sendMetaConversion).not.toHaveBeenCalled();
        expect(sendGoogleConversion).not.toHaveBeenCalled();
      });

      // Purchase comes off the delivery pipeline, not the sales label.
      it("uploads Purchase once the deposit stage is reached", async () => {
        primeDb(
          {
            ...baseLead,
            leadStatus: "Action required",
            status: "Price Agreement",
          },
          {
            ...baseLead,
            leadStatus: "Action required",
            status: "Deposit Collected",
            agreedPrice: 42000,
          },
        );

        await updateRequestStatus("req-1", "Deposit Collected", {
          leadStatus: "Action required",
          salesComment: "Deposit in.",
          dossierIds: [],
        });

        expect(sendMetaConversion).toHaveBeenCalledWith(
          expect.objectContaining({ id: "req-1" }),
          "Purchase",
          expect.objectContaining({ value: 42000, currency: "USD" }),
        );
      });
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
