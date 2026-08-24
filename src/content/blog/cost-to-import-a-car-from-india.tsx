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
        India&rsquo;s roughly 30% price advantage is created in the factory and
        lost, if it is lost, at the destination port. Whether it survives the
        journey depends almost entirely on how your country charges duty — and
        that is knowable in advance. Here is every line, and the three things
        that decide whether the saving arrives with the car.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Where duty is a <Strong>percentage of value</Strong>, the advantage
            survives intact.
          </>,
          <>
            Where duty is charged on{" "}
            <Strong>engine capacity or a fixed schedule</Strong>, it compresses.
          </>,
          <>
            Freight is a <Strong>larger share on a cheap car</Strong> —
            consolidate where you can.
          </>,
          <>
            Never under-declare the invoice. It is fraud, and the penalty lands
            at your own border.
          </>,
        ]}
      />

      <H2 id="structure">How the total is built</H2>
      <P>Four blocks. The unusual thing about India is the proportions:</P>
      <UL>
        <CheckLI>
          <Strong>The car.</Strong> Lower than the network average — that is the
          whole point — which makes every other line proportionally larger.
        </CheckLI>
        <CheckLI>
          <Strong>India-side costs.</Strong> Modest: inspection, inland
          transport, documentation, clearance.
        </CheckLI>
        <CheckLI>
          <Strong>Freight and insurance.</Strong> A bigger share than you would
          expect, precisely because the car is cheap.
        </CheckLI>
        <CheckLI>
          <Strong>Destination duty and tax.</Strong> The variable that decides
          whether this was worth doing.
        </CheckLI>
      </UL>

      <H2 id="in-india">Costs inside India</H2>
      <UL>
        <CheckLI>
          <Strong>Purchase price</Strong> — new through the dealer network, or
          used where budget requires it.
        </CheckLI>
        <CheckLI>
          <Strong>Independent multi-point inspection</Strong>, including
          specification verification against your order.
        </CheckLI>
        <CheckLI>
          <Strong>Inland transport</Strong> to Nhava Sheva, Chennai, Mundra or
          Kolkata. India is large, so this varies with where the vehicle was
          sourced.
        </CheckLI>
        <CheckLI>
          <Strong>Export documentation</Strong> — invoice, shipping bill,
          chassis verification, customs clearance.
        </CheckLI>
        <CheckLI>
          <Strong>Pre-shipment inspection</Strong> where your destination
          mandates an accredited one.
        </CheckLI>
      </UL>

      <H2 id="freight">Freight and insurance</H2>
      <P>
        India&rsquo;s sailings are short to the Gulf and Sri Lanka, moderate to
        East and West Africa, and long to Europe and Latin America. In absolute
        terms none of it is expensive — but relative to a low vehicle price, it
        is a bigger slice of the bill than it would be on a luxury import.
      </P>
      <Callout title="The consolidation arithmetic" tone="sky">
        <p>
          On a cheap car, freight can be a fifth of the landed cost. Loading two
          or three vehicles into a single container instead of shipping them
          individually changes that materially, which is why multi-unit orders
          from India improve per-unit economics more than they do from anywhere
          else in our network.
        </p>
      </Callout>
      <P>
        Marine insurance should cover replacement value door to port. It is a
        small line and there is no sensible reason to decline it.
      </P>

      <H2 id="destination">Where the advantage gets eaten</H2>
      <P>
        Three mechanisms, and it is worth knowing which one applies to you
        before you choose a car:
      </P>
      <UL>
        <CheckLI>
          <Strong>Ad valorem duty is friendly.</Strong> If duty is a percentage
          of value, a cheaper car pays proportionally less duty. The 30%
          advantage passes through almost undiminished. This is the good case.
        </CheckLI>
        <CheckLI>
          <Strong>Capacity-banded excise is neutral to hostile.</Strong> If tax
          is set by engine size rather than value, an India-built car pays the
          same as an expensive one with the same engine — so the saving
          compresses. Choosing a smaller engine matters more than choosing a
          cheaper car.
        </CheckLI>
        <CheckLI>
          <Strong>Fixed or minimum-value assessments are hostile.</Strong> Some
          regimes assess against reference values rather than your invoice,
          which can erase a low purchase price entirely. This is the case where
          India may simply be the wrong source.
        </CheckLI>
      </UL>
      <P>
        We model which mechanism applies before recommending India over another
        source — because occasionally the honest answer is that it does not suit
        your market.
      </P>

      <H2 id="keeping-it">How to keep the saving</H2>
      <UL>
        <CheckLI>
          <Strong>Choose for the tax band, not the sticker.</Strong> In a
          capacity-banded market, the engine you pick moves the total more than
          the model you pick.
        </CheckLI>
        <CheckLI>
          <Strong>Consolidate freight</Strong> wherever the volume allows.
        </CheckLI>
        <CheckLI>
          <Strong>Buy new where the gap to used is small.</Strong> You capture
          the manufacturing advantage cleanly and avoid used-condition risk in a
          market where history is harder to verify.
        </CheckLI>
        <CheckLI>
          <Strong>Get the documentation right.</Strong> Port storage from an
          inconsistent invoice can wipe out a chunk of the saving in a
          fortnight.
        </CheckLI>
        <CheckLI>
          <Strong>Never under-declare.</Strong> Under-invoicing to reduce duty
          is fraud, it is routinely detected by authorities tracking market
          values, and the penalty lands at your border rather than in India.
        </CheckLI>
      </UL>

      <H2 id="example">A worked example</H2>
      <P>
        Illustrative structure for a new compact SUV, containerised, to a
        mid-distance destination with ad valorem duty. Proportions, not a quote:
      </P>
      <CostTable
        title="New India-built compact SUV, shared container"
        subtitle="Illustrative structure — proportions, not a quote"
        rows={[
          { label: "Ex-dealer purchase price", value: "≈ 55% of total" },
          { label: "Inspection and specification verification", value: "≈ 2%" },
          { label: "Inland transport and export documentation", value: "≈ 4%" },
          { label: "Container freight (shared, per unit)", value: "≈ 10%" },
          { label: "Marine insurance", value: "≈ 2%" },
          { label: "Destination duty, tax and registration", value: "≈ 22%" },
          { label: "Port, clearance and agency charges", value: "≈ 5%" },
        ]}
        total={{ label: "Landed cost", value: "100%" }}
      />
      <P>
        Compare the shape with{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-the-uae">
          a UAE import
        </InlineLink>
        , where the car is 60% of the total and freight is smaller. Different
        problems, different levers — which is why the useful comparison is
        always landed cost for the same requirement across source countries, not
        headline vehicle price.
      </P>
      <P>
        For dealers running volume, the consolidation and cashflow arithmetic is
        developed further in{" "}
        <InlineLink href="/blog/importing-cars-from-india-for-dealers">
          our dealer guide
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Percentages above are illustrative of structure only and are not a
        quote. Duty, excise and registration charges depend entirely on your
        destination and the specific vehicle, and rates change. Confirm current
        rates with your national customs authority before committing.
      </Disclaimer>
    </>
  );
}
