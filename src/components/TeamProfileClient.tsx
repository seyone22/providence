"use client";

import {
  ArrowRight,
  Award,
  CheckCircle2,
  FileSearch,
  Globe,
  Handshake,
  ImageOff,
  Landmark,
  MapPin,
  MessageCircle,
  Quote,
  ShieldCheck,
  Ship,
  Star,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import { formatLeadPrice, formatVehicleTitle } from "@/lib/vehicle";

// Icons a member can attach to an expertise card, resolved from the stored
// string name. Falls back to a star for anything unrecognised.
const ICON_MAP: Record<string, any> = {
  FileSearch,
  Handshake,
  Landmark,
  Ship,
  ShieldCheck,
  Globe,
  Award,
  Star,
  CheckCircle2,
};

type Vehicle = {
  _id: string;
  make: string;
  model: string;
  year?: string;
  slug?: string;
  images?: string[];
  heroImageUrl?: string;
  pricing?: any[];
};

type Profile = {
  slug: string;
  displayName?: string;
  headline?: string;
  tagline?: string;
  bio?: string;
  photoUrl?: string;
  coverImageUrl?: string;
  yearsExperience?: number;
  languages?: string[];
  expertise?: { icon: string; title: string; desc: string }[];
  sourcingCountries?: { country: string; flag: string; note: string }[];
  trackRecord?: { value: string; label: string }[];
  testimonials?: {
    name: string;
    title: string;
    text: string;
    rating: number;
  }[];
  whatsappNumber?: string;
  userId: string;
};

/** Strip non-digits so wa.me gets a clean international number. */
function waLink(num?: string) {
  const digits = (num || "").replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export default function TeamProfileClient({
  profile,
  vehicles,
}: {
  profile: Profile;
  vehicles: Vehicle[];
}) {
  const firstName =
    (profile.displayName || "").split(" ")[0] || "our specialist";
  const wa = waLink(profile.whatsappNumber);
  const bioParagraphs = (profile.bio || "").split(/\n\n+/).filter(Boolean);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col relative overflow-x-hidden font-sans selection:bg-black/10 selection:text-black">
      <GradientMesh
        image={
          profile.coverImageUrl ||
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=3000&auto=format&fit=crop"
        }
      />
      <MinimalHeader />

      <main className="flex-1 relative z-10 w-full">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="pt-32 pb-20 px-4 max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-[minmax(0,1fr)_360px] gap-12 items-center">
            <div>
              <Reveal
                immediate
                as="span"
                y={16}
                className="inline-flex items-center gap-2 text-zinc-500 font-bold tracking-[0.18em] uppercase text-xs mb-5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Providence Auto · Personal Sourcing Consultant
              </Reveal>
              <Reveal
                immediate
                as="h1"
                y={20}
                delay={0.05}
                className="text-4xl md:text-6xl font-bold tracking-tighter mb-5 whitespace-pre-line"
              >
                {profile.headline || `Sourced by ${firstName}.`}
              </Reveal>
              <Reveal
                immediate
                as="p"
                y={20}
                delay={0.12}
                className="text-zinc-600 text-lg md:text-xl font-light max-w-xl mb-8"
              >
                {profile.tagline}
              </Reveal>

              {/* Quick facts */}
              <Reveal
                immediate
                y={20}
                delay={0.18}
                className="flex flex-wrap items-center gap-3 mb-9"
              >
                {profile.yearsExperience ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-4 py-2 text-sm font-semibold">
                    <Award size={14} className="text-sky-500" />{" "}
                    {profile.yearsExperience}+ years sourcing
                  </span>
                ) : null}
                {profile.languages && profile.languages.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-4 py-2 text-sm font-semibold">
                    <Globe size={14} className="text-sky-500" />{" "}
                    {profile.languages.join(" · ")}
                  </span>
                )}
                {profile.sourcingCountries &&
                  profile.sourcingCountries.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-4 py-2 text-lg leading-none">
                      {profile.sourcingCountries.map((c, i) => (
                        <span key={i} title={c.country}>
                          {c.flag}
                        </span>
                      ))}
                    </span>
                  )}
              </Reveal>

              <Reveal
                immediate
                y={20}
                delay={0.24}
                className="flex flex-wrap gap-3"
              >
                {wa && (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors"
                  >
                    <MessageCircle size={16} /> Message me on WhatsApp
                  </a>
                )}
                <a
                  href="#inquiry"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-bold text-sm hover:bg-sky-500 transition-colors group"
                >
                  Start an inquiry
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </Reveal>
              <p className="text-xs text-zinc-400 mt-5">
                Backed by Providence Auto — UK-registered vehicle sourcing &amp;
                export.
              </p>
            </div>

            {/* Portrait */}
            <Reveal immediate scale={0.96} delay={0.1} className="relative">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-zinc-100 border border-black/[0.07] shadow-[0_40px_100px_rgba(0,0,0,0.12)]">
                {profile.photoUrl ? (
                  // biome-ignore lint/performance/noImgElement: R2-hosted portrait, no next/image loader configured
                  <img
                    src={profile.photoUrl}
                    alt={profile.displayName || "Sourcing consultant"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <UserRound size={64} />
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── ABOUT ────────────────────────────────────────────── */}
        {bioParagraphs.length > 0 && (
          <section className="py-16 px-4 max-w-3xl mx-auto w-full">
            <Reveal
              as="h2"
              y={20}
              className="text-2xl md:text-3xl font-bold tracking-tight mb-6"
            >
              Who you're dealing with
            </Reveal>
            <div className="space-y-5 text-zinc-600 text-lg font-light leading-relaxed">
              {bioParagraphs.map((p, i) => (
                <Reveal key={i} as="p" y={16} delay={0.05 * i}>
                  {p}
                </Reveal>
              ))}
            </div>
            {profile.displayName && (
              <p className="mt-6 text-zinc-900 font-semibold">
                — {profile.displayName}
              </p>
            )}
          </section>
        )}

        {/* ── EXPERTISE ────────────────────────────────────────── */}
        {profile.expertise && profile.expertise.length > 0 && (
          <section className="py-16 px-4 max-w-6xl mx-auto w-full">
            <Reveal
              as="h2"
              y={20}
              className="text-2xl md:text-3xl font-bold tracking-tight mb-10"
            >
              What I'm good at
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {profile.expertise.map((e, i) => {
                const Icon = ICON_MAP[e.icon] || Star;
                return (
                  <Reveal
                    key={i}
                    y={20}
                    delay={0.05 * i}
                    className="group rounded-[2rem] border border-black/[0.07] bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-lg tracking-tight mb-2">
                      {e.title}
                    </h3>
                    <p className="text-zinc-500 text-sm font-light leading-relaxed">
                      {e.desc}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* ── SOURCING COUNTRIES ───────────────────────────────── */}
        {profile.sourcingCountries && profile.sourcingCountries.length > 0 && (
          <section className="py-16 px-4 max-w-6xl mx-auto w-full">
            <Reveal
              as="h2"
              y={20}
              className="text-2xl md:text-3xl font-bold tracking-tight mb-3"
            >
              Where I source from
            </Reveal>
            <Reveal
              as="p"
              y={16}
              delay={0.05}
              className="text-zinc-500 font-light mb-10 max-w-xl"
            >
              The markets I know inside out — and the edge I bring in each one.
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-5">
              {profile.sourcingCountries.map((c, i) => (
                <Reveal
                  key={i}
                  y={20}
                  delay={0.05 * i}
                  className="flex gap-4 rounded-[2rem] border border-black/[0.07] bg-white p-6 shadow-sm"
                >
                  <div className="text-4xl leading-none">
                    {c.flag || <MapPin size={28} className="text-zinc-300" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg tracking-tight mb-1">
                      {c.country}
                    </h3>
                    <p className="text-zinc-500 text-sm font-light leading-relaxed">
                      {c.note}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ── TRACK RECORD ─────────────────────────────────────── */}
        {profile.trackRecord && profile.trackRecord.length > 0 && (
          <section className="py-16 px-4 max-w-5xl mx-auto w-full">
            <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-[2.5rem] bg-black text-white p-10">
              {profile.trackRecord.slice(0, 3).map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">
                    {s.value}
                  </div>
                  <div className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </Reveal>
          </section>
        )}

        {/* ── FEATURED VEHICLES ────────────────────────────────── */}
        {vehicles && vehicles.length > 0 && (
          <section className="py-16 px-4 max-w-6xl mx-auto w-full">
            <Reveal
              as="h2"
              y={20}
              className="text-2xl md:text-3xl font-bold tracking-tight mb-3"
            >
              Cars I'm sourcing right now
            </Reveal>
            <Reveal
              as="p"
              y={16}
              delay={0.05}
              className="text-zinc-500 font-light mb-10 max-w-xl"
            >
              A hand-picked selection from my current stock. Ask me about any of
              them.
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {vehicles.map((car) => {
                const img = car.heroImageUrl || car.images?.[0];
                const title = formatVehicleTitle(car.make, car.model);
                const price = formatLeadPrice(car.pricing);
                return (
                  <Link
                    key={car._id}
                    href={`/b2c/gallery/${car.slug || car._id}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/3] rounded-[1.75rem] overflow-hidden bg-zinc-100 border border-black/[0.07]">
                      {img ? (
                        // biome-ignore lint/performance/noImgElement: R2-hosted gallery image
                        <img
                          src={img}
                          alt={title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300">
                          <ImageOff size={28} />
                        </div>
                      )}
                      {price && (
                        <div className="absolute bottom-3 right-3 bg-white/95 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                          {price}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 px-1">
                      <h3 className="font-bold text-black tracking-tight group-hover:text-sky-500 transition-colors line-clamp-1">
                        {title}
                      </h3>
                      <p className="text-zinc-400 text-sm font-light">
                        {car.year || ""}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ─────────────────────────────────────── */}
        {profile.testimonials && profile.testimonials.length > 0 && (
          <section className="py-16 px-4 max-w-6xl mx-auto w-full">
            <Reveal
              as="h2"
              y={20}
              className="text-2xl md:text-3xl font-bold tracking-tight mb-10"
            >
              Clients I've helped
            </Reveal>
            <div className="grid md:grid-cols-3 gap-5">
              {profile.testimonials.map((t, i) => (
                <Reveal
                  key={i}
                  y={20}
                  delay={0.05 * i}
                  className="rounded-[2rem] border border-black/[0.07] bg-white p-6 shadow-sm flex flex-col"
                >
                  <Quote size={24} className="text-sky-500 mb-3" />
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating || 5 }).map((_, s) => (
                      <Star
                        key={s}
                        size={14}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  {t.title && (
                    <p className="font-bold tracking-tight mb-2">{t.title}</p>
                  )}
                  <p className="text-zinc-500 text-sm font-light leading-relaxed flex-1">
                    {t.text}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-zinc-900">
                    {t.name}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ── INQUIRY FORM ─────────────────────────────────────── */}
        <section id="inquiry" className="py-20 px-4 w-full scroll-mt-24">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <Reveal
              as="h2"
              y={20}
              className="text-3xl md:text-5xl font-bold tracking-tighter mb-4"
            >
              Work with {firstName} directly
            </Reveal>
            <Reveal
              as="p"
              y={16}
              delay={0.05}
              className="text-zinc-500 text-lg font-light"
            >
              This form comes straight to me — no queue, no handoffs. Tell me
              what you're looking for and I'll come back with real options and a
              full landed price.
            </Reveal>
          </div>
          <div className="w-full max-w-3xl mx-auto">
            <Suspense
              fallback={
                <div className="h-[550px] flex items-center justify-center text-zinc-400">
                  Loading form…
                </div>
              }
            >
              <RequestForm assignedAgentId={profile.userId} />
            </Suspense>
          </div>
        </section>

        {/* ── FOOTER TRUST STRIP ───────────────────────────────── */}
        <footer className="border-t border-black/5 py-10 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p className="font-semibold text-zinc-900">Providence Auto</p>
            <p className="font-light">
              UK-registered vehicle sourcing &amp; export.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-semibold text-zinc-900 hover:text-sky-500 transition-colors"
            >
              Visit providenceauto.co.uk <ArrowRight size={14} />
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
