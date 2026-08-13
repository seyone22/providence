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
        The UK is the cheapest source country in our network for one group of
        buyers and a middling one for everybody else, and the reason is simple
        geography. If you are in Ireland or mainland Europe, the freight leg is
        measured in hours. If you are in East Africa, it is measured in weeks.
        Here is the whole bill, and where the line falls.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Freight is the swing factor: <Strong>days to Ireland</Strong>, weeks
            to everywhere else.
          </>,
          <>
            VAT treatment depends on the seller and the export evidence — never
            assume a saving.
          </>,
          <>
            <Strong>Origin</Strong> can change your destination duty more than
            any negotiation on price.
          </>,
          <>
            Provenance checks and inspection are small lines that prevent large
            ones.
          </>,
        ]}
      />

      <H2 id="structure">How the total is built</H2>
      <P>Four blocks, in ascending order of how much they vary:</P>
      <UL>
        <CheckLI>
          <Strong>UK-side costs</Strong> — purchase, checks, inspection, inland
          transport, documentation. Predictable.
        </CheckLI>
        <CheckLI>
          <Strong>VAT position</Strong> — either a real saving or nothing at
          all, depending on the transaction.
        </CheckLI>
        <CheckLI>
          <Strong>Freight and insurance</Strong> — varies by an order of
          magnitude across destinations.
        </CheckLI>
        <CheckLI>
          <Strong>Destination duty and tax</Strong> — the largest block for most
          buyers, and the one origin rules can halve.
        </CheckLI>
      </UL>

      <H2 id="in-the-uk">Costs inside the UK</H2>
      <UL>
        <CheckLI>
          <Strong>Purchase price</Strong>, plus a buyer&rsquo;s premium if
          bought at trade auction.
        </CheckLI>
        <CheckLI>
          <Strong>Provenance check</Strong> — trivial in cost and the best value
          in the whole exercise.
        </CheckLI>
        <CheckLI>
          <Strong>Physical inspection</Strong> by our own buyer, with
          photographs and an underbody report.
        </CheckLI>
        <CheckLI>
          <Strong>Inland transport</Strong> to the port or ferry terminal.
          Small, because Britain is small.
        </CheckLI>
        <CheckLI>
          <Strong>Export documentation</Strong> — permanent export notification,
          customs declaration and, where relevant, proof of origin.
        </CheckLI>
      </UL>
      <P>
        Notice how modest most of these are. Britain&rsquo;s cost structure is
        genuinely favourable at the source end — the variables that matter are
        VAT, freight and destination tax.
      </P>

      <H2 id="vat">The VAT question</H2>
      <P>
        This causes more confusion than any other line, so let us be precise. UK
        VAT recovery on an exported vehicle is <Strong>not automatic</Strong>{" "}
        and is not a function of your intention to export. It depends on:
      </P>
      <UL>
        <CheckLI>
          <Strong>Who is selling.</Strong> A VAT-registered vendor selling a
          qualifying vehicle for export is in a different position from a
          private individual selling their own car — the latter carries no
          recoverable VAT at all.
        </CheckLI>
        <CheckLI>
          <Strong>Whether the vehicle is a qualifying one.</Strong> Not every
          used car in the UK carries recoverable VAT; many are sold on a margin
          basis where there is nothing to reclaim.
        </CheckLI>
        <CheckLI>
          <Strong>Whether correct evidence of export is held</Strong>, in the
          required form and within the required time.
        </CheckLI>
      </UL>
      <Callout title="Treat it as zero until proven otherwise" tone="amber">
        <p>
          The safe approach is to model the landed cost with no VAT saving and
          treat any recovery as upside. Quotes built on an assumed VAT saving
          that later fails to materialise are a common and entirely avoidable
          disappointment. Ours state the position explicitly.
        </p>
      </Callout>

      <H2 id="freight">Ferry vs container vs RoRo</H2>
      <Table
        head={["Route", "Method", "Relative cost"]}
        rows={[
          [
            "Ireland",
            "Roll-on ferry",
            "Lowest in our entire network. Daily sailings, hours in transit.",
          ],
          [
            "Mainland Europe",
            "Short-sea ferry or road",
            "Very low. Days rather than weeks.",
          ],
          [
            "Africa, Middle East, Caribbean",
            "Deep-sea RoRo",
            "Moderate. Several times the European figure.",
          ],
          [
            "High-value or multi-car",
            "Container",
            "Highest per unit alone; competitive when two or more cars share a box.",
          ],
        ]}
        caption="Sailing frequency for your specific route affects total time more than the choice of port does."
      />
      <P>
        Marine insurance sits on top and should cover replacement value door to
        port. It is a small line and declining it is a false economy.
      </P>

      <H2 id="destination">Duty, tax and the origin rule</H2>
      <P>
        For most buyers this is the biggest single block, and it is where the UK
        can be either the smartest or the most expensive choice available.
      </P>
      <P>
        If your destination grants preferential tariff treatment to
        UK-manufactured goods, a genuinely British-built car with a valid
        statement of origin can enter at a materially lower rate. Without that
        document, the same car pays full duty. And a European-built car bought
        in Britain never qualifies at all, however long it lived there.
      </P>
      <P>
        On top of duty comes your consumption tax — usually charged on the value{" "}
        <em>plus</em> the duty — and then any registration or excise charge,
        which may be banded by emissions, capacity or age. Which cars are
        actually British-built is set out in{" "}
        <InlineLink href="/blog/best-cars-to-import-from-the-uk">
          the best cars to import from the UK
        </InlineLink>
        .
      </P>

      <H2 id="example">A worked comparison</H2>
      <P>
        Take the same £20,000 used premium SUV, and change only the destination
        and the build origin. Illustrative structure rather than a quote:
      </P>
      <Table
        head={["Scenario", "Freight share", "Duty position", "Net effect"]}
        rows={[
          [
            "British-built, to Ireland",
            "Very low",
            "Preference available with origin proof",
            "The best case. UK is hard to beat here.",
          ],
          [
            "EU-built, to Ireland",
            "Very low",
            "No UK-origin preference",
            "Freight still wins; duty erases part of it.",
          ],
          [
            "British-built, to East Africa",
            "High",
            "Depends on local tariff schedule",
            "Japan is often cheaper for equivalent stock.",
          ],
          [
            "Low-volume British marque, anywhere",
            "High",
            "Secondary consideration",
            "UK wins on availability and provenance regardless.",
          ],
        ]}
      />
      <P>
        The pattern: the UK wins on <Strong>proximity</Strong> and on{" "}
        <Strong>cars only Britain has</Strong>. For ordinary used stock going a
        long way, compare it honestly against{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-japan">
          the Japanese route
        </InlineLink>{" "}
        before committing.
      </P>

      <Disclaimer>
        Costs and tax treatment above are illustrative of structure only and are
        not a quote. VAT recovery, duty rates and origin-preference entitlements
        depend on the specific transaction, vehicle and destination, and change.
        Confirm the current position with the relevant authorities before
        committing.
      </Disclaimer>
    </>
  );
}
