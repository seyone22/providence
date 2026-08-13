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
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Japan will sell you almost anything. That is the problem — the catalogue
        is so deep that the question stops being &ldquo;what is
        available?&rdquo; and becomes &ldquo;what is actually worth crossing an
        ocean for?&rdquo; The answer depends on three things: how much the car
        costs at auction, how much your country charges to let it in, and
        whether anyone near you can service it. Here is where those three line
        up.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Cheapest to land:</Strong> small hybrids — Aqua, Fit hybrid,
            Note e-Power.
          </>,
          <>
            <Strong>Best value nobody else offers:</Strong> the Alphard and
            Vellfire luxury MPVs.
          </>,
          <>
            <Strong>Strongest resale anywhere:</Strong> Land Cruiser, in every
            generation.
          </>,
          <>
            <Strong>The trap:</Strong> a rare model with no local parts supply
            is a cheap car with an expensive future.
          </>,
        ]}
      />

      <H2 id="what-makes-a-good-import">What makes a good import</H2>
      <P>
        Three filters, applied in this order. First,{" "}
        <Strong>auction price relative to your local market</Strong>: cars that
        are ordinary in Japan and unusual where you live carry the biggest
        arbitrage. Second,{" "}
        <Strong>how your country&rsquo;s tax regime treats it</Strong> — engine
        capacity, emissions and age bands can move the landed figure more than
        the purchase price does. Third, and most neglected,{" "}
        <Strong>parts and service availability at your end</Strong>.
      </P>
      <P>
        That third filter is what separates a good import from a clever-looking
        mistake. A car nobody local can service is not a bargain, however little
        you paid for it.
      </P>

      <H2 id="hybrids">Cheapest to land: the hybrids</H2>
      <P>
        Japan buys small hybrids in the numbers other countries buy superminis,
        which makes them ordinary — and ordinary is cheap. They are also compact
        enough to keep freight modest and efficient enough to sit in the lowest
        emissions band of most tax regimes. For a buyer whose main objective is
        the lowest possible landed cost, this is the category.
      </P>
      <UL>
        <CheckLI>
          <Strong>Toyota Aqua.</Strong> The default answer. Cheap at auction,
          genuinely frugal, and so widely sold across South Asia and Africa that
          parts and specialist knowledge are everywhere.
        </CheckLI>
        <CheckLI>
          <Strong>Toyota Prius.</Strong> Roomier, proven to very high mileage,
          and the drivetrain the whole hybrid industry learned from. Taxi fleets
          run these to numbers that would frighten most engines.
        </CheckLI>
        <CheckLI>
          <Strong>Honda Fit / Jazz hybrid.</Strong> The best packaging in the
          class — a genuinely useful boot inside a very small car.
        </CheckLI>
        <CheckLI>
          <Strong>Nissan Note e-Power.</Strong> A petrol engine that only
          generates electricity, so it drives like an EV without needing a
          charger. Underrated, and cheap.
        </CheckLI>
      </UL>

      <H2 id="family">Family: the MPVs Europe never got</H2>
      <P>
        This is Japan&rsquo;s most distinctive export category, because there is
        no substitute. Japanese manufacturers build luxury and family MPVs to a
        standard and a specification that were simply never offered in Europe,
        and buyers who discover them rarely go back to a seven-seat SUV.
      </P>
      <H3>Toyota Alphard and Vellfire</H3>
      <P>
        Captain&rsquo;s chairs, hybrid drivetrains, near-silent cabins and
        enough rear-seat space to work in. In markets where executive transport
        means a long-wheelbase German saloon, an Alphard does the job better for
        substantially less money — which is why they have become the default
        chauffeur vehicle across much of Asia and are spreading fast elsewhere.
      </P>
      <H3>Toyota Noah, Voxy and Esquire</H3>
      <P>
        Eight seats, sliding doors, a flat floor and hybrid options, in a
        footprint smaller than most three-row SUVs. For a family that actually
        uses all the seats, these are more practical than anything sold new in
        Europe at twice the price.
      </P>

      <H2 id="suvs">The 4x4s worth crossing an ocean for</H2>
      <P>
        Japanese 4x4s hold value in almost every market on earth, and the reason
        is supply rather than sentiment: demand exceeds what any local market
        can produce.
      </P>
      <UL>
        <CheckLI>
          <Strong>Toyota Land Cruiser</Strong> — 70, 200 and 300 Series. The
          most reliably re-sellable vehicle in this entire article. Japanese
          examples set the global benchmark for condition because of how they
          are maintained.
        </CheckLI>
        <CheckLI>
          <Strong>Land Cruiser Prado.</Strong> The same durability in a smaller,
          cheaper, more road-biased package. Enormously popular across Africa
          and South Asia.
        </CheckLI>
        <CheckLI>
          <Strong>Toyota Harrier and Honda Vezel.</Strong> Premium-feeling
          hybrid crossovers with running costs that make no sense for how
          substantial they feel. Consistently among our most-requested cars.
        </CheckLI>
        <CheckLI>
          <Strong>Lexus LX and RX.</Strong> Land Cruiser and Harrier engineering
          with a better cabin and a longer warranty history. Worth the premium
          if the specification is right.
        </CheckLI>
      </UL>

      <H2 id="performance">Performance and modern classics</H2>
      <P>
        Japan imposes no age limit on what it exports, so the pool runs from
        last season&rsquo;s model to cars now old enough to qualify for classic
        treatment in several markets. The famous names — GT-R, Supra, RX-7,
        Lancer Evolution, Impreza STI, NSX — all still surface at auction, and
        so do the kei sports cars that never officially left Japan.
      </P>
      <Callout title="Provenance is the whole game here" tone="amber">
        <p>
          Performance cars are the most modified and most misrepresented
          category in the market. On these, the auction sheet, service history
          and a physical inspection are not optional extras — they are the
          difference between an appreciating asset and somebody else&rsquo;s
          abandoned project. We do not buy a performance car without all three.
        </p>
      </Callout>

      <H2 id="commercial">Vans and commercials</H2>
      <P>
        Less glamorous and frequently the best money in the whole catalogue. The{" "}
        <Strong>Toyota Hiace</Strong> is the most durable light commercial
        vehicle in wide circulation and holds value accordingly; the{" "}
        <Strong>Toyota Probox and Succeed</Strong> are the small commercial
        estates that quietly run half the small businesses in several countries.
        For fleet buyers, these are usually a stronger proposition than any
        passenger car.
      </P>

      <H2 id="avoid">The ones that flatter to deceive</H2>
      <UL>
        <CheckLI>
          <Strong>Anything genuinely rare in your market.</Strong> If no local
          garage has seen one and no factor stocks the parts, a cheap purchase
          becomes an expensive ownership. This is the single most common import
          regret.
        </CheckLI>
        <CheckLI>
          <Strong>
            Large-capacity petrol engines into capacity-taxed markets.
          </Strong>{" "}
          A big V6 or V8 that is cheap at auction can attract more tax than the
          car costs. Check the band before you fall in love.
        </CheckLI>
        <CheckLI>
          <Strong>Kei cars, outside a handful of markets.</Strong> Charming,
          extremely cheap, and often not homologated for registration where you
          live. Confirm first.
        </CheckLI>
        <CheckLI>
          <Strong>Very low-grade cars bought on price.</Strong> Below Grade 3.5
          you are buying somebody else&rsquo;s deferred maintenance, and freight
          costs the same either way.
        </CheckLI>
      </UL>
      <P>
        Once you have a shortlist, the next question is what each candidate will
        actually cost to land —{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-japan">
          the full cost breakdown is here
        </InlineLink>
        . If you want to skip to the stock our{" "}
        <InlineLink href="/source-cars-from/japan">Japan team</InlineLink> is
        buying right now, that page lists it.
      </P>

      <Disclaimer>
        Model availability, auction pricing and destination tax treatment all
        change. Homologation and age-limit rules differ by country and can rule
        out specific models entirely — we confirm eligibility and model the
        landed cost for your destination before recommending a purchase.
      </Disclaimer>
    </>
  );
}
