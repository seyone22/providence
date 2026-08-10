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
        &ldquo;GCC spec&rdquo; gets used as if it were a marketing label. It is
        not — it describes real engineering differences, made deliberately, for
        a climate that destroys equipment designed for anywhere else. In a hot
        country those differences are exactly what you want. In a cold or
        emissions-regulated one they can stop you registering the car at all.
        Here is what actually changes.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            GCC spec means{" "}
            <Strong>
              uprated cooling, bigger air conditioning, heat-resistant materials
            </Strong>
            .
          </>,
          <>
            It is <Strong>optimised differently</Strong>, not built worse. Fit
            is the question, not quality.
          </>,
          <>
            The real risk is{" "}
            <Strong>emissions and equipment homologation</Strong> in strict
            markets.
          </>,
          <>
            Compatibility is <Strong>model- and year-specific</Strong>. Never
            generalise from another car.
          </>,
        ]}
      />

      <H2 id="what-it-is">What GCC spec means</H2>
      <P>
        Manufacturers build regional variants of the same model because
        operating conditions differ enough to matter. A car sold into the Gulf
        Cooperation Council markets faces ambient temperatures well above what
        European or Japanese specification is calibrated for, sustained for
        months, with dust and strong UV on top.
      </P>
      <P>
        So the GCC variant is engineered for that: more cooling capacity, more
        air conditioning, materials chosen to survive UV and heat soak, and
        calibration for regionally available fuel. None of it is cost-cutting.
        It is a different set of design priorities, and the trade-off is that
        priorities optimised for 50°C are not the priorities that matter at
        −10°C.
      </P>

      <H2 id="cooling">Cooling and air conditioning</H2>
      <P>The most substantial differences, and the most useful ones:</P>
      <UL>
        <CheckLI>
          <Strong>Larger radiators and higher-capacity cooling systems</Strong>,
          sized for sustained high ambient temperatures rather than occasional
          peaks.
        </CheckLI>
        <CheckLI>
          <Strong>Uprated air conditioning</Strong> — larger condensers,
          stronger compressors, and on many models additional rear-cabin
          evaporators.
        </CheckLI>
        <CheckLI>
          <Strong>
            Additional cooling for transmissions and differentials
          </Strong>{" "}
          on heavy-duty models, because heat is what kills those components.
        </CheckLI>
        <CheckLI>
          <Strong>Higher-temperature-tolerant fluids and seals</Strong>{" "}
          specified from the factory.
        </CheckLI>
      </UL>
      <Callout title="This is why GCC 4x4s travel so well" tone="emerald">
        <p>
          A GCC-spec Land Cruiser or Patrol going to East Africa, South Asia or
          the Middle East arrives better suited to the destination than a
          European-specification equivalent would be. It is the clearest case
          where buying from Dubai is an engineering decision rather than a price
          one.
        </p>
      </Callout>

      <H2 id="materials">Materials and trim</H2>
      <P>
        Less discussed and genuinely relevant to how a car ages. GCC cars
        typically use interior materials chosen to resist UV degradation and
        heat soak — dashboard plastics that do not crack, upholstery that does
        not fade, adhesives that hold at temperatures where others fail.
      </P>
      <P>
        The visible consequence is that a five-year-old Gulf car often has a
        better-preserved interior than you would expect from the climate, while
        a European-spec car imported into the Gulf frequently does not. Lighter
        interior colours are also more common, for the obvious reason.
      </P>

      <H2 id="emissions">Emissions and fuel quality</H2>
      <P>
        This is where the difficulty lives. Engine calibration and exhaust
        after-treatment are matched to regionally available fuel and to the
        region&rsquo;s emissions requirements, which have historically differed
        from European standards.
      </P>
      <P>
        The practical result: some GCC models are effectively identical to their
        European counterparts and present no problem at all, while others differ
        in after-treatment hardware or engine mapping in ways that make European
        homologation expensive or impossible. There is{" "}
        <Strong>no general rule</Strong> — it varies by manufacturer, by model
        and by model year.
      </P>
      <Callout title="Never assume from another car" tone="amber">
        <p>
          The most expensive mistake in this area is reasoning from a
          friend&rsquo;s successful import. Two models from the same
          manufacturer, or the same model two years apart, can have entirely
          different homologation positions. It has to be checked for the
          specific vehicle.
        </p>
      </Callout>

      <H2 id="equipment">Equipment differences</H2>
      <Table
        head={["Area", "Typical GCC position", "Why it matters"]}
        rows={[
          [
            <Strong key="e1">Cooling / AC</Strong>,
            "Uprated, often significantly",
            "Advantage in hot markets, neutral elsewhere",
          ],
          [
            <Strong key="e2">Emissions hardware</Strong>,
            "Calibrated for regional fuel and standards",
            "The main homologation risk in strict markets",
          ],
          [
            <Strong key="e3">Cold-weather equipment</Strong>,
            "Often omitted — heated seats, screens, engine block heaters",
            "Genuinely missed in cold destinations",
          ],
          [
            <Strong key="e4">Lighting</Strong>,
            "May differ in beam pattern and marker requirements",
            "Can require replacement for registration",
          ],
          [
            <Strong key="e5">Driver assistance</Strong>,
            "Availability varies by market and trim",
            "Affects value and, in some markets, type approval",
          ],
          [
            <Strong key="e6">Interior materials</Strong>,
            "Heat and UV resistant",
            "Ages better than expected for the climate",
          ],
        ]}
        caption="Indicative only — actual specification is set by the manufacturer per model and per year."
      />

      <H2 id="decision">When GCC spec is right for you</H2>
      <P>
        <Strong>Buy GCC spec</Strong> if your destination is hot, your
        registration requirements are not emissions-strict, and you want a
        nearly new, highly specified car at a used price. For much of Africa,
        South Asia, the Middle East and Central Asia this is the correct answer,
        and the cooling advantage is a real one.
      </P>
      <P>
        <Strong>Think carefully</Strong> if you are registering in Europe or
        another emissions-strict jurisdiction. It may be fine for your specific
        model — but &ldquo;may be fine&rdquo; is a question to resolve before
        purchase, not after the car has sailed.
      </P>
      <P>
        <Strong>Look elsewhere</Strong> if you are in a cold climate. The
        omitted cold-weather equipment is genuinely missed, and the cooling
        advantage buys you nothing.{" "}
        <InlineLink href="/source-cars-from/japan">Japan</InlineLink> or{" "}
        <InlineLink href="/source-cars-from/united-kingdom">the UK</InlineLink>{" "}
        will serve you better.
      </P>
      <P>
        Our UAE team checks the specific vehicle against your
        destination&rsquo;s requirements before purchase as a matter of course —
        and tells you when the answer is no.{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-the-uae">
          The full import process is here
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Regional specification differences are set by manufacturers and change
        by model and model year, and homologation requirements are set by your
        destination authority. Nothing here should be treated as confirmation
        that a particular vehicle can be registered in a particular country —
        that requires a model-specific check, which we carry out before
        purchase.
      </Disclaimer>
    </>
  );
}
