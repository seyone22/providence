// Mounts the calculator for real, drives a stubbed crawl through it, and reads
// the summary panel out of the live DOM. This is the guard on the arithmetic the
// operator actually sees: the desk-s UK cost lines, resale taken net of VAT, the
// profit that follows, and the ceiling bid moving with the minimum ROI.
import { act } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

(
  globalThis as never as { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const analyzeMarket = vi.fn();

vi.mock("@/actions/sourcing-actions", () => ({
  analyzeMarket: (...a: unknown[]) => analyzeMarket(...a),
  extractAuctionSheet: vi.fn(),
  getUsageBudget: vi.fn(async () => ({ success: false })),
  getVerdict: vi.fn(),
  saveSourcingAnalysis: vi.fn(),
}));
vi.mock("@/actions/sourcing-pdf-actions", () => ({
  generateSourcingPdf: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  }),
}));

const LandedCostClient = (await import("../LandedCostClient")).default;

// The workbook's own scenario: a 2015 BMW 1 Series, 600,000 JPY hammer at
// 216.72, 400,000 freight, sold against a 10,550 UK median.
const LISTING = (price: number) => ({
  source: "autotrader",
  make: "BMW",
  model: "1 Series",
  trim: "118i M Sport",
  year: 2015,
  mileage: 20_000,
  price,
  url: `https://example.test/${price}`,
});

const MARKET = {
  listings: [8_495, 9_350, 11_749, 12_600].map(LISTING),
  allListings: [],
  stats: { count: 4 },
  totalScraped: 64,
  totalAfterClean: 59,
  totalMatched: 4,
  sources: ["autotrader"],
  matchUsed: "±1yr · ±20% mileage",
};

let container: HTMLDivElement;
// biome-ignore lint/suspicious/noExplicitAny: test harness
let root: any;

function text() {
  return container.textContent ?? "";
}

function setInput(label: string, value: string) {
  const field = Array.from(container.querySelectorAll("label")).find((l) =>
    l.textContent?.trim().startsWith(label),
  );
  const input = field?.parentElement?.querySelector("input");
  if (!input) throw new Error(`no input for "${label}"`);
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

// Tick a checkbox by the label text it sits inside.
function checkByLabel(t: string) {
  const label = Array.from(container.querySelectorAll("label")).find((l) =>
    l.textContent?.includes(t),
  );
  const box = label?.querySelector<HTMLInputElement>("input[type=checkbox]");
  if (!box) throw new Error(`no checkbox "${t}"`);
  box.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

// Type into an input addressed by its aria-label (no <label> wrapper).
function setAriaInput(label: string, value: string) {
  const input = container.querySelector<HTMLInputElement>(
    `input[aria-label="${label}"]`,
  );
  if (!input) throw new Error(`no input labelled "${label}"`);
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function clickByText(t: string) {
  const el = Array.from(container.querySelectorAll("button")).find((b) =>
    b.textContent?.includes(t),
  );
  if (!el) throw new Error(`no button "${t}"`);
  el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

beforeEach(async () => {
  analyzeMarket.mockResolvedValue({ success: true, data: MARKET });
  container = document.createElement("div");
  document.body.appendChild(container);
  await act(async () => {
    root = createRoot(container);
    root.render(
      <LandedCostClient
        fx={{ rates: { JPY: 1 / 216.72 }, asOf: "2026-08-23" } as never}
        usage={{ success: false } as never}
      />,
    );
  });
});

describe("Sourcing panel, end to end", () => {
  it("shows the workbook's landed cost, net resale, PNL and ceiling bid", async () => {
    await act(async () => {
      setInput("Make", "BMW");
      setInput("Model", "1 Series");
      setInput("Year", "2015");
      setInput("Auction hammer / purchase price", "600000");
    });

    // 2015 is 11 years old in 2026 → IVA falls away, UK costs = £1,360.
    expect(text()).toContain("Total UK costs (no IVA)");
    expect(text()).toContain("£1,360");
    // CIF 1,042,000 JPY → £4,808 + £481 duty + £1,360 = £6,649.
    expect(text()).toContain("£6,649");

    await act(async () => clickByText("rawl market listings"));

    // Median of 8,495 / 9,350 / 11,749 / 12,600 = £10,550 (VAT-inclusive).
    expect(text()).toContain("£10,550");
    // ÷ 1.2 = £8,791 net resale (the true median is £10,549.50).
    expect(text()).toContain("Median resale (ex VAT)");
    expect(text()).toContain("£8,791");
    // Profit = 8,791 − 6,649 = £2,142 at 32.2% ROI.
    expect(text()).toContain("Profit after all costs");
    expect(text()).toContain("£2,142");
    expect(text()).toContain("32.2% ROI");
    // Ceiling bid at the default 30%.
    expect(text()).toContain("Max auction bid for 30% ROI");
    expect(text()).toContain("620,926");
    expect(text()).toContain("Clears the 30% minimum ROI");
  });

  it("totals the cost lines into one figure on the summary card", async () => {
    await act(async () => {
      setInput("Make", "BMW");
      setInput("Model", "1 Series");
      setInput("Year", "2015");
      setInput("Auction hammer / purchase price", "600000");
    });

    // The operator should never have to add CIF + duty + UK costs by hand.
    const card = container.textContent ?? "";
    expect(card).toContain("Total cost");
    expect(card).toContain("CIF + duty + UK costs, all in");
    // £4,808 CIF + £481 duty + £1,360 UK = £6,649, stated as its own line.
    expect(card.match(/£6,649/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  it("drives every figure from a manually overridden median", async () => {
    await act(async () => {
      setInput("Make", "BMW");
      setInput("Model", "1 Series");
      setInput("Year", "2015");
      setInput("Auction hammer / purchase price", "600000");
    });
    await act(async () => clickByText("rawl market listings"));

    // The scraped median is £10,550; the desk knows this car retails at £14,400.
    await act(async () => checkByLabel("Set the median myself"));
    await act(async () => setAriaInput("Manual median", "14400"));

    // Net resale 14,400 ÷ 1.2 = £12,000, and the scraped figure is still shown.
    expect(text()).toContain("£12,000");
    expect(text()).toContain("Median (manual)");
    expect(text()).toContain("scraped £10,550");
    // Profit = 12,000 − 6,649 = £5,351 at 80.5% ROI, so the car now clears 30%.
    expect(text()).toContain("£5,351");
    expect(text()).toContain("80.5% ROI");
    expect(text()).toContain("Clears the 30% minimum ROI");
    // The ceiling bid re-solves off the manual number, so the old one is gone.
    expect(text()).not.toContain("620,926");
  });

  it("re-solves everything when the minimum ROI is raised to 35%", async () => {
    await act(async () => {
      setInput("Make", "BMW");
      setInput("Model", "1 Series");
      setInput("Year", "2015");
      setInput("Auction hammer / purchase price", "600000");
    });
    await act(async () => clickByText("rawl market listings"));
    await act(async () => setInput("Minimum ROI", "35"));

    expect(text()).toContain("Max auction bid for 35% ROI");
    // A higher bar means a lower ceiling bid and a car that no longer clears.
    expect(text()).not.toContain("620,926");
    expect(text()).toContain("Below the 35% minimum ROI");
    expect(text()).toContain("below the 35% target");
  });

  it("adds the IVA block back for a car inside the scheme", async () => {
    await act(async () => {
      setInput("Make", "BMW");
      setInput("Model", "1 Series");
      setInput("Year", "2022");
    });
    expect(text()).toContain("Total UK costs (incl. IVA)");
    expect(text()).toContain("£2,560");
    expect(text()).toContain("IVA test required — adds £1,200");
  });
});
