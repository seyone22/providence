// @/lib/leadWorkbook.ts
// Server-only: turns leads into a real .xlsx workbook. Column definitions live
// in @/lib/leadExport (shared with the CSV branch); this file only deals with
// ExcelJS formatting and the two extra sheets that unflatten the per-lead
// activity log and document list.

import ExcelJS from "exceljs";
import {
  buildLeadRow,
  documents,
  LEAD_EXPORT_COLUMNS,
  type LeadRecord,
  statusHistory,
} from "@/lib/leadExport";

const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF18181B" }, // zinc-900, matching the admin UI
};

const DATE_FORMAT = "yyyy-mm-dd hh:mm";

function styleHeader(sheet: ExcelJS.Worksheet) {
  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = HEADER_FILL;
  header.alignment = { vertical: "middle" };
  header.height = 22;
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: sheet.columnCount },
  };
}

/**
 * Build the workbook: a "Leads" sheet with every captured field, plus
 * "Activity log" and "Documents" sheets with one row per entry so the history
 * is filterable instead of stuffed into a single cell.
 */
export async function buildLeadsWorkbook(
  leads: LeadRecord[],
): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Providence Auto admin";
  workbook.created = new Date();

  // --- Sheet 1: one row per lead ---
  const sheet = workbook.addWorksheet("Leads");
  sheet.columns = LEAD_EXPORT_COLUMNS.map((c) => ({
    header: c.header,
    width: c.width,
    // "@" forces Excel to keep phone numbers and IDs as typed text if the
    // sheet is edited later.
    style:
      c.type === "date"
        ? { numFmt: DATE_FORMAT }
        : c.type === "text"
          ? { numFmt: "@" }
          : {},
  }));

  for (const lead of leads) {
    sheet.addRow(buildLeadRow(lead));
  }
  styleHeader(sheet);

  // --- Sheet 2: activity log, one row per history entry ---
  const activity = workbook.addWorksheet("Activity log");
  activity.columns = [
    { header: "Lead ID", width: 26, style: { numFmt: "@" } },
    { header: "Lead name", width: 22, style: { numFmt: "@" } },
    { header: "Date", width: 20, style: { numFmt: DATE_FORMAT } },
    { header: "Action", width: 46, style: { numFmt: "@" } },
    { header: "Performed by", width: 20, style: { numFmt: "@" } },
    { header: "Comment", width: 60, style: { numFmt: "@" } },
  ];
  for (const lead of leads) {
    for (const entry of statusHistory(lead)) {
      const when = entry.date ? new Date(entry.date) : null;
      activity.addRow([
        String(lead.id ?? lead._id ?? ""),
        String(lead.name ?? ""),
        when && !Number.isNaN(when.getTime()) ? when : null,
        String(entry.action ?? ""),
        String(entry.performedBy ?? ""),
        String(entry.comment ?? ""),
      ]);
    }
  }
  styleHeader(activity);

  // --- Sheet 3: uploaded documents, one row per file ---
  const docs = workbook.addWorksheet("Documents");
  docs.columns = [
    { header: "Lead ID", width: 26, style: { numFmt: "@" } },
    { header: "Lead name", width: 22, style: { numFmt: "@" } },
    { header: "Document", width: 30, style: { numFmt: "@" } },
    { header: "File type", width: 12, style: { numFmt: "@" } },
    { header: "Stage added", width: 20, style: { numFmt: "@" } },
    { header: "File URL", width: 70, style: { numFmt: "@" } },
  ];
  for (const lead of leads) {
    for (const doc of documents(lead)) {
      docs.addRow([
        String(lead.id ?? lead._id ?? ""),
        String(lead.name ?? ""),
        String(doc.fieldName ?? ""),
        String(doc.fileType ?? ""),
        String(doc.stageAdded ?? ""),
        String(doc.fileUrl ?? ""),
      ]);
    }
  }
  styleHeader(docs);

  return workbook.xlsx.writeBuffer();
}
