import type { Metadata } from "next";

// Client component, so it could not carry its own canonical — Search Console
// listed the staging copy of this URL under "Duplicate without user-selected
// canonical". Indexable: "request a car import" is a real query and this is the
// page that answers it.
const PATH = "/request";
const TITLE = "Request a Car — Tell Us the Spec, We Find It";
const DESCRIPTION =
  "Tell us the make, model, grade and budget you want. Our teams search the auctions and trade channels of 40+ markets and come back with what is actually available.";

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

export default function RequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
