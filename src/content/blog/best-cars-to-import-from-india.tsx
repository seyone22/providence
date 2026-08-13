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
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        India&rsquo;s cheapest cars are not automatically its best exports. The
        models worth shipping are the ones where three things agree: the price
        advantage is widest, the engineering suits your roads, and{" "}
        <Strong>somebody near you can get parts for it</Strong>. That last
        condition eliminates more candidates than the first two combined.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Widest price gap:</Strong> the sub-four-metre hatchbacks and
            compact SUVs.
          </>,
          <>
            <Strong>Toughest:</Strong> Mahindra Thar and Scorpio, India-built
            Fortuner and Innova.
          </>,
          <>
            <Strong>The deciding factor:</Strong> parts availability in your
            market, not the sticker price.
          </>,
          <>
            India-built models are supported across{" "}
            <Strong>Africa, South Asia and the Middle East</Strong>.
          </>,
        ]}
      />

      <H2 id="criteria">What makes a good India export</H2>
      <P>
        Three filters, and the order matters. <Strong>Price gap first</Strong>:
        models engineered specifically to India&rsquo;s tax envelope carry the
        widest advantage, because the saving was designed in rather than
        discounted. <Strong>Durability second</Strong>: Indian road conditions
        are demanding, so the domestic-market engineering brief already accounts
        for a lot of what African, South Asian and Latin American buyers need.
      </P>
      <P>
        <Strong>Parts availability third — and it is the veto.</Strong> A car
        nobody local can service is not a bargain at any price. India-built
        models have an aftermarket that reaches across Africa, South Asia and
        the Middle East, and that network is a genuine part of the value
        proposition.
      </P>

      <H2 id="hatchbacks">The sub-four-metre hatchbacks</H2>
      <P>
        India taxes cars by size and engine capacity, so manufacturers engineer
        entire model families to stay under four metres with small engines. The
        constraint disciplines everything — less material, tighter packaging,
        efficient drivetrains — and the saving is baked in before the first
        panel is pressed.
      </P>
      <UL>
        <CheckLI>
          <Strong>Suzuki Swift.</Strong> The global small car, built in India at
          India&rsquo;s cost base. Parts and specialist knowledge exist
          essentially everywhere, which makes it the safest first import for
          most buyers.
        </CheckLI>
        <CheckLI>
          <Strong>Suzuki Baleno.</Strong> Larger inside than the Swift, similar
          running costs, and exported widely, so support is broad.
        </CheckLI>
        <CheckLI>
          <Strong>Hyundai Grand i10 and Tata Tiago.</Strong> Well-equipped for
          the money and cheap to run. Check local Hyundai and Tata support
          before committing.
        </CheckLI>
        <CheckLI>
          <Strong>Honda Amaze and Honda City.</Strong> Compact saloons, which
          several markets prefer to a hatchback, with Honda&rsquo;s service
          network behind them.
        </CheckLI>
      </UL>

      <H2 id="compact-suvs">Compact SUVs</H2>
      <P>
        The fastest-growing segment in India and the one where most of our
        dealer volume sits, because the price gap is wide and demand is
        universal.
      </P>
      <UL>
        <CheckLI>
          <Strong>Hyundai Creta.</Strong> India&rsquo;s best-selling SUV, built
          at scale, well equipped, and priced in a way that makes European
          equivalents look eccentric.
        </CheckLI>
        <CheckLI>
          <Strong>Kia Seltos.</Strong> The Creta&rsquo;s sibling with a
          different character and specification. Frequently the better-value of
          the two depending on trim.
        </CheckLI>
        <CheckLI>
          <Strong>Tata Nexon.</Strong> Five-star crash-rated under Bharat NCAP
          and consistently the strongest safety argument in the segment — useful
          when the question &ldquo;is it safe?&rdquo; comes up, as it should.
        </CheckLI>
        <CheckLI>
          <Strong>Nissan Magnite.</Strong> The clearest expression of the
          sub-four-metre philosophy in SUV form. Very cheap, genuinely well
          packaged.
        </CheckLI>
      </UL>

      <H2 id="offroad">The genuinely tough ones</H2>
      <P>
        India builds vehicles for roads that punish equipment, and the
        engineering reflects it rather than pretending otherwise.
      </P>
      <UL>
        <CheckLI>
          <Strong>Mahindra Thar.</Strong> A purpose-built off-roader with a
          ladder frame and low-range transfer case. Not a soft crossover
          pretending to be capable — and priced far below anything comparable.
        </CheckLI>
        <CheckLI>
          <Strong>Mahindra Scorpio and Scorpio-N.</Strong> Body-on-frame,
          seven-seat, and proven across African and South Asian markets over
          many years.
        </CheckLI>
        <CheckLI>
          <Strong>Toyota Fortuner (India-built).</Strong> The same ladder-frame
          Fortuner sold across Asia and Africa, produced in India for export.
          Toyota reliability with an Indian cost base.
        </CheckLI>
        <CheckLI>
          <Strong>Mahindra XUV700.</Strong> More road-biased, considerably more
          equipment, and startling value against European alternatives.
        </CheckLI>
      </UL>

      <H2 id="seven-seat">Seven-seaters and people carriers</H2>
      <P>
        Under-appreciated outside India and frequently the strongest commercial
        case. The <Strong>Toyota Innova</Strong> is one of the most durable
        people carriers in wide circulation and the default private-hire vehicle
        across much of South and South-East Asia — high mileage, easy servicing,
        strong resale. The <Strong>Maruti Suzuki Ertiga</Strong> does a similar
        job smaller and cheaper.
      </P>
      <Callout title="For fleet and hire operators" tone="emerald">
        <p>
          If the vehicle has to earn money, the Innova is usually the answer. It
          is engineered for exactly that duty cycle, and its parts network
          across Asia and Africa means downtime is measured in hours rather than
          weeks.
        </p>
      </Callout>

      <H2 id="parts">Why parts availability decides it</H2>
      <P>
        This is the most important section and the one buyers skip. Total cost
        of ownership over five years is dominated by servicing and repair, not
        purchase price. A car that saved you 30% at the point of sale and then
        waits three weeks for a wheel bearing has cost you more, not less.
      </P>
      <P>Before committing, establish three things about your own market:</P>
      <UL>
        <CheckLI>
          <Strong>Is the badge represented locally?</Strong> Suzuki, Toyota,
          Hyundai and Honda almost always are. Tata and Mahindra are strong in
          some markets and absent in others.
        </CheckLI>
        <CheckLI>
          <Strong>Is this specific model already on your roads?</Strong> An
          existing population means an existing parts supply and mechanics who
          have seen one.
        </CheckLI>
        <CheckLI>
          <Strong>
            Does the engine or drivetrain differ from the local version?
          </Strong>{" "}
          Same badge, different powertrain, entirely different parts problem.
        </CheckLI>
      </UL>
      <P>
        We check all three before recommending a model, and we will tell you
        when a cheaper car is the worse decision. For what each candidate costs
        to land, see{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-india">
          the cost breakdown
        </InlineLink>
        , or see what our{" "}
        <InlineLink href="/source-cars-from/india">India office</InlineLink> is
        sourcing now.
      </P>

      <Disclaimer>
        Model availability, specification and safety ratings change by model
        year, and left-hand-drive export variants are not offered on every
        model. Local parts support varies significantly by market. Confirm
        availability, specification and local support for your destination
        before committing to a purchase.
      </Disclaimer>
    </>
  );
}
