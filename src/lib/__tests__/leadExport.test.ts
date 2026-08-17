import { describe, expect, it } from "vitest";
import {
  buildLeadRow,
  buildLeadsCsv,
  csvCell,
  LEAD_EXPORT_COLUMNS,
  LEAD_EXPORT_HEADERS,
  leadExportFilename,
} from "@/lib/leadExport";

/** Minimal but representative lead, shaped like getRequests() output. */
const lead = {
  id: "lead_1",
  _id: "lead_1",
  make: "Toyota",
  vehicleModel: "Land Cruiser",
  vehicle_model: "Land Cruiser",
  condition: "Used",
  yearFrom: 2019,
  yearTo: 2022,
  mileage: "under 50,000 km",
  specs: "Sunroof, leather",
  name: "Aoife Byrne",
  email: "aoife@example.com",
  countryCode: "+353",
  phone: "871234567",
  countryOfImport: "Ireland",
  importTimeline: "1-3 months",
  contactMethods: ["WhatsApp", "Email"],
  contactDays: ["Weekdays"],
  contactTimeWindow: "Morning (9–12)",
  contactTimezone: "Europe/London",
  preferredContactAt: "2026-08-20T08:00:00.000Z",
  status: "Vehicle Selection",
  leadStatus: "Active Conversation",
  agreedPrice: 41500,
  source: "/japanese-luxury-cars-lhd",
  gclid: "abc123",
  assignedToName: "Abdallah",
  dossierIds: [
    {
      id: "d1",
      make: "Toyota",
      model: "Land Cruiser",
      year: "2021",
      trim: "ZX",
    },
  ],
  documents: [
    {
      fieldName: "Auction sheet",
      fileType: "pdf",
      fileUrl: "https://example.com/a.pdf",
      stageAdded: "Vehicle Selection",
    },
  ],
  statusHistory: [
    {
      action: "Updated Sales Status: Active Conversation",
      performedBy: "Abdallah",
      date: "2026-08-18T10:15:00.000Z",
      comment: "Called, wants a quote",
    },
  ],
  createdAt: "2026-08-17T09:30:00.000Z",
  updatedAt: "2026-08-18T10:15:00.000Z",
};

function cell(row: ReturnType<typeof buildLeadRow>, header: string) {
  return row[LEAD_EXPORT_HEADERS.indexOf(header)];
}

describe("lead export columns", () => {
  it("emits one value per column, in header order", () => {
    const row = buildLeadRow(lead);
    expect(row).toHaveLength(LEAD_EXPORT_COLUMNS.length);
    expect(new Set(LEAD_EXPORT_HEADERS).size).toBe(LEAD_EXPORT_HEADERS.length);
  });

  it("covers every field captured on a lead", () => {
    // Guard against a schema field being added without an export column.
    const row = buildLeadRow(lead);
    expect(cell(row, "Name")).toBe("Aoife Byrne");
    expect(cell(row, "Email")).toBe("aoife@example.com");
    expect(cell(row, "Model")).toBe("Land Cruiser");
    expect(cell(row, "Destination country")).toBe("Ireland");
    expect(cell(row, "Sales status")).toBe("Active Conversation");
    expect(cell(row, "Pipeline stage")).toBe("Vehicle Selection");
    expect(cell(row, "Agreed price")).toBe(41500);
    expect(cell(row, "gclid")).toBe("abc123");
    expect(cell(row, "Assigned to")).toBe("Abdallah");
  });

  it("joins list fields and populated spec dossiers", () => {
    const row = buildLeadRow(lead);
    expect(cell(row, "Contact methods")).toBe("WhatsApp, Email");
    expect(cell(row, "Spec dossiers")).toBe("Toyota Land Cruiser 2021 ZX");
    expect(cell(row, "Spec dossier IDs")).toBe("d1");
  });

  it("derives phone, source label and the LHD flag", () => {
    const row = buildLeadRow(lead);
    expect(cell(row, "Phone (full)")).toBe("+353871234567");
    expect(cell(row, "Source")).toBe("Japanese Luxury Cars Lhd");
    expect(cell(row, "LHD lead")).toBe("Yes");
    expect(
      cell(buildLeadRow({ ...lead, source: "/request" }), "LHD lead"),
    ).toBe("No");
  });

  it("flattens documents and the activity log", () => {
    const row = buildLeadRow(lead);
    expect(cell(row, "Documents (count)")).toBe(1);
    expect(cell(row, "Documents")).toBe(
      "Auction sheet (Vehicle Selection): https://example.com/a.pdf",
    );
    expect(cell(row, "Activity entries")).toBe(1);
    expect(cell(row, "Activity log")).toContain(
      "2026-08-18T10:15:00Z Updated Sales Status: Active Conversation by Abdallah",
    );
    expect(cell(row, "Last activity")).toContain("Abdallah");
  });

  it("returns dates as Date objects and blanks for missing values", () => {
    const row = buildLeadRow(lead);
    expect(cell(row, "Created")).toBeInstanceOf(Date);
    expect(cell(row, "ETA")).toBeNull();
    expect(cell(row, "Invoice number")).toBe("");
    expect(cell(row, "Total amount")).toBeNull();
  });

  it("tolerates a bare database row with no populated relations", () => {
    const row = buildLeadRow({ id: "x", name: "Bare" });
    expect(row).toHaveLength(LEAD_EXPORT_COLUMNS.length);
    expect(cell(row, "Documents (count)")).toBe(0);
    expect(cell(row, "Spec dossiers")).toBe("");
    expect(cell(row, "Pipeline stage")).toBe("New");
  });
});

describe("csvCell", () => {
  it("quotes values containing commas, quotes or newlines", () => {
    expect(csvCell("plain")).toBe("plain");
    expect(csvCell("a,b")).toBe('"a,b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell("line1\nline2")).toBe('"line1\nline2"');
  });

  it("neutralises values a spreadsheet would evaluate as a formula", () => {
    expect(csvCell("+353871234567")).toBe("'+353871234567");
    expect(csvCell("=1+1")).toBe("'=1+1");
    expect(csvCell("@handle")).toBe("'@handle");
    expect(csvCell("-5 days")).toBe("'-5 days");
  });

  it("formats dates as ISO-8601 UTC and passes numbers through", () => {
    expect(csvCell(new Date("2026-08-17T09:30:00.000Z"))).toBe(
      "2026-08-17T09:30:00Z",
    );
    expect(csvCell(41500)).toBe("41500");
    expect(csvCell(null)).toBe("");
  });
});

describe("buildLeadsCsv", () => {
  it("starts with a BOM and the header row, then one row per lead", () => {
    const csv = buildLeadsCsv([lead, { id: "lead_2", name: "Bare" }]);
    expect(csv.startsWith("﻿")).toBe(true);

    const lines = csv.slice(1).split("\r\n");
    expect(lines[0].split(",")[0]).toBe("Lead ID");
    // The first lead's activity log contains a newline, so it is quoted and
    // spans lines — count leads by their ids instead.
    expect(csv).toContain("lead_1");
    expect(csv).toContain("lead_2");
  });

  it("handles an empty lead list", () => {
    const csv = buildLeadsCsv([]);
    expect(csv).toBe(`﻿${LEAD_EXPORT_HEADERS.join(",")}`);
  });
});

describe("leadExportFilename", () => {
  it("stamps the date and the extension", () => {
    const when = new Date("2026-08-17T09:30:00.000Z");
    expect(leadExportFilename("xlsx", when)).toBe(
      "providence-leads-2026-08-17.xlsx",
    );
    expect(leadExportFilename("csv", when)).toBe(
      "providence-leads-2026-08-17.csv",
    );
  });
});
