import { type NextRequest, NextResponse } from "next/server";
import { db, socialPosts } from "@/db";
import { eq } from "drizzle-orm";

function extractShortcode(url: string): string | null {
  // Matches instagram.com/p/XXXXX/ and /reel/XXXXX/
  const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

// PUT /api/social-posts/[id]  { url?, page? }
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updates: Record<string, any> = {};

    if (body.url) {
      const shortcode = extractShortcode(body.url);
      if (!shortcode) {
        return NextResponse.json(
          { error: "Invalid Instagram URL." },
          { status: 400 },
        );
      }
      updates.url = body.url;
      updates.shortcode = shortcode;
    }

    if (body.page) updates.page = body.page;
    if (body.order !== undefined) updates.order = body.order;

    const [post] = await db
      .update(socialPosts)
      .set(updates)
      .where(eq(socialPosts.id, id))
      .returning();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ ...post, _id: post.id });
  } catch (error) {
    console.error("PUT /api/social-posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

// DELETE /api/social-posts/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [post] = await db
      .delete(socialPosts)
      .where(eq(socialPosts.id, id))
      .returning();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/social-posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
