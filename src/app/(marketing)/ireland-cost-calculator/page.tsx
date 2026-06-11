"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import MinimalHeader from "@/components/MinimalHeader";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import {
  Calculator,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowRight,
  ChevronDown,
  Download,
  Mail,
  Loader2,
} from "lucide-react";
import {
  MONTH_NAMES,
  FUEL_LABELS,
  SOURCE_LABELS,
  MFR_LABELS,
  ageInMonths,
  type BreakdownData,
  type ExchangeRates,
  FALLBACK_EXCHANGE_RATES,
  type DepreciationCode,
  type VehicleCondition,
  DEPRECIATION_GROUPS,
  DEPRECIATION_TABLES,
  estimateOmsp,
} from "@/lib/ireland-cost";
import {
  generateBreakdownPdf,
  emailBreakdown,
  getExchangeRates,
} from "@/actions/calculator-actions";

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
  if (co2 <= 50) return 0.07;
  if (co2 <= 80) return 0.09;
  if (co2 <= 85) return 0.0975;
  if (co2 <= 90) return 0.105;
  if (co2 <= 95) return 0.1125;
  if (co2 <= 100) return 0.12;
  if (co2 <= 105) return 0.1275;
  if (co2 <= 110) return 0.135;
  if (co2 <= 115) return 0.1525;
  if (co2 <= 120) return 0.16;
  if (co2 <= 125) return 0.1675;
  if (co2 <= 130) return 0.175;
  if (co2 <= 135) return 0.1925;
  if (co2 <= 140) return 0.2;
  if (co2 <= 145) return 0.215;
  if (co2 <= 150) return 0.25;
  if (co2 <= 155) return 0.275;
  if (co2 <= 170) return 0.3;
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
  return fuelType === "diesel" ? nedc * 1.1405 + 12.858 : nedc * 1.0928 + 9.885;
}

// ─── Customs duty rate ───────────────────────────────────────────────────────
// EU single market → always 0%.
// From outside EU: 0% for Japan-built (EPA) or UK-built (TCA), 10% otherwise.
// Note: EU-built cars that travelled through GB pay 10% — no TCA benefit.
function getCustomsDutyRate(manufacture: string, source: string): number {
  if (source === "eu" || source === "northern_ireland") return 0;
  if (manufacture === "japan") return 0;
  if (manufacture === "uk") return 0;
  return 0.1;
}

// Plain-English reason for the duty outcome. 0% has three distinct causes —
// EU/NI free circulation, the Japan EPA, or the UK TCA — and saying which one
// matters because each needs different paperwork at import.
function getDutyExplanation(manufacture: string, source: string): string {
  if (source === "eu" || source === "northern_ireland")
    return "No customs duty. The car is already in free circulation inside the EU single market, so nothing is charged when it moves to Ireland — its country of build doesn't matter here.";
  if (manufacture === "japan")
    return "No customs duty. The EU–Japan trade agreement removes the tariff on Japanese-built cars — you'll need a statement of origin proving where it was built.";
  if (manufacture === "uk")
    return "No customs duty. The EU–UK trade agreement removes the tariff on UK-built cars — you'll need proof of UK origin to claim it.";
  return "10% customs duty applies. No EU trade agreement covers this build-and-source combination, so the standard tariff is charged on the CIF value (price + shipping + insurance).";
}

// ─── VAT applicability ───────────────────────────────────────────────────────
function vatApplies(
  source: string,
  ageMonths: number,
  mileageKm: number,
): boolean {
  if (source === "eu" || source === "northern_ireland") {
    return ageMonths <= 6 || mileageKm <= 6000;
  }
  return true; // all non-EU sources always pay 23% VAT
}

// ─── EV VRT relief (up to €5,000, tapering €40k–€50k OMSP) ────────────────
function getEVRelief(
  omsp: number,
  isEV: boolean,
  beforeDeadline: boolean,
): number {
  if (!isEV || !beforeDeadline) return 0;
  if (omsp <= 40000) return 5000;
  if (omsp >= 50000) return 0;
  return 5000 * (1 - (omsp - 40000) / 10000);
}

// ─── Auto-suggest manufacture country when source changes ───────────────────
const SOURCE_MFR_DEFAULT: Record<string, string> = {
  japan: "japan",
  uk_gb: "uk",
  eu: "eu",
  northern_ireland: "uk",
  india: "other",
  australia: "other",
  new_zealand: "other",
};

// ─── Types ───────────────────────────────────────────────────────────────────
type FuelType = "ev" | "hybrid" | "petrol" | "diesel";
type CO2Standard = "wltp" | "nedc";

interface FormState {
  fuelType: FuelType;
  yearFirstReg: number;
  monthFirstReg: number; // 1–12
  co2: number;
  co2Standard: CO2Standard;
  hasNoxData: boolean;
  nox: number;
  mileageKm: number;
  evBeforeDeadline: boolean;
  sourceCountry: string;
  countryOfManufacture: string;
  purchasePrice: number;
  currency: string;
  useEstShipping: boolean;
  shippingCost: number;
  omsp: number;
  // OMSP estimation (Revenue depreciation model)
  estimateOmsp: boolean;
  omspNew: number; // price when new
  depGroup: string; // plain-language group key
  useAdvancedCode: boolean;
  depCode: DepreciationCode; // exact Revenue table code
  condition: VehicleCondition;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function IrelandCostCalculator() {
  const [form, setForm] = useState<FormState>({
    fuelType: "petrol",
    yearFirstReg: 2021,
    monthFirstReg: 1,
    co2: 110,
    co2Standard: "wltp",
    hasNoxData: false,
    nox: 40,
    mileageKm: 50000,
    evBeforeDeadline: true,
    sourceCountry: "japan",
    countryOfManufacture: "japan",
    purchasePrice: 15000,
    currency: "EUR",
    useEstShipping: true,
    shippingCost: 1500,
    omsp: 22000,
    estimateOmsp: false,
    omspNew: 40000,
    depGroup: "average",
    useAdvancedCode: false,
    depCode: "E1",
    condition: "good",
  });

  const set = (key: keyof FormState, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "sourceCountry") {
        next.shippingCost = SHIPPING_ESTIMATES[value] ?? 1000;
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

  // Reference "today". Seeded with a deterministic constant so server and
  // client render identically (no hydration mismatch), then corrected to the
  // real current month after mount.
  const [now, setNow] = useState<{ year: number; month: number }>({
    year: 2026,
    month: 6,
  });
  useEffect(() => {
    const d = new Date();
    setNow({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }, []);

  // Live ECB exchange rates. Seeded with the indicative fallback so the first
  // render (and any fetch failure) still has usable numbers, then replaced with
  // the live daily rates after mount.
  const [fx, setFx] = useState<ExchangeRates>({
    rates: FALLBACK_EXCHANGE_RATES,
    date: null,
    source: "fallback",
  });
  useEffect(() => {
    getExchangeRates()
      .then(setFx)
      .catch(() => {});
  }, []);

  // ─── Core calculation ─────────────────────────────────────────────────────
  const calc = useMemo(() => {
    const ageMonths = ageInMonths(form.yearFirstReg, form.monthFirstReg, now);
    const ageYears = now.year - form.yearFirstReg;
    const isClassic = ageYears >= 30;
    const isEV = form.fuelType === "ev";

    // Effective CO₂ (NEDC → WLTP if needed)
    let effectiveCO2 = form.co2;
    if (form.co2Standard === "nedc" && !isClassic && !isEV) {
      effectiveCO2 = convertNEDCtoWLTP(form.co2, form.fuelType);
    }
    if (isEV) effectiveCO2 = 0;

    // CIF
    const priceEUR = form.purchasePrice * (fx.rates[form.currency] ?? 1);
    const cifValue = priceEUR + form.shippingCost;

    // Customs
    const dutyRate = getCustomsDutyRate(
      form.countryOfManufacture,
      form.sourceCountry,
    );
    const customsDuty = cifValue * dutyRate;

    // VAT
    const vatBase = cifValue + customsDuty;
    const vatNeeded = vatApplies(form.sourceCountry, ageMonths, form.mileageKm);
    const vatAmount = vatNeeded ? vatBase * 0.23 : 0;

    // OMSP — either entered directly or estimated from the price when new using
    // Revenue's depreciation model (Manual Part 8).
    const depCode = form.useAdvancedCode
      ? form.depCode
      : (DEPRECIATION_GROUPS.find((g) => g.key === form.depGroup)?.code ??
        "E1");
    const omspEstimate = form.estimateOmsp
      ? estimateOmsp({
          omspNew: form.omspNew,
          code: depCode,
          ageYears,
          ageMonths,
          regMonth: now.month,
          fuelType: form.fuelType,
          mileageKm: form.mileageKm,
          condition: form.condition,
        })
      : null;
    const omsp = omspEstimate ? omspEstimate.omsp : form.omsp;

    // VRT
    const vrtRate = isClassic ? 0 : getVRTRate(effectiveCO2);
    const vrtAmount = isClassic ? 200 : omsp * vrtRate;

    // NOx
    const noxValue = form.hasNoxData ? form.nox : DEFAULT_NOX[form.fuelType];
    const noxLevy = isClassic ? 0 : getNOxLevy(noxValue, form.fuelType);

    // EV relief
    const evRelief = isClassic
      ? 0
      : getEVRelief(omsp, isEV, form.evBeforeDeadline);

    // Totals
    const totalTaxes = customsDuty + vatAmount + vrtAmount + noxLevy - evRelief;
    const totalLanded = cifValue + totalTaxes;

    const isNMOT =
      vatNeeded &&
      (form.sourceCountry === "eu" ||
        form.sourceCountry === "northern_ireland");

    return {
      priceEUR,
      cifValue,
      dutyRate,
      customsDuty,
      vatBase,
      vatNeeded,
      vatAmount,
      effectiveCO2,
      vrtRate,
      vrtAmount,
      noxValue,
      noxLevy,
      evRelief,
      omsp,
      omspEstimate,
      depCode,
      isClassic,
      isEV,
      isNMOT,
      ageYears,
      ageMonths,
      totalTaxes,
      totalLanded,
    };
  }, [form, now, fx]);

  const fmt = (n: number) => "€" + Math.round(n).toLocaleString("en-IE");
  const pct = (n: number) => (n * 100).toFixed(2) + "%";
  const taxPct =
    calc.cifValue > 0 ? Math.round((calc.totalTaxes / calc.cifValue) * 100) : 0;

  // Assemble the fully-resolved breakdown handed to the PDF / email actions.
  const buildBreakdown = (): BreakdownData => ({
    generatedAt: new Date().toLocaleString("en-IE", {
      dateStyle: "long",
      timeStyle: "short",
    }),
    fuelType: FUEL_LABELS[form.fuelType] ?? form.fuelType,
    yearFirstReg: form.yearFirstReg,
    monthFirstReg: form.monthFirstReg,
    ageMonths: calc.ageMonths,
    mileageKm: form.mileageKm,
    effectiveCO2: calc.effectiveCO2,
    co2Standard: form.co2Standard.toUpperCase(),
    noxValue: calc.noxValue,
    sourceCountry: SOURCE_LABELS[form.sourceCountry] ?? form.sourceCountry,
    countryOfManufacture:
      MFR_LABELS[form.countryOfManufacture] ?? form.countryOfManufacture,
    currency: form.currency,
    purchasePriceOriginal: form.purchasePrice,
    priceEUR: calc.priceEUR,
    shippingCost: form.shippingCost,
    cifValue: calc.cifValue,
    dutyRate: calc.dutyRate,
    customsDuty: calc.customsDuty,
    vatNeeded: calc.vatNeeded,
    vatBase: calc.vatBase,
    vatAmount: calc.vatAmount,
    isClassic: calc.isClassic,
    isEV: calc.isEV,
    vrtRate: calc.vrtRate,
    vrtAmount: calc.vrtAmount,
    noxLevy: calc.noxLevy,
    evRelief: calc.evRelief,
    omsp: calc.omsp,
    totalTaxes: calc.totalTaxes,
    totalLanded: calc.totalLanded,
    taxPct,
  });

  // ─── PDF download ───────────────────────────────────────────────────────────
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const res = await generateBreakdownPdf(buildBreakdown());
      if (res.success && res.pdfBase64) {
        const bytes = Uint8Array.from(atob(res.pdfBase64), (c) =>
          c.charCodeAt(0),
        );
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = res.fileName || "Providence-Ireland-Landed-Cost.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        alert(res.message || "Failed to generate PDF.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while generating the PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ─── Email breakdown ────────────────────────────────────────────────────────
  const [emailTo, setEmailTo] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<null | {
    ok: boolean;
    msg: string;
  }>(null);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTo.trim());

  const handleSendEmail = async () => {
    if (!emailValid) {
      setEmailStatus({ ok: false, msg: "Please enter a valid email address." });
      return;
    }
    setIsSendingEmail(true);
    setEmailStatus(null);
    try {
      const res = await emailBreakdown(buildBreakdown(), emailTo.trim());
      if (res.success) {
        setEmailStatus({
          ok: true,
          msg: `Breakdown sent to ${emailTo.trim()}.`,
        });
        setEmailTo("");
      } else {
        setEmailStatus({
          ok: false,
          msg: res.message || "Failed to send email.",
        });
      }
    } catch (e) {
      console.error(e);
      setEmailStatus({
        ok: false,
        msg: "An error occurred while sending the email.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const scrollToForm = () => {
    document
      .getElementById("purchase-shipping-card")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const swipeRef = useRef<{
    key: keyof FormState;
    startX: number;
    baseValue: number;
  } | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("swipeHintSeen")) {
      setShowSwipeHint(true);
      localStorage.setItem("swipeHintSeen", "1");
      const t = setTimeout(() => setShowSwipeHint(false), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  const handleSwipeStart = (
    key: keyof FormState,
    clientX: number,
    el: HTMLElement,
    pointerId: number,
  ) => {
    el.setPointerCapture(pointerId);
    const baseValue =
      key === "purchasePrice"
        ? form.purchasePrice
        : key === "shippingCost"
          ? form.shippingCost
          : key === "omsp"
            ? form.omsp
            : 0;
    swipeRef.current = { key, startX: clientX, baseValue };
  };

  // Live update on every move — computes value from base so stale closures don't accumulate error
  const handleSwipeMove = (clientX: number) => {
    if (!swipeRef.current) return;
    const { key, startX, baseValue } = swipeRef.current;
    const steps = Math.round((clientX - startX) / 32);
    if (key === "purchasePrice") {
      const stepSize = Math.round(50 / (fx.rates[form.currency] ?? 1));
      set("purchasePrice", Math.max(stepSize, baseValue + steps * stepSize));
    } else if (key === "shippingCost") {
      set("shippingCost", Math.max(0, baseValue + steps * 50));
    } else if (key === "omsp") {
      set("omsp", Math.max(1000, baseValue + steps * 50));
    }
  };

  const handleSwipeEnd = () => {
    swipeRef.current = null;
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans overflow-x-hidden selection:bg-black/10 selection:text-black">
      <MinimalHeader />

      {/* ── Sticky "calculating for" summary bar ──────────────────────── */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-black/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[56px] flex items-center justify-between gap-3">
          {/* Left: stacked label+value items, swipeable for editable fields */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
            {/* Purchase price — swipeable */}
            <motion.div
              animate={
                showSwipeHint ? { x: [0, 0, -10, 10, -7, 7, -4, 0] } : { x: 0 }
              }
              transition={showSwipeHint ? { delay: 0.5, duration: 1.0 } : {}}
              className="flex flex-col items-start shrink-0 cursor-ew-resize select-none touch-none active:opacity-70 transition-opacity"
              onPointerDown={(e) =>
                handleSwipeStart(
                  "purchasePrice",
                  e.clientX,
                  e.currentTarget,
                  e.pointerId,
                )
              }
              onPointerMove={(e) => handleSwipeMove(e.clientX)}
              onPointerUp={handleSwipeEnd}
              onPointerCancel={handleSwipeEnd}
            >
              <span className="text-[9px] font-semibold tracking-normal sm:tracking-[0.1em] uppercase text-zinc-400 leading-none mb-[3px]">
                <span className="sm:hidden">Buy</span>
                <span className="hidden sm:inline">Purchase</span>
              </span>
              <span className="text-[13px] sm:text-sm font-bold text-black leading-none">
                {fmt(calc.priceEUR)}
              </span>
            </motion.div>

            {/* Shipping */}
            <motion.div
              animate={
                showSwipeHint ? { x: [0, 0, -10, 10, -7, 7, -4, 0] } : { x: 0 }
              }
              transition={showSwipeHint ? { delay: 0.65, duration: 1.0 } : {}}
              className="flex flex-col items-start shrink-0 cursor-ew-resize select-none touch-none active:opacity-70 transition-opacity"
              onPointerDown={(e) =>
                handleSwipeStart(
                  "shippingCost",
                  e.clientX,
                  e.currentTarget,
                  e.pointerId,
                )
              }
              onPointerMove={(e) => handleSwipeMove(e.clientX)}
              onPointerUp={handleSwipeEnd}
              onPointerCancel={handleSwipeEnd}
            >
              <span className="text-[9px] font-semibold tracking-normal sm:tracking-[0.1em] uppercase text-zinc-400 leading-none mb-[3px]">
                <span className="sm:hidden">Ship</span>
                <span className="hidden sm:inline">Shipping</span>
              </span>
              <span className="text-[13px] sm:text-sm font-bold text-black leading-none">
                {fmt(form.shippingCost)}
              </span>
            </motion.div>

            {/* OMSP */}
            <motion.div
              animate={
                showSwipeHint ? { x: [0, 0, -10, 10, -7, 7, -4, 0] } : { x: 0 }
              }
              transition={showSwipeHint ? { delay: 0.8, duration: 1.0 } : {}}
              className={`flex flex-col items-start shrink-0 select-none touch-none transition-opacity ${form.estimateOmsp ? "" : "cursor-ew-resize active:opacity-70"}`}
              onPointerDown={
                form.estimateOmsp
                  ? undefined
                  : (e) =>
                      handleSwipeStart(
                        "omsp",
                        e.clientX,
                        e.currentTarget,
                        e.pointerId,
                      )
              }
              onPointerMove={
                form.estimateOmsp
                  ? undefined
                  : (e) => handleSwipeMove(e.clientX)
              }
              onPointerUp={form.estimateOmsp ? undefined : handleSwipeEnd}
              onPointerCancel={form.estimateOmsp ? undefined : handleSwipeEnd}
            >
              <span className="text-[9px] font-semibold tracking-normal sm:tracking-[0.1em] uppercase text-zinc-400 leading-none mb-[3px]">
                OMSP
              </span>
              <span className="text-[13px] sm:text-sm font-bold text-black leading-none">
                {fmt(calc.omsp)}
              </span>
            </motion.div>

            {/* Total Landed — read-only */}
            <div className="flex flex-col items-start shrink-0">
              <span className="text-[9px] font-semibold tracking-normal sm:tracking-[0.1em] uppercase text-zinc-400 leading-none mb-[3px]">
                <span className="hidden sm:inline">Total </span>Landed
              </span>
              <span className="text-[13px] sm:text-sm font-bold text-[#4da8da] leading-none">
                {fmt(calc.totalLanded)}
              </span>
            </div>
          </div>

          {/* Right: Change button */}
          <button
            onClick={scrollToForm}
            className="flex items-center gap-1 text-[11px] font-bold text-sky-500 hover:text-white hover:bg-sky-500 border border-sky-400/40 hover:border-sky-500 rounded-lg px-3 py-1.5 transition-all duration-200 shrink-0"
          >
            Change <ChevronDown size={12} />
          </button>
        </div>

        {/* First-time swipe hint */}
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-sky-500"
            >
              <div className="flex items-center justify-center gap-3 py-2">
                <motion.span
                  animate={{ x: [-5, 0, -5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.1,
                    ease: "easeInOut",
                  }}
                  className="text-white/90 text-sm font-bold select-none"
                >
                  ←
                </motion.span>
                <span className="text-[11px] text-white font-semibold tracking-widest uppercase">
                  swipe values to adjust
                </span>
                <motion.span
                  animate={{ x: [5, 0, 5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.1,
                    ease: "easeInOut",
                  }}
                  className="text-white/90 text-sm font-bold select-none"
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal immediate y={30} duration={0.8} className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-6 leading-[0.95]">
              Ireland Landed
              <br />
              Cost Calculator
            </h1>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
              Calculate the exact customs duty, VAT and VRT you'll pay to import
              any car into Ireland — based on 2026 Revenue rates and current EU
              trade agreements.
            </p>
          </Reveal>

          {/* ── Two-column: Form | Results ──────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 max-w-6xl mx-auto items-start">
            {/* LEFT — Inputs ─────────────────────────────────────────────── */}
            <Reveal
              immediate
              id="calculator-inputs"
              x={-30}
              y={0}
              delay={0.2}
              duration={0.8}
              className="space-y-5 scroll-mt-36"
            >
              {/* Card: Vehicle Details */}
              <Card title="Vehicle Details">
                {/* Fuel type toggle */}
                <Field label="Fuel Type">
                  <div className="grid grid-cols-4 gap-2">
                    {(["ev", "hybrid", "petrol", "diesel"] as FuelType[]).map(
                      (ft) => (
                        <button
                          key={ft}
                          onClick={() => set("fuelType", ft)}
                          className={`py-3 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                            form.fuelType === ft
                              ? "bg-black text-white shadow-sm"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        >
                          {ft === "ev"
                            ? "EV"
                            : ft.charAt(0).toUpperCase() + ft.slice(1)}
                        </button>
                      ),
                    )}
                  </div>
                </Field>

                {/* CO₂ — hidden for EVs */}
                {!calc.isEV && (
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="CO₂ Emissions (g/km)">
                      <TextInput
                        type="number"
                        value={form.co2}
                        onChange={(v) => set("co2", Number(v))}
                        min={1}
                        max={500}
                      />
                    </Field>
                    <Field label="CO₂ Standard">
                      <SelectInput
                        value={form.co2Standard}
                        onChange={(v) => set("co2Standard", v as CO2Standard)}
                        options={[
                          { value: "wltp", label: "WLTP (2020+)" },
                          { value: "nedc", label: "NEDC (pre-2020)" },
                        ]}
                      />
                    </Field>
                  </div>
                )}

                {/* NEDC conversion warning */}
                {form.co2Standard === "nedc" &&
                  !calc.isEV &&
                  !calc.isClassic && (
                    <Alert variant="warning">
                      Older cars quote CO₂ on the NEDC scale, but Revenue
                      recalculates it to the newer WLTP scale — which raises the
                      number and can push the car into a higher VRT band. We've
                      used the converted figure:{" "}
                      <strong>{calc.effectiveCO2.toFixed(1)} g/km</strong>
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
                      onChange={(v) => set("nox", Number(v))}
                      disabled={!form.hasNoxData}
                      min={0}
                      max={500}
                    />
                    {!form.hasNoxData && (
                      <p className="text-xs text-zinc-400">
                        Using default for {form.fuelType} (
                        {DEFAULT_NOX[form.fuelType]} mg/km). Enter your value
                        for a precise NOx levy.
                      </p>
                    )}
                  </div>
                )}

                {/* Month + Year first registered */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Month First Registered">
                    <SelectInput
                      value={String(form.monthFirstReg)}
                      onChange={(v) => set("monthFirstReg", Number(v))}
                      options={MONTH_NAMES.map((m, i) => ({
                        value: String(i + 1),
                        label: m,
                      }))}
                    />
                  </Field>
                  <Field label="Year First Registered">
                    <TextInput
                      type="number"
                      value={form.yearFirstReg}
                      onChange={(v) => set("yearFirstReg", Number(v))}
                      min={1950}
                      max={now.year}
                    />
                  </Field>
                </div>

                {/* Mileage */}
                <Field label="Mileage at Import (km)">
                  <TextInput
                    type="number"
                    value={form.mileageKm}
                    onChange={(v) => set("mileageKm", Number(v))}
                    min={0}
                  />
                </Field>

                {/* Age at import — auto-calculated, read-only but visible */}
                <Field label="Age at Import (months since first registration)">
                  <div className="flex items-center justify-between gap-3 w-full px-4 py-3 bg-zinc-100 border border-black/10 rounded-xl">
                    <span className="text-black font-semibold">
                      {calc.ageMonths}{" "}
                      {calc.ageMonths === 1 ? "month" : "months"}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {MONTH_NAMES[form.monthFirstReg - 1]} {form.yearFirstReg}{" "}
                      → today · auto-calculated
                    </span>
                  </div>
                </Field>

                {/* Classic notice */}
                {calc.isClassic && (
                  <Alert variant="success">
                    This vehicle is <strong>30+ years old</strong> — Category C
                    classic. VRT is a flat <strong>€200</strong> regardless of
                    value or emissions.
                  </Alert>
                )}

                {/* EV deadline toggle */}
                {calc.isEV && (
                  <Field label="Registering before 31 December 2026?">
                    <div className="grid grid-cols-2 gap-2">
                      {[true, false].map((v) => (
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
                  <Field label="Country of Manufacture (where the car was built)">
                    <SelectInput
                      value={form.countryOfManufacture}
                      onChange={(v) => set("countryOfManufacture", v)}
                      options={[
                        { value: "japan", label: "Japan" },
                        { value: "uk", label: "United Kingdom" },
                        { value: "eu", label: "EU-built" },
                        { value: "other", label: "Other / Unknown" },
                      ]}
                    />
                  </Field>
                  <Field label="Source Country (where you're buying from)">
                    <SelectInput
                      value={form.sourceCountry}
                      onChange={(v) => set("sourceCountry", v)}
                      options={[
                        { value: "japan", label: "Japan" },
                        { value: "uk_gb", label: "UK / Great Britain" },
                        { value: "eu", label: "EU (Germany, France…)" },
                        {
                          value: "northern_ireland",
                          label: "Northern Ireland",
                        },
                        { value: "india", label: "India" },
                        { value: "australia", label: "Australia" },
                        { value: "new_zealand", label: "New Zealand" },
                      ]}
                    />
                  </Field>
                </div>

                {/* Duty rate indicator */}
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl border ${
                    calc.dutyRate === 0
                      ? "bg-emerald-50 border-emerald-200/60"
                      : "bg-amber-50 border-amber-200/60"
                  }`}
                >
                  {calc.dutyRate === 0 ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      calc.dutyRate === 0
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {getDutyExplanation(
                      form.countryOfManufacture,
                      form.sourceCountry,
                    )}
                  </p>
                </div>

                {/* New Means of Transport warning */}
                {calc.isNMOT && (
                  <Alert variant="warning">
                    Even though it's from the EU/NI, this car still counts as{" "}
                    <strong>"new"</strong> for VAT — it's under 6 months old{" "}
                    <em>or</em> has done under 6,000 km, so{" "}
                    <strong>23% Irish VAT applies</strong>. A car only comes in
                    VAT-free once it's <em>both</em> over 6 months old{" "}
                    <em>and</em> over 6,000 km.
                  </Alert>
                )}

                {/* EU/NI VAT-free confirmation */}
                {(form.sourceCountry === "eu" ||
                  form.sourceCountry === "northern_ireland") &&
                  !calc.isNMOT && (
                    <Alert variant="success">
                      No Irish VAT to pay. This car counts as{" "}
                      <strong>used</strong> — it's over 6 months old{" "}
                      <em>and</em> has done more than 6,000 km — so importing it
                      from the EU/NI is VAT-free.
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
                        onChange={(v) => set("purchasePrice", Number(v))}
                        min={0}
                      />
                    </Field>
                  </div>
                  <Field label="Currency">
                    <SelectInput
                      value={form.currency}
                      onChange={(v) => set("currency", v)}
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
                    ≈ {fmt(calc.priceEUR)}{" "}
                    {fx.source === "ecb"
                      ? `at ECB reference rate${fx.date ? ` (${fx.date})` : ""}`
                      : "at indicative mid-market rate"}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                      Shipping & Transport (€)
                    </label>
                    <button
                      onClick={() =>
                        set("useEstShipping", !form.useEstShipping)
                      }
                      className="text-xs font-medium text-sky-500 hover:text-sky-600 transition-colors"
                    >
                      {form.useEstShipping
                        ? "Enter exact amount"
                        : "Use estimate"}
                    </button>
                  </div>
                  <TextInput
                    type="number"
                    value={form.shippingCost}
                    onChange={(v) => set("shippingCost", Number(v))}
                    disabled={form.useEstShipping}
                    min={0}
                  />
                  {form.useEstShipping && (
                    <p className="text-xs text-zinc-400">
                      Typical shipping for{" "}
                      {form.sourceCountry.replace("_", " / ")}, including port
                      charges and marine insurance. Switch to "Enter exact
                      amount" if you have a quote.
                    </p>
                  )}
                </div>
              </Card>

              {/* Card: Irish Market Value */}
              <Card title="Irish Market Value (OMSP)">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                    {form.estimateOmsp
                      ? "Estimate OMSP from price when new"
                      : "Irish Open Market Selling Price (€)"}
                  </label>
                  <button
                    onClick={() => set("estimateOmsp", !form.estimateOmsp)}
                    className="text-xs font-medium text-sky-500 hover:text-sky-600 transition-colors"
                  >
                    {form.estimateOmsp
                      ? "I know the OMSP"
                      : "Help me estimate it"}
                  </button>
                </div>

                {!form.estimateOmsp ? (
                  <>
                    <TextInput
                      type="number"
                      value={form.omsp}
                      onChange={(v) => set("omsp", Number(v))}
                      min={0}
                    />
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-black/5 rounded-xl">
                      <Info className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        VRT is charged on the car's{" "}
                        <strong className="text-zinc-700">OMSP</strong> —
                        Revenue's view of what it would sell for in an Irish
                        showroom today, not what you paid abroad. You can look
                        yours up with the official{" "}
                        <a
                          href="https://www.revenue.ie/en/importing-vehicles-duty-free-allowances/guide-to-vrt/index.aspx"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-500 hover:text-sky-600 underline underline-offset-2 transition-colors"
                        >
                          Revenue VRT estimator
                        </a>{" "}
                        or by checking similar cars on{" "}
                        <a
                          href="https://www.carzone.ie"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-500 hover:text-sky-600 underline underline-offset-2 transition-colors"
                        >
                          carzone.ie
                        </a>
                        . Not sure? Tap{" "}
                        <strong className="text-zinc-700">
                          "Help me estimate it"
                        </strong>{" "}
                        above.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Field label="Price when new in Ireland (€)">
                      <TextInput
                        type="number"
                        value={form.omspNew}
                        onChange={(v) => set("omspNew", Number(v))}
                        min={0}
                      />
                    </Field>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                          How well it holds value
                        </label>
                        <button
                          onClick={() =>
                            set("useAdvancedCode", !form.useAdvancedCode)
                          }
                          className="text-xs font-medium text-sky-500 hover:text-sky-600 transition-colors"
                        >
                          {form.useAdvancedCode
                            ? "Use simple groups"
                            : "Advanced: Revenue code"}
                        </button>
                      </div>
                      {!form.useAdvancedCode ? (
                        <>
                          <SelectInput
                            value={form.depGroup}
                            onChange={(v) => set("depGroup", v)}
                            options={DEPRECIATION_GROUPS.map((g) => ({
                              value: g.key,
                              label: g.label,
                            }))}
                          />
                          <p className="text-xs text-zinc-400">
                            {
                              DEPRECIATION_GROUPS.find(
                                (g) => g.key === form.depGroup,
                              )?.hint
                            }
                          </p>
                        </>
                      ) : (
                        <>
                          <SelectInput
                            value={form.depCode}
                            onChange={(v) =>
                              set("depCode", v as DepreciationCode)
                            }
                            options={Object.keys(DEPRECIATION_TABLES).map(
                              (c) => ({ value: c, label: `Table ${c}` }),
                            )}
                          />
                          <p className="text-xs text-zinc-400">
                            Revenue depreciation table (A* holds value best → K*
                            depreciates fastest).
                          </p>
                        </>
                      )}
                    </div>

                    <Field label="Condition at import">
                      <SelectInput
                        value={form.condition}
                        onChange={(v) =>
                          set("condition", v as VehicleCondition)
                        }
                        options={[
                          { value: "good", label: "Good — no notable damage" },
                          { value: "fair", label: "Fair — minor wear (−5%)" },
                          { value: "poor", label: "Poor — needs work (−10%)" },
                        ]}
                      />
                    </Field>

                    {/* Estimated OMSP result */}
                    {calc.omspEstimate && (
                      <div className="p-4 bg-zinc-50 border border-black/5 rounded-xl space-y-2">
                        <div className="flex items-end justify-between">
                          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                            Estimated OMSP
                          </span>
                          <span className="text-2xl font-bold text-black tracking-tight">
                            {fmt(calc.omsp)}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 leading-relaxed border-t border-black/5 pt-2 space-y-0.5">
                          <div className="flex justify-between">
                            <span>
                              Depreciated to {calc.omspEstimate.residualPct}%
                              (Table {calc.depCode}, {calc.ageYears}-yr)
                            </span>
                            <span>
                              {fmt(calc.omspEstimate.afterDepreciation)}
                            </span>
                          </div>
                          {calc.omspEstimate.monthlyAdjustmentPct !== 0 && (
                            <div className="flex justify-between">
                              <span>
                                {MONTH_NAMES[now.month - 1]} registration
                                adjustment
                              </span>
                              <span>
                                {calc.omspEstimate.monthlyAdjustmentPct > 0
                                  ? "+"
                                  : ""}
                                {Math.round(
                                  calc.omspEstimate.monthlyAdjustmentPct * 100,
                                )}
                                %
                              </span>
                            </div>
                          )}
                          {calc.omspEstimate.conditionReduction > 0 && (
                            <div className="flex justify-between">
                              <span>Condition reduction</span>
                              <span>
                                –{fmt(calc.omspEstimate.conditionReduction)}
                              </span>
                            </div>
                          )}
                          {calc.omspEstimate.kmRelief > 0 && (
                            <div className="flex justify-between">
                              <span>Excess-mileage relief</span>
                              <span>–{fmt(calc.omspEstimate.kmRelief)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-black/5 rounded-xl">
                      <Info className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        This follows Revenue's own method (VRT Manual Part 8):
                        we take the car's price when new, apply the age-based
                        depreciation table, then adjust for the registration
                        month, condition and any excess mileage. It's a close
                        estimate — Revenue confirms the final OMSP at the NCTS
                        inspection.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </Reveal>

            {/* RIGHT — Results ─────────────────────────────────────────────── */}
            <Reveal
              immediate
              x={30}
              y={0}
              delay={0.3}
              duration={0.8}
              className="lg:sticky lg:top-24 space-y-4"
            >
              <div className="bg-zinc-50 border border-black/5 rounded-[2rem] p-7 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
                {/* Header */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="p-3 bg-black text-white rounded-2xl">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black tracking-tight">
                      Cost Breakdown
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Indicative 2026 figures
                    </p>
                  </div>
                </div>

                {/* Line items */}
                <div className="space-y-3">
                  {/* Base costs */}
                  <CostLine
                    label="Purchase Price"
                    value={fmt(calc.priceEUR)}
                    sub={
                      form.currency !== "EUR"
                        ? `${form.purchasePrice.toLocaleString()} ${form.currency}`
                        : undefined
                    }
                  />
                  <CostLine
                    label="Shipping & Transport"
                    value={fmt(form.shippingCost)}
                  />

                  <div className="border-t border-black/8 pt-3">
                    <CostLine
                      label="CIF Value"
                      value={fmt(calc.cifValue)}
                      bold
                      sub="Cost + Insurance + Freight"
                    />
                  </div>

                  {/* Tax section */}
                  <div className="border-t border-black/8 pt-3 space-y-3">
                    <p className="text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                      Irish Import Taxes
                    </p>

                    <CostLine
                      label={`Customs Duty (${pct(calc.dutyRate)})`}
                      value={
                        calc.customsDuty === 0 ? "€0" : fmt(calc.customsDuty)
                      }
                      accent={calc.customsDuty === 0 ? "green" : "red"}
                      sub={
                        calc.customsDuty === 0
                          ? "Preferential rate applies"
                          : undefined
                      }
                    />

                    <CostLine
                      label={
                        calc.vatNeeded
                          ? "VAT (23%)"
                          : "VAT (0% — used vehicle from EU/NI)"
                      }
                      value={calc.vatNeeded ? fmt(calc.vatAmount) : "€0"}
                      accent={calc.vatNeeded ? "neutral" : "green"}
                      sub={
                        calc.vatNeeded
                          ? `On CIF + duty: ${fmt(calc.vatBase)}`
                          : undefined
                      }
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
                        sub={`${calc.effectiveCO2.toFixed(0)} g/km WLTP · OMSP ${fmt(calc.omsp)}`}
                      />
                    )}

                    {!calc.isClassic && (
                      <CostLine
                        label="NOx Levy"
                        value={calc.noxLevy === 0 ? "€0" : fmt(calc.noxLevy)}
                        accent={calc.noxLevy === 0 ? "green" : "neutral"}
                        sub={
                          calc.noxLevy === 0
                            ? "Battery EV — zero NOx"
                            : undefined
                        }
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

                  {/* Service fees not included in the landed total */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <Info className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      This figure covers taxes and shipping only. Our customs
                      clearance handling, and optional door delivery from the
                      port if you'd like the car brought to you, are charged
                      separately —{" "}
                      <span className="text-zinc-700 font-medium">
                        ask us for a fixed quote
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* Export & share */}
              <div className="bg-white border border-black/5 rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
                <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                  Save & Share
                </p>

                {/* Download PDF */}
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-black text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Preparing
                      PDF…
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" /> Download breakdown (PDF)
                    </>
                  )}
                </button>

                {/* Email it */}
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase block">
                    Email this breakdown
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      value={emailTo}
                      onChange={(e) => {
                        setEmailTo(e.target.value);
                        setEmailStatus(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isSendingEmail)
                          handleSendEmail();
                      }}
                      className="flex-1 min-w-0 px-4 py-3 bg-zinc-50 border border-black/10 rounded-xl text-black font-medium
                        focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 transition-all hover:border-black/20"
                    />
                    <button
                      onClick={handleSendEmail}
                      disabled={isSendingEmail || !emailValid}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      {isSendingEmail ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Mail className="h-4 w-4" /> Send
                        </>
                      )}
                    </button>
                  </div>
                  {emailStatus && (
                    <p
                      className={`text-xs font-medium ${emailStatus.ok ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {emailStatus.msg}
                    </p>
                  )}
                  <p className="text-xs text-zinc-400">
                    We'll email the full cost breakdown with a branded PDF
                    attached.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/import-japanese-cars-to-ireland"
                className="group flex items-center justify-between w-full px-7 py-5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold text-base transition-all duration-300 shadow-[0_10px_40px_rgba(14,165,233,0.25)]"
              >
                <span>Source This Vehicle With Providence</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-center text-xs text-zinc-400">
                We handle customs, VRT, NCTS and delivery end-to-end
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── How Irish import tax works ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-zinc-50 border-t border-black/5 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Reveal y={30} duration={0.8} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black mb-4">
              How Irish import tax works
            </h2>
            <p className="text-lg text-zinc-500 font-light max-w-xl mx-auto">
              Three charges stack in order. Each is calculated on top of the
              last.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                title: "Customs Duty",
                color: "bg-blue-50 border-blue-100",
                dot: "bg-blue-500",
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
                dot: "bg-purple-500",
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
                dot: "bg-amber-500",
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
              <Reveal
                key={i}
                y={30}
                delay={i * 0.1}
                duration={0.8}
                className={`p-6 rounded-[1.5rem] border ${card.color}`}
              >
                <div className="flex items-baseline gap-3 mb-5">
                  <span className={`text-5xl font-black ${card.numColor}`}>
                    {card.num}
                  </span>
                  <h3 className="text-lg font-bold text-black">{card.title}</h3>
                </div>
                <ul className="space-y-2">
                  {card.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-zinc-600"
                    >
                      <span
                        className={`mt-[6px] h-1.5 w-1.5 rounded-full flex-shrink-0 ${card.dot}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive customs-duty flowchart ───────────────────────────── */}
      <section className="py-24 px-6 bg-white border-t border-black/5">
        <div className="max-w-3xl mx-auto">
          <Reveal y={30} duration={0.8} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black mb-4">
              Will you pay customs duty?
            </h2>
            <p className="text-lg text-zinc-500 font-light max-w-xl mx-auto">
              Duty depends on two things: where the car was built and where
              you're buying it. Change either below to see the rate — and your
              VAT — update.
            </p>
          </Reveal>
          <Reveal y={20} delay={0.1} duration={0.8}>
            <DutyFlowchart />
          </Reveal>
        </div>
      </section>

      {/* ── VRT band reference table ─────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-t border-black/5">
        <div className="max-w-4xl mx-auto">
          <Reveal y={30} duration={0.8} className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-black mb-3">
              2026 VRT CO₂ Band Reference
            </h2>
            <p className="text-zinc-500 font-light">
              VRT is a percentage of Irish OMSP. Lower emissions = dramatically
              less tax.
            </p>
          </Reveal>

          <Reveal
            y={20}
            delay={0.1}
            duration={0.8}
            className="overflow-hidden rounded-[1.5rem] border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-black/5">
                  <th className="text-left px-6 py-4 font-bold text-black tracking-tight">
                    CO₂ (g/km WLTP)
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-black tracking-tight">
                    VRT Rate
                  </th>
                  <th className="text-left px-6 py-4 font-bold text-black tracking-tight hidden sm:table-cell">
                    Typical Vehicle
                  </th>
                  <th className="text-right px-6 py-4 font-bold text-black tracking-tight">
                    On €20k OMSP
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["0 – 50", "7%", "Battery EV, plug-in hybrid", "€1,400"],
                  ["51 – 80", "9%", "Efficient full hybrid", "€1,800"],
                  ["81 – 90", "9.75–10.5%", "Hybrid / small petrol", "~€2,025"],
                  ["91 – 100", "11.25–12%", "Small modern petrol", "~€2,325"],
                  ["101 – 110", "12.75–13.5%", "Mid-size petrol", "~€2,625"],
                  [
                    "111 – 120",
                    "15.25–16%",
                    "Larger petrol / small diesel",
                    "~€3,125",
                  ],
                  [
                    "121 – 135",
                    "16.75–19.25%",
                    "Diesel saloon / compact SUV",
                    "~€3,600",
                  ],
                  ["136 – 150", "20–25%", "Mid-size SUV", "~€4,500"],
                  [
                    "151 – 170",
                    "27.5–30%",
                    "Large SUV / large diesel",
                    "~€5,750",
                  ],
                  ["171 – 190", "35%", "Large premium SUV / V6", "€7,000"],
                  ["Over 190", "41%", "Performance / luxury / 4x4", "€8,200"],
                ].map(([co2, rate, vehicle, cost], i) => (
                  <tr
                    key={i}
                    className={`border-b border-black/5 last:border-0 transition-colors hover:bg-zinc-50 ${
                      i < 3
                        ? "text-emerald-700"
                        : i < 6
                          ? "text-zinc-700"
                          : "text-red-600"
                    }`}
                  >
                    <td className="px-6 py-3.5 font-mono text-xs font-medium">
                      {co2}
                    </td>
                    <td className="px-6 py-3.5 font-bold">{rate}</td>
                    <td className="px-6 py-3.5 text-zinc-500 hidden sm:table-cell">
                      {vehicle}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-right">{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────────────────── */}
      <section className="py-10 px-6 bg-zinc-50 border-t border-black/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-black/5">
            <Info className="h-5 w-5 text-zinc-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-zinc-500 leading-relaxed">
              <strong className="text-zinc-700">Disclaimer:</strong> This
              calculator provides indicative estimates based on 2026 Revenue
              rates and current EU trade agreements. VRT is charged on Revenue's
              OMSP, confirmed only at NCTS inspection. Exchange rates are
              indicative mid-market figures. Tax rates, VRT bands,
              trade-agreement tariff schedules and reliefs change — the BEV
              relief and VRT bands are reviewed each Budget. This is not legal,
              financial or tax advice. Always verify with{" "}
              <span className="text-zinc-700 font-medium">revenue.ie</span>, the
              NCTS and a licensed customs agent before committing to a purchase.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Card({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="bg-white border border-black/5 rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5 scroll-mt-32"
    >
      <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
  value,
  onChange,
  disabled,
  type,
  min,
  max,
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
      onChange={(e) => onChange(e.target.value)}
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
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-zinc-50 border border-black/10 rounded-xl text-black font-medium
        focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30
        hover:border-black/20 transition-all appearance-none cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// Interactive customs-duty explainer. Reuses the exact getCustomsDutyRate /
// vatApplies logic so it can never drift from the calculator.
function DutyFlowchart() {
  const [src, setSrc] = useState("japan");
  const [mfr, setMfr] = useState("japan");

  const isEUNI = src === "eu" || src === "northern_ireland";
  const dutyRate = getCustomsDutyRate(mfr, src);
  const outcome = isEUNI
    ? "eu"
    : mfr === "japan"
      ? "japan"
      : mfr === "uk"
        ? "uk"
        : "other";

  const outClass = (id: string, zero: boolean) => {
    const active = !isEUNI ? outcome === id : id === "eu";
    if (!active) return "border-black/5 bg-white opacity-40";
    return zero
      ? "border-emerald-300 bg-emerald-50"
      : "border-amber-300 bg-amber-50";
  };

  return (
    <div className="bg-zinc-50 border border-black/5 rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Field label="Country of manufacture (where built)">
          <SelectInput
            value={mfr}
            onChange={setMfr}
            options={[
              { value: "japan", label: "Japan" },
              { value: "uk", label: "United Kingdom" },
              { value: "eu", label: "EU-built" },
              { value: "other", label: "Other / Unknown" },
            ]}
          />
        </Field>
        <Field label="Source country (buying from)">
          <SelectInput
            value={src}
            onChange={setSrc}
            options={[
              { value: "japan", label: "Japan" },
              { value: "uk_gb", label: "UK / Great Britain" },
              { value: "eu", label: "EU (Germany, France…)" },
              { value: "northern_ireland", label: "Northern Ireland" },
              { value: "india", label: "India" },
              { value: "australia", label: "Australia" },
              { value: "new_zealand", label: "New Zealand" },
            ]}
          />
        </Field>
      </div>

      {/* Result tiles */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div
          className={`rounded-2xl p-4 border ${dutyRate === 0 ? "bg-emerald-50 border-emerald-200/70" : "bg-amber-50 border-amber-200/70"}`}
        >
          <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Customs duty
          </p>
          <p
            className={`text-3xl font-bold ${dutyRate === 0 ? "text-emerald-600" : "text-amber-600"}`}
          >
            {Math.round(dutyRate * 100)}%
          </p>
        </div>
        <div className="rounded-2xl p-4 border bg-white border-black/5">
          <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            VAT on import
          </p>
          <p className="text-3xl font-bold text-black">
            {isEUNI ? "0 / 23%" : "23%"}
          </p>
          <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
            {isEUNI
              ? "0% if used (>6 mths & >6,000 km), else 23%"
              : "Always applies outside the EU"}
          </p>
        </div>
      </div>

      {/* Flow */}
      <div className="flex flex-col items-center">
        <FlowBox>Car imported into Ireland</FlowBox>
        <FlowArrow />
        <div className="px-5 py-3 rounded-2xl border border-black/10 bg-white text-sm font-semibold text-black text-center">
          Is the source the EU or Northern Ireland?
        </div>

        <div className="mt-4 flex w-full justify-center gap-6 sm:gap-12 items-start">
          {/* YES */}
          <div className="flex-1 max-w-[200px] flex flex-col items-center">
            <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
              Yes ↓
            </span>
            <div
              className={`w-full text-center rounded-xl border p-3 transition-all ${outClass("eu", true)}`}
            >
              <p className="text-xl font-bold text-black">0%</p>
              <p className="text-[11px] text-zinc-500">EU / NI single market</p>
            </div>
          </div>

          {/* NO */}
          <div className="flex-1 max-w-[300px] flex flex-col items-center">
            <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
              No ↓
            </span>
            <div
              className={`w-full px-4 py-3 rounded-2xl border text-sm font-semibold text-center transition-all ${isEUNI ? "border-black/5 bg-white opacity-40" : "border-black/10 bg-white text-black"}`}
            >
              Where was the car built?
            </div>
            <FlowArrow dim={isEUNI} />
            <div className="grid grid-cols-3 gap-2 w-full">
              <div
                className={`text-center rounded-xl border p-2.5 transition-all ${outClass("japan", true)}`}
              >
                <p className="text-base font-bold text-black">0%</p>
                <p className="text-[10px] text-zinc-500">Japan · EPA</p>
              </div>
              <div
                className={`text-center rounded-xl border p-2.5 transition-all ${outClass("uk", true)}`}
              >
                <p className="text-base font-bold text-black">0%</p>
                <p className="text-[10px] text-zinc-500">UK · TCA</p>
              </div>
              <div
                className={`text-center rounded-xl border p-2.5 transition-all ${outClass("other", false)}`}
              >
                <p className="text-base font-bold text-black">10%</p>
                <p className="text-[10px] text-zinc-500">Other · WTO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2.5 rounded-xl border border-black/5 bg-white text-sm text-zinc-700">
      {children}
    </div>
  );
}

function FlowArrow({ dim }: { dim?: boolean }) {
  return (
    <div className={`text-zinc-300 py-1.5 ${dim ? "opacity-40" : ""}`}>↓</div>
  );
}

function Alert({
  variant,
  children,
}: {
  variant: "warning" | "success";
  children: React.ReactNode;
}) {
  const styles =
    variant === "warning"
      ? {
          wrap: "bg-amber-50 border-amber-200/60",
          icon: "text-amber-500",
          text: "text-amber-700",
        }
      : {
          wrap: "bg-emerald-50 border-emerald-200/60",
          icon: "text-emerald-500",
          text: "text-emerald-700",
        };
  const Icon = variant === "warning" ? AlertTriangle : CheckCircle;
  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-xl ${styles.wrap}`}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${styles.icon}`} />
      <p className={`text-sm ${styles.text}`}>{children}</p>
    </div>
  );
}

function CostLine({
  label,
  value,
  sub,
  bold,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  bold?: boolean;
  accent?: "green" | "red" | "neutral";
}) {
  const color =
    accent === "green"
      ? "text-emerald-600"
      : accent === "red"
        ? "text-red-500"
        : "text-black";
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p
          className={`text-sm leading-snug ${bold ? "font-bold text-black" : "text-zinc-500"}`}
        >
          {label}
        </p>
        {sub && (
          <p className="text-xs text-zinc-400 mt-0.5 leading-snug">{sub}</p>
        )}
      </div>
      <p
        className={`text-sm font-bold flex-shrink-0 ${bold ? "text-base" : ""} ${color}`}
      >
        {value}
      </p>
    </div>
  );
}
