// The destination panel only swaps in a real browser (AnimatePresence needs
// animation frames), so its selected state is covered here instead: render the
// panel with a destination chosen and assert the copy, facts and CTAs that the
// Japanese and India landing pages both rely on.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  type Destination,
  DestinationChips,
  DestinationPanel,
} from "@/components/DestinationPicker";

const KENYA: Destination = {
  key: "kenya",
  label: "Kenya",
  formCountry: "Kenya",
  headline: "Kenya admits vehicles under eight years old.",
  body: "Body copy for Kenya.",
  facts: [
    { icon: () => null, label: "8-year age rule" },
    { icon: () => null, label: "Cleared through Mombasa" },
  ],
  popular: "Most requested for Kenya: small cars.",
  readMoreHref: "/blog/india-car-export-documents-explained",
  readMoreLabel: "The export paperwork explained",
};

describe("DestinationPanel", () => {
  it("shows the empty state until a country is chosen", () => {
    const html = renderToStaticMarkup(
      <DestinationPanel
        destination={null}
        emptyHeadline="Pick your destination"
        emptyBody="We deliver fully cleared."
      />,
    );

    expect(html).toContain("Pick your destination");
    expect(html).toContain("We deliver fully cleared.");
    expect(html).not.toContain("Start your");
  });

  it("renders the chosen country's headline, facts, popular line and CTAs", () => {
    const html = renderToStaticMarkup(
      <DestinationPanel
        destination={KENYA}
        emptyHeadline="Pick your destination"
        emptyBody="We deliver fully cleared."
      />,
    );

    expect(html).toContain("Importing to Kenya");
    expect(html).toContain(KENYA.headline);
    expect(html).toContain(KENYA.body);
    expect(html).toContain(KENYA.popular);
    for (const fact of KENYA.facts) {
      expect(html).toContain(fact.label);
    }
    expect(html).toContain("Start your Kenya inquiry");
    expect(html).toContain('href="#inquiry"');
    // Custom read-more label wins over the default phrasing.
    expect(html).toContain("The export paperwork explained");
    expect(html).toContain(KENYA.readMoreHref as string);
    expect(html).not.toContain("Read more about importing a car to Kenya");
  });

  it("falls back to the default read-more label, and hides the CTA without a href", () => {
    const withDefaultLabel = renderToStaticMarkup(
      <DestinationPanel
        destination={{ ...KENYA, readMoreLabel: undefined }}
        emptyHeadline="x"
        emptyBody="y"
      />,
    );
    expect(withDefaultLabel).toContain(
      "Read more about importing a car to Kenya",
    );

    const withoutHref = renderToStaticMarkup(
      <DestinationPanel
        destination={{ ...KENYA, readMoreHref: null }}
        emptyHeadline="x"
        emptyBody="y"
      />,
    );
    expect(withoutHref).not.toContain("The export paperwork explained");
    // The primary CTA is always there.
    expect(withoutHref).toContain("Start your Kenya inquiry");
  });
});

describe("DestinationChips", () => {
  it("renders one chip per destination and marks the selected one pressed", () => {
    const destinations = [KENYA, { ...KENYA, key: "uganda", label: "Uganda" }];
    const html = renderToStaticMarkup(
      <DestinationChips
        destinations={destinations}
        selected={destinations[1]}
        onSelect={() => {}}
      />,
    );

    expect(html).toContain("Where are we landing it?");
    expect(html).toContain(">Kenya<");
    expect(html).toContain(">Uganda<");
    // Exactly one chip is pressed, and it is the selected one.
    expect((html.match(/aria-pressed="true"/g) || []).length).toBe(1);
    expect(html.indexOf('aria-pressed="true"')).toBeGreaterThan(
      html.indexOf(">Kenya<"),
    );
  });
});
