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

export default function Body() {
  return (
    <>
      <Lead>
        Registering an imported car in Britain is six steps in a fixed order,
        and each one gates the next. You cannot pay the duty before the
        declaration, cannot get approval to count before the duty is paid, and
        cannot register before HMRC has confirmed the arrival. Miss the first
        step and the last one simply cannot happen — so the order is the thing
        to learn, not the forms.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            You have <Strong>14 days</Strong> from arrival to tell HMRC, and you
            cannot register until you have.
          </>,
          <>
            Used cars from outside the UK carry{" "}
            <Strong>10% duty and 20% VAT</Strong> — unless a trade agreement and
            valid proof of origin reduce the duty.
          </>,
          <>
            Approval comes next, and{" "}
            <Strong>cars over 10 years old need none</Strong>.
          </>,
          <>
            DVLA wants <Strong>originals, not copies</Strong> — including the
            foreign registration certificate, which you do not get back.
          </>,
          <>
            <Strong>£55</Strong> to register, then up to{" "}
            <Strong>six weeks</Strong> for the V5C before plates can be made.
          </>,
        ]}
      />

      <H2 id="sequence">The sequence, and why order matters</H2>
      <P>
        GOV.UK sets out two versions of the process depending on whether the car
        is shipped for you or you drive it in yourself. For anything arriving by
        vessel, the order is:
      </P>
      <Table
        head={["#", "Step", "Who does it", "The gate it opens"]}
        rows={[
          [
            "1",
            <Strong key="a">Import declaration</Strong>,
            "Shipping company or customs agent",
            "Lets the vehicle clear the border",
          ],
          [
            "2",
            <Strong key="b">Pay VAT and customs duty</Strong>,
            "Usually arranged by the agent at the border",
            "Nothing can be registered until this is paid",
          ],
          [
            "3",
            <Strong key="c">Tell HMRC within 14 days (NOVA)</Strong>,
            "You, your agent, or HMRC's CARS team",
            "Registration is blocked until NOVA is processed",
          ],
          [
            "4",
            <Strong key="d">Get vehicle approval</Strong>,
            "DVSA, VCA, or nobody if the car is exempt",
            "Produces the proof DVLA demands",
          ],
          [
            "5",
            <Strong key="e">Register and tax with DVLA</Strong>,
            "You, by post with original documents",
            "Produces a registration number",
          ],
          [
            "6",
            <Strong key="f">Insure it</Strong>,
            "You",
            "Legal use on the road",
          ],
        ]}
        caption="Source: GOV.UK, 'Importing vehicles into the UK', page content dated 10 December 2024. Checked 1 September 2026."
      />
      <Callout title="The car does not move in the meantime" tone="amber">
        <p>
          GOV.UK: you can be prosecuted if you use your vehicle on a public road
          before you complete these steps. There is exactly one exception —
          driving it to a pre-booked MOT or vehicle approval test. Everything
          else is a transporter.
        </p>
      </Callout>

      <H2 id="nova">Telling HMRC within 14 days</H2>
      <P>
        The Notification of Vehicle Arrivals declaration is the step people
        miss, and the consequence is stated plainly: you cannot register the
        vehicle until it is done, and you may be fined if you are late. Fourteen
        days from the vehicle arriving in the UK permanently.
      </P>
      <H3>Who makes the declaration</H3>
      <UL>
        <CheckLI>
          <Strong>VAT-registered company:</Strong> use the NOVA service
          directly, or a spreadsheet upload for volume.
        </CheckLI>
        <CheckLI>
          <Strong>Private individual, shipped vehicle:</Strong> your shipping
          company or customs agent can do it — they may charge extra — or
          HMRC&rsquo;s CARS team can do it on your behalf.
        </CheckLI>
        <CheckLI>
          <Strong>Bringing it in yourself:</Strong> contact HMRC&rsquo;s CARS
          team directly and tell them the circumstances.
        </CheckLI>
      </UL>
      <H3>What whoever makes it will need</H3>
      <UL>
        <CheckLI>
          The C88 and E2 customs documents, or your Movement Reference Number
        </CheckLI>
        <CheckLI>
          The invoice or bill of sale, if you bought the car in the last six
          months
        </CheckLI>
        <CheckLI>
          If you bought it more than six months ago, a{" "}
          <Strong>current valuation carried out in person in the UK</Strong> by
          a garage, dealership or other recognised business
        </CheckLI>
        <CheckLI>
          A copy of an official document confirming the VIN or chassis number —
          a registration document, title document or export certificate
        </CheckLI>
      </UL>
      <Callout title="A small engine skips this entirely" tone="sky">
        <p>
          If the vehicle has an engine of 48cc or less — 7.2kW or less if it is
          electric — GOV.UK allows registration without telling HMRC first. And
          a vehicle registered in the Isle of Man needs no NOVA application at
          all; you send DVLA a completed form V55 and the Isle of Man
          registration document instead.
        </p>
      </Callout>

      <H2 id="duty-vat">Duty and VAT at the border</H2>
      <P>
        VAT is charged on the total cost of the vehicle plus accessories bought
        with it, delivery and extra charges, and the customs duty. So duty is
        calculated first, and then VAT is charged on a figure that includes it.
      </P>
      <P>
        On 1 September 2026 the UK Integrated Online Tariff showed, for a used
        petrol car of 1,500–3,000cc, a{" "}
        <Strong>third-country duty rate of 10%</Strong> and{" "}
        <Strong>VAT at 20%</Strong>. Trade agreements change the duty line
        materially:
      </P>
      <Table
        head={["Origin", "Duty rate", "What it depends on"]}
        rows={[
          [
            <Strong key="a">No agreement (the default)</Strong>,
            "10%",
            "Nothing — this is the fallback",
          ],
          [
            <Strong key="b">
              Japan, EU, Australia, New Zealand, Canada and others
            </Strong>,
            "0%",
            "Valid proof of origin under the relevant agreement",
          ],
          [
            <Strong key="c">CPTPP members</Strong>,
            "2%",
            "Valid CPTPP origin claim",
          ],
          [
            <Strong key="d">
              Collectors' vehicle, 30+ years, original state
            </Strong>,
            "Reduced VAT route",
            "Classification under tariff heading 9705 — check with HMRC before buying",
          ],
        ]}
        caption="Source: UK Integrated Online Tariff, commodity 8703 23 90 00 (used), checked 1 September 2026. Rates depend on the correct commodity code for your specific vehicle."
      />
      <P>
        The 9705 route deserves a caution. Historical or ethnographic
        collectors&rsquo; vehicles at least thirty years old, in original state
        and without substantial changes to the chassis, body, steering, braking,
        transmission, engine or wings, can qualify for a reduced effective VAT
        rate — but modernised or modified vehicles are excluded, and
        HMRC&rsquo;s own advice is to email the Tariff Classification Service{" "}
        <Strong>before making a purchase</Strong> rather than argue it at the
        border.
      </P>
      <P>
        If you are VAT-registered you can reclaim the import VAT on your next
        VAT return. If you are not, it is a cost. Either way, GOV.UK is clear:
        you must pay any VAT and customs duty before you can register the
        vehicle.
      </P>

      <H2 id="approval">Proving the car is approved</H2>
      <P>
        Step four is where most of the variance in this process lives, and it is
        covered in full in{" "}
        <InlineLink href="/blog/do-i-need-an-iva-test">
          do you need an IVA test
        </InlineLink>
        . In summary:
      </P>
      <UL>
        <CheckLI>
          <Strong>Over 10 years old:</Strong> no approval needed, but read the
          CO₂ rule in that guide — you may still need approval evidence to{" "}
          <em>tax</em> the car.
        </CheckLI>
        <CheckLI>
          <Strong>EU-registered:</Strong> a European Certificate of Conformity,
          plus a GB conversion IVA certificate if it is left-hand drive.
        </CheckLI>
        <CheckLI>
          <Strong>Everything else:</Strong>{" "}
          <InlineLink href="/blog/iva-test-explained">
            Individual Vehicle Approval
          </InlineLink>
          , or MSVA for 2, 3 and small 4-wheeled vehicles.
        </CheckLI>
      </UL>
      <P>
        DVLA will not register the vehicle without proof of approval where
        approval is required, and if you believe an exemption applies, the
        instruction is to send a covering letter with the application explaining
        why you do not have one.
      </P>

      <H2 id="dvla">The DVLA pack</H2>
      <P>
        Originals only — GOV.UK says do not send photocopies or faxed copies.
      </P>
      <Table
        head={["Document", "When", "Note"]}
        rows={[
          [
            <Strong key="a">Proof of vehicle approval</Strong>,
            "Where approval is required",
            "The IAC, CoC or GB conversion certificate",
          ],
          [
            <Strong key="b">Form V267, 'declaration of newness'</Strong>,
            "New vehicles only",
            "",
          ],
          [
            <Strong key="c">Evidence of the collection date</Strong>,
            "Always",
            "The supplier's invoice does this",
          ],
          [
            <Strong key="d">Original foreign registration certificate</Strong>,
            "Always",
            "Shows the manufacture date. You will not get it back",
          ],
          [
            <Strong key="e">Form V627/3</Strong>,
            "If structurally modified beyond the manufacturer's specification",
            "",
          ],
        ]}
        caption="Source: GOV.UK, 'Registering an imported vehicle'. Checked 1 September 2026."
      />
      <P>
        If you do not have the original foreign registration certificate, DVLA
        might accept other proof of the manufacture date — a letter from the
        manufacturer or from a vehicle enthusiast club is named as an example.
        DVLA might also ask to inspect the vehicle.
      </P>
      <Callout title="The certificate you hand over is gone" tone="amber">
        <p>
          The original foreign registration certificate is not returned. If you
          may ever want to re-export the car to its home market, scan and
          photograph every page before it goes in the envelope — and keep the
          export certificate and the auction sheet with it. That file is worth
          real money at resale, and it cannot be reconstructed later.
        </p>
      </Callout>

      <H2 id="mot-tax">MOT, tax and the number plate</H2>
      <StatGrid
        stats={[
          { value: "£55", label: "DVLA first registration fee" },
          {
            value: "£54.85",
            label: "maximum a garage may charge for a car MOT",
          },
          { value: "3 yrs", label: "age at which a car first needs an MOT" },
          { value: "6 weeks", label: "for the V5C to arrive" },
        ]}
      />
      <P>
        You pay the £55 registration fee and tax the vehicle when you register
        it. Tax and MOT are linked: GOV.UK states you cannot renew vehicle tax
        if the MOT has expired, and a car needs an MOT by the third anniversary
        of its registration. For an import older than three years, that means
        the MOT belongs in the pre-registration plan, not after it.
      </P>
      <P>
        The MOT fee is a maximum, not a fixed price, and VAT is not charged on
        it. The V5C then takes up to six weeks to arrive, and you need it before
        number plates can be made up. That last wait is the one that surprises
        people who have already spent two months getting to it.
      </P>

      <H2 id="older">Where classics get an easier run</H2>
      <P>
        Age removes obligations one at a time, and the thresholds do not line up
        with each other:
      </P>
      <Table
        head={["Threshold", "What it removes", "Conditions"]}
        rows={[
          [
            <Strong key="a">Over 10 years old</Strong>,
            "Vehicle approval",
            "Cars and minibuses with 8 passenger seats or fewer",
          ],
          [
            <Strong key="b">Over 30 years old</Strong>,
            "Potentially, the full VAT rate",
            "Only via tariff heading 9705, original state, no substantial changes — confirm with HMRC first",
          ],
          [
            <Strong key="c">Over 40 years old</Strong>,
            "The annual MOT",
            "No substantial changes, such as a replacement chassis, body, axles or engine that changes how it works",
          ],
          [
            <Strong key="d">Built before 1 January 1986</Strong>,
            "Vehicle tax, from 1 April 2026",
            "Apply for the historic tax class; registration before 8 January 1986 works if the build date is unknown",
          ],
        ]}
        caption="Sources: GOV.UK vehicle approval exemptions, 'Historic (classic) vehicles: MOT and vehicle tax' (updated 24 January 2025) and the UK Integrated Online Tariff. Checked 1 September 2026."
      />
      <P>
        A 40-year MOT exemption is not an exemption from roadworthiness. GOV.UK
        keeps the obligation and the penalty: you must still keep the vehicle in
        a roadworthy condition, and using one in a dangerous condition can cost
        £2,500 and three penalty points.
      </P>

      <H2 id="where-we-fit">Where we fit in this</H2>
      <P>
        For cars we land in the United Kingdom, we file the NOVA declaration and
        prepare and submit the DVLA registration pack, and you get the full
        scanned document set when the vessel departs. Before that — before you
        commit to a car at all — we tell you which approval route it falls into
        and what that route costs, because it belongs in the landed number
        rather than in a discovery at the port.
      </P>
      <P>
        The parts of this you keep are the parts that are yours by law: the
        vehicle is registered in your name, and the duty, VAT and tax are
        charged to you as the registered owner. What you get from us is that
        none of it arrives as a surprise.
      </P>

      <Disclaimer>
        Import procedures, duty rates, VAT treatment and DVLA requirements are
        set by HMRC and DVLA and change. Every figure and rule on this page was
        checked against GOV.UK, the UK Integrated Online Tariff and DVSA sources
        on 1 September 2026, with the source page dated in each caption. Duty
        depends on the correct commodity code and on the origin evidence
        actually held. Confirm your position at{" "}
        <a
          href="https://www.gov.uk/importing-vehicles-into-the-uk"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          gov.uk/importing-vehicles-into-the-uk
        </a>{" "}
        before committing to a purchase.
      </Disclaimer>
    </>
  );
}
