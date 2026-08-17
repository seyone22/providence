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
        Thai imports carry one variable that no other source country in our
        network does, and it can be the biggest number in the whole calculation:
        whether your destination classifies the vehicle as a{" "}
        <Strong>passenger car or a commercial goods vehicle</Strong>. Get that
        wrong and the rest of the arithmetic does not matter. Here is the full
        bill, with that question front and centre.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Commercial classification</Strong> can change your duty rate
            entirely. Check it first.
          </>,
          <>
            Accessories fitted in Thailand are the{" "}
            <Strong>cheapest line you will ever add</Strong> to a pickup.
          </>,
          <>Pickups take more deck space, so RoRo costs more than for a car.</>,
          <>
            Fitted equipment forms part of the{" "}
            <Strong>declared customs value</Strong>. Declare it.
          </>,
        ]}
      />

      <H2 id="structure">How the total is built</H2>
      <UL>
        <CheckLI>
          <Strong>The vehicle.</Strong> Factory price on a new export-spec
          order, or market price on used.
        </CheckLI>
        <CheckLI>
          <Strong>Accessories.</Strong> Optional, and unusually good value at
          source.
        </CheckLI>
        <CheckLI>
          <Strong>Thailand-side costs.</Strong> Inspection, inland transport,
          export clearance, documentation.
        </CheckLI>
        <CheckLI>
          <Strong>Freight and insurance.</Strong> Higher per unit than a
          passenger car because of size.
        </CheckLI>
        <CheckLI>
          <Strong>Destination duty and tax</Strong>, driven by classification.
        </CheckLI>
      </UL>

      <H2 id="in-thailand">Costs inside Thailand</H2>
      <UL>
        <CheckLI>
          <Strong>Purchase.</Strong> New vehicles are ordered through the dealer
          network at export specification; used comes from auction houses and
          fleet disposals.
        </CheckLI>
        <CheckLI>
          <Strong>Inspection.</Strong> On used stock, a multi-point inspection
          with underbody and chassis photographs. On new, line-by-line
          specification verification against your order before it leaves the
          compound.
        </CheckLI>
        <CheckLI>
          <Strong>Inland transport</Strong> to Laem Chabang or Bangkok.
        </CheckLI>
        <CheckLI>
          <Strong>Export documentation and clearance</Strong> — the export
          entry, chassis and engine verification, and any destination-mandated
          pre-shipment inspection.
        </CheckLI>
        <CheckLI>
          <Strong>Deregistration</Strong>, on used vehicles only. New vehicles
          were never registered, which makes their file simpler and faster.
        </CheckLI>
      </UL>

      <H2 id="accessories">Accessories: the cheapest line you will ever add</H2>
      <P>
        Worth its own section because the price difference is not marginal.
        Thailand&rsquo;s accessory industry grew around its pickup production,
        and canopies, tray bodies, tonneau covers, bar work, lift kits,
        suspension upgrades and underbody protection cost a fraction of
        destination-market equivalents.
      </P>
      <P>
        Fitting before loading means the vehicle arrives ready to work, and the
        labour is Thai labour rather than yours. For a working vehicle, this is
        frequently the single best-value decision in the entire purchase.
      </P>
      <Callout title="Two conditions" tone="amber">
        <p>
          Some destinations require approval for bar work, lift kits or lighting
          changes, or will not register them at all — we check before fitting.
          And fitted equipment forms part of the vehicle&rsquo;s declared
          customs value, so it appears on the invoice. Under-declaring
          accessories creates a valuation problem at your own border.
        </p>
      </Callout>

      <H2 id="freight">Freight and insurance</H2>
      <P>
        Laem Chabang is a major vehicle export terminal with frequent sailings,
        which keeps rates competitive. Asia and Oceania are short runs; Africa
        and the Middle East are moderate; Europe is the expensive end.
      </P>
      <P>
        The size penalty is real, though. A double-cab pickup occupies more deck
        space than a passenger car, and RoRo is priced accordingly — typically a
        noticeable step up from a saloon on the same route. On multi-unit
        orders, container consolidation is worth pricing properly rather than
        assuming RoRo wins.
      </P>

      <H2 id="commercial">Why commercial classification matters</H2>
      <P>
        This is the section to read twice. Many countries treat goods vehicles
        differently from passenger cars for duty and tax, and the difference can
        be large in either direction — some markets tax commercial vehicles
        considerably more lightly, others apply additional requirements and
        charges.
      </P>
      <P>
        What decides the classification is not the badge but details of the
        vehicle itself, which vary by jurisdiction:
      </P>
      <UL>
        <CheckLI>
          <Strong>Seating configuration</Strong> — single, extra or double cab.
        </CheckLI>
        <CheckLI>
          <Strong>Payload capacity</Strong> against a threshold set locally.
        </CheckLI>
        <CheckLI>
          <Strong>Whether the load area is permanently separated</Strong> from
          the cabin.
        </CheckLI>
        <CheckLI>
          <Strong>Fitted equipment</Strong> — in some markets a canopy or a
          fitted rear seat changes the classification.
        </CheckLI>
      </UL>
      <P>
        The practical consequence: on a Thai import, the specification choices
        you make can move your tax bill more than the price you negotiate. We
        confirm how your destination will classify the specific configuration{" "}
        <em>before</em> the order is placed, because after the vehicle is built
        it is an expensive thing to be wrong about.
      </P>

      <H2 id="example">A worked example</H2>
      <P>
        Illustrative structure for a new double-cab 4x4 with a canopy and bar
        work, RoRo to a mid-distance destination. Proportions, not a quote:
      </P>
      <CostTable
        title="New Thai double-cab 4x4, accessorised, RoRo"
        subtitle="Illustrative structure — proportions, not a quote"
        rows={[
          { label: "Ex-dealer vehicle price", value: "≈ 54% of total" },
          {
            label: "Accessories fitted in Thailand",
            value: "≈ 5%",
            green: true,
          },
          { label: "Specification verification and inspection", value: "≈ 1%" },
          { label: "Inland transport and export clearance", value: "≈ 3%" },
          { label: "RoRo freight", value: "≈ 10%" },
          { label: "Marine insurance", value: "≈ 2%" },
          { label: "Destination duty, tax and registration", value: "≈ 21%" },
          { label: "Port, clearance and agency charges", value: "≈ 4%" },
        ]}
        total={{ label: "Landed cost", value: "100%" }}
      />
      <P>
        Note the accessory line. Five percent of the landed cost buys equipment
        that would commonly cost three or four times as much fitted at
        destination — which is why we recommend specifying it up front rather
        than treating it as something to sort out later. Model choice is covered
        in{" "}
        <InlineLink href="/blog/best-pickups-to-import-from-thailand">
          the best pickups to import from Thailand
        </InlineLink>
        , and the new-versus-used decision in{" "}
        <InlineLink href="/blog/thailand-vs-japan-for-pickup-imports">
          Thailand vs Japan
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Percentages above are illustrative of structure only and are not a
        quote. Commercial-vehicle classification criteria, duty rates and
        accessory registration rules vary substantially by country and change.
        Confirm the current position with your national customs authority before
        committing.
      </Disclaimer>
    </>
  );
}
