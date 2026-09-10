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
import { ConfirmedLedger, PullQuote } from "@/components/news/newsProse";

export default function MalaysiaCbuEvImportRulesCifPowerFloor() {
  return (
    <>
      <Lead>
        Malaysia has stopped taxing imported electric cars and started
        disqualifying them. From <Strong>1 July 2026</Strong>, a fully imported
        electric vehicle must carry a declared CIF value of at least{" "}
        <Strong>RM200,000</Strong> and produce at least <Strong>180 kW</Strong>{" "}
        to be imported at all. That is not a duty change. It is a specification
        floor, and it removes the entire affordable end of the imported-EV
        market at a stroke.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            From 1 July 2026 every completely built-up electric vehicle imported
            into Malaysia must meet a minimum CIF value of{" "}
            <Strong>RM200,000</Strong>.
          </>,
          <>
            It must also produce a minimum of <Strong>180 kW</Strong>, which is
            245 PS or 241 hp.
          </>,
          <>
            The four-year exemption from import and excise duty on CBU EVs{" "}
            <Strong>ended on 31 December 2025</Strong>. The July conditions sit
            on top of a market that is already paying duty again.
          </>,
          <>
            Reported duty structure for CBU EVs is{" "}
            <Strong>30% + 10% + 10%</Strong>, or <Strong>5% + 10% + 10%</Strong>{" "}
            where a free trade agreement lowers the import duty &mdash; which
            favours China-built cars over most others.
          </>,
          "Existing port stock and in-transit vehicles were reported as saleable under the previous rules until exhausted.",
        ]}
      />

      <H2 id="floor">A price floor and a power floor</H2>

      <P>
        Malaysia&rsquo;s Ministry of International Trade and Industry confirmed
        the new conditions in a media statement on 6 May 2026, with effect from
        1 July 2026. Two thresholds apply together, and a vehicle has to clear
        both.
      </P>

      <StatGrid
        stats={[
          { value: "RM200,000", label: "Minimum declared CIF value" },
          { value: "180 kW", label: "Minimum power output (245 PS)" },
          { value: "1 July 2026", label: "In force from" },
        ]}
      />

      <P>
        CIF is cost, insurance and freight &mdash; the value at the Malaysian
        border, before duty. So this is not a retail price floor. A car with a
        RM180,000 CIF value that would have retailed well above RM200,000 after
        duty and tax does not qualify. The test is applied at the customs value,
        which is a lower and stricter line than the showroom price.
      </P>

      <PullQuote>
        The stated aim is to move the incentive from importing cars to building
        them. The immediate effect is to delete a price segment.
      </PullQuote>

      <H2 id="why">Why Malaysia has done this</H2>

      <P>
        Malaysia exempted CBU electric vehicles from import and excise duty from
        October 2021, extended the exemption twice, and let it lapse at the end
        of 2025. The policy did what it was designed to do: it seeded an
        electric market quickly, largely with imported cars. The Government has
        now decided that continuing on the same basis subsidises other
        countries&rsquo; factories.
      </P>

      <P>
        The redirection is toward completely knocked-down assembly &mdash; cars
        built in Malaysia from imported kits &mdash; which is where the jobs,
        the supplier base and the industrial argument sit. A CIF floor and a
        power floor push imported EVs into a bracket where local assembly is not
        competing anyway, and leave the mass market to CKD.
      </P>

      <H2 id="landed">What it does to a landed number</H2>

      <P>
        For a car that clears both floors, the change is a permission question
        answered yes, and the landed cost is then governed by the duty
        structure. Reporting from Malaysian trade press puts CBU EV duties at
        30% import duty plus 10% excise plus 10% sales tax, with the import duty
        falling to 5% where a free trade agreement applies.
      </P>

      <P>
        We have not verified those rates against a primary Royal Malaysian
        Customs Department schedule, so treat them as reported rather than
        confirmed, and check your own tariff line before pricing a shipment. The
        directional point does not depend on the exact rate: a 25-point
        difference in import duty on an RM200,000 CIF value is a difference of
        roughly RM50,000 before the excise and sales tax layers compound it.
      </P>

      <Callout
        title="The origin question is now the biggest number on the bill"
        tone="amber"
      >
        <p>
          Where a free trade agreement lowers import duty from 30% to 5%, two
          otherwise identical electric cars land at materially different prices
          purely because of where they were built. If you are sourcing for
          Malaysia, country of manufacture stopped being a footnote and became a
          pricing input.
        </p>
      </Callout>

      <H2 id="applies">Does this apply to you?</H2>

      <Table
        head={["Vehicle and route", "Position from 1 July 2026"]}
        rows={[
          [
            "Imported CBU electric car, CIF under RM200,000",
            "Does not meet the import condition.",
          ],
          [
            "Imported CBU electric car under 180 kW",
            "Does not meet the import condition, whatever its value.",
          ],
          [
            "Imported CBU electric car clearing both floors",
            "Importable, subject to the applicable duty and tax structure.",
          ],
          [
            "Locally assembled (CKD) electric car",
            "Unaffected by these conditions; this is the route the policy favours.",
          ],
          [
            "Petrol, diesel or hybrid imports",
            "Not covered by these particular conditions.",
          ],
        ]}
        caption="Conditions as confirmed by MITI on 6 May 2026 and reported by Malaysian trade press. Checked 10 September 2026."
      />

      <H2 id="dealer">The dealer read</H2>

      <P>
        This is a dealer story before it is a consumer story. Three consequences
        matter if you hold or plan Malaysian stock.
      </P>

      <UL>
        <CheckLI>
          <Strong>Your affordable imported EV pipeline is closed.</Strong> Not
          expensive &mdash; closed. A car that cannot meet the CIF and power
          floors is not a margin problem, it is an admissibility problem.
        </CheckLI>
        <CheckLI>
          <Strong>
            Port stock and in-transit units were reported as protected
          </Strong>{" "}
          under the previous rules until exhausted. If you are relying on that,
          get it confirmed in writing by your forwarder against the specific
          bills of lading, because &ldquo;until exhausted&rdquo; is a phrase
          that ends without notice.
        </CheckLI>
        <CheckLI>
          <Strong>
            Residuals on the segment that just closed are unpredictable.
          </Strong>{" "}
          Restricting new supply of sub-RM200,000 imported EVs can support used
          values, or it can mark the segment as orphaned. Both have happened in
          other markets. Nobody knows which this is yet, and anyone telling you
          otherwise is guessing.
        </CheckLI>
      </UL>

      <H3>Where a Malaysian buyer looks instead</H3>

      <P>
        The substitution is real and it has three branches. Locally assembled
        electric cars, which the policy is designed to favour. Imported
        combustion and hybrid stock, which these conditions do not touch. And
        used right-hand-drive imports where Malaysia&rsquo;s approved-permit
        regime allows them &mdash; a route with its own permissions that need
        checking case by case rather than assuming.
      </P>

      <ConfirmedLedger
        confirmed={[
          "MITI confirmed the RM200,000 minimum CIF value and 180 kW minimum power output for CBU EV imports, effective 1 July 2026.",
          "The CBU EV import and excise duty exemption ended on 31 December 2025.",
          "The conditions were announced by media statement on 6 May 2026.",
        ]}
        unconfirmed={[
          "The current CBU EV duty rates against a primary Royal Malaysian Customs Department schedule. The 30/5 + 10 + 10 structure is reported by trade press and has not been verified here.",
          "The precise treatment and cut-off for port stock and in-transit units.",
          "Whether the thresholds are indexed, reviewed on a schedule, or fixed indefinitely.",
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        Malaysia is the second Asian market this year to reprice imported
        electric vehicles rather than ban them, after{" "}
        <InlineLink href="/latest-news/hong-kong-ev-first-registration-tax-concession-ends">
          Hong Kong let its first registration tax concession lapse
        </InlineLink>
        . Both changes work through cost rather than admissibility, which means
        the car is still legal and simply worth less to bring in.
      </P>

      <P>
        The deadline in this story has already passed, which changes the
        question. There is nothing to beat. What there is instead is a market
        whose supply shape changed ten weeks ago and whose used values have not
        finished reacting.
      </P>

      <P>
        For a dealer that argues for patience: let the first cycle of used
        sub-RM200,000 electric cars trade before you decide what the segment is
        worth. For a private buyer already looking at an imported electric car,
        the practical answer is that your choice set is now smaller and more
        expensive, and a hybrid or a combustion import may simply be the better
        purchase this year. We would rather say that than sell you the more
        expensive car.
      </P>

      <Disclaimer>
        Import conditions, duty rates and approved-permit requirements are set
        by the Government of Malaysia and change without notice. The conditions
        above reflect MITI&rsquo;s statement of 6 May 2026 and trade reporting,
        checked on 10 September 2026. Confirm your own position with MITI or the
        Royal Malaysian Customs Department before committing funds.
      </Disclaimer>

      <Callout
        title="Sourcing into Malaysia and need the corridor priced?"
        tone="emerald"
      >
        <p>
          We buy in Japan, the United Kingdom, the UAE, India, Thailand,
          Australia and New Zealand, which means when one route closes on rules
          we can price the same car out of another. Send us the specification
          and destination and we will quote one landed figure &mdash;{" "}
          <InlineLink href="/request">start here</InlineLink>. Our{" "}
          <InlineLink href="/blog/cost-to-import-a-car-from-japan">
            Japan cost guide
          </InlineLink>{" "}
          shows how the bill is built.
        </p>
      </Callout>
    </>
  );
}
