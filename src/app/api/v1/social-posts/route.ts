import { type NextRequest, NextResponse } from "next/server";
import { db, socialPosts } from "@/db";
import { eq, desc, asc } from "drizzle-orm";

function extractShortcode(url: string): string | null {
  // Matches instagram.com/p/XXXXX/ and /reel/XXXXX/
  const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

// GET /api/social-posts?page=home
export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get("page");

    const posts = await db.query.socialPosts.findMany({
      where: page
        ? (socialPosts, { eq }) => eq(socialPosts.page, page)
        : undefined,
      orderBy: (socialPosts, { asc }) => [
        asc(socialPosts.page),
        asc(socialPosts.order),
      ],
    });

    const mappedPosts = posts.map((p) => ({
      ...p,
      _id: p.id, // backward compatibility
    }));

    return NextResponse.json(mappedPosts);
  } catch (error) {
    console.error("GET /api/social-posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

// POST /api/social-posts  { url, page }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, page } = body;

    if (!url || !page) {
      return NextResponse.json(
        { error: "url and page are required" },
        { status: 400 },
      );
    }

    const shortcode = extractShortcode(url);
    if (!shortcode) {
      return NextResponse.json(
        { error: "Invalid Instagram URL. Use a post or reel link." },
        { status: 400 },
      );
    }

    // Set order to be last in the page's list
    const lastPost = await db.query.socialPosts.findFirst({
      where: (socialPosts, { eq }) => eq(socialPosts.page, page),
      orderBy: (socialPosts, { desc }) => [desc(socialPosts.order)],
    });
    const order = lastPost ? lastPost.order + 1 : 0;

    const randomId =
      Math.random().toString(36).substring(2, 14) +
      Math.random().toString(36).substring(2, 14);

    const [post] = await db
      .insert(socialPosts)
      .values({
        id: randomId,
        url,
        shortcode,
        page,
        order,
      })
      .returning();

    return NextResponse.json({ ...post, _id: post.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/social-posts error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
