import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  COUNTRY_BASE_PATH,
  getCountryPage,
  getCountrySlugs,
  hasCountryPage,
} from "@/config/countries";
import CountryLanding from "./CountryLanding";

const SITE = "https://www.providenceauto.co.uk";

export function generateStaticParams() {
  return getCountrySlugs().map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  // hasCountryPage, not just getCountryPage: a presence-only office (Sri Lanka)
  // still resolves as data but has no route. next.config.ts 301s it, and this
  // is the backstop if that redirect is ever removed.
  const config = hasCountryPage(country) ? getCountryPage(country) : undefined;
  if (!config) return {};

  const path = `${COUNTRY_BASE_PATH}/${config.slug}`;
  const url = `${SITE}${path}`;

  return {
    title: { absolute: config.meta.title },
    description: config.meta.description,
    keywords: config.meta.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url,
      siteName: "Providence Auto",
      title: config.meta.title,
      description: config.meta.description,
      images: [
        {
          url: config.hero.backgroundImage,
          alt: `Vehicles sourced from ${config.country} by Providence Auto`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.meta.title,
      description: config.meta.description,
      images: [config.hero.backgroundImage],
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
}

export default async function SourceCountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const config = hasCountryPage(country) ? getCountryPage(country) : undefined;
  if (!config) notFound();

  const path = `${COUNTRY_BASE_PATH}/${config.slug}`;
  const url = `${SITE}${path}`;

  // ── Structured data for Google rich results + AI search (ChatGPT, Perplexity…)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Vehicle Sourcing & Export from ${config.country}`,
    serviceType: "Vehicle sourcing, inspection and export",
    description: config.meta.description,
    url,
    areaServed: "Worldwide",
    provider: {
      "@type": "Organization",
      name: "Providence Auto",
      url: `${SITE}/`,
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    brand: [...new Set(config.signature.map((v) => v.make))].map((name) => ({
      "@type": "Brand",
      name,
    })),
  };

  // The physical office in this country. Address is emitted only once it has
  // been filled in, so we never publish a placeholder as structured data.
  const officeSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Providence Auto ${config.shortName}`,
    parentOrganization: { "@type": "Organization", name: "Providence Auto" },
    url,
    ...(config.office.addressLines.length > 0
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: config.office.addressLines[0],
            addressLocality: config.office.city || undefined,
            addressCountry: config.shortName,
          },
        }
      : {}),
    ...(config.office.phone ? { telephone: config.office.phone } : {}),
    ...(config.office.email ? { email: config.office.email } : {}),
    areaServed: config.region,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Global network",
        item: `${SITE}${COUNTRY_BASE_PATH}`,
      },
      { "@type": "ListItem", position: 3, name: config.shortName, item: url },
    ],
  };

  const vehicleListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Vehicles Providence Auto sources from ${config.country}`,
    itemListElement: config.signature.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${v.make} ${v.model}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(officeSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleListSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Slug, not the config object: the config holds Lucide icon components,
          which cannot be serialised across the server→client boundary. */}
      <CountryLanding slug={config.slug} />
    </>
  );
}
