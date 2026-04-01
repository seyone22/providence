"use server";

import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/mongoose";
import SpecDossier from "@/models/SpecDossier";

/**
 * SAVE / UPSERT DOSSIER
 * Handles both creating new records and updating existing ones based on VIN.
 */
export async function saveSpecDossier(payload: any) {
    try {
        await connectToDatabase();

        if (!payload.vin || payload.vin.trim() === "") {
            return { success: false, message: "VIN / Chassis Number is required." };
        }

        // use findOneAndUpdate with upsert: true to handle both create/update in one DB hit
        const savedDossier = await SpecDossier.findOneAndUpdate(
            { vin: payload.vin },
            { $set: payload },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        revalidatePath("/admin/dossiers");
        revalidatePath("/admin/specs");

        return {
            success: true,
            message: "Dossier synchronized successfully.",
            data: JSON.parse(JSON.stringify(savedDossier))
        };
    } catch (error: any) {
        console.error("Save Error:", error);
        return {
            success: false,
            message: error.code === 11000 ? "Conflict: VIN already exists." : "Failed to save dossier."
        };
    }
}

/**
 * GET SINGLE DOSSIER
 */
export async function getSpecDossierByVin(vin: string) {
    try {
        await connectToDatabase();
        const dossier = await SpecDossier.findOne({ vin });

        if (!dossier) return { success: false, message: "Dossier not found." };

        return {
            success: true,
            data: JSON.parse(JSON.stringify(dossier))
        };
    } catch (error) {
        return { success: false, message: "Error fetching dossier." };
    }
}

/**
 * GET ALL DOSSIERS
 */
export async function getAllSpecDossiers() {
    try {
        await connectToDatabase();
        const dossiers = await SpecDossier.find({}).sort({ createdAt: -1 });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(dossiers))
        };
    } catch (error) {
        return { success: false, message: "Error fetching dossiers." };
    }
}

/**
 * UPDATE STATUS (Quick Action)
 * Useful for switching between 'Draft', 'Published', 'Sold' without sending the whole payload.
 */
export async function updateDossierStatus(vin: string, status: string) {
    try {
        await connectToDatabase();
        await SpecDossier.updateOne({ vin }, { $set: { status } });

        revalidatePath("/admin/dossiers");
        return { success: true, message: `Status updated to ${status}` };
    } catch (error) {
        return { success: false, message: "Failed to update status." };
    }
}

/**
 * DELETE DOSSIER
 */
export async function deleteSpecDossier(vin: string) {
    try {
        await connectToDatabase();
        const result = await SpecDossier.findOneAndDelete({ vin });

        if (!result) return { success: false, message: "Dossier not found." };

        revalidatePath("/admin/dossiers");
        revalidatePath("/admin/specs");

        return { success: true, message: "Dossier deleted successfully." };
    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false, message: "Error deleting dossier." };
    }
}