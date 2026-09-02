"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CarFront,
  Check,
  ChevronDown,
  FileText,
  Globe,
  Images,
  Layers,
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
import { parseSteeringOptions, steeringLabel } from "@/lib/vehicle";
import {
  colorLabel,
  parseColors,
  swatchStyle,
  type VehicleColor,
} from "@/lib/vehicle-colors";
import {
  findGrade,
  gradeFeatures,
  gradePricing,
  gradeSpec,
  parseGrades,
  type VehicleGrade,
} from "@/lib/vehicle-grades";

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
  // Grade ladder (raw jsonb — run through parseGrades before use)
  grades?: unknown;
  // Every hand this model can be sourced in; empty falls back to `steering`
  steeringOptions?: string[];
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2938&auto=format&fit=crop";

// How much of each long list is shown before the reader has to ask for more.
// A spec dossier can carry 20+ custom rows and a dozen features; rendering all
// of it up front is what made this page an endless scroll.
const LIMITS = {
  gradeHighlights: 6,
  specs: 8,
  features: 8,
  advantages: 3,
  thumbs: 6,
  colors: 6,
};

/** Shared "show the rest of this list" toggle. `noun` is singular. */
function MoreButton({
  expanded,
  hiddenCount,
  noun,
  onClick,
}: {
  expanded: boolean;
  hiddenCount: number;
  noun: string;
  onClick: () => void;
}) {
  if (hiddenCount <= 0) return null;
  const label = hiddenCount === 1 ? noun : `${noun}s`;
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition-colors"
    >
      {expanded ? "Show less" : `Show ${hiddenCount} more ${label}`}
      <ChevronDown
        size={14}
        className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
      />
    </button>
  );
}

export default function GalleryDetailClient({ car }: { car: Dossier }) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const inquiryRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const [specsOpen, setSpecsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [advantagesOpen, setAdvantagesOpen] = useState(false);
  const [thumbsOpen, setThumbsOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

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

  // --- Grade and steering, the two choices that change the page ----------
  const grades = useMemo(() => parseGrades(car.grades), [car.grades]);
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  // findGrade falls back to the dossier's default rather than to nothing, so
  // this is undefined only for a model with no grades at all.
  const selectedGrade = findGrade(grades, selectedGradeId);

  const steeringOptions = useMemo(
    () => parseSteeringOptions(car.steeringOptions, car.steering),
    [car.steeringOptions, car.steering],
  );
  const [selectedSteering, setSelectedSteering] = useState(steeringOptions[0]);
  // A dossier edited from RHD-only to LHD-only would otherwise leave the page
  // holding a hand the car no longer comes in.
  const activeSteering = steeringOptions.includes(selectedSteering)
    ? selectedSteering
    : steeringOptions[0];

  // Every spec the selected grade touches, resolved against the base car.
  // Blank on a grade means "same as the dossier", so this is the single place
  // the inheritance rule is applied on the public side.
  const specs = useMemo(() => {
    const base = {
      engineConfig: car.engineConfig,
      displacement: car.displacement,
      maxPower: car.maxPower,
      maxTorque: car.maxTorque,
      transmission: car.transmission,
      fuelSystem: car.fuelSystem,
      emissions: car.emissions,
    };
    return {
      engineConfig: gradeSpec(base, selectedGrade, "engineConfig"),
      displacement: gradeSpec(base, selectedGrade, "displacement"),
      maxPower: gradeSpec(base, selectedGrade, "maxPower"),
      maxTorque: gradeSpec(base, selectedGrade, "maxTorque"),
      transmission: gradeSpec(base, selectedGrade, "transmission"),
      fuelSystem: gradeSpec(base, selectedGrade, "fuelSystem"),
      emissions: gradeSpec(base, selectedGrade, "emissions"),
    };
  }, [
    car.engineConfig,
    car.displacement,
    car.maxPower,
    car.maxTorque,
    car.transmission,
    car.fuelSystem,
    car.emissions,
    selectedGrade,
  ]);

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
      specs: `Inquiry for ${car.year} ${car.make} ${car.model}${car.trim ? ` (${car.trim})` : ""}.`,
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

  const displayImages = car.images?.length > 0 ? car.images : [FALLBACK_IMAGE];

  // The hero is an index into the dossier's own image order rather than a
  // reordering of it — colour swatches store an `imageIndex` against that same
  // order, so shuffling the array here would point them at the wrong photo.
  const heroIndex = car.heroImageUrl
    ? displayImages.indexOf(car.heroImageUrl)
    : -1;
  const [activeImage, setActiveImage] = useState(
    heroIndex >= 0 ? heroIndex : 0,
  );

  /** The image linked to a swatch, if it points at one that actually exists. */
  const linkedImage = (color: VehicleColor) =>
    typeof color.imageIndex === "number" &&
    color.imageIndex < displayImages.length
      ? color.imageIndex
      : undefined;

  const showColorImage = (color: VehicleColor) => {
    const idx = linkedImage(color);
    if (idx === undefined) return;
    setActiveImage(idx);
    // On mobile the palette sits below the gallery, so bring the photo back
    // into view — otherwise the swatch appears to do nothing.
    galleryRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  const anyColorLinked = [...exteriorColors, ...interiorColors].some(
    (c) => linkedImage(c) !== undefined,
  );

  const pickGrade = (id: string) => {
    setSelectedGradeId(id);
    const grade = grades.find((g) => g.id === id);
    // A grade with its own photograph swaps the gallery to it; one without
    // leaves the gallery alone rather than jumping to an unrelated shot.
    if (
      grade &&
      typeof grade.imageIndex === "number" &&
      grade.imageIndex < displayImages.length
    ) {
      setActiveImage(grade.imageIndex);
    }
  };

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

  // Base spec rows and the dossier's custom rows share one table and one
  // collapse, so the reader sees a single "Technical Specifications" list.
  const specRows = [
    // The grade replaces the static trim row when the model has a ladder —
    // showing both puts two contradictory answers to the same question next
    // to each other.
    selectedGrade
      ? { label: "Grade", value: selectedGrade.name }
      : { label: "Variant / Trim", value: car.trim },
    { label: "Origin", value: car.countryOfOrigin },
    {
      label: "Engine",
      value: `${specs.displacement} ${specs.engineConfig}`.trim(),
    },
    { label: "Max Power", value: specs.maxPower },
    { label: "Max Torque", value: specs.maxTorque },
    { label: "Transmission", value: specs.transmission },
    { label: "Fuel System", value: specs.fuelSystem },
    { label: "Steering", value: steeringLabel(activeSteering) },
    { label: "Emissions", value: specs.emissions },
    ...(car.customData ?? []).map((c) => ({
      label: c.label,
      value: c.value,
    })),
  ].filter((row) => row.value);

  const visibleSpecs = specsOpen ? specRows : specRows.slice(0, LIMITS.specs);
  const features = gradeFeatures(car.features, selectedGrade);
  const pricing = gradePricing(car.pricing, selectedGrade);
  const visibleFeatures = featuresOpen
    ? features
    : features.slice(0, LIMITS.features);
  const advantages = car.valuePoints ?? [];
  const visibleAdvantages = advantagesOpen
    ? advantages
    : advantages.slice(0, LIMITS.advantages);
  const visibleThumbs = thumbsOpen
    ? displayImages
    : displayImages.slice(0, LIMITS.thumbs);

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden pb-16">
      <MinimalHeader />

      <section className="pt-28 px-6 max-w-[1400px] mx-auto">
        <Link
          href="/b2c/gallery"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Identity + description */}
          <Reveal
            immediate
            y={24}
            duration={0.7}
            className="lg:col-span-5 flex flex-col"
          >
            {getLogoFilename(car.make) && (
              <img
                src={`/car_logo/${getLogoFilename(car.make)}`}
                alt={`${car.make} logo`}
                // `self-start` is load-bearing: this sits in a `flex flex-col`,
                // where the default `align-items: stretch` widens the image to
                // the whole column and `w-auto` resolves to that stretched
                // width. With `h-9` pinning the height, a wordmark like Land
                // Rover's oval was being smeared to roughly 18:1.
                className="h-12 w-auto self-start object-contain opacity-50 grayscale hover:opacity-100 transition-opacity duration-500 mb-4"
              />
            )}

            {car.isUpcoming && (
              <div className="mb-4 inline-flex items-center gap-2 self-start rounded-full bg-sky-600 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                <CalendarClock size={13} /> Coming Soon
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[0.95] mb-3 uppercase">
              {car.make} <span className="text-zinc-400">{car.model}</span>{" "}
              <span className="text-zinc-300">{car.year}</span>
            </h1>

            {/* Pre-order framing: state plainly that this car isn't here yet,
                and link to the announcement it was launched in. */}
            {car.isUpcoming && (
              <div className="mt-3 rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
                <p className="text-sm text-zinc-600 font-light leading-relaxed">
                  Announced but not yet available to buy. Register your interest
                  and we&rsquo;ll come back with a landed cost for your country
                  once specification and pricing are confirmed.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                  {car.expectedAvailability && (
                    <p className="flex items-center gap-1.5 text-sm font-bold text-sky-700">
                      <CalendarClock size={14} className="shrink-0" />
                      {car.expectedAvailability}
                    </p>
                  )}
                  {car.newsSlug && (
                    <Link
                      href={`/latest-news/${car.newsSlug}`}
                      className="group inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
                    >
                      Read the announcement
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* A car that is already orderable still belongs to the story that
                announced it — `newsSlug` is documented as a two-way link, so it
                cannot live only inside the pre-order panel above. */}
            {!car.isUpcoming && car.newsSlug && (
              <div className="mt-3">
                <Link
                  href={`/latest-news/${car.newsSlug}`}
                  className="group inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Read the announcement
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            )}

            {car.notes && (
              <div className="mt-5">
                <p
                  className={`text-base text-zinc-600 font-light leading-relaxed ${descriptionOpen ? "" : "line-clamp-4"}`}
                >
                  {car.notes}
                </p>
                {car.notes.length > 260 && (
                  <button
                    type="button"
                    onClick={() => setDescriptionOpen((v) => !v)}
                    className="mt-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition-colors"
                  >
                    {descriptionOpen ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}

            {/* Grade and steering — the two choices that change what gets
                quoted, so they sit above the CTA rather than below it. */}
            {(grades.length > 0 || steeringOptions.length > 1) && (
              <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_28px_rgba(0,0,0,0.03)]">
                {grades.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Layers size={17} className="text-zinc-400" />
                      <p className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">
                        Grade
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {grades.map((grade) => {
                        const isActive = selectedGrade?.id === grade.id;
                        return (
                          <button
                            key={grade.id}
                            type="button"
                            onClick={() => pickGrade(grade.id)}
                            aria-pressed={isActive}
                            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold border transition-all ${
                              isActive
                                ? "bg-black text-white border-black shadow-md"
                                : "bg-white text-zinc-600 border-black/10 hover:border-black/40"
                            }`}
                          >
                            {isActive && <Check size={14} strokeWidth={3} />}
                            {grade.name}
                          </button>
                        );
                      })}
                    </div>

                    {selectedGrade?.summary && (
                      <p className="mt-3.5 text-sm text-zinc-600 font-light leading-relaxed">
                        {selectedGrade.summary}
                      </p>
                    )}

                    {selectedGrade && selectedGrade.highlights.length > 0 && (
                      <GradeHighlights grade={selectedGrade} />
                    )}
                  </div>
                )}

                {steeringOptions.length > 1 && (
                  <div
                    className={
                      grades.length > 0
                        ? "mt-5 pt-5 border-t border-black/5"
                        : ""
                    }
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CarFront size={17} className="text-zinc-400" />
                      <p className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">
                        Steering
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {steeringOptions.map((option) => {
                        const isActive = activeSteering === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setSelectedSteering(option)}
                            aria-pressed={isActive}
                            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold border transition-all ${
                              isActive
                                ? "bg-black text-white border-black shadow-md"
                                : "bg-white text-zinc-600 border-black/10 hover:border-black/40"
                            }`}
                          >
                            {isActive && <Check size={14} strokeWidth={3} />}
                            {steeringLabel(option)}
                          </button>
                        );
                      })}
                    </div>

                    <p className="mt-3 text-[11px] text-zinc-400 font-light leading-relaxed">
                      Your destination country decides which hand you can
                      register, and we source this model in both.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={scrollToInquiry}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-black hover:bg-zinc-800 text-white text-sm font-bold uppercase tracking-wider rounded-full transition-colors"
              >
                <Mail size={17} />{" "}
                {car.isUpcoming ? "Register Interest" : "Inquire Now"}
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-black/10 hover:border-black/30 hover:bg-zinc-50 text-black text-sm font-bold uppercase tracking-wider rounded-full transition-all disabled:opacity-70"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="animate-spin" size={17} />
                ) : (
                  <FileText size={17} />
                )}
                {isGeneratingPdf ? "Generating" : "PDF"}
              </button>
            </div>
          </Reveal>

          {/* Gallery + the palette that drives it */}
          <Reveal
            immediate
            y={0}
            scale={0.97}
            duration={0.8}
            delay={0.1}
            className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-24"
          >
            <div
              ref={galleryRef}
              className="relative aspect-[16/10] w-full rounded-[1.5rem] overflow-hidden bg-black flex items-center justify-center shadow-[0_16px_40px_rgba(0,0,0,0.10)]"
            >
              <img
                key={activeImage}
                src={displayImages[activeImage]}
                alt={`${car.make} ${car.model} — view ${activeImage + 1}`}
                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
              />
            </div>

            {displayImages.length > 1 && (
              <div>
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
                  {visibleThumbs.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      onClick={() => setActiveImage(idx)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 border-2 transition-all duration-300 ${activeImage === idx ? "border-black shadow-md" : "border-transparent hover:border-black/20"}`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <MoreButton
                  expanded={thumbsOpen}
                  hiddenCount={displayImages.length - LIMITS.thumbs}
                  noun="photo"
                  onClick={() => setThumbsOpen((v) => !v)}
                />
              </div>
            )}

            {/* Colours & finishes, next to the photo they change. */}
            {(exteriorColors.length > 0 || interiorColors.length > 0) && (
              <div className="mt-2 rounded-2xl border border-black/5 bg-white p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Palette size={17} className="text-zinc-400" />
                    <p className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">
                      Colours &amp; Finishes
                    </p>
                  </div>
                  {anyColorLinked && (
                    <p className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-600">
                      <Images size={12} /> Tap a swatch to view
                    </p>
                  )}
                </div>

                {/* Exterior and interior sit side by side from sm up, so the
                    card's full width is used and the block stays short. */}
                <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {[
                    { label: "Exterior", colors: exteriorColors },
                    { label: "Interior", colors: interiorColors },
                  ]
                    .filter((group) => group.colors.length > 0)
                    .map((group) => (
                      <ColorGroup
                        key={group.label}
                        label={group.label}
                        colors={group.colors}
                        linkedImage={linkedImage}
                        activeImage={activeImage}
                        onPick={showColorImage}
                      />
                    ))}
                </div>

                <p className="mt-4 text-[11px] text-zinc-400 font-light leading-relaxed">
                  Swatches are an approximation of the factory paint, not a
                  colour match. Availability varies by market and build slot.
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Details */}
      <section className="mt-16 lg:mt-24 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-6 flex flex-col">
            {pricing.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                  <Globe size={18} className="text-[#4da8da]" /> Landed Pricing
                  Estimate
                  {selectedGrade && (
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {selectedGrade.name}
                    </span>
                  )}
                </h3>
                <div className="space-y-2.5">
                  {pricing.map((p, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3.5 bg-white rounded-xl border border-black/5 shadow-sm"
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                          {p.country}
                        </p>
                        <p className="text-xs font-bold text-zinc-500 uppercase">
                          {p.type}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-black tracking-tight">
                        <span className="text-sm font-medium mr-1 text-[#4da8da]">
                          {p.currency}
                        </span>
                        {p.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <p className="text-[10px] text-zinc-400 italic px-1 pt-1">
                    * Estimates include logistics and estimated duties. Final
                    quote provided upon inquiry.
                  </p>
                </div>
              </div>
            )}

            <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase mb-4">
              Technical Specifications
            </h3>
            <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.02)]">
              <dl className="divide-y divide-black/5">
                {visibleSpecs.map((spec, i) => (
                  <div
                    key={`${spec.label}-${i}`}
                    className="py-3 flex justify-between items-start gap-6 first:pt-0"
                  >
                    <dt className="text-zinc-500 text-sm font-medium shrink-0">
                      {spec.label}
                    </dt>
                    <dd className="text-black font-semibold text-right text-sm max-w-[62%] break-words">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <MoreButton
                expanded={specsOpen}
                hiddenCount={specRows.length - LIMITS.specs}
                noun="specification"
                onClick={() => setSpecsOpen((v) => !v)}
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col">
            {advantages.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-black flex items-center gap-2 mb-4">
                  <Zap size={18} className="text-amber-500 fill-amber-500/10" />{" "}
                  Providence Advantages
                </h3>
                <div className="space-y-3">
                  {visibleAdvantages.map((point, i) => (
                    <div
                      key={i}
                      className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100/70"
                    >
                      <h4 className="text-sm font-bold text-zinc-900 mb-1">
                        {point.title}
                      </h4>
                      <p className="text-xs text-zinc-600 leading-relaxed font-light">
                        {point.description}
                      </p>
                    </div>
                  ))}
                </div>
                <MoreButton
                  expanded={advantagesOpen}
                  hiddenCount={advantages.length - LIMITS.advantages}
                  noun="advantage"
                  onClick={() => setAdvantagesOpen((v) => !v)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Feature chips carry long sentences ("First-class rear compartment
            with two individual executive seats"), so in a half-width column
            they stack one per line. Given the full row they flow several to a
            line and the block collapses to a couple of rows. */}
        {features.length > 0 && (
          <div className="mt-10 lg:mt-12">
            <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase mb-4">
              Included Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {visibleFeatures.map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 bg-zinc-100/80 text-zinc-800 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-black/5"
                >
                  {feature}
                </span>
              ))}
            </div>
            <MoreButton
              expanded={featuresOpen}
              hiddenCount={features.length - LIMITS.features}
              noun="feature"
              onClick={() => setFeaturesOpen((v) => !v)}
            />
          </div>
        )}
      </section>

      {/* Inquiry Section */}
      <section
        ref={inquiryRef}
        className="mt-16 lg:mt-24 px-6 py-16 bg-zinc-50 border-y border-black/5"
      >
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase leading-[0.85] mb-4">
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
            <p className="text-zinc-500 text-base font-light leading-relaxed">
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
              gradeOptions={grades.map((g) => g.name)}
              selectedGrade={selectedGrade?.name ?? ""}
              steeringOptions={steeringOptions}
              selectedSteering={activeSteering}
            />
          </div>
        </div>
      </section>

      <FAQSection />
    </main>
  );
}

/**
 * What the selected grade adds over the one below it. This is the comparison
 * the reader opened four browser tabs to make, so it renders inline against
 * the selected grade rather than in a table the reader has to go and find.
 */
function GradeHighlights({ grade }: { grade: VehicleGrade }) {
  const [open, setOpen] = useState(false);
  const visible = open
    ? grade.highlights
    : grade.highlights.slice(0, LIMITS.gradeHighlights);

  return (
    <div className="mt-4 border-t border-black/5 pt-4">
      <p className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
        What the {grade.name} adds
      </p>
      <ul className="space-y-2">
        {visible.map((highlight) => (
          <li
            key={highlight}
            className="flex gap-2.5 text-sm text-zinc-600 font-light leading-snug"
          >
            <Check
              size={14}
              strokeWidth={3}
              className="mt-0.5 shrink-0 text-[#4da8da]"
              aria-hidden="true"
            />
            {highlight}
          </li>
        ))}
      </ul>
      <MoreButton
        expanded={open}
        hiddenCount={grade.highlights.length - LIMITS.gradeHighlights}
        noun="difference"
        onClick={() => setOpen((v) => !v)}
      />
    </div>
  );
}

/** One palette (exterior or interior), collapsing past a handful of swatches. */
function ColorGroup({
  label,
  colors,
  linkedImage,
  activeImage,
  onPick,
}: {
  label: string;
  colors: VehicleColor[];
  linkedImage: (color: VehicleColor) => number | undefined;
  activeImage: number;
  onPick?: (color: VehicleColor) => void;
}) {
  const [open, setOpen] = useState(false);
  const visible = open ? colors : colors.slice(0, LIMITS.colors);

  return (
    <div className="mb-4 last:mb-0">
      <p className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
        {label}
      </p>
      <ul className="flex flex-wrap gap-x-3 gap-y-3">
        {visible.map((color) => {
          const idx = linkedImage(color);
          const isLinked = idx !== undefined;
          const isShowing = isLinked && idx === activeImage;

          // Only the finish's own name goes under the swatch. Appending the
          // second tone ("Maybach Two-Tone / Obsidian black over velvet
          // brown") runs to four lines in a column this narrow, so the second
          // tone becomes a marker and the full label lives on hover.
          const fullLabel = colorLabel(color);

          const swatch = (
            <>
              <span
                className={`h-9 w-9 rounded-full border shadow-[0_3px_10px_rgba(0,0,0,0.08)] transition-transform ${isShowing ? "border-black ring-2 ring-black ring-offset-2" : "border-black/10"} ${isLinked ? "group-hover:scale-105" : ""}`}
                style={swatchStyle(color)}
                aria-hidden="true"
              />
              <span className="text-[11px] font-medium text-zinc-600 leading-tight line-clamp-2">
                {color.name}
              </span>
              {color.isDualTone && (
                <span className="-mt-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                  Two-tone
                </span>
              )}
            </>
          );

          return (
            <li key={`${fullLabel}-${color.hex}`} className="w-20">
              {isLinked && onPick ? (
                <button
                  type="button"
                  onClick={() => onPick(color)}
                  aria-pressed={isShowing}
                  title={`${fullLabel} — show this photograph`}
                  className="group flex w-full flex-col items-start gap-1.5 text-left cursor-pointer"
                >
                  {swatch}
                </button>
              ) : (
                <div
                  title={fullLabel}
                  className="flex w-full flex-col items-start gap-1.5"
                >
                  {swatch}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <MoreButton
        expanded={open}
        hiddenCount={colors.length - LIMITS.colors}
        noun={`${label.toLowerCase()} colour`}
        onClick={() => setOpen((v) => !v)}
      />
    </div>
  );
}
