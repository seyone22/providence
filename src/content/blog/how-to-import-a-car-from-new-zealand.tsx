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
  UL,
} from "@/components/blog/prose";

export default function Body() {
  return (
    <>
      <Lead>
        New Zealand imports more used Japanese cars per head than anywhere on
        earth and puts every one through entry certification before it can be
        plated. That means a used car bought in New Zealand has already survived{" "}
        <Strong>somebody else&rsquo;s inspection regime</Strong>, at somebody
        else&rsquo;s expense, and the record follows the vehicle. Here is how to
        use that.
      </Lead>

      <KeyTakeaways
        items={[
          <>
            Ex-Japan stock has been <Strong>inspected twice</Strong> — in Japan,
            then at New Zealand entry.
          </>,
          <>
            The <Strong>entry-certification file</Strong> is the document to
            read before the advert.
          </>,
          <>
            One of the world&rsquo;s few genuine{" "}
            <Strong>used-EV markets</Strong>.
          </>,
          <>
            The <Strong>biosecurity clean</Strong> applies on the way out, not
            just on the way in.
          </>,
        ]}
      />

      <H2 id="why-nz">Why New Zealand</H2>
      <P>
        Because it functions as a quality-controlled version of the Japanese
        auction network. Decades of large-scale ex-Japan importing, filtered
        through a strict entry standard, maintained in a temperate climate, and
        recorded centrally. For a third-country buyer, that combination produces
        something unusual: used cars whose structural integrity and odometer
        accuracy have already been independently verified by a government
        regime.
      </P>
      <P>
        There is a second reason, less discussed. New Zealand absorbed used
        electric and plug-in vehicles in extraordinary numbers, which makes it
        one of the very few markets with genuine used-EV depth to choose from.
      </P>

      <H2 id="compliance-file">The entry-certification file</H2>
      <P>
        Every used import entering New Zealand must pass entry certification
        before it can be registered, covering structural integrity,
        frontal-impact standards, emissions and odometer accuracy. The record
        attaches to the vehicle.
      </P>
      <P>Read it before you read the advert. What it tells you:</P>
      <UL>
        <CheckLI>
          <Strong>When the car was complied</Strong>, and therefore how long it
          has been in New Zealand versus Japan.
        </CheckLI>
        <CheckLI>
          <Strong>Whether anything was required</Strong> to bring it up to
          standard, and what.
        </CheckLI>
        <CheckLI>
          <Strong>The odometer reading at entry</Strong>, which is the anchor
          point for everything since.
        </CheckLI>
        <CheckLI>
          <Strong>
            Whether the compliance history looks thin or contested
          </Strong>{" "}
          — cars in that category never reach our shortlists.
        </CheckLI>
      </UL>
      <Callout title="What this is worth to you" tone="emerald">
        <p>
          Structural damage and odometer tampering are the two failures that
          turn a used car into a bad decision. New Zealand entry certification
          screens for both, before you ever see the vehicle, and you did not pay
          for it. That is the argument for buying here rather than at Japanese
          auction.
        </p>
      </Callout>

      <H2 id="records">Registration and odometer records</H2>
      <P>
        Alongside the compliance file, New Zealand maintains central
        registration and inspection records that are straightforward to
        interrogate. Combined, they give you an odometer timeline from entry to
        the present and a periodic inspection history against it.
      </P>
      <P>
        Plot the readings, the same discipline that works on{" "}
        <InlineLink href="/blog/uk-car-history-checks-explained">
          British MOT records
        </InlineLink>
        . A rising line with consistent increments is what a genuine car looks
        like. A step backwards or an implausibly flat stretch is a hard stop
        rather than a negotiating point.
      </P>

      <H2 id="inspection">Inspection and the coastal caveat</H2>
      <P>
        New Zealand&rsquo;s rust reputation is better than most markets and it
        is not a free pass. Roads are not salted and the climate is temperate,
        both genuinely favourable. But coastal areas see salt air, and some
        ex-Japan cars arrived with corrosion already underway that compliance
        did not consider severe enough to fail.
      </P>
      <P>
        So our inspection photographs the underbody on every vehicle rather than
        quoting the climate at you. On electric and plug-in vehicles we add a{" "}
        <Strong>battery state-of-health test</Strong> — non-negotiable, because
        on a used EV the battery is most of the value. That subject has its own
        guide:{" "}
        <InlineLink href="/blog/importing-a-used-ev-from-new-zealand">
          importing a used EV from New Zealand
        </InlineLink>
        .
      </P>

      <H2 id="dereg">Deregistration and export</H2>
      <P>
        Used private vehicles can generally be exported once ownership is clear
        and the vehicle is deregistered. The steps are ownership verification,
        deregistration, proof of ownership documentation, and the customs export
        declaration.
      </P>
      <P>
        The real constraints are on the <em>receiving</em> side rather than the
        New Zealand side. Your destination&rsquo;s age limits, emissions
        standards and biosecurity requirements determine whether a given car is
        worth buying at all — which is why we check them before shortlisting
        rather than before shipping.
      </P>

      <H2 id="shipping">Biosecurity and shipping</H2>
      <P>
        New Zealand is famous for enforcing biosecurity on <em>arrivals</em>,
        and the same logic applies to departures: Australia, the Pacific islands
        and many African and Asian destinations will inspect your vehicle for
        soil and plant material on the quayside. A steam clean before loading
        produces the certificate and avoids mandatory cleaning at port rates.
      </P>
      <P>
        Vehicles load from Auckland, Tauranga or Lyttelton. Australia and the
        Pacific are short, frequent runs of roughly two to three weeks;
        South-East Asia is moderate; Africa, Europe and the Americas are five to
        eight weeks and considerably more expensive.
      </P>
      <P>
        Whether the price premium over buying direct from Japan is worth what
        you get is a fair question, and we answer it honestly in{" "}
        <InlineLink href="/blog/new-zealand-vs-japan-for-used-imports">
          New Zealand vs Japan
        </InlineLink>
        . The full cost breakdown is{" "}
        <InlineLink href="/blog/cost-to-import-a-car-from-new-zealand">
          here
        </InlineLink>
        .
      </P>

      <Disclaimer>
        New Zealand export requirements and destination age, emissions and
        biosecurity rules change. Entry-certification records reflect the
        standards applied at the time of compliance. Confirm the current
        position for your specific vehicle and destination before committing —
        we verify it per shipment.
      </Disclaimer>
    </>
  );
}
