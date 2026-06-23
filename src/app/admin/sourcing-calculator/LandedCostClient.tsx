"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import {
  computeLandedCost,
  DUTY_LABELS,
  FTA_COUNTRIES,
  fmtGBP,
  fmtPct,
  ORIGIN_COUNTRY_LABELS,
  type OriginCountry,
  POST_BORDER_DEFAULTS,
  resolveTaxTreatment,
} from "@/lib/uk-landed-cost";

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

  // ── Auction-sheet upload / extraction state ─────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extract, setExtract] = useState<AuctionSheetExtract | null>(null);

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
    } catch (err) {
      setExtractError(
        err instanceof Error ? err.message : "Could not read the file.",
      );
    } finally {
      setExtracting(false);
    }
  }

  // ── CIF cost components ─────────────────────────────────────────────────────
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("JPY");
  const [hammerPrice, setHammerPrice] = useState("");
  const [auctionExportFees, setAuctionExportFees] = useState("");
  const [inlandTransportOrigin, setInlandTransportOrigin] = useState("");
  const [oceanFreight, setOceanFreight] = useState("");
  const [marineInsurance, setMarineInsurance] = useState("");

  // FX — prefilled from live rate, editable (HMRC monthly is the official basis).
  const liveRate = fx.rates[currency] ?? 0;
  const [fxRate, setFxRate] = useState(String(liveRate));

  // ── Tax treatment (salesperson-friendly inputs → duty/VAT derived) ──────────
  const [country, setCountry] = useState<OriginCountry>("japan");
  const [hasOriginStatement, setHasOriginStatement] = useState(false); // conservative
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

  const result = useMemo(
    () =>
      computeLandedCost({
        currency,
        hammerPrice: num(hammerPrice),
        auctionExportFees: num(auctionExportFees),
        inlandTransportOrigin: num(inlandTransportOrigin),
        oceanFreight: num(oceanFreight),
        marineInsurance: num(marineInsurance),
        fxRate: num(fxRate),
        dutyBasis,
        vatBasis,
        dvlaRegistration: num(dvlaRegistration),
        numberPlates: num(numberPlates),
        approvalTest: num(approvalTest),
        ivaModifications: num(ivaModifications),
        ukInlandTransport: num(ukInlandTransport),
      }),
    [
      currency,
      hammerPrice,
      auctionExportFees,
      inlandTransportOrigin,
      oceanFreight,
      marineInsurance,
      fxRate,
      dutyBasis,
      vatBasis,
      dvlaRegistration,
      numberPlates,
      approvalTest,
      ivaModifications,
      ukInlandTransport,
    ],
  );

  const cifLabel = `${currency} ${Math.round(result.cifOriginal).toLocaleString()}`;

  // ── Market analysis + verdict ───────────────────────────────────────────────
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [market, setMarket] = useState<MarketAnalysis | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

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
          count: market.stats.count,
          min: market.stats.min,
          median: market.stats.median,
          mean: market.stats.mean,
          max: market.stats.max,
          sources: market.sources,
          widened: market.widened,
          matchUsed: market.matchUsed,
        },
        verdict,
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
        market,
        verdict,
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

  async function runMarketAnalysis() {
    if (!make.trim() || !model.trim()) {
      setMarketError("Enter at least a make and model first.");
      return;
    }
    setAnalyzing(true);
    setMarketError(null);
    setVerdict(null);
    setSaved(false);
    try {
      // Trim keywords = edition tokens minus the make/model words, so a Macan
      // "Turbo" matches AutoTrader's derivative string (which omits the model).
      const modelTokens = new Set(
        `${make} ${model}`.toLowerCase().split(/\s+/).filter(Boolean),
      );
      const trimKeywords = edition
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 1 && !modelTokens.has(w));

      const res = await analyzeMarket({
        make: make.trim(),
        model: model.trim(),
        trimKeywords,
        year: year ? Number.parseInt(year, 10) : null,
        mileage: mileage ? num(mileage) : null,
        strictness: "tight",
      });
      if (!res.success) {
        setMarketError(res.message);
        return;
      }
      setMarket(res.data);

      // Hand the finished numbers to Gemini for the buy/avoid verdict.
      const v = await getVerdict({
        vehicle: { make, model, edition, year, mileage },
        landedCostGbp: result.totalLanded,
        stats: res.data.stats,
        matchUsed: res.data.matchUsed,
        widened: res.data.widened,
      });
      if (v.success) setVerdict(v.data);
      else setMarketError(v.message);
    } catch (err) {
      setMarketError(
        err instanceof Error ? err.message : "Market analysis failed.",
      );
    } finally {
      setAnalyzing(false);
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
                      setFxRate(String(fx.rates[c] ?? 0));
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
                  label={`FX rate (GBP per ${currency})`}
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
                  onChange={setAuctionExportFees}
                />
                <Field
                  label="Inland transport (origin)"
                  value={inlandTransportOrigin}
                  onChange={setInlandTransportOrigin}
                />
                <Field
                  label="Ocean freight to UK port"
                  value={oceanFreight}
                  onChange={setOceanFreight}
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
              <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
                <span aria-hidden>⚠️</span>
                <p>
                  These are indicative placeholder figures, not a live quote.
                  Confirm each against your actual costs before relying on the
                  landed-cost total — DVLA and IVA fees, plates, mods and
                  transport vary per vehicle.
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
                sub="DVLA, plates, IVA/MOT, mods, transport"
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
            <Button
              className="w-full mt-4 bg-white text-zinc-900 hover:bg-zinc-200"
              disabled={analyzing}
              onClick={runMarketAnalysis}
            >
              {analyzing ? "Analysing market…" : "Analyse UK market & verdict"}
            </Button>
            {marketError ? (
              <p className="mt-2 text-[11px] text-red-400">{marketError}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* ── Market analysis & verdict ───────────────────────────────────────── */}
      {market ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">UK market & verdict</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {market.stats.count} comparable listings
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  source: {market.sources.join(", ")}
                </Badge>
                {market.widened ? (
                  <Badge className="text-[10px] bg-amber-100 text-amber-800">
                    widened match ({market.matchUsed}) · lower confidence
                  </Badge>
                ) : null}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stat tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Lowest", value: market.stats.min },
                { label: "Median", value: market.stats.median },
                { label: "Mean", value: market.stats.mean },
                { label: "Highest", value: market.stats.max },
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
            {market.stats.histogram.length > 0 ? (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={market.stats.histogram}
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
                      {market.stats.histogram.map((b) => {
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
                  Price distribution of comparable UK listings · blue = where
                  your landed cost sits
                </p>
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
                      market.stats.median - result.totalLanded >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {fmtGBP(market.stats.median - result.totalLanded)}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    median {fmtGBP(market.stats.median)} − landed{" "}
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
                    {analyzing ? "Writing verdict…" : "No verdict"}
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
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
