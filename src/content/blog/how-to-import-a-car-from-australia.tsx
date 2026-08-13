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
        Let us start with the thing most articles on this subject avoid saying:{" "}
        <Strong>Australia does not make cars any more</Strong>. Ford stopped in
        2016, Holden and Toyota in 2017. Everything sold new there today is
        imported. And Australia is still one of the best places on earth to buy
        a 4x4 — for reasons that have nothing to do with manufacturing.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            No local manufacturing since 2017. The value is{" "}
            <Strong>specification, condition and provenance</Strong>.
          </>,
          <>
            The <Strong>PPSR check</Strong> comes first, always — finance,
            write-off and theft markers.
          </>,
          <>
            Deregistration is <Strong>state by state</Strong>, not federal.
          </>,
          <>
            The <Strong>biosecurity steam clean</Strong> is not optional for
            Australasian and African destinations.
          </>,
        ]}
      />

      <H2 id="why-australia">Why Australia, given it builds nothing</H2>
      <P>
        Because of what the market has accumulated. Australians buy dual-cab
        utes and touring 4x4s in volumes that distort the entire model range,
        and they equip them harder than anyone else — bull bars, snorkels,
        long-range tanks, dual batteries, upgraded suspension, recovery gear,
        frequently fitted from new.
      </P>
      <P>Add three structural advantages:</P>
      <UL>
        <CheckLI>
          <Strong>Dry inland climates.</Strong> Inland Queensland, South
          Australia and Western Australia are unkind to rust in a way that shows
          on the underbody.
        </CheckLI>
        <CheckLI>
          <Strong>A national provenance register.</Strong> Finance, write-off
          and stolen markers are checkable against the VIN in one query.
        </CheckLI>
        <CheckLI>
          <Strong>Right-hand drive with English paperwork.</Strong> No
          conversion problem and no translation problem.
        </CheckLI>
      </UL>
      <P>
        And one monopoly: Holden and Ford Australia performance cars —
        Commodore, HSV, Falcon, FPV — were never sold in this form anywhere else
        on earth.
      </P>

      <H2 id="where-stock-is">Where the stock actually is</H2>
      <UL>
        <CheckLI>
          <Strong>Trade auction houses.</Strong> The main volume channel — fleet
          returns, lease disposals, repossessions. Competitive, fast, and
          variable in condition.
        </CheckLI>
        <CheckLI>
          <Strong>Dealer networks.</Strong> Better prepared and more expensive,
          with the service history and dealer accountability that goes with it.
        </CheckLI>
        <CheckLI>
          <Strong>Fleet and mining disposals.</Strong> Frequently the
          best-maintained heavy-duty 4x4s in the country, because mine-site
          vehicles run to enforced service schedules and retire on a timetable
          rather than when they break.
        </CheckLI>
        <CheckLI>
          <Strong>Private vendors.</Strong> Cheapest headline prices, most
          variable provenance, no recourse. Workable with a PPSR check and an
          inspection; unwise without either.
        </CheckLI>
      </UL>

      <H2 id="ppsr">The PPSR check comes first</H2>
      <P>
        The Personal Property Securities Register is Australia&rsquo;s national
        database of security interests. Queried against a VIN it reveals:
      </P>
      <UL>
        <CheckLI>
          <Strong>Outstanding finance.</Strong> If a lender holds an interest,
          the seller cannot pass clean title — and in some circumstances the
          vehicle can be repossessed from a buyer who paid in good faith.
        </CheckLI>
        <CheckLI>
          <Strong>Written-off vehicle status</Strong>, recorded by insurers.
        </CheckLI>
        <CheckLI>
          <Strong>Stolen markers</Strong> reported to police.
        </CheckLI>
      </UL>
      <Callout
        title="It costs almost nothing and it is the whole ballgame"
        tone="emerald"
      >
        <p>
          No Australian vehicle should be bought without a PPSR check, and it
          should happen before the deposit rather than before the shipment. We
          run it on every car and reject anything that comes back flagged, full
          stop.
        </p>
      </Callout>

      <H2 id="inspection">Inspection and the rust question</H2>
      <P>
        The dry-climate argument for Australian cars is genuine but it is not
        universal, and it is worth being precise about the limits. Inland
        regions are about as favourable to underbody condition as anywhere on
        earth. Coastal vehicles see salt air. Northern vehicles see monsoon
        humidity. A car advertised as &ldquo;dry state&rdquo; may have spent
        five years on a coastal road.
      </P>
      <P>
        So our inspection photographs the underbody on every vehicle rather than
        relying on a claim about the climate. Beyond that, the checklist for a
        used 4x4 is specific enough to deserve its own guide —{" "}
        <InlineLink href="/blog/importing-a-ute-or-4x4-from-australia">
          importing a ute or 4x4 from Australia
        </InlineLink>{" "}
        covers what to look at and why.
      </P>

      <H2 id="dereg">Deregistration, state by state</H2>
      <P>
        Vehicle registration in Australia is administered by the states rather
        than federally, so the deregistration process, forms and plate-surrender
        requirements differ depending on where the car is registered. It is
        procedural rather than difficult — but it means there is no single
        Australian process, which is a practical argument for a buyer who has
        done it in each state before.
      </P>
      <P>
        Alongside deregistration you need documented proof of ownership and the
        customs export declaration. The full file is in{" "}
        <InlineLink href="/blog/australia-car-export-documents-explained">
          Australia car export documents explained
        </InlineLink>
        .
      </P>

      <H2 id="biosecurity">The biosecurity clean</H2>
      <P>
        This is the step nobody warns first-time buyers about. New Zealand, the
        Pacific islands and many African and Asian destinations enforce strict
        biosecurity rules on arriving vehicles. Soil, seeds or plant material in
        the wheel arches, chassis rails or underbody can mean inspection,
        mandatory cleaning at port rates, days of delay — or refusal of entry.
      </P>
      <P>
        A steam clean before departure costs a modest fixed sum and produces a
        cleaning certificate that travels with the vehicle. Doing it on arrival
        costs several times as much and holds up the car while it happens. On an
        Australian-sourced touring 4x4 — a vehicle that has by definition been
        somewhere dusty — this is not a formality.
      </P>
      <P>
        For the full cost picture, including the inland-transport line that is
        unique to a country this size, see{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-australia">
          what it costs to import a car from Australia
        </InlineLink>
        .
      </P>

      <Disclaimer>
        State deregistration procedures, export requirements and destination
        biosecurity rules change. Acceptance of aftermarket modifications varies
        significantly by destination and can require engineering approval.
        Confirm the current position for your specific vehicle and destination
        before committing.
      </Disclaimer>
    </>
  );
}
