import { ImageResponse } from "next/og";

// Branded 1200×630 share card, generated at build/request time so social and
// search previews (and the missing /og-image.jpg) are covered for this route.
export const alt =
  "Ireland Car Import Cost Calculator — VRT, VAT & Customs Duty";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#09090b",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", color: "#ffffff" }}>
        <div style={{ fontSize: 34, fontWeight: 700 }}>Providence</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: "#0ea5e9" }}>
          &nbsp;Auto
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#0ea5e9",
            marginBottom: 20,
          }}
        >
          Ireland Import Tool · 2026 Revenue Rates
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 86,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          Car Import Cost Calculator
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 36,
          fontWeight: 600,
          color: "#a1a1aa",
        }}
      >
        VRT · VAT · Customs Duty · NOx — your total landed cost in Ireland
      </div>
    </div>,
    { ...size },
  );
}
