"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import { emailService } from "@/lib/email";

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

        // 1. Create the database record
        const newRequest = await Request.create(data);
        const requestId = newRequest._id.toString();

        // 2. Fire off the emails concurrently (won't block the UI return if it takes a second)
        const staffEmail = "admin@providenceauto.com"; // Hardcoded staff email for now

        await Promise.all([
            emailService.sendCustomerConfirmation(data.email, {
                userName: data.name,
                make: data.make,
                model: data.vehicle_model,
                requestId: requestId
            }),
            emailService.sendStaffAlert(staffEmail, data, requestId)
        ]);

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