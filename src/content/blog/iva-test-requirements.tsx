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
        DVSA publishes the top ten reasons cars fail Individual Vehicle
        Approval. That is unusually generous of a regulator, and it means nobody
        has to guess. Four of the ten are things an imported car will fail on
        for reasons of geography rather than condition — and all four can be
        dealt with before the car is ever booked in.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Headlamp aim is the number one failure.</Strong> Beams must
            dip to the left, and masking the lamp is not accepted.
          </>,
          <>
            A car imported from outside the EU will usually have{" "}
            <Strong>no rear fog lamp at all</Strong>. One must be fitted, centre
            or offside.
          </>,
          <>
            The speedometer must read in <Strong>mph</Strong>, checked on
            rollers between 35 and 70 mph. GPS units are not accepted.
          </>,
          <>
            Brake minimums are{" "}
            <Strong>60% service, 25% secondary, 18% parking</Strong>, on design
            gross or calculated laden weight.
          </>,
          <>
            An <Strong>MOT pass proves nothing</Strong> about IVA. Different
            test, different standards.
          </>,
        ]}
      />

      <H2 id="the-list">DVSA&rsquo;s own top ten</H2>
      <P>
        The list below is DVSA&rsquo;s, published in its guide{" "}
        <em>Individual Vehicle Approval (IVA) for cars: help to get a pass</em>,
        which covers vehicles in the M1 inspection category. The guide&rsquo;s
        current version dates from 29 June 2017; the underlying standards live
        in the M1 inspection manual, last updated 14 July 2025.
      </P>
      <Table
        head={["#", "Failure point", "Is it an import-specific problem?"]}
        rows={[
          [
            "1",
            <Strong key="a">Headlamp aim</Strong>,
            "Yes — the biggest single one for right-hand-drive conversions and any car from a drive-on-the-right market",
          ],
          [
            "2",
            <Strong key="b">General construction</Strong>,
            "Rarely, on a factory-built car",
          ],
          ["3", <Strong key="c">Brakes</Strong>, "Condition-dependent"],
          [
            "4",
            <Strong key="d">Rear fog lamps</Strong>,
            "Yes — DVSA expects non-EU imports not to have one fitted",
          ],
          [
            "5",
            <Strong key="e">Exterior projections</Strong>,
            "Occasionally, on accessories and bull bars",
          ],
          [
            "6",
            <Strong key="f">Speedometers</Strong>,
            "Yes — km/h-only dials fail",
          ],
          [
            "7",
            <Strong key="g">Statutory plates and VIN</Strong>,
            "Sometimes — plate format and content are prescribed",
          ],
          [
            "8",
            <Strong key="h">Seat belt anchorages</Strong>,
            "Rarely, on a factory-built car",
          ],
          [
            "9",
            <Strong key="i">Emissions</Strong>,
            "Sometimes — the standard is set by engine age, and engine age needs evidence",
          ],
          [
            "10",
            <Strong key="j">Interior fittings</Strong>,
            "Occasionally, after aftermarket work",
          ],
        ]}
        caption="Source: DVSA, 'Individual Vehicle Approval (IVA) for cars: help to get a pass', GOV.UK, updated 29 June 2017. Checked 1 September 2026."
      />
      <Callout title="Full compliance is not a guarantee" tone="amber">
        <p>
          DVSA says so itself: full compliance with the guide does not guarantee
          a pass, and the inspection manual holds the complete requirements and
          testing procedures. Treat the top ten as where to spend your
          preparation budget, not as the whole standard.
        </p>
      </Callout>

      <H2 id="headlamps">Headlamp aim, the number one failure</H2>
      <P>
        DVSA checks the headlamps on an approved aim tester and looks for three
        things: a good clear beam image, the cut-off to the left, and correct
        height and horizontal alignment.
      </P>
      <P>
        A car built for a drive-on-the-right market throws its beam the wrong
        way. DVSA&rsquo;s guidance is explicit that you might need to have
        headlamps on vehicles imported from countries that drive on the right{" "}
        <Strong>converted or replaced</Strong> before the inspection. It is
        equally explicit about the shortcut people try:{" "}
        <Strong>
          the IVA inspection does not allow any kind of internal or external
          masking of the headlamp
        </Strong>
        . Beam-bender stickers are a holiday measure, not an approval measure.
      </P>
      <P>
        Right-hand-drive Japanese and Australian cars already dip to the left,
        so this is a Gulf, European-LHD and American problem rather than a JDM
        one. Even so, have the aim set on a calibrated tester before the test —
        DVSA&rsquo;s own suggestion is that a class 4 MOT station can check and
        adjust it if you do not have the equipment.
      </P>

      <H2 id="fog">The rear fog lamp an import will not have</H2>
      <P>
        This one catches almost every first-time importer, because the part is
        missing rather than faulty. DVSA sets the expectation directly: a
        vehicle imported from <Strong>outside the EU</Strong> is likely not to
        have a rear fog lamp fitted at all, and one from{" "}
        <Strong>inside the EU</Strong> will probably have it only on the
        nearside and need a second on the offside.
      </P>
      <H3>What the lamp has to satisfy</H3>
      <UL>
        <CheckLI>
          Fitted to the <Strong>centre or offside</Strong> rear, squarely to the
          rear so the beam is focused correctly
        </CheckLI>
        <CheckLI>
          If two are fitted, a{" "}
          <Strong>matched pair mounted symmetrically</Strong>
        </CheckLI>
        <CheckLI>
          Insulated, secure wiring, fitted through a grommet where applicable,
          with a securely fitted switch
        </CheckLI>
        <CheckLI>A warning system to tell the driver it is lit</CheckLI>
        <CheckLI>
          Illuminates <Strong>only</Strong> when dipped, main or front fog lamps
          are lit
        </CheckLI>
        <CheckLI>
          Displays an <Strong>&lsquo;e&rsquo; or &lsquo;E&rsquo; mark</Strong>{" "}
          with a <Strong>&lsquo;B&rsquo; or &lsquo;F&rsquo;</Strong> — the first
          says it is approved, the second says it is a fog lamp
        </CheckLI>
      </UL>
      <P>
        Height above ground and distance in from the extreme outer edge are both
        measured. And a correctly fitted lamp can still fail a different
        section: if it can be contacted by the 100 mm sphere used for exterior
        projections, it may fail that standard instead.
      </P>

      <H2 id="speedo">Speedometers, and why km/h fails</H2>
      <P>
        DVSA tests speedometer accuracy on calibrated speed rollers between{" "}
        <Strong>35 and 70 mph</Strong>. The instrument must indicate mph, read
        accurately, be readable by the driver at all times, light up, carry
        maximum marked increments of 20 mph, and read to the vehicle&rsquo;s
        maximum declared speed.
      </P>
      <P>
        Two disqualifications worth knowing. A speedometer hidden behind the
        steering wheel rim fails, because the driver cannot see it. And{" "}
        <Strong>
          speedometers that operate on GPS, or bicycle or racing instruments,
          are not allowed
        </Strong>{" "}
        — which rules out the cheapest fix for a km/h-only dial.
      </P>
      <Callout title="Most JDM cars are already fine here" tone="emerald">
        <p>
          Japanese-market dials are usually marked in km/h, but many are
          dual-marked, and conversion dials or replacement clusters are a mature
          aftermarket. Where DVSA cannot check accuracy on the rollers, the
          guidance allows you to prove suitability another way — evidence from
          the speedometer manufacturer, or by satisfying the examiner it meets
          the standard.
        </p>
      </Callout>

      <H2 id="brakes">The brake efficiency figures</H2>
      <P>
        A full brake test on rollers checks service, secondary and parking brake
        efficiency, servo-depleted brake effort, balance, grab or judder, the
        rate at which effort rises and falls at each wheel, and the
        front-to-rear ratio. The published minimums for IVA are:
      </P>
      <Table
        head={["Brake", "Minimum efficiency"]}
        rows={[
          [<Strong key="a">Service brake</Strong>, "60%"],
          [<Strong key="b">Secondary brake, where testable</Strong>, "25%"],
          [<Strong key="c">Parking brake</Strong>, "18%"],
        ]}
        caption="Calculated on design gross weight or calculated laden weight. Source: DVSA 'help to get a pass', checked 1 September 2026."
      />
      <P>
        DVSA notes these are a different performance requirement from the MOT,
        so an MOT brake test gives you an indication that the brakes work as
        intended rather than a prediction of the result. Braking ratios between
        axles must not be manually adjustable, there must be a driver-reachable
        way of testing for hydraulic failure, and an indelible label identifying
        the brake fluid must sit within 100 mm of the master cylinder.
      </P>

      <H2 id="projections">Exterior projections and the 100mm sphere</H2>
      <P>
        The examiner runs a <Strong>100 mm sphere</Strong> — standing in for a
        pedestrian&rsquo;s knee — over the outside of the car, using a 30-degree
        cone to establish the floor line and checking everything above it up to
        two metres from the ground. Anything hard the sphere touches must be
        blunted or radiused, and a radius gauge measures it.
      </P>
      <UL>
        <CheckLI>
          Parts projecting <Strong>more than 5 mm</Strong> must be radiused to
          at least <Strong>2.5 mm</Strong>
        </CheckLI>
        <CheckLI>
          Parts projecting <Strong>less than 5 mm</Strong> must be blunted
        </CheckLI>
        <CheckLI>
          <Strong>Tape wrapped around a sharp edge is not accepted</Strong> — it
          comes off and it degrades
        </CheckLI>
      </UL>
      <P>
        For a factory car this is usually about what has been added: bull bars,
        light bars, roof racks, aftermarket mirrors and towing eyes. If you are
        buying a modified 4x4 at auction, the accessories are the risk, not the
        vehicle.
      </P>

      <H2 id="rest">Plates, belts, emissions and interior</H2>
      <H3>Statutory plates and VIN</H3>
      <P>
        A statutory plate must be fitted for each build stage, and the plate is
        prescriptive: the required information, in a{" "}
        <Strong>clearly defined rectangle</Strong>, in a fixed order —
        manufacturer&rsquo;s name, approval number or build stage, VIN, maximum
        permitted laden mass, maximum train weight if applicable, then maximum
        laden mass per axle front to rear. Anything else may appear on the plate
        but must sit outside that rectangle. A stamped-in VIN must be on the
        chassis or frame and permanent.
      </P>
      <H3>Emissions</H3>
      <P>
        For spark-ignition engines the emissions standard is set by the{" "}
        <Strong>age of the engine</Strong>, not the age of the car. If the
        engine has come from another vehicle, DVSA may want proof of its age — a
        letter from the engine manufacturer or a recognised authority, or the
        original V5C from the donor vehicle. On older pre-catalyst engines the
        examiner can raise engine speed to around 2,000 rpm and re-check
        hydrocarbons before failing the car.
      </P>
      <H3>Seat belt anchorages</H3>
      <P>
        The examiner assesses strength and suitability, and can ask for bolts to
        be removed to see how the anchorage is actually attached. This is a kit
        car and rebuild problem far more than a factory-car problem — but if a
        vehicle has had seats moved, a wheelchair conversion or a rebuilt floor,
        it becomes yours. Photographs of the anchorages before they were boxed
        in, or engineering drawings, may be accepted as evidence.
      </P>

      <H2 id="order">The order to do the work in</H2>
      <P>Sequenced so that nothing is done twice:</P>
      <UL>
        <CheckLI>
          <Strong>Before you bid.</Strong> Establish whether the car needs
          approval at all — the{" "}
          <InlineLink href="/blog/do-i-need-an-iva-test">
            exemption test
          </InlineLink>{" "}
          takes two minutes and can remove this entire page from your life.
        </CheckLI>
        <CheckLI>
          <Strong>Before it ships.</Strong> Photograph the headlamp units, the
          rear light cluster and the instrument binnacle. Those three pictures
          tell you your parts list.
        </CheckLI>
        <CheckLI>
          <Strong>On arrival.</Strong> Headlamp conversion or replacement, rear
          fog lamp installation, speedometer if the dial is km/h-only. These
          have lead times; start them before you book the test.
        </CheckLI>
        <CheckLI>
          <Strong>Then book.</Strong> DVSA aims to respond to an application
          within 10 working days and offer an inspection within 20, so the
          booking is not the bottleneck the parts are.
        </CheckLI>
        <CheckLI>
          <Strong>Day before.</Strong> Headlamp aim set on a calibrated tester,
          brake efficiency checked, and every hard exterior edge you added
          checked by hand.
        </CheckLI>
      </UL>
      <P>
        Our inspection report on a car names the specification differences that
        matter for a UK registration before you commit, and the full document
        set is sent to you when the vessel departs — so the parts list is
        written while the car is still at sea rather than after it lands.
      </P>

      <Disclaimer>
        This page summarises DVSA&rsquo;s published guidance and does not
        replace it. The complete requirements and testing procedures are in the{" "}
        <a
          href="https://www.gov.uk/government/publications/iva-manual-for-vehicle-category-m1"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          IVA inspection manual for cars (M1)
        </a>
        , last updated 14 July 2025. Every standard quoted here was checked
        against GOV.UK on 1 September 2026. DVSA states that full compliance
        with its guide does not guarantee a pass.
      </Disclaimer>
    </>
  );
}
