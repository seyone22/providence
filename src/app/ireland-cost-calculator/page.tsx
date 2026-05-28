"use client";

import { useState, useMemo } from "react";
import MinimalHeader from "@/components/MinimalHeader";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const appleEase: any = [0.16, 1, 0.3, 1];

// ─── Exchange rates (indicative mid-2026) ───────────────────────────────────
const EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  GBP: 1.17,
  JPY: 0.0062,
  AUD: 0.60,
  NZD: 0.55,
  INR: 0.011,
  USD: 0.92,
};

// ─── Typical shipping to Ireland (EUR, midpoint of range) ───────────────────
const SHIPPING_ESTIMATES: Record<string, number> = {
  japan: 1500,
  uk_gb: 475,
  eu: 400,
  northern_ireland: 200,
  india: 2000,
  australia: 3500,
  new_zealand: 3500,
};

// ─── Default NOx by fuel type (mg/km) ───────────────────────────────────────
const DEFAULT_NOX: Record<string, number> = {
  ev: 0,
  hybrid: 10,
  petrol: 40,
  diesel: 80,
};

// ─── 2026 CO₂ → VRT rate (20 official Revenue bands, condensed) ─────────────
function getVRTRate(co2: number): number {
  if (co2 <= 50)  return 0.07;
  if (co2 <= 80)  return 0.09;
  if (co2 <= 85)  return 0.0975;
  if (co2 <= 90)  return 0.105;
  if (co2 <= 95)  return 0.1125;
  if (co2 <= 100) return 0.12;
  if (co2 <= 105) return 0.1275;
  if (co2 <= 110) return 0.135;
  if (co2 <= 115) return 0.1525;
  if (co2 <= 120) return 0.16;
  if (co2 <= 125) return 0.1675;
  if (co2 <= 130) return 0.175;
  if (co2 <= 135) return 0.1925;
  if (co2 <= 140) return 0.20;
  if (co2 <= 145) return 0.215;
  if (co2 <= 150) return 0.25;
  if (co2 <= 155) return 0.275;
  if (co2 <= 170) return 0.30;
  if (co2 <= 190) return 0.35;
  return 0.41;
}

// ─── NOx levy (with caps) ───────────────────────────────────────────────────
function getNOxLevy(nox: number, fuelType: string): number {
  if (fuelType === "ev" || nox <= 0) return 0;
  let levy = 0;
  levy += Math.min(nox, 40) * 5;
  if (nox > 40) levy += Math.min(nox - 40, 40) * 15;
  if (nox > 80) levy += (nox - 80) * 25;
  return Math.min(levy, fuelType === "diesel" ? 4850 : 600);
}

// ─── NEDC → WLTP-equivalent conversion ─────────────────────────────────────
function convertNEDCtoWLTP(nedc: number, fuelType: string): number {
  return fuelType === "diesel"
    ? nedc * 1.1405 + 12.858
    : nedc * 1.0928 + 9.885;
}

// ─── Customs duty rate ───────────────────────────────────────────────────────
// EU single market → always 0%.
// From outside EU: 0% for Japan-built (EPA) or UK-built (TCA), 10% otherwise.
// Note: EU-built cars that travelled through GB pay 10% — no TCA benefit.
function getCustomsDutyRate(manufacture: string, source: string): number {
  if (source === "eu" || source === "northern_ireland") return 0;
  if (manufacture === "japan") return 0;
  if (manufacture === "uk")    return 0;
  return 0.10;
}

// ─── VAT applicability ───────────────────────────────────────────────────────
function vatApplies(source: string, ageMonths: number, mileageKm: number): boolean {
  if (source === "eu" || source === "northern_ireland") {
    return ageMonths <= 6 || mileageKm <= 6000;
  }
  return true; // all non-EU sources always pay 23% VAT
}

// ─── EV VRT relief (up to €5,000, tapering €40k–€50k OMSP) ────────────────
function getEVRelief(omsp: number, isEV: boolean, beforeDeadline: boolean): number {
  if (!isEV || !beforeDeadline) return 0;
  if (omsp <= 40000) return 5000;
  if (omsp >= 50000) return 0;
  return 5000 * (1 - (omsp - 40000) / 10000);
}

// ─── Auto-suggest manufacture country when source changes ───────────────────
const SOURCE_MFR_DEFAULT: Record<string, string> = {
  japan:            "japan",
  uk_gb:            "uk",
  eu:               "eu",
  northern_ireland: "uk",
  india:            "other",
  australia:        "other",
  new_zealand:      "other",
};

// ─── Types ───────────────────────────────────────────────────────────────────
type FuelType = "ev" | "hybrid" | "petrol" | "diesel";
type CO2Standard = "wltp" | "nedc";

interface FormState {
  fuelType:           FuelType;
  yearFirstReg:       number;
  co2:                number;
  co2Standard:        CO2Standard;
  hasNoxData:         boolean;
  nox:                number;
  ageAtImportMonths:  number;
  mileageKm:          number;
  evBeforeDeadline:   boolean;
  sourceCountry:      string;
  countryOfManufacture: string;
  purchasePrice:      number;
  currency:           string;
  useEstShipping:     boolean;
  shippingCost:       number;
  omsp:               number;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function IrelandCostCalculator() {
  const [form, setForm] = useState<FormState>({
    fuelType:             "petrol",
    yearFirstReg:         2021,
    co2:                  110,
    co2Standard:          "wltp",
    hasNoxData:           false,
    nox:                  40,
    ageAtImportMonths:    36,
    mileageKm:            50000,
    evBeforeDeadline:     true,
    sourceCountry:        "japan",
    countryOfManufacture: "japan",
    purchasePrice:        15000,
    currency:             "EUR",
    useEstShipping:       true,
    shippingCost:         1500,
    omsp:                 22000,
  });

  const set = (key: keyof FormState, value: any) => {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === "sourceCountry") {
        next.shippingCost       = SHIPPING_ESTIMATES[value] ?? 1000;
        next.countryOfManufacture = SOURCE_MFR_DEFAULT[value] ?? "other";
      }
      if (key === "fuelType" && !prev.hasNoxData) {
        next.nox = DEFAULT_NOX[value as FuelType] ?? 40;
      }
      if (key === "hasNoxData" && !value) {
        next.nox = DEFAULT_NOX[prev.fuelType] ?? 40;
      }
      return next;
    });
  };

  // ─── Core calculation ─────────────────────────────────────────────────────
  const calc = useMemo(() => {
    const ageYears  = 2026 - form.yearFirstReg;
    const isClassic = ageYears >= 30;
    const isEV      = form.fuelType === "ev";

    // Effective CO₂ (NEDC → WLTP if needed)
    let effectiveCO2 = form.co2;
    if (form.co2Standard === "nedc" && !isClassic && !isEV) {
      effectiveCO2 = convertNEDCtoWLTP(form.co2, form.fuelType);
    }
    if (isEV) effectiveCO2 = 0;

    // CIF
    const priceEUR      = form.purchasePrice * (EXCHANGE_RATES[form.currency] ?? 1);
    const cifValue      = priceEUR + form.shippingCost;

    // Customs
    const dutyRate      = getCustomsDutyRate(form.countryOfManufacture, form.sourceCountry);
    const customsDuty   = cifValue * dutyRate;

    // VAT
    const vatBase       = cifValue + customsDuty;
    const vatNeeded     = vatApplies(form.sourceCountry, form.ageAtImportMonths, form.mileageKm);
    const vatAmount     = vatNeeded ? vatBase * 0.23 : 0;

    // VRT
    const vrtRate       = isClassic ? 0 : getVRTRate(effectiveCO2);
    const vrtAmount     = isClassic ? 200 : form.omsp * vrtRate;

    // NOx
    const noxValue      = form.hasNoxData ? form.nox : DEFAULT_NOX[form.fuelType];
    const noxLevy       = isClassic ? 0 : getNOxLevy(noxValue, form.fuelType);

    // EV relief
    const evRelief      = isClassic ? 0 : getEVRelief(form.omsp, isEV, form.evBeforeDeadline);

    // Totals
    const totalTaxes    = customsDuty + vatAmount + vrtAmount + noxLevy - evRelief;
    const totalLanded   = cifValue + totalTaxes;

    const isNMOT = vatNeeded &&
      (form.sourceCountry === "eu" || form.sourceCountry === "northern_ireland");

    return {
      priceEUR, cifValue, dutyRate, customsDuty,
      vatBase, vatNeeded, vatAmount,
      effectiveCO2, vrtRate, vrtAmount,
      noxLevy, evRelief,
      isClassic, isEV, isNMOT, ageYears,
      totalTaxes, totalLanded,
    };
  }, [form]);

  const fmt  = (n: number) => "€" + Math.round(n).toLocaleString("en-IE");
  const pct  = (n: number) => (n * 100).toFixed(2) + "%";
  const taxPct = calc.cifValue > 0
    ? Math.round((calc.totalTaxes / calc.cifValue) * 100)
    : 0;

  const scrollToForm = () => {
    document.getElementById("purchase-shipping-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans overflow-x-hidden selection:bg-black/10 selection:text-black">
      <MinimalHeader />

      {/* ── Sticky "calculating for" summary bar ──────────────────────── */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-black/[0.07] h-[44px] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">

          {/* Left: label + values — all items-center, no baseline mixing */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 shrink-0 hidden sm:block">
              Calculating for
            </span>
            <span className="text-zinc-300 hidden sm:block" aria-hidden>·</span>

            <span className="text-sm font-bold text-black shrink-0">{fmt(calc.priceEUR)}</span>
            <span className="text-zinc-300" aria-hidden>·</span>
            <span className="text-sm font-bold text-black shrink-0">{fmt(form.shippingCost)}</span>
            <span className="text-zinc-300" aria-hidden>·</span>
            <span className="text-sm font-bold text-black shrink-0">{fmt(form.omsp)}</span>

            {/* Total landed — arrow separator on mobile, dot on sm+ */}
            <span className="text-zinc-300 sm:hidden" aria-hidden>→</span>
            <span className="text-zinc-300 hidden sm:block" aria-hidden>·</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-zinc-400 hidden sm:block">Total landed</span>
              <span className="text-sm font-bold text-[#4da8da]">{fmt(calc.totalLanded)}</span>
            </span>
          </div>

          {/* Right: Change button */}
          <button
            onClick={scrollToForm}
            className="flex items-center gap-1 text-[11px] font-bold text-sky-500 hover:text-white hover:bg-sky-500 border border-sky-400/40 hover:border-sky-500 rounded-lg px-3 py-1.5 transition-all duration-200 shrink-0"
          >
            Change <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative pt-44 pb-16 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="text-center mb-16"
          >
            <p className="text-sm font-bold tracking-[0.4em] text-zinc-400 uppercase mb-6">
              Ireland Import Tool · 2026 Revenue Rates
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-6 leading-[0.95]">
              Ireland Landed<br />Cost Calculator
            </h1>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
              Calculate the exact customs duty, VAT and VRT you'll pay to import
              any car into Ireland — based on 2026 Revenue rates and current
              EU trade agreements.
            </p>
          </motion.div>

          {/* ── Two-column: Form | Results ──────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 max-w-6xl mx-auto items-start">

            {/* LEFT — Inputs ─────────────────────────────────────────────── */}
            <motion.div
              id="calculator-inputs"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
              className="space-y-5 scroll-mt-36"
            >

              {/* Card: Vehicle Details */}
              <Card title="Vehicle Details">

                {/* Fuel type toggle */}
                <Field label="Fuel Type">
                  <div className="grid grid-cols-4 gap-2">
                    {(["ev", "hybrid", "petrol", "diesel"] as FuelType[]).map(ft => (
                      <button
                        key={ft}
                        onClick={() => set("fuelType", ft)}
                        className={`py-3 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                          form.fuelType === ft
                            ? "bg-black text-white shadow-sm"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        }`}
                      >
                        {ft === "ev" ? "EV" : ft.charAt(0).toUpperCase() + ft.slice(1)}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* CO₂ — hidden for EVs */}
                {!calc.isEV && (
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="CO₂ Emissions (g/km)">
                      <TextInput
                        type="number"
                        value={form.co2}
                        onChange={v => set("co2", Number(v))}
                        min={1}
                        max={500}
                      />
                    </Field>
                    <Field label="CO₂ Standard">
                      <SelectInput
                        value={form.co2Standard}
                        onChange={v => set("co2Standard", v as CO2Standard)}
                        options={[
                          { value: "wltp", label: "WLTP (2020+)" },
                          { value: "nedc", label: "NEDC (pre-2020)" },
                        ]}
                      />
                    </Field>
                  </div>
                )}

                {/* NEDC conversion warning */}
                {form.co2Standard === "nedc" && !calc.isEV && !calc.isClassic && (
                  <Alert variant="warning">
                    Revenue converts NEDC to WLTP-equivalent, inflating the CO₂ figure and
                    potentially pushing the car into a higher VRT band.{" "}
                    <strong>Effective figure used: {calc.effectiveCO2.toFixed(1)} g/km</strong>
                  </Alert>
                )}

                {/* NOx */}
                {!calc.isEV && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                        NOx Emissions (mg/km)
                      </label>
                      <button
                        onClick={() => set("hasNoxData", !form.hasNoxData)}
                        className="text-xs font-medium text-sky-500 hover:text-sky-600 transition-colors"
                      >
                        {form.hasNoxData ? "Use default" : "I have this data"}
                      </button>
                    </div>
                    <TextInput
                      type="number"
                      value={form.nox}
                      onChange={v => set("nox", Number(v))}
                      disabled={!form.hasNoxData}
                      min={0}
                      max={500}
                    />
                    {!form.hasNoxData && (
                      <p className="text-xs text-zinc-400">
                        Using default for {form.fuelType} ({DEFAULT_NOX[form.fuelType]} mg/km).
                        Enter your value for a precise NOx levy.
                      </p>
                    )}
                  </div>
                )}

                {/* Year + Mileage */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Year First Registered">
                    <TextInput
                      type="number"
                      value={form.yearFirstReg}
                      onChange={v => set("yearFirstReg", Number(v))}
                      min={1950}
                      max={2026}
                    />
                  </Field>
                  <Field label="Mileage at Import (km)">
                    <TextInput
                      type="number"
                      value={form.mileageKm}
                      onChange={v => set("mileageKm", Number(v))}
                      min={0}
                    />
                  </Field>
                </div>

                {/* Age at import */}
                <Field label="Age at Import (months since first registration)">
                  <TextInput
                    type="number"
                    value={form.ageAtImportMonths}
                    onChange={v => set("ageAtImportMonths", Number(v))}
                    min={0}
                  />
                </Field>

                {/* Classic notice */}
                {calc.isClassic && (
                  <Alert variant="success">
                    This vehicle is <strong>30+ years old</strong> — Category C classic. VRT is a
                    flat <strong>€200</strong> regardless of value or emissions.
                  </Alert>
                )}

                {/* EV deadline toggle */}
                {calc.isEV && (
                  <Field label="Registering before 31 December 2026?">
                    <div className="grid grid-cols-2 gap-2">
                      {[true, false].map(v => (
                        <button
                          key={String(v)}
                          onClick={() => set("evBeforeDeadline", v)}
                          className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            form.evBeforeDeadline === v
                              ? "bg-black text-white shadow-sm"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        >
                          {v ? "Yes — claim €5,000 relief" : "No"}
                        </button>
                      ))}
                    </div>
                  </Field>
                )}
              </Card>

              {/* Card: Origin & Source */}
              <Card title="Origin & Source">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Source Country (where you're buying from)">
                    <SelectInput
                      value={form.sourceCountry}
                      onChange={v => set("sourceCountry", v)}
                      options={[
                        { value: "japan",            label: "Japan" },
                        { value: "uk_gb",            label: "UK / Great Britain" },
                        { value: "eu",               label: "EU (Germany, France…)" },
                        { value: "northern_ireland", label: "Northern Ireland" },
                        { value: "india",            label: "India" },
                        { value: "australia",        label: "Australia" },
                        { value: "new_zealand",      label: "New Zealand" },
                      ]}
                    />
                  </Field>
                  <Field label="Country of Manufacture (where the car was built)">
                    <SelectInput
                      value={form.countryOfManufacture}
                      onChange={v => set("countryOfManufacture", v)}
                      options={[
                        { value: "japan", label: "Japan (0% — EU-Japan EPA)" },
                        { value: "uk",    label: "UK (0% — EU-UK TCA)" },
                        { value: "eu",    label: "EU-built (0% from EU; 10% via UK)" },
                        { value: "other", label: "Other / Unknown (10%)" },
                      ]}
                    />
                  </Field>
                </div>

                {/* Duty rate indicator */}
                <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                  calc.dutyRate === 0
                    ? "bg-emerald-50 border-emerald-200/60"
                    : "bg-amber-50 border-amber-200/60"
                }`}>
                  {calc.dutyRate === 0
                    ? <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    : <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  }
                  <p className={`text-sm font-medium ${
                    calc.dutyRate === 0 ? "text-emerald-700" : "text-amber-700"
                  }`}>
                    {calc.dutyRate === 0
                      ? "0% customs duty applies — preferential trade agreement confirmed."
                      : "10% customs duty applies — no preferential trade agreement for this combination."}
                  </p>
                </div>

                {/* New Means of Transport warning */}
                {calc.isNMOT && (
                  <Alert variant="warning">
                    This EU/NI car is a{" "}
                    <strong>"new means of transport"</strong> for VAT — it is under 6 months old{" "}
                    <em>or</em> under 6,000 km. Irish VAT at 23% applies. Both thresholds must be
                    exceeded to avoid VAT on EU/NI imports.
                  </Alert>
                )}

                {/* EU/NI VAT-free confirmation */}
                {(form.sourceCountry === "eu" || form.sourceCountry === "northern_ireland") &&
                  !calc.isNMOT && (
                    <Alert variant="success">
                      This car qualifies as a <strong>used vehicle</strong> — over 6 months old{" "}
                      AND over 6,000 km. No Irish VAT applies on import from EU/NI.
                    </Alert>
                  )}
              </Card>

              {/* Card: Purchase & Shipping */}
              <Card id="purchase-shipping-card" title="Purchase & Shipping">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Field label="Purchase Price">
                      <TextInput
                        type="number"
                        value={form.purchasePrice}
                        onChange={v => set("purchasePrice", Number(v))}
                        min={0}
                      />
                    </Field>
                  </div>
                  <Field label="Currency">
                    <SelectInput
                      value={form.currency}
                      onChange={v => set("currency", v)}
                      options={[
                        { value: "EUR", label: "EUR €" },
                        { value: "GBP", label: "GBP £" },
                        { value: "JPY", label: "JPY ¥" },
                        { value: "AUD", label: "AUD A$" },
                        { value: "NZD", label: "NZD NZ$" },
                        { value: "INR", label: "INR ₹" },
                        { value: "USD", label: "USD $" },
                      ]}
                    />
                  </Field>
                </div>

                {form.currency !== "EUR" && (
                  <p className="text-sm text-zinc-500 -mt-1">
                    ≈ {fmt(calc.priceEUR)} at indicative mid-market rate
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                      Shipping & Transport (€)
                    </label>
                    <button
                      onClick={() => set("useEstShipping", !form.useEstShipping)}
                      className="text-xs font-medium text-sky-500 hover:text-sky-600 transition-colors"
                    >
                      {form.useEstShipping ? "Enter exact amount" : "Use estimate"}
                    </button>
                  </div>
                  <TextInput
                    type="number"
                    value={form.shippingCost}
                    onChange={v => set("shippingCost", Number(v))}
                    disabled={form.useEstShipping}
                    min={0}
                  />
                  {form.useEstShipping && (
                    <p className="text-xs text-zinc-400">
                      Estimated typical cost for {form.sourceCountry.replace("_", " / ")} — includes port
                      charges & marine insurance.
                    </p>
                  )}
                </div>
              </Card>

              {/* Card: Irish Market Value */}
              <Card title="Irish Market Value (OMSP)">
                <Field label="Estimated Irish Open Market Selling Price (€)">
                  <TextInput
                    type="number"
                    value={form.omsp}
                    onChange={v => set("omsp", Number(v))}
                    min={0}
                  />
                </Field>
                <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-black/5 rounded-xl">
                  <Info className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    VRT is charged on Revenue's{" "}
                    <strong className="text-zinc-700">OMSP</strong> — their estimate of what
                    this car would sell for at Irish retail — not your purchase price. Check
                    comparable listings on{" "}
                    <a href="https://www.carzone.ie" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 underline underline-offset-2 transition-colors">
                      carzone.ie
                    </a>{" "}
                    or the Revenue{" "}
                    <a href="https://www.revenue.ie/en/importing-vehicles-duty-free-allowances/guide-to-vrt/index.aspx" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 underline underline-offset-2 transition-colors">
                      VRT estimator
                    </a>{" "}
                    to estimate this.
                    A high-spec or low-mileage car will carry a higher OMSP than average.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* RIGHT — Results ─────────────────────────────────────────────── */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: appleEase }}
              className="lg:sticky lg:top-24 space-y-4"
            >
              <div className="bg-zinc-50 border border-black/5 rounded-[2rem] p-7 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">

                {/* Header */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="p-3 bg-black text-white rounded-2xl">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black tracking-tight">Cost Breakdown</h2>
                    <p className="text-xs text-zinc-400">Indicative 2026 figures</p>
                  </div>
                </div>

                {/* Line items */}
                <div className="space-y-3">

                  {/* Base costs */}
                  <CostLine label="Purchase Price" value={fmt(calc.priceEUR)}
                    sub={form.currency !== "EUR"
                      ? `${form.purchasePrice.toLocaleString()} ${form.currency}`
                      : undefined} />
                  <CostLine label="Shipping & Transport" value={fmt(form.shippingCost)} />

                  <div className="border-t border-black/8 pt-3">
                    <CostLine label="CIF Value" value={fmt(calc.cifValue)} bold
                      sub="Cost + Insurance + Freight" />
                  </div>

                  {/* Tax section */}
                  <div className="border-t border-black/8 pt-3 space-y-3">
                    <p className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                      Irish Import Taxes
                    </p>

                    <CostLine
                      label={`Customs Duty (${pct(calc.dutyRate)})`}
                      value={calc.customsDuty === 0 ? "€0" : fmt(calc.customsDuty)}
                      accent={calc.customsDuty === 0 ? "green" : "red"}
                      sub={calc.customsDuty === 0 ? "Preferential rate applies" : undefined}
                    />

                    <CostLine
                      label={calc.vatNeeded ? "VAT (23%)" : "VAT (0% — used vehicle from EU/NI)"}
                      value={calc.vatNeeded ? fmt(calc.vatAmount) : "€0"}
                      accent={calc.vatNeeded ? "neutral" : "green"}
                      sub={calc.vatNeeded ? `On CIF + duty: ${fmt(calc.vatBase)}` : undefined}
                    />

                    {calc.isClassic ? (
                      <CostLine
                        label="VRT — Category C (Classic)"
                        value="€200 flat"
                        accent="green"
                        sub="Vehicles 30+ years old"
                      />
                    ) : (
                      <CostLine
                        label={`VRT (${pct(calc.vrtRate)} of OMSP)`}
                        value={fmt(calc.vrtAmount)}
                        sub={`${calc.effectiveCO2.toFixed(0)} g/km WLTP · OMSP ${fmt(form.omsp)}`}
                      />
                    )}

                    {!calc.isClassic && (
                      <CostLine
                        label="NOx Levy"
                        value={calc.noxLevy === 0 ? "€0" : fmt(calc.noxLevy)}
                        accent={calc.noxLevy === 0 ? "green" : "neutral"}
                        sub={calc.noxLevy === 0 ? "Battery EV — zero NOx" : undefined}
                      />
                    )}

                    {calc.evRelief > 0 && (
                      <CostLine
                        label="BEV VRT Relief (–)"
                        value={`–${fmt(calc.evRelief)}`}
                        accent="green"
                        sub="Expires 31 December 2026"
                      />
                    )}
                  </div>

                  {/* Subtotal taxes */}
                  <div className="border-t border-black/8 pt-3">
                    <CostLine
                      label="Total Import Taxes"
                      value={fmt(calc.totalTaxes)}
                      bold
                    />
                  </div>

                  {/* Grand total */}
                  <div className="bg-black text-white rounded-2xl p-5 mt-2">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/50 text-xs font-medium mb-1 uppercase tracking-widest">
                          Total Landed in Ireland
                        </p>
                        <p className="text-3xl font-bold tracking-tight">
                          {fmt(calc.totalLanded)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/50 text-xs mb-1">Tax burden</p>
                        <p className="text-2xl font-bold">{taxPct}%</p>
                        <p className="text-white/40 text-xs">of CIF</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/request"
                className="group flex items-center justify-between w-full px-7 py-5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold text-base transition-all duration-300 shadow-[0_10px_40px_rgba(14,165,233,0.25)]"
              >
                <span>Source This Vehicle With Providence</span>
                <ArrowRight
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <p className="text-center text-xs text-zinc-400">
                We handle customs, VRT, NCTS and delivery end-to-end
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How Irish import tax works ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-zinc-50 border-t border-black/5 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black mb-4">
              How Irish import tax works
            </h2>
            <p className="text-lg text-zinc-500 font-light max-w-xl mx-auto">
              Three charges stack in order. Each is calculated on top of the last.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                title: "Customs Duty",
                color: "bg-blue-50 border-blue-100",
                dot:   "bg-blue-500",
                numColor: "text-blue-400",
                items: [
                  "0% for Japan-built cars (EU–Japan EPA, from Feb 2026)",
                  "0% for UK-built cars with proof of UK origin (TCA)",
                  "0% for EU-manufactured cars imported from the EU",
                  "10% for everything else — India, Korea, USA, etc.",
                  "10% for EU-built cars sold through the UK",
                  "Charged on CIF value (price + shipping + insurance)",
                  "Charged on country of MANUFACTURE, not registration",
                ],
              },
              {
                num: "02",
                title: "VAT — 23%",
                color: "bg-purple-50 border-purple-100",
                dot:   "bg-purple-500",
                numColor: "text-purple-300",
                items: [
                  "Always applies to Japan, UK/GB, India, AU, NZ imports",
                  "EU/NI: only if under 6 months old OR under 6,000 km",
                  "Calculated on CIF value + customs duty",
                  "UK is outside the EU post-Brexit — VAT always applies",
                  "Both thresholds must pass for a used EU car to be VAT-free",
                ],
              },
              {
                num: "03",
                title: "VRT",
                color: "bg-amber-50 border-amber-100",
                dot:   "bg-amber-500",
                numColor: "text-amber-300",
                items: [
                  "7% to 41% of Revenue's OMSP (Irish retail value)",
                  "Calculated on CO₂ emissions band (WLTP figure required)",
                  "Plus a NOx levy on petrol and diesel cars",
                  "EVs pay 7% band + zero NOx levy",
                  "EV relief up to €5,000 until 31 Dec 2026",
                  "Classic cars (30+ yrs) pay a flat €200",
                  "Revenue sets the OMSP — not your purchase price",
                ],
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: appleEase }}
                className={`p-6 rounded-[1.5rem] border ${card.color}`}
              >
                <div className="flex items-baseline gap-3 mb-5">
                  <span className={`text-5xl font-black ${card.numColor}`}>{card.num}</span>
                  <h3 className="text-lg font-bold text-black">{card.title}</h3>
                </div>
                <ul className="space-y-2">
                  {card.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-600">
                      <span className={`mt-[6px] h-1.5 w-1.5 rounded-full flex-shrink-0 ${card.dot}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VRT band reference table ─────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-t border-black/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-black mb-3">
              2026 VRT CO₂ Band Reference
            </h2>
            <p className="text-zinc-500 font-light">
              VRT is a percentage of Irish OMSP. Lower emissions = dramatically less tax.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
            className="overflow-hidden rounded-[1.5rem] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-black/5">
                  <th className="text-left px-6 py-4 font-bold text-black tracking-tight">CO₂ (g/km WLTP)</th>
                  <th className="text-left px-6 py-4 font-bold text-black tracking-tight">VRT Rate</th>
                  <th className="text-left px-6 py-4 font-bold text-black tracking-tight hidden sm:table-cell">Typical Vehicle</th>
                  <th className="text-right px-6 py-4 font-bold text-black tracking-tight">On €20k OMSP</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["0 – 50",    "7%",    "Battery EV, plug-in hybrid",        "€1,400"],
                  ["51 – 80",   "9%",    "Efficient full hybrid",              "€1,800"],
                  ["81 – 90",   "9.75–10.5%", "Hybrid / small petrol",        "~€2,025"],
                  ["91 – 100",  "11.25–12%",  "Small modern petrol",          "~€2,325"],
                  ["101 – 110", "12.75–13.5%","Mid-size petrol",              "~€2,625"],
                  ["111 – 120", "15.25–16%",  "Larger petrol / small diesel", "~€3,125"],
                  ["121 – 135", "16.75–19.25%","Diesel saloon / compact SUV", "~€3,600"],
                  ["136 – 150", "20–25%",     "Mid-size SUV",                 "~€4,500"],
                  ["151 – 170", "27.5–30%",   "Large SUV / large diesel",     "~€5,750"],
                  ["171 – 190", "35%",         "Large premium SUV / V6",      "€7,000"],
                  ["Over 190",  "41%",         "Performance / luxury / 4x4",  "€8,200"],
                ].map(([co2, rate, vehicle, cost], i) => (
                  <tr
                    key={i}
                    className={`border-b border-black/5 last:border-0 transition-colors hover:bg-zinc-50 ${
                      i < 3 ? "text-emerald-700" : i < 6 ? "text-zinc-700" : "text-red-600"
                    }`}
                  >
                    <td className="px-6 py-3.5 font-mono text-xs font-medium">{co2}</td>
                    <td className="px-6 py-3.5 font-bold">{rate}</td>
                    <td className="px-6 py-3.5 text-zinc-500 hidden sm:table-cell">{vehicle}</td>
                    <td className="px-6 py-3.5 font-bold text-right">{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────────────────── */}
      <section className="py-10 px-6 bg-zinc-50 border-t border-black/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-black/5">
            <Info className="h-5 w-5 text-zinc-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-zinc-500 leading-relaxed">
              <strong className="text-zinc-700">Disclaimer:</strong> This calculator provides
              indicative estimates based on 2026 Revenue rates and current EU trade agreements.
              VRT is charged on Revenue's OMSP, confirmed only at NCTS inspection. Exchange rates
              are indicative mid-market figures. Tax rates, VRT bands, trade-agreement tariff
              schedules and reliefs change — the BEV relief and VRT bands are reviewed each Budget.
              This is not legal, financial or tax advice. Always verify with{" "}
              <span className="text-zinc-700 font-medium">revenue.ie</span>, the NCTS and a licensed
              customs agent before committing to a purchase.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Card({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5 scroll-mt-32">
      <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase block">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value, onChange, disabled, type, min, max,
}: {
  value: number;
  onChange: (v: string) => void;
  disabled?: boolean;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type={type ?? "text"}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      min={min}
      max={max}
      className={`w-full px-4 py-3 bg-zinc-50 border border-black/10 rounded-xl text-black font-medium
        focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 transition-all
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-black/20"}`}
    />
  );
}

function SelectInput({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-zinc-50 border border-black/10 rounded-xl text-black font-medium
        focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30
        hover:border-black/20 transition-all appearance-none cursor-pointer"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Alert({
  variant, children,
}: {
  variant: "warning" | "success";
  children: React.ReactNode;
}) {
  const styles = variant === "warning"
    ? { wrap: "bg-amber-50 border-amber-200/60",  icon: "text-amber-500",  text: "text-amber-700" }
    : { wrap: "bg-emerald-50 border-emerald-200/60", icon: "text-emerald-500", text: "text-emerald-700" };
  const Icon = variant === "warning" ? AlertTriangle : CheckCircle;
  return (
    <div className={`flex items-start gap-3 p-4 border rounded-xl ${styles.wrap}`}>
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${styles.icon}`} />
      <p className={`text-sm ${styles.text}`}>{children}</p>
    </div>
  );
}

function CostLine({
  label, value, sub, bold, accent,
}: {
  label: string;
  value: string;
  sub?: string;
  bold?: boolean;
  accent?: "green" | "red" | "neutral";
}) {
  const color = accent === "green" ? "text-emerald-600"
    : accent === "red" ? "text-red-500"
    : "text-black";
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className={`text-sm leading-snug ${bold ? "font-bold text-black" : "text-zinc-500"}`}>
          {label}
        </p>
        {sub && <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{sub}</p>}
      </div>
      <p className={`text-sm font-bold flex-shrink-0 ${bold ? "text-base" : ""} ${color}`}>
        {value}
      </p>
    </div>
  );
}
