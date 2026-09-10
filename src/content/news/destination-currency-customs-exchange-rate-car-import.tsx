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

export default function DestinationCurrencyCustomsExchangeRateCarImport() {
  return (
    <>
      <Lead>
        Almost every currency article written for car importers is written from
        the wrong side of the trade. It watches the yen, because the yen is the
        currency the car is bought in. But for a buyer in Nairobi, Kampala,
        Colombo or Kingston, the larger and less discussed exposure is their own
        currency &mdash; and this year the Kenyan shilling has done something
        genuinely unusual. It has sat still.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The Central Bank of Kenya&rsquo;s mean rate on{" "}
            <Strong>9 September 2026</Strong> was <Strong>KSh 129.43</Strong> to
            the US dollar, KSh 175.44 to sterling and KSh 150.50 to the euro.
          </>,
          <>
            The shilling has traded close to 129 to the dollar for roughly{" "}
            <Strong>16 months</Strong>, with reserves reported at{" "}
            <Strong>US$15.155 billion</Strong> on 20 August 2026, about 6.3
            months of import cover.
          </>,
          <>
            An import carries <Strong>four separate currency legs</Strong>, not
            one, and they do not all move together.
          </>,
          <>
            Duty is assessed at your customs authority&rsquo;s{" "}
            <Strong>published conversion rate</Strong>, which is usually fixed
            for a period rather than tracking spot.
          </>,
          <>
            Several of our destination markets run pegged currencies, where
            there is <Strong>no independent FX story at all</Strong>.
          </>,
        ]}
      />

      <H2 id="four-legs">An import is four currency exposures, not one</H2>

      <P>
        This is the part that gets lost. When you import a car you are not
        making one currency conversion, you are making several, and they land on
        different sides of the trade.
      </P>

      <Table
        head={["What you pay for", "Paid in", "If that currency weakens"]}
        rows={[
          [
            "Hammer price at auction",
            "Source currency — JPY, GBP, AED, INR, THB, AUD, NZD",
            "Good for you. The car costs less.",
          ],
          [
            "Auction fees, inland transport, agent fees",
            "Source currency",
            "Good for you.",
          ],
          [
            "Ocean freight, marine insurance",
            "Usually USD",
            "Depends on your currency against the dollar.",
          ],
          [
            "Duty, VAT or GST, excise, registration tax",
            "Your own currency, at the customs conversion rate",
            "Bad for you if it is your currency falling.",
          ],
        ]}
        caption="The rule in one line: a weak source currency makes the car cheaper; a weak destination currency makes everything dearer."
      />

      <PullQuote>
        A Kenyan importer watching only the yen is watching one of four legs,
        and not the one their own government charges them on.
      </PullQuote>

      <H2 id="kenya">The Kenyan shilling has been the quiet one</H2>

      <StatGrid
        stats={[
          { value: "KSh 129.43", label: "Mean rate to USD, 9 September 2026" },
          { value: "KSh 175.44", label: "Mean rate to GBP, 9 September 2026" },
          { value: "KSh 150.50", label: "Mean rate to EUR, 9 September 2026" },
        ]}
      />

      <P>
        Those are the Central Bank of Kenya&rsquo;s own published mean rates.
        The striking thing is not the level, it is the stability: the shilling
        has traded around 129 to the dollar for well over a year, supported by
        reserves reported at US$15.155 billion on 20 August 2026, equivalent to
        roughly 6.3 months of import cover against a statutory minimum of four.
      </P>

      <P>
        For a Kenyan importer that has a direct and unglamorous consequence.
        Your destination-side exposure has been close to flat, which means the
        thing that has actually moved your landed cost this year is the source
        currency and the tax base &mdash; not the shilling. If someone has
        explained a price increase to you as &ldquo;the shilling,&rdquo; the
        published rate does not support them.
      </P>

      <H3>What the cross-rate actually looks like</H3>

      <P>
        Neither the Central Bank of Kenya nor the European Central Bank
        publishes a direct shilling-yen rate, so this is a cross computed from
        two published rates on the same day. Using the Central Bank of
        Kenya&rsquo;s KSh 129.43 to the dollar and the European Central
        Bank&rsquo;s euro reference rates for 9 September 2026 &mdash; 178.59
        yen and 1.1652 dollars &mdash; the implied dollar-yen rate is 153.27,
        and one yen is worth about <Strong>KSh 0.844</Strong>.
      </P>

      <CostTable
        title="A ¥1,248,000 car, in shillings"
        subtitle="Cross-rate computed from CBK and ECB published rates, 9 September 2026"
        rows={[
          { label: "Hammer price, August USS average", value: "¥1,248,000" },
          { label: "Implied USD/JPY from ECB rates", value: "153.27" },
          { label: "CBK mean rate, KSh per USD", value: "129.43" },
          { label: "Implied KSh per ¥1", value: "0.844" },
        ]}
        total={{ label: "Hammer price in shillings", value: "≈ KSh 1,053,900" }}
      />

      <P>
        That figure is the purchase leg only. It carries no freight, no
        insurance, no duty, no excise and no VAT, and it is a cross-rate rather
        than a quoted market. We are showing the working so you can check it
        rather than trust it.
      </P>

      <H2 id="customs-rate">Why your duty bill uses a different rate</H2>

      <P>
        This is the single most common misunderstanding in import pricing, and
        it costs people real money.
      </P>

      <P>
        The rate on your banking app is the spot rate. The rate your customs
        authority uses to convert a foreign-currency invoice into local currency
        for the purposes of assessing duty is a published administrative rate,
        and in most regimes it is fixed for a period &mdash; commonly a month
        &mdash; rather than tracking spot.
      </P>

      <P>
        The consequence is a timing mismatch. A favourable move in the source
        currency reduces what you pay the seller almost immediately. It reaches
        your duty calculation only when the customs rate next resets, and if the
        move has reversed by then, it never reaches it at all.
      </P>

      <Callout title="Confirm the mechanism before you rely on it" tone="amber">
        <p>
          Customs conversion practice differs by country. Some authorities
          publish weekly, some monthly, some use a central bank reference on the
          date of entry. We are describing the general pattern, not asserting
          the rule for your specific destination. Ask your clearing agent which
          rate your authority applies and on what date it is struck, and get the
          answer before you build it into a margin.
        </p>
      </Callout>

      <H2 id="pegs">Some corridors have no currency story at all</H2>

      <P>
        Several markets on our destination list run fixed or tightly managed
        exchange rates. In those corridors the currency is not a lever, and
        anyone presenting it as one is filling space.
      </P>

      <Table
        head={["Currency", "Regime", "What it means for you"]}
        rows={[
          [
            "AED (UAE — a source market)",
            "Pegged to the US dollar at 3.6725",
            "No FX discount out of Dubai independent of the dollar. UAE sourcing competes on stock and specification.",
          ],
          [
            "BSD (Bahamas)",
            "Pegged 1:1 to the US dollar",
            "No independent FX story.",
          ],
          [
            "BBD (Barbados)",
            "Pegged 2:1 to the US dollar",
            "No independent FX story.",
          ],
          [
            "HKD (Hong Kong)",
            "Linked exchange rate band, about 7.75–7.85",
            "Effectively no independent FX story.",
          ],
          [
            "TTD (Trinidad and Tobago)",
            "Tightly managed",
            "Treat as near-fixed. Verify before writing an FX angle into a plan.",
          ],
          [
            "KES, UGX, LKR, JMD, GYD",
            "Floating, historically volatile",
            "This is where the real destination-side stories live.",
          ],
        ]}
        caption="Peg arrangements change. Verify the regime with the relevant central bank before relying on it. Checked 10 September 2026."
      />

      <H2 id="applies">Does this apply to you?</H2>

      <UL>
        <CheckLI>
          <Strong>Kenya:</Strong> your currency has been stable. Look at the
          source currency and the assessed value, not the shilling.
        </CheckLI>
        <CheckLI>
          <Strong>Uganda, Sri Lanka, Jamaica, Guyana:</Strong> these float and
          have historically been more volatile. We have not verified current
          levels for those currencies against their own central banks and are
          not quoting figures we have not read. Check your own central
          bank&rsquo;s published rate rather than a converter app.
        </CheckLI>
        <CheckLI>
          <Strong>Ireland, Malta, Cyprus:</Strong> your currency is the euro,
          and the euro leg is covered in our{" "}
          <InlineLink href="/latest-news/yen-intervention-2026-japan-car-import-cost">
            report on the yen&rsquo;s reversal
          </InlineLink>
          .
        </CheckLI>
        <CheckLI>
          <Strong>UAE, Bahamas, Barbados, Hong Kong:</Strong> nothing here
          applies to your destination leg. Your exposure is to the dollar
          itself.
        </CheckLI>
      </UL>

      <ConfirmedLedger
        confirmed={[
          "Central Bank of Kenya mean rates on 9 September 2026: KSh 129.43 to the US dollar, 175.44 to sterling, 150.50 to the euro.",
          "European Central Bank euro reference rates on 9 September 2026: 178.59 yen, 1.1652 dollars.",
          "The shilling-yen figure in this article is a cross computed from those two published rates, not a quoted market rate.",
        ]}
        unconfirmed={[
          "Current levels for the Ugandan shilling, Sri Lankan rupee, Jamaican dollar and Guyanese dollar. We did not verify these against their own central banks and have therefore not published them.",
          "The specific customs conversion mechanism used by each destination authority. Practice differs and we describe the general pattern only.",
          "Where any of these currencies go next. We do not forecast currencies.",
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        For a Kenyan reader, currency is not the reason to move this quarter. A
        stable shilling means the timing decision belongs to the car, the source
        currency and the tax base &mdash; and in Kenya the tax base is the
        genuinely unsettled part, which we cover separately in our report on the{" "}
        <InlineLink href="/latest-news/kenya-crsp-used-car-valuation-uncertainty-2026">
          contested CRSP schedule
        </InlineLink>
        .
      </P>

      <P>
        For a reader in a market whose currency is genuinely sliding, the
        calculation is different and it is harsher: a falling home currency
        makes every import dearer regardless of what the yen does, because your
        money buys fewer yen and the duty is assessed on a larger local-currency
        value. If that is your position, shortening the gap between quote and
        payment is worth more than shopping for a better hammer price.
      </P>

      <Disclaimer>
        Exchange rates cited are published by the Central Bank of Kenya and the
        European Central Bank for the dates stated, and were checked on 10
        September 2026. Cross-rates are computed and labelled as such. Nothing
        in this article is a currency forecast, and it is not investment or tax
        advice.
      </Disclaimer>

      <Callout
        title="Want the currency legs itemised rather than buried?"
        tone="emerald"
      >
        <p>
          We quote one landed figure with each component shown, so you can see
          which leg sits in which currency before you commit. Send us a
          specification and destination port:{" "}
          <InlineLink href="/request">start here</InlineLink>. For Ireland
          specifically, our{" "}
          <InlineLink href="/ireland-cost-calculator">
            import cost calculator
          </InlineLink>{" "}
          builds the whole bill including VRT.
        </p>
      </Callout>
    </>
  );
}
