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
        For a dealership, India is a margin play with a consistency problem
        attached. The margin is real and it is wide. The consistency problem —
        units arriving in specifications nobody agreed to — is what separates
        operators who run India successfully from those who try it once. Here is
        how to run it properly.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The margin sits in the{" "}
            <Strong>compact SUV and hatchback segments</Strong>, where the price
            gap is widest.
          </>,
          <>
            <Strong>Consolidate into containers.</Strong> Per-unit landed cost
            improves noticeably with volume.
          </>,
          <>
            <Strong>Specify in writing, verify per unit.</Strong> Silent
            substitution is the classic failure.
          </>,
          <>
            Establish the <Strong>warranty position before you order</Strong>,
            not after a customer asks.
          </>,
        ]}
      />

      <H2 id="where-margin-sits">Where the margin actually sits</H2>
      <P>
        Not evenly across the range. India&rsquo;s price advantage is widest on
        models engineered specifically to its domestic tax envelope —
        sub-four-metre hatchbacks and compact SUVs — because the saving is a
        design outcome rather than a discount. On larger vehicles the gap
        narrows.
      </P>
      <P>
        The second variable is your own market&rsquo;s duty structure. Where
        duty is a percentage of value, a cheaper vehicle attracts proportionally
        less duty and the advantage survives the journey intact. Where duty is
        charged on engine capacity or a fixed schedule, it compresses —
        sometimes to the point where India stops making sense against{" "}
        <InlineLink href="/source-cars-from/japan">Japan</InlineLink>.
      </P>
      <Table
        head={["Segment", "Price advantage", "Dealer notes"]}
        rows={[
          [
            <Strong key="m1">Sub-4m hatchbacks</Strong>,
            "Widest",
            "Fast turnover, low ticket, freight is a larger share — consolidate.",
          ],
          [
            <Strong key="m2">Compact SUVs</Strong>,
            "Wide",
            "The volume segment. Strongest combination of margin and demand.",
          ],
          [
            <Strong key="m3">Seven-seat MPVs</Strong>,
            "Good",
            "Fleet and private-hire demand. Innova is close to a default.",
          ],
          [
            <Strong key="m4">Ladder-frame 4x4s</Strong>,
            "Moderate",
            "Higher ticket, slower turnover, but very strong in the right market.",
          ],
          [
            <Strong key="m5">Larger / premium</Strong>,
            "Narrow",
            "The advantage thins. Compare against other source countries.",
          ],
        ]}
      />

      <H2 id="allocations">How multi-unit allocations work</H2>
      <P>
        There is no minimum order — we ship single cars and regular allocations
        alike. What changes with volume is the economics rather than the access:
      </P>
      <UL>
        <CheckLI>
          <Strong>Container consolidation.</Strong> Loading multiple vehicles
          into one container spreads the freight cost. On inexpensive cars,
          where freight is a large share of the total, this is the single
          biggest lever you have.
        </CheckLI>
        <CheckLI>
          <Strong>Consolidated documentation.</Strong> One shipment, one
          clearance event, one set of agency charges rather than several.
        </CheckLI>
        <CheckLI>
          <Strong>Better sourcing position.</Strong> A repeat order against a
          known specification is easier to fill at a better price than a one-off
          request.
        </CheckLI>
        <CheckLI>
          <Strong>Predictable cadence.</Strong> A regular allocation lets us
          work ahead of your order rather than starting from scratch each time.
        </CheckLI>
      </UL>

      <H2 id="consistency">The consistency problem</H2>
      <P>
        This is the section that matters most, and it is where volume importing
        goes wrong. The failure mode is <Strong>silent substitution</Strong>: a
        different trim, a different colour, a different wheel or seat
        specification arriving because it was what was available, discovered
        when the container is opened.
      </P>
      <P>
        For a private buyer that is an annoyance. For a dealer who advertised
        ten identical units it is a commercial problem. The defence is
        procedural:
      </P>
      <UL>
        <CheckLI>
          <Strong>Specify in writing at order stage</Strong> — trim, colour,
          drivetrain, wheels, interior, options — per unit, not per batch.
        </CheckLI>
        <CheckLI>
          <Strong>Verify at inspection stage</Strong>, per unit, against that
          written specification.
        </CheckLI>
        <CheckLI>
          <Strong>Raise variance before loading</Strong>, never after. A
          substitution identified in the compound is a decision; the same
          substitution identified at your port is a dispute.
        </CheckLI>
        <CheckLI>
          <Strong>Photograph every unit individually</Strong>, with the VIN
          visible, so the record is unambiguous.
        </CheckLI>
      </UL>
      <Callout title="Our commitment on allocations" tone="emerald">
        <p>
          Every unit is documented against the agreed specification before
          loading, and any variance is raised with you while there is still a
          choice about it. You decide whether to accept, substitute or reject —
          from the compound, not from the quayside.
        </p>
      </Callout>

      <H2 id="cashflow">Cashflow and lead time</H2>
      <P>
        Six to ten weeks from confirmed order to delivery is the realistic
        planning assumption: sourcing and inspection, then export clearance,
        then two to three weeks sailing to the Gulf and Sri Lanka, three to five
        to Africa, five to seven to Europe.
      </P>
      <P>
        That is capital tied up for two months or more, which is the real
        constraint on how aggressively a dealership can run this. Two practical
        points. First, a <Strong>staggered cadence</Strong> — smaller
        allocations more often — smooths cashflow better than one large
        shipment, even though the per-unit freight is slightly worse. Second,
        currency moves over eight weeks, so establish how your quote handles it
        rather than discovering the answer at settlement.
      </P>

      <H2 id="aftersales">Warranty and aftersales</H2>
      <P>
        Settle this before you order. Manufacturer warranty transferability
        across borders varies considerably by brand and by market, and the
        honest position is that it frequently does not transfer at all. Many
        dealers therefore back these units with their own workshop cover, priced
        into the retail figure.
      </P>
      <P>
        That is a perfectly sound model, but it needs to be a decision rather
        than a discovery. We confirm in writing what factory cover, if any,
        applies to your specific units as part of the quote — and if the answer
        is none, we say so plainly rather than leaving it ambiguous.
      </P>
      <P>
        Parts supply is the other half of aftersales, and it should shape which
        models you take at all. The reasoning is in{" "}
        <InlineLink href="/blog/best-cars-to-import-from-india">
          the best cars to import from India
        </InlineLink>
        .
      </P>

      <H2 id="risks">The risks worth pricing in</H2>
      <UL>
        <CheckLI>
          <Strong>Specification variance.</Strong> Managed by the process above.
          Priced in as a small contingency on first orders with a new
          specification.
        </CheckLI>
        <CheckLI>
          <Strong>Currency movement</Strong> across a two-month cycle.
        </CheckLI>
        <CheckLI>
          <Strong>Duty reclassification.</Strong> Tariff schedules change, and a
          change mid-shipment lands on the arriving container.
        </CheckLI>
        <CheckLI>
          <Strong>Port delay.</Strong> Almost always a documentation issue
          rather than a shipping one — see{" "}
          <InlineLink href="/blog/india-car-export-documents-explained">
            the document guide
          </InlineLink>
          .
        </CheckLI>
        <CheckLI>
          <Strong>Model-year transition.</Strong> Ordering across a facelift
          boundary can produce units that differ visibly from the ones you
          advertised.
        </CheckLI>
      </UL>
      <P>
        None of these is a reason not to run India. All of them are reasons to
        run it with a written specification and a partner with staff in the
        country. See what our{" "}
        <InlineLink href="/source-cars-from/india">India office</InlineLink>{" "}
        handles, or start with{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-india">
          the landed-cost breakdown
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Margin, duty treatment and warranty transferability vary by market,
        brand and model year, and tariff schedules change. Nothing here is a
        projection of returns for any specific market. Confirm the current duty
        position and warranty terms for your destination before committing to an
        allocation.
      </Disclaimer>
    </>
  );
}
