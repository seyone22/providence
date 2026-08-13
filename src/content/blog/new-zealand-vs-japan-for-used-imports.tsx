import {
  Callout,
  CheckLI,
  Disclaimer,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  P,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Most of New Zealand&rsquo;s used stock came from Japan in the first
        place. So why would anyone buy the second-hand version at a retail price
        instead of going to the source? There are three good answers, one bad
        one, and a clear rule for telling which situation you are in.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Japan wins on price and choice.</Strong> Wholesale auction,
            vastly larger volume.
          </>,
          <>
            <Strong>New Zealand wins on verification.</Strong> Entry
            certification has already screened the car.
          </>,
          <>
            <Strong>New Zealand wins on used EVs</Strong>, which Japanese
            auctions supply less predictably.
          </>,
          <>
            <Strong>Geography decides the rest</Strong> — Auckland beats
            Yokohama for the Pacific.
          </>,
        ]}
      />

      <H2 id="headline">The headline difference</H2>
      <P>
        Japan is a wholesale market with an independent grading system. New
        Zealand is a retail market with a government compliance record. You pay
        more in New Zealand and you get a car that a second authority has
        already inspected.
      </P>
      <P>
        Whether that is a good trade depends entirely on how much the
        verification is worth to you — which in turn depends on how much you are
        spending and how far the car has to travel before you can look at it.
      </P>

      <H2 id="choice">Choice and volume</H2>
      <P>
        Not close. More than a hundred thousand graded vehicles pass through the
        Japanese auction network every week, linked nationally, so a specific
        model in a specific grade, colour and mileage band is a realistic target
        within a few cycles.
      </P>
      <P>
        New Zealand&rsquo;s market is a filtered subset of what Japan sold some
        years ago, plus NZ-new stock. If your requirement is narrow, Japan will
        find it faster and probably cheaper. If your requirement is &ldquo;a
        good example of a common car&rdquo;, New Zealand is perfectly capable.
      </P>

      <H2 id="verification">Verifying condition</H2>
      <P>
        This is where it gets interesting, because both markets are strong and
        they are strong in <em>different</em> ways.
      </P>
      <Table
        head={["", "Japan", "New Zealand"]}
        rows={[
          [
            <Strong key="v1">Independent condition grade</Strong>,
            "Yes — auction sheet, before bidding",
            "No equivalent",
          ],
          [
            <Strong key="v2">Structural integrity screen</Strong>,
            "Noted on the sheet",
            "Government entry certification",
          ],
          [
            <Strong key="v3">Odometer verification</Strong>,
            "Inspection records + export certificate",
            "Entry certification + registration record",
          ],
          [
            <Strong key="v4">Cosmetic condition</Strong>,
            "Panel-by-panel damage map",
            "Physical inspection only",
          ],
          [
            <Strong key="v5">Service history since</Strong>,
            "Japanese-language records",
            "Local, in English",
          ],
        ]}
        caption="Japan verifies cosmetic and mechanical condition at the point of sale. New Zealand verifies structural and odometer integrity at the point of import. They are complementary, not competing."
      />
      <P>
        In short: Japan tells you more about{" "}
        <Strong>what the car looks like</Strong>, New Zealand tells you more
        about <Strong>whether the car is sound</Strong>. If you can only have
        one, most buyers should want the second — but the Japanese sheet is
        available before you commit money, which is a real advantage of its own.
        How to read one is in{" "}
        <InlineLink href="/blog/japanese-auction-grades-explained">
          Japanese auction grades explained
        </InlineLink>
        .
      </P>

      <H2 id="price">Price</H2>
      <P>
        Japan, usually, and the reason is structural rather than incidental: you
        are buying at wholesale rather than retail. A New Zealand price includes
        what somebody already paid to import, comply, register and market the
        car, plus their margin.
      </P>
      <Callout title="The honest way to frame it" tone="sky">
        <p>
          The New Zealand premium is not a markup you are being charged. It is
          the cost of work that has already been done — importing, complying,
          and proving the car is sound. The question is whether you want that
          work done for you or would rather do it yourself in Japan and keep the
          difference.
        </p>
      </Callout>

      <H2 id="documents">Documentation and language</H2>
      <P>
        New Zealand, comfortably. Registration records, compliance files and
        service histories are all in English, which removes a translation step
        and, more importantly, removes the risk of something being lost in one.
      </P>
      <P>
        A Japanese export certificate requires certified translation to be
        usable for clearance and registration in most markets — routine, but one
        more thing that has to be right. Details in{" "}
        <InlineLink href="/blog/japan-car-export-documents-explained">
          the Japanese document guide
        </InlineLink>
        .
      </P>

      <H2 id="freight">Freight and destination rules</H2>
      <P>Pure geography, and it can override everything above:</P>
      <UL>
        <CheckLI>
          <Strong>Australia and the Pacific:</Strong> New Zealand, easily.
          Short, frequent sailings from Auckland.
        </CheckLI>
        <CheckLI>
          <Strong>South-East Asia:</Strong> comparable. Decide on the car, not
          the freight.
        </CheckLI>
        <CheckLI>
          <Strong>East and southern Africa:</Strong> Japan, generally — more
          frequent sailings and established routes.
        </CheckLI>
        <CheckLI>
          <Strong>Europe:</Strong> Japan, usually, though neither is cheap.
        </CheckLI>
      </UL>

      <H2 id="verdict">The verdict</H2>
      <P>
        <Strong>Buy from Japan</Strong> when price is the priority, when your
        requirement is specific, when you want the newest possible car, or when
        you are shipping to Africa or Europe.
      </P>
      <P>
        <Strong>Buy from New Zealand</Strong> when the extra verification is
        worth paying for, when you want a used electric or plug-in vehicle, when
        English documentation matters to your registration process, or when you
        are shipping into Oceania or the Pacific.
      </P>
      <P>
        We run <InlineLink href="/source-cars-from/japan">both</InlineLink>{" "}
        <InlineLink href="/source-cars-from/new-zealand">offices</InlineLink>,
        so tell us the requirement and we will compare the landed cost from each
        rather than defending one.
      </P>

      <Disclaimer>
        Pricing, availability and freight rates in both markets change
        continuously, and destination age and emissions rules can exclude
        vehicles from either source. Confirm the current position for your
        specific requirement before committing.
      </Disclaimer>
    </>
  );
}
