import { type NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SocialPost from "@/models/SocialPost";

// PUT /api/social-posts/reorder  { orderedIds: string[] }
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { orderedIds } = await req.json();

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "orderedIds array is required" },
        { status: 400 },
      );
    }

    // Bulk update each post's order based on its position in the array
    const bulkOps = orderedIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    await SocialPost.bulkWrite(bulkOps);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/social-posts/reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder posts" },
      { status: 500 },
    );
  }
}
