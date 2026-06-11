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

// ─── Exchange rates ──────────────────────────────────────────────────────────
// Non-EUR currencies the calculator accepts. Used both to build the live ECB
// request and to fall back gracefully if any single symbol is missing.
export const CALCULATOR_CURRENCIES = [
  "GBP",
  "JPY",
  "AUD",
  "NZD",
  "INR",
  "USD",
] as const;

// Indicative EUR-per-unit rates (i.e. how many EUR one unit of the currency
// buys). Used as the fallback when the live ECB feed is unavailable, and as the
// initial value before the live rates have loaded on the client.
export const FALLBACK_EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  GBP: 1.17,
  JPY: 0.0062,
  AUD: 0.6,
  NZD: 0.55,
  INR: 0.011,
  USD: 0.92,
};

export interface ExchangeRates {
  rates: Record<string, number>; // EUR per 1 unit of currency; always includes EUR: 1
  date: string | null; // ECB reference date (YYYY-MM-DD), or null when falling back
  source: "ecb" | "fallback";
}

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

// ─── OMSP depreciation engine (Revenue VRT Manual, Part 8) ───────────────────
// Revenue derives the OMSP of a used car from its price when new, depreciated by
// age against one of 24 model-specific tables, then adjusted for the month of
// registration, condition and excess mileage. The tables, month adjustments,
// excess-kilometre relief bands and the worked examples below are taken verbatim
// from the Revenue Tax & Duty Manual Part 8 (reviewed April 2026) and verified
// by reproducing all three of its worked examples (see commit notes).
// Source: revenue.ie/.../vehicle-registration-tax/vrt-manual-section-08.pdf

// Age bands, in the order each depreciation table lists its residual-value %.
export const DEPRECIATION_ROWS = [
  "New",
  "m0_1",
  "m1_2",
  "m2_3",
  "m3_6",
  "m6_12",
  "y1",
  "y2",
  "y3",
  "y4",
  "y5",
  "y6",
  "y7",
  "y8",
  "y9",
  "y10",
  "y11",
  "y12",
  "y13_30",
] as const;
export type DepreciationCode =
  | "A1"
  | "A2"
  | "A3"
  | "A4"
  | "A5"
  | "A6"
  | "B1"
  | "B2"
  | "C1"
  | "C2"
  | "D1"
  | "D2"
  | "E1"
  | "E2"
  | "F1"
  | "F2"
  | "G1"
  | "G2"
  | "H1"
  | "H2"
  | "J1"
  | "J2"
  | "K1"
  | "K2";

// Residual value as a % of OMSP-when-new, per age band (DEPRECIATION_ROWS order).
// A* tables hold value best (slow depreciation); K* depreciate fastest.
// biome-ignore format: keep each table on one line so it reads as a row
export const DEPRECIATION_TABLES: Record<DepreciationCode, readonly number[]> = {
  A6: [100, 98.7, 98, 97.2, 97.2, 96, 94, 85, 76, 68, 60, 51, 43, 38, 31, 24, 17, 10, 9],
  A5: [100, 98.7, 98, 97.2, 97.2, 95, 92, 83, 73, 63, 54, 46, 38, 32, 27, 21, 15, 9, 9],
  A4: [100, 98.7, 98, 97.2, 97, 94, 91, 82, 73, 65, 57, 48, 40, 35, 28, 22, 16, 10, 9],
  A3: [100, 98.7, 98, 97.2, 97, 93, 89, 80, 70, 60, 51, 43, 35, 29, 25, 20, 13, 9, 9],
  A2: [100, 98.7, 98, 97.2, 96, 91, 86, 75, 64, 53, 43, 35, 27, 21, 18, 14, 10, 8, 8],
  A1: [100, 98.7, 98, 97.2, 96, 92, 88, 79, 71, 62, 54, 46, 38, 33, 27, 21, 15, 9, 9],
  B1: [100, 98.7, 98, 97.2, 95, 90, 85, 75, 67, 59, 51, 44, 37, 31, 25, 20, 14, 9, 7],
  B2: [100, 98.7, 98, 97.2, 95, 89, 83, 72, 61, 52, 43, 34, 27, 21, 14, 10, 7, 7, 7],
  C1: [100, 98.7, 98, 97.2, 93, 88, 82, 72, 63, 55, 46, 39, 32, 27, 23, 19, 13, 7, 6],
  C2: [100, 98.7, 98, 97.2, 93, 87, 80, 68, 57, 47, 38, 31, 24, 18, 14, 10, 7, 6, 6],
  D1: [100, 98.7, 98, 97.2, 92, 86, 79, 69, 61, 52, 44, 37, 30, 25, 20, 15, 9, 5, 5],
  D2: [100, 98.7, 98, 97.2, 92, 85, 77, 65, 53, 43, 34, 27, 20, 14, 11, 7, 5, 5, 5],
  E1: [100, 98.7, 98, 97.2, 90, 83, 76, 65, 55, 46, 39, 32, 26, 20, 17, 13, 8, 5, 4],
  E2: [100, 98.7, 98, 97.2, 90, 82, 74, 61, 49, 39, 30, 23, 17, 12, 7, 5, 5, 5, 4],
  F1: [100, 98.7, 98, 97.2, 89, 81, 73, 63, 54, 45, 38, 31, 25, 19, 16, 11, 7, 5, 3],
  F2: [100, 98.7, 98, 97.2, 89, 80, 71, 59, 47, 37, 28, 22, 16, 11, 7, 5, 5, 4, 3],
  G1: [100, 98.7, 98, 97.2, 87, 79, 70, 60, 50, 42, 34, 27, 21, 15, 11, 7, 4, 4, 3],
  G2: [100, 98.7, 98, 97.2, 87, 78, 68, 55, 44, 35, 26, 21, 14, 9, 5, 4, 4, 4, 3],
  H1: [100, 98.7, 98, 97.2, 86, 77, 67, 57, 47, 39, 30, 23, 17, 11, 6, 4, 4, 4, 3],
  H2: [100, 98.7, 98, 97.2, 86, 76, 65, 51, 41, 33, 25, 19, 13, 7, 5, 4, 4, 4, 3],
  J1: [100, 98.7, 98, 97.2, 84, 74, 64, 54, 44, 36, 27, 20, 14, 8, 6, 4, 4, 4, 3],
  J2: [100, 98.7, 98, 97.2, 84, 73, 62, 48, 38, 30, 22, 16, 10, 6, 5, 4, 4, 4, 3],
  K1: [100, 98.7, 98, 97.2, 82, 72, 63, 51, 41, 33, 24, 16, 11, 6, 5, 4, 4, 3, 3],
  K2: [100, 98.7, 98, 97.2, 82, 70, 58, 44, 34, 26, 19, 12, 7, 5, 4, 3, 3, 2, 2],
};

// Month-of-registration supplementary adjustment (index 1–12 = Jan–Dec).
// Applies to cars aged 1 year–119 months; in the first calendar-year change
// only Jul–Dec apply (handled in estimateOmsp).
export const MONTHLY_OMSP_ADJUSTMENT: Record<number, number> = {
  1: 0.05,
  2: 0.04,
  3: 0.03,
  4: 0.02,
  5: 0.01,
  6: 0,
  7: 0,
  8: -0.01,
  9: -0.02,
  10: -0.03,
  11: -0.04,
  12: -0.05,
};

export type VehicleCondition = "good" | "fair" | "poor";
export const CONDITION_ADJUSTMENT: Record<VehicleCondition, number> = {
  good: 0,
  fair: 0.05, // 5% OMSP reduction
  poor: 0.1, // 10% OMSP reduction
};

// Plain-language depreciation groups for the public calculator. Each maps to a
// representative Revenue table; the team can override with an exact code.
export const DEPRECIATION_GROUPS: {
  key: string;
  label: string;
  hint: string;
  code: DepreciationCode;
}[] = [
  {
    key: "excellent",
    label: "Holds value exceptionally",
    hint: "Sought-after marques, low-supply performance/4x4",
    code: "A1",
  },
  {
    key: "strong",
    label: "Holds value well",
    hint: "Premium brands, desirable SUVs",
    code: "C1",
  },
  {
    key: "average",
    label: "Average (most cars)",
    hint: "Typical mainstream petrol/diesel/hybrid",
    code: "E1",
  },
  {
    key: "below",
    label: "Depreciates faster",
    hint: "High-supply models, larger engines",
    code: "G1",
  },
  {
    key: "weak",
    label: "Depreciates quickly",
    hint: "Niche, very high mileage segments, some EVs",
    code: "J1",
  },
];

// Pick the residual-value row for a vehicle's age. Revenue uses the calendar-year
// difference for the table row, with sub-year bands inside the first year.
export function depreciationRowForAge(
  ageYears: number,
  ageMonths: number,
): (typeof DEPRECIATION_ROWS)[number] {
  if (ageYears >= 13) return "y13_30";
  if (ageYears >= 1)
    return `y${Math.min(ageYears, 12)}` as (typeof DEPRECIATION_ROWS)[number];
  if (ageMonths < 1) return "New";
  if (ageMonths < 2) return "m0_1";
  if (ageMonths < 3) return "m1_2";
  if (ageMonths <= 3) return "m2_3";
  if (ageMonths <= 6) return "m3_6";
  return "m6_12";
}

// Excess-kilometerage relief (euro reduction), capped at 10% of the depreciated
// value. Standard mileage is 2,100 km/month (diesel) or 1,500 (other), and the
// per-1,600 km relief rate tapers by age bucket.
export function excessKilometerageRelief(
  ageMonths: number,
  fuelType: string,
  mileageKm: number,
  depreciatedValue: number,
): number {
  const standard = (fuelType === "diesel" ? 2100 : 1500) * ageMonths;
  let excess = Math.max(0, mileageKm - standard);
  if (excess <= 0) return 0;
  const rates =
    ageMonths <= 35
      ? [70, 60, 50, 40, 30]
      : ageMonths <= 71
        ? [60, 50, 40, 30, 20]
        : [50, 40, 30, 20, 10];
  let relief = 0;
  for (let i = 0; i < rates.length; i++) {
    const band = i < rates.length - 1 ? 16000 : Number.POSITIVE_INFINITY;
    const inBand = Math.min(excess, band);
    relief += Math.floor(inBand / 1600) * rates[i];
    excess -= inBand;
    if (excess <= 0) break;
  }
  return Math.min(relief, Math.round(depreciatedValue * 0.1));
}

export interface OmspEstimateInput {
  omspNew: number; // top-level OMSP when new (EUR)
  code: DepreciationCode;
  ageYears: number; // calendar-year difference
  ageMonths: number;
  regMonth: number; // month of registration in the State (1–12)
  fuelType: string;
  mileageKm: number;
  condition: VehicleCondition;
}

export interface OmspEstimate {
  omsp: number;
  residualPct: number; // table residual %
  afterDepreciation: number;
  monthlyAdjustmentPct: number;
  conditionReduction: number;
  kmRelief: number;
}

// Estimate the OMSP of a used car following Revenue's documented method.
// Note: optional extras are treated as nil here (the public calculator does not
// ask for them); add them to omspNew if a known extras value should be included.
export function estimateOmsp(p: OmspEstimateInput): OmspEstimate {
  const row = depreciationRowForAge(p.ageYears, p.ageMonths);
  const residualPct =
    DEPRECIATION_TABLES[p.code][DEPRECIATION_ROWS.indexOf(row)];
  const afterDepreciation = p.omspNew * (residualPct / 100);

  // Monthly adjustment: ages 1yr–119mo; in the first calendar-year change only
  // Jul–Dec apply.
  let value = afterDepreciation;
  let monthlyAdjustmentPct = 0;
  const applyMonthly =
    p.ageMonths <= 119 &&
    p.ageYears >= 1 &&
    (p.ageYears >= 2 || p.regMonth >= 7);
  if (applyMonthly) {
    monthlyAdjustmentPct = MONTHLY_OMSP_ADJUSTMENT[p.regMonth] ?? 0;
    value = value * (1 + monthlyAdjustmentPct);
  }

  const capBase = value; // 10% relief cap is on the value before condition & km
  const conditionReduction = value * CONDITION_ADJUSTMENT[p.condition];
  value = value - conditionReduction;

  const kmRelief = excessKilometerageRelief(
    p.ageMonths,
    p.fuelType,
    p.mileageKm,
    capBase,
  );
  value = value - kmRelief;

  return {
    omsp: Math.max(0, Math.round(value)),
    residualPct,
    afterDepreciation,
    monthlyAdjustmentPct,
    conditionReduction,
    kmRelief,
  };
}

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
