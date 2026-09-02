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

export default function RangeRoverElectricRevealedSpecificationsPrice() {
  return (
    <>
      <Lead>
        JLR revealed the <Strong>Range Rover Electric</Strong> on{" "}
        <Strong>2 September 2026</Strong> and opened order books the same day.
        It is the first battery-electric car to wear the Range Rover name in the
        nameplate&rsquo;s 56 years: twin 260 kW motors, up to 550PS and 850Nm, a
        118.5 kWh usable battery on an 800-volt architecture, up to 372 miles
        WLTP, and <Strong>&pound;154,070 OTR</Strong> in the United Kingdom. It
        is built at Solihull, which is the part of the announcement that matters
        most to anyone reading this from outside Britain.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>&pound;154,070 on the road in the UK</Strong>, with order
            books open from 2 September 2026. Standard or long-wheelbase, in SE,
            HSE, Autobiography, SV, SV Ultra and SV Black, plus a First Edition.
            Long-wheelbase availability is market-specific on JLR&rsquo;s own
            note.
          </>,
          <>
            Twin permanent-magnet <Strong>260 kW</Strong> motors, up to{" "}
            <Strong>550PS</Strong> and <Strong>850Nm</Strong>, 0&ndash;60 mph in
            as little as <Strong>4.3 seconds</Strong>. JLR says it carries more
            torque than any Range Rover to date.
          </>,
          <>
            <Strong>372 miles WLTP</Strong>, and JLR publishes its own
            real-world figure of <Strong>333 miles</Strong> alongside it &mdash;
            about 10% below the lab number. Publishing both is unusual and worth
            crediting.
          </>,
          <>
            It is <Strong>built at Solihull</Strong>, on the same line as the
            combustion and hybrid cars, with battery packs and drive units from
            JLR&rsquo;s Wolverhampton plant. For an importer that makes the
            United Kingdom the source market, not one of several.
          </>,
          <>
            <Strong>Towing drops to 2,500 kg</Strong> from the combustion
            car&rsquo;s 3,500 kg, on Carscoops&rsquo; reporting &mdash; JLR
            published no towing figure. If you tow at the top of the range, this
            is the specification line that decides it.
          </>,
        ]}
      />

      <H2 id="confirmed">What JLR actually confirmed</H2>

      <P>
        The release is detailed on engineering and unusually forthcoming on
        range. JLR gave the battery chemistry and cell count, the charging
        curve&rsquo;s headline points, the traction-control response time in
        milliseconds, and two range figures rather than one.
      </P>

      <StatGrid
        stats={[
          { value: "550PS", label: "Twin 260 kW motors" },
          { value: "850Nm", label: "More than any Range Rover to date" },
          { value: "118.5 kWh", label: "Usable, 344 prismatic cells" },
          { value: "372 mi", label: "WLTP range" },
          { value: "900 mm", label: "Wading depth" },
          { value: "Solihull", label: "Where it is built" },
        ]}
      />

      <Table
        head={["Measure", "Figure"]}
        rows={[
          ["Motors", "Twin permanent magnet, 260 kW each"],
          ["Power", "Up to 550PS (about 542 hp)"],
          ["Torque", "850Nm"],
          ["0–60 mph", "As little as 4.3 seconds"],
          ["50–75 mph", "As little as 2.7 seconds"],
          ["Battery", "118.5 kWh usable, lithium-ion double-stack, 344 cells"],
          ["Architecture", "800-volt, with split charging"],
          ["Range, WLTP", "Up to 372 miles"],
          ["Range, JLR's real-world figure", "Up to 333 miles (535 km)"],
          ["DC charging", "10–80% in around 22 minutes at 350 kW"],
          ["Charge added in 10 minutes", "137 miles (220 km), WLTP"],
          ["Wading depth", "Up to 900 mm"],
          ["Gradient, pull-away", "Up to 33 degrees, in Single Pedal mode"],
          ["Gradient, rolling climb", "Up to 45 degrees"],
          ["Propulsion warranty", "8 years or 100,000 miles"],
        ]}
        caption="Source: JLR, 'Range Rover Electric: A New Era For The Original Luxury SUV', 2 September 2026. JLR notes that WLTP figures are for comparability between models tested under the same conditions and that real-world range varies."
      />

      <P>
        Two engineering claims are worth separating from the marketing around
        them. <Strong>Integrated Traction Management</Strong> controls motor
        speed within 50 milliseconds and manages slip up to 100 times faster
        than a combustion equivalent, which is a real consequence of electric
        propulsion rather than a styling exercise &mdash; torque arrives and
        leaves faster than a driveshaft and a torque converter can arbitrate.{" "}
        <Strong>Intelligent Driveline Dynamics</Strong> distributes rear torque
        from 100% to zero. The 900 mm wading depth and the 45-degree climb are
        the numbers that tell you JLR did not quietly retire the capability case
        to make the range figure work.
      </P>

      <H3>The superlative, checked</H3>

      <P>
        This is the first electric <Strong>Range Rover</Strong>. It is not
        JLR&rsquo;s first electric car &mdash; the Jaguar I-Pace went on sale in
        2018, and it is not the group&rsquo;s first attempt at a battery
        vehicle. The claim JLR makes is precise and it survives checking; some
        of the coverage repeating it is not. If you see &ldquo;JLR&rsquo;s first
        EV&rdquo; today, the writer has lost eight years somewhere.
      </P>

      <H2 id="price">What &pound;154,070 is, and what it is not</H2>

      <P>
        <Strong>&pound;154,070</Strong> is an on-the-road price in the United
        Kingdom. An OTR price is a domestic retail figure with domestic taxes
        inside it, and it is not a base for an import calculation in any other
        country. In the UK that figure carries value added tax at 20%, plus the
        &pound;55 DVLA first registration fee and the &pound;10 first-year
        vehicle excise duty a zero-emission car pays when registered on or after
        1 April 2025 &mdash; both GOV.UK figures, checked 3 September 2026.
      </P>

      <P>
        Strip those out and the arithmetic is straightforward. The registration
        fee and the first-year duty sit outside VAT, leaving{" "}
        <Strong>&pound;154,005</Strong> as the VAT-inclusive vehicle price.
        Divide by 1.2 and the car is <Strong>&pound;128,337.50</Strong> before
        tax, with <Strong>&pound;25,667.50</Strong> of VAT sitting on top. That
        VAT figure is the single largest number in this article for anyone
        buying the car to send somewhere else, and we have set out how it
        behaves on an export sale in our{" "}
        <InlineLink href="/latest-news/range-rover-electric-uk-sourcing-export-vat">
          read on sourcing the car out of the United Kingdom
        </InlineLink>
        .
      </P>

      <PullQuote>
        A £154,070 OTR price is a British retail number. Roughly £25,700 of it
        is a tax that a buyer in Nairobi, Auckland or Kingston was never going
        to pay.
      </PullQuote>

      <P>
        In euros, at the European Central Bank&rsquo;s reference rate of{" "}
        <Strong>0.85870 EUR/GBP on 2 September 2026</Strong>, &pound;154,070 is
        about <Strong>&euro;179,400</Strong> and the ex-VAT figure is about{" "}
        <Strong>&euro;149,500</Strong>. Those are conversions of a UK price on a
        single day, not quotes: the rate on the day you actually pay is the one
        that counts, and the rate your destination&rsquo;s customs authority
        applies to your duty is a third number again, usually fixed for a period
        rather than tracking spot.
      </P>

      <P>
        A US price of $138,000 before delivery is in circulation, from
        Carscoops. We have not confirmed that it describes the same
        specification as the &pound;154,070 UK figure, and a US MSRP excludes
        sales tax where a UK OTR price includes VAT, so the two are not
        comparable as published. We are not drawing a conclusion from the gap.
      </P>

      <H2 id="capability">
        What electric propulsion cost, and what it did not
      </H2>

      <P>
        The honest read on this car is that the capability case survived and the
        towing case did not, entirely.
      </P>

      <P>
        JLR published no towing figure. Carscoops reports{" "}
        <Strong>2,500 kg</Strong> against 3,500 kg for the combustion car and
        3,000 kg for the plug-in hybrid. Attribute that to Carscoops rather than
        to JLR until JLR publishes its own. If the number holds, it is a full
        tonne off the combustion car, and for a specific and not-small group of
        Range Rover buyers &mdash; horseboxes, large twin-axle caravans, plant
        trailers &mdash; that is the whole decision. A 3,500 kg requirement is
        not a preference you talk someone out of.
      </P>

      <P>
        Everything else held. 900 mm of wading is the same order as the
        combustion car. The 45-degree rolling climb and the 33-degree pull-away
        in Single Pedal mode are capability claims stated in the same terms Land
        Rover has always used. JLR also says the centre of gravity is lower than
        the V8&rsquo;s, which is a genuine structural benefit of putting 118.5
        kWh in the floor rather than an engine over the front axle.
      </P>

      <H3>What the charging figures mean once you do the division</H3>

      <P>
        JLR quotes 10&ndash;80% in around 22 minutes on a 350 kW charger.
        Seventy per cent of a 118.5 kWh usable pack is 82.95 kWh, and 22 minutes
        is 0.367 of an hour, so the car is averaging about{" "}
        <Strong>226 kW across that window</Strong>. The 350 kW figure is a peak
        the car touches, not a rate it holds &mdash; which is true of every EV
        and stated plainly by almost none of them. The 800-volt architecture is
        what makes a 226 kW average possible at all.
      </P>

      <P>
        The relevant question for an importer is not the peak. It is whether a
        350 kW charger exists within range of where the car will live. JLR cites
        over one million public chargers across the UK and Europe. That sentence
        does not describe Mombasa, Suva or Port of Spain, and we have taken the
        charging question apart properly in the sourcing piece.
      </P>

      <H2 id="applies">Does this apply to you, and can you register it?</H2>

      <P>
        It applies to you if you buy or sell luxury SUVs into a right-hand-drive
        market, or into a left-hand-drive market at the luxury end. The Range
        Rover is sold in 121 countries on JLR&rsquo;s own figure, in both hands,
        so this is not a car you have to argue into existence in the correct
        specification.
      </P>

      <P>
        On admissibility, three things are in your favour and one is not. It is
        a <Strong>new vehicle</Strong>, so the age limits that govern used
        imports in Kenya, Sri Lanka and much of the Caribbean do not bite. It is
        a current model from a manufacturer with an established presence in most
        of our destination markets, so type approval and parts are not
        speculative. It is zero-emission, which in several markets attracts a
        lower duty or excise band than a V8 would.
      </P>

      <P>
        What is not in your favour is that a battery-electric vehicle is treated
        as its own category in a growing number of import regimes, and those
        rules move faster than the rest of the tariff. Sri Lanka, Kenya and
        several Caribbean authorities have each changed the treatment of
        electric vehicles inside the last three years. Confirm the current
        position with the destination authority before you commit money, not
        after &mdash; the Kenya Revenue Authority, NZTA and Customs New Zealand,
        Sri Lanka Customs, or Revenue in Ireland.
      </P>

      <Callout
        title="Ireland: the EV relief does not reach this car"
        tone="amber"
      >
        <p>
          Ireland&rsquo;s VRT relief for electric vehicles is worth up to
          &euro;5,000 and applies to cars with an open market selling price
          below &euro;40,000. A Range Rover Electric converts to roughly
          &euro;179,400 at the European Central Bank&rsquo;s 2 September 2026
          reference rate, so the relief is not in play at any specification, and
          the relief&rsquo;s legislated end date of 31 December 2026 is
          irrelevant to this car. We set out both timetables in our piece on{" "}
          <InlineLink href="/latest-news/ireland-ev-incentives-taper-2026-2028">
            the Irish EV incentive taper
          </InlineLink>
          . Revenue still assesses VRT on its own valuation rather than on your
          invoice &mdash; the mechanism is in our{" "}
          <InlineLink href="/blog/vrt-explained-ireland">VRT guide</InlineLink>.
        </p>
      </Callout>

      <H2 id="landed-cost">What does it land at?</H2>

      <P>
        More than the sticker, and less than the sticker plus everything, which
        is why the number has to be built rather than guessed. A landed cost is
        the purchase price, inland transport to the port, ocean freight, marine
        insurance, duty on the CIF value, and consumption tax in the destination
        &mdash; and for this car there is a sixth line most calculators miss,
        which is whether the UK VAT inside the retail price comes out.
      </P>

      <P>
        The purchase price is published, which is more than could be said for
        most launches. That makes this one of the rare new models where a
        genuine landed figure can be built on day two rather than on the day a
        price finally appears. What it cannot be built on is a single global
        number: duty on a passenger vehicle varies from zero to over 100% across
        our destination list, and several markets assess it on an authority
        valuation rather than on your invoice.
      </P>

      <Disclaimer>
        The UK VAT rate, DVLA first registration fee and first-year vehicle
        excise duty above are GOV.UK figures, checked 3 September 2026. No duty,
        excise or registration-tax rate for any destination market is stated in
        this article, because we have not verified one for this vehicle against
        the relevant authority. Tax positions change. Confirm the current rate
        and its treatment with the destination&rsquo;s revenue or customs
        authority, or with your broker, before committing money. Providence does
        not pay import or registration taxes on a customer&rsquo;s behalf
        &mdash; they are charged to the registered owner.
      </Disclaimer>

      <H2 id="timing">Should you move now or wait?</H2>

      <Timeline
        items={[
          {
            time: "2 September 2026",
            title: "Reveal, and order books open",
            body: "JLR publishes the full specification and UK pricing, and opens ordering in a choice of standard or long-wheelbase across six specifications plus a First Edition.",
          },
          {
            time: "The next few months",
            title: "The queue forms in front of you",
            body: "Every car is built to order at Solihull on a shared line. An order placed later is not merely later in the queue; it is behind however many home-market orders were taken first.",
          },
          {
            time: "Once cars are in the used market",
            title: "The first residual readings",
            body: "No electric Range Rover has ever depreciated, so there is no history to price against. The first meaningful data point is a year or more away.",
          },
        ]}
      />

      <UL>
        <CheckLI>
          <Strong>If you are in the UK and want the car:</Strong> order it. The
          price is published, the specification is published, and there is
          nothing further to learn by waiting except how long the queue got.
        </CheckLI>
        <CheckLI>
          <Strong>If you are importing it:</Strong> the useful move now is to
          fix the specification and the destination and get a landed figure
          built, because the purchase price exists and most of the rest is
          knowable. The decision that should not be rushed is charging, covered
          below.
        </CheckLI>
        <CheckLI>
          <Strong>If you tow more than 2,500 kg:</Strong> wait for JLR to
          publish a towing figure, and if it confirms 2,500 kg, buy the
          combustion or plug-in hybrid car instead. No amount of range makes a
          tow rating stretch.
        </CheckLI>
        <CheckLI>
          <Strong>If you are a dealer:</Strong> the residual is the exposure,
          not the purchase. A first-generation electric version of an
          established nameplate has no depreciation history anywhere, and the
          battery warranty runs 8 years or 100,000 miles with coverage that JLR
          says varies by market. Confirm what transfers to a private import in
          your market before you commit floor-plan, not after.
        </CheckLI>
      </UL>

      <H2 id="unknowns">What is still unknown</H2>

      <ConfirmedLedger
        confirmed={[
          <>
            Every specification figure above, from JLR&rsquo;s release of 2
            September 2026: the twin 260 kW motors, 550PS, 850Nm, the 118.5 kWh
            usable double-stack battery of 344 prismatic cells, the 800-volt
            architecture, 372 miles WLTP and 333 miles real-world, 900 mm
            wading, and the 8-year or 100,000-mile propulsion warranty.
          </>,
          <>
            <Strong>&pound;154,070 OTR in the United Kingdom</Strong>, with
            order books open from 2 September 2026, in standard or
            long-wheelbase across SE, HSE, Autobiography, SV, SV Ultra and SV
            Black, plus a First Edition in Belgravia Green, Santorini Black or
            Varesine Blue.
          </>,
          <>
            <Strong>Built at Solihull</Strong>, with battery packs and electric
            drive units from JLR&rsquo;s Electric Propulsion Manufacturing
            Centre at Wolverhampton.
          </>,
          "The first electric car to carry the Range Rover name — verified against the record, and distinct from the Jaguar I-Pace of 2018, which was JLR's first battery-electric vehicle.",
        ]}
        unconfirmed={[
          <>
            <Strong>Towing capacity.</Strong> Absent from JLR&rsquo;s release.
            The 2,500 kg figure in circulation is Carscoops&rsquo; reporting.
          </>,
          <>
            <Strong>Kerb weight, and payload.</Strong> Not published, which
            matters for shipping quotations and for markets that band tax by
            weight.
          </>,
          <>
            <Strong>Which markets get the long wheelbase.</Strong> JLR states
            only that availability is market-specific.
          </>,
          <>
            <Strong>Whether the US and UK prices describe the same car.</Strong>{" "}
            The $138,000 US figure is Carscoops&rsquo;. We have not matched the
            specifications, so we draw no conclusion from the difference.
          </>,
          <>
            <Strong>
              How the battery warranty behaves on a private import.
            </Strong>{" "}
            JLR states 8 years or 100,000 miles with benefits and coverage
            varying by market, and points at the local retailer. For an imported
            car in a market with no franchised support, that is a question to
            answer before purchase.
          </>,
          <>
            <Strong>Residual values, everywhere.</Strong> No electric Range
            Rover has a depreciation history, because none has existed until
            now.
          </>,
        ]}
      />

      <H3>The one-line version</H3>

      <P>
        A private importer or dealer in a right-hand-drive market should read
        this because the first electric Range Rover is built only in the United
        Kingdom, at a published price, which makes it a sourcing decision they
        can cost today.
      </P>

      <Callout title="Costing it against your own port" tone="emerald">
        <p>
          Our{" "}
          <InlineLink href="/b2c/gallery/range-rover-electric-2026">
            Range Rover Electric page
          </InlineLink>{" "}
          carries the confirmed specification and the six-specification range,
          so you can register against a specification and a colour rather than a
          general enquiry. The United Kingdom is one of the seven countries our
          own team buys in.{" "}
          <InlineLink href="/request">
            Tell us where the car is going
          </InlineLink>{" "}
          and we will build the landed figure against your port, with the VAT
          position and the duty line shown separately &mdash; and tell you
          plainly if the charging answer in your market means you should buy the
          combustion car instead.
        </p>
      </Callout>
    </>
  );
}
