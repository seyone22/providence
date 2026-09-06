import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { getSpecDossierById } from "@/actions/spec-actions";
import GalleryDetailClient from "@/components/GalleryDetailClient";
import { formatVehicleTitle } from "@/lib/vehicle";
import { auth } from "@/utils/auth";

export const revalidate = 60;

// 1. Add the generateMetadata function
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = (await params).id;
  const response = await getSpecDossierById(id);

  // If no car is found, return some fallback metadata
  if (!response.success || !response.data) {
    return {
      title: "Vehicle Not Found",
      description: "The requested vehicle dossier could not be located.",
    };
  }

  const car = response.data;

  // Build the title with the same de-duped make/model used on the card so
  // the preview reads "2022 Lexus LX500d", not "2022 Lexus Lexus LX500d".
  const pageTitle =
    `${car.year || ""} ${formatVehicleTitle(car.make, car.model)}`.trim();
  // Use the admin's template notes (Additional Template Notes) for the link preview description.
  // If none provided, fall back to a generic description.
  const pageDescription = car.notes?.trim()
    ? car.notes
    : `View full specifications, gallery, and details for the ${pageTitle}.`;
  // Honor the admin-selected hero image, then fall back to the first gallery
  // image, then a static default. metadataBase (src/app/layout.tsx) resolves
  // any relative path to an absolute URL for the preview crawler.
  const ogImage = car.heroImageUrl || car.images?.[0] || "/gallery_image.jpg";

  // Every car is reachable at both /b2c/gallery/<slug> and /b2c/gallery/<_id>,
  // and both used to answer 200 with no canonical between them — so Google saw
  // two identical pages and indexed neither. Search Console listed five raw-id
  // URLs alongside their own slug URLs under "Discovered - currently not
  // indexed". The slug form is the one every internal link uses, so it is the
  // canonical; the page component below 308s the id form onto it.
  const canonicalPath = `/b2c/gallery/${car.slug || id}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `/b2c/gallery/${car.slug || id}`,
      siteName: "Providence Auto",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
  };
}

// 2. Your existing page component remains exactly the same
export default async function GalleryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = (await params).id;
  const response = await getSpecDossierById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const car = response.data;

  // Collapse the two URLs for this car into one. The dossier resolves by slug
  // OR by _id, so a car with a slug had two live, identical, 200-answering
  // URLs — the exact shape of the duplicate-content problem Search Console
  // reported. 308 (permanent) rather than 307, so the id form's accumulated
  // equity moves to the slug instead of being split.
  if (car.slug && id !== car.slug) {
    permanentRedirect(`/b2c/gallery/${car.slug}`);
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session;

  if (!isLoggedIn) {
    if (car.status !== "Active" && car.status !== "Published") {
      redirect("/");
    }
  }

  return <GalleryDetailClient car={car} />;
}
