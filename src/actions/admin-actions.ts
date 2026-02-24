"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import {revalidatePath} from "next/cache";

export async function getRequests() {
    try {
        await connectToDatabase();

        // Fetch all requests, sort by newest first, and convert to plain JavaScript objects (.lean())
        const requests = await Request.find({}).sort({ createdAt: -1 }).lean();

        // Next.js requires plain objects to be passed from Server to Client components.
        // JSON parse/stringify is a quick way to sanitize MongoDB ObjectIDs and Dates.
        return JSON.parse(JSON.stringify(requests));
    } catch (error) {
        console.error("Failed to fetch requests:", error);
        return [];
    }
}

export async function deleteRequest(id: string) {
    try {
        await connectToDatabase();
        await Request.findByIdAndDelete(id);
        revalidatePath("/admin"); // Refresh the page data
        return { success: true };
    } catch (error) {
        console.error("Failed to delete request:", error);
        return { success: false, message: "Failed to delete" };
    }
}

export async function updateRequestStatus(id: string, status: string, additionalData?: any) {
    try {
        await connectToDatabase();
        // In a full app, you might save additionalData (like tracking numbers) to the DB schema
        await Request.findByIdAndUpdate(id, { status, ...additionalData });
        revalidatePath("/admin"); // Refresh the page data
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, message: "Failed to update status" };
    }
}