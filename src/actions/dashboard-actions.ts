"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

async function requireAuth() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) throw new Error("Unauthorized");
    return session;
}

export async function getDashboardData() {
    try {
        await requireAuth();
        await connectToDatabase();

        // Fetch all requests - using .lean() for performance since it's read-only
        const requests = await Request.find({}).lean();

        // 1. Calculate Aggregates
        const grossPipeline = requests.reduce((acc, req) => acc + (req.agreedPrice || 0), 0);

        // 2. Format Activity Stream (Flattening the statusHistory array)
        // We map logs to include the target name for the UI
        const activityStream = requests
            .flatMap((req: any) => (req.statusHistory || []).map((h: any) => ({
                id: h._id || Math.random().toString(),
                operator: h.performedBy,
                action: h.action,
                comment: h.comment,
                target: `${req.name} (${req.make} ${req.vehicle_model})`,
                time: h.date,
                type: h.action.includes("Status") ? "status" : "pipeline"
            })))
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, 10);

        // 3. Regional Weights
        const regionalWeights = requests.reduce((acc: any, req: any) => {
            if (!req.countryOfImport) return acc;
            acc[req.countryOfImport] = (acc[req.countryOfImport] || 0) + (req.agreedPrice || 0);
            return acc;
        }, {});

        return {
            success: true,
            data: {
                grossPipeline,
                activityStream,
                regionalWeights,
                rawRequests: requests // You can use this if you need to perform client-side filtering
            }
        };
    } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        return { success: false, message: "Failed to fetch dashboard data" };
    }
}