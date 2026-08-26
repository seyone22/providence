"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Ship,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import FAQSection from "@/components/faqSection";
import GalleryPreview from "@/components/GalleryPreview";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import PreferredSourceCallout from "@/components/PreferredSourceCallout";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import { BLOG_BASE_PATH, getPost } from "@/config/blog";
import {
  COUNTRY_BASE_PATH,
  getCountryPage,
  SOURCE_COUNTRY_PAGES,
} from "@/config/countries";

// Head-office fallback shown wherever a local office's details are still blank,
// so a half-filled config never renders as a half-finished address.
const HEAD_OFFICE = {
  phone: "+44 208 004 3000",
  email: "info@providenceauto.uk.com",
};

// Spelled-out counts for the "rest of the network" heading, which changes with
// the length of `others` (always six — the other countries we buy in).
const COUNT_WORDS = [
  "No",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
];

// Destination country to prefill on the inquiry form. Only set for offices in
// markets we ship *into* — `countryOfImport` is the buyer's destination, so
// prefilling it with a source country would be wrong.
const FORM_DESTINATION: Record<string, string> = {
  "new-zealand": "New Zealand",
  "united-kingdom": "United Kingdom",
};

// Takes the slug rather than the resolved config: the config carries Lucide
// icon *components*, which React cannot serialise across the server→client
// boundary. Looking it up here keeps the whole object on the client side —
// the same reason the other campaign landings import their config directly.
export default function CountryLanding({ slug }: { slug: string }) {
  const config = getCountryPage(slug);

  // Signature-vehicle card → form prefill. Memoised so the form's prefill
  // effect only fires when a different vehicle is actually chosen.
  const [selected, setSelected] = useState<{
    make: string;
    model: string;
  } | null>(null);
  const [showNotice, setShowNotice] = useState(false);

  const prefill = useMemo(() => {
    const destination = FORM_DESTINATION[slug];
    if (!selected) {
      return destination ? { countryOfImport: destination } : undefined;
    }
    return {
      make: selected.make,
      vehicle_model: selected.model,
      ...(destination ? { countryOfImport: destination } : {}),
    };
  }, [selected, slug]);

  // The route only renders known slugs (page.tsx calls notFound() otherwise),
  // so this is a type narrowing guard rather than a reachable state.
  if (!config) return null;

  const handleSelect = (make: string, model: string) => {
    setSelected({ make, model });
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 7000);
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  const officeName = config.office.city || config.shortName;
  const hasAddress = config.office.addressLines.length > 0;
  const posts = config.blogSlugs
    .map((slug) => getPost(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  // The other countries we buy in.
  const others = SOURCE_COUNTRY_PAGES.filter((c) => c.slug !== config.slug);

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
      <MinimalHeader />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 bg-white overflow-hidden">
        <GradientMesh image={config.hero.backgroundImage} />

        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.2}
            duration={0.8}
            className="text-sm font-bold tracking-[0.4em] text-zinc-500 uppercase mb-8"
          >
            {config.hero.tagline}
          </Reveal>

          <Reveal
            immediate
            as="h1"
            y={30}
            scale={0.95}
            delay={0.3}
            duration={1}
            className="pa-headline-gradient text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[1.1] drop-shadow-[0_0_15px_rgba(255,255,255,1)] whitespace-pre-line"
          >
            {config.hero.title}
          </Reveal>

          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.5}
            duration={0.8}
            className="text-lg md:text-2xl text-zinc-600 font-light tracking-tight mb-10 max-w-3xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
          >
            {config.hero.subtitle}
          </Reveal>

          {/* Proof numbers */}
          <Reveal
            immediate
            y={20}
            delay={0.55}
            duration={0.8}
            className="grid grid-cols-3 gap-4 md:gap-10 mb-10 w-full max-w-2xl"
          >
            {config.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-4xl font-bold tracking-tighter text-black">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] md:text-sm text-zinc-500 font-light leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </Reveal>

          <Reveal
            immediate
            y={20}
            delay={0.6}
            duration={0.8}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <a
              href="#vehicles"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                See What We Source
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </a>
            <a
              href="#office"
              className="inline-flex items-center justify-center gap-2 px-8 py-5 text-lg font-medium text-black bg-white/80 backdrop-blur border border-black/10 rounded-full hover:bg-black hover:text-white transition-colors"
            >
              <Building2 size={18} />
              Our {config.shortName} team
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── SIGNATURE VEHICLES ───────────────────────── */}
      <section
        id="vehicles"
        className="py-24 md:py-32 px-6 bg-white relative z-10 border-t border-black/5 scroll-mt-24"
      >
        <div className="max-w-[1400px] mx-auto">
          <Reveal
            y={30}
            duration={0.7}
            className="text-center mb-14 md:mb-20 max-w-3xl mx-auto"
          >
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
              Select a vehicle to begin
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              What {config.country} does better than anywhere else.
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              Tap any vehicle and we&rsquo;ll open your inquiry with it
              pre-selected. Not on the list? Tell us the specification and our{" "}
              {config.shortName} team will go and find it.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {config.signature.map((vehicle, index) => (
              <Reveal
                key={`${vehicle.make}-${vehicle.model}`}
                y={24}
                delay={(index % 4) * 0.06}
                duration={0.5}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(vehicle.make, vehicle.model)}
                  aria-label={`Enquire about a ${vehicle.make} ${vehicle.model} from ${config.country}`}
                  className="group relative w-full h-44 md:h-52 overflow-hidden rounded-[1.75rem] border border-black/10 bg-zinc-900 hover:border-black/40 hover:shadow-[0_24px_50px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300 text-left"
                >
                  {/* biome-ignore lint/performance/noImgElement: remote/static hero image, intentional <img> per site convention */}
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model} sourced from ${config.country}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-2">
                    <span className="flex flex-col leading-tight">
                      <span className="text-white text-base md:text-lg font-bold tracking-tight drop-shadow-sm">
                        {vehicle.make} {vehicle.model}
                      </span>
                      <span className="text-white/70 text-xs font-medium drop-shadow-sm">
                        {vehicle.note}
                      </span>
                    </span>
                    <span className="shrink-0 w-8 h-8 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm flex items-center justify-center opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight size={15} className="text-white" />
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          {config.relatedCampaign && (
            <Reveal y={20} duration={0.6} className="text-center mt-12">
              <Link
                href={config.relatedCampaign.href}
                className="inline-flex items-center gap-2 text-black font-medium underline decoration-1 underline-offset-4 hover:decoration-2"
              >
                {config.relatedCampaign.label}
                <ArrowRight size={15} />
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      {/* Live stock tagged to this source country (tag mirrors the URL slug). */}
      <div className="px-6 md:px-8 bg-white relative z-10 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <GalleryPreview
            tags={[config.slug]}
            eyebrow="In Stock"
            title={`Sourced from ${config.shortName}`}
            subtitle={`Vehicles our ${config.shortName} team has already inspected and cleared, each delivered to your exact specification.`}
          />
        </div>
      </div>

      {/* ── SPECIALTY ────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 bg-[#FAFAFA] border-t border-black/5 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal
            y={30}
            duration={0.7}
            className="text-center mb-14 md:mb-20 max-w-3xl mx-auto"
          >
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
              {config.specialty.eyebrow}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              {config.specialty.title}
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              {config.specialty.blurb}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {config.specialty.items.map((item, index) => (
              <Reveal
                key={item.title}
                y={24}
                delay={(index % 2) * 0.08}
                duration={0.5}
                className="group flex flex-col items-start p-8 rounded-[2rem] bg-white border border-black/5 hover:border-black/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300"
              >
                <div className="p-3 bg-black/5 border border-black/10 rounded-2xl group-hover:bg-black group-hover:border-black transition-colors duration-500 mb-5">
                  <item.icon className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-base leading-relaxed font-light">
                  {item.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────────── */}
      <section className="py-28 md:py-44 px-6 bg-white border-y border-black/5 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal
            as="p"
            className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-zinc-400"
          >
            {config.intro.text.replace(config.intro.highlight, "")}{" "}
            <span className="text-black drop-shadow-sm">
              {config.intro.highlight}
            </span>
          </Reveal>
        </div>
      </section>

      {/* ── ADVANTAGES ───────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 bg-white relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal
            y={30}
            duration={0.7}
            className="text-center mb-14 md:mb-20 max-w-3xl mx-auto"
          >
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
              The advantage
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black">
              Why source from {config.country}?
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
            {config.advantages.map((item, index) => (
              <Reveal
                key={item.title}
                y={30}
                delay={(index % 2) * 0.08}
                duration={0.6}
                className="relative overflow-hidden group flex flex-col items-start p-8 md:p-10 rounded-[2rem] bg-zinc-50/60 hover:bg-zinc-50 border border-black/[0.07] hover:border-black/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white border border-black/10 rounded-2xl group-hover:bg-black group-hover:border-black transition-colors duration-500 shadow-sm">
                    <item.icon className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-zinc-500 text-base md:text-lg leading-relaxed font-light">
                  {item.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 bg-black text-white relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <Reveal
            y={30}
            duration={0.7}
            className="text-center mb-16 md:mb-20 max-w-3xl mx-auto"
          >
            <p className="text-xs font-bold tracking-[0.25em] text-white/40 uppercase mb-4">
              The process
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-5">
              Find it. Inspect it. Ship it.
            </h2>
            <p className="text-lg text-white/50 font-light">
              Four steps, all of them carried out by Providence staff in{" "}
              {config.country} — not subcontracted to an exporter you never
              speak to.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {config.process.map((step, index) => (
              <Reveal
                key={step.title}
                y={24}
                delay={(index % 2) * 0.08}
                duration={0.5}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:p-10 hover:border-white/20 hover:bg-white/[0.06] transition-colors duration-500"
              >
                <p className="text-5xl md:text-6xl font-bold tracking-tighter text-white/15 mb-4">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-white/60 text-base md:text-lg leading-relaxed font-light">
                  {step.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFICE + LOGISTICS ───────────────────────── */}
      <section
        id="office"
        className="py-24 md:py-32 px-6 bg-[#FAFAFA] border-y border-black/5 relative z-10 scroll-mt-24"
      >
        <div className="max-w-[1200px] mx-auto">
          <Reveal
            y={30}
            duration={0.7}
            className="text-center mb-14 md:mb-16 max-w-3xl mx-auto"
          >
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
              On the ground
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              Real people, on the ground, in {config.country}.
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              Sourcing a car from the other side of the world only works if
              somebody is standing next to it. That is what this team is for.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Office card */}
            <Reveal
              y={24}
              duration={0.6}
              className="rounded-[2rem] border border-black/8 bg-white p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-black rounded-2xl">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400">
                    Providence Auto
                  </p>
                  <p className="text-lg font-bold tracking-tight text-black">
                    {officeName}
                  </p>
                </div>
              </div>

              <dl className="space-y-4 text-base">
                <div className="flex gap-3">
                  <MapPin
                    size={18}
                    className="mt-1 shrink-0 text-zinc-400"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 mb-1">
                      Address
                    </dt>
                    <dd className="text-zinc-600 font-light leading-relaxed">
                      {hasAddress ? (
                        config.office.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))
                      ) : (
                        <span>
                          Full address available on request — ask the team when
                          you enquire.
                        </span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone
                    size={18}
                    className="mt-1 shrink-0 text-zinc-400"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 mb-1">
                      Phone
                    </dt>
                    <dd className="text-zinc-600 font-light">
                      <a
                        href={`tel:${(config.office.phone || HEAD_OFFICE.phone).replace(/\s/g, "")}`}
                        className="hover:text-black transition-colors"
                      >
                        {config.office.phone || HEAD_OFFICE.phone}
                      </a>
                      {!config.office.phone && (
                        <span className="block text-sm text-zinc-400">
                          Group line — routed to the {config.shortName} team
                        </span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail
                    size={18}
                    className="mt-1 shrink-0 text-zinc-400"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 mb-1">
                      Email
                    </dt>
                    <dd className="text-zinc-600 font-light">
                      <a
                        href={`mailto:${config.office.email || HEAD_OFFICE.email}`}
                        className="hover:text-black transition-colors"
                      >
                        {config.office.email || HEAD_OFFICE.email}
                      </a>
                    </dd>
                  </div>
                </div>

                {config.office.hours && (
                  <div className="flex gap-3">
                    <Clock
                      size={18}
                      className="mt-1 shrink-0 text-zinc-400"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 mb-1">
                        Hours
                      </dt>
                      <dd className="text-zinc-600 font-light">
                        {config.office.hours}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </Reveal>

            {/* Remit + logistics */}
            <div className="space-y-6">
              <Reveal
                y={24}
                delay={0.08}
                duration={0.6}
                className="rounded-[2rem] border border-black/8 bg-white p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center gap-3 mb-5">
                  <Users size={20} className="text-black" />
                  <h3 className="text-lg font-bold tracking-tight text-black">
                    What this team handles
                  </h3>
                </div>
                <ul className="space-y-3">
                  {config.office.remit.map((line) => (
                    <li
                      key={line}
                      className="flex gap-3 text-base text-zinc-600 font-light leading-relaxed"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal
                y={24}
                delay={0.16}
                duration={0.6}
                className="rounded-[2rem] border border-black/8 bg-white p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center gap-3 mb-5">
                  <Ship size={20} className="text-black" />
                  <h3 className="text-lg font-bold tracking-tight text-black">
                    Shipping from {config.shortName}
                  </h3>
                </div>
                <dl className="space-y-4 text-base">
                  <div>
                    <dt className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 mb-1">
                      Ports we load from
                    </dt>
                    <dd className="text-zinc-600 font-light">
                      {config.logistics.ports.join(" · ")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 mb-1">
                      Where we ship
                    </dt>
                    <dd className="text-zinc-600 font-light leading-relaxed">
                      {config.logistics.shipsTo}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 mb-1">
                      Typical transit
                    </dt>
                    <dd className="text-zinc-600 font-light leading-relaxed">
                      {config.logistics.transit}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── GUIDES ───────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="py-24 md:py-32 px-6 bg-white relative z-10">
          <div className="max-w-6xl mx-auto">
            <Reveal
              y={30}
              duration={0.7}
              className="text-center mb-12 max-w-3xl mx-auto"
            >
              <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
                From our guides
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                {config.shortName}, answered properly.
              </h2>
              <p className="text-lg text-zinc-500 font-light">
                The questions dealers and direct buyers ask us most about
                sourcing from {config.country} — written out in full.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <Reveal
                  as="div"
                  key={post.slug}
                  y={20}
                  delay={i * 0.05}
                  duration={0.5}
                >
                  <Link
                    href={`${BLOG_BASE_PATH}/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-sky-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
                  >
                    {/* biome-ignore lint/performance/noImgElement: remote hero image, intentional <img> per site convention */}
                    <img
                      src={post.heroImage}
                      alt={post.heroAlt}
                      loading="lazy"
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-6 flex flex-1 flex-col">
                      <h3 className="text-lg font-bold text-black group-hover:text-sky-600 transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-zinc-500 font-light leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                        <Clock size={12} />
                        {post.readingTimeMins} min read
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── INQUIRY + FAQ ────────────────────────────── */}
      <section
        id="inquiry"
        className="py-32 px-6 relative flex flex-col justify-center items-center bg-zinc-50 border-t border-black/5 z-10 overflow-hidden scroll-mt-20"
      >
        <Reveal
          y={40}
          duration={1}
          className="relative z-10 text-center max-w-4xl mx-auto mb-10"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black mb-6">
            Tell us exactly what you want.
          </h2>
          <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
            Your car, sourced from{" "}
            <span className="text-black font-medium">{config.country}</span> by
            our own team — with one all-in landed cost quoted before you commit.
          </p>
        </Reveal>

        <AnimatePresence>
          {showNotice && selected && (
            <motion.div
              key="prefill-notice"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-3xl mx-auto mb-4 px-6 py-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-700 text-sm font-medium text-center relative z-20"
            >
              Inquiry pre-filled with{" "}
              <strong>
                {selected.make} {selected.model}
              </strong>
              . Add your destination and spec below.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full relative z-20">
          <Suspense
            fallback={
              <div className="w-full max-w-3xl mx-auto h-[550px] flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 text-zinc-500">
                Loading form...
              </div>
            }
          >
            <RequestForm
              key={`${selected?.make ?? ""}-${selected?.model ?? ""}`}
              prefill={prefill}
            />
          </Suspense>
        </div>

        <div className="mt-24 w-full relative z-20">
          <FAQSection
            data={{
              title: `Sourcing From ${config.shortName} — Your Questions Answered`,
              subtitle: `Straight answers about buying a vehicle in ${config.country} and landing it in your country.`,
              categories: [{ category: config.shortName, items: config.faqs }],
            }}
          />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* ── OTHER OFFICES ────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 bg-white border-t border-black/5 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Reveal y={30} duration={0.7} className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
              The rest of the network
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              {COUNT_WORDS[others.length] ?? others.length} other countries. One
              landed price.
            </h2>
            <p className="text-lg text-zinc-500 font-light max-w-2xl mx-auto">
              If {config.country} is not where your car lands cheapest, we will
              tell you — and source it from wherever it does.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {others.map((other, i) => (
              <Reveal
                as="div"
                key={other.slug}
                y={20}
                delay={(i % 4) * 0.05}
                duration={0.5}
              >
                <Link
                  href={`${COUNTRY_BASE_PATH}/${other.slug}`}
                  className="group flex h-full flex-col justify-between rounded-[1.5rem] border border-black/5 bg-zinc-50/60 p-6 hover:bg-white hover:border-black/10 hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] transition-all duration-300"
                >
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-2">
                      {other.region}
                    </p>
                    <h3 className="text-lg font-bold tracking-tight text-black group-hover:text-sky-600 transition-colors mb-2">
                      {other.shortName}
                    </h3>
                    <p className="text-sm text-zinc-500 font-light leading-relaxed">
                      {other.cardBlurb}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600">
                    View country
                    <ArrowRight
                      size={12}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal y={20} duration={0.6} className="text-center mt-10">
            <Link
              href={COUNTRY_BASE_PATH}
              className="inline-flex items-center gap-2 text-black font-medium underline decoration-1 underline-offset-4 hover:decoration-2"
            >
              See the whole network
              <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── PREFERRED SOURCE ─────────────────────────── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <PreferredSourceCallout />
      </section>
    </main>
  );
}
