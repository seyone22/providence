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

export default function KiaSorentoIndiaLaunchPriceAnantapurExport() {
  return (
    <>
      <Lead>
        Kia launched the Sorento in India on <Strong>4 September 2026</Strong>{" "}
        from <Strong>&#8377;27.99 lakh</Strong> ex-showroom, running to
        &#8377;40.39 lakh at the top. It is a seven-seat, ladder-adjacent
        flagship with a strong hybrid and a diesel, and the detail that matters
        for anyone outside India is at the bottom of the release: production has
        started at Kia&rsquo;s Anantapur plant in Andhra Pradesh. This is an
        India-built, right-hand-drive, three-row SUV.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            India launch <Strong>4 September 2026</Strong>, priced{" "}
            <Strong>&#8377;27.99 lakh to &#8377;40.39 lakh</Strong>
            ex-showroom.
          </>,
          <>
            Strong hybrid: 1.6-litre turbo petrol,{" "}
            <Strong>238 PS and 380 Nm</Strong> combined, with all-wheel drive
            available.
          </>,
          <>
            Diesel: 2.2-litre turbo, <Strong>202 PS and 441 Nm</Strong>.
          </>,
          <>
            Built at <Strong>Anantapur, Andhra Pradesh</Strong> &mdash; the
            plant that already supplies Kia&rsquo;s Indian range.
          </>,
          "Ex-showroom is not on-road. Indian registration, road tax and insurance sit on top, and an export price is a different basis again.",
        ]}
      />

      <H2 id="what-launched">What Kia launched</H2>

      <StatGrid
        stats={[
          { value: "₹27.99 lakh", label: "Starting price, ex-showroom" },
          { value: "238 PS", label: "Strong hybrid, 380 Nm" },
          { value: "202 PS", label: "2.2 diesel, 441 Nm" },
        ]}
      />

      <Table
        head={["", "Strong hybrid", "Diesel"]}
        rows={[
          [
            "Engine",
            "1.6-litre turbo petrol with hybrid system",
            "2.2-litre turbo diesel",
          ],
          ["Output", "238 PS combined", "202 PS"],
          ["Torque", "380 Nm", "441 Nm"],
          [
            "Drivetrain",
            "All-wheel drive available",
            "As specified per variant",
          ],
          [
            "Seating",
            "Six and seven-seat layouts",
            "Six and seven-seat layouts",
          ],
        ]}
        caption="India-specification figures as reported at launch on 4 September 2026. Checked 10 September 2026."
      />

      <P>
        Kia describes the Sorento as its new flagship internal-combustion model
        in India, and the all-wheel-drive hybrid is the variant carrying the
        marketing weight. For an importer, the diesel is the more interesting
        half of the range: 441 Nm from a 2.2 in a seven-seat body is the
        specification that sells into East Africa, the Caribbean and the
        Pacific, and diesel parts and service depth in those markets is
        genuinely better than hybrid parts and service depth.
      </P>

      <PullQuote>
        The hybrid is the headline. The diesel is the export case.
      </PullQuote>

      <H2 id="india-built">Why Anantapur matters</H2>

      <P>
        India has quietly become one of the most useful right-hand-drive
        sourcing bases in the world, because it builds volume vehicles in
        right-hand drive as standard, at Indian cost bases, for a domestic
        market large enough that a plant does not need exports to justify
        itself. Kia&rsquo;s Anantapur facility has been supplying that market
        since 2019.
      </P>

      <P>
        A three-row SUV built there is exactly the kind of vehicle that
        historically had to come out of Japan or Korea at a Japanese or Korean
        price. Our guide to{" "}
        <InlineLink href="/blog/why-are-indian-manufactured-cars-cheaper">
          why Indian-manufactured cars cost less
        </InlineLink>{" "}
        sets out where that difference actually comes from &mdash; and it is not
        specification.
      </P>

      <Callout
        title="Indian domestic launch is not an export programme"
        tone="amber"
      >
        <p>
          Production at an Indian plant does not by itself mean the car is
          available for export, in what specification, or on what timetable.
          Manufacturers allocate export volume separately from domestic volume.
          Before quoting a customer a Sorento out of India, confirm the actual
          channel rather than inferring one from the plant address.
        </p>
      </Callout>

      <H2 id="landed">What does the price mean in your money?</H2>

      <P>
        Indian ex-showroom prices include GST but exclude registration, road tax
        and insurance, so they are not an on-road figure and they are certainly
        not an export figure. The conversion below is provided so a non-Indian
        reader can size the vehicle against their own market, not as a landed
        cost.
      </P>

      <CostTable
        title="The India range, converted"
        subtitle="ECB euro reference rate of 110.8225 rupees, 9 September 2026"
        rows={[
          { label: "₹27.99 lakh, base", value: "≈ €25,257" },
          { label: "₹40.39 lakh, top", value: "≈ €36,446" },
        ]}
        total={{
          label: "Ex-showroom, before any import cost",
          value: "≈ €25,257–€36,446",
        }}
      />

      <P>
        Add ocean freight, marine cover, your own duty, your own consumption tax
        and any registration tax, and the landed figure moves substantially. In
        Ireland it would meet VRT on Revenue&rsquo;s own valuation; in Kenya an
        assessed value derived from a published schedule; in Sri Lanka an excise
        band set by engine capacity. The rupee price is the starting point of
        that calculation and not the end of it.
      </P>

      <H2 id="applies">Can you import one?</H2>

      <UL>
        <CheckLI>
          <Strong>It is right-hand drive.</Strong> Built for India, so every
          right-hand-drive destination clears that criterion.
        </CheckLI>
        <CheckLI>
          <Strong>As a new car, age bars do not apply.</Strong> The limits that
          govern used imports into Kenya, Sri Lanka and the Caribbean are not
          the issue with a 2026 vehicle.
        </CheckLI>
        <CheckLI>
          <Strong>
            Emissions certification is the question to settle first.
          </Strong>{" "}
          An Indian-market car carries BS6 homologation. Whether your
          destination accepts it, or requires its own certification, is
          country-specific and slower to resolve than shipping.
        </CheckLI>
        <CheckLI>
          <Strong>Hybrid systems need a parts answer, not just a price.</Strong>{" "}
          Before committing to the hybrid in a market with a thin Kia service
          network, establish where the battery and the hybrid control unit come
          from and how long they take.
        </CheckLI>
      </UL>

      <H3>The dealer read</H3>

      <P>
        India-built three-row SUVs land into Africa, the Caribbean and South
        Asia at a price point that Japanese and Korean equivalents struggle to
        reach, and that is the whole argument. The counter-argument is residual:
        the Indian-built segment does not yet have a long depreciation history
        in most of those markets, and a young brand-plus-origin combination
        carries a risk premium. Saying so is more useful than forecasting a
        residual we cannot evidence.
      </P>

      <ConfirmedLedger
        confirmed={[
          <>
            India launch on 4 September 2026 at &#8377;27.99 lakh to
            &#8377;40.39 lakh ex-showroom.
          </>,
          "1.6-litre turbo strong hybrid producing 238 PS and 380 Nm, with all-wheel drive offered.",
          "2.2-litre turbo diesel producing 202 PS and 441 Nm.",
          <>Production commenced at Kia&rsquo;s Anantapur facility.</>,
        ]}
        unconfirmed={[
          "Whether the Sorento is allocated for export from India, to which markets, and in what specification. We have not seen an export programme announced.",
          "Variant-by-variant drivetrain availability. Reporting indicates all-wheel drive on the hybrid; we have not verified the full variant matrix.",
          "Warranty treatment for a unit exported outside the manufacturer's own distribution network.",
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        For most readers, wait. A car launched six days ago has no used market,
        no residual history and no export allocation anybody has confirmed. The
        useful work now is the homologation question for your destination, which
        is slow and which you can start without owning anything.
      </P>

      <P>
        For a dealer in a market where Kia has a distributor, the better first
        call is to that distributor rather than to an exporter. If the car is
        coming to your market through official channels, importing it privately
        is usually the more expensive way to get the same vehicle with a worse
        warranty.
      </P>

      <Disclaimer>
        Prices and specifications are as reported for the Indian market at
        launch and are subject to change. Exchange rate cited is the European
        Central Bank euro reference rate for 9 September 2026. Import
        admissibility, emissions certification and tax treatment vary by
        destination &mdash; confirm with the relevant authority before
        committing funds.
      </Disclaimer>

      <Callout
        title="Pricing an India-built SUV into your market?"
        tone="emerald"
      >
        <p>
          We source from Indian dealer networks and quote one landed figure to
          your port, with the documentation prepared and explained. Send us the
          model, variant and destination:{" "}
          <InlineLink href="/request">start here</InlineLink>. Our{" "}
          <InlineLink href="/blog/cost-to-import-a-car-from-india">
            India cost guide
          </InlineLink>{" "}
          breaks the bill down line by line.
        </p>
      </Callout>
    </>
  );
}
