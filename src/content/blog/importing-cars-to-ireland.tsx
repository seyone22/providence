import BlogCTA from "@/components/blog/BlogCTA";
import {
  Callout,
  CheckLI,
  Disclaimer,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  P,
  StatGrid,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Importing a car to Ireland can save you thousands — or quietly cost you
        thousands — depending on three taxes, where the car was built, and which
        model you choose. This guide pulls the whole picture together: what you
        pay, where to buy, and the cars that land cheapest in 2026.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The cost is three stacked charges:{" "}
            <Strong>customs duty, VAT and VRT</Strong>. Understanding how they
            interact is the entire game.
          </>,
          <>
            Since <Strong>1 February 2026</Strong>, Japanese-built cars enter at{" "}
            <Strong>0% customs duty</Strong> — the same as UK-built cars.
          </>,
          <>
            VRT swings from <Strong>7% to 41%</Strong> of the car&rsquo;s Irish
            value based on CO₂, so a low-emission model is your biggest lever.
          </>,
          <>
            The value sweet spot is a <Strong>3–8 year-old</Strong>,
            low-emission, right-hand-drive car bought below Irish retail.
          </>,
        ]}
      />

      <H2 id="three-taxes">The three taxes that decide everything</H2>
      <P>
        Every imported vehicle must be registered in Ireland within 30 days of
        arrival, with an NCTS inspection booked within 7 days. Tax is assessed
        at that point, and the total is the sum of three charges applied in
        order — each calculated on the running total of the one before it:
      </P>
      <UL>
        <CheckLI>
          <Strong>Customs duty</Strong> — 0% or 10% of the landed (CIF) value,
          decided by where the car was <em>built</em>.
        </CheckLI>
        <CheckLI>
          <Strong>VAT</Strong> — 23% of the landed value plus any duty.
        </CheckLI>
        <CheckLI>
          <Strong>VRT</Strong> — 7% to 41% of the Irish Open Market Selling
          Price (OMSP), driven by CO₂ emissions, plus a separate NOx levy.
        </CheckLI>
      </UL>

      <H2 id="customs-duty">Customs duty: 0% or 10%</H2>
      <P>
        Customs duty applies to cars entering Ireland from outside the EU
        customs union — which, since Brexit, includes Great Britain. The
        decisive factor is the <Strong>country of manufacture</Strong>, not
        where you bought the car.
      </P>
      <Table
        head={["Where the car was built / bought", "Customs duty"]}
        rows={[
          ["Built in Japan, with a statement of origin", "0% (EU–Japan EPA)"],
          [
            "Built in the UK, imported from GB (proof of origin)",
            "0% (EU–UK TCA)",
          ],
          ["Built in the EU but bought in Great Britain", "10%"],
          ["Built elsewhere (Korea, USA…), from a non-EU country", "10%"],
          ["Imported from another EU member state", "0% (single market)"],
        ]}
      />
      <Callout title="The most expensive mistake" tone="amber">
        <p>
          A BMW or VW bought in Britain was built in Germany — it pays the full
          10%. A Toyota bought in Britain but built in Japan can claim 0%{" "}
          <em>only</em> with a valid Statement of Origin. Without documentary
          proof, Revenue charges 10% by default. See{" "}
          <InlineLink href="/blog/import-car-from-japan-or-uk-to-ireland">
            Japan vs the UK
          </InlineLink>{" "}
          for how this plays out in practice.
        </p>
      </Callout>

      <H2 id="vat">VAT at 23%</H2>
      <P>
        Irish VAT is 23%, charged on the customs value plus any duty already
        added. It always applies to non-EU imports (Japan, and Great Britain
        since Brexit), regardless of the car&rsquo;s age or mileage.
      </P>
      <P>
        There is one exception worth knowing: a genuinely <Strong>used</Strong>{" "}
        car from the EU or Northern Ireland is VAT-free — but only if it is more
        than 6 months old <em>and</em> has more than 6,000 km. Under either
        threshold, it counts as a &ldquo;new means of transport&rdquo; and 23%
        applies anyway.
      </P>

      <H2 id="vrt">VRT — the controllable cost</H2>
      <P>
        Vehicle Registration Tax is the largest and most controllable charge.
        It&rsquo;s calculated as <Strong>(CO₂ rate % × OMSP) + NOx levy</Strong>
        , where OMSP is Revenue&rsquo;s own estimate of the car&rsquo;s Irish
        retail price — not the price you paid abroad. The CO₂ rate runs across
        20 bands:
      </P>
      <StatGrid
        stats={[
          { value: "7%", label: "Battery EV / PHEV (0–50 g/km)" },
          { value: "~12%", label: "Efficient hybrid (~95–110 g/km)" },
          { value: "41%", label: "High-emission car (over 190 g/km)" },
        ]}
      />
      <P>
        On a €25,000 OMSP, a 95 g/km hybrid pays about €3,000 VRT; a 145 g/km
        diesel SUV pays about €5,375; a 195 g/km performance car pays €10,250
        plus the heaviest NOx levy. Same value, but emissions alone move the
        bill by €7,000+. We break the maths down fully in{" "}
        <InlineLink href="/blog/vrt-explained-ireland">
          VRT explained
        </InlineLink>
        .
      </P>

      <H2 id="where-to-buy">Where to import from</H2>
      <P>
        Five source countries are commonly considered. In 2026 only two are
        genuinely worth it for most buyers:
      </P>
      <Table
        head={["Country", "Duty (locally-built car)", "Shipping", "Verdict"]}
        rows={[
          [
            "Japan",
            "0% (EPA, since Feb 2026)",
            "€1,000–2,000, 6–10 wks",
            "Strongest value source",
          ],
          [
            "United Kingdom",
            "0% if UK-built, else 10%",
            "€250–700 ferry, days",
            "Best logistics; tax depends on origin",
          ],
          [
            "India",
            "10% (FTA not yet at 0%)",
            "€1,500–2,500, 5–8 wks",
            "Weak — few suitable models",
          ],
          ["Australia", "10%", "€2,500–4,500, 6–10 wks", "Niche only"],
          [
            "New Zealand",
            "10%",
            "€2,500–4,500, 6–10 wks",
            "Classics / enthusiast only",
          ],
        ]}
      />
      <P>
        Japan and the UK are right-hand drive (no conversion needed) and now
        share the same 0% duty for locally-built cars. India, Australia and New
        Zealand offer no 0% car duty today and long, costly shipping — treat
        them as niche-only.{" "}
        <InlineLink href="/blog/import-car-from-japan-or-uk-to-ireland">
          Compare Japan vs the UK in detail →
        </InlineLink>
      </P>

      <H2 id="best-cars">The best cars to import</H2>
      <P>
        The ideal import qualifies for 0% duty, has low CO₂ to keep VRT down,
        favours petrol/hybrid over diesel (to avoid the NOx levy), is right-hand
        drive, and has a real price gap to Irish retail. That points squarely at
        Japanese-built hybrids and efficient petrols:
      </P>
      <UL>
        <CheckLI>
          <Strong>Toyota Aqua / Prius / Corolla hybrid</Strong> — very low CO₂,
          abundant at auction, strong Irish resale.
        </CheckLI>
        <CheckLI>
          <Strong>Honda Fit / Jazz hybrid</Strong> — small, efficient, cheap at
          source.
        </CheckLI>
        <CheckLI>
          <Strong>Nissan Note e-Power / Leaf</Strong> — lowest CO₂ bands; the
          Leaf EV also captures the VRT relief before end-2026.
        </CheckLI>
        <CheckLI>
          <Strong>Suzuki Swift / kei cars</Strong> — low value + low CO₂ = very
          low VRT.
        </CheckLI>
      </UL>
      <P>
        For the full ranked list with landed-cost numbers, see{" "}
        <InlineLink href="/blog/cheapest-cars-to-import-to-ireland">
          the cheapest cars to import to Ireland
        </InlineLink>
        .
      </P>

      <BlogCTA
        heading="Not sure which car works for you?"
        body="Tell us your budget and how you'll use the car. We'll suggest the models that land cheapest after all Irish taxes — and quote the exact total before you commit."
      />

      <H2 id="sweet-spot">The age &amp; mileage sweet spot</H2>
      <P>
        Brand new is usually the worst value: the highest OMSP (so the highest
        VRT), the full &ldquo;new means of transport&rdquo; VAT from the EU, and
        the steepest year-one depreciation. The consistent winner is a{" "}
        <Strong>3–8 year-old car with average (not ultra-low) mileage</Strong>:
      </P>
      <UL>
        <CheckLI>
          The first owner has absorbed the worst depreciation, so OMSP — and VRT
          — are moderate.
        </CheckLI>
        <CheckLI>
          It&rsquo;s comfortably clear of the 6-month / 6,000 km VAT trap.
        </CheckLI>
        <CheckLI>
          Cars from ~2019 onward usually have genuine WLTP CO₂ data, avoiding
          the NEDC-conversion penalty.
        </CheckLI>
      </UL>
      <Callout tone="sky">
        <p>
          Counter-intuitively, very low mileage can <em>raise</em> your VRT —
          Revenue assigns a higher OMSP to a low-mileage car. The genuine value
          play is average mileage with documented good condition, which
          Japan&rsquo;s auction grading makes easy to find.
        </p>
      </Callout>

      <H2 id="steps">The import process, step by step</H2>
      <P>
        With a service like Providence, the process is hands-off, but it helps
        to know the shape of it:
      </P>
      <UL>
        <CheckLI>
          <Strong>Source</Strong> — confirm the car, its condition grade and
          origin documents before any money moves.
        </CheckLI>
        <CheckLI>
          <Strong>Ship</Strong> — RoRo to an Irish port (6–10 weeks from Japan;
          days by ferry from the UK), fully insured.
        </CheckLI>
        <CheckLI>
          <Strong>Clear</Strong> — customs declaration, then VRT assessment and
          payment at the NCTS.
        </CheckLI>
        <CheckLI>
          <Strong>Register &amp; deliver</Strong> — Irish plates, road-legal,
          delivered to your door.
        </CheckLI>
      </UL>
      <P>
        Before you do any of this, model the full landed cost. Run your exact
        car through our{" "}
        <InlineLink href="/ireland-cost-calculator">
          Ireland car import cost calculator
        </InlineLink>{" "}
        — or read{" "}
        <InlineLink href="/blog/cost-of-importing-a-car-to-ireland">
          how much it really costs
        </InlineLink>{" "}
        and{" "}
        <InlineLink href="/blog/cheapest-way-to-import-a-car-to-ireland">
          the cheapest way to do it
        </InlineLink>
        .
      </P>

      <Disclaimer />
    </>
  );
}
