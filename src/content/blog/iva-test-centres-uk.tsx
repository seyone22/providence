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

export default function Body() {
  return (
    <>
      <Lead>
        Where a car can be inspected turns out to be one of the tighter
        constraints on a UK import. There are twenty-two IVA test centres in
        Great Britain, seven of them run by private companies rather than by
        DVSA, and only three of those seven will look at a car. Here is the
        whole list, what each site can actually test, and the thing most people
        get wrong about what &ldquo;private&rdquo; means here.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            <Strong>DVSA examiners carry out every test</Strong>, including at
            privately operated sites. There is no such thing as a private IVA
            tester.
          </>,
          <>
            <Strong>22 centres</Strong> in England, Scotland and Wales — 15
            DVSA-run, 7 privately operated.
          </>,
          <>
            <Strong>18 take passenger vehicles.</Strong> Of the seven private
            sites, only <Strong>three</Strong> do.
          </>,
          <>
            <Strong>One centre in Scotland, one in Wales</Strong>, and none of
            this list applies to Northern Ireland.
          </>,
          <>
            You <Strong>name the centre on your DVSA application</Strong> rather
            than booking with the site.
          </>,
        ]}
      />

      <H2 id="who-tests">Who actually carries out the test</H2>
      <P>
        This is the part worth getting straight before the list, because the
        wording invites a wrong conclusion. A privately operated IVA site is a{" "}
        <Strong>venue</Strong>, not an approving authority.
      </P>
      <P>
        DVSA is running out a network of{" "}
        <Strong>Vehicle Examination Facilities</Strong>, announced on 4 February
        2026, which allows approval tests to be conducted at third-party sites.
        The agency&rsquo;s own description of the model settles the question:{" "}
        <Strong>DVSA staff will continue to carry out the test.</Strong> The
        examiner travels; the standard does not change; the certificate is still
        DVSA&rsquo;s.
      </P>
      <P>
        The reason for the change is straightforward. Most approval tests have
        historically happened at DVSA&rsquo;s own Goods Vehicle Testing
        Stations, and DVSA acknowledges that many customers travel long
        distances to attend one. VEF sites can operate on their own account, as
        open-access sites testing third-party vehicles, or as a combination —
        and existing Privately Owned Testing Facilities can apply for VEF status
        too.
      </P>
      <Callout title="A private site is not a shortcut" tone="amber">
        <p>
          Same examiner, same inspection manual, same fee. What a nearby site
          saves you is transport of an unregistered vehicle, which is a real
          cost — but nobody at a private facility can pass a car DVSA would
          fail.
        </p>
      </Callout>

      <H2 id="private">The seven privately operated sites</H2>
      <P>
        Every centre on DVSA&rsquo;s list that is not marked{" "}
        <em>&ldquo;This is a DVSA test centre&rdquo;</em>, as at the list dated
        14 August 2026:
      </P>
      <Table
        head={["Centre", "Operator", "Location", "What it can test"]}
        rows={[
          [
            <Strong key="a">Castle Donington</Strong>,
            "My Car Import",
            "Willow Park Industrial Estate, Trent Lane, Derbyshire DE74 2PY",
            "Passenger vehicles (incl. motor caravans, ambulances, hearses), vans up to 3,500kg, light trailers",
          ],
          [
            <Strong key="b">Milton Keynes</Strong>,
            "Ship My Car",
            "20 Tanners Drive, Blakelands, MK14 5BN",
            "Passenger vehicles — normal and basic IVA — and vans up to 3,500kg",
          ],
          [
            <Strong key="c">Purfleet</Strong>,
            "Ensign Bus Company",
            "Juliette Close, Purfleet Industrial Park, Essex RM15 4YF",
            "Passenger vehicles and vans (normal IVA only), lorries over 3,500kg, buses and coaches (M3 class 1), dangerous goods, trailers",
          ],
          [
            <Strong key="d">Halesowen</Strong>,
            "Motus Group (UK) Ltd (Imperial Commercials Ltd)",
            "Park Rd, Halesowen B63 2RL",
            "Vans up to 3,500kg, lorries over 3,500kg, dangerous goods, trailers",
          ],
          [
            <Strong key="e">Peterborough</Strong>,
            "Aebi Schmidt UK Limited",
            "Southgate Way, Orton Southgate, PE2 6GP",
            "M class ambulances (no weight restriction), vans up to 3,500kg (normal IVA only), lorries over 3,500kg",
          ],
          [
            <Strong key="f">Sheffield</Strong>,
            "Newell and Wright",
            "Templeborough Depot, Sheffield Road, S9 1RT",
            "Lorries over 3,500kg, dangerous goods, trailers",
          ],
          [
            <Strong key="g">Lancashire</Strong>,
            "Wheelbase Engineering",
            "Chanters Way, off Lower Eccleshill Road, Lower Darwen BB3 0RP",
            "Vans up to 3,500kg, lorries over 3,500kg, dangerous goods, trailers",
          ],
        ]}
        caption="Source: DVSA, 'Individual Vehicle Approval (IVA) test centre locations', GOV.UK, updated 14 August 2026. Checked 1 September 2026."
      />
      <P>
        Milton Keynes is the newest of them — added to the list on{" "}
        <Strong>14 August 2026</Strong> — and the only one that publishes its
        own telephone, email and website alongside its address on the GOV.UK
        entry. The others are listed by address alone.
      </P>

      <H2 id="cars">Only three of them take cars</H2>
      <P>
        Four of the seven private sites are commercial-vehicle, trailer and
        specialist operations. If you are importing a car, the private network
        available to you is three sites, all of them in the Midlands and the
        south-east:
      </P>
      <UL>
        <CheckLI>
          <Strong>Castle Donington (My Car Import)</Strong> — passenger
          vehicles, vans up to 3,500kg and light trailers. Nothing over{" "}
          <Strong>6,500kg</Strong>.
        </CheckLI>
        <CheckLI>
          <Strong>Milton Keynes (Ship My Car)</Strong> — passenger vehicles for
          both normal and basic IVA, which is the broadest car offer of the
          three, subject to the exclusions below.
        </CheckLI>
        <CheckLI>
          <Strong>Purfleet (Ensign Bus Company)</Strong> —{" "}
          <Strong>normal IVA only</Strong> for passenger vehicles. If your car
          falls into a basic IVA class — a personal import, a left-hand-drive
          vehicle, a hearse, a very low volume car — Purfleet cannot test it.
        </CheckLI>
      </UL>
      <Callout title="Check the class before you pick the site" tone="sky">
        <p>
          Basic and normal IVA are different tests, and centres are listed
          separately for each. A left-hand-drive import is a basic IVA case, so
          Purfleet is out and Milton Keynes is in — a distinction that is
          invisible unless you read the individual centre entry rather than the
          regional list. Which route your car takes is worked out in{" "}
          <InlineLink href="/blog/do-i-need-an-iva-test">
            do you need an IVA test
          </InlineLink>
          .
        </p>
      </Callout>

      <H2 id="full-list">All 22 centres, by region</H2>
      <StatGrid
        stats={[
          { value: "22", label: "IVA centres in Great Britain" },
          { value: "15", label: "run by DVSA" },
          { value: "7", label: "privately operated" },
          { value: "18", label: "that can test passenger vehicles" },
          { value: "3", label: "private sites that take cars" },
          { value: "1", label: "centre each in Scotland and Wales" },
        ]}
      />
      <Table
        head={["Region", "Centre", "Run by", "Takes cars?"]}
        rows={[
          ["London and the South East", "Gillingham, Kent", "DVSA", "Yes"],
          ["", "Southampton (Northam)", "DVSA", "Yes — normal and basic"],
          ["", "Yeading, Hayes", "DVSA", "Yes"],
          ["South West", "Bristol (Avonmouth)", "DVSA", "Yes"],
          ["", "Exeter", "DVSA", "Yes"],
          ["West Midlands", "Halesowen", "Motus Group (UK) Ltd", "No"],
          ["", "Kidderminster", "DVSA", "Yes"],
          ["East Midlands", "Castle Donington", "My Car Import", "Yes"],
          ["", "Derby", "DVSA", "Yes"],
          ["", "Nottingham", "DVSA", "Yes"],
          ["East of England", "Leighton Buzzard", "DVSA", "Yes"],
          ["", "Milton Keynes", "Ship My Car", "Yes — normal and basic"],
          ["", "Norwich", "DVSA", "Yes"],
          ["", "Peterborough", "Aebi Schmidt UK Limited", "No"],
          ["", "Purfleet", "Ensign Bus Company", "Yes — normal IVA only"],
          ["Yorkshire and Humberside", "Beverley", "DVSA", "Yes"],
          ["", "Sheffield", "Newell and Wright", "No"],
          ["North West", "Chadderton, Oldham", "DVSA", "Yes"],
          ["", "Lancashire (Lower Darwen)", "Wheelbase Engineering", "No"],
          ["North East", "Newcastle (Gosforth)", "DVSA", "Yes"],
          ["Scotland", "Edinburgh (Livingston)", "DVSA", "Yes"],
          ["Wales", "Cardiff (Miskin)", "DVSA", "Yes"],
        ]}
        caption="Source: DVSA IVA test centre locations, GOV.UK, updated 14 August 2026. 'Takes cars' means the entry lists passenger vehicles. Checked 1 September 2026."
      />

      <H2 id="restrictions">Restrictions worth reading first</H2>
      <P>
        The regional list tells you a centre exists. The individual entry tells
        you whether it can take your car, and the restrictions are more specific
        than most people expect.
      </P>
      <H3>Milton Keynes</H3>
      <P>
        Cannot book tests for amateur built vehicles, vehicles manufactured
        using parts of a registered vehicle, rebuilt vehicles, or vehicles
        manufactured in very low volume. Cannot test vehicles over{" "}
        <Strong>4 metres in height</Strong>, over <Strong>3,500kg</Strong>, or
        any test that <Strong>needs a turning circle</Strong>.
      </P>
      <H3>Castle Donington</H3>
      <P>
        Cannot do IVA tests for vehicles weighing over <Strong>6,500kg</Strong>.
      </P>
      <H3>Southampton, and why a DVSA site can be fussier</H3>
      <P>
        Southampton is DVSA-run and takes both normal and basic IVA, but its
        basic IVA list is restricted to motor caravans, ambulances, hearses,
        left-hand-drive vehicles, personal imports and armoured vehicles — and
        adds a mechanical condition. The vehicle{" "}
        <Strong>must not be fitted with a limited slip differential</Strong> and
        must either be two-wheel drive, or four-wheel or all-wheel drive where
        the driver can select two-wheel drive.
      </P>
      <Callout
        title="That LSD clause rules out a lot of 4x4 imports"
        tone="amber"
      >
        <p>
          A great many of the vehicles that come through our Japan and Gulf
          corridors — Land Cruisers, Patrols, performance saloons — have a
          limited slip differential and no selectable two-wheel-drive mode. It
          is a rolling-road constraint rather than a standards one, but the
          effect is the same: the nearest port is not necessarily the nearest
          test.
        </p>
      </Callout>
      <P>
        Five centres are also listed as able to carry out noise tests on
        vehicles with exhaust modifications over two metres in height:
        Gillingham, Bristol, Derby, Chadderton and Edinburgh.
      </P>

      <H2 id="booking">How you choose a centre</H2>
      <P>
        You do not ring the site. GOV.UK&rsquo;s instruction is to{" "}
        <Strong>say which centre you want to use when you apply</Strong> — the
        choice is part of the DVSA application, made through the online service.
        DVSA will usually offer you an inspection within{" "}
        <Strong>20 working days</Strong> at the location you chose, wherever
        possible, having first responded to the application itself within around
        10 working days.
      </P>
      <P>
        That &ldquo;wherever possible&rdquo; is doing some work. Choosing a
        centre expresses a preference, not a reservation, and a site with narrow
        capability for your vehicle class has fewer slots to offer. The fee is
        identical whichever you name — £199 for a car inspection in working
        hours, as set out in{" "}
        <InlineLink href="/blog/iva-test-cost">
          what an IVA test costs
        </InlineLink>
        .
      </P>

      <H2 id="geography">The geography problem</H2>
      <P>
        Eighteen centres take cars, and their distribution is not even. Scotland
        has one, at Livingston. Wales has one, at Miskin. The whole of the north
        of England has three. Five of the eighteen sit in the East of England
        alone.
      </P>
      <P>
        This matters because the car is unregistered and cannot legally be
        driven — the only journey permitted is to a pre-booked MOT or approval
        test. Everything else is a transporter, and a transporter from Aberdeen
        to Livingston is a different number from Aberdeen to Milton Keynes.
        Where your car lands and where it can be tested should be one decision,
        not two.
      </P>
      <P>
        Northern Ireland is not on this list at all: DVSA&rsquo;s centre
        publication applies to England, Scotland and Wales, and vehicle approval
        in Northern Ireland runs through its own arrangements.
      </P>
      <Callout title="The list is going to grow" tone="emerald">
        <p>
          DVSA said in February 2026 that it hoped to begin authorising sites
          that meet the required standards and to build the VEF network out over
          the following months, alongside continuing to provide IVA and MSVA at
          some existing sites. Milton Keynes in August was the first
          passenger-car addition since Castle Donington in April 2024. Check the
          GOV.UK list rather than this page before you commit to a route — it is
          the version that changes.
        </p>
      </Callout>

      <H2 id="where-we-fit">Where this sits in an import we handle</H2>
      <P>
        The approval route and the testable-location question belong in the
        decision before you buy, not after the vessel discharges. We confirm
        which route a specific car falls into and what it implies, and for
        UK-bound cars we file the NOVA declaration and prepare and submit the
        DVLA registration pack. The choice of port and the choice of test centre
        are worth making together, and you can make them on real numbers rather
        than after the fact.
      </P>

      <Disclaimer>
        Test centre locations, capabilities and restrictions are published and
        changed by DVSA without notice. This page reflects the GOV.UK list dated{" "}
        <strong>14 August 2026</strong>, checked on 1 September 2026, and centre
        capability is quoted as GOV.UK states it. Confirm the current list and
        the individual centre entry at{" "}
        <a
          href="https://www.gov.uk/government/publications/specialist-schemes-testing-station-map/individual-vehicle-approval-iva-test-centre-locations"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          gov.uk
        </a>{" "}
        before applying. Naming a company here records what DVSA publishes about
        its site and is not a recommendation or an endorsement.
      </Disclaimer>
    </>
  );
}
