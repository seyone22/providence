// @/actions/request-actions.ts
"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import mongoose from "mongoose";
import { emailService } from "@/lib/email";

export async function submitCarRequest(data: {
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
    // S2S Tracking Fields
    gclid?: string;
    fbclid?: string;
    fbc?: string;
    fbp?: string;
}) {
    try {
        await connectToDatabase();

        // 1. Logic to assign a 'Sales' member round-robin (alphabetically)
        const db = mongoose.connection.db;
        let assignedAgent = null;

        if (db) {
            const UserCollection = db.collection("user");

            // Fetch all users with the role 'Sales', sorted alphabetically by name
            const staffMembers = await UserCollection.find({ role: "Sales" })
                .sort({ name: 1 })
                .toArray();

            if (staffMembers.length > 0) {
                // Fetch the most recently created request
                const lastRequest = await Request.findOne(
                    {},
                    {},
                    { sort: { createdAt: -1 } } // Assumes timestamps are enabled on your Request schema
                ).lean();

                if (!lastRequest || !lastRequest.assignedToId) {
                    // If there are no existing leads, start with the first person on the list
                    assignedAgent = staffMembers[0];
                } else {
                    // Find where the last assigned agent sits in our alphabetical list
                    const lastAgentIndex = staffMembers.findIndex(
                        (staff) => staff._id.toString() === lastRequest.assignedToId.toString()
                    );

                    // Calculate the next index. If the last agent isn't found, start at 0.
                    const nextIndex = lastAgentIndex >= 0 ? (lastAgentIndex + 1) % staffMembers.length : 0;

                    assignedAgent = staffMembers[nextIndex];
                }
            } else {
                // Fallback: If no staff found, try to find an admin, or just grab the first user
                assignedAgent = await UserCollection.findOne({ role: "admin" }) || await UserCollection.findOne();
            }
        }

        // Standardize the agent data for the DB and frontend return
        const agentData = {
            id: assignedAgent?._id?.toString() || null,
            name: assignedAgent?.name || "Providence Support",
            email: assignedAgent?.email || "info@providenceauto.uk.com",
            image: assignedAgent?.image || "https://pub-0c6552f09f244121ac51914a1f782578.r2.dev/profiles/1775233164832-498582237.jpg"
        };

        // 2. Create the database record, appending the assigned agent's details
        const newRequest = await Request.create({
            ...data,
            assignedToId: agentData.id,
            assignedToName: agentData.name
        });

        const requestId = newRequest._id.toString();

        // 3. Fire off the emails concurrently
        // Now sending the alert directly to the specifically assigned agent's email
        await Promise.allSettled([
            emailService.sendCustomerConfirmation(data.email, {
                userName: data.name,
                make: data.make,
                model: data.vehicle_model,
                requestId: requestId,
                staffName: agentData.name // Note: I swapped "Rakeez" to agentData.name so it's dynamic
            }),
            emailService.sendStaffAlert(agentData.email, data, requestId)
        ]);

        // 4. Return the new structure so the Client Component can render the success screen
        return {
            success: true,
            message: "Request saved successfully!",
            requestId: requestId,
            agent: agentData
        };

    } catch (error: any) {
        console.error("Database Error:", error);
        return {
            success: false,
            message: error.message || "Failed to save request"
        };
    }
}