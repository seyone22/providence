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
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Search for the cost of an IVA test and you will be told anything between
        £199 and £741. Both numbers appear in real published tables; neither is
        the answer on its own. DVSA sets the fee by the class of vehicle, the
        type of test and whether it happens inside working hours, and the whole
        table is public. Here it is, with the costs that sit either side of it.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            A car inspection is <Strong>£199 in working hours</Strong>, £294
            outside them — the same for normal IVA and for basic IVA in the
            personal-import and left-hand-drive classes.
          </>,
          <>
            Amateur-built, rebuilt and parts-of-a-registered-vehicle cars are{" "}
            <Strong>£450</Strong> and £545.
          </>,
          <>
            A re-inspection after a failure is <Strong>£40</Strong>, not another
            full fee.
          </>,
          <>
            <Strong>Statutory IVA fees carry no VAT.</Strong> Voluntary IVA
            does, and its table is quoted VAT-inclusive.
          </>,
          <>
            DVLA first registration is <Strong>£55</Strong>, and the maximum a
            garage may charge for a car MOT is <Strong>£54.85</Strong>.
          </>,
        ]}
      />

      <H2 id="headline">The headline number, and its conditions</H2>
      <P>
        For the overwhelming majority of imported cars the inspection fee is{" "}
        <Strong>£199</Strong>. That figure holds whether the car goes through
        normal IVA or through basic IVA as a personal import, a left-hand-drive
        vehicle, a hearse or a very low volume production car. What changes with
        the class is the average test length — 60 minutes for normal, 110 for
        basic — not the price.
      </P>
      <P>
        The £450 figure attaches to a genuinely different kind of vehicle:
        amateur built (class A), rebuilt (class S) and made using parts of a
        registered vehicle (class C). Those take four hours to inspect. A
        Japanese import is not one of them unless somebody has rebuilt it.
      </P>

      <H2 id="statutory">The statutory fee table for cars</H2>
      <H3>
        Basic IVA — low-volume, hearses, left-hand drive, personal imports
      </H3>
      <Table
        head={[
          "Test type",
          "In working hours",
          "Outside working hours",
          "Average length",
        ]}
        rows={[
          [<Strong key="a">Inspection</Strong>, "£199", "£294", "110 minutes"],
          [<Strong key="b">Re-inspection</Strong>, "£40", "£59", "35 minutes"],
          [<Strong key="c">Appeal</Strong>, "£199", "£294", "70 minutes"],
        ]}
        caption="Classes L, M, N and P. Source: DVSA, 'Vehicle approval test costs: cars', GOV.UK. Page last updated 13 December 2022; checked 1 September 2026."
      />
      <H3>Basic IVA — amateur built, rebuilt, parts of a registered vehicle</H3>
      <Table
        head={[
          "Test type",
          "In working hours",
          "Outside working hours",
          "Average length",
        ]}
        rows={[
          [<Strong key="a">Inspection</Strong>, "£450", "£545", "240 minutes"],
          [<Strong key="b">Re-inspection</Strong>, "£90", "£109", "45 minutes"],
          [<Strong key="c">Appeal</Strong>, "£450", "£545", "180 minutes"],
        ]}
        caption="Classes A, S and C. Source as above."
      />
      <H3>Normal IVA</H3>
      <Table
        head={[
          "Test type",
          "In working hours",
          "Outside working hours",
          "Average length",
        ]}
        rows={[
          [<Strong key="a">Inspection</Strong>, "£199", "£294", "60 minutes"],
          [<Strong key="b">Re-inspection</Strong>, "£40", "£59", "20 minutes"],
          [<Strong key="c">Appeal</Strong>, "£199", "£294", "70 minutes"],
        ]}
        caption="The route for any car that does not meet the basic IVA criteria. Source as above."
      />
      <P>
        Add 45 minutes to the average inspection length for vehicles over
        3,500kg. Out-of-hours testing costs roughly 48% more and exists for
        operational convenience rather than to get you seen sooner.
      </P>

      <H2 id="voluntary">Voluntary IVA, and why it carries VAT</H2>
      <P>
        If the car has ever been registered in the UK, the IVA scheme is closed
        to it and <Strong>voluntary IVA</Strong> applies instead. The prices are
        published differently and the difference tells you something: statutory
        fees are shown as one figure, voluntary fees as a service charge plus
        VAT. A statutory test is a statutory function; a voluntary one is a
        service being sold.
      </P>
      <Table
        head={[
          "Voluntary IVA, in working hours",
          "Service charge",
          "VAT",
          "Total",
        ]}
        rows={[
          [
            <Strong key="a">
              Inspection — LHD, personal import, hearse, low volume
            </Strong>,
            "£213.98",
            "£42.80",
            "£256.78",
          ],
          [
            <Strong key="b">Re-inspection, same classes</Strong>,
            "£43.01",
            "£8.60",
            "£51.61",
          ],
          [
            <Strong key="c">Inspection — amateur built, rebuilt, parts</Strong>,
            "£483.87",
            "£96.77",
            "£580.64",
          ],
          [
            <Strong key="d">Re-inspection, same classes</Strong>,
            "£52.40",
            "£10.48",
            "£62.88",
          ],
        ]}
        caption="Out-of-hours voluntary inspections run to £379.37 and £703.24 respectively. Source: DVSA fee tables, GOV.UK, checked 1 September 2026."
      />

      <H2 id="certificates">Certificates and replacements</H2>
      <Table
        head={["Certificate", "Cost", "When you need it"]}
        rows={[
          [
            <Strong key="a">
              Mutual Recognition / EC approved vehicle without a Certificate of
              Conformity
            </Strong>,
            "£100",
            "An EU-approved car whose manufacturer will not supply a CoC",
          ],
          [
            <Strong key="b">GB conversion IVA certificate (VCA)</Strong>,
            "£100",
            "An EU-registered left-hand-drive vehicle being converted for GB use",
          ],
          [
            <Strong key="c">
              Replacement Individual Approval Certificate
            </Strong>,
            "£25",
            "The original IAC has been lost before registration",
          ],
        ]}
        caption="Sources: DVSA fee tables and GOV.UK 'Getting vehicle approval', checked 1 September 2026."
      />

      <H2 id="around-it">The costs either side of the test</H2>
      <P>
        The inspection fee is rarely the largest number in the approval line of
        a landed cost. These are:
      </P>
      <UL>
        <CheckLI>
          <Strong>Headlamp conversion or replacement.</Strong> DVSA states that
          headlamps on vehicles imported from countries that drive on the right
          may need converting or replacing, and that masking is not accepted.
          Cost depends entirely on whether the unit is a common part.
        </CheckLI>
        <CheckLI>
          <Strong>Rear fog lamp supply and fitting.</Strong> DVSA expects a car
          imported from outside the EU not to have one. It must be
          &lsquo;e&rsquo; or &lsquo;E&rsquo; marked, wired through a grommet,
          switched, and interlocked with the dipped, main or front fog lamps.
        </CheckLI>
        <CheckLI>
          <Strong>Speedometer.</Strong> It has to indicate mph. A dual-marked
          dial usually passes; a km/h-only dial does not, and a GPS or bicycle
          instrument is explicitly not accepted.
        </CheckLI>
        <CheckLI>
          <Strong>Transport to the test centre.</Strong> There are 22 IVA
          centres in Great Britain and only 18 take passenger cars, one of them
          in Scotland and one in Wales. An unregistered car cannot drive itself
          there except to a pre-booked test.
        </CheckLI>
        <CheckLI>
          <Strong>Storage while you wait.</Strong> DVSA aims to respond within
          10 working days and to offer an inspection within 20. The car is
          somewhere during that, and somewhere usually charges.
        </CheckLI>
      </UL>
      <Callout
        title="The re-inspection fee is the cheap part of failing"
        tone="amber"
      >
        <p>
          £40 is not what a failure costs. The cost is the second transporter
          movement, another slot in the queue, and the remedial work. Fixing the
          headlamps and the fog lamp <em>before</em> the first inspection is the
          single highest-return decision in the whole exercise — DVSA publishes
          the top ten failure points, so there is no excuse for meeting them for
          the first time on the day.
        </p>
      </Callout>

      <H2 id="worked">A worked total for a Japanese import</H2>
      <P>
        A nine-year-old Japanese car, so approval is required, bought at auction
        and shipped to a UK port. The purchase and freight figures below are
        placeholders to make the arithmetic legible — the fees, rates and
        statutory charges are the published ones.
      </P>
      <CostTable
        title="Approval and registration, nine-year-old Japanese import"
        subtitle="On an illustrative £12,000 customs value. Statutory figures checked 1 September 2026."
        rows={[
          {
            label: "Customs duty — 0% with a valid Japanese proof of origin",
            value: "£0",
            green: true,
          },
          {
            label: "Import VAT at 20% on the duty-inclusive value",
            value: "£2,400",
          },
          { label: "IVA inspection, normal, in working hours", value: "£199" },
          {
            label: "Headlamp and rear fog lamp work (varies widely)",
            value: "£350",
          },
          { label: "MOT — maximum permitted fee for a car", value: "£54.85" },
          { label: "DVLA first registration", value: "£55" },
        ]}
        total={{ label: "Everything on top of the car", value: "£3,058.85" }}
      />
      <P>
        Two things stand out. The first is that{" "}
        <Strong>VAT dwarfs everything else</Strong> — the approval line is under
        £700 of a £3,000 stack. The second is that the duty line is £0 only
        because a Japanese-built car with valid proof of origin qualifies for
        preference. Without that document the same car attracts the
        third-country rate of <Strong>10%</Strong>, which on £12,000 is £1,200
        of duty and a further £240 of VAT charged on top of it. One piece of
        paper, £1,440.
      </P>
      <P>
        The origin rules are set out in{" "}
        <InlineLink href="/blog/uk-car-export-documents-explained">
          our guide to export documents
        </InlineLink>
        , and the full registration sequence in{" "}
        <InlineLink href="/blog/registering-an-imported-car-in-the-uk">
          registering an imported car in the UK
        </InlineLink>
        .
      </P>

      <H2 id="not-changed">What has not changed</H2>
      <P>
        Worth stating because so much of the material online implies otherwise:
        the GOV.UK page carrying these tables was last updated on{" "}
        <Strong>13 December 2022</Strong>. There has been no IVA fee increase
        since. If a 2026 guide quotes you a car inspection fee that is not £199,
        £294, £450 or £545, it did not come from the published table.
      </P>

      <Disclaimer>
        Fees are set by DVSA, the Vehicle Certification Agency and DVLA and are
        subject to change. Duty and VAT rates come from the UK Integrated Online
        Tariff and depend on the commodity code, the origin of the vehicle and
        the evidence held. Every statutory figure on this page was checked
        against its primary source on 1 September 2026; the purchase and freight
        figures in the worked example are illustrative and not a quotation.
        Confirm current fees at{" "}
        <a
          href="https://www.gov.uk/guidance/apply-for-individual-vehicle-approval-iva-cars"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          gov.uk
        </a>{" "}
        before committing to a purchase.
      </Disclaimer>
    </>
  );
}
