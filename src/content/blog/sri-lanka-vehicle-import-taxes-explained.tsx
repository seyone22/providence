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
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Sri Lanka does not tax what you paid for the car. It taxes what it
        determines the car is worth, and then applies rates that depend on
        engine capacity, drivetrain and age. Once you understand that
        distinction, a great deal of confusing advice about Sri Lankan imports
        resolves itself — including why the cheapest car abroad is frequently
        not the cheapest car to land.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Duty and excise sit on a <Strong>customs valuation</Strong>, not on
            your invoice.
          </>,
          <>
            <Strong>Engine capacity bands</Strong> step up — crossing one can
            cost more than the extra capacity is worth.
          </>,
          <>
            <Strong>Drivetrain matters.</Strong> Petrol, hybrid and electric are
            not treated alike.
          </>,
          <>Rates change often. Verify before committing — always.</>,
        ]}
      />

      <H2 id="principle">The principle: value, not invoice</H2>
      <P>
        In many countries the customs value of an imported car starts from the
        transaction price on the invoice. Sri Lanka&rsquo;s approach places far
        more weight on an assessed value determined by customs, which means your
        negotiating skill at the point of purchase has less effect on the final
        bill than most buyers assume.
      </P>
      <P>
        This is not an anomaly to work around; it is the system working as
        designed, and it exists precisely to prevent under-invoicing. The
        practical implication is that the useful question is never &ldquo;how
        cheap can I buy this car?&rdquo; but{" "}
        <Strong>
          &ldquo;how will this specific vehicle be valued and banded?&rdquo;
        </Strong>
      </P>

      <H2 id="cif">What CIF means for you</H2>
      <P>
        Customs valuation on imported goods is conventionally built on a{" "}
        <Strong>CIF</Strong> basis — cost, insurance and freight — meaning the
        value of the goods plus what it cost to insure and ship them to the port
        of arrival.
      </P>
      <P>Two consequences worth internalising:</P>
      <UL>
        <CheckLI>
          <Strong>Freight and insurance are taxed too.</Strong> They form part
          of the base on which duty is calculated, so a cheaper sailing reduces
          your tax bill as well as your shipping bill.
        </CheckLI>
        <CheckLI>
          <Strong>Source country affects tax, not just price.</Strong> A
          shorter, cheaper route from India or the Gulf produces a lower CIF
          base than a longer one, for the same vehicle. It is a small effect,
          and it is real.
        </CheckLI>
      </UL>

      <H2 id="engine">Engine capacity bands</H2>
      <P>
        Sri Lanka&rsquo;s excise structure has long been banded by engine
        capacity, with the rate stepping up as capacity increases. The bands are
        steps rather than a smooth curve, which produces the single most
        important practical rule in Sri Lankan importing:
      </P>
      <Callout
        title="Crossing a band costs more than the engine is worth"
        tone="amber"
      >
        <p>
          A car that sits marginally above a capacity threshold can attract
          substantially more tax than one marginally below it, for a difference
          in performance you will never notice. Specification choice — not just
          model choice — is what moves the final figure, and it is worth
          deciding deliberately rather than by accident.
        </p>
      </Callout>
      <P>
        This is why Sri Lankan roads are full of small-capacity cars, and why a
        1.5-litre version of a model can be a completely different purchase from
        the 1.8-litre version of the same car.
      </P>

      <H2 id="drivetrain">Drivetrain treatment</H2>
      <P>
        Petrol, diesel, hybrid and electric vehicles have historically been
        treated differently, and the differences have been large enough to
        reshape the market. The dominance of the Toyota Aqua, Prius and Axio and
        the Honda Fit and Vezel on Sri Lankan roads is not a coincidence of
        taste — it is the visible result of a duty structure that favoured
        small-capacity hybrids.
      </P>
      <P>
        The important caveat is that this treatment has been revised more than
        once. What was favourable three years ago may not be favourable now, and
        the reverse is equally true. This is one of the specific things our
        Colombo team confirms before sourcing rather than assuming. More on the
        practical implications in{" "}
        <InlineLink href="/blog/importing-hybrids-and-evs-to-sri-lanka">
          importing hybrids and EVs to Sri Lanka
        </InlineLink>
        .
      </P>

      <H2 id="age">Age and depreciation</H2>
      <P>
        A vehicle&rsquo;s age affects the assessment in two directions at once,
        which is why it is easy to reason about badly.
      </P>
      <UL>
        <CheckLI>
          <Strong>Older cars are valued lower</Strong>, which reduces the base
          on which duty is calculated.
        </CheckLI>
        <CheckLI>
          <Strong>Age limits and age-related treatment</Strong> may apply,
          restricting eligibility or altering the rate.
        </CheckLI>
      </UL>
      <P>
        So the intuition that &ldquo;older is cheaper to import&rdquo; is only
        half right. There is generally a sweet spot — old enough for
        depreciation to have reduced the assessed value, young enough to remain
        comfortably eligible and to have useful life left. Where that sweet spot
        sits depends on the rules in force at the time, which is the recurring
        theme of this article.
      </P>

      <H2 id="modelling">How we model it before you buy</H2>
      <P>
        Because the tax structure dominates the outcome, we model the landed
        figure before recommending a vehicle rather than after sourcing one. The
        sequence:
      </P>
      <UL>
        <CheckLI>
          <Strong>Confirm the current position</Strong> with Sri Lanka Customs
          for that specific vehicle category, capacity and drivetrain.
        </CheckLI>
        <CheckLI>
          <Strong>Estimate the customs valuation</Strong> on a CIF basis for the
          actual route, not an average one.
        </CheckLI>
        <CheckLI>
          <Strong>Apply the current duty and excise treatment</Strong> for that
          band.
        </CheckLI>
        <CheckLI>
          <Strong>Compare across source countries</Strong> — Japan, Thailand,
          India and the UK — for the same specification.
        </CheckLI>
        <CheckLI>
          <Strong>Present the figure line by line</Strong>, so you can see which
          decisions are moving it.
        </CheckLI>
      </UL>
      <P>
        That last step matters more here than anywhere else we operate. When the
        tax structure is this influential, a total without a breakdown tells you
        nothing about which choice to change.
      </P>
      <P>
        The full import process is in{" "}
        <InlineLink href="/blog/importing-a-car-to-sri-lanka">
          importing a car to Sri Lanka
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Sri Lanka&rsquo;s vehicle duty and excise structure has been revised
        substantially and repeatedly, and continues to change. Nothing in this
        article states current rates, bands or eligibility, and it should not be
        relied on as doing so. Confirm the applicable position with Sri Lanka
        Customs for your specific vehicle before committing — our Colombo team
        does this per shipment.
      </Disclaimer>
    </>
  );
}
