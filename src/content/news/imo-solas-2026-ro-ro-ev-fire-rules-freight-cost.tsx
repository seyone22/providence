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
  StatGrid,
  Strong,
  Table,
  UL,
} from "@/components/blog/prose";
import {
  ConfirmedLedger,
  PullQuote,
  Timeline,
} from "@/components/news/newsProse";

export default function ImoSolas2026RoRoEvFireRulesFreightCost() {
  return (
    <>
      <Lead>
        If you have been quoted a higher freight rate this year and told it is
        because new international rules restrict how electric vehicles are
        carried at sea, the rules being described do not exist yet. The SOLAS
        amendments that entered into force on <Strong>1 January 2026</Strong>{" "}
        cover fire detection, video monitoring and water-based suppression on
        vehicle decks. They say nothing about electric vehicles. IMO regulation
        specific to electric vehicles is not scheduled to enter into force until{" "}
        <Strong>1 January 2028</Strong>.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            The 2026 amendments are IMO resolutions{" "}
            <Strong>MSC.550(108)</Strong>, amending SOLAS Regulation II-2/20,
            and <Strong>MSC.555(108)</Strong>, amending the FSS Code chapters 7
            and 9.
          </>,
          <>
            They apply to ships with a keel laid{" "}
            <Strong>on or after 1 January 2026</Strong>, and to existing ro-ro
            passenger ships by the first survey on or after{" "}
            <Strong>1 January 2028</Strong>.
          </>,
          <>
            The requirements are fire detection and alarm, video monitoring, and
            fixed water-based extinguishing on weather decks. Lloyd&rsquo;s
            Register&rsquo;s summary of the amendments{" "}
            <Strong>makes no mention of electric vehicles</Strong>.
          </>,
          <>
            Mandatory IMO regulation specific to electric vehicles is not
            expected in force before <Strong>1 January 2028</Strong>, with
            further SOLAS amendments under discussion for around 2032.
          </>,
          "Car-carrier freight is genuinely expensive right now. The reason is capacity and volume, not a 2026 rulebook.",
        ]}
      />

      <H2 id="what-changed">What actually entered into force in January</H2>

      <P>
        Two IMO resolutions took effect. MSC.550(108) amended SOLAS Regulation
        II-2/20, which governs the protection of vehicle, special category and
        ro-ro spaces. MSC.555(108) amended chapters 7 and 9 of the Fire Safety
        Systems Code.
      </P>

      <P>
        The substance is infrastructure on the ship. Individually identifiable
        fixed fire detection and alarm systems in ro-ro, vehicle and special
        category spaces. Effective video monitoring for continuous observation
        of those spaces. A fixed water-based fire-extinguishing system on
        weather decks intended for carrying vehicles.
      </P>

      <StatGrid
        stats={[
          { value: "1 Jan 2026", label: "New-build keel-laid date" },
          {
            value: "1 Jan 2028",
            label: "Existing ro-ro pax ships, first survey",
          },
          { value: "0", label: "Mentions of electric vehicles" },
        ]}
      />

      <PullQuote>
        The amendments address detection, monitoring and suppression
        infrastructure. They do not address what is parked on the deck.
      </PullQuote>

      <H2 id="claim">The claim, and why it is wrong</H2>

      <P>
        The version circulating in freight marketing goes roughly like this:
        from 2026, updated fire protection regulations apply to ro-ro vessels
        carrying electric vehicles; the rules require upgraded suppression,
        improved ventilation and in some cases restricted deck placement for
        EVs; some vessels therefore carry fewer vehicles per voyage.
      </P>

      <P>
        Three separate things are wrong with that. The amendments are not
        EV-specific. They do not impose deck-placement restrictions by
        powertrain. And they apply to new-build ships by keel-laying date rather
        than to the existing fleet immediately &mdash; which is precisely the
        fleet carrying your car this year.
      </P>

      <Callout
        title="Fire risk on car carriers is real. That is a different claim."
        tone="amber"
      >
        <p>
          Nothing here says electric vehicles pose no fire risk at sea, or that
          the IMO is ignoring it. The IMO is actively working on it, which is
          why EV-specific regulation is expected from 2028 and further SOLAS
          amendments are under discussion for around 2032. The false claim is
          that this work already binds the ship carrying your car and already
          justifies your surcharge.
        </p>
      </Callout>

      <Timeline
        items={[
          {
            time: "1 January 2026",
            title: "FSS Code amendments enter into force",
            body: (
              <>
                MSC.550(108) and MSC.555(108) apply to cargo ships and ro-ro
                passenger ships with a keel laid on or after this date.
                Detection, monitoring and weather-deck suppression.
              </>
            ),
          },
          {
            time: "1 January 2028",
            title: "Existing ro-ro passenger ships must comply",
            body: (
              <>
                Retrofit requirements &mdash; heat detectors, video monitoring,
                fixed water-based suppression on weather decks &mdash; apply not
                later than the first survey on or after this date.
              </>
            ),
          },
          {
            time: "1 January 2028",
            title: "EV-specific regulation expected",
            body: (
              <>
                Mandatory IMO regulation addressing electric vehicles
                specifically is not expected to enter into force before this
                date.
              </>
            ),
          },
          {
            time: "2027–2028, then around 2032",
            title: "Further deliberation",
            body: (
              <>
                Continued IMO discussion with a view to introducing further
                SOLAS amendments in the early 2030s.
              </>
            ),
          },
        ]}
      />

      <H2 id="why-expensive">So why is car freight expensive?</H2>

      <P>
        Because there are not enough ships, and there is more to carry. The pure
        car and truck carrier fleet was running close to capacity before Chinese
        vehicle exports scaled, and newbuild deliveries did not arrive fast
        enough to absorb the extra volume. That is a supply-and-demand story
        with a shipbuilding lead time attached, and it does not need a
        regulatory explanation.
      </P>

      <P>
        It is also why the regulatory explanation is attractive to whoever is
        quoting you. &ldquo;Rates are up because the market is tight&rdquo;
        invites you to shop around. &ldquo;Rates are up because international
        law changed&rdquo; does not.
      </P>

      <Table
        head={["Explanation offered", "Status"]}
        rows={[
          [
            "New 2026 IMO rules restrict EV carriage",
            "Not supported. The amendments are not EV-specific.",
          ],
          [
            "New 2026 rules apply to the ship carrying my car",
            "Only if its keel was laid on or after 1 January 2026.",
          ],
          [
            "Ships carry fewer cars because of EV spacing rules",
            "Not established by the 2026 amendments.",
          ],
          [
            "Car-carrier capacity is tight and rates are high",
            "Supported by market reporting.",
          ],
          [
            "EV fire risk is under active IMO consideration",
            "Correct — with regulation expected from 2028.",
          ],
        ]}
        caption="Assessed against Lloyd's Register's summary of MSC.550(108) and MSC.555(108) and IMO reporting. Checked 10 September 2026."
      />

      <H2 id="applies">Does this apply to you?</H2>

      <P>
        It applies to anyone paying for ocean freight on a car this year, which
        is every reader of this publication. It applies most directly if you
        have been given a line-item surcharge attributed to EV regulations, and
        it applies whether your car is electric or not &mdash; the claim has
        been used to justify general rate increases.
      </P>

      <H3>What to ask your forwarder</H3>

      <UL>
        <CheckLI>
          <Strong>&ldquo;Which resolution?&rdquo;</Strong> A real regulatory
          surcharge can name the instrument. MSC.550(108) and MSC.555(108) are
          the 2026 ones, and neither is EV-specific.
        </CheckLI>
        <CheckLI>
          <Strong>&ldquo;When was this vessel&rsquo;s keel laid?&rdquo;</Strong>{" "}
          If it predates 1 January 2026 and it is not a ro-ro passenger ship at
          survey, the new-build requirements do not bind it.
        </CheckLI>
        <CheckLI>
          <Strong>
            &ldquo;Is this a market rate or a compliance cost?&rdquo;
          </Strong>{" "}
          Both are legitimate answers. Only one of them is negotiable, which is
          why it matters which you are being charged.
        </CheckLI>
        <CheckLI>
          <Strong>Get the all-in figure, not the components.</Strong> A quote
          that arrives as a base rate plus five surcharges is harder to compare
          than one number, and that is usually the point.
        </CheckLI>
      </UL>

      <ConfirmedLedger
        confirmed={[
          "MSC.550(108) amends SOLAS II-2/20; MSC.555(108) amends FSS Code chapters 7 and 9; both in force from 1 January 2026.",
          "Application is to ships with keel laid on or after 1 January 2026, and existing ro-ro passenger ships by first survey on or after 1 January 2028.",
          <>
            Lloyd&rsquo;s Register&rsquo;s summary of the amendments contains no
            provisions relating to electric or alternative-fuel vehicles.
          </>,
          "EV-specific IMO regulation is not expected in force before 1 January 2028.",
        ]}
        unconfirmed={[
          "Whether any individual carrier has adopted stricter voluntary EV stowage practices. Some may have; that is a commercial decision, not a regulation.",
          "How much of the current freight level is attributable to capacity versus route disruption versus fuel. We have not seen a reliable decomposition.",
          <>
            The final content of any SOLAS amendments arising from the
            2027&ndash;2028 deliberations.
          </>,
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        Freight is not on a regulatory cliff edge, so there is no rule-driven
        reason to rush a shipment this year. There is a genuine deadline further
        out: existing ro-ro passenger ships have to comply by the first survey
        on or after 1 January 2028, and EV-specific regulation is expected
        around the same time. If either produces a real cost, it will land in
        2028, not now.
      </P>

      <P>
        Which means the honest advice is dull. Book on the merits of the car and
        the currency, and treat a 2026 regulatory surcharge as a line to
        question rather than a cost to accept.
      </P>

      <Disclaimer>
        Maritime regulation is set by the International Maritime Organization
        and implemented through flag states and classification societies.
        Details above reflect Lloyd&rsquo;s Register&rsquo;s published summary
        of MSC.550(108) and MSC.555(108) and IMO reporting, checked on 10
        September 2026. Confirm any vessel-specific requirement with your
        carrier or classification society.
      </Disclaimer>

      <Callout
        title="Want the freight line explained rather than bundled?"
        tone="emerald"
      >
        <p>
          We quote one landed figure covering the car, freight, marine
          insurance, duty and local tax where it applies &mdash; itemised, so
          you can see which line is which. Send us a specification and a
          destination port and we will build it:{" "}
          <InlineLink href="/request">start here</InlineLink>. Our{" "}
          <InlineLink href="/blog/cost-to-import-a-car-from-japan">
            cost-to-import guide
          </InlineLink>{" "}
          sets out every component of the bill.
        </p>
      </Callout>
    </>
  );
}
