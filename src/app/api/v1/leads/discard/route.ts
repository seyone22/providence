import { type NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";

/**
 * POST /api/v1/leads/discard  { id }
 *
 * Best-effort cleanup for an abandoned inquiry: called via navigator.sendBeacon
 * when a customer closes the tab on the contact-preferences step without
 * submitting. Only deletes the lead if it's still a DRAFT (contact preferences
 * never submitted) — live leads are never touched.
 */
export async function POST(req: NextRequest) {
  try {
    let id: string | undefined;
    try {
      const body = await req.json();
      id = body?.id;
    } catch {
      // sendBeacon may send the id as plain text
      id = (await req.text())?.trim() || undefined;
    }

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await connectToDatabase();
    const result = await Request.deleteOne({ _id: id, isDraft: true });

    return NextResponse.json({ ok: true, deleted: result.deletedCount });
  } catch (error) {
    console.error("POST /api/v1/leads/discard error:", error);
    return NextResponse.json(
      { error: "Failed to discard draft" },
      { status: 500 },
    );
  }
}
