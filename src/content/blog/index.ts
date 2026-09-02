import type { ComponentType } from "react";
import AustraliaCarExportDocumentsExplained from "./australia-car-export-documents-explained";
import BestCarsToImportFromAustralia from "./best-cars-to-import-from-australia";
import BestCarsToImportFromDubai from "./best-cars-to-import-from-dubai";
import BestCarsToImportFromIndia from "./best-cars-to-import-from-india";
import BestCarsToImportFromJapan from "./best-cars-to-import-from-japan";
import BestCarsToImportFromNewZealand from "./best-cars-to-import-from-new-zealand";
import BestCarsToImportFromTheUk from "./best-cars-to-import-from-the-uk";
import BestCarsToImportToSriLanka from "./best-cars-to-import-to-sri-lanka";
import BestPickupsToImportFromThailand from "./best-pickups-to-import-from-thailand";
import BestCarsToImportToIreland from "./cheapest-cars-to-import-to-ireland";
import CheapestWayToImportACarToIreland from "./cheapest-way-to-import-a-car-to-ireland";
import CostOfImportingACarToIreland from "./cost-of-importing-a-car-to-ireland";
import CostToImportACarFromAustralia from "./cost-to-import-a-car-from-australia";
import CostToImportACarFromIndia from "./cost-to-import-a-car-from-india";
import CostToImportACarFromJapan from "./cost-to-import-a-car-from-japan";
import CostToImportACarFromNewZealand from "./cost-to-import-a-car-from-new-zealand";
import CostToImportACarFromThailand from "./cost-to-import-a-car-from-thailand";
import CostToImportACarFromTheUae from "./cost-to-import-a-car-from-the-uae";
import CostToImportACarFromTheUk from "./cost-to-import-a-car-from-the-uk";
import DoINeedAnIvaTest from "./do-i-need-an-iva-test";
import GccSpecCarsExplained from "./gcc-spec-cars-explained";
import HowToBuyACarAtJapaneseAuction from "./how-to-buy-a-car-at-japanese-auction";
import HowToImportACarFromAustralia from "./how-to-import-a-car-from-australia";
import HowToImportACarFromIndia from "./how-to-import-a-car-from-india";
import HowToImportACarFromNewZealand from "./how-to-import-a-car-from-new-zealand";
import HowToImportACarFromThailand from "./how-to-import-a-car-from-thailand";
import HowToImportACarFromTheUae from "./how-to-import-a-car-from-the-uae";
import HowToImportACarFromTheUk from "./how-to-import-a-car-from-the-uk";
import HowToImportANissanPatrol from "./how-to-import-a-nissan-patrol";
import ImportCarFromJapanOrUkToIreland from "./import-car-from-japan-or-uk-to-ireland";
import ImportingACarToSriLanka from "./importing-a-car-to-sri-lanka";
import ImportingAUsedEvFromNewZealand from "./importing-a-used-ev-from-new-zealand";
import ImportingAUteOr4x4FromAustralia from "./importing-a-ute-or-4x4-from-australia";
import ImportingCarsFromIndiaForDealers from "./importing-cars-from-india-for-dealers";
import ImportingCarsToIreland from "./importing-cars-to-ireland";
import ImportingHybridsAndEvsToSriLanka from "./importing-hybrids-and-evs-to-sri-lanka";
import IndiaCarExportDocumentsExplained from "./india-car-export-documents-explained";
import IvaTestCentresUk from "./iva-test-centres-uk";
import IvaTestCost from "./iva-test-cost";
import IvaTestExplained from "./iva-test-explained";
import IvaTestRequirements from "./iva-test-requirements";
import JapanCarExportDocumentsExplained from "./japan-car-export-documents-explained";
import JapaneseAuctionGradesExplained from "./japanese-auction-grades-explained";
import NewZealandVsJapanForUsedImports from "./new-zealand-vs-japan-for-used-imports";
import NissanPatrolY63GradesExplained from "./nissan-patrol-y63-grades-explained";
import RegisteringAnImportedCarInTheUk from "./registering-an-imported-car-in-the-uk";
import SriLankaCarImportDocumentsExplained from "./sri-lanka-car-import-documents-explained";
import SriLankaVehicleImportRulesForDealers from "./sri-lanka-vehicle-import-rules-for-dealers";
import SriLankaVehicleImportTaxesExplained from "./sri-lanka-vehicle-import-taxes-explained";
import ThailandCarExportDocumentsExplained from "./thailand-car-export-documents-explained";
import ThailandVsJapanForPickupImports from "./thailand-vs-japan-for-pickup-imports";
import UaeCarExportDocumentsExplained from "./uae-car-export-documents-explained";
import UkCarExportDocumentsExplained from "./uk-car-export-documents-explained";
import UkCarHistoryChecksExplained from "./uk-car-history-checks-explained";
import VrtExplainedIreland from "./vrt-explained-ireland";
import WhyAreIndianManufacturedCarsCheaper from "./why-are-indian-manufactured-cars-cheaper";

// Maps a post slug to its body component. Keep keys in sync with BLOG_POSTS
// in src/config/blog.ts (Ireland cluster) and src/config/blog-countries.ts
// (per-source-country clusters).
export const BLOG_BODIES: Record<string, ComponentType> = {
  // ── Ireland cluster ────────────────────────────────────────────────────────
  "importing-cars-to-ireland": ImportingCarsToIreland,
  "cheapest-cars-to-import-to-ireland": BestCarsToImportToIreland,
  "cheapest-way-to-import-a-car-to-ireland": CheapestWayToImportACarToIreland,
  "cost-of-importing-a-car-to-ireland": CostOfImportingACarToIreland,
  "vrt-explained-ireland": VrtExplainedIreland,
  "import-car-from-japan-or-uk-to-ireland": ImportCarFromJapanOrUkToIreland,
  "why-are-indian-manufactured-cars-cheaper":
    WhyAreIndianManufacturedCarsCheaper,

  // ── Model guides ───────────────────────────────────────────────────────────
  "how-to-import-a-nissan-patrol": HowToImportANissanPatrol,
  "nissan-patrol-y63-grades-explained": NissanPatrolY63GradesExplained,

  // ── UK registration & IVA ──────────────────────────────────────────────────
  "iva-test-explained": IvaTestExplained,
  "do-i-need-an-iva-test": DoINeedAnIvaTest,
  "iva-test-cost": IvaTestCost,
  "iva-test-requirements": IvaTestRequirements,
  "iva-test-centres-uk": IvaTestCentresUk,
  "registering-an-imported-car-in-the-uk": RegisteringAnImportedCarInTheUk,

  // ── Japan ──────────────────────────────────────────────────────────────────
  "how-to-buy-a-car-at-japanese-auction": HowToBuyACarAtJapaneseAuction,
  "japanese-auction-grades-explained": JapaneseAuctionGradesExplained,
  "best-cars-to-import-from-japan": BestCarsToImportFromJapan,
  "cost-to-import-a-car-from-japan": CostToImportACarFromJapan,
  "japan-car-export-documents-explained": JapanCarExportDocumentsExplained,

  // ── United Kingdom ─────────────────────────────────────────────────────────
  "how-to-import-a-car-from-the-uk": HowToImportACarFromTheUk,
  "best-cars-to-import-from-the-uk": BestCarsToImportFromTheUk,
  "uk-car-history-checks-explained": UkCarHistoryChecksExplained,
  "cost-to-import-a-car-from-the-uk": CostToImportACarFromTheUk,
  "uk-car-export-documents-explained": UkCarExportDocumentsExplained,

  // ── UAE ────────────────────────────────────────────────────────────────────
  "how-to-import-a-car-from-the-uae": HowToImportACarFromTheUae,
  "best-cars-to-import-from-dubai": BestCarsToImportFromDubai,
  "gcc-spec-cars-explained": GccSpecCarsExplained,
  "cost-to-import-a-car-from-the-uae": CostToImportACarFromTheUae,
  "uae-car-export-documents-explained": UaeCarExportDocumentsExplained,

  // ── India ──────────────────────────────────────────────────────────────────
  "how-to-import-a-car-from-india": HowToImportACarFromIndia,
  "best-cars-to-import-from-india": BestCarsToImportFromIndia,
  "importing-cars-from-india-for-dealers": ImportingCarsFromIndiaForDealers,
  "cost-to-import-a-car-from-india": CostToImportACarFromIndia,
  "india-car-export-documents-explained": IndiaCarExportDocumentsExplained,

  // ── Thailand ───────────────────────────────────────────────────────────────
  "how-to-import-a-car-from-thailand": HowToImportACarFromThailand,
  "best-pickups-to-import-from-thailand": BestPickupsToImportFromThailand,
  "thailand-vs-japan-for-pickup-imports": ThailandVsJapanForPickupImports,
  "cost-to-import-a-car-from-thailand": CostToImportACarFromThailand,
  "thailand-car-export-documents-explained":
    ThailandCarExportDocumentsExplained,

  // ── Australia ──────────────────────────────────────────────────────────────
  "how-to-import-a-car-from-australia": HowToImportACarFromAustralia,
  "best-cars-to-import-from-australia": BestCarsToImportFromAustralia,
  "importing-a-ute-or-4x4-from-australia": ImportingAUteOr4x4FromAustralia,
  "cost-to-import-a-car-from-australia": CostToImportACarFromAustralia,
  "australia-car-export-documents-explained":
    AustraliaCarExportDocumentsExplained,

  // ── New Zealand ────────────────────────────────────────────────────────────
  "how-to-import-a-car-from-new-zealand": HowToImportACarFromNewZealand,
  "best-cars-to-import-from-new-zealand": BestCarsToImportFromNewZealand,
  "new-zealand-vs-japan-for-used-imports": NewZealandVsJapanForUsedImports,
  "cost-to-import-a-car-from-new-zealand": CostToImportACarFromNewZealand,
  "importing-a-used-ev-from-new-zealand": ImportingAUsedEvFromNewZealand,

  // ── Sri Lanka ──────────────────────────────────────────────────────────────
  "importing-a-car-to-sri-lanka": ImportingACarToSriLanka,
  "sri-lanka-vehicle-import-taxes-explained":
    SriLankaVehicleImportTaxesExplained,
  "best-cars-to-import-to-sri-lanka": BestCarsToImportToSriLanka,
  "sri-lanka-car-import-documents-explained":
    SriLankaCarImportDocumentsExplained,
  "importing-hybrids-and-evs-to-sri-lanka": ImportingHybridsAndEvsToSriLanka,
  "sri-lanka-vehicle-import-rules-for-dealers":
    SriLankaVehicleImportRulesForDealers,
};

export function getBody(slug: string): ComponentType | undefined {
  return BLOG_BODIES[slug];
}
