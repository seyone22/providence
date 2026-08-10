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
        Most of the UK export file is routine. One piece of it is worth roughly
        a tenth of the vehicle&rsquo;s value, and it is the piece people forget:
        proof that the car was actually manufactured in Britain. Here is the
        whole set, what each document does, and what happens when one is
        missing.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The <Strong>V5C</Strong> carries the permanent-export section that
            removes the car from UK registration.
          </>,
          <>
            The <Strong>export declaration</Strong> must be lodged correctly —
            errors surface as a hold at your port.
          </>,
          <>
            A <Strong>statement of origin</Strong> is the difference between
            paying duty and not, on a British-built car.
          </>,
          <>
            The <Strong>Bill of Lading</Strong> is title to the shipment. Check
            every field the day it arrives.
          </>,
        ]}
      />

      <H2 id="the-set">The document set at a glance</H2>
      <Table
        head={["Document", "What it proves", "If it is missing"]}
        rows={[
          [
            <Strong key="s1">V5C, export section completed</Strong>,
            "The vehicle has been notified as permanently exported",
            "Registration problems at both ends; seller retains liability",
          ],
          [
            <Strong key="s2">Customs export declaration</Strong>,
            "The export was lawfully declared",
            "Hold at destination, storage charges daily",
          ],
          [
            <Strong key="s3">Statement of origin</Strong>,
            "The car was manufactured in the UK",
            "Full duty assessed even on a British-built car",
          ],
          [
            <Strong key="s4">Commercial invoice</Strong>,
            "The transaction value for customs",
            "Valuation query and possible penalty",
          ],
          [
            <Strong key="s5">Bill of Lading</Strong>,
            "Title to the shipment",
            "Cannot take delivery of the vehicle",
          ],
          [
            <Strong key="s6">Provenance certificate</Strong>,
            "No finance, theft or write-off marker at purchase",
            "No evidence of clean title if ever questioned",
          ],
          [
            <Strong key="s7">Marine insurance certificate</Strong>,
            "Cover in transit",
            "Uninsured loss",
          ],
        ]}
      />

      <H2 id="v5c">The V5C and permanent export</H2>
      <P>
        The V5C is the UK vehicle registration document. It is not a title deed
        in the way people sometimes assume — it records the registered keeper
        rather than proving ownership — but it is the document every part of the
        export process starts from.
      </P>
      <P>
        It carries a section used to notify the authorities of{" "}
        <Strong>permanent export</Strong>. Completing and submitting it does two
        useful things: it removes the vehicle from UK registration, ending the
        seller&rsquo;s liability for road tax and enforcement notices, and it
        produces the clean deregistration position that your own authority will
        want to see. The remaining portion of the document travels with the car.
      </P>
      <Callout title="Do not let the V5C travel loose in the car" tone="amber">
        <p>
          Documents in a vehicle on a RoRo deck go missing. The registration
          document and every other original should travel by tracked courier,
          separately from the car, with the full scanned set issued to you at
          shipment.
        </p>
      </Callout>

      <H2 id="customs">The export declaration</H2>
      <P>
        Every vehicle leaving the UK for a destination outside the customs
        territory requires a declaration lodged by the exporter of record. In a
        managed import that is us rather than you, which matters because this is
        the least glamorous part of the process and the one where experience
        genuinely reduces risk.
      </P>
      <P>
        Three fields cause almost all the trouble: the{" "}
        <Strong>commodity classification</Strong>, the{" "}
        <Strong>declared value</Strong>, and the{" "}
        <Strong>consignee details</Strong>. Any of them inconsistent with the
        invoice or the Bill of Lading produces a query at the far end, and a
        query means the car waits while the meter runs.
      </P>

      <H2 id="origin">Proof of origin: the expensive one</H2>
      <P>
        This deserves its own section because of how much money rides on it.
        Where your destination grants preferential tariff treatment to
        UK-manufactured goods, that preference must be <em>claimed</em>, and a
        claim requires documentary proof that the vehicle was built in the UK.
      </P>
      <P>Two things follow, and both are counter-intuitive:</P>
      <UL>
        <CheckLI>
          <Strong>
            A genuinely British-built car with no origin statement pays full
            duty.
          </Strong>{" "}
          The entitlement exists; it is simply unprovable, and customs will not
          take your word for it.
        </CheckLI>
        <CheckLI>
          <Strong>
            A European-built car bought in Britain never qualifies
          </Strong>
          , no matter how long it was registered there or how British the plate
          looks.
        </CheckLI>
      </UL>
      <P>
        So build origin is established at shortlist stage, and the documentation
        is obtained at purchase. Doing it in the other order is how people
        discover a four-figure duty bill at their own port. Which marques are
        actually built in Britain is set out in{" "}
        <InlineLink href="/blog/best-cars-to-import-from-the-uk">
          the best cars to import from the UK
        </InlineLink>
        .
      </P>

      <H2 id="shipping-docs">Bill of Lading and insurance</H2>
      <P>
        The Bill of Lading is the carrier&rsquo;s document and functionally
        title to the shipment: whoever holds the original negotiable copy can
        claim the car. Check it the day it arrives, against the invoice and the
        registration document — chassis number digit for digit, consignee name
        exactly as your customs authority expects it, declared value matching.
        Amendments are possible and slow.
      </P>
      <P>
        The marine insurance certificate should show cover at replacement value,
        door to port, for the whole journey. Keep it with the Bill of Lading; if
        it is ever needed, it will be needed urgently.
      </P>

      <H2 id="missing">What happens when one is missing</H2>
      <UL>
        <CheckLI>
          <Strong>Missing origin statement:</Strong> full duty assessed. Usually
          irrecoverable after the fact.
        </CheckLI>
        <CheckLI>
          <Strong>Missing or late Bill of Lading:</Strong> the car sits at port
          accruing storage until the original arrives.
        </CheckLI>
        <CheckLI>
          <Strong>Inconsistent declared value:</Strong> valuation query,
          potential penalty, and a customs relationship you would rather not
          have started this way.
        </CheckLI>
        <CheckLI>
          <Strong>Export not notified:</Strong> the vehicle remains on UK
          registration, which complicates registration at your end and leaves
          the seller exposed.
        </CheckLI>
      </UL>
      <P>
        Every one of these is a documentation failure rather than a shipping
        failure, which is the encouraging part — they are all preventable before
        the car moves. The full process is in{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-the-uk">
          how to import a car from the UK
        </InlineLink>
        , and our{" "}
        <InlineLink href="/source-cars-from/united-kingdom">
          UK office
        </InlineLink>{" "}
        handles all of it as the exporter of record.
      </P>

      <Disclaimer>
        Export procedures, notification requirements and origin-preference rules
        are set by the UK authorities and by the trade arrangement with your
        destination, and both change. This is a general guide rather than a
        compliance checklist — confirm current requirements before committing to
        a purchase.
      </Disclaimer>
    </>
  );
}
