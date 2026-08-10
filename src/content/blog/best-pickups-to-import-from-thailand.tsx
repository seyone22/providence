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
        Six pickups dominate Thai production, four SUVs are built on their
        bones, and the differences between them matter more than the badges
        suggest. This is an honest comparison of which suits which job — not a
        ranking, because a mining fleet and a family buying a weekend tow
        vehicle should not choose the same truck.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>Hilux and D-Max</Strong> have the strongest fleet
            reputations and the widest parts networks.
          </>,
          <>
            <Strong>Ranger</Strong> is the most capable and best equipped, and
            the most complex.
          </>,
          <>
            <Strong>Triton and BT-50</Strong> are the value plays.
          </>,
          <>
            The SUV versions share frames and drivetrains — durability with
            seven seats, minus the payload.
          </>,
        ]}
      />

      <H2 id="how-to-choose">How to choose between them</H2>
      <P>
        Start with the duty cycle, not the specification sheet. Four questions
        settle most decisions:
      </P>
      <UL>
        <CheckLI>
          <Strong>Will it actually work?</Strong> A vehicle carrying loads daily
          on poor surfaces wants different things from one that mostly commutes.
        </CheckLI>
        <CheckLI>
          <Strong>Who will service it?</Strong> Parts network depth in{" "}
          <em>your</em> market decides more of your five-year cost than the
          purchase price does.
        </CheckLI>
        <CheckLI>
          <Strong>How is it taxed where you are?</Strong> Engine capacity and
          commercial classification can move the landed figure more than trim
          choice.
        </CheckLI>
        <CheckLI>
          <Strong>How much complexity do you want?</Strong> More electronics
          means more capability and more to go wrong a long way from a dealer.
        </CheckLI>
      </UL>

      <H2 id="hilux">Toyota Hilux Revo</H2>
      <P>
        The default answer, and defaults become defaults for reasons. The Hilux
        has the broadest parts network of any vehicle in this article — there
        are very few places on earth where a Hilux part is genuinely hard to
        find — and a reputation for surviving neglect that fleets and aid
        organisations have relied on for decades.
      </P>
      <P>
        It is not the most capable or the best equipped. Higher-trim Rangers
        out-specify it comfortably and ride better. What the Hilux offers
        instead is the highest probability that the vehicle is working in five
        years, and the strongest resale in almost every market. For a working
        vehicle far from a dealer network, that is usually the right trade.
      </P>

      <H2 id="ranger">Ford Ranger</H2>
      <P>
        The most car-like to drive, the best equipped in higher trims, and the
        most capable in Raptor and Wildtrak form. If the vehicle is a family
        vehicle as much as a work vehicle, the Ranger is the one people actually
        enjoy.
      </P>
      <Callout title="The complexity trade-off" tone="amber">
        <p>
          More electronics, more driver assistance and more sophisticated
          suspension mean more capability and more that requires a diagnostic
          tool to fix. In markets with a strong Ford network that is a
          non-issue. Where the network is thin, it is worth weighing against a
          simpler truck.
        </p>
      </Callout>

      <H2 id="dmax">Isuzu D-Max and Mazda BT-50</H2>
      <P>
        The D-Max is the fleet operator&rsquo;s quiet favourite: mechanically
        straightforward, economical, and built around a diesel engine with a
        strong reputation for durability. It out-lasts its reputation, largely
        because it has never been marketed as hard as the Hilux.
      </P>
      <P>
        The <Strong>Mazda BT-50</Strong> shares its underpinnings with the
        D-Max, which makes it an interesting arbitrage: the same mechanical
        package with different styling and equipment, often at a different
        price. Where both are supported locally, compare them on total landed
        cost rather than assuming the badges mean different things underneath.
      </P>

      <H2 id="triton">Mitsubishi Triton</H2>
      <P>
        The value play. Consistently priced below the Hilux and Ranger for
        comparable capability, well equipped for the money, and supported across
        most markets that take Thai pickups. It gives away some payload and some
        outright toughness against the class leaders, and for many buyers that
        is a trade worth making.
      </P>
      <P>
        Worth checking one thing specifically: Mitsubishi&rsquo;s network
        strength varies more between markets than Toyota&rsquo;s or
        Isuzu&rsquo;s. Where it is strong, the Triton is often the smartest buy
        in the segment.
      </P>

      <H2 id="suvs">The SUVs built on the same frames</H2>
      <Table
        head={["SUV", "Shares its bones with", "Best for"]}
        rows={[
          [
            <Strong key="s1">Toyota Fortuner</Strong>,
            "Hilux",
            "The default seven-seat ladder-frame SUV. Best parts network of the four.",
          ],
          [
            <Strong key="s2">Mitsubishi Pajero Sport</Strong>,
            "Triton",
            "Better value and better on-road manners than its capability suggests.",
          ],
          [
            <Strong key="s3">Isuzu MU-X</Strong>,
            "D-Max",
            "The economical choice. Simple, durable, strong on fuel.",
          ],
          [
            <Strong key="s4">Ford Everest</Strong>,
            "Ranger",
            "The most refined and best equipped. Also the most complex.",
          ],
        ]}
        caption="All four inherit the durability and parts supply of their pickup siblings, plus seven seats and a covered load area — and lose payload capacity in exchange."
      />
      <P>
        These are genuinely tough vehicles rather than crossovers with cladding,
        which is the point of buying one from Thailand rather than a monocoque
        SUV from anywhere else.
      </P>

      <H2 id="evs">The new arrival: Thai-assembled EVs</H2>
      <P>
        BYD, MG, GWM and Neta have all established assembly capacity in
        Thailand, which makes it the leading right-hand-drive source for
        affordable Chinese-brand electric vehicles outside China itself. For
        markets building out electrification with limited budgets, that is a
        genuinely new option.
      </P>
      <P>
        Three things to settle before buying one, all of which vary more than
        the vehicles do:
      </P>
      <UL>
        <CheckLI>
          <Strong>Charging standard</Strong> compatibility with your local
          network.
        </CheckLI>
        <CheckLI>
          <Strong>Warranty coverage</Strong> — particularly on the battery, and
          whether it transfers across borders at all.
        </CheckLI>
        <CheckLI>
          <Strong>Homologation and type approval</Strong> in your market, which
          for newer Chinese brands is not always established.
        </CheckLI>
      </UL>
      <P>
        We check all three before purchase. For how Thailand compares with the
        used route, see{" "}
        <InlineLink href="/blog/thailand-vs-japan-for-pickup-imports">
          Thailand vs Japan for pickup imports
        </InlineLink>
        , and for the numbers,{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-thailand">
          what it costs
        </InlineLink>
        .
      </P>

      <Disclaimer>
        Model availability, specification and local network strength vary by
        market and model year. Charging standards, warranty terms and
        homologation status for newer EV brands change frequently. Confirm the
        position for your specific vehicle and destination before committing.
      </Disclaimer>
    </>
  );
}
