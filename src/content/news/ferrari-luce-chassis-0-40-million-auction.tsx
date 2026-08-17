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
import {
  ConfirmedLedger,
  ProfileCard,
  PullQuote,
  Timeline,
} from "@/components/news/newsProse";

export default function FerrariLuceChassis040MillionAuction() {
  return (
    <>
      <Lead>
        For about twenty-four hours, the most expensive new car ever sold at
        public auction belonged to nobody. &ldquo;An anonymous bidder&rdquo;,
        the room was told, and the internet did what the internet does. Then the
        name surfaced &mdash; and it turned out the man who had just paid{" "}
        <Strong>$40,000,000</Strong> for the Ferrari the world spent three
        months mocking was the same man who paid $26 million for a Ferrari at
        the same auction, in the same week, one year earlier.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The buyer of Ferrari Luce chassis 0 has been named as{" "}
            <Strong>Dr Herbert &ldquo;Herbie&rdquo; Wertheim</Strong> &mdash;
            optometrist, inventor, and one of the most successful private
            investors in the United States.
          </>,
          <>
            He is <Strong>also the buyer of the one-off Daytona SP3</Strong>{" "}
            &ldquo;chassis 599+1&rdquo; that made $26m at Monterey in 2025. Two
            Ferrari charity lots, two years, <Strong>$66 million</Strong>.
          </>,
          <>
            <Strong>$40,000,000</Strong> hammer, buyer&rsquo;s premium waived
            &mdash; every dollar to The Ferrari Foundation, a 501(c)(3)
            educational charity. That is ~36&times; the estimate and ~62&times;
            list.
          </>,
          <>
            It is the most expensive <Strong>new</Strong> car ever auctioned and
            almost certainly the most expensive EV &mdash; but it was not even
            the top sale of its own week.
          </>,
          <>
            This is <Strong>not a market price</Strong>. Chassis 47 is not worth
            $40m, and nothing about this result re-rates the Luce.
          </>,
        ]}
      />

      <H2 id="the-reveal">The reveal</H2>

      <P>
        When the hammer fell on the Saturday evening of 15 August 2026, RM
        Sotheby&rsquo;s recorded the sale of lot 345 to an anonymous bidder.
        That is standard. What is not standard is a $40 million anonymous
        bidder, and by Sunday the vacuum had filled with names &mdash; a
        Ferrari-collecting watch tycoon, a technology chief executive, a
        philanthropist widow, and a theory that Ferrari had simply bid against
        itself.
      </P>

      <P>
        The answer, published by duPont Registry on 16 August, was none of the
        above. The buyer is <Strong>Dr Herbert A. Wertheim</Strong>, 87, known
        to friends as &ldquo;Dr Herbie&rdquo;, a Florida optometrist and
        inventor who is recognisable across Monterey Car Week for one reason
        before any other: he wears a bright red fedora.
      </P>

      <Callout title="One rumour was right" tone="sky">
        <p>
          Among the guesses circulating on the Sunday was that chassis 0 had
          gone to the same collector who took the one-off Daytona SP3 at
          Monterey in 2025. We declined to print it at the time because nobody
          party to the sale had said so. It was, as it turns out, correct
          &mdash; Wertheim bought both.
        </p>
      </Callout>

      <H2 id="who-he-is">Who Herbert Wertheim is</H2>

      <P>
        He is not a car-industry figure, and that is rather the point. Wertheim
        made his money twice over: first by inventing something small and
        essential, then by holding shares in other people&rsquo;s companies for
        longer than almost anyone else was willing to.
      </P>

      <ProfileCard
        name="Dr Herbert A. Wertheim"
        subtitle="Optometrist, inventor, investor, philanthropist — born Philadelphia, 23 May 1939"
        facts={[
          { label: "Age", value: "87" },
          { label: "Estimated wealth", value: "≈ $4.6–5 billion" },
          { label: "Founded", value: "Brain Power Inc., 1970" },
          { label: "Key holding", value: "Heico — largest individual holder" },
          {
            label: "Given to education",
            value: "$100m+ to Florida universities",
          },
          { label: "Ferrari charity lots", value: "2 — $66m combined" },
        ]}
      >
        <p>
          Wertheim served in the US Navy, where he studied physics and
          chemistry, and in 1969 developed the ultraviolet-filtering tint that
          made plastic eyeglass lenses genuinely protective. He founded Brain
          Power Incorporated in 1970 to commercialise it. Sources differ on the
          size of his patent portfolio &mdash; Wikipedia records nine ophthalmic
          patents, while duPont Registry credits him with more than a hundred
          across optical technology &mdash; but the commercial outcome is not in
          dispute.
        </p>
        <p>
          The larger fortune came from what he did with the proceeds. Wertheim
          has invested since 1970 with an almost obstinate patience, and is the
          largest individual shareholder in the aerospace component manufacturer
          Heico; a roughly $5 million position taken in 1992 is now reported to
          be worth over $800 million. His name is on colleges of medicine,
          engineering, optometry, nursing, public health and business at Florida
          International University, the University of Florida, UC San Diego, UC
          Berkeley and Florida State.
        </p>
      </ProfileCard>

      <P>
        That last detail is the one that makes this purchase legible. The $40
        million did not buy a car so much as it moved $40 million into an
        educational endowment, with a car attached. Wertheim has spent four
        decades doing exactly that, usually without a Ferrari involved.
      </P>

      <PullQuote cite="The economics of a no-premium charity lot">
        The bid is a donation that happens to come with bodywork.
      </PullQuote>

      <H2 id="the-night">How the night unfolded</H2>

      <P>
        The result did not come out of nowhere. It came at the end of a
        fifteen-week arc in which the Luce went from public humiliation to
        sold-out order book.
      </P>

      <Timeline
        items={[
          {
            time: "May 2026",
            title: "The reveal, and the backlash",
            body: (
              <>
                Ferrari unveils the Luce in Rome. Purists attack the design,
                former chairman Luca Cordero di Montezemolo publicly argues the
                prancing horse should be removed from it, and Ferrari shares
                fall around 8% in a day.
              </>
            ),
          },
          {
            time: "July 2026",
            title: "The order book closes",
            body: (
              <>
                Ferrari clears its entire 2026 allocation &mdash; roughly 500
                cars &mdash; within about eight weeks of the reveal. The
                &ldquo;nobody wants it&rdquo; story is commercially dead before
                the auction is held.
              </>
            ),
          },
          {
            time: "Sat 15 Aug 2026",
            title: "Lot 345 crosses the block",
            body: (
              <>
                Chassis ZFF21BUA8T0338000 is offered at The Monterey Auction
                with no reserve, no buyer&rsquo;s premium and an estimate of
                &ldquo;in excess of $1.1 million&rdquo;. It hammers at
                $40,000,000.
              </>
            ),
          },
          {
            time: "Sun 16 Aug 2026",
            title: "The name emerges",
            body: (
              <>
                duPont Registry identifies the buyer as Dr Herbert Wertheim,
                linking him to the $26m Daytona SP3 he bought at the same sale
                in 2025.
              </>
            ),
          },
          {
            time: "Monterey week 2026",
            title: "Beaten in its own week",
            body: (
              <>
                Carroll Shelby&rsquo;s former Cobra Daytona Coupe CSX2300 makes
                $42,905,000 at Gooding Christie&rsquo;s &mdash; the most
                expensive American car ever auctioned, and the week&rsquo;s top
                result.
              </>
            ),
          },
          {
            time: "Q1 2027",
            title: "Delivery",
            body: (
              <>
                The car returns to Maranello for preparation. Wertheim does not
                take possession until the first quarter of 2027.
              </>
            ),
          },
        ]}
      />

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

      <H2 id="records">The records it did and didn&rsquo;t break</H2>

      <P>
        The headline &ldquo;most expensive Ferrari ever&rdquo; is wrong, and
        worth correcting. Chassis 0 set a specific record &mdash; the most ever
        paid at public auction for a <Strong>new</Strong> car &mdash; and it did
        not come close to the marque or all-time records, both of which belong
        to historic racing machinery. It was not even the highest price of its
        own week.
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
            "1964 Shelby Cobra Daytona Coupe (CSX2300)",
            "2026",
            "$42,905,000",
            "Most expensive American car ever auctioned",
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
            "Previous new-car record — also bought by Wertheim",
          ],
        ]}
        caption="Public auction results only. Private treaty sales are excluded because they are rarely verifiable."
      />

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
        Notoriety is not the enemy of collectability &mdash; it is often the
        engine of it. Chassis 0 is the physical centre of the most argued-about
        product decision Ferrari has made in a generation. In thirty years, that
        argument is the story the car tells; the paint is incidental.
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

      <H2 id="the-pattern">The $66 million pattern</H2>

      <P>
        The Wertheim reveal turns a freak result into something more
        interesting: a repeat. In August 2025 he paid{" "}
        <Strong>$26 million</Strong> for a one-off Daytona SP3, chassis
        &ldquo;599+1&rdquo;, finished in two-tone carbon fibre and Giallo
        Modena, at the same auction house, in the same week of the year, for the
        same foundation. In August 2026 he paid <Strong>$40 million</Strong> for
        chassis 0.
      </P>

      <Table
        head={["Year", "Car", "Price", "List price", "Multiple"]}
        rows={[
          [
            "2025",
            "Ferrari Daytona SP3, chassis 599+1",
            "$26,000,000",
            "≈ $2.2m",
            "≈ 12×",
          ],
          [
            "2026",
            "Ferrari Luce, chassis 0",
            "$40,000,000",
            "≈ $640,000",
            "≈ 62×",
          ],
        ]}
        caption="Both lots were no-premium charity consignments benefiting The Ferrari Foundation."
      />

      <P>
        Two data points is not a trend, but it is a pattern with a clear
        internal logic. Ferrari has built an annual mechanism: donate the
        significant chassis, waive the premium, let the room compete for the
        privilege of funding the foundation. Wertheim has become its most
        reliable counterparty &mdash; a man whose lifetime habit is writing very
        large cheques to educational institutions, meeting an auction format
        purpose-built to receive them.
      </P>

      <PullQuote cite="What $66 million in two years actually bought">
        Not two cars. One relationship, two receipts.
      </PullQuote>

      <H2 id="not-a-market-price">What this result is not</H2>

      <P>
        It is worth being blunt, because a headline like this one distorts
        expectations quickly.
      </P>

      <ConfirmedLedger
        confirmed={[
          <>
            The sale was transacted at <Strong>$40,000,000</Strong> through RM
            Sotheby&rsquo;s at The Monterey Auction 2026.
          </>,
          <>
            The buyer&rsquo;s premium was waived; proceeds go to{" "}
            <Strong>The Ferrari Foundation</Strong>, a 501(c)(3).
          </>,
          <>
            The buyer has been reported as <Strong>Dr Herbert Wertheim</Strong>,
            who also bought the 2025 Daytona SP3 charity lot.
          </>,
          <>
            Delivery is scheduled for <Strong>Q1 2027</Strong> &mdash; he is not
            yet in possession of the car.
          </>,
        ]}
        unconfirmed={[
          <>
            Ferrari and RM Sotheby&rsquo;s have not issued their own statements
            naming the buyer; the identification rests on trade reporting.
          </>,
          "No underbidder has been identified, so how close the contest actually was remains unknown.",
          "Whether the car will be displayed publicly, kept privately or lent to a museum has not been stated.",
          <>
            What, if anything, the purchase secures in future Ferrari allocation
            terms &mdash; universally assumed, never documented.
          </>,
        ]}
      />

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
