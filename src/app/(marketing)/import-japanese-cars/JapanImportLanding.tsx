"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Anchor,
  ArrowRight,
  CalendarClock,
  Gauge,
  Globe2,
  MapPin,
  Play,
  Plus,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import FAQSection from "@/components/faqSection";
import GalleryPreview from "@/components/GalleryPreview";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import { japanImportCampaignConfig } from "@/config/landing-pages";

// Vehicles are surfaced by their search tag, which mirrors this page's URL
// slug so the gallery stays scoped to this campaign's stock.
const CAMPAIGN_TAG = "import-japanese-cars";

// Japan's fastest-moving auction exports plus the European metal its owners
// keep in exceptional condition — every one sourced from Japanese auctions
// (not built in Japan). `make` must match a value in the request form's
// CAR_MAKES list so the prefill lands on a valid option; `model` prefills the
// free-text/model field. Card images are model-correct photos from Wikimedia
// Commons (CC-licensed) that have been cut out and re-composited onto a uniform
// studio-grey (#f4f4f5 / zinc-100) background with a soft contact shadow, so
// the whole grid reads as one cohesive studio set. Self-hosted under
// /public/import-cars with any visible number plates blurred. Every asset is
// stored nose-right — four of the original photographs were mirrored in the
// file rather than flipped in CSS, so a hover transform can never un-flip
// them — and the cards render them in greyscale, which is what stops a grid of
// thirteen paint colours reading as a jumble.
type FastMover = {
  name: string;
  make: string;
  model: string;
  blurb: string;
  image: string;
};

// The grid is split into jump-linked groups so a buyer who came for a van
// isn't scrolling past nine hatchbacks to find one. `id` is the anchor target
// used by the jump nav at the top of the models section.
type ModelGroup = {
  id: string;
  label: string;
  title: string;
  blurb: string;
  cars: FastMover[];
};

const MODEL_GROUPS: ModelGroup[] = [
  {
    id: "fast-movers",
    label: "Fast Movers",
    title: "The cars that never sit still.",
    blurb:
      "Japan's high-turnover hybrids and hatchbacks — the models that clear the auction halls every week and land below local forecourt prices almost everywhere we ship.",
    cars: [
      {
        name: "Toyota Aqua",
        make: "Toyota",
        model: "Aqua",
        blurb: "Japan's best-selling hybrid hatch",
        image: "/import-cars/aqua.jpg",
      },
      {
        name: "Toyota Prius",
        make: "Toyota",
        model: "Prius",
        blurb: "The hybrid that started it all",
        image: "/import-cars/prius.jpg",
      },
      {
        name: "Honda Fit",
        make: "Honda",
        model: "Fit",
        blurb: "Big inside, frugal everywhere",
        image: "/import-cars/fit.jpg",
      },
      {
        name: "Honda Vezel",
        make: "Honda",
        model: "Vezel",
        blurb: "The compact hybrid crossover",
        image: "/import-cars/vezel.jpg",
      },
      {
        name: "Nissan Note e-POWER",
        make: "Nissan",
        model: "Note e-POWER",
        blurb: "Electric drive, no plug needed",
        image: "/import-cars/note.jpg",
      },
      {
        name: "Suzuki Swift",
        make: "Suzuki",
        model: "Swift",
        blurb: "The evergreen city fast-mover",
        image: "/import-cars/swift.jpg",
      },
    ],
  },
  {
    id: "suvs",
    label: "SUVs & 4x4s",
    title: "The 4x4s the rest of the world queues for.",
    blurb:
      "Japan buys Land Cruisers by the shipload and sells them young. From the Harrier to the 70 Series, this is the hardware that holds its value in every market we land in.",
    cars: [
      {
        name: "Toyota Harrier",
        make: "Toyota",
        model: "Harrier",
        blurb: "East Africa's favourite premium SUV",
        image: "/import-cars/harrier.jpg",
      },
      {
        name: "Land Cruiser Prado",
        make: "Toyota",
        model: "Land Cruiser Prado",
        blurb: "Go-anywhere status, auction-priced",
        image: "/import-cars/prado.jpg",
      },
      {
        name: "Land Cruiser 200",
        make: "Toyota",
        model: "Land Cruiser 200",
        blurb: "The V8 flagship that never dates",
        image: "/import-cars/lc200.jpg",
      },
      {
        name: "Land Cruiser 300",
        make: "Toyota",
        model: "Land Cruiser 300",
        blurb: "The current king, years ahead of local supply",
        image: "/import-cars/lc300.jpg",
      },
      {
        name: "Lexus LX 600",
        make: "Lexus",
        model: "LX 600",
        blurb: "Land Cruiser bones, first-class cabin",
        image: "/import-cars/lx600.jpg",
      },
      {
        name: "Land Cruiser 70 Series",
        make: "Toyota",
        model: "Land Cruiser 70 Series",
        blurb: "The workhorse legend, back in production",
        image: "/import-cars/lc70.jpg",
      },
      {
        name: "Mercedes-Benz G-Class",
        make: "Mercedes-Benz",
        model: "G-Class",
        blurb: "The G-Wagon, Japan-kept and low mileage",
        image: "/import-cars/gwagon.jpg",
      },
    ],
  },
  {
    id: "vans",
    label: "Vans & People Movers",
    title: "Eight seats, sliding doors, Japanese miles.",
    blurb:
      "Japan's people movers are the school run, the airport run and the family business all at once — and they come out of auction with the mileage and condition to prove they were looked after.",
    cars: [
      {
        name: "Toyota Alphard",
        make: "Toyota",
        model: "Alphard",
        blurb: "First-class travel for the family",
        image: "/import-cars/alphard.jpg",
      },
      {
        name: "Toyota Noah",
        make: "Toyota",
        model: "Noah",
        blurb: "The eight-seat hybrid that does everything",
        image: "/import-cars/noah.jpg",
      },
      {
        name: "Toyota Voxy",
        make: "Toyota",
        model: "Voxy",
        blurb: "The Noah's sharper-suited twin",
        image: "/import-cars/voxy.jpg",
      },
    ],
  },
  {
    id: "luxury",
    label: "Luxury & Performance",
    title: "Low miles, high spec, Japanese ownership.",
    blurb:
      "Japan's shaken regime pushes premium cars out of first ownership early — which is how a European saloon or a homegrown legend reaches auction with mileage the rest of the world can't match.",
    cars: [
      {
        name: "Mercedes-Benz C-Class",
        make: "Mercedes-Benz",
        model: "C-Class",
        blurb: "Executive luxury, Japan-kept low miles",
        image: "/import-cars/mercedes.jpg",
      },
      {
        name: "BMW 3 Series",
        make: "BMW",
        model: "3 Series",
        blurb: "The driver's saloon, auction-fresh",
        image: "/import-cars/bmw.jpg",
      },
      {
        name: "Nissan GT-R",
        make: "Nissan",
        model: "GT-R",
        blurb: "The legend, sourced at home",
        image: "/import-cars/gtr.jpg",
      },
    ],
  },
];

// ── Destination content ──────────────────────────────────────────────────────
// One entry per country button. `formCountry` must match a `n` value in the
// request form's COUNTRIES list so the countryOfImport prefill selects a valid
// option (and auto-syncs the phone country code). `readMoreHref` points at the
// dedicated per-country guide — Ireland's is live; the rest are planned pages.
type Destination = {
  key: string;
  label: string;
  formCountry: string | null;
  headline: string;
  body: string;
  facts: { icon: any; label: string }[];
  popular: string;
  readMoreHref: string | null;
};

const DESTINATIONS: Destination[] = [
  {
    key: "uk",
    label: "United Kingdom",
    formCountry: "United Kingdom",
    headline: "The home of the JDM import.",
    body: "No age limit, no steering conversion, and a DVLA process we've run hundreds of times. From a daily-driver Aqua to a GR Yaris or an Alphard the family will fight over, your car is NOVA-notified within 14 days of arrival and registered for you — with duty and VAT locked into your quote before you commit.",
    facts: [
      { icon: Gauge, label: "No import age limit" },
      { icon: ShieldCheck, label: "NOVA + DVLA registration handled" },
      { icon: CalendarClock, label: "Typically 8–12 weeks door to door" },
      { icon: Anchor, label: "RoRo or container to UK ports" },
    ],
    popular: "Fast movers: Aqua, Prius, Alphard, GR Yaris, Vezel",
    readMoreHref: "/import-japanese-cars-to-uk",
  },
  {
    key: "ireland",
    label: "Ireland",
    formCountry: "Ireland",
    headline: "Zero customs duty. Hybrid-friendly VRT.",
    body: "Japan-built cars enter Ireland at 0% customs duty under the EU–Japan agreement, and efficient Japanese hybrids sit in the lowest VRT bands — which is why they consistently land thousands below Irish forecourt prices even after VAT. We calculate your exact VRT before you commit and handle the NCTS registration entirely.",
    facts: [
      { icon: Gauge, label: "0% duty on Japan-built cars" },
      { icon: ShieldCheck, label: "VRT calculated before you commit" },
      { icon: CalendarClock, label: "Typically 8–12 weeks door to door" },
      { icon: Anchor, label: "NCTS registration handled for you" },
    ],
    popular: "Fast movers: Prius, Aqua, Fit Hybrid, Note e-POWER, Vezel",
    readMoreHref: "/import-japanese-cars-to-ireland",
  },
  {
    key: "new-zealand",
    label: "New Zealand",
    formCountry: "New Zealand",
    headline: "Japan's used market is New Zealand's used market.",
    body: "More used cars reach New Zealand from Japan than from anywhere else, and the route is well worn: no customs duty on used vehicles, GST charged once on the landed value, a biosecurity clean before the ship, and entry certification before the plates go on. We buy to the standards the certifier will accept, arrange the steam clean in Japan, and land a car that's ready to comply.",
    facts: [
      { icon: Gauge, label: "No customs duty on used cars" },
      { icon: ShieldCheck, label: "GST + entry certification handled" },
      { icon: CalendarClock, label: "Typically 6–10 weeks door to door" },
      { icon: Anchor, label: "MPI biosecurity clean arranged in Japan" },
    ],
    popular: "Fast movers: Aqua, Prius, Fit, Swift, Land Cruiser Prado",
    // No dedicated New Zealand guide page exists yet, so this stays null
    // rather than pointing the CTA at a 404.
    readMoreHref: null,
  },
  {
    key: "kenya",
    label: "Kenya",
    formCountry: "Kenya",
    headline: "Under 8 years, inspected in Japan, cleared at Mombasa.",
    body: "Kenya's rules are strict — under 8 years old, right-hand drive, mandatory pre-export roadworthiness inspection — and that's precisely why buying through us pays. We source age-compliant stock straight off the auction sheet, book the KEBS-compliance inspection in Japan, and land your car at Mombasa with every duty in the quote you approved.",
    facts: [
      { icon: Gauge, label: "8-year age rule — compliant stock only" },
      { icon: ShieldCheck, label: "Pre-export inspection arranged in Japan" },
      { icon: CalendarClock, label: "Typically 6–10 weeks door to door" },
      { icon: Anchor, label: "Cleared through Mombasa for you" },
    ],
    popular: "Fast movers: Harrier, Fielder, Vitz, Prado, Probox",
    readMoreHref: "/import-japanese-cars-to-kenya",
  },
  {
    key: "tanzania",
    label: "Tanzania",
    formCountry: "Tanzania",
    headline: "No age ban — just honest maths on older cars.",
    body: "Tanzania welcomes a wider range of Japanese imports than its neighbours: there's no outright age limit, though cars over 10 years old carry extra excise — which we build into your landed quote so the number never moves. Pre-shipment inspection is arranged in Japan, and your car clears through Dar es Salaam with our team on it the whole way.",
    facts: [
      { icon: Gauge, label: "No age ban — excise built into quote" },
      { icon: ShieldCheck, label: "Pre-shipment inspection arranged" },
      { icon: CalendarClock, label: "Typically 6–10 weeks door to door" },
      { icon: Anchor, label: "Cleared through Dar es Salaam" },
    ],
    popular: "Fast movers: IST, Harrier, Noah, Land Cruiser, Raum",
    readMoreHref: "/import-japanese-cars-to-tanzania",
  },
  {
    key: "uganda",
    label: "Uganda",
    formCountry: "Uganda",
    headline: "Landlocked is not a problem. It's our route.",
    body: "Your car lands at Mombasa and travels overland to Kampala under a bonded transit we arrange — one quote, one team, no handoffs at the border. Uganda's 15-year age ban and environmental levy make a 5–9 year-old Japanese car the sweet spot, and we source exactly that, with URA taxes included in the single price you approve up front.",
    facts: [
      { icon: Gauge, label: "15-year rule — sweet spot sourced" },
      { icon: ShieldCheck, label: "URA taxes in your up-front quote" },
      { icon: CalendarClock, label: "Typically 7–11 weeks door to door" },
      { icon: Anchor, label: "Bonded transit Mombasa → Kampala" },
    ],
    popular: "Fast movers: Harrier, Premio, Wish, Hiace, Fielder",
    readMoreHref: "/import-japanese-cars-to-uganda",
  },
  {
    key: "other",
    label: "Other",
    formCountry: null,
    headline: "If it drives on the left, we deliver to it.",
    body: "Beyond our six core markets we ship to right-hand-drive countries worldwide — across the Caribbean, southern Africa, and the Pacific. Every destination gets the same treatment: auction sheet before payment, your country's rules confirmed before you commit, and one all-in landed price. Tell us your country in the form and we'll come back with the exact rules, timeline and cost.",
    facts: [
      { icon: Globe2, label: "RHD markets worldwide" },
      { icon: ShieldCheck, label: "Local rules confirmed before you pay" },
      { icon: CalendarClock, label: "Timeline quoted per destination" },
      { icon: Anchor, label: "RoRo & container routes globally" },
    ],
    popular: "Tell us your destination — we'll map the route",
    readMoreHref: null,
  },
];

export default function JapanImportLanding() {
  const config = japanImportCampaignConfig;

  // Country pill → destination panel + form countryOfImport prefill.
  // Model card → make/model prefill. Both merge into one memoised prefill so
  // the form's sync effect applies changes without wiping typed fields.
  const [destination, setDestination] = useState<Destination | null>(null);
  const [selectedModel, setSelectedModel] = useState<FastMover | null>(null);
  const [showNotice, setShowNotice] = useState(false);

  const prefill = useMemo(() => {
    const p: {
      make?: string;
      vehicle_model?: string;
      countryOfImport?: string;
    } = {};
    if (selectedModel) {
      p.make = selectedModel.make;
      p.vehicle_model = selectedModel.model;
    }
    if (destination?.formCountry) p.countryOfImport = destination.formCountry;
    return Object.keys(p).length > 0 ? p : undefined;
  }, [selectedModel, destination]);

  const handleDestinationSelect = (dest: Destination) => {
    setDestination(dest);
    document
      .getElementById("destination")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const handleModelSelect = (model: FastMover) => {
    setSelectedModel(model);
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 7000);
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  // "Something else" card — the grid is a shortlist, not the catalogue, so this
  // is the escape hatch for everyone whose car isn't on it. Drops the model
  // selection so the form arrives blank; the destination stays, because that
  // was chosen deliberately up in the hero and silently discarding it would be
  // the surprising behaviour, not the helpful one.
  const handleOpenBlankInquiry = () => {
    setSelectedModel(null);
    setShowNotice(false);
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
      <MinimalHeader />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center items-start px-6 pt-24 pb-16 bg-white overflow-hidden">
        <GradientMesh image={config.hero.backgroundImage} overlay="spotlight" />

        <div className="relative z-10 text-center max-w-6xl mx-auto flex flex-col items-center mt-0">
          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.2}
            duration={0.8}
            className="pa-text-scrim text-sm font-bold tracking-[0.4em] text-zinc-600 uppercase mb-8"
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
            className="pa-headline-gradient text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 leading-[1.12] [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.95))_drop-shadow(0_0_28px_rgba(255,255,255,0.85))] whitespace-pre-line"
          >
            {config.hero.title}
          </Reveal>
          <Reveal
            immediate
            as="p"
            y={20}
            delay={0.5}
            duration={0.8}
            className="pa-text-scrim text-xl md:text-2xl text-zinc-700 font-medium tracking-tight mb-10 max-w-2xl"
          >
            {config.hero.subtitle}
          </Reveal>

          {/* Country selector — drives the destination panel + form prefill */}
          <Reveal immediate y={20} delay={0.55} duration={0.8}>
            <p className="pa-text-scrim text-xs font-bold tracking-[0.25em] text-zinc-600 uppercase mb-4">
              Where are we landing it?
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-3xl">
              {DESTINATIONS.map((dest) => (
                <button
                  key={dest.key}
                  type="button"
                  aria-pressed={destination?.key === dest.key}
                  onClick={() => handleDestinationSelect(dest)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 backdrop-blur-sm ${
                    destination?.key === dest.key
                      ? "bg-black text-white border-black shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                      : "bg-white/80 text-black border-black/15 hover:border-black/40 hover:-translate-y-0.5"
                  }`}
                >
                  {dest.label}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal
            immediate
            y={20}
            delay={0.65}
            duration={0.8}
            className="mt-10"
          >
            <a
              href="#models"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Browse the Fast Movers
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── DESTINATION PANEL ────────────────────────── */}
      <section
        id="destination"
        className="px-6 bg-white relative z-10 border-t border-black/5 scroll-mt-24"
      >
        <div className="max-w-[1100px] mx-auto py-16 md:py-20">
          <AnimatePresence mode="wait">
            {destination ? (
              <motion.div
                key={destination.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="rounded-[2.5rem] border border-black/8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 md:p-12"
              >
                <div className="flex items-center gap-2 mb-4 text-zinc-500">
                  <MapPin size={16} className="text-black" />
                  <span className="text-xs font-bold tracking-[0.25em] uppercase">
                    Importing to {destination.label}
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
                  {destination.headline}
                </h2>
                <p className="text-lg text-zinc-500 font-light leading-relaxed mb-8 max-w-3xl">
                  {destination.body}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {destination.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-zinc-50 border border-black/5 text-sm font-medium text-zinc-700"
                    >
                      <fact.icon size={17} className="text-black shrink-0" />
                      {fact.label}
                    </div>
                  ))}
                </div>

                <p className="text-sm font-medium text-zinc-400 mb-8">
                  {destination.popular}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#inquiry"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white font-bold hover:scale-105 transition-transform"
                  >
                    Start your {destination.label} inquiry
                    <ArrowRight size={17} />
                  </a>
                  {destination.readMoreHref && (
                    <Link
                      href={destination.readMoreHref}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-black/20 font-medium hover:bg-black hover:text-white transition-colors duration-300"
                    >
                      Read more about importing a car to {destination.label}
                      <ArrowRight size={17} />
                    </Link>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="unselected"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="rounded-[2.5rem] border border-dashed border-black/15 bg-zinc-50/60 p-10 md:p-14 text-center"
              >
                <Globe2 size={28} className="mx-auto mb-4 text-zinc-400" />
                <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-black mb-3">
                  Every right-hand-drive country. One process.
                </h2>
                <p className="text-lg text-zinc-500 font-light max-w-2xl mx-auto">
                  Pick your country above and we'll show you exactly how the
                  rules, taxes and timeline work for your destination — and
                  pre-fill your inquiry so the quote comes back right first
                  time.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── FAST-MOVER MODEL CARDS ───────────────────── */}
      <section
        id="models"
        className="py-24 md:py-32 px-6 bg-white relative z-10 border-t border-black/5 scroll-mt-24"
      >
        <div className="max-w-[1400px] mx-auto">
          <Reveal
            y={30}
            duration={0.7}
            className="text-center mb-10 md:mb-14 max-w-3xl mx-auto"
          >
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
              Select a model to begin
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-5">
              The cars that never sit still.
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              From Japan's fastest-moving hybrids to Land Cruisers, eight-seat
              vans and the low-mileage European luxury its owners keep in
              showroom condition — every one sourced straight from Japanese
              auctions. Tap a model and we'll open your inquiry with it
              pre-selected.
            </p>
          </Reveal>

          {/* Jump nav — the grid is long enough that a van buyer shouldn't have
              to scroll past every hatchback to reach the Noah. */}
          <Reveal
            y={16}
            duration={0.5}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-14 md:mb-20"
          >
            {MODEL_GROUPS.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="px-5 py-2.5 rounded-full text-sm font-bold border border-black/15 text-black bg-white hover:border-black/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                {group.label}
              </a>
            ))}
          </Reveal>

          {MODEL_GROUPS.map((group, groupIndex) => (
            <div
              key={group.id}
              id={group.id}
              className="scroll-mt-28 mb-16 md:mb-24 last:mb-0"
            >
              <Reveal y={24} duration={0.6} className="mb-8 md:mb-10">
                <p className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
                  {group.label}
                </p>
                <h3 className="text-2xl md:text-4xl font-bold tracking-tighter text-black mb-3">
                  {group.title}
                </h3>
                <p className="text-base md:text-lg text-zinc-500 font-light max-w-3xl">
                  {group.blurb}
                </p>
              </Reveal>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {group.cars.map((model, index) => (
                  <Reveal
                    key={model.name}
                    y={24}
                    delay={(index % 4) * 0.06}
                    duration={0.5}
                  >
                    <button
                      type="button"
                      onClick={() => handleModelSelect(model)}
                      aria-label={`Enquire about importing a ${model.name} from Japan`}
                      className="group w-full h-full flex flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white hover:border-black/40 hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 text-left"
                    >
                      {/* Photo and label are separated rather than overlaid:
                          the greyscale treatment leaves too little tonal room
                          to float text over the car and keep both readable. */}
                      <span className="block w-full aspect-[4/3] bg-zinc-100 overflow-hidden">
                        <img
                          src={model.image}
                          alt={`${model.name} — Japanese import fast mover`}
                          loading="lazy"
                          className="w-full h-full object-cover grayscale"
                        />
                      </span>
                      <span className="flex items-end justify-between gap-2 p-4 border-t border-black/5">
                        <span className="flex flex-col leading-tight">
                          <span className="text-black text-base md:text-lg font-bold tracking-tight">
                            {model.name}
                          </span>
                          <span className="text-zinc-500 text-xs font-medium">
                            {model.blurb}
                          </span>
                        </span>
                        <span className="shrink-0 w-8 h-8 rounded-full bg-black/5 border border-black/10 flex items-center justify-center opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <ArrowRight size={15} className="text-black" />
                        </span>
                      </span>
                    </button>
                  </Reveal>
                ))}

                {/* Escape hatch for anything not on the shortlist, parked at the
                    end of the final group. Deliberately styled as an outline
                    rather than a photo card so it reads as an action, not one
                    more vehicle. */}
                {groupIndex === MODEL_GROUPS.length - 1 && (
                  <Reveal
                    y={24}
                    delay={(group.cars.length % 4) * 0.06}
                    duration={0.5}
                  >
                    <button
                      type="button"
                      onClick={handleOpenBlankInquiry}
                      aria-label="Enquire about a model that is not listed"
                      className="group w-full h-full min-h-[16rem] overflow-hidden rounded-[1.75rem] border border-dashed border-black/20 bg-zinc-50/60 hover:border-black/40 hover:bg-white hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center px-4"
                    >
                      <span className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Plus size={20} />
                      </span>
                      <span className="text-black text-base md:text-lg font-bold tracking-tight">
                        More
                      </span>
                      <span className="text-zinc-500 text-xs font-medium mt-0.5">
                        Any make, any model — just ask
                      </span>
                    </button>
                  </Reveal>
                )}
              </div>
            </div>
          ))}

          <Reveal y={20} duration={0.6} className="text-center mt-12">
            <p className="text-zinc-500 font-light">
              After something else — a kei truck, a Hiace, a GR badge?{" "}
              <a
                href="#inquiry"
                className="text-black font-medium underline decoration-1 underline-offset-4 hover:decoration-2"
              >
                Tell us what you're after
              </a>{" "}
              — if Japan sells it, we'll find it at auction.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Live inventory scoped to this campaign's tag (mirrors the URL slug). */}
      <div className="px-6 md:px-8 bg-white relative z-10 border-t border-black/5">
        <div className="max-w-[1400px] mx-auto">
          <GalleryPreview
            tags={[CAMPAIGN_TAG]}
            eyebrow="In Stock"
            title="Fresh From Japanese Auction"
            subtitle="Grade-verified Japanese cars sourced at auction and ready to land in your country — each with its original auction sheet available on request."
          />
        </div>
      </div>

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
              alt="Providence Auto global logistics for Japanese car imports"
              className="w-full h-full object-cover"
            />
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
            <span className="text-black font-medium">fresh from Japan</span> —
            we'll hunt it at auction, verify the sheet, and come back with a
            full landed-cost quote for{" "}
            {destination?.formCountry ?? "your country"} before you commit.
          </p>
        </Reveal>

        {/* Prefill notice */}
        <AnimatePresence>
          {showNotice && selectedModel && (
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
                {selectedModel.make} {selectedModel.model}
              </strong>
              {destination?.formCountry && (
                <>
                  {" "}
                  for <strong>{destination.formCountry}</strong>
                </>
              )}
              . Now add your spec below.
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
            {/* Keyed on the selection so switching models — or clearing it via
                the "More" card — remounts the form at step 1 with the new
                prefill instead of merging into whatever was already typed.
                RequestForm's prefill effect early-returns on an undefined
                prefill, so without this remount "More" could not blank a form
                that a model card had already filled. Matches the sibling
                campaign pages, which all key this form. */}
            <RequestForm key={selectedModel?.name ?? "blank"} prefill={prefill} />
          </Suspense>
        </div>

        <div className="mt-24 w-full relative z-20">
          <FAQSection data={config.faqs} />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
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

          {/* ── PARTNERS / AFFILIATES ──────────────────
              Same seven logos, sizing and grayscale-to-colour hover as the
              home page's partner strip, so the two read as one brand. */}
          <Reveal
            y={30}
            duration={1}
            className="mt-24 md:mt-32 max-w-5xl mx-auto w-full text-center"
          >
            <p className="text-[10px] md:text-xs font-bold tracking-[0.25em] md:tracking-[0.3em] text-zinc-400 uppercase mb-8 md:mb-10">
              Trusted by our global partners
            </p>

            <div className="flex flex-nowrap justify-center items-center gap-3 sm:gap-6 md:gap-10 lg:gap-16 w-full">
              {[1, 2, 3, 4, 5, 6, 7].map((num, index) => (
                <Reveal
                  key={num}
                  y={0}
                  scale={0.95}
                  delay={index * 0.1}
                  duration={0.8}
                  className="relative shrink h-6 w-12 sm:h-8 sm:w-16 md:h-12 md:w-24 lg:h-16 lg:w-32 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-500"
                >
                  <img
                    src={`/affiliate/${num}.png`}
                    alt={`Global Partner ${num}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
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
