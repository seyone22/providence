import type { Metadata } from "next";

// Canonical lives on the www host to match the sitemap, robots.txt and the
// metadataBase set in the root layout. Relative URLs below resolve against it.
const PATH = "/ireland-cost-calculator";
const URL = `https://www.providenceauto.co.uk${PATH}`;

const TITLE =
  "Ireland Car Import Cost Calculator 2026 – VRT, VAT & Customs Duty";
const DESCRIPTION =
  "Free calculator for the cost of importing a car to Ireland — VRT, VAT, customs duty and the NOx levy on 2026 Revenue rates. Covers cars from the UK, Japan, the EU and beyond, with live exchange rates.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "Ireland car import calculator",
    "VRT calculator Ireland",
    "cost of importing a car to Ireland",
    "customs duty Ireland car",
    "VAT on imported car Ireland",
    "VRT rates 2026",
    "import Japanese car to Ireland",
    "import UK car to Ireland",
    "OMSP calculator",
    "landed cost calculator Ireland",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: URL,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

// Structured data drives Google rich results and gives AI search tools (ChatGPT
// search, Perplexity, Gemini, etc.) clean, citable facts about the page.
const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ireland Car Import Cost Calculator",
  url: URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description: DESCRIPTION,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  featureList: [
    "Customs duty (0% or 10%) based on country of manufacture and source",
    "Irish VAT at 23% with used-vehicle exemption for EU/NI imports",
    "VRT from 7% to 41% of OMSP based on WLTP CO₂ emissions",
    "NOx levy for petrol and diesel cars",
    "OMSP estimation using Revenue depreciation tables",
    "Live ECB exchange rates",
  ],
  provider: {
    "@type": "AutoDealer",
    name: "Providence Auto",
    url: "https://www.providenceauto.co.uk/",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.providenceauto.co.uk/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Ireland Car Import Cost Calculator",
      item: URL,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does it cost to import a car to Ireland in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The total landed cost is the purchase price plus shipping, customs duty (0% or 10%), VAT (23% where it applies), Vehicle Registration Tax (VRT, 7%–41% of the car's OMSP based on CO₂ emissions) and a NOx levy on petrol and diesel cars. Use the calculator for an exact estimate based on your car and where you're buying it.",
      },
    },
    {
      "@type": "Question",
      name: "Do I pay customs duty when importing a car from the UK to Ireland?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Customs duty is 0% on cars built in the UK if you have proof of UK origin, under the EU–UK Trade and Cooperation Agreement. Cars that were built elsewhere (including EU-built cars sold through Great Britain) pay the standard 10% duty on the CIF value.",
      },
    },
    {
      "@type": "Question",
      name: "Is there customs duty on a car imported from Japan to Ireland?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Japanese-built cars qualify for 0% customs duty under the EU–Japan Economic Partnership Agreement, provided you have a statement of origin. Otherwise the standard 10% tariff applies.",
      },
    },
    {
      "@type": "Question",
      name: "Do I have to pay Irish VAT on a used car from the EU?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — a car imported from the EU or Northern Ireland is VAT-free if it qualifies as used, meaning it is more than 6 months old AND has more than 6,000 km. If it is under 6 months old or under 6,000 km it counts as a 'new means of transport' and 23% Irish VAT applies.",
      },
    },
    {
      "@type": "Question",
      name: "What is VRT and how is it calculated in Ireland?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vehicle Registration Tax is charged at 7% to 41% of the car's OMSP (Open Market Selling Price), with the rate set by the car's WLTP CO₂ emissions. Electric cars fall in the lowest 7% band and qualify for VRT relief of up to €5,000 until 31 December 2026. Classic cars over 30 years old pay a flat €200.",
      },
    },
    {
      "@type": "Question",
      name: "What is OMSP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OMSP is the Open Market Selling Price — Revenue's estimate of what the car would sell for at Irish retail. VRT is charged on the OMSP, not on the price you paid abroad. It can be estimated from the price when new using Revenue's depreciation tables.",
      },
    },
  ],
};

export default function IrelandCostCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
