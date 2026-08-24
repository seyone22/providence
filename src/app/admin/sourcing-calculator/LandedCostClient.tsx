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
  getUsageBudget,
  getVerdict,
  type MarketAnalysis,
  saveSourcingAnalysis,
  type UsageBudget,
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
  AUCTION_FEE_RATE,
  clampTargetMargin,
  computeLandedCost,
  DEFAULT_OCEAN_FREIGHT_JPY,
  DUTY_LABELS,
  fmtGBP,
  fmtPct,
  isNearIvaExemption,
  ivaRequiredForAge,
  maxAuctionPriceForMargin,
  ORIGIN_COUNTRY_LABELS,
  ORIGIN_STATEMENT_COUNTRIES,
  type OriginCountry,
  POST_BORDER_BASE_ITEMS,
  POST_BORDER_IVA_ITEMS,
  POST_BORDER_LABELS,
  type PostBorderBaseKey,
  type PostBorderIvaKey,
  RESALE_VAT_DIVISOR,
  resaleExVat,
  resolveTaxTreatment,
  TARGET_MARGIN_PCT,
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

// Stable identity for a listing. The matched set and the all-scraped set are
// separate copies once they've crossed the server-action boundary, so membership
// has to be compared by value, not by object reference.
function listingKey(l: NormalizedListing): string {
  return (
    l.url ??
    `${l.source}|${l.make}|${l.model}|${l.year}|${l.mileage}|${l.price}`
  );
}

// A consumed-vs-allowance bar for one credit pool. Green while there's headroom,
// amber past 75%, red past 90% — so a nearly-spent pool reads at a glance.
function UsageMeter({
  label,
  used,
  total,
  format,
  note,
}: {
  label: string;
  used: number;
  total: number;
  format: (n: number) => string;
  note?: string;
}) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  const left = Math.max(0, total - used);
  const bar =
    pct >= 90 ? "bg-red-500" : pct >= 75 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="text-[11px] font-medium text-zinc-600">{label}</span>
        <span className="text-[11px] tabular-nums text-zinc-500">
          <span className="font-semibold text-zinc-800">{format(used)}</span>
          {" used of "}
          {format(total)}
          <span className="text-zinc-400"> · {format(left)} left</span>
        </span>
      </div>
      {/* A div rather than <progress>: the native element can't be styled to
          match the rest of the panel consistently across browsers. */}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200"
      >
        <div
          className={`h-full rounded-full transition-all ${bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {note ? <p className="text-[10px] text-zinc-400">{note}</p> : null}
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

export default function LandedCostClient({
  fx,
  usage: initialUsage,
}: {
  fx: GbpFxRates;
  usage: UsageBudget;
}) {
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
  // Allowances the meters measure against. Apify's figure is live, so it's
  // re-read after each crawl; reading it costs nothing.
  const [budget, setBudget] = useState<UsageBudget>(initialUsage);
  const aiTokens = extractTokens + verdictTokens;

  function refreshBudget() {
    void getUsageBudget()
      .then(setBudget)
      .catch(() => {
        /* meters keep the last known figures */
      });
  }

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
      setAuctionExportFees(
        h > 0 ? String(Math.round(h * AUCTION_FEE_RATE)) : "",
      );
    }
  }, [hammerPrice, feeManual]);
  const [inlandTransportOrigin, setInlandTransportOrigin] = useState("");
  // Default freight: 400,000 JPY per car (editable per shipment).
  const [oceanFreight, setOceanFreight] = useState(
    String(DEFAULT_OCEAN_FREIGHT_JPY),
  );
  const [marineInsurance, setMarineInsurance] = useState("");

  // FX — displayed and entered as units-per-GBP (e.g. JPY per GBP), the intuitive
  // direction; converted to GBP-per-unit for the engine. Prefilled from the live
  // rate (which is GBP-per-unit, so inverted here).
  const liveUnitsPerGbp = fx.rates[currency] ? 1 / fx.rates[currency] : 0;
  const [fxRate, setFxRate] = useState(liveUnitsPerGbp.toFixed(2));

  // ── Tax treatment (salesperson-friendly inputs → duty/VAT derived) ──────────
  const [country, setCountry] = useState<OriginCountry>("japan");
  // Default No: duty starts at the 10% MFN rate and only drops to 0% once the
  // desk confirms a Japan CEPA statement of origin is actually held.
  const [hasOriginStatement, setHasOriginStatement] = useState(false);
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

  // ── Post-border GBP costs (the desk's line items, editable per run) ─────────
  // Base costs land on every car; the IVA block lands only when the car has to
  // sit the approval test. Both come pre-filled from the desk's own figures.
  const [baseCosts, setBaseCosts] = useState(
    () =>
      Object.fromEntries(
        Object.entries(POST_BORDER_BASE_ITEMS).map(([k, v]) => [k, String(v)]),
      ) as Record<PostBorderBaseKey, string>,
  );
  const [ivaCosts, setIvaCosts] = useState(
    () =>
      Object.fromEntries(
        Object.entries(POST_BORDER_IVA_ITEMS).map(([k, v]) => [k, String(v)]),
      ) as Record<PostBorderIvaKey, string>,
  );

  // Whether the IVA test applies. Derived from age (under 10 = yes, unknown =
  // assume yes) until the operator says otherwise — from then on their answer
  // sticks, because the real determinant is the clearance timeline, which only
  // the person booking the shipment knows.
  const [ivaRequired, setIvaRequired] = useState(true);
  const [ivaManual, setIvaManual] = useState(false);
  useEffect(() => {
    if (!ivaManual) setIvaRequired(ivaRequiredForAge(vehicleAgeYears));
  }, [vehicleAgeYears, ivaManual]);
  // A car within a year of the exemption usually registers after its birthday,
  // so the operator is prompted (never forced) to drop the IVA block.
  const ivaWaiverOffered = isNearIvaExemption(vehicleAgeYears);

  const baseCostTotal = Object.values(baseCosts).reduce(
    (a, v) => a + num(v),
    0,
  );
  const ivaCostTotal = Object.values(ivaCosts).reduce((a, v) => a + num(v), 0);
  const postBorderTotal = baseCostTotal + (ivaRequired ? ivaCostTotal : 0);

  // ── Minimum ROI ─────────────────────────────────────────────────────────────
  // The desk minimum is 30% gross margin on landed cost, but it is a judgement
  // the operator can move per run (a thin, risky car may need 35%). It drives
  // the badge, the ceiling bid, the verdict policy and the PDF together.
  const [targetMarginInput, setTargetMarginInput] = useState(
    String(TARGET_MARGIN_PCT * 100),
  );
  const targetMarginPct = clampTargetMargin(num(targetMarginInput) / 100);
  const targetLabel = `${Number((targetMarginPct * 100).toFixed(1))}%`;

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
        // Import VAT is reclaimed by the (VAT-registered) importer, so it is
        // cash-flow, not cost — carrying it here would understate margin.
        includeVat: false,
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

  // Pull a scraped-but-unmatched listing into the comparison. Purely local — the
  // car is already in memory from the crawl, so this spends no scraper credits.
  function addListing(target: NormalizedListing) {
    const key = listingKey(target);
    setEditableListings((prev) =>
      prev.some((l) => listingKey(l) === key) ? prev : [...prev, target],
    );
    toast.success("Added to the comparison", {
      description:
        "Figures updated instantly — re-run the verdict to refresh the narrative.",
    });
  }

  // Which cars are already being compared, so the scraped list can show "Add"
  // only for the ones that aren't.
  const includedKeys = useMemo(
    () => new Set(editableListings.map(listingKey)),
    [editableListings],
  );

  // Live margin, recomputed from the current listing set.
  // Scraped forecourt prices are VAT-inclusive; the landed cost above excludes
  // import VAT because the importer reclaims it. Take the VAT back out of the
  // resale side so both halves of the margin are net figures.
  const medianExVat = resaleExVat(liveStats.median);
  const liveMargin = medianExVat - result.totalLanded;
  const liveMarginPct =
    result.totalLanded > 0 ? liveMargin / result.totalLanded : 0;

  // The ceiling bid: back-solve the engine from the median resale price to the
  // biggest hammer that still clears the target margin. Fees that scale with the
  // hammer stay a rate; a manually-entered fee is a fixed CIF component.
  const maxBid = useMemo(
    () =>
      maxAuctionPriceForMargin({
        targetMarginPct,
        resaleGbp: medianExVat,
        postBorderTotal,
        dutyRate: result.dutyRate,
        vatEffectiveRate: result.vatEffectiveRate,
        fxRate: fxGbpPerUnit,
        otherCifCosts:
          num(inlandTransportOrigin) +
          num(oceanFreight) +
          num(marineInsurance) +
          (feeManual ? num(auctionExportFees) : 0),
        auctionFeeRate: feeManual ? 0 : AUCTION_FEE_RATE,
      }),
    [
      medianExVat,
      targetMarginPct,
      postBorderTotal,
      result.dutyRate,
      result.vatEffectiveRate,
      fxGbpPerUnit,
      inlandTransportOrigin,
      oceanFreight,
      marineInsurance,
      auctionExportFees,
      feeManual,
    ],
  );
  // How the ceiling compares with what's actually being bid.
  const bidHeadroom = maxBid.achievable
    ? maxBid.maxHammer - num(hammerPrice)
    : 0;

  // The verdict narrative is written against a specific set of comparables.
  // Signing the set lets us tell the operator when the prose has fallen behind
  // an add/remove — length alone would miss an add that offsets a removal.
  const [verdictSignature, setVerdictSignature] = useState<string | null>(null);
  const listingsSignature = useMemo(
    () => editableListings.map(listingKey).sort().join("~"),
    [editableListings],
  );
  const verdictStale =
    verdict != null && verdictSignature !== listingsSignature;

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
          postBorder: result.postBorderTotal,
          totalLanded: result.totalLanded,
        },
        market: {
          count: liveStats.count,
          min: liveStats.min,
          median: liveStats.median,
          medianExVat,
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
          marginPct: liveMarginPct,
          targetMarginPct,
        },
        maxBid: {
          currency,
          maxHammer: maxBid.maxHammer,
          maxLandedGbp: maxBid.maxLandedGbp,
          achievable: maxBid.achievable,
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
          marginPct: liveMarginPct,
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
    setVerdictSignature(null);
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
      refreshBudget(); // the crawl is what moves the Apify meter
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
        // The net figure the margin is actually measured against.
        resaleExVatGbp: medianExVat,
        targetMarginPct,
        matchUsed: market.matchUsed,
        widened: liveStats.count < 5,
        maxBid: {
          currency,
          maxHammer: maxBid.maxHammer,
          achievable: maxBid.achievable,
        },
      });
      if (v.success) {
        setVerdict(v.data);
        // Remember which comparables this narrative was written against.
        setVerdictSignature(listingsSignature);
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
                      ? `Manually set — ${(AUCTION_FEE_RATE * 100).toFixed(0)}% of hammer is the default`
                      : `Auto: ${(AUCTION_FEE_RATE * 100).toFixed(0)}% of hammer value (editable)`
                  }
                />
                {feeManual ? (
                  <button
                    type="button"
                    onClick={() => setFeeManual(false)}
                    className="text-[11px] font-medium text-sky-600 hover:underline -mt-2 justify-self-start"
                  >
                    Reset to {(AUCTION_FEE_RATE * 100).toFixed(0)}%
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
                  hint={`Default ${DEFAULT_OCEAN_FREIGHT_JPY.toLocaleString()} JPY per car — adjust per shipment`}
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

              {ORIGIN_STATEMENT_COUNTRIES.includes(country) ? (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600">
                    CEPA statement of origin from exporter?
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
                    Japan-built cars only. Held documents drop duty to 0%;
                    without them the car is priced at 10%.
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
                  <span className="text-sm font-bold text-zinc-500">
                    Excluded
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 -mt-1">
                  Reclaimed as input tax by the importer, so it is cash-flow
                  rather than cost — it is left out of the landed figure and the
                  margin below.
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
                    Total UK costs
                    {ivaRequired ? " (incl. IVA)" : " (no IVA)"}
                  </span>
                  <span className="text-lg font-bold text-zinc-900">
                    {fmtGBP(postBorderTotal)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  {fmtGBP(baseCostTotal)} base
                  {ivaRequired ? ` + ${fmtGBP(ivaCostTotal)} IVA` : ""} · every
                  line is editable
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {(Object.keys(baseCosts) as PostBorderBaseKey[]).map((k) => (
                  <Field
                    key={k}
                    label={POST_BORDER_LABELS[k]}
                    value={baseCosts[k]}
                    onChange={(v) =>
                      setBaseCosts((prev) => ({ ...prev, [k]: v }))
                    }
                    prefix="£"
                  />
                ))}
              </div>

              {/* The IVA block. Age sets the default; the operator owns the
                  call, because it turns on the clearance timeline. */}
              <div className="rounded-lg border border-zinc-200 p-3 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ivaRequired}
                    onChange={(e) => {
                      setIvaManual(true);
                      setIvaRequired(e.target.checked);
                    }}
                    className="mt-0.5 size-4 shrink-0 accent-sky-600"
                  />
                  <span>
                    <span className="block text-[13px] font-medium text-zinc-800">
                      IVA test required — adds {fmtGBP(ivaCostTotal)}
                    </span>
                    <span className="block text-[11px] text-zinc-500 mt-0.5">
                      {vehicleAgeYears == null
                        ? "No year entered, so the IVA cost is assumed to apply."
                        : vehicleAgeYears >= 10
                          ? `${vehicleAgeYears} yrs old — outside the IVA scheme, an MOT does instead.`
                          : `${vehicleAgeYears} yrs old — inside the IVA scheme.`}
                    </span>
                  </span>
                </label>

                {ivaWaiverOffered && ivaRequired ? (
                  <p className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-[11px] text-sky-800">
                    This car turns 10 before it is likely to clear. Shipping and
                    clearance usually take long enough that registration falls
                    after the 10-year mark, where an MOT replaces the IVA test —
                    untick above if the timeline supports it. Your call.
                  </p>
                ) : null}

                {ivaRequired ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(Object.keys(ivaCosts) as PostBorderIvaKey[]).map((k) => (
                      <Field
                        key={k}
                        label={POST_BORDER_LABELS[k]}
                        value={ivaCosts[k]}
                        onChange={(v) =>
                          setIvaCosts((prev) => ({ ...prev, [k]: v }))
                        }
                        prefix="£"
                      />
                    ))}
                  </div>
                ) : null}
              </div>
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
                {fmtPct(result.taxPctOfCif)} duty / CIF
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
                sub={`${cifLabel} · full CIF is the customs value`}
              />
              <BreakdownRow
                label={`Customs duty (${fmtPct(result.dutyRate)})`}
                value={fmtGBP(result.duty)}
                sub={DUTY_LABELS[result.dutyBasis]}
              />
              <BreakdownRow
                label="Import VAT"
                value="Excluded"
                sub="Reclaimed by the importer — not a cost"
              />
              <BreakdownRow
                label="UK costs"
                value={fmtGBP(result.postBorderTotal)}
                sub={
                  ivaRequired
                    ? `Clearance, transport, DVLA, VED, misc + ${fmtGBP(ivaCostTotal)} IVA`
                    : "Clearance, transport, DVLA, VED, misc · no IVA"
                }
              />
            </div>
            <Separator className="my-3 bg-zinc-700" />
            <BreakdownRow
              label="Total landed cost"
              value={fmtGBP(result.totalLanded)}
              strong
            />

            {/* The other half of the P&L: what the car earns net of VAT, and
                what is left after every cost above. */}
            {liveStats.count > 0 ? (
              <div className="[&_p]:text-zinc-300 [&_.border-zinc-100]:border-zinc-700">
                <BreakdownRow
                  label="Median resale (ex VAT)"
                  value={fmtGBP(medianExVat)}
                  sub={`${fmtGBP(liveStats.median)} market median ÷ ${RESALE_VAT_DIVISOR}`}
                />
                <div className="flex items-start justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">
                      Profit after all costs
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {liveMarginPct >= targetMarginPct
                        ? `Clears the ${targetLabel} minimum ROI`
                        : `Below the ${targetLabel} minimum ROI`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold tabular-nums ${
                        liveMarginPct >= targetMarginPct
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {fmtGBP(liveMargin)}
                    </p>
                    <p
                      className={`text-[11px] font-medium tabular-nums ${
                        liveMarginPct >= targetMarginPct
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {(liveMarginPct * 100).toFixed(1)}% ROI
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* The policy knob. Moving it moves the badge, the ceiling bid and
                the verdict together. */}
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-zinc-700 px-3 py-2">
              <label
                htmlFor="target-roi"
                className="text-[11px] uppercase tracking-widest text-zinc-400"
              >
                Minimum ROI
              </label>
              <div className="flex items-center gap-1">
                <Input
                  id="target-roi"
                  inputMode="decimal"
                  value={targetMarginInput}
                  onChange={(e) => setTargetMarginInput(e.target.value)}
                  className="h-8 w-20 border-zinc-600 bg-zinc-800 text-right text-sm text-white tabular-nums"
                />
                <span className="text-sm text-zinc-400">%</span>
              </div>
            </div>

            {/* The ceiling bid — the single number a buyer needs in the room.
                Only meaningful once there's a market median to work back from. */}
            {liveStats.count > 0 ? (
              <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-800/60 p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                  Max auction bid for {targetLabel} ROI
                </p>
                {maxBid.achievable ? (
                  <>
                    <p className="mt-1 text-2xl font-bold tabular-nums">
                      {currency === "JPY" ? "¥" : "$"}
                      {Math.round(maxBid.maxHammer).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      ≈ {fmtGBP(maxBid.maxHammer * fxGbpPerUnit)} · lands at{" "}
                      {fmtGBP(maxBid.maxLandedGbp)} against a{" "}
                      {fmtGBP(medianExVat)} net resale
                    </p>
                    {num(hammerPrice) > 0 ? (
                      <p
                        className={`text-[11px] mt-1.5 font-medium ${
                          bidHeadroom >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {bidHeadroom >= 0
                          ? `${Math.round(bidHeadroom).toLocaleString()} ${currency} of headroom left on your bid`
                          : `${Math.round(-bidHeadroom).toLocaleString()} ${currency} over the ceiling`}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-red-400">
                    Unreachable — freight, duty and UK costs alone exceed{" "}
                    {fmtGBP(maxBid.maxLandedGbp)}. No bid clears {targetLabel}{" "}
                    on this car.
                  </p>
                )}
              </div>
            ) : null}

            <p className="text-[11px] text-zinc-500 mt-4 leading-relaxed">
              Indicative HMRC-based estimate, excluding reclaimable import VAT.
              Confirm duty against the live UK Trade Tariff (10-digit code) and
              use HMRC's monthly FX rate before committing.
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
                  <>
                    <button
                      type="button"
                      onClick={() => setEditableListings(market.allListings)}
                      className="mt-3 text-[12px] font-medium text-sky-700 hover:underline"
                    >
                      Compare all {market.allListings.length} scraped listings
                      anyway
                    </button>
                    <p className="text-[11px] text-amber-700 mt-1">
                      Or add them one at a time from the scraped list at the
                      bottom of this card.
                    </p>
                  </>
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
                      don't fit, or add one from the scraped list below; the
                      figures update instantly
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
                        Profit at median resale (ex VAT)
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p
                          className={`text-2xl font-bold ${
                            liveMarginPct >= targetMarginPct
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {fmtGBP(liveMargin)}
                        </p>
                        <span
                          className={`text-lg font-bold tabular-nums ${
                            liveMarginPct >= targetMarginPct
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {(liveMarginPct * 100).toFixed(1)}%
                        </span>
                        <Badge
                          className={`text-[10px] ${
                            liveMarginPct >= targetMarginPct
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {liveMarginPct >= targetMarginPct
                            ? `clears the ${targetLabel} target`
                            : `below the ${targetLabel} target`}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        net resale {fmtGBP(medianExVat)} (median{" "}
                        {fmtGBP(liveStats.median)} ÷ {RESALE_VAT_DIVISOR}) −
                        landed {fmtGBP(result.totalLanded)} · % of landed cost
                      </p>
                      {maxBid.achievable ? (
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Max bid for {targetLabel}:{" "}
                          <span className="font-semibold text-zinc-700 tabular-nums">
                            {currency === "JPY" ? "¥" : "$"}
                            {Math.round(maxBid.maxHammer).toLocaleString()}
                          </span>{" "}
                          hammer ({fmtGBP(maxBid.maxHammer * fxGbpPerUnit)})
                        </p>
                      ) : null}
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
                      {verdictStale ? (
                        <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                          <p className="text-[11px] text-amber-800">
                            Your listing set changed. The figures above already
                            reflect it; the written narrative is from the
                            previous set.
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={verdicting}
                            onClick={runVerdict}
                          >
                            {verdicting ? "Analysing…" : "Re-run verdict"}
                          </Button>
                        </div>
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

            {/* All scraped listings — inspect, and pull any of them into the
                comparison. Everything here is already in memory from the crawl,
                so adding one spends no further credits. */}
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
                              {includedKeys.has(listingKey(l)) ? (
                                <span className="text-[11px] font-medium text-emerald-600 whitespace-nowrap">
                                  In comparison ✓
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addListing(l)}
                                  title="Add this listing to the comparison"
                                  className="rounded border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 hover:bg-sky-100 whitespace-nowrap"
                                >
                                  + Add
                                </button>
                              )}
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                ) : null}
                <p className="text-[11px] text-zinc-400 mt-1">
                  Everything scraped before the year/mileage filter. Adding one
                  pulls it into the comparison and updates the figures instantly
                  — it's already in memory, so no new crawl and no scraper
                  credits.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {/* ── Credit usage ────────────────────────────────────────────────────
          Always visible: the point of a remaining-balance meter is to see it
          before you spend, not after. Every figure here is read from an API
          response or a free limits endpoint — displaying it costs nothing. */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Credit usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {budget.aiTokenBudget > 0 ? (
            <UsageMeter
              label="🤖 Gemini AI tokens · this session"
              used={aiTokens}
              total={budget.aiTokenBudget}
              format={(n) => n.toLocaleString()}
              note={
                extractTokens > 0 || verdictTokens > 0
                  ? `Sheet extraction ${extractTokens.toLocaleString()} + verdict ${verdictTokens.toLocaleString()}${aiModel ? ` · ${aiModel}` : ""}`
                  : "Nothing spent yet — the sheet upload and the verdict are the two AI calls."
              }
            />
          ) : (
            <div className="space-y-1">
              <p className="text-[11px] text-zinc-600">
                🤖 Gemini AI tokens · this session:{" "}
                <span className="font-semibold text-zinc-800 tabular-nums">
                  {aiTokens.toLocaleString()}
                </span>
                {aiModel ? ` · ${aiModel}` : ""}
              </p>
              <p className="text-[10px] text-zinc-400">
                Set <code className="text-zinc-500">GEMINI_TOKEN_BUDGET</code>{" "}
                to your AI Studio allowance to see this as a bar. Google exposes
                no usage API for a key, so the total has to be declared.
              </p>
            </div>
          )}

          {budget.apify ? (
            <UsageMeter
              label="🔎 Apify scraper · this month"
              used={budget.apify.usedUsd}
              total={budget.apify.limitUsd}
              format={(n) => `$${n.toFixed(2)}`}
              note={
                budget.apify.cycleEndsAt
                  ? `Live from your Apify account · resets ${new Date(budget.apify.cycleEndsAt).toLocaleDateString("en-GB")}`
                  : "Live from your Apify account"
              }
            />
          ) : (
            <p className="text-[11px] text-zinc-400">
              🔎 Apify usage unavailable — check <code>APIFY_TOKEN</code> is set
              on this environment.
            </p>
          )}

          {market ? (
            <p className="border-t border-zinc-100 pt-3 text-[11px] text-zinc-500">
              This run:{" "}
              <span className="font-medium text-zinc-700">
                {market.totalScraped.toLocaleString()} listings scraped
              </span>{" "}
              via {market.sources.join(", ")}.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
