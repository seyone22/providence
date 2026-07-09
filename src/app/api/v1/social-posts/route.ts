import { type NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SocialPost, { extractShortcode } from "@/models/SocialPost";

// GET /api/social-posts?page=home
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const page = req.nextUrl.searchParams.get("page");

    const filter = page ? { page } : {};
    const posts = await SocialPost.find(filter)
      .sort({ page: 1, order: 1 })
      .lean();

    return NextResponse.json(posts);
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
    await connectToDatabase();
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
    const lastPost = await SocialPost.findOne({ page }).sort({ order: -1 });
    const order = lastPost ? lastPost.order + 1 : 0;

    const post = await SocialPost.create({ url, shortcode, page, order });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST /api/social-posts error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
