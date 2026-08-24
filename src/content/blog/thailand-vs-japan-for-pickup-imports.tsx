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
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Thailand builds pickups new. Japan sells them used with an independent
        condition grade attached. Framed that way the comparison almost answers
        itself — but it is worth working through properly, because the honest
        answer depends on whether you are buying one vehicle or ten, and on how
        much verification you need before committing.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>New:</Strong> Thailand, and it is not close — it is the
            production source.
          </>,
          <>
            <Strong>Used:</Strong> Japan, on price and on verification.
          </>,
          <>
            <Strong>Fleets:</Strong> Thailand, for identical units and specified
            accessories.
          </>,
          <>
            <Strong>One-off bargain hunting:</Strong> Japan, for auction pricing
            and the grade sheet.
          </>,
        ]}
      />

      <H2 id="headline">The headline difference</H2>
      <P>
        These two countries are answering different questions. Thailand is where
        the world&rsquo;s one-tonne pickups are <em>manufactured</em>, so it is
        the natural source for a new vehicle in exactly the specification you
        want. Japan runs the world&rsquo;s most transparent used-vehicle market,
        so it is the natural source for a used vehicle whose condition you can
        verify before bidding.
      </P>
      <P>Almost everything else follows from that one distinction.</P>

      <H2 id="new-vs-used">New versus used</H2>
      <P>
        If you want a new pickup, Thailand is the only realistic route and the
        saving is substantial — you are buying at the production source rather
        than through a destination-market distributor and dealer.
      </P>
      <P>
        If you want a used pickup, Japan is usually cheaper. Auction pricing is
        wholesale rather than retail, depreciation has already done its work,
        and Japan&rsquo;s maintenance culture means the condition of a given
        used example tends to be better than the mileage suggests.
        Thailand&rsquo;s used market exists and is workable — fleet disposals in
        particular — but it is a retail market without an auction-grade system
        behind it.
      </P>

      <H2 id="verification">Verifying condition</H2>
      <P>
        This is Japan&rsquo;s strongest card and it deserves to be stated
        plainly. Every car at Japanese auction carries an inspection sheet
        written by an inspector employed by the auction house — an overall
        grade, an interior grade, and a panel-by-panel damage map — issued
        before anyone bids. Nothing else in our network matches it.
      </P>
      <Callout title="Thailand has no equivalent" tone="amber">
        <p>
          On used Thai stock, verification is done by physical inspection rather
          than by reading a document. That works, and it is what our Thailand
          team does — but it means you are relying on somebody&rsquo;s
          inspection rather than on an independent grade issued before the sale.
          On a new vehicle the question does not arise at all, which is part of
          why new is the default recommendation here.
        </p>
      </Callout>
      <P>
        How the Japanese system works is set out in{" "}
        <InlineLink href="/blog/japanese-auction-grades-explained">
          Japanese auction grades explained
        </InlineLink>
        .
      </P>

      <H2 id="spec">Specification and equipment</H2>
      <P>
        Thailand wins, and for a structural reason: you are ordering rather than
        shopping. Cab configuration, drivetrain, engine, trim and accessory
        package are all choices rather than constraints, and the accessory
        fitment happens before the vehicle is loaded at Thai prices rather than
        destination-market ones.
      </P>
      <P>
        Japan&rsquo;s used pickups come as they come. The Hilux Surf and older
        Hilux generations that surface at Japanese auction are frequently
        excellent, but you take the specification that exists. Japan&rsquo;s
        equivalent strength is in{" "}
        <InlineLink href="/blog/best-cars-to-import-from-japan">
          Land Cruisers and 4x4 wagons
        </InlineLink>
        , where the used pool is deeper than Thailand&rsquo;s.
      </P>

      <H2 id="parts">Parts and aftermarket</H2>
      <P>
        Broadly a draw, with a twist. Both countries&rsquo; products are
        supported almost everywhere — a Hilux is a Hilux. The difference is the{" "}
        <Strong>aftermarket</Strong>: Thailand&rsquo;s accessory industry, built
        around its own pickup production, is one of the deepest and cheapest in
        the world, and you can exploit it at source.
      </P>
      <P>
        For an older Japanese-market vehicle, some model-specific parts can be
        harder to source outside Japan than the badge suggests — particularly on
        JDM-only variants that were never sold in your market.
      </P>

      <H2 id="freight">Freight and lead time</H2>
      <Table
        head={["", "Thailand", "Japan"]}
        rows={[
          [
            <Strong key="f1">Availability</Strong>,
            "New: build slot dependent. Used: retail market.",
            "Weekly auction cycle, very large volume.",
          ],
          [
            <Strong key="f2">Typical time to secure</Strong>,
            "New: weeks, depending on the build.",
            "Used: often 1–3 weeks to win the right car.",
          ],
          [
            <Strong key="f3">Ports</Strong>,
            "Laem Chabang, Bangkok",
            "Yokohama, Nagoya, Osaka, Kobe, Hakata",
          ],
          [
            <Strong key="f4">Strong routes</Strong>,
            "Asia, Oceania, East and southern Africa, Middle East",
            "Global, with very high sailing frequency",
          ],
        ]}
        caption="A pickup takes more deck space than a passenger car in both cases; container consolidation is worth pricing on multi-unit orders from either origin."
      />

      <H2 id="verdict">The verdict</H2>
      <UL>
        <CheckLI>
          <Strong>Buying new? Thailand.</Strong> No real competition — it is the
          source.
        </CheckLI>
        <CheckLI>
          <Strong>Buying used on a budget? Japan.</Strong> Wholesale auction
          pricing plus an independent grade is a combination Thailand cannot
          offer.
        </CheckLI>
        <CheckLI>
          <Strong>Buying for a fleet? Thailand.</Strong> Identical units,
          specified accessories, factory condition — exactly what fleet
          operation wants, and what a used market cannot deliver at volume.
        </CheckLI>
        <CheckLI>
          <Strong>
            Buying a 4x4 wagon rather than a pickup? Compare carefully.
          </Strong>{" "}
          Japan&rsquo;s Land Cruiser and Prado pool is deeper; Thailand&rsquo;s
          Fortuner and MU-X are cheaper new.
        </CheckLI>
        <CheckLI>
          <Strong>Need verification above all? Japan.</Strong> The auction sheet
          is the best pre-purchase evidence available anywhere.
        </CheckLI>
      </UL>
      <P>
        We have our own team in both, so we have no reason to push you toward
        one. Tell us the requirement and we compare the landed cost from each —{" "}
        <InlineLink href="/source-cars-from/thailand">Thailand</InlineLink> and{" "}
        <InlineLink href="/source-cars-from/japan">Japan</InlineLink>.
      </P>

      <Disclaimer>
        Pricing, availability and lead times in both markets change
        continuously, and destination duty treatment of commercial vehicles
        varies significantly by country. Confirm the current position for your
        specific requirement before committing.
      </Disclaimer>
    </>
  );
}
