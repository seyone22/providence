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
  StatGrid,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";
import {
  ConfirmedLedger,
  PullQuote,
  Timeline,
} from "@/components/news/newsProse";

export default function MitsubishiPajeroRevealedSpecificationsLaunchMarkets() {
  return (
    <>
      <Lead>
        Mitsubishi Motors revealed the all-new Pajero on{" "}
        <Strong>2 September 2026</Strong>. It is a ladder-frame, seven-seat
        cross-country SUV built at the company&rsquo;s plant in{" "}
        <Strong>Thailand</Strong>, running a 2.4-litre clean diesel with a
        single variable-geometry turbocharger, <Strong>480 Nm</Strong> and an
        eight-speed automatic. Thailand gets it first, then Japan and Australia
        inside fiscal 2026, then around 100 further countries from fiscal 2027.
        Mitsubishi published the specification, the dimensions and the launch
        order. It published no price, in any market, and no power output. Both
        of those omissions matter more to an importer than anything that was
        announced.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The all-new Pajero is <Strong>built in Thailand</Strong>, on a
            ladder frame derived from the Mitsubishi Triton, and launches in{" "}
            <Strong>Thailand first</Strong>, followed by Japan and Australia
            during fiscal 2026 &mdash; April 2026 to March 2027 on
            Mitsubishi&rsquo;s calendar.
          </>,
          <>
            Around <Strong>100 further countries</Strong> follow from{" "}
            <Strong>fiscal 2027 onward</Strong>, which begins in April 2027.
            Outside Thailand, Japan and Australia, there is no official car
            before then. That single sentence is the whole import story.
          </>,
          <>
            The engine is a 2.4-litre clean diesel with a{" "}
            <Strong>single</Strong> wide-range variable geometry turbocharger
            &mdash; not the Triton&rsquo;s twin-turbo, which a great deal of
            pre-reveal coverage still says and which is now wrong. Torque is 480
            Nm, or 470 Nm on select specifications.
          </>,
          <>
            <Strong>Mitsubishi has not published a price in any market.</Strong>{" "}
            Not Thailand, not Japan, not Australia. Any landed-cost figure you
            are shown for this car today is built on a purchase price nobody
            has.
          </>,
          <>
            <Strong>Mitsubishi has not published a power output either.</Strong>{" "}
            The 150 kW and 3,500 kg braked towing figures now circulating come
            from CarsGuide&rsquo;s reporting, not from Mitsubishi&rsquo;s
            release.
          </>,
        ]}
      />

      <H2 id="confirmed">What Mitsubishi actually confirmed</H2>

      <P>
        The world-premiere release is unusually complete on hardware and
        unusually silent on commerce. Mitsubishi gave dimensions to the
        millimetre, approach and departure angles to one decimal place, the
        drivetrain architecture, the seating mechanism and the audio brand. It
        gave no price, no power figure and no towing rating.
      </P>

      <StatGrid
        stats={[
          { value: "2.4 L", label: "Clean diesel, single VGT" },
          { value: "480 Nm", label: "470 Nm on select specifications" },
          { value: "8-speed", label: "Automatic with sport mode" },
          { value: "230 mm", label: "Ground clearance" },
          { value: "7 seats", label: "Three-row layout" },
          { value: "Thailand", label: "Where it is built" },
        ]}
      />

      <Table
        head={["Measure", "Figure"]}
        rows={[
          ["Length", "4,920 mm"],
          ["Width", "1,925 mm"],
          ["Height", "1,910 mm"],
          ["Wheelbase", "2,870 mm"],
          ["Track, front and rear", "1,630 mm"],
          ["Ground clearance", "230 mm"],
          ["Approach angle", "30.4 degrees"],
          ["Ramp breakover angle", "22.6 degrees"],
          ["Departure angle", "25.8 degrees"],
          ["Weight distribution", "52:48 front to rear"],
        ]}
        caption="Source: Mitsubishi Motors Corporation, 'Mitsubishi Motors Unveils the All-New Pajero Cross-Country SUV', 2 September 2026. Mitsubishi footnotes that figures apply to vehicles equipped with 20-inch tyres."
      />

      <P>
        The four-wheel-drive system is <Strong>Super Select 4WD-II</Strong>{" "}
        &mdash; 2H, 4H, 4HLc and 4LLc &mdash; integrated with Super-All Wheel
        Control and Active Yaw Control, with seven drive modes named as Normal,
        Eco, Gravel, Snow, Mud, Sand and Rock. The frame is derived from the
        Triton pickup, with a double-wishbone front end and a newly developed
        five-link rigid rear axle. The second row slides 150 mm and tumbles; the
        third row folds flat.
      </P>

      <P>
        Inside, a monolithic display integrates two 14.3-inch screens, dropping
        to 12.3-inch on select specifications. Mitsubishi fits eight airbags,
        including what it says is its first SRS centre airbag, three-zone
        climate control with seat ventilation, MI-PILOT highway assistance and
        Emergency Lane Assist. The audio is a 12-speaker system developed with
        Yamaha. The instrument display reworks the Pajero&rsquo;s triple-gauge
        layout and shows altitude, compass, pitch and roll.
      </P>

      <H2 id="not-published">
        The two numbers everyone is quoting that Mitsubishi did not publish
      </H2>

      <P>
        Two figures are being repeated as though they came from the
        manufacturer. They did not. <Strong>150 kW</Strong> and a{" "}
        <Strong>3,500 kg braked towing capacity</Strong> both come from
        CarsGuide&rsquo;s reporting on the reveal. Mitsubishi&rsquo;s own
        release states torque and says nothing at all about power or towing.
      </P>

      <P>
        That is not a reason to disbelieve either number. 150 kW is what the
        Triton&rsquo;s 2.4-litre diesel produces, and 480 Nm is 10 Nm more than
        the Triton&rsquo;s 470 Nm, which also explains the &ldquo;470 Nm on
        select specifications&rdquo; footnote &mdash; some markets appear to get
        the Triton&rsquo;s tune. It is a reason to attribute them correctly. If
        you are a dealer sizing a towing proposition against a Ford Everest or a
        Toyota Prado, the difference between &ldquo;Mitsubishi rates it at 3,500
        kg&rdquo; and &ldquo;CarsGuide reports 3,500 kg&rdquo; is the difference
        between a specification and a report of one.
      </P>

      <Callout title="The correction worth making" tone="amber">
        <p>
          A large amount of pre-reveal coverage &mdash; still live, still
          indexed &mdash; describes this car as having a{" "}
          <strong>
            2.4-litre bi-turbo diesel with 150 kW and 470 Nm, matched to a
            six-speed automatic
          </strong>
          . Mitsubishi&rsquo;s release says a <strong>single</strong> wide-range
          variable geometry turbocharger, 480 Nm, and a newly developed{" "}
          <strong>eight-speed</strong> automatic. Two of those three details
          changed at the reveal. If a quote you are given cites a six-speed
          gearbox, it was written before 2 September 2026.
        </p>
      </Callout>

      <H2 id="launch-order">Why the launch order is the story</H2>

      <P>
        Mitsubishi&rsquo;s sequencing is precise, and it is the part of the
        release with the most commercial consequence.
      </P>

      <Timeline
        items={[
          {
            time: "2 September 2026",
            title: "World premiere",
            body: "Mitsubishi Motors reveals the all-new Pajero from Tokyo. Specification, dimensions and launch markets are published. No pricing, in any market.",
          },
          {
            time: "Fiscal 2026",
            title: "Thailand, then Japan and Australia",
            body: "Mitsubishi states the model launches in Thailand first, followed by Japan and Australia, all during fiscal 2026 — which the company defines as April 2026 to March 2027. Australian trade press reports a local arrival before the end of 2026.",
          },
          {
            time: "Fiscal 2027 onward",
            title: "Approximately 100 countries",
            body: "Mitsubishi plans to launch the Pajero in around 100 countries, naming ASEAN, Latin America and the Middle East. Mitsubishi's fiscal 2027 begins in April 2027, so this is the earliest an official car reaches most of the world.",
          },
        ]}
      />

      <P>
        Read that as a buyer rather than as an enthusiast. If you are in Kenya,
        Jamaica, Mauritius, New Zealand or Sri Lanka, the Pajero is not a 2026
        car for you through the official channel. It is a fiscal-2027 car at the
        earliest, and &ldquo;approximately 100 countries&rdquo; is not a
        commitment that yours is one of them. The only way a Pajero reaches
        those markets before then is out of a market that already has it &mdash;
        which, for the whole of fiscal 2026, means Thailand, Japan or Australia.
      </P>

      <PullQuote>
        Mitsubishi has told you exactly which three countries will have this car
        first. For everyone else, the launch calendar is a sourcing problem, not
        a waiting problem.
      </PullQuote>

      <P>
        We have set out what each of those corridors actually involves &mdash;
        what a Thai domestic price contains, what an Australian one contains,
        and which one is likely to reach a port first &mdash; in{" "}
        <InlineLink href="/latest-news/mitsubishi-pajero-thailand-australia-sourcing-corridors">
          our read on the Thailand and Australia corridors
        </InlineLink>
        .
      </P>

      <H2 id="applies">Does this apply to you, and is it legal to import?</H2>

      <P>
        It applies to you if you buy or sell right-hand-drive SUVs. All three
        first-launch markets &mdash; Thailand, Japan and Australia &mdash; are
        right-hand drive, so the Pajero arrives in the hand most of our
        destinations register. Mitsubishi names Latin America and the Middle
        East in the later rollout, which implies a left-hand-drive car exists,
        but the company has not confirmed one.
      </P>

      <P>
        On admissibility, the useful point is that this is a{" "}
        <Strong>new vehicle</Strong>. The age limits that govern used imports in
        Kenya, Sri Lanka and much of the Caribbean do not bite on a
        zero-kilometre car. What replaces them is type approval. In markets
        where Mitsubishi will sell the Pajero officially, a privately imported
        example inherits nothing from that: it is still an individual import,
        assessed individually. In Ireland and the United Kingdom, where the
        Pajero is not currently sold, registration means individual approval
        rather than a certificate of conformity &mdash; and there is no
        published CO&#8322; figure yet, so Irish Vehicle Registration Tax cannot
        be calculated at all. The mechanism is set out in our{" "}
        <InlineLink href="/blog/vrt-explained-ireland">VRT guide</InlineLink>.
      </P>

      <P>
        Verify the current position with the destination authority rather than
        with us: the Kenya Bureau of Standards and the Kenya Revenue Authority
        for Kenya, NZTA for New Zealand, Revenue and the NSAI for Ireland, and
        the national customs authority for the Caribbean markets.
      </P>

      <H2 id="landed-cost">What can anyone honestly tell you it lands at?</H2>

      <P>
        Nothing, yet, and anyone who gives you a figure is guessing at the
        largest input. A landed cost is built from a purchase price, inland
        transport, ocean freight, marine insurance, duty and consumption tax.
        Five of those six can be estimated today. The purchase price cannot,
        because it does not exist in any market.
      </P>

      <P>
        There is a second trap waiting behind the first. When Thai and
        Australian prices do appear, they will be{" "}
        <Strong>domestic retail prices with domestic taxes inside them</Strong>,
        and neither is a CIF base. Thailand levies excise tax on motor vehicles
        as an ad valorem charge calculated on the suggested retail price rather
        than on an ex-works value, with value-added tax on top; we are not
        publishing the Thai rates, because the Excise Department&rsquo;s
        motor-vehicle schedule was not reachable when we checked on 2 September
        2026. Australia&rsquo;s list prices carry <Strong>10% GST</Strong> and
        exclude all on-road costs, per the Australian Taxation Office, checked 2
        September 2026. Subtracting a landed cost from a domestic list price, in
        either country, produces a number that means nothing.
      </P>

      <Disclaimer>
        No Thai excise or VAT rate is stated above, because we could not verify
        one against the Thai Excise Department or Revenue Department on 2
        September 2026. The Australian GST position is the ATO&rsquo;s, checked
        the same day, and no Luxury Car Tax figure is stated. Tax and duty
        positions change. Confirm the current rate and its treatment on an
        export sale with the relevant authority, or with your customs broker,
        before you commit money. Providence does not pay import or registration
        taxes on a customer&rsquo;s behalf &mdash; they are charged to the
        registered owner.
      </Disclaimer>

      <P>
        If you want to see how the whole stack behaves for a specific
        destination once a price exists, the{" "}
        <InlineLink href="/ireland-cost-calculator">
          Ireland cost calculator
        </InlineLink>{" "}
        models it end to end for an Irish landing, and our guides to{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-thailand">
          importing from Thailand
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-australia">
          importing from Australia
        </InlineLink>{" "}
        set out the two corridors this car will actually come out of.
      </P>

      <H2 id="timing">Should you move now or wait?</H2>

      <UL>
        <CheckLI>
          <Strong>
            If you want the car and live in Thailand, Japan or Australia:
          </Strong>{" "}
          wait for local pricing, which is the next thing Mitsubishi has to
          publish. There is nothing to commit to until then.
        </CheckLI>
        <CheckLI>
          <Strong>
            If you are importing into a market not in the first three:
          </Strong>{" "}
          registering interest now costs nothing and puts you in a queue that
          will form quickly. Committing a deposit against an unpublished price
          does not.
        </CheckLI>
        <CheckLI>
          <Strong>If you are a dealer:</Strong> the decision is not about this
          car, it is about the fiscal-2027 rollout. If your market is inside the
          approximately-100 list, official supply arrives from April 2027 and
          competes with anything you land before it. If it is outside, the
          import route is the only route and the window is longer.
        </CheckLI>
        <CheckLI>
          <Strong>If you are in Ireland or the United Kingdom:</Strong> wait,
          and be prepared to wait indefinitely. Without a published CO&#8322;
          figure and a settled individual-approval path, a quote for this car in
          either market is arithmetic performed on a blank.
        </CheckLI>
      </UL>

      <H2 id="nameplate">What the nameplate brings with it</H2>

      <P>
        The Pajero was introduced in 1982 and sold in more than 170 countries
        and regions, with production across four generations exceeding 3.29
        million units, on Mitsubishi&rsquo;s own figures. It was discontinued in
        overseas markets in 2021, which makes this the first return to the
        global market in five years.
      </P>

      <P>
        Mitsubishi cites 12 Dakar Rally victories including seven consecutive
        wins, and that record survives checking &mdash; the seven-in-a-row run
        was 2001 to 2007, and neither figure has been beaten. It is one of the
        rare occasions where a manufacturer&rsquo;s heritage claim is exactly as
        strong as stated. What it does not tell you is what the car is worth in
        three years in your market, because a nameplate absent for five years
        has no recent residual history anywhere. A dealer should price that
        uncertainty in rather than assume the badge carries it.
      </P>

      <ConfirmedLedger
        confirmed={[
          <>
            The specification, dimensions, angles, drivetrain and equipment
            above, all from Mitsubishi Motors Corporation&rsquo;s world-premiere
            release of 2 September 2026.
          </>,
          <>
            Built at Mitsubishi&rsquo;s production base in{" "}
            <Strong>Thailand</Strong>, launching in Thailand first, then Japan
            and Australia during fiscal 2026, then approximately 100 countries
            from fiscal 2027 onward.
          </>,
          <>
            A <Strong>single</Strong> wide-range variable geometry turbocharger,
            480 Nm (470 Nm on select specifications), and a newly developed
            eight-speed automatic.
          </>,
          "Twelve Dakar Rally victories including seven consecutive wins, from 2001 to 2007 — verified against the record rather than repeated.",
        ]}
        unconfirmed={[
          <>
            <Strong>Price, in every market.</Strong> Mitsubishi has published
            none. Thai, Japanese and Australian pricing are all outstanding.
          </>,
          <>
            <Strong>Maximum power.</Strong> Absent from Mitsubishi&rsquo;s
            release. The 150 kW in circulation is CarsGuide&rsquo;s reporting.
          </>,
          <>
            <Strong>Braked towing capacity.</Strong> Absent from
            Mitsubishi&rsquo;s release. The 3,500 kg figure is
            CarsGuide&rsquo;s.
          </>,
          <>
            <Strong>
              Fuel consumption, CO&#8322; and emissions compliance.
            </Strong>{" "}
            Not published, which is what makes registration tax uncomputable in
            any CO&#8322;-banded market.
          </>,
          <>
            <Strong>Grade equipment levels.</Strong> Australian approval
            documents show four grades across six variants; what separates them
            has not been published by Mitsubishi.
          </>,
          <>
            <Strong>Whether Mitsubishi calls this the fifth generation.</Strong>{" "}
            The release says &ldquo;all-new&rdquo; and counts four prior
            generations. We have not put the phrase in its mouth.
          </>,
        ]}
      />

      <H3>The one-line version</H3>

      <P>
        A private importer or dealer in a right-hand-drive market should read
        this because the Pajero&rsquo;s launch order confines the car to
        Thailand, Japan and Australia until April 2027, which makes it a
        sourcing decision rather than a showroom one.
      </P>

      <Callout
        title="Registering a specification rather than an enquiry"
        tone="emerald"
      >
        <p>
          Our{" "}
          <InlineLink href="/b2c/gallery/mitsubishi-pajero-2026">
            Mitsubishi Pajero page
          </InlineLink>{" "}
          carries the confirmed specification and the Australian grade
          structure, so you can register interest against a grade and a
          destination rather than a general enquiry. Thailand and Australia are
          both countries our own team buys in &mdash;{" "}
          <InlineLink href="/request">
            tell us where the car is going
          </InlineLink>{" "}
          and we will model the landed figure the day a price is published, and
          tell you plainly if the answer is that it does not work.
        </p>
      </Callout>
    </>
  );
}
