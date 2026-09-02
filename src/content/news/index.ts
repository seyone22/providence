import type { ComponentType } from "react";
import ChineseEvBrandsRecordEuropeMarketShare2026 from "./chinese-ev-brands-record-europe-market-share-2026";
import FerrariLuceChassis040MillionAuction from "./ferrari-luce-chassis-0-40-million-auction";
import IrelandEvIncentivesTaper20262028 from "./ireland-ev-incentives-taper-2026-2028";
import JapanUsedCarExportsRecordWeakYen2026 from "./japan-used-car-exports-record-weak-yen-2026";
import MercedesMaybachS580EFirstClassUkSpec from "./mercedes-maybach-s-580-e-first-class-uk-spec";
import MitsubishiPajeroRevealedSpecificationsLaunchMarkets from "./mitsubishi-pajero-revealed-specifications-launch-markets";
import MitsubishiPajeroThailandAustraliaSourcingCorridors from "./mitsubishi-pajero-thailand-australia-sourcing-corridors";
import Monterey2026AuctionWeekMarketReport from "./monterey-2026-auction-week-market-report";
import MontereyCarWeek2026NewCarDebuts from "./monterey-car-week-2026-new-car-debuts";
import NissanPatrolY63AustraliaPricingConfirmed from "./nissan-patrol-y63-australia-pricing-confirmed";
import NissanPatrolY63RightHandDriveMarkets from "./nissan-patrol-y63-right-hand-drive-markets";
import NissanPatrolY63VsLandcruiser300DealerRead from "./nissan-patrol-y63-vs-landcruiser-300-dealer-read";
import RangeRoverElectricRevealedSpecificationsPrice from "./range-rover-electric-revealed-specifications-price";
import RangeRoverElectricUkSourcingExportVat from "./range-rover-electric-uk-sourcing-export-vat";
import SriLankaVehicleImportSurchargeExtended2026 from "./sri-lanka-vehicle-import-surcharge-extended-2026";
import UkZevMandateReview2026Consultation from "./uk-zev-mandate-review-2026-consultation";

// Maps a news slug to its body component. Keep keys in sync with NEWS_ARTICLES
// in src/config/news.ts.
export const NEWS_BODIES: Record<string, ComponentType> = {
  "ferrari-luce-chassis-0-40-million-auction":
    FerrariLuceChassis040MillionAuction,
  "monterey-2026-auction-week-market-report":
    Monterey2026AuctionWeekMarketReport,
  "monterey-car-week-2026-new-car-debuts": MontereyCarWeek2026NewCarDebuts,
  "uk-zev-mandate-review-2026-consultation": UkZevMandateReview2026Consultation,
  "chinese-ev-brands-record-europe-market-share-2026":
    ChineseEvBrandsRecordEuropeMarketShare2026,
  "ireland-ev-incentives-taper-2026-2028": IrelandEvIncentivesTaper20262028,
  "japan-used-car-exports-record-weak-yen-2026":
    JapanUsedCarExportsRecordWeakYen2026,
  "mercedes-maybach-s-580-e-first-class-uk-spec":
    MercedesMaybachS580EFirstClassUkSpec,
  "sri-lanka-vehicle-import-surcharge-extended-2026":
    SriLankaVehicleImportSurchargeExtended2026,
  "nissan-patrol-y63-australia-pricing-confirmed":
    NissanPatrolY63AustraliaPricingConfirmed,
  "nissan-patrol-y63-vs-landcruiser-300-dealer-read":
    NissanPatrolY63VsLandcruiser300DealerRead,
  "nissan-patrol-y63-right-hand-drive-markets":
    NissanPatrolY63RightHandDriveMarkets,
  "mitsubishi-pajero-revealed-specifications-launch-markets":
    MitsubishiPajeroRevealedSpecificationsLaunchMarkets,
  "mitsubishi-pajero-thailand-australia-sourcing-corridors":
    MitsubishiPajeroThailandAustraliaSourcingCorridors,
  "range-rover-electric-revealed-specifications-price":
    RangeRoverElectricRevealedSpecificationsPrice,
  "range-rover-electric-uk-sourcing-export-vat":
    RangeRoverElectricUkSourcingExportVat,
};

export function getNewsBody(slug: string): ComponentType | undefined {
  return NEWS_BODIES[slug];
}
