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
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        The Y63 Patrol is sold in Australia as a six-rung ladder &mdash; Ti,
        Ti+, Ti-L, Ti-L+, PRO-4X and Ti-L Reserve &mdash; and every rung uses
        the same engine, the same gearbox and the same four-wheel-drive
        hardware. What separates them is suspension, wheels, screens and trim.
        For an importer that matters more than it sounds, because two of those
        four things change what the car costs to run in your market, and one of
        them changes what it costs to land.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Every grade has the same drivetrain.</Strong> A 3.5-litre
            twin-turbo V6, 317 kW and 700 Nm, a nine-speed automatic and
            four-wheel drive with a dual-range transfer case, from the Ti
            upwards.
          </>,
          <>
            <Strong>The Ti already has the off-road hardware.</Strong> Paying up
            the ladder buys comfort, screens and suspension sophistication, not
            capability.
          </>,
          <>
            <Strong>Wheel size is the decision that follows you.</Strong>{" "}
            18-inch wheels on the Ti, 22-inch on the Ti-L Reserve &mdash; and
            tyre cost and availability differ enormously by market.
          </>,
          <>
            <Strong>Air suspension is a serviceability question.</Strong> On the
            PRO-4X and Ti-L Reserve it is a genuine capability upgrade and a
            long-term maintenance liability, in that order.
          </>,
          <>
            <Strong>Each rung costs more than its list difference</Strong> once
            duty and consumption tax are applied to a higher CIF value.
          </>,
        ]}
      />

      <H2 id="ladder">The six grades at a glance</H2>

      <Table
        head={["Grade", "What it adds", "A$ MSRP, before on-road costs"]}
        rows={[
          [
            "Ti",
            "Dual 12.3-inch displays, 3D Around View Monitor, Google built-in, tri-zone climate, ProPILOT, 18-inch wheels, dual-range 4WD",
            "98,990",
          ],
          [
            "Ti+",
            "Panoramic sunroof, power tailgate, privacy glass, roof rails, intelligent rear-view mirror, rain-sensing wipers",
            "109,480",
          ],
          [
            "Ti-L",
            "Dual 14.3-inch displays, 12-speaker Klipsch audio, head-up display, e-Damper suspension, 20-inch wheels",
            "122,690",
          ],
          [
            "Ti-L+",
            "Genuine leather, heated and ventilated front seats, massaging driver's seat, heated steering wheel, cool box, biometric cooling, ambient lighting",
            "134,690",
          ],
          [
            "PRO-4X",
            "Adaptive air suspension, black alloys on all-terrain tyres, off-road bumper, trailer docking support, electric brake controller",
            "137,590",
          ],
          [
            "Ti-L Reserve",
            "Adaptive air suspension, 22-inch wheels, dual 12.8-inch rear screens, massage seats for both front occupants",
            "145,990",
          ],
        ]}
        caption="Australian grades and prices as announced by Nissan Australia on 27 August 2026, before on-road costs. Grade structure and pricing differ by market — the Australian ladder is not the Japanese, Gulf or New Zealand one."
      />

      <H2 id="what-changes">What actually changes as you go up</H2>

      <H3>Nothing mechanical, until the suspension</H3>

      <P>
        The Ti carries the full four-wheel-drive system, the dual-range transfer
        case, the terrain modes and the electronic locking rear differential. A
        buyer choosing the Ti is not choosing a lesser off-road vehicle; they
        are choosing a less decorated one.
      </P>

      <P>
        The first genuine mechanical step is the Ti-L&rsquo;s e-Damper electric
        shock absorber, and the second is adaptive air suspension on the PRO-4X
        and Ti-L Reserve. Air suspension changes ride height, ride quality and,
        on the PRO-4X, articulation on rough ground. It also adds compressors,
        air springs and height sensors to a vehicle that may spend its life a
        long way from a Nissan dealer.
      </P>

      <Callout title="The honest view on air suspension" tone="amber">
        <p>
          If the car is going to a market with a franchised Nissan network and a
          parts supply, air suspension is a straightforward upgrade. If it is
          going somewhere it will be maintained by an independent workshop, ask
          what a replacement air spring costs and how long one takes to arrive
          before you pay for the feature. That answer is the deciding factor far
          more often than the driving impression is.
        </p>
      </Callout>

      <H3>Screens and audio</H3>

      <P>
        The Ti and Ti+ run dual 12.3-inch displays; the Ti-L and above run dual
        14.3-inch displays with a head-up display and 12-speaker Klipsch audio.
        The Ti-L Reserve adds two 12.8-inch screens for the second row. These
        are the features that photograph well and the ones a used buyer values
        least three years later, which is worth knowing if you are buying for
        resale rather than for yourself.
      </P>

      <H3>Wheels, and why they matter more than the badge</H3>

      <P>
        Eighteen inches on the Ti, twenty on the Ti-L, twenty-two on the Ti-L
        Reserve, and all-terrain tyres on black alloys for the PRO-4X. In a
        market with good roads and a well-stocked tyre trade, this is a styling
        choice. In a market where the car will see gravel, potholes or long
        distances between towns, it is a running-cost and availability decision:
        larger wheels mean thinner sidewalls, more damage, more expensive
        replacements and, in some markets, a genuine wait for stock in the
        correct size.
      </P>

      <H2 id="grade-and-tax">
        Why each rung costs more than the price list says
      </H2>

      <P>
        The gap between the Ti and the Ti-L Reserve is <Strong>A$47,000</Strong>{" "}
        on the Australian list. In your own market it is more than that, because
        the higher price raises the CIF value that your duty is assessed on, and
        in most regimes your consumption tax is then charged on the
        duty-inclusive value &mdash; so the extra car is taxed, and the tax on
        it is taxed.
      </P>

      <P>
        The arithmetic, using round numbers purely to show the mechanism and not
        as anyone&rsquo;s actual rates: on a duty of 10% and a consumption tax
        of 20% charged on the duty-inclusive value, every extra A$1,000 of
        vehicle value becomes A$1,320 landed. Apply that to a A$47,000 gap and
        the ladder is A$62,000 wide by the time the car is registered. Your real
        multiplier depends entirely on your own market&rsquo;s rates, which is
        why the calculation is worth doing before you pick a grade rather than
        after.
      </P>

      <P>
        Where a market bands its tax by price rather than applying a flat
        percentage, the effect is sharper still: a single rung can push the car
        over a threshold and into a higher band, which is a step change rather
        than a slope. Model the landed figure for at least two grades before you
        commit &mdash; the{" "}
        <InlineLink href="/ireland-cost-calculator">
          Ireland cost calculator
        </InlineLink>{" "}
        does this for an Irish landing, and the same principle applies
        everywhere.
      </P>

      <H2 id="which-grade">Which grade to actually import</H2>

      <UL>
        <CheckLI>
          <Strong>Towing and touring:</Strong> the Ti or the PRO-4X. The Ti
          because the tow rating and the four-wheel-drive hardware are already
          there at the bottom of the range; the PRO-4X because the all-terrain
          tyres, off-road bumper and trailer-docking hardware are genuinely
          aimed at the job.
        </CheckLI>
        <CheckLI>
          <Strong>Family transport on sealed roads:</Strong> the Ti-L. It is
          where the bigger screens, the head-up display and the e-Damper
          suspension arrive, and it stops short of the features that cost the
          most to maintain.
        </CheckLI>
        <CheckLI>
          <Strong>Chauffeur and executive use:</Strong> the Ti-L+ or the Ti-L
          Reserve, and the Reserve only if the second-row screens will actually
          be used. They are the single largest price step for the narrowest
          benefit.
        </CheckLI>
        <CheckLI>
          <Strong>Resale in a market with no Y63 history:</Strong> the middle of
          the range. The bottom rung competes with every other large SUV on
          price, and the top rung has the thinnest second-hand audience of the
          six.
        </CheckLI>
      </UL>

      <H2 id="markets">The ladder is not the same everywhere</H2>

      <P>
        The six grades above are the Australian range. Other markets get
        different names, different equipment and, in some cases, a different
        engine &mdash; a 3.8-litre naturally aspirated V6 is offered alongside
        the 3.5-litre twin-turbo in parts of the world. New Zealand&rsquo;s
        grade structure had not been published at the time of writing, and the
        Gulf range is left-hand drive throughout.
      </P>

      <P>
        The practical rule is the same as for any import: buy against a chassis
        number and a specification document, not against a grade name. Two cars
        badged Ti-L in two markets are not necessarily the same car. The wider
        process is in our guide to{" "}
        <InlineLink href="/blog/how-to-import-a-nissan-patrol">
          importing a Nissan Patrol
        </InlineLink>
        , and the source-market comparison in{" "}
        <InlineLink href="/blog/best-cars-to-import-from-australia">
          the best cars to import from Australia
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Grade structures, equipment levels and prices are set by each
        market&rsquo;s distributor and change without notice. The Australian
        prices above are as announced on 27 August 2026, before on-road costs,
        and are not a quote. The duty and tax arithmetic in this guide is an
        illustration of a mechanism using round numbers &mdash; it is not any
        market&rsquo;s rate. Verify rates with the revenue or customs authority
        in your destination before committing.
      </Disclaimer>
    </>
  );
}
