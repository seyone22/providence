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
import { ConfirmedLedger, PullQuote } from "@/components/news/newsProse";

export default function SriLankaVehicleFinanceLoanToValueCap2026() {
  return (
    <>
      <Lead>
        Sri Lanka reopened vehicle imports and then quietly made them harder to
        pay for. Under directions issued by the Central Bank of Sri Lanka and
        effective <Strong>25 May 2026</Strong>, financing on most motor cars,
        SUVs, vans and three-wheelers is capped at{" "}
        <Strong>40% of the vehicle&rsquo;s value</Strong>, with commercial
        vehicles allowed up to 60%. The tax on the car did not change. The
        deposit did.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Central Bank of Sri Lanka Act Directions{" "}
            <Strong>No. 01 of 2026</Strong>, effective{" "}
            <Strong>25 May 2026</Strong>, cap financing on most passenger
            vehicles at <Strong>40%</Strong> of value.
          </>,
          <>
            Commercial vehicles are reported at a maximum <Strong>60%</Strong>{" "}
            financing ratio.
          </>,
          "The directions apply to licensed commercial banks, licensed specialised banks, licensed finance companies and registered finance leasing establishments.",
          <>
            A 40% cap means the buyer finds{" "}
            <Strong>60% of the value in cash</Strong> &mdash; on a tax-inflated
            Sri Lankan price, that is the binding constraint, not the interest
            rate.
          </>,
          "The stated purpose is protecting foreign reserves from import-led credit expansion, not managing consumer indebtedness.",
        ]}
      />

      <H2 id="what-changed">What the directions do</H2>

      <P>
        Sri Lanka suspended vehicle imports during its foreign-exchange crisis
        and reopened them in stages from February 2025. The reopening created
        exactly the problem the suspension was designed to solve: vehicle
        imports have historically been one of the largest single sources of
        pressure on the country&rsquo;s reserves, and demand returned quickly.
      </P>

      <P>
        Rather than close the door again, the Central Bank has restricted the
        credit that walks through it. Capping the loan-to-value ratio does not
        prohibit anyone from importing a car; it requires them to have most of
        the money already. That is a demand control applied at the financing
        layer instead of the customs layer, and it is considerably less visible
        than a surcharge.
      </P>

      <PullQuote>
        A tax raises the price of the car. A loan-to-value cap raises the price
        of getting to the car. For most buyers the second is the harder wall.
      </PullQuote>

      <H2 id="arithmetic">The arithmetic of a 40% cap</H2>

      <P>
        Sri Lankan retail prices carry one of the heaviest tax loads on any of
        our destination lists. The illustration below holds the vehicle value
        constant and shows only what the financing cap does to the cash a buyer
        must produce. It uses a round LKR 10,000,000 value so the proportions
        are readable; it is not a price for any particular car.
      </P>

      <CostTable
        title="Cash required, at a 40% financing cap"
        subtitle="Illustrative, on an assumed vehicle value of LKR 10,000,000"
        rows={[
          { label: "Assumed vehicle value", value: "LKR 10,000,000" },
          {
            label: "Maximum financed, at 40%",
            value: "LKR 4,000,000",
            green: true,
          },
          { label: "Cash the buyer must find", value: "LKR 6,000,000" },
        ]}
        total={{ label: "Deposit as a share of value", value: "60%" }}
      />

      <P>
        For comparison, a market permitting 80% financing on the same value
        would need LKR 2,000,000 in cash. The cap triples the deposit. That is
        why it works as a demand control, and why it lands hardest on exactly
        the buyer for whom an import was already marginal.
      </P>

      <H2 id="dealer">The dealer read</H2>

      <P>
        A financing cap lands on whoever needs financing, so this change belongs
        to the showroom more than to the individual buyer.
      </P>

      <UL>
        <CheckLI>
          <Strong>Your buyer pool shrank without your price changing.</Strong>{" "}
          The constraint is the customer&rsquo;s cash position, so discounting
          the car moves the required deposit by only 60 cents in the rupee.
        </CheckLI>
        <CheckLI>
          <Strong>Days-to-turn is the number to watch, not margin.</Strong> A
          tighter credit environment lengthens the sale, and a longer sale on
          imported stock is a financing cost you carry rather than one the buyer
          does.
        </CheckLI>
        <CheckLI>
          <Strong>Commercial vehicles sit at a different ratio.</Strong> At a
          reported 60% cap, the effective deposit is 40% rather than 60% &mdash;
          a materially easier sale, and a reason to look again at the commercial
          side of the range.
        </CheckLI>
        <CheckLI>
          <Strong>Stricter valuation rules were introduced alongside.</Strong>{" "}
          The cap applies to a value, and reporting indicates the valuation
          basis for new, used and reconditioned vehicles was tightened at the
          same time. Confirm how your financier is valuing reconditioned stock
          before you commit to a shipment of it.
        </CheckLI>
      </UL>

      <H3 id="applies">Does this apply to you?</H3>

      <Table
        head={["If you are…", "Position"]}
        rows={[
          [
            "A Sri Lankan buyer financing a car, SUV or van",
            "Financing capped at a reported 40% of value from 25 May 2026.",
          ],
          [
            "A Sri Lankan buyer paying cash",
            "Unaffected. The directions govern lenders, not purchases.",
          ],
          [
            "A Sri Lankan dealer selling imported stock",
            "Affected indirectly and materially, through your customers' access to credit.",
          ],
          [
            "Financing a commercial vehicle",
            "A higher reported cap of 60% applies.",
          ],
          [
            "An importer in any other market",
            "No effect. This is a Sri Lankan monetary measure.",
          ],
        ]}
        caption="Positions as reported on Central Bank of Sri Lanka Act Directions No. 01 of 2026. Verify with your lender or the Central Bank before relying on them."
      />

      <ConfirmedLedger
        confirmed={[
          "Directions numbered No. 01 of 2026 under the Central Bank of Sri Lanka Act took effect on 25 May 2026.",
          "Financing on most motor cars, SUVs, vans and three-wheelers is capped at 40% of vehicle value.",
          "The directions bind licensed commercial banks, licensed specialised banks, licensed finance companies and registered finance leasing establishments.",
        ]}
        unconfirmed={[
          "The maximum loan tenure, if any, applied alongside the loan-to-value cap. We could not confirm one.",
          "The precise valuation methodology applied to reconditioned imports, and whether it differs from that for new vehicles.",
          "Whether the caps are time-limited, reviewed on a schedule, or open ended. No sunset date has been confirmed to us.",
          "The treatment of any special quota reserved for zero-emission vehicles under these financing rules.",
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        There is no deadline here, which removes the usual reason to hurry. The
        useful question for a Sri Lankan dealer is whether to commit capital to
        a shipment now or to wait for the credit environment to settle, and the
        honest answer depends on something nobody has published: whether these
        directions are a cycle measure or a standing regime.
      </P>

      <P>
        Until that is clear, the defensible position is smaller, faster
        consignments in specifications that sell without finance, rather than
        deep stock that needs a lending market to clear. That is a duller answer
        than &ldquo;buy now while the rupee holds&rdquo;, and it is the one we
        would give a customer we intend to keep.
      </P>

      <Callout
        title="If the sale needs 60% cash, sell to the buyer who has it"
        tone="amber"
      >
        <p>
          The segment least affected by a loan-to-value cap is the segment that
          was never financed. In practice that means commercial vehicles, fleet
          buyers and the top of the range &mdash; not the volume saloon that
          normally carries a Sri Lankan showroom. Our{" "}
          <InlineLink href="/blog/sri-lanka-vehicle-import-rules-for-dealers">
            dealer rules guide
          </InlineLink>{" "}
          covers the permissions side of the same decision.
        </p>
      </Callout>

      <Disclaimer>
        Financing directions, loan-to-value ratios and valuation rules are set
        by the Central Bank of Sri Lanka and change without notice. The details
        above reflect reporting on Central Bank of Sri Lanka Act Directions No.
        01 of 2026 and were checked on 10 September 2026. We have not read the
        directions in full text. Verify your own position with the Central Bank
        of Sri Lanka or your lender before committing funds.
      </Disclaimer>

      <Callout
        title="Pricing Sri Lankan stock against the tax and the cap?"
        tone="emerald"
      >
        <p>
          We buy in Japan and India every week and quote one landed figure to
          Colombo before you commit. If you want a specific model, year band and
          volume priced,{" "}
          <InlineLink href="/request">send us the specification</InlineLink>.
          Our{" "}
          <InlineLink href="/blog/sri-lanka-vehicle-import-taxes-explained">
            Sri Lanka import taxes guide
          </InlineLink>{" "}
          sets out how the duty stack is built.
        </p>
      </Callout>
    </>
  );
}
