// @/actions/request-actions.ts
"use server";

import mongoose from "mongoose";
import {
  computePreferredContactAt,
  formatInIST,
  TIME_WINDOWS,
} from "@/lib/contactScheduling";
import { emailService } from "@/lib/email";
import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";

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
      const updated = await Request.findByIdAndUpdate(
        data.id,
        {
          $set: {
            make: data.make,
            vehicle_model: data.vehicle_model,
            condition: data.condition,
            yearFrom: data.yearFrom || undefined,
            yearTo: data.yearTo || undefined,
            mileage: data.mileage,
            specs: data.specs,
            name: data.name,
            email: data.email,
            countryCode: data.countryCode,
            phone: data.phone,
            countryOfImport: data.countryOfImport,
            importTimeline: data.importTimeline || undefined,
          },
        },
        { new: true },
      );

      if (updated) {
        return {
          success: true,
          message: "Request updated successfully!",
          requestId: data.id,
          agent: {
            id: updated.assignedToId?.toString() || null,
            name: updated.assignedToName || "Providence Support",
          },
        };
      }
      // If the id no longer resolves, fall through and create a fresh lead.
    }

    // 1. Assign an agent. A profile-page inquiry carries assignedAgentId and
    //    is pinned directly to that member; everything else rotates through
    //    the Sales team round-robin (alphabetically).
    const db = mongoose.connection.db;
    let assignedAgent = null;
    let assignmentMethod: "direct" | "round-robin" = "round-robin";

    if (db) {
      const UserCollection = db.collection("user");

      // 1a. Direct assignment — only honoured if the id resolves to a real
      //     user whose role can actually own leads. Never trust the client
      //     value blindly; an invalid id silently falls back to round-robin.
      if (
        data.assignedAgentId &&
        mongoose.Types.ObjectId.isValid(data.assignedAgentId)
      ) {
        const directAgent = await UserCollection.findOne({
          _id: new mongoose.Types.ObjectId(data.assignedAgentId),
          role: { $in: ["Sales", "admin"] },
          isBanned: { $ne: true },
        });
        if (directAgent) {
          assignedAgent = directAgent;
          assignmentMethod = "direct";
        }
      }

      if (!assignedAgent) {
        // Fetch all users with the role 'Sales', sorted alphabetically by name
        const staffMembers = await UserCollection.find({ role: "Sales" })
          .sort({ name: 1 })
          .toArray();

        if (staffMembers.length > 0) {
          // Fetch the most recently created round-robin lead. Direct
          // (profile-page) leads are excluded so pinning a lead to one
          // member doesn't advance the shared rotation past them.
          const lastRequest = await Request.findOne(
            { assignmentMethod: { $ne: "direct" } },
            {},
            { sort: { createdAt: -1 } }, // Assumes timestamps are enabled on your Request schema
          ).lean();

          if (!lastRequest || !lastRequest.assignedToId) {
            // If there are no existing leads, start with the first person on the list
            assignedAgent = staffMembers[0];
          } else {
            // Find where the last assigned agent sits in our alphabetical list
            const lastAgentIndex = staffMembers.findIndex(
              (staff) =>
                staff._id.toString() === lastRequest.assignedToId.toString(),
            );

            // Calculate the next index. If the last agent isn't found, start at 0.
            const nextIndex =
              lastAgentIndex >= 0
                ? (lastAgentIndex + 1) % staffMembers.length
                : 0;

            assignedAgent = staffMembers[nextIndex];
          }
        } else {
          // Fallback: If no staff found, try to find an admin, or just grab the first user
          assignedAgent =
            (await UserCollection.findOne({ role: "admin" })) ||
            (await UserCollection.findOne());
        }
      }
    }

    // Standardize the agent data for the DB and frontend return
    const agentData = {
      id: assignedAgent?._id?.toString() || null,
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

    const newRequest = await Request.create({
      ...requestData,
      assignedToId: agentData.id,
      assignedToName: agentData.name,
      assignmentMethod,
      isDraft: true,
    });

    const requestId = newRequest._id.toString();

    // NOTE: No emails are sent at this stage. The lead is recorded and an
    // agent is assigned so the contact-preferences step can show who will
    // handle the inquiry, but both the staff alert and the customer
    // thank-you are deferred until the customer completes the contact
    // preferences step (submitContactPreferences). Leads abandoned before
    // that step won't generate noise for the sales team.

    // Return the structure the Client Component needs to render the
    // contact-preferences step with the assigned agent's details.
    return {
      success: true,
      message: "Request saved successfully!",
      requestId: requestId,
      agent: agentData,
    };
  } catch (error: any) {
    console.error("Database Error:", error);
    return {
      success: false,
      message: error.message || "Failed to save request",
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

    const request = await Request.findById(input.requestId);
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
    request.contactMethods = input.contactMethods;
    request.contactDays = input.contactDays;
    request.contactTimeWindow = input.contactTimeWindow;
    request.contactTimezone = input.contactTimezone;
    request.contactTimezoneLabel = input.contactTimezoneLabel;
    request.preferredContactAt = preferredContactAt;
    request.followUpAt = preferredContactAt;
    request.followUpSetAt = new Date();
    request.isDraft = false; // promote from draft → live lead
    request.statusHistory = request.statusHistory || [];
    request.statusHistory.push({
      action: "Contact preferences submitted",
      performedBy: "Customer (Inquiry Form)",
      date: new Date(),
      comment: `Prefers ${input.contactMethods.join(", ")} · ${input.contactTimeWindow} · ${input.contactDays.join(", ")} — reminder set for ${formatInIST(preferredContactAt)}`,
    });
    await request.save();

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
    if (request.assignedToId && mongoose.connection.db) {
      const user = await mongoose.connection.db
        .collection("user")
        .findOne({ _id: new mongoose.Types.ObjectId(request.assignedToId) });
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
        model: request.vehicle_model,
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
          vehicle_model: request.vehicle_model,
          name: request.name,
          email: request.email,
          countryCode: request.countryCode,
          phone: request.phone,
          countryOfImport: request.countryOfImport,
          importTimeline: request.importTimeline,
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
  } catch (error: any) {
    console.error("Contact Preferences Error:", error);
    return {
      success: false,
      message: error.message || "Failed to save preferences",
    };
  }
}
