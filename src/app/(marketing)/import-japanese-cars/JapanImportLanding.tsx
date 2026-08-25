"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Anchor,
  ArrowRight,
  CalendarClock,
  Gauge,
  Globe2,
  Play,
  Plus,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import {
  type Destination,
  DestinationChips,
  DestinationPanel,
} from "@/components/DestinationPicker";
import FAQSection from "@/components/faqSection";
import GalleryPreview from "@/components/GalleryPreview";
import GlobalPartnersStrip from "@/components/GlobalPartnersStrip";
import GradientMesh from "@/components/GradientMesh";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import RequestForm from "@/components/requestForm";
import { japanImportCampaignConfig } from "@/config/landing-pages";

// Vehicles are surfaced by their search tag, which mirrors this page's URL
// slug so the gallery stays scoped to this campaign's stock.
const CAMPAIGN_TAG = "import-japanese-cars";

// The cars we buy most often at Japanese auction. Everything here is sourced
// in Japan; not everything here was built there. `make` must match a value in
// the request form's CAR_MAKES list so the prefill lands on a valid option;
// `model` prefills the free-text/model field.
//
// Card images are model-correct photos from Wikimedia Commons (CC-licensed),
// cut out and re-composited onto a uniform dark studio backdrop with a soft
// contact shadow, so the whole grid reads as one set. Self-hosted under
// /public/import-cars with any visible number plates blurred. Every asset is
// stored nose-right — several of the source photographs were mirrored in the
// file rather than flipped in CSS, so a hover transform can never un-flip
// them — and every asset is 4:3, matching the card, so nothing is ever cropped.
// The dark backdrop is what lets the card carry the same black legibility
// gradient as the India campaign page; over the old light studio floor that
// gradient read as a smear.
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
    id: "hybrids-and-hatchbacks",
    label: "Hybrids & Hatchbacks",
    title: "Fuel-efficient hybrids and small hatchbacks.",
    blurb:
      "These are the highest-volume cars we import, and for most private buyers they are the cheapest way to own a reliable car. Japanese owners trade them in early, so they reach auction with low verified mileage and a full inspection history, and their small engines and low emissions keep import duty and registration tax down in nearly every country we ship to.",
    cars: [
      {
        name: "Toyota Aqua",
        make: "Toyota",
        model: "Aqua",
        blurb:
          "Japan's best-selling compact hybrid, and the cheapest hybrid we import.",
        image: "/import-cars/aqua.jpg",
      },
      {
        name: "Toyota Prius",
        make: "Toyota",
        model: "Prius",
        blurb:
          "The car that established the hybrid, and still the most economical saloon we ship.",
        image: "/import-cars/prius.jpg",
      },
      {
        name: "Honda Fit",
        make: "Honda",
        model: "Fit",
        blurb:
          "A compact hatchback with far more cabin and boot space than its footprint suggests.",
        image: "/import-cars/fit.jpg",
      },
      {
        name: "Honda Vezel",
        make: "Honda",
        model: "Vezel",
        blurb:
          "Honda's compact hybrid crossover, sized for cities and priced below a Harrier.",
        image: "/import-cars/vezel.jpg",
      },
      {
        name: "Nissan Note e-POWER",
        make: "Nissan",
        model: "Note e-POWER",
        blurb:
          "The petrol engine only charges the battery, so it drives like an EV but never needs plugging in.",
        image: "/import-cars/note.jpg",
      },
      {
        name: "Suzuki Swift",
        make: "Suzuki",
        model: "Swift",
        blurb:
          "A light, mechanically simple city car that is cheap to run and easy to get parts for.",
        image: "/import-cars/swift.jpg",
      },
    ],
  },
  {
    id: "suvs-and-4x4s",
    label: "SUVs & 4x4s",
    title: "Land Cruisers and premium SUVs.",
    blurb:
      "Japan registers more Land Cruisers than almost any other market and sells them on while they are still young, which is why a Japanese-sourced 4x4 usually lands cheaper than the equivalent car bought locally. Every vehicle in this group is right-hand drive as standard, and you see its auction grade, condition map and our own inspection findings before we bid on it.",
    cars: [
      {
        name: "Toyota Harrier",
        make: "Toyota",
        model: "Harrier",
        blurb:
          "Toyota's premium SUV, and the single most requested import across East Africa.",
        image: "/import-cars/harrier.jpg",
      },
      {
        name: "Land Cruiser Prado",
        make: "Toyota",
        model: "Land Cruiser Prado",
        blurb:
          "Genuine Land Cruiser capability in a smaller, cheaper and more economical body.",
        image: "/import-cars/prado.jpg",
      },
      {
        name: "Land Cruiser 200",
        make: "Toyota",
        model: "Land Cruiser 200",
        blurb:
          "The V8 Land Cruiser flagship, and the benchmark for long-distance reliability.",
        image: "/import-cars/lc200.jpg",
      },
      {
        name: "Land Cruiser 300",
        make: "Toyota",
        model: "Land Cruiser 300",
        blurb:
          "The current Land Cruiser, available from Japan while local waiting lists are still years long.",
        image: "/import-cars/lc300.jpg",
      },
      {
        name: "Lexus LX 600",
        make: "Lexus",
        model: "LX 600",
        blurb:
          "Land Cruiser 300 mechanicals underneath a Lexus cabin and finish.",
        image: "/import-cars/lx600.jpg",
      },
      {
        name: "Land Cruiser 70 Series",
        make: "Toyota",
        model: "Land Cruiser 70 Series",
        blurb:
          "The utilitarian Land Cruiser built for the hardest conditions, and back in production.",
        image: "/import-cars/lc70.jpg",
      },
      {
        name: "Mercedes-Benz G-Class",
        make: "Mercedes-Benz",
        model: "G-Class",
        blurb:
          "The G-Wagon, reaching auction with the low mileage typical of Japanese ownership.",
        image: "/import-cars/gwagon.jpg",
      },
    ],
  },
  {
    id: "vans-and-people-movers",
    label: "Vans & People Movers",
    title: "Seven and eight-seat vans.",
    blurb:
      "Japanese people movers are built around sliding doors, a flat floor and a genuinely usable third row, which is why they are the default choice for large families and for private hire work in most of the markets we serve. Hybrid versions are widely available and keep both fuel bills and emissions-based import taxes low.",
    cars: [
      {
        name: "Toyota Alphard",
        make: "Toyota",
        model: "Alphard",
        blurb:
          "Toyota's luxury people mover, with reclining business-class seats in the second row.",
        image: "/import-cars/alphard.jpg",
      },
      {
        name: "Toyota Noah",
        make: "Toyota",
        model: "Noah",
        blurb:
          "An eight-seat van with sliding doors, offered as a hybrid with very low running costs.",
        image: "/import-cars/noah.jpg",
      },
      {
        name: "Toyota Voxy",
        make: "Toyota",
        model: "Voxy",
        blurb:
          "Mechanically the same van as the Noah, with sportier styling and trim.",
        image: "/import-cars/voxy.jpg",
      },
    ],
  },
  {
    id: "luxury-and-performance",
    label: "Luxury & Performance",
    title: "Premium saloons and performance cars.",
    blurb:
      "Japan's shaken inspection regime makes older cars expensive to keep, so premium models leave first ownership early and arrive at auction with mileage you can verify against the country's own inspection records. That is how a European executive saloon or a Japanese performance car reaches you for less than the local equivalent costs.",
    cars: [
      {
        name: "Mercedes-Benz C-Class",
        make: "Mercedes-Benz",
        model: "C-Class",
        blurb:
          "Executive saloon comfort, with the low mileage typical of Japanese ownership.",
        image: "/import-cars/mercedes.jpg",
      },
      {
        name: "BMW 3 Series",
        make: "BMW",
        model: "3 Series",
        blurb:
          "BMW's compact executive saloon, bought at Japanese wholesale auction prices.",
        image: "/import-cars/bmw.jpg",
      },
      {
        name: "Nissan GT-R",
        make: "Nissan",
        model: "GT-R",
        blurb:
          "Nissan's flagship performance car, sourced in the country that builds it.",
        image: "/import-cars/gtr.jpg",
      },
    ],
  },
];

// ── Destination content ──────────────────────────────────────────────────────
// One entry per country button. The UI lives in @/components/DestinationPicker
// (shared with the India page); only the copy is page-specific, because the
// duty and origin rules below are written for a Japan-built car.
// `readMoreHref` points at the dedicated per-country guide — Ireland's is live;
// the rest are planned pages.
const DESTINATIONS: Destination[] = [
  {
    key: "uk",
    label: "United Kingdom",
    formCountry: "United Kingdom",
    headline: "The United Kingdom sets no age limit on imported cars.",
    body: "No age limit, no steering conversion, and a DVLA process we've run hundreds of times. From a daily-driver Aqua to a GR Yaris or an Alphard the family will fight over, your car is NOVA-notified within 14 days of arrival and registered for you — with duty and VAT locked into your quote before you commit.",
    facts: [
      { icon: Gauge, label: "No import age limit" },
      { icon: ShieldCheck, label: "NOVA + DVLA registration handled" },
      { icon: CalendarClock, label: "Typically 8–12 weeks door to door" },
      { icon: Anchor, label: "RoRo or container to UK ports" },
    ],
    popular:
      "Most requested for the UK: Toyota Aqua, Prius and Alphard, the GR Yaris, and the Honda Vezel.",
    readMoreHref: "/import-japanese-cars-to-uk",
  },
  {
    key: "ireland",
    label: "Ireland",
    formCountry: "Ireland",
    headline: "Japan-built cars enter Ireland at zero customs duty.",
    body: "Japan-built cars enter Ireland at 0% customs duty under the EU–Japan agreement, and efficient Japanese hybrids sit in the lowest VRT bands — which is why they consistently land thousands below Irish forecourt prices even after VAT. We calculate your exact VRT before you commit and handle the NCTS registration entirely.",
    facts: [
      { icon: Gauge, label: "0% duty on Japan-built cars" },
      { icon: ShieldCheck, label: "VRT calculated before you commit" },
      { icon: CalendarClock, label: "Typically 8–12 weeks door to door" },
      { icon: Anchor, label: "NCTS registration handled for you" },
    ],
    popular:
      "Most requested for Ireland: Toyota Prius and Aqua, the Honda Fit Hybrid and Vezel, and the Nissan Note e-POWER.",
    readMoreHref: "/import-japanese-cars-to-ireland",
  },
  {
    key: "new-zealand",
    label: "New Zealand",
    formCountry: "New Zealand",
    headline:
      "New Zealand imports more used cars from Japan than from anywhere else.",
    body: "More used cars reach New Zealand from Japan than from anywhere else, and the route is well worn: no customs duty on used vehicles, GST charged once on the landed value, a biosecurity clean before the ship, and entry certification before the plates go on. We buy to the standards the certifier will accept, arrange the steam clean in Japan, and land a car that's ready to comply.",
    facts: [
      { icon: Gauge, label: "No customs duty on used cars" },
      { icon: ShieldCheck, label: "GST + entry certification handled" },
      { icon: CalendarClock, label: "Typically 6–10 weeks door to door" },
      { icon: Anchor, label: "MPI biosecurity clean arranged in Japan" },
    ],
    popular:
      "Most requested for New Zealand: Toyota Aqua and Prius, the Honda Fit, the Suzuki Swift, and the Land Cruiser Prado.",
    // No dedicated New Zealand guide page exists yet, so this stays null
    // rather than pointing the CTA at a 404.
    readMoreHref: null,
  },
  {
    key: "kenya",
    label: "Kenya",
    formCountry: "Kenya",
    headline:
      "Kenya admits vehicles under eight years old, inspected before export.",
    body: "Kenya's rules are strict — under 8 years old, right-hand drive, mandatory pre-export roadworthiness inspection — and that's precisely why buying through us pays. We source age-compliant stock straight off the auction sheet, book the KEBS-compliance inspection in Japan, and land your car at Mombasa with every duty in the quote you approved.",
    facts: [
      { icon: Gauge, label: "8-year age rule — compliant stock only" },
      { icon: ShieldCheck, label: "Pre-export inspection arranged in Japan" },
      { icon: CalendarClock, label: "Typically 6–10 weeks door to door" },
      { icon: Anchor, label: "Clearance support at Mombasa" },
    ],
    popular:
      "Most requested for Kenya: the Toyota Harrier, Fielder, Vitz, Probox and Land Cruiser Prado.",
    readMoreHref: "/import-japanese-cars-to-kenya",
  },
  {
    key: "tanzania",
    label: "Tanzania",
    formCountry: "Tanzania",
    headline:
      "Tanzania has no age limit, but older cars carry extra excise duty.",
    body: "Tanzania welcomes a wider range of Japanese imports than its neighbours: there's no outright age limit, though cars over 10 years old carry extra excise — which we build into your landed quote so the number never moves. Pre-shipment inspection is arranged in Japan, and we support your car's clearance through Dar es Salaam, with our team on it the whole way.",
    facts: [
      { icon: Gauge, label: "No age ban — excise built into quote" },
      { icon: ShieldCheck, label: "Pre-shipment inspection arranged" },
      { icon: CalendarClock, label: "Typically 6–10 weeks door to door" },
      { icon: Anchor, label: "Clearance support at Dar es Salaam" },
    ],
    popular:
      "Most requested for Tanzania: the Toyota IST, Harrier, Noah, Raum and Land Cruiser.",
    readMoreHref: "/import-japanese-cars-to-tanzania",
  },
  {
    key: "uganda",
    label: "Uganda",
    formCountry: "Uganda",
    headline:
      "Uganda is landlocked, so we support clearance at Mombasa and run overland to Kampala.",
    body: "Your car lands at Mombasa and travels overland to Kampala under a bonded transit we arrange — one quote, one team, no handoffs at the border. Uganda's 15-year age ban and environmental levy make a 5–9 year-old Japanese car the sweet spot, and we source exactly that, with URA taxes included in the single price you approve up front.",
    facts: [
      { icon: Gauge, label: "15-year rule — sweet spot sourced" },
      { icon: ShieldCheck, label: "URA taxes in your up-front quote" },
      { icon: CalendarClock, label: "Typically 7–11 weeks door to door" },
      { icon: Anchor, label: "Bonded transit Mombasa → Kampala" },
    ],
    popular:
      "Most requested for Uganda: the Toyota Harrier, Premio, Wish, Hiace and Fielder.",
    readMoreHref: "/import-japanese-cars-to-uganda",
  },
  {
    key: "other",
    label: "Other",
    formCountry: null,
    headline:
      "We ship to right-hand-drive markets beyond our six core countries.",
    body: "Beyond our six core markets we ship to right-hand-drive countries worldwide — across the Caribbean, southern Africa, and the Pacific. Every destination gets the same treatment: auction sheet before payment, your country's rules confirmed before you commit, and one all-in landed price. Tell us your country in the form and we'll come back with the exact rules, timeline and cost.",
    facts: [
      { icon: Globe2, label: "RHD markets worldwide" },
      { icon: ShieldCheck, label: "Local rules confirmed before you pay" },
      { icon: CalendarClock, label: "Timeline quoted per destination" },
      { icon: Anchor, label: "RoRo & container routes globally" },
    ],
    popular:
      "Tell us your destination in the form and we will map the route and quote it in full.",
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
            <DestinationChips
              destinations={DESTINATIONS}
              selected={destination}
              onSelect={handleDestinationSelect}
            />
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
                See the cars we import
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
      <DestinationPanel
        destination={destination}
        emptyHeadline="Buy direct from Japan's auction floor — with the auction sheet, the landed number and the paperwork support to do it with confidence."
        emptyBody="Japan's wholesale auctions sell more than 100,000 independently graded cars every week, at prices no retail forecourt can match — and until now you needed a licence and a buyer in the hall to reach them. You tell us the model and specification you want. We find it, send you the original auction sheet and our own inspection findings before we bid, and quote one landed price covering the car, shipping, marine cover, duty and the taxes that apply at your destination. Choose your destination above and we will show you exactly how the rules, taxes and timeline work for your country."
      />

      {/* ── MODEL CARDS, BY CATEGORY ─────────────────── */}
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
              Choose the car you want us to source.
            </h2>
            <p className="text-lg text-zinc-500 font-light">
              Every model below is one we buy regularly in Japan, which means we
              already know what it should cost at auction, what condition to
              expect at each grade, and how it will be taxed when it reaches
              your country. Select one and we will open the inquiry form with
              that car filled in. If what you want is not shown here, use the
              card at the end of the grid and describe it to us instead.
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
                      className="group relative w-full aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-black/10 bg-zinc-900 hover:border-black/40 hover:shadow-[0_24px_50px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300 text-left"
                    >
                      {/* The card matches the aspect ratio of the source image,
                          so object-cover never actually has anything to crop —
                          the previous fixed-height card cut the wheels off. */}
                      <img
                        src={model.image}
                        alt={`${model.name} sourced from Japanese auction by Providence Auto`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                      />
                      {/* Legibility gradient behind the label */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-2">
                        <span className="flex flex-col leading-tight">
                          <span className="text-white text-base md:text-lg font-bold tracking-tight drop-shadow-sm">
                            {model.name}
                          </span>
                          <span className="text-white/70 text-xs font-medium drop-shadow-sm">
                            {model.blurb}
                          </span>
                        </span>
                        <span className="shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <ArrowRight size={15} className="text-white" />
                        </span>
                      </div>
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
                      className="group w-full aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-dashed border-black/20 bg-zinc-50/60 hover:border-black/40 hover:bg-white hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center px-4"
                    >
                      <span className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Plus size={20} />
                      </span>
                      <span className="text-black text-base md:text-lg font-bold tracking-tight">
                        More
                      </span>
                      <span className="text-zinc-500 text-xs font-medium mt-0.5">
                        Tell us any make or model
                      </span>
                    </button>
                  </Reveal>
                )}
              </div>
            </div>
          ))}

          <Reveal y={20} duration={0.6} className="text-center mt-12">
            <p className="text-zinc-500 font-light max-w-3xl mx-auto">
              This is a shortlist, not our catalogue. If you are after a kei
              truck, a Toyota Hiace, a GR-badged model or anything else sold in
              Japan,{" "}
              <a
                href="#inquiry"
                className="text-black font-medium underline decoration-1 underline-offset-4 hover:decoration-2"
              >
                describe it in the inquiry form
              </a>{" "}
              and we will find it at auction for you.
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
            title="Available Now From Japanese Auction"
            subtitle="These are cars we have already sourced and graded in Japan, ready to ship to your country. The original auction sheet for any of them is available on request."
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
              alt="A Mercedes-Benz G-Class loaded onto a transporter — Providence Auto global logistics for Japanese car imports"
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
            Tell us the car you are after and we will find it{" "}
            <span className="text-black font-medium">at Japanese auction</span>,
            verify its auction sheet, and come back to you with a full
            landed-cost quote for {destination?.formCountry ?? "your country"}{" "}
            before you commit to anything.
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
            <RequestForm
              key={selectedModel?.name ?? "blank"}
              prefill={prefill}
            />
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
          <GlobalPartnersStrip />
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
