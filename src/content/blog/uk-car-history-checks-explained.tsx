import {
  Callout,
  CheckLI,
  Disclaimer,
  H2,
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
        In most countries a used car&rsquo;s history is whatever the seller
        tells you. In Britain it is a public record. Every annual roadworthiness
        test, every advisory note and every recorded mileage reading is
        published, and a commercial provenance check adds finance, theft and
        write-off markers on top. If you are buying a British car from 10,000
        miles away, this is the reason you can.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The <Strong>MOT record</Strong> is a year-by-year biography:
            results, mileage and advisories.
          </>,
          <>
            Plotting the mileage timeline is the{" "}
            <Strong>single best clocking check</Strong> available anywhere.
          </>,
          <>
            A <Strong>provenance check</Strong> covers outstanding finance,
            theft markers and write-off categories.
          </>,
          <>
            None of it detects a hidden mechanical fault — that still needs a
            person and a ramp.
          </>,
        ]}
      />

      <H2 id="why-britain">Why Britain is different</H2>
      <P>
        Two systems, working together. Britain requires an annual roadworthiness
        test on most cars over three years old, and the results —{" "}
        <Strong>including the odometer reading and every advisory note</Strong>{" "}
        — are published against the registration. Separately, the finance and
        insurance industries maintain a shared register of security interests,
        write-offs and theft reports that commercial providers query on demand.
      </P>
      <P>
        The combination means a British car&rsquo;s life can be reconstructed
        before you commit a penny. No other market in our network comes close,
        and it is why we treat these checks as mandatory rather than optional on
        every UK purchase.
      </P>

      <H2 id="mot">The MOT record: a year-by-year biography</H2>
      <P>
        Read as a sequence rather than a snapshot, the MOT history tells you
        what kind of life the car has had. Look for patterns, not individual
        entries:
      </P>
      <UL>
        <CheckLI>
          <Strong>Recurring advisories</Strong> for the same component across
          several years — an issue somebody kept deciding not to fix.
        </CheckLI>
        <CheckLI>
          <Strong>Corrosion advisories</Strong> appearing and then escalating in
          language. Corrosion only ever progresses.
        </CheckLI>
        <CheckLI>
          <Strong>A cluster of failures in one year</Strong>, often the point at
          which the car changed hands or stopped being maintained properly.
        </CheckLI>
        <CheckLI>
          <Strong>Gaps in testing</Strong> — a year with no test usually means
          the car was off the road, and it is worth knowing why.
        </CheckLI>
        <CheckLI>
          <Strong>Tyre and brake advisories immediately before a sale</Strong>,
          which tell you what the seller has chosen not to spend money on.
        </CheckLI>
      </UL>
      <Callout title="Advisories are more useful than passes" tone="sky">
        <p>
          A clean pass tells you the car met a minimum on one day. An advisory
          tells you what a qualified tester actually noticed. On a car you
          cannot see, the advisories are the more informative half of the
          record.
        </p>
      </Callout>

      <H2 id="mileage">Reading the mileage timeline</H2>
      <P>
        This is the most valuable single check in British car buying. Each test
        records the odometer, so you get a datapoint roughly every twelve
        months. Plot them.
      </P>
      <UL>
        <CheckLI>
          <Strong>A broadly rising line</Strong> with consistent annual
          increments is what a genuine car looks like.
        </CheckLI>
        <CheckLI>
          <Strong>A step backwards</Strong> means the recorded mileage
          decreased. There is no benign explanation worth the risk.
        </CheckLI>
        <CheckLI>
          <Strong>An implausibly flat stretch</Strong> — a few hundred miles
          across a year on a car with no explanation for it — deserves a hard
          question.
        </CheckLI>
        <CheckLI>
          <Strong>A sudden change of slope</Strong> is not necessarily sinister;
          a change of owner or use can explain it. But it should be explained.
        </CheckLI>
      </UL>
      <P>
        Then cross-check against the service book. Stamped intervals should
        agree with the MOT readings. Where they do not, the paperwork is telling
        you something the seller is not.
      </P>

      <H2 id="provenance">Provenance: finance, theft and write-offs</H2>
      <P>
        The MOT record says nothing about who owns the car or what has been
        claimed against it. That is what a provenance check is for:
      </P>
      <UL>
        <CheckLI>
          <Strong>Outstanding finance.</Strong> If a lender holds an interest,
          the seller cannot pass clean title. This is the check that prevents
          the single worst outcome in used-car buying.
        </CheckLI>
        <CheckLI>
          <Strong>Insurance write-off markers</Strong> and the category recorded
          against them.
        </CheckLI>
        <CheckLI>
          <Strong>Theft markers</Strong> from the police database.
        </CheckLI>
        <CheckLI>
          <Strong>Plate changes, colour changes and keeper count</Strong> — none
          fatal individually, all informative.
        </CheckLI>
      </UL>
      <P>
        It costs very little and no car should be bought without it. We run it
        on every UK vehicle before purchase and include the certificate in the
        document set.
      </P>

      <H2 id="categories">Write-off categories, plainly</H2>
      <Table
        head={["Category", "What it means", "Our position"]}
        rows={[
          [
            <Strong key="c1">Cat A</Strong>,
            "Scrap only. Must be crushed entirely.",
            "Never. Should not be on the road at all.",
          ],
          [
            <Strong key="c2">Cat B</Strong>,
            "Body shell must be destroyed; parts may be salvaged.",
            "Never.",
          ],
          [
            <Strong key="c3">Cat S</Strong>,
            "Structural damage recorded, legally repairable.",
            "Only knowingly, at the right price, with repair evidence — and only where your destination will register it.",
          ],
          [
            <Strong key="c4">Cat N</Strong>,
            "Non-structural damage recorded, legally repairable.",
            "Sometimes sound and fairly priced. Always disclosed, always checked against destination rules.",
          ],
        ]}
        caption="Categorisation is recorded by insurers and reflects the economics of a claim as much as the severity of damage — a low-value car can be written off for modest damage."
      />
      <P>
        The important practical point: several destination markets will not
        register a vehicle carrying <em>any</em> write-off marker. That check
        belongs before purchase, not after arrival.
      </P>

      <H2 id="limits">What the data cannot tell you</H2>
      <P>
        Being honest about the limits is what makes the rest useful. A complete,
        clean British history record does not tell you:
      </P>
      <UL>
        <CheckLI>
          Whether the clutch is nearly gone, the gearbox is hesitant or the air
          conditioning has stopped working.
        </CheckLI>
        <CheckLI>
          Whether accident damage was repaired without an insurance claim — no
          claim means no marker.
        </CheckLI>
        <CheckLI>
          Whether the interior smells, the panel gaps line up, or the paint
          matches across the car.
        </CheckLI>
        <CheckLI>
          Whether an engine or gearbox has been replaced with a used unit of
          unknown history.
        </CheckLI>
      </UL>
      <P>
        Which is why the checks are step four of five in{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-the-uk">
          our UK import process
        </InlineLink>
        , and step five is a person standing next to the car. The documents
        narrow the field; the inspection makes the decision.
      </P>

      <Disclaimer>
        Public vehicle records and commercial provenance data are accurate to
        what has been reported, and unreported damage or servicing does not
        appear. Write-off categorisation conventions have changed over time, so
        older markers may use superseded terminology. Always pair a records
        check with a physical inspection.
      </Disclaimer>
    </>
  );
}
