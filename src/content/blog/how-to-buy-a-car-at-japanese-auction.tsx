import {
  Callout,
  CheckLI,
  Disclaimer,
  H2,
  InlineLink,
  KeyTakeaways,
  Lead,
  LI,
  OL,
  P,
  Strong,
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        Japan runs the largest and most transparent used-vehicle auction network
        on earth — well over a hundred thousand independently graded cars every
        week. It is also <Strong>completely closed to the public</Strong>. You
        cannot walk in, you cannot register online from abroad, and you cannot
        bid on your own behalf. Here is how the system actually works, what a
        buying agent does on the floor, and the seven steps between choosing a
        car and watching it load.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Japanese auctions are <Strong>trade-only</Strong>. Overseas buyers
            always bid through a licensed member.
          </>,
          <>
            Every car carries an{" "}
            <Strong>independent inspector&rsquo;s grade sheet</Strong> issued by
            the auction house, not the seller.
          </>,
          <>
            You set a <Strong>maximum bid</Strong>, not a purchase price. Losing
            an auction should cost you nothing.
          </>,
          <>
            The hammer price is roughly <Strong>half the landed cost</Strong> —
            fees, freight and destination taxes make up the rest.
          </>,
        ]}
      />

      <H2 id="who-can-bid">Who is actually allowed to bid</H2>
      <P>
        Japan&rsquo;s major used-vehicle auctions are trade exchanges. Bidding
        requires membership, membership requires a registered Japanese business
        with a dealer licence, a security deposit and a trading record, and the
        auction houses have no mechanism for admitting private individuals —
        domestic or foreign.
      </P>
      <P>
        That is not a loophole waiting to be found; it is the design. It also
        means every legitimate Japanese import involves a licensed member
        somewhere in the chain. The only real question is{" "}
        <Strong>how close that member is to you</Strong> — whether they are your
        agent, working to your brief, or an exporter selling you their own stock
        at their own margin.
      </P>
      <Callout title="Why we put staff in Japan" tone="sky">
        <p>
          Our Japan office holds auction access directly and bids to your
          instructions. Nobody in the chain is marking the car up before you see
          the price, and the person reading the sheet is reading it in Japanese
          rather than through a translation of a translation.
        </p>
      </Callout>

      <H2 id="the-network">How the auction network works</H2>
      <P>
        There is no single Japanese car auction. There are dozens of houses
        running weekly sales across the country, linked into a national
        electronic system. A member in Tokyo can bid on a car sitting in Fukuoka
        without either party moving. That is why the effective inventory is
        national rather than local, and why a specific model, grade and colour
        combination can usually be found somewhere within a few auction cycles.
      </P>
      <P>Each lot arrives with three things:</P>
      <UL>
        <CheckLI>
          <Strong>An inspection sheet.</Strong> Written by an inspector employed
          by the auction house, carrying an overall grade, an interior grade and
          a diagram marking every scratch, dent and repair.
        </CheckLI>
        <CheckLI>
          <Strong>A verified odometer reading.</Strong> Cross-referenced against
          the car&rsquo;s inspection history, with any inconsistency flagged on
          the sheet itself.
        </CheckLI>
        <CheckLI>
          <Strong>A start price and a reserve.</Strong> Bidding is fast — often
          seconds per lot — which is why the decision has to be made before the
          car crosses the block, not during.
        </CheckLI>
      </UL>
      <P>
        The grading is the part that makes the whole system work. Learning to
        read a sheet yourself is the single highest-value skill in this process,
        and we walk through it line by line in{" "}
        <InlineLink href="/blog/japanese-auction-grades-explained">
          Japanese auction grades explained
        </InlineLink>
        .
      </P>

      <H2 id="steps">The seven steps, start to finish</H2>
      <OL>
        <LI>
          <Strong>Brief.</Strong> Model, minimum grade, mileage ceiling, colour,
          budget and destination. Destination matters at this stage, not later —
          it determines age limits, emissions rules and mandatory inspections.
        </LI>
        <LI>
          <Strong>Shortlist.</Strong> We search the week&rsquo;s catalogues and
          send you the cars that match, each with its original sheet and a full
          English translation.
        </LI>
        <LI>
          <Strong>Landed quote.</Strong> For the cars you like, you get an
          all-in figure at a stated maximum bid: car, auction fees, inland
          transport, freight, insurance, duty and destination taxes.
        </LI>
        <LI>
          <Strong>Bid.</Strong> We bid up to your maximum and no further. If the
          car goes above it, we move to the next one.
        </LI>
        <LI>
          <Strong>Inspect.</Strong> The won car goes to our compound for a
          physical multi-point inspection, photographed in daylight. If it does
          not match its grade, it does not ship.
        </LI>
        <LI>
          <Strong>Clear for export.</Strong> Deregistration, export certificate
          with certified mileage, any pre-shipment inspection your country
          mandates, and the biosecurity clean where required.
        </LI>
        <LI>
          <Strong>Load and track.</Strong> RoRo or container from Yokohama,
          Nagoya, Osaka, Kobe or Hakata, under marine insurance, with vessel
          tracking to your port.
        </LI>
      </OL>

      <H2 id="bidding">How bidding and limits work</H2>
      <P>
        You are not buying a car at a price. You are authorising a{" "}
        <Strong>maximum bid</Strong> on a specific lot. The car may sell below
        your ceiling, in which case you pay less, or above it, in which case you
        buy nothing. Both outcomes are normal and both should be free of
        surprises.
      </P>
      <P>
        The discipline that matters here is setting the ceiling from the{" "}
        <em>landed</em> figure rather than the hammer price. A car that looks
        cheap at auction and expensive at your port has not saved you anything,
        and it is remarkably easy to talk yourself up two thousand pounds in the
        excitement of a live sale. Deciding the number in advance, in landed
        terms, is what keeps the exercise rational.
      </P>
      <Callout title="A losing bid should cost you nothing" tone="emerald">
        <p>
          Be explicit about this before you start. With us, an unsuccessful bid
          carries no fee — you are quoted per vehicle, and if we do not win it
          you owe nothing. Any arrangement where losing costs money deserves a
          hard look at why.
        </p>
      </Callout>

      <H2 id="costs">What sits on top of the hammer price</H2>
      <P>
        The hammer price is the beginning of the bill, not the end of it. In
        rough order:
      </P>
      <UL>
        <CheckLI>
          <Strong>Auction fees</Strong> charged by the house on every successful
          purchase.
        </CheckLI>
        <CheckLI>
          <Strong>Agent or buying fee</Strong> — ours is stated up front as a
          figure, not hidden inside a marked-up car price.
        </CheckLI>
        <CheckLI>
          <Strong>Inland transport</Strong> from the auction compound to the
          port, which varies with distance.
        </CheckLI>
        <CheckLI>
          <Strong>Ocean freight and marine insurance</Strong>, priced by route
          and by whether the car travels RoRo or in a container.
        </CheckLI>
        <CheckLI>
          <Strong>Destination duty, consumption tax and registration</Strong> —
          usually the largest single block, and entirely dependent on your
          country.
        </CheckLI>
      </UL>
      <P>
        The full breakdown, with a worked example, is in{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-japan">
          what it really costs to import a car from Japan
        </InlineLink>
        .
      </P>

      <H2 id="mistakes">The four mistakes that cost real money</H2>
      <UL>
        <CheckLI>
          <Strong>Bidding on the photographs.</Strong> Auction photographs are
          taken quickly, in poor light, to a formula. The sheet tells you the
          condition; the photographs tell you the colour.
        </CheckLI>
        <CheckLI>
          <Strong>Ignoring the destination rules until after the win.</Strong> A
          car that misses your country&rsquo;s age limit by two months, or that
          needed a pre-shipment inspection nobody arranged, is an expensive
          problem with no clean fix.
        </CheckLI>
        <CheckLI>
          <Strong>Chasing Grade 5 when Grade 4 is plenty.</Strong> The premium
          between grades is real and the visible difference is often marginal on
          a car that is going to be driven.
        </CheckLI>
        <CheckLI>
          <Strong>Choosing an exporter on the cheapest quote.</Strong> The
          cheapest quote is usually the one with the most omitted from it. Ask
          what is <em>not</em> included, in writing.
        </CheckLI>
      </UL>
      <P>
        If you would rather start from the cars than the process, our{" "}
        <InlineLink href="/source-cars-from/japan">
          Japan sourcing page
        </InlineLink>{" "}
        lists what our team buys most, and{" "}
        <InlineLink href="/blog/best-cars-to-import-from-japan">
          the best cars to import from Japan
        </InlineLink>{" "}
        goes through the models category by category.
      </P>

      <Disclaimer>
        Auction procedures, fee structures and destination import rules change,
        and requirements differ by auction house and by country. Confirm current
        eligibility, age limits and inspection requirements for your destination
        before committing to a purchase — we verify them per shipment as part of
        every quote.
      </Disclaimer>
    </>
  );
}
