import {
  Anchor,
  ArrowRight,
  Award,
  Building2,
  FileCheck2,
  Globe2,
  Handshake,
  Landmark,
  MapPin,
  Search,
  Send,
  ShieldCheck,
  Ship,
  Store,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
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
  "A global vehicle sourcing group with our own offices in eight countries. See how we source, verify and land cars worldwide.";
// Same source photo as the UK office hero, cropped to the 1200×630 size
// link-preview crawlers (Facebook, LinkedIn, X, Slack…) expect.
const OG_IMAGE =
  "https://images.unsplash.com/photo-1637859460045-ac3ae9ced99d?q=80&w=1200&h=630&fit=crop&auto=format";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "about providence auto",
    "global car sourcing company",
    "vehicle import company",
    "international car exporter",
    "car sourcing group offices worldwide",
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

// ── How it works ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    icon: Send,
    title: "Request",
    desc: "Tell us the exact car. A full global sourcing quote comes back within 24 hours.",
  },
  {
    icon: Search,
    title: "Source",
    desc: "We search 40+ markets for your spec at the most tax-efficient price, buying through our own offices in eight of them.",
  },
  {
    icon: Ship,
    title: "Shipping",
    desc: "It arrives cleared, compliant, and ready to register.",
  },
];

// ── Why we're different (condensed from /source-cars-from) ─────────────────
const PILLARS = [
  {
    icon: Building2,
    title: "Eight offices, not eight agents",
    desc: "Nothing is subcontracted to an exporter you never speak to.",
  },
  {
    icon: FileCheck2,
    title: "Transparency before payment",
    desc: "You see the inspection report before we spend a dollar of your money.",
  },
  {
    icon: Users,
    title: "One team, start to finish",
    desc: "A named consultant owns your import end to end — not a shared inbox.",
  },
  {
    icon: Landmark,
    title: "One landed price",
    desc: "We quote the total cost across every source country, wherever it comes from.",
  },
];

// ── Who we serve ─────────────────────────────────────────────────────────────
const AUDIENCES = [
  {
    icon: MapPin,
    title: "Direct buyers",
    desc: "Skip the dealer markup — source the exact spec yourself, through the same network dealers use.",
    href: "/b2c",
    cta: "For direct buyers",
  },
  {
    icon: Store,
    title: "Dealerships",
    desc: "Sell inventory you don't hold. We source and ship on request, so your lot isn't your ceiling.",
    href: "/b2b",
    cta: "For dealerships",
  },
  {
    icon: Handshake,
    title: "Dealer platform",
    desc: "Embed our global stock on your own site. The system sources and ships automatically — you keep the commission.",
    href: "/saas",
    cta: "The dealer platform",
  },
];

// ── Where we deliver ─────────────────────────────────────────────────────────
// Region grouping per the news-editorial-playbook.md destination-market
// definition; country list matches the "destination" role entries in
// src/config/globe.ts (globe.ts has no region field, so the grouping lives
// here rather than being derived).
const DESTINATION_REGIONS = [
  {
    region: "Europe",
    countries: ["Ireland", "United Kingdom", "Malta", "Cyprus", "Jersey"],
  },
  { region: "Africa", countries: ["Kenya", "Uganda", "Zimbabwe"] },
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
      "Sri Lanka",
      "Maldives",
    ],
  },
];

// ── By the numbers ───────────────────────────────────────────────────────────
const STATS = [
  { value: "15+", label: "Years trading history" },
  { value: "8", label: "Countries with our own offices" },
  { value: "40+", label: "Retail sourcing markets" },
  { value: "100+", label: "Dealer sourcing markets" },
  { value: "24 hrs", label: "To your first sourcing quote" },
  { value: "21", label: "Destination markets served" },
];

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
        "Providence Auto is a global vehicle sourcing and export group that buys, inspects and ships cars through its own offices in eight countries, delivering to 21+ destination markets worldwide.",
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

      <main className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
        <MinimalHeader />

        {/* ── HERO ─────────────────────────────────── */}
        <section className="px-6 pt-36 md:pt-40 pb-16 max-w-5xl mx-auto text-center">
          <Reveal
            as="p"
            immediate
            y={16}
            duration={0.6}
            className="text-sm font-bold tracking-[0.3em] text-zinc-400 uppercase mb-5"
          >
            About Providence Auto
          </Reveal>
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
            We are building the world's largest borderless showroom — a global
            vehicle sourcing group with our own people in{" "}
            <span className="text-black font-medium">
              {OFFICE_COUNTRIES_SENTENCE}
            </span>
            .
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
                className="rounded-2xl border border-black/5 bg-[#FAFAFA] px-4 py-5"
              >
                <div className="text-2xl md:text-3xl font-bold tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs text-zinc-500 mt-1 leading-snug">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
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
              Providence Auto is a global vehicle sourcing and export group that
              buys, inspects and ships cars through its own offices in eight
              countries — Japan, the UK, the UAE, India, Thailand, Australia,
              New Zealand and Sri Lanka — delivering to 21+ right-hand-drive and
              luxury left-hand-drive markets worldwide.
            </p>
          </Reveal>
        </section>

        {/* ── THE FRICTION ─────────────────────────── */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-y border-black/5">
          <div className="max-w-4xl mx-auto">
            <Reveal y={24} duration={0.6} className="mb-12">
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                The problem
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                Buying a car still means settling.
              </h2>
              <p className="text-lg text-zinc-500 font-light">
                Local lots only show what's already sitting on them. Going
                abroad for it looks like a maze of duties, paperwork and sellers
                nobody can vouch for.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: "The spec you want isn't on the lot",
                  desc: "Dealers sell what they were able to stock, not what fits your list.",
                },
                {
                  title: "The price isn't the price",
                  desc: "Duty, freight and registration costs surface after you've already committed.",
                },
                {
                  title: "You can't verify a car eight time zones away",
                  desc: "No one to inspect it, no one to answer for it if the listing was wrong.",
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

        {/* ── WHO WE ARE + HOW IT WORKS ────────────── */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <Reveal y={24} duration={0.6}>
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                Who we are
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                Not a marketplace. Not a broker network.
              </h2>
              <p className="text-lg text-zinc-500 font-light max-w-3xl mx-auto">
                Providence Auto is the trading name of Providence Trading
                Limited. For 15+ years we've bought cars ourselves, inspected
                them ourselves, and shipped them ourselves — through our own
                offices, not a chain of intermediaries who never see the
                vehicle.
              </p>
            </Reveal>
          </div>

          <div className="max-w-5xl mx-auto">
            <Reveal y={20} duration={0.6} className="text-center mb-10">
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase">
                How it works
              </p>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-black mt-3">
                Three steps. One landed price.
              </h3>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {STEPS.map((step, i) => (
                <Reveal
                  key={step.title}
                  y={24}
                  delay={i * 0.08}
                  duration={0.5}
                  className="group flex flex-col items-start p-8 rounded-[2rem] bg-[#FAFAFA] border border-black/5 hover:border-black/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300"
                >
                  <div className="p-3 bg-black/5 border border-black/10 rounded-2xl group-hover:bg-black group-hover:border-black transition-colors duration-500 mb-5">
                    <step.icon className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-1">
                    Step {i + 1}
                  </span>
                  <h4 className="text-xl font-bold text-black mb-2">
                    {step.title}
                  </h4>
                  <p className="text-zinc-500 text-base leading-relaxed font-light">
                    {step.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY WE'RE DIFFERENT ─────────────────── */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-y border-black/5">
          <div className="max-w-6xl mx-auto">
            <Reveal
              y={24}
              duration={0.6}
              className="text-center mb-12 max-w-3xl mx-auto"
            >
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                The difference
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                An office beats an inbox.
              </h2>
              <p className="text-lg text-zinc-500 font-light">
                Almost everything that goes wrong with a vehicle import goes
                wrong in the source country, thousands of miles from the buyer.
                So that's where we put our people.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {PILLARS.map((pillar, i) => (
                <Reveal
                  key={pillar.title}
                  y={24}
                  delay={i * 0.06}
                  duration={0.5}
                  className="group flex flex-col items-start p-7 rounded-[1.75rem] bg-white border border-black/5 hover:border-black/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300"
                >
                  <div className="p-3 bg-black/5 border border-black/10 rounded-2xl group-hover:bg-black group-hover:border-black transition-colors duration-500 mb-5">
                    <pillar.icon className="text-black h-5 w-5 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-base font-bold text-black mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOURCING NETWORK ─────────────────────── */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal
              y={24}
              duration={0.6}
              className="text-center mb-12 max-w-3xl mx-auto"
            >
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                Where we source
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                Eight offices. Forty-plus markets.
              </h2>
              <p className="text-lg text-zinc-500 font-light">
                Our own operations teams sit in eight countries, each with its
                own specialty, and we buy well beyond them.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COUNTRY_PAGES.map((c, i) => (
                <Reveal
                  as="div"
                  key={c.slug}
                  y={20}
                  delay={i * 0.04}
                  duration={0.5}
                >
                  <Link
                    href={`${COUNTRY_BASE_PATH}/${c.slug}`}
                    className="group flex h-full flex-col p-6 rounded-[1.5rem] border border-black/5 bg-white hover:border-sky-500/20 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] transition-all duration-300"
                  >
                    <span className="inline-flex self-start rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-3">
                      {c.role === "hub"
                        ? "Hub"
                        : c.role === "both"
                          ? "Source & hub"
                          : "Source"}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight mb-1.5">
                      {c.shortName}
                    </h3>
                    <p className="text-sm text-zinc-500 font-light leading-relaxed flex-1">
                      {c.cardBlurb}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600">
                      Visit the office
                      <ArrowRight
                        size={12}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal y={20} duration={0.5} className="text-center mt-10">
              <Link
                href={COUNTRY_BASE_PATH}
                className="inline-flex items-center gap-2 text-sm font-bold text-black hover:text-sky-600 transition-colors group"
              >
                Explore the full network
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── WHERE WE DELIVER ─────────────────────── */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-y border-black/5">
          <div className="max-w-4xl mx-auto">
            <Reveal y={24} duration={0.6} className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                Where we deliver
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                Every right-hand-drive country on earth.
                <br className="hidden md:block" /> Plus left-hand-drive, for
                luxury.
              </h2>
              <p className="text-lg text-zinc-500 font-light max-w-2xl mx-auto">
                Twenty-one priority destination markets today, across four
                regions — plus a standing exception for luxury marques into
                left-hand-drive Europe, the Middle East and the Americas.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {DESTINATION_REGIONS.map((r, i) => (
                <Reveal
                  key={r.region}
                  y={20}
                  delay={i * 0.06}
                  duration={0.5}
                  className="rounded-[1.5rem] bg-white border border-black/5 p-6"
                >
                  <p className="text-xs font-bold tracking-[0.2em] text-sky-600 uppercase mb-3">
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
                </Reveal>
              ))}
            </div>

            <Reveal y={16} duration={0.5} className="text-center mt-8">
              <p className="text-sm text-zinc-500 font-light">
                Buying a left-hand-drive luxury marque?{" "}
                <Link
                  href="/japanese-luxury-cars-lhd"
                  className="font-bold text-black hover:text-sky-600 transition-colors"
                >
                  See our LHD sourcing route
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── TAX / LANDED COST + TRUST ────────────── */}
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14">
            {/* Landed cost */}
            <Reveal y={24} duration={0.6}>
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                The math that matters
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-black mb-4">
                One all-in number, before you commit.
              </h2>
              <p className="text-zinc-500 font-light leading-relaxed mb-6">
                Import duty, VAT, freight and registration tax differ on every
                lane. We work the full landed cost out before you buy — not
                after.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  {
                    icon: Landmark,
                    title: "Japan → UK",
                    desc: "0% import duty under the UK–Japan CEPA, with a valid statement of origin.",
                  },
                  {
                    icon: Anchor,
                    title: "Japan → Ireland",
                    desc: "0% duty under the EU–Japan EPA, effective 1 February 2026.",
                  },
                  {
                    icon: Globe2,
                    title: "India → anywhere",
                    desc: "Sourced at roughly 30% below the global average vehicle price.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="p-2 bg-black/5 border border-black/10 rounded-xl mt-0.5">
                      <item.icon className="text-black h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-zinc-500 text-sm font-light">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/ireland-cost-calculator"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold text-black hover:text-sky-600 transition-colors group"
              >
                Try the landed-cost calculator
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Reveal>

            {/* Trust */}
            <Reveal y={24} duration={0.6} delay={0.08}>
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                Protecting your money
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-black mb-4">
                You see the car before we spend yours.
              </h2>
              <ul className="flex flex-col gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Independent inspection first",
                    desc: "If a car doesn't match its stated grade, it doesn't ship — and you aren't charged.",
                  },
                  {
                    icon: FileCheck2,
                    title: "Payment held until verified",
                    desc: "Funds are secured, not released, until the car checks out.",
                  },
                  {
                    icon: Anchor,
                    title: "Door-to-door marine insurance",
                    desc: "Covered from the source country to your door.",
                  },
                  {
                    icon: Users,
                    title: "One named consultant",
                    desc: "The same person from your first message to the day it clears customs.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="p-2 bg-black/5 border border-black/10 rounded-xl mt-0.5">
                      <item.icon className="text-black h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-zinc-500 text-sm font-light">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/team"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold text-black hover:text-sky-600 transition-colors group"
              >
                Meet the sourcing team
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── WHO WE SERVE ─────────────────────────── */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAFA] border-y border-black/5">
          <div className="max-w-6xl mx-auto">
            <Reveal
              y={24}
              duration={0.6}
              className="text-center mb-12 max-w-3xl mx-auto"
            >
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                Who we serve
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                Three ways in. One network behind them.
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {AUDIENCES.map((a, i) => (
                <Reveal key={a.title} y={24} delay={i * 0.08} duration={0.5}>
                  <Link
                    href={a.href}
                    className="group flex h-full flex-col items-start p-8 rounded-[2rem] bg-white border border-black/5 hover:border-sky-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300"
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
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <Reveal y={24} duration={0.6} className="text-center mb-12">
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                By the numbers
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
                The network, in figures.
              </h2>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {STATS.map((s, i) => (
                <Reveal
                  key={s.label}
                  y={20}
                  delay={i * 0.05}
                  duration={0.5}
                  className="rounded-2xl border border-black/5 bg-[#FAFAFA] px-5 py-6 text-center"
                >
                  <div className="flex items-center justify-center gap-1.5 text-3xl font-bold tracking-tight">
                    <Award size={18} className="text-sky-500 shrink-0" />
                    {s.value}
                  </div>
                  <div className="text-xs text-zinc-500 mt-2 leading-snug">
                    {s.label}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLOSING CTA ──────────────────────────── */}
        <section className="py-24 md:py-32 px-6 text-center max-w-3xl mx-auto">
          <Reveal y={24} duration={0.7}>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              Any car. Any country. Any port.
            </h2>
            <p className="text-lg text-zinc-500 font-light mb-8">
              Tell us the car you want. A named consultant comes back with the
              full landed cost — one number, before you commit.
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
      </main>
    </>
  );
}
