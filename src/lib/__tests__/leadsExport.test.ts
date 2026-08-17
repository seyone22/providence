import { describe, expect, it } from "vitest";
import {
  buildLeadsCsv,
  buildLeadsTsv,
  LEAD_EXPORT_COLUMNS,
  leadsExportFilename,
} from "@/lib/leadsExport";

/** Index of a column by header, so tests don't hard-code column positions. */
function col(header: string) {
  const i = LEAD_EXPORT_COLUMNS.findIndex((c) => c.header === header);
  if (i === -1) throw new Error(`No such export column: ${header}`);
  return i;
}

/** Split a CSV row honouring quoted cells. Good enough for these fixtures. */
function parseRow(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      cells.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}

const lead = {
  _id: "lead-1",
  name: "Ayesha Karim",
  email: "ayesha@example.com",
  countryCode: "+353",
  phone: "871234567",
  countryOfImport: "Ireland",
  make: "Toyota",
  vehicle_model: "Land Cruiser",
  status: "Shipped",
  leadStatus: "Active Conversation",
  assignedToName: "Abdallah",
  agreedPrice: 24500,
  source: "/ireland-cost-calculator",
  createdAt: "2026-08-17T09:30:00.000Z",
  contactMethods: ["WhatsApp", "Email"],
  statusHistory: [
    { comment: "First contact" },
    { comment: "Sent three options" },
  ],
};

describe("buildLeadsCsv", () => {
  it("emits a UTF-8 BOM so Excel on Windows reads it as UTF-8", () => {
    expect(buildLeadsCsv([])).toMatch(/^﻿/);
  });

  it("writes the header row even when there are no leads", () => {
    const [header, ...rest] = buildLeadsCsv([]).replace(/^﻿/, "").split("\r\n");
    expect(parseRow(header)).toEqual(LEAD_EXPORT_COLUMNS.map((c) => c.header));
    expect(rest).toEqual([]);
  });

  it("maps a lead onto the documented columns", () => {
    const rows = buildLeadsCsv([lead]).replace(/^﻿/, "").split("\r\n");
    const cells = parseRow(rows[1]);

    expect(cells[col("Name")]).toBe("Ayesha Karim");
    expect(cells[col("Phone")]).toBe("+353 871234567");
    expect(cells[col("Model")]).toBe("Land Cruiser");
    expect(cells[col("Pipeline stage")]).toBe("Shipped");
    expect(cells[col("Agreed price")]).toBe("24500");
    expect(cells[col("Contact methods")]).toBe("WhatsApp, Email");
    // The stored pathname is resolved to its display label and full URL.
    expect(cells[col("Source")]).toBe("Ireland Calculator");
    expect(cells[col("Source URL")]).toBe(
      "https://providenceauto.co.uk/ireland-cost-calculator",
    );
    // Latest note wins over earlier ones.
    expect(cells[col("Latest note")]).toBe("Sent three options");
  });

  it("falls back to the defaults the table shows for empty status fields", () => {
    const cells = parseRow(
      buildLeadsCsv([{ _id: "x" }])
        .replace(/^﻿/, "")
        .split("\r\n")[1],
    );
    expect(cells[col("Pipeline stage")]).toBe("New");
    expect(cells[col("Sales status")]).toBe("Action required");
    expect(cells[col("Assigned to")]).toBe("Unassigned");
  });

  it("quotes and escapes commas, quotes and newlines", () => {
    const cells = parseRow(
      buildLeadsCsv([
        { _id: "x", name: 'Smith, John "JJ"', adminNotes: "a\nb" },
      ])
        .replace(/^﻿/, "")
        .split("\r\n")
        .slice(1)
        .join("\r\n"),
    );
    expect(cells[col("Name")]).toBe('Smith, John "JJ"');
  });

  it("neutralises spreadsheet formula injection in customer-supplied text", () => {
    const cells = parseRow(
      buildLeadsCsv([{ _id: "x", name: '=HYPERLINK("http://evil","click")' }])
        .replace(/^﻿/, "")
        .split("\r\n")[1],
    );
    expect(cells[col("Name")].startsWith("'=")).toBe(true);
  });

  it("leaves international phone numbers dialable", () => {
    const cells = parseRow(
      buildLeadsCsv([
        { _id: "x", countryCode: "+44", phone: "(0)20 8004-3000" },
      ])
        .replace(/^﻿/, "")
        .split("\r\n")[1],
    );
    expect(cells[col("Phone")]).toBe("+44 (0)20 8004-3000");
  });

  it("still neutralises a formula disguised as a leading plus", () => {
    const cells = parseRow(
      buildLeadsCsv([{ _id: "x", name: '+HYPERLINK("http://evil")' }])
        .replace(/^﻿/, "")
        .split("\r\n")[1],
    );
    expect(cells[col("Name")].startsWith("'+")).toBe(true);
  });

  it("leaves genuine negative numbers numeric", () => {
    const cells = parseRow(
      buildLeadsCsv([{ _id: "x", agreedPrice: -250 }])
        .replace(/^﻿/, "")
        .split("\r\n")[1],
    );
    expect(cells[col("Agreed price")]).toBe("-250");
  });

  it("renders dates as sortable YYYY-MM-DD HH:mm", () => {
    const cells = parseRow(
      buildLeadsCsv([{ _id: "x", createdAt: "2026-08-17T09:30:00.000Z" }])
        .replace(/^﻿/, "")
        .split("\r\n")[1],
    );
    expect(cells[col("Created")]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });

  it("leaves unparseable dates blank rather than printing Invalid Date", () => {
    const cells = parseRow(
      buildLeadsCsv([{ _id: "x", createdAt: "not-a-date" }])
        .replace(/^﻿/, "")
        .split("\r\n")[1],
    );
    expect(cells[col("Created")]).toBe("");
  });
});

describe("buildLeadsTsv", () => {
  it("strips tabs and newlines so cells cannot break the column layout", () => {
    const rows = buildLeadsTsv([
      { _id: "x", name: "Two\tParts", adminNotes: "line one\nline two" },
    ]).split("\r\n");
    const cells = rows[1].split("\t");

    expect(cells.length).toBe(LEAD_EXPORT_COLUMNS.length);
    expect(cells[col("Name")]).toBe("Two Parts");
    expect(cells[col("Admin notes")]).toBe("line one line two");
  });
});

describe("leadsExportFilename", () => {
  it("dates the file so repeat exports don't overwrite each other", () => {
    expect(leadsExportFilename("providence-leads", new Date(2026, 7, 17))).toBe(
      "providence-leads-2026-08-17.csv",
    );
  });
});
