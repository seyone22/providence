import type { Metadata } from "next";
import HomeClient from "./HomeClient";

// The home page is a client component (marquees, framer-motion hero), and a
// client component cannot export metadata — which is why the site's most
// important URL shipped with no canonical at all. Google noticed: Search
// Console listed https://providenceauto.co.uk/ under "Duplicate without
// user-selected canonical", because the apex and www copies were identical and
// neither one claimed to be the original.
//
// So the route is a thin server component that owns the metadata and renders
// the client tree. Everything else (title, description, Open Graph, the
// AutoDealer JSON-LD) is inherited from the root layout and stays correct; only
// the canonical is added here, on the www host to match metadataBase, the
// sitemap and robots.txt.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomeClient />;
}
