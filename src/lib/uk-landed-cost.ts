// Shared types, constants and the pure landed-cost engine for the admin
// Sourcing & Profit tool. Single source of truth used by the calculator page,
// the (future) market-analysis report and any PDF/email export, so the numbers
// never drift.
//
// Every rate and rule here is taken from the validated HMRC-based reference
// "UK Tax Guide for Importing a Car" (current 23 June 2026). Figures are not
// invented — confirm against the live UK Trade Tariff (10-digit commodity code)
// before committing to a purchase. See memory: uk-landed-cost-formula.

// ─── Duty treatment ──────────────────────────────────────────────────────────
// Passenger cars sit under tariff heading 8703. Origin (place of manufacture)
// decides the rate, not the shipping port. A preferential 0% rate is only valid
// with a statement on origin — default to MFN so profit is never overstated.
export type DutyBasis =
  | "japan_cepa" // Japan-built + valid CEPA statement on origin → 0%
  | "fta_zero" // other FTA origin (AU/NZ) with statement → 0%
  | "mfn" // UK Global Tariff default for heading 8703 → 10%
  | "commercial_pickup" // reclassified commercial (e.g. Thai pickups) → 22%
  | "historic"; // 30+ yrs, substantially original, code 9705 → 0%

export const DUTY_RATES: Record<DutyBasis, number> = {
  japan_cepa: 0,
  fta_zero: 0,
  mfn: 0.1,
  commercial_pickup: 0.22,
  historic: 0,
};

export const DUTY_LABELS: Record<DutyBasis, string> = {
  japan_cepa: "Japan CEPA (0% — statement of origin held)",
  fta_zero: "Preferential FTA (0% — statement of origin held)",
  mfn: "Standard MFN (10% — heading 8703)",
  commercial_pickup: "Commercial pickup (22%)",
  historic: "Historic 30+ yrs (0% — code 9705)",
};

// ─── VAT treatment ───────────────────────────────────────────────────────────
// Import VAT is charged on (customs value + duty + freight + insurance). Because
// freight + insurance are already inside the CIF customs value, the VAT base is
// simply CIF_GBP + duty. The duty itself sits inside the VAT base ("tax on a tax").
export type VatBasis =
  | "standard" // 20% on CIF + duty
  | "historic" // effective 5% = 20% on 25% of (CIF + duty), code 9705
  | "relief"; // ToR / Returned Goods Relief / temporary import → 0%

export const STANDARD_VAT_RATE = 0.2;
// Historic relief charges 20% VAT on just 25% of the value → 5% effective.
export const HISTORIC_VAT_FRACTION = 0.25;

export const VAT_LABELS: Record<VatBasis, string> = {
  standard: "Standard import VAT (20%)",
  historic: "Historic relief (effective 5%)",
  relief: "Relieved (ToR / Returned Goods / 0%)",
};

// ─── Post-border default costs (GBP) ─────────────────────────────────────────
// These are incurred AFTER the customs border, so they are excluded from the
// customs value but still form part of the true landed cost. Indicative figures
// from the guide's registration pathway — all editable per run.
export const POST_BORDER_DEFAULTS = {
  dvlaRegistration: 55, // DVLA first registration
  numberPlates: 25, // ~£25 for plates
  approvalTest: 456, // IVA test (£200–£475 range) / MOT for 10yr+
  ivaModifications: 250, // mph speedo, rear fog, beam-pattern adjustment
  ukInlandTransport: 300, // port → premises
} as const;

// ─── Formatters ──────────────────────────────────────────────────────────────
export const fmtGBP = (n: number) =>
  `£${Math.round(n).toLocaleString("en-GB")}`;
export const fmtPct = (n: number) => `${(n * 100).toFixed(2)}%`;

// ─── Salesperson-driven tax resolver ─────────────────────────────────────────
// Sales staff don't know "duty basis"; they know where the car was built, the
// year, whether a statement of origin is obtainable, and the body type. This
// resolver maps those facts to the correct duty/VAT basis using the guide's
// country table (current 23 June 2026). See memory: uk-landed-cost-formula.

export type OriginCountry =
  | "japan"
  | "australia"
  | "new_zealand"
  | "india"
  | "thailand"
  | "other";

export const ORIGIN_COUNTRY_LABELS: Record<OriginCountry, string> = {
  japan: "Japan",
  australia: "Australia",
  new_zealand: "New Zealand",
  india: "India",
  thailand: "Thailand",
  other: "Other / Unknown",
};

// Countries where a statement of origin can unlock a 0% preferential rate.
export const FTA_COUNTRIES: OriginCountry[] = [
  "japan",
  "australia",
  "new_zealand",
];

export interface TaxTreatmentInput {
  country: OriginCountry; // country of MANUFACTURE (not shipping port)
  hasOriginStatement: boolean; // a valid statement of origin is held
  isCommercialPickup: boolean; // single cab / no rear passenger comforts
  vehicleAgeYears: number | null; // for historic relief (30+ yrs)
}

export interface ResolvedTaxTreatment {
  dutyBasis: DutyBasis;
  vatBasis: VatBasis;
  dutyReason: string;
  vatReason: string;
  isHistoric: boolean;
}

export function resolveTaxTreatment(
  input: TaxTreatmentInput,
): ResolvedTaxTreatment {
  const { country, hasOriginStatement, isCommercialPickup, vehicleAgeYears } =
    input;

  // 1. Historic relief — 30+ years, substantially original (HMRC confirms).
  if (vehicleAgeYears != null && vehicleAgeYears >= 30) {
    return {
      dutyBasis: "historic",
      vatBasis: "historic",
      isHistoric: true,
      dutyReason: "30+ years old — collectors' item (code 9705): 0% duty.",
      vatReason:
        "Historic relief — effective 5% VAT (HMRC must confirm original condition).",
    };
  }

  // 2. Commercial-pickup reclassification — overrides origin (22%).
  if (isCommercialPickup) {
    return {
      dutyBasis: "commercial_pickup",
      vatBasis: "standard",
      isHistoric: false,
      dutyReason:
        "Commercial pickup (single cab / no rear passenger comforts): 22% duty.",
      vatReason: "Standard 20% import VAT.",
    };
  }

  // 3. Origin-based duty.
  let dutyBasis: DutyBasis = "mfn";
  let dutyReason =
    "No applicable trade agreement: 10% MFN duty (heading 8703).";
  switch (country) {
    case "japan":
      if (hasOriginStatement) {
        dutyBasis = "japan_cepa";
        dutyReason =
          "Japan-built with a valid CEPA statement of origin: 0% duty.";
      } else {
        dutyReason = "Japan-built but no statement of origin: 10% MFN duty.";
      }
      break;
    case "australia":
    case "new_zealand":
      if (hasOriginStatement) {
        dutyBasis = "fta_zero";
        dutyReason = `${ORIGIN_COUNTRY_LABELS[country]}-origin with a valid statement: 0% duty (FTA).`;
      } else {
        dutyReason = `No ${ORIGIN_COUNTRY_LABELS[country]} origin statement: 10% MFN (most cars from there were built elsewhere).`;
      }
      break;
    case "india":
      dutyReason =
        "UK–India deal not in force until 15 Jul 2026: 10% MFN today (re-check after that date).";
      break;
    case "thailand":
      dutyReason = "No UK–Thailand trade deal: 10% MFN duty.";
      break;
  }

  return {
    dutyBasis,
    vatBasis: "standard",
    isHistoric: false,
    dutyReason,
    vatReason: "Standard 20% import VAT.",
  };
}

// ─── Engine ──────────────────────────────────────────────────────────────────

export interface LandedCostInput {
  // CIF (customs value) components, expressed in `currency`.
  currency: string; // typically "JPY"
  hammerPrice: number; // auction hammer / purchase price
  auctionExportFees: number; // auction + export agent fees
  inlandTransportOrigin: number; // inland transport in the origin country
  oceanFreight: number; // ocean freight to the UK port (the "F" in CIF)
  marineInsurance: number; // marine insurance (the "I" in CIF)

  // GBP per 1 unit of `currency` (e.g. GBP per JPY). HMRC uses its published
  // monthly rate for the official figure; live spot here is indicative.
  fxRate: number;

  dutyBasis: DutyBasis;
  vatBasis: VatBasis;

  // Post-border costs already in GBP.
  dvlaRegistration: number;
  numberPlates: number;
  approvalTest: number;
  ivaModifications: number;
  ukInlandTransport: number;
}

export interface LandedCostResult {
  // CIF
  cifOriginal: number; // CIF in the input currency
  cifGbp: number;

  // Duty
  dutyBasis: DutyBasis;
  dutyRate: number;
  duty: number;

  // VAT
  vatBasis: VatBasis;
  vatEffectiveRate: number; // 0.20, 0.05 or 0
  vatBase: number; // amount VAT is charged on
  vat: number;

  // Post-border
  postBorderTotal: number;

  // Totals
  totalTaxes: number; // duty + VAT
  totalLanded: number; // CIF_GBP + duty + VAT + post-border
  taxPctOfCif: number; // duty + VAT as a fraction of CIF_GBP
}

export function computeLandedCost(input: LandedCostInput): LandedCostResult {
  const cifOriginal =
    input.hammerPrice +
    input.auctionExportFees +
    input.inlandTransportOrigin +
    input.oceanFreight +
    input.marineInsurance;

  const cifGbp = cifOriginal * input.fxRate;

  const dutyRate = DUTY_RATES[input.dutyBasis];
  const duty = cifGbp * dutyRate;

  // VAT base is CIF + duty; the relieved bases scale or zero it.
  const fullVatBase = cifGbp + duty;
  let vatBase: number;
  let vatEffectiveRate: number;
  switch (input.vatBasis) {
    case "historic":
      vatBase = fullVatBase * HISTORIC_VAT_FRACTION;
      vatEffectiveRate = STANDARD_VAT_RATE * HISTORIC_VAT_FRACTION; // 0.05
      break;
    case "relief":
      vatBase = 0;
      vatEffectiveRate = 0;
      break;
    default:
      vatBase = fullVatBase;
      vatEffectiveRate = STANDARD_VAT_RATE;
  }
  const vat = vatBase * STANDARD_VAT_RATE;

  const postBorderTotal =
    input.dvlaRegistration +
    input.numberPlates +
    input.approvalTest +
    input.ivaModifications +
    input.ukInlandTransport;

  const totalTaxes = duty + vat;
  const totalLanded = cifGbp + totalTaxes + postBorderTotal;

  return {
    cifOriginal,
    cifGbp,
    dutyBasis: input.dutyBasis,
    dutyRate,
    duty,
    vatBasis: input.vatBasis,
    vatEffectiveRate,
    vatBase,
    vat,
    postBorderTotal,
    totalTaxes,
    totalLanded,
    taxPctOfCif: cifGbp > 0 ? totalTaxes / cifGbp : 0,
  };
}
