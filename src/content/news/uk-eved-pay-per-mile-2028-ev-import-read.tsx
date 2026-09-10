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

export default function UkEvedPayPerMile2028EvImportRead() {
  return (
    <>
      <Lead>
        Britain confirmed on <Strong>13 July 2026</Strong> that electric Vehicle
        Excise Duty will charge battery-electric cars{" "}
        <Strong>3 pence a mile</Strong> and plug-in hybrids{" "}
        <Strong>1.5 pence a mile</Strong> from <Strong>1 April 2028</Strong>.
        For a reader outside the United Kingdom the interesting question is not
        what it costs a British driver. It is what a new annual running cost
        does to the price of the used British electric cars you buy.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Electric Vehicle Excise Duty applies from{" "}
            <Strong>1 April 2028</Strong> at{" "}
            <Strong>3p per mile for battery-electric cars</Strong> and{" "}
            <Strong>1.5p per mile for plug-in hybrids</Strong>.
          </>,
          <>
            The rates were confirmed in the Government&rsquo;s consultation
            response of <Strong>13 July 2026</Strong>, following a consultation
            that ran from 26 November 2025 to 18 March 2026 and drew over{" "}
            <Strong>5,000 responses</Strong>.
          </>,
          <>
            Rates rise in line with the Consumer Prices Index from the{" "}
            <Strong>2029&ndash;30</Strong> tax year.
          </>,
          <>
            eVED is a charge on driving in the United Kingdom. It{" "}
            <Strong>does not follow the car when it is exported</Strong>.
          </>,
          "What it does follow is the British used price, and that is the number that reaches an importer.",
        ]}
      />

      <H2 id="what-was-confirmed">What was confirmed</H2>

      <StatGrid
        stats={[
          { value: "3p", label: "Per mile, battery-electric cars" },
          { value: "1.5p", label: "Per mile, plug-in hybrids" },
          { value: "1 April 2028", label: "In effect from" },
        ]}
      />

      <Timeline
        items={[
          {
            time: "26 November 2025",
            title: "Consultation opens",
            body: (
              <>
                The Government consults on introducing an electric Vehicle
                Excise Duty, alongside draft legislation.
              </>
            ),
          },
          {
            time: "18 March 2026",
            title: "Consultation closes",
            body: <>More than 5,000 responses are received.</>,
          },
          {
            time: "13 July 2026",
            title: "Government response published",
            body: (
              <>
                Rates are confirmed as final at 3p a mile for battery-electric
                cars and 1.5p for plug-in hybrids, taking effect from 1 April
                2028.
              </>
            ),
          },
          {
            time: "2029–30 tax year",
            title: "Indexation begins",
            body: (
              <>
                eVED rates rise in line with the Consumer Prices Index from this
                point, to maintain the value of the charge.
              </>
            ),
          },
        ]}
      />

      <P>
        The stated rationale is straightforward and not disputed by anyone
        serious: fuel duty revenue falls as the fleet electrifies, and eVED is
        designed to recover part of it. The 3p rate is roughly half the fuel
        duty burden a petrol or diesel driver carries per mile, which is the
        Government&rsquo;s answer to the charge that it penalises
        electrification.
      </P>

      <H2 id="cost">What it costs a British driver</H2>

      <Table
        head={[
          "Annual mileage",
          "Battery-electric at 3p",
          "Plug-in hybrid at 1.5p",
        ]}
        rows={[
          ["5,000 miles", "£150", "£75"],
          ["8,500 miles", "£255", "£127.50"],
          ["10,000 miles", "£300", "£150"],
          ["15,000 miles", "£450", "£225"],
          ["20,000 miles", "£600", "£300"],
        ]}
        caption="Straight arithmetic on the confirmed rates. Standard Vehicle Excise Duty is charged separately and in addition. Rates rise with CPI from 2029–30."
      />

      <P>
        Standard Vehicle Excise Duty sits on top of these figures rather than
        being replaced by them, so a British electric car owner from April 2028
        faces both. We are not stating a standard VED figure here because it is
        uprated annually and the 2028&ndash;29 level is not yet set; GOV.UK is
        the place to confirm it closer to the date.
      </P>

      <PullQuote>
        eVED does not travel with the car. It travels with the British market
        the car is sold in &mdash; and that is where it reaches you.
      </PullQuote>

      <H2 id="import-read">The part that matters to an importer</H2>

      <P>
        If you export a British electric car to Kenya, Ireland, New Zealand or
        Jamaica, eVED is not a cost you inherit. It is a charge on driving on
        British roads and it stops at the port. Nobody is going to bill you 3p a
        mile in Nairobi.
      </P>

      <P>
        What does reach you is second-order and it is the more interesting
        effect. A new annual running cost applied to a whole category of vehicle
        is, other things equal, a downward pressure on what British buyers will
        pay for that category. Used British electric cars are the stock our
        readers buy out of the United Kingdom, and a market where owning one
        costs more is a market where buying one costs less.
      </P>

      <Callout title="Other things are rarely equal" tone="amber">
        <p>
          We are describing a mechanism, not making a forecast. UK used EV
          prices are moved by supply from lease returns, by battery health
          perception, by the ZEV mandate&rsquo;s effect on new-car discounting
          and by finance rates &mdash; several of which are larger than a 3p
          charge starting in eighteen months. Do not build a purchase plan on
          the assumption that eVED will hand you a discount.
        </p>
      </Callout>

      <H2 id="applies">Does this apply to you?</H2>

      <UL>
        <CheckLI>
          <Strong>Driving an electric car in the United Kingdom:</Strong> yes,
          from 1 April 2028. This is your charge.
        </CheckLI>
        <CheckLI>
          <Strong>
            Importing a used British EV to a market outside the UK:
          </Strong>{" "}
          no, not directly. The charge does not follow the vehicle. Watch the UK
          used price instead.
        </CheckLI>
        <CheckLI>
          <Strong>Importing into Ireland:</Strong> no. Ireland has its own
          regime, and the reliefs there are on their own timetable &mdash; the
          VRT relief for qualifying EVs runs to 31 December 2026, which is a
          much nearer deadline than this one. See our{" "}
          <InlineLink href="/latest-news/ireland-ev-incentives-taper-2026-2028">
            report on the Irish taper
          </InlineLink>
          .
        </CheckLI>
        <CheckLI>
          <Strong>A UK dealer holding electric stock:</Strong> yes, indirectly
          and from now rather than from 2028. Residual forecasts written before
          13 July 2026 did not contain a confirmed charge; ones written after it
          should.
        </CheckLI>
      </UL>

      <H3>How this differs from the ZEV mandate</H3>

      <P>
        These are two separate mechanisms and they are frequently confused. The
        ZEV mandate places an obligation on manufacturers to sell a rising
        proportion of zero-emission vehicles; eVED places a charge on the person
        driving one. The first shapes what is available and at what discount;
        the second shapes what it costs to run. Our earlier report on the{" "}
        <InlineLink href="/latest-news/uk-zev-mandate-review-2026-consultation">
          ZEV mandate review
        </InlineLink>{" "}
        covers the supply side.
      </P>

      <ConfirmedLedger
        confirmed={[
          <>
            eVED rates of 3p per mile for battery-electric cars and 1.5p per
            mile for plug-in hybrids, confirmed in the Government&rsquo;s
            consultation response of 13 July 2026.
          </>,
          <>
            Effective from 1 April 2028, with rates rising in line with CPI from
            the 2029&ndash;30 tax year.
          </>,
          "The consultation ran from 26 November 2025 to 18 March 2026 and received more than 5,000 responses.",
        ]}
        unconfirmed={[
          <>
            The standard Vehicle Excise Duty rate for 2028&ndash;29. It is
            uprated annually and has not been set.
          </>,
          <>
            The collection mechanism in operational detail &mdash; how mileage
            is declared, verified and enforced.
          </>,
          "The effect on UK used electric vehicle values. The mechanism is clear; the magnitude is not, and we are not forecasting it.",
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        There is nothing to beat. April 2028 is eighteen months away and eVED is
        not a charge an importer pays, so there is no window closing on you and
        no reason to accelerate a purchase because of it.
      </P>

      <P>
        The genuinely near deadline for a reader thinking about electric imports
        is Irish rather than British: the VRT relief of up to &euro;5,000 for
        qualifying new EVs in Ireland is legislated to 31 December 2026, and
        registration &mdash; not order, not shipping &mdash; has to happen by
        then. That is fifteen months closer than eVED and it is worth real
        money.
      </P>

      <UL>
        <CheckLI>
          <Strong>UK dealers:</Strong> update residual assumptions now, because
          the charge is confirmed rather than proposed.
        </CheckLI>
        <CheckLI>
          <Strong>Exporters of UK electric stock:</Strong> watch British used
          prices through 2027 rather than acting on the announcement.
        </CheckLI>
        <CheckLI>
          <Strong>Irish buyers:</Strong> 31 December 2026 is your date, not 1
          April 2028.
        </CheckLI>
      </UL>

      <Disclaimer>
        Vehicle taxation in the United Kingdom is set by HM Treasury and
        administered by the DVLA and HMRC. Rates and dates above reflect the
        Government&rsquo;s eVED consultation response published on 13 July 2026
        and were checked on 10 September 2026. Standard Vehicle Excise Duty is
        charged separately and is uprated annually. Confirm your own position on
        GOV.UK before relying on any figure.
      </Disclaimer>

      <Callout
        title="Sourcing a used electric car out of Britain?"
        tone="emerald"
      >
        <p>
          We clear vehicles for export in the United Kingdom ourselves, handle
          NOVA and DVLA where they apply, and quote one landed figure to your
          port. Send us the specification and destination:{" "}
          <InlineLink href="/request">start here</InlineLink>. Our{" "}
          <InlineLink href="/blog/registering-an-imported-car-in-the-uk">
            UK registration guide
          </InlineLink>{" "}
          covers the process at the other end.
        </p>
      </Callout>
    </>
  );
}
