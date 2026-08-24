import {
  Callout,
  CheckLI,
  Disclaimer,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  OL,
  P,
  Strong,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        In most countries the car is the hard part and the paperwork is routine.
        Sri Lanka works the other way round. Eligibility, customs valuation,
        engine-capacity bands and drivetrain treatment can move the final cost
        dramatically, and they can change between one shipment and the next.
        Here is the process in the order that actually protects you.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Settle the policy position first</Strong>, before you choose
            a car.
          </>,
          <>
            Duty is assessed on{" "}
            <Strong>customs valuation, not your invoice</Strong>.
          </>,
          <>
            Four of our source countries supply this market — compare the{" "}
            <Strong>landed cost from each</Strong>.
          </>,
          <>
            Rules change often. Treat every published figure, including ours, as
            indicative until verified.
          </>,
        ]}
      />

      <H2 id="policy">Start with the policy, not the car</H2>
      <P>
        This is the single most important paragraph in this guide. Sri Lanka
        restricted vehicle imports substantially from 2020 and has moved through
        phased reopening since, with eligibility and treatment varying by
        vehicle category. Anything published as a fixed rate card ages quickly.
      </P>
      <P>
        So the first step is not choosing a model. It is establishing, for the
        specific vehicle you have in mind, what the{" "}
        <Strong>current position actually is</Strong> — eligibility,
        engine-capacity band, drivetrain treatment, age limits and permit
        requirements — with Sri Lanka Customs as they stand today.
      </P>
      <Callout title="Why we verify per shipment" tone="amber">
        <p>
          Our Colombo team confirms the current position with the authorities
          before any vehicle is sourced. Not from last year&rsquo;s rate card,
          and not from a published table — including this article. Anything you
          read online about Sri Lankan import rules should be treated as
          background rather than as a basis for committing money.
        </p>
      </Callout>

      <H2 id="source">Choosing a source country</H2>
      <P>
        Sri Lanka is served by four of our source countries, and the right one
        what you want:
      </P>
      <UL>
        <CheckLI>
          <Strong>Japan</Strong> supplies most of the market&rsquo;s small
          hybrids, with an independent auction grade attached before anyone
          bids. For the Aqua, Prius, Axio, Fit and Vezel that dominate Sri
          Lankan roads, this is the default.
        </CheckLI>
        <CheckLI>
          <Strong>Thailand</Strong> is the production source for pickups and
          body-on-frame SUVs, and can supply new export-specification vehicles.
        </CheckLI>
        <CheckLI>
          <Strong>India</Strong> is closest, cheapest to freight from, and
          strongest on new compact cars with parts support that reaches across
          South Asia.
        </CheckLI>
        <CheckLI>
          <Strong>The UK</Strong> suits specific premium models where the
          British used market has depth that Asia does not.
        </CheckLI>
      </UL>
      <P>
        Rather than defaulting to one origin, we compare the landed cost from
        each for the specification you want. On this market that comparison
        matters more than usual, because the tax structure can favour a
        different source than the vehicle price would suggest.
      </P>

      <H2 id="valuation">How customs valuation drives the cost</H2>
      <P>
        Sri Lankan duty and excise are assessed on a customs valuation of the
        vehicle rather than on what you paid for it. That single fact reshapes
        the whole exercise.
      </P>
      <P>
        The practical consequence is that{" "}
        <Strong>
          finding a cheap car abroad does not automatically produce a cheap
          import
        </Strong>
        . Two vehicles with the same purchase price can land at very different
        totals depending on engine capacity, drivetrain and age. Understanding
        how the valuation will be reached for your specific vehicle is worth
        more than negotiating the purchase price.
      </P>
      <P>
        The mechanics are set out in{" "}
        <InlineLink href="/blog/sri-lanka-vehicle-import-taxes-explained">
          Sri Lanka vehicle import taxes explained
        </InlineLink>
        .
      </P>

      <H2 id="shipping">Shipping and arrival</H2>
      <P>
        Transit is roughly two to four weeks from Japan and Thailand and one to
        two weeks from India and the Gulf. Vehicles arrive at Colombo, with
        Hambantota available as an alternative.
      </P>
      <P>
        The critical timing point is documentary rather than nautical:{" "}
        <Strong>the paperwork should be ahead of the ship</Strong>. Originals
        travel by tracked courier separately from the vehicle, with the full
        scanned set issued at the point of shipment so clearance preparation
        begins before the vessel docks. A car waiting at Colombo for an envelope
        is accruing storage charges daily, and this is the most common avoidable
        cost in the whole process.
      </P>

      <H2 id="clearance">Clearance at Colombo</H2>
      <OL>
        <LI>
          <Strong>Document lodgement.</Strong> Bill of Lading, commercial
          invoice with supporting valuation documentation, source-country export
          certificate with certified translation, and any required inspection
          certificate.
        </LI>
        <LI>
          <Strong>Customs valuation.</Strong> The assessed value is established,
          which sets the base for duty and excise.
        </LI>
        <LI>
          <Strong>Duty and excise assessment.</Strong> Applied according to the
          current schedule for that vehicle&rsquo;s category, capacity and
          drivetrain.
        </LI>
        <LI>
          <Strong>Payment and release.</Strong> Charges settled and the vehicle
          released from the port.
        </LI>
      </OL>
      <P>
        Our Colombo team handles this in person and explains the assessment to
        you line by line rather than presenting a total. On a process this
        document-heavy, being able to ask somebody why a number is what it is
        has genuine value.
      </P>

      <H2 id="registration">Registration and handover</H2>
      <P>
        Registration paperwork follows clearance, and then the vehicle is plated
        and handed over. The local team remains available afterwards for
        whatever the process throws up — queries on the assessment, registration
        follow-ups, or anything that surfaces in the first weeks of ownership.
      </P>
      <P>
        For which vehicles actually make sense on Sri Lankan roads and in Sri
        Lankan tax bands, see{" "}
        <InlineLink href="/blog/best-cars-to-import-to-sri-lanka">
          the best cars to import to Sri Lanka
        </InlineLink>
        , or talk to our{" "}
        <InlineLink href="/source-cars-from/sri-lanka">Colombo team</InlineLink>{" "}
        directly.
      </P>

      <Disclaimer>
        Sri Lanka&rsquo;s vehicle import policy, duty structure and eligibility
        rules have changed substantially and repeatedly in recent years and
        continue to change. Nothing in this article should be relied on as the
        current position. Confirm eligibility, valuation methodology and
        applicable rates with Sri Lanka Customs for your specific vehicle before
        committing — we do this per shipment as part of every quote.
      </Disclaimer>
    </>
  );
}
