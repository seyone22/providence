import {
  Callout,
  CheckLI,
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
        The cheapest way to import a car to Ireland isn&rsquo;t a loophole —
        it&rsquo;s a sequence of legal decisions made in the right order. Get
        them right and you keep customs duty, VAT and VRT as low as the rules
        allow. Get one wrong and a &ldquo;bargain&rdquo; abroad becomes an
        expensive surprise at the Irish port.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Buy a car that qualifies for <Strong>0% duty</Strong> — and insist
            on the origin document that proves it.
          </>,
          <>
            Match the <Strong>source country</Strong> to the car: Japan for
            hybrids, the UK for UK-built models.
          </>,
          <>
            Hit the <Strong>3–8 year / average-mileage</Strong> sweet spot to
            keep OMSP and VRT moderate.
          </>,
          <>
            Use the <Strong>legal reliefs</Strong> (EV relief, the 30-year rule,
            Transfer of Residence) where you qualify.
          </>,
        ]}
      />

      <H2 id="rule">The one rule that controls the price</H2>
      <P>
        Your import bill is built from three stacked taxes — customs duty, then
        VAT, then VRT — and{" "}
        <Strong>each is calculated on the total of the one before it</Strong>.
        That means a single saved charge (like avoiding 10% duty) also reduces
        the VAT charged on top. Every step below is about shrinking one of those
        three numbers legally. If you want the full mechanics first, read{" "}
        <InlineLink href="/blog/cost-of-importing-a-car-to-ireland">
          how much it costs to import a car to Ireland
        </InlineLink>
        .
      </P>

      <H2 id="step-1">1. Pick a 0%-duty car — and prove origin</H2>
      <P>
        The biggest avoidable cost is paying 10% duty on a car that actually
        qualifies for 0%. Two origins qualify: <Strong>Japanese-built</Strong>{" "}
        (EU–Japan EPA, since February 2026) and <Strong>UK-built</Strong> (EU–UK
        TCA). Both need a valid <Strong>Statement of Origin</Strong> from the
        seller. On a €20,000 landed value, that document is worth €2,000 in duty
        — plus the knock-on VAT saving, because VAT is charged on the duty too.
      </P>
      <Callout title="Get it in writing — before you buy" tone="amber">
        <p>
          Without documentary proof of origin, Revenue defaults to 10%. A Toyota
          built in Japan but bought in Britain still needs that paperwork.
          Confirm it in writing before paying a deposit, not after the car has
          shipped.
        </p>
      </Callout>

      <H2 id="step-2">2. Choose the cheapest source country</H2>
      <P>
        Since both Japanese- and UK-built cars now enter at 0% duty, the choice
        comes down to the car and the logistics:
      </P>
      <UL>
        <CheckLI>
          <Strong>Japan</Strong> — unbeatable for low-mileage hybrids and kei
          cars at auction prices. Shipping is €1,000–2,000 and 6–10 weeks.
        </CheckLI>
        <CheckLI>
          <Strong>United Kingdom</Strong> — best when you want a UK-built model
          (MINI, Sunderland-built Nissan, Burnaston Corolla); ferry shipping is
          cheap and takes days, not weeks.
        </CheckLI>
        <CheckLI>
          <Strong>Northern Ireland</Strong> — a genuinely NI-owned used car can
          often come south with no duty <em>and</em> no VAT, because NI is
          treated as EU territory. Revenue scrutinises this, so the ownership
          must be real.
        </CheckLI>
      </UL>
      <P>
        Avoid EU-built cars bought in Great Britain — they pay the full 10%.{" "}
        <InlineLink href="/blog/import-car-from-japan-or-uk-to-ireland">
          See the full Japan vs UK comparison →
        </InlineLink>
      </P>

      <H2 id="step-3">3. Hit the age &amp; mileage sweet spot</H2>
      <P>
        A <Strong>3–8 year-old car with average mileage</Strong> is the value
        zone. It has shed the worst first-owner depreciation (lower OMSP, lower
        VRT), it&rsquo;s clear of the 6-month / 6,000 km &ldquo;new means of
        transport&rdquo; VAT trap on EU/NI cars, and cars from ~2019 onward
        carry genuine WLTP CO₂ data — avoiding the NEDC-conversion penalty that
        can push an older car up a VRT band.
      </P>
      <Callout tone="sky">
        <p>
          Don&rsquo;t chase ultra-low mileage to look like a bargain — Revenue
          assigns a <em>higher</em> OMSP (and more VRT) to a low-mileage car.
          The cheapest real-world buy is average mileage with documented good
          condition.
        </p>
      </Callout>

      <H2 id="step-4">4. Keep VRT low with CO₂ and NOx</H2>
      <P>
        VRT is your biggest controllable cost — 7% to 41% of OMSP set by CO₂.
        Staying under roughly <Strong>110 g/km</Strong> keeps you in the 7–13%
        range. Favour <Strong>petrol or hybrid over diesel</Strong>: diesels
        carry a NOx levy capped at €4,850 (versus €600 for petrol), and an old
        diesel with no documented NOx figure is assessed at the highest assumed
        rate — a common, expensive surprise. The full breakdown is in{" "}
        <InlineLink href="/blog/vrt-explained-ireland">
          VRT explained
        </InlineLink>
        .
      </P>

      <H2 id="step-5">5. Use the legal reliefs</H2>
      <P>
        These are legitimate reliefs, used as intended — not grey-area tactics:
      </P>
      <UL>
        <CheckLI>
          <Strong>Battery EV relief (before 31 Dec 2026)</Strong> — up to €5,000
          off VRT, the lowest 7% band, and zero NOx. A closing window.
        </CheckLI>
        <CheckLI>
          <Strong>The 30-year classic rule</Strong> — a car over 30 years old at
          registration pays a flat €200 VRT instead of an emissions percentage.
        </CheckLI>
        <CheckLI>
          <Strong>Transfer of Residence relief</Strong> — moving to Ireland? A
          car you owned and used abroad for 6+ months can come in free of VRT,
          VAT and duty (it can&rsquo;t be sold for 12 months after).
        </CheckLI>
        <CheckLI>
          <Strong>Appeal the OMSP</Strong> — if Revenue&rsquo;s valuation is
          higher than the car&rsquo;s genuine Irish market value, you can appeal
          it with evidence and reduce the VRT directly.
        </CheckLI>
      </UL>
      <Callout title="A word of caution" tone="amber">
        <p>
          Avoid under-declaring price, mislabelling a passenger car as
          commercial, false origin statements, or staged NI
          &ldquo;ownership&rdquo;. Revenue cross-checks invoices, VINs and
          shipping records — penalties and seizure outweigh any saving. Every
          relief above is legal when it genuinely applies.
        </p>
      </Callout>

      <H2 id="diy-vs-service">DIY vs using an importer</H2>
      <P>
        Doing it yourself saves a service fee but exposes you to exactly the
        mistakes that make imports expensive — paying 10% duty for want of one
        document, mis-judging the VRT band, or buying a car that fails the Irish
        NCT. A good importer prices the full landed cost up front and handles
        customs, VRT and registration, which usually protects more than it
        costs. Either way, the golden rule holds: model the full landed cost
        before you bid. Start with our{" "}
        <InlineLink href="/ireland-cost-calculator">
          import cost calculator
        </InlineLink>
        , or see{" "}
        <InlineLink href="/blog/cheapest-cars-to-import-to-ireland">
          the cheapest cars to import
        </InlineLink>{" "}
        for specific models.
      </P>

      <Disclaimer />
    </>
  );
}
