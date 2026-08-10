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
        New Zealand prices are retail, not wholesale, and there is no honest way
        around that. The useful question is not whether you are paying more than
        you would at Japanese auction — you are — but whether{" "}
        <Strong>what you get for the difference is worth it</Strong>. Here is
        the whole bill, with that comparison built in.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The premium over Japan buys{" "}
            <Strong>
              entry certification, English records and a local history
            </Strong>
            .
          </>,
          <>
            Freight to <Strong>Australia and the Pacific is cheap</Strong>; to
            Africa and Europe it is not.
          </>,
          <>
            The <Strong>biosecurity clean</Strong> is small at origin and
            expensive at destination.
          </>,
          <>
            On an inexpensive car headed a long way, freight can exceed the
            purchase price.
          </>,
        ]}
      />

      <H2 id="structure">How the total is built</H2>
      <UL>
        <CheckLI>
          <Strong>The vehicle</Strong>, at retail rather than wholesale.
        </CheckLI>
        <CheckLI>
          <Strong>Checks and inspection</Strong> — compliance file review,
          registration history, physical inspection, battery test on electrified
          vehicles.
        </CheckLI>
        <CheckLI>
          <Strong>Deregistration, export documentation and cleaning.</Strong>
        </CheckLI>
        <CheckLI>
          <Strong>Freight and insurance</Strong>, with a very wide spread by
          destination.
        </CheckLI>
        <CheckLI>
          <Strong>Destination duty, tax and registration.</Strong>
        </CheckLI>
      </UL>

      <H2 id="in-nz">Costs inside New Zealand</H2>
      <UL>
        <CheckLI>
          <Strong>Purchase price.</Strong> Auction, dealer or fleet disposal.
        </CheckLI>
        <CheckLI>
          <Strong>Compliance and registration record review.</Strong> Reading
          the entry-certification file properly is the reason to buy here at
          all, so it happens before anything else.
        </CheckLI>
        <CheckLI>
          <Strong>Physical inspection</Strong> with underbody photographs — the
          coastal caveat means the climate argument is verified rather than
          assumed.
        </CheckLI>
        <CheckLI>
          <Strong>Battery state-of-health test</Strong> on every electric and
          plug-in vehicle. Non-negotiable.
        </CheckLI>
        <CheckLI>
          <Strong>Deregistration and export documentation.</Strong>
        </CheckLI>
        <CheckLI>
          <Strong>Biosecurity steam clean and certificate</Strong> before
          loading.
        </CheckLI>
        <CheckLI>
          <Strong>Inland transport</Strong> to Auckland, Tauranga or Lyttelton.
          Short — the country is not large by our network&rsquo;s standards.
        </CheckLI>
      </UL>

      <H2 id="retail-premium">The retail premium, honestly</H2>
      <P>
        A New Zealand price includes what somebody already spent importing the
        car from Japan, complying it to New Zealand standards, registering it
        and marketing it, plus their margin. It is not a markup being applied to
        you — it is work that has already been done.
      </P>
      <P>What that work actually bought you:</P>
      <UL>
        <CheckLI>
          <Strong>A government entry inspection</Strong> covering structure,
          frontal impact, emissions and odometer accuracy, which screened out
          the two failures that turn a used car into a bad decision.
        </CheckLI>
        <CheckLI>
          <Strong>English-language documentation</Strong>, removing a
          translation step from your clearance and registration.
        </CheckLI>
        <CheckLI>
          <Strong>A local service history</Strong> since compliance, readable
          without an interpreter.
        </CheckLI>
      </UL>
      <Callout title="When the premium is worth paying" tone="sky">
        <p>
          Broadly: the further you are from being able to inspect the car
          yourself, and the more the purchase matters, the more the verification
          is worth. On a cheap runabout it rarely justifies itself. On a vehicle
          that has to work for five years, it frequently does. The full
          comparison is in{" "}
          <a href="/blog/new-zealand-vs-japan-for-used-imports">
            New Zealand vs Japan
          </a>
          .
        </p>
      </Callout>

      <H2 id="freight">Freight and insurance</H2>
      <P>
        The spread is wide enough that geography decides whether New Zealand
        makes sense at all:
      </P>
      <UL>
        <CheckLI>
          <Strong>Australia and the Pacific:</Strong> two to three weeks,
          frequent sailings, comparatively cheap. New Zealand is the natural
          source.
        </CheckLI>
        <CheckLI>
          <Strong>South-East Asia:</Strong> moderate and competitive.
        </CheckLI>
        <CheckLI>
          <Strong>Eastern and southern Africa:</Strong> five to eight weeks and
          more expensive than the equivalent Japanese route.
        </CheckLI>
        <CheckLI>
          <Strong>Europe and the Americas:</Strong> long and expensive. On an
          inexpensive car the freight can exceed the purchase price, which
          usually makes this the wrong source.
        </CheckLI>
      </UL>

      <H2 id="destination">Duty and tax at your end</H2>
      <P>
        The usual structure: customs duty as a percentage of assessed value —
        normally including freight and insurance in the base — then consumption
        tax on value plus duty, then any registration or excise charge banded by
        emissions, capacity, drivetrain or age.
      </P>
      <P>
        One New Zealand-specific point worth knowing: because much of the stock
        is ex-Japan and therefore a few years older than equivalent cars at
        Japanese auction, destination <Strong>age limits</Strong> bite harder
        here. A car that was complied in New Zealand five years ago may already
        be too old for markets with an eight-year rule. We check that before
        shortlisting.
      </P>

      <H2 id="example">A worked comparison with Japan</H2>
      <P>
        Same model, same specification, illustrative structure. Proportions, not
        a quote:
      </P>
      <CostTable
        title="Ex-Japan hybrid bought in New Zealand, RoRo to a Pacific destination"
        subtitle="Illustrative structure — proportions, not a quote"
        rows={[
          { label: "Retail purchase price", value: "≈ 62% of total" },
          {
            label: "Compliance review, inspection, battery test",
            value: "≈ 2%",
          },
          {
            label: "Deregistration, export docs, biosecurity clean",
            value: "≈ 3%",
          },
          { label: "Inland transport", value: "≈ 2%" },
          { label: "RoRo freight", value: "≈ 8%", green: true },
          { label: "Marine insurance", value: "≈ 2%" },
          { label: "Destination duty, tax and registration", value: "≈ 17%" },
          { label: "Port, clearance and agency charges", value: "≈ 4%" },
        ]}
        total={{ label: "Landed cost", value: "100%" }}
      />
      <P>
        Compare with{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-japan">
          the Japanese structure
        </InlineLink>
        , where the car is a smaller share and freight a larger one. For a
        Pacific destination the New Zealand freight advantage narrows the gap
        considerably; for an African one it does not.
      </P>

      <Disclaimer>
        Percentages above are illustrative of structure only and are not a
        quote. Duty, consumption tax and registration charges depend entirely on
        your destination and the specific vehicle, and rates change. Age limits
        in some markets exclude older ex-Japan stock. Confirm current rates and
        eligibility with your national customs authority before committing.
      </Disclaimer>
    </>
  );
}
