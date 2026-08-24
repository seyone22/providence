import {
  Anchor,
  ArrowRight,
  Building2,
  FileCheck2,
  Handshake,
  Landmark,
  MapPin,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import DotGlobe, { GLOBE_PALETTE_LIGHT } from "@/components/DotGlobe";
import GradientMesh from "@/components/GradientMesh";
import LandedCostBar from "@/components/LandedCostBar";
import MinimalHeader from "@/components/MinimalHeader";
import OdometerCounter from "@/components/OdometerCounter";
import RadialBurst from "@/components/RadialBurst";
import { Reveal } from "@/components/Reveal";
import VoyageTrack, { type VoyageStage } from "@/components/VoyageTrack";
import {
  COUNTRY_BASE_PATH,
  COUNTRY_PAGES,
  OFFICE_COUNTRIES_SENTENCE,
} from "@/config/countries";

const SITE = "https://www.providenceauto.co.uk";
const PATH = "/about-us";
const URL = `${SITE}${PATH}`;
const TITLE = "About Providence Auto | Global Vehicle Sourcing Group";
const DESCRIPTION =
  "A global vehicle sourcing group with our own people on the ground in eight countries. See how we source, verify and land cars worldwide.";
// Cropped to the 1200×630 size link-preview crawlers (Facebook, LinkedIn,
// X, Slack…) expect. Self-hosted so the preview can't break when a
// third-party CDN rewrites a URL.
const OG_IMAGE = `${SITE}/about/og-about-us.jpg`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "about providence auto",
    "global car sourcing company",
    "vehicle import company",
    "international car exporter",
    "car sourcing group worldwide",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: URL,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Providence Auto — a global vehicle sourcing group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

// ── Stats — real figures, shared by the hero row and the full grid below. ──
const STATS = [
  { value: 15, suffix: "+", label: "Years trading history" },
  { value: 8, label: "Countries with our own presence" },
  { value: 40, suffix: "+", label: "Retail sourcing markets" },
  { value: 26, label: "Destination markets served" },
  { value: 100, suffix: "+", label: "Dealer sourcing markets" },
  { value: 24, suffix: " hrs", label: "To your first sourcing quote" },
];

// ── The six values, dealt as a deck. `rot`/`y` are the card's angle and lift
// in the fan, handed to the .pa-fan rules in globals.css as custom
// properties; `z` stacks each card over the one before it. The fan itself is
// lg-only — below that these are a plain horizontal scroller.
//
// `lqip` is an 8×10 WebP of the photo, inlined as a data URL (60–160 bytes
// each, ~700 bytes for the row). It goes out as the `--fan-lqip` custom
// property and the card paints it as a plain background-image, stretched to
// cover, while the real photo is in flight. Measured on the deployed site,
// each optimised photo is 60–90 KB and Cloudflare returns
// `cf-cache-status: DYNAMIC` for `/_next/image`, so every request travels to
// Railway — around 0.5s from a desktop and 1.5–2s from a phone on mobile
// data. Nothing in the card used to paint before its photo landed, so the row
// read as blank white for exactly that long while you swiped it. This needs no
// request, so the card has real pixels from the moment the HTML parses.
//
// Pass it as a background, not through next/image's `placeholder="blur"`:
// that ships the same thumbnail wrapped in an SVG carrying two chained
// feGaussianBlur(20) filters, which has to be rasterised per card and is what
// made the swipe itself judder.
//
// Regenerate with sharp if a photo is replaced:
//   sharp(file).resize(8, 10, { fit: "cover" }).webp({ quality: 40 })
const VALUES = [
  {
    n: "01",
    name: "Trust",
    line: "We earn it before we ask for anything in return. Every conversation, every car.",
    src: "/about/value-trust.jpg",
    lqip: "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAACwAQCdASoIAAoAA4BaJaQAAuc/wEgAAP7sWdN8zCAP/Uj07hvEwgtytJQLFeBEdjVkwL0JsGW4QAAA",
    alt: "A Mercedes-Benz grille and star with a Providence Auto plate below it",
    rot: "-6deg",
    y: "1.5rem",
    z: 11,
  },
  {
    n: "02",
    name: "Reliability",
    line: "When we say we'll call, we call. When we say it's ready, it's ready.",
    src: "/about/value-reliability.jpg",
    lqip: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAQCdASoIAAoAA4BaJZwAAldnNekAAP7x4KLEZdUkDbvp+scHnqWSO4PdN1dB0MKDCcuaAz41r4H2LrwIAA==",
    alt: "The headlight and front wing of a white saloon in close detail",
    rot: "-3.6deg",
    y: "0.5rem",
    z: 12,
  },
  {
    n: "03",
    name: "Transparency",
    line: "No hidden fees, no small print. You see the price, the process and the people.",
    src: "/about/value-transparency.jpg",
    lqip: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAQCdASoIAAoAA4BaJZwAAueKfalBMAD+5Tr8ooB40eiyJ7BDxy8/E6Gu0KI6hrVFcGQdwErX/WBR2mAgAA==",
    alt: "The front of a silver sports car under low garage light",
    rot: "-1.2deg",
    y: "0rem",
    z: 13,
  },
  {
    n: "04",
    name: "Commitment",
    line: "It doesn't end at handover. We're in it for every mile after the sale.",
    src: "/about/value-commitment.jpg",
    lqip: "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACwAQCdASoIAAoAA4BaJbACdADzeaBwAP6bY3IAuHFYBhTjOjSSDruet/me+fQ5EJxa0sJfEizoiZXNTcb2CaqlA/vCkH3IKYuD6hHXgMMKAAAA",
    alt: "The rear wheel and tail light of a yellow supercar in close detail",
    rot: "1.2deg",
    y: "0rem",
    z: 14,
  },
  {
    n: "05",
    name: "Honesty",
    line: "What the car needs, and what we'd choose ourselves. Advice over a quick sale.",
    src: "/about/value-honesty.jpg",
    lqip: "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoIAAoAA4BaJZQCdAD0slMyIAAA/u0muB3IowvHcMG5tBZXaU88SZZDqGV/hzHCD1GMhSYl0TEbFxxOGAA=",
    alt: "A lit headlight on a dark SUV at night",
    rot: "3.6deg",
    y: "0.5rem",
    z: 15,
  },
  {
    n: "06",
    name: "Relationship",
    line: "We remember your name and what matters to you. Not a transaction — a beginning.",
    src: "/about/value-relationship.jpg",
    lqip: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAAAwAQCdASoIAAoAA4BaJaQAA3AA/vWY2Zlf5o/96++oOcgix2FYkJeVESnQAAAA",
    alt: "The rear of a dark coupé at night with its tail lights lit",
    rot: "6deg",
    y: "1.5rem",
    z: 16,
  },
];

// ── Why we're different (condensed from /source-cars-from) ─────────────────
const PILLARS = [
  {
    icon: Building2,
    title: "Eight countries, not eight agents",
    desc: "Nothing is subcontracted to an exporter you never speak to.",
  },
  {
    icon: FileCheck2,
    title: "Transparency before payment",
    desc: "You see the inspection before we spend your money.",
  },
  {
    icon: Users,
    title: "One team, start to finish",
    desc: "A named consultant owns your import, start to finish — not a shared inbox.",
  },
  {
    icon: Landmark,
    title: "One landed price",
    desc: "One number for the total cost, wherever the car comes from.",
  },
];

// ── How an import tracks ─────────────────────────────────────────────────────
// VoyageTrack's own defaults end at "Customs cleared" → "Delivered". We contract
// to the destination port, so the last two pips are stated at that level and the
// handover after it is left unqualified rather than promised as a door delivery.
const IMPORT_STAGES: VoyageStage[] = [
  { label: "Sourcing", at: 0 },
  { label: "Purchased", at: 0.18 },
  { label: "At origin port", at: 0.36 },
  { label: "At sea", at: 0.62 },
  { label: "At destination port", at: 0.84 },
  { label: "Handover", at: 1 },
];

// ── Who we serve ─────────────────────────────────────────────────────────────
const AUDIENCES = [
  {
    icon: MapPin,
    title: "Direct buyers",
    desc: "Skip the dealer markup. Source the exact spec yourself.",
    href: "/b2c",
    cta: "For direct buyers",
  },
  {
    icon: Store,
    title: "Dealerships",
    desc: "Sell inventory you don't hold. We source and ship on request.",
    href: "/b2b",
    cta: "For dealerships",
  },
  {
    icon: Handshake,
    title: "Dealer platform",
    desc: "Embed our stock on your site. It sources and ships itself — you keep the commission.",
    href: "/saas",
    cta: "The dealer platform",
  },
];

// ── Where we ship ────────────────────────────────────────────────────────────
// Region grouping per the news-editorial-playbook.md destination-market
// definition; country list matches the "destination" role entries in
// src/config/globe.ts (globe.ts has no region field, so the grouping lives
// here rather than being derived).
const DESTINATION_REGIONS = [
  {
    region: "Europe",
    countries: ["Ireland", "United Kingdom", "Malta", "Cyprus", "Jersey"],
  },
  {
    region: "Africa",
    countries: [
      "Kenya",
      "Uganda",
      "Zimbabwe",
      "Tanzania",
      "Mauritius",
      "Seychelles",
    ],
  },
  {
    region: "Caribbean",
    countries: [
      "Jamaica",
      "Trinidad & Tobago",
      "Barbados",
      "Guyana",
      "Bahamas",
    ],
  },
  {
    region: "Asia-Pacific",
    countries: [
      "Australia",
      "New Zealand",
      "Hong Kong",
      "Malaysia",
      "Indonesia",
      "Thailand",
      "Pakistan",
      "Bangladesh",
      "Nepal",
      "Singapore",
    ],
  },
];

// The "Where we source" column is deliberately not the raw registry: Sri Lanka
// is a destination market and our South Asia operations base, not a country we
// buy cars in, so listing it under sourcing overstates it. Same treatment the
// footer office column already gives it — the /source-cars-from/sri-lanka page
// still exists and is still reachable from "Explore the full network".
const SOURCING_HIDDEN_SLUGS = new Set(["sri-lanka"]);
const SOURCING_COUNTRIES = COUNTRY_PAGES.filter(
  (country) => !SOURCING_HIDDEN_SLUGS.has(country.slug),
);

/**
 * Short gradient hairline that sits where the eyebrow label used to. Section
 * headings now carry their own label inside the sentence (see CLAUDE.md,
 * "Heading language"), so this rule is what re-establishes the visual step
 * down from one section to the next.
 */
function SectionRule({ align = "center" }: { align?: "center" | "left" }) {
  return (
    <span
      aria-hidden
      className={`mb-6 block h-px w-12 bg-gradient-to-r from-sky-500 to-violet-500 ${
        align === "center" ? "mx-auto" : ""
      }`}
    />
  );
}

export default function AboutUsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "About Us", item: URL },
    ],
  };

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: TITLE,
    url: URL,
    mainEntity: {
      "@type": "Organization",
      name: "Providence Auto",
      alternateName: "Providence Trading Limited",
      url: `${SITE}/`,
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
      description:
        "Providence Auto is a global vehicle sourcing and export group that buys, inspects and ships cars through its own teams on the ground in eight countries, shipping to 21+ destination markets worldwide.",
      foundingLocation: "London, United Kingdom",
      areaServed: "Worldwide",
      sameAs: ["https://www.instagram.com/providenceautouk/"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />

      {/* The horizontal clip lives on this wrapping div, not on <main> itself:
          on iOS the same clip applied directly to the <main> landmark degrades
          touch-scroll momentum for any nested horizontal scroller (the Our
          Values row below).

          It has to be `overflow-hidden` on BOTH axes, not `overflow-x-hidden`
          on its own. With overflow-y left at `visible`, CSS promotes the used
          value of overflow-y to `auto` — which quietly turns this div into a
          scroll container wrapping all ~13,000px of the page. On iOS a
          horizontal scroller nested inside a page-wide scroll container drops
          off the main-frame painting path onto the overflow-scroller path,
          where the tile budget is far tighter: swipe the values row and its
          cards render as blank white for seconds before popping in, because
          the tiles behind them were never rasterised. Nothing in the section
          is dimmed or unloaded at that point — the whole card, its near-black
          background and its caption included, simply isn't painted.

          This is the same wrapper the home page uses (src/app/page.tsx), which
          is the one page whose horizontal strip has never misbehaved on an
          iPhone. Nothing here relies on the promoted scroller: every section
          that can overflow already clips itself, and there are no sticky
          descendants that would start sticking to this div instead of the
          viewport. */}
      <main className="min-h-screen bg-white text-black font-sans">
        <div className="relative w-full overflow-hidden">
          <MinimalHeader />

          {/* ── HERO ─────────────────────────────────── */}
          <section className="relative overflow-hidden px-6 pt-36 md:pt-40 pb-16">
            <GradientMesh animated />
            <div className="relative z-10 max-w-5xl mx-auto text-center">
              <Reveal
                as="h1"
                immediate
                y={20}
                duration={0.8}
                className="pa-headline-gradient text-4xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6"
              >
                Any car. Any country.
                <br className="hidden md:block" /> Any port.
              </Reveal>
              <Reveal
                immediate
                y={16}
                delay={0.1}
                duration={0.6}
                className="text-xl md:text-2xl text-zinc-500 font-light max-w-3xl mx-auto"
              >
                Providence Auto is a global vehicle sourcing group with our own
                people in{" "}
                <span className="text-black font-medium">
                  {OFFICE_COUNTRIES_SENTENCE}
                </span>
                . We buy, inspect and ship your car ourselves — no brokers, no
                borders.
              </Reveal>

              <Reveal
                y={20}
                delay={0.2}
                duration={0.6}
                className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
              >
                {STATS.slice(0, 4).map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-black/5 bg-white/85 px-4 py-5 sm:bg-white/70 sm:backdrop-blur-sm"
                  >
                    <div className="flex justify-center">
                      <OdometerCounter
                        value={s.value}
                        suffix={s.suffix}
                        label={s.label}
                        className="text-2xl md:text-3xl font-bold tracking-tight text-center"
                      />
                    </div>
                  </div>
                ))}
              </Reveal>
            </div>
          </section>

          {/* ── OUR VALUES ───────────────────────────── */}
          <section className="px-6 pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto">
              <Reveal
                y={24}
                duration={0.6}
                className="text-center mb-10 lg:mb-14"
              >
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                  Our values.
                </h2>
              </Reveal>

              {/* One row below lg, which keeps the section about one screen
                tall instead of three rows deep, with the caption back inside
                the photo.

                The scroller itself is deliberately the home page gallery strip
                and nothing else — same flex container, same proximity snapping,
                same overscroll containment, same in-flow photo. That strip is
                the one horizontal scroller on this site that has never
                misbehaved on an iPhone, so it is the pattern rather than a
                starting point, and what earlier attempts layered on top of it
                stays gone: no reveal wrapper around the scroller, no per-card
                z-index below lg, no next/image `fill` putting the photo out of
                flow, no opacity driven off scroll position, and no mandatory
                snapping.

                The deal-in the cards now do is a CSS view timeline, sampled by
                the compositor rather than by an observer, and it moves nothing
                but rotate/translate/scale. See the .pa-fan block in globals.css
                for why that is the one kind of scroll motion this row can
                safely carry. */}
              <div className="flex gap-4 overflow-x-auto overscroll-x-contain pb-6 -mx-6 px-6 snap-x snap-proximity scroll-px-6 lg:mx-0 lg:px-0 lg:gap-0 lg:scroll-px-0 lg:items-end lg:justify-center lg:overflow-visible lg:pb-0 lg:pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {VALUES.map((v) => (
                  <div
                    key={v.name}
                    style={
                      {
                        "--fan-rot": v.rot,
                        "--fan-y": v.y,
                        "--fan-z": v.z,
                        // Quoted so the `;` in `data:image/webp;base64,` sits
                        // inside a CSS string rather than ending the
                        // declaration when this is parsed out of the style
                        // attribute.
                        "--fan-lqip": `url('${v.lqip}')`,
                      } as CSSProperties
                    }
                    className="pa-fan relative w-[240px] shrink-0 snap-start lg:-ml-16 lg:w-48 lg:first:ml-0 xl:w-56"
                  >
                    {/* The card, not the <img>, carries the placeholder:
                      .pa-fan-card paints --fan-lqip as a plain background, so
                      there are real pixels here the moment the HTML parses and
                      no filter to rasterise. */}
                    <div className="pa-fan-card relative aspect-[4/5] overflow-hidden rounded-[1.25rem] lg:rounded-[1.5rem] lg:shadow-[0_30px_70px_-35px_rgba(0,0,0,0.6)]">
                      <Image
                        src={v.src}
                        alt={v.alt}
                        width={900}
                        height={1125}
                        sizes="(max-width: 1023px) 240px, 224px"
                        // No `placeholder="blur"`. It ships this same 8×10
                        // thumbnail, but wrapped in an SVG carrying two
                        // chained feGaussianBlur(20) filters over a 900×1125
                        // viewBox, painted as a background on the <img>. That
                        // filter graph is re-evaluated per card, six times, on
                        // the raster path the scroller is already competing
                        // for — it bought instant pixels at the cost of the
                        // swipe being smooth. The card behind gives the same
                        // first paint for one bitmap stretch.
                        //
                        // No `quality` prop either. Next 16 only serves the
                        // qualities in `images.qualities`, which defaults to
                        // [75]: a production build coerces the prop back to
                        // 75 at render time, and requesting
                        // /_next/image?…&q=70 directly returns 400. It looks
                        // like it works in dev, where the optimiser answers
                        // any quality. Lowering it for real would mean adding
                        // the value to next.config.ts, which changes every
                        // image on the site — not worth it for ~5% on six
                        // decorative photos.
                        //
                        // All six load the same way, exactly as the home page
                        // gallery strip does. `loading="eager"` makes Next.js
                        // inject a <link rel=preload> whose scanner width
                        // guess (256w) doesn't match what the laid-out <img>
                        // needs at 2x DPR (640w), so an eager photo gets
                        // fetched twice; but splitting the row into two eager
                        // and four lazy just moved the problem, since the four
                        // lazy cards then had nothing decoded when their tile
                        // was first painted. Uniformly lazy, with no preload
                        // links on the page at all, is what the reference
                        // scroller does and what holds up on iOS.
                        //
                        // Don't reach for `fetchPriority` to bias the first
                        // two: next/image (16.1.6) drops it from the
                        // server-rendered HTML, so it only lands once React
                        // hydrates — long after the browser has decided what
                        // to fetch. Checked against the served markup on
                        // staging, where it appears nowhere in the document.
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="pa-fan-scrim absolute inset-0" />
                      {/* The lit half of the hover cross-fade. lg-only, so a
                        phone never paints it at all. */}
                      <div className="pa-fan-scrim-open absolute inset-0 hidden lg:block" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">
                          {v.n}
                        </p>
                        <p className="mt-1.5 text-lg font-bold tracking-tight text-white">
                          {v.name}
                        </p>
                        {/* On the deck the cards overlap, so the line is held
                          back until the card is hovered. In the row below lg
                          nothing covers it, so it just shows. */}
                        <p className="pa-fan-line mt-1.5 text-[12px] font-light leading-snug text-zinc-200">
                          {v.line}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── IN SHORT (AEO direct-answer block) ──────── */}
          <section className="px-6 max-w-3xl mx-auto pb-20">
            <Reveal
              y={20}
              duration={0.6}
              className="rounded-[1.75rem] border border-black/5 bg-[#FAFAFA] p-8 md:p-10"
            >
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
                What is Providence Auto?
              </p>
              <p className="text-lg text-zinc-700 font-light leading-relaxed">
                Providence Auto is a global vehicle sourcing and export group.
                We buy, inspect and ship cars through our own teams on the
                ground in eight countries — Japan, the UK, the UAE, India,
                Thailand, Australia, New Zealand and Sri Lanka — to 21+
                right-hand-drive and luxury left-hand-drive markets worldwide.
              </p>
            </Reveal>
          </section>

          {/* ── THE FRICTION ─────────────────────────── */}
          <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-y border-black/5">
            <div className="max-w-4xl mx-auto">
              <Reveal y={24} duration={0.6} className="mb-12">
                <SectionRule align="left" />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                  The problem is, buying a car still means settling.
                </h2>
                <p className="text-lg text-zinc-500 font-light">
                  Local lots only show what's already sitting on them. Going
                  abroad looks like a maze of duty, paperwork and sellers you
                  can't verify.
                </p>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    title: "The spec you want isn't on the lot",
                    desc: "Dealers stock what they could get, not what you want.",
                  },
                  {
                    title: "The price isn't the price",
                    desc: "Duty, freight and registration costs show up after you've committed.",
                  },
                  {
                    title: "You can't verify a car eight time zones away",
                    desc: "No one to inspect it. No one to answer for it.",
                  },
                ].map((item, i) => (
                  <Reveal
                    key={item.title}
                    y={24}
                    delay={i * 0.08}
                    duration={0.5}
                    className="rounded-[1.75rem] bg-white border border-black/5 p-7"
                  >
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-zinc-500 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── WHO WE ARE ────────────────────────────── */}
          <section className="py-20 md:py-28 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-10 lg:gap-16 items-center">
              <Reveal
                as="figure"
                y={28}
                duration={0.7}
                className="order-2 lg:order-1"
              >
                <div className="relative">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] ring-1 ring-black/5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]">
                    <Image
                      src="/about/ferrari-296-cabin.jpg"
                      alt="The red leather cabin of a right-hand-drive Ferrari 296 GTB with a Providence Auto mat laid in the footwell"
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="hidden sm:block absolute -bottom-8 -right-5 w-40 lg:w-48 aspect-square overflow-hidden rounded-[1.25rem] ring-4 ring-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)]">
                    <Image
                      src="/about/ferrari-296-exterior.jpg"
                      alt="The same Ferrari 296 GTB photographed head-on, with a Providence Auto plate"
                      fill
                      sizes="(max-width: 1024px) 160px, 192px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <figcaption className="mt-6 sm:mt-14 text-sm font-light text-zinc-400">
                  The same right-hand-drive Ferrari 296 GTB, inside and out —
                  our mats, our plate.
                </figcaption>
              </Reveal>

              <Reveal y={24} duration={0.6} className="order-1 lg:order-2">
                <SectionRule align="left" />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                  We are not a marketplace, and not a broker network.
                </h2>
                <p className="text-lg text-zinc-500 font-light">
                  Providence Auto is the trading name of Providence Trading
                  Limited. For 15+ years we've bought, inspected and shipped
                  every car ourselves — through our own people in the source
                  country, never a chain of intermediaries who never see the
                  vehicle.
                </p>
              </Reveal>
            </div>
          </section>

          {/* ── HOW IT WORKS ─────────────────────────── */}
          <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-y border-black/5">
            <div className="max-w-5xl mx-auto">
              <Reveal
                y={24}
                duration={0.6}
                className="text-center mb-12 max-w-2xl mx-auto"
              >
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                  Here's how it works — you request it, we source it, it ships.
                </h2>
                <p className="text-lg text-zinc-500 font-light">
                  Tell us the exact car — a full sourcing quote comes back in 24
                  hours. We buy it through our own team in the source country,
                  verify it, and get it moving. Every import tracks the same
                  way:
                </p>
              </Reveal>

              <Reveal
                y={24}
                duration={0.7}
                className="relative mb-6 aspect-[1297/556] overflow-hidden rounded-[2rem] ring-1 ring-black/5"
              >
                <Image
                  src="/about/in-motion.jpg"
                  alt="A car at speed on an open road, photographed with a panning blur"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                />
              </Reveal>

              <Reveal
                y={20}
                duration={0.6}
                className="rounded-[2rem] bg-white border border-black/5 p-6 md:p-10"
              >
                <VoyageTrack stages={IMPORT_STAGES} />
              </Reveal>
            </div>
          </section>

          {/* ── WHY WE'RE DIFFERENT ─────────────────── */}
          <section className="relative overflow-hidden py-20 md:py-28 px-6 bg-black">
            <Image
              src="/about/coupe-overcast.jpg"
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/75 to-black" />
            <div className="relative z-10 max-w-6xl mx-auto">
              <Reveal
                y={24}
                duration={0.6}
                className="text-center mb-12 max-w-3xl mx-auto"
              >
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-5">
                  The difference is that people on the ground beat an inbox.
                </h2>
                <p className="text-lg text-zinc-400 font-light">
                  Almost everything that goes wrong with a vehicle import goes
                  wrong in the source country, thousands of miles from the
                  buyer. So that's where we put our people.
                </p>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {PILLARS.map((pillar, i) => (
                  <Reveal
                    key={pillar.title}
                    y={24}
                    delay={i * 0.06}
                    duration={0.5}
                    className="group flex flex-col items-start p-7 rounded-[1.75rem] bg-white/[0.06] border border-white/10 sm:bg-white/[0.04] sm:backdrop-blur-sm hover:border-white/25 hover:bg-white/[0.09] sm:hover:bg-white/[0.07] transition-all duration-300"
                  >
                    <div className="p-3 bg-white/10 border border-white/15 rounded-2xl group-hover:bg-white group-hover:border-white transition-colors duration-500 mb-5">
                      <pillar.icon className="text-white h-5 w-5 group-hover:text-black transition-colors duration-500" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed font-light">
                      {pillar.desc}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── OUR NETWORK ───────────────────────────── */}
          <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-y border-black/5">
            <div className="max-w-6xl mx-auto">
              <Reveal
                y={24}
                duration={0.6}
                className="text-center mb-10 max-w-3xl mx-auto"
              >
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                  Our network is eight bases, forty-plus sourcing markets and
                  twenty-one destinations.
                </h2>
                <p className="text-lg text-zinc-500 font-light">
                  Our own teams sit in eight countries and buy in many more.
                  Every route below is a real shipping lane, not a claim — drag
                  to spin it.
                </p>
              </Reveal>

              <Reveal
                y={20}
                duration={0.6}
                className="mx-auto max-w-xl rounded-[2rem] border border-black/5 bg-white p-4 md:p-6"
              >
                <DotGlobe palette={GLOBE_PALETTE_LIGHT} />
              </Reveal>

              <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-sky-600 uppercase mb-4">
                    Where we source
                  </p>
                  <ul className="flex flex-col divide-y divide-black/5 rounded-[1.5rem] border border-black/5 bg-white overflow-hidden">
                    {SOURCING_COUNTRIES.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`${COUNTRY_BASE_PATH}/${c.slug}`}
                          className="group flex items-start justify-between gap-4 px-5 py-4 hover:bg-[#FAFAFA] transition-colors"
                        >
                          <div>
                            <span className="font-bold text-sm">
                              {c.shortName}
                            </span>
                            <p className="text-sm text-zinc-500 font-light mt-0.5">
                              {c.cardBlurb}
                            </p>
                          </div>
                          <ArrowRight
                            size={14}
                            className="mt-1 shrink-0 text-zinc-300 group-hover:text-sky-600 group-hover:translate-x-1 transition-all"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={COUNTRY_BASE_PATH}
                    className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-black hover:text-sky-600 transition-colors group"
                  >
                    Explore the full network
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-sky-600 uppercase mb-4">
                    Where we ship
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DESTINATION_REGIONS.map((r) => (
                      <div
                        key={r.region}
                        className="rounded-[1.5rem] bg-white border border-black/5 p-5"
                      >
                        <p className="text-xs font-bold tracking-[0.15em] text-zinc-400 uppercase mb-3">
                          {r.region}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.countries.map((country) => (
                            <span
                              key={country}
                              className="inline-flex items-center rounded-full bg-black/5 px-2.5 py-1 text-[12px] font-medium text-zinc-700"
                            >
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-sm text-zinc-500 font-light">
                    Buying a left-hand-drive luxury marque?{" "}
                    <Link
                      href="/japanese-luxury-cars-lhd"
                      className="font-bold text-black hover:text-sky-600 transition-colors"
                    >
                      See our LHD sourcing route
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── THE MATH THAT MATTERS ────────────────── */}
          <section className="py-20 md:py-28 px-6">
            <div className="max-w-3xl mx-auto">
              <Reveal y={24} duration={0.6} className="text-center mb-10">
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                  The math that matters is one landed number, before you commit.
                </h2>
                <p className="text-lg text-zinc-500 font-light">
                  Duty, VAT, freight and registration differ on every lane. We
                  work out the full landed cost first — not after you've paid.
                  Here's a real one:
                </p>
              </Reveal>

              <Reveal
                y={20}
                duration={0.6}
                className="rounded-[2rem] border border-black/5 bg-[#FAFAFA] p-8"
              >
                <LandedCostBar />
              </Reveal>

              <div className="text-center mt-8">
                <Link
                  href="/ireland-cost-calculator"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-black hover:text-sky-600 transition-colors group"
                >
                  Try the landed-cost calculator
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </section>

          {/* ── PROTECTING YOUR MONEY ─────────────────── */}
          <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-y border-black/5">
            <div className="max-w-3xl mx-auto">
              <Reveal y={24} duration={0.6} className="text-center mb-10">
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                  We protect your money by showing you the car before we spend
                  it.
                </h2>
              </Reveal>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Independent inspection first",
                    desc: "If a car doesn't match its grade, it doesn't ship. You aren't charged.",
                  },
                  {
                    icon: FileCheck2,
                    title: "Payment held until verified",
                    desc: "Funds are secured, not released, until the car checks out.",
                  },
                  {
                    icon: Anchor,
                    title: "Marine cover on the voyage",
                    desc: "Arranged from the source country to the port of arrival.",
                  },
                  {
                    icon: Users,
                    title: "One named consultant",
                    desc: "The same person, from your first message to arrival.",
                  },
                ].map((item, i) => (
                  <Reveal
                    key={item.title}
                    as="li"
                    y={20}
                    delay={i * 0.06}
                    duration={0.5}
                    className="flex items-start gap-3 rounded-[1.5rem] bg-white border border-black/5 p-5"
                  >
                    <div className="p-2 bg-black/5 border border-black/10 rounded-xl mt-0.5">
                      <item.icon className="text-black h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-zinc-500 text-sm font-light">
                        {item.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>
              <div className="text-center mt-8">
                <Link
                  href="/team"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-black hover:text-sky-600 transition-colors group"
                >
                  Meet the sourcing team
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </section>

          {/* ── TAGLINE BAND ─────────────────────────── */}
          <section className="relative h-[240px] md:h-[320px] overflow-hidden">
            <Image
              src="/about/ferrari-f8-detail.jpg"
              alt="Close detail of the front wing and headlight of a red Ferrari"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
            <div className="relative z-10 flex h-full max-w-6xl mx-auto px-6 flex-col justify-center">
              <Reveal y={20} duration={0.7} className="max-w-lg">
                <p className="text-2xl md:text-4xl font-bold tracking-tighter text-white leading-[1.15]">
                  Powered by trust. Driven by value.
                </p>
                <p className="mt-3 text-sm font-light text-zinc-300">
                  The line printed on the mat we lay in every car we handle.
                </p>
              </Reveal>
            </div>
          </section>

          {/* ── WHO WE SERVE ─────────────────────────── */}
          <section className="py-20 md:py-28 px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal
                y={24}
                duration={0.6}
                className="text-center mb-12 max-w-3xl mx-auto"
              >
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                  We serve three kinds of buyer, through one network.
                </h2>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {AUDIENCES.map((a, i) => (
                  <Reveal key={a.title} y={24} delay={i * 0.08} duration={0.5}>
                    <Link
                      href={a.href}
                      className="group flex h-full flex-col items-start p-8 rounded-[2rem] bg-[#FAFAFA] border border-black/5 hover:border-sky-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300"
                    >
                      <div className="p-3 bg-black/5 border border-black/10 rounded-2xl group-hover:bg-black group-hover:border-black transition-colors duration-500 mb-5">
                        <a.icon className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3">
                        {a.title}
                      </h3>
                      <p className="text-zinc-500 text-base leading-relaxed font-light flex-1">
                        {a.desc}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sky-600">
                        {a.cta}
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── BY THE NUMBERS ───────────────────────── */}
          <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-y border-black/5">
            <div className="max-w-5xl mx-auto">
              <Reveal y={24} duration={0.6} className="text-center mb-12">
                <SectionRule />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                  The network, by the numbers.
                </h2>
              </Reveal>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {STATS.map((s, i) => (
                  <Reveal
                    key={s.label}
                    y={20}
                    delay={i * 0.05}
                    duration={0.5}
                    className="rounded-2xl border border-black/5 bg-white px-5 py-6 text-center"
                  >
                    <div className="flex justify-center">
                      <OdometerCounter
                        value={s.value}
                        suffix={s.suffix}
                        label={s.label}
                        className="text-3xl md:text-4xl font-bold tracking-tight text-center"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── CLOSING CTA ──────────────────────────── */}
          <section className="relative overflow-hidden py-24 md:py-32 px-6 text-center">
            {/* RadialBurst's own root is hard-coded `relative` — passing
              `absolute inset-0` straight into its className loses that
              cascade fight (Tailwind compiles `.relative` after `.absolute`,
              so it wins regardless of class order) and the burst collapses to
              zero height. Owning the absolute positioning here and sizing the
              burst with plain `h-full w-full` sidesteps the conflict. */}
            <div className="absolute inset-0">
              <RadialBurst
                className="h-full w-full"
                colours={["#0ea5e9", "#8b5cf6"]}
              />
            </div>
            <Reveal
              y={24}
              duration={0.7}
              className="relative z-10 max-w-3xl mx-auto"
            >
              <SectionRule />
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                Any car. Any country. Any port.
              </h2>
              <p className="text-lg text-zinc-500 font-light mb-8">
                Tell us the car. A named consultant sends back the full landed
                cost — one number, before you commit.
              </p>
              <Link
                href="/request"
                className="group inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold text-white bg-black rounded-full transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
              >
                Start your request
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Reveal>
          </section>
        </div>
      </main>
    </>
  );
}
