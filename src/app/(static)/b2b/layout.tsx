import type { Metadata } from "next";

// /b2b is a client component (framer-motion hero), and a client component
// cannot export metadata — which is why Search Console listed
// https://www.providenceauto.co.uk/b2b under "Duplicate without user-selected
// canonical". The canonical lives on the www host to match metadataBase, the
// sitemap and robots.txt.
const PATH = "/b2b";
const TITLE = "Dealer Car Sourcing — Inventory On Demand from 40+ Markets";
const DESCRIPTION =
  "Source stock direct from the auctions and trade channels of 40+ markets, with our own teams in eight countries. Tell us the spec, get it landed at your port.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Providence Auto` },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
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
  robots: { index: true, follow: true },
};

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return children;
}
