import { describe, expect, it } from "vitest";
import { COUNTRIES } from "@/lib/countries";
import {
  budgetDigits,
  budgetDisplayValue,
  COUNTRY_CURRENCY,
  CURRENCIES,
  currencyForCountry,
  currencyOptions,
  formatBudget,
  getCurrency,
} from "@/lib/currencies";

describe("country → currency coverage", () => {
  // The budget field is mandatory, so a destination with no currency would
  // leave the customer to find their own in a list of 160. Every country the
  // picker offers has to resolve.
  it("maps every destination the inquiry form offers", () => {
    const unmapped = COUNTRIES.filter((c) => !COUNTRY_CURRENCY[c.n]).map(
      (c) => c.n,
    );
    expect(unmapped).toEqual([]);
  });

  it("only maps to currencies that exist in the picker", () => {
    const codes = new Set(CURRENCIES.map((c) => c.code));
    const dangling = Object.entries(COUNTRY_CURRENCY)
      .filter(([, code]) => !codes.has(code))
      .map(([country, code]) => `${country} → ${code}`);
    expect(dangling).toEqual([]);
  });

  it("has no country key that isn't in the destination list", () => {
    const names = new Set(COUNTRIES.map((c) => c.n));
    const orphans = Object.keys(COUNTRY_CURRENCY).filter((n) => !names.has(n));
    expect(orphans).toEqual([]);
  });

  it("lists no duplicate currency codes", () => {
    const codes = CURRENCIES.map((c) => c.code);
    expect(codes.length).toBe(new Set(codes).size);
  });
});

describe("currencyForCountry", () => {
  it("resolves the destinations we sell to most", () => {
    expect(currencyForCountry("Ireland")).toBe("EUR");
    expect(currencyForCountry("United Kingdom")).toBe("GBP");
    expect(currencyForCountry("Sri Lanka")).toBe("LKR");
    expect(currencyForCountry("United Arab Emirates")).toBe("AED");
    expect(currencyForCountry("New Zealand")).toBe("NZD");
  });

  it("returns empty rather than guessing for an unknown country", () => {
    expect(currencyForCountry("Atlantis")).toBe("");
    expect(currencyForCountry("")).toBe("");
    expect(currencyForCountry(undefined)).toBe("");
  });
});

describe("currencyOptions", () => {
  it("puts the destination's own currency first", () => {
    const opts = currencyOptions("LKR");
    expect(opts[0].value).toBe("LKR");
  });

  it("floats the majors above the long tail", () => {
    const opts = currencyOptions("LKR").map((o) => o.value);
    expect(opts.slice(0, 4)).toEqual(["LKR", "GBP", "EUR", "USD"]);
    expect(opts.indexOf("GBP")).toBeLessThan(opts.indexOf("AFN"));
  });

  it("never repeats a currency, even when it is also a major", () => {
    const opts = currencyOptions("GBP").map((o) => o.value);
    expect(opts.length).toBe(new Set(opts).size);
    expect(opts.length).toBe(CURRENCIES.length);
  });

  it("offers every currency when the destination is unknown", () => {
    expect(currencyOptions().length).toBe(CURRENCIES.length);
  });

  it("labels an option so code, name and symbol are all searchable", () => {
    const gbp = currencyOptions().find((o) => o.value === "GBP");
    expect(gbp?.label).toBe("GBP — British Pound (£)");
  });
});

describe("formatBudget", () => {
  it("prefixes the symbol where the symbol is unambiguous", () => {
    expect(formatBudget(45000, "GBP")).toBe("£45,000");
    expect(formatBudget(45000, "EUR")).toBe("€45,000");
  });

  it("prefixes the code where a bare symbol would be ambiguous", () => {
    expect(formatBudget(250000, "AED")).toBe("AED 250,000");
    expect(formatBudget(12500000, "LKR")).toBe("LKR 12,500,000");
  });

  it("keeps an unknown code rather than dropping it", () => {
    expect(formatBudget(1000, "ZZZ")).toBe("ZZZ 1,000");
  });

  it("renders nothing for a lead with no budget", () => {
    expect(formatBudget(null, "GBP")).toBe("");
    expect(formatBudget(undefined, "GBP")).toBe("");
    expect(formatBudget(Number.NaN, "GBP")).toBe("");
  });
});

describe("getCurrency", () => {
  it("is case-insensitive on the code", () => {
    expect(getCurrency("gbp")?.name).toBe("British Pound");
  });

  it("returns undefined rather than a placeholder", () => {
    expect(getCurrency("ZZZ")).toBeUndefined();
    expect(getCurrency()).toBeUndefined();
  });
});

describe("budget field input", () => {
  it("keeps only digits, so a stray letter or comma can't reach the lead", () => {
    expect(budgetDigits("45,000")).toBe("45000");
    expect(budgetDigits("£45 000")).toBe("45000");
    expect(budgetDigits("about 45k")).toBe("45");
    expect(budgetDigits("abc")).toBe("");
  });

  it("caps the length short of anything that loses precision", () => {
    expect(budgetDigits("1".repeat(20))).toBe("1".repeat(12));
  });

  it("groups the digits for display without touching what's stored", () => {
    expect(budgetDisplayValue("45000")).toBe("45,000");
    expect(budgetDisplayValue("1250000")).toBe("1,250,000");
    expect(budgetDisplayValue("")).toBe("");
  });

  it("round-trips typed input through to a stored number", () => {
    const digits = budgetDigits("45,000");
    expect(budgetDisplayValue(digits)).toBe("45,000");
    expect(Number(digits)).toBe(45000);
  });
});
