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
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        The purchase price is only the first line on the bill. Here&rsquo;s
        every cost of importing a car to Ireland in 2026 — duty, VAT, VRT and
        the NOx levy — laid out in order, with worked totals for a car from
        Japan and one from the UK so there are no surprises at the port.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Total landed cost ={" "}
            <Strong>price + shipping + duty + VAT + VRT + NOx levy</Strong>.
          </>,
          <>
            A typical <Strong>€11,000 Japanese hybrid lands ~€17,775</Strong>{" "}
            all-in — versus €22,000–€26,000 on an Irish forecourt.
          </>,
          <>
            The charges are <Strong>stacked</Strong>: VAT is charged on the
            duty, so saving duty saves twice.
          </>,
          "VRT (7–41% of OMSP) is the swing factor — the same price can land very differently depending on the car.",
        ]}
      />

      <H2 id="summary">The short answer</H2>
      <P>
        For a mainstream, low-emission car the all-in cost is usually{" "}
        <Strong>40–60% above the foreign purchase price</Strong> once shipping
        and Irish taxes are added — but still below the Irish retail price for
        the same car, which is the whole point. The exact figure depends on
        three things: where the car was built (duty), its CO₂ (VRT band), and
        its fuel type (NOx levy).
      </P>

      <H2 id="line-by-line">The cost, line by line</H2>
      <UL>
        <CheckLI>
          <Strong>Purchase price</Strong> — what you pay at auction or to the
          seller abroad.
        </CheckLI>
        <CheckLI>
          <Strong>Shipping &amp; insurance</Strong> — ~€1,000–2,000 RoRo from
          Japan (6–10 weeks); ~€250–700 by ferry from the UK (days).
        </CheckLI>
        <CheckLI>
          <Strong>Customs duty</Strong> — 0% for Japanese- or UK-built cars with
          proof of origin; 10% otherwise. Charged on the CIF value (cost +
          insurance + freight).
        </CheckLI>
        <CheckLI>
          <Strong>VAT at 23%</Strong> — on the landed value plus any duty.
          Applies to all non-EU imports (Japan, GB). A genuinely used EU/NI car
          can be VAT-free.
        </CheckLI>
        <CheckLI>
          <Strong>VRT</Strong> — 7–41% of the car&rsquo;s Irish OMSP, set by
          CO₂. See{" "}
          <InlineLink href="/blog/vrt-explained-ireland">
            how VRT is calculated
          </InlineLink>
          .
        </CheckLI>
        <CheckLI>
          <Strong>NOx levy</Strong> — added to VRT on petrol/diesel: €5–€25 per
          mg/km, capped at €600 (petrol) or €4,850 (diesel). EVs pay zero.
        </CheckLI>
        <CheckLI>
          <Strong>Registration &amp; NCT</Strong> — VRT is paid at the NCTS;
          budget for an NCT test on cars 4+ years old.
        </CheckLI>
      </UL>

      <H2 id="order">Why the order matters</H2>
      <P>
        The charges aren&rsquo;t independent — they&rsquo;re applied in
        sequence, each on the running total of the last. Duty is added to the
        CIF value, then VAT is charged on <Strong>value + duty</Strong>, then
        VRT is charged separately on the OMSP. That&rsquo;s why securing 0% duty
        matters twice: you avoid the 10% itself <em>and</em> the 23% VAT that
        would have sat on top of it.
      </P>

      <H2 id="examples">Worked examples: Japan vs UK</H2>
      <P>
        Two cars at a similar purchase price, landed in Ireland. Note how the
        Japan hybrid and the UK-built hatch end up close — while an EU-built
        premium car bought in Britain is dragged up by 10% duty and a higher VRT
        band.
      </P>
      <CostTable
        title="Japan-built hybrid"
        subtitle="From Japan · low CO₂"
        rows={[
          { label: "Purchase price", value: "~€11,000" },
          { label: "Shipping", value: "~€1,500" },
          { label: "Customs duty — 0% (EPA)", value: "€0", green: true },
          { label: "VAT at 23%", value: "~€2,875" },
          { label: "VRT (~12%, hybrid)", value: "~€2,400" },
        ]}
        total={{ label: "Approx. landed in Ireland", value: "~€17,775" }}
      />
      <CostTable
        title="UK-built hatchback"
        subtitle="From GB · UK origin"
        rows={[
          { label: "Purchase price", value: "~€13,000" },
          { label: "Shipping (ferry)", value: "~€450" },
          { label: "Customs duty — 0% (UK origin)", value: "€0", green: true },
          { label: "VAT at 23%", value: "~€3,094" },
          { label: "VRT", value: "~€2,900" },
        ]}
        total={{ label: "Approx. landed in Ireland", value: "~€19,444" }}
      />
      <Callout title="The cautionary one" tone="amber">
        <p>
          An <Strong>EU-built premium car from Britain</Strong> at ~€15,000:
          €1,545 duty (10%) + ~€3,909 VAT + ~€5,200 VRT (higher CO₂) ≈{" "}
          <Strong>€26,104 landed</Strong>. Same idea, very different total —
          because of where it was built and what it emits.
        </p>
      </Callout>

      <H2 id="calculator">Estimate your own car</H2>
      <P>
        These figures are illustrative — your exact cost depends on the specific
        car&rsquo;s OMSP and emissions. The fastest way to a real number is our
        free{" "}
        <InlineLink href="/ireland-cost-calculator">
          Ireland Car Import Cost Calculator
        </InlineLink>
        , which works out duty, VAT, VRT and the NOx levy on 2026 Revenue rates
        with live exchange rates. Then see{" "}
        <InlineLink href="/blog/cheapest-cars-to-import-to-ireland">
          the cheapest cars to import
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/cheapest-way-to-import-a-car-to-ireland">
          the cheapest way to import
        </InlineLink>{" "}
        to bring the total down.
      </P>

      <Disclaimer />
    </>
  );
}
