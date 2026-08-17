import {
  Callout,
  CheckLI,
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
import { PullQuote } from "@/components/news/newsProse";

export default function Monterey2026AuctionWeekMarketReport() {
  return (
    <>
      <Lead>
        Two cars sold for more than $40 million within a week of each other on
        the Monterey peninsula. One was sixty-two years old with a racing record
        and six siblings. The other was built this year, has no engine, and was
        being ridiculed on the internet in May. Between them they explain most
        of what is happening to the collector market in 2026.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The <Strong>1964 Shelby Cobra Daytona Coupe CSX2300</Strong> made{" "}
            <Strong>$42,905,000</Strong> at Gooding Christie&rsquo;s &mdash; the
            most expensive American car ever sold at public auction.
          </>,
          <>
            <Strong>Ferrari Luce chassis 0</Strong> took $40,000,000 at RM
            Sotheby&rsquo;s, the second-highest result of the week and a record
            for a new car.
          </>,
          <>
            Hagerty forecast <Strong>$470&ndash;500 million</Strong> for the
            week against $432.7m in 2025 and a standing record of $471m from
            2022.
          </>,
          <>
            The buyer base is visibly turning over: millennial and Gen Z money
            is concentrating in{" "}
            <Strong>1990s and 2000s limited-production</Strong> supercars.
          </>,
          "Provenance premiums are widening, not narrowing. Documented history is doing more work than condition.",
        ]}
      />

      <H2 id="headline">The headline numbers</H2>

      <P>
        Monterey Car Week is the single largest concentration of collector-car
        money in the calendar, and its August totals are treated across the
        trade as a proxy for the health of the whole market. The 2026 edition
        ran from 7 to 16 August, with the Pebble Beach Concours d&rsquo;Elegance
        closing the week on the Sunday.
      </P>

      <StatGrid
        stats={[
          { value: "$42.9m", label: "Top sale — Cobra Daytona" },
          { value: "$432.7m", label: "2025 week total" },
          { value: "$471m", label: "Record week (2022)" },
        ]}
      />

      <Callout title="On the final totals" tone="amber">
        <p>
          Reconciled week totals across all five major houses were still being
          compiled when this piece was published, and the aggregate figures
          circulating online do not agree with each other &mdash; at least one
          widely-shared number is arithmetically incompatible with the 2025
          baseline it claims to improve on. We are not printing a week total
          until the houses publish audited figures. The individual results below
          are confirmed.
        </p>
      </Callout>

      <H2 id="cobra">The $42.9m Cobra</H2>

      <P>
        The car of the week was not the one that made global news. Chassis{" "}
        <Strong>CSX2300</Strong> is the third of only six Shelby Cobra Daytona
        Coupes ever built, and the only one Carroll Shelby personally owned. It
        debuted at the 1964 Tour de France Automobile with Bob Bondurant and
        Jochen Neerpasch, and went on to run at Daytona, Sebring, the
        N&uuml;rburgring and Reims through the 1965 FIA GT season.
      </P>

      <P>
        Gooding Christie&rsquo;s published an estimate in excess of $25,000,000.
        It sold for <Strong>$42,905,000</Strong> including premium &mdash; about
        56% clear of the low estimate, and roughly $14 million more than the top
        of the published range.
      </P>

      <Table
        head={["Record", "Previous holder", "Previous price", "New mark"]}
        rows={[
          [
            "Most expensive American car at auction",
            "1935 Duesenberg SSJ (2018)",
            "$22,000,000",
            "$42,905,000",
          ],
          ["Most expensive Shelby at auction", "—", "—", "$42,905,000"],
          [
            "Most valuable car sold by Gooding Christie's",
            "1935 Duesenberg SSJ (2018)",
            "$22,000,000",
            "$42,905,000",
          ],
        ]}
        caption="Three records set by a single lot. Prices include buyer's premium."
      />

      <P>
        The Duesenberg record had stood for eight years, and the margin by which
        it fell is the story: not an increment, a near-doubling. American
        competition cars with unimpeachable history have been repriced in one
        evening.
      </P>

      <H2 id="forecast">The half-billion forecast</H2>

      <P>
        Ahead of the week, Hagerty put the range at{" "}
        <Strong>$470&ndash;500 million</Strong>, which would have made 2026 the
        first half-billion-dollar auction week in the hobby&rsquo;s history and
        beaten the $471 million recorded in 2022. The 2025 comparison figure was
        $432.7 million.
      </P>

      <PullQuote cite="McKeel Hagerty, CEO, Hagerty">
        With strong bidding, this could be the first half-billion-dollar auction
        week the collector world has ever seen.
      </PullQuote>

      <P>
        Forecasts of that kind are, in practice, a statement about consignment
        quality rather than about bidder appetite &mdash; the houses know what
        is in the catalogue months in advance. A $35 million estimate on a 1996
        McLaren F1 GTR and a Daytona SP3 expected to clear $10 million tell you
        what the week was built around.
      </P>

      <H2 id="generation">The generational handover</H2>

      <P>
        The more consequential change is slower and harder to photograph. The
        collector market&rsquo;s centre of gravity is shifting from baby boomers
        to millennial and Gen Z buyers, and that changes which cars carry the
        premium.
      </P>

      <P>
        Buyers do not, as a rule, chase the cars their grandparents wanted. They
        chase the cars on their own bedroom walls. That puts money into a
        specific and identifiable set:
      </P>

      <UL>
        <CheckLI>
          <Strong>Ferrari F40, F50 and Enzo</Strong> &mdash; the analogue-to-
          digital transition, now firmly in the blue-chip bracket.
        </CheckLI>
        <CheckLI>
          <Strong>Bugatti Veyron</Strong> &mdash; the first modern
          numbers-for-their-own-sake hypercar.
        </CheckLI>
        <CheckLI>
          <Strong>Koenigsegg and Pagani</Strong> &mdash; low-volume marques
          whose entire production run is smaller than one year of 911 output.
        </CheckLI>
        <CheckLI>
          <Strong>Ruf Yellowbirds</Strong> and comparable specialist Porsches,
          where the tuner story outranks the base car.
        </CheckLI>
      </UL>

      <Callout title="The caveat worth holding on to" tone="amber">
        <p>
          Market observers have flagged a real risk in this handover: younger
          collectors are more likely to treat cars as speculative instruments
          than as assets whose value rests on rarity, originality and racing
          history. Speculative money is fast in and fast out. The 2026 results
          look like conviction buying &mdash; but conviction is only testable in
          a soft year, and 2026 was not one.
        </p>
      </Callout>

      <H2 id="what-rose">What rose, and what didn&rsquo;t</H2>

      <H3>Rising: documented provenance</H3>

      <P>
        The strongest single pattern at the top of the market is that paperwork
        is being priced more aggressively than metal. Cars with documented
        racing history or a genuinely special factory configuration have been
        commanding premiums in the region of 30&ndash;50% over otherwise
        comparable examples. CSX2300 is that principle at its most extreme: six
        cars built, one owned by the man whose name is on the badge.
      </P>

      <H3>Rising: modern limited-production</H3>

      <P>
        1990s and 2000s supercars showed the strongest year-on-year appreciation
        of any segment. This is the generational shift showing up in the numbers
        rather than in commentary.
      </P>

      <H3>Flat to soft: everything whose audience is ageing out</H3>

      <P>
        The counterpart to a generational handover is that some cars lose their
        bidders faster than they gain new ones. Pre-war and early post-war
        touring cars remain deeply collectable and are not collapsing, but they
        are no longer where the incremental money goes. If your thesis on a car
        is &ldquo;it has always been valuable&rdquo;, check who is left bidding.
      </P>

      <H2 id="reading-it">How to read a week like this</H2>

      <P>
        Monterey is a genuinely useful signal and a genuinely misleading one, in
        roughly equal measure. Three rules keep it useful.
      </P>

      <H3>Separate charity lots from market lots</H3>

      <P>
        The $40m Luce was a no-premium charity consignment with a tax-deductible
        destination. It belongs in the week&rsquo;s headline total and nowhere
        near a valuation model. We took that result apart in detail in{" "}
        <InlineLink href="/latest-news/ferrari-luce-chassis-0-40-million-auction">
          our report on the Ferrari Luce sale
        </InlineLink>
        .
      </P>

      <H3>
        Top-of-market results tell you almost nothing about mid-market cars
      </H3>

      <P>
        Nine-figure weeks and eight-figure lots are driven by a bidder pool of a
        few hundred people worldwide. A record for a Cobra Daytona Coupe does
        not move the price of a good 964, and it certainly does not move the
        price of the cars most people actually import. Sell-through rates in the
        sub-$100k bracket are a far better read on broad market health than any
        headline hammer.
      </P>

      <H3>Estimates are an entry point, not a valuation</H3>

      <P>
        The Cobra beat its low estimate by 56%; the Luce beat its estimate by
        roughly 36 times. Auction estimates exist to start bidding. Whether you
        are bidding at Pebble Beach or at a Japanese auction on a Tuesday
        morning, the number that protects you is your own landed-cost ceiling,
        worked out before the lot opens.
      </P>

      <Callout title="Bidding on something specific?" tone="emerald">
        <p>
          We bid in Japanese, UK, UAE and Australian auctions every week for
          dealers and private clients, and we quote the full landed cost &mdash;
          car, shipping, duty, VAT and registration tax &mdash; before anyone
          commits. Start with the{" "}
          <InlineLink href="/ireland-cost-calculator">
            import cost calculator
          </InlineLink>{" "}
          or <InlineLink href="/request">tell us what you are after</InlineLink>
          .
        </p>
      </Callout>
    </>
  );
}
