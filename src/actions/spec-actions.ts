"use server";

import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/mongoose";
import { SpecDossier } from "@/models/SpecDossier";

/**
 * SAVE / UPSERT DOSSIER TEMPLATE
 * Handles creating new templates and updating existing ones based on _id.
 */
export async function saveSpecDossier(payload: any) {
    try {
        await connectToDatabase();

        let savedDossier;

        if (payload._id) {
            // If an ID exists, update the existing template
            savedDossier = await SpecDossier.findByIdAndUpdate(
                payload._id,
                { $set: payload },
                {
                    new: true,
                    runValidators: true,
                }
            );
        } else {
            // If no ID exists, create a brand new template
            savedDossier = await SpecDossier.create(payload);
        }

        revalidatePath("/admin/dossiers");
        revalidatePath("/admin/specs");

        return {
            success: true,
            message: "Template synchronized successfully.",
            data: JSON.parse(JSON.stringify(savedDossier))
        };
    } catch (error: any) {
        console.error("Save Error:", error);
        return {
            success: false,
            message: "Failed to save template."
        };
    }
}

/**
 * GET SINGLE DOSSIER BY ID
 */
export async function getSpecDossierById(id: any) {
    const actionName = "[getSpecDossierById]";
    try {
        await connectToDatabase();
        const dossier = await SpecDossier.findById(id);

        if (!dossier) {
            return { success: false, message: "Template not found." };
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(dossier))
        };
    } catch (error) {
        console.error(`${actionName} Error:`, error);
        return { success: false, message: "Error fetching template." };
    }
}

/**
 * GET ALL DOSSIERS
 */
export async function getAllSpecDossiers() {
    const actionName = "[getAllSpecDossiers]";
    const startTime = Date.now();
    console.log(`${actionName} INITIATION: Starting request to fetch all spec dossiers...`);

    try {
        // Step 1: Database Connection
        console.log(`${actionName} STEP 1: Attempting to connect to the database...`);
        await connectToDatabase();
        console.log(`${actionName} STEP 1 COMPLETE: Database connection established successfully.`);

        // Step 2: Query Execution
        console.log(`${actionName} STEP 2: Executing find() query on SpecDossier collection...`);
        const dossiers = await SpecDossier.find({}).sort({ createdAt: -1 });
        console.log(`${actionName} STEP 2 COMPLETE: Query successful. Found ${dossiers?.length || 0} template(s).`);

        // Step 3: Payload Parsing and Return
        console.log(`${actionName} STEP 3: Parsing payload for client...`);
        const parsedData = JSON.parse(JSON.stringify(dossiers));

        const executionTime = Date.now() - startTime;
        console.log(`${actionName} SUCCESS: Returning data payload. Total execution time: ${executionTime}ms.`);

        return {
            success: true,
            data: parsedData
        };

    } catch (error) {
        const executionTime = Date.now() - startTime;

        // Detailed Error Logging
        console.error(`${actionName} ERROR: Action failed after ${executionTime}ms.`);

        if (error instanceof Error) {
            console.error(`${actionName} Error Message:`, error.message);
            console.error(`${actionName} Stack Trace:`, error.stack);
        } else {
            console.error(`${actionName} Unknown Error:`, error);
        }

        return {
            success: false,
            message: "Error fetching templates."
        };
    }
}

/**
 * UPDATE STATUS (Quick Action)
 * Useful for switching between 'Draft', 'Active', 'Archived' without sending the whole payload.
 */
export async function updateDossierStatus(id: string, status: string) {
    try {
        await connectToDatabase();
        await SpecDossier.findByIdAndUpdate(id, { $set: { status } });

        revalidatePath("/admin/dossiers");
        return { success: true, message: `Status updated to ${status}` };
    } catch (error) {
        return { success: false, message: "Failed to update status." };
    }
}

/**
 * DELETE DOSSIER
 */
export async function deleteSpecDossier(id: string) {
    try {
        await connectToDatabase();
        const result = await SpecDossier.findByIdAndDelete(id);

        if (!result) return { success: false, message: "Template not found." };

        revalidatePath("/admin/dossiers");
        revalidatePath("/admin/specs");

        return { success: true, message: "Template deleted successfully." };
    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false, message: "Error deleting template." };
    }
}