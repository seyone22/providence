import type { Metadata } from "next";

// Search Console listed https://www.providenceauto.co.uk/import-japanese-cars-to-ireland
// under "Duplicate without user-selected canonical" — on the production host,
// not just staging. The page is a client component so it could not export
// metadata, and with no canonical of its own Google had to choose between this
// page and its two near-siblings:
//
//   /import-cars-to-ireland  — the cost mechanics for ANY car into Ireland
//   /import-japanese-cars    — sourcing from Japan into ANY destination
//   this page                — the intersection: a Japanese car, into Ireland
//
// The intersection is a real query with real search volume, and it is the only
// one of the three that answers it, so it is self-canonical. The title below
// leads with that intersection rather than repeating either sibling's angle.
const PATH = "/import-japanese-cars-to-ireland";
const TITLE = "Import a Japanese Car to Ireland (2026) — Cost, VRT & Shipping";
const DESCRIPTION =
  "How to buy a car at Japanese auction and land it in Ireland: 0% duty with a CEPA statement of origin, 23% VAT, VRT on OMSP, and the shipping and paperwork in between.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Providence Auto` },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: `https://www.providenceauto.co.uk${PATH}`,
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

export default function ImportJapaneseCarsToIrelandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
