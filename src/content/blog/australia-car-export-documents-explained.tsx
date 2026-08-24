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
        The Australian export file has one item most source countries do not: a
        cleaning certificate. It sounds trivial next to customs declarations and
        title documents, and it is the one most likely to stop your vehicle at
        the far end. Here is the whole set, in the order it is produced.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The <Strong>PPSR certificate</Strong> is your evidence of clean
            title. Keep it.
          </>,
          <>
            <Strong>Deregistration is state-administered</Strong> — the process
            differs by state.
          </>,
          <>
            The <Strong>biosecurity cleaning certificate</Strong> is what gets
            the car into New Zealand and the Pacific.
          </>,
          <>
            Originals travel by courier, separately from the vehicle. Always.
          </>,
        ]}
      />

      <H2 id="the-set">The document set at a glance</H2>
      <Table
        head={["Document", "What it proves", "If it is missing"]}
        rows={[
          [
            <Strong key="a1">PPSR certificate</Strong>,
            "No finance, write-off or theft marker at purchase",
            "No evidence of clean title if ever questioned",
          ],
          [
            <Strong key="a2">Proof of ownership</Strong>,
            "The seller had the right to sell",
            "Deregistration and export both fail",
          ],
          [
            <Strong key="a3">State deregistration</Strong>,
            "Registration cancelled, plates surrendered",
            "Complicates registration at destination",
          ],
          [
            <Strong key="a4">Customs export declaration</Strong>,
            "The export was lawfully declared",
            "Hold at destination, storage charges daily",
          ],
          [
            <Strong key="a5">Biosecurity cleaning certificate</Strong>,
            "The vehicle was cleaned of soil and plant material",
            "Mandatory cleaning at port rates, delay, possible refusal",
          ],
          [
            <Strong key="a6">Commercial invoice</Strong>,
            "Transaction value for customs",
            "Valuation query, potential penalty",
          ],
          [
            <Strong key="a7">Bill of Lading</Strong>,
            "Title to the shipment",
            "Cannot take delivery",
          ],
        ]}
      />

      <H2 id="ppsr">The PPSR certificate</H2>
      <P>
        The Personal Property Securities Register query is run before purchase,
        and the certificate it produces is worth keeping rather than discarding
        once the deal is done. It is documentary evidence that, at the time of
        purchase, the vehicle carried no registered security interest, no
        written-off marker and no theft report.
      </P>
      <P>
        If ownership is ever questioned at your end — and on an imported vehicle
        with a foreign history, that is a realistic possibility — this is the
        document that settles it. We run the check on every vehicle and include
        the certificate in the set that travels with the car.
      </P>

      <H2 id="ownership">Proof of ownership and deregistration</H2>
      <P>
        Registration in Australia is administered by the states rather than
        federally, which means there is no single national deregistration
        process. The forms, the plate-surrender requirements and the procedure
        all differ depending on where the vehicle is registered.
      </P>
      <P>It is procedural rather than difficult, but it has a prerequisite:</P>
      <UL>
        <CheckLI>
          <Strong>The seller must be the registered owner</Strong>, or hold
          documented authority to sell.
        </CheckLI>
        <CheckLI>
          <Strong>Any registered security interest must be discharged</Strong>{" "}
          before deregistration can proceed.
        </CheckLI>
        <CheckLI>
          <Strong>Outstanding state charges</Strong> against the vehicle must be
          settled.
        </CheckLI>
      </UL>
      <Callout title="Why the state variation matters to you" tone="sky">
        <p>
          A buyer who has deregistered vehicles in Queensland but not Western
          Australia will hit an unfamiliar process at exactly the wrong moment.
          It is a small argument for working with people who have done it in
          each state, and it is one of the practical reasons we have staff in
          the country rather than a phone number.
        </p>
      </Callout>

      <H2 id="customs">The export declaration</H2>
      <P>
        Lodged by the exporter of record with Australian customs. It carries the
        exporter, the consignee, the vehicle description, the classification and
        the declared value.
      </P>
      <P>
        The requirement is consistency: the declaration, the commercial invoice
        and the Bill of Lading must describe the same vehicle at the same value
        to the same consignee. A mismatch between any two of them becomes a
        query at your destination, and a query means the car waits while
        somebody in another time zone locates an original.
      </P>
      <P>
        The invoice must show the actual transaction value. Under-declaring to
        reduce duty is fraud, it is routinely detected, and the penalty lands at
        your own border.
      </P>

      <H2 id="cleaning">The biosecurity cleaning certificate</H2>
      <P>
        This is the distinctively Australian item and the one that catches
        first-time exporters. New Zealand, the Pacific islands and many African
        and Asian destinations enforce strict biosecurity rules on arriving
        vehicles, and they are enforced at the quayside rather than negotiated
        afterwards.
      </P>
      <P>What they are looking for:</P>
      <UL>
        <CheckLI>
          <Strong>Soil</Strong> in wheel arches, chassis rails, underbody
          cavities and tyre treads.
        </CheckLI>
        <CheckLI>
          <Strong>Seeds and plant material</Strong>, particularly in radiator
          grilles, roof racks and load beds.
        </CheckLI>
        <CheckLI>
          <Strong>Insects and organic residue</Strong> anywhere in the vehicle.
        </CheckLI>
      </UL>
      <P>
        A steam clean before departure costs a modest fixed sum and produces the
        certificate. Arriving without one means inspection, mandatory cleaning
        at port rates, and days of storage while it is arranged. On a touring
        4x4 that has been somewhere dusty and vegetated — which describes most
        of what makes Australian sourcing worthwhile — this is not a formality.
        The cost comparison is in{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-australia">
          what it costs to import a car from Australia
        </InlineLink>
        .
      </P>

      <H2 id="shipping-docs">Bill of Lading and insurance</H2>
      <P>
        The Bill of Lading is the carrier&rsquo;s document and functionally
        title to the shipment — whoever holds the original negotiable copy can
        claim the vehicle. Check the chassis number, consignee name and declared
        value against the invoice and export declaration the day it arrives.
      </P>
      <P>
        The marine insurance certificate should show replacement value door to
        port. On an equipped 4x4 this matters: make sure the insured value
        reflects the vehicle <em>with</em> its fitted equipment, not a
        base-model book figure. Fitted touring equipment can be a substantial
        share of what the vehicle is actually worth.
      </P>
      <P>
        Originals travel by tracked courier separately from the car, with the
        full scanned set issued at shipment. The wider process is in{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-australia">
          how to import a car from Australia
        </InlineLink>
        , handled by our{" "}
        <InlineLink href="/source-cars-from/australia">
          Australia team
        </InlineLink>
        .
      </P>

      <Disclaimer>
        State deregistration procedures, Australian export requirements and
        destination biosecurity rules are set by the respective authorities and
        change. This is a general guide rather than a compliance checklist —
        confirm current requirements before committing to a purchase.
      </Disclaimer>
    </>
  );
}
