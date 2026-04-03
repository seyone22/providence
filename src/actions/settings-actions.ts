// actions/settings-actions.ts
"use server";

import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { Db, MongoClient, ObjectId } from "mongodb";

export async function updateProfileSettings(data: { name: string; whatsappNumber: string; image?: string }) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session) return { success: false, message: "Unauthorized" };

        // Connect directly to MongoDB to update custom fields if needed,
        // or use Better Auth's updateUser. Direct DB is shown here for safety with custom fields.
        const client = new MongoClient(process.env.MONGODB_URI!);
        const db = client.db('test');

        const updateDoc: any = {
            name: data.name,
            whatsappNumber: data.whatsappNumber,
            updatedAt: new Date(),
        };

        if (data.image) {
            updateDoc.image = data.image;
        }

        await db.collection("user").updateOne(
            { _id: new ObjectId(session.user.id) },
            { $set: updateDoc }
        );

        return { success: true, message: "Profile updated successfully" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update profile" };
    }
}

export async function updatePasswordServer(currentPassword: string, newPassword: string) {
    try {
        // Use Better Auth's native API to handle hashing and validation securely
        const res = await auth.api.changePassword({
            headers: await headers(),
            body: {
                currentPassword,
                newPassword,
                revokeOtherSessions: true // Logs out other devices for security
            }
        });

        return { success: true, message: "Password updated successfully" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to change password" };
    }
}