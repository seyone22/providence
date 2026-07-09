import type { Metadata } from "next";
import { getAllSpecDossiers } from "@/actions/spec-actions";
import GalleryClient from "@/components/GalleryClient";

export const revalidate = 60; // Optional: Revalidate the page every 60 seconds

const PAGE_TITLE = "The Gallery";
const PAGE_DESCRIPTION =
  "A curated selection of globally-sourced vehicle specifications, ready to be commissioned to your exact requirements.";

// Give the listing page the same rich link preview as the detail pages:
// honour an admin-selected hero image from the newest active dossier, then
// fall back to a gallery image, then a static default.
export async function generateMetadata(): Promise<Metadata> {
  const response = await getAllSpecDossiers();
  const dossiers = (response.success ? response.data : []) as Array<{
    status?: string;
    heroImageUrl?: string;
    images?: string[];
  }>;
  const active = dossiers.filter((d) => d.status === "Active");

  const ogImage =
    active.find((d) => d.heroImageUrl)?.heroImageUrl ||
    active.find((d) => d.images?.length)?.images?.[0] ||
    "/gallery_image.jpg";

  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    openGraph: {
      title: `${PAGE_TITLE} | Providence Auto`,
      description: PAGE_DESCRIPTION,
      url: "/b2c/gallery",
      siteName: "Providence Auto",
      images: [{ url: ogImage, width: 1200, height: 630, alt: PAGE_TITLE }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${PAGE_TITLE} | Providence Auto`,
      description: PAGE_DESCRIPTION,
      images: [ogImage],
    },
  };
}

export default async function GalleryPage() {
  const response = await getAllSpecDossiers();
  const dossiers = response.success ? response.data : [];

  return <GalleryClient dossiers={dossiers} />;
}
