import { ArrowRight, Award, Globe, MapPin, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedProfiles } from "@/actions/sales-profile-actions";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import { OFFICE_COUNTRIES_SENTENCE } from "@/config/countries";

const SITE = "https://www.providenceauto.co.uk";
const TITLE =
  "Our Sourcing Team — The People Who Buy Your Car | Providence Auto";
const DESCRIPTION = `Meet the Providence Auto sourcing consultants. Every import is owned end to end by one named person with people on the ground in ${OFFICE_COUNTRIES_SENTENCE} — not a shared inbox.`;

// A profile can be published or unpublished at any time, so this index is
// rebuilt on the same cadence as the profile pages themselves.
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "providence auto team",
    "car sourcing consultant",
    "vehicle import specialist",
    "personal car sourcing agent",
    "car export consultant",
  ],
  alternates: { canonical: "/team" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: `${SITE}/team`,
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

export default async function TeamIndexPage() {
  const members = await listPublishedProfiles();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Our team",
        item: `${SITE}/team`,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Providence Auto sourcing consultants",
    itemListElement: members.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.displayName,
      url: `${SITE}/team/${m.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {members.length > 0 && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

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
            The Sourcing Team
          </Reveal>
          <Reveal
            as="h1"
            immediate
            y={20}
            duration={0.8}
            className="pa-headline-gradient text-4xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6"
          >
            One car.
            <br className="hidden md:block" /> One person.
          </Reveal>
          <Reveal
            immediate
            y={16}
            delay={0.1}
            duration={0.6}
            className="text-xl md:text-2xl text-zinc-500 font-light max-w-3xl mx-auto"
          >
            Every Providence import is owned end to end by a named consultant —
            the same person from the first message to the day the car clears
            customs. Ours are on the ground in{" "}
            <span className="text-black font-medium">
              {OFFICE_COUNTRIES_SENTENCE}
            </span>
            .
          </Reveal>
        </section>

        {/* ── TEAM GRID ────────────────────────────── */}
        <section className="px-6 max-w-6xl mx-auto pb-24">
          {members.length === 0 ? (
            <div className="max-w-xl mx-auto text-center rounded-[2rem] border border-black/5 bg-[#FAFAFA] p-12">
              <p className="text-lg text-zinc-500 font-light mb-6">
                Our consultant profiles are being published shortly. In the
                meantime, send us what you're looking for and we'll put the
                right person in your source market on it.
              </p>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-bold text-sm hover:bg-sky-500 transition-colors"
              >
                Start a request <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {members.map((m, i) => (
                <Reveal
                  as="div"
                  key={m.slug}
                  y={24}
                  delay={i * 0.05}
                  duration={0.5}
                >
                  <Link
                    href={`/team/${m.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-sky-500/20 hover:shadow-[0_24px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                      {m.photoUrl ? (
                        // biome-ignore lint/performance/noImgElement: R2-hosted portrait, no next/image loader configured
                        <img
                          src={m.photoUrl}
                          alt={m.displayName}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                          <UserRound size={56} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-xl font-bold tracking-tight mb-1">
                        {m.displayName}
                      </h2>
                      <p className="text-sm text-zinc-500 font-light leading-relaxed flex-1">
                        {m.tagline || m.headline}
                      </p>

                      {/* Quick facts, one box each — same treatment as the
                          profile page hero. */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {m.yearsExperience ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold">
                            <Award size={11} className="text-sky-500" />
                            {m.yearsExperience}+ yrs
                          </span>
                        ) : null}
                        {m.languages.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold">
                            <Globe size={11} className="text-sky-500" />
                            {m.languages.join(" · ")}
                          </span>
                        )}
                        {m.sourcingCountries.map((c) => (
                          <span
                            key={c.country}
                            className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold"
                          >
                            {c.flag ? (
                              <span className="leading-none">{c.flag}</span>
                            ) : (
                              <MapPin size={11} className="text-sky-500" />
                            )}
                            {c.country}
                          </span>
                        ))}
                      </div>

                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sky-600">
                        Work with {(m.displayName || "").split(" ")[0]}
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
          )}
        </section>

        {/* ── CLOSING CTA ──────────────────────────── */}
        <section className="py-24 px-6 bg-[#FAFAFA] border-t border-black/5">
          <Reveal
            y={24}
            duration={0.6}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-5">
              Not sure who to ask for?
            </h2>
            <p className="text-lg text-zinc-500 font-light mb-8">
              Tell us the car and the country it's going to. We'll route it to
              the consultant who knows that source market best, and you'll deal
              with them directly from there.
            </p>
            <Link
              href="/request"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black text-white font-bold text-sm hover:bg-sky-500 transition-colors group"
            >
              Start a request
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </Reveal>
        </section>
      </main>
    </>
  );
}
