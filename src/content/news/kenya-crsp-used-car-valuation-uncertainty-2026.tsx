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
import { ConfirmedLedger, PullQuote } from "@/components/news/newsProse";

export default function KenyaCrspUsedCarValuationUncertainty2026() {
  return (
    <>
      <Lead>
        In Kenya the tax on an imported car is not calculated on what you paid
        for it. It is calculated on a published schedule of Current Retail
        Selling Prices, depreciated by age. That schedule was revised for the
        first time since 2019, the revision was challenged in the High Court for
        want of public participation, and implementation was suspended. We could
        not establish, from any source we would publish, which schedule is
        operative today. That is the story, and it is not a comfortable one.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The Kenya Revenue Authority calculates the customs value of a used
            motor vehicle by <Strong>applying depreciation to the CRSP</Strong>,
            based on years since manufacture or first registration.
          </>,
          <>
            A revised CRSP schedule was notified on <Strong>30 May 2025</Strong>{" "}
            for application from <Strong>1 July 2025</Strong> &mdash; the first
            update since 2019.
          </>,
          <>
            The High Court suspended implementation following a petition by the
            Car Importers Association of Kenya alleging inadequate{" "}
            <Strong>public participation</Strong>.
          </>,
          <>
            We could not confirm a final judgment or which schedule is currently
            being applied.{" "}
            <Strong>We are publishing that gap rather than filling it.</Strong>
          </>,
          <>
            The Central Bank of Kenya&rsquo;s mean rate on 9 September 2026 was{" "}
            <Strong>KSh 129.43</Strong> to the US dollar &mdash; a currency that
            has been unusually stable.
          </>,
        ]}
      />

      <H2 id="mechanism">How the Kenyan tax base actually works</H2>

      <P>
        This is the part every Kenyan importer needs to understand before any
        rate discussion becomes meaningful.
      </P>

      <P>
        The Current Retail Selling Price is the benchmark retail price of a
        brand-new vehicle of that model in Kenya. The Kenya Revenue Authority
        takes that figure and applies depreciation according to the
        vehicle&rsquo;s age, and the result is the customs value on which duty,
        excise and VAT are assessed.
      </P>

      <PullQuote>
        Your invoice is not the tax base. A cheap purchase does not
        proportionally reduce the bill.
      </PullQuote>

      <P>
        Which produces the single most important consequence in Kenyan
        importing: negotiating hard at auction improves your margin, and it does
        very little to your tax. Two identical cars bought at wildly different
        prices attract broadly the same assessment, because the assessment is
        derived from a schedule rather than from a receipt.
      </P>

      <H2 id="the-revision">The revision, and the challenge</H2>

      <P>
        On 30 May 2025 the Kenya Revenue Authority published a public notice
        stating that a new CRSP schedule would be applied from 1 July 2025, with
        the updated list published on its website. A follow-up press release on
        6 June 2025 set out the Authority&rsquo;s reasoning: the revision was
        the first since 2019 and had been developed through stakeholder
        consultation.
      </P>

      <P>
        In that release the Authority explained why values had moved by
        reference to changes since 2019 &mdash; import duty on the relevant
        category having risen from 25% to 35%, a maximum excise of 30% in 2019
        with some units subsequently at 35%, and an exchange rate that had moved
        from roughly 100 shillings to the dollar to roughly 130. We are
        reporting that as the Authority&rsquo;s stated reasoning for the
        revision. It is not a current rate schedule and should not be used as
        one.
      </P>

      <P>
        The Car Importers Association of Kenya challenged the revision in the
        High Court, arguing that the new CRSP list was introduced without
        meaningful public participation in violation of the Constitution and the
        Fair Administrative Action Act. The court suspended implementation
        pending hearing and determination.
      </P>

      <H2 id="unknown">What we could not establish</H2>

      <P>
        We looked for a final judgment and for an authoritative statement of
        which schedule is currently operative. We did not find either from a
        source we are willing to publish. Reporting circulates suggesting the
        older schedule remains in use under a court order; we could not verify
        it, and we are not going to repeat it as fact.
      </P>

      <ConfirmedLedger
        confirmed={[
          "KRA calculates customs value on a used motor vehicle by applying depreciation to the CRSP, based on years since manufacture or first registration.",
          <>
            KRA&rsquo;s public notice of 30 May 2025 announced a new CRSP
            schedule effective 1 July 2025, the first revision since 2019.
          </>,
          "The revision was challenged in the High Court on public participation grounds by the Car Importers Association of Kenya, and implementation was suspended.",
          "Central Bank of Kenya mean rate on 9 September 2026: KSh 129.43 to the US dollar.",
        ]}
        unconfirmed={[
          "Which CRSP schedule is being applied to imports clearing today. We could not confirm this and are not guessing.",
          "Whether the litigation has concluded, and on what terms.",
          <>
            The current import duty, excise and VAT rates applicable to used
            motor vehicles. The figures in KRA&rsquo;s 2025 release are its
            explanation of the revision, not a schedule we are republishing as
            live.
          </>,
          <>
            The depreciation percentages applied by year of age. KRA&rsquo;s
            published clarification describes the method without setting out the
            schedule.
          </>,
        ]}
      />

      <Callout
        title="Why we are publishing a gap instead of a number"
        tone="amber"
      >
        <p>
          It would be straightforward to produce a plausible Kenyan duty
          calculation and present it confidently. Plenty of sites do. A wrong
          tax figure on a vehicle someone is about to buy is worse than no
          figure at all, because a reader can act on it. The Kenya Revenue
          Authority is the authority here, and a licensed clearing agent working
          from the operative schedule is the only reliable route to a number.
        </p>
      </Callout>

      <H2 id="what-to-do">What a Kenyan importer should actually do</H2>

      <UL>
        <CheckLI>
          <Strong>Get the assessment before you bid, not after.</Strong> Ask
          your clearing agent to run the specific make, model, year and engine
          capacity against the schedule currently in use and to tell you which
          schedule they used.
        </CheckLI>
        <CheckLI>
          <Strong>Treat any quoted landed figure as conditional.</Strong> Until
          the position settles, a quotation should say which valuation basis it
          assumes. One that does not is hiding the largest variable in the deal.
        </CheckLI>
        <CheckLI>
          <Strong>Watch the eight-year rule separately.</Strong> Kenya&rsquo;s
          age limit is a permission question and is governed independently of
          valuation. Confirm it for your vehicle&rsquo;s year of manufacture
          before anything else.
        </CheckLI>
        <CheckLI>
          <Strong>
            Do not let a negotiation on price stand in for tax planning.
          </Strong>{" "}
          The schedule does not care what you paid. Choosing the right model,
          year and engine capacity is where the tax outcome is decided.
        </CheckLI>
      </UL>

      <H3>The currency, at least, is not the problem</H3>

      <StatGrid
        stats={[
          { value: "KSh 129.43", label: "CBK mean rate to USD, 9 Sept 2026" },
          { value: "KSh 175.44", label: "To sterling, same date" },
          { value: "KSh 150.50", label: "To the euro, same date" },
        ]}
      />

      <P>
        The shilling has traded close to 129 to the dollar for well over a year.
        For a Kenyan importer that removes one variable from an otherwise
        uncertain picture: your destination-side currency exposure has been
        close to flat, so the source currency and the valuation schedule are the
        two things actually moving your landed cost. We cover the
        destination-currency mechanics in more detail in our{" "}
        <InlineLink href="/latest-news/destination-currency-customs-exchange-rate-car-import">
          guide to which side of the trade your currency sits on
        </InlineLink>
        .
      </P>

      <H2 id="applies">Does this apply to you?</H2>

      <Table
        head={["If you are…", "Position"]}
        rows={[
          [
            "Importing a used vehicle into Kenya",
            "Directly affected. Your tax base is the unresolved item.",
          ],
          [
            "A Kenyan dealer pricing forward orders",
            "Materially affected. Price with a stated valuation assumption or you are quoting a guess.",
          ],
          [
            "Importing into Uganda or Tanzania",
            "Not affected. Each has its own valuation and excise regime.",
          ],
          [
            "Buying a car already registered in Kenya",
            "Not affected. CRSP applies at import.",
          ],
        ]}
        caption="Confirm your own position with the Kenya Revenue Authority or a licensed clearing agent."
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        The honest answer is that we cannot tell you, because the direction of
        the unresolved item is unknown. If the revised schedule is ultimately
        upheld, importers who moved early under the older basis will have done
        well. If it is quashed, waiting cost nothing. Anyone offering you
        confidence about which way that lands is offering you a guess with a
        salesman attached.
      </P>

      <P>
        What is defensible is to keep the exposure short. Smaller consignments,
        firmer clearing timelines and quotations that state their valuation
        assumption in writing are all ways of not being the person holding
        twenty units when the schedule changes underneath them.
      </P>

      <Disclaimer>
        Customs valuation, duty, excise and VAT on imported vehicles are set and
        administered by the Kenya Revenue Authority and may be altered by
        legislation or court order without notice. Details above reflect
        KRA&rsquo;s published notices of 30 May and 6 June 2025 and reporting of
        the subsequent litigation, checked on 10 September 2026. Verify your own
        position with the Kenya Revenue Authority or a licensed clearing agent
        before committing funds.
      </Disclaimer>

      <Callout
        title="Want the Japanese side priced while the Kenyan side settles?"
        tone="emerald"
      >
        <p>
          We buy at Japanese auction every week, send you the auction sheet and
          the inspection before your money moves, and quote the source-side and
          freight legs precisely even where a destination tax base is unsettled.
          Send us the specification:{" "}
          <InlineLink href="/request">start here</InlineLink>. Our{" "}
          <InlineLink href="/blog/japanese-auction-grades-explained">
            auction grades guide
          </InlineLink>{" "}
          explains what the sheet actually certifies.
        </p>
      </Callout>
    </>
  );
}
