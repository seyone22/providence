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
        On a used electric car, the battery is most of the value and none of it
        is visible. Two identical-looking vehicles with similar mileage can be
        worth very different money, because one has 90% of its original capacity
        and the other has 65%. Everything else about buying a used EV is
        secondary — and, unlike the battery, obvious.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>State of health is the number.</Strong> Never buy a used EV
            without a measured reading.
          </>,
          <>
            Degradation depends on{" "}
            <Strong>age, chemistry, climate and charging habits</Strong>, not
            just mileage.
          </>,
          <>
            <Strong>Check the charging standard</Strong> against your local
            network before buying.
          </>,
          <>Reliable home charging changes the calculation completely.</>,
        ]}
      />

      <H2 id="why-nz">Why New Zealand for a used EV</H2>
      <P>
        Because supply exists. Most markets that want used electric vehicles do
        not have any — electrification is recent, and a used market takes a
        decade to form. New Zealand absorbed used Nissan Leafs and plug-in
        hybrids from Japan over more than ten years on top of strong local
        uptake, which produced genuine depth: enough stock to be selective
        rather than grateful.
      </P>
      <P>
        The secondary benefit is the same one that applies to all New Zealand
        stock — entry certification, English documentation and a local service
        record. Details in{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-new-zealand">
          how to import a car from New Zealand
        </InlineLink>
        .
      </P>

      <H2 id="soh">State of health: the only number that matters</H2>
      <P>
        Battery state of health is the pack&rsquo;s remaining usable capacity
        expressed as a percentage of its original capacity. It determines the
        car&rsquo;s real range, its resale value, and whether it is a sensible
        purchase at all.
      </P>
      <P>
        It matters this much because of what replacement costs. On many used
        EVs, a new battery pack costs more than the vehicle is worth — which
        means a car with a badly degraded pack is not a cheap EV, it is a car
        with a terminal condition and a deceptively low price.
      </P>
      <Table
        head={["State of health", "What it means", "Verdict"]}
        rows={[
          [
            <Strong key="h1">90%+</Strong>,
            "Minimal degradation. Range close to original.",
            "Excellent. Priced accordingly, and worth it.",
          ],
          [
            <Strong key="h2">80–90%</Strong>,
            "Normal degradation for age. Noticeable but manageable range loss.",
            "The typical good used EV. Fine for most buyers.",
          ],
          [
            <Strong key="h3">70–80%</Strong>,
            "Significant loss. Real-world range materially reduced.",
            "Only at a price that reflects it, and only for short-range use.",
          ],
          [
            <Strong key="h4">Below 70%</Strong>,
            "Heavy degradation, often accelerating.",
            "We do not export these. The economics do not work.",
          ],
        ]}
        caption="Bands are indicative — the acceptable figure depends on the original battery capacity, since 80% of a large pack is more usable range than 90% of a small one."
      />
      <Callout title="Our rule" tone="emerald">
        <p>
          We will not export an electric or plug-in hybrid vehicle without a
          measured state-of-health reading, and the reading goes to you before
          payment is released. A seller who cannot or will not provide one is
          asking you to buy the single most expensive component in the car
          unseen.
        </p>
      </Callout>

      <H2 id="degradation">How batteries actually degrade</H2>
      <P>
        Mileage is a poor predictor, which is why the odometer is the wrong
        thing to look at on an EV. Degradation is driven by:
      </P>
      <UL>
        <CheckLI>
          <Strong>Calendar age.</Strong> Cells degrade over time whether or not
          the car is driven. A low-mileage ten-year-old EV is still a
          ten-year-old battery.
        </CheckLI>
        <CheckLI>
          <Strong>Chemistry and thermal management.</Strong> Some packs are
          actively cooled and some are not, and it makes a large difference over
          a decade.
        </CheckLI>
        <CheckLI>
          <Strong>Climate.</Strong> Sustained heat is the enemy. New
          Zealand&rsquo;s temperate climate is genuinely favourable here — a
          real advantage over hot-climate used EVs.
        </CheckLI>
        <CheckLI>
          <Strong>Fast-charging frequency.</Strong> Regular DC fast charging
          accelerates degradation relative to slower AC charging.
        </CheckLI>
        <CheckLI>
          <Strong>Charge habits.</Strong> Routinely charging to 100% and running
          to near empty is harder on a pack than staying in the middle of the
          range.
        </CheckLI>
      </UL>
      <P>
        The practical consequence: two same-year, same-mileage cars can differ
        by fifteen percentage points of capacity. Ignore the brochure range
        figure entirely, read the measured state of health, and calculate
        real-world range from that.
      </P>

      <H2 id="charging">Charging standards and compatibility</H2>
      <P>
        The second thing that can make a used EV import a mistake, and it is
        entirely checkable in advance.
      </P>
      <P>
        Older Japanese-origin electric vehicles — which describes a large share
        of New Zealand&rsquo;s used stock — commonly use the{" "}
        <Strong>CHAdeMO</Strong> fast-charging standard, while much of the world
        has standardised on <Strong>CCS</Strong>. If your local fast-charging
        network is CCS only, a CHAdeMO car is limited to slower AC charging.
        Adapters exist but are not universally supported and not always
        sanctioned.
      </P>
      <P>Before buying, establish three things about your own market:</P>
      <UL>
        <CheckLI>
          <Strong>Which fast-charging standard</Strong> your public network
          actually uses.
        </CheckLI>
        <CheckLI>
          <Strong>What AC connector</Strong> your home supply and public
          chargers use.
        </CheckLI>
        <CheckLI>
          <Strong>Whether the vehicle&rsquo;s onboard systems</Strong> —
          navigation, telematics, charging apps — function outside their home
          market. Frequently they partly do not, which is an annoyance rather
          than a dealbreaker.
        </CheckLI>
      </UL>

      <H2 id="market-fit">Can your market support the car?</H2>
      <P>
        Worth asking plainly, because enthusiasm outruns infrastructure
        regularly. An imported used EV needs:
      </P>
      <UL>
        <CheckLI>
          <Strong>Reliable charging you control.</Strong> Home charging changes
          the calculation completely; depending entirely on public
          infrastructure is a much bigger assumption.
        </CheckLI>
        <CheckLI>
          <Strong>Somebody locally who can work on it.</Strong> High-voltage
          systems need trained technicians, and not every market has them for
          every brand.
        </CheckLI>
        <CheckLI>
          <Strong>A realistic view of range.</Strong> Measured state of health,
          applied to the original capacity, in your climate, on your journeys.
        </CheckLI>
        <CheckLI>
          <Strong>Registration eligibility.</Strong> Some markets treat imported
          EVs differently for duty or type approval — occasionally favourably.
        </CheckLI>
      </UL>
      <P>
        If reliable home charging is not available, a plug-in hybrid such as the
        Outlander PHEV is frequently the better import: electric for short
        journeys, petrol for everything else, and no range anxiety attached to a
        degraded pack.
      </P>

      <H2 id="checklist">The pre-purchase checklist</H2>
      <UL>
        <CheckLI>Measured battery state of health, documented</CheckLI>
        <CheckLI>
          Original battery capacity, to convert that into real range
        </CheckLI>
        <CheckLI>
          Fast-charging standard, checked against your local network
        </CheckLI>
        <CheckLI>AC connector type and home-charging plan</CheckLI>
        <CheckLI>Entry-certification and registration history</CheckLI>
        <CheckLI>Any battery module replacement history</CheckLI>
        <CheckLI>Local high-voltage service availability for the brand</CheckLI>
        <CheckLI>Destination registration and duty treatment for EVs</CheckLI>
      </UL>
      <P>
        We check all eight before recommending a vehicle. For the wider market,
        see{" "}
        <InlineLink href="/blog/best-cars-to-import-from-new-zealand">
          the best cars to import from New Zealand
        </InlineLink>
        , or what our{" "}
        <InlineLink href="/source-cars-from/new-zealand">
          New Zealand office
        </InlineLink>{" "}
        is sourcing.
      </P>

      <Disclaimer>
        State-of-health bands above are indicative and depend on original pack
        capacity and intended use. Charging standards, adapter legality and EV
        duty treatment vary by market and change. Confirm charging compatibility
        and registration eligibility for your specific vehicle and destination
        before committing.
      </Disclaimer>
    </>
  );
}
