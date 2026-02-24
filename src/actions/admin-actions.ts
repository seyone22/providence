"use server";

import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";

export async function getRequests() {
    try {
        await connectToDatabase();

        // Fetch all requests, sort by newest first, and convert to plain JavaScript objects (.lean())
        const requests = await Request.find({}).sort({ createdAt: -1 }).lean();

        // Next.js requires plain objects to be passed from Server to Client components.
        // JSON parse/stringify is a quick way to sanitize MongoDB ObjectIDs and Dates.
        return JSON.parse(JSON.stringify(requests));
    } catch (error) {
        console.error("Failed to fetch requests:", error);
        return [];
    }
}