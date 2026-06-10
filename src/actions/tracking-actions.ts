// @/actions/tracking.ts
"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import mongoose from "mongoose";
import {emailService} from "@/lib/email";
import "@/models/SpecDossier"; // CRITICAL: Forces Mongoose to register the SpecDossier model before populating it

export async function getTrackingData(id: string) {
    try {
        console.log(`[TRACKING_FETCH] Initiating fetch for Request ID: ${id}`);
        await connectToDatabase();

        // 1. Fetch the request and populate the multi-select dossier array blocks
        const requestData = await Request.findById(id)
            .populate("dossierIds")
            .lean();

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

                agentData = await UserCollection.findOne({_id: userId});
                console.log(`[TRACKING_FETCH] Agent found for Request ID: ${id} -> ${agentData?.name || 'Unknown'}`);
            }
        } else {
            console.log(`[TRACKING_FETCH] No agent assigned yet for Request ID: ${id}`);
        }

        // 3. Safe deep serialization for populated sub-documents
        const serializedDossiers = requestData.dossierIds
            ? requestData.dossierIds.map((d: any) => ({
                ...d,
                _id: d._id?.toString(),
                createdAt: d.createdAt?.toISOString() || null,
                updatedAt: d.updatedAt?.toISOString() || null,
            }))
            : [];

        // Return a clean, serialized object to the page
        return {
            request: {
                ...requestData,
                _id: requestData._id.toString(),
                assignedToId: requestData.assignedToId?.toString() || null,
                dossierIds: serializedDossiers, // Passes full objects instead of plain IDs
                createdAt: requestData.createdAt?.toISOString() || null,
                updatedAt: requestData.updatedAt?.toISOString() || null,
                eta: requestData.eta?.toISOString() || null,
                statusUpdatedAt: requestData.statusUpdatedAt?.toISOString() || null,
                preferredContactAt: requestData.preferredContactAt?.toISOString() || null,
                followUpAt: requestData.followUpAt?.toISOString() || null,
                followUpSetAt: requestData.followUpSetAt?.toISOString() || null,
                statusHistory: requestData.statusHistory ? requestData.statusHistory.map((h: any) => ({
                    ...h,
                    _id: h._id?.toString(),
                    date: h.date?.toISOString() || null
                })) : []
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
            {leadStatus: 'Qualified'},
            {new: true}
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
            {_id: requestId, leadStatus: 'Unqualified'},
            {leadStatus: 'Opened'}
        );

        console.log(`[TRACKING] Request ${requestId} marked as Opened (First View).`);
    } catch (error) {
        console.error(`[TRACKING] Failed to mark request ${requestId} as Opened:`, error);
    }
}