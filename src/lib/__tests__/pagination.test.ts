import { describe, expect, it } from "vitest";
import { paginate } from "@/lib/pagination";

/** 0..n-1, standing in for a lead list already sorted newest-first upstream. */
const list = (n: number) => Array.from({ length: n }, (_, i) => i);

describe("paginate", () => {
  it("shows the first 50 of a large list by default", () => {
    // The caller sorts newest-first, so page 1 at size 50 is the 50 most recent leads.
    const { rows, totalPages, totalRows, startIndex } = paginate(
      list(1000),
      50,
      1,
    );

    expect(rows).toHaveLength(50);
    expect(rows[0]).toBe(0);
    expect(rows.at(-1)).toBe(49);
    expect(startIndex).toBe(0);
    expect(totalRows).toBe(1000);
    expect(totalPages).toBe(20);
  });

  it("slices the requested page", () => {
    const { rows, page, startIndex } = paginate(list(1000), 50, 3);

    expect(rows[0]).toBe(100);
    expect(rows.at(-1)).toBe(149);
    expect(page).toBe(3);
    expect(startIndex).toBe(100);
  });

  it("returns a short final page rather than padding it", () => {
    const { rows, totalPages } = paginate(list(120), 50, 3);

    expect(totalPages).toBe(3);
    expect(rows).toHaveLength(20);
    expect(rows[0]).toBe(100);
  });

  it("honours each selectable page size", () => {
    for (const size of [25, 50, 100, 200]) {
      expect(paginate(list(1000), size, 1).rows).toHaveLength(size);
    }
  });

  it("returns everything on one page for 'All'", () => {
    const { rows, totalPages, page } = paginate(list(1000), "All", 1);

    expect(rows).toHaveLength(1000);
    expect(totalPages).toBe(1);
    expect(page).toBe(1);
  });

  it("clamps a page left over from a wider filter", () => {
    // Was on page 9 of 20, then a filter narrowed the set to 30 rows (1 page).
    const { rows, page, totalPages } = paginate(list(30), 50, 9);

    expect(page).toBe(1);
    expect(totalPages).toBe(1);
    expect(rows).toHaveLength(30);
  });

  it("clamps a page below 1", () => {
    expect(paginate(list(100), 50, 0).page).toBe(1);
    expect(paginate(list(100), 50, -5).page).toBe(1);
  });

  it("handles an empty list without dividing by zero", () => {
    for (const size of [50, "All"] as const) {
      const { rows, page, totalPages, totalRows } = paginate([], size, 1);

      expect(rows).toEqual([]);
      expect(page).toBe(1);
      expect(totalPages).toBe(1);
      expect(totalRows).toBe(0);
    }
  });

  it("covers every row exactly once across all pages", () => {
    const items = list(237);
    const seen: number[] = [];

    const { totalPages } = paginate(items, 25, 1);
    for (let p = 1; p <= totalPages; p++) {
      seen.push(...paginate(items, 25, p).rows);
    }

    expect(totalPages).toBe(10);
    expect(seen).toEqual(items);
  });
});
