import {
  H2,
  P,
  Lead,
  UL,
  CheckLI,
  Strong,
  Callout,
  KeyTakeaways,
  Table,
  Disclaimer,
  InlineLink,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Vehicle Registration Tax is the biggest — and most controllable — cost of
        importing a car to Ireland. It catches more buyers out than any other
        charge, because it&rsquo;s based on a value Revenue sets, not the price you
        paid. Here&rsquo;s exactly how it&rsquo;s calculated in 2026.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>VRT = (CO₂ rate % × OMSP) + NOx levy.</Strong> The rate is set
            by emissions; the value is set by Revenue.
          </>,
          <>
            The CO₂ rate runs from <Strong>7% to 41%</Strong> across 20 bands.
          </>,
          <>
            It&rsquo;s charged on the <Strong>OMSP</Strong> — the Irish retail
            estimate — not your foreign purchase price.
          </>,
          <>
            Older cars with NEDC-only emissions data can be pushed up a band by
            Revenue&rsquo;s <Strong>NEDC-to-WLTP conversion</Strong>.
          </>,
        ]}
      />

      <H2 id="what-is-vrt">What is VRT?</H2>
      <P>
        VRT is a once-off tax payable when a vehicle is first registered in
        Ireland — including every imported car. You pay it at the National Car
        Testing Service (NCTS), and a car must be registered within 30 days of
        arriving, with an appointment booked inside the first 7 days. It is
        entirely separate from customs duty and VAT.
      </P>

      <H2 id="formula">The VRT formula</H2>
      <Callout tone="sky">
        <p className="text-lg font-medium text-black">
          VRT = (CO₂ rate % × OMSP) + NOx levy
        </p>
        <p>
          Two inputs you control through model choice (the CO₂ rate and the NOx
          levy), and one Revenue controls (the OMSP). Choosing a low-emission car
          is the single biggest lever a buyer has over the final price.
        </p>
      </Callout>

      <H2 id="omsp">OMSP — what VRT is charged on</H2>
      <P>
        OMSP stands for <Strong>Open Market Selling Price</Strong> —
        Revenue&rsquo;s estimate of what the car would sell for at Irish retail.
        Crucially, VRT is charged on the OMSP, <em>not</em> on the price you paid
        abroad. Revenue&rsquo;s database adjusts the OMSP for age, model, mileage
        and condition.
      </P>
      <Callout title="The low-mileage paradox" tone="amber">
        <p>
          Because OMSP rises for a car in better-than-average condition, a{" "}
          <Strong>very low-mileage</Strong> import can be hit with a higher OMSP —
          and therefore more VRT — than a higher-mileage equivalent. Average
          mileage with good documented condition is usually the smarter buy.
        </p>
      </Callout>

      <H2 id="bands">The 2026 CO₂ bands</H2>
      <P>
        These are the Category A rates for passenger cars and SUVs (condensed —
        Revenue uses 20 bands), based on WLTP CO₂ emissions:
      </P>
      <Table
        head={["CO₂ (g/km, WLTP)", "VRT rate", "Typical vehicle"]}
        rows={[
          ["0–50", "7%", "Battery EV, plug-in hybrid"],
          ["51–80", "9%", "Efficient full hybrid"],
          ["81–90", "9.75–10.5%", "Hybrid / small efficient petrol"],
          ["91–100", "11.25–12%", "Small modern petrol"],
          ["101–110", "12.75–13.5%", "Mid-size petrol"],
          ["111–120", "15.25–16%", "Larger petrol / small diesel"],
          ["121–135", "16.75–19.25%", "Diesel saloon / compact SUV"],
          ["136–150", "20–25%", "Mid-size SUV / performance petrol"],
          ["151–170", "27.5–30%", "Large SUV / large diesel"],
          ["171–190", "35%", "Large premium SUV / V6"],
          ["Over 190", "41%", "Performance / luxury / large 4x4"],
        ]}
        caption="Condensed from Revenue's 20-band table. Confirm your exact band on Revenue.ie."
      />
      <P>
        The money difference is stark. On a €25,000 OMSP: a 95 g/km hybrid (12%)
        pays €3,000; a 145 g/km diesel SUV (21.5%) pays €5,375; a 195 g/km
        performance car (41%) pays €10,250 — plus the heaviest NOx levy.
      </P>

      <H2 id="nox">The NOx levy</H2>
      <P>
        Every petrol, diesel and hybrid pays an additional NOx levy on top of the
        CO₂ charge — a &ldquo;polluter pays&rdquo; sliding scale:
      </P>
      <UL>
        <CheckLI>First 40 mg/km: €5 per mg</CheckLI>
        <CheckLI>Next 40 mg/km (41–80): €15 per mg</CheckLI>
        <CheckLI>Above 80 mg/km: €25 per mg</CheckLI>
      </UL>
      <P>
        The levy is capped at <Strong>€600 for petrol</Strong> and{" "}
        <Strong>€4,850 for diesel</Strong>. Older diesels with no documented NOx
        figure are assessed at the highest assumed rate — a common, expensive
        surprise, and a strong reason to favour petrol/hybrid. Battery EVs produce
        zero NOx and pay nothing.
      </P>

      <H2 id="nedc-trap">The NEDC-to-WLTP trap</H2>
      <P>
        Cars first registered before roughly 2018–2020 often only carry an older
        &ldquo;NEDC&rdquo; CO₂ figure. Revenue won&rsquo;t use it directly — it
        applies a conversion that inflates the number into a
        &ldquo;WLTP-equivalent&rdquo;, which can push the car up a band.
      </P>
      <Callout title="Worked example" tone="amber">
        <p>
          A diesel showing <Strong>97 g/km</Strong> on old NEDC paperwork looks
          like an 11.25% car. Revenue&rsquo;s diesel formula is WLTP-equivalent =
          (NEDC × 1.1405) + 12.858 = <Strong>~123.5 g/km</Strong> — jumping it to
          the 16.75% band. On a €20,000 OMSP that&rsquo;s the difference between
          €2,250 and €3,350. Always check for a genuine WLTP figure on the
          Certificate of Conformity before buying.
        </p>
      </Callout>

      <H2 id="reliefs">Reliefs and the flat rates</H2>
      <UL>
        <CheckLI>
          <Strong>Battery EVs</Strong> — lowest 7% band, zero NOx, and up to
          €5,000 VRT relief until 31 December 2026 (tapering between €40,000 and
          €50,000 OMSP).
        </CheckLI>
        <CheckLI>
          <Strong>Cars over 30 years old</Strong> — a flat €200 VRT regardless of
          value or emissions (Category C).
        </CheckLI>
        <CheckLI>
          <Strong>Appealing the OMSP</Strong> — if Revenue&rsquo;s valuation is too
          high for the car&rsquo;s real Irish market value, you can appeal with
          evidence and cut the VRT directly.
        </CheckLI>
      </UL>
      <P>
        VRT is where model choice pays off most. To see which cars keep it lowest,
        read{" "}
        <InlineLink href="/blog/cheapest-cars-to-import-to-ireland">
          the cheapest cars to import to Ireland
        </InlineLink>
        ; to see VRT in the context of the full bill, see{" "}
        <InlineLink href="/blog/cost-of-importing-a-car-to-ireland">
          the cost of importing a car
        </InlineLink>{" "}
        or estimate yours with the{" "}
        <InlineLink href="/ireland-cost-calculator">
          import cost calculator
        </InlineLink>
        .
      </P>

      <Disclaimer />
    </>
  );
}
