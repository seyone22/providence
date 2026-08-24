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
        Thai exports come in two flavours with two different document files, and
        the distinction matters more than anywhere else in our network. A{" "}
        <Strong>new</Strong> vehicle was never registered in Thailand, so there
        is nothing to deregister and the file is short. A <Strong>used</Strong>{" "}
        one has to be released from Thai registration first — which is where
        nearly every delay on this route originates.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>New exports are the simpler file</Strong> — no
            deregistration step at all.
          </>,
          <>
            Used exports need{" "}
            <Strong>deregistration, ownership and finance clearance</Strong>{" "}
            first.
          </>,
          <>
            The <Strong>export entry</Strong> is the customs declaration that
            authorises departure.
          </>,
          <>
            <Strong>Fitted accessories must be declared</Strong> — they form
            part of the customs value.
          </>,
        ]}
      />

      <H2 id="the-set">The document set at a glance</H2>
      <Table
        head={["Document", "New", "Used", "What it does"]}
        rows={[
          [
            <Strong key="t1">Commercial invoice</Strong>,
            "Yes",
            "Yes",
            "Establishes transaction value for customs",
          ],
          [
            <Strong key="t2">Build / manufacturer documentation</Strong>,
            "Yes",
            "—",
            "Confirms specification as built",
          ],
          [
            <Strong key="t3">Deregistration</Strong>,
            "—",
            "Yes",
            "Releases the vehicle from Thai registration",
          ],
          [
            <Strong key="t4">Export entry</Strong>,
            "Yes",
            "Yes",
            "Customs declaration authorising departure",
          ],
          [
            <Strong key="t5">Chassis / engine verification</Strong>,
            "Yes",
            "Yes",
            "Confirms identity against the paperwork",
          ],
          [
            <Strong key="t6">Pre-shipment inspection</Strong>,
            "If required",
            "If required",
            "Destination-mandated compliance check",
          ],
          [
            <Strong key="t7">Bill of Lading</Strong>,
            "Yes",
            "Yes",
            "Title to the shipment",
          ],
        ]}
      />

      <H2 id="new-vs-used">New and used files differ</H2>
      <P>
        On a <Strong>new vehicle</Strong>, the supplying dealer issues the
        invoice and build documentation, the export entry is lodged, identity is
        verified and the car loads. There is no registration history to unwind
        because there is no registration history. This is why new Thai exports
        clear quickly and predictably.
      </P>
      <P>
        On a <Strong>used vehicle</Strong>, three things have to be settled
        before any of that can happen: the seller must be the registered owner
        or hold documented authority; any outstanding finance interest must be
        discharged and released; and the vehicle must be deregistered. Each is
        routine and each takes time.
      </P>
      <Callout title="Where used-export delays come from" tone="amber">
        <p>
          Almost always the finance check, and almost always because it was left
          until after the purchase. Verify ownership and encumbrance{" "}
          <em>before</em> money changes hands. Unwinding a completed purchase of
          a vehicle that cannot legally be exported is far harder than declining
          it in the first place.
        </p>
      </Callout>

      <H2 id="invoice">Invoice and packing list</H2>
      <P>
        The invoice establishes your customs value, so it must be accurate and
        complete: make, model, variant, year, chassis and engine numbers,
        colour, transaction value, currency and terms of sale.
      </P>
      <P>
        The Thailand-specific point is <Strong>accessories</Strong>. Anything
        fitted before shipment — canopy, tray, bar work, suspension, protection
        equipment — forms part of the vehicle&rsquo;s declared value for customs
        purposes and belongs on the invoice. Under-declaring fitted equipment is
        a valuation problem waiting at your own border, and some destinations
        additionally require specific equipment to be declared or approved for
        registration.
      </P>

      <H2 id="export-entry">The export entry</H2>
      <P>
        The declaration lodged with Thai customs, authorising the vehicle to
        leave. It carries the exporter, the consignee, the goods description,
        the classification, the value and the destination.
      </P>
      <P>
        The field that matters most here is the <Strong>classification</Strong>,
        because pickups sit on the boundary between passenger and commercial
        vehicle and different countries draw that line differently. A
        declaration that does not match how your destination will classify the
        vehicle produces a query on arrival. This is checked against your
        destination&rsquo;s rules before the declaration is lodged — the same
        check that drives the cost analysis in{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-thailand">
          what it costs to import a car from Thailand
        </InlineLink>
        .
      </P>

      <H2 id="verification">Chassis and engine verification</H2>
      <P>
        A physical check that the numbers stamped on the vehicle match the
        numbers on the documents. It prevents the worst outcome in international
        vehicle trade — a car whose identity does not match its paperwork — and
        it prevents the slowest kind of query to resolve, because identity
        questions cannot be settled by sending a document.
      </P>
      <P>
        On new vehicles this also serves as the point where the{" "}
        <Strong>as-built specification</Strong> is confirmed against your order.
        Trim, drivetrain, colour, wheels and fitted accessories are all checked
        line by line before the vehicle leaves the compound, which is the only
        stage at which a discrepancy is still a decision rather than a dispute.
      </P>

      <H2 id="shipping-docs">Bill of Lading and insurance</H2>
      <P>
        The Bill of Lading is the carrier&rsquo;s document and functionally
        title to the shipment — whoever holds the original negotiable copy can
        claim the vehicle. Check it against the invoice and the export entry the
        day it arrives:
      </P>
      <UL>
        <CheckLI>Chassis number, digit for digit</CheckLI>
        <CheckLI>
          Consignee name exactly as your customs authority expects it
        </CheckLI>
        <CheckLI>Declared value matching the invoice</CheckLI>
        <CheckLI>Vehicle description matching the export entry</CheckLI>
      </UL>
      <P>
        The marine insurance certificate should show replacement value, door to
        port. On a new accessorised vehicle, make sure the insured value
        includes the accessories — it is an easy thing to under-insure by the
        exact amount you spent making the vehicle useful.
      </P>
      <P>
        Originals travel by tracked courier separately from the vehicle, with
        the full scanned set issued at shipment. For the process end to end, see{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-thailand">
          how to import a car from Thailand
        </InlineLink>
        , or what our{" "}
        <InlineLink href="/source-cars-from/thailand">Thailand team</InlineLink>{" "}
        handles locally.
      </P>

      <Disclaimer>
        Thai export procedures and destination documentary requirements are set
        by the respective authorities and change. Commercial-vehicle
        classification criteria vary by country. This is a general guide rather
        than a compliance checklist — confirm current requirements before
        committing to a purchase.
      </Disclaimer>
    </>
  );
}
