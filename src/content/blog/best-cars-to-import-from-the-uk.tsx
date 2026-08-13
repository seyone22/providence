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
        There are two entirely separate reasons to buy a car in Britain, and
        confusing them is how people lose money. One is that the car was{" "}
        <Strong>built</Strong> there, which can change your duty bill. The other
        is that the British used market is deep enough to find exactly what you
        want. Both are good reasons. Only one of them survives contact with a
        customs officer.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>British-built:</Strong> Land Rover, Range Rover, Mini,
            Bentley, Rolls-Royce, Aston Martin, McLaren, Lotus, plus Nissan and
            Toyota volume models.
          </>,
          <>
            <Strong>The trap:</Strong> a German premium saloon bought in London
            is an EU-origin car for customs.
          </>,
          <>
            Britain&rsquo;s other advantage is{" "}
            <Strong>specification choice</Strong> — hold out for the exact car.
          </>,
          <>
            The UK is right-hand drive only. For LHD, look at the UAE or Japan.
          </>,
        ]}
      />

      <H2 id="two-reasons">Two different reasons to buy British</H2>
      <P>
        <Strong>Reason one: origin.</Strong> If your destination grants
        preferential tariff treatment to UK-manufactured goods, a genuinely
        British-built car can enter at a materially lower duty rate — provided
        the statement of origin is in the file. That is a saving measured in
        percentages of the vehicle&rsquo;s value.
      </P>
      <P>
        <Strong>Reason two: depth.</Strong> The UK used market is large,
        competitive and unusually well documented, so you can specify precisely
        rather than compromise. That is a saving measured in satisfaction, and
        occasionally in resale.
      </P>
      <P>
        Get reason one wrong and reason two will not save you. Establish build
        origin before you shortlist.
      </P>

      <H2 id="british-built">The genuinely British-built cars</H2>
      <Table
        head={["Marque", "Built at", "Why it travels well"]}
        rows={[
          [
            <Strong key="b1">Land Rover / Range Rover</Strong>,
            "Solihull, Halewood",
            "The luxury 4x4 category Britain invented. No credible substitute, and demand in every market we ship to.",
          ],
          [
            <Strong key="b2">Mini</Strong>,
            "Oxford",
            "The only small car with genuine global brand pull. Strong resale, cheap freight.",
          ],
          [
            <Strong key="b3">Bentley</Strong>,
            "Crewe",
            "Hand-built and individually specified — easiest to buy, and to verify the specification of, where it is made.",
          ],
          [
            <Strong key="b4">Rolls-Royce</Strong>,
            "Goodwood",
            "Bespoke commissions with full factory build records available.",
          ],
          [
            <Strong key="b5">Aston Martin</Strong>,
            "Gaydon, St Athan",
            "Low volume, documented histories, established export route.",
          ],
          [
            <Strong key="b6">McLaren / Lotus</Strong>,
            "Woking, Hethel",
            "Small-series performance cars where provenance is most of the value.",
          ],
          [
            <Strong key="b7">Nissan / Toyota volume models</Strong>,
            "Sunderland, Burnaston",
            "High-volume, cheap to buy, and UK-origin — which is where the duty advantage can genuinely pay.",
          ],
        ]}
      />

      <H2 id="luxury">Luxury and low-volume marques</H2>
      <P>
        For Bentley, Rolls-Royce, Aston Martin and McLaren, Britain is not
        merely the cheapest source — it is the best-informed one. Specification
        on these cars is close to infinite, and the difference between two
        apparently identical examples can be a five-figure options list. Buying
        in the country of manufacture means the build record, the dealer
        relationship and the specialist knowledge are all in the same place.
      </P>
      <Callout title="On these cars, specification is the asset" tone="sky">
        <p>
          Two same-year Continentals with different option packs are not the
          same car and will not resell for the same money. We verify the
          original build specification rather than the advert, because the
          advert is written by somebody who wants it sold.
        </p>
      </Callout>

      <H2 id="used-depth">Where the used market wins</H2>
      <P>
        Beyond origin, Britain&rsquo;s value is choice. The used premium market
        — BMW, Mercedes, Audi, Volkswagen, Volvo, Porsche — is large enough that
        a specific trim, drivetrain, colour and option combination is a
        realistic target rather than a fantasy. Add published MOT histories and
        a service-history culture and you can be genuinely selective.
      </P>
      <UL>
        <CheckLI>
          <Strong>Executive saloons and estates</Strong> with full main-dealer
          history, at prices reflecting a competitive market rather than
          scarcity.
        </CheckLI>
        <CheckLI>
          <Strong>Diesel estates and large MPVs</Strong>, which Britain has in
          quantity and many markets have not.
        </CheckLI>
        <CheckLI>
          <Strong>Manual-gearbox and enthusiast variants</Strong>, which survive
          in the UK market long after they disappear elsewhere.
        </CheckLI>
        <CheckLI>
          <Strong>Ex-fleet stock</Strong> with documented servicing to enforced
          schedules — often the best-value proposition in the whole market.
        </CheckLI>
      </UL>

      <H2 id="traps">The origin trap</H2>
      <H3>Buying a European car in Britain</H3>
      <P>
        A BMW, Mercedes, Audi or Volkswagen sold in the UK was almost certainly
        manufactured in the EU. For customs purposes it is an EU-origin vehicle
        regardless of where it spent its life, which means it may attract full
        duty in a market that would have granted preference to a British-built
        car. The used price can still be competitive — but the duty assumption
        is where people go wrong, and it is worth several thousand pounds.
      </P>
      <H3>Assuming right-hand drive suits you</H3>
      <P>
        The UK market is right-hand drive. That is ideal for RHD destinations
        and rules Britain out for most left-hand-drive markets. If you need LHD,
        the <InlineLink href="/source-cars-from/uae">UAE</InlineLink> has the
        deepest pool of nearly new left-hand-drive stock anywhere, and{" "}
        <InlineLink href="/source-cars-from/japan">Japan</InlineLink> supplies
        genuine factory LHD in premium segments.
      </P>
      <H3>Ignoring write-off markers</H3>
      <P>
        Categorised vehicles are legally repairable and re-registerable in
        Britain, and some are perfectly sound cars at fair prices. But several
        destination markets will not register a recorded write-off at all — so
        the marker has to be checked against your country&rsquo;s rules before
        purchase. How the categories work is in{" "}
        <InlineLink href="/blog/uk-car-history-checks-explained">
          UK car history checks explained
        </InlineLink>
        .
      </P>
      <P>
        For the numbers, see{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-the-uk">
          what it costs to import a car from the UK
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Manufacturing locations change as model ranges and plants are
        reorganised, and origin-preference entitlements depend on the trade
        arrangement between the UK and your destination. Confirm the build
        origin of the specific vehicle and the current tariff position before
        committing.
      </Disclaimer>
    </>
  );
}
