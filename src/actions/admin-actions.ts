"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import { revalidatePath } from "next/cache";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

// Helper function to guard your server actions
async function requireAuth() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized action. Please sign in.");
    }

    return session;
}

export async function getRequests() {
    try {
        await requireAuth(); // Protect endpoint
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
        await requireAuth(); // Protect endpoint
        await connectToDatabase();

        await Request.findByIdAndDelete(id);
        revalidatePath("/admin"); // Refresh the page data

        return { success: true };
    } catch (error) {
        console.error("Failed to delete request:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete"
        };
    }
}

export async function updateRequestStatus(id: string, status: string, additionalData?: any) {
    try {
        await requireAuth(); // Protect endpoint
        await connectToDatabase();

        // Update the status and spread any additional contextual data (tracking numbers, garage notes, etc.)
        await Request.findByIdAndUpdate(id, { status, ...additionalData });
        revalidatePath("/admin"); // Refresh the page data

        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to update status"
        };
    }
}