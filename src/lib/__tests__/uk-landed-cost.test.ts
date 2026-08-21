import { describe, expect, it } from "vitest";
import {
  AUCTION_FEE_RATE,
  computeLandedCost,
  DUTY_RATES,
  isNearIvaExemption,
  type LandedCostInput,
  maxAuctionPriceForMargin,
  POST_BORDER_BASE,
  POST_BORDER_IVA,
  postBorderForAge,
  resolveTaxTreatment,
  TARGET_MARGIN_PCT,
} from "@/lib/uk-landed-cost";

// A round JPY purchase with an FX rate of exactly 0.005 GBP/JPY, so every
// expected figure below can be checked by hand.
const BASE: LandedCostInput = {
  currency: "JPY",
  hammerPrice: 2_000_000,
  auctionExportFees: 140_000,
  inlandTransportOrigin: 60_000,
  oceanFreight: 400_000,
  marineInsurance: 0,
  fxRate: 0.005,
  dutyBasis: "mfn",
  vatBasis: "standard",
  includeVat: false,
  postBorderTotal: 1800,
};

describe("computeLandedCost", () => {
  it("charges duty on the full CIF value, not a fraction of it", () => {
    const r = computeLandedCost(BASE);

    expect(r.cifOriginal).toBe(2_600_000);
    expect(r.cifGbp).toBe(13_000);
    expect(r.customsValue).toBe(13_000); // full CIF, not 60%
    expect(r.duty).toBe(1_300); // 10% MFN
  });

  it("excludes import VAT when includeVat is false", () => {
    const r = computeLandedCost(BASE);

    expect(r.vatIncluded).toBe(false);
    expect(r.vat).toBe(0);
    expect(r.vatBase).toBe(0);
    expect(r.vatEffectiveRate).toBe(0);
    // CIF 13,000 + duty 1,300 + post-border 1,800
    expect(r.totalLanded).toBe(16_100);
  });

  it("still charges VAT for callers that include it (consumer surfaces)", () => {
    const r = computeLandedCost({ ...BASE, includeVat: true });

    expect(r.vatIncluded).toBe(true);
    expect(r.vatBase).toBe(14_300); // CIF + duty
    expect(r.vat).toBeCloseTo(2_860, 6); // 20%
    expect(r.totalLanded).toBeCloseTo(18_960, 6);
  });

  it("defaults to including VAT when the flag is omitted", () => {
    const { includeVat: _omitted, ...withoutFlag } = BASE;
    expect(computeLandedCost(withoutFlag).vat).toBeGreaterThan(0);
  });

  it("drops duty to zero on the Japan CEPA basis", () => {
    const r = computeLandedCost({ ...BASE, dutyBasis: "japan_cepa" });
    expect(r.duty).toBe(0);
    expect(r.totalLanded).toBe(14_800);
  });
});

describe("resolveTaxTreatment", () => {
  const car = {
    isCommercialPickup: false,
    vehicleAgeYears: 5,
  };

  it("defaults to 10% MFN when no origin statement is held", () => {
    const t = resolveTaxTreatment({
      ...car,
      country: "japan",
      hasOriginStatement: false,
    });
    expect(t.dutyBasis).toBe("mfn");
    expect(DUTY_RATES[t.dutyBasis]).toBe(0.1);
  });

  it("gives 0% only to Japan with a statement of origin", () => {
    const japan = resolveTaxTreatment({
      ...car,
      country: "japan",
      hasOriginStatement: true,
    });
    expect(japan.dutyBasis).toBe("japan_cepa");
    expect(DUTY_RATES[japan.dutyBasis]).toBe(0);
  });

  it("keeps non-Japan origins at 10% even with a statement of origin", () => {
    for (const country of [
      "europe",
      "uk",
      "australia",
      "new_zealand",
    ] as const) {
      const t = resolveTaxTreatment({
        ...car,
        country,
        hasOriginStatement: true,
      });
      expect(t.dutyBasis).toBe("mfn");
    }
  });

  it("reclassifies a commercial pickup at 22% regardless of origin", () => {
    const t = resolveTaxTreatment({
      country: "japan",
      hasOriginStatement: true,
      isCommercialPickup: true,
      vehicleAgeYears: 5,
    });
    expect(DUTY_RATES[t.dutyBasis]).toBe(0.22);
  });

  it("treats a 30+ year old car as historic (0% duty)", () => {
    const t = resolveTaxTreatment({
      country: "other",
      hasOriginStatement: false,
      isCommercialPickup: false,
      vehicleAgeYears: 32,
    });
    expect(t.isHistoric).toBe(true);
    expect(DUTY_RATES[t.dutyBasis]).toBe(0);
  });
});

describe("postBorderForAge", () => {
  it("adds the IVA allowance for a car under 10 years old", () => {
    expect(postBorderForAge(6)).toBe(POST_BORDER_BASE + POST_BORDER_IVA);
  });

  it("drops the IVA allowance at 10 years and over", () => {
    expect(postBorderForAge(10)).toBe(POST_BORDER_BASE);
    expect(postBorderForAge(15)).toBe(POST_BORDER_BASE);
  });

  it("lets the operator waive IVA on a car that will turn 10 in transit", () => {
    expect(postBorderForAge(9, { waiveIva: true })).toBe(POST_BORDER_BASE);
    expect(postBorderForAge(9)).toBe(POST_BORDER_BASE + POST_BORDER_IVA);
  });

  it("assumes IVA applies when the age is unknown", () => {
    expect(postBorderForAge(null)).toBe(POST_BORDER_BASE + POST_BORDER_IVA);
  });
});

describe("isNearIvaExemption", () => {
  it("offers the waiver only in the year before the exemption", () => {
    expect(isNearIvaExemption(9)).toBe(true);
    expect(isNearIvaExemption(8)).toBe(false);
    expect(isNearIvaExemption(10)).toBe(false);
    expect(isNearIvaExemption(null)).toBe(false);
  });
});

describe("maxAuctionPriceForMargin", () => {
  const input = {
    targetMarginPct: TARGET_MARGIN_PCT,
    resaleGbp: 26_000,
    postBorderTotal: 1_800,
    dutyRate: 0.1,
    vatEffectiveRate: 0,
    fxRate: 0.005,
    otherCifCosts: 460_000, // inland + freight + insurance, JPY
    auctionFeeRate: AUCTION_FEE_RATE,
  };

  it("back-solves a hammer price that lands exactly on the target margin", () => {
    const r = maxAuctionPriceForMargin(input);
    expect(r.achievable).toBe(true);
    expect(r.maxLandedGbp).toBeCloseTo(20_000, 6); // 26,000 / 1.30

    // Feeding the ceiling bid back through the engine must reproduce the target.
    const landed = computeLandedCost({
      currency: "JPY",
      hammerPrice: r.maxHammer,
      auctionExportFees: r.maxHammer * AUCTION_FEE_RATE,
      inlandTransportOrigin: 460_000,
      oceanFreight: 0,
      marineInsurance: 0,
      fxRate: 0.005,
      dutyBasis: "mfn",
      vatBasis: "standard",
      includeVat: false,
      postBorderTotal: 1_800,
    });
    expect(landed.totalLanded).toBeCloseTo(20_000, 6);
    const marginPct =
      (input.resaleGbp - landed.totalLanded) / landed.totalLanded;
    expect(marginPct).toBeCloseTo(TARGET_MARGIN_PCT, 10);
  });

  it("round-trips with VAT included too", () => {
    const r = maxAuctionPriceForMargin({ ...input, vatEffectiveRate: 0.2 });
    const landed = computeLandedCost({
      currency: "JPY",
      hammerPrice: r.maxHammer,
      auctionExportFees: r.maxHammer * AUCTION_FEE_RATE,
      inlandTransportOrigin: 460_000,
      oceanFreight: 0,
      marineInsurance: 0,
      fxRate: 0.005,
      dutyBasis: "mfn",
      vatBasis: "standard",
      includeVat: true,
      postBorderTotal: 1_800,
    });
    expect(landed.totalLanded).toBeCloseTo(20_000, 6);
  });

  it("reports the target as unreachable when fixed costs eat the budget", () => {
    const r = maxAuctionPriceForMargin({ ...input, resaleGbp: 4_000 });
    expect(r.achievable).toBe(false);
    expect(r.maxHammer).toBe(0);
  });

  it("returns nothing usable without a resale price or an FX rate", () => {
    expect(
      maxAuctionPriceForMargin({ ...input, resaleGbp: 0 }).achievable,
    ).toBe(false);
    expect(maxAuctionPriceForMargin({ ...input, fxRate: 0 }).achievable).toBe(
      false,
    );
  });
});
