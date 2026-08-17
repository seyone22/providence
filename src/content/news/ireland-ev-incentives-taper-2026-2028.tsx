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
import { PullQuote, Timeline } from "@/components/news/newsProse";

export default function IrelandEvIncentivesTaper20262028() {
  return (
    <>
      <Lead>
        Ireland&rsquo;s electric vehicle incentives were always described as
        temporary. They are now, visibly, temporary. The &euro;5,000 VRT relief
        has a legislated end date of <Strong>31 December 2026</Strong>, and the
        benefit-in-kind relief that has softened company car tax since 2023
        halves in 2027 and halves again in 2028. If an EV is in your plans, the
        calendar has become part of the specification.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            VRT relief of up to <Strong>&euro;5,000</Strong> for new EVs with an
            OMSP under &euro;40,000 now runs to{" "}
            <Strong>31 December 2026</Strong> &mdash; extended by one year from
            its previous 2025 expiry.
          </>,
          <>
            The universal BIK reduction to original market value stays at{" "}
            <Strong>&euro;10,000 for 2026</Strong>, then{" "}
            <Strong>&euro;5,000 for 2027</Strong> and{" "}
            <Strong>&euro;2,500 for 2028</Strong>.
          </>,
          <>
            From 1 January 2026 zero-emission company cars sit in{" "}
            <Strong>BIK Category A1</Strong>, charged at 6&ndash;15% of OMV
            depending on business mileage.
          </>,
          <>
            The BIK taper ends entirely on <Strong>31 December 2028</Strong>.
          </>,
          <>
            None of this changes how VRT is assessed &mdash; Revenue still
            values the car on its own OMSP, not on what you paid.
          </>,
        ]}
      />

      <H2 id="headline">What is changing</H2>

      <P>
        Two separate reliefs are moving on two separate timetables, and they are
        frequently confused. One is a <Strong>registration</Strong> relief that
        reduces the VRT payable when a qualifying EV is first registered in the
        State. The other is an <Strong>employment</Strong> relief that reduces
        the taxable benefit on a company car. You can be affected by one, both,
        or neither.
      </P>

      <StatGrid
        stats={[
          { value: "€5,000", label: "Max VRT relief, to end-2026" },
          { value: "€40,000", label: "OMSP ceiling for the relief" },
          { value: "€2,500", label: "BIK OMV reduction by 2028" },
        ]}
      />

      <H2 id="vrt">The VRT relief and its end date</H2>

      <P>
        Electric vehicles in Ireland benefit from VRT relief of up to{" "}
        <Strong>&euro;5,000</Strong>, available on new EVs with an open market
        selling price below <Strong>&euro;40,000</Strong>. That relief was due
        to expire on 31 December 2025 and has been extended by one year, to{" "}
        <Strong>31 December 2026</Strong>.
      </P>

      <P>
        It has been extended before, so a further extension in a future budget
        is entirely possible. But nothing beyond 31 December 2026 is currently
        legislated, and planning a purchase on the assumption that a relief will
        be renewed is a decision, not a forecast.
      </P>

      <Callout title="The OMSP trap" tone="amber">
        <p>
          The &euro;40,000 ceiling is measured on the{" "}
          <Strong>open market selling price Revenue determines</Strong>, not on
          the invoice you hold. A car you bought abroad for the equivalent of
          &euro;37,000 can be assessed above the threshold and lose the relief
          entirely. Check the OMSP before you commit, not after the car lands.
        </p>
      </Callout>

      <H2 id="bik">The BIK taper</H2>

      <P>
        From 1 January 2026, zero-emission company cars fall into{" "}
        <Strong>Category A1</Strong> for benefit-in-kind, with the charge
        running from <Strong>6% to 15%</Strong> of original market value
        depending on annual business mileage &mdash; higher business mileage,
        lower percentage.
      </P>

      <P>
        Sitting on top of that is the temporary universal reduction to OMV,
        which applies to cars in categories A&ndash;D and to all vans. It is
        being extended on a tapered basis for three further years of assessment:
      </P>

      <Table
        head={["Year of assessment", "OMV reduction", "Change"]}
        rows={[
          ["2026", "€10,000", "Unchanged"],
          ["2027", "€5,000", "Halved"],
          ["2028", "€2,500", "Halved again"],
          ["2029 onwards", "€0", "Relief ends 31 December 2028"],
        ]}
        caption="The universal OMV reduction applies to categories A–D and all vans, not to EVs alone."
      />

      <Timeline
        items={[
          {
            time: "1 January 2026",
            title: "EVs move to BIK Category A1",
            body: (
              <>
                Zero-emission company cars charged at 6&ndash;15% of OMV by
                business mileage band. The &euro;10,000 OMV reduction continues.
              </>
            ),
          },
          {
            time: "31 December 2026",
            title: "VRT relief expires",
            body: (
              <>
                The up-to-&euro;5,000 relief for qualifying new EVs ends unless
                extended again in a future budget.
              </>
            ),
          },
          {
            time: "2027",
            title: "OMV reduction halves",
            body: <>Down to &euro;5,000, raising the taxable benefit.</>,
          },
          {
            time: "2028",
            title: "OMV reduction halves again",
            body: <>Down to &euro;2,500, its final year.</>,
          },
          {
            time: "31 December 2028",
            title: "Taper complete",
            body: (
              <>
                The temporary reduction ends and BIK is charged on full original
                market value.
              </>
            ),
          },
        ]}
      />

      <H2 id="worked">What it costs in practice</H2>

      <P>
        The direction of travel is easier to see with a single illustrative car
        held constant across the three years. Take a zero-emission company car
        with an original market value of &euro;45,000 and a driver in a mileage
        band attracting a 12% Category A1 rate.
      </P>

      <Table
        head={[
          "Year",
          "OMV",
          "Less reduction",
          "Chargeable OMV",
          "Benefit at 12%",
        ]}
        rows={[
          ["2026", "€45,000", "€10,000", "€35,000", "€4,200"],
          ["2027", "€45,000", "€5,000", "€40,000", "€4,800"],
          ["2028", "€45,000", "€2,500", "€42,500", "€5,100"],
          ["2029", "€45,000", "—", "€45,000", "€5,400"],
        ]}
        caption="Illustrative only. Assumes a constant 12% Category A1 rate and no change to OMV. The taxable benefit shown is before income tax, USC and PRSI."
      />

      <PullQuote>
        Same car, same driver, same job. A 29% larger taxable benefit by 2029.
      </PullQuote>

      <P>
        The absolute numbers are modest; the trajectory is the point. An
        employer running a fleet on a four-year replacement cycle is signing up
        today for a cost base that rises every year of the contract without the
        car changing at all.
      </P>

      <H2 id="timing">What this does to timing</H2>

      <UL>
        <CheckLI>
          <Strong>If you want the VRT relief, the deadline is real.</Strong>{" "}
          Registration &mdash; not order, not shipping &mdash; must happen by 31
          December 2026. Sea freight from our Asian and Australasian source
          markets typically runs to several weeks before you even reach the
          registration queue, so a Q4 order is already tight.
        </CheckLI>
        <CheckLI>
          <Strong>Used EV imports need their own calculation.</Strong> The
          headline relief is framed around new electric vehicles under an
          &euro;40,000 OMSP. A used import is assessed on the OMSP Revenue sets
          for that specific vehicle, so the answer is car-by-car rather than
          rule-of-thumb.
        </CheckLI>
        <CheckLI>
          <Strong>Company car decisions should be modelled to 2029.</Strong>{" "}
          Comparing an EV against a petrol alternative on 2026 BIK alone
          flatters the EV by roughly the value of a relief that is scheduled to
          disappear.
        </CheckLI>
        <CheckLI>
          <Strong>Budget announcements can move all of this.</Strong> Both
          reliefs have already been extended or reshaped once. Treat the dates
          above as the current legislated position, not a permanent one.
        </CheckLI>
      </UL>

      <H3>The wider context</H3>

      <P>
        Ireland is not unusual here. Across Europe, EV incentives introduced to
        seed adoption are being withdrawn as adoption becomes self-sustaining
        and as the exchequer notices the foregone revenue. The UK is running the
        same process through a different mechanism &mdash; its{" "}
        <InlineLink href="/latest-news/uk-zev-mandate-review-2026-consultation">
          ZEV mandate review
        </InlineLink>{" "}
        shifts the obligation onto manufacturers rather than subsidising buyers.
        The end state in both cases is an EV market standing on its own
        economics.
      </P>

      <Disclaimer />

      <Callout title="Working out whether the numbers stack up?" tone="emerald">
        <p>
          Our{" "}
          <InlineLink href="/ireland-cost-calculator">
            Ireland import cost calculator
          </InlineLink>{" "}
          produces a full landed figure &mdash; purchase, shipping, duty, VAT
          and VRT &mdash; and{" "}
          <InlineLink href="/blog/vrt-explained-ireland">
            our VRT guide
          </InlineLink>{" "}
          explains how Revenue actually assesses the charge. If you want it
          checked against a specific car,{" "}
          <InlineLink href="/request">send us the details</InlineLink>.
        </p>
      </Callout>
    </>
  );
}
