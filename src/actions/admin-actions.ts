"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import { revalidatePath } from "next/cache";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import mongoose from "mongoose";

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
        await requireAuth();
        await connectToDatabase();

        const requests = await Request.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(requests));
    } catch (error) {
        console.error("Failed to fetch requests:", error);
        return [];
    }
}

// NEW: Fetch staff users directly from the Better Auth database
export async function getStaffUsers() {
    try {
        await requireAuth();
        await connectToDatabase();

        // Better Auth stores its users in the 'user' collection
        const users = await mongoose.connection.db?.collection('user').find({}).toArray();

        return (users || []).map((u: any) => ({
            id: u._id.toString(),
            name: u.name,
            email: u.email
        }));
    } catch (error) {
        console.error("Failed to fetch staff:", error);
        return [];
    }
}

export async function deleteRequest(id: string) {
    try {
        await requireAuth();
        await connectToDatabase();

        await Request.findByIdAndDelete(id);
        revalidatePath("/admin");

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
        await requireAuth();
        await connectToDatabase();

        await Request.findByIdAndUpdate(id, { status, ...additionalData });
        revalidatePath("/admin");

        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to update status"
        };
    }
}