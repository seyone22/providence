// @/actions/tracking.ts
"use server";

import { emailService } from "@/lib/email";
import { db, requests, specDossiers } from "@/db";
import { eq, and } from "drizzle-orm";

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

export async function markLeadAsQualified(requestId: string) {
  try {
    // Find the request and update it.
    const [updatedRequest] = await db
      .update(requests)
      .set({ leadStatus: "Qualified" })
      .where(eq(requests.id, requestId))
      .returning();

    if (updatedRequest) {
      console.log(
        `[TRACKING] Request ${requestId} marked as Qualified via contact click.`,
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
    // We only update IF the status is still 'Unqualified'.
    await db
      .update(requests)
      .set({ leadStatus: "Opened" })
      .where(
        and(eq(requests.id, requestId), eq(requests.leadStatus, "Unqualified")),
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
