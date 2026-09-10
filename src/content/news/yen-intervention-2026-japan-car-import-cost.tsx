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
import {
  ConfirmedLedger,
  PullQuote,
  Timeline,
} from "@/components/news/newsProse";

export default function YenIntervention2026JapanCarImportCost() {
  return (
    <>
      <Lead>
        The cheapest thing about importing a Japanese car for the past two years
        has been the yen. That is changing. Japan and the United States
        intervened jointly in the currency market at the end of July, Japan
        recorded <Strong>&yen;15,399.3 billion</Strong> of intervention
        operations in the month to 26 August, and the euro has fallen from{" "}
        <Strong>&yen;186.99 on 30 July</Strong> to{" "}
        <Strong>&yen;178.59 on 9 September</Strong>. On a &yen;3,000,000 car
        that is roughly <Strong>&euro;754 more</Strong> for exactly the same
        vehicle.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            European Central Bank reference rates put EUR/JPY at{" "}
            <Strong>186.99 on 30 July 2026</Strong> and{" "}
            <Strong>178.59 on 9 September 2026</Strong> &mdash; a 4.49% fall in
            what a euro buys.
          </>,
          <>
            Japan&rsquo;s Ministry of Finance published foreign exchange
            intervention operations of <Strong>&yen;15,399.3 billion</Strong>{" "}
            for the period 30 July to 26 August 2026.
          </>,
          <>
            USS auction average contracted prices fell from{" "}
            <Strong>&yen;1,345,000 in July to &yen;1,248,000 in August</Strong>,
            down 7.2% &mdash; but August consignments were down 27.9%, so mix is
            doing part of that work.
          </>,
          <>
            Netting both moves, the average August car at the 9 September rate
            costs a euro buyer about <Strong>2.8% less</Strong> than the average
            July car at the 30 July rate.
          </>,
          <>
            The rate that decides your duty bill is your customs
            authority&rsquo;s published conversion rate, not the one on your
            banking app.
          </>,
        ]}
      />

      <H2 id="what-happened">What happened to the yen</H2>

      <P>
        The yen fell through the first half of 2026 to its weakest level against
        the US dollar since 1986, reaching about 162.58 per dollar at the end of
        June. On 30 and 31 July, Japan and the United States conducted a rare
        coordinated yen-buying intervention, confirmed publicly in the days
        afterwards by Japanese Finance Minister Satsuki Katayama and US Treasury
        Secretary Scott Bessent. The yen rose sharply, touching about 155.20 per
        dollar.
      </P>

      <P>
        The scale is on the record from Japan&rsquo;s own Ministry of Finance,
        which published intervention operations totalling{" "}
        <Strong>&yen;15,399.3 billion</Strong> for the window from 30 July to 26
        August 2026, released on 28 August. That is the official figure for the
        period as a whole rather than a single day&rsquo;s operation, and it is
        the number we are using because it is the one the authority stands
        behind. Estimates of what was spent on any individual session vary
        widely and we are not repeating them.
      </P>

      <Timeline
        items={[
          {
            time: "End of June 2026",
            title: "Forty-year low",
            body: (
              <>
                The yen reaches about 162.58 per US dollar, its weakest since
                1986.
              </>
            ),
          },
          {
            time: "30 July 2026",
            title: "EUR/JPY peaks at 186.99",
            body: (
              <>
                The European Central Bank&rsquo;s euro reference rate for the
                yen reaches its highest level of the four-month window &mdash;
                the best day of the period for a euro buyer.
              </>
            ),
          },
          {
            time: "30–31 July 2026",
            title: "Joint intervention",
            body: (
              <>
                Japan and the United States buy yen in a coordinated operation.
                The yen strengthens to about 155.20 per dollar.
              </>
            ),
          },
          {
            time: "28 August 2026",
            title: "Japan publishes the total",
            body: (
              <>
                The Ministry of Finance records &yen;15,399.3 billion of
                intervention operations for 30 July to 26 August.
              </>
            ),
          },
          {
            time: "9 September 2026",
            title: "EUR/JPY at 178.59",
            body: (
              <>
                Six weeks after the peak, a euro buys 4.49% fewer yen than it
                did on 30 July.
              </>
            ),
          },
        ]}
      />

      <H2 id="landed">What it does to the number on your driveway</H2>

      <P>
        The hammer price at a Japanese auction is paid in yen, so the
        source-side leg of the trade is straightforward: a stronger yen makes
        the car more expensive in your own money, and nothing about the car has
        changed.
      </P>

      <CostTable
        title="The same ¥3,000,000 car, two dates"
        subtitle="Converted at European Central Bank euro reference rates"
        rows={[
          { label: "Hammer price", value: "¥3,000,000" },
          {
            label: "At EUR/JPY 186.99, 30 July 2026",
            value: "€16,044",
            green: true,
          },
          { label: "At EUR/JPY 178.59, 9 September 2026", value: "€16,798" },
        ]}
        total={{ label: "Cost of the currency move", value: "+€754" }}
      />

      <P>
        That is the purchase price leg only. Auction fees, inland transport and
        agent fees are also paid in yen, so they move the same way and in the
        same direction. Ocean freight and marine insurance are usually
        contracted in US dollars and follow a different pair entirely. Your
        duty, VAT or GST is charged in your own currency at your customs
        authority&rsquo;s conversion rate, and that leg does not move on
        yesterday&rsquo;s spot at all.
      </P>

      <PullQuote>
        A weak source currency makes the car cheaper. A weak destination
        currency makes everything dearer. Most FX coverage never says which one
        it is talking about.
      </PullQuote>

      <H2 id="pass-through">The half of the story nobody prices</H2>

      <P>
        Currency is only ever half of a corridor read. The other half is what
        the auction hall did, and in August it did something helpful.
      </P>

      <P>
        USS, Japan&rsquo;s largest auction group, publishes monthly figures. Its
        average contracted price fell from{" "}
        <Strong>&yen;1,345,000 in July</Strong> to{" "}
        <Strong>&yen;1,248,000 in August 2026</Strong> &mdash; a fall of
        &yen;97,000, or 7.2%.
      </P>

      <StatGrid
        stats={[
          { value: "−7.2%", label: "USS average price, July to August" },
          { value: "−27.9%", label: "USS consignments, July to August" },
          { value: "66.8%", label: "August contract completion rate" },
        ]}
      />

      <P>
        Now the caveat that most coverage of this number leaves out. USS
        consignments fell from 352,947 in July to 254,517 in August, a drop of
        27.9%. August is a short trading month in Japan around the Obon period,
        and a market that offers a quarter fewer cars is not offering the same
        cars in the same proportions. Part of that 7.2% is a change in what was
        in the hall, not a change in what cars are worth.
      </P>

      <P>
        The completion rate points the same way. Sixty-six point eight per cent
        of consigned vehicles sold in August against 63.8% in July. A market
        where a higher share of a smaller offering clears is a tight market, not
        a soft one. Treat the August average as a mix-affected reading and wait
        for September before calling a trend.
      </P>

      <H2 id="net">Netting the two together</H2>

      <Table
        head={["Comparison", "Average car", "In euro"]}
        rows={[
          ["July average price at 30 July rate", "¥1,345,000", "€7,193"],
          ["August average price at 30 July rate", "¥1,248,000", "€6,674"],
          ["August average price at 9 September rate", "¥1,248,000", "€6,988"],
        ]}
        caption="USS monthly average contracted prices converted at European Central Bank euro reference rates for the dates shown. The average is not constant-quality; see the mix caveat above."
      />

      <P>
        Read down that table and the sequence is clear. The auction price fall
        was worth about &euro;519 to a euro buyer. The currency move took about
        &euro;314 of it back. The net is roughly &euro;205 in your favour on the
        average car, or about 2.8%.
      </P>

      <P>
        Which is the point worth carrying away: the currency did not decide the
        outcome this month, and it usually does not on its own. Anyone quoting
        you an FX gain without netting it against what the hall did is quoting
        you half a number.
      </P>

      <Callout
        title="Spot is not the rate your duty is calculated at"
        tone="amber"
      >
        <p>
          Duty and VAT or GST are assessed on a value converted at your customs
          authority&rsquo;s published rate, which in most regimes is fixed for a
          period rather than tracking spot. So a move in the yen changes what
          you pay the seller almost immediately, and reaches your duty bill only
          when the customs rate next resets. Confirm the mechanism for your own
          destination before assuming they move together.
        </p>
      </Callout>

      <H2 id="applies">Does this apply to you?</H2>

      <UL>
        <CheckLI>
          <Strong>If you are buying in yen, yes.</Strong> Every reader importing
          out of Japan is paying more per yen than they were on 30 July.
        </CheckLI>
        <CheckLI>
          <Strong>
            If your quote is already fixed in your own currency, no.
          </Strong>{" "}
          The exposure has already been taken by whoever quoted you. Check which
          of you is carrying it before you assume.
        </CheckLI>
        <CheckLI>
          <Strong>
            If you are sourcing from the United Kingdom, India, Thailand,
            Australia or New Zealand, this is not your pair.
          </Strong>{" "}
          Those corridors have their own currency stories and the yen is not one
          of them.
        </CheckLI>
        <CheckLI>
          <Strong>
            If you are sourcing from the UAE, there is no FX story at all.
          </Strong>{" "}
          The dirham is pegged to the US dollar, so Dubai sourcing competes on
          stock and specification rather than on currency.
        </CheckLI>
      </UL>

      <H3>The quote-to-payment gap</H3>

      <P>
        The rate that matters is the one on the day the car is paid for, not the
        day you were quoted. Between a quote and a hammer there is usually a
        week or more, and between a hammer and a landed car there are several
        more. The yen has moved more than 4% in six weeks this summer. That gap
        is a real risk and we would rather name it than pretend our quotes are
        immune to it.
      </P>

      <ConfirmedLedger
        confirmed={[
          "ECB euro reference rate for the yen: 186.99 on 30 July 2026, 178.59 on 9 September 2026.",
          <>
            Japan&rsquo;s Ministry of Finance recorded &yen;15,399.3 billion of
            foreign exchange intervention operations for 30 July to 26 August
            2026, published 28 August 2026.
          </>,
          <>
            USS average contracted prices: &yen;1,345,000 in July 2026,
            &yen;1,248,000 in August 2026, with consignments of 352,947 and
            254,517 respectively.
          </>,
          "Japan and the United States confirmed a coordinated yen-buying intervention conducted at the end of July 2026.",
        ]}
        unconfirmed={[
          "How much was spent on any individual session. Published estimates differ materially and we are not choosing between them.",
          "How much of the 7.2% August fall in the USS average is mix and how much is price. USS does not publish a constant-quality index.",
          "Where the yen goes next. We report levels, direction and mechanics. We do not forecast currencies and neither should anyone quoting you.",
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        Whatever the rate does next, the currency is one line in a longer bill.
        Our guide to the{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-japan">
          full cost of importing a car from Japan
        </InlineLink>{" "}
        sets out the auction fees, inland transport, freight and destination
        charges that sit alongside the hammer price, and which of them move with
        the yen and which do not.
      </P>

      <P>
        We are not going to tell you the yen is about to move one way or the
        other, because we do not know and neither does the person telling you
        they do. What can be said is structural.
      </P>

      <P>
        Intervention changes a level; it does not change the interest-rate
        differential underneath it. Japan intervened in 2022 and 2024 and the
        yen resumed its previous direction both times. Nothing about that
        history is a prediction, and it is a reason to treat any single level as
        a moment rather than a floor.
      </P>

      <P>
        The practical answer is to decide on the landed number rather than on
        the rate. If the car clears your target at today&rsquo;s figure,
        today&rsquo;s figure is the one you can act on. If it only clears on a
        rate you are hoping for, you are trading currency, not buying a car.
      </P>

      <Disclaimer>
        Exchange rates cited are European Central Bank euro foreign exchange
        reference rates for the dates stated. Intervention figures are published
        by Japan&rsquo;s Ministry of Finance. Auction figures are published by
        USS Co., Ltd. All checked on 10 September 2026. Nothing in this article
        is a currency forecast or investment advice.
      </Disclaimer>

      <Callout
        title="Want the corridor priced at today's rate, not last month's?"
        tone="emerald"
      >
        <p>
          We bid in Japanese auctions every week and quote one landed figure
          &mdash; car, freight, marine cover, duty and local tax where it
          applies &mdash; before you commit anything. Send us the specification
          and destination port:{" "}
          <InlineLink href="/request">start here</InlineLink>. For the wider
          picture on volumes, see our earlier report on{" "}
          <InlineLink href="/latest-news/japan-used-car-exports-record-weak-yen-2026">
            Japan&rsquo;s record used-car export year
          </InlineLink>
          .
        </p>
      </Callout>
    </>
  );
}
