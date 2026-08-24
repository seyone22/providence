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
        A Japanese import is a paperwork exercise with a car attached. The
        vehicle can be flawless and the shipment can still stall at your port
        for weeks because one document is missing, uncertified or inconsistent
        with another. Here is every piece of the file, what each one actually
        proves, and which ones you cannot register the car without.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The <Strong>export certificate</Strong> is the keystone document —
            no registration without it.
          </>,
          <>
            The <Strong>auction sheet</Strong> is your condition evidence;
            insist on the original as issued.
          </>,
          <>
            The <Strong>Bill of Lading</Strong> is title to the shipment. Treat
            it like cash.
          </>,
          <>
            A required <Strong>pre-shipment inspection</Strong> missed in Japan
            cannot be fixed at your port.
          </>,
        ]}
      />

      <H2 id="why-it-matters">Why the file matters more than the car</H2>
      <P>
        Your customs authority has never seen the vehicle and will form its
        entire view of it from documents. Chassis number, engine model, first
        registration date, certified mileage, declared value and lawful release
        for export all come from paper. If two documents disagree — a mileage
        figure, a chassis digit, a declared value — the shipment goes into
        query, and query means storage charges accruing daily while somebody in
        another time zone finds the original.
      </P>
      <Callout
        title="The single cheapest precaution in importing"
        tone="emerald"
      >
        <p>
          Get the full scanned document set the moment the vessel departs, and
          have the originals sent by tracked courier separately from the car.
          That way clearance preparation starts before the ship docks, and
          nothing depends on one envelope arriving.
        </p>
      </Callout>

      <H2 id="export-certificate">The export certificate</H2>
      <P>
        Japan issues this when a vehicle is deregistered for export. It is the
        most important document in the file, and most authorities will not
        register an imported Japanese car without it plus a certified
        translation. It carries:
      </P>
      <UL>
        <CheckLI>
          <Strong>Chassis number and engine model</Strong> — the identity your
          customs entry will be checked against.
        </CheckLI>
        <CheckLI>
          <Strong>Date of first registration</Strong> — which is what age-limit
          rules are assessed on, not the model year.
        </CheckLI>
        <CheckLI>
          <Strong>Certified odometer reading at deregistration</Strong> — the
          official record of the car&rsquo;s mileage leaving Japan.
        </CheckLI>
        <CheckLI>
          <Strong>Dimensions and weight</Strong>, used for classification and
          sometimes for tax banding.
        </CheckLI>
      </UL>
      <P>
        The deregistration itself is what confirms the car has been lawfully
        released from Japanese registration — proof it was not simply removed
        from somebody&rsquo;s driveway.
      </P>

      <H2 id="auction-sheet">The auction sheet and translation</H2>
      <P>
        Not a legal requirement anywhere, and still the document you will refer
        to most. It is your independent evidence of the car&rsquo;s condition at
        the point of sale, and if the vehicle ever arrives differently from
        expectations it is what the conversation is based on.
      </P>
      <P>
        Insist on the <Strong>original as issued</Strong> — auction house name,
        lot number and date visible — alongside a full translation.
        Reproductions and retyped summaries circulate, and there is only one
        reason a seller prefers one over the other. Reading it properly is
        covered in{" "}
        <InlineLink href="/blog/japanese-auction-grades-explained">
          Japanese auction grades explained
        </InlineLink>
        .
      </P>

      <H2 id="bill-of-lading">The Bill of Lading</H2>
      <P>
        The shipping line&rsquo;s document, and functionally title to the
        shipment. It names the shipper, the consignee, the vessel, the ports and
        the vehicle, and whoever holds the original negotiable copy can claim
        the car at destination. That is why it is treated like a financial
        instrument rather than a receipt.
      </P>
      <P>
        Check three things the day you receive it: your name and address exactly
        as your customs authority expects them, the chassis number matching the
        export certificate digit for digit, and the declared value matching the
        invoice. A typo here is a clearance delay, and amendments take days.
      </P>

      <H2 id="inspections">Pre-shipment inspection certificates</H2>
      <P>
        A number of countries require an accredited inspection carried out{" "}
        <Strong>in Japan, before the vessel sails</Strong>, covering
        roadworthiness, mileage verification and sometimes radiation screening.
        The requirement is destination-specific and it is absolute: if your
        country mandates one and it was not done, the certificate cannot be
        produced retrospectively.
      </P>
      <Table
        head={["Document", "Required by", "Consequence if missing"]}
        rows={[
          [
            <Strong key="d1">Export certificate</Strong>,
            "Effectively every destination",
            "Cannot register the vehicle",
          ],
          [
            <Strong key="d2">Certified translation</Strong>,
            "Any non-Japanese-language authority",
            "Clearance query and delay",
          ],
          [
            <Strong key="d3">Bill of Lading (original)</Strong>,
            "The shipping line",
            "Cannot take delivery of the car",
          ],
          [
            <Strong key="d4">Pre-shipment inspection</Strong>,
            "Destination-specific",
            "Entry refused or heavy penalty; unfixable after sailing",
          ],
          [
            <Strong key="d5">Biosecurity cleaning certificate</Strong>,
            "Australasia, Pacific, many African markets",
            "Mandatory cleaning at port rates, plus delay",
          ],
          [
            <Strong key="d6">Auction sheet</Strong>,
            "Nobody officially",
            "No independent condition evidence",
          ],
        ]}
        caption="Requirements vary by destination and change; confirm yours before purchase rather than before shipment."
      />

      <H2 id="checklist">The document checklist</H2>
      <P>
        What should be in your hands before the vessel arrives, scanned, with
        originals in transit:
      </P>
      <UL>
        <CheckLI>Export certificate, with certified translation</CheckLI>
        <CheckLI>Deregistration confirmation</CheckLI>
        <CheckLI>Original auction sheet, with translation</CheckLI>
        <CheckLI>Commercial invoice at actual transaction value</CheckLI>
        <CheckLI>Bill of Lading</CheckLI>
        <CheckLI>Marine insurance certificate</CheckLI>
        <CheckLI>
          Any destination-mandated pre-shipment inspection certificate
        </CheckLI>
        <CheckLI>Biosecurity cleaning certificate, where applicable</CheckLI>
        <CheckLI>Our own multi-point inspection report and photographs</CheckLI>
      </UL>
      <P>
        One point worth stating plainly: the invoice must show the{" "}
        <Strong>actual transaction value</Strong>. Under-declaring to reduce
        duty is fraud, it is routinely detected by authorities who track market
        values, and the penalty lands at your own border rather than in Japan.
      </P>
      <P>
        For what the whole exercise costs, see{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-japan">
          what it really costs to import a car from Japan
        </InlineLink>
        , or see what our{" "}
        <InlineLink href="/source-cars-from/japan">Japan team</InlineLink>{" "}
        handles on your behalf.
      </P>

      <Disclaimer>
        Documentary requirements are set by the destination country and change
        without much notice. This is a general guide, not a compliance checklist
        for any specific market — confirm the current requirements with your
        national customs authority, which we do per shipment before purchase.
      </Disclaimer>
    </>
  );
}
