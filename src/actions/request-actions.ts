"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";

export async function submitCarRequest(data: {
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    make: string;
    vehicle_model: string;
    yearFrom?: number | string;
    yearTo?: number | string;
    budget: string;
    currency: string;
    specs?: string;
}) {
    try {
        // 1. Establish database connection
        await connectToDatabase();

        // 2. Create and save the new document using the Mongoose vehicle_model
        await Request.create(data);

        // Note: We return a simple object. Complex Mongoose documents
        // shouldn't cross the Server Action boundary directly.
        return {
            success: true,
            message: "Request saved successfully!"
        };

    } catch (error: any) {
        console.error("Database Error:", error);
        return {
            success: false,
            message: error.message || "Failed to save request"
        };
    }
}