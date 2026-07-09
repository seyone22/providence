// @/actions/request-actions.ts
"use server";

import crypto from "node:crypto";
import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";
import { db, requests, users } from "@/db";
import {
  computePreferredContactAt,
  formatInIST,
  TIME_WINDOWS,
} from "@/lib/contactScheduling";
import { emailService } from "@/lib/email";
import connectToDatabase from "@/lib/mongoose";

export async function submitCarRequest(data: {
  // When present, update the existing lead instead of creating a new one
  // (e.g. the customer stepped Back from contact preferences to edit details).
  id?: string;
  make: string;
  vehicle_model: string;
  condition: string;
  yearFrom?: number | string;
  yearTo?: number | string;
  mileage?: string;
  specs?: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  countryOfImport: string;
  importTimeline?: string;
  source?: string;
  // When set, the inquiry came through a sales member's personal profile page
  // (/team/[slug]) and must be assigned directly to that member, bypassing the
  // round-robin rotation. Validated server-side against the Sales/admin role.
  assignedAgentId?: string;
  // S2S Tracking Fields
  gclid?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
}) {
  try {
    await connectToDatabase();

    // 0. Update path — the lead already exists; refresh the vehicle/delivery
    //    fields only. Keep the assigned agent, source and tracking intact.
    if (data.id) {
      const [updated] = await db
        .update(requests)
        .set({
          make: data.make,
          vehicleModel: data.vehicle_model,
          condition: data.condition,
          yearFrom: data.yearFrom ? Number(data.yearFrom) : null,
          yearTo: data.yearTo ? Number(data.yearTo) : null,
          mileage: data.mileage || null,
          specs: data.specs || null,
          name: data.name,
          email: data.email,
          countryCode: data.countryCode,
          phone: data.phone,
          countryOfImport: data.countryOfImport,
          importTimeline: data.importTimeline || null,
          updatedAt: new Date(),
        })
        .where(eq(requests.id, data.id))
        .returning();

      if (updated) {
        return {
          success: true,
          message: "Request updated successfully!",
          requestId: data.id,
          agent: {
            id: updated.assignedToId || null,
            _id: updated.assignedToId || null,
            name: updated.assignedToName || "Providence Support",
          },
        };
      }
      // If the id no longer resolves, fall through and create a fresh lead.
    }

    // 1. Assign an agent. A profile-page inquiry carries assignedAgentId and
    //    is pinned directly to that member; everything else rotates through
    //    the Sales team round-robin (alphabetically).
    let assignedAgent = null;
    let assignmentMethod: "direct" | "round-robin" = "round-robin";

    // 1a. Direct assignment — only honoured if the id resolves to a real
    //     user whose role can actually own leads. Never trust the client
    //     value blindly; an invalid id silently falls back to round-robin.
    if (data.assignedAgentId) {
      const [directAgent] = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.id, data.assignedAgentId),
            inArray(users.role, ["Sales", "admin"]),
            ne(users.isBanned, true),
          ),
        )
        .limit(1);

      if (directAgent) {
        assignedAgent = {
          ...directAgent,
          _id: directAgent.id,
        };
        assignmentMethod = "direct";
      }
    }

    if (!assignedAgent) {
      // Fetch all users with the role 'Sales', sorted alphabetically by name
      const staffMembers = await db
        .select()
        .from(users)
        .where(eq(users.role, "Sales"))
        .orderBy(asc(users.name));

      const mappedStaffMembers = staffMembers.map((staff) => ({
        ...staff,
        _id: staff.id,
      }));

      if (mappedStaffMembers.length > 0) {
        // Fetch the most recently created round-robin lead. Direct
        // (profile-page) leads are excluded so pinning a lead to one
        // member doesn't advance the shared rotation past them.
        const [lastRequest] = await db
          .select()
          .from(requests)
          .where(ne(requests.assignmentMethod, "direct"))
          .orderBy(desc(requests.createdAt))
          .limit(1);

        if (!lastRequest || !lastRequest.assignedToId) {
          // If there are no existing leads, start with the first person on the list
          assignedAgent = mappedStaffMembers[0];
        } else {
          // Find where the last assigned agent sits in our alphabetical list
          const lastAgentIndex = mappedStaffMembers.findIndex(
            (staff) =>
              staff.id === lastRequest.assignedToId ||
              staff._id === lastRequest.assignedToId,
          );

          // Calculate the next index. If the last agent isn't found, start at 0.
          const nextIndex =
            lastAgentIndex >= 0
              ? (lastAgentIndex + 1) % mappedStaffMembers.length
              : 0;

          assignedAgent = mappedStaffMembers[nextIndex];
        }
      } else {
        // Fallback: If no staff found, try to find an admin, or just grab the first user
        const [adminAgent] = await db
          .select()
          .from(users)
          .where(eq(users.role, "admin"))
          .limit(1);

        let fallbackAgentObj = adminAgent;
        if (!fallbackAgentObj) {
          const [firstUser] = await db.select().from(users).limit(1);
          fallbackAgentObj = firstUser;
        }

        if (fallbackAgentObj) {
          assignedAgent = {
            ...fallbackAgentObj,
            _id: fallbackAgentObj.id,
          };
        }
      }
    }

    // Standardize the agent data for the DB and frontend return
    const agentData = {
      id: assignedAgent?.id || null,
      _id: assignedAgent?.id || null,
      name: assignedAgent?.name || "Providence Support",
      email: assignedAgent?.email || "info@providenceauto.uk.com",
      image:
        assignedAgent?.image ||
        "https://pub-0c6552f09f244121ac51914a1f782578.r2.dev/profiles/1775233164832-498582237.jpg",
    };

    // 2. Create the database record, appending the assigned agent's details.
    //    Marked as a draft until the customer submits contact preferences —
    //    drafts are hidden from the admin pipeline and purged if abandoned.
    // Strip the routing hint before persisting — it's an input, not a
    // Request field (assignmentMethod records the outcome instead).
    const { assignedAgentId: _assignedAgentId, ...requestData } = data;

    const newRequestId = crypto.randomUUID();

    const [newRequest] = await db
      .insert(requests)
      .values({
        id: newRequestId,
        make: requestData.make,
        vehicleModel: requestData.vehicle_model,
        condition: requestData.condition,
        yearFrom: requestData.yearFrom ? Number(requestData.yearFrom) : null,
        yearTo: requestData.yearTo ? Number(requestData.yearTo) : null,
        mileage: requestData.mileage || null,
        specs: requestData.specs || null,
        name: requestData.name,
        email: requestData.email,
        countryCode: requestData.countryCode,
        phone: requestData.phone,
        countryOfImport: requestData.countryOfImport,
        importTimeline: requestData.importTimeline || null,
        source: requestData.source || null,
        gclid: requestData.gclid || null,
        fbclid: requestData.fbclid || null,
        fbc: requestData.fbc || null,
        fbp: requestData.fbp || null,
        assignedToId: agentData.id,
        assignedToName: agentData.name,
        assignmentMethod,
        isDraft: true,
        dossierIds: [],
        contactMethods: [],
        contactDays: [],
        statusHistory: [],
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const requestId = newRequest.id;

    // Return the structure the Client Component needs to render the
    // contact-preferences step with the assigned agent's details.
    return {
      success: true,
      message: "Request saved successfully!",
      requestId: requestId,
      agent: agentData,
    };
  } catch (error) {
    const err = error as Error;
    console.error("Database Error:", err);
    return {
      success: false,
      message: err.message || "Failed to save request",
    };
  }
}

/**
 * Step 3 of the inquiry form. Saves how/when the customer wants to be
 * contacted, computes a concrete reminder instant, sets the follow-up timer,
 * and only now fires the staff alert + the agent-styled customer thank-you.
 */
export async function submitContactPreferences(input: {
  requestId: string;
  contactMethods: string[];
  contactDays: string[];
  contactTimeWindow: string;
  contactTimezone: string;
  contactTimezoneLabel?: string;
}) {
  try {
    await connectToDatabase();

    const [request] = await db
      .select()
      .from(requests)
      .where(eq(requests.id, input.requestId))
      .limit(1);

    if (!request) {
      return { success: false, message: "Inquiry not found" };
    }

    // 1. Compute the concrete instant the customer wants to be reached.
    //    contactTimeWindow may now hold several comma-separated windows
    //    (the customer can pick more than one). Anchor the reminder to the
    //    EARLIEST selected window so we reach out at the start of their
    //    availability rather than letting getWindow() fall back to Morning.
    const earliestWindow =
      TIME_WINDOWS.filter((w) =>
        input.contactTimeWindow.includes(w.label),
      ).sort((a, b) => a.startHour - b.startHour)[0]?.label ||
      input.contactTimeWindow;
    const preferredContactAt = computePreferredContactAt(
      input.contactDays,
      earliestWindow,
      input.contactTimezone,
    );

    // 2. Persist preferences + wire the existing follow-up reminder so the
    //    countdown ring lights up automatically in the dashboard.
    interface StatusHistoryItem {
      id?: string;
      _id?: string;
      action: string;
      performedBy: string;
      date: string;
      comment?: string;
    }
    const currentStatusHistory =
      (request.statusHistory as StatusHistoryItem[]) || [];
    const newHistoryId = crypto.randomUUID();
    const updatedStatusHistory = [
      ...currentStatusHistory,
      {
        id: newHistoryId,
        _id: newHistoryId,
        action: "Contact preferences submitted",
        performedBy: "Customer (Inquiry Form)",
        date: new Date().toISOString(),
        comment: `Prefers ${input.contactMethods.join(", ")} · ${input.contactTimeWindow} · ${input.contactDays.join(", ")} — reminder set for ${formatInIST(preferredContactAt)}`,
      },
    ];

    await db
      .update(requests)
      .set({
        contactMethods: input.contactMethods,
        contactDays: input.contactDays,
        contactTimeWindow: input.contactTimeWindow,
        contactTimezone: input.contactTimezone,
        contactTimezoneLabel: input.contactTimezoneLabel || null,
        preferredContactAt: preferredContactAt,
        followUpAt: preferredContactAt,
        followUpSetAt: new Date(),
        isDraft: false, // promote from draft → live lead
        statusHistory: updatedStatusHistory,
        updatedAt: new Date(),
      })
      .where(eq(requests.id, input.requestId));

    // 3. Resolve the assigned agent for the alert + the from-the-rep email.
    const fallbackAgent = {
      name: "Providence Support",
      email: "info@providenceauto.uk.com",
      image:
        "https://pub-0c6552f09f244121ac51914a1f782578.r2.dev/profiles/1775233164832-498582237.jpg",
      whatsappNumber: "",
    };
    let agent = {
      ...fallbackAgent,
      name: request.assignedToName || fallbackAgent.name,
    };
    const assignedToId = request.assignedToId;
    if (assignedToId) {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, assignedToId),
      });
      if (user) {
        agent = {
          name: user.name || agent.name,
          email: user.email || fallbackAgent.email,
          image: user.image || fallbackAgent.image,
          whatsappNumber: user.whatsappNumber || fallbackAgent.whatsappNumber,
        };
      }
    }

    // 4. Now fire both emails (deferred until this point on purpose).
    await Promise.allSettled([
      emailService.sendContactScheduledConfirmation(request.email, {
        userName: request.name,
        make: request.make,
        model: request.vehicleModel,
        requestId: input.requestId,
        agent,
        contactMethods: input.contactMethods,
        contactDays: input.contactDays,
        contactTimeWindow: input.contactTimeWindow,
        contactTimezoneLabel:
          input.contactTimezoneLabel || input.contactTimezone,
      }),
      emailService.sendStaffAlert(
        agent.email,
        {
          make: request.make,
          vehicle_model: request.vehicleModel,
          name: request.name,
          email: request.email,
          countryCode: request.countryCode,
          phone: request.phone,
          countryOfImport: request.countryOfImport,
          importTimeline: request.importTimeline || undefined,
          contactMethods: input.contactMethods,
          contactDays: input.contactDays,
          contactTimeWindow: input.contactTimeWindow,
          preferredContactIST: formatInIST(preferredContactAt),
          contactTimezoneLabel:
            input.contactTimezoneLabel || input.contactTimezone,
        },
        input.requestId,
      ),
    ]);

    return { success: true, message: "Preferences saved" };
  } catch (error) {
    const err = error as Error;
    console.error("Contact Preferences Error:", err);
    return {
      success: false,
      message: err.message || "Failed to save preferences",
    };
  }
}
