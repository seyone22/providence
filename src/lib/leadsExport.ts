// @/lib/leadsExport.ts
//
// Turns the admin lead list into a spreadsheet. One column set, two serialisers:
// CSV for the download (Excel and Google Sheets both open it directly) and TSV
// for the clipboard (pasting TSV into Google Sheets splits into columns without
// an import step). Keeping both behind the same `LEAD_EXPORT_COLUMNS` means the
// two exports can never drift apart.

import { pathnameToSource } from "@/lib/leadSource";

export type LeadExportColumn = {
  header: string;
  // biome-ignore lint/suspicious/noExplicitAny: leads are the loosely-typed admin payload
  value: (req: any) => string;
};

const BASE_URL = "https://providenceauto.co.uk";

/** Legacy `source` labels stored before leads started recording raw pathnames. */
const LEGACY_LABEL_TO_PATH: Record<string, string> = {
  "Home Page": "/",
  "Request Page": "/request",
  "B2B Landing": "/b2b",
  "B2C Landing": "/b2c",
  "Import to Ireland": "/import-japanese-cars-to-ireland",
  "Ireland Calculator": "/ireland-cost-calculator",
};

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function list(value: unknown): string {
  return Array.isArray(value) ? value.filter(Boolean).join(", ") : text(value);
}

/**
 * `YYYY-MM-DD HH:mm` — the one datetime shape both Excel and Google Sheets
 * parse as a real date *and* that sorts correctly when they don't.
 */
function dateTime(value: unknown): string {
  if (!value) return "";
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/** Bare number, no currency symbol or separators, so the cell stays numeric. */
function money(value: unknown): string {
  const n = Number(value);
  return Number.isFinite(n) && n !== 0 ? String(n) : "";
}

/** Most recent status-history entry that actually carries a note. */
// biome-ignore lint/suspicious/noExplicitAny: statusHistory is an untyped jsonb column
function latestNote(req: any): string {
  const history = Array.isArray(req.statusHistory) ? req.statusHistory : [];
  const found = [...history]
    .reverse()
    // biome-ignore lint/suspicious/noExplicitAny: same
    .find((log: any) => log?.comment && String(log.comment).trim() !== "");
  return found ? text(found.comment) : "";
}

/** Stored `source` value → the full landing-page URL the lead arrived on. */
function sourceUrl(source: string): string {
  if (!source) return "";
  if (source.startsWith("/")) return `${BASE_URL}${source}`;
  const legacy = LEGACY_LABEL_TO_PATH[source];
  if (legacy) return `${BASE_URL}${legacy}`;
  if (source.startsWith("Campaign: "))
    return `${BASE_URL}/campaigns/${source.replace("Campaign: ", "")}`;
  return "";
}

/**
 * The export schema. Ordered the way the sales team reads a lead: who they are,
 * what they want, where it stands, what was agreed, where it is shipping, then
 * the attribution tail.
 */
export const LEAD_EXPORT_COLUMNS: LeadExportColumn[] = [
  { header: "Created", value: (r) => dateTime(r.createdAt) },
  { header: "Lead ID", value: (r) => text(r._id ?? r.id) },

  // Client
  { header: "Name", value: (r) => text(r.name) },
  { header: "Email", value: (r) => text(r.email) },
  {
    header: "Phone",
    value: (r) => `${text(r.countryCode)} ${text(r.phone)}`.trim(),
  },
  { header: "Country of import", value: (r) => text(r.countryOfImport) },
  { header: "Import timeline", value: (r) => text(r.importTimeline) },

  // Vehicle
  { header: "Make", value: (r) => text(r.make) },
  { header: "Model", value: (r) => text(r.vehicle_model ?? r.vehicleModel) },
  { header: "Condition", value: (r) => text(r.condition) },
  { header: "Year from", value: (r) => text(r.yearFrom) },
  { header: "Year to", value: (r) => text(r.yearTo) },
  { header: "Max mileage", value: (r) => text(r.mileage) },
  { header: "Specs", value: (r) => text(r.specs) },
  { header: "Options", value: (r) => text(r.options) },

  // Status
  { header: "Pipeline stage", value: (r) => text(r.status) || "New" },
  {
    header: "Sales status",
    value: (r) => text(r.leadStatus) || "Action required",
  },
  {
    header: "Status updated",
    value: (r) => dateTime(r.statusUpdatedAt ?? r.updatedAt),
  },
  {
    header: "Assigned to",
    value: (r) => text(r.assignedToName) || "Unassigned",
  },
  { header: "Follow-up due", value: (r) => dateTime(r.followUpAt) },
  { header: "Latest note", value: latestNote },
  { header: "Admin notes", value: (r) => text(r.adminNotes) },

  // Contact preferences
  { header: "Contact methods", value: (r) => list(r.contactMethods) },
  { header: "Contact days", value: (r) => list(r.contactDays) },
  { header: "Contact window", value: (r) => text(r.contactTimeWindow) },
  {
    header: "Contact timezone",
    value: (r) => text(r.contactTimezoneLabel) || text(r.contactTimezone),
  },
  {
    header: "Preferred contact at",
    value: (r) => dateTime(r.preferredContactAt),
  },

  // Commercials
  { header: "Payment type", value: (r) => text(r.paymentType) },
  { header: "Agreed price", value: (r) => money(r.agreedPrice) },
  { header: "Total amount", value: (r) => money(r.totalAmount) },
  { header: "Advance paid", value: (r) => money(r.advancePaymentAmount) },
  { header: "Balance due", value: (r) => money(r.balancePaymentAmount) },
  { header: "Balance due at stage", value: (r) => text(r.balancePaymentStage) },
  { header: "Deposit", value: (r) => money(r.depositAmount) },
  { header: "Invoice number", value: (r) => text(r.invoiceNumber) },
  { header: "Transaction ID", value: (r) => text(r.transactionId) },

  // Shipping
  { header: "Vessel", value: (r) => text(r.vesselName) },
  { header: "ETA", value: (r) => dateTime(r.eta) },
  { header: "Container", value: (r) => text(r.containerNumber) },
  { header: "Port of arrival", value: (r) => text(r.portOfArrival) },
  { header: "Tracking number", value: (r) => text(r.trackingNumber) },

  // Attribution
  {
    header: "Source",
    value: (r) => (r.source ? pathnameToSource(text(r.source)) : ""),
  },
  { header: "Source URL", value: (r) => sourceUrl(text(r.source)) },
  { header: "GCLID", value: (r) => text(r.gclid) },
  { header: "FBCLID", value: (r) => text(r.fbclid) },
  {
    header: "Tracker URL",
    value: (r) => `${BASE_URL}/track/${text(r._id ?? r.id)}`,
  },
];

/** `+353 87 123 4567`, `+44 (0)20 8004 3000` — an international dialling number. */
const PHONE_LIKE = /^\+[\d\s().-]+$/;

/**
 * Neutralise spreadsheet formula injection. Lead names and notes are
 * customer-submitted, so a cell opening with `=`, `+`, `-`, `@`, tab or CR is
 * treated as a formula by Excel and Sheets.
 *
 * Two exemptions, both because the apostrophe would be *worse* than the risk:
 * a genuine number (a negative price) must stay numeric, and an international
 * phone number must stay dialable — `'+353…` is wrong the moment anyone copies
 * it into WhatsApp, and the shape is generated by us from two DB columns rather
 * than pasted in by a customer.
 */
function neutralize(value: string): string {
  if (!value) return value;
  if (!/^[=+\-@\t\r]/.test(value)) return value;
  if (Number.isFinite(Number(value))) return value;
  if (PHONE_LIKE.test(value)) return value;
  return `'${value}`;
}

function csvCell(value: string): string {
  const safe = neutralize(value);
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** Tabs and newlines are the TSV delimiters, so they cannot survive in a cell. */
function tsvCell(value: string): string {
  return neutralize(value).replace(/[\t\r\n]+/g, " ");
}

// biome-ignore lint/suspicious/noExplicitAny: leads are the loosely-typed admin payload
function serialize(rows: any[], cell: (v: string) => string, sep: string) {
  const header = LEAD_EXPORT_COLUMNS.map((c) => cell(c.header)).join(sep);
  const body = rows.map((row) =>
    LEAD_EXPORT_COLUMNS.map((c) => {
      try {
        return cell(c.value(row));
      } catch {
        return "";
      }
    }).join(sep),
  );
  return [header, ...body].join("\r\n");
}

/**
 * CSV for download. Prefixed with a UTF-8 BOM — without it Excel on Windows
 * reads the file as the system codepage and mangles every non-ASCII name.
 */
// biome-ignore lint/suspicious/noExplicitAny: leads are the loosely-typed admin payload
export function buildLeadsCsv(rows: any[]): string {
  return `﻿${serialize(rows, csvCell, ",")}`;
}

/** TSV for the clipboard — pastes straight into Google Sheets as columns. */
// biome-ignore lint/suspicious/noExplicitAny: leads are the loosely-typed admin payload
export function buildLeadsTsv(rows: any[]): string {
  return serialize(rows, tsvCell, "\t");
}

/** `providence-leads-2026-08-17.csv` — dated so repeat exports don't collide. */
export function leadsExportFilename(
  prefix = "providence-leads",
  now = new Date(),
) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return `${prefix}-${stamp}.csv`;
}
