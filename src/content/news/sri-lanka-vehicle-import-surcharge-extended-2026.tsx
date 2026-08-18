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
import { ConfirmedLedger, Timeline } from "@/components/news/newsProse";

export default function SriLankaVehicleImportSurchargeExtended2026() {
  return (
    <>
      <Lead>
        Sri Lanka&rsquo;s 50% surcharge on customs import duty for motor
        vehicles was due to lapse in mid-August. It did not. Gazette
        Extraordinary No. 2501/88 extends it to{" "}
        <Strong>31 December 2026</Strong>, and the exemption that protects older
        orders dies on a date most dealers have not diarised:{" "}
        <Strong>15 November 2026</Strong>, the last day a vessel can be loaded.
        The surcharge is not 50% on the price of the car, and the difference
        between those two readings is the whole story.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The 50% surcharge on Customs Import Duty for specified motor
            vehicles now runs from <Strong>15 August 2026</Strong> to{" "}
            <Strong>31 December 2026</Strong>, under Gazette Extraordinary No.
            2501/88.
          </>,
          <>
            It is a surcharge <Strong>on the duty</Strong>, not on the vehicle.
            Where the duty rate is 20%, a 50% surcharge takes it to 30% &mdash;
            an extra 10% of CIF, not an extra 50%.
          </>,
          <>
            Vehicles under Letters of Credit established{" "}
            <Strong>on or before 15 May 2026</Strong> are exempt &mdash; but
            only if the LC is unamended{" "}
            <Strong>
              and the bill of lading shows a shipped-on-board date no later than
              15 November 2026
            </Strong>
            .
          </>,
          "Amending that LC as to vehicle count, description, technical specification or expiry date destroys the exemption. Check before you amend, not after.",
          <>
            The surcharge is the smaller of the two clocks. Sri Lanka&rsquo;s
            90-day registration rule charges{" "}
            <Strong>3% of CIF per month, capped at 45%</Strong>, and there is no
            waiver.
          </>,
        ]}
      />

      <H2 id="what-changed">What the gazette actually does</H2>

      <P>
        On 13 August 2026 President Anura Kumara Dissanayake, acting as Minister
        of Finance, Planning and Economic Development, issued an order under
        Section 10A of the Customs Ordinance (Chapter 235), as amended by Act
        No. 83 of 1988. Published as Gazette Extraordinary No. 2501/88, it
        extends the 50% surcharge on Customs Import Duty for specified motor
        vehicles from 15 August 2026 through to 31 December 2026, applying to
        both General and Preferential duty rates.
      </P>

      <P>
        This is an extension rather than a new measure. The surcharge was first
        imposed with effect from 16 May 2026 and was originally set to run for
        three months, which is why the trade expected it to fall away in the
        second week of August. It has now been pushed out by a further four and
        a half months.
      </P>

      <Timeline
        items={[
          {
            time: "16 May 2026",
            title: "Surcharge introduced",
            body: (
              <>
                A 50% surcharge on Customs Import Duty for specified motor
                vehicles takes effect, stated as a three-month measure to
                contain foreign-exchange spending on vehicle imports.
              </>
            ),
          },
          {
            time: "13 August 2026",
            title: "Gazette 2501/88 issued",
            body: (
              <>
                The order extending the surcharge is signed under Section 10A of
                the Customs Ordinance.
              </>
            ),
          },
          {
            time: "15 August 2026",
            title: "Extension takes effect",
            body: <>The extended surcharge period begins.</>,
          },
          {
            time: "15 November 2026",
            title: "Shipped-on-board cut-off",
            body: (
              <>
                The last date a bill of lading or airway bill can show for a
                pre-15 May LC to keep its exemption.{" "}
                <Strong>This is the operative deadline for dealers.</Strong>
              </>
            ),
          },
          {
            time: "31 December 2026",
            title: "Surcharge period ends",
            body: (
              <>
                The extended period expires. Whether it is extended again is not
                on the record, and the May-to-August history suggests planning
                on a lapse is optimistic.
              </>
            ),
          },
        ]}
      />

      <H2 id="not-fifty-percent">It is not 50% on the car</H2>

      <P>
        The headline reads as a 50% tax rise and it is being repeated that way.
        It is not. The surcharge is calculated on the Customs Import Duty
        payable, not on the value of the vehicle. Where a car attracts a 20%
        duty, a 50% surcharge on that duty adds 10 percentage points of CIF and
        produces an effective duty of 30%.
      </P>

      <P>
        Because duty rates in Sri Lanka vary by HS code, engine capacity and
        propulsion type, the only honest way to present this is as a mechanism
        rather than a single number. Find your own duty rate and read across.
      </P>

      <Table
        head={[
          "Customs duty on your HS code",
          "Surcharge adds (as % of CIF)",
          "Effective duty",
        ]}
        rows={[
          ["10%", "5%", "15%"],
          ["15%", "7.5%", "22.5%"],
          ["20%", "10%", "30%"],
          ["25%", "12.5%", "37.5%"],
          ["30%", "15%", "45%"],
        ]}
        caption="The surcharge is 50% of the duty payable. EconomyNext reported the general customs duty on vehicles at approximately 20% when the equivalent surcharge was introduced in January 2025, which is the 30% row. Confirm the rate for your own HS code and capacity band with Sri Lanka Customs before you price a unit."
      />

      <P>
        Two things this table does not tell you, and neither should be guessed
        at. The first is whether excise duty, VAT and the other levies in the
        chain compute on a duty-inclusive base in your case &mdash; if they do,
        the surcharge cascades and the real cost is higher than the row
        suggests. The second is the excise band itself, which in Sri Lanka has
        long stepped by engine capacity and moves far more money than the
        surcharge does. Both are settled per vehicle with Customs, not from a
        table on a website.
      </P>

      <Disclaimer>
        Duty and tax figures here are reported from the cited gazettes and
        press, and were checked on 18 August 2026. Sri Lanka&rsquo;s vehicle tax
        structure has been revised repeatedly and rates vary by HS code,
        capacity band and propulsion type. Confirm the current position with{" "}
        <a
          href="https://www.customs.gov.lk/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          Sri Lanka Customs
        </a>{" "}
        for your specific vehicle before committing capital.
      </Disclaimer>

      <H2 id="the-exemption">The exemption, and the three ways to lose it</H2>

      <P>
        Vehicles imported under Letters of Credit established on or before 15
        May 2026 &mdash; the day before the surcharge originally took effect
        &mdash; are exempt. That exemption is conditional, and the conditions
        are where dealers will get hurt.
      </P>

      <UL>
        <CheckLI>
          <Strong>Amend the LC and you lose it.</Strong> The surcharge applies
          if the original Letter of Credit has been amended as to the number of
          vehicles, the vehicle descriptions, the technical specifications or
          the expiry dates. A routine housekeeping amendment to extend an expiry
          date is enough.
        </CheckLI>
        <CheckLI>
          <Strong>Ship late and you lose it.</Strong> The surcharge applies
          where the shipped-on-board date stated on the bill of lading or airway
          bill falls after 15 November 2026. Not the arrival date, not the
          clearance date &mdash; the date the vessel was loaded.
        </CheckLI>
        <CheckLI>
          <Strong>Open the LC after 15 May 2026 and it never applied.</Strong>{" "}
          Anything ordered since the surcharge came in is inside it and always
          was.
        </CheckLI>
      </UL>

      <H2 id="the-deadline">Why 15 November is closer than it looks</H2>

      <P>
        A shipped-on-board deadline is not an ordering deadline. Working
        backwards from 15 November 2026 with the lead times we actually see:
      </P>

      <StatGrid
        stats={[
          { value: "2–3 wks", label: "Typical sailing, Japan to Colombo" },
          { value: "1–3 wks", label: "Auction to port, source side" },
          { value: "15 Nov", label: "Last shipped-on-board date" },
          { value: "3%", label: "Late-registration fee, per month of CIF" },
          { value: "45%", label: "Late-fee cap, as % of CIF" },
          { value: "90 days", label: "Registration window from CUSDEC" },
        ]}
      />

      <P>
        A car bought at auction in Japan in late September, consolidated,
        cleared for export and loaded, is comfortably inside the window. A car
        bought in late October is not, because the constraint is not the sailing
        &mdash; it is the queue for a sailing. Roll-on roll-off space out of
        Japan tightens in the fourth quarter, and a vessel that slips by a week
        moves your bill of lading past 15 November and reprices the unit.
      </P>

      <P>
        If you are holding a pre-15 May LC with units still unshipped, the
        useful thing to do this week is get a written shipped-on-board estimate
        from your forwarder for each one, and treat anything estimated after 1
        November as at risk rather than safe.
      </P>

      <H2 id="the-other-clock">The clock that costs more than the surcharge</H2>

      <P>
        Dealers focused on the surcharge are watching the smaller number. The
        Imports and Exports (Control) Regulations published in Gazette
        Extraordinary No. 2421/04 impose a registration deadline with teeth.
      </P>

      <P>
        A vehicle imported under those regulations must be registered within{" "}
        <Strong>90 days from the date of the Bill of Entry</Strong> (the Customs
        Declaration, CUSDEC). Miss it and the importer pays a monthly late fee
        of <Strong>3% of the CIF value</Strong>, computed non-compounded and
        linearly, to the Commissioner General of the Department of Motor Traffic
        at the point of registration. The fee is capped at{" "}
        <Strong>45% of CIF</Strong>, which is reached after fifteen months. Any
        part-month of fewer than 30 days counts as a full calendar month, and
        the regulations state that no waiver shall be granted under any
        circumstances.
      </P>

      <P>
        Read that against a surcharge worth roughly 10% of CIF at a 20% duty
        rate and the priority reorders itself. Three months past the 90-day
        deadline &mdash; so roughly six months from clearance &mdash; costs 9%
        of CIF. Five months past it costs 15%. The surcharge is a pricing
        problem; the 90-day clock is a floor-plan problem, and it is the one
        that turns slow-moving stock into a loss.
      </P>

      <Callout title="The trade-off nobody is pricing" tone="amber">
        <p>
          Rushing units onto a vessel before 15 November to save the surcharge
          starts the 90-day registration clock earlier too. If those cars land
          into a market you cannot clear in a quarter, you can save 10% of CIF
          on duty and give back 9% on late fees. Ship early only for stock you
          are confident of registering, and let the genuinely slow
          specifications take the surcharge.
        </p>
      </Callout>

      <H2 id="what-to-do">What dealers should do now</H2>

      <UL>
        <CheckLI>
          <Strong>Audit every open LC against 15 May 2026.</Strong> Sort into
          exempt and non-exempt. Anything exempt goes on a shipping watchlist.
        </CheckLI>
        <CheckLI>
          <Strong>Freeze amendments on exempt LCs.</Strong> Before any change to
          count, description, specification or expiry, price what losing the
          exemption costs against what the amendment achieves.
        </CheckLI>
        <CheckLI>
          <Strong>Get shipped-on-board estimates in writing.</Strong> Anything
          after 1 November is at risk. Book the space now rather than in
          October.
        </CheckLI>
        <CheckLI>
          <Strong>Reprice non-exempt stock properly.</Strong> Add the surcharge
          to the duty line, not to the retail price, and check whether it
          cascades into your excise and VAT base.
        </CheckLI>
        <CheckLI>
          <Strong>Put a 90-day date on every CUSDEC.</Strong> One spreadsheet
          column. It is the cheapest control in the business and it is the one
          most dealers do not have.
        </CheckLI>
        <CheckLI>
          <Strong>Re-check the three-year age rule at purchase.</Strong> Age
          runs from the date of manufacture to the date of the bill of lading,
          so a slipping sailing can age a car out of eligibility as well as out
          of the exemption.
        </CheckLI>
      </UL>

      <P>
        The full mechanics of the registration clock, the importer-registration
        categories and the re-export penalty are set out in our{" "}
        <InlineLink href="/blog/sri-lanka-vehicle-import-rules-for-dealers">
          Sri Lanka import rules guide for dealers
        </InlineLink>
        . For how the duty and excise base is actually built, see{" "}
        <InlineLink href="/blog/sri-lanka-vehicle-import-taxes-explained">
          Sri Lanka vehicle import taxes explained
        </InlineLink>
        , and for the process end to end,{" "}
        <InlineLink href="/blog/importing-a-car-to-sri-lanka">
          importing a car to Sri Lanka
        </InlineLink>
        .
      </P>

      <H2 id="private-buyers">Does this affect private buyers?</H2>

      <P>
        Yes, but less than the headline implies, and possibly not at all if you
        are not buying this year.
      </P>

      <P>
        A private importer buying one car now is inside the surcharge, because
        no private buyer holds an LC dated before 15 May 2026. What you are
        paying is an extra slice of duty &mdash; roughly 10% of CIF at a 20%
        duty rate &mdash; on top of an excise bill that is very probably larger
        than the surcharge and is set by your engine capacity band. If you are
        choosing between two cars, the capacity band will move your total more
        than the surcharge will.
      </P>

      <P>
        There is also a rule most private buyers do not know about. An importer
        not registered with the Department of Motor Traffic as a motor vehicle
        importer may bring in only one vehicle in any twelve-month period,
        measured from the date of the Bill of Entry. If you were planning a
        second car inside a year, that is the constraint to check first.
      </P>

      <ConfirmedLedger
        confirmed={[
          "Gazette Extraordinary No. 2501/88 extends the 50% surcharge on Customs Import Duty for specified motor vehicles from 15 August 2026 to 31 December 2026, issued 13 August 2026 under Section 10A of the Customs Ordinance.",
          "The exemption for LCs established on or before 15 May 2026 is void if the LC is amended as to vehicle count, description, technical specification or expiry date, or if the shipped-on-board date falls after 15 November 2026.",
          "The 90-day registration rule, the 3%-per-month late fee, the 45% of CIF cap, the no-waiver provision and the one-vehicle-per-12-months limit for unregistered importers all appear in the Imports and Exports (Control) Regulations at Gazette Extraordinary No. 2421/04.",
          "Motor cars are admissible at not more than three years old, with age measured from date of manufacture to the date of the bill of lading or airway bill.",
        ]}
        unconfirmed={[
          <>
            <Strong>The current duty rate for any given HS code.</Strong> The
            20% general rate in the table is EconomyNext&rsquo;s reporting from
            January 2025, not a rate we have verified against the 2026 tariff.
          </>,
          <>
            <Strong>Whether the surcharge cascades</Strong> into the excise and
            VAT base. We could not confirm the ordering of the calculation from
            a primary source and have not assumed it either way.
          </>,
          <>
            <Strong>Whether the surcharge lapses on 31 December 2026.</Strong>{" "}
            Nothing on the record says what happens next. It has already been
            extended once.
          </>,
          <>
            <Strong>The Euro 6 emissions requirement.</Strong> It is widely
            reported for 2026 imports but we could not find it in a primary
            gazette or a Sri Lanka Customs publication, so we are not stating it
            as a rule. Confirm the emission standard for your unit before you
            buy it.
          </>,
        ]}
      />

      <H3>The one-line version</H3>

      <P>
        A dealer in Sri Lanka should read this because a bill of lading dated
        after 15 November 2026 reprices every unit still sitting on a pre-15 May
        Letter of Credit.
      </P>

      <Callout title="Sourcing into Colombo?" tone="emerald">
        <p>
          We run our own operation in Sri Lanka and buy at auction in Japan, the
          UK, the UAE, India, Thailand, Australia and New Zealand every week, so
          when one corridor reprices we can quote the same specification out of
          another.{" "}
          <InlineLink href="/request">Send us the specification</InlineLink> and
          we will model duty, excise and the registration clock against your
          actual HS code before you open the credit.
        </p>
      </Callout>
    </>
  );
}
