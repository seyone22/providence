"use server";

import fs from "node:fs";
import path from "node:path";
import {
  Document,
  Image,
  Page,
  renderToStream,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";
import {
  type BreakdownData,
  fmtEUR,
  fmtPct,
  MONTH_NAMES,
} from "@/lib/ireland-cost";

// ─── Brand logo as a data URI (read from /public for @react-pdf) ─────────────
function getLogoDataUri(): string | null {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), "public", "logo.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

// ─── Design-system palette (mirrors the calculator page) ────────────────────
const INK = "#09090b";
const SKY = "#0ea5e9";
const MUTED = "#71717a";
const HAIR = "#f4f4f5";

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    color: INK,
  },

  // Header band
  header: { backgroundColor: INK, color: "#FFFFFF", padding: "32 40 28 40" },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 22 },
  logo: { width: 30, height: 30, marginRight: 10 },
  brand: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
  brandAccent: { color: SKY },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 2,
    color: "#a1a1aa",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    marginBottom: 14,
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
  totalValue: { fontSize: 28, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
  burdenValue: { fontSize: 18, fontFamily: "Helvetica-Bold", color: SKY },

  // Body
  body: { padding: "28 40" },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 2,
    color: MUTED,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    marginTop: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: `1pt solid ${HAIR}`,
    paddingVertical: 7,
  },
  rowLabel: { fontSize: 10, color: MUTED },
  rowValue: { fontSize: 10, color: INK, fontFamily: "Helvetica-Bold" },
  rowSub: { fontSize: 8, color: "#a1a1aa", marginTop: 2 },

  totalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: INK,
    color: "#FFFFFF",
    padding: "12 16",
    borderRadius: 8,
    marginTop: 14,
  },
  totalBarLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  totalBarValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },

  disclaimer: {
    fontSize: 7.5,
    color: "#a1a1aa",
    lineHeight: 1.5,
    marginTop: 22,
  },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    borderTop: `1pt solid #e4e4e7`,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    color: "#a1a1aa",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

function Row({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const BreakdownPDF = ({
  data,
  logo,
}: {
  data: BreakdownData;
  logo: string | null;
}) => (
  <Document title="Ireland Landed Cost Breakdown — Providence Auto">
    <Page size="A4" style={styles.page}>
      {/* Header band */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {logo ? <Image src={logo} style={styles.logo} /> : null}
          <Text style={styles.brand}>
            Providence <Text style={styles.brandAccent}>Auto</Text>
          </Text>
        </View>
        <Text style={styles.eyebrow}>
          Ireland Import Tool · 2026 Revenue Rates
        </Text>
        <Text style={styles.title}>Landed Cost Breakdown</Text>
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total Landed in Ireland</Text>
            <Text style={styles.totalValue}>{fmtEUR(data.totalLanded)}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.totalLabel}>Tax Burden (of CIF)</Text>
            <Text style={styles.burdenValue}>{data.taxPct}%</Text>
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Vehicle */}
        <Text style={styles.sectionTitle}>Vehicle Details</Text>
        <Row label="Fuel type" value={data.fuelType} />
        <Row
          label="First registered"
          value={`${MONTH_NAMES[data.monthFirstReg - 1]} ${data.yearFirstReg}`}
          sub={`Age at import: ${data.ageMonths} month${data.ageMonths === 1 ? "" : "s"}`}
        />
        <Row
          label="Mileage at import"
          value={`${data.mileageKm.toLocaleString("en-IE")} km`}
        />
        {!data.isEV ? (
          <Row
            label="CO₂ emissions"
            value={`${data.effectiveCO2.toFixed(0)} g/km (${data.co2Standard})`}
          />
        ) : null}
        {!data.isEV ? (
          <Row label="NOx emissions" value={`${data.noxValue} mg/km`} />
        ) : null}
        <Row label="Source country" value={data.sourceCountry} />
        <Row label="Country of manufacture" value={data.countryOfManufacture} />
        <Row label="Irish OMSP" value={fmtEUR(data.omsp)} />

        {/* Costs */}
        <Text style={styles.sectionTitle}>Base Cost</Text>
        <Row
          label="Purchase price"
          value={fmtEUR(data.priceEUR)}
          sub={
            data.currency !== "EUR"
              ? `${data.purchasePriceOriginal.toLocaleString()} ${data.currency} at indicative rate`
              : undefined
          }
        />
        <Row label="Shipping & transport" value={fmtEUR(data.shippingCost)} />
        <Row
          label="CIF value (cost + insurance + freight)"
          value={fmtEUR(data.cifValue)}
        />

        {/* Taxes */}
        <Text style={styles.sectionTitle}>Irish Import Taxes</Text>
        <Row
          label={`Customs duty (${fmtPct(data.dutyRate)})`}
          value={fmtEUR(data.customsDuty)}
          sub={
            data.dutyRate === 0
              ? "Preferential trade agreement applies"
              : undefined
          }
        />
        <Row
          label={
            data.vatNeeded ? "VAT (23%)" : "VAT (0% — used vehicle from EU/NI)"
          }
          value={fmtEUR(data.vatAmount)}
          sub={
            data.vatNeeded
              ? `On CIF + duty: ${fmtEUR(data.vatBase)}`
              : undefined
          }
        />
        {data.isClassic ? (
          <Row
            label="VRT — Category C (classic, 30+ yrs)"
            value={fmtEUR(data.vrtAmount)}
            sub="Flat rate"
          />
        ) : (
          <Row
            label={`VRT (${fmtPct(data.vrtRate)} of OMSP)`}
            value={fmtEUR(data.vrtAmount)}
            sub={`${data.effectiveCO2.toFixed(0)} g/km · OMSP ${fmtEUR(data.omsp)}`}
          />
        )}
        {!data.isClassic ? (
          <Row
            label="NOx levy"
            value={fmtEUR(data.noxLevy)}
            sub={data.noxLevy === 0 ? "Zero NOx" : undefined}
          />
        ) : null}
        {data.evRelief > 0 ? (
          <Row
            label="BEV VRT relief"
            value={`– ${fmtEUR(data.evRelief)}`}
            sub="Expires 31 December 2026"
          />
        ) : null}
        <Row label="Total import taxes" value={fmtEUR(data.totalTaxes)} />

        {/* Grand total */}
        <View style={styles.totalBar}>
          <Text style={styles.totalBarLabel}>Total Landed in Ireland</Text>
          <Text style={styles.totalBarValue}>{fmtEUR(data.totalLanded)}</Text>
        </View>

        <Text style={styles.disclaimer}>
          Disclaimer: This breakdown provides indicative estimates based on 2026
          Revenue rates and current EU trade agreements. VRT is charged on
          Revenue's OMSP, confirmed only at NCTS inspection. Exchange rates are
          indicative mid-market figures. Tax rates, VRT bands and reliefs change
          with each Budget. This is not legal, financial or tax advice. Always
          verify with revenue.ie, the NCTS and a licensed customs agent before
          committing to a purchase. Generated {data.generatedAt}.
        </Text>
      </View>

      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>
          Providence Auto · Ireland Landed Cost Calculator ·
          providenceauto.co.uk
        </Text>
      </View>
    </Page>
  </Document>
);

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) chunks.push(chunk as Uint8Array);
  return Buffer.concat(chunks);
}

async function renderBreakdownBuffer(data: BreakdownData): Promise<Buffer> {
  const element = React.createElement(BreakdownPDF, {
    data,
    logo: getLogoDataUri(),
  });
  // biome-ignore lint/suspicious/noExplicitAny: @react-pdf renderToStream expects its own DocumentProps element type
  const stream = await renderToStream(element as any);
  return streamToBuffer(stream);
}

function pdfFileName(data: BreakdownData): string {
  return `Providence_Ireland_Landed_Cost_${data.yearFirstReg}.pdf`;
}

// ─── Action: generate the PDF for download ───────────────────────────────────
export async function generateBreakdownPdf(data: BreakdownData) {
  try {
    const buffer = await renderBreakdownBuffer(data);
    return {
      success: true as const,
      pdfBase64: buffer.toString("base64"),
      fileName: pdfFileName(data),
    };
  } catch (error: unknown) {
    console.error("Breakdown PDF Error:", error);
    return {
      success: false as const,
      message:
        error instanceof Error ? error.message : "Failed to generate PDF",
    };
  }
}

// ─── Action: email the breakdown (PDF attached + summary in body) ────────────
export async function emailBreakdown(data: BreakdownData, recipient: string) {
  try {
    const email = recipient.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false as const, message: "Invalid email address." };
    }

    const buffer = await renderBreakdownBuffer(data);
    // Imported lazily so the PDF-download path never depends on the email
    // stack (Resend) being configured.
    const { emailService } = await import("@/lib/email");
    await emailService.sendCalculatorBreakdown(email, data, {
      filename: pdfFileName(data),
      contentBase64: buffer.toString("base64"),
    });

    return { success: true as const, message: "Breakdown emailed." };
  } catch (error: unknown) {
    console.error("Breakdown Email Error:", error);
    return {
      success: false as const,
      message: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
