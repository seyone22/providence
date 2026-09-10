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

export default function ToyotaLandCruiserFjJapanPriceThailandBuilt() {
  return (
    <>
      <Lead>
        Toyota put the Land Cruiser FJ on sale in Japan on{" "}
        <Strong>14 May 2026</Strong> at <Strong>&yen;4,500,100</Strong> for the
        single VX grade. Two details in the announcement matter more to an
        importer than the price does. The car is built at Toyota Motor
        Thailand&rsquo;s Ban Pho plant, not in Japan. And Toyota&rsquo;s launch
        release names one sales market: Japan.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Japan sales began <Strong>14 May 2026</Strong>. One grade, VX, at{" "}
            <Strong>&yen;4,500,100</Strong> including consumption tax and
            excluding recycling fees.
          </>,
          <>
            Powertrain is the <Strong>2TR-FE 2.7-litre four-cylinder</Strong>{" "}
            petrol with a 6 Super ECT automatic, 120 kW (163 PS) and 246 Nm,
            part-time four-wheel drive.
          </>,
          <>
            Production is at the{" "}
            <Strong>Ban Pho plant, Toyota Motor Thailand</Strong> &mdash; a
            Japanese-market Land Cruiser assembled in a source market we buy in.
          </>,
          <>
            At <Strong>4,575 mm long</Strong> on a 2,580 mm wheelbase, this is a
            compact ladder-frame vehicle, not a scaled-down 300 Series.
          </>,
          <>
            Toyota&rsquo;s launch release states sales in Japan. It does not
            announce a wider rollout, and we have not seen one confirmed.
          </>,
        ]}
      />

      <H2 id="confirmed">What Toyota actually confirmed</H2>

      <StatGrid
        stats={[
          { value: "¥4,500,100", label: "Japan price, VX grade" },
          { value: "163 PS", label: "120 kW, 246 Nm" },
          { value: "8.7 km/L", label: "WLTC combined" },
        ]}
      />

      <Table
        head={["Specification", "Land Cruiser FJ VX"]}
        rows={[
          ["Engine", "2TR-FE, 2.7-litre inline four-cylinder petrol"],
          ["Transmission", "6 Super ECT automatic"],
          ["Output", "120 kW (163 PS), 246 Nm"],
          ["Drivetrain", "Part-time four-wheel drive"],
          ["Fuel economy", "8.7 km/L, WLTC mode"],
          ["Length", "4,575 mm"],
          ["Width", "1,855 mm"],
          ["Wheelbase", "2,580 mm"],
          ["Cargo space", "795 litres, 1,607 litres with rear seats folded"],
          [
            "Production plant",
            "Ban Pho Plant, Toyota Motor Thailand Co., Ltd.",
          ],
        ]}
        caption="From Toyota Motor Corporation's launch announcement. Checked 10 September 2026."
      />

      <P>
        The engine choice is the honest signal about what this vehicle is. The
        2TR-FE is a naturally aspirated petrol four that has served in Hilux and
        Prado applications for years. It is not a performance unit and it was
        never meant to be. It is a durable, widely understood, easily serviced
        engine with parts availability in almost every market we ship into
        &mdash; which for a compact ladder-frame off-roader is a more useful
        property than power.
      </P>

      <PullQuote>
        A Japanese-market Land Cruiser built in Thailand is not a contradiction.
        It is a routing question, and it is the reason this launch is
        interesting to an importer.
      </PullQuote>

      <H2 id="thailand">Built in Thailand, sold in Japan</H2>

      <P>
        Toyota lists the production plant as Ban Pho, Toyota Motor Thailand. The
        car is then sold in Japan as a domestic-market vehicle. That is normal
        for the IMV family the FJ shares its platform with, and it is worth an
        importer&rsquo;s attention for a practical reason: it means two of our
        seven source markets could, in principle, supply the same car through
        completely different channels.
      </P>

      <P>
        We say &ldquo;in principle&rdquo; deliberately. Toyota&rsquo;s
        announcement names Japan as the sales market. Being assembled in
        Thailand does not entitle anyone to buy one from a Thai dealer, because
        a plant builds what its export programme allocates and sells what its
        distributor lists. Until Toyota announces a Thai or wider Asian
        availability, the Japanese domestic market is the confirmed route.
      </P>

      <Callout
        title="Do not assume a plant location means a purchase route"
        tone="amber"
      >
        <p>
          This is a mistake we see monthly. A car assembled in a country is not
          necessarily a car you can buy in that country, and a car sold in a
          country is not necessarily one an exporter can freely acquire. Confirm
          the actual acquisition channel before you promise a customer a
          delivery date.
        </p>
      </Callout>

      <H2 id="landed">What does it land at?</H2>

      <P>
        The &yen;4,500,100 figure is a Japanese domestic retail price and it
        includes Japanese consumption tax. Consumption tax is charged at 10%, so
        the tax component inside that price is roughly &yen;409,100, leaving
        about &yen;4,091,000 before it. Whether that tax comes out of an export
        purchase depends on how the sale is structured and by whom, which is a
        question for your exporter rather than something we will assert as a
        general rule.
      </P>

      <P>
        Converted at the European Central Bank&rsquo;s euro reference rates for
        9 September 2026 &mdash; 178.59 yen to the euro, with sterling crossing
        through 0.85898 &mdash; the retail figure looks like this.
      </P>

      <CostTable
        title="¥4,500,100 in other money"
        subtitle="ECB euro reference rates, 9 September 2026. Purchase price leg only."
        rows={[
          { label: "Japan retail price, VX grade", value: "¥4,500,100" },
          {
            label: "Of which Japanese consumption tax at 10%",
            value: "≈ ¥409,100",
          },
          { label: "At EUR/JPY 178.59", value: "≈ €25,198" },
          { label: "At an implied GBP/JPY of 207.91", value: "≈ £21,645" },
        ]}
        total={{
          label: "Before freight, duty or local tax",
          value: "≈ €25,198",
        }}
      />

      <P>
        That is a purchase price and nothing more. It carries no ocean freight,
        no marine cover, no duty, no VAT or GST and no registration tax. In
        Ireland it would then meet VRT assessed on Revenue&rsquo;s own open
        market selling price; in Kenya it would meet a CRSP-derived assessed
        value; in New Zealand it would meet the Clean Car Standard. The purchase
        price is the smallest interesting number in this article.
      </P>

      <H2 id="applies">Can you import one?</H2>

      <UL>
        <CheckLI>
          <Strong>It is right-hand drive.</Strong> A Japanese-market vehicle is
          right-hand drive as standard, so every right-hand-drive destination on
          our list is a candidate on that criterion.
        </CheckLI>
        <CheckLI>
          <Strong>Age bars do not apply to it.</Strong> A 2026 car is new, so
          the age limits that govern used imports into Kenya, Sri Lanka and much
          of the Caribbean are not the obstacle here.
        </CheckLI>
        <CheckLI>
          <Strong>Emissions and type approval are the real question.</Strong> A
          Japanese-market petrol vehicle carries Japanese homologation. Whether
          your destination accepts that, requires its own certification, or
          requires an approved-vehicle listing is a country-by-country answer
          and it is the one to settle first.
        </CheckLI>
        <CheckLI>
          <Strong>Australia and New Zealand need particular care.</Strong> Both
          run structured entry regimes rather than open used imports. Check the
          applicable register or certification pathway before you commit.
        </CheckLI>
      </UL>

      <H3>Who it is actually for</H3>

      <P>
        A 4,575 mm ladder-frame four-wheel drive with a naturally aspirated 2.7
        and 795 litres behind the seats is a working vehicle with a badge people
        want. That combination sells extremely well in East Africa, the
        Caribbean and the Pacific, and it competes with the used Prado market
        rather than with anything new in its own showroom.
      </P>

      <P>
        For a dealer the interesting comparison is not FJ against a rival. It is
        a new FJ against a five-year-old Prado landed at a similar figure, which
        is a genuinely close call and turns almost entirely on how your market
        taxes new versus used.
      </P>

      <ConfirmedLedger
        confirmed={[
          <>
            Japan sales commenced 14 May 2026 at &yen;4,500,100 for the VX
            grade, including consumption tax and excluding recycling fees.
          </>,
          "2TR-FE 2.7-litre petrol, 6 Super ECT, 120 kW (163 PS), 246 Nm, part-time four-wheel drive, 8.7 km/L WLTC.",
          "Dimensions of 4,575 mm long, 1,855 mm wide, 2,580 mm wheelbase, with 795 litres of cargo space.",
          "Production at the Ban Pho Plant, Toyota Motor Thailand Co., Ltd.",
        ]}
        unconfirmed={[
          <>
            Any sales market other than Japan. Toyota&rsquo;s launch release
            names Japan and we have not seen a wider rollout confirmed.
          </>,
          <>
            Towing capacity, which Toyota&rsquo;s launch material does not state
            in the announcement we read.
          </>,
          "Whether Thai-market availability will follow from the Thai production base. Assembly location is not a sales commitment.",
          "Right-hand-drive specification differences between any future export markets and the Japanese domestic car.",
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        The FJ being built in Thailand rather than Japan also means its supply
        is subject to Thai export conditions rather than Japanese ones, which
        are not currently moving in the same direction &mdash; see our read on{" "}
        <InlineLink href="/latest-news/thailand-vehicle-production-exports-2026-dealer-read">
          Thai production and export volumes
        </InlineLink>
        .
      </P>

      <P>
        Wait, in most cases, and here is the reasoning rather than the verdict.
        A newly launched Japanese-market vehicle takes time to appear in the
        auction halls in useful numbers, and the first units through are bought
        by people paying a launch premium. The used supply that makes an import
        make sense is a year or more away.
      </P>

      <P>
        The exception is the buyer who wants a new one and has confirmed their
        destination will register it. For them the constraint is homologation
        rather than availability, and that work is worth starting now because it
        is slower than the shipping.
      </P>

      <Disclaimer>
        Specifications and prices are as published by Toyota Motor Corporation
        for the Japanese market and are subject to change. Exchange rates cited
        are European Central Bank euro reference rates for 9 September 2026.
        Import admissibility, emissions certification and tax treatment vary by
        destination &mdash; confirm with the relevant authority before
        committing funds.
      </Disclaimer>

      <Callout
        title="Want a Land Cruiser priced out of Japan or Thailand?"
        tone="emerald"
      >
        <p>
          We buy in both markets, inspect before your money moves, and quote one
          landed figure to your port. Send us the grade, the colour and the
          destination and we will build the number:{" "}
          <InlineLink href="/request">start here</InlineLink>. Our{" "}
          <InlineLink href="/blog/best-cars-to-import-from-japan">
            guide to the best cars to import from Japan
          </InlineLink>{" "}
          covers what actually travels well.
        </p>
      </Callout>
    </>
  );
}
