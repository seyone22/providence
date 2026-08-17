import { describe, expect, it } from "vitest";
import { GLOBE_PLACES, GLOBE_PLACES_BY_ID, GLOBE_ROUTES } from "@/config/globe";

/**
 * The registry validates itself at import time, so simply importing it above is
 * already the main assertion: a duplicate id, an out-of-range coordinate or a
 * route pointing at a place that doesn't exist throws before these tests run.
 * What's left is to pin the invariants a future edit could plausibly break.
 */
describe("globe registry", () => {
  it("indexes every place exactly once", () => {
    expect(GLOBE_PLACES_BY_ID.size).toBe(GLOBE_PLACES.length);
  });

  it("resolves both ends of every route", () => {
    for (const route of GLOBE_ROUTES) {
      expect(GLOBE_PLACES_BY_ID.get(route.from)?.id).toBe(route.from);
      expect(GLOBE_PLACES_BY_ID.get(route.to)?.id).toBe(route.to);
    }
  });

  it("draws every arc outward from a country we actually source or ship from", () => {
    // The arcs animate from `from` to `to`, so direction is meaningful: a route
    // originating at a pure delivery market would animate cars leaving a place
    // we only deliver to.
    for (const route of GLOBE_ROUTES) {
      const origin = GLOBE_PLACES_BY_ID.get(route.from);
      expect(
        origin?.role,
        `route ${route.from} -> ${route.to} starts at a destination`,
      ).not.toBe("destination");
    }
  });

  it("has no route that starts and ends in the same place", () => {
    for (const route of GLOBE_ROUTES) {
      expect(route.from).not.toBe(route.to);
    }
  });

  it("keeps every coordinate on the planet", () => {
    for (const place of GLOBE_PLACES) {
      expect(place.lat).toBeGreaterThanOrEqual(-90);
      expect(place.lat).toBeLessThanOrEqual(90);
      expect(place.lng).toBeGreaterThanOrEqual(-180);
      expect(place.lng).toBeLessThanOrEqual(180);
      // 0,0 is in the Atlantic — almost always a forgotten placeholder.
      expect(place.lat === 0 && place.lng === 0).toBe(false);
    }
  });

  it("gives every place a name and a known role", () => {
    for (const place of GLOBE_PLACES) {
      expect(place.name.trim().length).toBeGreaterThan(0);
      expect(["source", "hub", "destination"]).toContain(place.role);
    }
  });

  it("stays under the arc count where the globe turns into a ball of string", () => {
    expect(GLOBE_ROUTES.length).toBeLessThanOrEqual(25);
  });
});
