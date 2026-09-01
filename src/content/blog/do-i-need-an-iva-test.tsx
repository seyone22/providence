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
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Most guides to Individual Vehicle Approval start by explaining the test.
        That is the second question. The first is whether your car needs one at
        all — and for a very large share of imported cars, it does not. Getting
        this answer right before you bid is worth several hundred pounds and
        several weeks.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Cars and minibuses with{" "}
            <Strong>eight passenger seats or fewer, over 10 years old</Strong>,
            do not need vehicle approval.
          </>,
          <>
            A car <Strong>already registered in the EU</Strong> uses its
            European Certificate of Conformity instead of a test.
          </>,
          <>
            An EU-registered <Strong>left-hand-drive</Strong> car also needs a
            GB conversion IVA certificate — £100, a form, not an inspection.
          </>,
          <>
            Exempt from approval is not the same as exempt from{" "}
            <Strong>needing approval to tax the car</Strong>. Read the CO₂ rule
            below.
          </>,
          <>
            A <Strong>seriously damaged</Strong> vehicle cannot be registered or
            taxed at all, and nothing you spend on approval comes back.
          </>,
        ]}
      />

      <H2 id="the-question">The question that decides the budget</H2>
      <P>
        Two identical Toyota Alphards land at Southampton on the same vessel.
        One is eleven years old and goes straight into the DVLA registration
        queue. The other is nine and needs an inspection, a headlamp conversion,
        a rear fog lamp, a test slot at one of eighteen centres in the country,
        and another month before it can legally be driven.
      </P>
      <P>
        Nothing about the cars differs. The age does. That is the whole reason
        this page exists, and it is why the approval question belongs in the
        buying decision rather than after it.
      </P>

      <H2 id="exempt">The exemption list in full</H2>
      <P>
        GOV.UK publishes a single list of vehicles that need no approval. Quoted
        in full, because partial quotations of it are where the misinformation
        comes from:
      </P>
      <UL>
        <CheckLI>
          Heavy goods vehicles (more than 3,500kg maximum weight){" "}
          <Strong>over 25 years old</Strong>
        </CheckLI>
        <CheckLI>
          Light goods vehicles (3,500kg maximum weight or less){" "}
          <Strong>over 10 years old</Strong>
        </CheckLI>
        <CheckLI>
          Cars and minibuses with 8 passenger seats or less (not including the
          driver) <Strong>over 10 years old</Strong>
        </CheckLI>
        <CheckLI>
          Buses, coaches and minibuses with more than 8 passenger seats built by
          a single manufacturer before 29 July 2010
        </CheckLI>
        <CheckLI>
          The same, with different body and chassis manufacturers, made before
          29 July 2011
        </CheckLI>
        <CheckLI>Tracked vehicles</CheckLI>
        <CheckLI>
          Vehicles designed and constructed for use on construction sites,
          quarries, ports and airports
        </CheckLI>
        <CheckLI>
          Vehicles designed and constructed for, and used by, the armed
          services, fire and rescue forces, or used in maintaining public order
        </CheckLI>
      </UL>
      <P>
        The third line is the one that matters to nearly every private importer,
        and it is the reason so much Japanese and Gulf stock is bought
        deliberately on the far side of ten years.
      </P>

      <H2 id="ten-year">Reading the 10-year rule properly</H2>
      <P>
        The exemption page says <em>over 10 years old</em>. The import guidance
        puts the same rule slightly differently —{" "}
        <em>first registered or manufactured more than 10 years ago</em> — and
        adds the word <em>might</em>: you <em>might</em> not need approval. Both
        are current GOV.UK wording as at 1 September 2026, and the difference is
        not pedantry.
      </P>
      <Callout
        title="Manufacture date, registration date, shipping date"
        tone="amber"
      >
        <p>
          A car manufactured in November 2015 and first registered in March 2016
          crosses the ten-year line at two different moments. If your purchase
          sits within a few months of the boundary, the date you rely on has to
          be the one you can <Strong>evidence</Strong> — and the document DVLA
          asks for is the original foreign registration certificate showing when
          the vehicle was manufactured.
        </p>
        <p>
          Do not plan an exemption around a car that will cross the line while
          it is at sea. Age is assessed for registration, but a six-week voyage
          is not a margin you want to be relying on if a document is queried.
        </p>
      </Callout>
      <P>
        Note also that the exemption is about approval, not about the rest of
        the process. A fifteen-year-old import still needs the{" "}
        <InlineLink href="/blog/registering-an-imported-car-in-the-uk">
          NOVA declaration, duty, VAT, MOT and DVLA pack
        </InlineLink>
        . It skips one step, not six.
      </P>

      <H2 id="eu-cars">Cars already registered in the EU</H2>
      <P>
        An EU-registered car is a different question again, because the approval
        already exists — it just has to be evidenced. GOV.UK: get a{" "}
        <Strong>European Certificate of Conformity</Strong> from the
        manufacturer to show you have approval for an EU-registered vehicle.
      </P>
      <P>
        If the manufacturer cannot or will not supply one, there is a paid
        route: DVSA charges <Strong>£100</Strong> for a{" "}
        <em>
          Mutual Recognition / EC Approved Vehicles without Certificate of
          Conformity
        </em>{" "}
        certificate. It is on the same published fee table as the inspection
        fees, and it is the cheapest line on it.
      </P>

      <H2 id="lhd">Left-hand drive and GB conversion IVA</H2>
      <P>
        A left-hand-drive vehicle registered in the EU needs the Certificate of
        Conformity <em>and</em> a certificate of{" "}
        <Strong>GB conversion Individual Vehicle Approval</Strong>. This is
        administered by the Vehicle Certification Agency rather than DVSA, on a
        form specific to the vehicle type — motorcycle, car, van or light goods
        vehicle, or motorhome — with a <Strong>£100 fee</Strong> and no
        inspection.
      </P>
      <Table
        head={["Vehicle", "Route", "Fee", "Inspection?"]}
        rows={[
          [
            <Strong key="a">EU-registered, RHD</Strong>,
            "European Certificate of Conformity",
            "Manufacturer's charge",
            "No",
          ],
          [
            <Strong key="b">EU-registered, RHD, no CoC available</Strong>,
            "Mutual recognition certificate (DVSA)",
            "£100",
            "No",
          ],
          [
            <Strong key="c">EU-registered, LHD</Strong>,
            "CoC plus GB conversion IVA (VCA)",
            "£100",
            "No",
          ],
          [
            <Strong key="d">Non-EU import, under 10 years</Strong>,
            "Individual Vehicle Approval (DVSA)",
            "£199 in working hours",
            "Yes",
          ],
          [
            <Strong key="e">Goods vehicle over 3,500kg from the EU</Strong>,
            "Full IVA — GB conversion is not available",
            "See the lorry fee table",
            "Yes",
          ],
        ]}
        caption="Approval routes and published fees. Sources: GOV.UK 'Getting vehicle approval' for imports and the DVSA IVA fee tables, checked 1 September 2026."
      />

      <H2 id="msva">When it is MSVA rather than IVA</H2>
      <P>
        If you are importing a single 2-wheeled, 3-wheeled or smaller 4-wheeled
        vehicle, the scheme is{" "}
        <Strong>Motorcycle Single Vehicle Approval</Strong>, not IVA. It is a
        parallel system with its own inspection and its own centre list, and the
        centre lists are not identical — some sites do IVA and not MSVA.
      </P>

      <H2 id="blocked">The cars that cannot be registered at all</H2>
      <P>
        One category has no route. GOV.UK: you cannot register or tax a{" "}
        <Strong>seriously damaged</Strong> vehicle, and if you pay for vehicle
        approval and then try, you will not be refunded.
      </P>
      <H3>How to spot one before you buy</H3>
      <P>
        For a UK car, serious damage means a Category A or B insurance
        write-off. For an imported car, GOV.UK says the registration certificate
        might say something like <em>statutory write-off</em>, <em>scrapped</em>{" "}
        or <em>non-repairable</em>. The advice is to check with the registration
        authority in the country the vehicle came from — and if it is not
        seriously damaged, to ask them for evidence of that in writing.
      </P>
      <Callout title="This is a buying check, not a shipping check" tone="sky">
        <p>
          A car with a non-repairable marker on its home registration is worth
          exactly its parts value in Britain, and you will find that out after
          you have paid freight, duty and VAT on it. Auction sheets and export
          certificates carry the markers; reading them is the point at which the
          money is saved. Our people check the source-market status before we
          bid, and a car that fails it does not ship.
        </p>
      </Callout>

      <H2 id="tax-trap">The exemption that still needs a certificate</H2>
      <P>
        Worth its own heading because it reverses the intuition. GOV.UK states
        that you will need vehicle approval <em>to tax your vehicle</em> if it
        was first registered on or after 1 March 2001 with EU type approval and
        it is either a light goods vehicle up to 3,500kg, or a car or minibus of
        eight passenger seats or fewer{" "}
        <Strong>with a CO₂ emissions figure in g/km</Strong>.
      </P>
      <P>
        The reason is the tax system rather than the safety system: the
        CO₂-based vehicle tax bands need a certified emissions figure, and the
        approval document is where it comes from. If you do not have one,
        DVLA&rsquo;s instruction is to send a letter with your application
        explaining why. It is not a wall — it is a step, and the letter is a
        step people miss.
      </P>

      <H2 id="answer">Working the answer for your car</H2>
      <P>In order, and stopping at the first line that fits:</P>
      <UL>
        <CheckLI>
          <Strong>Is it seriously damaged?</Strong> Then it cannot be
          registered. Stop.
        </CheckLI>
        <CheckLI>
          <Strong>Is it over 10 years old?</Strong> No approval needed — but
          check the CO₂ rule above before assuming there is no paperwork.
        </CheckLI>
        <CheckLI>
          <Strong>Was it registered in the EU?</Strong> Certificate of
          Conformity, plus GB conversion IVA if it is left-hand drive.
        </CheckLI>
        <CheckLI>
          <Strong>Has it ever been registered in the UK?</Strong> Voluntary IVA,
          not IVA.
        </CheckLI>
        <CheckLI>
          <Strong>Otherwise:</Strong>{" "}
          <InlineLink href="/blog/iva-test-explained">
            Individual Vehicle Approval
          </InlineLink>
          , at the fees set out in{" "}
          <InlineLink href="/blog/iva-test-cost">
            what an IVA test costs
          </InlineLink>
          .
        </CheckLI>
      </UL>
      <P>
        We run that sequence on a specific VIN before you commit, so the
        approval route and its cost are in the landed figure rather than in a
        phone call after the car has landed.
      </P>

      <Disclaimer>
        Exemptions, approval routes and fees are set by GOV.UK, DVSA and the
        Vehicle Certification Agency and are subject to change. Every rule and
        figure here was checked against the primary source on 1 September 2026.
        Confirm the position for your specific vehicle at{" "}
        <a
          href="https://www.gov.uk/vehicle-approval/exemptions-from-vehicle-approval"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          gov.uk/vehicle-approval
        </a>{" "}
        before committing to a purchase.
      </Disclaimer>
    </>
  );
}
