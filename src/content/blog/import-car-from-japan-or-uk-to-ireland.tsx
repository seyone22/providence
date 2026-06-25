import {
  H2,
  P,
  Lead,
  UL,
  CheckLI,
  Strong,
  Callout,
  KeyTakeaways,
  Table,
  Disclaimer,
  InlineLink,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        For decades the UK was Ireland&rsquo;s default used-car warehouse. Brexit
        changed that — and in February 2026 Japan reached 0% duty too. So which is
        cheaper now? The honest answer is: it depends on the car. Here&rsquo;s how
        the two best source countries really compare.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Both <Strong>Japanese- and UK-built</Strong> cars now enter at 0% duty;
            both pay 23% VAT.
          </>,
          <>
            <Strong>Japan</Strong> wins for low-mileage hybrids at auction prices.
          </>,
          <>
            <Strong>The UK</Strong> wins for UK-built models on cheap, fast ferry
            shipping.
          </>,
          <>
            The trap: <Strong>EU-built cars bought in Britain</Strong> still pay
            the full 10% duty.
          </>,
        ]}
      />

      <H2 id="headline">The headline: it depends on the car</H2>
      <P>
        Since 1 February 2026 the EU–Japan EPA reached 0% on cars, matching the
        0% that UK-built cars already get under the EU–UK TCA. That removed
        Japan&rsquo;s old tax disadvantage. Now the decision is driven by the
        specific model, its origin documents, and logistics — not a blanket
        &ldquo;Japan vs UK&rdquo; rule.
      </P>

      <H2 id="duty">Customs duty — the Brexit trap</H2>
      <P>
        Duty is decided by where the car was <Strong>built</Strong>, not where you
        bought it:
      </P>
      <Table
        head={["Car", "Bought in", "Customs duty"]}
        rows={[
          ["Toyota (built in Japan)", "Japan", "0% (EPA, with origin proof)"],
          ["MINI (built in Oxford)", "Great Britain", "0% (TCA, with origin proof)"],
          ["Nissan (built in Sunderland)", "Great Britain", "0% (TCA, with origin proof)"],
          ["BMW / Audi / VW (built in EU)", "Great Britain", "10% — does not qualify"],
          ["Toyota (built in Japan)", "Great Britain", "0% only with a statement of origin"],
        ]}
      />
      <Callout title="This is where money is lost" tone="amber">
        <p>
          A German premium car bought in Britain was built in the EU, so it pays
          the full 10% — there&rsquo;s no way around it. And any 0% claim, Japanese
          or British, needs a valid <Strong>Statement of Origin</Strong>; without
          it Revenue defaults to 10%. More on this in{" "}
          <InlineLink href="/blog/cheapest-way-to-import-a-car-to-ireland">
            the cheapest way to import
          </InlineLink>
          .
        </p>
      </Callout>

      <H2 id="vat">VAT — the same either way</H2>
      <P>
        VAT at 23% applies to imports from <Strong>both</Strong> Japan and Great
        Britain, because both are outside the EU customs union. This is the big
        post-Brexit change: a car that cost €20,000 to land from the UK in 2019
        now costs roughly €26,500–€27,000. The one VAT escape — a genuinely used
        EU or Northern Ireland car — applies to neither GB nor Japan.
      </P>

      <H2 id="logistics">Shipping &amp; logistics</H2>
      <Table
        head={["Factor", "Japan", "United Kingdom"]}
        rows={[
          ["Shipping cost", "€1,000–2,000", "€250–700"],
          ["Transit time", "6–10 weeks (RoRo)", "Hours/days (ferry)"],
          ["Steering", "RHD (no conversion)", "RHD (no conversion)"],
          ["Paperwork familiarity", "Auction sheet + CoC", "Familiar V5C + MOT history"],
        ]}
      />
      <P>
        The UK&rsquo;s remaining advantage is logistics: cheap, fast crossings and
        documentation Irish buyers already know. Japan takes longer and costs more
        to ship — which is why the car has to be cheap enough at source to absorb
        it.
      </P>

      <H2 id="stock">Stock, condition &amp; price</H2>
      <UL>
        <CheckLI>
          <Strong>Japan</Strong> — the shaken inspection regime forces early
          trade-ins, so low-mileage, well-graded cars (3.5–5 on the auction scale)
          sell cheaply. Best for hybrids, kei cars and JDM models not sold new in
          Ireland.
        </CheckLI>
        <CheckLI>
          <Strong>UK</Strong> — same models Irish buyers know, but you must stick
          to genuinely UK-built cars (MINI, Sunderland Nissan, Burnaston Corolla,
          older Swindon Civic) to keep the 0% duty.
        </CheckLI>
      </UL>

      <H2 id="verdict">The verdict</H2>
      <P>
        Choose <Strong>Japan</Strong> for an efficient hybrid or an unusual model
        where auction pricing and condition win out. Choose the{" "}
        <Strong>UK</Strong> for a UK-built model where you value speed, lower
        shipping and familiar paperwork. Avoid EU-built cars from Britain
        entirely. Whichever way you go, the cheapest result is still a low-CO₂,
        0%-duty, right-hand-drive car bought below Irish retail.
      </P>
      <P>
        Ready to act on Japan specifically? See our{" "}
        <InlineLink href="/import-japanese-cars-to-ireland">
          import Japanese cars to Ireland
        </InlineLink>{" "}
        service, or check{" "}
        <InlineLink href="/blog/cheapest-cars-to-import-to-ireland">
          the cheapest cars to import
        </InlineLink>{" "}
        and run the numbers in the{" "}
        <InlineLink href="/ireland-cost-calculator">cost calculator</InlineLink>.
      </P>

      <Disclaimer />
    </>
  );
}
