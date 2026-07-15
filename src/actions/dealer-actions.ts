// @/actions/dealer-actions.ts
"use server";

import crypto from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db, dealerProfiles, requests, users } from "@/db";
import { auth } from "@/utils/auth";

/**
 * Generate a unique dealer ID (e.g. DL-12345)
 */
async function generateUniqueDealerId(): Promise<string> {
  let isUnique = false;
  let dealerId = "";

  while (!isUnique) {
    const num = crypto.randomInt(10000, 99999);
    dealerId = `DL-${num}`;

    const [existing] = await db
      .select()
      .from(dealerProfiles)
      .where(eq(dealerProfiles.dealerId, dealerId))
      .limit(1);

    if (!existing) {
      isUnique = true;
    }
  }

  return dealerId;
}

/**
 * Server action to create a new dealer profile.
 * This also updates the user's role to "dealer".
 */
export async function createDealerProfile(data: {
  userId: string;
  companyName: string;
  website?: string;
}) {
  try {
    // 1. Verify user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, data.userId))
      .limit(1);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // 2. Generate a unique dealerId
    const dealerId = await generateUniqueDealerId();

    // 3. Create the profile
    const profileId = crypto.randomUUID();
    await db.insert(dealerProfiles).values({
      id: profileId,
      userId: data.userId,
      dealerId,
      companyName: data.companyName,
      website: data.website || null,
      commissionRate: 10.0, // default 10% commission
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 4. Update the user role to "dealer"
    await db
      .update(users)
      .set({ role: "dealer" })
      .where(eq(users.id, data.userId));

    return {
      success: true,
      message: "Dealer profile created successfully",
      dealerId,
    };
  } catch (error) {
    const err = error as Error;
    console.error("Create Dealer Profile Error:", err);
    return {
      success: false,
      message: err.message || "Failed to create dealer profile",
    };
  }
}

/**
 * Fetches dashboard details and leads for the currently authenticated dealer.
 */
export async function getDealerDashboardData() {
  try {
    // Get user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Fetch the dealer profile
    const [profile] = await db
      .select()
      .from(dealerProfiles)
      .where(eq(dealerProfiles.userId, userId))
      .limit(1);

    if (!profile) {
      return { success: false, error: "Dealer profile not found" };
    }

    // Fetch all leads associated with this dealer's dealerId
    const dealerLeads = await db
      .select()
      .from(requests)
      .where(eq(requests.source, profile.dealerId))
      .orderBy(desc(requests.createdAt));

    // Calculate metrics
    // Active leads: not draft, and not in finished states (Shipped / Cancelled)
    const activeLeads = dealerLeads.filter(
      (r) => !r.isDraft && r.status !== "Shipped" && r.status !== "Cancelled",
    );

    const vehiclesSourcing = dealerLeads.filter(
      (r) =>
        !r.isDraft && ["Sourcing", "Inspected", "Acquired"].includes(r.status),
    );

    const successfullyShipped = dealerLeads.filter(
      (r) => !r.isDraft && r.status === "Shipped",
    );

    // Calculate commissions (10% of agreed price, fallback to deposit or flat rate if agreedPrice isn't set yet)
    let totalCommission = 0;
    for (const lead of dealerLeads) {
      if (lead.isDraft || lead.status === "Cancelled") continue;

      const price = lead.agreedPrice || lead.totalAmount || 0;
      if (price > 0) {
        // Apply dealer commission rate
        totalCommission += (price * profile.commissionRate) / 100;
      } else if (lead.status === "Shipped") {
        // Fallback flat fee for shipped requests without priced deals
        totalCommission += 500;
      }
    }

    return {
      success: true,
      profile: {
        dealerId: profile.dealerId,
        companyName: profile.companyName,
        website: profile.website,
        commissionRate: profile.commissionRate,
      },
      stats: {
        activeLeadsCount: activeLeads.length,
        vehiclesSourcingCount: vehiclesSourcing.length,
        successfullyShippedCount: successfullyShipped.length,
        estimatedCommission: totalCommission,
      },
      leads: dealerLeads.map((lead) => ({
        id: lead.id,
        name: lead.name,
        make: lead.make,
        vehicleModel: lead.vehicleModel,
        agreedPrice: lead.agreedPrice,
        totalAmount: lead.totalAmount,
        status: lead.status,
        createdAt: lead.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    const err = error as Error;
    console.error("Get Dealer Dashboard Data Error:", err);
    return {
      success: false,
      error: err.message || "Failed to load dashboard data",
    };
  }
}
