// @vitest-environment node
// ExcelJS needs Node streams/Buffer, so this file opts out of the happy-dom
// default. It round-trips a workbook (build → read back) to prove the export
// really opens as a spreadsheet, not just that the code ran.

import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { LEAD_EXPORT_HEADERS } from "@/lib/leadExport";
import { buildLeadsWorkbook } from "@/lib/leadWorkbook";

const leads = [
  {
    id: "lead_1",
    name: "Aoife Byrne",
    email: "aoife@example.com",
    countryCode: "+353",
    phone: "871234567",
    make: "Toyota",
    vehicleModel: "Land Cruiser",
    status: "Vehicle Selection",
    leadStatus: "Active Conversation",
    agreedPrice: 41500,
    createdAt: "2026-08-17T09:30:00.000Z",
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
      {
        action: "Moved to Pipeline Stage: Vehicle Selection",
        performedBy: "Abdallah",
        date: "2026-08-18T11:00:00.000Z",
        comment: "",
      },
    ],
  },
  { id: "lead_2", name: "Bare Minimum" },
];

async function readBack(buffer: ArrayBuffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  return workbook;
}

describe("buildLeadsWorkbook", () => {
  it("writes a Leads sheet with a header row and one row per lead", async () => {
    const workbook = await readBack(await buildLeadsWorkbook(leads));
    const sheet = workbook.getWorksheet("Leads");

    expect(sheet).toBeDefined();
    expect(sheet?.rowCount).toBe(leads.length + 1); // + header
    expect(sheet?.getRow(1).getCell(1).value).toBe("Lead ID");
    expect(sheet?.columnCount).toBe(LEAD_EXPORT_HEADERS.length);

    const nameCol = LEAD_EXPORT_HEADERS.indexOf("Name") + 1;
    expect(sheet?.getRow(2).getCell(nameCol).value).toBe("Aoife Byrne");

    // Phone numbers must survive as text, not become a number or a formula.
    const phoneCol = LEAD_EXPORT_HEADERS.indexOf("Phone (full)") + 1;
    expect(sheet?.getRow(2).getCell(phoneCol).value).toBe("+353871234567");

    const priceCol = LEAD_EXPORT_HEADERS.indexOf("Agreed price") + 1;
    expect(sheet?.getRow(2).getCell(priceCol).value).toBe(41500);

    const createdCol = LEAD_EXPORT_HEADERS.indexOf("Created") + 1;
    expect(sheet?.getRow(2).getCell(createdCol).value).toBeInstanceOf(Date);
  });

  it("freezes the header row and enables filtering", async () => {
    const workbook = await readBack(await buildLeadsWorkbook(leads));
    const sheet = workbook.getWorksheet("Leads");

    expect(sheet?.views?.[0]).toMatchObject({ state: "frozen", ySplit: 1 });
    expect(sheet?.autoFilter).toBeTruthy();
  });

  it("unflattens activity and documents onto their own sheets", async () => {
    const workbook = await readBack(await buildLeadsWorkbook(leads));

    const activity = workbook.getWorksheet("Activity log");
    expect(activity?.rowCount).toBe(3); // header + 2 history entries
    expect(activity?.getRow(2).getCell(1).value).toBe("lead_1");
    expect(activity?.getRow(2).getCell(6).value).toBe("Called, wants a quote");

    const docs = workbook.getWorksheet("Documents");
    expect(docs?.rowCount).toBe(2); // header + 1 document
    expect(docs?.getRow(2).getCell(3).value).toBe("Auction sheet");
    expect(docs?.getRow(2).getCell(6).value).toBe("https://example.com/a.pdf");
  });

  it("produces a valid workbook when there are no leads", async () => {
    const workbook = await readBack(await buildLeadsWorkbook([]));
    expect(workbook.getWorksheet("Leads")?.rowCount).toBe(1); // header only
    expect(workbook.getWorksheet("Activity log")).toBeDefined();
    expect(workbook.getWorksheet("Documents")).toBeDefined();
  });
});
