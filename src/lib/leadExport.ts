// @/lib/leadExport.ts
// Single source of truth for the admin "Export leads" feature: the column set
// (every field captured on a lead, plus the derived values the dashboard shows)
// and the CSV serialiser. Deliberately free of Node/ExcelJS imports so it can
// be unit-tested and shared by both the .xlsx and .csv branches of
// /api/v1/admin/leads/export.

import { formatInIST } from "@/lib/contactScheduling";
import { isLhdLead, pathnameToSource } from "@/lib/leadSource";

/** A lead as returned by `getRequests()` — Drizzle row + compatibility keys. */
export type LeadRecord = Record<string, any>;

export type LeadCellValue = string | number | Date | null;

export interface LeadExportColumn {
  header: string;
  /** Column width in characters, used for the .xlsx sheet only. */
  width: number;
  /** Excel cell type. "text" keeps phone numbers/IDs from being coerced. */
  type: "text" | "number" | "date";
  value: (lead: LeadRecord) => LeadCellValue;
}

// --- small value helpers ---------------------------------------------------

const str = (v: unknown): string =>
  v === null || v === undefined ? "" : String(v);

const list = (v: unknown): string => (Array.isArray(v) ? v.join(", ") : str(v));

const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const date = (v: unknown): Date | null => {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v as string);
  return Number.isNaN(d.getTime()) ? null : d;
};

const yesNo = (v: boolean): string => (v ? "Yes" : "No");

/** "Toyota Land Cruiser 2021 ZX" from a populated spec dossier. */
function dossierLabel(d: LeadRecord): string {
  return [d?.make, d?.model, d?.year, d?.trim].filter(Boolean).join(" ").trim();
}

/** `dossierIds` arrives populated (objects) from getRequests, raw ids elsewhere. */
function dossiers(lead: LeadRecord): LeadRecord[] {
  return Array.isArray(lead.dossierIds) ? lead.dossierIds : [];
}

export interface StatusHistoryEntry {
  action?: string;
  performedBy?: string;
  date?: string | Date;
  comment?: string;
}

export function statusHistory(lead: LeadRecord): StatusHistoryEntry[] {
  return Array.isArray(lead.statusHistory) ? lead.statusHistory : [];
}

export interface LeadDocument {
  fieldName?: string;
  fileType?: string;
  fileUrl?: string;
  stageAdded?: string;
}

export function documents(lead: LeadRecord): LeadDocument[] {
  return Array.isArray(lead.documents) ? lead.documents : [];
}

/** ISO-8601 UTC, e.g. "2026-08-17T09:30:00Z" — unambiguous in every tool. */
function isoUtc(d: Date): string {
  return `${d.toISOString().slice(0, 19)}Z`;
}

// --- the column set --------------------------------------------------------
// Order mirrors how the sales team reads a lead: who/when → status → contact
// details → the car → contact preferences → money → shipping → attribution.

export const LEAD_EXPORT_COLUMNS: LeadExportColumn[] = [
  // Identity & pipeline
  {
    header: "Lead ID",
    width: 26,
    type: "text",
    value: (l) => str(l.id ?? l._id),
  },
  {
    header: "Created",
    width: 20,
    type: "date",
    value: (l) => date(l.createdAt),
  },
  {
    header: "Last updated",
    width: 20,
    type: "date",
    value: (l) => date(l.updatedAt),
  },
  {
    header: "Pipeline stage",
    width: 18,
    type: "text",
    value: (l) => str(l.status || "New"),
  },
  {
    header: "Sales status",
    width: 26,
    type: "text",
    value: (l) => str(l.leadStatus || "Action required"),
  },
  {
    header: "Status updated",
    width: 20,
    type: "date",
    value: (l) => date(l.statusUpdatedAt),
  },
  {
    header: "Assigned to",
    width: 18,
    type: "text",
    value: (l) => str(l.assignedToName || "Unassigned"),
  },
  {
    header: "Assigned to (user ID)",
    width: 26,
    type: "text",
    value: (l) => str(l.assignedToId),
  },
  {
    header: "Assignment method",
    width: 18,
    type: "text",
    value: (l) => str(l.assignmentMethod),
  },

  // Customer
  { header: "Name", width: 22, type: "text", value: (l) => str(l.name) },
  { header: "Email", width: 28, type: "text", value: (l) => str(l.email) },
  {
    header: "Dial code",
    width: 10,
    type: "text",
    value: (l) => str(l.countryCode),
  },
  { header: "Phone", width: 16, type: "text", value: (l) => str(l.phone) },
  {
    header: "Phone (full)",
    width: 20,
    type: "text",
    value: (l) => `${str(l.countryCode)}${str(l.phone)}`.trim(),
  },
  {
    header: "Destination country",
    width: 20,
    type: "text",
    value: (l) => str(l.countryOfImport),
  },

  // Vehicle wanted
  { header: "Make", width: 16, type: "text", value: (l) => str(l.make) },
  {
    header: "Model",
    width: 20,
    type: "text",
    value: (l) => str(l.vehicleModel ?? l.vehicle_model),
  },
  {
    header: "Condition",
    width: 12,
    type: "text",
    value: (l) => str(l.condition),
  },
  {
    header: "Year from",
    width: 10,
    type: "number",
    value: (l) => num(l.yearFrom),
  },
  { header: "Year to", width: 10, type: "number", value: (l) => num(l.yearTo) },
  { header: "Mileage", width: 14, type: "text", value: (l) => str(l.mileage) },
  {
    header: "Specs requested",
    width: 30,
    type: "text",
    value: (l) => str(l.specs),
  },
  { header: "Options", width: 30, type: "text", value: (l) => str(l.options) },
  {
    header: "Import timeline",
    width: 18,
    type: "text",
    value: (l) => str(l.importTimeline),
  },
  {
    header: "Spec dossiers",
    width: 34,
    type: "text",
    value: (l) => dossiers(l).map(dossierLabel).filter(Boolean).join(" | "),
  },
  {
    header: "Spec dossier IDs",
    width: 30,
    type: "text",
    value: (l) =>
      dossiers(l)
        .map((d) => str(typeof d === "string" ? d : (d?.id ?? d?._id)))
        .filter(Boolean)
        .join(", "),
  },

  // Contact preferences
  {
    header: "Contact methods",
    width: 22,
    type: "text",
    value: (l) => list(l.contactMethods),
  },
  {
    header: "Contact days",
    width: 22,
    type: "text",
    value: (l) => list(l.contactDays),
  },
  {
    header: "Contact time window",
    width: 20,
    type: "text",
    value: (l) => str(l.contactTimeWindow),
  },
  {
    header: "Contact timezone",
    width: 20,
    type: "text",
    value: (l) => str(l.contactTimezone),
  },
  {
    header: "Contact timezone label",
    width: 32,
    type: "text",
    value: (l) => str(l.contactTimezoneLabel),
  },
  {
    header: "Preferred contact at",
    width: 20,
    type: "date",
    value: (l) => date(l.preferredContactAt),
  },
  {
    header: "Preferred contact (IST)",
    width: 26,
    type: "text",
    value: (l) => {
      const d = date(l.preferredContactAt);
      return d ? formatInIST(d) : "";
    },
  },

  // Follow-up
  {
    header: "Follow-up due",
    width: 20,
    type: "date",
    value: (l) => date(l.followUpAt),
  },
  {
    header: "Follow-up set at",
    width: 20,
    type: "date",
    value: (l) => date(l.followUpSetAt),
  },

  // Commercials
  {
    header: "Agreed price",
    width: 14,
    type: "number",
    value: (l) => num(l.agreedPrice),
  },
  {
    header: "Payment type",
    width: 16,
    type: "text",
    value: (l) => str(l.paymentType),
  },
  {
    header: "Total amount",
    width: 14,
    type: "number",
    value: (l) => num(l.totalAmount),
  },
  {
    header: "Advance payment",
    width: 16,
    type: "number",
    value: (l) => num(l.advancePaymentAmount),
  },
  {
    header: "Balance payment",
    width: 16,
    type: "number",
    value: (l) => num(l.balancePaymentAmount),
  },
  {
    header: "Balance payment stage",
    width: 20,
    type: "text",
    value: (l) => str(l.balancePaymentStage),
  },
  {
    header: "Deposit amount",
    width: 14,
    type: "number",
    value: (l) => num(l.depositAmount),
  },
  {
    header: "Transaction ID",
    width: 22,
    type: "text",
    value: (l) => str(l.transactionId),
  },
  {
    header: "Invoice number",
    width: 18,
    type: "text",
    value: (l) => str(l.invoiceNumber),
  },

  // Logistics
  {
    header: "Inspection notes",
    width: 30,
    type: "text",
    value: (l) => str(l.inspectionNotes),
  },
  {
    header: "Tracking number",
    width: 20,
    type: "text",
    value: (l) => str(l.trackingNumber),
  },
  {
    header: "Vessel name",
    width: 18,
    type: "text",
    value: (l) => str(l.vesselName),
  },
  { header: "ETA", width: 20, type: "date", value: (l) => date(l.eta) },
  {
    header: "Port name",
    width: 18,
    type: "text",
    value: (l) => str(l.portName),
  },
  {
    header: "Container number",
    width: 20,
    type: "text",
    value: (l) => str(l.containerNumber),
  },
  {
    header: "Port of arrival",
    width: 18,
    type: "text",
    value: (l) => str(l.portOfArrival),
  },
  {
    header: "Customs notes",
    width: 30,
    type: "text",
    value: (l) => str(l.customsNotes),
  },

  // Notes & attribution
  {
    header: "Admin notes",
    width: 40,
    type: "text",
    value: (l) => str(l.adminNotes),
  },
  {
    header: "Source",
    width: 22,
    type: "text",
    value: (l) => (l.source ? pathnameToSource(String(l.source)) : ""),
  },
  {
    header: "Source (raw)",
    width: 26,
    type: "text",
    value: (l) => str(l.source),
  },
  {
    header: "LHD lead",
    width: 10,
    type: "text",
    value: (l) => yesNo(isLhdLead(l.source ? String(l.source) : undefined)),
  },
  { header: "gclid", width: 26, type: "text", value: (l) => str(l.gclid) },
  { header: "fbclid", width: 26, type: "text", value: (l) => str(l.fbclid) },
  { header: "fbc", width: 26, type: "text", value: (l) => str(l.fbc) },
  { header: "fbp", width: 26, type: "text", value: (l) => str(l.fbp) },

  // Activity — flattened here, and broken out row-per-entry on the extra
  // worksheets of the .xlsx export.
  {
    header: "Documents (count)",
    width: 16,
    type: "number",
    value: (l) => documents(l).length,
  },
  {
    header: "Documents",
    width: 40,
    type: "text",
    value: (l) =>
      documents(l)
        .map((d) =>
          `${str(d.fieldName) || "Document"}${d.stageAdded ? ` (${d.stageAdded})` : ""}: ${str(d.fileUrl)}`.trim(),
        )
        .join(" | "),
  },
  {
    header: "Activity entries",
    width: 16,
    type: "number",
    value: (l) => statusHistory(l).length,
  },
  {
    header: "Last activity",
    width: 40,
    type: "text",
    value: (l) => {
      const entries = statusHistory(l);
      const last = entries[entries.length - 1];
      if (!last) return "";
      const d = date(last.date);
      return `${d ? `${isoUtc(d)} — ` : ""}${str(last.action)}${
        last.performedBy ? ` (${last.performedBy})` : ""
      }`;
    },
  },
  {
    header: "Activity log",
    width: 60,
    type: "text",
    value: (l) =>
      statusHistory(l)
        .map((h) => {
          const d = date(h.date);
          const when = d ? isoUtc(d) : "";
          const who = h.performedBy ? ` by ${h.performedBy}` : "";
          const comment = h.comment ? ` — "${h.comment}"` : "";
          return `${when} ${str(h.action)}${who}${comment}`.trim();
        })
        .join("\n"),
  },
];

export const LEAD_EXPORT_HEADERS = LEAD_EXPORT_COLUMNS.map((c) => c.header);

/** One export row per lead, in column order. */
export function buildLeadRow(lead: LeadRecord): LeadCellValue[] {
  return LEAD_EXPORT_COLUMNS.map((c) => c.value(lead));
}

// --- CSV -------------------------------------------------------------------

/** Excel only detects UTF-8 in a CSV when it starts with a byte-order mark. */
export const CSV_BOM = "﻿";

/**
 * Serialise one cell. Dates become ISO-8601 UTC; values that a spreadsheet
 * would otherwise evaluate (a leading `=`, `+`, `-` or `@` — that includes
 * every "+353…" phone number) get an apostrophe prefix so they stay text.
 * That guard is also what stops a lead's free-text note becoming a formula
 * in whoever's spreadsheet opens the file.
 */
export function csvCell(value: LeadCellValue): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return isoUtc(value);
  if (typeof value === "number") return String(value);

  let text = value;
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  if (/[",\n\r]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

/** Full CSV document (CRLF line endings, BOM prefixed) for a set of leads. */
export function buildLeadsCsv(leads: LeadRecord[]): string {
  const lines = [
    LEAD_EXPORT_HEADERS.map((h) => csvCell(h)).join(","),
    ...leads.map((lead) => buildLeadRow(lead).map(csvCell).join(",")),
  ];
  return CSV_BOM + lines.join("\r\n");
}

// --- filename --------------------------------------------------------------

/** e.g. "providence-leads-2026-08-17.xlsx" */
export function leadExportFilename(
  format: "xlsx" | "csv",
  now: Date = new Date(),
): string {
  return `providence-leads-${now.toISOString().slice(0, 10)}.${format}`;
}
