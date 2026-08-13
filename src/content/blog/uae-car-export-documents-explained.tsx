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
        A UAE export stands or falls on one document: the export certificate.
        Without it, your destination authority has no evidence the vehicle was
        lawfully released for export, and registration will normally be refused
        outright. Here is the whole file, what each part proves, and the one
        check that prevents the most common failure.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The <Strong>export certificate</Strong> is the keystone. No
            registration without it.
          </>,
          <>
            Deregistration and plate cancellation must happen{" "}
            <Strong>before</Strong> the certificate can be issued.
          </>,
          <>
            <Strong>Outstanding finance blocks everything.</Strong> Verify
            encumbrance before purchase.
          </>,
          <>
            Originals, not scans — and they should travel separately from the
            car.
          </>,
        ]}
      />

      <H2 id="the-set">The document set at a glance</H2>
      <Table
        head={["Document", "What it proves", "If it is missing"]}
        rows={[
          [
            <Strong key="u1">Export certificate</Strong>,
            "The vehicle was lawfully deregistered for export",
            "Registration refused at destination",
          ],
          [
            <Strong key="u2">Deregistration / plate cancellation</Strong>,
            "Registration and plates surrendered",
            "Export certificate cannot be issued",
          ],
          [
            <Strong key="u3">Customs clearance / export declaration</Strong>,
            "The export was declared through the free zone",
            "Hold at destination, storage charges daily",
          ],
          [
            <Strong key="u4">Commercial invoice</Strong>,
            "Transaction value for customs",
            "Valuation query, potential penalty",
          ],
          [
            <Strong key="u5">Chassis and engine verification</Strong>,
            "Vehicle identity matches the paperwork",
            "Identity query — the slowest kind to resolve",
          ],
          [
            <Strong key="u6">Bill of Lading</Strong>,
            "Title to the shipment",
            "Cannot take delivery",
          ],
          [
            <Strong key="u7">Inspection report</Strong>,
            "Condition at the point of export",
            "No evidence if the car arrives differently",
          ],
        ]}
      />

      <H2 id="export-certificate">The export certificate</H2>
      <P>
        Issued when a vehicle is deregistered in the Emirates specifically for
        export. It confirms the chassis number, engine details, ownership and
        that registration and plates have been cancelled — which together amount
        to proof that the car was lawfully released rather than simply removed
        from somebody&rsquo;s driveway.
      </P>
      <P>
        This is the document your destination authority will want to see first,
        and it is the one that cannot be reconstructed after the fact.
        Everything else in the file supports it.
      </P>

      <H2 id="dereg">Deregistration and plate cancellation</H2>
      <P>
        The export certificate is a <em>consequence</em> of deregistration, so
        deregistration has to happen first — and it cannot happen while there is
        anything outstanding against the vehicle:
      </P>
      <UL>
        <CheckLI>
          <Strong>Outstanding finance.</Strong> If a lender holds an interest,
          deregistration will fail. The interest has to be discharged and
          released first.
        </CheckLI>
        <CheckLI>
          <Strong>Unpaid fines or charges</Strong> registered against the
          vehicle.
        </CheckLI>
        <CheckLI>
          <Strong>Ownership inconsistencies</Strong> — the seller must be the
          registered owner or hold documented authority.
        </CheckLI>
      </UL>
      <Callout
        title="The check that prevents the most common failure"
        tone="amber"
      >
        <p>
          Verify ownership and encumbrance status <em>before</em> money changes
          hands, not before shipment. A car with an unresolved finance interest
          cannot be exported at all, and unwinding a completed purchase is far
          harder than declining it. We run this check on every UAE vehicle as
          step one.
        </p>
      </Callout>

      <H2 id="customs">Free-zone customs clearance</H2>
      <P>
        Vehicles bought for export move through an established free-zone regime,
        which is a large part of why the UAE clears cars faster than most of our
        network. The clearance produces the export declaration, and three fields
        on it matter most:
      </P>
      <UL>
        <CheckLI>
          <Strong>Declared value</Strong>, which must match the commercial
          invoice.
        </CheckLI>
        <CheckLI>
          <Strong>Consignee details</Strong>, exactly as your own customs
          authority expects them.
        </CheckLI>
        <CheckLI>
          <Strong>Vehicle identification</Strong>, matching the export
          certificate digit for digit.
        </CheckLI>
      </UL>
      <P>
        Any inconsistency between the declaration, the invoice and the Bill of
        Lading becomes a query at your port — and a query means the car sits
        while somebody in another time zone finds the original.
      </P>

      <H2 id="verification">Chassis and engine verification</H2>
      <P>
        A physical check that the chassis and engine numbers on the vehicle
        match the documents. It sounds like a formality and it is the check that
        prevents the worst outcome in international vehicle trade: a car whose
        identity does not match its paperwork.
      </P>
      <P>
        Identity queries are also the slowest kind to resolve, because they
        cannot be settled by sending a document — they require physical
        re-inspection, potentially on another continent. Verifying at origin
        costs almost nothing; discovering a mismatch at destination costs weeks.
      </P>

      <H2 id="shipping-docs">Bill of Lading and insurance</H2>
      <P>
        The Bill of Lading is the carrier&rsquo;s document and functionally
        title to the shipment — whoever holds the original negotiable copy can
        claim the car. Check it the day it arrives against the invoice and the
        export certificate.
      </P>
      <P>
        The marine insurance certificate should show cover at replacement value,
        door to port. On UAE stock this matters more than usual, because the
        cars are typically worth more: make sure the insured value reflects what
        the vehicle is actually worth rather than a nominal figure.
      </P>
      <Callout title="Send originals separately, always" tone="sky">
        <p>
          Originals should travel by tracked courier, separately from the
          vehicle, with the full scanned set issued to you at shipment. That way
          clearance preparation begins before the ship docks and nothing depends
          on one envelope. It is the cheapest precaution in importing and the
          most frequently skipped.
        </p>
      </Callout>
      <P>
        For the process end to end, see{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-the-uae">
          how to import a car from the UAE
        </InlineLink>
        ; for the numbers,{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-the-uae">
          what it costs
        </InlineLink>
        . Our <InlineLink href="/source-cars-from/uae">UAE office</InlineLink>{" "}
        handles the whole file locally.
      </P>

      <Disclaimer>
        UAE export procedures and free-zone requirements are set by the relevant
        Emirates authorities and change. Destination documentary requirements
        differ by country. This is a general guide rather than a compliance
        checklist — confirm the current position before committing to a
        purchase.
      </Disclaimer>
    </>
  );
}
