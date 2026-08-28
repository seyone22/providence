import {
  Callout,
  CheckLI,
  Disclaimer,
  H2,
  H3,
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
        The Nissan Patrol is one of the few vehicles where the hardest part of
        the import is not the shipping, the paperwork or the tax. It is deciding
        which Patrol, out of which country. The same nameplate is sold new in
        left-hand drive in the Gulf, in right-hand drive in Australia and Japan,
        and not at all in Ireland or the United Kingdom &mdash; and those four
        facts, not the price, decide what your car costs to land.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Pick the corridor before the car.</Strong> Gulf Patrols are
            left-hand drive; Australian and Japanese ones are right-hand drive.
            That single choice rules out most of the market for you.
          </>,
          <>
            <Strong>A new Patrol is not sold in Ireland or the UK</Strong>, so
            there is no European type approval to inherit and registration runs
            through individual vehicle approval.
          </>,
          <>
            <Strong>Age limits do not bite on a new car</Strong>, but they
            govern everything on a used Y61 or Y62 &mdash; and they are the rule
            that most often kills an otherwise good buy.
          </>,
          <>
            The tax on a large petrol V6 or V8 is the whole trade. In
            CO&#8322;-banded and capacity-banded regimes,{" "}
            <Strong>the engine costs more than the specification does</Strong>.
          </>,
          <>
            <Strong>Modifications are an admissibility question</Strong>, not a
            cosmetic one. A bull bar, a lift kit or a long-range tank can each
            stop a car being registered.
          </>,
        ]}
      />

      <H2 id="which-patrol">Which Patrol are you actually buying?</H2>

      <P>
        Three generations are in active circulation, and they are different
        propositions rather than different model years.
      </P>

      <Table
        head={["Generation", "What it is", "Who it suits"]}
        rows={[
          [
            "Y61",
            "The older, simpler, live-axle Patrol with a long production run in some markets",
            "Working and remote-area use where parts availability and mechanical simplicity outrank comfort",
          ],
          [
            "Y62",
            "The 5.6-litre petrol V8 wagon, sold through 2026 in Australia",
            "Buyers who want a used large SUV with the outgoing V8 and known depreciation",
          ],
          [
            "Y63",
            "The current car — a 3.5-litre twin-turbo V6 in most markets, with a 3.8-litre naturally aspirated V6 offered in some",
            "New-car buyers, and dealers stocking a current-shape flagship",
          ],
        ]}
        caption="A generational summary, not a specification sheet. Confirm the engine and specification on the individual chassis before agreeing a price — the same badge covers different engines in different markets."
      />

      <P>
        The mistake that costs money here is assuming the badge describes the
        car. A Y63 bought in the Gulf and a Y63 bought in Australia can differ
        in engine, cooling, equipment and even seat count. Always buy against a
        chassis number and a specification document, never against a brochure.
      </P>

      <H2 id="corridors">The four corridors, and what each one gives you</H2>

      <UL>
        <CheckLI>
          <Strong>Australia.</Strong> Right-hand drive, English-language service
          records, a used market full of well-equipped touring cars, and a new
          car available from franchised dealers. Freight to East Africa and
          South Asia is longer and less frequent than from Japan.
        </CheckLI>
        <CheckLI>
          <Strong>Japan.</Strong> Right-hand drive, the deepest auction system
          in the world, and an inspection culture that produces a genuinely
          verifiable condition report. Historically the Patrol was sold there as
          the Safari, and domestic supply of the current car is recent, so the
          used pool is thin.
        </CheckLI>
        <CheckLI>
          <Strong>United Arab Emirates.</Strong> Left-hand drive, the deepest
          Patrol market on earth, and the widest choice of high-specification
          cars. Useful only for a left-hand-drive destination &mdash; and the
          dirham&rsquo;s dollar peg means the UAE never competes on exchange
          rate, only on stock.
        </CheckLI>
        <CheckLI>
          <Strong>United Kingdom.</Strong> Right-hand drive, but the Patrol has
          not been a mainstream UK model for many years, so what exists is old,
          scarce and usually a Y61. Good for a specific project car, poor for
          volume.
        </CheckLI>
      </UL>

      <Callout title="The question to answer first" tone="amber">
        <p>
          Does your destination drive on the left or the right? Everything else
          in this guide is downstream of that answer. A left-hand-drive Patrol
          in a right-hand-drive market is not a bargain that needs converting
          &mdash; in most of our destination markets it is a car that cannot be
          registered at all.
        </p>
      </Callout>

      <H2 id="cost-stack">What actually makes up the landed cost</H2>

      <P>
        The purchase price and the landed cost are different numbers, and on a
        large petrol SUV the gap between them is wider than on almost anything
        else. The stack, in the order it is applied:
      </P>

      <UL>
        <CheckLI>
          <Strong>Purchase price</Strong> in the source currency, plus auction
          or dealer fees, inland transport and export handling.
        </CheckLI>
        <CheckLI>
          <Strong>Ocean freight and marine insurance</Strong>, usually invoiced
          in US dollars. A Patrol is a large, tall vehicle, so it is expensive
          on both containerised and roll-on roll-off freight.
        </CheckLI>
        <CheckLI>
          <Strong>Customs duty</Strong>, almost always assessed on the CIF value
          rather than what you paid.
        </CheckLI>
        <CheckLI>
          <Strong>Consumption tax</Strong> &mdash; VAT or GST &mdash; typically
          charged on the duty-inclusive value, so duty is taxed too.
        </CheckLI>
        <CheckLI>
          <Strong>Excise or luxury tax</Strong>, often banded by engine capacity
          or by price. This is where a 3.5 or 5.6-litre Patrol is punished
          hardest.
        </CheckLI>
        <CheckLI>
          <Strong>Registration tax</Strong>, where the market has one.
          Ireland&rsquo;s VRT is the archetype: a CO&#8322;-banded percentage of
          Revenue&rsquo;s own valuation, plus a NOx levy &mdash; the mechanism
          our{" "}
          <InlineLink href="/blog/vrt-explained-ireland">VRT guide</InlineLink>{" "}
          sets out in full.
        </CheckLI>
        <CheckLI>
          <Strong>Levies and fees</Strong> &mdash; inspection, import
          declaration, development and railway levies, port charges,
          registration and plates.
        </CheckLI>
      </UL>

      <P>
        Two things about this stack catch importers out repeatedly. The first is
        that in several markets the tax base is the authority&rsquo;s own
        assessed value rather than your invoice, so buying cheaply does not
        reduce the tax proportionally. The second is that duty and tax are
        converted at your customs authority&rsquo;s published rate, which is
        usually fixed for a period rather than tracking the rate on your banking
        app. You can model an Irish landing end to end with the{" "}
        <InlineLink href="/ireland-cost-calculator">
          Ireland cost calculator
        </InlineLink>
        .
      </P>

      <H2 id="engine-tax">Why the engine is the expensive decision</H2>

      <P>
        On a Patrol, the specification you choose changes the price by tens of
        thousands. The engine changes the tax by more than that in some markets,
        every year, for as long as you own the car.
      </P>

      <P>
        A large petrol V6 or V8 sits at or near the top of every CO&#8322; band
        and every engine-capacity band that exists. In a capacity-banded excise
        regime, a few hundred cubic centimetres either side of a threshold can
        cost more than moving up two grades. In a CO&#8322;-banded registration
        tax, the figure that decides your band is the one on the vehicle&rsquo;s
        Certificate of Conformity &mdash; not a brochure figure, not a road-test
        figure, and not the figure the same nameplate carried three years ago.
      </P>

      <P>
        Get that document, in writing, for the actual chassis, before you agree
        a price. If nobody can produce it, you do not have a quote &mdash; you
        have an estimate with a decimal point in it.
      </P>

      <H2 id="admissibility">Can the car be registered where you live?</H2>

      <H3>Age limits</H3>

      <P>
        Several destination markets cap the age of an imported vehicle, and the
        rule is a hard gate that no amount of condition or specification
        overrides. Kenya&rsquo;s eight-year rule is the best known of them, set
        through the Kenya Bureau of Standards and enforced at import. A new
        Patrol clears every age limit by definition; a used Y62 may not,
        depending on the year and the market. Confirm the current position with
        the standards and revenue authorities in your destination before you
        bid, not with a forum thread.
      </P>

      <H3>Type approval and individual approval</H3>

      <P>
        In Ireland and the United Kingdom the Patrol is not a current model, so
        there is no European or UK type approval attached to the car.
        Registering one means an individual approval: in Ireland, an NSAI
        Individual Vehicle Approval assessed against Irish legislation and
        inspected at an approved test centre, and Revenue will not register a
        new vehicle without a valid Certificate of Conformity, an EU IVA or an
        Irish national IVA. It is a real process with a real failure rate, and
        it is the part of a European Patrol import that goes wrong &mdash; not
        the shipping.
      </P>

      <H3>Modifications</H3>

      <P>
        Patrols attract equipment. Bull bars, lift kits, long-range tanks,
        aftermarket seats, roof racks, snorkels, dual battery systems and
        winches are common on Australian cars in particular, and every one of
        them is a registration question in the destination market. Some are
        accepted, some require engineering certification, and some must be
        removed before shipment. Establish which before you buy, not after the
        car lands &mdash; our guide to{" "}
        <InlineLink href="/blog/importing-a-ute-or-4x4-from-australia">
          importing a ute or 4x4 from Australia
        </InlineLink>{" "}
        covers how we check this.
      </P>

      <H2 id="documents">The documents that have to travel with it</H2>

      <P>
        The exact set depends on the source country, but the shape is constant:
        proof of ownership and de-registration in the source market, an export
        certificate, an invoice that matches the money actually paid, a bill of
        lading, and any pre-shipment inspection certificate the destination
        requires. We keep a per-country breakdown of exactly what is issued and
        what it looks like:
      </P>

      <UL>
        <CheckLI>
          <InlineLink href="/blog/australia-car-export-documents-explained">
            Australian export documents explained
          </InlineLink>
        </CheckLI>
        <CheckLI>
          <InlineLink href="/blog/japan-car-export-documents-explained">
            Japanese export documents explained
          </InlineLink>
        </CheckLI>
        <CheckLI>
          <InlineLink href="/blog/uae-car-export-documents-explained">
            UAE export documents explained
          </InlineLink>
        </CheckLI>
      </UL>

      <P>
        Pre-shipment inspection is the one that catches people. Several markets
        require an inspection carried out in the source country before loading,
        by an appointed agency. A car that sails without it can be refused or
        heavily penalised on arrival, and no amount of paperwork afterwards
        fixes it.
      </P>

      <H2 id="timeline">How long it takes</H2>

      <P>
        Plan in stages rather than in a single number, because the stage that
        slips is rarely the sailing.
      </P>

      <UL>
        <CheckLI>
          <Strong>Sourcing</Strong> &mdash; days for a new car with an
          allocation, weeks for a specific used specification at auction.
        </CheckLI>
        <CheckLI>
          <Strong>Export processing</Strong> &mdash; de-registration, export
          certificate and inspection, typically one to three weeks.
        </CheckLI>
        <CheckLI>
          <Strong>Sailing</Strong> &mdash; weeks, and the schedule depends far
          more on the route than the distance. Japan to East Africa is better
          served than Australia to East Africa.
        </CheckLI>
        <CheckLI>
          <Strong>Clearance and registration</Strong> &mdash; the widest
          variance of all, and the stage where an approval or inspection
          requirement becomes visible if it was not planned for.
        </CheckLI>
      </UL>

      <P>
        For a new Patrol there is a fifth stage before all of these: the
        manufacturer&rsquo;s own delivery queue. A car that has not been built
        cannot be shipped, and order-to-delivery on a newly launched flagship is
        measured in quarters.
      </P>

      <Disclaimer>
        Import duty, consumption tax, excise, registration tax and age limits
        differ by destination and change &mdash; often at budget time. Nothing
        here is a rate, a threshold or a tax quote. Verify every figure with the
        revenue or customs authority in your destination market before
        committing, and treat any number that does not cite one as an estimate.
      </Disclaimer>
    </>
  );
}
