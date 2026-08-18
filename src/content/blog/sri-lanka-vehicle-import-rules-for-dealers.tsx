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
        Most guides to importing vehicles into Sri Lanka are written for someone
        buying one car. A dealer has a different problem. You are not asking
        whether a car can come in, you are asking how much capital it ties up,
        for how long, and what happens if it does not sell on schedule. Sri
        Lanka has written a specific answer to that last question into
        regulation, and it is more expensive than most importers realise.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            A vehicle must be registered within{" "}
            <Strong>90 days of the Customs Declaration</Strong>. After that the
            importer owes <Strong>3% of CIF per month</Strong>, capped at{" "}
            <Strong>45% of CIF</Strong>, with no waiver available.
          </>,
          <>
            Age runs from the{" "}
            <Strong>
              date of manufacture to the date of the bill of lading
            </Strong>
            , not to arrival. A delayed sailing can age a car out of
            eligibility.
          </>,
          <>
            Importers registered with the Department of Motor Traffic may import
            in volume. Everyone else is limited to{" "}
            <Strong>one vehicle per twelve months</Strong>.
          </>,
          <>
            A vehicle imported in breach of the regulations must be{" "}
            <Strong>re-exported within 90 days</Strong> of the Bill of Entry, at
            the importer&rsquo;s cost.
          </>,
          "Surcharges on customs duty have been imposed, allowed to run and extended more than once. Treat any expiry date as a plan, not a fact.",
        ]}
      />

      <H2 id="five-gates">The five gates every unit has to pass</H2>

      <P>
        Sri Lankan vehicle importing is not one approval, it is five separate
        gates, each with its own failure mode. Dealers who lose money usually
        clear four of them.
      </P>

      <Table
        head={["Gate", "What it tests", "Failure mode"]}
        rows={[
          [
            "Eligibility",
            "HS code, age band, propulsion type",
            "Car is not admissible at all; forced re-export",
          ],
          [
            "Finance",
            "Letter of credit terms and dating",
            "Loss of an exemption; repricing mid-shipment",
          ],
          [
            "Valuation",
            "CIF as assessed by Customs, not your invoice",
            "Duty and excise higher than quoted",
          ],
          [
            "Registration",
            "90 days from the Customs Declaration",
            "3% of CIF per month, uncapped until 45%",
          ],
          [
            "Compliance",
            "Emissions, safety equipment, documentation",
            "Vehicle cleared but cannot be registered",
          ],
        ]}
        caption="The registration gate is the one that turns a slow-selling unit into a loss, and it is the one least often modelled before purchase."
      />

      <H2 id="registration-clock">The 90-day registration clock</H2>

      <P>
        This is the rule that should shape a dealer&rsquo;s buying, and it is
        buried in the Imports and Exports (Control) Regulations published at
        Gazette Extraordinary No. 2421/04.
      </P>

      <P>
        The Commissioner General of the Department of Motor Traffic may not
        register a vehicle imported under those regulations more than{" "}
        <Strong>90 days after the date of the Customs Declaration</Strong>{" "}
        without payment of a late fee. That fee is{" "}
        <Strong>3% of the CIF value per month</Strong>, computed non-compounded
        and linearly, payable at the point of registration. It is capped at{" "}
        <Strong>45% of CIF</Strong>. A part-month of fewer than 30 days counts
        as a full calendar month, and the regulations state that no waiver shall
        be granted under any circumstances.
      </P>

      <P>
        Non-compounded and linear means the arithmetic is simple and brutal.
        Months late multiplied by 3%, applied to CIF, until you reach 45% at
        fifteen months. On a hypothetical CIF of Rs 10,000,000:
      </P>

      <Table
        head={[
          "Months past the 90-day window",
          "Late fee",
          "Cost on Rs 10m CIF",
        ]}
        rows={[
          ["1", "3% of CIF", "Rs 300,000"],
          ["3", "9% of CIF", "Rs 900,000"],
          ["6", "18% of CIF", "Rs 1,800,000"],
          ["12", "36% of CIF", "Rs 3,600,000"],
          ["15 or more", "45% of CIF (cap)", "Rs 4,500,000"],
        ]}
        caption="Illustrative arithmetic on a hypothetical CIF value, showing the mechanism rather than a quote. The percentages are from the regulations; the rupee figures are ours."
      />

      <P>
        The commercial point is that this fee is charged on CIF, which is a
        number Customs assesses rather than a number you negotiate. It is
        indifferent to whether the car sold, whether the market moved, or
        whether the delay was your fault.
      </P>

      <Callout title="The buying rule this implies" tone="amber">
        <p>
          Do not buy stock you cannot register inside a quarter. Registering a
          car and holding it registered is almost always cheaper than holding it
          unregistered, because the late fee accrues faster than depreciation on
          most of the models that move here. If a specification historically
          takes you five months to turn, either price the 6% in at purchase or
          leave it.
        </p>
      </Callout>

      <H2 id="importer-status">Importer status decides your volume</H2>

      <P>
        The regulations split importers into two categories, and the difference
        is not administrative.
      </P>

      <UL>
        <CheckLI>
          <Strong>
            Registered with the Department of Motor Traffic as a motor vehicle
            importer.
          </Strong>{" "}
          Permitted to import the number of vehicles required, subject to the
          rest of the regulations. This is the dealer position and it is the one
          worth holding.
        </CheckLI>
        <CheckLI>
          <Strong>Any other importer.</Strong> Permitted{" "}
          <Strong>one vehicle within any twelve-month period</Strong>, measured
          from the date of the Bill of Entry of the imported vehicle. That is
          not a soft limit and it catches people who thought a company name was
          enough.
        </CheckLI>
      </UL>

      <P>
        Registration for the purpose of the vehicle itself also requires an
        affidavit including the Taxpayer Identification Number issued by the
        Department of Inland Revenue, submitted with the rest of the file to the
        Commissioner General. Customs is separately required to record the
        gazette number and the CIF value in the declaration, which is what makes
        the late fee mechanically enforceable later.
      </P>

      <H2 id="age-rule">How age is actually measured</H2>

      <P>
        Motor cars are admissible at not more than three years old. The
        important part is not the number, it is the two dates the number sits
        between.
      </P>

      <P>
        Age is the period between the <Strong>date of manufacture</Strong> and
        the <Strong>date of the bill of lading or airway bill</Strong>. Not the
        arrival date, not the clearance date, not the registration date. Where
        the manufacturer&rsquo;s certificate or export inspection certificate
        gives a month, the date of manufacture is deemed to be the fifteenth of
        that month. Where only a year is given, it is deemed to be 15 January of
        that year.
      </P>

      <Callout title="Where this bites" tone="sky">
        <p>
          A car manufactured in November is, by this convention, manufactured on
          15 November. Buy it at auction three years later in early November and
          you have days, not weeks, to get a bill of lading issued. A single
          missed sailing turns an admissible car into a re-export problem. The
          year-only convention is worse: a car whose certificate shows only the
          year is treated as a 15 January car, which can cost you ten months of
          eligibility against a vehicle you thought was a December build.
        </p>
      </Callout>

      <H2 id="lc-discipline">Letter of credit discipline</H2>

      <P>
        Sri Lanka has repeatedly used the Letter of Credit date as the dividing
        line when it changes duty. When a surcharge or a rate change is
        introduced, vehicles under credits established before a stated date are
        usually carved out. That makes an old LC an asset with a value, and it
        can be destroyed by routine housekeeping.
      </P>

      <UL>
        <CheckLI>
          <Strong>Amendments can void an exemption.</Strong> Changes to the
          number of vehicles, the vehicle descriptions, the technical
          specifications or the expiry dates have been treated as breaking the
          carve-out. Price the amendment against the exemption before you
          instruct the bank.
        </CheckLI>
        <CheckLI>
          <Strong>Shipping deadlines attach to exemptions.</Strong> Carve-outs
          have come with a shipped-on-board cut-off on the bill of lading. The
          loading date is what counts, not the arrival.
        </CheckLI>
        <CheckLI>
          <Strong>The authorities can see your credits.</Strong> Licensed banks
          are required to report Letters of Credit established for vehicle
          imports to the Controller General of Imports and Exports on a daily
          basis. Do not plan around an LC date not being noticed.
        </CheckLI>
      </UL>

      <P>
        The live example at the time of writing is the surcharge extension
        covered in{" "}
        <InlineLink href="/latest-news/sri-lanka-vehicle-import-surcharge-extended-2026">
          our report on Gazette Extraordinary No. 2501/88
        </InlineLink>
        , which carries exactly this structure: a credit-date carve-out with a
        shipped-on-board deadline attached.
      </P>

      <H2 id="re-export">The re-export penalty</H2>

      <P>
        If a vehicle is imported in violation of the regulations or of any other
        prevailing rule on vehicle importation, it must be{" "}
        <Strong>re-exported by the importer within 90 days</Strong> of the date
        of the Bill of Entry, with all associated costs borne by the importer.
      </P>

      <P>
        There is no fine-and-keep option written into that provision. For a
        dealer this is the single largest downside risk in the business: the
        purchase, the freight in, the freight out, the clearance costs both ways
        and a total loss of the margin. It is also almost entirely avoidable,
        because the things that trigger it &mdash; age, HS classification,
        propulsion type &mdash; are all knowable before the hammer falls.
      </P>

      <H2 id="duty-timing">
        Duty is a moving target, so buy on the gate not the rate
      </H2>

      <P>
        Sri Lanka&rsquo;s vehicle tax structure has been revised repeatedly, and
        surcharges have been introduced as temporary measures and then extended.
        A rate card is a snapshot, and any dealer model built on one will be
        wrong within a year.
      </P>

      <P>
        The durable planning rules are therefore structural rather than
        numerical:
      </P>

      <UL>
        <CheckLI>
          <Strong>
            Duty and excise are assessed on CIF as Customs values it
          </Strong>
          , not on your invoice. A cheap purchase does not proportionally reduce
          the tax. The mechanics are set out in{" "}
          <InlineLink href="/blog/sri-lanka-vehicle-import-taxes-explained">
            Sri Lanka vehicle import taxes explained
          </InlineLink>
          .
        </CheckLI>
        <CheckLI>
          <Strong>
            Engine capacity bands move more money than headline rates.
          </Strong>{" "}
          Crossing a band boundary by a few cubic centimetres can cost more than
          the extra capacity is worth, which makes specification choice a tax
          decision.
        </CheckLI>
        <CheckLI>
          <Strong>A surcharge on duty is not a surcharge on the car.</Strong> A
          50% surcharge on a 20% duty adds 10% of CIF, not 50%. Read the base
          before you reprice a forecourt.
        </CheckLI>
        <CheckLI>
          <Strong>Confirm before the credit, not before the clearance.</Strong>{" "}
          The point of no return is the LC, not the port.
        </CheckLI>
      </UL>

      <Disclaimer>
        The regulatory provisions described here are drawn from Sri Lankan
        gazette notifications and were checked on 18 August 2026. Rates,
        thresholds and eligibility bands change frequently and vary by HS code,
        capacity band and propulsion type. Nothing here is a substitute for
        confirming the current position for your specific vehicle with{" "}
        <a
          href="https://www.customs.gov.lk/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          Sri Lanka Customs
        </a>{" "}
        and the Department of Motor Traffic before you commit capital.
      </Disclaimer>

      <H2 id="checklist">The pre-purchase checklist</H2>

      <P>
        Six questions, answered in writing, before a credit is opened on any
        unit.
      </P>

      <UL>
        <CheckLI>
          <Strong>What is the date of manufacture</Strong>, applying the
          fifteenth-of-the-month convention, and what bill of lading date does
          that give me before the car ages out?
        </CheckLI>
        <CheckLI>
          <Strong>What is the HS code and the duty rate against it</Strong>, and
          is any surcharge currently applying to that rate?
        </CheckLI>
        <CheckLI>
          <Strong>What capacity band does the engine fall in</Strong>, and is
          there a variant of the same model on the cheaper side of the boundary?
        </CheckLI>
        <CheckLI>
          <Strong>What CIF will Customs assess</Strong>, as distinct from what I
          am paying?
        </CheckLI>
        <CheckLI>
          <Strong>
            What is my realistic days-to-turn on this specification
          </Strong>
          , and does it fit inside 90 days from the Customs Declaration?
        </CheckLI>
        <CheckLI>
          <Strong>If it does not sell, what does month four cost me</Strong> at
          3% of assessed CIF?
        </CheckLI>
      </UL>

      <H3>The honest summary</H3>

      <P>
        Sri Lanka rewards dealers who are conservative about volume and
        disciplined about dates, and it punishes dealers who buy on landed cost
        alone. The margin is not made at the auction. It is made by not owning
        an unregistered car in month five.
      </P>

      <Callout title="Working the Sri Lankan corridor" tone="emerald">
        <p>
          We operate in Sri Lanka and buy at auction in Japan, the UK, the UAE,
          India, Thailand, Australia and New Zealand, so when one source market
          reprices we can quote the same specification out of another. If you
          want the duty, excise and registration-clock position modelled against
          your actual HS code before you open a credit,{" "}
          <InlineLink href="/request">send us the specification</InlineLink>.
          The{" "}
          <InlineLink href="/blog/importing-a-car-to-sri-lanka">
            end-to-end process guide
          </InlineLink>{" "}
          covers the parts of the journey this page assumes you already know.
        </p>
      </Callout>
    </>
  );
}
