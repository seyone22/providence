"use server";

import { headers } from "next/headers";
import { db, requests } from "@/db";
import { auth } from "@/utils/auth";
import { ne } from "drizzle-orm";

async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function getDashboardData() {
  try {
    await requireAuth();

    // Fetch all requests excluding drafts
    const rawRequests = await db.query.requests.findMany({
      where: (requests, { ne }) => ne(requests.isDraft, true),
    });

    const mappedRequests = rawRequests.map((req) => ({
      ...req,
      _id: req.id, // backward compatibility
    }));

    // 1. Calculate Aggregates
    const grossPipeline = mappedRequests.reduce(
      (acc, req) => acc + (req.agreedPrice || 0),
      0,
    );

    // 2. Format Activity Stream (Flattening the statusHistory array)
    const activityStream = mappedRequests
      .flatMap((req: any) =>
        (req.statusHistory || []).map((h: any) => ({
          id: h._id || h.id || Math.random().toString(),
          operator: h.performedBy,
          action: h.action,
          comment: h.comment,
          target: `${req.name} (${req.make} ${req.vehicleModel})`,
          time: h.date,
          type: h.action.includes("Status") ? "status" : "pipeline",
        })),
      )
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    // 3. Regional Weights
    const regionalWeights = mappedRequests.reduce((acc: any, req: any) => {
      if (!req.countryOfImport) return acc;
      acc[req.countryOfImport] =
        (acc[req.countryOfImport] || 0) + (req.agreedPrice || 0);
      return acc;
    }, {});

    return {
      success: true,
      data: {
        grossPipeline,
        activityStream,
        regionalWeights,
        rawRequests: mappedRequests,
      },
    };
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return { success: false, message: "Failed to fetch dashboard data" };
  }
}
