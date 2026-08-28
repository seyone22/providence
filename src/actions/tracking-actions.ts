// @/actions/tracking.ts
"use server";

import { and, eq, inArray } from "drizzle-orm";
import { db, requests } from "@/db";
import { emailService } from "@/lib/email";
import { isTeamDecidedStatus } from "@/lib/leadConversion";

export async function getTrackingData(id: string) {
  try {
    console.log(`[TRACKING_FETCH] Initiating fetch for Request ID: ${id}`);

    // 1. Fetch the request
    const requestData = await db.query.requests.findFirst({
      where: (requests, { eq }) => eq(requests.id, id),
    });

    if (!requestData) {
      console.warn(`[TRACKING_FETCH] Request ID not found: ${id}`);
      return null;
    }

    let agentData = null;

    // 2. Fetch Agent Details if assignedToId exists
    if (requestData.assignedToId) {
      agentData = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, requestData.assignedToId!),
      });
      console.log(
        `[TRACKING_FETCH] Agent found for Request ID: ${id} -> ${agentData?.name || "Unknown"}`,
      );
    } else {
      console.log(
        `[TRACKING_FETCH] No agent assigned yet for Request ID: ${id}`,
      );
    }

    // 3. Fetch full dossier objects
    const dossiers = requestData.dossierIds?.length
      ? await db.query.specDossiers.findMany({
          where: (specDossiers, { inArray }) =>
            inArray(specDossiers.id, requestData.dossierIds),
        })
      : [];

    const serializedDossiers = dossiers.map((d: any) => ({
      ...d,
      _id: d.id,
      createdAt: d.createdAt?.toISOString() || null,
      updatedAt: d.updatedAt?.toISOString() || null,
    }));

    // Return a clean, serialized object to the page
    return {
      request: {
        ...requestData,
        _id: requestData.id,
        vehicle_model: requestData.vehicleModel,
        dossierIds: serializedDossiers,
        createdAt: requestData.createdAt.toISOString(),
        updatedAt: requestData.updatedAt.toISOString(),
        eta: requestData.eta?.toISOString() || null,
        statusUpdatedAt: requestData.statusUpdatedAt?.toISOString() || null,
        preferredContactAt:
          requestData.preferredContactAt?.toISOString() || null,
        followUpAt: requestData.followUpAt?.toISOString() || null,
        followUpSetAt: requestData.followUpSetAt?.toISOString() || null,
        statusHistory: requestData.statusHistory
          ? (requestData.statusHistory as any[]).map((h: any) => ({
              ...h,
              _id: h.id || h._id || null,
              date: h.date ? new Date(h.date).toISOString() : null,
            }))
          : [],
      },
      agent: agentData
        ? {
            name: agentData.name,
            email: agentData.email,
            image: agentData.image,
            whatsappNumber: agentData.whatsappNumber || "",
          }
        : null,
    };
  } catch (error: any) {
    console.error(`[TRACKING_FETCH] Database Error for ID ${id}:`, error);
    return null;
  }
}

/**
 * The customer clicked through to their agent on the tracking page.
 *
 * This is an *engagement* signal, not a qualification. Two things about it
 * used to be wrong:
 *
 *   1. It wrote the label "Qualified", which is not one of SALES_STATUSES —
 *      so the admin modal's status dropdown had no matching option and
 *      silently reset the lead's status the next time anyone saved it. It now
 *      writes "Active Conversation", which is a real label meaning exactly
 *      this: the customer has made contact.
 *
 *   2. It overwrote whatever the team had already decided. A lead a
 *      salesperson had marked "Not Qualified" flipped straight back to
 *      qualified the moment the customer opened their tracking link — and
 *      under the old substring matcher that also fired a conversion. A status
 *      the team has deliberately set is now left alone.
 *
 * No offline conversion is uploaded from here. Only a label a human on the
 * team chose does that; a click is not a sales qualification.
 */
export async function markLeadAsQualified(requestId: string) {
  try {
    const [existing] = await db
      .select()
      .from(requests)
      .where(eq(requests.id, requestId))
      .limit(1);

    if (existing && isTeamDecidedStatus(existing.leadStatus)) {
      console.log(
        `[TRACKING] Request ${requestId} left at "${existing.leadStatus}" — the team has already decided this lead.`,
      );
      return;
    }

    const [updatedRequest] = await db
      .update(requests)
      .set({ leadStatus: "Active Conversation" })
      .where(eq(requests.id, requestId))
      .returning();

    if (updatedRequest) {
      console.log(
        `[TRACKING] Request ${requestId} marked as Active Conversation via contact click.`,
      );

      // Fire off the internal alert email concurrently
      const mappedRequest = {
        ...updatedRequest,
        _id: updatedRequest.id,
      };
      await emailService.sendLeadQualifiedAlert(
        mappedRequest as any,
        requestId,
      );
    } else {
      console.warn(
        `[TRACKING] Could not find request ${requestId} to mark as Qualified.`,
      );
    }
  } catch (error) {
    console.error(
      `[TRACKING] Failed to mark request ${requestId} as Qualified:`,
      error,
    );
  }
}

export async function markLeadAsOpened(requestId: string) {
  try {
    // Only promote a lead nobody has touched yet. The guard used to test for
    // "Unqualified" alone, which stopped being the column default a long time
    // ago — so it never matched and "Opened" was never set on anything.
    await db
      .update(requests)
      .set({ leadStatus: "Opened" })
      .where(
        and(
          eq(requests.id, requestId),
          inArray(requests.leadStatus, ["Unqualified", "Action required"]),
        ),
      );

    console.log(
      `[TRACKING] Request ${requestId} marked as Opened (First View).`,
    );
  } catch (error) {
    console.error(
      `[TRACKING] Failed to mark request ${requestId} as Opened:`,
      error,
    );
  }
}
