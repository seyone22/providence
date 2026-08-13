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
        Almost every disappointing import starts the same way: somebody compared
        a Japanese auction price to a local retail price and concluded they were
        about to save a fortune. The hammer price is roughly{" "}
        <Strong>half of what the car will cost you</Strong>. Here is the other
        half, in the order it arrives, and the four places where buyers are
        caught out.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Landed cost = hammer price + Japan-side costs + freight +{" "}
            <Strong>your country&rsquo;s taxes</Strong>.
          </>,
          <>
            The destination block is usually the biggest and varies more than
            everything else combined.
          </>,
          <>
            <Strong>RoRo</Strong> is cheaper for one ordinary car;{" "}
            <Strong>containers</Strong> win on value or volume.
          </>,
          <>
            The four classic surprises: port storage, missed pre-shipment
            inspection, local compliance work, currency movement.
          </>,
        ]}
      />

      <H2 id="structure">How the total is built</H2>
      <P>
        Four blocks, and it helps to think of them separately because you
        control them to very different degrees:
      </P>
      <UL>
        <CheckLI>
          <Strong>The car.</Strong> You control this — it is your maximum bid.
        </CheckLI>
        <CheckLI>
          <Strong>Japan-side costs.</Strong> Largely fixed, and knowable in
          advance to within a small margin.
        </CheckLI>
        <CheckLI>
          <Strong>Freight and insurance.</Strong> Set by route and shipping
          method, and quotable precisely.
        </CheckLI>
        <CheckLI>
          <Strong>Destination taxes and charges.</Strong> Set by your
          government. Not negotiable, frequently the largest block, and the one
          people leave until last.
        </CheckLI>
      </UL>

      <H2 id="in-japan">Costs inside Japan</H2>
      <P>
        Everything between winning the lot and the car being loaded. In rough
        order of size:
      </P>
      <UL>
        <CheckLI>
          <Strong>Auction house fee</Strong> — charged on every successful
          purchase, per lot.
        </CheckLI>
        <CheckLI>
          <Strong>Buying or agent fee</Strong> — ours is a stated figure, not a
          margin buried in the car price. If you cannot see the fee, you are
          paying it anyway.
        </CheckLI>
        <CheckLI>
          <Strong>Inland transport</Strong> from the auction compound to the
          port, which is why a car in Hokkaido costs more to ship than the same
          car near Yokohama.
        </CheckLI>
        <CheckLI>
          <Strong>Deregistration and export certificate</Strong> — the
          administrative cost of taking the car off Japanese registration.
        </CheckLI>
        <CheckLI>
          <Strong>Pre-export inspection</Strong> where your destination requires
          an accredited one. Modest in cost, catastrophic to omit.
        </CheckLI>
        <CheckLI>
          <Strong>Biosecurity steam clean</Strong> for Australasian, Pacific and
          many African destinations.
        </CheckLI>
      </UL>

      <H2 id="freight">Freight and insurance</H2>
      <P>
        Two decisions drive this: which port you sail to, and whether the car
        goes RoRo or in a container.
      </P>
      <P>
        <Strong>RoRo</Strong> — roll-on, roll-off — means the car is driven onto
        a dedicated vehicle vessel. It is the cheaper option for a single
        ordinary car and the default for most imports. The car is handled by
        port staff at both ends and travels on an open deck, which is fine for a
        Corolla and less appealing for something valuable.
      </P>
      <P>
        <Strong>Container</Strong> shipping costs more per vehicle but the car
        is sealed, untouched and can be braced. It is the right answer for
        high-value cars, non-runners, and anything where you would rather nobody
        drove it. It also gets cheaper per unit when you load two or more cars
        into one box, which is why multi-car orders often ship this way.
      </P>
      <P>
        Marine insurance sits on top of whichever you choose and should cover
        the car door to port at its full replacement value. It is a small line
        and there is no sensible reason to decline it.
      </P>

      <H2 id="destination">Costs at your end</H2>
      <P>
        This is where the same car becomes a very different purchase depending
        on where you live. Depending on your country, expect some combination
        of:
      </P>
      <UL>
        <CheckLI>
          <Strong>Customs duty</Strong>, usually a percentage of the assessed
          value — and note that the assessed value normally includes freight and
          insurance, not just what you paid for the car.
        </CheckLI>
        <CheckLI>
          <Strong>Consumption tax</Strong> — VAT, GST or equivalent, typically
          charged on the value <em>plus</em> the duty, which is why order of
          operations matters.
        </CheckLI>
        <CheckLI>
          <Strong>Registration or excise tax</Strong>, which may be banded by
          engine capacity, emissions, drivetrain or age.
        </CheckLI>
        <CheckLI>
          <Strong>Port, clearance and agency charges</Strong>, plus any local
          compliance or certification work.
        </CheckLI>
      </UL>
      <Callout title="This is why one number matters more than six" tone="sky">
        <p>
          Because the destination block dominates and varies so much, the only
          figure worth making a decision on is an all-in landed quote for{" "}
          <em>your</em> car to <em>your</em> country. Everything else is a
          conversation about half the bill.
        </p>
      </Callout>

      <H2 id="example">A worked example</H2>
      <P>
        Illustrative only — the shape of the bill matters here, not the specific
        currency amounts, which move with the market and differ entirely by
        destination.
      </P>
      <CostTable
        title="Compact Japanese hybrid, RoRo, mid-distance destination"
        subtitle="Illustrative structure — proportions, not a quote"
        rows={[
          { label: "Winning bid at auction", value: "≈ 45% of total" },
          { label: "Auction + buying fees", value: "≈ 6%" },
          {
            label: "Inland transport, deregistration, inspection",
            value: "≈ 5%",
          },
          { label: "Ocean freight", value: "≈ 12%" },
          { label: "Marine insurance", value: "≈ 2%" },
          { label: "Destination duty, tax and registration", value: "≈ 25%" },
          { label: "Port, clearance and agency charges", value: "≈ 5%" },
        ]}
        total={{ label: "Landed cost", value: "100%" }}
      />
      <P>
        Two things fall out of that shape. Freight is a{" "}
        <Strong>larger share on a cheap car</Strong> than on an expensive one,
        which is why very low-value imports often make less sense than they
        appear. And the destination block is big enough that choosing a car for
        its tax band rather than its auction price is frequently the better
        strategy — the same logic that drives the model choices in{" "}
        <InlineLink href="/blog/best-cars-to-import-from-japan">
          the best cars to import from Japan
        </InlineLink>
        .
      </P>

      <H2 id="traps">Where buyers get caught</H2>
      <UL>
        <CheckLI>
          <Strong>Port storage and demurrage.</Strong> If clearance paperwork is
          incomplete when the vessel docks, the car sits and the meter runs
          daily. This is the most common avoidable cost in the entire process,
          and it is a documentation failure rather than a shipping one.
        </CheckLI>
        <CheckLI>
          <Strong>A missed pre-shipment inspection.</Strong> If your country
          mandates an accredited inspection in Japan and it was not done, it
          cannot be fixed at your port. Some markets will refuse entry outright.
        </CheckLI>
        <CheckLI>
          <Strong>Local compliance work.</Strong> Lighting, emissions equipment
          or certification requirements that only surface on arrival. Knowable
          in advance; expensive when it is not.
        </CheckLI>
        <CheckLI>
          <Strong>Currency movement.</Strong> Several weeks separate quote from
          settlement, and the yen moves. Ask how the quote handles it rather
          than discovering the answer later.
        </CheckLI>
      </UL>
      <P>
        All four are priced in or ruled out before you commit on our quotes. If
        you want to see how the buying end works,{" "}
        <InlineLink href="/blog/how-to-buy-a-car-at-japanese-auction">
          how to buy a car at a Japanese auction
        </InlineLink>{" "}
        covers the process step by step.
      </P>

      <Disclaimer>
        Percentages above are illustrative of structure only and are not a
        quote. Actual duty, consumption tax and registration charges depend
        entirely on your destination country and the specific vehicle, and rates
        change. Confirm current rates with your national customs authority, and
        treat any landed figure as indicative until quoted per shipment.
      </Disclaimer>
    </>
  );
}
