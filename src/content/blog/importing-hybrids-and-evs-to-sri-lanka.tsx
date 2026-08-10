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
        Sri Lanka is a hybrid country by tax design rather than by taste.
        Whether it is ready to be an electric country is a more interesting
        question, and the honest answer depends less on the tax structure than
        on two things nobody asks about first: the measured condition of the
        battery, and whether you can charge at home.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Hybrids dominate because the{" "}
            <Strong>duty structure and fuel prices point the same way</Strong>.
          </>,
          <>
            <Strong>Have the hybrid battery tested</Strong>, not described.
            Module imbalance precedes warning lights.
          </>,
          <>
            On a used EV, <Strong>state of health is the value</Strong> —
            replacement often exceeds the car.
          </>,
          <>
            Reliable home charging is the deciding factor, ahead of the tax
            position.
          </>,
        ]}
      />

      <H2 id="why-hybrids">Why hybrids took over</H2>
      <P>
        Two forces pushing the same direction. The duty and excise structure has
        historically favoured small-capacity hybrid vehicles, which made them
        substantially cheaper to land than equivalent petrol cars. And fuel
        prices combined with congested urban driving reward efficiency more
        heavily here than in most markets.
      </P>
      <P>
        The result is a market where the Toyota Aqua, Prius and Axio and the
        Honda Fit and Vezel are not niche choices but the default. That
        concentration then becomes self-reinforcing: deep parts availability,
        mechanics who have seen thousands of them, and strong resale. Buying
        into it is usually the financially correct decision rather than merely
        the conventional one.
      </P>

      <H2 id="duty">How drivetrain affects the duty position</H2>
      <P>
        Petrol, diesel, hybrid and electric vehicles have been treated
        differently, and the differences have been large enough to reshape what
        people drive. That is the mechanism behind everything described above.
      </P>
      <Callout title="The caveat that matters" tone="amber">
        <p>
          This treatment has been revised more than once, in both directions.
          What was favourable three years ago may not be favourable now, and
          something that was unattractive may have become the smart choice. This
          is one of the specific things our Colombo team confirms with Sri Lanka
          Customs before sourcing — never from a published table, including
          ours.
        </p>
      </Callout>
      <P>
        The mechanics of valuation and banding are set out in{" "}
        <InlineLink href="/blog/sri-lanka-vehicle-import-taxes-explained">
          Sri Lanka vehicle import taxes explained
        </InlineLink>
        .
      </P>

      <H2 id="battery">Checking a used hybrid battery</H2>
      <P>
        The most common mistake on this route is treating a used hybrid like a
        used petrol car with better fuel economy. The traction battery is a wear
        item with a significant replacement cost, and its condition is not
        visible.
      </P>
      <P>
        The important technical point: a hybrid battery pack is made of
        individual modules, and packs fail by <Strong>imbalance</Strong> long
        before they fail outright. A diagnostic that reads individual module
        voltages will show developing imbalance while the car still drives
        normally and no warning light has appeared. By the time the dashboard
        tells you, the cost has already arrived.
      </P>
      <UL>
        <CheckLI>
          <Strong>Have a module-level diagnostic run</Strong>, not a visual
          check and not a seller&rsquo;s assurance.
        </CheckLI>
        <CheckLI>
          <Strong>Ask about module replacement history.</Strong> Partial
          replacement is common and is not automatically bad — a mixed-age pack
          is worth knowing about.
        </CheckLI>
        <CheckLI>
          <Strong>Factor the pack into the price.</Strong> On an older hybrid,
          budgeting for eventual battery work is realistic rather than
          pessimistic.
        </CheckLI>
        <CheckLI>
          <Strong>Confirm who services it locally.</Strong> On the common models
          this is straightforward; on anything unusual it may not be.
        </CheckLI>
      </UL>
      <P>
        Every hybrid we source is tested at origin and the result is included in
        the report you see before payment is released.
      </P>

      <H2 id="ev-case">The case for a used EV</H2>
      <P>
        There is a genuine one, and it rests on running costs. Electricity
        against fuel, on urban journeys, in a market with high fuel prices, is a
        real and recurring saving. Servicing is simpler — no oil changes, no
        exhaust, far less brake wear thanks to regeneration.
      </P>
      <P>
        And used electric stock is now genuinely available. New Zealand in
        particular has one of the world&rsquo;s few deep used-EV markets, which
        makes it a realistic source rather than a theoretical one —{" "}
        <InlineLink href="/blog/importing-a-used-ev-from-new-zealand">
          the detail is here
        </InlineLink>
        .
      </P>

      <H2 id="ev-against">The case against</H2>
      <P>
        Two conditions, and both are hard requirements rather than preferences.
      </P>
      <P>
        <Strong>Battery state of health.</Strong> On a used EV the battery is
        most of the value, and replacement frequently costs more than the
        vehicle is worth. A car with a degraded pack is not a cheap EV — it is a
        car with a terminal condition and a deceptively low price. There is no
        substitute for a measured reading, and we will not export an electric
        vehicle without one.
      </P>
      <P>
        <Strong>Charging reality.</Strong> Reliable charging you control — at
        home, overnight — changes the calculation completely. Depending on
        public infrastructure is a much larger assumption, and it is the one
        that most often turns an enthusiastic EV purchase into a frustrating
        one. Be honest with yourself about which situation you are in.
      </P>
      <P>
        There is a third, smaller issue: older Japanese-origin EVs commonly use
        the CHAdeMO fast-charging standard while much of the world has moved to
        CCS. Check what your local network actually supports before buying.
      </P>

      <H2 id="verdict">A practical recommendation</H2>
      <UL>
        <CheckLI>
          <Strong>Most buyers: a small-capacity hybrid.</Strong> Aqua, Fit,
          Axio, Prius or Vezel. Proven on Sri Lankan roads, deeply supported
          locally, strong resale, and historically well placed in the duty
          structure. Have the battery tested.
        </CheckLI>
        <CheckLI>
          <Strong>
            With reliable home charging and a good state-of-health reading: a
            used EV.
          </Strong>{" "}
          The running-cost case is real when both conditions are met.
        </CheckLI>
        <CheckLI>
          <Strong>Without reliable home charging: a plug-in hybrid.</Strong>{" "}
          Electric for the commute, petrol for everything else, and no range
          anxiety attached to a pack you cannot fully trust.
        </CheckLI>
        <CheckLI>
          <Strong>In every case: model the landed cost first.</Strong> On this
          market the tax treatment can change the answer entirely, and it
          changes more often than the cars do.
        </CheckLI>
      </UL>
      <P>
        Our{" "}
        <InlineLink href="/source-cars-from/sri-lanka">
          Colombo office
        </InlineLink>{" "}
        confirms the current position before sourcing and compares the landed
        figure across our Japan, Thailand, India and UK offices for the
        specification you want.
      </P>

      <Disclaimer>
        Sri Lanka&rsquo;s duty and excise treatment of hybrid and electric
        vehicles has been revised repeatedly and continues to change. Nothing
        here states current rates or confirms eligibility. Battery condition
        varies substantially between apparently similar vehicles, and
        charging-standard support varies by market. Confirm the position with
        Sri Lanka Customs and verify battery condition before committing.
      </Disclaimer>
    </>
  );
}
