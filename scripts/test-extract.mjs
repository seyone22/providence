// Standalone Gemini auction-sheet extraction test.
// Mirrors the prompt/model/schema in src/actions/sourcing-actions.ts so a
// passing run here ≈ a passing run of the real server action.
//
// Usage:  node scripts/test-extract.mjs "C:\\path\\to\\auction-sheet.jpg"

import { readFileSync } from "node:fs";
import { extname } from "node:path";

// ── Load GEMINI_API_KEY from .env.local (no dotenv dependency) ───────────────
function loadEnv() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^GEMINI_API_KEY=(.*)$/);
      if (m) return m[1].trim();
    }
  } catch {}
  return process.env.GEMINI_API_KEY;
}

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

const GEMINI_MODEL = "gemini-2.5-flash";

const PROMPT = `You are reading a Japanese used-car auction inspection sheet (USS / JAA / TAA style).
Extract the vehicle's details and return them as JSON matching the provided schema.

Rules:
- Translate all Japanese text to English.
- Convert the Japanese-era first-registration date to a Western year (e.g. H28/12 = Heisei 28 = December 2016; R6 = Reiwa 6 = 2024). Put the Western year in "year" and a human label in "registrationDate".
- "mileageKm" is the odometer reading (走行) in kilometres. Also compute "mileageMiles" = round(mileageKm * 0.621371).
- "auctionGrade" is the overall condition score (評価点, e.g. 4, 4.5, 5, R, RA). "interiorGrade" is the interior letter (内装, A/B/C/D).
- "features" = notable equipment / sales points (装備, セールスポイント), each a short English phrase. Do not invent items not on the sheet.
- "conditionNotes" = inspector remarks / damage notes (検査員報告), translated.
- Use null for any field you cannot read with confidence. Never guess prices.`;

const SCHEMA = {
  type: "object",
  properties: {
    make: { type: "string", nullable: true },
    model: { type: "string", nullable: true },
    trimGrade: { type: "string", nullable: true },
    chassisCode: { type: "string", nullable: true },
    year: { type: "integer", nullable: true },
    registrationDate: { type: "string", nullable: true },
    mileageKm: { type: "integer", nullable: true },
    mileageMiles: { type: "integer", nullable: true },
    displacementCc: { type: "integer", nullable: true },
    fuel: { type: "string", nullable: true },
    drivetrain: { type: "string", nullable: true },
    transmission: { type: "string", nullable: true },
    seats: { type: "integer", nullable: true },
    exteriorColour: { type: "string", nullable: true },
    auctionGrade: { type: "string", nullable: true },
    interiorGrade: { type: "string", nullable: true },
    features: { type: "array", items: { type: "string" } },
    conditionNotes: { type: "string", nullable: true },
  },
};

async function main() {
  const path = process.argv[2];
  if (!path) {
    console.error('Usage: node scripts/test-extract.mjs "<image-or-pdf-path>"');
    process.exit(1);
  }
  const key = loadEnv();
  if (!key) {
    console.error("GEMINI_API_KEY not found in .env.local or environment.");
    process.exit(1);
  }

  const mimeType = MIME[extname(path).toLowerCase()] ?? "image/jpeg";
  const dataBase64 = readFileSync(path).toString("base64");

  const t0 = Date.now();
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: PROMPT }, { inlineData: { mimeType, data: dataBase64 } }] },
        ],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
          responseSchema: SCHEMA,
        },
      }),
    },
  );

  if (!res.ok) {
    console.error(`Gemini error ${res.status}:`, await res.text());
    process.exit(1);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(text);
  if (parsed.mileageMiles == null && parsed.mileageKm > 0) {
    parsed.mileageMiles = Math.round(parsed.mileageKm * 0.621371);
  }

  console.log(`\n✓ Extracted in ${((Date.now() - t0) / 1000).toFixed(1)}s · ${json.usageMetadata?.totalTokenCount ?? "?"} tokens\n`);
  console.log(JSON.stringify(parsed, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
