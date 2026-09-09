import type { ComponentType } from "react";
import BonhamsGoodwoodRevival2026AuctionPreview from "./bonhams-goodwood-revival-2026-auction-preview";
import ChanganRayongRightHandDriveThailandExportBase from "./changan-rayong-right-hand-drive-thailand-export-base";
import ChineseEvBrandsRecordEuropeMarketShare2026 from "./chinese-ev-brands-record-europe-market-share-2026";
import CollectorCarMarket15YearLow2026NotABuySignal from "./collector-car-market-15-year-low-2026-not-a-buy-signal";
import DestinationCurrencyCustomsExchangeRateCarImport from "./destination-currency-customs-exchange-rate-car-import";
import EuEndOfLifeVehiclesRegulationUsedCarExports2031 from "./eu-end-of-life-vehicles-regulation-used-car-exports-2031";
import FerrariLuceChassis040MillionAuction from "./ferrari-luce-chassis-0-40-million-auction";
import HongKongEvFirstRegistrationTaxConcessionEnds from "./hong-kong-ev-first-registration-tax-concession-ends";
import ImoSolas2026RoRoEvFireRulesFreightCost from "./imo-solas-2026-ro-ro-ev-fire-rules-freight-cost";
import IrelandEvIncentivesTaper20262028 from "./ireland-ev-incentives-taper-2026-2028";
import JapanUsedCarExportsRecordWeakYen2026 from "./japan-used-car-exports-record-weak-yen-2026";
import Jlr4000JobCuts2026UkSourcingRead from "./jlr-4000-job-cuts-2026-uk-sourcing-read";
import KenyaCrspUsedCarValuationUncertainty2026 from "./kenya-crsp-used-car-valuation-uncertainty-2026";
import KiaSorentoIndiaLaunchPriceAnantapurExport from "./kia-sorento-india-launch-price-anantapur-export";
import MalaysiaCbuEvImportRulesCifPowerFloor from "./malaysia-cbu-ev-import-rules-cif-power-floor";
import MarutiBalenoFacelift2026PriceIndiaExport from "./maruti-baleno-facelift-2026-price-india-export";
import MercedesMaybachS580EFirstClassUkSpec from "./mercedes-maybach-s-580-e-first-class-uk-spec";
import MitsubishiPajeroRevealedSpecificationsLaunchMarkets from "./mitsubishi-pajero-revealed-specifications-launch-markets";
import MitsubishiPajeroThailandAustraliaSourcingCorridors from "./mitsubishi-pajero-thailand-australia-sourcing-corridors";
import Monterey2026AuctionWeekMarketReport from "./monterey-2026-auction-week-market-report";
import MontereyCarWeek2026NewCarDebuts from "./monterey-car-week-2026-new-car-debuts";
import NewZealandCleanCarStandard2026UsedImportCharges from "./new-zealand-clean-car-standard-2026-used-import-charges";
import NissanPatrolY63AustraliaPricingConfirmed from "./nissan-patrol-y63-australia-pricing-confirmed";
import NissanPatrolY63RightHandDriveMarkets from "./nissan-patrol-y63-right-hand-drive-markets";
import NissanPatrolY63VsLandcruiser300DealerRead from "./nissan-patrol-y63-vs-landcruiser-300-dealer-read";
import PakistanUsedCarImportAgeLimitRemoved2026 from "./pakistan-used-car-import-age-limit-removed-2026";
import RangeRoverElectricRevealedSpecificationsPrice from "./range-rover-electric-revealed-specifications-price";
import RangeRoverElectricUkSourcingExportVat from "./range-rover-electric-uk-sourcing-export-vat";
import SriLankaVehicleFinanceLoanToValueCap2026 from "./sri-lanka-vehicle-finance-loan-to-value-cap-2026";
import SriLankaVehicleImportSurchargeExtended2026 from "./sri-lanka-vehicle-import-surcharge-extended-2026";
import TanzaniaUsedVehicleExciseDutyFinanceAct2026 from "./tanzania-used-vehicle-excise-duty-finance-act-2026";
import ThailandVehicleProductionExports2026DealerRead from "./thailand-vehicle-production-exports-2026-dealer-read";
import ToyotaLandCruiserFjJapanPriceThailandBuilt from "./toyota-land-cruiser-fj-japan-price-thailand-built";
import UkEvedPayPerMile2028EvImportRead from "./uk-eved-pay-per-mile-2028-ev-import-read";
import UkZevMandateReview2026Consultation from "./uk-zev-mandate-review-2026-consultation";
import YenIntervention2026JapanCarImportCost from "./yen-intervention-2026-japan-car-import-cost";

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
  "pakistan-used-car-import-age-limit-removed-2026":
    PakistanUsedCarImportAgeLimitRemoved2026,
  "hong-kong-ev-first-registration-tax-concession-ends":
    HongKongEvFirstRegistrationTaxConcessionEnds,
  "malaysia-cbu-ev-import-rules-cif-power-floor":
    MalaysiaCbuEvImportRulesCifPowerFloor,
  "tanzania-used-vehicle-excise-duty-finance-act-2026":
    TanzaniaUsedVehicleExciseDutyFinanceAct2026,
  "imo-solas-2026-ro-ro-ev-fire-rules-freight-cost":
    ImoSolas2026RoRoEvFireRulesFreightCost,
  "thailand-vehicle-production-exports-2026-dealer-read":
    ThailandVehicleProductionExports2026DealerRead,
  "sri-lanka-vehicle-finance-loan-to-value-cap-2026":
    SriLankaVehicleFinanceLoanToValueCap2026,
  "yen-intervention-2026-japan-car-import-cost":
    YenIntervention2026JapanCarImportCost,
  "destination-currency-customs-exchange-rate-car-import":
    DestinationCurrencyCustomsExchangeRateCarImport,
  "toyota-land-cruiser-fj-japan-price-thailand-built":
    ToyotaLandCruiserFjJapanPriceThailandBuilt,
  "kia-sorento-india-launch-price-anantapur-export":
    KiaSorentoIndiaLaunchPriceAnantapurExport,
  "maruti-baleno-facelift-2026-price-india-export":
    MarutiBalenoFacelift2026PriceIndiaExport,
  "bonhams-goodwood-revival-2026-auction-preview":
    BonhamsGoodwoodRevival2026AuctionPreview,
  "collector-car-market-15-year-low-2026-not-a-buy-signal":
    CollectorCarMarket15YearLow2026NotABuySignal,
  "jlr-4000-job-cuts-2026-uk-sourcing-read": Jlr4000JobCuts2026UkSourcingRead,
  "changan-rayong-right-hand-drive-thailand-export-base":
    ChanganRayongRightHandDriveThailandExportBase,
  "eu-end-of-life-vehicles-regulation-used-car-exports-2031":
    EuEndOfLifeVehiclesRegulationUsedCarExports2031,
  "new-zealand-clean-car-standard-2026-used-import-charges":
    NewZealandCleanCarStandard2026UsedImportCharges,
  "kenya-crsp-used-car-valuation-uncertainty-2026":
    KenyaCrspUsedCarValuationUncertainty2026,
  "uk-eved-pay-per-mile-2028-ev-import-read": UkEvedPayPerMile2028EvImportRead,
};

export function getNewsBody(slug: string): ComponentType | undefined {
  return NEWS_BODIES[slug];
}
