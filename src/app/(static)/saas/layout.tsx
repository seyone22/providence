import type { Metadata } from "next";

// Client component, so it cannot export its own metadata. See ../b2b/layout.tsx.
// Safe as a layout: /saas has no child routes, so nothing can inherit this
// canonical.
const PATH = "/saas";
const TITLE = "Global Portal — Sourcing Software for Motor Dealers";
const DESCRIPTION =
  "Search live stock across 40+ markets, price a landed car and place an order from one portal. Built for dealers who buy abroad and want the numbers before they bid.";

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

export default function SaasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
