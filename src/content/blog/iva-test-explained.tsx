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
  StatGrid,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        A car with no approval attached to it is, as far as the DVLA is
        concerned, not a car yet. Individual Vehicle Approval is the inspection
        that turns an imported vehicle into a registrable one — and knowing
        before you buy whether your car needs it, and which version of it, is
        worth more than any other single piece of information in a UK import.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>
              IVA is a construction test, not a roadworthiness test.
            </Strong>{" "}
            DVSA inspects how the vehicle is built. The MOT is a separate
            question with a separate answer.
          </>,
          <>
            Cars and minibuses of eight passenger seats or fewer that are{" "}
            <Strong>over 10 years old need no approval at all</Strong>.
          </>,
          <>
            The published DVSA inspection fee for a car is{" "}
            <Strong>£199 in working hours</Strong>, with amateur-built and
            rebuilt vehicles at £450.
          </>,
          <>
            DVSA aims to answer an application in{" "}
            <Strong>10 working days</Strong> and offer an inspection within{" "}
            <Strong>20</Strong>.
          </>,
          <>
            You cannot use the car on the road until it is registered, with{" "}
            <Strong>one exception</Strong>: driving to a pre-booked MOT or
            approval test.
          </>,
        ]}
      />

      <H2 id="what-it-is">What an IVA actually is</H2>
      <P>
        Nearly every car sold new in Britain is covered by a{" "}
        <Strong>type approval</Strong> — an approval granted once to a whole
        model, which every example of that model inherits. It is why nobody
        inspects a new Golf individually. The manufacturer proved the design and
        every car built to it is covered.
      </P>
      <P>
        Individual Vehicle Approval exists for the cars that fall outside that
        system. GOV.UK lists five triggers: a vehicle that has been{" "}
        <Strong>
          built, rebuilt, radically altered, reconstructed from a classic
          vehicle, or imported
        </Strong>
        . For our readers it is nearly always the last one. A Japanese-market
        Alphard, a Gulf-spec Land Cruiser, an Australian ute — none carries a
        British or European type approval, because none was ever intended for
        this market.
      </P>
      <P>
        So the Driver and Vehicle Standards Agency inspects that individual car
        against British construction and environmental standards. Pass, and DVSA
        issues an <Strong>Individual Approval Certificate (IAC)</Strong>. The
        DVLA will not register the vehicle without it, or without one of the
        alternatives in{" "}
        <InlineLink href="/blog/do-i-need-an-iva-test">
          the exemptions guide
        </InlineLink>
        .
      </P>

      <Callout title="IVA is not the MOT, and the MOT is not IVA" tone="amber">
        <p>
          DVSA draws the line itself: the IVA inspection looks at the way your
          vehicle is constructed or adapted, while the annual MOT test looks at
          roadworthiness. Their guidance adds the sentence that catches people
          out — your vehicle might pass the MOT test, but that does not mean it
          will pass an IVA inspection.
        </p>
        <p>
          A perfectly sound car fails IVA on beam pattern, a missing rear fog
          lamp or a speedometer marked in km/h. None of those is an MOT failure.
        </p>
      </Callout>

      <H2 id="who-needs-it">Which cars need one</H2>
      <P>
        The short version is: an imported car that is under 10 years old and was
        not registered in the EU. Everything else has a route around the test.
      </P>
      <Table
        head={["The car", "What it needs", "Why"]}
        rows={[
          [
            <Strong key="a">Import, under 10 years old, non-EU</Strong>,
            "Individual Vehicle Approval",
            "No type approval covers it, and no exemption applies",
          ],
          [
            <Strong key="b">Import, over 10 years old</Strong>,
            "No approval",
            "Cars and minibuses of 8 seats or fewer over 10 years old are exempt",
          ],
          [
            <Strong key="c">EU-registered, right-hand drive</Strong>,
            "European Certificate of Conformity",
            "The EU approval is recognised; you just have to evidence it",
          ],
          [
            <Strong key="d">EU-registered, left-hand drive</Strong>,
            "CoC plus GB conversion IVA certificate",
            "The conversion for British use has to be certified — £100, no test",
          ],
          [
            <Strong key="e">2, 3 or small 4-wheeled vehicle</Strong>,
            "Motorcycle Single Vehicle Approval",
            "A separate scheme with its own inspection",
          ],
          [
            <Strong key="f">Already registered in the UK once</Strong>,
            "Voluntary IVA",
            "GOV.UK: you cannot use the IVA scheme if the vehicle has been registered in the UK before",
          ],
        ]}
        caption="Routes to approval for a car being registered in Great Britain. Source: GOV.UK vehicle approval and import guidance, checked 1 September 2026."
      />
      <P>
        That fifth row matters more than its size suggests. If a car has ever
        held a UK registration — a re-import, a car exported and brought back —
        the IVA scheme is closed to it and <Strong>voluntary IVA</Strong> is the
        route instead, at a different fee and with VAT on top.
      </P>

      <H2 id="basic-vs-normal">Basic IVA and normal IVA</H2>
      <P>
        There are two depths of inspection, and which one you get is decided by
        what the car is rather than by what you would prefer.
      </P>
      <H3>Basic IVA</H3>
      <P>
        A visual inspection and a set of tests, with — in DVSA&rsquo;s words —
        no documentary evidence normally needed. It is available to a passenger
        car or light goods vehicle in one of these categories:
      </P>
      <UL>
        <CheckLI>Left-hand drive vehicles</CheckLI>
        <CheckLI>Personal imports</CheckLI>
        <CheckLI>Amateur built vehicles (kit cars)</CheckLI>
        <CheckLI>Rebuilt vehicles</CheckLI>
        <CheckLI>Very low volume production vehicles</CheckLI>
        <CheckLI>Ambulances, motor caravans and hearses</CheckLI>
        <CheckLI>Armoured passenger vehicles</CheckLI>
        <CheckLI>
          A vehicle manufactured using parts of a registered vehicle
        </CheckLI>
      </UL>
      <H3>Normal IVA</H3>
      <P>
        Everything else. A more detailed inspection, extra standards to meet,
        and documentary evidence you have to supply rather than simply present
        the car. A right-hand-drive Japanese import bought as trade stock rather
        than as a personal import is the common case: it is not left-hand drive,
        not a personal import, and not any of the other basic categories, so it
        goes through the normal route.
      </P>
      <Callout title="Normal does not mean more expensive" tone="emerald">
        <p>
          It is a fair assumption and it is wrong. DVSA&rsquo;s published fee
          for a car inspection is £199 in working hours for <em>both</em> normal
          IVA and basic IVA in the low-volume, hearse, left-hand-drive and
          personal-import classes. What differs is the average inspection length
          — 60 minutes for normal, 110 for basic — and the paperwork you have to
          bring. The £450 fee attaches to amateur-built, rebuilt and
          parts-of-a-registered-vehicle cars, which is a different question
          entirely.
        </p>
      </Callout>

      <H2 id="what-happens">What happens on the day</H2>
      <P>
        The examiner works through the inspection manual for the vehicle
        category — for a car, the M1 manual, 335 pages of it, last updated on 14
        July 2025. In practice the same handful of items decide most outcomes,
        and DVSA publishes its own list of the{" "}
        <InlineLink href="/blog/iva-test-requirements">
          top ten reasons cars fail
        </InlineLink>
        . Headlamp aim is first on it.
      </P>
      <P>
        Expect a brake test on rollers, a speedometer check on calibrated speed
        rollers between 35 and 70 mph, a headlamp aim check on an approved
        tester, an emissions test, and a physical survey of the exterior with a
        100 mm sphere and a radius gauge looking for edges that would injure a
        pedestrian. The examiner may ask for bolts to be removed to see how a
        seat belt anchorage is actually attached.
      </P>
      <P>
        A car in category M1 has to be presented in person. DVSA&rsquo;s
        video-call option exists, but it covers vans and light goods vehicles,
        heavy goods vehicles and trailers — categories N1, N2, N3 and O1 to O4 —
        not cars.
      </P>

      <H2 id="timeline">How long the whole thing takes</H2>
      <StatGrid
        stats={[
          { value: "10", label: "working days for an application decision" },
          { value: "20", label: "working days to be offered an inspection" },
          { value: "22", label: "IVA test centres in Great Britain" },
          { value: "18", label: "of them able to test passenger cars" },
          { value: "60 min", label: "average normal IVA inspection, car" },
          { value: "6 weeks", label: "for the V5C after registration" },
        ]}
      />
      <P>
        Those first two are DVSA&rsquo;s own service commitments rather than
        guarantees, and they run consecutively rather than in parallel. Add the
        pre-test remedial work — a headlamp conversion and a fog lamp
        installation are not same-day jobs at every garage — and a realistic
        plan from vessel discharge to number plate runs to a couple of months
        rather than a couple of weeks.
      </P>
      <P>
        Geography is the constraint nobody budgets for. As of DVSA&rsquo;s test
        centre list of 14 August 2026 there are 22 IVA centres in England,
        Scotland and Wales, 18 of which take passenger vehicles. Scotland has
        one. Wales has one. If you are in Inverness or Bangor, the drive is part
        of the cost.
      </P>

      <H2 id="after">What the certificate gets you</H2>
      <P>
        The Individual Approval Certificate is your proof of approval in the
        DVLA registration pack. It does not tax the car, insure it or put plates
        on it — it unlocks the application. The sequence after a pass runs:
      </P>
      <UL>
        <CheckLI>
          <Strong>NOVA confirmed and any duty and VAT paid</Strong> — both must
          already be done; approval does not substitute for either
        </CheckLI>
        <CheckLI>
          <Strong>DVLA registration application</Strong>, with the IAC and the
          original foreign registration certificate among the originals
        </CheckLI>
        <CheckLI>
          <Strong>£55 first registration fee</Strong>, and the vehicle taxed at
          the same time
        </CheckLI>
        <CheckLI>
          <Strong>V5C in up to six weeks</Strong>, after which plates can be
          made up
        </CheckLI>
      </UL>
      <P>
        The whole chain, in order and with the documents named, is in{" "}
        <InlineLink href="/blog/registering-an-imported-car-in-the-uk">
          registering an imported car in the UK
        </InlineLink>
        .
      </P>

      <H2 id="changed">What changed in 2025 and 2026</H2>
      <P>
        The scheme&rsquo;s standards have been steady; how you interact with it
        has not. Three changes are worth knowing about, and one non-change is
        worth more than any of them.
      </P>
      <Table
        head={["What", "When", "What it means for you"]}
        rows={[
          [
            <Strong key="1">MyVT replaces TAS</Strong>,
            "Fully live March 2025; new digital application from 16 June 2025",
            "Applications are made and paid for online by card; DVSA reports a significant fall in rejected applications",
          ],
          [
            <Strong key="2">Vehicle Examination Facility network</Strong>,
            "Announced 4 February 2026",
            "Approval tests move to third-party sites with DVSA examiners visiting, to shorten the drive",
          ],
          [
            <Strong key="3">Milton Keynes added to the centre list</Strong>,
            "14 August 2026",
            "The newest passenger-car IVA site, and an importer's own premises — the VEF idea in practice",
          ],
          [
            <Strong key="4">IVA fees unchanged</Strong>,
            "Fee page last updated 13 December 2022",
            "£199 and £450 are still the published car inspection fees",
          ],
        ]}
        caption="Sources: DVSA Moving On blog (4 and 25 February 2026), GOV.UK IVA test centre locations and fee tables. Checked 1 September 2026."
      />
      <Callout title="One inconsistency in DVSA's own documents" tone="amber">
        <p>
          The published <em>Individual Vehicle Approval scheme guide</em> was
          last updated on 25 March 2024 and still describes applying through the
          Technical Application System. TAS was fully replaced by Manage your
          Vehicle Testing in March 2025. The guide is still the right reference
          for standards and model reports; ignore its application chapter and
          use the current GOV.UK application pages instead.
        </p>
      </Callout>

      <H2 id="providence">Where this sits in an import we handle</H2>
      <P>
        We tell you the approval position on a specific car{" "}
        <Strong>before you commit to buying it</Strong>, because it is a cost
        and a delay that belongs in the landed figure rather than in a surprise
        after discharge. For UK-bound cars we file the NOVA declaration and
        prepare and submit the DVLA registration pack, and you get the full
        scanned document set when the vessel departs.
      </P>
      <P>
        What we do not do is pretend the process disappears. There is a test, or
        there is an exemption, and either way you will know which before your
        money moves.
      </P>

      <Disclaimer>
        Approval rules, fees and DVSA processes are set by GOV.UK and change
        without much notice. Every figure and rule on this page was checked
        against GOV.UK, DVSA and HMRC sources on 1 September 2026 and is quoted
        with the date of the source page. Confirm the current position on{" "}
        <a
          href="https://www.gov.uk/vehicle-approval"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          gov.uk/vehicle-approval
        </a>{" "}
        before committing to a purchase — this is a guide, not a compliance
        document.
      </Disclaimer>
    </>
  );
}
