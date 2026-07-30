"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

// The marketing footer belongs to the public site only. Rendering it under the
// app routes is not just visually wrong — it is a full-width element that
// scrolls up over the admin panel's `fixed` sidebar and swallows its clicks.
const HIDE_FOOTER_ON = ["/embed", "/admin", "/auth", "/dealer-dashboard"];

export default function ConditionalFooter() {
  const pathname = usePathname();

  if (HIDE_FOOTER_ON.some((prefix) => pathname?.startsWith(prefix)))
    return null;
  return <Footer />;
}
