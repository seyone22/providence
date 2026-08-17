import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getRequests } from "@/actions/admin-actions";
import { buildLeadsCsv, leadExportFilename } from "@/lib/leadExport";
import { buildLeadsWorkbook } from "@/lib/leadWorkbook";
import { auth } from "@/utils/auth";

// ExcelJS needs Node APIs — never let this route be pushed to the edge.
export const runtime = "nodejs";

/**
 * POST /api/v1/admin/leads/export  { format?: "xlsx" | "csv", ids?: string[] }
 *
 * Streams the lead list back as a spreadsheet. `ids` scopes the export to the
 * dashboard's current filtered view (client-side filtering, so the ids come
 * from the browser) and preserves the order they were sent in; omitting it
 * exports every lead. Same session gate as the rest of /admin.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { format?: string; ids?: unknown } = {};
    try {
      body = await req.json();
    } catch {
      // No body — export everything as .xlsx.
    }

    const format = body.format === "csv" ? "csv" : "xlsx";
    const ids = Array.isArray(body.ids) ? body.ids.map(String) : null;

    const leads = await getRequests();

    let selected = leads;
    if (ids) {
      const byId = new Map(
        leads.map((l: any) => [String(l.id ?? l._id), l] as const),
      );
      selected = ids.map((id) => byId.get(id)).filter(Boolean);
    }

    const filename = leadExportFilename(format);

    if (format === "csv") {
      const csv = buildLeadsCsv(selected);
      return new NextResponse(new TextEncoder().encode(csv), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const workbook = await buildLeadsWorkbook(selected);
    return new NextResponse(workbook, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("POST /api/v1/admin/leads/export error:", error);
    return NextResponse.json(
      { error: "Failed to build the lead export." },
      { status: 500 },
    );
  }
}
