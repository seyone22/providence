"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  type AuctionSheetExtract,
  analyzeMarket,
  extractAuctionSheet,
  type GbpFxRates,
  getVerdict,
  type MarketAnalysis,
  saveSourcingAnalysis,
  type Verdict,
} from "@/actions/sourcing-actions";
import { generateSourcingPdf } from "@/actions/sourcing-pdf-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { computeMarketStats, type NormalizedListing } from "@/lib/market-stats";
import {
  computeLandedCost,
  DUTY_LABELS,
  FTA_COUNTRIES,
  fmtGBP,
  fmtPct,
  ORIGIN_COUNTRY_LABELS,
  type OriginCountry,
  POST_BORDER_DEFAULTS,
  postBorderForAge,
  resolveTaxTreatment,
} from "@/lib/uk-landed-cost";

// Fuel types offered for the vehicle.
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"] as const;
const TRANSMISSIONS = ["Automatic", "Manual"] as const;

// Normalise + tokenise for building the search/match keywords (mirrors the
// server matcher): lowercase, punctuation → spaces, drop 1-char noise.
function tokens(s: string): string[] {
  return Array.from(
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(" ")
        .filter((w) => w.length > 1),
    ),
  );
}

// Verdict → colour + label styling.
const VERDICT_STYLE: Record<
  Verdict["recommendation"],
  { label: string; cls: string }
> = {
  source: { label: "Worth sourcing", cls: "bg-emerald-100 text-emerald-800" },
  marginal: { label: "Marginal", cls: "bg-amber-100 text-amber-800" },
  avoid: { label: "Avoid", cls: "bg-red-100 text-red-800" },
};

// Currencies offered on the auction-cost side (JPY is primary).
const CURRENCIES = ["JPY", "USD", "EUR"] as const;

const num = (s: string) => {
  const n = Number.parseFloat(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

function Field({
  label,
  value,
  onChange,
  prefix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-zinc-600">{label}</Label>
      <div className="relative">
        {prefix ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
            {prefix}
          </span>
        ) : null}
        <Input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={prefix ? "pl-7" : ""}
        />
      </div>
      {hint ? <p className="text-[11px] text-zinc-400">{hint}</p> : null}
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  sub,
  strong,
}: {
  label: string;
  value: string;
  sub?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-zinc-100 last:border-0">
      <div>
        <p
          className={
            strong
              ? "text-sm font-semibold text-zinc-900"
              : "text-sm text-zinc-600"
          }
        >
          {label}
        </p>
        {sub ? <p className="text-[11px] text-zinc-400 mt-0.5">{sub}</p> : null}
      </div>
      <p
        className={
          strong
            ? "text-sm font-bold text-zinc-900 tabular-nums"
            : "text-sm font-medium text-zinc-800 tabular-nums"
        }
      >
        {value}
      </p>
    </div>
  );
}

// Read a File as a bare base64 string (no data: prefix).
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function LandedCostClient({ fx }: { fx: GbpFxRates }) {
  // ── Vehicle (shared intake — also drives the future market search) ──────────
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [edition, setEdition] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuel, setFuel] = useState<(typeof FUEL_TYPES)[number]>("Petrol");
  const [engine, setEngine] = useState(""); // e.g. "3.0 V6"
  const [transmission, setTransmission] =
    useState<(typeof TRANSMISSIONS)[number]>("Automatic");

  // ── Auction-sheet upload / extraction state ─────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extract, setExtract] = useState<AuctionSheetExtract | null>(null);

  // ── Usage this session (read from API responses — no extra credits) ─────────
  const [extractTokens, setExtractTokens] = useState(0);
  const [verdictTokens, setVerdictTokens] = useState(0);
  const [aiModel, setAiModel] = useState("");

  async function handleSheetUpload(file: File | undefined) {
    if (!file) return;
    setExtracting(true);
    setExtractError(null);
    try {
      const dataBase64 = await fileToBase64(file);
      const res = await extractAuctionSheet({
        dataBase64,
        mimeType: file.type,
      });
      if (!res.success) {
        setExtractError(res.message);
        toast.error("Extraction failed", { description: res.message });
        return;
      }
      const d = res.data;
      setExtract(d);
      // Pre-fill the editable fields; operator reviews before relying on them.
      if (d.make) setMake(d.make);
      if (d.model) setModel(d.model);
      if (d.trimGrade) setEdition(d.trimGrade);
      if (d.year) setYear(String(d.year));
      if (d.mileageMiles) setMileage(String(d.mileageMiles));
      if (d.fuel) {
        const f = d.fuel.toLowerCase();
        const matched = FUEL_TYPES.find((t) => f.includes(t.toLowerCase()));
        // Gemini returns "Gasoline" for petrol — map it.
        setFuel(matched ?? (f.includes("gasolin") ? "Petrol" : "Petrol"));
      }
      if (d.displacementCc && d.displacementCc > 0) {
        setEngine(`${(d.displacementCc / 1000).toFixed(1)}L`);
      }
      if (d.transmission) {
        setTransmission(
          /manual/i.test(d.transmission) ? "Manual" : "Automatic",
        );
      }
      setExtractTokens(res.tokens);
      setAiModel(res.model);
      const filled = [d.make, d.model, d.year, d.mileageMiles].filter(
        Boolean,
      ).length;
      toast.success("Auction sheet translated", {
        description: `${filled} key field${filled === 1 ? "" : "s"} filled — review the details below.`,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Could not read the file.";
      setExtractError(msg);
      toast.error("Couldn't read the auction sheet", { description: msg });
    } finally {
      setExtracting(false);
    }
  }

  // ── CIF cost components ─────────────────────────────────────────────────────
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("JPY");
  const [hammerPrice, setHammerPrice] = useState("");
  const [auctionExportFees, setAuctionExportFees] = useState("");
  // Auction/export agent fee auto-fills to 7% of the hammer price until the
  // operator edits it manually.
  const [feeManual, setFeeManual] = useState(false);
  useEffect(() => {
    if (!feeManual) {
      const h = num(hammerPrice);
      setAuctionExportFees(h > 0 ? String(Math.round(h * 0.07)) : "");
    }
  }, [hammerPrice, feeManual]);
  const [inlandTransportOrigin, setInlandTransportOrigin] = useState("");
  // Default freight: 260,000 JPY for a 3-car container (editable per shipment).
  const [oceanFreight, setOceanFreight] = useState("260000");
  const [marineInsurance, setMarineInsurance] = useState("");

  // FX — displayed and entered as units-per-GBP (e.g. JPY per GBP), the intuitive
  // direction; converted to GBP-per-unit for the engine. Prefilled from the live
  // rate (which is GBP-per-unit, so inverted here).
  const liveUnitsPerGbp = fx.rates[currency] ? 1 / fx.rates[currency] : 0;
  const [fxRate, setFxRate] = useState(liveUnitsPerGbp.toFixed(2));

  // ── Tax treatment (salesperson-friendly inputs → duty/VAT derived) ──────────
  const [country, setCountry] = useState<OriginCountry>("japan");
  const [hasOriginStatement, setHasOriginStatement] = useState(true); // default Yes
  const [isCommercialPickup, setIsCommercialPickup] = useState(false);

  const vehicleAgeYears = year
    ? new Date().getFullYear() - Number.parseInt(year, 10)
    : null;
  const treatment = useMemo(
    () =>
      resolveTaxTreatment({
        country,
        hasOriginStatement,
        isCommercialPickup,
        vehicleAgeYears,
      }),
    [country, hasOriginStatement, isCommercialPickup, vehicleAgeYears],
  );
  const dutyBasis = treatment.dutyBasis;
  const vatBasis = treatment.vatBasis;

  // ── Post-border GBP costs (editable defaults) ───────────────────────────────
  const [dvlaRegistration, setDvla] = useState(
    String(POST_BORDER_DEFAULTS.dvlaRegistration),
  );
  const [numberPlates, setPlates] = useState(
    String(POST_BORDER_DEFAULTS.numberPlates),
  );
  const [approvalTest, setApproval] = useState(
    String(POST_BORDER_DEFAULTS.approvalTest),
  );
  const [ivaModifications, setMods] = useState(
    String(POST_BORDER_DEFAULTS.ivaModifications),
  );
  const [ukInlandTransport, setUkTransport] = useState(
    String(POST_BORDER_DEFAULTS.ukInlandTransport),
  );
  // Default post-border is the age-based figure; the operator can switch to the
  // itemised breakdown to override.
  const [postBorderDetailed, setPostBorderDetailed] = useState(false);

  const detailedPostBorder =
    num(dvlaRegistration) +
    num(numberPlates) +
    num(approvalTest) +
    num(ivaModifications) +
    num(ukInlandTransport);
  const postBorderTotal = postBorderDetailed
    ? detailedPostBorder
    : postBorderForAge(vehicleAgeYears);

  // GBP per 1 unit of currency, from the JPY-per-GBP the operator enters.
  const fxGbpPerUnit = num(fxRate) > 0 ? 1 / num(fxRate) : 0;

  const result = useMemo(
    () =>
      computeLandedCost({
        currency,
        hammerPrice: num(hammerPrice),
        auctionExportFees: num(auctionExportFees),
        inlandTransportOrigin: num(inlandTransportOrigin),
        oceanFreight: num(oceanFreight),
        marineInsurance: num(marineInsurance),
        fxRate: fxGbpPerUnit,
        dutyBasis,
        vatBasis,
        postBorderTotal,
      }),
    [
      currency,
      hammerPrice,
      auctionExportFees,
      inlandTransportOrigin,
      oceanFreight,
      marineInsurance,
      fxGbpPerUnit,
      dutyBasis,
      vatBasis,
      postBorderTotal,
    ],
  );

  const cifLabel = `${currency} ${Math.round(result.cifOriginal).toLocaleString()}`;

  // ── Market crawl + verdict (decoupled: crawl runs while costs are filled) ───
  const router = useRouter();
  const [crawling, setCrawling] = useState(false);
  const [verdicting, setVerdicting] = useState(false);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [market, setMarket] = useState<MarketAnalysis | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  // Operator-configurable match tolerances (defaults ±1 year, ±20% mileage).
  const [yearBand, setYearBand] = useState("1");
  const [mileagePctInput, setMileagePctInput] = useState("20");
  const [showAllScraped, setShowAllScraped] = useState(false);

  // The comparable listings, held in editable state so the operator can drop a
  // car that doesn't fit — all stats below recompute from this live set.
  const [editableListings, setEditableListings] = useState<NormalizedListing[]>(
    [],
  );

  // Stats recomputed client-side from the (possibly edited) listing set, so the
  // figures always match what's shown. computeMarketStats is a pure function.
  const liveStats = useMemo(
    () => computeMarketStats(editableListings.map((l) => l.price ?? 0)),
    [editableListings],
  );

  // Auto-scroll to the results once an analysis lands.
  const marketRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (market) {
      marketRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [market]);

  // Group the (live) listings into the same price buckets as the histogram,
  // so the operator can see exactly which cars sit in each band (with links).
  const listingsByBucket = useMemo(() => {
    if (!market) return [];
    const buckets = liveStats.histogram;
    return buckets
      .map((b, i) => {
        const isLast = i === buckets.length - 1;
        const listings = editableListings
          .filter(
            (l) =>
              l.price != null &&
              (isLast
                ? l.price >= b.from && l.price <= b.to
                : l.price >= b.from && l.price < b.to),
          )
          .sort((a, c) => (a.price ?? 0) - (c.price ?? 0));
        return { ...b, listings };
      })
      .filter((b) => b.listings.length > 0);
  }, [market, liveStats, editableListings]);

  // Remove a listing that doesn't fit — stats and margin recompute from the rest.
  function removeListing(target: NormalizedListing) {
    setEditableListings((prev) => prev.filter((l) => l !== target));
  }

  // Live margin, recomputed from the current listing set.
  const liveMargin = liveStats.median - result.totalLanded;
  // True once the operator has removed one or more listings from the set.
  const listingsEdited = market
    ? editableListings.length !== market.listings.length
    : false;

  async function downloadPdf() {
    if (!market || !verdict) return;
    setPdfBusy(true);
    try {
      const res = await generateSourcingPdf({
        generatedAt: new Date().toLocaleString("en-GB"),
        vehicle: { make, model, edition, year, mileage },
        landed: {
          cifGbp: result.cifGbp,
          duty: result.duty,
          dutyLabel: `Customs duty (${fmtPct(result.dutyRate)})`,
          vat: result.vat,
          vatLabel: `Import VAT (${fmtPct(result.vatEffectiveRate)})`,
          postBorder: result.postBorderTotal,
          totalLanded: result.totalLanded,
        },
        market: {
          count: liveStats.count,
          min: liveStats.min,
          median: liveStats.median,
          mean: liveStats.mean,
          max: liveStats.max,
          p25: liveStats.p25,
          p75: liveStats.p75,
          trimmedOutliers: liveStats.trimmedOutliers,
          totalScraped: market.totalScraped,
          totalAfterClean: market.totalAfterClean,
          sources: market.sources,
          widened: liveStats.count < 5,
          matchUsed: market.matchUsed,
          bands: listingsByBucket.map((b) => ({
            label: b.label,
            listings: b.listings.map((l) => ({
              price: l.price,
              year: l.year,
              mileage: l.mileage,
              trim: l.trim,
              source: l.source,
              url: l.url,
            })),
          })),
        },
        verdict: {
          ...verdict,
          grossMargin: liveMargin,
          marginPct:
            result.totalLanded > 0 ? liveMargin / result.totalLanded : 0,
        },
        usage: {
          aiTokens: extractTokens + verdictTokens,
          aiModel,
          listingsScraped: market.totalScraped,
        },
      });
      if (!res.success) {
        setMarketError(res.message);
        return;
      }
      // base64 → blob → download
      const bytes = Uint8Array.from(atob(res.pdfBase64), (c) =>
        c.charCodeAt(0),
      );
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = res.fileName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setPdfBusy(false);
    }
  }

  async function saveAnalysis() {
    if (!market || !verdict) return;
    setSaving(true);
    try {
      const res = await saveSourcingAnalysis({
        make,
        model,
        edition,
        year: year ? Number.parseInt(year, 10) : undefined,
        mileage: mileage ? num(mileage) : undefined,
        landedCostGbp: result.totalLanded,
        currency,
        dutyBasis,
        vatBasis,
        // Save the live (possibly edited) set so the stored figures match.
        market: {
          ...market,
          stats: liveStats,
          listings: editableListings,
          widened: liveStats.count < 5,
        },
        verdict: {
          ...verdict,
          grossMargin: liveMargin,
          marginPct:
            result.totalLanded > 0 ? liveMargin / result.totalLanded : 0,
        },
      });
      if (res.success) {
        setSaved(true);
        router.refresh(); // reflect the new run in the history list
      } else {
        setMarketError(res.message);
      }
    } finally {
      setSaving(false);
    }
  }

  // Step 1 — crawl the market for comparable listings. Runs while the operator
  // keeps filling in the cost sections. Does NOT call the AI verdict.
  async function runCrawl() {
    if (!make.trim() || !model.trim()) {
      setMarketError("Enter at least a make and model first.");
      return;
    }
    setCrawling(true);
    setMarketError(null);
    setMarket(null);
    setVerdict(null);
    setSaved(false);
    try {
      // Make + model gate the match (case-insensitive); trim is a preference;
      // engine + transmission rank toward the exact car.
      const refineTokens = tokens(`${engine} ${transmission}`);

      const res = await analyzeMarket({
        make: make.trim(),
        model: model.trim(),
        trim: edition.trim(),
        refineTokens,
        year: year ? Number.parseInt(year, 10) : null,
        mileage: mileage ? num(mileage) : null,
        yearBand: Math.max(0, Math.round(num(yearBand))),
        mileagePct: Math.max(0, num(mileagePctInput)) / 100,
      });
      if (!res.success) {
        setMarketError(res.message);
        toast.error("Crawl failed", { description: res.message });
        return;
      }
      setMarket(res.data);
      setEditableListings(res.data.listings);
      if (res.data.stats.count === 0) {
        toast.warning("No comparable listings matched", {
          description: `${res.data.totalScraped} scraped, but none fit ${res.data.matchUsed}. Widen the year/mileage range.`,
        });
      } else {
        toast.success("Listings crawled", {
          description: `${res.data.stats.count} comparable from ${res.data.sources.join(", ")} — add costs, then run the verdict.`,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Crawl failed.";
      setMarketError(msg);
      toast.error("Crawl failed", { description: msg });
    } finally {
      setCrawling(false);
    }
  }

  // Step 2 — once costs are in, ask Gemini for the buy/avoid verdict against the
  // crawled (and possibly edited) comparables.
  async function runVerdict() {
    if (!market || liveStats.count === 0) {
      setMarketError("Crawl comparable listings first.");
      return;
    }
    setVerdicting(true);
    setMarketError(null);
    try {
      const v = await getVerdict({
        vehicle: { make, model, edition, year, mileage },
        landedCostGbp: result.totalLanded,
        stats: liveStats,
        matchUsed: market.matchUsed,
        widened: liveStats.count < 5,
      });
      if (v.success) {
        setVerdict(v.data);
        setVerdictTokens(v.tokens);
        setAiModel(v.model);
        toast.success("Verdict ready", {
          description: VERDICT_STYLE[v.data.recommendation].label,
        });
      } else {
        setMarketError(v.message);
        toast.error("Verdict unavailable", { description: v.message });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verdict failed.";
      setMarketError(msg);
      toast.error("Verdict failed", { description: msg });
    } finally {
      setVerdicting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* ── Inputs ──────────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Auction-sheet upload → Gemini extraction → pre-fill */}
              <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-700">
                      Auto-fill from auction sheet
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Upload the Japanese sheet (image or PDF) — details are
                      read and translated automatically.
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      void handleSheetUpload(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={extracting}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {extracting ? "Reading…" : "Upload sheet"}
                  </Button>
                </div>
                {extractError ? (
                  <p className="mt-2 text-[11px] text-red-600">
                    {extractError}
                  </p>
                ) : null}
                {extract ? (
                  <div className="mt-3 border-t border-zinc-200 pt-3">
                    <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
                      Extracted — please verify
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {extract.registrationDate ? (
                        <Badge variant="secondary" className="text-[10px]">
                          {extract.registrationDate}
                        </Badge>
                      ) : null}
                      {extract.mileageKm ? (
                        <Badge variant="secondary" className="text-[10px]">
                          {extract.mileageKm.toLocaleString()} km
                        </Badge>
                      ) : null}
                      {extract.auctionGrade ? (
                        <Badge variant="secondary" className="text-[10px]">
                          Grade {extract.auctionGrade}
                          {extract.interiorGrade
                            ? ` / ${extract.interiorGrade}`
                            : ""}
                        </Badge>
                      ) : null}
                      {extract.fuel ? (
                        <Badge variant="secondary" className="text-[10px]">
                          {extract.fuel}
                        </Badge>
                      ) : null}
                      {extract.drivetrain ? (
                        <Badge variant="secondary" className="text-[10px]">
                          {extract.drivetrain}
                        </Badge>
                      ) : null}
                      {extract.chassisCode ? (
                        <Badge variant="secondary" className="text-[10px]">
                          {extract.chassisCode}
                        </Badge>
                      ) : null}
                    </div>
                    {extract.features.length > 0 ? (
                      <p className="mt-2 text-[11px] text-zinc-500">
                        {extract.features.join(" · ")}
                      </p>
                    ) : null}
                    {extract.conditionNotes ? (
                      <p className="mt-1 text-[11px] text-amber-700">
                        Notes: {extract.conditionNotes}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Make" value={make} onChange={setMake} />
                <Field label="Model" value={model} onChange={setModel} />
                <Field
                  label="Edition / Grade"
                  value={edition}
                  onChange={setEdition}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Year" value={year} onChange={setYear} />
                  <Field
                    label="Mileage (mi)"
                    value={mileage}
                    onChange={setMileage}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600">
                    Fuel type
                  </Label>
                  <Select
                    value={fuel}
                    onValueChange={(v) =>
                      setFuel(v as (typeof FUEL_TYPES)[number])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FUEL_TYPES.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Field
                  label="Engine"
                  value={engine}
                  onChange={setEngine}
                  hint="e.g. 3.0 V6 — helps pick the exact vehicle"
                />
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600">
                    Transmission
                  </Label>
                  <Select
                    value={transmission}
                    onValueChange={(v) =>
                      setTransmission(v as (typeof TRANSMISSIONS)[number])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSMISSIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Step 1: crawl the market. Runs while costs are filled in. */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Year range (± yrs)"
                    value={yearBand}
                    onChange={setYearBand}
                  />
                  <Field
                    label="Mileage range (± %)"
                    value={mileagePctInput}
                    onChange={setMileagePctInput}
                  />
                </div>
                <Button
                  type="button"
                  className="w-full"
                  disabled={crawling || !make.trim() || !model.trim()}
                  onClick={runCrawl}
                >
                  {crawling
                    ? "Crawling listings…"
                    : market
                      ? "Re-crawl market listings"
                      : "Crawl market listings"}
                </Button>
                <p className="text-[11px] text-zinc-400">
                  Searches AutoTrader first (then PistonHeads), strictly
                  matching make · model · trim. Fill in the cost sections while
                  it runs.
                </p>
                {market ? (
                  <p className="text-[11px] font-medium text-emerald-700">
                    ✓ {market.totalMatched} comparable found ·{" "}
                    {market.sources.join(", ")} — scroll down for the verdict
                    step.
                  </p>
                ) : null}
                {marketError ? (
                  <p className="text-[11px] text-red-600">{marketError}</p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Auction & shipping cost (CIF)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600">
                    Currency
                  </Label>
                  <Select
                    value={currency}
                    onValueChange={(v) => {
                      const c = v as (typeof CURRENCIES)[number];
                      setCurrency(c);
                      setFxRate((fx.rates[c] ? 1 / fx.rates[c] : 0).toFixed(2));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Field
                  label={`FX rate (${currency} per GBP)`}
                  value={fxRate}
                  onChange={setFxRate}
                  hint={
                    fx.source === "ecb"
                      ? `Live ECB rate${fx.date ? ` · ${fx.date}` : ""} · HMRC uses its monthly rate`
                      : "Indicative fallback · HMRC uses its monthly rate"
                  }
                />
              </div>
              <Field
                label="Auction hammer / purchase price"
                value={hammerPrice}
                onChange={setHammerPrice}
                prefix={currency === "JPY" ? "¥" : "$"}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Auction & export agent fees"
                  value={auctionExportFees}
                  onChange={(v) => {
                    setAuctionExportFees(v);
                    setFeeManual(true);
                  }}
                  hint={
                    feeManual
                      ? "Manually set — 7% of hammer is the default"
                      : "Auto: 7% of hammer value (editable)"
                  }
                />
                {feeManual ? (
                  <button
                    type="button"
                    onClick={() => setFeeManual(false)}
                    className="text-[11px] font-medium text-sky-600 hover:underline -mt-2 justify-self-start"
                  >
                    Reset to 7%
                  </button>
                ) : null}
                <Field
                  label="Inland transport (origin)"
                  value={inlandTransportOrigin}
                  onChange={setInlandTransportOrigin}
                />
                <Field
                  label="Ocean freight to UK port"
                  value={oceanFreight}
                  onChange={setOceanFreight}
                  hint="Default 260,000 JPY for a 3-car container — adjust per shipment"
                />
                <Field
                  label="Marine insurance"
                  value={marineInsurance}
                  onChange={setMarineInsurance}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tax treatment</CardTitle>
              <p className="text-xs text-zinc-400">
                Answer what you know about the car — the duty &amp; VAT are
                worked out for you.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600">
                    Country of manufacture
                  </Label>
                  <Select
                    value={country}
                    onValueChange={(v) => setCountry(v as OriginCountry)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ORIGIN_COUNTRY_LABELS).map(
                        ([k, label]) => (
                          <SelectItem key={k} value={k}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600">
                    Body type
                  </Label>
                  <Select
                    value={isCommercialPickup ? "pickup" : "car"}
                    onValueChange={(v) => setIsCommercialPickup(v === "pickup")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Passenger car</SelectItem>
                      <SelectItem value="pickup">
                        Commercial pickup (single cab)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {FTA_COUNTRIES.includes(country) ? (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600">
                    Statement of origin from exporter?
                  </Label>
                  <Select
                    value={hasOriginStatement ? "yes" : "no"}
                    onValueChange={(v) => setHasOriginStatement(v === "yes")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No / not sure</SelectItem>
                      <SelectItem value="yes">Yes — held</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-zinc-400">
                    Required for the 0% preferential rate; often hard to obtain
                    for a used re-export.
                  </p>
                </div>
              ) : null}

              {/* Resolved treatment (derived from the answers above) */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Customs duty</span>
                  <span className="text-sm font-bold text-zinc-900">
                    {fmtPct(result.dutyRate)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 -mt-1">
                  {treatment.dutyReason}
                </p>
                <div className="flex items-center justify-between border-t border-zinc-200 pt-2">
                  <span className="text-sm text-zinc-600">Import VAT</span>
                  <span className="text-sm font-bold text-zinc-900">
                    {fmtPct(result.vatEffectiveRate)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 -mt-1">
                  {treatment.vatReason}
                </p>
                {treatment.isHistoric ? (
                  <p className="text-[11px] text-amber-700">
                    Auto-detected historic (30+ yrs from the Year). Confirm
                    original condition with HMRC.
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Post-border UK costs (GBP)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">
                    {postBorderDetailed
                      ? "Itemised total"
                      : "Estimated clearance + registration"}
                  </span>
                  <span className="text-lg font-bold text-zinc-900">
                    {fmtGBP(postBorderTotal)}
                  </span>
                </div>
                {!postBorderDetailed ? (
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {vehicleAgeYears != null && vehicleAgeYears >= 10
                      ? "10+ yrs: £800 standard clearance (no IVA)."
                      : "Under 10 yrs: £1,000 clearance + £800 IVA buffer = £1,800."}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => setPostBorderDetailed((v) => !v)}
                  className="mt-2 text-[11px] font-medium text-sky-600 hover:underline"
                >
                  {postBorderDetailed
                    ? "Use the standard estimate"
                    : "Itemise costs instead"}
                </button>
              </div>

              {postBorderDetailed ? (
                <>
                  <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
                    <span aria-hidden>⚠️</span>
                    <p>
                      Indicative placeholder figures — confirm each against your
                      actual costs before relying on the landed-cost total.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      label="DVLA registration"
                      value={dvlaRegistration}
                      onChange={setDvla}
                      prefix="£"
                    />
                    <Field
                      label="Number plates"
                      value={numberPlates}
                      onChange={setPlates}
                      prefix="£"
                    />
                    <Field
                      label="IVA / MOT test"
                      value={approvalTest}
                      onChange={setApproval}
                      prefix="£"
                    />
                    <Field
                      label="IVA modifications"
                      value={ivaModifications}
                      onChange={setMods}
                      prefix="£"
                    />
                    <Field
                      label="UK inland transport"
                      value={ukInlandTransport}
                      onChange={setUkTransport}
                      prefix="£"
                    />
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* ── Breakdown ───────────────────────────────────────────────────────── */}
        <Card className="lg:sticky lg:top-6 bg-zinc-900 text-white border-zinc-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm uppercase tracking-widest text-zinc-400 font-medium">
                Landed cost
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                {fmtPct(result.taxPctOfCif)} tax / CIF
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-2">
              {fmtGBP(result.totalLanded)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="[&_p]:text-zinc-300 [&_.border-zinc-100]:border-zinc-700">
              <BreakdownRow
                label="CIF value"
                value={fmtGBP(result.cifGbp)}
                sub={cifLabel}
              />
              <BreakdownRow
                label="Customs value (60% of CIF)"
                value={fmtGBP(result.customsValue)}
                sub="Valuation basis for duty & VAT"
              />
              <BreakdownRow
                label={`Customs duty (${fmtPct(result.dutyRate)})`}
                value={fmtGBP(result.duty)}
                sub={DUTY_LABELS[result.dutyBasis]}
              />
              <BreakdownRow
                label={`Import VAT (${fmtPct(result.vatEffectiveRate)})`}
                value={fmtGBP(result.vat)}
                sub={`On ${fmtGBP(result.vatBase)}`}
              />
              <BreakdownRow
                label="Post-border fees"
                value={fmtGBP(result.postBorderTotal)}
                sub={
                  postBorderDetailed
                    ? "Itemised (DVLA, plates, IVA/MOT, mods, transport)"
                    : "Standard clearance + registration (by age)"
                }
              />
            </div>
            <Separator className="my-3 bg-zinc-700" />
            <BreakdownRow
              label="Total landed cost"
              value={fmtGBP(result.totalLanded)}
              strong
            />
            <p className="text-[11px] text-zinc-500 mt-4 leading-relaxed">
              Indicative HMRC-based estimate. Confirm duty against the live UK
              Trade Tariff (10-digit code) and use HMRC's monthly FX rate before
              committing.
            </p>

            {/* Step 2: once costs are in and listings crawled, get the verdict */}
            <Button
              className="w-full mt-4 bg-white text-zinc-900 hover:bg-zinc-200"
              disabled={verdicting || !market || liveStats.count === 0}
              onClick={runVerdict}
            >
              {verdicting
                ? "Analysing…"
                : verdict
                  ? "Re-run verdict"
                  : "Analyse & verdict"}
            </Button>
            <p className="mt-2 text-[11px] text-zinc-500">
              {!market
                ? "Crawl market listings first (top-left), then add costs."
                : liveStats.count === 0
                  ? "No comparable listings yet — widen the match range and re-crawl."
                  : "Uses the crawled comparables + the landed cost above."}
            </p>
            {marketError ? (
              <p className="mt-2 text-[11px] text-red-400">{marketError}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* ── Market analysis & verdict ───────────────────────────────────────── */}
      {market ? (
        <Card ref={marketRef} className="scroll-mt-6">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">UK market & verdict</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {liveStats.count} comparable listings
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  match: {market.matchUsed}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  source: {market.sources.join(", ")}
                </Badge>
                {liveStats.count < 5 ? (
                  <Badge className="text-[10px] bg-amber-100 text-amber-800">
                    thin supply · lower confidence
                  </Badge>
                ) : null}
              </div>
            </div>
            {/* Data provenance — full transparency on how the figures were built */}
            <p className="text-[11px] text-zinc-400 mt-1">
              {market.totalScraped} listings scraped → {market.totalAfterClean}{" "}
              after cleaning → {market.totalMatched} matched
              {market.totalMatched > liveStats.count
                ? ` → top ${liveStats.count} shown (closest year, then mileage)`
                : ""}
              {liveStats.trimmedOutliers > 0
                ? ` · ${liveStats.trimmedOutliers} price outlier${liveStats.trimmedOutliers === 1 ? "" : "s"} excluded`
                : ""}
              {liveStats.count > 0
                ? ` · interquartile ${fmtGBP(liveStats.p25)}–${fmtGBP(liveStats.p75)}`
                : ""}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Empty state: scraped listings but none matched the filters */}
            {liveStats.count === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
                <p className="text-sm font-semibold text-amber-900">
                  No comparable listings matched your filters
                </p>
                <p className="text-[13px] text-amber-800 mt-1">
                  {market.totalScraped} listing
                  {market.totalScraped === 1 ? " was" : "s were"} scraped, but
                  none fit <strong>{market.matchUsed}</strong>. Widen the year
                  or mileage range (a Year range of ±0 only matches the exact
                  year) and re-run.
                </p>
                {market.allListings.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setEditableListings(market.allListings)}
                    className="mt-3 text-[12px] font-medium text-sky-700 hover:underline"
                  >
                    Show all {market.allListings.length} scraped listings anyway
                  </button>
                ) : null}
              </div>
            ) : null}

            {liveStats.count === 0 ? null : (
              <>
                {/* Stat tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Lowest", value: liveStats.min },
                    { label: "Median", value: liveStats.median },
                    { label: "Mean", value: liveStats.mean },
                    { label: "Highest", value: liveStats.max },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border border-zinc-200 p-3"
                    >
                      <p className="text-[11px] uppercase tracking-wide text-zinc-400">
                        {s.label}
                      </p>
                      <p className="text-lg font-bold text-zinc-900">
                        {fmtGBP(s.value)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Histogram */}
                {liveStats.histogram.length > 0 ? (
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={liveStats.histogram}
                        margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                      >
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 10 }}
                          interval={0}
                          angle={-25}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                        <RTooltip
                          formatter={(value) => [`${value} listings`, "Count"]}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {liveStats.histogram.map((b) => {
                            // Highlight the bucket the landed cost falls into.
                            const inHere =
                              result.totalLanded >= b.from &&
                              result.totalLanded <= b.to;
                            return (
                              <Cell
                                key={b.label}
                                fill={inHere ? "#0ea5e9" : "#cbd5e1"}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <p className="text-[11px] text-zinc-400 text-center">
                      Price distribution of comparable UK listings · blue =
                      where your landed cost sits
                    </p>
                  </div>
                ) : null}

                {/* Listings analysed — grouped by price band, with links */}
                {listingsByBucket.length > 0 ? (
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-zinc-400 mb-2">
                      Listings analysed ({liveStats.count}) — remove any that
                      don't fit; the figures update instantly
                    </p>
                    <div className="space-y-3">
                      {listingsByBucket.map((bucket) => (
                        <div
                          key={bucket.label}
                          className="rounded-lg border border-zinc-200 overflow-hidden"
                        >
                          <div className="flex items-center justify-between bg-zinc-50 px-3 py-1.5 border-b border-zinc-100">
                            <span className="text-xs font-semibold text-zinc-700">
                              {bucket.label}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {bucket.listings.length} car
                              {bucket.listings.length === 1 ? "" : "s"}
                            </span>
                          </div>
                          <ul className="divide-y divide-zinc-50">
                            {bucket.listings.map((l, idx) => {
                              const title = [l.make, l.model]
                                .filter(Boolean)
                                .join(" ");
                              const meta = [
                                l.year,
                                l.mileage
                                  ? `${l.mileage.toLocaleString()} mi`
                                  : null,
                                l.trim,
                              ]
                                .filter(Boolean)
                                .join(" · ");
                              return (
                                <li
                                  key={l.url ?? `${bucket.label}-${idx}`}
                                  className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                                >
                                  <div className="min-w-0">
                                    <div className="flex items-baseline gap-2">
                                      <span className="font-semibold text-zinc-900 tabular-nums">
                                        {l.price != null
                                          ? fmtGBP(l.price)
                                          : "—"}
                                      </span>
                                      {title ? (
                                        <span className="font-medium text-zinc-700 truncate">
                                          {title}
                                        </span>
                                      ) : null}
                                    </div>
                                    <p className="text-[11px] text-zinc-500 truncate">
                                      {meta}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px]"
                                    >
                                      {l.source}
                                    </Badge>
                                    {l.url ? (
                                      <a
                                        href={l.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-medium text-sky-600 hover:underline"
                                      >
                                        View ↗
                                      </a>
                                    ) : null}
                                    <button
                                      type="button"
                                      onClick={() => removeListing(l)}
                                      aria-label="Remove this listing from the comparison"
                                      title="Remove from comparison"
                                      className="text-zinc-400 hover:text-red-600 text-sm leading-none px-1"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Profit + verdict */}
                <div className="rounded-xl border border-zinc-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-zinc-400">
                        Gross margin at median resale
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          liveMargin >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {fmtGBP(liveMargin)}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        median {fmtGBP(liveStats.median)} − landed{" "}
                        {fmtGBP(result.totalLanded)}
                      </p>
                    </div>
                    {verdict ? (
                      <Badge
                        className={`text-xs px-3 py-1 ${VERDICT_STYLE[verdict.recommendation].cls}`}
                      >
                        {VERDICT_STYLE[verdict.recommendation].label}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        {verdicting ? "Writing verdict…" : "Run the verdict"}
                      </Badge>
                    )}
                  </div>
                  {verdict ? (
                    <div className="mt-3 border-t border-zinc-100 pt-3">
                      <p className="font-semibold text-zinc-900">
                        {verdict.headline}
                      </p>
                      <p className="text-sm text-zinc-600 mt-1">
                        {verdict.reasoning}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-2">
                        Confidence: {verdict.confidence} · AI narrative over
                        deterministic figures — verify before committing.
                      </p>
                      {listingsEdited ? (
                        <p className="text-[11px] text-amber-700 mt-1">
                          Figures above reflect your edited listing set; the
                          written narrative is from the initial analysis. Re-run
                          to refresh the narrative.
                        </p>
                      ) : null}
                      <div className="mt-3 flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={saving || saved}
                          onClick={saveAnalysis}
                        >
                          {saved
                            ? "Saved ✓"
                            : saving
                              ? "Saving…"
                              : "Save to history"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={pdfBusy}
                          onClick={downloadPdf}
                        >
                          {pdfBusy ? "Building PDF…" : "Download PDF"}
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            )}

            {/* All scraped listings — read-only inspector, no extra credits */}
            {market.allListings.length > 0 ? (
              <div className="border-t border-zinc-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAllScraped((v) => !v)}
                  className="text-[12px] font-medium text-sky-600 hover:underline"
                >
                  {showAllScraped ? "Hide" : "Show"} all{" "}
                  {market.allListings.length} scraped listings
                </button>
                {showAllScraped ? (
                  <ul className="mt-2 max-h-80 overflow-y-auto divide-y divide-zinc-50 rounded-lg border border-zinc-200">
                    {[...market.allListings]
                      .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
                      .map((l, idx) => {
                        const title = [l.make, l.model]
                          .filter(Boolean)
                          .join(" ");
                        const meta = [
                          l.year,
                          l.mileage ? `${l.mileage.toLocaleString()} mi` : null,
                          l.trim,
                        ]
                          .filter(Boolean)
                          .join(" · ");
                        return (
                          <li
                            key={l.url ?? `all-${idx}`}
                            className="flex items-center justify-between gap-3 px-3 py-1.5 text-[13px]"
                          >
                            <div className="min-w-0">
                              <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-zinc-900 tabular-nums">
                                  {l.price != null ? fmtGBP(l.price) : "—"}
                                </span>
                                {title ? (
                                  <span className="font-medium text-zinc-700 truncate">
                                    {title}
                                  </span>
                                ) : null}
                              </div>
                              <p className="text-[11px] text-zinc-500 truncate">
                                {meta}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {l.source}
                              </Badge>
                              {l.url ? (
                                <a
                                  href={l.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] font-medium text-sky-600 hover:underline"
                                >
                                  View ↗
                                </a>
                              ) : null}
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                ) : null}
                <p className="text-[11px] text-zinc-400 mt-1">
                  Everything scraped before the year/mileage filter — for
                  reference only; doesn't affect the figures above.
                </p>
              </div>
            ) : null}

            {/* Usage this run — read from the API responses, no extra credits */}
            <div className="rounded-lg bg-zinc-50 border border-zinc-100 p-3 text-[11px] text-zinc-500 flex flex-wrap gap-x-4 gap-y-1">
              <span>
                🤖 AI:{" "}
                <span className="font-medium text-zinc-700">
                  {(extractTokens + verdictTokens).toLocaleString()} tokens
                </span>
                {aiModel ? ` · ${aiModel}` : ""}
                {extractTokens > 0
                  ? ` (extract ${extractTokens.toLocaleString()} + verdict ${verdictTokens.toLocaleString()})`
                  : ""}
              </span>
              <span>
                🔎 Market:{" "}
                <span className="font-medium text-zinc-700">
                  {market.totalScraped.toLocaleString()} listings scraped
                </span>{" "}
                via {market.sources.join(", ")}
              </span>
              <span className="text-zinc-400">
                Usage is read from the API responses — displaying it costs
                nothing.
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
