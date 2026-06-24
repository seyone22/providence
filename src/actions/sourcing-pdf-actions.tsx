"use server";

import fs from "node:fs";
import path from "node:path";
import {
  Document,
  Image,
  Link,
  Page,
  renderToStream,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";
import { fmtGBP } from "@/lib/uk-landed-cost";

// Serializable payload from the client (server-action argument). Mirrors what
// the Sourcing Analyzer shows on screen so the PDF never drifts from the UI.
export interface SourcingPdfData {
  generatedAt: string;
  vehicle: {
    make: string;
    model: string;
    edition: string;
    year: string;
    mileage: string;
  };
  landed: {
    cifGbp: number;
    duty: number;
    dutyLabel: string;
    vat: number;
    vatLabel: string;
    postBorder: number;
    totalLanded: number;
  };
  market: {
    count: number;
    min: number;
    median: number;
    mean: number;
    max: number;
    p25: number;
    p75: number;
    trimmedOutliers: number;
    totalScraped: number;
    totalAfterClean: number;
    sources: string[];
    widened: boolean;
    matchUsed: string;
    // Comparable listings grouped into the same price bands as the on-screen chart.
    bands: {
      label: string;
      listings: {
        price: number | null;
        year: number | null;
        mileage: number | null;
        trim: string | null;
        source: string;
        url: string | null;
      }[];
    }[];
  };
  verdict: {
    recommendation: "source" | "marginal" | "avoid";
    headline: string;
    reasoning: string;
    confidence: string;
    grossMargin: number;
    marginPct: number;
  };
  usage: {
    aiTokens: number;
    aiModel: string;
    listingsScraped: number;
  };
}

function getLogoDataUri(): string | null {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), "public", "logo.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

const INK = "#09090b";
const SKY = "#0ea5e9";
const MUTED = "#71717a";
const HAIR = "#f4f4f5";
const VERDICT_COLOR: Record<string, string> = {
  source: "#059669",
  marginal: "#d97706",
  avoid: "#dc2626",
};
const VERDICT_LABEL: Record<string, string> = {
  source: "WORTH SOURCING",
  marginal: "MARGINAL",
  avoid: "AVOID",
};

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    color: INK,
  },
  header: { backgroundColor: INK, color: "#FFFFFF", padding: "24 40 18 40" },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  logo: { width: 28, height: 28, marginRight: 10 },
  brand: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
  brandAccent: { color: SKY },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 2,
    color: "#a1a1aa",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  title: {
    fontSize: 21,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#a1a1aa",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  totalValue: { fontSize: 24, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
  body: { padding: "16 40 22 40" },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 2,
    color: MUTED,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
    marginTop: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: `1pt solid ${HAIR}`,
    paddingVertical: 5,
  },
  rowLabel: { fontSize: 10, color: MUTED },
  rowValue: { fontSize: 10, color: INK, fontFamily: "Helvetica-Bold" },
  provenance: { fontSize: 8, color: "#a1a1aa", marginTop: 3, marginBottom: 2 },
  bandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginTop: 8,
    borderRadius: 3,
  },
  bandLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#3f3f46" },
  bandCount: { fontSize: 8, color: MUTED },
  listingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2.5,
    paddingHorizontal: 6,
    borderBottom: `0.5pt solid ${HAIR}`,
  },
  listingPrice: { fontSize: 9, fontFamily: "Helvetica-Bold", color: INK },
  listingMeta: { fontSize: 8.5, color: MUTED },
  listingLink: { fontSize: 8.5, color: SKY, textDecoration: "none" },
  usageBox: {
    marginTop: 14,
    backgroundColor: "#fafafa",
    borderRadius: 6,
    padding: 10,
  },
  usageText: { fontSize: 8.5, color: "#52525b", lineHeight: 1.4 },
  verdictBox: {
    marginTop: 14,
    border: `1pt solid ${HAIR}`,
    borderRadius: 8,
    padding: 14,
  },
  verdictTag: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  verdictHeadline: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 8,
    color: INK,
  },
  verdictBody: {
    fontSize: 10,
    color: "#3f3f46",
    marginTop: 4,
    lineHeight: 1.5,
  },
  disclaimer: {
    fontSize: 7.5,
    color: "#a1a1aa",
    lineHeight: 1.45,
    marginTop: 16,
  },
  footer: { marginTop: 18, borderTop: "1pt solid #e4e4e7", paddingTop: 8 },
  footerText: {
    fontSize: 7.5,
    color: "#a1a1aa",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const ReportPDF = ({
  data,
  logo,
}: {
  data: SourcingPdfData;
  logo: string | null;
}) => {
  const v = data.vehicle;
  const vehicleLine = [v.year, v.make, v.model, v.edition]
    .filter(Boolean)
    .join(" ");
  return (
    <Document title={`Sourcing Report — ${vehicleLine}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {logo ? <Image src={logo} style={styles.logo} /> : null}
            <Text style={styles.brand}>
              Providence <Text style={styles.brandAccent}>Auto</Text>
            </Text>
          </View>
          <Text style={styles.eyebrow}>
            UK Import Sourcing & Profit Analysis
          </Text>
          <Text style={styles.title}>{vehicleLine || "Sourcing Report"}</Text>
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total landed cost</Text>
              <Text style={styles.totalValue}>
                {fmtGBP(data.landed.totalLanded)}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.totalLabel}>Gross margin (at median)</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Helvetica-Bold",
                  color: data.verdict.grossMargin >= 0 ? SKY : "#f87171",
                }}
              >
                {fmtGBP(data.verdict.grossMargin)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Vehicle</Text>
          <Row label="Make / Model" value={`${v.make} ${v.model}`.trim()} />
          {v.edition ? <Row label="Edition / Grade" value={v.edition} /> : null}
          {v.year ? <Row label="Year" value={v.year} /> : null}
          {v.mileage ? (
            <Row label="Mileage" value={`${v.mileage} miles`} />
          ) : null}

          <Text style={styles.sectionTitle}>Landed Cost (GBP)</Text>
          <Row label="CIF value" value={fmtGBP(data.landed.cifGbp)} />
          <Row label={data.landed.dutyLabel} value={fmtGBP(data.landed.duty)} />
          <Row label={data.landed.vatLabel} value={fmtGBP(data.landed.vat)} />
          <Row
            label="Post-border fees"
            value={fmtGBP(data.landed.postBorder)}
          />
          <Row
            label="Total landed cost"
            value={fmtGBP(data.landed.totalLanded)}
          />

          <Text style={styles.sectionTitle}>
            UK Market ({data.market.count} comparable listings ·{" "}
            {data.market.sources.join(", ")}
            {data.market.widened
              ? ` · widened to ${data.market.matchUsed}`
              : ""}
            )
          </Text>
          <Row label="Lowest" value={fmtGBP(data.market.min)} />
          <Row label="Median" value={fmtGBP(data.market.median)} />
          <Row label="Mean" value={fmtGBP(data.market.mean)} />
          <Row label="Highest" value={fmtGBP(data.market.max)} />
          <Row
            label="Interquartile range (mid 50%)"
            value={`${fmtGBP(data.market.p25)} – ${fmtGBP(data.market.p75)}`}
          />
          <Text style={styles.provenance}>
            {data.market.totalScraped} listings scraped →{" "}
            {data.market.totalAfterClean} after cleaning → {data.market.count}{" "}
            comparable
            {data.market.trimmedOutliers > 0
              ? ` · ${data.market.trimmedOutliers} price outlier${data.market.trimmedOutliers === 1 ? "" : "s"} excluded`
              : ""}
          </Text>

          {/* Listings analysed, grouped by price band */}
          {data.market.bands.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Listings Analysed</Text>
              {data.market.bands.map((band) => (
                <View key={band.label} wrap={false}>
                  <View style={styles.bandHeader}>
                    <Text style={styles.bandLabel}>{band.label}</Text>
                    <Text style={styles.bandCount}>
                      {band.listings.length} car
                      {band.listings.length === 1 ? "" : "s"}
                    </Text>
                  </View>
                  {band.listings.map((l, i) => {
                    const meta = [
                      l.year,
                      l.mileage ? `${l.mileage.toLocaleString()} mi` : null,
                      l.trim,
                      l.source,
                    ]
                      .filter(Boolean)
                      .join(" · ");
                    return (
                      <View
                        key={l.url ?? `${band.label}-${i}`}
                        style={styles.listingRow}
                      >
                        <Text style={styles.listingPrice}>
                          {l.price != null ? fmtGBP(l.price) : "—"}
                          <Text style={styles.listingMeta}> {meta}</Text>
                        </Text>
                        {l.url ? (
                          <Link src={l.url} style={styles.listingLink}>
                            View
                          </Link>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              ))}
            </>
          ) : null}

          <View style={styles.verdictBox}>
            <Text
              style={[
                styles.verdictTag,
                { color: VERDICT_COLOR[data.verdict.recommendation] },
              ]}
            >
              {VERDICT_LABEL[data.verdict.recommendation]} ·{" "}
              {(data.verdict.marginPct * 100).toFixed(1)}% margin ·{" "}
              {data.verdict.confidence} confidence
            </Text>
            <Text style={styles.verdictHeadline}>{data.verdict.headline}</Text>
            <Text style={styles.verdictBody}>{data.verdict.reasoning}</Text>
          </View>

          <View style={styles.usageBox}>
            <Text style={styles.usageText}>
              Usage for this analysis — AI:{" "}
              {data.usage.aiTokens.toLocaleString()} tokens
              {data.usage.aiModel ? ` (${data.usage.aiModel})` : ""} · Market
              data: {data.usage.listingsScraped.toLocaleString()} listings
              scraped via {data.market.sources.join(", ")}.
            </Text>
          </View>

          <Text style={styles.disclaimer}>
            Disclaimer: Indicative analysis only. Landed cost uses HMRC-based
            rates — confirm duty against the live UK Trade Tariff (10-digit
            code) and use HMRC's monthly FX rate. Market figures are scraped
            from live third-party listings and reflect a snapshot at generation
            time; a widened match means fewer exact comparables. The verdict is
            an AI narrative over deterministic figures, not financial advice.
            Verify before committing to a purchase. Generated {data.generatedAt}
            .
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Providence Auto · Sourcing & Profit Analyzer
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) chunks.push(chunk as Uint8Array);
  return Buffer.concat(chunks);
}

export async function generateSourcingPdf(data: SourcingPdfData) {
  try {
    const element = React.createElement(ReportPDF, {
      data,
      logo: getLogoDataUri(),
    });
    // biome-ignore lint/suspicious/noExplicitAny: @react-pdf expects its own element type
    const stream = await renderToStream(element as any);
    const buffer = await streamToBuffer(stream);
    const name = [data.vehicle.year, data.vehicle.make, data.vehicle.model]
      .filter(Boolean)
      .join("_")
      .replace(/\s+/g, "_");
    return {
      success: true as const,
      pdfBase64: buffer.toString("base64"),
      fileName: `Providence_Sourcing_${name || "Report"}.pdf`,
    };
  } catch (error: unknown) {
    console.error("Sourcing PDF error:", error);
    return {
      success: false as const,
      message: error instanceof Error ? error.message : "Failed to build PDF.",
    };
  }
}
