import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import {
  type BreakdownData,
  fmtEUR,
  fmtPct,
  MONTH_NAMES,
} from "@/lib/ireland-cost";

interface CalculatorBreakdownEmailProps {
  data: BreakdownData;
}

export const CalculatorBreakdownEmail = ({
  data,
}: CalculatorBreakdownEmailProps) => {
  const line = (
    label: string,
    value: string,
    sub?: string,
    accent?: boolean,
  ) => (
    <Row style={lineRow}>
      <Column>
        <Text style={lineLabel}>{label}</Text>
        {sub ? <Text style={lineSub}>{sub}</Text> : null}
      </Column>
      <Column style={{ textAlign: "right" as const }}>
        <Text style={accent ? lineValueAccent : lineValue}>{value}</Text>
      </Column>
    </Row>
  );

  return (
    <Html>
      <Head />
      <Preview>{`Your Ireland landed cost estimate — ${fmtEUR(data.totalLanded)} total`}</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Heading style={brandStyle}>
            Providence <span style={{ color: "#0ea5e9" }}>Auto</span>
          </Heading>

          <Text style={eyebrowStyle}>
            Ireland Import Tool · 2026 Revenue Rates
          </Text>
          <Heading as="h2" style={subHeadingStyle}>
            Your Landed Cost Breakdown
          </Heading>

          {/* Headline total */}
          <Section style={totalCard}>
            <Text style={totalLabel}>Total Landed in Ireland</Text>
            <Text style={totalValue}>{fmtEUR(data.totalLanded)}</Text>
            <Text style={totalSub}>{data.taxPct}% tax burden on CIF value</Text>
          </Section>

          {/* Vehicle */}
          <Text style={sectionTitle}>Vehicle</Text>
          {line("Fuel type", data.fuelType)}
          {line(
            "First registered",
            `${MONTH_NAMES[data.monthFirstReg - 1]} ${data.yearFirstReg}`,
            `Age at import: ${data.ageMonths} month${data.ageMonths === 1 ? "" : "s"}`,
          )}
          {line(
            "Mileage at import",
            `${data.mileageKm.toLocaleString("en-IE")} km`,
          )}
          {!data.isEV
            ? line(
                "CO₂ emissions",
                `${data.effectiveCO2.toFixed(0)} g/km (${data.co2Standard})`,
              )
            : null}
          {line("Source country", data.sourceCountry)}
          {line("Country of manufacture", data.countryOfManufacture)}
          {line("Irish OMSP", fmtEUR(data.omsp))}

          {/* Base cost */}
          <Text style={sectionTitle}>Base Cost</Text>
          {line(
            "Purchase price",
            fmtEUR(data.priceEUR),
            data.currency !== "EUR"
              ? `${data.purchasePriceOriginal.toLocaleString()} ${data.currency}`
              : undefined,
          )}
          {line("Shipping & transport", fmtEUR(data.shippingCost))}
          {line(
            "CIF value",
            fmtEUR(data.cifValue),
            "Cost + Insurance + Freight",
          )}

          {/* Taxes */}
          <Text style={sectionTitle}>Irish Import Taxes</Text>
          {line(
            `Customs duty (${fmtPct(data.dutyRate)})`,
            fmtEUR(data.customsDuty),
            data.dutyRate === 0 ? "Preferential rate applies" : undefined,
          )}
          {line(
            data.vatNeeded ? "VAT (23%)" : "VAT (0% — used vehicle from EU/NI)",
            fmtEUR(data.vatAmount),
            data.vatNeeded
              ? `On CIF + duty: ${fmtEUR(data.vatBase)}`
              : undefined,
          )}
          {data.isClassic
            ? line(
                "VRT — Category C (classic)",
                fmtEUR(data.vrtAmount),
                "Vehicles 30+ years old",
              )
            : line(
                `VRT (${fmtPct(data.vrtRate)} of OMSP)`,
                fmtEUR(data.vrtAmount),
                `${data.effectiveCO2.toFixed(0)} g/km · OMSP ${fmtEUR(data.omsp)}`,
              )}
          {!data.isClassic
            ? line(
                "NOx levy",
                fmtEUR(data.noxLevy),
                data.noxLevy === 0 ? "Zero NOx" : undefined,
              )
            : null}
          {data.evRelief > 0
            ? line(
                "BEV VRT relief",
                `– ${fmtEUR(data.evRelief)}`,
                "Expires 31 December 2026",
              )
            : null}

          <Hr style={hrStyle} />
          {line("Total import taxes", fmtEUR(data.totalTaxes))}
          {line(
            "Total landed in Ireland",
            fmtEUR(data.totalLanded),
            undefined,
            true,
          )}

          <Text style={attachNote}>
            A branded PDF copy of this breakdown is attached to this email.
          </Text>

          <Hr style={hrStyle} />
          <Text style={disclaimerStyle}>
            Indicative estimate based on 2026 Revenue rates and current EU trade
            agreements. VRT is charged on Revenue's OMSP, confirmed at NCTS
            inspection. This is not legal, financial or tax advice. Generated{" "}
            {data.generatedAt}.
          </Text>
          <Text style={footerTextStyle}>
            © {new Date().getFullYear()} Providence Auto. We handle customs,
            VRT, NCTS and delivery end-to-end.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default CalculatorBreakdownEmail;

// --- STYLES ---
const mainStyle = {
  backgroundColor: "#f8fafc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  padding: "20px",
};
const containerStyle = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  maxWidth: "600px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
};
const brandStyle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#0f172a",
  marginBottom: "4px",
  marginTop: "0",
  letterSpacing: "-0.025em",
};
const eyebrowStyle = {
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#94a3b8",
  margin: "0 0 16px 0",
};
const subHeadingStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1e293b",
  marginBottom: "16px",
  marginTop: "0",
};
const totalCard = {
  backgroundColor: "#09090b",
  borderRadius: "12px",
  padding: "20px 24px",
  marginBottom: "8px",
};
const totalLabel = {
  fontSize: "11px",
  color: "#a1a1aa",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  margin: "0 0 6px 0",
};
const totalValue = {
  fontSize: "30px",
  fontWeight: "800",
  color: "#ffffff",
  margin: "0",
};
const totalSub = { fontSize: "12px", color: "#71717a", margin: "6px 0 0 0" };
const sectionTitle = {
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#94a3b8",
  margin: "24px 0 4px 0",
};
const lineRow = { borderBottom: "1px solid #f1f5f9" };
const lineLabel = { fontSize: "14px", color: "#475569", margin: "8px 0 0 0" };
const lineSub = { fontSize: "11px", color: "#94a3b8", margin: "2px 0 8px 0" };
const lineValue = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#0f172a",
  margin: "8px 0",
};
const lineValueAccent = {
  fontSize: "16px",
  fontWeight: "800",
  color: "#0ea5e9",
  margin: "8px 0",
};
const attachNote = {
  fontSize: "13px",
  color: "#0369a1",
  backgroundColor: "#f0f9ff",
  border: "1px solid #bae6fd",
  borderRadius: "8px",
  padding: "10px 14px",
  margin: "20px 0 0 0",
};
const hrStyle = {
  borderColor: "#e2e8f0",
  margin: "20px 0",
  borderTop: "1px solid #e2e8f0",
};
const disclaimerStyle = {
  fontSize: "11px",
  color: "#94a3b8",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
};
const footerTextStyle = {
  fontSize: "12px",
  color: "#64748b",
  lineHeight: "1.6",
  margin: "0",
};
