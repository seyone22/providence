// Shared types, constants and the pure landed-cost engine for the admin
// Sourcing & Profit tool. Single source of truth used by the calculator page,
// the market-analysis report and any PDF/email export, so the numbers never
// drift.
//
// Every rate and rule here is taken from the validated HMRC-based reference
// "UK Tax Guide for Importing a Car" (current 23 June 2026), except where a
// business directive deliberately overrides it — those are called out inline.
// Figures are not invented — confirm against the live UK Trade Tariff (10-digit
// commodity code) before committing to a purchase.
// See memory: uk-landed-cost-formula. Full methodology:
// sourcing-analyzer-methodology.md at the repo root.

// ─── Duty treatment ──────────────────────────────────────────────────────────
// Passenger cars sit under tariff heading 8703. Origin (place of manufacture)
// decides the rate, not the shipping port. Business directive: the only
// preferential 0% we underwrite is Japan CEPA with a statement of origin in
// hand — every other origin is priced at the 10% MFN default so profit is never
// overstated on a preference we can't evidence.
export type DutyBasis =
  | "japan_cepa" // Japan-built + valid CEPA statement on origin → 0%
  | "mfn" // UK Global Tariff default for heading 8703 → 10%
  | "commercial_pickup" // reclassified commercial (e.g. Thai pickups) → 22%
  | "historic"; // 30+ yrs, substantially original, code 9705 → 0%

export const DUTY_RATES: Record<DutyBasis, number> = {
  japan_cepa: 0,
  mfn: 0.1,
  commercial_pickup: 0.22,
  historic: 0,
};

export const DUTY_LABELS: Record<DutyBasis, string> = {
  japan_cepa: "Japan CEPA (0% — statement of origin held)",
  mfn: "Standard MFN (10% — heading 8703)",
  commercial_pickup: "Commercial pickup (22%)",
  historic: "Historic 30+ yrs (0% — code 9705)",
};

// ─── VAT treatment ───────────────────────────────────────────────────────────
// Import VAT is charged on (customs value + duty + freight + insurance). Because
// freight + insurance are already inside the CIF customs value, the VAT base is
// simply CIF_GBP + duty. The duty itself sits inside the VAT base ("tax on a tax").
//
// The sourcing analyzer sets `includeVat: false` (see LandedCostInput): a
// VAT-registered importer reclaims import VAT as input tax, so it is cash-flow
// rather than cost, and carrying it into the landed figure understates margin.
// Consumer-facing surfaces (e.g. LandedCostBar) leave VAT in, because a private
// buyer genuinely pays it.
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

// ─── Post-border UK costs (GBP) ──────────────────────────────────────────────
// Incurred AFTER the customs border, so outside the customs value but inside the
// true landed cost. The line items and the figures are the desk's own — they are
// taken from the "JPY Imports Calculator" workbook, which is the operational
// source of truth for what a car actually costs to land and register here.
//
// Two groups. The base costs land on every car; the IVA costs land only on a car
// that has to sit the Individual Vehicle Approval test.
export const POST_BORDER_BASE_ITEMS = {
  clearanceAdmin: 600, // clearing agent + import admin
  ukInlandTransport: 300, // port → premises
  dvlaRegistration: 55, // DVLA first registration
  roadTax: 205, // first-year VED
  miscellaneous: 200, // plates, valet, sundries
} as const;

export const POST_BORDER_IVA_ITEMS = {
  ivaInspection: 900, // the IVA test itself
  ivaTransport: 300, // transport to and from the test centre
} as const;

export type PostBorderBaseKey = keyof typeof POST_BORDER_BASE_ITEMS;
export type PostBorderIvaKey = keyof typeof POST_BORDER_IVA_ITEMS;

const sumItems = (o: Record<string, number>) =>
  Object.values(o).reduce((a, b) => a + b, 0);

// £1,360 base; +£1,200 when the IVA test applies → £2,560 all-in.
export const POST_BORDER_BASE = sumItems(POST_BORDER_BASE_ITEMS);
export const POST_BORDER_IVA = sumItems(POST_BORDER_IVA_ITEMS);

export const POST_BORDER_LABELS: Record<
  PostBorderBaseKey | PostBorderIvaKey,
  string
> = {
  clearanceAdmin: "Clearance / admin",
  ukInlandTransport: "UK inland transport",
  dvlaRegistration: "DVLA registration",
  roadTax: "Road tax (first-year VED)",
  miscellaneous: "Miscellaneous",
  ivaInspection: "IVA inspection",
  ivaTransport: "IVA transport",
};

// A vehicle 10 years or older is outside the IVA scheme — an MOT does instead.
export const IVA_EXEMPT_AGE = 10;

// A car bought at 9-and-a-bit years usually clears customs and is registered
// after its 10th birthday, by which point the IVA requirement has fallen away.
// From this age the operator gets an explicit prompt to drop it — it is a
// judgement call about the clearance timeline, so it is never applied silently.
export const IVA_WAIVER_FROM_AGE = 9;

export function isNearIvaExemption(ageYears: number | null): boolean {
  return (
    ageYears != null &&
    ageYears >= IVA_WAIVER_FROM_AGE &&
    ageYears < IVA_EXEMPT_AGE
  );
}

// Does this car need an IVA test, on age alone? An unknown year assumes it does,
// so the cost is never quietly dropped. The operator can override.
export function ivaRequiredForAge(ageYears: number | null): boolean {
  return ageYears == null || ageYears < IVA_EXEMPT_AGE;
}

// Customs valuation basis: duty is computed on the full CIF value, per the HMRC
// guide. (An earlier business directive charged it on 60% of CIF; that override
// was reverted — this constant stays as the single knob if it ever returns.)
export const CUSTOMS_VALUE_FRACTION = 1;

// Default ocean freight for one car, in JPY (business directive). Editable per
// shipment in the calculator.
export const DEFAULT_OCEAN_FREIGHT_JPY = 400_000;

// Auction house + export agent fees, as a fraction of the hammer price. The
// calculator auto-fills this and lets the operator override it per lot.
export const AUCTION_FEE_RATE = 0.07;

// Minimum gross margin, as a fraction of landed cost, that a car must clear for
// the analyzer to call it worth sourcing (business directive).
export const TARGET_MARGIN_PCT = 0.3;

// The operator can raise or lower the target per run (a thinner car might be
// worth 25%, a riskier one might need 35%), within sane bounds so a typo can't
// silently make every car look like a buy.
export const MIN_TARGET_MARGIN_PCT = 0;
export const MAX_TARGET_MARGIN_PCT = 2; // 200%

export function clampTargetMargin(pct: number): number {
  if (!Number.isFinite(pct)) return TARGET_MARGIN_PCT;
  return Math.min(MAX_TARGET_MARGIN_PCT, Math.max(MIN_TARGET_MARGIN_PCT, pct));
}

// ─── Resale price: taking the VAT back out ───────────────────────────────────
// Scraped UK forecourt listings are advertised VAT-inclusive. The landed cost on
// this page deliberately excludes import VAT (the importer reclaims it), so
// comparing a gross asking price against a net cost would overstate every margin
// by the VAT fraction. Divide the market price by 1 + VAT to get the net revenue
// the sale actually earns, and compare like with like.
export const RESALE_VAT_DIVISOR = 1 + STANDARD_VAT_RATE; // 1.2

export function resaleExVat(grossGbp: number): number {
  return grossGbp / RESALE_VAT_DIVISOR;
}

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
  | "europe"
  | "uk"
  | "australia"
  | "new_zealand"
  | "india"
  | "thailand"
  | "other";

export const ORIGIN_COUNTRY_LABELS: Record<OriginCountry, string> = {
  japan: "Japan",
  europe: "Europe (EU)",
  uk: "UK",
  australia: "Australia",
  new_zealand: "New Zealand",
  india: "India",
  thailand: "Thailand",
  other: "Other / Unknown",
};

// Origins where holding a statement of origin actually changes the duty rate.
// Japan only: CEPA is the one preference the desk underwrites, so it is the only
// origin the calculator asks the statement-of-origin question for.
export const ORIGIN_STATEMENT_COUNTRIES: OriginCountry[] = ["japan"];

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
  //    This is a classification (code 9705), not a trade preference, so it
  //    applies whatever the origin.
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

  // 3. Origin-based duty. Default is 10% MFN for everything; Japan with a CEPA
  //    statement of origin is the only route to 0%.
  let dutyBasis: DutyBasis = "mfn";
  let dutyReason = "Standard 10% MFN duty (heading 8703).";
  if (country === "japan") {
    if (hasOriginStatement) {
      dutyBasis = "japan_cepa";
      dutyReason =
        "Japan-built with a valid CEPA statement of origin: 0% duty.";
    } else {
      dutyReason = "Japan-built but no statement of origin: 10% MFN duty.";
    }
  } else {
    dutyReason = `${ORIGIN_COUNTRY_LABELS[country]}-origin: 10% MFN duty (no preference underwritten outside Japan CEPA).`;
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

  // Whether import VAT forms part of the landed cost. Defaults to true (a
  // private buyer pays it). The sourcing analyzer passes false because a
  // VAT-registered importer reclaims it, so including it understates margin.
  includeVat?: boolean;

  // Total post-border (UK-side) costs in GBP — computed by the caller, either
  // the age-based default or the detailed breakdown.
  postBorderTotal: number;
}

export interface LandedCostResult {
  // CIF
  cifOriginal: number; // CIF in the input currency
  cifGbp: number;
  customsValue: number; // valuation basis duty is charged on (full CIF)

  // Duty
  dutyBasis: DutyBasis;
  dutyRate: number;
  duty: number;

  // VAT
  vatIncluded: boolean; // false = excluded from the landed figure entirely
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

// The multiplier that turns a CIF figure (GBP) into CIF + duty + VAT, for the
// given rates. Landed cost is linear in CIF, which is what lets
// `maxAuctionPriceForMargin` invert the engine exactly rather than by search.
export function cifToTaxedMultiplier(
  dutyRate: number,
  vatEffectiveRate: number,
): number {
  const f = CUSTOMS_VALUE_FRACTION;
  // duty = CIF·f·d ; vat = (CIF·f + duty)·r = CIF·f·(1+d)·r
  return 1 + f * dutyRate + f * (1 + dutyRate) * vatEffectiveRate;
}

// Effective VAT rate for a basis, before the `includeVat` switch.
function vatRateFor(basis: VatBasis): number {
  switch (basis) {
    case "historic":
      return STANDARD_VAT_RATE * HISTORIC_VAT_FRACTION; // 0.05
    case "relief":
      return 0;
    default:
      return STANDARD_VAT_RATE;
  }
}

export function computeLandedCost(input: LandedCostInput): LandedCostResult {
  const includeVat = input.includeVat !== false;

  const cifOriginal =
    input.hammerPrice +
    input.auctionExportFees +
    input.inlandTransportOrigin +
    input.oceanFreight +
    input.marineInsurance;

  const cifGbp = cifOriginal * input.fxRate;

  // Duty is charged on the customs valuation basis (the full CIF).
  const customsValue = cifGbp * CUSTOMS_VALUE_FRACTION;

  const dutyRate = DUTY_RATES[input.dutyBasis];
  const duty = customsValue * dutyRate;

  // VAT base is customs value + duty; the relieved bases scale or zero it.
  const vatEffectiveRate = includeVat ? vatRateFor(input.vatBasis) : 0;
  const vatBase =
    !includeVat || input.vatBasis === "relief"
      ? 0
      : input.vatBasis === "historic"
        ? (customsValue + duty) * HISTORIC_VAT_FRACTION
        : customsValue + duty;
  const vat = includeVat ? vatBase * STANDARD_VAT_RATE : 0;

  const postBorderTotal = input.postBorderTotal;

  const totalTaxes = duty + vat;
  const totalLanded = cifGbp + totalTaxes + postBorderTotal;

  return {
    cifOriginal,
    cifGbp,
    customsValue,
    dutyBasis: input.dutyBasis,
    dutyRate,
    duty,
    vatIncluded: includeVat,
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

// ─── Reverse engine: the most we can bid and still hit the margin ────────────
// Given what the car sells for in the UK, work backwards through post-border
// costs, duty/VAT and FX to the biggest hammer price that still clears the
// target margin. This is the number a bidder actually needs in the room.
//
// margin% is measured against landed cost (the same definition the verdict
// uses), so: resale = landed × (1 + target) ⇒ landed = resale ÷ (1 + target).

export interface MaxAuctionPriceInput {
  targetMarginPct: number; // e.g. 0.30
  resaleGbp: number; // the price we expect to sell at (market median)
  postBorderTotal: number; // GBP, UK-side costs
  dutyRate: number;
  vatEffectiveRate: number; // 0 when VAT is excluded from landed cost
  fxRate: number; // GBP per 1 unit of the auction currency
  // Non-hammer CIF components in the auction currency: inland transport, ocean
  // freight, marine insurance — plus auction/export fees when those are entered
  // as a fixed amount rather than derived from the hammer.
  otherCifCosts: number;
  // Auction/export fees as a fraction of the hammer price, when they scale with
  // it. Pass 0 if the fee is already inside `otherCifCosts`.
  auctionFeeRate: number;
}

export interface MaxAuctionPriceResult {
  maxLandedGbp: number; // landed cost that exactly hits the target margin
  maxCifGbp: number;
  maxCifOriginal: number; // CIF in the auction currency
  maxHammer: number; // hammer price in the auction currency (0 if impossible)
  achievable: boolean; // false = the target is unreachable even at a £0 hammer
}

export function maxAuctionPriceForMargin(
  input: MaxAuctionPriceInput,
): MaxAuctionPriceResult {
  const empty: MaxAuctionPriceResult = {
    maxLandedGbp: 0,
    maxCifGbp: 0,
    maxCifOriginal: 0,
    maxHammer: 0,
    achievable: false,
  };
  if (!(input.resaleGbp > 0) || !(input.fxRate > 0)) return empty;

  const maxLandedGbp = input.resaleGbp / (1 + input.targetMarginPct);
  const multiplier = cifToTaxedMultiplier(
    input.dutyRate,
    input.vatEffectiveRate,
  );
  const maxCifGbp = (maxLandedGbp - input.postBorderTotal) / multiplier;
  if (maxCifGbp <= 0) return { ...empty, maxLandedGbp };

  const maxCifOriginal = maxCifGbp / input.fxRate;
  const maxHammer =
    (maxCifOriginal - input.otherCifCosts) / (1 + input.auctionFeeRate);

  if (maxHammer <= 0) {
    return {
      maxLandedGbp,
      maxCifGbp,
      maxCifOriginal,
      maxHammer: 0,
      achievable: false,
    };
  }
  return {
    maxLandedGbp,
    maxCifGbp,
    maxCifOriginal,
    maxHammer,
    achievable: true,
  };
}
