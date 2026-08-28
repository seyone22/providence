import {
  Callout,
  CheckLI,
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

export default function NissanPatrolY63AustraliaPricingConfirmed() {
  return (
    <>
      <Lead>
        Nissan Australia published pricing for the all-new Y63 Patrol on{" "}
        <Strong>27 August 2026</Strong>. Six grades, from{" "}
        <Strong>A$98,990</Strong> for the Ti to <Strong>A$145,990</Strong> for
        the Ti-L Reserve, all before on-road costs. Every one of them uses the
        same 3.5-litre twin-turbo V6 &mdash; 317 kW and 700 Nm &mdash; through a
        nine-speed automatic, with a braked towing capacity of 3,700 kg. Orders
        are open now and first customer deliveries are early 2027. For anyone
        buying outside Australia, the interesting number is not A$98,990. It is
        what is left of that figure once the Australian taxes inside it come
        out.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The Y63 Patrol range opens at <Strong>A$98,990</Strong> (Ti) and
            tops out at <Strong>A$145,990</Strong> (Ti-L Reserve), both MSRP
            before on-road costs, per Nissan Australia&rsquo;s announcement of
            27 August 2026.
          </>,
          <>
            There are <Strong>six grades</Strong>, not four: Ti, Ti+, Ti-L,
            Ti-L+, PRO-4X and Ti-L Reserve. The Ti-L+ and PRO-4X are new names
            in the Australian Patrol range.
          </>,
          <>
            One engine across the range &mdash;{" "}
            <Strong>3.5-litre twin-turbo petrol V6, 317 kW and 700 Nm</Strong>,
            nine-speed automatic, four-wheel drive, and{" "}
            <Strong>3,700 kg braked towing</Strong>.
          </>,
          <>
            An Australian MSRP carries <Strong>10% GST</Strong> inside it and no
            registration costs at all. It is neither a drive-away price nor a
            CIF base, and confusing it with either is the most expensive
            arithmetic error in this market.
          </>,
          <>
            <Strong>
              Nissan Australia has not published fuel consumption or CO&#8322;
              for the Y63.
            </Strong>{" "}
            Until it does, nobody can calculate registration tax in a
            CO&#8322;-banded market such as Ireland &mdash; so nobody should be
            quoting you one.
          </>,
        ]}
      />

      <H2 id="the-prices">What the six grades cost</H2>

      <P>
        The prices below are manufacturer&rsquo;s suggested retail prices from
        Nissan Australia, announced on 27 August 2026, before on-road costs.
        They are the list, not the transaction price, and not what a car costs
        to put on a road anywhere.
      </P>

      <Table
        head={["Grade", "MSRP (A$, before on-road costs)"]}
        rows={[
          ["Ti", "98,990"],
          ["Ti+", "109,480"],
          ["Ti-L", "122,690"],
          ["Ti-L+", "134,690"],
          ["PRO-4X", "137,590"],
          ["Ti-L Reserve", "145,990"],
        ]}
        caption="Source: Nissan Australia, 'Nissan announces pricing and key specifications for all-new Patrol in Australia', 27 August 2026. Prices are MSRP before on-road costs."
      />

      <StatGrid
        stats={[
          { value: "317 kW", label: "3.5-litre twin-turbo V6" },
          { value: "700 Nm", label: "Peak torque" },
          { value: "3,700 kg", label: "Braked towing capacity" },
          { value: "9-speed", label: "Automatic transmission" },
          { value: "A$98,990", label: "Ti, before on-road costs" },
          { value: "Early 2027", label: "First customer deliveries" },
        ]}
      />

      <P>
        Steve Milette, Managing Director of Nissan Oceania, said in the same
        announcement that the range &ldquo;gives Australian customers more
        choice than ever before, with a range that spans family comfort, genuine
        off-road capability and new levels of refinement&rdquo;. Read
        commercially, that is a six-rung ladder replacing a three-rung one, and
        the two new rungs &mdash; Ti-L+ and PRO-4X &mdash; both sit above
        A$134,000.
      </P>

      <H3>What separates the grades</H3>

      <UL>
        <CheckLI>
          <Strong>Ti</Strong> &mdash; dual 12.3-inch displays, 3D Intelligent
          Around View Monitor, NissanConnect with Google built-in, tri-zone
          climate, ProPILOT, 18-inch wheels. The full dual-range
          four-wheel-drive hardware is here, at the bottom of the range.
        </CheckLI>
        <CheckLI>
          <Strong>Ti+</Strong> &mdash; adds the panoramic sunroof, power
          tailgate, privacy glass, roof rails, intelligent rear-view mirror and
          rain-sensing wipers.
        </CheckLI>
        <CheckLI>
          <Strong>Ti-L</Strong> &mdash; dual 14.3-inch displays, 12-speaker
          Klipsch audio, head-up display, e-Damper suspension, 20-inch wheels.
        </CheckLI>
        <CheckLI>
          <Strong>Ti-L+</Strong> &mdash; genuine leather, heated and ventilated
          front seats, massaging driver&rsquo;s seat, heated steering wheel,
          cool box, biometric cooling, ambient lighting.
        </CheckLI>
        <CheckLI>
          <Strong>PRO-4X</Strong> &mdash; adaptive air suspension, black alloys
          on all-terrain tyres, a unique off-road bumper, trailer docking
          support and an electric brake controller. This is the grade the towing
          and touring market will argue about.
        </CheckLI>
        <CheckLI>
          <Strong>Ti-L Reserve</Strong> &mdash; adaptive air suspension, 22-inch
          wheels, dual 12.8-inch rear-seat screens and massage seats for both
          front occupants.
        </CheckLI>
      </UL>

      <H2 id="not-your-cif">A$98,990 is not your landed base</H2>

      <P>
        An Australian MSRP is a domestic retail figure with{" "}
        <Strong>10% GST inside it</Strong> and no registration, stamp duty or
        compulsory third-party insurance in it. Those on-road costs are added
        for an Australian buyer and are irrelevant to an exporter. The GST is
        the part worth understanding.
      </P>

      <P>
        A sale of goods can be GST-free where the supplier exports them within
        60 days of the earlier of payment or invoice, on the Australian Taxation
        Office&rsquo;s conditions and with the ATO&rsquo;s documentary evidence
        of export. Strip 10% out of the Ti&rsquo;s A$98,990 and the figure is{" "}
        <Strong>A$89,991</Strong>; out of the Ti-L Reserve&rsquo;s A$145,990 and
        it is <Strong>A$132,718</Strong>. That is our arithmetic on
        Nissan&rsquo;s published numbers, not a quote.
      </P>

      <Callout title="Where that arithmetic stops being safe" tone="amber">
        <p>
          Australia also levies Luxury Car Tax, and every grade in this range
          sits well above the thresholds at which it has historically applied.
          We have not verified the LCT treatment of an export sale of a Y63
          Patrol against the ATO, so we are not publishing an LCT figure or
          assuming it comes out. Treat the ex-GST numbers above as an
          illustration of the GST step alone, get the dealer&rsquo;s written
          position on both taxes before you commit, and budget for the worse of
          the two answers until it is in writing.
        </p>
      </Callout>

      <P>
        On top of whatever leaves Australia you are adding inland transport to
        port, ocean freight and marine insurance &mdash; usually invoiced in US
        dollars &mdash; and then duty and consumption tax in your own currency,
        converted at your customs authority&rsquo;s published rate. That rate is
        not the rate on your banking app, and in most regimes it is fixed for a
        period rather than tracking spot. Pricing in AUD gives you an AUD
        exposure on the car and a separate destination-currency exposure on the
        tax bill, and the two move independently. If you want to model the whole
        stack for an Irish landing, the{" "}
        <InlineLink href="/ireland-cost-calculator">
          Ireland cost calculator
        </InlineLink>{" "}
        is the place to do it.
      </P>

      <H2 id="co2">The number Nissan has not published yet</H2>

      <P>
        Nissan Australia announced pricing and key specifications without
        publishing ADR fuel consumption or a CO&#8322; figure for the Y63. That
        gap is not a detail. In Ireland, Vehicle Registration Tax is charged as
        a CO&#8322;-banded percentage of Revenue&rsquo;s own valuation, with a
        NOx levy on top &mdash; the mechanism our{" "}
        <InlineLink href="/blog/vrt-explained-ireland">VRT guide</InlineLink>{" "}
        sets out in full. Without a CO&#8322; figure on a Certificate of
        Conformity, the band is unknown, and so is the tax.
      </P>

      <P>
        Chasing Cars, extrapolating from United States data rather than from an
        Australian Design Rules test, puts the likely consumption at around 12.7
        L/100 km and CO&#8322; at roughly 290 g/km, and states plainly that
        Nissan has not announced consumption and emissions. We are repeating
        those figures as someone else&rsquo;s estimate and we would not budget a
        tax bill from them. A large petrol V6 will land in the top CO&#8322;
        band in every regime that has one; exactly how much that costs depends
        on a number nobody has published.
      </P>

      <PullQuote>
        A missing CO&#8322; figure is not a small gap on a car like this. In a
        CO&#8322;-banded market it is the difference between a quote and a
        guess.
      </PullQuote>

      <H2 id="corridors">Which corridor this car comes out of</H2>

      <P>
        The Y63 is already on sale in the Middle East and in North America,
        where it wears the Armada badge. Australia is one of the first
        right-hand-drive markets to get it, with deliveries from early 2027.
        Nissan New Zealand has confirmed a first-quarter 2027 arrival and has
        opened registrations of interest, but had not published New Zealand
        pricing or grades as at 28 August 2026. Japan gets the Patrol in the
        first half of fiscal 2027 &mdash; April to September 2027 on
        Japan&rsquo;s fiscal calendar &mdash; which returns Nissan to the
        large-SUV segment at home, last contested by the Safari until production
        ended in 2007.
      </P>

      <P>
        For a buyer in Kenya, Mauritius, Hong Kong or the Caribbean, that
        sequence is the whole story: for most of 2027 the realistic
        right-hand-drive sources are Australia and, later, Japan, while the Gulf
        cars are left-hand drive. We have set out the full corridor map, and
        what each one does to freight and lead time, in{" "}
        <InlineLink href="/latest-news/nissan-patrol-y63-right-hand-drive-markets">
          our piece on which markets get the Y63 and when
        </InlineLink>
        .
      </P>

      <H2 id="admissibility">Can you actually register one?</H2>

      <P>
        In right-hand-drive markets that accept Australian-specification
        vehicles, yes &mdash; and because this is a new car, the age limits that
        govern used imports in Kenya, Sri Lanka and elsewhere do not bite.
        Verify the current rule with the destination authority rather than with
        us: the Kenya Bureau of Standards and the Kenya Revenue Authority for
        Kenya, NZTA for New Zealand, the national customs authority for the
        Caribbean markets.
      </P>

      <P>
        Europe is the harder case, and the honest answer is unattractive. The
        Patrol is not sold new in Ireland or the United Kingdom, so there is no
        EU or UK type approval to inherit. Registering one means individual
        approval &mdash; in Ireland an NSAI Individual Vehicle Approval,
        assessed against Irish legislation and inspected at an approved test
        centre; Revenue will not register a new vehicle without a valid
        Certificate of Conformity, an EU IVA or an Irish national IVA. That is a
        real process with a real failure rate, on top of a top-band CO&#8322;
        charge on a car whose CO&#8322; figure has not been published.
      </P>

      <H2 id="timing">Order now or wait?</H2>

      <P>Three different answers, depending on who is asking.</P>

      <UL>
        <CheckLI>
          <Strong>Australian buyers:</Strong> order books are open now and
          deliveries start early 2027. Y62 V8 production was due to conclude in
          August 2026, with final shipments reaching Australia by September, so
          the run-out stock that was listed at A$95,500 for the Ti in June 2026
          is finite and shrinking.
        </CheckLI>
        <CheckLI>
          <Strong>New Zealand buyers:</Strong> wait. Registering interest costs
          nothing, but committing to a grade before Nissan New Zealand publishes
          local pricing and specification means committing to an Australian
          ladder that may not be the one you are offered.
        </CheckLI>
        <CheckLI>
          <Strong>Irish and UK buyers:</Strong> wait, and possibly wait
          permanently. Until there is a published CO&#8322; figure and a settled
          individual-approval path, a quote for this car in either market is a
          guess with a decimal point.
        </CheckLI>
      </UL>

      <ConfirmedLedger
        confirmed={[
          <>
            Six grades and their MSRPs &mdash; Ti A$98,990, Ti+ A$109,480, Ti-L
            A$122,690, Ti-L+ A$134,690, PRO-4X A$137,590, Ti-L Reserve
            A$145,990, all before on-road costs &mdash; announced by Nissan
            Australia on 27 August 2026.
          </>,
          <>
            The 3.5-litre twin-turbo V6 with 317 kW and 700 Nm, the nine-speed
            automatic and the 3,700 kg braked towing capacity, from the same
            Nissan Australia announcement.
          </>,
          "Orders open from 27 August 2026, first Australian customer deliveries early 2027, and a New Zealand arrival confirmed by Nissan New Zealand for the first quarter of 2027.",
        ]}
        unconfirmed={[
          <>
            <Strong>Fuel consumption and CO&#8322;.</Strong> Nissan Australia
            has published neither. The 12.7 L/100 km and 290 g/km figures in
            circulation are Chasing Cars&rsquo; extrapolation from United States
            data, not an ADR result.
          </>,
          <>
            <Strong>The size of the increase over the Y62.</Strong> Nissan puts
            the Ti at A$2,450 above the outgoing car. The Y62 Ti was listed at
            A$95,500 in June 2026, which would make the step A$3,490 against
            that list. We cannot reconcile the two from published sources, so we
            report Nissan&rsquo;s figure and flag the discrepancy rather than
            picking one.
          </>,
          <>
            <Strong>Luxury Car Tax on an export sale.</Strong> Not verified
            against the ATO for this model, and not assumed away in any figure
            above.
          </>,
          <>
            <Strong>New Zealand pricing and grades.</Strong> Not published as at
            28 August 2026.
          </>,
        ]}
      />

      <H3>The one-line version</H3>

      <P>
        A private importer or dealer in a right-hand-drive market should read
        this because Australian Y63 Patrol pricing is now fixed, which makes the
        first quarter of 2027 the earliest date any of them can land one.
      </P>

      <Callout title="Working out what a Y63 lands at" tone="emerald">
        <p>
          Our{" "}
          <InlineLink href="/b2c/gallery/nissan-patrol-y63">
            Nissan Patrol Y63 page
          </InlineLink>{" "}
          carries the grade ladder and the factory colours, so you can register
          a specification rather than a general enquiry. If the destination
          matters more than the grade,{" "}
          <InlineLink href="/request">
            tell us where the car is going
          </InlineLink>{" "}
          and we will model the landed figure once the CO&#8322; and approval
          positions are settled &mdash; and tell you if the answer is that it
          does not work.
        </p>
      </Callout>
    </>
  );
}
