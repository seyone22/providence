"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isEmbed = pathname?.startsWith("/embed");

  if (isEmbed) return null;
  return <Footer />;
}
