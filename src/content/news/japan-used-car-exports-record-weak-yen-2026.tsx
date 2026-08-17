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

export default function JapanUsedCarExportsRecordWeakYen2026() {
  return (
    <>
      <Lead>
        Japan exported roughly <Strong>1.7 million</Strong> used vehicles in
        2025, up 9.1% and a third consecutive record. The yen is trading near
        its weakest level since 1986. Both of those facts sound like good news
        if you buy cars in Japan. The third fact &mdash; that constant-quality
        auction prices are up about 15% in yen &mdash; is the one that decides
        how much of the currency advantage you actually keep.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Japanese used vehicle exports hit a record{" "}
            <Strong>≈1.7 million units</Strong>, up 9.1% year on year &mdash;
            the third annual record in a row.
          </>,
          <>
            The yen traded around{" "}
            <Strong>&yen;161&ndash;162 to the US dollar</Strong> in late June
            2026, close to its weakest since 1986.
          </>,
          <>
            Constant-quality auction prices are up roughly{" "}
            <Strong>15% in yen</Strong> year on year &mdash; the market is
            absorbing part of the currency gain.
          </>,
          <>
            Headline average prices overstate the move: a richer mix of
            high-grade cars flatters the average, with monthly constant-quality
            inflation nearer <Strong>1.7%</Strong>.
          </>,
          "Top destinations include Russia, Tanzania, the UAE, New Zealand and South Africa. You are bidding against all of them.",
        ]}
      />

      <H2 id="numbers">The numbers</H2>

      <StatGrid
        stats={[
          { value: "1.7m", label: "Used vehicles exported" },
          { value: "+9.1%", label: "Year on year" },
          { value: "3rd", label: "Consecutive record year" },
        ]}
      />

      <P>
        Japan&rsquo;s used vehicle export trade has been setting records for
        three years running. The destination list explains why: buyers across
        Africa, the CIS region, South Asia and the Pacific are all competing for
        the same well-maintained, reliably-documented stock, and almost none of
        them have a domestic alternative that matches it on condition per pound.
      </P>

      <Table
        head={["Destination", "Approximate volume", "Note"]}
        rows={[
          ["Russia", "≈ 46,105 units", "Largest single destination"],
          [
            "African markets (combined)",
            "≈ 136,000 units",
            "Fastest-growing bloc",
          ],
          ["Tanzania", "Top five", "Major African entry point"],
          ["UAE", "Top five", "Re-export hub as well as end market"],
          ["New Zealand", "Top five", "Direct competitor for the same grades"],
          [
            "South Africa",
            "Top five",
            "Right-hand drive, similar buying criteria",
          ],
        ]}
        caption="Volumes as reported in trade coverage of the record export year. Figures are indicative."
      />

      <H2 id="yen">What the yen is doing</H2>

      <P>
        As of late June 2026 the yen sat around{" "}
        <Strong>&yen;161&ndash;162 to the US dollar</Strong>, close to its
        weakest level in four decades. For anyone earning in dollars, euro or
        sterling, that is a material discount on the same car.
      </P>

      <P>
        The commonly-quoted framing is that an exchange rate near 150 to the
        dollar makes Japanese used cars roughly 30% cheaper for overseas
        importers than they would be at historically normal rates. At 161 the
        arithmetic is more favourable still &mdash; on the currency leg alone.
      </P>

      <PullQuote>
        The exchange rate is a discount on the price. It is not a discount on
        the car.
      </PullQuote>

      <H2 id="prices">Auction prices: the real read</H2>

      <P>
        Here is where most reporting goes wrong. Average auction prices in Japan
        have risen sharply, and it is tempting to read that as pure inflation.
        It is not.
      </P>

      <H3>Two different numbers, frequently conflated</H3>

      <UL>
        <CheckLI>
          <Strong>Average price</Strong> &mdash; the mean hammer across
          everything that sold. This rises when the mix improves: more
          high-grade cars offered, fewer cheap and rough ones. It tells you
          about the catalogue, not the market.
        </CheckLI>
        <CheckLI>
          <Strong>Constant-quality price</Strong> &mdash; what the same car, at
          the same grade, would fetch now versus a year ago. This is the only
          figure that answers &ldquo;has it got more expensive&rdquo;.
        </CheckLI>
      </UL>

      <P>
        On a constant-quality basis, prices are up roughly{" "}
        <Strong>15% in yen year on year</Strong>. But month-to-month
        constant-quality inflation has run far lower &mdash; closer to{" "}
        <Strong>1.7%</Strong> in a recent month &mdash; with the gap between
        that and the headline average explained entirely by the improving mix.
      </P>

      <Callout title="What this means at the bidding screen" tone="sky">
        <p>
          If your reference point is what you paid for a similar car last year,
          expect to pay meaningfully more in yen &mdash; and to still be ahead
          once the exchange rate is applied. If your reference point is a
          published average price, you are probably comparing a better car to a
          worse one and drawing the wrong conclusion.
        </p>
      </Callout>

      <H2 id="competition">Who you are bidding against</H2>

      <P>
        Record export volume does not mean an easier hall. It means more bidders
        chasing the same desirable lots. A grade 4 or 4.5 car with a clean
        auction sheet is wanted simultaneously by a Kenyan importer, a New
        Zealand dealer, a Russian trader and you &mdash; and several of them
        have cost structures that let them bid past the point where the car
        makes sense for a European buyer paying registration tax on arrival.
      </P>

      <P>
        This is the practical case for reading the auction sheet properly rather
        than the photographs. Grade, inspection notes and the repair map are
        what separate the car worth stretching for from the one that merely
        photographs well. We cover the system in detail in{" "}
        <InlineLink href="/blog/japanese-auction-grades-explained">
          Japanese auction grades explained
        </InlineLink>
        .
      </P>

      <H2 id="window">How long the window stays open</H2>

      <P>
        Nobody sensible forecasts currency. What can be said is what each leg of
        the trade currently contributes, and which of them is most likely to
        move.
      </P>

      <Table
        head={[
          "Factor",
          "Current direction",
          "Effect on your cost",
          "Stability",
        ]}
        rows={[
          [
            "Yen exchange rate",
            "Near four-decade weakness",
            "Strongly favourable",
            "Volatile — can reverse quickly",
          ],
          [
            "Yen auction prices",
            "Up ≈15% constant-quality YoY",
            "Unfavourable",
            "Sticky — driven by export demand",
          ],
          [
            "Supply volume",
            "Record exports, third year",
            "Neutral to favourable",
            "Stable",
          ],
          [
            "Competing demand",
            "Broad and rising",
            "Unfavourable",
            "Structural",
          ],
          [
            "Destination tax (e.g. VRT)",
            "Set by your government",
            "Fixed cost on arrival",
            "Policy-dependent",
          ],
        ]}
        caption="The currency leg is the most favourable and the least reliable. Build your model so it survives the yen strengthening."
      />

      <P>
        The honest summary: the trade is genuinely attractive right now, and the
        most attractive component of it is the one you have least control over.
        If a purchase only works at &yen;161 and fails at &yen;140, it is a
        currency bet with a car attached rather than a sound acquisition.
      </P>

      <H3>What to actually do about it</H3>

      <UL>
        <CheckLI>
          Set your walk-away number in <Strong>your own currency</Strong>,
          landed and registered, before the lot opens.
        </CheckLI>
        <CheckLI>
          Stress-test it at a materially stronger yen. If it only works at
          today&rsquo;s rate, size the position accordingly.
        </CheckLI>
        <CheckLI>
          Compare against alternative source markets rather than assuming Japan
          wins &mdash; our{" "}
          <InlineLink href="/blog/new-zealand-vs-japan-for-used-imports">
            New Zealand versus Japan
          </InlineLink>{" "}
          comparison exists because it frequently does not.
        </CheckLI>
        <CheckLI>
          Remember that registration tax on arrival is unaffected by what you
          paid. A cheaper purchase does not proportionally reduce your total.
        </CheckLI>
      </UL>

      <Callout title="Buying from Japan this year?" tone="emerald">
        <p>
          We bid in Japanese auctions every week and quote the full landed cost
          &mdash; car, shipping, duty, VAT and registration tax &mdash; before
          anyone commits. Start with{" "}
          <InlineLink href="/blog/how-to-buy-a-car-at-japanese-auction">
            how to buy at a Japanese auction
          </InlineLink>
          , price it with the{" "}
          <InlineLink href="/ireland-cost-calculator">
            import cost calculator
          </InlineLink>
          , then <InlineLink href="/request">tell us what you want</InlineLink>.
        </p>
      </Callout>
    </>
  );
}
