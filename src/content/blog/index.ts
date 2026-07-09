import type { ComponentType } from "react";
import CheapestCarsToImportToIreland from "./cheapest-cars-to-import-to-ireland";
import CheapestWayToImportACarToIreland from "./cheapest-way-to-import-a-car-to-ireland";
import CostOfImportingACarToIreland from "./cost-of-importing-a-car-to-ireland";
import ImportCarFromJapanOrUkToIreland from "./import-car-from-japan-or-uk-to-ireland";
import ImportingCarsToIreland from "./importing-cars-to-ireland";
import VrtExplainedIreland from "./vrt-explained-ireland";
import WhyAreIndianManufacturedCarsCheaper from "./why-are-indian-manufactured-cars-cheaper";

// Maps a post slug to its body component. Keep keys in sync with BLOG_POSTS
// in src/config/blog.ts.
export const BLOG_BODIES: Record<string, ComponentType> = {
  "importing-cars-to-ireland": ImportingCarsToIreland,
  "cheapest-cars-to-import-to-ireland": CheapestCarsToImportToIreland,
  "cheapest-way-to-import-a-car-to-ireland": CheapestWayToImportACarToIreland,
  "cost-of-importing-a-car-to-ireland": CostOfImportingACarToIreland,
  "vrt-explained-ireland": VrtExplainedIreland,
  "import-car-from-japan-or-uk-to-ireland": ImportCarFromJapanOrUkToIreland,
  "why-are-indian-manufactured-cars-cheaper":
    WhyAreIndianManufacturedCarsCheaper,
};

export function getBody(slug: string): ComponentType | undefined {
  return BLOG_BODIES[slug];
}
