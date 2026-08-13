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
        At Colombo, a missing document is not an inconvenience — it is a daily
        storage charge against a car you cannot touch. Clearance depends on a
        specific set of papers arriving complete, consistent and, where
        necessary, certified. Here is the whole file and the sequencing rule
        that prevents most delays.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The <Strong>Bill of Lading</Strong> is title to the shipment.
            Nothing moves without the original.
          </>,
          <>
            The <Strong>source-country export certificate</Strong> proves lawful
            release — with certified translation.
          </>,
          <>
            Invoice and <Strong>supporting valuation documentation</Strong>{" "}
            matter more here than in most markets.
          </>,
          <>
            <Strong>Documents ahead of the ship</Strong>, always. Storage
            accrues from day one.
          </>,
        ]}
      />

      <H2 id="the-set">The document set at a glance</H2>
      <Table
        head={["Document", "What it does", "If it is missing"]}
        rows={[
          [
            <Strong key="k1">Bill of Lading</Strong>,
            "Title to the shipment",
            "Cannot take delivery at all",
          ],
          [
            <Strong key="k2">Commercial invoice</Strong>,
            "Supports the customs valuation",
            "Valuation query and delay",
          ],
          [
            <Strong key="k3">Export certificate (source country)</Strong>,
            "Proves lawful release for export",
            "Registration refused",
          ],
          [
            <Strong key="k4">Certified translation</Strong>,
            "Makes non-English documents usable",
            "Documents cannot be accepted",
          ],
          [
            <Strong key="k5">Deregistration document</Strong>,
            "Vehicle removed from foreign registration",
            "Registration complications",
          ],
          [
            <Strong key="k6">Inspection certificate</Strong>,
            "Pre-shipment compliance, where required",
            "Non-compliant on arrival; unfixable",
          ],
          [
            <Strong key="k7">Customs declaration</Strong>,
            "The import entry itself",
            "No clearance process to progress",
          ],
        ]}
      />
      <Callout title="The sequencing rule" tone="emerald">
        <p>
          Originals travel by tracked courier{" "}
          <em>ahead of or separately from</em> the vessel, with the full scanned
          set issued at the point of shipment. Clearance preparation then begins
          before the ship docks. This is the single cheapest precaution
          available on this route and the most frequently skipped.
        </p>
      </Callout>

      <H2 id="bl">The Bill of Lading</H2>
      <P>
        The carrier&rsquo;s document and functionally title to the shipment:
        whoever holds the original negotiable copy can claim the vehicle.
        Nothing else in the file substitutes for it, and a copy will not do.
      </P>
      <P>Check three fields the day it arrives:</P>
      <UL>
        <CheckLI>
          <Strong>Consignee name</Strong> exactly as it will appear on the
          customs declaration and, ultimately, the registration.
        </CheckLI>
        <CheckLI>
          <Strong>Chassis number</Strong>, digit for digit against the export
          certificate.
        </CheckLI>
        <CheckLI>
          <Strong>Declared value</Strong>, matching the commercial invoice.
        </CheckLI>
      </UL>
      <P>
        Amendments are possible and slow, and slow means the vessel arrives
        before the correction does.
      </P>

      <H2 id="invoice">Invoice and valuation support</H2>
      <P>
        This carries more weight in Sri Lanka than in many markets, because duty
        and excise are assessed on a customs valuation rather than simply
        accepting the invoice figure. The invoice and its supporting
        documentation are what the valuation conversation starts from.
      </P>
      <P>
        The invoice should state the vehicle precisely — make, model, variant,
        year, chassis and engine numbers, colour — along with the transaction
        value, currency and terms of sale. Supporting documentation from the
        source purchase strengthens the position.
      </P>
      <P>
        And the obvious point that occasionally needs stating: the invoice must
        show the actual transaction value. Under-invoicing is fraud, it is
        detected, and the consequences land at Colombo rather than at the
        source. How valuation actually works is in{" "}
        <InlineLink href="/blog/sri-lanka-vehicle-import-taxes-explained">
          Sri Lanka vehicle import taxes explained
        </InlineLink>
        .
      </P>

      <H2 id="origin-docs">Source-country export documents</H2>
      <P>
        Whichever office the vehicle comes from, it must arrive with proof that
        it was lawfully released for export in that country:
      </P>
      <UL>
        <CheckLI>
          <Strong>From Japan:</Strong> the export certificate with certified
          odometer reading, plus deregistration. Requires certified translation.{" "}
          <InlineLink href="/blog/japan-car-export-documents-explained">
            Detail here
          </InlineLink>
          .
        </CheckLI>
        <CheckLI>
          <Strong>From Thailand:</Strong> the export entry, plus deregistration
          on used vehicles. New vehicles carry build documentation instead.
        </CheckLI>
        <CheckLI>
          <Strong>From India:</Strong> the shipping bill and chassis
          verification.
        </CheckLI>
        <CheckLI>
          <Strong>From the UK:</Strong> permanent export notification and the
          customs export declaration.
        </CheckLI>
      </UL>
      <P>
        <Strong>Translation is not optional.</Strong> A Japanese export
        certificate requires a certified translation to be usable for clearance
        and registration, and an uncertified one is not a substitute.
        Translations are arranged at origin as part of the document set rather
        than left as a problem to solve after arrival.
      </P>

      <H2 id="inspection">Inspection certificates</H2>
      <P>
        Where a pre-shipment inspection is required, it must be carried out in
        the source country before the vessel sails. This is worth repeating
        because it is the one failure with no remedy: an inspection that should
        have happened in Japan cannot be produced at Colombo afterwards.
      </P>
      <P>
        Separately, every vehicle we ship carries our own inspection report and
        photographs from the origin office, whether or not one is legally
        required. On this route particularly, a car that fails on arrival is an
        expensive problem — so the evidence base is established before it sails.
      </P>

      <H2 id="registration">Customs declaration and registration</H2>
      <P>
        The customs declaration is the import entry itself, lodged against the
        document set. The clearance sequence runs: lodgement, valuation, duty
        and excise assessment, payment, release. Registration paperwork follows,
        and then the vehicle is plated.
      </P>
      <P>
        Our Colombo team handles this in person and walks you through the
        assessment line by line rather than presenting a total — which on a
        market where the tax structure dominates the outcome is the difference
        between understanding your bill and simply paying it. The wider process
        is in{" "}
        <InlineLink href="/blog/importing-a-car-to-sri-lanka">
          importing a car to Sri Lanka
        </InlineLink>
        , handled by our{" "}
        <InlineLink href="/source-cars-from/sri-lanka">
          Colombo office
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Sri Lankan documentary and clearance requirements change, as do
        source-country export procedures. This is a general guide rather than a
        compliance checklist — confirm the current requirements with Sri Lanka
        Customs for your specific vehicle before committing to a purchase.
      </Disclaimer>
    </>
  );
}
