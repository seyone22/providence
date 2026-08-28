"use server";

import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { accounts, db, requests, sessions, specDossiers, users } from "@/db";
import { sendGoogleConversion, sendMetaConversion } from "@/lib/conversions";
import { emailService } from "@/lib/email";
import {
  DEAL_CURRENCY,
  hasReachedPurchaseStage,
  leadOutcome,
  PURCHASE_EVENT,
  QUALIFIED_LEAD_EVENT,
} from "@/lib/leadConversion";
import { auth } from "@/utils/auth";

type LeadRow = typeof requests.$inferSelect;

/**
 * Upload whatever this lead has newly earned to Meta and Google Ads, then
 * record what was actually accepted.
 *
 * Two rules govern everything here.
 *
 * **Only the team's label decides.** `leadOutcome` maps each sales label to
 * one of qualified / disqualified / neutral from an exhaustive table. It used
 * to be a substring test — and "Not Qualified" contains "qualified", so every
 * lead the team threw away was uploaded to both platforms as a positive
 * conversion, teaching the ad algorithms to find more just like it.
 *
 * **Only the ledger decides what has already gone.** Whether a lead had been
 * reported used to be inferred from its previous label, which meant a lead
 * moved from "Not Qualified" to SQL looked as though it had already converted
 * and silently sent nothing. The ledger columns are written only when a
 * platform actually accepts the event, so a failed upload is retried on the
 * next save rather than being lost — and Meta performs no server-to-server
 * deduplication, so nothing may ever be sent twice on the strength of a guess.
 *
 * There is deliberately no "disqualified" event. Meta has no negative signal
 * and no way to retract one: the way you tell it a lead was junk is by never
 * sending the positive event in the first place.
 */
async function uploadOfflineConversions(before: LeadRow, after: LeadRow) {
  const wasQualified = leadOutcome(before.leadStatus) === "qualified";
  const isQualified = leadOutcome(after.leadStatus) === "qualified";
  const ledger: Partial<LeadRow> = {};

  if (leadOutcome(after.leadStatus) === "disqualified") {
    console.info(
      `[CONVERSIONS] Lead ${after.id} is "${after.leadStatus}" — nothing uploaded.`,
    );
  }

  // The trigger is the MOMENT of qualification, not the fact of it. Uploading
  // on any save of an already-qualified lead would, the first time anyone
  // edited an old deal, replay months of historical conversions into a live ad
  // account stamped with today's date — misattributing them to today's spend.
  //
  // Note this is an exact comparison of two mapped outcomes, not the substring
  // test it replaced: "Not Qualified" maps to disqualified, so a lead rescued
  // from it to SQL is still a genuine transition and still converts.
  if (isQualified && !wasQualified) {
    const pending: Promise<void>[] = [];

    if (!after.metaQualifiedSentAt) {
      pending.push(
        sendMetaConversion(after, QUALIFIED_LEAD_EVENT, {
          eventId: `${after.id}:qualified`,
        }).then((result) => {
          if (result.ok) ledger.metaQualifiedSentAt = new Date();
        }),
      );
    }

    if (!after.googleQualifiedSentAt) {
      pending.push(
        sendGoogleConversion(after).then((result) => {
          if (result.ok) ledger.googleQualifiedSentAt = new Date();
        }),
      );
    }

    await Promise.allSettled(pending);
  }

  // The purchase signal comes from the delivery pipeline, not the sales label:
  // the customer has paid a deposit. The old code looked for "closed"/"won" in
  // the sales label, which no label contains — so this never fired at all.
  // Same transition rule, for the same reason.
  const reachedPayment =
    hasReachedPurchaseStage(after.status) &&
    !hasReachedPurchaseStage(before.status);

  if (reachedPayment && !after.metaPurchaseSentAt) {
    const value = after.agreedPrice ?? after.totalAmount ?? null;
    const result = await sendMetaConversion(after, PURCHASE_EVENT, {
      eventId: `${after.id}:purchase`,
      value,
      currency: DEAL_CURRENCY,
    });
    if (result.ok) ledger.metaPurchaseSentAt = new Date();
  }

  if (Object.keys(ledger).length > 0) {
    await db.update(requests).set(ledger).where(eq(requests.id, after.id));
  }
}

async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized action. Please sign in.");
  }

  return session;
}

// Drafts (delivery details captured but contact preferences never submitted)
// older than this are considered abandoned and deleted on the next admin load.
const DRAFT_TTL_MS = 30 * 60 * 1000; // 30 minutes

export async function getRequests() {
  try {
    await requireAuth();

    await db
      .delete(requests)
      .where(
        and(
          eq(requests.isDraft, true),
          sql`${requests.createdAt} < ${new Date(Date.now() - DRAFT_TTL_MS)}`,
        ),
      );

    // Added .populate('dossierIds') so details views get full template objects
    const dbRequests = await db
      .select()
      .from(requests)
      .where(ne(requests.isDraft, true))
      .orderBy(desc(requests.createdAt));

    // Get all unique dossierIds
    const allDossierIds = Array.from(
      new Set(dbRequests.flatMap((r) => r.dossierIds || [])),
    );

    let dossierMap: Record<string, any> = {};
    if (allDossierIds.length > 0) {
      const dbDossiers = await db
        .select()
        .from(specDossiers)
        .where(inArray(specDossiers.id, allDossierIds));

      dossierMap = dbDossiers.reduce(
        (acc, d) => {
          acc[d.id] = {
            ...d,
            _id: d.id, // compatibility mapping
          };
          return acc;
        },
        {} as Record<string, any>,
      );
    }

    const populatedRequests = dbRequests.map((r) => {
      const populatedDossiers = (r.dossierIds || [])
        .map((dId) => dossierMap[dId])
        .filter(Boolean);

      return {
        ...r,
        _id: r.id, // compatibility mapping
        vehicle_model: r.vehicleModel, // compatibility mapping
        dossierIds: populatedDossiers,
      };
    });

    return JSON.parse(JSON.stringify(populatedRequests));
  } catch (error) {
    console.error("Failed to fetch requests:", error);
    return [];
  }
}

export async function getStaffUsers() {
  try {
    await requireAuth();

    const dbUsers = await db.select().from(users);

    return dbUsers.map((u) => ({
      id: u.id,
      _id: u.id, // compatibility mapping
      name: u.name,
      email: u.email,
    }));
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return [];
  }
}

export async function deleteRequest(id: string) {
  try {
    await requireAuth();

    await db.delete(requests).where(eq(requests.id, id));
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete request:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete",
    };
  }
}

export async function updateRequestStatus(
  id: string,
  targetStage: string,
  payload: any,
) {
  try {
    // 1. Get the current user to track WHO made the change
    const session = await requireAuth();
    const currentUser = session.user?.name || "System Admin";

    const [existingRequest] = await db
      .select()
      .from(requests)
      .where(eq(requests.id, id));

    if (!existingRequest) {
      throw new Error("Lead not found in the database.");
    }

    // Extract the sales comment context so it doesn't pollute top-level keys
    const { salesComment = "", ...cleanedPayload } = payload;

    const updateData: any = {
      ...cleanedPayload,
      status: targetStage,
    };

    // Track array entries to insert into history push operations safely
    const historyLogs: any[] = [];

    // Check if Pipeline Stage Changed
    if (targetStage !== existingRequest.status) {
      // Note total dossiers added if any are present in payload
      const count = cleanedPayload.dossierIds?.length || 0;
      const context = count > 0 ? ` (${count} Spec Dossiers Linked)` : "";

      historyLogs.push({
        action: `Moved to Pipeline Stage: ${targetStage}${context}`,
        performedBy: currentUser,
        date: new Date(),
        comment: "",
      });
    }

    // Check if Sales Status is Provided
    if (cleanedPayload.leadStatus) {
      const isStatusChanged =
        cleanedPayload.leadStatus !== existingRequest.leadStatus;
      const hasComment = salesComment.trim() !== "";

      // Trigger update if the status actually changed OR if they are just logging a new comment/follow-up
      if (isStatusChanged || hasComment) {
        updateData.statusUpdatedAt = new Date();

        historyLogs.push({
          // Dynamic action text so your history timeline reads naturally
          action: isStatusChanged
            ? `Updated Sales Status: ${cleanedPayload.leadStatus}`
            : `Status Comment / Update: ${cleanedPayload.leadStatus}`,
          performedBy: currentUser,
          date: new Date(),
          comment: salesComment.trim(),
        });
      }
    }

    // 3. Smart Appending for Admin Notes
    if (cleanedPayload.adminNotes && cleanedPayload.adminNotes.trim() !== "") {
      const existingNotes = existingRequest.adminNotes || "";
      const newNoteEntry = `[Note added by ${currentUser}]\n${cleanedPayload.adminNotes.trim()}`;
      updateData.adminNotes = existingNotes
        ? `${existingNotes}\n\n${newNoteEntry}`
        : newNoteEntry;
    } else {
      delete updateData.adminNotes;
    }

    // 4. Smart Appending for Documents
    if (cleanedPayload.documents && cleanedPayload.documents.length > 0) {
      const existingDocs = (existingRequest.documents as any[]) || [];
      updateData.documents = [...existingDocs, ...cleanedPayload.documents];
    }

    // SMART UNIQUE MERGE FOR DOSSIER IDS
    if (cleanedPayload.dossierIds) {
      const existingDossiers = existingRequest.dossierIds || [];
      const combined = [
        ...existingDossiers.map((d: any) => d._id?.toString() || d.toString()),
        ...cleanedPayload.dossierIds.map((dId: string) => dId.toString()),
      ];
      // Remove duplicates automatically using a native Set
      updateData.dossierIds = Array.from(new Set(combined));
    }

    // 5. Merge status history logs if any exist
    const existingHistory = (existingRequest.statusHistory as any[]) || [];
    if (historyLogs.length > 0) {
      updateData.statusHistory = [...existingHistory, ...historyLogs];
    }

    // Map properties for drizzle safety
    if (updateData.vehicle_model !== undefined) {
      updateData.vehicleModel = updateData.vehicle_model;
      delete updateData.vehicle_model;
    }

    delete updateData.id;
    delete updateData._id;

    // Filter out undefined fields to avoid Drizzle complaining
    for (const key of Object.keys(updateData)) {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    }

    const [updatedRequest] = await db
      .update(requests)
      .set(updateData)
      .where(eq(requests.id, id))
      .returning();

    // 6. --- OFFLINE CONVERSION UPLOADS ---
    //     Driven by the label the team just set, guarded by the ledger.
    if (updatedRequest) {
      try {
        await uploadOfflineConversions(existingRequest, updatedRequest);
      } catch (error) {
        // An ad platform being unreachable must never fail the admin's save.
        console.error(
          `[CONVERSIONS] Upload failed for lead ${updatedRequest.id}:`,
          error,
        );
      }
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to update request status:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update lead status.",
    );
  }
}

export async function setFollowUpTimer(id: string, followUpAt: string) {
  try {
    await requireAuth();

    await db
      .update(requests)
      .set({ followUpAt: new Date(followUpAt), followUpSetAt: new Date() })
      .where(eq(requests.id, id));

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to set follow-up timer:", error);
    return { success: false };
  }
}

export async function clearFollowUpTimer(id: string) {
  try {
    await requireAuth();

    await db
      .update(requests)
      .set({ followUpAt: null, followUpSetAt: null })
      .where(eq(requests.id, id));

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to clear follow-up timer:", error);
    return { success: false };
  }
}

export async function expireFollowUpTimer(id: string) {
  try {
    await requireAuth();

    const [existingRequest] = await db
      .select()
      .from(requests)
      .where(eq(requests.id, id));
    if (!existingRequest) return { success: false };

    const existingHistory = (existingRequest.statusHistory as any[]) || [];
    const newStatusHistory = [
      ...existingHistory,
      {
        action: "Updated Sales Status: Action required",
        performedBy: "System (Follow-up Timer)",
        date: new Date(),
        comment: "Follow up required based on the time set up",
      },
    ];

    await db
      .update(requests)
      .set({
        leadStatus: "Action required",
        statusUpdatedAt: new Date(),
        followUpAt: null,
        followUpSetAt: null,
        statusHistory: newStatusHistory,
      })
      .where(eq(requests.id, id));

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to expire follow-up timer:", error);
    return { success: false };
  }
}

export async function getUsers() {
  try {
    await requireAuth();

    const dbUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));

    const resultUsers = dbUsers.map((user: any) => ({
      id: user.id,
      _id: user.id, // compatibility mapping
      name: user.name || "Unknown User",
      email: user.email,
      role: user.role || "User",
      status: (user.isBanned ? "Inactive" : "Active") as "Inactive" | "Active",
    }));

    return resultUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function createAdminUser(data: {
  name: string;
  email: string;
  role: string;
}) {
  try {
    await requireAuth();

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser) {
      return {
        success: false,
        message: "A user with this email already exists.",
      };
    }

    const placeholderPassword = `${Math.random().toString(36).slice(-12)}A1!`;

    const newUser = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: placeholderPassword,
      } as any,
    });

    if (newUser?.user) {
      await db
        .update(users)
        .set({ role: data.role })
        .where(eq(users.email, data.email));

      await emailService.sendAdminInvitation(data.email, {
        name: data.name,
        role: data.role,
        password: placeholderPassword,
      });
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to create user:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create user.",
    };
  }
}

export async function sendPasswordResetAdmin(email: string) {
  try {
    await requireAuth();

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send reset link:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to send reset link.",
    };
  }
}

export async function updateAdminUser(
  userId: string,
  data: { name: string; email: string; role: string },
) {
  try {
    await requireAuth();

    const [emailExists] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, data.email), ne(users.id, userId)))
      .limit(1);

    if (emailExists) {
      return {
        success: false,
        message: "This email is already taken by another user.",
      };
    }

    const updatedUsers = await db
      .update(users)
      .set({
        name: data.name,
        email: data.email,
        role: data.role,
      })
      .where(eq(users.id, userId))
      .returning();

    if (updatedUsers.length === 0) {
      return {
        success: false,
        message: "User not found in the database. No changes applied.",
      };
    }

    await db.delete(sessions).where(eq(sessions.userId, userId));

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update user profile.",
    };
  }
}

export async function deleteAdminUser(userId: string) {
  try {
    await requireAuth();

    const deletedUsers = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (deletedUsers.length === 0) {
      return {
        success: false,
        message: "User was not found in the database to delete.",
      };
    }

    await db.delete(accounts).where(eq(accounts.userId, userId));
    await db.delete(sessions).where(eq(sessions.userId, userId));

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, message: "Failed to delete user." };
  }
}
