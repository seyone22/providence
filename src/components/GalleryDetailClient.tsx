"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  FileText,
  Globe,
  Loader2,
  Mail,
  Palette,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { generateDossierPdfAction } from "@/actions/pdf-actions";
import FAQSection from "@/components/faqSection";
import MinimalHeader from "@/components/MinimalHeader";
import { Reveal } from "@/components/Reveal";
import RequestForm, { mileageToPrefillRange } from "@/components/requestForm";
import { getLogoFilename } from "@/lib/logo-utils";
import { colorLabel, parseColors, swatchStyle } from "@/lib/vehicle-colors";

// Updated Type to include Pricing Matrix
type PriceEntry = {
  country: string;
  currency: string;
  amount: number;
  type: string;
};

// --- ADD THESE ENTRY TYPES ABOVE type Dossier ---
type CustomDataEntry = {
  label: string;
  value: string;
};

type ValuePointEntry = {
  title: string;
  description: string;
};

type Dossier = {
  _id: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  condition?: string;
  mileage?: string;
  countryOfOrigin: string;
  engineConfig: string;
  displacement: string;
  heroImageUrl?: string;
  maxPower: string;
  maxTorque: string;
  transmission: string;
  fuelSystem: string;
  steering: string;
  emissions: string;
  upholstery: string;
  infotainment: string;
  features: string[];
  searchTags: string[];
  images: string[];
  notes: string;
  status: string;
  pricing?: PriceEntry[];
  // --- ADD THESE TWO NEW FIELDS HERE ---
  customData?: CustomDataEntry[];
  valuePoints?: ValuePointEntry[];
  // Upcoming / coming-soon models
  isUpcoming?: boolean;
  expectedAvailability?: string;
  newsSlug?: string;
  // Colour palettes (raw jsonb — run through parseColors before use)
  exteriorColors?: unknown;
  interiorColors?: unknown;
};

export default function GalleryDetailClient({ car }: { car: Dossier }) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const inquiryRef = useRef<HTMLDivElement>(null);

  const scrollToInquiry = () => {
    inquiryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Normalise the dossier's condition, defaulting older records (no condition
  // set) to "New" so the inquiry form never lands on an empty toggle.
  const isUsed = car.condition === "Used";
  const mileageNum = isUsed
    ? parseInt(String(car.mileage).replace(/[^\d]/g, ""), 10)
    : NaN;

  const exteriorColors = useMemo(
    () => parseColors(car.exteriorColors),
    [car.exteriorColors],
  );
  const interiorColors = useMemo(
    () => parseColors(car.interiorColors),
    [car.interiorColors],
  );

  // Memoised because RequestForm re-applies `prefill` whenever its identity
  // changes: without this, clicking a gallery thumbnail (which re-renders this
  // component) would rebuild the object and wipe whatever the customer had
  // already typed into the inquiry form.
  const prefillData = useMemo(
    () => ({
      make: car.make,
      vehicle_model: car.model,
      condition: isUsed ? "Used" : "New",
      // For a used car with a known odometer reading, prefill the form's
      // mileage range to bracket that figure.
      ...(isUsed && Number.isFinite(mileageNum)
        ? mileageToPrefillRange(mileageNum)
        : {}),
      // A coming-soon dossier produces a pre-order lead, not a live quote —
      // flagged here so the pipeline can tell the two apart.
      isUpcomingVehicle: car.isUpcoming === true,
      specs: `Inquiry for ${car.year} ${car.make} ${car.model} (${car.trim}). Features: ${car.features?.join(", ")}`,
    }),
    [
      car.make,
      car.model,
      car.year,
      car.trim,
      car.features,
      car.isUpcoming,
      isUsed,
      mileageNum,
    ],
  );

  // UPDATE: Set default image based on hero selection
  const displayImages =
    car.images?.length > 0
      ? car.images
      : [
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2938&auto=format&fit=crop",
        ];

  // Use heroImageUrl if it exists, otherwise default to index 0
  const _initialHero =
    car.heroImageUrl && car.images?.includes(car.heroImageUrl)
      ? car.heroImageUrl
      : displayImages[0];

  // Initialize activeImage to show the hero image first
  const [activeImage, setActiveImage] = useState(0);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const res = await generateDossierPdfAction(car._id);
      if (res.success && res.pdfBase64) {
        const byteCharacters = atob(res.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } else {
        alert(res.message || "Failed to generate PDF.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating the PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden pb-32">
      <MinimalHeader />

      {/* Top Section */}
      <section className="pt-32 px-6 max-w-[1400px] mx-auto">
        <Link
          href="/b2c/gallery"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <Reveal
            immediate
            y={30}
            duration={0.8}
            className="lg:col-span-5 flex flex-col justify-center sticky top-32"
          >
            {/* Logo Display */}
            {getLogoFilename(car.make) && (
              <div className="mb-6">
                <img
                  src={`/car_logo/${getLogoFilename(car.make)}`}
                  alt={`${car.make} logo`}
                  className="h-12 w-auto opacity-50 grayscale hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            )}

            {car.isUpcoming && (
              <div className="mb-5 inline-flex items-center gap-2 self-start rounded-full bg-sky-600 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
                <CalendarClock size={14} /> Coming Soon
              </div>
            )}

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.9] mb-4 uppercase">
              {car.make} <br />
              <span className="text-zinc-400">{car.model}</span> <br />
              {car.year}
            </h1>

            {/* Pre-order framing: state plainly that this car isn't here yet,
                and link to the announcement it was launched in. */}
            {car.isUpcoming && (
              <div className="mt-2 rounded-[1.5rem] border border-sky-200 bg-sky-50/60 p-6">
                <p className="text-sm text-zinc-600 font-light leading-relaxed">
                  This model has been announced but is not yet available to buy.
                  Register your interest now and we&rsquo;ll come back to you
                  with a landed cost for your country the moment specification
                  and pricing are confirmed.
                </p>
                {car.expectedAvailability && (
                  <p className="mt-4 flex items-center gap-2 text-sm font-bold text-sky-700">
                    <CalendarClock size={15} className="shrink-0" />
                    Expected: {car.expectedAvailability}
                  </p>
                )}
                {car.newsSlug && (
                  <Link
                    href={`/latest-news/${car.newsSlug}`}
                    className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    Read the announcement
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                )}
              </div>
            )}

            <div className="h-px w-full bg-black/10 my-8" />
            <div className="prose prose-lg text-zinc-600 font-light leading-relaxed">
              {car.notes ? (
                <p>{car.notes}</p>
              ) : (
                <p>A pristine example of engineering and design...</p>
              )}
            </div>
          </Reveal>

          <Reveal
            immediate
            y={0}
            scale={0.95}
            duration={1}
            delay={0.1}
            className="lg:col-span-7"
          >
            <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden bg-black flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <img
                key={activeImage}
                src={
                  activeImage === 0 &&
                  car.heroImageUrl &&
                  car.images?.includes(car.heroImageUrl)
                    ? car.heroImageUrl
                    : displayImages[activeImage]
                }
                alt={`${car.make} - View ${activeImage + 1}`}
                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Specs, Pricing & Gallery */}
      <section className="mt-24 lg:mt-40 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left Column */}
          <Reveal y={30} duration={0.8} className="lg:col-span-5 flex flex-col">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-12 uppercase leading-tight">
              Vehicle <br /> Details
            </h2>

            {/* 1. PRICING MATRIX (New Section) */}
            {car.pricing && car.pricing.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                  <Globe size={20} className="text-[#4da8da]" /> Landed Pricing
                  Estimate
                </h3>
                <div className="space-y-3">
                  {car.pricing.map((p, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 bg-white rounded-2xl border border-black/5 shadow-sm"
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                          {p.country}
                        </p>
                        <p className="text-xs font-bold text-zinc-500 uppercase">
                          {p.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-black tracking-tight">
                          <span className="text-sm font-medium mr-1 text-[#4da8da]">
                            {p.currency}
                          </span>
                          {p.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-zinc-400 italic px-2 mt-2">
                    * Estimates include logistics and estimated duties. Final
                    quote provided upon inquiry.
                  </p>
                </div>
              </div>
            )}

            {/* 2. PROVIDENCE VALUE ADVANTAGES (New Section) */}
            {car.valuePoints && car.valuePoints.length > 0 && (
              <div className="mb-12 space-y-4">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <Zap size={20} className="text-amber-500 fill-amber-500/10" />{" "}
                  Providence Advantages
                </h3>
                <div className="space-y-4">
                  {car.valuePoints.map((point, i) => (
                    <div
                      key={i}
                      className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100/70 shadow-sm"
                    >
                      <h4 className="text-md font-bold text-zinc-900 mb-1.5">
                        {point.title}
                      </h4>
                      <p className="text-xs text-zinc-600 leading-relaxed font-light">
                        {point.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TECHNICAL SPECS */}
            <h3 className="text-2xl font-serif text-zinc-500 mb-6 italic">
              Technical Specifications
            </h3>
            <div className="bg-white rounded-[2rem] border border-black/5 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] mb-10">
              <dl className="divide-y divide-black/5">
                {[
                  { label: "Variant / Trim", value: car.trim },
                  { label: "Origin", value: car.countryOfOrigin },
                  {
                    label: "Engine",
                    value:
                      `${car.displacement || ""} ${car.engineConfig || ""}`.trim(),
                  },
                  { label: "Transmission", value: car.transmission },
                  { label: "Fuel System", value: car.fuelSystem },
                  { label: "Steering", value: car.steering },
                ].map(
                  (spec, i) =>
                    spec.value && (
                      <div
                        key={i}
                        className="py-4 flex justify-between items-center first:pt-0"
                      >
                        <dt className="text-zinc-500 text-sm font-medium">
                          {spec.label}
                        </dt>
                        <dd className="text-black font-semibold text-right">
                          {spec.value}
                        </dd>
                      </div>
                    ),
                )}

                {/* Append Custom Data Rows Dynamically inside the spec table list */}
                {car.customData &&
                  car.customData.length > 0 &&
                  car.customData.map(
                    (custom, idx) =>
                      custom.value && (
                        <div
                          key={`custom-${idx}`}
                          className="py-4 flex justify-between items-center last:pb-0"
                        >
                          <dt className="text-zinc-500 text-sm font-medium">
                            {custom.label}
                          </dt>
                          <dd className="text-black font-semibold text-right">
                            {custom.value}
                          </dd>
                        </div>
                      ),
                  )}
              </dl>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-zinc-800 hover:bg-black text-white text-sm font-bold uppercase tracking-wider rounded-full transition-colors disabled:opacity-70"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <FileText size={18} />
                )}
                {isGeneratingPdf ? "Generating..." : "Download PDF"}
              </button>

              <button
                onClick={scrollToInquiry}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-black/10 hover:border-black/30 hover:bg-zinc-50 text-black text-sm font-bold uppercase tracking-wider rounded-full transition-all"
              >
                <Mail size={18} /> Inquire Now
              </button>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="mt-auto pt-8 border-t border-black/10">
                <p className="text-zinc-500 font-bold tracking-widest uppercase text-sm mb-4">
                  Included Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-zinc-100/80 text-zinc-800 text-xs font-bold uppercase tracking-wider rounded-xl border border-black/5"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Reveal>

          {/* Right Column: Interactive Gallery */}
          <Reveal
            y={30}
            duration={0.8}
            delay={0.2}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden bg-black flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <img
                key={activeImage}
                src={displayImages[activeImage]}
                alt={`${car.make} - View ${activeImage + 1}`}
                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
              />
            </div>
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 border-2 transition-all duration-300 ${activeImage === idx ? "border-black shadow-lg scale-105" : "border-transparent hover:border-black/20"}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Colours & Finishes — only rendered when the dossier actually carries
          a palette, so older records don't show an empty shell. */}
      {(exteriorColors.length > 0 || interiorColors.length > 0) && (
        <section className="mt-32 lg:mt-48 px-6 max-w-[1400px] mx-auto">
          <Reveal y={30} duration={0.8}>
            <div className="flex items-center gap-4 mb-12">
              <Palette size={28} className="text-zinc-300" />
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase leading-none">
                Colours &amp; Finishes
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {[
              { label: "Exterior", colors: exteriorColors },
              { label: "Interior", colors: interiorColors },
            ]
              .filter((group) => group.colors.length > 0)
              .map((group, groupIndex) => (
                <Reveal
                  key={group.label}
                  y={30}
                  delay={groupIndex * 0.1}
                  duration={0.8}
                >
                  <p className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase mb-8">
                    {group.label}
                  </p>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
                    {group.colors.map((color) => (
                      <li
                        key={`${color.name}-${color.hex}`}
                        className="flex flex-col gap-3"
                      >
                        <span
                          className="h-16 w-16 rounded-full border border-black/10 shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
                          style={swatchStyle(color)}
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-zinc-700 leading-snug">
                          {colorLabel(color)}
                        </span>
                        {color.isDualTone && (
                          <span className="-mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            Dual tone
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
          </div>

          <p className="mt-12 text-sm text-zinc-400 font-light">
            Availability varies by market and build slot. Choose your
            combination below and we&rsquo;ll confirm it against the factory
            options list for your destination.
          </p>
        </section>
      )}

      {/* Inquiry Section */}
      <section
        ref={inquiryRef}
        className="mt-32 lg:mt-56 px-6 py-24 bg-zinc-50 border-y border-black/5"
      >
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.8] mb-6">
              {car.isUpcoming ? (
                <>
                  Register <br />{" "}
                  <span className="text-[#4da8da]">Interest</span>
                </>
              ) : (
                <>
                  Start Your <br />{" "}
                  <span className="text-[#4da8da]">Purchase</span>
                </>
              )}
            </h2>
            <p className="text-zinc-500 text-lg font-light leading-relaxed">
              {car.isUpcoming
                ? `We'll hold your specification for this ${car.model} and come back with a landed cost for your country as soon as it's confirmed for release.`
                : `Our team will verify the availability of this ${car.model} and provide a landed cost estimate for your destination country.`}
            </p>
          </div>
          <div className="lg:col-span-8">
            <RequestForm
              prefill={prefillData}
              exteriorColorOptions={exteriorColors}
              interiorColorOptions={interiorColors}
            />
          </div>
        </div>
      </section>

      <FAQSection />
    </main>
  );
}
