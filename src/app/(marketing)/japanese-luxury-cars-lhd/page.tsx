import type { Metadata } from "next";
import { lhdCampaignConfig } from "@/config/landing-pages";
import LhdLuxuryLanding from "./LhdLuxuryLanding";

const SITE = "https://www.providenceauto.co.uk";
const PATH = "/japanese-luxury-cars-lhd";
const URL = `${SITE}${PATH}`;

// Marques promoted on this page — kept in sync with the client grid for the
// ItemList schema so AI search engines can enumerate what we source.
const BRAND_NAMES = [
    "Rolls-Royce", "Bentley", "Ferrari", "Lamborghini", "Aston Martin",
    "McLaren", "Bugatti", "Porsche", "Mercedes-Benz", "BMW", "Audi",
    "Maserati", "Lexus", "Genesis", "Lucid", "Lotus",
];

export const metadata: Metadata = {
    title: { absolute: lhdCampaignConfig.meta.title },
    description: lhdCampaignConfig.meta.description,
    keywords: [
        "left-hand drive luxury cars",
        "LHD cars from Japan",
        "import LHD luxury car",
        "left-hand drive supercar",
        "Japanese car auction luxury",
        "LHD Rolls-Royce",
        "LHD Ferrari",
        "LHD Porsche",
    ],
    alternates: { canonical: PATH },
    openGraph: {
        type: "website",
        locale: "en_GB",
        url: URL,
        siteName: "Providence Auto",
        title: lhdCampaignConfig.meta.title,
        description: lhdCampaignConfig.meta.description,
        images: [{ url: lhdCampaignConfig.hero.backgroundImage, alt: "Left-hand drive luxury cars from Japan" }],
    },
    twitter: {
        card: "summary_large_image",
        title: lhdCampaignConfig.meta.title,
        description: lhdCampaignConfig.meta.description,
        images: [lhdCampaignConfig.hero.backgroundImage],
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

export default function JapaneseLuxuryCarsLhdPage() {
    // ── Structured data for Google rich results + AI search (ChatGPT, Perplexity…)
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Left-Hand Drive Luxury Car Sourcing from Japan",
        serviceType: "Vehicle sourcing and import",
        description: lhdCampaignConfig.meta.description,
        url: URL,
        areaServed: ["Europe", "Middle East", "Americas"],
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
            { "@type": "ListItem", position: 2, name: "Left-Hand Drive Luxury Cars", item: URL },
        ],
    };

    const brandListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Left-hand drive luxury marques sourced from Japan",
        itemListElement: BRAND_NAMES.map((name, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name,
        })),
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: lhdCampaignConfig.faqs.categories.flatMap((cat) =>
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
            <LhdLuxuryLanding />
        </>
    );
}
