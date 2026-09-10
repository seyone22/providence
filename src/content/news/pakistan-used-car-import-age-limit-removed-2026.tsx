import {
  Callout,
  CheckLI,
  CostTable,
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
import { ConfirmedLedger, Timeline } from "@/components/news/newsProse";

export default function PakistanUsedCarImportAgeLimitRemoved2026() {
  return (
    <>
      <Lead>
        Pakistan has done two things to its used-vehicle import regime that
        rarely happen together: it legalised commercial importing, and it
        started taking the duty back off. The five-year age cap on commercially
        imported used vehicles fell away on <Strong>1 July 2026</Strong>, and
        the regulatory duty that came with the scheme dropped from 40% to 30% on
        the same day. Much of the coverage reported that 30% as a new tax. It is
        not. It is a cut, and it is scheduled to keep cutting.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Commercial import of used vehicles is now a legal, named channel in
            Pakistan, under clause (xvi) of Serial No. 10 of Appendix-C of the{" "}
            <Strong>Import Policy Order, 2022</Strong>.
          </>,
          <>
            The <Strong>five-year age limit</Strong> applied until 30 June 2026
            and has since been removed for the commercial channel.
          </>,
          <>
            <Strong>SRO 1065(I)/2026</Strong> set regulatory duty on those
            imports at <Strong>30%</Strong> with effect from 1 July 2026 &mdash;
            ten points below the 40% that applied before it.
          </>,
          <>
            The published taper takes regulatory duty down by roughly ten points
            a year, reaching zero by the <Strong>2029&ndash;30</Strong> fiscal
            year.
          </>,
          <>
            Regulatory duty is one line on a bill that also carries customs
            duty, sales tax and withholding. A 10-point RD cut is not a
            10&nbsp;% cut in what you pay.
          </>,
        ]}
      />

      <H2 id="what-changed">What actually changed on 1 July</H2>

      <P>
        Pakistan has permitted used-vehicle imports for years, but almost
        entirely through personal channels &mdash; the baggage, gift and
        transfer-of-residence schemes, which require an individual overseas
        Pakistani to stand behind each unit. A commercial dealer could not
        simply buy a container of stock and clear it in the company&rsquo;s
        name.
      </P>

      <P>
        That changed when the Ministry of Commerce amended the Import Policy
        Order, 2022 to create a commercial import route for used vehicles under
        PCT headings 8702, 8703 and 8704 &mdash; buses, cars and goods vehicles.
        The route opened with two conditions attached: a five-year maximum
        vehicle age, and a 40% regulatory duty on top of the existing customs
        duty and taxes.
      </P>

      <P>
        Both of those conditions were written with expiry built in. The age
        limit was stated to apply <Strong>until 30 June 2026</Strong>, after
        which it stands removed. The regulatory duty was set to step down by
        about ten percentage points a year until it reaches zero.
      </P>

      <Timeline
        items={[
          {
            time: "September 2025",
            title: "The commercial channel opens",
            body: (
              <>
                The Ministry of Commerce issues SRO 1895(I)/2025, amending the
                Import Policy Order, 2022 to allow commercial import of used
                vehicles under PCT headings 8702, 8703, 8704 and 8711, capped at
                five years of age and carrying 40% regulatory duty.
              </>
            ),
          },
          {
            time: "30 June 2026",
            title: "The age cap expires",
            body: (
              <>
                The five-year maximum stated in the scheme runs out. From the
                following day the commercial channel is no longer age-limited,
                though quality, safety and emissions requirements remain.
              </>
            ),
          },
          {
            time: "1 July 2026",
            title: "Regulatory duty falls to 30%",
            body: (
              <>
                The Federal Board of Revenue&rsquo;s SRO 1065(I)/2026 takes
                effect, setting regulatory duty on commercially imported used
                vehicles at 30% rather than 40%.
              </>
            ),
          },
          {
            time: "2027, 2028, 2029",
            title: "The taper continues",
            body: (
              <>
                On the published schedule the rate steps down roughly ten points
                a year, reaching zero in the 2029&ndash;30 fiscal year. Nothing
                beyond the current notification is legislated, so treat later
                years as intent rather than entitlement.
              </>
            ),
          },
        ]}
      />

      <H2 id="the-correction">The 30% is a reduction, not a new charge</H2>

      <P>
        When SRO 1065(I)/2026 was published, several outlets read the flat 30%
        printed in the notification and reported it as an additional duty
        imposed on used-car imports. PakWheels ran a fact-check on exactly this
        point, and its conclusion is the one the numbers support: the
        notification restates the rate at its new level, and that level is ten
        points below where it stood the day before.
      </P>

      <P>
        The confusion was made easier by a second notification issued the same
        day. SRO 1064(I)/2026 dealt with the personal-import schemes &mdash;
        gift and transfer of residence &mdash; and also reduced rates there.
        Reading the two together as a stack of new charges rather than as a pair
        of cuts is the error.
      </P>

      <Callout title="Why this matters more than a rounding error" tone="amber">
        <p>
          If you priced a shipment on the belief that 30 points of regulatory
          duty had just been added to a bill that already carried 40, you
          overstated your landed cost by roughly the value of the car&rsquo;s
          margin. Several dealers we spoke to had done the sum that way. Check
          the notification, not the headline.
        </p>
      </Callout>

      <H2 id="landed">What it does to a landed number</H2>

      <P>
        Regulatory duty in Pakistan is assessed on the customs value, alongside
        customs duty, and the whole assessed base then carries sales tax and
        withholding. That layering means a change in one rate does not move the
        final bill by the same proportion.
      </P>

      <P>
        The worked example below shows the structure and the direction of the
        change only. It deliberately does not carry Pakistani customs duty,
        sales tax or withholding rates, because we could not verify the
        applicable rates for each engine band against a primary Federal Board of
        Revenue schedule at the time of writing, and this publication does not
        estimate a tax rate.
      </P>

      <CostTable
        title="Regulatory duty, before and after"
        subtitle="Illustrative, on an assumed customs value of US$10,000"
        rows={[
          { label: "Assumed customs value", value: "$10,000" },
          { label: "Regulatory duty to 30 June 2026, at 40%", value: "$4,000" },
          {
            label: "Regulatory duty from 1 July 2026, at 30%",
            value: "$3,000",
            green: true,
          },
        ]}
        total={{ label: "Change per unit, RD line only", value: "−$1,000" }}
      />

      <P>
        On a ten-unit container that is a US$10,000 swing on one line of the
        bill. It is real money, and it is also the smaller half of the story
        &mdash; the age cap is the change that alters what you are allowed to
        buy at all.
      </P>

      <H2 id="applies">Does this apply to you?</H2>

      <P>
        It applies to you if you are importing vehicles into Pakistan as a
        business, in the company&rsquo;s own name, through the commercial
        channel. It does not change the personal schemes, which most Pakistani
        buyers have historically used, and it does not change anything for a
        private buyer in Kenya, Ireland, New Zealand or anywhere else.
      </P>

      <Table
        head={["If you are…", "Does this change your position?"]}
        rows={[
          [
            "A Pakistani dealer importing stock commercially",
            "Yes. Age cap gone, regulatory duty ten points lower.",
          ],
          [
            "An overseas Pakistani using the gift or transfer-of-residence scheme",
            "Not directly. Those schemes were addressed in a separate notification the same day.",
          ],
          [
            "A private Pakistani buyer purchasing locally",
            "Indirectly. More legal supply usually reaches retail prices before it reaches anything else.",
          ],
          [
            "An importer in any other market",
            "No. This is a Pakistani import rule and travels nowhere.",
          ],
        ]}
        caption="Verify your own position with the Federal Board of Revenue or a licensed clearing agent before committing capital."
      />

      <H2 id="supply">Where the cars come from</H2>

      <P>
        Removing an age cap changes the shape of what a Pakistani dealer can
        buy, not just how much of it. A five-year limit confines you to the
        newest and most expensive end of the Japanese auction halls. Without it,
        the seven-to-ten-year band opens &mdash; which is where the volume, and
        most of the value, has always been.
      </P>

      <P>
        That band is also where reading the sheet matters most. A seven-year-old
        car with a genuine grade 4 and a clean auction sheet is a different
        proposition from a seven-year-old car with an R-grade repair history,
        and the difference does not show in a photograph. Our{" "}
        <InlineLink href="/blog/japanese-auction-grades-explained">
          guide to Japanese auction grades
        </InlineLink>{" "}
        sets out what each grade actually certifies.
      </P>

      <H3>Quality requirements did not disappear</H3>

      <P>
        The age cap going does not mean anything may now enter. Reporting on the
        scheme has consistently stated that imported vehicles must continue to
        meet safety, environmental and quality standards, with compliance
        oversight referred to the Engineering Development Board. We were not
        able to read a published inspection protocol naming the appointed
        inspection bodies, and we are not going to describe one we have not
        seen.
      </P>

      <ConfirmedLedger
        confirmed={[
          "The commercial import channel exists in the Import Policy Order, 2022 at clause (xvi) of Serial No. 10 of Appendix-C.",
          "SRO 1065(I)/2026 set regulatory duty on commercial used-vehicle imports at 30% with effect from 1 July 2026.",
          "The scheme as notified applied a five-year age limit until 30 June 2026 and removed it thereafter.",
          "PCT headings covered are 8702, 8703 and 8704.",
        ]}
        unconfirmed={[
          "The exact customs duty, sales tax and withholding rates by engine band. We could not verify these against a primary FBR schedule and have not published them.",
          "Which inspection bodies are appointed for pre-shipment inspection of commercially imported units, and under what protocol.",
          <>
            Whether the taper beyond 2026&ndash;27 has been notified, or remains
            a stated intention in the tariff roadmap.
          </>,
        ]}
      />

      <H2 id="timing">Move now or wait?</H2>

      <P>
        For a dealer, the argument for moving is that regulatory duty is on a
        published downward path, which means every year you wait, the same car
        lands cheaper. The argument against waiting is that the cars themselves
        do not stand still: a 2019 unit bought in 2029 is a ten-year-old car
        being taxed at zero regulatory duty and sold into a market that has had
        four more years of legal commercial supply arriving.
      </P>

      <P>
        The taper rewards patience on tax and punishes it on the asset. Those
        two forces roughly cancel, which is why the honest answer is that the
        duty schedule should not be the thing that decides your timing. Stock
        availability and the yen should.
      </P>

      <UL>
        <CheckLI>
          <Strong>The age cap is the change worth acting on.</Strong> It widens
          your buying band immediately, and unlike the duty taper it is not
          scheduled to widen further.
        </CheckLI>
        <CheckLI>
          <Strong>Price the whole bill, not the RD line.</Strong> Regulatory
          duty sits inside a stack that includes customs duty, sales tax and
          withholding. Get a clearing agent to build the full assessment on a
          real chassis number before you bid.
        </CheckLI>
        <CheckLI>
          <Strong>The taper is a notification, not a guarantee.</Strong> Duty
          schedules with multi-year paths have been reset before, in Pakistan
          and elsewhere. Do not underwrite a 2029 margin on a 2026 SRO.
        </CheckLI>
      </UL>

      <H2 id="selling">Is someone selling you something?</H2>

      <P>
        We are an importer, so read this line knowing that. Everyone with stock
        to move has an interest in a Pakistani dealer believing the door has
        swung wide open, and the &ldquo;new 30% duty&rdquo; framing has been
        useful to the opposite camp too &mdash; it makes local assembly look
        better protected than the notification actually leaves it.
      </P>

      <P>
        The measured position is that a genuine liberalisation has happened, it
        is smaller in cash terms than the headlines on either side implied, and
        the piece of it that matters most is the age band rather than the rate.
        If you are importing one car for yourself, this changes nothing at all
        for you.
      </P>

      <Disclaimer>
        Duty, regulatory duty, sales tax and withholding rates are set by the
        Government of Pakistan and change without notice. The rates and dates
        above reflect notifications published by the Ministry of Commerce and
        the Federal Board of Revenue and were checked on 10 September 2026.
        Verify your own position with the Federal Board of Revenue or a licensed
        clearing agent before committing funds.
      </Disclaimer>

      <Callout
        title="Pricing a Pakistani container against a Japanese hall?"
        tone="emerald"
      >
        <p>
          We buy at auction in Japan every week and quote one landed figure
          before you commit anything. If you want a specific grade, year band
          and volume priced against what is actually running through the halls
          this month,{" "}
          <InlineLink href="/request">send us the specification</InlineLink> and
          we will build the number. Our{" "}
          <InlineLink href="/blog/how-to-buy-a-car-at-japanese-auction">
            guide to buying at Japanese auction
          </InlineLink>{" "}
          explains how the bidding actually works.
        </p>
      </Callout>
    </>
  );
}
