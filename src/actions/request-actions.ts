"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";

export async function submitCarRequest(data: {
    make: string;
    vehicle_model: string;
    condition: string;
    yearFrom?: number | string;
    yearTo?: number | string;
    mileage?: string;
    specs?: string;
    name: string;
    email: string;
    countryCode: string;
    phone: string;
    countryOfImport: string;
}) {
    try {
        await connectToDatabase();
        await Request.create(data);

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