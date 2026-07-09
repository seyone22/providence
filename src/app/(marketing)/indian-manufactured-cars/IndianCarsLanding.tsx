"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  Boxes,
  Factory,
  Handshake,
  Play,
  Ruler,
  ShieldCheck,
  Star,
  Wallet,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import FAQSection from "@/components/faqSection";
import GalleryPreview from "@/components/GalleryPreview";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import { indianCampaignConfig } from "@/config/landing-pages";

// Vehicles are surfaced by their search tag, which mirrors this page's URL
// slug so the gallery stays scoped to this campaign's stock.
const CAMPAIGN_TAG = "indian-manufactured-cars";

// Slug of the companion blog post (registered in src/config/blog.ts).
const BLOG_SLUG = "why-are-indian-manufactured-cars-cheaper";

// India-built brands offered on this page. `make` must match a value in the
// request form's CAR_MAKES list so the prefill lands on a valid option (Tata
// and Mahindra were added there for this page). `image` is a representative
// shot of that brand's best-known India-built model (Unsplash license — free
// for commercial use, no attribution) served through the shared IMG helper.
const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&q=75&auto=format&fit=crop`;

const BRANDS: { name: string; make: string; model: string; image: string }[] = [
  {
    name: "Suzuki",
    make: "Suzuki",
    model: "Swift",
    image: IMG("1663852397535-18292e115327"),
  },
  {
    name: "Toyota",
    make: "Toyota",
    model: "Fortuner",
    image: IMG("1742697167580-af91e3ead35e"),
  },
  {
    name: "Kia",
    make: "Kia",
    model: "Seltos",
    image: IMG("1659406189166-7c17fe5df12a"),
  },
  {
    name: "Nissan",
    make: "Nissan",
    model: "Magnite",
    image: IMG("1761593280913-2d33f93f65d7"),
  },
  {
    name: "Hyundai",
    make: "Hyundai",
    model: "Creta",
    image: IMG("1748214547184-d994bfe53322"),
  },
  {
    name: "Honda",
    make: "Honda",
    model: "City",
    image: IMG("1609676671207-d021525a635d"),
  },
  {
    name: "Mahindra",
    make: "Mahindra",
    model: "Thar",
    image: IMG("1710225358761-4f5891df657d"),
  },
  {
    name: "Tata",
    make: "Tata",
    model: "Nexon",
    image: IMG("1685019718640-6e562edc365e"),
  },
];

// "Why India-built cars cost less" — the five drivers, distilled to a card each.
const COST_FACTORS: { icon: any; title: string; desc: string }[] = [
  {
    icon: Ruler,
    title: "Tax-smart by design",
    desc: "India taxes cars by size and engine, so manufacturers engineer brilliantly compact, efficient models that dodge the luxury brackets — and the saving is baked in at the drawing board.",
  },
  {
    icon: Boxes,
    title: "90–95% local parts",
    desc: "Most mass-market Indian cars are built almost entirely from domestically made components — no import duties, no volatile shipping costs hiding in the sticker price.",
  },
  {
    icon: Wallet,
    title: "Lower factory costs",
    desc: "Skilled engineering and production talent costs a fraction of Europe or Japan, giving plants 10–25% lower operating costs for the same output.",
  },
  {
    icon: Wrench,
    title: "Frugal engineering",
    desc: "Cars are built for what drivers actually need — no costly over-engineering, with budgets spent on the features you see and use every day.",
  },
  {
    icon: Factory,
    title: "Massive scale",
    desc: "India is the world's third-largest car market. Spreading R&D and tooling across millions of units drives the per-car cost down hard.",
  },
];

export default function IndianCarsLanding() {
  const config = indianCampaignConfig;

  // Brand-card → form prefill. Kept minimal (make only) so the buyer still
  // picks their exact model in the form. The memo means the form's prefill
  // effect only fires when a different brand is actually chosen.
  const [selectedMake, setSelectedMake] = useState("");
  const [showNotice, setShowNotice] = useState(false);

  const prefill = useMemo(
    () => (selectedMake ? { make: selectedMake } : undefined),
    [selectedMake],
  );

  const handleBrandSelect = (brand: (typeof BRANDS)[number]) => {
    setSelectedMake(brand.make);
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 7000);
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
      <MinimalHeader />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center items-start px-6 pt-20 bg-white overflow-hidden">
        <GradientMesh image={config.hero.backgroundImage} />

        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center mt-0">
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
            className="pa-headline-gradient text-4xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 leading-[1.1] drop-shadow-[0_0_15px_rgba(255,255,255,1)] whitespace-pre-line"
          >
            {config.hero.title}
          </Reveal>
          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.5}
            duration={0.8}
            className="text-xl md:text-3xl text-zinc-600 font-medium tracking-tight mb-10 max-w-2xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
          >
            {config.hero.subtitle}
          </Reveal>

          {/* Trust signals — quick, scannable proof for AEO + humans */}
          <Reveal
            immediate
            y={20}
            delay={0.55}
            duration={0.8}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 text-sm font-medium text-zinc-600"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-black" /> Safety-inspected
              before export
            </span>
            <span className="flex items-center gap-2">
              <Handshake size={16} className="text-black" /> Direct India dealer
              network
            </span>
            <span className="flex items-center gap-2">
              <BadgePercent size={16} className="text-black" /> Full landed cost
              up front
            </span>
          </Reveal>

          <Reveal immediate y={20} delay={0.6} duration={0.8}>
            <a
              href="#brands"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Choose Your Brand
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── BRAND CARDS ──────────────────────────────── */}
      <section
        id="brands"
        className="py-24 md:py-32 px-6 bg-white relative z-10 border-t border-black/5 scroll-mt-24"
      >
        <div className="max-w-[1400px] mx-auto">
          <Reveal
            y={30}
            duration={0.7}
            className="text-center mb-14 md:mb-20 max-w-3xl mx-auto"
          >
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
              Select a brand to begin
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              India builds for the world's biggest badges.
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              Tap any brand and we'll open your inquiry with it pre-selected —
              then just tell us the model and spec you're after.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {BRANDS.map((brand, index) => (
              <Reveal
                key={brand.name}
                y={24}
                delay={(index % 4) * 0.06}
                duration={0.5}
              >
                <button
                  type="button"
                  onClick={() => handleBrandSelect(brand)}
                  aria-label={`Enquire about an India-built ${brand.name}`}
                  className="group relative w-full h-44 md:h-52 overflow-hidden rounded-[1.75rem] border border-black/10 bg-zinc-900 hover:border-black/40 hover:shadow-[0_24px_50px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300 text-left"
                >
                  <img
                    src={brand.image}
                    alt={`${brand.name} ${brand.model} — India-built car`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                  {/* Legibility gradient behind the label */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-2">
                    <span className="flex flex-col leading-tight">
                      <span className="text-white text-base md:text-lg font-bold tracking-tight drop-shadow-sm">
                        {brand.name}
                      </span>
                      <span className="text-white/70 text-xs font-medium drop-shadow-sm">
                        {brand.model}
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

          <Reveal y={20} duration={0.6} className="text-center mt-12">
            <p className="text-zinc-500 font-light">
              Don't see your brand?{" "}
              <a
                href="#inquiry"
                className="text-black font-medium underline decoration-1 underline-offset-4 hover:decoration-2"
              >
                Tell us what you're after
              </a>{" "}
              — if it's built in India, we'll source it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Live inventory scoped to this campaign's tag (mirrors the URL slug).
                Home-page gallery styling, filtered to Indian-manufactured stock. */}
      <div className="px-6 md:px-8 bg-white relative z-10 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <GalleryPreview
            tags={[CAMPAIGN_TAG]}
            eyebrow="In Stock"
            title="Indian-Manufactured Cars"
            subtitle="India-built cars sourced through our dealer network, safety-inspected before export, and ready to land — each delivered to your exact specification."
          />
        </div>
      </div>

      {/* ── WHY INDIA-BUILT COSTS LESS ───────────────── */}
      <section className="py-24 md:py-32 px-6 bg-[#FAFAFA] border-t border-black/5 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <Reveal
            y={30}
            duration={0.7}
            className="text-center mb-14 md:mb-20 max-w-3xl mx-auto"
          >
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
              The honest economics
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              Why do India-built cars cost less?
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              It's not a catch — it's an ecosystem. India's comparative vehicle
              price index sits around 70 against a global benchmark of 100, and
              every point of that gap has a reason.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {COST_FACTORS.map((factor, index) => (
              <Reveal
                key={factor.title}
                y={24}
                delay={(index % 3) * 0.08}
                duration={0.5}
                className="group flex flex-col items-start p-8 rounded-[2rem] bg-white border border-black/5 hover:border-black/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300"
              >
                <div className="p-3 bg-black/5 border border-black/10 rounded-2xl group-hover:bg-black group-hover:border-black transition-colors duration-500 mb-5">
                  <factor.icon className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">
                  {factor.title}
                </h3>
                <p className="text-zinc-500 text-base leading-relaxed font-light">
                  {factor.desc}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal
            y={20}
            duration={0.6}
            className="text-center mt-12 max-w-2xl mx-auto"
          >
            <p className="text-zinc-500 font-light">
              Lower cost to build — not lower standards to hit. The full story,
              including the honest answer on quality, is in our guide below.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── BLOG TEASER ──────────────────────────────── */}
      <section className="py-20 md:py-24 px-6 bg-white border-t border-black/5 relative z-10">
        <div className="max-w-[1100px] mx-auto">
          <Reveal y={24} duration={0.7}>
            <Link
              href={`/blog/${BLOG_SLUG}`}
              className="group grid md:grid-cols-2 gap-0 overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
            >
              <img
                src="https://images.unsplash.com/photo-1685019718640-6e562edc365e?q=80&w=1600&auto=format&fit=crop"
                alt="Indian-manufactured car — why they cost less"
                loading="lazy"
                className="h-56 md:h-full w-full object-cover"
              />
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-sky-600 mb-3">
                  From our guides
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black group-hover:text-sky-600 transition-colors mb-3">
                  Why Are Indian-Manufactured Cars So Much Cheaper? (And Is the
                  Quality Low?)
                </h2>
                <p className="text-zinc-500 font-light leading-relaxed mb-5">
                  Indian-built cars run roughly 30% below the global average
                  price — and it has nothing to do with cutting corners. From
                  the famous "sub-4-metre" tax rule to 95% local supply chains
                  and factories that build millions of cars a year, we break
                  down exactly where the saving comes from, and give you the
                  straight answer on the quality question.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-sky-600">
                  Read the full guide
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── MANIFESTO / INTRO ────────────────────────── */}
      <section className="py-32 md:py-48 px-6 bg-white border-y border-black/5 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal
            as="p"
            className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-400"
          >
            {config.intro.text.replace(config.intro.highlight, "")}{" "}
            <span className="text-black drop-shadow-sm">
              {config.intro.highlight}
            </span>
          </Reveal>
        </div>
      </section>

      {/* ── VALUE PROPS ──────────────────────────────── */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto bg-white relative z-10">
        <Reveal y={40} duration={0.8} className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6 uppercase">
            {config.valueProps.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
          <div className="space-y-6">
            {config.valueProps.features.map((feature, index) => (
              <Reveal
                key={index}
                y={40}
                x={-20}
                delay={index * 0.1}
                duration={0.8}
                className="relative overflow-hidden group flex flex-col items-start p-8 rounded-[2rem] bg-transparent hover:bg-zinc-50 transition-all duration-500 border border-transparent hover:border-black/5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
              >
                <div
                  className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] bg-transparent transition-colors duration-700 ${feature.glowColor}`}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-black/5 border border-black/10 rounded-2xl group-hover:bg-black group-hover:border-black transition-colors duration-500">
                      <feature.icon className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-black group-hover:translate-x-2 transition-transform duration-500">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-zinc-500 text-lg leading-relaxed font-light pl-16">
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal
            y={0}
            scale={0.95}
            duration={1}
            className="relative h-[600px] lg:h-[800px] rounded-[2.5rem] overflow-hidden bg-zinc-200"
          >
            <img
              src={config.valueProps.containerImage}
              alt="Providence Auto global logistics for India-built car imports"
              className="w-full h-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────── */}
      <section className="py-32 px-6 bg-[#FAFAFA] border-y border-black/5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                Our customers' Trustpilot reviews
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">Excellent</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-[#00B67A] p-1 rounded-sm">
                      <Star size={16} fill="white" stroke="none" />
                    </div>
                  ))}
                </div>
                <span className="text-zinc-500 font-light ml-2">
                  {config.reviews.averageRating} average rating based on{" "}
                  {config.reviews.totalReviews} reviews
                </span>
              </div>
            </div>
            <img
              src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-black.svg"
              alt="Trustpilot"
              className="h-8"
            />
          </div>

          <div className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
            {config.reviews.items.map((review, i) => (
              <Reveal
                key={i}
                y={0}
                x={20}
                delay={i * 0.1}
                duration={0.5}
                className="min-w-[320px] md:min-w-[400px] bg-white border border-black/5 rounded-[2rem] p-8 snap-start hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <div key={i} className="bg-[#00B67A] p-1 rounded-sm">
                      <Star size={12} fill="white" stroke="none" />
                    </div>
                  ))}
                </div>
                <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                <p className="text-zinc-500 font-light mb-6 line-clamp-4">
                  {review.desc}
                </p>
                <div className="mt-auto flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold bg-zinc-100">
                      {review.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.name}</p>
                    <p className="text-zinc-400 text-xs">{review.date}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Featured customer story */}
          <Reveal
            y={30}
            duration={0.8}
            className="mt-16 bg-white rounded-[2.5rem] p-4 md:p-8 border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center shadow-sm"
          >
            <div className="relative aspect-video rounded-[1.5rem] overflow-hidden group cursor-pointer">
              <img
                src={config.featuredReview.image}
                alt={config.featuredReview.carName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors group-hover:bg-black/30">
                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-black transform transition-transform group-hover:scale-110">
                  <Play size={24} className="ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase text-black">
                  {config.featuredReview.carName.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="pr-4 md:pr-12 py-4">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tighter mb-4">
                {config.featuredReview.title} {config.featuredReview.carName}
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-black text-white px-3 py-1 font-bold text-sm rounded-md">
                  {config.featuredReview.rating.toFixed(1)}
                </div>
                <div className="flex gap-1">
                  {[...Array(Math.floor(config.featuredReview.rating))].map(
                    (_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ),
                  )}
                  {[...Array(5 - Math.floor(config.featuredReview.rating))].map(
                    (_, i) => (
                      <Star key={i} size={16} className="text-zinc-300" />
                    ),
                  )}
                </div>
              </div>
              <p className="text-zinc-500 font-light leading-relaxed mb-8">
                "{config.featuredReview.text}"
              </p>
              <a
                href="#inquiry"
                className="inline-block px-8 py-3 rounded-full border border-black/20 font-medium hover:bg-black hover:text-white transition-colors duration-300"
              >
                Start your inquiry
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── INQUIRY FORM + FAQ ───────────────────────── */}
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
            Your car,{" "}
            <span className="text-black font-medium">built in India</span> —
            we'll source the exact spec through our dealer network and come back
            with a full landed-cost quote before you commit.
          </p>
        </Reveal>

        {/* Prefill notice */}
        <AnimatePresence>
          {showNotice && selectedMake && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-3xl mx-auto mb-4 px-6 py-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-700 text-sm font-medium text-center relative z-20"
            >
              Inquiry pre-filled with <strong>{selectedMake}</strong>. Now pick
              your model and spec below.
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
            <RequestForm key={selectedMake} prefill={prefill} />
          </Suspense>
        </div>

        <div className="mt-24 w-full relative z-20">
          <FAQSection data={config.faqs} />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
    </main>
  );
}
