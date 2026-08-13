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
        Australian imports carry a cost line that no other source country in our
        network does, and quotes that omit it are not quotes. The best-value
        4x4s are inland; the ports are on the coast; and the gap between them
        can be more than a thousand kilometres of road transport. Here is the
        whole bill, with that line where it belongs.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Inland transport is a real, variable line</Strong> —
            Australia is very large.
          </>,
          <>
            The <Strong>biosecurity clean</Strong> is small at origin and
            expensive at destination.
          </>,
          <>
            Freight to <Strong>New Zealand and the Pacific is cheap</Strong>; to
            Europe it is not.
          </>,
          <>
            No Australian export duty on used private vehicles — the tax is all
            at your end.
          </>,
        ]}
      />

      <H2 id="structure">How the total is built</H2>
      <UL>
        <CheckLI>
          <Strong>The vehicle</Strong>, plus a buyer&rsquo;s premium if bought
          at trade auction.
        </CheckLI>
        <CheckLI>
          <Strong>Checks and inspection</Strong> — PPSR, registration history,
          physical inspection.
        </CheckLI>
        <CheckLI>
          <Strong>Getting it to a port</Strong>, which in Australia is not a
          rounding error.
        </CheckLI>
        <CheckLI>
          <Strong>Cleaning, clearance and documentation.</Strong>
        </CheckLI>
        <CheckLI>
          <Strong>Freight, insurance and destination tax.</Strong>
        </CheckLI>
      </UL>

      <H2 id="in-australia">Costs inside Australia</H2>
      <UL>
        <CheckLI>
          <Strong>Purchase price.</Strong> Trade auction, dealer, fleet disposal
          or private.
        </CheckLI>
        <CheckLI>
          <Strong>PPSR check.</Strong> Trivial in cost and the best-value spend
          in the entire process — it is what prevents buying a vehicle with
          finance owing against it.
        </CheckLI>
        <CheckLI>
          <Strong>Physical inspection</Strong> with underbody, chassis and
          equipment photographs.
        </CheckLI>
        <CheckLI>
          <Strong>Inland transport</Strong> — see below.
        </CheckLI>
        <CheckLI>
          <Strong>State deregistration and plate surrender</Strong>, plus proof
          of ownership documentation.
        </CheckLI>
        <CheckLI>
          <Strong>Customs export declaration.</Strong>
        </CheckLI>
        <CheckLI>
          <Strong>Biosecurity steam clean and certificate.</Strong>
        </CheckLI>
      </UL>

      <H2 id="distance">The distance problem</H2>
      <P>
        Australia is roughly the size of continental Europe with a fraction of
        the population, and the vehicles that make Australian sourcing
        worthwhile are disproportionately located inland — Queensland, South
        Australia, Western Australia — precisely because that is where the dry
        climate and the touring culture are.
      </P>
      <P>
        Moving a vehicle from inland Queensland to a coastal port can mean well
        over a thousand kilometres of road transport, and the cost scales with
        it. Two practical consequences:
      </P>
      <UL>
        <CheckLI>
          <Strong>Vehicle location affects the landed price materially.</Strong>{" "}
          Two identical utes in different states are not the same purchase.
        </CheckLI>
        <CheckLI>
          <Strong>Any quote that omits inland transport is incomplete.</Strong>{" "}
          Ask where the vehicle is and which port it will load from.
        </CheckLI>
      </UL>
      <Callout title="How we handle it" tone="sky">
        <p>
          Inland transport is quoted as a specific line against the specific
          vehicle, not as an average. Where two comparable vehicles differ
          mainly in location, we tell you what that difference costs so you can
          decide whether the inland one is worth it. Frequently it is — the
          condition premium can exceed the transport.
        </p>
      </Callout>

      <H2 id="biosecurity">Cleaning and inspection</H2>
      <P>
        The steam clean is a small fixed cost at origin and produces a
        certificate that travels with the vehicle. Skipping it is a false
        economy of the most predictable kind: New Zealand, the Pacific and many
        African and Asian destinations enforce biosecurity strictly, and an
        unclean arrival means inspection, mandatory cleaning at port rates, and
        days of storage while it happens.
      </P>
      <P>
        On an Australian touring 4x4 — a vehicle that has by definition spent
        time somewhere dusty and probably somewhere vegetated — this is not a
        box-ticking exercise. We clean every vehicle before loading as standard.
      </P>

      <H2 id="freight">Freight and insurance</H2>
      <P>
        The spread here is wider than for any other source country we operate,
        so the destination decides whether Australia makes economic sense at
        all:
      </P>
      <UL>
        <CheckLI>
          <Strong>New Zealand and the Pacific:</Strong> short, frequent,
          comparatively cheap. Australia is the natural source.
        </CheckLI>
        <CheckLI>
          <Strong>South-East Asia:</Strong> moderate. Competitive for the right
          vehicle.
        </CheckLI>
        <CheckLI>
          <Strong>Southern and eastern Africa:</Strong> moderate to high, but
          often still worthwhile for equipped 4x4s that are hard to source
          locally.
        </CheckLI>
        <CheckLI>
          <Strong>Europe and the Americas:</Strong> expensive. On an ordinary
          vehicle the freight can approach the purchase price, which usually
          makes Australia the wrong choice unless the car is one you cannot get
          elsewhere.
        </CheckLI>
      </UL>
      <P>
        Pickups and large 4x4s take more deck space than passenger cars, so RoRo
        is priced accordingly. Container consolidation is worth pricing on
        multi-unit orders.
      </P>

      <H2 id="example">A worked example</H2>
      <P>
        Illustrative structure for an equipped touring 4x4 bought inland, RoRo
        to a mid-distance destination. Proportions, not a quote:
      </P>
      <CostTable
        title="Equipped Australian touring 4x4, inland purchase, RoRo"
        subtitle="Illustrative structure — proportions, not a quote"
        rows={[
          {
            label: "Purchase price (equipment included)",
            value: "≈ 58% of total",
          },
          { label: "PPSR check and physical inspection", value: "≈ 1%" },
          { label: "Inland transport to port", value: "≈ 4%" },
          {
            label: "Deregistration, export declaration, cleaning",
            value: "≈ 3%",
          },
          { label: "RoRo freight", value: "≈ 11%" },
          { label: "Marine insurance", value: "≈ 2%" },
          { label: "Destination duty, tax and registration", value: "≈ 17%" },
          { label: "Port, clearance and agency charges", value: "≈ 4%" },
        ]}
        total={{ label: "Landed cost", value: "100%" }}
      />
      <P>
        The inland-transport line is the distinctively Australian one, and on a
        vehicle sourced from a remote area it can be considerably larger than
        shown. The offsetting argument is in the purchase line: an
        already-equipped tourer includes equipment that would cost far more to
        fit at destination, which is the whole case for buying here rather than
        building one at home. That reasoning is developed in{" "}
        <InlineLink href="/blog/importing-a-ute-or-4x4-from-australia">
          importing a ute or 4x4 from Australia
        </InlineLink>
        .
      </P>
      <P>
        Australia does not impose an export duty on used private vehicles as a
        general matter, so the Australian-side costs above are commercial rather
        than fiscal. The tax block is entirely at your own border.
      </P>

      <Disclaimer>
        Percentages above are illustrative of structure only and are not a
        quote. Inland transport varies enormously with vehicle location. Duty,
        tax and registration charges depend entirely on your destination and the
        specific vehicle, and rates change. Confirm current rates with your
        national customs authority before committing.
      </Disclaimer>
    </>
  );
}
