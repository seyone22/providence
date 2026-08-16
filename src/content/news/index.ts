import type { ComponentType } from "react";
import FerrariLuceChassis040MillionAuction from "./ferrari-luce-chassis-0-40-million-auction";

// Maps a news slug to its body component. Keep keys in sync with NEWS_ARTICLES
// in src/config/news.ts.
export const NEWS_BODIES: Record<string, ComponentType> = {
  "ferrari-luce-chassis-0-40-million-auction":
    FerrariLuceChassis040MillionAuction,
};

export function getNewsBody(slug: string): ComponentType | undefined {
  return NEWS_BODIES[slug];
}
