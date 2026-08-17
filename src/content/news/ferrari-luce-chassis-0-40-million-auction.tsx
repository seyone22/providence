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

export default function FerrariLuceChassis040MillionAuction() {
  return (
    <>
      <Lead>
        On Saturday 15 August 2026, the most publicly ridiculed Ferrari of the
        decade became the most expensive new car ever sold at public auction.
        Chassis 0 of the Ferrari Luce &mdash; Maranello&rsquo;s first
        series-production electric car &mdash; hammered at{" "}
        <Strong>$40,000,000</Strong> at RM Sotheby&rsquo;s Monterey sale,
        against a pre-sale estimate of &ldquo;in excess of $1.1 million&rdquo;.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>$40,000,000</Strong> hammer price, with the buyer&rsquo;s
            premium waived &mdash; every dollar goes to The Ferrari Foundation,
            a 501(c)(3) educational charity.
          </>,
          <>
            That is roughly <Strong>36&times; the pre-sale estimate</Strong> and
            about <Strong>62&times; the Luce&rsquo;s list price</Strong> of
            &euro;550,000 / &pound;440,000.
          </>,
          <>
            It beats the $26m paid for the final Ferrari Daytona SP3 in 2025 to
            become the <Strong>most expensive new car ever auctioned</Strong>,
            and is almost certainly the most expensive EV ever sold.
          </>,
          <>
            <Strong>The buyer has not been named.</Strong> The sale is recorded
            as anonymous; the names circulating in enthusiast media are
            unconfirmed by anyone party to the transaction.
          </>,
          <>
            This is <Strong>not a market price</Strong>. It is a charity result
            for a first-of-programme chassis, and it tells you very little about
            what a normal Luce is worth.
          </>,
        ]}
      />

      <H2 id="what-happened">What actually happened</H2>

      <P>
        The car was lot 345 at The Monterey Auction 2026, offered by RM
        Sotheby&rsquo;s on the Saturday evening session during Monterey Car
        Week. It is chassis <Strong>ZFF21BUA8T0338000</Strong>, designated
        &ldquo;Chassis 0&rdquo; &mdash; the first production example of the
        entire Luce programme, donated by Ferrari and configured through the
        factory&rsquo;s Tailor Made department specifically for this sale.
      </P>

      <P>
        RM Sotheby&rsquo;s waived its buyer&rsquo;s premium on the lot, so the
        full $40 million passes to <Strong>The Ferrari Foundation</Strong>, the
        marque&rsquo;s 501(c)(3) public charity, earmarked for educational
        initiatives. Delivery to the winning bidder is scheduled for the first
        quarter of 2027.
      </P>

      <H3>The specification nobody else can order</H3>

      <P>
        Chassis 0 was built around a theme of light, which is what
        &ldquo;Luce&rdquo; means. The Tailor Made brief produced a car that
        cannot be replicated:
      </P>

      <UL>
        <CheckLI>
          A one-off <Strong>Madreperla Semi-Gloss</Strong> paint that shifts
          from green to violet depending on the angle of the light.
        </CheckLI>
        <CheckLI>
          <Strong>Perla Le Mans metallic leather</Strong> throughout, with
          Grigio Corvara used for the secondary trim elements.
        </CheckLI>
        <CheckLI>
          Dedicated white-themed wheels and bespoke white brake calipers.
        </CheckLI>
        <CheckLI>
          A Ferrari shield set against an{" "}
          <Strong>optical white background</Strong> &mdash; a treatment reserved
          to this car alone.
        </CheckLI>
        <CheckLI>
          A dedicated plaque identifying it as chassis 0, the first
          series-production electric Ferrari.
        </CheckLI>
      </UL>

      <H2 id="the-price">The price, in context</H2>

      <P>
        The Luce is not a cheap car by any normal measure. It launched at
        roughly &euro;550,000 in Italy, about &pound;440,000 in the UK and
        around $640,000 in the United States. The auction result sits an order
        of magnitude above all of that.
      </P>

      <StatGrid
        stats={[
          { value: "$40m", label: "Hammer price" },
          { value: "36×", label: "Pre-sale estimate" },
          { value: "62×", label: "List price" },
        ]}
      />

      <Table
        head={["Reference point", "Figure", "Multiple of that figure"]}
        rows={[
          ["Ferrari Luce list price (Italy)", "≈ €550,000", "≈ 62×"],
          ["Ferrari Luce list price (UK)", "≈ £440,000", "≈ 68×"],
          ["Ferrari Luce list price (US)", "≈ $640,000", "≈ 62×"],
          ["RM Sotheby's pre-sale estimate", "“In excess of $1.1m”", "≈ 36×"],
          ["Hammer price", "$40,000,000", "—"],
        ]}
        caption="Multiples are approximate and use published launch pricing; currency conversions move the exact figures."
      />

      <H2 id="records">How it compares to every record that matters</H2>

      <P>
        The headline &ldquo;most expensive Ferrari ever&rdquo; is wrong, and
        worth correcting. Chassis 0 set a specific record &mdash; the most ever
        paid at public auction for a <Strong>new</Strong> car &mdash; and it did
        not come close to the marque or all-time records, both of which belong
        to historic racing machinery.
      </P>

      <Table
        head={["Car", "Sold", "Price", "Record it holds"]}
        rows={[
          [
            "1955 Mercedes-Benz 300 SLR Uhlenhaut Coupé",
            "2022",
            "$143,000,000",
            "All-time public auction record, any car",
          ],
          [
            "1962 Ferrari 330 LM / 250 GTO",
            "2023",
            "$51,700,000",
            "Ferrari marque record",
          ],
          [
            "2026 Ferrari Luce “Chassis 0”",
            "2026",
            "$40,000,000",
            "Most expensive new car ever auctioned; most expensive EV",
          ],
          [
            "2025 Ferrari Daytona SP3 (chassis 599+1)",
            "2025",
            "$26,000,000",
            "Previous new-car record — also a Ferrari Foundation charity lot",
          ],
          [
            "2017 Ferrari LaFerrari Aperta",
            "2017",
            "$10,000,000",
            "Earlier benchmark for a new-Ferrari charity sale",
          ],
        ]}
        caption="Public auction results only. Private treaty sales are excluded because they are rarely verifiable."
      />

      <Callout title="The pattern is not new" tone="sky">
        <p>
          Ferrari has run this playbook before, at the same auction house, in
          the same week of the year, for the same charity. The Daytona SP3
          chassis 599+1 made $26m at Monterey in 2025 against a $2.2m list
          price. Chassis 0 did not invent the format &mdash; it escalated it by
          about 54%.
        </p>
      </Callout>

      <H2 id="why-so-high">Why it went so high</H2>

      <P>
        Six forces stacked on top of each other. Any one of them explains a
        premium; together they explain a $40m one.
      </P>

      <H3>1. It is a charitable donation wearing a car&rsquo;s bodywork</H3>

      <P>
        With the buyer&rsquo;s premium waived and 100% of proceeds going to a
        registered 501(c)(3), the bid is a donation. For a US taxpayer that
        changes the arithmetic substantially &mdash; the effective net cost of a
        $40m bid is nothing like $40m, and the bidder receives a car, a record
        and public credit for the gift. Charity lots routinely clear multiples
        of open-market value for exactly this reason.
      </P>

      <H3>2. &ldquo;Chassis 0&rdquo; is a museum artefact, not a used car</H3>

      <P>
        First-of-programme cars are a distinct asset class. The first production
        example of the first electric Ferrari in the company&rsquo;s
        seventy-nine-year history is the sort of object that ends up behind
        glass. Whatever anyone thinks of the Luce today, its chassis 0 is
        permanently the answer to a historical question, and there is exactly
        one of them.
      </P>

      <H3>3. Access to Maranello is a currency</H3>

      <P>
        Ferrari allocates its scarcest internal-combustion hypercars by client
        standing, not by cheque size. Reporting around the Luce launch noted
        that buyers who backed the EV were understood to improve their position
        for future limited-series ICE cars. A $40m donation at the
        marque&rsquo;s own charity sale is the loudest possible statement of
        client loyalty &mdash; and for a serious collector, a permanent seat at
        the front of the allocation queue has quantifiable value.
      </P>

      <H3>4. The controversy raised the price rather than lowering it</H3>

      <P>
        The Luce was mauled on reveal in Rome in May 2026. Purists attacked the
        design, former chairman Luca Cordero di Montezemolo publicly argued the
        prancing horse should be removed from it, and Ferrari&rsquo;s shares
        fell around 8% in a day. Notoriety is not the enemy of collectability
        &mdash; it is often the engine of it. Chassis 0 is the physical centre
        of the most argued-about product decision Ferrari has made in a
        generation.
      </P>

      <H3>5. The commercial evidence had already turned</H3>

      <P>
        By the time the lot crossed the block, the &ldquo;nobody wants it&rdquo;
        narrative was dead. Ferrari cleared its entire 2026 allocation of
        roughly 500 Luce units within about eight weeks of the reveal. Bidders
        were not buying a flop; they were buying the first example of a sold-out
        car.
      </P>

      <H3>6. The room, the format and the night</H3>

      <P>
        Saturday evening at Monterey is the single most concentrated gathering
        of ultra-high-net-worth car buyers in the calendar. A no-premium charity
        lot with a deliberately conservative estimate invites exactly the
        bidding contest that occurred. A result like this needs only two people
        who refuse to lose in public.
      </P>

      <H2 id="who-bought-it">Who bought it</H2>

      <Callout title="The honest answer" tone="amber">
        <p>
          <Strong>Nobody outside the transaction knows.</Strong> RM
          Sotheby&rsquo;s recorded the sale to an anonymous bidder, and neither
          the auction house nor Ferrari has identified the buyer. As of
          publication no party to the sale has confirmed a name.
        </p>
      </Callout>

      <P>
        Several names have circulated in enthusiast media and comment threads
        since the hammer fell &mdash; including a suggestion that the buyer is
        the same collector who took the Daytona SP3 at Monterey in 2025. We are
        not repeating those names as fact, because none of them is sourced to
        anyone with knowledge of the sale. Speculating publicly about a private
        individual&rsquo;s $40m purchase on the basis of a comment thread is not
        reporting.
      </P>

      <H3>What is actually known</H3>

      <UL>
        <CheckLI>
          The sale was transacted through RM Sotheby&rsquo;s at The Monterey
          Auction 2026 and is recorded at $40,000,000.
        </CheckLI>
        <CheckLI>
          The buyer&rsquo;s premium was waived and the proceeds are directed to
          The Ferrari Foundation.
        </CheckLI>
        <CheckLI>
          Delivery of the car is scheduled for <Strong>Q1 2027</Strong>, so the
          buyer is not yet in possession of it.
        </CheckLI>
        <CheckLI>
          The buyer is, necessarily, someone able to commit eight figures to a
          charity lot in a public room &mdash; which in practice means an
          established Ferrari client rather than a new entrant. Maranello does
          not hand its first chassis to a stranger.
        </CheckLI>
      </UL>

      <P>
        If a name is confirmed by RM Sotheby&rsquo;s, Ferrari or the buyer, we
        will update this article.
      </P>

      <H2 id="not-a-market-price">What this result is not</H2>

      <P>
        It is worth being blunt, because a headline like this one distorts
        expectations quickly.
      </P>

      <UL>
        <CheckLI>
          <Strong>It is not a valuation of the Ferrari Luce.</Strong> The model
          remains a roughly &euro;550,000 / &pound;440,000 car. Chassis 47 is
          not worth $40m, or anything approaching it.
        </CheckLI>
        <CheckLI>
          <Strong>
            It is not evidence that electric supercars have re-rated.
          </Strong>{" "}
          The EV market did not move on 15 August. One unrepeatable object with
          a charitable tax treatment did.
        </CheckLI>
        <CheckLI>
          <Strong>It is not the most expensive Ferrari ever.</Strong> That is
          still the $51.7m 1962 330 LM / 250 GTO, and the all-time auction
          record is still the $143m Mercedes 300 SLR Uhlenhaut Coup&eacute;.
        </CheckLI>
      </UL>

      <H2 id="what-it-means">What it means if you actually buy cars</H2>

      <P>
        Strip out the theatre and there are three durable lessons in this
        result, and they apply just as much to a &pound;25,000 import as to a
        $40m one.
      </P>

      <H3>Provenance is priced separately from the car</H3>

      <P>
        Chassis 0 is mechanically identical to the Luce delivered to customer
        number 400. Every dollar above list bought paperwork, sequence and
        story. The same principle operates at the ordinary end of the market:
        two identical cars diverge in value on auction grade, service history
        and export documentation. It is the reason we tell clients to read the{" "}
        <InlineLink href="/blog/japanese-auction-grades-explained">
          auction grade sheet
        </InlineLink>{" "}
        before the photographs.
      </P>

      <H3>Estimates are a floor, not a forecast</H3>

      <P>
        RM Sotheby&rsquo;s published &ldquo;in excess of $1.1 million&rdquo; and
        the car made 36 times that. Auction estimates set the entry point for
        bidding; they are not predictions. Anyone buying at auction &mdash;
        including at the Japanese auctions we bid in every week &mdash; needs a
        walk-away number derived from their own landed-cost model, not from the
        catalogue. Ours is what the{" "}
        <InlineLink href="/ireland-cost-calculator">
          import cost calculator
        </InlineLink>{" "}
        exists to produce.
      </P>

      <H3>Firsts, lasts and limited runs carry a premium you can plan for</H3>

      <P>
        Final-year production runs, launch-edition trims and first-import
        examples all attract money in the used market. If you are sourcing a car
        with an eye on residuals, the sequence matters &mdash; and it is
        knowable in advance from the chassis number and build date, both of
        which appear on the export documents.
      </P>

      <Callout title="Sourcing something rare?" tone="emerald">
        <p>
          We bid in Japanese, UK, UAE and Australian auctions on behalf of
          dealers and private clients every week, and we quote the full landed
          cost &mdash; car, shipping, duty, VAT and registration tax &mdash;
          before anyone commits. If there is a specific chassis you want,{" "}
          <InlineLink href="/request">tell us what it is</InlineLink> and
          we&rsquo;ll price it properly.
        </p>
      </Callout>
    </>
  );
}
