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
        The auction sheet is the reason buying a car in Japan, sight unseen,
        from the other side of the world, is a rational thing to do. It is
        written by an inspector who works for the auction house rather than the
        seller, it follows a standard format, and the entire Japanese motor
        trade relies on it. Learn to read one and you stop depending on{" "}
        <Strong>anybody&rsquo;s</Strong> description of a car — including ours.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The overall grade runs roughly <Strong>1 to 5</Strong>, with{" "}
            <Strong>4</Strong> excellent and <Strong>3.5</Strong> very good.
          </>,
          <>
            <Strong>Grade R / RA</Strong> means recorded accident repair — not
            automatically a write-off, but always a question.
          </>,
          <>
            A separate <Strong>interior grade</Strong> (A–D) is graded
            independently of the bodywork.
          </>,
          <>
            The <Strong>panel map</Strong> and the inspector&rsquo;s handwritten
            notes matter more than the headline number.
          </>,
        ]}
      />

      <H2 id="what-it-is">What an auction sheet is</H2>
      <P>
        Every car entering a Japanese auction is physically inspected before the
        sale. The inspector records an overall condition grade, a separate
        interior grade, the odometer reading, whether the service book and spare
        key are present, and a diagram of the car&rsquo;s panels annotated with
        every mark found. The result is a single A4 sheet that accompanies the
        lot.
      </P>
      <P>
        Two things make it trustworthy. The inspector is employed by the auction
        house, which has no stake in the car selling high; and the format is
        standardised, so a Grade 4 at one house means roughly what it means at
        another. It is not a warranty and it is not a mechanical report — but as
        an independent, comparable condition statement it has no equivalent
        anywhere else in the used-car world.
      </P>

      <H2 id="overall-grades">The overall grade scale</H2>
      <Table
        head={["Grade", "What it means in practice"]}
        rows={[
          [
            <Strong key="g5">5 and above</Strong>,
            "Essentially as-new. Very low mileage, no meaningful marks. Priced at a clear premium, and usually more car than a driver needs.",
          ],
          [
            <Strong key="g45">4.5</Strong>,
            "Excellent, low mileage, only the faintest cosmetic marks. The sweet spot if condition matters more than price.",
          ],
          [
            <Strong key="g4">4</Strong>,
            "Genuinely excellent for a used car. Light scratches or a small dent or two, nothing structural. The grade most buyers should target.",
          ],
          [
            <Strong key="g35">3.5</Strong>,
            "Very good with visible cosmetic wear — scuffs, a few dents, maybe a wheel kerb. Sensible value if you can live with marks.",
          ],
          [
            <Strong key="g3">3</Strong>,
            "Noticeable wear, likely needing cosmetic work. Viable for a trade buyer with a bodyshop, rarely for a private one.",
          ],
          [
            <Strong key="g2">2 and below</Strong>,
            "Significant damage, corrosion or wear. Project territory. We do not buy at this level.",
          ],
          [
            <Strong key="gr">R / RA</Strong>,
            "Accident repair recorded, regardless of current condition. See below — the grade tells you less than the notes do.",
          ],
        ]}
        caption="Grades follow a national convention but are applied by individual inspectors; treat half-point differences as indicative rather than absolute."
      />
      <P>
        We buy Grade 3.5 and above as standard, and we tell you the grade before
        we bid rather than after we have won.
      </P>

      <H2 id="grade-r">Grade R and RA: repaired, not written off</H2>
      <P>
        This is the most misunderstood marking on the sheet.{" "}
        <Strong>Grade R means accident repair has been recorded</Strong> — and
        in Japan that threshold is low. A replaced bumper skin or a repaired
        rear quarter can earn an R. So can structural repair to a chassis rail.
        The letter alone does not distinguish between them.
      </P>
      <P>What does distinguish them is everything else on the sheet:</P>
      <UL>
        <CheckLI>
          <Strong>Which panels are marked</Strong> on the diagram, and whether
          any of them are structural rather than bolt-on.
        </CheckLI>
        <CheckLI>
          <Strong>The inspector&rsquo;s notes</Strong>, which frequently specify
          what was replaced or repaired.
        </CheckLI>
        <CheckLI>
          <Strong>The price relative to non-R equivalents</Strong>. A large
          discount usually means the trade has read something you have not.
        </CheckLI>
      </UL>
      <Callout title="Our position on Grade R" tone="amber">
        <p>
          We will buy a Grade R car where the repair is documented, cosmetic and
          confirmed on our own physical inspection — and we disclose it every
          time, in writing, before you pay. What we will not do is quietly ship
          one as if the marking were not there.
        </p>
      </Callout>

      <H2 id="interior">The interior grade</H2>
      <P>
        Alongside the bodywork grade sits a letter, usually A to D, describing
        the cabin. <Strong>A</Strong> is close to unmarked. <Strong>B</Strong>{" "}
        is clean with light wear. <Strong>C</Strong> means visible wear —
        scuffed trim, worn seat bolsters, marks on the carpet.{" "}
        <Strong>D</Strong> means damage, tears, burns or staining.
      </P>
      <P>
        The two grades move independently, and the combination tells you a
        story. A Grade 4 body with a D interior often means a well-cared-for car
        that carried children, pets or cargo. A Grade 3.5 body with an A
        interior usually means a car that was parked badly and driven gently.
        Which of those you would rather own is a genuine preference, and it is
        worth having one.
      </P>

      <H2 id="map">The panel map and its shorthand</H2>
      <P>
        The diagram is where the real information lives. Each mark is annotated
        with a letter code and a number: the letter says what kind of defect,
        the number says how severe. You do not need to memorise the codes — a
        good translation spells them out — but you do need to look at{" "}
        <Strong>where</Strong> they cluster.
      </P>
      <UL>
        <CheckLI>
          Marks spread evenly across the lower panels and bumpers read as
          ordinary car-park life.
        </CheckLI>
        <CheckLI>
          Several marks concentrated on one corner read as a single impact,
          whatever the grade says.
        </CheckLI>
        <CheckLI>
          Any annotation on the inner structure, rails, or panel joints is a
          different conversation entirely.
        </CheckLI>
        <CheckLI>
          Corrosion markings matter more than dents, because dents stay the size
          they are.
        </CheckLI>
      </UL>

      <H2 id="red-flags">Notes that should stop a purchase</H2>
      <P>
        The inspector&rsquo;s handwritten comments are the part machine
        translation mangles and the part that matters most. Treat these as hard
        stops rather than negotiating points:
      </P>
      <UL>
        <CheckLI>
          <Strong>Any odometer inconsistency flag.</Strong> Japan records
          mileage at every inspection; a discrepancy means the records disagree,
          and there is no benign explanation worth the risk.
        </CheckLI>
        <CheckLI>
          <Strong>Structural or frame repair noted.</Strong> Regardless of how
          the car presents, and regardless of price.
        </CheckLI>
        <CheckLI>
          <Strong>Corrosion described as advanced or perforating.</Strong> It
          only ever goes one way.
        </CheckLI>
        <CheckLI>
          <Strong>Warning lamps illuminated or systems inoperative.</Strong>{" "}
          Sometimes trivial, sometimes an expensive control module. Never
          something to find out about at your own port.
        </CheckLI>
      </UL>
      <P>
        One last practical point: insist on the{" "}
        <Strong>original sheet as issued</Strong>, with the auction house name,
        lot number and date visible, alongside its translation. Reproductions
        circulate, and an exporter who will only show you a retyped summary is
        telling you something. Then cross-check the mileage against the export
        certificate — the document set is covered in{" "}
        <InlineLink href="/blog/japan-car-export-documents-explained">
          every document you get with a Japanese import
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Grading conventions are applied by individual inspectors and vary
        slightly between auction houses, so grades are a strong indication
        rather than a guarantee. This is why we inspect every won vehicle
        physically before it ships, and why a car that does not match its sheet
        does not leave Japan.
      </Disclaimer>
    </>
  );
}
