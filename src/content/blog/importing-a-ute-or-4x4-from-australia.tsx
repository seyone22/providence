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
        A well-set-up Australian tourer is one of the best buys in international
        vehicle sourcing. A hard-worked one is a liability with a bull bar on
        it. They photograph identically. Here is how to tell them apart from ten
        thousand miles away — and what to establish about your own country
        before you buy either.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Fitted equipment usually{" "}
            <Strong>costs more than it adds to the price</Strong> — that is the
            opportunity.
          </>,
          <>
            <Strong>Ex-mining stock</Strong> is often the best-maintained in the
            market. Counter-intuitive and true.
          </>,
          <>
            Judge wear from <Strong>underbody, bushes and seals</Strong>, not
            from paintwork.
          </>,
          <>
            <Strong>Check registration acceptance for modifications</Strong>{" "}
            before purchase, not after arrival.
          </>,
        ]}
      />

      <H2 id="two-kinds">Two very different used utes</H2>
      <P>
        Australian 4x4s divide into two populations that look alike in
        photographs. The first is the <Strong>weekend tourer</Strong>: bought
        new, equipped generously, driven on long sealed-road trips with
        occasional dirt, serviced on schedule and washed. The second is the{" "}
        <Strong>working vehicle</Strong>: high hours, low speeds, corrugations,
        dust, and a maintenance record that depends entirely on who was
        responsible for it.
      </P>
      <P>
        Both can be good buys. They should not be priced the same, and the
        difference is rarely visible in the advert.
      </P>

      <H2 id="equipment">Reading the fitted equipment</H2>
      <P>
        The equipment list is the first thing to read, and it tells you two
        things: what you are getting, and what the vehicle was used for.
      </P>
      <Table
        head={["Equipment", "What it adds", "What it implies"]}
        rows={[
          [
            <Strong key="q1">Bull bar / winch</Strong>,
            "Substantial value; expensive to fit later",
            "Remote-area use. Check for impact damage behind it.",
          ],
          [
            <Strong key="q2">Snorkel</Strong>,
            "Modest value",
            "Dust or water crossings. Check the intake and filter housing.",
          ],
          [
            <Strong key="q3">Long-range tank</Strong>,
            "High value, awkward to retrofit",
            "Genuine long-distance touring.",
          ],
          [
            <Strong key="q4">Dual battery / solar</Strong>,
            "Good value",
            "Camping rather than work. Usually a favourable sign.",
          ],
          [
            <Strong key="q5">Suspension upgrade</Strong>,
            "High value if quality components",
            "Load carrying or towing. Check the age of the components.",
          ],
          [
            <Strong key="q6">Tray body / drawers</Strong>,
            "High value",
            "Work vehicle. Check chassis and mounting points.",
          ],
        ]}
        caption="Equipment fitted from new by a first owner is generally a better sign than equipment added late by a seller preparing a vehicle for sale."
      />

      <H2 id="wear">Judging outback wear</H2>
      <P>
        Paintwork tells you almost nothing about an Australian 4x4. Corrugated
        dirt roads do their damage underneath, and a vehicle can present
        beautifully while its suspension mounts and drivetrain seals tell a
        different story. What we photograph and why:
      </P>
      <UL>
        <CheckLI>
          <Strong>Chassis rails and crossmembers.</Strong> Cracking or repair
          around suspension and body mounts is the classic corrugation
          signature.
        </CheckLI>
        <CheckLI>
          <Strong>Suspension bushes and mounts.</Strong> Perished bushes are
          cheap to replace and a reliable indicator of how hard the vehicle
          worked.
        </CheckLI>
        <CheckLI>
          <Strong>Differential and transfer-case seals.</Strong> Weeping seals
          mean heat and load. Not fatal; informative.
        </CheckLI>
        <CheckLI>
          <Strong>Air intake, filter housing and cabin filters.</Strong> Dust
          ingress is the single most damaging thing about outback use, and the
          evidence lives here.
        </CheckLI>
        <CheckLI>
          <Strong>Underbody corrosion.</Strong> Should be minimal on an inland
          vehicle. If it is not, the &ldquo;dry state&rdquo; claim was wrong.
        </CheckLI>
        <CheckLI>
          <Strong>Service record against the odometer.</Strong> Low mileage with
          high hours is normal on a work vehicle and means more wear than the
          number suggests.
        </CheckLI>
      </UL>

      <H2 id="fleet">Ex-mining and ex-fleet stock</H2>
      <P>
        This surprises people, so it is worth stating clearly: ex-mining
        vehicles are frequently among the best buys in the Australian market.
      </P>
      <P>
        Mine-site vehicles run to enforced maintenance schedules with documented
        servicing, because a breakdown on site is a safety and production issue
        rather than an inconvenience. They are retired on a fixed timetable
        rather than when something fails. And they are sold in batches, which
        softens the price.
      </P>
      <Callout title="The trade-offs, stated honestly" tone="amber">
        <p>
          High engine hours at low road speed, so the odometer understates the
          wear. Heavy dust exposure. Frequently cosmetic damage and
          site-required equipment fitted and removed. All of it shows up on
          inspection and all of it should be in the price — which, on a
          well-documented ex-fleet vehicle, it usually is.
        </p>
      </Callout>

      <H2 id="modifications">Will your country register it?</H2>
      <P>
        This is the question to settle before purchase, because the answer
        varies enormously and there is no fixing it afterwards. Some
        destinations accept aftermarket bull bars, lift kits, long-range tanks
        and roof racks without comment. Others require engineering approval, or
        require the equipment removed before registration, or refuse specific
        items outright.
      </P>
      <P>Items that most commonly cause a problem:</P>
      <UL>
        <CheckLI>
          <Strong>Suspension lifts</Strong> beyond a specified height.
        </CheckLI>
        <CheckLI>
          <Strong>Bull bars</Strong>, particularly where pedestrian-impact rules
          apply.
        </CheckLI>
        <CheckLI>
          <Strong>Auxiliary lighting</Strong> and light bars.
        </CheckLI>
        <CheckLI>
          <Strong>Tyre and wheel sizes</Strong> outside the original
          specification.
        </CheckLI>
        <CheckLI>
          <Strong>Long-range tanks</Strong> where fuel-system approval is
          required.
        </CheckLI>
      </UL>
      <P>
        We check your destination&rsquo;s position on the specific vehicle
        before buying it. Where something will not be accepted, the choice is a
        different vehicle or removal before shipment — both far cheaper than
        discovering it at a registration office.
      </P>

      <H2 id="checklist">The inspection checklist</H2>
      <P>What we run on every Australian 4x4, in order:</P>
      <UL>
        <CheckLI>PPSR check — finance, write-off and stolen markers</CheckLI>
        <CheckLI>State registration and service history</CheckLI>
        <CheckLI>Underbody, chassis rail and crossmember photographs</CheckLI>
        <CheckLI>Suspension bush, mount and shock condition</CheckLI>
        <CheckLI>
          Differential, transfer case and gearbox seal condition
        </CheckLI>
        <CheckLI>Air intake and filter inspection for dust ingress</CheckLI>
        <CheckLI>
          Fitted equipment inventory, condition and mounting integrity
        </CheckLI>
        <CheckLI>Destination registration check on every modification</CheckLI>
        <CheckLI>Biosecurity clean and certificate before loading</CheckLI>
      </UL>
      <P>
        The wider process is in{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-australia">
          how to import a car from Australia
        </InlineLink>
        , and the model-level guidance in{" "}
        <InlineLink href="/blog/best-cars-to-import-from-australia">
          the best cars to import from Australia
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Registration acceptance for aftermarket modifications varies
        significantly by destination and changes. Nothing here confirms that a
        particular modified vehicle can be registered in a particular country —
        that requires a destination-specific check, which we carry out before
        purchase.
      </Disclaimer>
    </>
  );
}
