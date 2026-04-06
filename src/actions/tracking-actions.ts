// @/actions/tracking.ts
"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import mongoose from "mongoose";
import {emailService} from "@/lib/email";

export async function getTrackingData(id: string) {
    try {
        console.log(`[TRACKING_FETCH] Initiating fetch for Request ID: ${id}`);
        await connectToDatabase();

        // 1. Fetch the request
        const requestData = await Request.findById(id).lean();

        if (!requestData) {
            console.warn(`[TRACKING_FETCH] Request ID not found: ${id}`);
            return null;
        }

        let agentData = null;

        // 2. Fetch Agent Details if assignedToId exists
        if (requestData.assignedToId) {
            const db = mongoose.connection.db;
            if (db) {
                const UserCollection = db.collection("user");
                const userId = typeof requestData.assignedToId === 'string'
                    ? new mongoose.Types.ObjectId(requestData.assignedToId)
                    : requestData.assignedToId;

                agentData = await UserCollection.findOne({ _id: userId });
                console.log(`[TRACKING_FETCH] Agent found for Request ID: ${id} -> ${agentData?.name || 'Unknown'}`);
            }
        } else {
            console.log(`[TRACKING_FETCH] No agent assigned yet for Request ID: ${id}`);
        }

        // Return a clean, serialized object to the page
        return {
            request: {
                ...requestData,
                _id: requestData._id.toString(),
                assignedToId: requestData.assignedToId?.toString() || null,
            },
            agent: agentData ? {
                name: agentData.name,
                email: agentData.email,
                image: agentData.image,
                whatsappNumber: agentData.whatsappNumber || "",
            } : null
        };

    } catch (error: any) {
        console.error(`[TRACKING_FETCH] Database Error for ID ${id}:`, error);
        return null;
    }
}

export async function markLeadAsQualified(requestId: string) {
    try {
        await connectToDatabase();

        // Find the request and update it.
        // { new: true } returns the updated document instead of the old one.
        const updatedRequest = await Request.findByIdAndUpdate(
            requestId,
            { leadStatus: 'Qualified' },
            { new: true }
        ).lean();

        if (updatedRequest) {
            console.log(`[TRACKING] Request ${requestId} marked as Qualified via contact click.`);

            // Fire off the internal alert email concurrently
            await emailService.sendLeadQualifiedAlert(updatedRequest, requestId);
        } else {
            console.warn(`[TRACKING] Could not find request ${requestId} to mark as Qualified.`);
        }
    } catch (error) {
        console.error(`[TRACKING] Failed to mark request ${requestId} as Qualified:`, error);
    }
}

export async function markLeadAsOpened(requestId: string) {
    try {
        await connectToDatabase();

        // We use findOneAndUpdate to only update IF the status is still 'Unqualified'.
        // If they already clicked Email/WhatsApp and became 'Qualified', this safely ignores it.
        await Request.findOneAndUpdate(
            { _id: requestId, leadStatus: 'Unqualified' },
            { leadStatus: 'Opened' }
        );

        console.log(`[TRACKING] Request ${requestId} marked as Opened (First View).`);
    } catch (error) {
        console.error(`[TRACKING] Failed to mark request ${requestId} as Opened:`, error);
    }
}