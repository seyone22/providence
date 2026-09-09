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
import { ConfirmedLedger, PullQuote } from "@/components/news/newsProse";

export default function BonhamsGoodwoodRevival2026AuctionPreview() {
  return (
    <>
      <Lead>
        Bonhams sells at the Goodwood Motor Circuit on{" "}
        <Strong>Saturday 19 September 2026</Strong>, and the catalogue is
        top-heavy in a way that tells you something about the market. A 1962
        Aston Martin DB4 SS Vantage Convertible carries a{" "}
        <Strong>&pound;700,000 to &pound;900,000</Strong> estimate. Behind it
        sit three cars estimated between &pound;350,000 and &pound;600,000. What
        is absent is the middle.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The sale runs from{" "}
            <Strong>10:30 BST on Saturday 19 September 2026</Strong> at Goodwood
            Motor Circuit, Chichester, with viewing from 10:00 BST on Friday 18
            September.
          </>,
          <>
            Headline lot:{" "}
            <Strong>1962 Aston Martin DB4 SS Vantage Convertible</Strong>,
            estimated &pound;700,000&ndash;&pound;900,000.
          </>,
          <>
            Also catalogued: a{" "}
            <Strong>1936 Aston Martin 2-litre &lsquo;Speed&rsquo;</Strong> at
            &pound;500,000&ndash;&pound;600,000, a{" "}
            <Strong>1993 Nissan P35</Strong> Group C prototype at
            &pound;400,000&ndash;&pound;500,000, and a{" "}
            <Strong>1991 Jordan-Ford 191</Strong> at
            &pound;350,000&ndash;&pound;525,000.
          </>,
          <>
            At the 2025 Revival sale, the top lot &mdash; a DB4GT Zagato
            Sanction III &mdash; made <Strong>&pound;1,079,000</Strong>{" "}
            including premium, with the next four lots between &pound;207,000
            and &pound;356,500.
          </>,
          "Estimates are estimates. Nothing in this article is a result, and we will report the results when there are some.",
        ]}
      />

      <H2 id="catalogue">What is catalogued</H2>

      <Table
        head={["Lot", "Estimate"]}
        rows={[
          [
            "1962 Aston Martin DB4 SS Vantage Convertible — Superleggera aluminium bodywork, SS 3.7-litre six-cylinder 266hp Vantage engine",
            "£700,000 – £900,000",
          ],
          [
            "1936 Aston Martin 2-litre 'Speed' Competition two-seater, chassis L6/713/U",
            "£500,000 – £600,000",
          ],
          [
            "1993 Nissan P35 FIA Group C / IMSA GTP prototype — 3.5-litre VRT 35 naturally aspirated V12, more than 630hp",
            "£400,000 – £500,000",
          ],
          [
            "1991 Jordan-Ford 191 Formula One car, chassis 191/3 of seven built",
            "£350,000 – £525,000",
          ],
        ]}
        caption="Estimates as published by Bonhams in its press release of 3 September 2026. Checked 10 September 2026."
      />

      <P>
        The Nissan is the one worth a second look for readers of this
        publication. A Japanese factory Group C prototype with a naturally
        aspirated V12 is not the kind of car that turns up at a British circuit
        sale, and its estimate range sits above what most road-going Japanese
        performance cars have ever achieved at auction. It is a reminder that
        Japanese collector interest has moved well past the Skyline.
      </P>

      <PullQuote>
        Four lots above &pound;350,000 and a thin middle. That shape is the
        market, not the catalogue.
      </PullQuote>

      <H2 id="baseline">What last year&rsquo;s sale did</H2>

      <P>
        Bonhams sold 154 lots at the 2025 Goodwood Revival sale on 13 September
        2025. The top result was an Aston Martin DB4GT Zagato Sanction III Coupé
        at <Strong>&pound;1,079,000</Strong> including premium. Below it, the
        next four results were a 1977 TOJ SC302 at &pound;356,500, a 1951 Jaguar
        XK120 Competition Roadster at &pound;316,250, a 1973 Ferrari 365 GTB/4
        &lsquo;Daytona&rsquo; at &pound;309,350, and a 1954 Aston Martin DB2/4
        Drophead Coupé at &pound;207,000.
      </P>

      <StatGrid
        stats={[
          { value: "£1,079,000", label: "2025 top lot, incl. premium" },
          { value: "£356,500", label: "2025 second-highest result" },
          { value: "154", label: "Lots offered in 2025" },
        ]}
      />

      <P>
        The gap between first and second place in 2025 was more than
        &pound;700,000. If the 2026 estimates hold, the same shape repeats: one
        car doing most of the work, a cluster in the mid-hundreds, and a long
        tail. That is what a market with a strong top end and a soft underbelly
        looks like from the auctioneer&rsquo;s side of the rostrum.
      </P>

      <H2 id="landed">What a Goodwood result costs to land</H2>

      <P>
        Hammer price is not what you pay, and it is a long way from what a car
        costs on your driveway. Three additions apply before a single mile of
        ocean.
      </P>

      <UL>
        <CheckLI>
          <Strong>Buyer&rsquo;s premium</Strong> is charged on top of the
          hammer, on a published scale. The 2025 results above are stated
          including premium; the 2026 estimates are not. Do not compare the two
          as though they were the same number.
        </CheckLI>
        <CheckLI>
          <Strong>UK VAT treatment varies by lot.</Strong> Some cars are sold
          under a margin scheme, some carry VAT on the premium only, some are
          fully taxable. It is stated per lot and it changes the total by
          thousands.
        </CheckLI>
        <CheckLI>
          <Strong>Your destination then applies its own regime.</Strong> Ireland
          assesses VRT on Revenue&rsquo;s own open market selling price rather
          than on your invoice. Hong Kong applies first registration tax on the
          Customs and Excise Department&rsquo;s determination. Neither cares
          what you paid at Goodwood.
        </CheckLI>
      </UL>

      <P>
        Converted at the European Central Bank&rsquo;s reference rates for 9
        September 2026, an implied sterling-dollar cross of about 1.356 puts the
        DB4&rsquo;s &pound;900,000 top estimate a little above{" "}
        <Strong>US$1.2 million</Strong>, and its &pound;700,000 lower estimate
        just under <Strong>US$950,000</Strong>. Whether the car crosses the
        million-dollar line therefore depends on the currency as much as on the
        bidding.
      </P>

      <Callout title="Age is not a free pass on admissibility" tone="amber">
        <p>
          A historic car clears most age bars because they set a maximum age for
          modern imports, not a minimum. What it does not automatically clear is
          registration: several markets require an inspection, a certificate of
          conformity or an individual approval before a pre-1970 vehicle can go
          on the road. In the United Kingdom that route is the IVA test, and our{" "}
          <InlineLink href="/blog/iva-test-explained">IVA guide</InlineLink>{" "}
          explains when it applies.
        </p>
      </Callout>

      <H2 id="applies">Does this apply to you?</H2>

      <P>
        Directly, only if you buy historic cars. Indirectly, to any dealer using
        classic values as a read on where discretionary money is going: a
        catalogue with four lots above &pound;350,000 and little underneath them
        is consistent with what the broader indices have been reporting all year
        &mdash; strength at the very top, and weakness in the middle where most
        people actually transact.
      </P>

      <H3>The superlative check</H3>

      <P>
        Bonhams&rsquo; material describes the DB4 Convertible as the rarest
        Aston Martin road car of the David Brown era apart from the Zagato, on
        the basis of a stated production run of 70 convertibles between 1961 and
        1963. We have not independently verified that production total against a
        factory record, and we are attributing the claim rather than repeating
        it as established fact. Rarity claims in auction catalogues are
        marketing until somebody checks them.
      </P>

      <ConfirmedLedger
        confirmed={[
          "The sale takes place 19 September 2026 from 10:30 BST at Goodwood Motor Circuit, with viewing from 10:00 BST on 18 September.",
          "The four headline estimates listed above, as published by Bonhams on 3 September 2026.",
          <>
            The 2025 Revival sale results quoted, as published by Bonhams, are
            stated including buyer&rsquo;s premium.
          </>,
        ]}
        unconfirmed={[
          "The total number of lots in the 2026 sale. The press release does not state it.",
          "The DB4 Convertible production total of 70 cars. Attributed to Bonhams, not independently verified here.",
          "Every result. The sale has not happened. Anyone quoting you a 2026 Goodwood price today is quoting an estimate.",
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        If you intend to bid, the work that matters happens before 19 September
        and none of it is about price. Confirm the VAT status of the specific
        lot. Confirm your destination will register the car, and on what
        evidence. Confirm who is moving it out of Chichester and under what
        insurance, because a car bought at a circuit sale does not leave on a
        transporter you have not booked.
      </P>

      <P>
        If you do not intend to bid, there is nothing here to act on, and the
        results will tell you more in ten days than the estimates do now.
      </P>

      <Disclaimer>
        Estimates are published by Bonhams and do not include buyer&rsquo;s
        premium or applicable taxes. Details above were checked on 10 September
        2026 against Bonhams&rsquo; press material. Nothing in this article is a
        valuation, a result, or advice to bid.
      </Disclaimer>

      <Callout title="Bought at a UK sale and need it moved?" tone="emerald">
        <p>
          We handle UK export clearance, marine cover and the paperwork on
          historic vehicles as well as modern ones, and we quote one landed
          figure to your port. Tell us the lot and the destination:{" "}
          <InlineLink href="/request">start here</InlineLink>. Our{" "}
          <InlineLink href="/blog/uk-car-export-documents-explained">
            UK export documents guide
          </InlineLink>{" "}
          covers what has to travel with the car.
        </p>
      </Callout>
    </>
  );
}
