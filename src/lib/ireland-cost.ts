// Shared types, labels and formatters for the Ireland Landed Cost Calculator.
// Single source of truth used by the calculator page, the PDF server action
// and the breakdown email template so the numbers and wording never drift.

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const FUEL_LABELS: Record<string, string> = {
  ev: "Electric (EV)",
  hybrid: "Hybrid",
  petrol: "Petrol",
  diesel: "Diesel",
};

export const SOURCE_LABELS: Record<string, string> = {
  japan: "Japan",
  uk_gb: "UK / Great Britain",
  eu: "EU (Germany, France…)",
  northern_ireland: "Northern Ireland",
  india: "India",
  australia: "Australia",
  new_zealand: "New Zealand",
};

export const MFR_LABELS: Record<string, string> = {
  japan: "Japan (EU–Japan EPA)",
  uk: "United Kingdom (EU–UK TCA)",
  eu: "EU-built",
  other: "Other / Unknown",
};

// Compute whole months between a first-registration year/month and a reference
// date ("now" by default). Floored at 0 so a future date never returns negative.
export function ageInMonths(
  yearFirstReg: number,
  monthFirstReg: number,
  now: { year: number; month: number },
): number {
  const months = (now.year - yearFirstReg) * 12 + (now.month - monthFirstReg);
  return Math.max(0, months);
}

export const fmtEUR = (n: number) =>
  `€${Math.round(n).toLocaleString("en-IE")}`;
export const fmtPct = (n: number) => `${(n * 100).toFixed(2)}%`;

// Fully-resolved breakdown passed from the client to the PDF/email server
// actions. Plain serializable values only (server action argument).
export interface BreakdownData {
  generatedAt: string; // human-readable timestamp

  // Vehicle
  fuelType: string;
  yearFirstReg: number;
  monthFirstReg: number; // 1–12
  ageMonths: number;
  mileageKm: number;
  effectiveCO2: number;
  co2Standard: string;
  noxValue: number;
  sourceCountry: string;
  countryOfManufacture: string;

  // Money (EUR unless noted)
  currency: string;
  purchasePriceOriginal: number;
  priceEUR: number;
  shippingCost: number;
  cifValue: number;
  dutyRate: number;
  customsDuty: number;
  vatNeeded: boolean;
  vatBase: number;
  vatAmount: number;
  isClassic: boolean;
  isEV: boolean;
  vrtRate: number;
  vrtAmount: number;
  noxLevy: number;
  evRelief: number;
  omsp: number;
  totalTaxes: number;
  totalLanded: number;
  taxPct: number;
}
