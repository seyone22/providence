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

export default function MarutiBalenoFacelift2026PriceIndiaExport() {
  return (
    <>
      <Lead>
        Maruti Suzuki launched the facelifted Baleno on{" "}
        <Strong>5 September 2026</Strong> from <Strong>&#8377;6.10 lakh</Strong>{" "}
        ex-showroom &mdash; &#8377;20,000 above the car it replaces. The
        specification change worth noticing is not the grille. It is a Level 2
        driver assistance suite arriving on a car that starts under &#8377;6.5
        lakh, which is a long way down the price ladder for that equipment.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Launched <Strong>5 September 2026</Strong> from{" "}
            <Strong>&#8377;6.10 lakh</Strong> ex-showroom, up{" "}
            <Strong>&#8377;20,000</Strong> on the outgoing car.
          </>,
          <>
            Z12E 1.2-litre three-cylinder naturally aspirated petrol producing{" "}
            <Strong>83 hp and 112 Nm</Strong>, with five-speed manual or AMT.
          </>,
          <>
            Factory-fitted CNG produces <Strong>70 hp and 102 Nm</Strong> on a
            five-speed manual.
          </>,
          <>
            Claimed economy of <Strong>23.80 kmpl</Strong> manual and{" "}
            <Strong>24.77 kmpl</Strong> AMT.
          </>,
          <>
            Higher grades gain a <Strong>Level 2 ADAS</Strong> suite with
            adaptive cruise, lane-keep assist and emergency braking.
          </>,
        ]}
      />

      <H2 id="what-changed">What changed</H2>

      <StatGrid
        stats={[
          { value: "₹6.10 lakh", label: "From, ex-showroom" },
          { value: "83 hp", label: "1.2 petrol, 112 Nm" },
          { value: "24.77 kmpl", label: "Claimed, AMT" },
        ]}
      />

      <Table
        head={["", "Petrol", "CNG"]}
        rows={[
          [
            "Engine",
            "Z12E 1.2-litre three-cylinder naturally aspirated",
            "Same engine, CNG mode",
          ],
          ["Output", "83 hp, 112 Nm", "70 hp, 102 Nm"],
          ["Transmission", "5-speed manual or 5-speed AMT", "5-speed manual"],
          [
            "Claimed economy",
            "23.80 kmpl manual, 24.77 kmpl AMT",
            "Not stated in the launch material we read",
          ],
        ]}
        caption="India-specification figures as reported at launch on 5 September 2026. Checked 10 September 2026."
      />

      <P>
        Externally it is a facelift: revised headlights, a repositioned Suzuki
        badge, new daytime running lights, a larger grille and a redesigned
        bumper. Inside, the higher grades gain a 22.86 cm SmartPlay Pro+
        touchscreen, wireless Android Auto and Apple CarPlay, and a wireless
        charging pad with active cooling.
      </P>

      <PullQuote>
        Adaptive cruise, lane keeping and emergency braking on a car that starts
        at &#8377;6.10 lakh. That is the story, not the bumper.
      </PullQuote>

      <H2 id="why-it-matters">
        Why a small Indian hatchback matters to an importer
      </H2>

      <P>
        Because it is the shape of car that most of our destination list
        actually buys. A sub-1.2-litre petrol hatchback with a manual gearbox,
        low running costs and a service network is the volume vehicle in Sri
        Lanka, across East Africa and through much of the Caribbean, and the
        segment is far more sensitive to landed cost than anything above it.
      </P>

      <P>
        It is also a segment where a small tax change moves the decision. When
        Tanzania brought vehicles up to 1,000cc into excise at 5% this July, it
        was operating on exactly this end of the market. A 1.2-litre Baleno sits
        just above that threshold, which is the kind of detail that decides a
        dealer&rsquo;s specification before any showroom conversation happens.
      </P>

      <H2 id="landed">What the price means in your money</H2>

      <P>
        Indian ex-showroom pricing includes GST and excludes registration, road
        tax and insurance. It is not an on-road figure and it is not an export
        figure. The conversion below exists so a reader outside India can size
        the car against their own market.
      </P>

      <CostTable
        title="₹6.10 lakh, converted"
        subtitle="ECB euro reference rate of 110.8225 rupees, 9 September 2026"
        rows={[
          { label: "Indian ex-showroom, entry grade", value: "₹610,000" },
          { label: "At EUR/INR 110.8225", value: "≈ €5,504" },
        ]}
        total={{
          label: "Before freight, duty or local tax",
          value: "≈ €5,504",
        }}
      />

      <P>
        Then the destination does its work. A car with a purchase price near
        &euro;5,500 can land at two or three times that figure in a market with
        heavy excise banding, which is why the purchase price is close to
        meaningless on its own in this segment. Our{" "}
        <InlineLink href="/blog/sri-lanka-vehicle-import-taxes-explained">
          Sri Lanka tax guide
        </InlineLink>{" "}
        shows how far that multiple can run.
      </P>

      <Callout title="The cheap car is where tax hurts most" tone="amber">
        <p>
          On an expensive vehicle, duty and excise are a large fraction of a
          large number. On a cheap one they are frequently a larger fraction of
          a small number, because banded charges and fixed levies do not scale
          down. Never assume the small car is the safe import. Run the actual
          band.
        </p>
      </Callout>

      <H2 id="applies">Can you import one?</H2>

      <UL>
        <CheckLI>
          <Strong>Right-hand drive as standard.</Strong> Built for India, so the
          hand is not the obstacle in any right-hand-drive destination.
        </CheckLI>
        <CheckLI>
          <Strong>New car, so no age bar.</Strong> The used-import age limits in
          Kenya, Sri Lanka and the Caribbean do not apply to a 2026 vehicle.
        </CheckLI>
        <CheckLI>
          <Strong>CNG variants need a separate permission check.</Strong>{" "}
          Compressed natural gas fuel systems carry their own certification and
          inspection requirements in several markets, and a few will not
          register a factory CNG conversion without local approval. Settle that
          before you order one.
        </CheckLI>
        <CheckLI>
          <Strong>ADAS calibration is a service question.</Strong> Level 2
          systems need recalibration after windscreen replacement or a front-end
          repair. In a market with no franchised Maruti Suzuki presence, ask
          where that is done before you commit.
        </CheckLI>
      </UL>

      <H3>Does this apply to you?</H3>

      <P>
        If you are a dealer selling small hatchbacks into South Asia, East
        Africa or the Caribbean, this is a specification update to a car you
        probably already stock, and the ADAS grade is a new price point to test.
        If you are a private buyer in Ireland, the United Kingdom or New
        Zealand, this car is not aimed at you and importing one privately will
        not beat what your own market already offers.
      </P>

      <ConfirmedLedger
        confirmed={[
          <>
            Launched 5 September 2026 from &#8377;6.10 lakh ex-showroom, a
            &#8377;20,000 increase on the outgoing model.
          </>,
          "Z12E 1.2-litre three-cylinder producing 83 hp and 112 Nm; CNG mode 70 hp and 102 Nm.",
          "Claimed economy of 23.80 kmpl manual and 24.77 kmpl AMT.",
          "Level 2 ADAS available, including adaptive cruise control, lane-keep assist, emergency braking and high-beam assist.",
        ]}
        unconfirmed={[
          "The full variant-by-variant price ladder. We have verified the entry price only.",
          "Which export markets receive the facelift and on what timetable. Maruti Suzuki exports widely, but we have not seen a market list for this specification.",
          "Whether the ADAS suite is offered on export-specification cars or only on domestic grades.",
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        For a dealer, there is no urgency and a good reason to pause: a facelift
        launched five days ago has not reached export allocation, and the
        outgoing car will be available at a discount while it clears. Buying the
        run-out at the right number is frequently the better trade in this
        segment, and it is a duller answer than being told to secure early
        allocation.
      </P>

      <P>
        For a private buyer, the honest position is that a &#8377;6.10 lakh
        hatchback is not a car that survives an import bill in most of our
        markets unless your destination taxes small engines lightly. Check your
        own band first. If it does not, do not buy this car from abroad &mdash;
        buy it locally or buy something else.
      </P>

      <Disclaimer>
        Prices and specifications are as reported for the Indian market at
        launch and are subject to change. Exchange rate cited is the European
        Central Bank euro reference rate for 9 September 2026. Duty, excise and
        registration treatment vary by destination and by engine capacity band
        &mdash; confirm with the relevant authority before committing funds.
      </Disclaimer>

      <Callout
        title="Want the small-car band checked before you order?"
        tone="emerald"
      >
        <p>
          We source from Indian dealer networks every week and quote one landed
          figure with duty and local tax shown as separate lines, so you can see
          whether the band works before you commit. Send us the model and
          destination: <InlineLink href="/request">start here</InlineLink>. Our{" "}
          <InlineLink href="/blog/best-cars-to-import-from-india">
            guide to the best cars to import from India
          </InlineLink>{" "}
          covers what actually travels.
        </p>
      </Callout>
    </>
  );
}
