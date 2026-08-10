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
        UAE imports have a different cost shape from everything else in our
        network, and the reason is that the cars are worth more. When the
        vehicle is a two-year-old luxury SUV rather than a ten-year-old
        hatchback, the percentage-based lines — duty, tax, insurance — get much
        larger, and freight gets relatively smaller. That changes which
        decisions actually matter.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Freight from Jebel Ali is <Strong>short and cheap</Strong> to South
            Asia and East Africa.
          </>,
          <>
            <Strong>Destination duty is usually the biggest line</Strong>,
            because it scales with a high vehicle value.
          </>,
          <>
            More UAE cars ship in <Strong>containers</Strong>, which costs more
            and is usually correct.
          </>,
          <>
            Compare quotes on <Strong>what they include</Strong>, not on the
            headline number.
          </>,
        ]}
      />

      <H2 id="structure">How the total is built</H2>
      <P>Four blocks, as everywhere — but the proportions are unusual:</P>
      <UL>
        <CheckLI>
          <Strong>The car.</Strong> Higher than the network average, which drags
          every percentage-based line upward with it.
        </CheckLI>
        <CheckLI>
          <Strong>UAE-side costs.</Strong> Modest and predictable. The free-zone
          regime is efficient.
        </CheckLI>
        <CheckLI>
          <Strong>Freight and insurance.</Strong> Cheap on short routes, but
          container shipping and higher insured values push it up.
        </CheckLI>
        <CheckLI>
          <Strong>Destination duty and tax.</Strong> Usually dominant, and
          directly proportional to the value of the car.
        </CheckLI>
      </UL>

      <H2 id="in-the-uae">Costs inside the UAE</H2>
      <UL>
        <CheckLI>
          <Strong>Purchase price</Strong> — main-dealer trade-in, auction or
          specialist retailer.
        </CheckLI>
        <CheckLI>
          <Strong>History screening</Strong> — official registration and
          inspection records checked for accident and damage markers. Small
          cost, and the single most important spend in a UAE purchase.
        </CheckLI>
        <CheckLI>
          <Strong>Physical inspection</Strong> — cooling system, air
          conditioning, paint-depth readings, underbody water markers and full
          electronics test.
        </CheckLI>
        <CheckLI>
          <Strong>Deregistration and export certificate</Strong>, plus plate
          cancellation.
        </CheckLI>
        <CheckLI>
          <Strong>Free-zone customs clearance</Strong> and the export
          declaration.
        </CheckLI>
        <CheckLI>
          <Strong>Inland transport</Strong> to Jebel Ali. Short — the country is
          compact.
        </CheckLI>
      </UL>
      <P>
        On tax treatment: vehicles purchased for export through the free-zone
        regime are handled differently from a domestic retail sale, which is a
        large part of why Dubai works as a re-export hub. The exact position
        depends on the seller and the transaction structure, and it is stated
        explicitly in the quote rather than assumed.
      </P>

      <H2 id="freight">Container, RoRo or air</H2>
      <P>
        <Strong>RoRo</Strong> is the cheapest option and perfectly appropriate
        for an ordinary SUV. The car is driven on and off by port staff and
        travels on an open deck.
      </P>
      <P>
        <Strong>Container</Strong> costs more and is the right answer for most
        of what the UAE is good at. A nearly new luxury car or a supercar should
        not be driven by port staff or exposed on a deck, and a container also
        allows bracing and sealing. Two cars in one container improves the
        per-unit figure considerably.
      </P>
      <P>
        <Strong>Air freight</Strong> exists and is occasionally justified — a
        very high-value car on a tight timeline. It is expensive enough that it
        should be a deliberate decision rather than a default.
      </P>
      <Callout
        title="Why the cheapest quote is often the wrong one"
        tone="amber"
      >
        <p>
          A RoRo quote for a car that should travel in a container looks cheaper
          because it excludes the protection the vehicle needs. Ask what
          shipping method is quoted and what the insured value is. Those two
          answers explain most price differences between exporters.
        </p>
      </Callout>

      <H2 id="value">Why high value changes the maths</H2>
      <P>
        This is the point worth internalising. Duty and consumption tax are
        normally assessed as percentages of the vehicle&rsquo;s value — and that
        assessed value usually includes freight and insurance, not just the
        purchase price.
      </P>
      <P>
        So on an expensive car, the destination tax block grows in absolute
        terms while freight stays roughly flat. A nearly new luxury SUV from
        Dubai can attract more duty and tax than the entire purchase price of an
        older vehicle from Japan. That does not make it a worse decision — you
        are getting a much better car — but it does mean the comparison has to
        be made in landed terms.
      </P>
      <P>
        It also means the <em>choice of car</em> matters more than the
        negotiation. Moving down one engine size or one trim level can save more
        in destination tax than any haggling at the point of purchase.
      </P>

      <H2 id="destination">Duty and tax at your end</H2>
      <P>Depending on your country, expect some combination of:</P>
      <UL>
        <CheckLI>
          <Strong>Customs duty</Strong> as a percentage of assessed value,
          typically including freight and insurance in the base.
        </CheckLI>
        <CheckLI>
          <Strong>Consumption tax</Strong> — VAT, GST or equivalent — normally
          charged on value plus duty.
        </CheckLI>
        <CheckLI>
          <Strong>Excise or registration tax</Strong>, often banded by engine
          capacity or emissions, which is where large-capacity Gulf engines can
          hurt.
        </CheckLI>
        <CheckLI>
          <Strong>Homologation or compliance work</Strong> if GCC specification
          does not meet your registration requirements — see{" "}
          <InlineLink href="/blog/gcc-spec-cars-explained">
            GCC spec cars explained
          </InlineLink>
          .
        </CheckLI>
      </UL>

      <H2 id="example">A worked example</H2>
      <P>
        Illustrative structure for a nearly new luxury SUV, containerised, to a
        mid-distance destination. Proportions, not a quote:
      </P>
      <CostTable
        title="Nearly new luxury SUV from Dubai, containerised"
        subtitle="Illustrative structure — proportions, not a quote"
        rows={[
          { label: "Purchase price", value: "≈ 60% of total" },
          { label: "History screening + inspection", value: "≈ 1%" },
          {
            label: "Deregistration, export certificate, clearance",
            value: "≈ 2%",
          },
          { label: "Container freight", value: "≈ 7%" },
          { label: "Marine insurance", value: "≈ 2%" },
          { label: "Destination duty, tax and registration", value: "≈ 24%" },
          { label: "Port, clearance and agency charges", value: "≈ 4%" },
        ]}
        total={{ label: "Landed cost", value: "100%" }}
      />
      <P>
        Compare that with{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-japan">
          the Japanese structure
        </InlineLink>
        , where the car is a smaller share and freight a larger one. Same
        exercise, different shape — which is exactly why we compare landed cost
        across offices for the same requirement rather than defaulting to one
        source.
      </P>

      <Disclaimer>
        Percentages above are illustrative of structure only and are not a
        quote. Duty, consumption tax and registration charges depend entirely on
        your destination and the specific vehicle, and rates change. VAT and
        free-zone treatment depend on the seller and transaction structure.
        Confirm current rates with your national customs authority.
      </Disclaimer>
    </>
  );
}
