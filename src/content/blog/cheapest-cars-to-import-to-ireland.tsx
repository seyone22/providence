import {
  Callout,
  CheckLI,
  CostTable,
  Disclaimer,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  P,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        &ldquo;Cheap to import&rdquo; isn&rsquo;t about the sticker price abroad
        — it&rsquo;s about what the car costs once Irish customs, VAT and VRT
        are paid. These specific models stack every advantage: 0% duty, low VRT
        bands, and genuine value at source.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The cheapest cars to import are{" "}
            <Strong>low-CO₂ Japanese-built hybrids and small petrols</Strong> —
            they combine 0% duty with the lowest VRT bands.
          </>,
          <>
            A <Strong>Toyota Aqua</Strong> or <Strong>Suzuki Swift</Strong> can
            land thousands below the Irish forecourt price for the same car.
          </>,
          <>
            Battery EVs like the <Strong>Nissan Leaf</Strong> are temporarily
            even cheaper thanks to VRT relief — until 31 December 2026.
          </>,
          <>
            Avoid large diesels and EU-built cars from Britain: they&rsquo;re
            never the cheap option.
          </>,
        ]}
      />

      <H2 id="what-makes-cheap">What makes a car cheap to import</H2>
      <P>
        Four things decide whether a car lands cheaply in Ireland. Every model
        on this list ticks all four:
      </P>
      <UL>
        <CheckLI>
          <Strong>0% customs duty</Strong> — built in Japan (EU–Japan EPA) or
          the UK (with proof of origin), saving 10% of the landed value.
        </CheckLI>
        <CheckLI>
          <Strong>Low CO₂</Strong> — keeps VRT in the 7–14% range instead of
          30–41%. This is the biggest single lever.
        </CheckLI>
        <CheckLI>
          <Strong>Petrol or hybrid, not diesel</Strong> — avoids the heavy
          diesel NOx levy (capped at €4,850 vs €600 for petrol).
        </CheckLI>
        <CheckLI>
          <Strong>Real value at source</Strong> — Japan&rsquo;s auctions clear
          low-mileage cars below Irish retail, leaving margin to absorb the
          taxes.
        </CheckLI>
      </UL>
      <P>
        If those terms are new to you, start with{" "}
        <InlineLink href="/blog/vrt-explained-ireland">
          VRT explained
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/cost-of-importing-a-car-to-ireland">
          how much it costs to import a car
        </InlineLink>
        .
      </P>

      <H2 id="the-list">The cheapest cars to import, ranked</H2>
      <P>
        These are the models that consistently land cheapest after all Irish
        taxes. VRT bands are indicative and depend on the exact car&rsquo;s
        emissions and OMSP.
      </P>
      <Table
        head={["Model", "Type", "Indicative VRT", "Why it's cheap"]}
        rows={[
          [
            "Toyota Aqua",
            "Hybrid",
            "7–9%",
            "Lowest VRT band; Japan's most abundant hybrid keeps prices low",
          ],
          [
            "Suzuki Swift / kei cars",
            "Petrol",
            "7–11%",
            "Very low value + low CO₂ = minimal VRT",
          ],
          [
            "Nissan Note e-Power",
            "Hybrid",
            "9–11%",
            "Self-charging, no plug, excellent efficiency",
          ],
          [
            "Honda Fit / Jazz hybrid",
            "Hybrid",
            "9–12%",
            "Small, efficient, cheap at auction",
          ],
          [
            "Toyota Prius",
            "Hybrid",
            "7–9%",
            "Proven reliability, strong Irish resale demand",
          ],
          [
            "Toyota Corolla hybrid",
            "Hybrid",
            "11–13%",
            "Mainstream demand, strong residuals",
          ],
          [
            "Mazda 2 / Mazda 3 (Skyactiv)",
            "Petrol",
            "11–14%",
            "Efficient petrol, high-grade auction stock",
          ],
          [
            "Nissan Leaf",
            "EV",
            "7%",
            "Lowest band, zero NOx, up to €5,000 VRT relief (until end-2026)",
          ],
        ]}
        caption="VRT bands are indicative; confirm the exact figure for your car with Revenue."
      />
      <Callout title="The EV window is closing" tone="amber">
        <p>
          A used battery EV imported and registered{" "}
          <Strong>before 31 December 2026</Strong> gets up to €5,000 VRT relief,
          the lowest 7% band and zero NOx levy. With 6–10 weeks shipping from
          Japan, you need to start now to register in time.{" "}
          <InlineLink href="/import-japanese-cars-to-ireland#inquiry">
            Enquire about an EV import →
          </InlineLink>
        </p>
      </Callout>

      <H2 id="worked-example">A real landed-cost example</H2>
      <P>
        Here&rsquo;s what one of the cheapest options actually looks like on
        paper — a 3-year-old Japanese hybrid bought at auction:
      </P>
      <CostTable
        title="Japan-built hybrid (e.g. Toyota Aqua)"
        subtitle="3 years old, average mileage"
        rows={[
          { label: "Car price (Japan auction)", value: "~€11,000" },
          { label: "Shipping (RoRo, insured)", value: "~€1,500" },
          { label: "Customs duty — 0% (Japan EPA)", value: "€0", green: true },
          { label: "VAT at 23% on landed value", value: "~€2,875" },
          { label: "VRT at ~12% (hybrid)", value: "~€2,400" },
        ]}
        total={{ label: "Total landed in Ireland", value: "~€17,775" }}
      />
      <P>
        The same car on an Irish forecourt typically sells for{" "}
        <Strong>€22,000–€26,000</Strong> — a saving of €4,000–€8,000+ even after
        every tax is paid in full. That gap is exactly why these models are
        &ldquo;cheap&rdquo; despite the 23% VAT.
      </P>

      <H2 id="avoid">The cars that are never cheap</H2>
      <P>For pure cost-efficiency, steer clear of:</P>
      <UL>
        <CheckLI>
          <Strong>Large diesel SUVs</Strong> — the 35–41% VRT band plus the
          heaviest NOx levy: the worst possible combination.
        </CheckLI>
        <CheckLI>
          <Strong>German premium brands from Great Britain</Strong> (BMW, Audi,
          Mercedes, VW) — built in the EU, so 10% duty stacks on top of 23% VAT.
        </CheckLI>
        <CheckLI>
          <Strong>Performance cars over 190 g/km</Strong> — the 41% VRT band
          only makes sense if the car itself is the goal, not savings.
        </CheckLI>
        <CheckLI>
          <Strong>Pre-2018 cars with NEDC-only CO₂ data</Strong> — risk of the
          WLTP-conversion penalty bumping them up a band.
        </CheckLI>
      </UL>
      <P>
        Want the model-agnostic version of this — the decisions rather than the
        cars? Read{" "}
        <InlineLink href="/blog/cheapest-way-to-import-a-car-to-ireland">
          the cheapest way to import a car to Ireland
        </InlineLink>
        , or see the full picture in our{" "}
        <InlineLink href="/blog/importing-cars-to-ireland">
          complete import guide
        </InlineLink>
        .
      </P>

      <Disclaimer />
    </>
  );
}
