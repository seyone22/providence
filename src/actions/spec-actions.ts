"use server";

import {revalidatePath} from "next/cache";
import connectToDatabase from "@/lib/mongoose";
import SpecDossier from "@/models/modelDossier";

export async function saveSpecDossier(payload: any) {
    try {
        await connectToDatabase();

        // Basic Validation: Ensure a VIN is provided
        if (!payload.vin || payload.vin.trim() === "") {
            return {success: false, message: "VIN / Chassis Number is required."};
        }

        // Check if a dossier for this VIN already exists to prevent accidental duplicates
        const existingDossier = await SpecDossier.findOne({vin: payload.vin});

        let savedDossier;

        if (existingDossier) {
            // Update the existing record if the VIN matches
            savedDossier = await SpecDossier.findOneAndUpdate(
                {vin: payload.vin},
                {$set: payload},
                {new: true}
            );
        } else {
            // Create a brand new record
            savedDossier = await SpecDossier.create(payload);
        }

        // Revalidate the page where you might list these dossiers (adjust the path as needed)
        revalidatePath("/admin/inventory");
        revalidatePath("/admin/specs");

        return {
            success: true,
            message: "Dossier saved successfully.",
            data: JSON.parse(JSON.stringify(savedDossier)) // Parse to pass safely from Server to Client
        };

    } catch (error: any) {
        console.error("Failed to save spec dossier:", error);

        // Handle MongoDB unique constraint error specifically
        if (error.code === 11000) {
            return {success: false, message: "A dossier with this VIN already exists."};
        }

        return {
            success: false,
            message: error.message || "An unexpected error occurred while saving."
        };
    }
}