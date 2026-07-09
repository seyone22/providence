import type { Metadata } from "next";
import { indianCampaignConfig } from "@/config/landing-pages";
import IndianCarsLanding from "./IndianCarsLanding";

const SITE = "https://www.providenceauto.co.uk";
const PATH = "/indian-manufactured-cars";
const URL = `${SITE}${PATH}`;

// Brands promoted on this page — kept in sync with the client grid for the
// ItemList schema so AI search engines can enumerate what we source.
const BRAND_NAMES = [
  "Suzuki",
  "Toyota",
  "Kia",
  "Nissan",
  "Hyundai",
  "Honda",
  "Tata",
  "Mahindra",
  "Renault",
  "Volkswagen",
  "Skoda",
  "MG",
];

export const metadata: Metadata = {
  title: { absolute: indianCampaignConfig.meta.title },
  description: indianCampaignConfig.meta.description,
  keywords: [
    "indian manufactured cars",
    "india built cars",
    "import cars from india",
    "made in india cars",
    "suzuki made in india",
    "india built toyota",
    "kia made in india",
    "cheap quality car imports",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: URL,
    siteName: "Providence Auto",
    title: indianCampaignConfig.meta.title,
    description: indianCampaignConfig.meta.description,
    images: [
      {
        url: indianCampaignConfig.hero.backgroundImage,
        alt: "Indian-manufactured cars sourced by Providence Auto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: indianCampaignConfig.meta.title,
    description: indianCampaignConfig.meta.description,
    images: [indianCampaignConfig.hero.backgroundImage],
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

export default function IndianManufacturedCarsPage() {
  // ── Structured data for Google rich results + AI search (ChatGPT, Perplexity…)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Indian-Manufactured Car Sourcing & Import",
    serviceType: "Vehicle sourcing and import",
    description: indianCampaignConfig.meta.description,
    url: URL,
    areaServed: ["United Kingdom", "Europe", "Middle East"],
    provider: {
      "@type": "Organization",
      name: "Providence Auto",
      url: `${SITE}/`,
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    brand: BRAND_NAMES.map((name) => ({ "@type": "Brand", name })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Indian-Manufactured Cars",
        item: URL,
      },
    ],
  };

  const brandListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Indian-manufactured car brands sourced by Providence Auto",
    itemListElement: BRAND_NAMES.map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: indianCampaignConfig.faqs.categories.flatMap((cat) =>
      cat.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandListSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <IndianCarsLanding />
    </>
  );
}
