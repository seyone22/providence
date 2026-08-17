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
        Indian export paperwork is procedural rather than complicated. It is
        also unforgiving of small inconsistencies — and almost every delay we
        see on this route traces back to three documents disagreeing with each
        other rather than to anything going wrong with the ship. Here is the
        file, and the rule that prevents most problems.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The <Strong>shipping bill</Strong> is the export declaration that
            authorises the vehicle to leave.
          </>,
          <>
            Invoice, shipping bill and Bill of Lading must{" "}
            <Strong>agree exactly</Strong> on goods, value and consignee.
          </>,
          <>
            <Strong>Chassis and engine verification</Strong> prevents the
            slowest kind of query to resolve.
          </>,
          <>
            Customs value comes from the invoice. Under-declaring is fraud,
            detected at <em>your</em> border.
          </>,
        ]}
      />

      <H2 id="the-set">The document set at a glance</H2>
      <Table
        head={["Document", "What it does", "If it is wrong"]}
        rows={[
          [
            <Strong key="i1">Commercial invoice</Strong>,
            "Establishes the transaction value for customs",
            "Valuation query; penalty if under-declared",
          ],
          [
            <Strong key="i2">Packing list</Strong>,
            "Describes what is physically in the shipment",
            "Inspection at destination, delay",
          ],
          [
            <Strong key="i3">Shipping bill</Strong>,
            "Export declaration lodged with Indian customs",
            "Vehicle cannot be exported",
          ],
          [
            <Strong key="i4">Chassis / engine verification</Strong>,
            "Confirms vehicle identity matches the paperwork",
            "Identity query — slowest to resolve",
          ],
          [
            <Strong key="i5">Inspection certificate</Strong>,
            "Condition and, where mandated, pre-shipment compliance",
            "Entry refused in markets that require it",
          ],
          [
            <Strong key="i6">Bill of Lading</Strong>,
            "Title to the shipment",
            "Cannot take delivery of the vehicle",
          ],
          [
            <Strong key="i7">Insurance certificate</Strong>,
            "Cover in transit",
            "Uninsured loss",
          ],
        ]}
      />
      <Callout title="The one rule that prevents most delays" tone="emerald">
        <p>
          The invoice, the shipping bill and the Bill of Lading must describe{" "}
          <em>the same goods</em> at <em>the same value</em> to{" "}
          <em>the same consignee</em>. Every mismatch we have ever chased at a
          destination port has been a failure of that one rule.
        </p>
      </Callout>

      <H2 id="invoice">Commercial invoice and packing list</H2>
      <P>
        The invoice is the basis of your customs value, so it needs to be right
        in both senses: accurate, and complete. It should state the vehicle
        precisely — make, model, variant, year, chassis and engine numbers,
        colour — along with the transaction value, the currency, and the terms
        of sale.
      </P>
      <P>
        One point deserves emphasis because it is where buyers occasionally
        invite themselves into serious trouble. The invoice must show the{" "}
        <Strong>actual transaction value</Strong>. Under-invoicing to reduce
        duty is fraud, customs authorities routinely check against reference
        market values, and the consequences — penalties, seizure, a permanently
        flagged importer record — land at your own border, not in India. Every
        vehicle we export is invoiced at what was actually paid.
      </P>
      <P>
        On a multi-unit shipment, the packing list matters more than it sounds:
        it is what a destination inspector reads to confirm the container
        contains what the paperwork claims.
      </P>

      <H2 id="shipping-bill">The shipping bill</H2>
      <P>
        This is the export declaration lodged with Indian customs, and it is
        what authorises the vehicle to leave the country. It carries the
        exporter, the consignee, the goods description, the value, the
        destination and the classification.
      </P>
      <P>
        Two fields cause most of the trouble. The{" "}
        <Strong>classification</Strong> determines how your destination treats
        the vehicle for duty, and a mismatch between what India declared and
        what your customs authority expects produces a query. The{" "}
        <Strong>declared value</Strong> must match the invoice exactly — not
        approximately, and not in a different currency without a stated rate.
      </P>

      <H2 id="verification">Chassis and engine verification</H2>
      <P>
        A physical check that the numbers stamped on the vehicle match the
        numbers on the documents. It sounds like a formality, and it is the
        check that prevents the worst outcome in international vehicle trade: a
        car whose identity does not match its paperwork.
      </P>
      <P>
        Identity queries are also the slowest kind to resolve, because they
        cannot be settled by emailing a document — they require physical
        re-inspection, potentially on another continent, with the car accruing
        storage the whole time. Verifying at origin costs almost nothing.
      </P>

      <H2 id="inspection">The inspection certificate</H2>
      <P>
        Two separate things travel under this heading, and it is worth
        distinguishing them.
      </P>
      <UL>
        <CheckLI>
          <Strong>Mandated pre-shipment inspection.</Strong> Several markets
          require an accredited inspection carried out before the vessel sails,
          covering roadworthiness and sometimes compliance. If your country
          requires one and it was not done, it cannot be produced
          retrospectively — the shipment arrives non-compliant.
        </CheckLI>
        <CheckLI>
          <Strong>Our own inspection report.</Strong> Multi-point condition
          assessment, specification verification against your order, and
          photographs. Not legally required anywhere, and included on every
          vehicle regardless — because it is the evidence base if a car ever
          arrives differently from expectations.
        </CheckLI>
      </UL>
      <P>
        On multi-unit orders the specification verification is the important
        half. Silent substitution of trim or colour is the classic volume-import
        failure, and it is caught here or not at all — a point developed in{" "}
        <InlineLink href="/blog/importing-cars-from-india-for-dealers">
          our dealer guide
        </InlineLink>
        .
      </P>

      <H2 id="shipping-docs">Bill of Lading and insurance</H2>
      <P>
        The Bill of Lading is the carrier&rsquo;s document and functionally
        title to the shipment. Check it the day it arrives: chassis number
        against the invoice digit for digit, consignee name exactly as your
        customs authority expects it, declared value matching. Amendments are
        possible and slow.
      </P>
      <P>
        Originals should travel by tracked courier separately from the vehicle,
        with the full scanned set issued at shipment so clearance preparation
        can begin before the ship docks. This is the cheapest precaution in
        importing and the most frequently skipped.
      </P>
      <P>
        For the process end to end, see{" "}
        <InlineLink href="/blog/how-to-import-a-car-from-india">
          how to import a car from India
        </InlineLink>
        , and for what it all costs,{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-india">
          the landed-cost breakdown
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Indian export procedures and destination documentary requirements are
        set by the respective authorities and change. This is a general guide
        rather than a compliance checklist for any specific market — confirm
        current requirements before committing to a purchase.
      </Disclaimer>
    </>
  );
}
