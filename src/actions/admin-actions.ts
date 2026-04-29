"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import { revalidatePath } from "next/cache";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { emailService } from "@/lib/email";
import { ObjectId } from "bson";

// Import the S2S conversion libraries you created earlier
import { sendMetaConversion, sendGoogleConversion } from "@/lib/conversions";

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

export async function getStaffUsers() {
    try {
        await requireAuth();
        await connectToDatabase();

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

export async function updateRequestStatus(id: string, targetStage: string, payload: any) {
    try {
        // 1. Get the current user to track WHO made the change
        const session = await requireAuth();
        const currentUser = session.user?.name || "System Admin";

        await connectToDatabase();

        const existingRequest = await Request.findById(id);
        if (!existingRequest) {
            throw new Error("Lead not found in the database.");
        }

        const updateData: any = {
            ...payload,
            status: targetStage
        };

        // 2. Prepare History Logging
        const historyPush: any = {};

        // Check if Pipeline Stage Changed
        if (targetStage !== existingRequest.status) {
            historyPush.statusHistory = {
                action: `Moved to Pipeline Stage: ${targetStage}`,
                performedBy: currentUser,
                date: new Date()
            };
        }

        // Check if Sales Status Changed
        if (payload.leadStatus && payload.leadStatus !== existingRequest.leadStatus) {
            updateData.statusUpdatedAt = new Date();

            // If we are already pushing a pipeline change, format it as an array to push both,
            // otherwise just push the sales status. For simplicity, we'll log the sales status update.
            historyPush.statusHistory = {
                action: `Updated Sales Status: ${payload.leadStatus}`,
                performedBy: currentUser,
                date: new Date()
            };
        }

        // 3. Smart Appending for Admin Notes
        if (payload.adminNotes && payload.adminNotes.trim() !== "") {
            const existingNotes = existingRequest.adminNotes || "";
            const newNoteEntry = `[Note added by ${currentUser}]\n${payload.adminNotes.trim()}`;
            updateData.adminNotes = existingNotes ? `${existingNotes}\n\n${newNoteEntry}` : newNoteEntry;
        } else {
            delete updateData.adminNotes;
        }

        // 4. Smart Appending for Documents
        if (payload.documents && payload.documents.length > 0) {
            const existingDocs = existingRequest.documents || [];
            updateData.documents = [...existingDocs, ...payload.documents];
        }

        // 5. Execute Update (Merge normal updates with the history $push)
        const finalQuery = Object.keys(historyPush).length > 0
            ? { $set: updateData, $push: historyPush }
            : { $set: updateData };

        // We use updating with $set and $push to cleanly add to the array
        const updatedRequest = await Request.findByIdAndUpdate(id, finalQuery, { new: true });

        // 6. --- S2S CONVERSION TRIGGERS ---
        if (updatedRequest) {
            const prevStatus = existingRequest.leadStatus || "Unqualified";
            const newStatus = updatedRequest.leadStatus || "Unqualified";

            const wasQualified = prevStatus.toLowerCase().includes('qualified') || prevStatus.toLowerCase().includes('sql');
            const isQualified = newStatus.toLowerCase().includes('qualified') || newStatus.toLowerCase().includes('sql');

            const wasClosed = prevStatus.toLowerCase().includes('closed') || prevStatus.toLowerCase().includes('won');
            const isClosed = newStatus.toLowerCase().includes('closed') || newStatus.toLowerCase().includes('won');

            if (isQualified && !wasQualified) {
                await Promise.allSettled([
                    sendMetaConversion(updatedRequest, 'QualifiedLead'),
                    sendGoogleConversion(updatedRequest)
                ]);
            }

            if (isClosed && !wasClosed) {
                await Promise.allSettled([
                    sendMetaConversion(updatedRequest, 'Purchase')
                ]);
            }
        }

        revalidatePath("/admin/dashboard");
        revalidatePath("/admin");

        return { success: true };

    } catch (error) {
        console.error("Failed to update request status:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to update lead status.");
    }
}

export async function getUsers() {
    try {
        await requireAuth();
        await connectToDatabase();

        const dbUsers = await mongoose.connection.db?.collection('user')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        const users = (dbUsers || []).map((user: any) => ({
            id: user._id.toString(),
            name: user.name || "Unknown User",
            email: user.email,
            role: user.role || "User",
            status: user.status || "Active",
        }));

        return users;

    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function createAdminUser(data: { name: string; email: string; role: string }) {
    try {
        await requireAuth();
        await connectToDatabase();

        const existingUser = await mongoose.connection.db?.collection('user').findOne({ email: data.email });
        if (existingUser) {
            return { success: false, message: "A user with this email already exists." };
        }

        const placeholderPassword = Math.random().toString(36).slice(-12) + "A1!";

        const newUser = await auth.api.signUpEmail({
            body: {
                name: data.name,
                email: data.email,
                password: placeholderPassword,
            } as any
        });

        if (newUser && newUser.user) {
            await mongoose.connection.db?.collection('user').updateOne(
                { email: data.email },
                { $set: { role: data.role, status: "Active" } }
            );

            await emailService.sendAdminInvitation(data.email, {
                name: data.name,
                role: data.role,
                password: placeholderPassword
            });
        }

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to create user:", error);
        return { success: false, message: error instanceof Error ? error.message : "Failed to create user." };
    }
}

export async function sendPasswordResetAdmin(email: string) {
    try {
        await requireAuth();

        await auth.api.requestPasswordReset({
            body: {
                email,
                redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send reset link:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to send reset link."
        };
    }
}

export async function updateAdminUser(userId: string, data: { name: string; email: string; role: string }) {
    try {
        await requireAuth();
        await connectToDatabase();

        let targetId: any = userId;
        try {
            targetId = new ObjectId(userId);
        } catch {
            targetId = userId;
        }

        const query = { _id: targetId };

        const emailExists = await mongoose.connection.db?.collection('user').findOne({
            email: data.email,
            _id: { $ne: targetId } as any
        });

        if (emailExists) {
            return { success: false, message: "This email is already taken by another user." };
        }

        const updateResult = await mongoose.connection.db?.collection('user').updateOne(
            query,
            {
                $set: {
                    name: data.name,
                    email: data.email,
                    role: data.role
                }
            }
        );

        if (updateResult?.matchedCount === 0) {
            return { success: false, message: "User not found in the database. No changes applied." };
        }

        await mongoose.connection.db?.collection('session').deleteMany({ userId });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to update user:", error);
        return { success: false, message: error instanceof Error ? error.message : "Failed to update user profile." };
    }
}

export async function deleteAdminUser(userId: string) {
    try {
        await requireAuth();
        await connectToDatabase();

        let targetId: any = userId;
        try {
            targetId = new ObjectId(userId);
        } catch {
            targetId = userId;
        }

        const query = { _id: targetId };

        const userDeleted = await mongoose.connection.db?.collection('user').deleteOne(query);

        if (userDeleted?.deletedCount === 0) {
            return { success: false, message: "User was not found in the database to delete." };
        }

        await mongoose.connection.db?.collection('account').deleteMany({ userId });
        await mongoose.connection.db?.collection('session').deleteMany({ userId });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { success: false, message: "Failed to delete user." };
    }
}