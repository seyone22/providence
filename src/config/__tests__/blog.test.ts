import { describe, expect, it } from "vitest";
import { BLOG_POSTS, getSuggestedPosts } from "@/config/blog";

// Destinations exactly as they are spelled in the inquiry form's country list
// (src/components/requestForm.tsx), plus an unmapped one and the empty case.
// The mapping in SUGGESTED_BY_DESTINATION is hand-written slugs, so this guards
// against a typo or a renamed post silently emptying the suggestions block.
const DESTINATIONS = [
  "Ireland",
  "Northern Ireland",
  "Sri Lanka",
  "United Kingdom",
  "India",
  "United Arab Emirates",
  "Australia",
  "New Zealand",
  "Thailand",
  "Japan",
  "Kenya", // not mapped — must fall back to the default set
  "", // customer hasn't chosen a destination yet
];

describe("getSuggestedPosts", () => {
  for (const destinationCountry of DESTINATIONS) {
    it(`returns the requested number of real, distinct posts for "${
      destinationCountry || "(none)"
    }"`, () => {
      const posts = getSuggestedPosts({ destinationCountry, limit: 3 });

      expect(posts).toHaveLength(3);
      expect(new Set(posts.map((p) => p.slug)).size).toBe(3);

      for (const post of posts) {
        // Every returned post must be a live entry in the registry, not a
        // stub — the email and success screen render title/excerpt directly.
        expect(BLOG_POSTS).toContain(post);
        expect(post.title).toBeTruthy();
        expect(post.excerpt).toBeTruthy();
        expect(post.readingTimeMins).toBeGreaterThan(0);
      }
    });
  }

  it("honours the limit", () => {
    expect(
      getSuggestedPosts({ destinationCountry: "Ireland", limit: 5 }),
    ).toHaveLength(5);
    expect(
      getSuggestedPosts({ destinationCountry: "Ireland", limit: 1 }),
    ).toHaveLength(1);
  });

  it("ignores casing and punctuation in the country name", () => {
    const canonical = getSuggestedPosts({ destinationCountry: "Sri Lanka" });
    for (const variant of ["sri lanka", "SRI-LANKA", "  Sri  Lanka  "]) {
      expect(
        getSuggestedPosts({ destinationCountry: variant }).map((p) => p.slug),
      ).toEqual(canonical.map((p) => p.slug));
    }
  });
});
