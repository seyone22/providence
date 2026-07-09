import { type NextRequest, NextResponse } from "next/server";
import { db, socialPosts } from "@/db";
import { eq } from "drizzle-orm";

// PUT /api/social-posts/reorder  { orderedIds: string[] }
export async function PUT(req: NextRequest) {
  try {
    const { orderedIds } = await req.json();

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "orderedIds array is required" },
        { status: 400 },
      );
    }

    // Update each post's order based on its position in the array inside a transaction
    await db.transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await tx
          .update(socialPosts)
          .set({ order: i })
          .where(eq(socialPosts.id, orderedIds[i]));
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/social-posts/reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder posts" },
      { status: 500 },
    );
  }
}
