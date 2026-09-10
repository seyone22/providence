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
import {
  ConfirmedLedger,
  PullQuote,
  Timeline,
} from "@/components/news/newsProse";

export default function NewZealandCleanCarStandard2026UsedImportCharges() {
  return (
    <>
      <Lead>
        New Zealand has done the thing importers most wanted and least expected:
        it kept the Clean Car Standard, and it cut the charge. Used imports over
        the CO<sub>2</sub> target now attract <Strong>NZ$7.50 per gram</Strong>,
        down from NZ$33.75, with new vehicles at NZ$15 rather than NZ$67.50. On
        21 August 2026 the Government confirmed the scheme survives &mdash; with
        new targets, differentiated between used and new imports, from{" "}
        <Strong>1 January 2028</Strong>.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Used imported vehicles over target are charged{" "}
            <Strong>NZ$7.50 per gram</Strong> of CO<sub>2</sub>, reduced from
            NZ$33.75 with effect from 1 January 2026.
          </>,
          <>
            New vehicles are charged <Strong>NZ$15 per gram</Strong>, reduced
            from NZ$67.50.
          </>,
          <>
            On <Strong>21 August 2026</Strong> the Government confirmed it will
            retain the standard rather than scrap it.
          </>,
          <>
            New settings will be developed with the industry, take effect{" "}
            <Strong>1 January 2028</Strong>, and will set{" "}
            <Strong>different targets for used and new imports</Strong>.
            Officials report back in early 2027.
          </>,
          <>
            Transport Minister Chris Bishop estimated the reduced rates avoid{" "}
            <Strong>NZ$264 million</Strong> in net charges.
          </>,
        ]}
      />

      <H2 id="what-changed">What changed, and when</H2>

      <StatGrid
        stats={[
          { value: "NZ$7.50/g", label: "Used imports over target" },
          { value: "NZ$15/g", label: "New vehicles over target" },
          { value: "1 Jan 2028", label: "New targets take effect" },
        ]}
      />

      <Timeline
        items={[
          {
            time: "1 January 2026",
            title: "Charges cut sharply",
            body: (
              <>
                The used-vehicle charge falls from NZ$33.75 to NZ$7.50 per gram
                of CO<sub>2</sub> over target; the new-vehicle charge falls from
                NZ$67.50 to NZ$15. The reduced rates apply through 2026 and
                2027.
              </>
            ),
          },
          {
            time: "21 August 2026",
            title: "The standard survives its review",
            body: (
              <>
                Transport Minister Chris Bishop confirms the Government will
                keep the Clean Car Standard rather than remove it, saying
                removal would be highly disruptive for an industry that has
                accumulated credits and charges over time.
              </>
            ),
          },
          {
            time: "Early 2027",
            title: "Officials report back",
            body: (
              <>
                New settings are developed in consultation with the motor
                industry. The Government has not yet decided what the new
                targets will be.
              </>
            ),
          },
          {
            time: "1 January 2028",
            title: "New targets apply",
            body: (
              <>
                Separate targets for used and new imports take effect,
                reflecting the older technology in the used fleet.
              </>
            ),
          },
        ]}
      />

      <PullQuote>
        Removing the standard would have wiped out credits importers had already
        earned. Keeping it and cutting the rate protects them and lowers the
        bill at once.
      </PullQuote>

      <H2 id="landed">What it does to a landed number</H2>

      <P>
        This is one of the rare cases where the arithmetic is fully public and
        entirely linear. The charge is a rate per gram of CO<sub>2</sub> above
        the applicable target, so the saving scales directly with how far over
        target a vehicle sits.
      </P>

      <Table
        head={[
          "Grams over target",
          "At NZ$33.75/g (to 2025)",
          "At NZ$7.50/g (2026–27)",
          "Difference",
        ]}
        rows={[
          ["10 g", "NZ$337.50", "NZ$75.00", "−NZ$262.50"],
          ["20 g", "NZ$675.00", "NZ$150.00", "−NZ$525.00"],
          ["50 g", "NZ$1,687.50", "NZ$375.00", "−NZ$1,312.50"],
          ["80 g", "NZ$2,700.00", "NZ$600.00", "−NZ$2,100.00"],
        ]}
        caption="Illustrative. The applicable CO2 target depends on the vehicle and the scheme year; confirm yours with NZTA before relying on a figure."
      />

      <P>
        A larger petrol SUV sitting well over target is where the cut is worth
        real money. On a small, efficient Japanese hatchback that sits close to
        or under target, the charge was never the issue and the reduction
        changes very little. That asymmetry is the practical read: the reduction
        is a discount on exactly the vehicles New Zealand&rsquo;s policy was
        designed to discourage.
      </P>

      <Callout
        title="We are not going to pretend this is a green outcome"
        tone="amber"
      >
        <p>
          Cutting the charge by 78% on used imports makes higher-emitting
          vehicles cheaper to land in New Zealand. That is the mechanical effect
          and it is worth stating plainly, whatever your view of it. The
          Government&rsquo;s stated reasoning was consumer cost, and Bishop put
          the avoided net charges at NZ$264 million.
        </p>
      </Callout>

      <H2 id="applies">Does this apply to you?</H2>

      <UL>
        <CheckLI>
          <Strong>Importing a used vehicle into New Zealand:</Strong> yes,
          directly. Your Clean Car Standard exposure is a quarter of what it was
          in 2025.
        </CheckLI>
        <CheckLI>
          <Strong>Importing a new vehicle:</Strong> yes, at NZ$15 rather than
          NZ$67.50 per gram over target.
        </CheckLI>
        <CheckLI>
          <Strong>Importing into Australia:</Strong> no. Australia runs the New
          Vehicle Efficiency Standard, a separate scheme levied on suppliers
          rather than a per-vehicle import charge. Do not read across.
        </CheckLI>
        <CheckLI>
          <Strong>Buying a used vehicle already in New Zealand:</Strong> no. The
          standard applies at import, not at resale.
        </CheckLI>
      </UL>

      <H3 id="legal">Is your car still legal to import?</H3>

      <P>
        The Clean Car Standard is a charge, not a bar &mdash; it prices
        emissions rather than prohibiting them. Admissibility in New Zealand is
        governed separately, through entry certification, frontal-impact
        standards, biosecurity inspection and the applicable emissions standard
        for the vehicle&rsquo;s market of origin.
      </P>

      <P>
        Reporting indicates further emissions standard changes are scheduled for
        the end of the decade, with different requirements for diesel and for
        petrol, CNG and LPG vehicles. We have not verified those dates and
        thresholds against NZTA&rsquo;s own published requirements and are not
        going to state them as fact. If you are planning a purchase that lands
        near the end of the decade, that is the thing to confirm with NZTA
        directly. Our{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-new-zealand">
          New Zealand guide
        </InlineLink>{" "}
        covers the certification pathway as it stands.
      </P>

      <ConfirmedLedger
        confirmed={[
          <>
            Used-vehicle Clean Car Standard charges fell from NZ$33.75 to
            NZ$7.50 per gram of CO<sub>2</sub> from 1 January 2026, with the
            reduced rates applying through 2026 and 2027.
          </>,
          "New-vehicle charges fell from NZ$67.50 to NZ$15 per gram over the same period.",
          "On 21 August 2026 the Government confirmed it will retain the Clean Car Standard, with new settings from 1 January 2028 and officials reporting back in early 2027.",
          "Transport Minister Chris Bishop is the minister responsible and estimated NZ$264 million in avoided net charges.",
        ]}
        unconfirmed={[
          <>
            The CO<sub>2</sub> targets themselves for 2026 and 2027. Confirm
            your vehicle&rsquo;s applicable target with NZTA rather than relying
            on a published figure.
          </>,
          "What the 2028 targets will be. The Government has explicitly not decided.",
          "The exact dates and thresholds of the scheduled emissions standard changes later this decade.",
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        There is a genuine window and it runs to the end of 2027. The reduced
        rates were set for 2026 and 2027, and new targets arrive on 1 January
        2028 with the charge structure to be settled in between. Nobody has said
        the rates will rise again, and we are not predicting that they will
        &mdash; but the current level has a stated end date, which is more than
        most tax positions have.
      </P>

      <P>
        Net that against real lead time before acting on it. Nearly all New
        Zealand used imports come out of Japan, and the voyage plus entry
        certification plus compliance work is measured in weeks. A late-2027
        order is a 2028 registration, and 2028 is on different settings.
      </P>

      <UL>
        <CheckLI>
          <Strong>
            If you want a higher-emitting used import, this is the cheap window.
          </Strong>{" "}
          The saving on a vehicle 50 grams over target is NZ$1,312.50 against
          the 2025 rate.
        </CheckLI>
        <CheckLI>
          <Strong>If your vehicle is near or under target, ignore this.</Strong>{" "}
          The charge was not material to you and the reduction is not either.
        </CheckLI>
        <CheckLI>
          <Strong>
            Dealers should be watching the 2027 consultation, not the 2026 rate.
          </Strong>{" "}
          The targets set for 2028 will shape which specifications are worth
          committing capital to for years afterwards.
        </CheckLI>
      </UL>

      <Disclaimer>
        Clean Car Standard charge rates, CO<sub>2</sub> targets and entry
        certification requirements are set by the New Zealand Government and
        administered by NZTA Waka Kotahi. Details above reflect the
        Government&rsquo;s announcement of 21 August 2026 and published rate
        changes, checked on 10 September 2026. Verify your own position with
        NZTA before committing funds.
      </Disclaimer>

      <Callout
        title="Pricing a Japanese import into New Zealand?"
        tone="emerald"
      >
        <p>
          We buy in Japanese auction halls every week, inspect before your money
          moves, and quote one landed figure to your port. Send us the model,
          grade and year band:{" "}
          <InlineLink href="/request">start here</InlineLink>. Our comparison of{" "}
          <InlineLink href="/blog/new-zealand-vs-japan-for-used-imports">
            New Zealand and Japan as sources
          </InlineLink>{" "}
          sets out where each corridor actually wins.
        </p>
      </Callout>
    </>
  );
}
