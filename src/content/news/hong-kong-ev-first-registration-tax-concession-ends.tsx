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
import { PullQuote, Timeline } from "@/components/news/newsProse";

export default function HongKongEvFirstRegistrationTaxConcessionEnds() {
  return (
    <>
      <Lead>
        Hong Kong&rsquo;s first registration tax concession for electric private
        cars expired on <Strong>31 March 2026</Strong> and, unlike every
        previous expiry, it was not renewed. There is one door still open: cars
        ordered on or before 25 February 2026, or already arranged for shipment
        by that date, can still be assessed at the old concessionary rate
        &mdash; but the application has to reach the Transport Department by{" "}
        <Strong>24 February 2027</Strong>. After that the concession is
        genuinely gone.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            First registration tax concessions for electric private cars,
            including the One-for-One Replacement Scheme,{" "}
            <Strong>expired on 31 March 2026</Strong> and have not been
            extended.
          </>,
          <>
            Any electric private car whose first-registration application is
            submitted <Strong>on or after 1 April 2026</Strong> pays first
            registration tax without the concession.
          </>,
          <>
            A transitional arrangement covers e-PCs ordered on or before{" "}
            <Strong>25 February 2026</Strong>, or arranged by the owner for
            shipment to Hong Kong by then.
          </>,
          <>
            Those applications must be submitted{" "}
            <Strong>on or before 24 February 2027</Strong>.
          </>,
          <>
            Electric commercial vehicles, motorcycles and motor tricycles keep a{" "}
            <Strong>full waiver until 31 March 2028</Strong>. This change is
            about private cars only.
          </>,
        ]}
      />

      <H2 id="what-changed">What the Government announced</H2>

      <P>
        The 2026&ndash;27 Budget confirmed on 25 February 2026 that the first
        registration tax concession arrangement for electric private cars would
        not be extended beyond its 31 March 2026 expiry. Hong Kong has extended
        this concession repeatedly since it was introduced, so the assumption
        that it would be renewed again was reasonable. It was also wrong.
      </P>

      <P>
        First registration tax in Hong Kong is charged when a vehicle is first
        registered, on a taxable value determined by the Customs and Excise
        Department, in progressive bands. It is the single largest tax event in
        owning a car in Hong Kong, and for an electric private car the
        concession was the difference between a viable import and an
        uncompetitive one.
      </P>

      <PullQuote>
        Hong Kong has extended this concession before. That is precisely why the
        transitional deadline is the number to write down.
      </PullQuote>

      <H2 id="deadline">The date that still matters: 24 February 2027</H2>

      <StatGrid
        stats={[
          { value: "25 Feb 2026", label: "Order or shipment cut-off" },
          { value: "31 Mar 2026", label: "Concession expired" },
          { value: "24 Feb 2027", label: "Applications close" },
        ]}
      />

      <P>
        The transitional arrangement is narrow and it is generous to anyone who
        was already in the middle of a purchase. It covers electric private cars
        that were ordered on or before 25 February 2026, or that vehicle owners
        had arranged to be shipped to Hong Kong for their own use by that date
        &mdash; even if the car had not been first registered before 1 April
        2026.
      </P>

      <P>
        For those cars, local registered distributors, registered importers or
        the vehicle owners themselves must submit the application to pay first
        registration tax at the pre-adjustment concessionary level on or before{" "}
        <Strong>24 February 2027</Strong>.
      </P>

      <Timeline
        items={[
          {
            time: "25 February 2026",
            title: "Budget day, and the cut-off for eligibility",
            body: (
              <>
                The Government announces the concession will lapse. The same
                date becomes the eligibility line: an e-PC ordered on or before
                this day, or already arranged for shipment, remains inside the
                transitional arrangement.
              </>
            ),
          },
          {
            time: "31 March 2026",
            title: "The concession expires",
            body: (
              <>
                The first registration tax concession arrangement for electric
                private cars, including the One-for-One Replacement Scheme,
                reaches its stated expiry and is not renewed.
              </>
            ),
          },
          {
            time: "1 April 2026",
            title: "New applications lose the concession",
            body: (
              <>
                Any e-PC with a first-registration application submitted on or
                after this date is no longer entitled to the concession.
              </>
            ),
          },
          {
            time: "24 February 2027",
            title: "Transitional applications close",
            body: (
              <>
                Last day to submit an application for the pre-adjustment
                concessionary treatment on a qualifying e-PC. This is the live
                deadline.
              </>
            ),
          },
          {
            time: "31 March 2028",
            title: "Commercial EV waiver runs to here",
            body: (
              <>
                First registration tax on electric commercial vehicles, electric
                motorcycles and electric motor tricycles continues to be waived
                in full until this date.
              </>
            ),
          },
        ]}
      />

      <H2 id="landed">What it does to a landed number</H2>

      <P>
        Hong Kong is one of the markets where the tax event dwarfs everything
        else on the bill. The car, the freight and the marine cover are the
        small numbers; first registration tax is the large one. That is why the
        arithmetic here is unusually simple and unusually brutal: the same car,
        landed at the same port, on the same day, costs materially more to
        register after 1 April 2026 than before it.
      </P>

      <P>
        We are not printing a worked first-registration-tax figure. The rate is
        banded and applied to a taxable value the Customs and Excise Department
        determines rather than to your invoice, and the concession&rsquo;s
        pre-adjustment level applied a cap that varied by scheme. Publishing a
        single number would imply a precision the published schedule does not
        support for an arbitrary import. The Transport Department and the
        Customs and Excise Department are the authorities, and they should be
        the source of the figure you plan around.
      </P>

      <Callout title="The valuation trap, again" tone="amber">
        <p>
          As in Ireland and Kenya, Hong Kong assesses on its own determination
          of taxable value rather than on what you paid. A keen purchase price
          does not proportionally reduce first registration tax. Confirm the
          taxable value before you commit, not after the car is on the water.
        </p>
      </Callout>

      <H2 id="applies">Does this apply to you?</H2>

      <Table
        head={["Vehicle", "Position after 1 April 2026"]}
        rows={[
          [
            "Electric private car, new application",
            "Full first registration tax. No concession.",
          ],
          [
            "Electric private car ordered or shipped by 25 Feb 2026",
            "Concessionary treatment available if the application is submitted by 24 Feb 2027.",
          ],
          [
            "Electric commercial vehicle",
            "First registration tax waived in full until 31 March 2028.",
          ],
          [
            "Electric motorcycle or motor tricycle",
            "First registration tax waived in full until 31 March 2028.",
          ],
          [
            "Petrol, diesel or hybrid private car",
            "Unchanged. This announcement does not touch them.",
          ],
        ]}
        caption="Positions as announced by the Government of the Hong Kong SAR on 25 February 2026. Checked 10 September 2026."
      />

      <H3>Is your car still legal to import?</H3>

      <P>
        Yes. Nothing about admissibility has changed. Hong Kong has no age bar
        of the kind that governs Kenya, Sri Lanka or much of the Caribbean, and
        right-hand-drive stock from Japan and the United Kingdom remains the
        natural source. What changed is the tax on registering an electric
        private car once it arrives &mdash; a price question, not a permission
        question.
      </P>

      <H2 id="timing">Move now or wait?</H2>

      <P>
        Hong Kong is not doing anything unusual here. Ireland is running the
        same withdrawal on a longer timetable, and the shape is worth reading
        across &mdash; see our note on{" "}
        <InlineLink href="/latest-news/ireland-ev-incentives-taper-2026-2028">
          Ireland&rsquo;s electric vehicle relief taper
        </InlineLink>
        . An incentive introduced to seed adoption gets withdrawn once adoption
        stops needing seeding, and the buyer who waited pays the difference.
      </P>

      <P>
        If you hold a qualifying order, move. The 24 February 2027 date is a
        submission deadline for a benefit that does not come back, and
        submission is not the same as arrival &mdash; you need the car, the
        documents and the application together. Sea freight from Japan or the
        United Kingdom takes weeks before you reach a Transport Department
        counter, and a document that needs re-issuing takes weeks more.
      </P>

      <P>
        If you do not hold a qualifying order, there is nothing to rush for. The
        concession is already gone for you, and waiting costs you nothing on the
        tax line. That makes this one of the rare weeks where the honest advice
        to most Hong Kong readers is to slow down rather than speed up.
      </P>

      <UL>
        <CheckLI>
          <Strong>Work backwards from 24 February 2027.</Strong> Application
          date, not order date, is what the deadline governs.
        </CheckLI>
        <CheckLI>
          <Strong>Keep the order evidence.</Strong> Eligibility turns on having
          ordered or arranged shipment on or before 25 February 2026. That is a
          documentary claim, so keep the documents.
        </CheckLI>
        <CheckLI>
          <Strong>Re-run the comparison against a combustion car.</Strong> An
          electric private car that was competitive in Hong Kong on the
          concession may not be without it. That calculation is now different
          and it deserves redoing rather than assuming.
        </CheckLI>
      </UL>

      <H2 id="selling">
        Is this just news, or is someone selling you something?
      </H2>

      <P>
        We ship cars into Hong Kong, so we have an interest in you buying one.
        Here is the part that costs us: for most Hong Kong readers this
        announcement is a reason to import fewer electric private cars, not
        more. The concession was doing real work in the comparison, and it has
        stopped.
      </P>

      <P>
        The exception is the reader with a qualifying order sitting unregistered
        &mdash; and for them the deadline is the whole story. If that is you,
        the clock is the thing to act on, and the car is not.
      </P>

      <Disclaimer>
        First registration tax rates, taxable values and concession arrangements
        are set by the Government of the Hong Kong Special Administrative
        Region. Details above reflect the Government&rsquo;s announcement of 25
        February 2026 and were checked on 10 September 2026. Confirm your own
        position with the Transport Department before committing funds.
      </Disclaimer>

      <Callout
        title="Working out what a Hong Kong import actually lands at?"
        tone="emerald"
      >
        <p>
          We source right-hand-drive stock in Japan and the United Kingdom every
          week and quote one landed figure to your port before you commit. If
          you want a specific car checked against the current Hong Kong
          position, <InlineLink href="/request">send us the details</InlineLink>
          . Our{" "}
          <InlineLink href="/blog/japanese-auction-grades-explained">
            auction grades guide
          </InlineLink>{" "}
          explains what the inspection sheet actually certifies.
        </p>
      </Callout>
    </>
  );
}
