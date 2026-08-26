import { ArrowRight, Building2, Globe2, Ship, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import MinimalHeader from "@/components/MinimalHeader";
import PreferredSourceCallout from "@/components/PreferredSourceCallout";
import { Reveal } from "@/components/Reveal";
import {
  COUNTRY_BASE_PATH,
  SOURCE_COUNTRIES_SENTENCE,
  SOURCE_COUNTRY_PAGES,
} from "@/config/countries";

const SITE = "https://www.providenceauto.co.uk";
const TITLE =
  "Our Global Network — Seven Countries, One Landed Price | Providence Auto";
const DESCRIPTION = `Providence Auto buys directly in ${SOURCE_COUNTRIES_SENTENCE}, and sources vehicles from many more. Our own teams find, inspect and ship every car — see what each country does best.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "global car sourcing network",
    "international vehicle sourcing teams",
    "car exporter with global teams",
    "source cars from japan uk uae india thailand",
    "vehicle sourcing company worldwide",
  ],
  alternates: { canonical: COUNTRY_BASE_PATH },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: `${SITE}${COUNTRY_BASE_PATH}`,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const PILLARS = [
  {
    icon: Building2,
    title: "Seven countries, not seven agents",
    desc: "Every country on this page has Providence staff in it. They bid, they inspect, they file the export paperwork and they load the vessel. Nothing is subcontracted to an exporter you never speak to.",
  },
  {
    icon: Globe2,
    title: "We source far beyond them",
    desc: "These seven are where we buy, with our own people on the ground. We source across many more markets than these, and we add new ones as the volume justifies it.",
  },
  {
    icon: Users,
    title: "One team owns your car",
    desc: "The team that buys your vehicle stays with it. Inspection reports, photographs and shipping milestones come from the people who physically handled it.",
  },
  {
    icon: Ship,
    title: "One landed price, wherever it comes from",
    desc: "We compare the total landed cost across our source countries for the specification you want, then buy where it lands cheapest — and quote you a single all-in figure before you commit.",
  },
];

export default function GlobalNetworkPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Global network",
        item: `${SITE}${COUNTRY_BASE_PATH}`,
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Providence Auto",
    url: `${SITE}/`,
    logo: `${SITE}/logo.png`,
    description:
      "Global vehicle sourcing and export group with physical offices across Europe, Asia, the Middle East and Oceania.",
    areaServed: "Worldwide",
    subOrganization: SOURCE_COUNTRY_PAGES.map((c) => ({
      "@type": "LocalBusiness",
      name: `Providence Auto ${c.shortName}`,
      url: `${SITE}${COUNTRY_BASE_PATH}/${c.slug}`,
      areaServed: c.region,
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Providence Auto source countries",
    itemListElement: SOURCE_COUNTRY_PAGES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.shortName,
      url: `${SITE}${COUNTRY_BASE_PATH}/${c.slug}`,
    })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
            The Global Network
          </Reveal>
          <Reveal
            as="h1"
            immediate
            y={20}
            duration={0.8}
            className="pa-headline-gradient text-4xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6"
          >
            Seven countries.
            <br className="hidden md:block" /> One standard.
          </Reveal>
          <Reveal
            immediate
            y={16}
            delay={0.1}
            duration={0.6}
            className="text-xl md:text-2xl text-zinc-500 font-light max-w-3xl mx-auto"
          >
            Providence Auto buys directly in{" "}
            <span className="text-black font-medium">
              {SOURCE_COUNTRIES_SENTENCE}
            </span>
            , and sources vehicles from many more markets besides. Wherever your
            car comes from, it is our own people who find it, inspect it and put
            it on the ship.
          </Reveal>
        </section>

        {/* ── OFFICE GRID ──────────────────────────── */}
        <section className="px-6 max-w-6xl mx-auto pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOURCE_COUNTRY_PAGES.map((c, i) => (
              <Reveal
                as="div"
                key={c.slug}
                y={24}
                delay={i * 0.05}
                duration={0.5}
              >
                <Link
                  href={`${COUNTRY_BASE_PATH}/${c.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-sky-500/20 hover:shadow-[0_24px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden bg-zinc-900">
                    {/* biome-ignore lint/performance/noImgElement: remote/static hero image, intentional <img> per site convention */}
                    <img
                      src={c.hero.backgroundImage}
                      alt={`Vehicles Providence Auto sources from ${c.country}`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 mb-1">
                        {c.region}
                      </p>
                      <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                        {c.shortName}
                      </h2>
                    </div>
                    <span className="absolute top-4 right-4 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                      {c.role === "hub"
                        ? "Operations hub"
                        : c.role === "both"
                          ? "Source & hub"
                          : "Source market"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-base text-zinc-500 font-light leading-relaxed flex-1">
                      {c.cardBlurb}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sky-600">
                      See the {c.shortName} team
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── HOW THE NETWORK WORKS ────────────────── */}
        <section className="py-24 md:py-32 px-6 bg-[#FAFAFA] border-y border-black/5 mt-16">
          <div className="max-w-6xl mx-auto">
            <Reveal
              y={30}
              duration={0.7}
              className="text-center mb-14 max-w-3xl mx-auto"
            >
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                Why it is built this way
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                People on the ground beat an inbox.
              </h2>
              <p className="text-lg text-zinc-500 font-light">
                Almost everything that goes wrong with a vehicle import goes
                wrong in the source country, thousands of miles from the buyer.
                So that is where we put our people.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {PILLARS.map((pillar, i) => (
                <Reveal
                  key={pillar.title}
                  y={24}
                  delay={(i % 2) * 0.08}
                  duration={0.5}
                  className="group flex flex-col items-start p-8 md:p-10 rounded-[2rem] bg-white border border-black/5 hover:border-black/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300"
                >
                  <div className="p-3 bg-black/5 border border-black/10 rounded-2xl group-hover:bg-black group-hover:border-black transition-colors duration-500 mb-5">
                    <pillar.icon className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-zinc-500 text-base leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────── */}
        <section className="py-24 md:py-32 px-6 text-center max-w-3xl mx-auto">
          <Reveal y={24} duration={0.7}>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              Not sure which country is cheapest?
            </h2>
            <p className="text-lg text-zinc-500 font-light mb-8">
              Tell us the car. We will compare the landed cost from every
              country that can supply it and come back with one all-in figure —
              before you commit anything.
            </p>
            <Link
              href="/request"
              className="group inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold text-white bg-black rounded-full transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
            >
              Start your inquiry
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </Reveal>
        </section>

        {/* ── PREFERRED SOURCE ─────────────────────────── */}
        <section className="px-6 pb-20 max-w-4xl mx-auto">
          <PreferredSourceCallout />
        </section>
      </main>
    </>
  );
}
