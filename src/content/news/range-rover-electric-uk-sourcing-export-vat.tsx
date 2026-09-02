import {
  Callout,
  CheckLI,
  CostTable,
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
import { ConfirmedLedger, PullQuote } from "@/components/news/newsProse";

export default function RangeRoverElectricUkSourcingExportVat() {
  return (
    <>
      <Lead>
        The Range Rover Electric is built in exactly one place: JLR&rsquo;s
        Solihull plant in the West Midlands. That makes the United Kingdom the
        source market for every one of these cars on earth, and it makes the
        &pound;154,070 UK on-the-road price the number every other
        market&rsquo;s price is ultimately derived from. Two things sit inside
        that figure that an importer needs to understand before doing anything
        else: about <Strong>&pound;25,700 of British VAT</Strong>, and a
        charging assumption that does not travel.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>There is no second corridor.</Strong> Every Range Rover
            Electric is built at Solihull. You can buy one through another
            market&rsquo;s retailer, but you will be buying a British car after
            somebody else&rsquo;s taxes and margin have been added to it.
          </>,
          <>
            The <Strong>&pound;154,070 OTR price contains 20% UK VAT</Strong>.
            On HMRC&rsquo;s conditions an export sale can be zero-rated, which
            takes roughly <Strong>&pound;25,700</Strong> out of the purchase
            price before freight and duty are even considered.
          </>,
          <>
            Zero-rating is <Strong>conditional, not automatic</Strong>. VAT
            Notice 703 requires the goods to leave the UK within{" "}
            <Strong>three months</Strong> and evidence of export to be obtained
            and kept within three months. Miss either and the VAT becomes
            payable.
          </>,
          <>
            A UK-registered example pays <Strong>&pound;640 a year</Strong> in
            vehicle excise duty for five years &mdash; the &pound;200 standard
            rate plus the &pound;440 expensive car supplement, which applies to
            zero-emission cars listed above &pound;50,000. An exported car never
            enters that regime.
          </>,
          <>
            <Strong>
              The charging question should stop some buyers entirely.
            </Strong>{" "}
            A 226 kW average charge rate is worth nothing at a destination with
            no DC charger. If that describes your market, buy the combustion or
            plug-in hybrid Range Rover instead.
          </>,
        ]}
      />

      <H2 id="source-market">Why there is only one corridor</H2>

      <P>
        Most of what we source has alternatives. A Land Cruiser can be priced
        out of Japan, the UAE or Australia in the same week, and when one market
        closes or gets expensive we move to another. That optionality is the
        thing that usually protects an importer from a bad month.
      </P>

      <P>
        The Range Rover Electric does not have it. JLR builds it at Solihull, on
        the same line as the combustion and hybrid cars, with battery packs and
        electric drive units from its Electric Propulsion Manufacturing Centre
        at Wolverhampton. Every example in every one of the 121 countries Range
        Rover sells in starts there.
      </P>

      <P>
        You can still choose where you <em>buy</em> it. A Dubai or Sydney
        retailer will sell you the same Solihull car. What you are choosing then
        is not a different vehicle but a different tax and margin stack on top
        of it &mdash; that market&rsquo;s import duty, its consumption tax, and
        its retailer&rsquo;s margin, all of which you then pay freight on a
        second time. Buying at the point of manufacture is the shortest version
        of that chain, and the United Kingdom is one of the seven countries our
        own team buys in.
      </P>

      <PullQuote>
        For most cars, sourcing is a question of which country. For this one it
        is a question of how many countries the car passes through before it
        reaches yours.
      </PullQuote>

      <H2 id="vat">The 20% inside the price</H2>

      <P>
        A UK on-the-road price is a domestic retail figure and it carries value
        added tax at 20%. Of the &pound;154,070, the &pound;55 DVLA first
        registration fee and the &pound;10 first-year vehicle excise duty for a
        zero-emission car sit outside VAT. That leaves &pound;154,005 as the
        VAT-inclusive vehicle price, which divides to{" "}
        <Strong>&pound;128,337.50 before tax</Strong> and{" "}
        <Strong>&pound;25,667.50 of VAT</Strong>.
      </P>

      <CostTable
        title="Stripping UK VAT out of the published price"
        subtitle="Our arithmetic on JLR's OTR figure. Fee and duty from GOV.UK, checked 3 September 2026. We assume every element of the OTR price other than the registration fee and first-year duty is VAT-bearing; JLR has published no breakdown."
        rows={[
          {
            label: "UK on-the-road price, as published by JLR",
            value: "£154,070.00",
          },
          { label: "Less DVLA first registration fee", value: "−£55.00" },
          {
            label: "Less first-year VED, zero-emission car",
            value: "−£10.00",
          },
          { label: "VAT-inclusive vehicle price", value: "£154,005.00" },
          {
            label: "VAT at 20% inside that figure",
            value: "−£25,667.50",
            green: true,
          },
        ]}
        total={{ label: "Vehicle price before UK VAT", value: "£128,337.50" }}
      />

      <P>
        <Strong>That VAT is not automatically yours to save.</Strong> It comes
        out only where the sale actually qualifies as an export under
        HMRC&rsquo;s rules, and those rules have teeth.
      </P>

      <H3>What HMRC actually requires</H3>

      <P>
        VAT Notice 703 distinguishes a <Strong>direct export</Strong>, where the
        supplier arranges the transport out of the UK, from an{" "}
        <Strong>indirect export</Strong>, where an overseas customer or their
        agent collects the goods in the UK and exports them. Both carry the same
        deadline: the goods must leave the UK within{" "}
        <Strong>three months</Strong>, and valid evidence of export must be
        obtained and held within <Strong>three months</Strong>.
      </P>

      <P>
        Motor vehicles carry an additional condition. For a direct export the
        vehicle must not be used or delivered in the UK before it is exported;
        for an indirect export it must not be used afterwards except for the
        trip to the place of departure. In plain terms: you do not get to drive
        it for a fortnight first. Evidence means an export declaration with a
        departure confirmation and its Movement Reference Number, or commercial
        transport evidence such as an authenticated bill of lading. If the
        conditions are not met, HMRC&rsquo;s position is unambiguous &mdash; the
        supply cannot be zero-rated and VAT is due at the UK rate.
      </P>

      <P>
        A separate route exists for a private individual who wants to take
        delivery in Britain and drive the car before leaving. That is the{" "}
        <Strong>Personal Export Scheme</Strong> under VAT Notice 707, and it is
        a different set of conditions: pre-approval on form VAT410 with
        HMRC&rsquo;s VAT412 issued before the vehicle may be released, export
        within 12 months for a qualifying overseas visitor or six months for an
        entitled UK resident, and an intention to stay abroad with the vehicle
        for at least six consecutive months. Break the conditions and the VAT
        you did not pay becomes payable, and the vehicle can be seized.
      </P>

      <Disclaimer>
        The VAT, registration-fee and vehicle-excise-duty positions above are
        HMRC and GOV.UK guidance, checked 3 September 2026 &mdash; VAT Notice
        703 for exports, VAT Notice 707 for the Personal Export Scheme, and the
        published vehicle tax rate tables. They describe the United Kingdom
        only. No duty, excise, consumption tax or registration tax is stated for
        any destination market, because we have not verified one for this
        vehicle. Tax rules change and eligibility is fact-specific. Confirm your
        position with HMRC, your destination&rsquo;s authority, or a customs
        broker before committing money. Providence does not pay import or
        registration taxes on a customer&rsquo;s behalf &mdash; they are charged
        to the registered owner.
      </Disclaimer>

      <H2 id="currency">Which way sterling lands</H2>

      <P>
        This car is priced in sterling and, for almost everyone reading, that is
        the source-currency leg of the trade. The rule is the one we apply to
        every corridor:{" "}
        <Strong>
          a weak source currency makes the car cheaper, and a weak destination
          currency makes everything more expensive
        </Strong>
        , because your own money buys fewer pounds and your duty is assessed on
        a larger local-currency value at the same time.
      </P>

      <P>
        The table below converts both the OTR price and the ex-VAT price at the
        European Central Bank&rsquo;s euro reference rates for{" "}
        <Strong>2 September 2026</Strong>, with the sterling crosses derived
        from the published EUR/GBP rate of 0.85870. These are observations on
        one day, not quotes, and not a forecast &mdash; we do not publish views
        on where a currency is going.
      </P>

      <Table
        head={["Currency", "At £154,070 OTR", "At £128,337.50 ex-VAT"]}
        rows={[
          ["Euro (EUR)", "≈ €179,400", "≈ €149,500"],
          ["US dollar (USD)", "≈ $207,700", "≈ $173,000"],
          ["Australian dollar (AUD)", "≈ A$290,600", "≈ A$242,100"],
          ["New Zealand dollar (NZD)", "≈ NZ$356,500", "≈ NZ$296,900"],
        ]}
        caption="Converted from the European Central Bank euro foreign exchange reference rates of 2 September 2026 (EUR/GBP 0.85870, EUR/USD 1.1578, EUR/AUD 1.6199, EUR/NZD 1.9868). Rounded. Conversions of a UK retail price, not landed costs and not quotations."
      />

      <P>
        Two things that table does not show, and both cost people money.{" "}
        <Strong>
          The rate on the day you pay is not the rate on the day you were quoted
        </Strong>
        , and on a car at this value a two-point move is more than most
        people&rsquo;s freight bill. And{" "}
        <Strong>
          the rate your customs authority uses to assess duty is a third number
          again
        </Strong>{" "}
        &mdash; most regimes publish a conversion rate fixed for a period rather
        than tracking spot, so a favourable move this week does not reduce this
        month&rsquo;s duty bill. Verify the mechanism for your own destination;
        it is rarely what people assume.
      </P>

      <H2 id="charging">The question that should stop some buyers</H2>

      <P>
        This is the section where the honest answer costs us a sale, so here it
        is plainly.{" "}
        <Strong>
          Do not import this car into a market where you cannot charge it
          properly.
        </Strong>
      </P>

      <P>
        The specification is excellent on paper. A 118.5 kWh usable pack on an
        800-volt architecture takes 10&ndash;80% in around 22 minutes on a 350
        kW charger, which works out at roughly 226 kW sustained across that
        window. Every one of those numbers assumes infrastructure. JLR&rsquo;s
        own frame of reference is explicit about where that infrastructure is:
        the release cites over one million public chargers across the UK and
        Europe, and built-in NACS compatibility for the Tesla Supercharger
        network in North America. Neither sentence describes most of our
        destination list.
      </P>

      <P>Settle these four before you ship, not after:</P>

      <UL>
        <CheckLI>
          <Strong>
            Is there a DC rapid charger within range of where the car will live
          </Strong>
          , and what does it actually deliver? A 50 kW unit turns that 22-minute
          claim into something over two hours.
        </CheckLI>
        <CheckLI>
          <Strong>What DC connector standard does your market use?</Strong> JLR
          has not published the connector fitted to a UK-market car, and a
          mismatch between a European-standard car and a market that
          standardised elsewhere is not something an adapter reliably solves at
          350 kW.
        </CheckLI>
        <CheckLI>
          <Strong>Will your domestic supply carry a home charger?</Strong> For a
          118.5 kWh pack, home charging is the realistic default and public
          rapid charging the exception. In markets with constrained or load-shed
          grid supply this is the binding question, not the car.
        </CheckLI>
        <CheckLI>
          <Strong>Who services the high-voltage system?</Strong> The propulsion
          warranty runs 8 years or 100,000 miles, and JLR states that benefits
          and coverage vary by market. A battery fault in a market with no
          trained franchised workshop is a different problem from a battery
          fault in Surrey.
        </CheckLI>
      </UL>

      <Callout title="When the answer is to buy the other car" tone="amber">
        <p>
          If the charging answers come back badly, the Range Rover you want is
          the plug-in hybrid or the combustion car, both built on the same
          architecture at the same plant and available through the same
          corridor. That is a genuinely good outcome rather than a consolation
          &mdash; you get the same vehicle, the same build quality and a
          drivetrain your market can actually support. We would rather tell you
          that now than land you a car you cannot charge.
        </p>
      </Callout>

      <H2 id="towing">The tonne it lost</H2>

      <P>
        JLR published no towing figure. Carscoops reports{" "}
        <Strong>2,500 kg</Strong> for the electric car against 3,500 kg for the
        combustion version and 3,000 kg for the plug-in hybrid. Treat that as
        trade-press reporting rather than a manufacturer specification until JLR
        publishes its own.
      </P>

      <P>
        If it holds, it matters more in our destination markets than it does in
        Britain. A Range Rover in Kenya, Zimbabwe, Australia or New Zealand is
        frequently bought to pull something &mdash; a horsebox, a stock trailer,
        a boat &mdash; and a full tonne is not a rounding difference. This is a
        specification line that should be checked against the actual trailer
        before the order, not after the car lands.
      </P>

      <H2 id="dealer">The dealer read</H2>

      <StatGrid
        stats={[
          { value: "£128,337.50", label: "Ex-VAT vehicle price" },
          { value: "3 months", label: "HMRC window to export and evidence it" },
          {
            value: "8 yr / 100k mi",
            label: "Propulsion warranty, coverage varies",
          },
          {
            value: "No history",
            label: "Residual data for an electric Range Rover",
          },
        ]}
      />

      <P>
        The purchase side of this is unusually clean. There is a published
        price, a single source market, a manufacturer that supports most of our
        destinations, and a VAT mechanism that is well documented and
        well-trodden. Compared with sourcing a car whose price does not yet
        exist, this is an easy unit to cost.
      </P>

      <P>
        <Strong>The exposure is entirely on the exit.</Strong> No electric Range
        Rover has ever depreciated, because none has existed. Every residual
        assumption available to you today is either an analogue from another
        electric luxury SUV or an analogue from a combustion Range Rover, and
        neither is the same car. At a purchase price north of &pound;128,000
        before tax, a residual assumption that is ten points optimistic is more
        than most dealers&rsquo; margin on the unit.
      </P>

      <P>
        Three practical points for a dealer committing floor-plan. First,{" "}
        <Strong>every car is built to order</Strong> at Solihull, so lead time
        is a queue position rather than a stock decision, and the queue formed
        on 2 September 2026. Second,{" "}
        <Strong>confirm what warranty transfers</Strong> to a privately imported
        car in your market before you buy, because JLR states coverage varies
        and an unsupported high-voltage system is a deterrent at resale as well
        as a risk in service. Third, <Strong>the battery is the asset</Strong>{" "}
        &mdash; JLR fits a Battery Digital Twin with over 900 diagnostic data
        points, and a documented state of health will do more for your exit
        price on this car than mileage will.
      </P>

      <H2 id="landed">Building the actual number</H2>

      <P>
        A landed cost for this car is the ex-VAT purchase price, inland
        transport to the port of loading, ocean freight, marine insurance, duty
        assessed on the CIF value, and consumption tax in the destination. The
        first of those is now published, which is why this car can be costed
        properly on day two rather than in six months.
      </P>

      <P>
        What we will not do is publish a single landed figure, because there
        isn&rsquo;t one. Duty on a passenger vehicle across our destination list
        runs from zero to over 100%, several markets assess it on an authority
        valuation rather than your invoice, and a growing number treat
        battery-electric vehicles as their own tariff category with their own
        rate. The mechanics of the whole stack, corridor by corridor, are in our
        guides to{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-the-uk">
          importing a car from the UK
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-the-uk">
          what that costs
        </InlineLink>
        , and the{" "}
        <InlineLink href="/ireland-cost-calculator">
          Ireland cost calculator
        </InlineLink>{" "}
        models an Irish landing end to end. The specification itself is on our{" "}
        <InlineLink href="/latest-news/range-rover-electric-revealed-specifications-price">
          reveal piece
        </InlineLink>
        .
      </P>

      <ConfirmedLedger
        confirmed={[
          <>
            <Strong>&pound;154,070 OTR</Strong> in the United Kingdom, order
            books open from 2 September 2026, and manufacture at Solihull with
            battery packs and drive units from Wolverhampton &mdash; all from
            JLR&rsquo;s release of that date.
          </>,
          <>
            The <Strong>UK VAT arithmetic</Strong> above, derived from
            JLR&rsquo;s published OTR price and GOV.UK&rsquo;s &pound;55
            registration fee and &pound;10 first-year duty for a zero-emission
            car, checked 3 September 2026.
          </>,
          <>
            The <Strong>three-month export and evidence deadlines</Strong> and
            the motor-vehicle conditions, from HMRC VAT Notice 703; the Personal
            Export Scheme conditions from VAT Notice 707. Both checked 3
            September 2026.
          </>,
          <>
            The{" "}
            <Strong>
              &pound;200 standard rate and &pound;440 expensive car supplement
            </Strong>{" "}
            for zero-emission cars listed above &pound;50,000, payable for five
            years from the second time the vehicle is taxed. GOV.UK vehicle tax
            rate tables, checked 3 September 2026.
          </>,
          "Currency conversions derived from the European Central Bank's euro reference rates published for 2 September 2026.",
        ]}
        unconfirmed={[
          <>
            <Strong>Towing capacity.</Strong> Not published by JLR. The 2,500 kg
            figure is Carscoops&rsquo; reporting.
          </>,
          <>
            <Strong>The DC connector fitted to a UK-market car.</Strong> JLR
            states NACS compatibility for North America and does not specify the
            UK-market connector in its release.
          </>,
          <>
            <Strong>Warranty treatment on a privately imported car.</Strong> JLR
            states 8 years or 100,000 miles with coverage varying by market, and
            refers owners to the local retailer.
          </>,
          <>
            <Strong>Kerb weight.</Strong> Not published, which affects both
            freight quotation and any destination that bands tax by weight.
          </>,
          <>
            <Strong>Any residual value, anywhere.</Strong> There is no
            depreciation history for an electric Range Rover, and we will not
            manufacture one.
          </>,
          <>
            <Strong>
              Charging infrastructure counts by destination market.
            </Strong>{" "}
            We have not verified charger numbers or standards market by market
            and are not publishing figures we cannot source.
          </>,
        ]}
      />

      <H3>The one-line version</H3>

      <P>
        A dealer or private importer outside Britain should read this because
        the Range Rover Electric is built only in the United Kingdom, which
        makes the 20% of its price that is British VAT the largest single
        variable they can actually control.
      </P>

      <Callout title="Costing the corridor properly" tone="emerald">
        <p>
          The United Kingdom is one of the seven countries our own team buys in,
          and this is a car we can quote from the point of manufacture rather
          than through somebody else&rsquo;s retail network. Register against a
          specification and a colour on our{" "}
          <InlineLink href="/b2c/gallery/range-rover-electric-2026">
            Range Rover Electric page
          </InlineLink>
          , or{" "}
          <InlineLink href="/request">tell us your destination port</InlineLink>{" "}
          and we will build the landed figure with the VAT position, the freight
          and the duty line shown separately, so you can see which part of the
          number is doing the damage &mdash; including, if the charging answer
          in your market is the wrong one, the case for not buying it at all.
        </p>
      </Callout>
    </>
  );
}
