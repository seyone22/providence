import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  deriveFbc,
  hashData,
  hashGoogleEmail,
  hashPhone,
} from "@/lib/conversions";

/** What Meta/Google should be receiving for a given already-normalised value. */
function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

describe("hashData", () => {
  it("trims and lowercases before hashing, per Meta's rule", () => {
    expect(hashData("  Rakeez@Example.COM ")).toBe(
      sha256("rakeez@example.com"),
    );
  });

  // The old implementation returned "" for a missing value, and the caller
  // sent it as em: [""] — a hash of nothing, which matches nobody and drags
  // down Event Match Quality. Omitting the field is the documented behaviour.
  it("returns null rather than a hash of the empty string", () => {
    expect(hashData("")).toBeNull();
    expect(hashData(null)).toBeNull();
    expect(hashData(undefined)).toBeNull();
  });
});

describe("hashPhone", () => {
  // The bug: "+44" + "07700900123" stripped of non-digits gives 4407700900123,
  // a number that exists nowhere. Meta requires the leading zero to go.
  it("drops the national trunk zero before prepending the dial code", () => {
    expect(hashPhone("+44", "07700 900123")).toBe(sha256("447700900123"));
  });

  it("handles a dial code stored without its plus", () => {
    expect(hashPhone("44", "07700900123")).toBe(sha256("447700900123"));
  });

  it("leaves a number the customer already typed in full alone", () => {
    expect(hashPhone("+44", "+44 7700 900123")).toBe(sha256("447700900123"));
    expect(hashPhone("+44", "0044 7700 900123")).toBe(sha256("447700900123"));
  });

  it("strips spaces, dashes and parentheses", () => {
    expect(hashPhone("1", "(650) 555-1212")).toBe(sha256("16505551212"));
  });

  it("does not fabricate a number it cannot make sense of", () => {
    expect(hashPhone("+44", "")).toBeNull();
    // Nothing left once the trunk zeros come off.
    expect(hashPhone("+44", "0")).toBeNull();
    expect(hashPhone(null, null)).toBeNull();
    // Too short to be a dialable number even with a country code.
    expect(hashPhone("", "12345")).toBeNull();
  });

  it("rejects anything longer than E.164 allows", () => {
    expect(hashPhone("44", "1234567890123456789")).toBeNull();
  });

  it("still accepts the single already-joined argument the old code passed", () => {
    expect(hashPhone("447700900123")).toBe(sha256("447700900123"));
  });
});

describe("hashGoogleEmail", () => {
  // Google's rule applies to Gmail only. Applying it everywhere, or nowhere,
  // silently loses matches.
  it("strips dots and plus-suffixes for gmail addresses", () => {
    expect(hashGoogleEmail("Ra.Keez+cars@gmail.com")).toBe(
      sha256("rakeez@gmail.com"),
    );
    expect(hashGoogleEmail("ra.keez@googlemail.com")).toBe(
      sha256("rakeez@googlemail.com"),
    );
  });

  it("leaves other domains exactly as they are", () => {
    expect(hashGoogleEmail("ra.keez+cars@providenceauto.uk.com")).toBe(
      sha256("ra.keez+cars@providenceauto.uk.com"),
    );
  });

  it("returns null for anything that is not an address", () => {
    expect(hashGoogleEmail("")).toBeNull();
    expect(hashGoogleEmail("nope")).toBeNull();
    expect(hashGoogleEmail("@gmail.com")).toBeNull();
    expect(hashGoogleEmail("+cars@gmail.com")).toBeNull();
  });
});

describe("deriveFbc", () => {
  it("prefers a real _fbc cookie when we captured one", () => {
    expect(deriveFbc("fb.1.123.AbC", "XyZ", new Date(0))).toBe("fb.1.123.AbC");
  });

  // Most leads arrive before any pixel has written the cookie, so the raw
  // fbclid is all we have — and it is enough to rebuild the click id.
  it("rebuilds the click id from a bare fbclid", () => {
    const at = new Date("2026-08-28T00:00:00.000Z");
    expect(deriveFbc(null, "XyZ123", at)).toBe(`fb.1.${at.getTime()}.XyZ123`);
  });

  it("gives up when there is neither", () => {
    expect(deriveFbc(null, null, new Date())).toBeNull();
  });
});
