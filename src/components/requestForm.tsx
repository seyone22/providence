"use client";

import { AnimatePresence, motion } from "framer-motion";
import { isValidPhoneNumber } from "libphonenumber-js";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Globe,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  Plus,
  User,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  submitCarRequest,
  submitContactPreferences,
} from "@/actions/request-actions";
import SuggestedGuides, {
  type SuggestedGuide,
} from "@/components/SuggestedGuides";
import {
  CONTACT_METHODS,
  computePreferredContactAt,
  DAY_OPTIONS,
  formatInTz,
  TIME_WINDOWS,
  TIMEZONE_OPTIONS,
  timezoneForCountry,
} from "@/lib/contactScheduling";
import { COUNTRIES } from "@/lib/countries";
import {
  budgetDigits,
  budgetDisplayValue,
  currencyForCountry,
  currencyOptions,
  getCurrency,
} from "@/lib/currencies";
import { formatVehicleTitle, steeringLabel } from "@/lib/vehicle";
import {
  colorLabel,
  contrastInk,
  swatchStyle,
  type VehicleColor,
} from "@/lib/vehicle-colors";

const CONTACT_METHOD_ICONS: Record<string, any> = {
  WhatsApp: MessageCircle,
  Call: Phone,
  "WhatsApp Call": PhoneCall,
  Email: Mail,
};

const TOTAL_STEPS = 3;

// --- USED-CAR SPEC RANGES ---
const MILEAGE_MIN = 0;
const MILEAGE_MAX = 150_000;
const MILEAGE_STEP = 2_500;

/** Format a mileage value for display; the top of the range reads as "150,000+". */
const formatMileage = (v: number) =>
  v >= MILEAGE_MAX ? `${MILEAGE_MAX.toLocaleString()}+` : v.toLocaleString();

/** Human-readable label stored on the request (e.g. "Up to 60,000 mi", "20,000–80,000 mi"). */
const mileageRangeLabel = (lo: number, hi: number) => {
  const hiTxt =
    hi >= MILEAGE_MAX
      ? `${MILEAGE_MAX.toLocaleString()}+`
      : hi.toLocaleString();
  return lo <= MILEAGE_MIN
    ? `Up to ${hiTxt} mi`
    : `${lo.toLocaleString()}–${hiTxt} mi`;
};

/**
 * Convert a specific odometer reading (e.g. a used dossier's mileage) into a
 * slider-friendly {mileageMin, mileageMax} pair. Snaps to the slider step and
 * brackets the value by one step so the known figure is clearly represented.
 * Exported so vehicle detail pages can prefill the form from a spec dossier.
 */
export const mileageToPrefillRange = (
  mileage: number,
): { mileageMin: number; mileageMax: number } => {
  const clamped = Math.max(MILEAGE_MIN, Math.min(MILEAGE_MAX, mileage));
  const snapped = Math.round(clamped / MILEAGE_STEP) * MILEAGE_STEP;
  const mileageMin = Math.max(MILEAGE_MIN, snapped - MILEAGE_STEP);
  const mileageMax = Math.min(
    MILEAGE_MAX,
    Math.max(snapped, mileageMin + MILEAGE_STEP),
  );
  return { mileageMin, mileageMax };
};

// Year presets grouped the way buyers actually think ("2020 or newer"), each
// mapping to a concrete numeric from/to so the request stores clean years.
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_PRESETS: { label: string; from: number; to: number }[] = [
  { label: "2024 & newer", from: 2024, to: CURRENT_YEAR },
  { label: "2020 – 2023", from: 2020, to: 2023 },
  { label: "2016 – 2019", from: 2016, to: 2019 },
  { label: "2015 & older", from: 1990, to: 2015 },
];

const CAR_MAKES = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "Buick",
  "BYD",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Dacia",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Fisker",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Koenigsegg",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Lucid",
  "Mahindra",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Nio",
  "Nissan",
  "Pagani",
  "Peugeot",
  "Polestar",
  "Porsche",
  "Ram",
  "Renault",
  "Rivian",
  "Rolls-Royce",
  "Seat",
  "Skoda",
  "Subaru",
  "Suzuki",
  "Tata",
  "Tesla",
  "Toyota",
  "VinFast",
  "Volkswagen",
  "Volvo",
  "Xpeng",
  "Zeekr",
].sort();

// Alpha-2 → dial code for defaultPhoneCountry prop
const ALPHA2_TO_DIAL: Record<string, string> = {
  US: "+1",
  GB: "+44",
  IE: "+353",
  AU: "+61",
  CA: "+1",
  NZ: "+64",
  DE: "+49",
  FR: "+33",
  ES: "+34",
  IT: "+39",
  NL: "+31",
  BE: "+32",
  SE: "+46",
  NO: "+47",
  DK: "+45",
  FI: "+358",
  JP: "+81",
  SG: "+65",
  AE: "+971",
  ZA: "+27",
  IN: "+91",
  NG: "+234",
  KE: "+254",
  GH: "+233",
  PK: "+92",
  LK: "+94",
  CN: "+86",
  BR: "+55",
  MX: "+52",
  AR: "+54",
};

// --- HELPER: Read Cookies for Meta Pixel Data ---
function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

// --- CUSTOM UI COMPONENTS ---

const SelectDropdown = ({
  id,
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  isLoading = false,
}: {
  id: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (id: string, val: string) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  isLoading?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on user input
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedLabel = options.find((o) => o.value === value)?.label;

  // Sync search term with selection when closed
  useEffect(() => {
    if (!isOpen) setSearchTerm("");
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`w-full bg-transparent border-b flex items-center justify-between px-0 py-3 text-lg transition-colors outline-none
                    ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}
                    ${error ? "border-red-500 text-red-500" : isOpen ? "border-sky-500 text-black" : "border-black/10 text-black hover:border-black/30"}
                `}
      >
        <input
          type="text"
          disabled={disabled || isLoading}
          className="font-sans bg-transparent w-full outline-none placeholder:text-zinc-400 text-black"
          placeholder={selectedLabel || value || placeholder}
          value={isOpen ? searchTerm : selectedLabel || value || ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />

        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 size={18} className="animate-spin text-zinc-400" />
          ) : (
            <ChevronDown
              size={18}
              onClick={() => !disabled && setIsOpen(!isOpen)}
              className={`transition-transform duration-300 cursor-pointer ${isOpen ? "rotate-180 text-sky-500" : "text-zinc-400"}`}
            />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-black/5 max-h-64 overflow-y-auto py-2"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-zinc-500 italic">
                No results found
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(id, opt.value);
                    setSearchTerm("");
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-sky-50 hover:text-sky-600 ${value === opt.value ? "bg-sky-500/10 text-sky-600 font-bold" : "text-zinc-700"}`}
                >
                  {opt.label}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <p className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 flex items-center gap-1">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  );
};

// Dual-thumb range slider. Two stacked native range inputs (styled in
// globals.css as .pa-range) let each end be dragged independently; the visible
// track + active fill are the divs behind them.
const DualRangeSlider = ({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (lo: number, hi: number) => void;
}) => {
  const minPct = ((valueMin - min) / (max - min)) * 100;
  const maxPct = ((valueMax - min) / (max - min)) * 100;
  // When both thumbs sit at the very top the min input would cover the max
  // thumb and trap it; lift the min input above only in that corner case.
  const minOnTop = valueMin > max - (max - min) * 0.04;

  return (
    <div className="relative h-6 flex items-center touch-none">
      <div className="absolute h-1.5 w-full rounded-full bg-black/10" />
      <div
        className="absolute h-1.5 rounded-full bg-[#4da8da]"
        style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
      />
      <input
        type="range"
        className="pa-range"
        style={{ zIndex: minOnTop ? 5 : 3 }}
        min={min}
        max={max}
        step={step}
        value={valueMin}
        aria-label="Minimum mileage"
        onChange={(e) =>
          onChange(Math.min(Number(e.target.value), valueMax - step), valueMax)
        }
      />
      <input
        type="range"
        className="pa-range"
        style={{ zIndex: 4 }}
        min={min}
        max={max}
        step={step}
        value={valueMax}
        aria-label="Maximum mileage"
        onChange={(e) =>
          onChange(valueMin, Math.max(Number(e.target.value), valueMin + step))
        }
      />
    </div>
  );
};

/**
 * Colour picker for one palette (exterior or interior).
 *
 * Two modes, chosen by whether the dossier actually offers colours:
 *  - with options: a grid of swatches, the way a factory configurator reads —
 *    the colour itself is the control, and the name of whichever swatch is
 *    hovered, focused or selected is echoed in the readout beside the label.
 *    Names are not printed under every swatch: a full palette of them turns
 *    into a wall of text that is slower to scan than the colours are;
 *  - without options (the generic /request page): a plain text field.
 *
 * There is also an "Other" escape hatch so a customer who wants a colour we
 * haven't listed isn't blocked from inquiring.
 *
 * Either way the value written to the lead is a human-readable string, which
 * is what a sales agent actually needs to act on.
 */
/**
 * A row of chips for a short, closed list of options — the grade ladder, the
 * steering hands. Deliberately the same shape as ColorChoiceField below
 * (optional, clearable by re-clicking the active chip, an "Other" escape
 * hatch) so the whole specification step behaves consistently.
 *
 * The value written to the lead is the label itself, which is what a sales
 * agent needs to read off the row.
 */
function ChipChoiceField({
  label,
  options,
  optionLabel,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  /** Display transform; the stored value is still the raw option. */
  optionLabel?: (option: string) => string;
  value: string;
  onChange: (value: string) => void;
}) {
  const render = optionLabel ?? ((option: string) => option);
  const isCustom = value.length > 0 && !options.includes(value);
  const [showCustom, setShowCustom] = useState(isCustom);
  const fieldId = `chip-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <p className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider mb-3">
        {label}
      </p>

      <div className="flex flex-wrap items-center gap-2.5">
        {options.map((option) => {
          const isSelected = value === option && !showCustom;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setShowCustom(false);
                // Clicking the active chip clears it — the field is optional.
                onChange(isSelected ? "" : option);
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
                isSelected
                  ? "bg-[#4da8da] text-white border-[#4da8da] shadow-md"
                  : "bg-transparent text-zinc-500 border-black/10 hover:border-[#4da8da]/40"
              }`}
            >
              {isSelected && <Check size={14} strokeWidth={3} />}
              {render(option)}
            </button>
          );
        })}

        <button
          type="button"
          aria-pressed={showCustom}
          onClick={() => {
            const next = !showCustom;
            setShowCustom(next);
            if (!next) onChange("");
            else if (!isCustom) onChange("");
          }}
          className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
            showCustom
              ? "bg-[#4da8da] text-white border-[#4da8da] shadow-md"
              : "bg-transparent text-zinc-500 border-black/10 hover:border-[#4da8da]/40"
          }`}
        >
          Other
        </button>
      </div>

      {showCustom && (
        <input
          id={fieldId}
          aria-label={`${label} — other`}
          value={isCustom ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Tell us which ${label.toLowerCase()} you want`}
          className="mt-4 w-full font-sans bg-transparent border-b border-black/10 focus:border-sky-500 text-black placeholder:text-zinc-400 focus:outline-none transition-colors rounded-none px-0 py-3 text-lg"
        />
      )}
    </div>
  );
}

function ColorChoiceField({
  label,
  options,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  options: VehicleColor[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  // "Other" is active when a value is set that isn't one of the swatches.
  const optionLabels = options.map(colorLabel);
  const isCustom = value.length > 0 && !optionLabels.includes(value);
  const [showCustom, setShowCustom] = useState(isCustom);
  // Whatever the pointer or keyboard focus is currently on. Naming the swatch
  // under the cursor is what replaces the per-swatch caption.
  const [previewLabel, setPreviewLabel] = useState<string | null>(null);
  // An id can't contain whitespace, so derive one from the label.
  const fieldId = `color-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  if (options.length === 0) {
    return (
      <div className="relative">
        <label
          htmlFor={fieldId}
          className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-2"
        >
          {label} (optional)
        </label>
        <input
          id={fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full font-sans bg-transparent border-b border-black/10 focus:border-sky-500 text-black placeholder:text-zinc-400 focus:outline-none transition-colors rounded-none px-0 py-3 text-lg"
        />
      </div>
    );
  }

  // The readout: what's under the cursor wins over what's committed, so
  // running along the row names every colour without spending a click.
  const selectedLabel = showCustom
    ? isCustom
      ? value
      : "Other colour"
    : value;
  const readout = previewLabel ?? selectedLabel;

  const clear = () => {
    setShowCustom(false);
    setPreviewLabel(null);
    onChange("");
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
        <p className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider">
          {label} (optional)
        </p>
        {/* Live region: a swatch has no visible caption, so the name has to be
            announced when selection moves by keyboard as well as by mouse. */}
        <p
          aria-live="polite"
          className={`text-sm font-medium leading-tight ${
            readout ? "text-black" : "text-zinc-400"
          }`}
        >
          {readout || "No preference"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {options.map((color) => {
          const optionLabel = colorLabel(color);
          const isSelected = value === optionLabel && !showCustom;
          return (
            <button
              key={`${optionLabel}-${color.hex}`}
              type="button"
              title={optionLabel}
              aria-label={optionLabel}
              aria-pressed={isSelected}
              onMouseEnter={() => setPreviewLabel(optionLabel)}
              onMouseLeave={() => setPreviewLabel(null)}
              onFocus={() => setPreviewLabel(optionLabel)}
              onBlur={() => setPreviewLabel(null)}
              onClick={() => {
                // Drop the hover preview on commit: a tap fires mouseenter but
                // often never mouseleave, which would otherwise leave the
                // readout naming a swatch the customer has since changed.
                setPreviewLabel(null);
                setShowCustom(false);
                // Clicking the active swatch clears it — the field is optional.
                onChange(isSelected ? "" : optionLabel);
              }}
              className={`relative h-11 w-11 shrink-0 rounded-full transition-all focus:outline-none ${
                isSelected
                  ? "ring-2 ring-sky-500 ring-offset-2 ring-offset-white"
                  : "ring-1 ring-black/15 hover:ring-black/40 hover:scale-[1.08] focus-visible:ring-2 focus-visible:ring-sky-400"
              }`}
              style={swatchStyle(color)}
            >
              {isSelected && (
                <Check
                  size={18}
                  strokeWidth={3}
                  className="absolute inset-0 m-auto"
                  // The tick sits on the paint itself, so its colour has to be
                  // picked from the paint rather than fixed.
                  style={{ color: contrastInk(color.hex) }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}

        <button
          type="button"
          title="A colour that isn't listed"
          aria-label="Other colour"
          aria-pressed={showCustom}
          onMouseEnter={() => setPreviewLabel("Other colour")}
          onMouseLeave={() => setPreviewLabel(null)}
          onFocus={() => setPreviewLabel("Other colour")}
          onBlur={() => setPreviewLabel(null)}
          onClick={() => {
            setPreviewLabel(null);
            setShowCustom(!showCustom);
            // Clear in BOTH directions. Entering "Other" must drop a
            // previously-picked swatch, or the empty text box and the
            // unhighlighted swatches would both suggest "nothing selected"
            // while the swatch's label is still what gets submitted.
            onChange("");
          }}
          className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-dashed px-4 text-sm font-medium transition-all ${
            showCustom
              ? "border-sky-500 bg-sky-50 text-sky-600"
              : "border-black/25 bg-white text-zinc-500 hover:border-black/50 hover:text-black"
          }`}
        >
          <Plus size={15} strokeWidth={2.5} aria-hidden="true" /> Other
        </button>

        {/* Deselecting by clicking the live swatch again isn't discoverable,
            so give the way out its own control — but only once there's
            something to undo. */}
        {(value.length > 0 || showCustom) && (
          <button
            type="button"
            onClick={clear}
            className="ml-1 text-xs font-medium text-zinc-400 underline underline-offset-4 hover:text-black transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {showCustom && (
        <input
          aria-label={`${label} — other`}
          value={isCustom ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-4 w-full font-sans bg-transparent border-b border-black/10 focus:border-sky-500 text-black placeholder:text-zinc-400 focus:outline-none transition-colors rounded-none px-0 py-3 text-lg"
        />
      )}
    </div>
  );
}

// --- MAIN FORM COMPONENT ---

const initialFormState = {
  make: "",
  vehicle_model: "",
  condition: "",
  yearRange: YEAR_PRESETS[0].label,
  mileageMin: MILEAGE_MIN,
  mileageMax: MILEAGE_MAX,
  // Grade/variant and steering hand, prefilled from the car page's own
  // selectors and stored as the display label, same as the colours below.
  grade: "",
  steering: "",
  specs: "",
  // Colour choices. Stored as the rendered label ("Sonic Grey / Black roof")
  // rather than an index into the dossier palette, so the lead stays readable
  // even after the dossier is edited.
  exteriorColor: "",
  interiorColor: "",
  name: "",
  email: "",
  phone: "",
  countryCode: "+1",
  countryOfImport: "",
  // Budget. The amount is kept as the raw digit string the customer typed so
  // the field can be formatted with separators while they type; it's parsed to
  // a number only when the lead is created. The currency defaults from the
  // destination country and is overridable.
  budgetAmount: "",
  budgetCurrency: "",
  importTimeline: "",
  // Set by the prefill when the inquiry comes off a coming-soon dossier.
  isUpcomingVehicle: false,
  // Contact preferences (step 3)
  contactMethods: [] as string[],
  contactDays: [] as string[],
  contactTimeWindow: [] as string[],
  contactTimezone: "",
  contactTimezoneLabel: "",
};

// Type for the returned agent
interface AgentData {
  name: string;
  email?: string;
  image?: string;
}

export default function RequestForm({
  prefill,
  defaultPhoneCountry = "US",
  assignedAgentId,
  exteriorColorOptions = [],
  interiorColorOptions = [],
  gradeOptions = [],
  selectedGrade,
  steeringOptions = [],
  selectedSteering,
}: {
  prefill?: Partial<typeof initialFormState>;
  defaultPhoneCountry?: string;
  // When set (sales-member profile pages), pins the inquiry directly to this
  // agent instead of the round-robin rotation.
  assignedAgentId?: string;
  // Palettes from the dossier this form is embedded under. Empty on the
  // generic /request page, where the colour fields fall back to free text.
  exteriorColorOptions?: VehicleColor[];
  interiorColorOptions?: VehicleColor[];
  // The dossier's grade ladder and the hands it can be sourced in. Empty on
  // the generic /request page, where neither field is shown at all.
  gradeOptions?: string[];
  steeringOptions?: string[];
  /**
   * The car page's current selections. These arrive as their own props rather
   * than through `prefill` on purpose: `prefill` replaces the entire form
   * state when its identity changes, so routing a selector through it would
   * wipe whatever the customer had already typed every time they compared a
   * grade.
   */
  selectedGrade?: string;
  selectedSteering?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingLead, setIsCreatingLead] = useState(false);

  // Success States
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string>("");
  const [assignedAgent, setAssignedAgent] = useState<
    AgentData | null | undefined
  >(null);
  // Guides for the destination country, returned by submitContactPreferences
  // and shown on the success screen so the lead has somewhere to go next.
  const [suggestedGuides, setSuggestedGuides] = useState<SuggestedGuide[]>([]);

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const [countryCodeUpdated, setCountryCodeUpdated] = useState(false);
  const [updatedCountryCodeLabel, setUpdatedCountryCodeLabel] = useState("");
  // Once the customer picks a currency themselves, changing the destination
  // stops overwriting it.
  const [budgetCurrencyTouched, setBudgetCurrencyTouched] = useState(false);

  const [formData, setFormData] = useState(() => ({
    ...initialFormState,
    countryCode: ALPHA2_TO_DIAL[defaultPhoneCountry] || "+1",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Identity keys for Server-to-Server tracking
  const [trackingData, setTrackingData] = useState({
    gclid: "",
    fbclid: "",
    fbc: "",
    fbp: "",
  });

  // Best-effort cleanup: if the customer abandons the contact-preferences step
  // (closes/refreshes the tab) without submitting, discard the draft lead so
  // it never lingers in the admin pipeline. A server-side TTL purge is the
  // safety net for cases where the beacon doesn't fire.
  const shouldDiscardRef = useRef(false);
  const discardIdRef = useRef("");

  useEffect(() => {
    shouldDiscardRef.current = step === 3 && !!submittedRequestId && !isSuccess;
    discardIdRef.current = submittedRequestId;
  }, [step, submittedRequestId, isSuccess]);

  useEffect(() => {
    const discardDraft = () => {
      if (!shouldDiscardRef.current || !discardIdRef.current) return;
      try {
        const blob = new Blob([JSON.stringify({ id: discardIdRef.current })], {
          type: "application/json",
        });
        navigator.sendBeacon("/api/v1/leads/discard", blob);
      } catch {
        /* best-effort only */
      }
    };
    window.addEventListener("pagehide", discardDraft);
    return () => window.removeEventListener("pagehide", discardDraft);
  }, []);

  // Capture URL params and Cookies on mount
  useEffect(() => {
    setTrackingData({
      gclid: searchParams?.get("gclid") || "",
      fbclid: searchParams?.get("fbclid") || "",
      fbc: getCookie("_fbc") || "",
      fbp: getCookie("_fbp") || "",
    });
  }, [searchParams]);

  // Sync form data whenever prefill changes.
  // The parent memoises the prefill object, so this only fires:
  //   1. On initial mount (to apply countryOfImport / model-card data), and
  //   2. When the user clicks a different model card.
  // Case 2 also changes the `key` prop, which unmounts + remounts the form
  // at step 1 automatically — so we never need to call setStep(1) here.
  useEffect(() => {
    if (!prefill) return;

    let syncedCountryCode = ALPHA2_TO_DIAL[defaultPhoneCountry] || "+1";
    if (prefill.countryOfImport) {
      const match = COUNTRIES.find((c) => c.n === prefill.countryOfImport);
      if (match) syncedCountryCode = match.c;
    }
    if (prefill.countryCode) syncedCountryCode = prefill.countryCode;

    // A prefilled destination (the DestinationPicker, a country landing page)
    // brings its currency with it, so the budget field lands pre-denominated.
    const syncedCurrency =
      prefill.budgetCurrency ||
      currencyForCountry(prefill.countryOfImport) ||
      "";

    setFormData((prev) => ({
      ...prev,
      ...prefill,
      countryCode: syncedCountryCode,
      budgetCurrency: syncedCurrency || prev.budgetCurrency,
      // Honour an explicit condition from the prefill (e.g. a spec dossier
      // marked Brand New / Used); otherwise fall back to the legacy default
      // of assuming a make-prefilled inquiry is for a used vehicle.
      condition: prefill.condition ?? (prefill.make ? "Used" : prev.condition),
    }));
  }, [prefill, defaultPhoneCountry]);

  // The car page's grade and steering pills write straight into their own two
  // fields. Kept out of the prefill effect above on purpose: that one replaces
  // the whole form state, so comparing grades mid-inquiry would otherwise
  // discard everything the customer had already typed.
  useEffect(() => {
    if (selectedGrade === undefined) return;
    setFormData((prev) =>
      prev.grade === selectedGrade ? prev : { ...prev, grade: selectedGrade },
    );
  }, [selectedGrade]);

  useEffect(() => {
    if (selectedSteering === undefined) return;
    setFormData((prev) =>
      prev.steering === selectedSteering
        ? prev
        : { ...prev, steering: selectedSteering },
    );
  }, [selectedSteering]);

  useEffect(() => {
    if (!formData.make) {
      setAvailableModels([]);
      setApiFailed(false); // Reset on empty
      return;
    }
    const fetchModels = async () => {
      setIsLoadingModels(true);
      setApiFailed(false); // Reset before new attempt

      try {
        const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(formData.make)}?format=json`;
        const res = await fetch(
          `https://corsproxy.io/?${encodeURIComponent(url)}`,
        );

        if (res.status === 503) {
          throw new Error(
            "NHTSA Server is currently unavailable (503). Please try again later.",
          );
        }

        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();

        if (data.Results) {
          const models = data.Results.map((item: any) =>
            item.Model_Name.trim()
              .toLowerCase()
              .replace(/\b\w/g, (c: string) => c.toUpperCase()),
          );
          setAvailableModels([...new Set(models)].sort() as string[]);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setApiFailed(true); // <-- Trigger the manual input fallback
      } finally {
        setIsLoadingModels(false);
      }
    };

    const delayDebounceFn = setTimeout(fetchModels, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.make]);

  // If a prefilled model doesn't exist in API results, fall back to manual entry
  useEffect(() => {
    if (
      !isLoadingModels &&
      availableModels.length > 0 &&
      formData.vehicle_model &&
      !availableModels.includes(formData.vehicle_model)
    ) {
      setApiFailed(true);
    }
  }, [availableModels, isLoadingModels, formData.vehicle_model]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // Budget is digits only, held as a plain string so the field can show
  // thousands separators while it's being typed without fighting the caret.
  const handleBudgetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = budgetDigits(e.target.value);
    setFormData((prev) => ({ ...prev, budgetAmount: digits }));
    if (errors.budgetAmount)
      setErrors((prev) => ({ ...prev, budgetAmount: "" }));
  };

  const handleDropdownChange = (id: string, value: string) => {
    if (id === "countryOfImport") {
      const match = COUNTRIES.find((c) => c.n === value);
      const newCode = match ? match.c : formData.countryCode;
      // The destination sets the budget currency too — but only until the
      // customer picks one themselves. Plenty of people import to one country
      // and hold their money in another, and re-deciding that for them every
      // time they revisit the destination field would be wrong.
      const destinationCurrency = currencyForCountry(value);
      setFormData((prev) => ({
        ...prev,
        countryOfImport: value,
        countryCode: newCode,
        budgetCurrency:
          budgetCurrencyTouched || !destinationCurrency
            ? prev.budgetCurrency
            : destinationCurrency,
      }));
      if (match && match.c !== formData.countryCode) {
        setUpdatedCountryCodeLabel(`${match.c} (${match.n})`);
        setCountryCodeUpdated(true);
        setTimeout(() => setCountryCodeUpdated(false), 4500);
      }
    } else if (id === "budgetCurrency") {
      setBudgetCurrencyTouched(true);
      setFormData((prev) => ({ ...prev, budgetCurrency: value }));
    } else if (id === "make" && formData.make !== value) {
      setFormData((prev) => ({ ...prev, make: value, vehicle_model: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.make) newErrors.make = "Please select a make";
      if (!formData.vehicle_model)
        newErrors.vehicle_model = "Please select a model";
      if (!formData.condition)
        newErrors.condition = "Please choose Brand New or Pre-Owned";
    }

    if (step === 2) {
      if (!formData.name.trim()) newErrors.name = "Full name is required";
      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email))
        newErrors.email = "Valid email is required";
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else {
        const dialDigits = formData.countryCode.replace(/[^\d]/g, "");
        const localDigits = formData.phone
          .replace(/\D/g, "")
          .replace(/^0+/, "");
        const fullE164 = `+${dialDigits}${localDigits}`;
        try {
          if (!isValidPhoneNumber(fullE164))
            newErrors.phone = "Invalid phone number for the selected country";
        } catch {
          newErrors.phone = "Invalid phone number for the selected country";
        }
      }
      if (!formData.countryOfImport)
        newErrors.countryOfImport = "Destination country is required";
      if (!formData.budgetAmount || Number(formData.budgetAmount) <= 0)
        newErrors.budgetAmount = "Please enter your budget";
      if (!formData.budgetCurrency)
        newErrors.budgetCurrency = "Select a currency";
      if (!formData.importTimeline)
        newErrors.importTimeline =
          "Please select when you're planning to import";
    }

    if (step === 3) {
      if (!formData.contactMethods || formData.contactMethods.length === 0)
        newErrors.contactMethods = "Please choose how we should contact you";
      if (!formData.contactDays || formData.contactDays.length === 0)
        newErrors.contactDays = "Pick at least one day that suits you";
      if (
        !formData.contactTimeWindow ||
        formData.contactTimeWindow.length === 0
      )
        newErrors.contactTimeWindow =
          "Pick at least one time that works for you";
      if (!formData.contactTimezone)
        newErrors.contactTimezone = "Select your timezone";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create the lead + assign an agent when leaving the Delivery step, so the
  // contact-preferences step can show who's handling the inquiry. No email is
  // sent yet — that happens after the customer submits their preferences.
  const createLead = async (): Promise<boolean> => {
    let yearFrom: number | undefined, yearTo: number | undefined;
    if (formData.condition === "Used" && formData.yearRange) {
      const preset = YEAR_PRESETS.find((p) => p.label === formData.yearRange);
      if (preset) {
        yearFrom = preset.from;
        yearTo = preset.to;
      }
    }

    const payload = {
      // If a lead was already created (user went Back then forward again),
      // update it in place instead of creating a duplicate.
      id: submittedRequestId || undefined,
      make: formData.make,
      vehicle_model: formData.vehicle_model,
      condition: formData.condition,
      yearFrom,
      yearTo,
      mileage:
        formData.condition === "Used"
          ? mileageRangeLabel(formData.mileageMin, formData.mileageMax)
          : undefined,
      specs: formData.specs,
      grade: formData.grade.trim() || undefined,
      steering: formData.steering.trim() || undefined,
      exteriorColor: formData.exteriorColor.trim() || undefined,
      interiorColor: formData.interiorColor.trim() || undefined,
      isUpcomingVehicle: formData.isUpcomingVehicle === true,
      name: formData.name,
      email: formData.email,
      countryCode: formData.countryCode,
      phone: formData.phone,
      countryOfImport: formData.countryOfImport,
      budgetAmount: formData.budgetAmount
        ? Number(formData.budgetAmount)
        : undefined,
      budgetCurrency: formData.budgetCurrency || undefined,
      importTimeline: formData.importTimeline || undefined,
      // Prefer ?ref= (set when the header button navigates here from another page)
      // so the lead is attributed to the originating page, not the form page itself.
      source: searchParams?.get("ref") || pathname,
      // Pin the lead directly to the profile owner when embedded on /team/[slug].
      assignedAgentId: assignedAgentId || undefined,
      ...trackingData,
    };

    const response = await submitCarRequest(payload);
    if (response.success) {
      // Only capture the agent + id on first creation; on update the
      // assignment is unchanged and the agent's full details (image/email)
      // already live in state.
      if (!submittedRequestId && response.requestId) {
        setAssignedAgent(response.agent);
        setSubmittedRequestId(response.requestId);
      }
      return true;
    }
    setErrors({ submit: response.message });
    return false;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    // Leaving Delivery (step 2) → record the lead, then default the timezone
    // from the chosen import country before showing the preferences step.
    if (step === 2) {
      setIsCreatingLead(true);
      try {
        const created = await createLead();
        if (!created) return;
        if (!formData.contactTimezone) {
          const tz = timezoneForCountry(formData.countryOfImport);
          setFormData((prev) => ({
            ...prev,
            contactTimezone: tz.tz,
            contactTimezoneLabel: tz.label,
          }));
        }
      } catch {
        setErrors({ submit: "Something went wrong. Please try again." });
        return;
      } finally {
        setIsCreatingLead(false);
      }
    }

    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleContactDay = (day: string) => {
    setFormData((prev) => {
      const exists = prev.contactDays.includes(day);
      return {
        ...prev,
        contactDays: exists
          ? prev.contactDays.filter((d) => d !== day)
          : [...prev.contactDays, day],
      };
    });
    if (errors.contactDays) setErrors((prev) => ({ ...prev, contactDays: "" }));
  };

  const toggleContactMethod = (method: string) => {
    setFormData((prev) => {
      const exists = prev.contactMethods.includes(method);
      return {
        ...prev,
        contactMethods: exists
          ? prev.contactMethods.filter((m) => m !== method)
          : [...prev.contactMethods, method],
      };
    });
    if (errors.contactMethods)
      setErrors((prev) => ({ ...prev, contactMethods: "" }));
  };

  const toggleContactTimeWindow = (label: string) => {
    setFormData((prev) => {
      const exists = prev.contactTimeWindow.includes(label);
      return {
        ...prev,
        contactTimeWindow: exists
          ? prev.contactTimeWindow.filter((w) => w !== label)
          : [...prev.contactTimeWindow, label],
      };
    });
    if (errors.contactTimeWindow)
      setErrors((prev) => ({ ...prev, contactTimeWindow: "" }));
  };

  // Earliest selected window label (for the reminder-time preview).
  const earliestTimeWindow = () =>
    TIME_WINDOWS.filter((w) =>
      formData.contactTimeWindow.includes(w.label),
    ).sort((a, b) => a.startHour - b.startHour)[0]?.label;

  // Final step: save contact preferences, set the reminder, send the emails.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      const response = await submitContactPreferences({
        requestId: submittedRequestId,
        contactMethods: formData.contactMethods,
        contactDays: formData.contactDays,
        contactTimeWindow: formData.contactTimeWindow.join(", "),
        contactTimezone: formData.contactTimezone,
        contactTimezoneLabel: formData.contactTimezoneLabel,
      });

      if (response.success) {
        setSuggestedGuides(response.suggestedGuides || []);
        setIsSuccess(true);
      } else {
        setErrors({ submit: response.message });
      }
    } catch (_error) {
      setErrors({ submit: "Submission failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (
    id: string,
  ) => `w-full font-sans bg-transparent border-b text-black placeholder:text-zinc-400 focus:outline-none transition-colors rounded-none px-0 py-3 text-lg
        ${errors[id] ? "border-red-500 focus:border-red-600" : "border-black/10 focus:border-sky-500"}`;

  // --- Budget field derivations ---
  // Separators as you type, so a six-figure budget is readable rather than a
  // run of digits. The raw digits stay in state; only the display is grouped.
  const budgetDisplay = budgetDisplayValue(formData.budgetAmount);
  // The currency's symbol, shown inside the field. Currencies without a
  // distinct symbol (most of them) rely on the picker beside it instead.
  const budgetSymbol = getCurrency(formData.budgetCurrency)?.symbol ?? "";
  // 160-odd entries, re-sorted per destination — not per keystroke, which is
  // how often this form re-renders.
  const budgetCurrencyChoices = useMemo(
    () => currencyOptions(currencyForCountry(formData.countryOfImport)),
    [formData.countryOfImport],
  );
  // Named in the budget warning so it reads as being about the car they picked
  // rather than a generic disclaimer.
  const budgetVehicleLabel =
    formatVehicleTitle(formData.make, formData.vehicle_model) ||
    "model you selected";

  return (
    <motion.div
      id="inquiry-form"
      className="w-full max-w-3xl font-sans bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-visible relative text-black mx-auto"
    >
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#4da8da]/10 absolute top-0 left-0 overflow-hidden rounded-t-[2.5rem]">
        <motion.div
          className="h-full bg-[#4da8da]"
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {isSuccess ? (
        // === NEW SUCCESS VIEW MATCHING SCREENSHOT ===
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 md:p-16 text-center flex flex-col items-center justify-center min-h-[500px]"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#4da8da] mb-10 tracking-tight">
            You're all set, {formData.name.split(" ")[0]}!
          </h2>

          <div className="w-32 h-32 rounded-full border-4 border-[#e6f3fa] overflow-hidden mb-6 shadow-sm bg-[#f2f8fc] flex items-center justify-center">
            {assignedAgent?.image ? (
              <img
                src={assignedAgent.image}
                alt={assignedAgent.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-14 w-14 text-[#4da8da]" />
            )}
          </div>

          <p className="text-zinc-800 text-base md:text-lg leading-relaxed max-w-xl mb-6">
            Hi {formData.name.split(" ")[0]}, I'm {assignedAgent?.name} and I'll
            be handling your inquiry personally from here.
            <br />
            I'll reach out via{" "}
            <strong>{formData.contactMethods.join(" & ")}</strong>
            {formData.contactTimeWindow.length ? (
              <>
                {" "}
                during the{" "}
                <strong>{formData.contactTimeWindow.join(", ")}</strong>
              </>
            ) : null}
            {formData.contactDays?.length ? (
              <>
                {" "}
                on <strong>{formData.contactDays.join(", ")}</strong>
              </>
            ) : null}{" "}
            to talk through pricing, availability and shipping.
          </p>

          {/* Contact plan summary card */}
          <div className="w-full max-w-md bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-5 mb-8 text-left space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-700">
              {(() => {
                const Icon =
                  CONTACT_METHOD_ICONS[formData.contactMethods[0]] ||
                  MessageCircle;
                return <Icon size={16} className="text-[#0369a1]" />;
              })()}
              <span className="font-semibold">
                {formData.contactMethods.join(" & ") || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-700">
              <Clock size={16} className="text-[#0369a1]" />
              <span>
                {formData.contactTimeWindow.join(", ")} ·{" "}
                {formData.contactDays?.join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-700">
              <Globe size={16} className="text-[#0369a1]" />
              <span>
                {formData.contactTimezoneLabel || formData.contactTimezone}
              </span>
            </div>
          </div>

          <p className="text-zinc-500 text-sm max-w-xl mb-8">
            I've emailed you a summary and a live tracking link from{" "}
            <a
              href={`mailto:${assignedAgent?.email}`}
              className="text-zinc-700 underline decoration-1 underline-offset-4 font-medium"
            >
              {assignedAgent?.email}
            </a>{" "}
            — if you don't see it, check your spam folder.
          </p>

          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <a
              href={`/track/${submittedRequestId}`}
              className="w-full bg-[#4da8da] hover:bg-[#3d92c2] text-white py-4 px-6 rounded-2xl font-bold text-lg transition-colors text-center shadow-md shadow-[#4da8da]/20"
            >
              Track My Inquiry
            </a>
            <button
              onClick={() => {
                setIsSuccess(false);
                setStep(1);
                setFormData(initialFormState);
                setSubmittedRequestId("");
                setAssignedAgent(null);
                setSuggestedGuides([]);
                setErrors({});
              }}
              className="text-[#4da8da] font-bold hover:text-[#3d92c2] transition-colors underline decoration-2 underline-offset-4 text-base"
            >
              New Inquiry
            </button>
          </div>

          <SuggestedGuides
            guides={suggestedGuides}
            destinationCountry={formData.countryOfImport}
          />
        </motion.div>
      ) : (
        <div className="p-5 sm:p-8 md:p-14 min-h-[520px] flex flex-col">
          <div className="flex justify-between items-end border-b border-black/5 pb-4 mb-6 sm:pb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold">
              {step === 1 && "1. Vehicle & Specs"}
              {step === 2 && "2. Delivery Details"}
              {step === 3 && "3. How should we reach you?"}
            </h3>
            <span className="text-[#4da8da] text-xs font-bold uppercase tracking-widest">
              Step {step}/{TOTAL_STEPS}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1"
            >
              {step === 1 && (
                <>
                  <div className="flex flex-col gap-10 sm:gap-14">
                    <SelectDropdown
                      id="make"
                      placeholder="Select Make"
                      options={CAR_MAKES.map((m) => ({ label: m, value: m }))}
                      value={formData.make}
                      onChange={handleDropdownChange}
                      error={errors.make}
                    />

                    {/* CONDITIONAL RENDER BASED ON API STATUS */}
                    {apiFailed ? (
                      <div className="space-y-2">
                        <input
                          id="vehicle_model"
                          value={formData.vehicle_model}
                          onChange={handleInputChange}
                          placeholder="Type Vehicle Model (e.g. Aqua, Prius, 911)"
                          className={inputClasses("vehicle_model")}
                        />
                        <div className="flex items-center justify-between">
                          {errors.vehicle_model ? (
                            <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                              <AlertCircle size={10} /> {errors.vehicle_model}
                            </p>
                          ) : (
                            <span />
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setApiFailed(false);
                              setFormData((prev) => ({
                                ...prev,
                                vehicle_model: "",
                              }));
                            }}
                            className="text-[10px] text-zinc-400 hover:text-sky-500 transition-colors"
                          >
                            Use dropdown instead
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <SelectDropdown
                          id="vehicle_model"
                          placeholder="Select Model"
                          options={availableModels.map((m) => ({
                            label: m,
                            value: m,
                          }))}
                          value={formData.vehicle_model}
                          onChange={handleDropdownChange}
                          disabled={!formData.make}
                          isLoading={isLoadingModels}
                          error={errors.vehicle_model}
                        />
                        {formData.make && !isLoadingModels && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setApiFailed(true)}
                              className="text-[10px] text-zinc-400 hover:text-sky-500 transition-colors"
                            >
                              Type manually
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Condition */}
                  <div className="mt-12">
                    <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-3">
                      Condition
                    </label>
                    <div className="flex gap-4">
                      {["New", "Used"].map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          aria-pressed={formData.condition === cond}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              condition: cond,
                            }));
                            if (errors.condition)
                              setErrors((prev) => ({ ...prev, condition: "" }));
                          }}
                          className={`flex-1 py-4 rounded-2xl font-bold border transition-all ${formData.condition === cond ? "bg-[#4da8da] text-white border-[#4da8da] shadow-md" : `bg-transparent text-zinc-400 hover:border-[#4da8da]/30 ${errors.condition ? "border-red-300" : "border-black/10"}`}`}
                        >
                          {cond === "New" ? "Brand New" : "Pre-Owned"}
                        </button>
                      ))}
                    </div>

                    {errors.condition && (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-3">
                        <AlertCircle size={10} /> {errors.condition}
                      </p>
                    )}

                    <AnimatePresence>
                      {formData.condition === "Used" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-8 space-y-8"
                        >
                          {/* Model year — quick presets */}
                          <div>
                            <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-3">
                              Model Year
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {YEAR_PRESETS.map((p) => {
                                const active = formData.yearRange === p.label;
                                return (
                                  <button
                                    key={p.label}
                                    type="button"
                                    onClick={() =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        yearRange: p.label,
                                      }))
                                    }
                                    className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${active ? "bg-[#4da8da] text-white border-[#4da8da] shadow-md" : "bg-transparent text-zinc-500 border-black/10 hover:border-[#4da8da]/40"}`}
                                  >
                                    {p.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Mileage — draggable min/max range */}
                          <div>
                            <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-5">
                              Mileage Range
                            </label>
                            <div className="px-2.5">
                              <DualRangeSlider
                                min={MILEAGE_MIN}
                                max={MILEAGE_MAX}
                                step={MILEAGE_STEP}
                                valueMin={formData.mileageMin}
                                valueMax={formData.mileageMax}
                                onChange={(lo, hi) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    mileageMin: lo,
                                    mileageMax: hi,
                                  }))
                                }
                              />
                            </div>
                            <div className="flex justify-between mt-4 text-sm">
                              <span className="text-zinc-500">
                                Minimum{" "}
                                <strong className="text-black font-bold">
                                  {formatMileage(formData.mileageMin)} mi
                                </strong>
                              </span>
                              <span className="text-zinc-500">
                                Maximum{" "}
                                <strong className="text-black font-bold">
                                  {formatMileage(formData.mileageMax)} mi
                                </strong>
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {formData.condition === "New" && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-zinc-500 italic text-center py-4 text-sm"
                      >
                        New vehicles will be sourced with 2025/2026 factory
                        specifications.
                      </motion.p>
                    )}
                  </div>

                  {/* Grade and steering. Both are autofilled from the car
                      page's selectors, and both stay editable here — a
                      customer who came in on one grade and changed their mind
                      shouldn't have to scroll back up to say so. */}
                  {(gradeOptions.length > 0 || steeringOptions.length > 0) && (
                    <div className="mt-10 space-y-8">
                      {gradeOptions.length > 0 && (
                        <ChipChoiceField
                          label="Grade"
                          options={gradeOptions}
                          value={formData.grade}
                          onChange={(v) =>
                            setFormData((prev) => ({ ...prev, grade: v }))
                          }
                        />
                      )}
                      {steeringOptions.length > 0 && (
                        <ChipChoiceField
                          label="Steering"
                          options={steeringOptions}
                          optionLabel={steeringLabel}
                          value={formData.steering}
                          onChange={(v) =>
                            setFormData((prev) => ({ ...prev, steering: v }))
                          }
                        />
                      )}
                    </div>
                  )}

                  {/* Colours */}
                  <div className="mt-10 space-y-8">
                    <ColorChoiceField
                      label="Exterior colour"
                      options={exteriorColorOptions}
                      value={formData.exteriorColor}
                      onChange={(v) =>
                        setFormData((prev) => ({ ...prev, exteriorColor: v }))
                      }
                      placeholder="e.g. Sonic Grey Pearl, or Black with a white roof"
                    />
                    <ColorChoiceField
                      label="Interior colour"
                      options={interiorColorOptions}
                      value={formData.interiorColor}
                      onChange={(v) =>
                        setFormData((prev) => ({ ...prev, interiorColor: v }))
                      }
                      placeholder="e.g. Black leather with tan inserts"
                    />
                  </div>

                  {/* Specs */}
                  <div className="relative mt-10">
                    <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-2">
                      Specification requests (optional)
                    </label>
                    <textarea
                      id="specs"
                      value={formData.specs}
                      onChange={handleInputChange}
                      placeholder="e.g. Carbon Fiber Pack, Magma Red Interior, Night Package..."
                      className={`${inputClasses("specs")} min-h-[100px] resize-none`}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <input
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className={inputClasses("name")}
                      />
                      {errors.name && (
                        <p className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className={inputClasses("email")}
                      />
                      {errors.email && (
                        <p className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Country of Import — before phone so selection auto-fills the country code */}
                  <div className="relative">
                    <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-1">
                      Where are you importing to?
                    </label>
                    <SelectDropdown
                      id="countryOfImport"
                      placeholder="Destination Country..."
                      options={COUNTRIES.map((c) => ({
                        label: c.n,
                        value: c.n,
                      }))}
                      value={formData.countryOfImport}
                      onChange={handleDropdownChange}
                      error={errors.countryOfImport}
                    />
                  </div>

                  {/* Budget — amount and currency, the currency defaulted from
                      the destination chosen above. Required: a lead without a
                      figure can't be matched to stock. */}
                  <div className="space-y-1">
                    <label
                      htmlFor="budgetAmount"
                      className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block"
                    >
                      What's your budget?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-[1fr_130px] sm:grid-cols-[1fr_230px] gap-3 items-start">
                      <div className="flex items-center gap-2 border-b border-black/10 focus-within:border-sky-500 transition-colors">
                        {budgetSymbol && (
                          <span className="text-lg text-zinc-400 shrink-0">
                            {budgetSymbol}
                          </span>
                        )}
                        <input
                          id="budgetAmount"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          value={budgetDisplay}
                          onChange={handleBudgetAmountChange}
                          placeholder="e.g. 45,000"
                          aria-describedby="budget-note"
                          className="w-full font-sans bg-transparent border-0 text-black placeholder:text-zinc-400 focus:outline-none rounded-none px-0 py-3 text-lg"
                        />
                      </div>
                      <SelectDropdown
                        id="budgetCurrency"
                        placeholder="Currency..."
                        options={budgetCurrencyChoices}
                        value={formData.budgetCurrency}
                        onChange={handleDropdownChange}
                      />
                    </div>
                    {errors.budgetAmount || errors.budgetCurrency ? (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 pt-0.5">
                        <AlertCircle size={10} />{" "}
                        {errors.budgetAmount || errors.budgetCurrency}
                      </p>
                    ) : null}
                    <p
                      id="budget-note"
                      className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2 flex items-start gap-2"
                    >
                      <AlertCircle
                        size={12}
                        className="shrink-0 mt-0.5 text-amber-600"
                      />
                      <span>
                        Give us the most you're ready to spend on the car. If it
                        sits well below the market range for the{" "}
                        <strong>{budgetVehicleLabel}</strong>, your inquiry may
                        be disqualified — it can't be sourced under the range.
                      </span>
                    </p>
                  </div>

                  {/* Sync notification */}
                  <AnimatePresence>
                    {countryCodeUpdated && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs text-sky-500 font-medium -mt-4 pl-1"
                      >
                        Country code updated to {updatedCountryCodeLabel} based
                        on your import destination.
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Phone: country code selector | local number — two separate columns */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block">
                      WhatsApp / Phone Number
                    </label>
                    <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[150px_1fr] gap-3 items-start">
                      <SelectDropdown
                        id="countryCode"
                        placeholder="+1"
                        options={COUNTRIES.map((c) => ({
                          label: `${c.c}  ${c.n}`,
                          value: c.c,
                        }))}
                        value={formData.countryCode}
                        onChange={handleDropdownChange}
                      />
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Local number (e.g. 085 123 4567)"
                        className={inputClasses("phone")}
                      />
                    </div>
                    {/* Error / hint always in normal flow — no overlay */}
                    {errors.phone ? (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 pt-0.5">
                        <AlertCircle size={10} /> {errors.phone}
                      </p>
                    ) : (
                      <p className="text-[10px] text-zinc-400 pt-0.5">
                        Enter local number only — country code is selected above
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-3">
                      When are you planning to import?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Immediately",
                        "1–3 months",
                        "3–6 months",
                        "Not sure",
                        "Just Inquiring",
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              importTimeline: option,
                            }));
                            if (errors.importTimeline)
                              setErrors((prev) => ({
                                ...prev,
                                importTimeline: "",
                              }));
                          }}
                          className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-all ${
                            formData.importTimeline === option
                              ? "bg-[#4da8da] text-white border-[#4da8da] shadow-md"
                              : "bg-transparent text-zinc-500 border-black/10 hover:border-[#4da8da]/30"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {errors.importTimeline && (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 pt-2">
                        <AlertCircle size={10} /> {errors.importTimeline}
                      </p>
                    )}
                  </div>

                  {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
                      {errors.submit}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  {/* Assigned agent header */}
                  <div className="flex items-center gap-4 bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4">
                    <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden bg-[#e6f3fa] shrink-0 flex items-center justify-center shadow-sm">
                      {assignedAgent?.image ? (
                        <img
                          src={assignedAgent.image}
                          alt={assignedAgent.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-7 w-7 text-[#4da8da]" />
                      )}
                    </div>
                    <div className="text-sm">
                      <p className="text-zinc-800">
                        Hi {formData.name.split(" ")[0] || "there"}, I'm{" "}
                        <strong>
                          {assignedAgent?.name || "your specialist"}
                        </strong>
                        . I'll be in touch to discuss pricing, availability and
                        shipping.
                      </p>
                      <p className="text-zinc-500 text-xs mt-1">
                        Just let me know how and when works best for you.
                      </p>
                    </div>
                  </div>

                  {/* Contact method (multi-select) */}
                  <div>
                    <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-1">
                      How should we contact you?
                    </label>
                    <p className="text-[11px] text-zinc-400 mb-3">
                      Pick all that work — e.g. WhatsApp and WhatsApp Call.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CONTACT_METHODS.map((method) => {
                        const Icon = CONTACT_METHOD_ICONS[method];
                        const active = formData.contactMethods.includes(method);
                        return (
                          <button
                            key={method}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleContactMethod(method)}
                            className={`relative flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border text-xs font-semibold transition-all ${active ? "bg-[#4da8da] text-white border-[#4da8da] shadow-md" : "bg-transparent text-zinc-500 border-black/10 hover:border-[#4da8da]/40"}`}
                          >
                            {active && (
                              <CheckCircle2
                                size={14}
                                className="absolute top-1.5 right-1.5 text-white"
                              />
                            )}
                            <Icon size={18} />
                            {method}
                          </button>
                        );
                      })}
                    </div>
                    {errors.contactMethods && (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-2">
                        <AlertCircle size={10} /> {errors.contactMethods}
                      </p>
                    )}
                  </div>

                  {/* Preferred day(s) */}
                  <div>
                    <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                      <CalendarDays size={12} /> Which day(s) suit you?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DAY_OPTIONS.map((day) => {
                        const active = formData.contactDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleContactDay(day)}
                            className={`px-3 py-2 rounded-full text-xs font-medium border transition-all ${active ? "bg-[#4da8da] text-white border-[#4da8da] shadow-md" : "bg-transparent text-zinc-500 border-black/10 hover:border-[#4da8da]/40"}`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                    {errors.contactDays && (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-2">
                        <AlertCircle size={10} /> {errors.contactDays}
                      </p>
                    )}
                  </div>

                  {/* Time window */}
                  <div>
                    <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <Clock size={12} /> Best time of day
                    </label>
                    <p className="text-[11px] text-zinc-400 mb-3">
                      Pick every time that works — select all that apply.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {TIME_WINDOWS.map((w) => {
                        const active = formData.contactTimeWindow.includes(
                          w.label,
                        );
                        return (
                          <button
                            key={w.label}
                            type="button"
                            onClick={() => toggleContactTimeWindow(w.label)}
                            className={`py-3 rounded-2xl border text-sm font-semibold transition-all ${active ? "bg-[#4da8da] text-white border-[#4da8da] shadow-md" : "bg-transparent text-zinc-500 border-black/10 hover:border-[#4da8da]/40"}`}
                          >
                            {w.label}
                          </button>
                        );
                      })}
                    </div>
                    {errors.contactTimeWindow && (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-2">
                        <AlertCircle size={10} /> {errors.contactTimeWindow}
                      </p>
                    )}
                  </div>

                  {/* Timezone */}
                  <div className="relative">
                    <label className="text-[10px] font-bold text-[#4da8da] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                      <Globe size={12} /> Your timezone
                    </label>
                    <SelectDropdown
                      id="contactTimezone"
                      placeholder="Select your timezone..."
                      options={TIMEZONE_OPTIONS.map((t) => ({
                        label: t.label,
                        value: t.tz,
                      }))}
                      value={formData.contactTimezone}
                      onChange={(_id, val) => {
                        const opt = TIMEZONE_OPTIONS.find((o) => o.tz === val);
                        setFormData((prev) => ({
                          ...prev,
                          contactTimezone: val,
                          contactTimezoneLabel: opt?.label || val,
                        }));
                        if (errors.contactTimezone)
                          setErrors((prev) => ({
                            ...prev,
                            contactTimezone: "",
                          }));
                      }}
                      error={errors.contactTimezone}
                    />
                    {formData.countryOfImport && (
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Auto-set from {formData.countryOfImport} — change it if
                        you're elsewhere.
                      </p>
                    )}
                  </div>

                  {/* Preview */}
                  {formData.contactMethods.length > 0 &&
                    formData.contactDays.length > 0 &&
                    formData.contactTimeWindow.length > 0 &&
                    formData.contactTimezone && (
                      <div className="bg-zinc-50 border border-black/5 rounded-xl px-4 py-3 text-xs text-zinc-600 flex items-start gap-2">
                        <CheckCircle2
                          size={14}
                          className="text-[#4da8da] mt-0.5 shrink-0"
                        />
                        <span>
                          We'll reach you via{" "}
                          <strong>{formData.contactMethods.join(" & ")}</strong>{" "}
                          during the{" "}
                          <strong>
                            {formData.contactTimeWindow.join(", ")}
                          </strong>{" "}
                          on <strong>{formData.contactDays.join(", ")}</strong>.
                          {(() => {
                            try {
                              const when = computePreferredContactAt(
                                formData.contactDays,
                                earliestTimeWindow(),
                                formData.contactTimezone,
                              );
                              return (
                                <>
                                  {" "}
                                  Approx.{" "}
                                  <strong>
                                    {formatInTz(when, formData.contactTimezone)}
                                  </strong>{" "}
                                  your time.
                                </>
                              );
                            } catch {
                              return null;
                            }
                          })()}
                        </span>
                      </div>
                    )}

                  {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
                      {errors.submit}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 pt-8 flex items-center justify-between border-t border-black/5">
            <button
              onClick={handlePrev}
              className={`flex items-center gap-2 font-bold transition-all ${step === 1 ? "opacity-0 pointer-events-none" : "opacity-100 text-zinc-500 hover:text-[#4da8da]"}`}
            >
              <ArrowLeft size={18} /> Back
            </button>
            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                disabled={isCreatingLead}
                className="bg-[#4da8da] text-white px-10 py-4 rounded-full font-bold hover:bg-[#3d92c2] hover:scale-105 transition-all shadow-[0_10px_20px_rgba(77,168,218,0.3)] disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                {isCreatingLead ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Saving...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#4da8da] text-white px-10 py-4 rounded-full font-bold hover:bg-[#3d92c2] hover:scale-105 transition-all shadow-[0_10px_20px_rgba(77,168,218,0.3)] disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
