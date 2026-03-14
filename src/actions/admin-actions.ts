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

        const updatePayload: any = { status };

        // Handle dynamically pushing new documents to the array
        if (additionalData?.documents && additionalData.documents.length > 0) {
            updatePayload.$push = { documents: { $each: additionalData.documents } };
            delete additionalData.documents; // Remove from root payload
        }

        // Merge any remaining scalar fields (agreedPrice, invoiceNumber, etc.)
        Object.assign(updatePayload, additionalData);

        await Request.findByIdAndUpdate(id, updatePayload);
        revalidatePath("/admin");

        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, message: error instanceof Error ? error.message : "Failed to update status" };
    }
}

export async function getUsers() {
    try {
        // 1. Authenticate and Authorize using your existing helper
        await requireAuth();
        await connectToDatabase();

        // 2. Fetch users directly from the Better Auth 'user' collection
        // Note: Better Auth might use 'createdAt' as a Date object or string depending on your setup.
        const dbUsers = await mongoose.connection.db?.collection('user')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        // 3. Map the database result to match the Client Component's expected User type
        const users = (dbUsers || []).map((user: any) => ({
            id: user._id.toString(),
            name: user.name || "Unknown User",
            email: user.email,
            // If your Better Auth schema doesn't have role/status yet, we provide safe fallbacks
            role: user.role || "User",
            status: user.status || "Active",
        }));

        return users;

    } catch (error) {
        console.error("Error fetching users:", error);
        // Returning an empty array here ensures your dashboard table just shows "No users found" instead of crashing the whole page
        return [];
    }
}

export async function createAdminUser(data: { name: string; email: string; role: string }) {
    try {
        await requireAuth();
        await connectToDatabase();

        // Check if user already exists
        const existingUser = await mongoose.connection.db?.collection('user').findOne({ email: data.email });
        if (existingUser) {
            return { success: false, message: "A user with this email already exists." };
        }

        // Generate a random placeholder password (they will reset it)
        const placeholderPassword = Math.random().toString(36).slice(-12) + "A1!";

        // Use Better Auth's internal API to create the user properly (hashes password, etc.)
        // Note: We use auth.api directly on the server
        const newUser = await auth.api.signUpEmail({
            body: {
                name: data.name,
                email: data.email,
                password: placeholderPassword,
            } as any
        });

        // If you have a custom 'role' field, update the newly created record
        if (newUser && newUser.user) {
            await mongoose.connection.db?.collection('user').updateOne(
                { email: data.email },
                { $set: { role: data.role, status: "Active" } }
            );
        }

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to create user:", error);
        return { success: false, message: error instanceof Error ? error.message : "Failed to create user." };
    }
}

// --- DELETE USER ---
export async function deleteAdminUser(userId: string) {
    try {
        await requireAuth();
        await connectToDatabase();

        // Better Auth might use string IDs or ObjectIds depending on your config.
        // If your IDs are ObjectIds, wrap userId in `new mongoose.Types.ObjectId(userId)`
        const query = { _id: userId }; // Adjust if using ObjectId

        // Cascade delete: Remove user, their accounts, and active sessions
        await mongoose.connection.db?.collection('user').deleteOne(query as any);
        await mongoose.connection.db?.collection('account').deleteMany({ userId });
        await mongoose.connection.db?.collection('session').deleteMany({ userId });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { success: false, message: "Failed to delete user." };
    }
}

// --- RESET PASSWORD ---
export async function sendPasswordResetAdmin(email: string) {
    try {
        await requireAuth();

        // Trigger Better Auth's forget password flow
        await auth.api.changePassword({
            body: {
                email,
                redirectTo: "/auth/reset-password", // Change this to your actual reset UI route
            } as any
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send reset link:", error);
        return { success: false, message: "Failed to send reset link." };
    }
}