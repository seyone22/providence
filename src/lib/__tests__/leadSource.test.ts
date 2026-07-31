import { describe, expect, it } from "vitest";
import { isLhdLead, LHD_LANDING_PATH, pathnameToSource } from "@/lib/leadSource";

describe("isLhdLead", () => {
  it("matches the LHD landing page path", () => {
    expect(isLhdLead(LHD_LANDING_PATH)).toBe(true);
  });

  it("ignores a trailing slash", () => {
    expect(isLhdLead(`${LHD_LANDING_PATH}/`)).toBe(true);
  });

  it("does not match other landing pages", () => {
    expect(isLhdLead("/b2c")).toBe(false);
    expect(isLhdLead("/japanese-luxury-cars")).toBe(false);
    expect(isLhdLead("/campaigns/japanese-luxury-cars-lhd")).toBe(false);
  });

  it("treats a missing source as not LHD", () => {
    expect(isLhdLead(undefined)).toBe(false);
    expect(isLhdLead("")).toBe(false);
  });
});

describe("pathnameToSource", () => {
  it("still labels known pages after the LHD helpers were added", () => {
    expect(pathnameToSource("/")).toBe("Home Page");
    expect(pathnameToSource("/request")).toBe("Request Page");
    expect(pathnameToSource("/team/abdallah")).toBe("My Profile Page");
    expect(pathnameToSource(LHD_LANDING_PATH)).toBe("Japanese Luxury Cars Lhd");
  });
});
