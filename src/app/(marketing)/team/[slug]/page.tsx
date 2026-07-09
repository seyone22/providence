import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedProfileBySlug } from "@/actions/sales-profile-actions";
import TeamProfileClient from "@/components/TeamProfileClient";

const SITE = "https://www.providenceauto.co.uk";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPublishedProfileBySlug(slug);

  if (!res.success || !res.data) {
    return {
      title: "Consultant Not Found | Providence Auto",
      description:
        "The requested sourcing consultant page could not be located.",
    };
  }

  const p = res.data.profile;
  const name = p.displayName || "Sourcing Consultant";
  const countries = (p.sourcingCountries || [])
    .map((c: any) => c.country)
    .filter(Boolean);
  const title = `${name} — Personal Car Sourcing Consultant | Providence Auto`;
  const description =
    p.tagline ||
    `Work directly with ${name}, a Providence Auto sourcing consultant${
      countries.length ? ` for ${countries.join(", ")}` : ""
    }. Grade-verified cars, one honest landed price, one person handling your import end to end.`;
  const url = `${SITE}/team/${p.slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/team/${p.slug}` },
    openGraph: {
      type: "profile",
      url,
      siteName: "Providence Auto",
      title,
      description,
      images: p.photoUrl ? [{ url: p.photoUrl, alt: name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: p.photoUrl ? [p.photoUrl] : undefined,
    },
  };
}

export default async function TeamProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getPublishedProfileBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const { profile, featuredVehicles } = res.data;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.displayName || "Sourcing Consultant",
    jobTitle: "Personal Car Sourcing Consultant",
    worksFor: {
      "@type": "Organization",
      name: "Providence Auto",
      url: `${SITE}/`,
    },
    url: `${SITE}/team/${profile.slug}`,
    image: profile.photoUrl || undefined,
    knowsLanguage: profile.languages || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined for crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <TeamProfileClient profile={profile} vehicles={featuredVehicles} />
    </>
  );
}
