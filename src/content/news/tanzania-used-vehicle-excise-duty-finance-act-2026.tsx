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
import { PullQuote } from "@/components/news/newsProse";

export default function TanzaniaUsedVehicleExciseDutyFinanceAct2026() {
  return (
    <>
      <Lead>
        Tanzania&rsquo;s Finance Act 2026 took effect on{" "}
        <Strong>1 July 2026</Strong> and it re-drew the excise duty bands on
        imported used vehicles. Cars aged eight to ten years now attract{" "}
        <Strong>18%</Strong>, cut from the 20% originally proposed in the
        Finance Bill. Ten to twenty years stays at <Strong>35%</Strong>, over
        twenty years at <Strong>40%</Strong>. And a band that used to pay
        nothing now pays something: vehicles up to 1,000cc pick up a{" "}
        <Strong>5%</Strong> excise duty for the first time.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Used vehicles aged <Strong>8 to 10 years</Strong> attract{" "}
            <Strong>18% excise duty</Strong> &mdash; Parliament amended this
            down from the 20% in the Finance Bill.
          </>,
          <>
            Vehicles aged <Strong>10 to 20 years</Strong> continue at{" "}
            <Strong>35%</Strong>; those over <Strong>20 years</Strong> at{" "}
            <Strong>40%</Strong>.
          </>,
          <>
            Vehicles not exceeding <Strong>1,000cc</Strong>, previously exempt,
            now attract <Strong>5% excise duty</Strong>.
          </>,
          <>
            The measures took effect <Strong>1 July 2026</Strong>, with the Act
            assented to on 30 June 2026.
          </>,
          "Excise sits on top of import duty and VAT, so a change in the excise band moves more than the excise line.",
        ]}
      />

      <H2 id="bands">The bands as enacted</H2>

      <Table
        head={["Vehicle age at import", "Excise duty", "Change"]}
        rows={[
          ["Up to 8 years", "Per the applicable schedule", "See note below"],
          ["8 to 10 years", "18%", "Enacted at 18%, down from 20% proposed"],
          ["10 to 20 years", "35%", "Unchanged"],
          ["Over 20 years", "40%", "Unchanged"],
          ["Not exceeding 1,000cc", "5%", "New. Previously exempt"],
        ]}
        caption="Rates as reported on enactment of the Finance Act 2026, effective 1 July 2026. Verify the applicable band for your specific vehicle with the Tanzania Revenue Authority before importing."
      />

      <P>
        We have deliberately not filled the first row with a number. Tanzania
        has historically treated newer vehicles differently from the aged bands
        above, and we could not verify the current rate for that band against a
        primary Tanzania Revenue Authority schedule at the time of writing. A
        missing rate is safer than a wrong one, and the authority is the place
        to get it.
      </P>

      <PullQuote>
        Parliament cut the 8&ndash;10 year band from 20% to 18%. That is a
        two-point win nobody campaigned loudly for and it is worth real money on
        the corridor Tanzania actually buys in.
      </PullQuote>

      <H2 id="landed">What it does to a landed number</H2>

      <P>
        Excise duty in Tanzania, like customs duty, is charged on a value the
        revenue authority determines, and it stacks with import duty before VAT
        is applied. The consequence is that a percentage-point change in excise
        does not simply add that percentage to the price &mdash; it moves the
        base that VAT is then charged on as well.
      </P>

      <P>
        The illustration below shows the shape of the two-point amendment on the
        excise line alone. It is not a full landed cost, and it does not carry
        Tanzanian import duty or VAT rates, because those need verifying against
        the Tanzania Revenue Authority for the specific tariff line rather than
        being estimated here.
      </P>

      <CostTable
        title="The 8–10 year band, as proposed and as enacted"
        subtitle="Illustrative, on an assumed dutiable value of US$8,000"
        rows={[
          { label: "Assumed dutiable value", value: "$8,000" },
          { label: "Excise at 20%, as proposed in the Bill", value: "$1,600" },
          {
            label: "Excise at 18%, as enacted",
            value: "$1,440",
            green: true,
          },
        ]}
        total={{ label: "Saved per unit, excise line only", value: "−$160" }}
      />

      <P>
        On one car that is modest. On a twenty-unit consignment it is US$3,200
        before the VAT compounding is counted, which is roughly the freight on
        two more cars.
      </P>

      <H2 id="1000cc">The small-engine change is the one to watch</H2>

      <P>
        Moving vehicles up to 1,000cc from exempt to 5% is a small percentage
        applied to the segment with the least headroom. A sub-1,000cc car is
        bought precisely because the buyer is at the edge of what they can
        afford, so a new charge lands harder there than a two-point cut helps
        further up the range.
      </P>

      <P>
        It also changes the shape of what makes sense to ship. If the small
        engine no longer carries an exemption, the calculation against a 1.3 or
        1.5-litre car with better residuals and a deeper parts network narrows.
        That is a dealer question about which specification to commit capital
        to, and it deserves rerunning rather than assuming last year&rsquo;s
        answer holds.
      </P>

      <H2 id="applies">Does this apply to you?</H2>

      <P>
        It applies if you are importing a used vehicle into Tanzania, whether as
        a private buyer or a dealer. It does not apply to Kenya, Uganda,
        Zimbabwe or any other market in the region &mdash; East African
        neighbours share a customs union but not their excise schedules, and
        assuming otherwise is a common and expensive mistake.
      </P>

      <UL>
        <CheckLI>
          <Strong>The age band is measured at import, not at purchase.</Strong>{" "}
          A car that is seven years and ten months when you bid may be eight
          years when it clears. Sea freight from Japan to Dar es Salaam is not
          instant, and the band boundary does not wait for you.
        </CheckLI>
        <CheckLI>
          <Strong>The band boundaries are worth more than the rates.</Strong>{" "}
          Moving from just under ten years to just over ten years takes the
          excise from 18% to 35%. That single boundary is worth more than every
          negotiation you will have on the hammer price.
        </CheckLI>
        <CheckLI>
          <Strong>Check the assessed value, not the invoice.</Strong> Excise
          applies to the authority&rsquo;s determination. A keen purchase does
          not proportionally reduce the tax.
        </CheckLI>
      </UL>

      <Callout title="The boundary is the strategy" tone="amber">
        <p>
          If you are buying into Tanzania at the edge of the ten-year line, the
          shipping schedule is part of the tax plan. Work backwards from the
          date the vehicle crosses ten years from manufacture, subtract the
          voyage, subtract the clearance queue, and only then decide what you
          are allowed to bid on. Our{" "}
          <InlineLink href="/blog/japan-car-export-documents-explained">
            Japan export documents guide
          </InlineLink>{" "}
          explains which document carries the manufacture date the authority
          will read.
        </p>
      </Callout>

      <H3>Is your car still legal to import?</H3>

      <P>
        Nothing in the Finance Act 2026 as reported changes admissibility. There
        is no new age bar, and vehicles over twenty years remain importable at
        the 40% band rather than prohibited. What changed is what they cost, not
        whether they may come.
      </P>

      <H2 id="timing">Move now or wait?</H2>

      <P>
        The measures are already in force, so there is no deadline to beat. The
        useful timing question is about the individual car rather than the
        policy: if the vehicle you want is approaching a band boundary, moving
        sooner is worth a great deal; if it sits comfortably inside a band,
        Tanzanian tax is not a reason to hurry.
      </P>

      <P>
        The thing that should be moving your timing this quarter is the
        currency. The yen&rsquo;s reversal since late July has taken a slice out
        of the discount Japanese stock has carried all year, and that is a
        larger swing on most Tanzanian imports than the two points Parliament
        gave back on excise.
      </P>

      <Disclaimer>
        Excise duty, import duty, VAT and valuation rules are set by the
        Government of the United Republic of Tanzania and change without notice.
        The rates above reflect reporting on the enactment of the Finance Act
        2026 and were checked on 10 September 2026. Verify your own position
        with the Tanzania Revenue Authority or a licensed clearing agent before
        committing funds.
      </Disclaimer>

      <Callout title="Pricing a Dar es Salaam consignment?" tone="emerald">
        <p>
          We buy at auction in Japan every week, inspect before your money
          moves, and quote one landed figure to your port with clearance support
          at destination. Send us the specification, the year band and the
          volume and we will build the number &mdash;{" "}
          <InlineLink href="/request">start here</InlineLink>. Our{" "}
          <InlineLink href="/blog/how-to-buy-a-car-at-japanese-auction">
            guide to buying at Japanese auction
          </InlineLink>{" "}
          explains how the halls actually work.
        </p>
      </Callout>
    </>
  );
}
