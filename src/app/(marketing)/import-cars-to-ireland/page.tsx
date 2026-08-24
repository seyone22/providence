import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe2,
  Ship,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import MinimalHeader from "@/components/MinimalHeader";
import RequestForm from "@/components/requestForm";
import { BLOG_BASE_PATH, type BlogPost, getPost } from "@/config/blog";

// ─────────────────────────────────────────────────────────────────────────────
// /import-cars-to-ireland — the destination pillar page.
//
// Deliberately plain. The audience is someone who has already decided to import
// and is pricing the decision, not someone browsing cars, so this reads as a
// reference document: tables, exact figures, named traps, and a route into
// every tool we run. The flashier Japan-specific pitch lives at
// /import-japanese-cars-to-ireland; this page covers every source country.
//
// EVERY tax figure here is the same one the calculator computes
// (src/app/(marketing)/ireland-cost-calculator/page.tsx and src/lib/ireland-cost.ts)
// so the two surfaces can never disagree. Figures reflect Revenue's 2026 rates
// via the "Ireland Car Import Research" report; per the standing editorial rule
// nothing here is invented, and the page tells the reader to confirm with
// Revenue before committing money.
// ─────────────────────────────────────────────────────────────────────────────

const SITE = "https://www.providenceauto.co.uk";
const PATH = "/import-cars-to-ireland";
const URL = `${SITE}${PATH}`;

/** Shown on the page and in the JSON-LD `dateModified`. */
const LAST_REVIEWED_ISO = "2026-08-21";
const LAST_REVIEWED_LABEL = "21 August 2026";

const TITLE =
  "Importing a Car to Ireland (2026): Full Cost, VRT, VAT & Customs Duty";
const DESCRIPTION =
  "What it actually costs to import a car to Ireland in 2026 — customs duty (0% or 10%), VAT at 23%, VRT from 7% to 41% of OMSP and the NOx levy, with worked totals, the age and mileage sweet spot, and every relief you can legally claim.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "import cars to ireland",
    "importing a car to ireland",
    "how much does it cost to import a car to ireland",
    "car import ireland 2026",
    "VRT rates 2026",
    "VRT calculator ireland",
    "customs duty on cars ireland",
    "VAT on imported car ireland",
    "import car from uk to ireland",
    "import car from japan to ireland",
    "OMSP ireland",
    "NOx levy ireland",
    "cheapest car to import to ireland",
    "new means of transport rule ireland",
    "registering an imported car in ireland",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    locale: "en_IE",
    url: URL,
    siteName: "Providence Auto",
    title: TITLE,
    description: DESCRIPTION,
    modifiedTime: LAST_REVIEWED_ISO,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

// ── Content data ────────────────────────────────────────────────────────────

/** In-page navigation. Ids must match the section headings below. */
const SECTIONS: { id: string; label: string }[] = [
  { id: "cost-summary", label: "What an import actually costs" },
  { id: "charges", label: "The four charges" },
  { id: "order", label: "How the charges stack" },
  { id: "where-to-buy", label: "Where to buy from" },
  { id: "sweet-spot", label: "Age, mileage and condition" },
  { id: "what-to-buy", label: "What to buy, what to avoid" },
  { id: "reliefs", label: "Reliefs you can legally claim" },
  { id: "process", label: "The process and its deadlines" },
  { id: "tools", label: "Tools" },
  { id: "guides", label: "Guides" },
  { id: "faqs", label: "Questions buyers actually ask" },
];

/**
 * Worked landed-cost comparison. Every column reconciles exactly:
 * CIF = price + shipping; duty on CIF; VAT on (CIF + duty); total = the sum.
 * e.g. EU-built from GB: 15,000 + 450 = 15,450 CIF → 10% duty = 1,545 →
 * VAT 23% of 16,995 = 3,909 → + 5,200 VRT = 26,104.
 */
const WORKED_EXAMPLE = {
  columns: [
    "Japanese-built hybrid, from Japan",
    "UK-built hatchback, from GB",
    "EU-built premium, from GB",
  ],
  rows: [
    { label: "Purchase price", values: ["€11,000", "€13,000", "€15,000"] },
    { label: "Shipping / transport", values: ["€1,500", "€450", "€450"] },
    {
      label: "Customs duty",
      values: ["€0 (EPA, 0%)", "€0 (UK origin, 0%)", "€1,545 (10%)"],
      note: "duty",
    },
    {
      label: "VAT at 23% on landed value + duty",
      values: ["€2,875", "€3,094", "€3,909"],
    },
    {
      label: "VRT (varies with CO₂)",
      values: ["€2,400 (low CO₂)", "€2,900", "€5,200 (higher CO₂)"],
    },
  ],
  total: {
    label: "Landed in Ireland",
    values: ["€17,775", "€19,444", "€26,104"],
  },
};

/** 2026 VRT bands — identical to `getVRTRate()` in the calculator. */
const VRT_BANDS: {
  co2: string;
  rate: string;
  typical: string;
  onTwentyK: string;
  tone: "low" | "mid" | "high";
}[] = [
  {
    co2: "0 – 50",
    rate: "7%",
    typical: "Battery EV, plug-in hybrid",
    onTwentyK: "€1,400",
    tone: "low",
  },
  {
    co2: "51 – 80",
    rate: "9%",
    typical: "Efficient full hybrid",
    onTwentyK: "€1,800",
    tone: "low",
  },
  {
    co2: "81 – 90",
    rate: "9.75 – 10.5%",
    typical: "Hybrid / small petrol",
    onTwentyK: "~€2,025",
    tone: "low",
  },
  {
    co2: "91 – 100",
    rate: "11.25 – 12%",
    typical: "Small modern petrol",
    onTwentyK: "~€2,325",
    tone: "mid",
  },
  {
    co2: "101 – 110",
    rate: "12.75 – 13.5%",
    typical: "Mid-size petrol",
    onTwentyK: "~€2,625",
    tone: "mid",
  },
  {
    co2: "111 – 120",
    rate: "15.25 – 16%",
    typical: "Larger petrol / small diesel",
    onTwentyK: "~€3,125",
    tone: "mid",
  },
  {
    co2: "121 – 135",
    rate: "16.75 – 19.25%",
    typical: "Diesel saloon / compact SUV",
    onTwentyK: "~€3,600",
    tone: "mid",
  },
  {
    co2: "136 – 150",
    rate: "20 – 25%",
    typical: "Mid-size SUV",
    onTwentyK: "~€4,500",
    tone: "high",
  },
  {
    co2: "151 – 170",
    rate: "27.5 – 30%",
    typical: "Large SUV / large diesel",
    onTwentyK: "~€5,750",
    tone: "high",
  },
  {
    co2: "171 – 190",
    rate: "35%",
    typical: "Large premium SUV / V6",
    onTwentyK: "€7,000",
    tone: "high",
  },
  {
    co2: "Over 190",
    rate: "41%",
    typical: "Performance / luxury / 4x4",
    onTwentyK: "€8,200",
    tone: "high",
  },
];

/** Source-country comparison. Shipping figures match the calculator's ranges. */
const SOURCE_COUNTRIES: {
  country: string;
  duty: string;
  dutyTone: "good" | "bad" | "mixed";
  vat: string;
  transport: string;
  transit: string;
  steering: string;
  verdict: string;
  strong: boolean;
}[] = [
  {
    country: "Japan",
    duty: "0% — EU–Japan EPA",
    dutyTone: "good",
    vat: "23%",
    transport: "€1,000 – €2,000",
    transit: "6 – 10 weeks",
    steering: "Right-hand drive",
    verdict:
      "The strongest all-round source. Zero duty since 1 February 2026, huge hybrid supply, and graded auction condition.",
    strong: true,
  },
  {
    country: "United Kingdom (GB)",
    duty: "0% if UK-built, otherwise 10%",
    dutyTone: "mixed",
    vat: "23%",
    transport: "€250 – €700",
    transit: "Days",
    steering: "Right-hand drive",
    verdict:
      "Best logistics by far, but duty depends entirely on where the car was built — not where you bought it.",
    strong: true,
  },
  {
    country: "EU (Germany, France…)",
    duty: "0% — free circulation",
    dutyTone: "good",
    vat: "None if genuinely used",
    transport: "€400 – €900",
    transit: "1 – 2 weeks",
    steering: "Left-hand drive",
    verdict:
      "No duty and no VAT on a genuinely used car, but almost all stock is left-hand drive, which hurts Irish resale.",
    strong: false,
  },
  {
    country: "Northern Ireland",
    duty: "0% — treated as EU",
    dutyTone: "good",
    vat: "None if genuinely used",
    transport: "€100 – €300",
    transit: "Same day",
    steering: "Right-hand drive",
    verdict:
      "Cheapest route on paper, but Revenue checks that the car was properly imported into NI in the first place.",
    strong: true,
  },
  {
    country: "India",
    duty: "10% — trade deal not yet at 0% on cars",
    dutyTone: "bad",
    vat: "23%",
    transport: "€1,500 – €2,800",
    transit: "6 – 8 weeks",
    steering: "Right-hand drive",
    verdict:
      "Right-hand drive is the one point in its favour. Duty, stock mix and emissions paperwork all work against it.",
    strong: false,
  },
  {
    country: "Australia",
    duty: "10% — no car concession",
    dutyTone: "bad",
    vat: "23%",
    transport: "€2,500 – €4,500",
    transit: "6 – 10 weeks",
    steering: "Right-hand drive",
    verdict:
      "Niche only. Australia stopped building passenger cars in 2017, so its stock is built elsewhere and pays 10%.",
    strong: false,
  },
  {
    country: "New Zealand",
    duty: "10% — no preferential tariff",
    dutyTone: "bad",
    vat: "23%",
    transport: "€2,500 – €4,500",
    transit: "6 – 10 weeks",
    steering: "Right-hand drive",
    verdict:
      "Its used fleet is largely ex-Japan anyway. Buying the same car directly from Japan is cheaper and faster.",
    strong: false,
  },
];

const RELIEFS: { title: string; body: string; caveat: string }[] = [
  {
    title: "Transfer of Residence",
    body: "If you are genuinely moving your residence to Ireland and owned and used the car abroad for at least six months before the move, you can bring it in free of customs duty, VAT and VRT. It is by far the largest exemption available.",
    caveat:
      "It applies only to a real relocation, and the car generally cannot be sold for 12 months after registration.",
  },
  {
    title: "The 30-year classic rule",
    body: "A vehicle more than 30 years old at the date of registration falls into VRT Category C and pays a flat €200, regardless of its value or emissions. Duty and VAT still apply, but the VRT collapse is dramatic.",
    caveat:
      "Age is measured at registration, not at purchase — a car a few months short of 30 pays the full emissions-based rate.",
  },
  {
    title: "Battery EV relief, until 31 December 2026",
    body: "A battery EV registered before the deadline gets VRT relief of up to €5,000, sits in the lowest 7% CO₂ band and pays no NOx levy at all. The relief tapers between €40,000 and €50,000 OMSP and cannot exceed the VRT actually due.",
    caveat:
      "This is a closing window. Registration — not purchase or shipping — has to happen before 31 December 2026.",
  },
  {
    title: "A valid statement of origin",
    body: "The single biggest avoidable cost is paying 10% duty on a car that qualified for 0%. Insisting on a statement of origin before you buy converts the charge on a Japan-built or UK-built car to zero.",
    caveat:
      "On a €20,000 landed value that is €2,000 of duty, plus the knock-on VAT — because VAT is charged on the duty too.",
  },
  {
    title: "The Northern Ireland route",
    body: "Northern Ireland is treated as EU territory. A used car genuinely resident in NI can often come south with no customs declaration and no VAT, removing both charges at once.",
    caveat:
      "Revenue verifies that the car was properly imported into NI from GB first, and that it was in genuine NI ownership for a reasonable period.",
  },
  {
    title: "Appealing the OMSP",
    body: "VRT is charged on Revenue's estimate of Irish retail value, not on what you paid. If that estimate is too high — common on high-spec or unusual imports — you can formally appeal with comparable listings and condition reports.",
    caveat:
      "A successful appeal reduces VRT directly, but you need documentary evidence, not an opinion.",
  },
  {
    title: "Postponed VAT accounting",
    body: "A VAT-registered Irish motor trader can declare and simultaneously reclaim the 23% import VAT on the same return, instead of paying it in cash at the border.",
    caveat:
      "This is a working-capital advantage available to businesses only — not to private buyers.",
  },
];

const BUY: { title: string; body: string }[] = [
  {
    title: "Japanese-built hybrids",
    body: "Toyota Aqua, Prius, Corolla and Yaris; Honda Fit and Jazz; Nissan Note e-POWER. Zero duty under the EPA, CO₂ low enough to sit near the bottom of the VRT table, negligible NOx, and right-hand drive as standard.",
  },
  {
    title: "Small efficient Japanese petrols",
    body: "Suzuki Swift, Mazda 2 and Mazda 3. Cheap at auction, low emissions, and strong Irish resale because they are familiar models rather than grey-import curiosities.",
  },
  {
    title: "UK-built models, bought in Britain",
    body: "MINI hatch and Cooper (Oxford), Nissan Qashqai, Juke and Leaf (Sunderland), Toyota Corolla (Burnaston), older Honda Civic (Swindon). These are the cars that actually earn the 0% TCA rate on a ferry-length journey.",
  },
  {
    title: "A used battery EV, before the deadline",
    body: "Lowest CO₂ band, zero NOx, and up to €5,000 off the VRT if it is registered before 31 December 2026. The Nissan Leaf is the obvious UK-built candidate.",
  },
];

const AVOID: { title: string; body: string }[] = [
  {
    title: "Large diesel SUVs",
    body: "The worst combination on the board: a 35–41% VRT band and the heaviest NOx levy, which is capped at €4,850 for diesels rather than €600 for petrol.",
  },
  {
    title: "German premium brands bought in Great Britain",
    body: "A BMW, Audi, Mercedes or VW sold in Britain was almost certainly built in the EU. EU-origin cars in use in the UK do not qualify for the TCA rate, so they pay the full 10% duty — and 23% VAT on top of it.",
  },
  {
    title: "Anything over 190 g/km",
    body: "The 41% VRT band. Only worth it when the specific car is the point of the exercise and the tax is simply the price of admission.",
  },
  {
    title: "Pre-2018 cars with NEDC-only CO₂ data",
    body: "Revenue will not use an NEDC figure directly. It applies a conversion that inflates the number and can push the car up a band or two before you have done anything wrong.",
  },
];

const PROCESS: { title: string; body: string }[] = [
  {
    title: "Model the landed cost before you bid",
    body: "Price the exact car — purchase price, shipping, duty, VAT, VRT and NOx — before you commit to anything. The headline foreign price is never the real price, and this is the only step that is free to get right.",
  },
  {
    title: "Confirm origin in writing",
    body: "Get the seller to state where the car was built and to supply a statement of origin. Without one, Revenue defaults to 10% duty even on a car that genuinely qualified for zero.",
  },
  {
    title: "Buy, ship and clear customs",
    body: "Customs duty and import VAT are settled at the point of entry, on the CIF value — the cost of the car plus insurance plus freight.",
  },
  {
    title: "Book the NCTS inspection within 7 days of arrival",
    body: "The vehicle has to be presented at an NCTS centre, where VRT is assessed. Book the appointment within seven days of the car arriving in the State.",
  },
  {
    title: "Register within 30 days of arrival",
    body: "Registration must be completed within 30 days of the car arriving. Missing the deadline risks penalties, and in the worst case detention of the vehicle.",
  },
  {
    title: "Pay VRT, get plates, then the NCT",
    body: "Once VRT and any NOx levy are paid the car gets its Irish registration. Any imported car four years or older also needs to pass the Irish NCT, regardless of a valid foreign test.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How much does it cost to import a car to Ireland in 2026?",
    a: "The landed cost is the purchase price plus shipping, then customs duty (0% or 10%), VAT at 23% where it applies, VRT at 7%–41% of the car's OMSP, and a NOx levy on petrol and diesel. As a worked example, a Japanese-built hybrid bought for €11,000 lands at roughly €17,775 all-in, while an EU-built premium car bought for €15,000 in Britain lands at roughly €26,104 — because it pays 10% duty and sits in a higher CO₂ band.",
  },
  {
    q: "Do I pay customs duty on a car imported from the UK to Ireland?",
    a: "Only if the car was not built in the UK. Under the EU–UK Trade and Cooperation Agreement, a UK-manufactured car qualifies for 0% duty with a valid statement of origin. A car that was built elsewhere — including an EU-built BMW, Audi or Mercedes that was simply sold in Britain — pays the standard 10% on the CIF value. Country of registration is not country of origin, and this single distinction is the most expensive mistake buyers make.",
  },
  {
    q: "Is there customs duty on a car imported from Japan to Ireland?",
    a: "No. Since 1 February 2026 the EU–Japan Economic Partnership Agreement has been at 0% on cars, so a Japanese-built car now enters Ireland at the same zero duty rate as a UK-built one. You need a statement of origin confirming Japanese manufacture; without it Revenue applies the 10% rate.",
  },
  {
    q: "Do I have to pay Irish VAT on a used car from the EU or Northern Ireland?",
    a: "Not if it genuinely counts as used. A car is treated as a 'new means of transport' — and therefore attracts 23% Irish VAT — if it is under 6 months old OR has under 6,000 km. Both conditions have to be cleared for the car to count as used. The clock and the odometer are read on the date the car arrives in Ireland, not the invoice date.",
  },
  {
    q: "What is VRT and how is it calculated?",
    a: "Vehicle Registration Tax is a once-off Irish charge of 7% to 41% of the car's OMSP, with the rate set by WLTP CO₂ emissions. A battery EV or plug-in hybrid under 50 g/km pays 7%; a performance car over 190 g/km pays 41%. On a €20,000 OMSP that is the difference between €1,400 and €8,200 of tax on the same money.",
  },
  {
    q: "What is OMSP and why does it matter more than what I paid?",
    a: "OMSP is the Open Market Selling Price — Revenue's own estimate of what the car would sell for at Irish retail. VRT is charged on the OMSP, not on the price you paid abroad, so buying cheaply abroad does not reduce your VRT. Revenue derives it from the price when new, depreciated by age against model-specific tables and adjusted for month of registration, condition and mileage.",
  },
  {
    q: "What is the NOx levy and how much is it?",
    a: "It is a 'polluter pays' charge on top of VRT for every petrol and diesel car, including hybrids. It runs at €5 per mg/km for the first 40 mg, €15 per mg for the next 40, and €25 per mg above 80 mg. It is capped at €600 for petrol and €4,850 for diesel. Battery EVs pay nothing. Older diesels with no documented NOx figure are assessed at the highest assumed rate, which is a common and expensive surprise.",
  },
  {
    q: "What age of car is cheapest to import to Ireland?",
    a: "Three to eight years old, with average rather than ultra-low mileage. That band clears the six-month 'new means of transport' VAT trap, lets the first owner absorb the steepest depreciation, keeps OMSP and therefore VRT moderate, and is recent enough to carry a genuine WLTP CO₂ figure instead of an NEDC number that gets converted upward.",
  },
  {
    q: "Does very low mileage make a car cheaper to import?",
    a: "No — it usually makes it more expensive. Revenue explicitly adjusts OMSP for mileage, so a very low-mileage import is assigned a higher OMSP and therefore pays more VRT than an equivalent car with average mileage. The value play is average or slightly-above-average mileage with documented good mechanical condition.",
  },
  {
    q: "How long do I have to register an imported car in Ireland?",
    a: "Thirty days from the date the vehicle arrives in the State, with the NCTS inspection appointment booked within seven days of arrival. VRT is assessed at that inspection. Missing the deadline risks penalties and, in the worst case, detention of the vehicle.",
  },
  {
    q: "Is it still worth importing a car from the UK after Brexit?",
    a: "For UK-built models, yes. The ferry is cheap and fast, the paperwork is familiar, and a UK-manufactured car still lands at 0% duty. What changed is that 23% VAT now applies to every GB import regardless of age, which added roughly €6,500 to a car that previously landed at €20,000. For EU-built cars sold in Britain, Brexit removed the case entirely.",
  },
  {
    q: "Can I still get the electric car VRT relief?",
    a: "Until 31 December 2026. A battery EV registered before that date qualifies for VRT relief of up to €5,000, tapering away between €40,000 and €50,000 OMSP, and cannot claim more relief than the VRT actually due. It also sits in the 7% band and pays zero NOx. The deadline is on registration in Ireland, not on purchase, so the shipping time has to be built into the plan.",
  },
];

/** Ireland-cluster guides, pulled from the blog registry so they never drift. */
const GUIDE_SLUGS = [
  "importing-cars-to-ireland",
  "cost-of-importing-a-car-to-ireland",
  "vrt-explained-ireland",
  "cheapest-cars-to-import-to-ireland",
  "cheapest-way-to-import-a-car-to-ireland",
  "import-car-from-japan-or-uk-to-ireland",
];
const GUIDES: BlogPost[] = GUIDE_SLUGS.map(getPost).filter((p): p is BlogPost =>
  Boolean(p),
);

const TOOLS: {
  href: string;
  title: string;
  body: string;
  icon: typeof Calculator;
  external?: boolean;
}[] = [
  {
    href: "/ireland-cost-calculator",
    title: "Ireland Landed Cost Calculator",
    body: "Price a specific car: duty, VAT, VRT, NOx and OMSP depreciation on 2026 Revenue rates, with live ECB exchange rates. This is the tool to use before you bid on anything.",
    icon: Calculator,
  },
  {
    href: "/import-japanese-cars-to-ireland",
    title: "Japan → Ireland import service",
    body: "The Japan-specific route in detail — auction grading, the models that land cheapest, and the end-to-end service from bid to Irish plates.",
    icon: Ship,
  },
  {
    href: "/source-cars-from/japan",
    title: "Our source-country network",
    body: "The eight countries where we have our own teams and buy directly. Each page covers what that market is genuinely good for.",
    icon: Globe2,
  },
  {
    href: "/b2c/gallery",
    title: "Vehicle gallery",
    body: "Cars we currently have specced and available, each with a full dossier and a landed-cost breakdown for your destination.",
    icon: BookOpen,
  },
  {
    href: "/request",
    title: "Request a specific car",
    body: "Tell us the model and specification you want. We compare the total landed cost across every market that can supply it, then buy where it lands cheapest.",
    icon: CheckCircle2,
  },
  {
    href: "https://www.revenue.ie/en/importing-vehicles-duty-free-allowances/guide-to-vrt/index.aspx",
    title: "Revenue's own VRT guide",
    body: "The primary source. Every figure on this page should be confirmed against Revenue before you commit money to a purchase.",
    icon: ExternalLink,
    external: true,
  },
];

// ── Structured data ─────────────────────────────────────────────────────────

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": URL,
  url: URL,
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "en-IE",
  dateModified: LAST_REVIEWED_ISO,
  about: {
    "@type": "Thing",
    name: "Importing a car to Ireland",
  },
  isPartOf: {
    "@type": "WebSite",
    name: "Providence Auto",
    url: `${SITE}/`,
  },
  publisher: {
    "@type": "Organization",
    name: "Providence Auto",
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["#cost-summary", "#faqs"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Car Import Service to Ireland",
  serviceType: "Vehicle sourcing, import and registration",
  description:
    "End-to-end car importing into Ireland from any source market — sourcing, inspection, shipping, customs clearance, VRT and Irish registration.",
  url: URL,
  areaServed: { "@type": "Country", name: "Ireland" },
  provider: {
    "@type": "Organization",
    name: "Providence Auto",
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Source markets for Irish imports",
    itemListElement: SOURCE_COUNTRIES.map((c) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: `Import a car to Ireland from ${c.country}`,
      },
    })),
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Importing a Car to Ireland",
      item: URL,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to import a car to Ireland",
  description:
    "The sequence for importing a car into Ireland, from pricing the landed cost through to Irish registration plates.",
  totalTime: "P10W",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "EUR",
    value: "17775",
  },
  step: PROCESS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.body,
    url: `${URL}#process`,
  })),
};

// ── Small presentational helpers ────────────────────────────────────────────

function SectionHeading({
  id,
  index,
  title,
  standfirst,
}: {
  id: string;
  index: string;
  title: string;
  standfirst?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-mono text-xs font-bold text-[#4da8da] tabular-nums">
          {index}
        </span>
        <h2
          id={id}
          className="scroll-mt-28 text-2xl md:text-3xl font-bold tracking-tight text-black"
        >
          {title}
        </h2>
      </div>
      {standfirst && (
        <p className="text-base md:text-lg text-zinc-600 font-light leading-relaxed max-w-3xl">
          {standfirst}
        </p>
      )}
    </div>
  );
}

/**
 * Closes a section with its conclusion and an exit ramp to the form.
 *
 * The page is long by design, and a reader who is convinced by section 3 should
 * not have to scroll through five more to act. Each takeaway also doubles as a
 * skim path: reading only these gives the short version of the page.
 *
 * The CTA label is written per section rather than shared — eight identical
 * "Enquire now" buttons read as a template and stop being seen after the first.
 */
function Takeaway({ point, cta }: { point: React.ReactNode; cta: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-black/[0.09] bg-white p-6 md:flex md:items-center md:justify-between md:gap-8">
      <div className="max-w-2xl">
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-2">
          The takeaway
        </p>
        <p className="text-sm md:text-[15px] text-zinc-700 leading-relaxed">
          {point}
        </p>
      </div>
      <a
        href="#inquiry"
        className="mt-5 md:mt-0 shrink-0 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-colors"
      >
        {cta}
        <ArrowRight size={15} />
      </a>
    </div>
  );
}

function Trap({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 rounded-2xl border border-amber-300/60 bg-amber-50/70 p-5">
      <p className="flex items-center gap-2 text-sm font-bold text-amber-900 mb-1.5">
        <AlertTriangle size={16} className="shrink-0" />
        {title}
      </p>
      <div className="text-sm text-amber-900/90 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default function ImportCarsToIrelandPage() {
  return (
    <>
      {[
        webPageSchema,
        serviceSchema,
        breadcrumbSchema,
        faqSchema,
        howToSchema,
      ].map((schema, i) => (
        <script
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed, order-stable list
          key={i}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as a script tag for crawlers
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="min-h-screen bg-white text-black font-sans selection:bg-black/10">
        <MinimalHeader />

        {/* ── MASTHEAD ─────────────────────────────────────────────────── */}
        <header className="border-b border-black/[0.07] pt-32 md:pt-36 pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-xs text-zinc-500">
                <li>
                  <Link href="/" className="hover:text-black transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-zinc-900 font-medium">
                  Importing a Car to Ireland
                </li>
              </ol>
            </nav>

            <p className="text-[11px] font-bold tracking-[0.25em] text-zinc-500 uppercase mb-4">
              Reference · Ireland · 2026 rates
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.12] mb-5 max-w-3xl">
              Importing a car to Ireland: what it costs, and what decides the
              cost
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 font-light leading-relaxed max-w-3xl">
              Any make, any source country. Irish import cost is built from four
              stackable charges, and the gap between a well-chosen import and a
              badly-chosen one is routinely €8,000 on the same budget. This page
              sets out how each charge is calculated, which decisions move it,
              and where the expensive traps are.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                Last reviewed {LAST_REVIEWED_LABEL}
              </span>
              <span>Reflects Revenue&apos;s 2026 VRT rates</span>
              <span>EU–Japan EPA at 0% since 1 February 2026</span>
            </div>

            {/* Headline numbers */}
            <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-black/[0.07] border border-black/[0.07] rounded-2xl overflow-hidden">
              {[
                { t: "Customs duty", v: "0% or 10%", s: "on CIF value" },
                { t: "VAT", v: "23%", s: "on landed value + duty" },
                { t: "VRT", v: "7% – 41%", s: "of Revenue's OMSP" },
                {
                  t: "NOx levy",
                  v: "€0 – €4,850",
                  s: "petrol and diesel only",
                },
              ].map((k) => (
                <div key={k.t} className="bg-white px-5 py-5">
                  <dt className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-500 mb-2">
                    {k.t}
                  </dt>
                  <dd>
                    <span className="block text-xl md:text-2xl font-bold tracking-tight tabular-nums">
                      {k.v}
                    </span>
                    <span className="block text-xs text-zinc-500 mt-1">
                      {k.s}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/ireland-cost-calculator"
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-colors"
              >
                <Calculator size={16} />
                Price a specific car
              </Link>
              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-6 py-3 text-sm font-bold text-black hover:bg-zinc-50 transition-colors"
              >
                Get a landed-cost quote
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </header>

        {/* ── QUALIFIER + TOC ──────────────────────────────────────────── */}
        <section className="px-6 py-12 border-b border-black/[0.07] bg-[#FAFAFA]">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_320px] gap-10">
            <div>
              <h2 className="text-sm font-bold tracking-[0.12em] uppercase text-zinc-500 mb-4">
                Who this is for
              </h2>
              <div className="space-y-4 text-zinc-700 leading-relaxed max-w-2xl">
                <p>
                  This page is written for someone who has decided to import and
                  is now pricing the decision — comparing source countries,
                  checking whether a specific car clears the duty threshold, or
                  working out how much of the budget the taxes will take.
                </p>
                <p>
                  It is long, and it is mostly tables. If you only want a number
                  for one particular car, the{" "}
                  <Link
                    href="/ireland-cost-calculator"
                    className="font-semibold text-[#4da8da] hover:underline"
                  >
                    landed cost calculator
                  </Link>{" "}
                  will get you there in about ninety seconds. If you want to
                  understand which cars are worth calculating in the first
                  place, start here.
                </p>
                <p>
                  Every section ends with a{" "}
                  <span className="font-semibold text-black">takeaway</span> —
                  read only those for the short version, and stop whenever
                  you&apos;ve seen enough to ask us for a quote.
                </p>
              </div>
            </div>

            <nav aria-label="On this page" className="md:pt-1">
              <h2 className="text-sm font-bold tracking-[0.12em] uppercase text-zinc-500 mb-4">
                On this page
              </h2>
              <ol className="space-y-1.5">
                {SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="group flex gap-3 text-sm text-zinc-600 hover:text-black transition-colors"
                    >
                      <span className="font-mono text-xs text-zinc-400 tabular-nums pt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="group-hover:underline">{s.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6">
          {/* ── 01 · COST SUMMARY ──────────────────────────────────────── */}
          <section className="py-16 border-b border-black/[0.07]">
            <SectionHeading
              id="cost-summary"
              index="01"
              title="What an import actually costs"
              standfirst="Three real cases, priced end to end. Same idea, three source markets — and the spread between the best and worst is €8,329 before anyone has negotiated a discount."
            />

            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[640px] text-sm border border-black/[0.07] rounded-2xl overflow-hidden">
                <caption className="sr-only">
                  Worked landed-cost comparison for importing a car to Ireland
                  from three source markets
                </caption>
                <thead>
                  <tr className="bg-zinc-50 border-b border-black/[0.07]">
                    <th
                      scope="col"
                      className="text-left px-5 py-4 font-bold w-[30%]"
                    >
                      Charge
                    </th>
                    {WORKED_EXAMPLE.columns.map((c) => (
                      <th
                        key={c}
                        scope="col"
                        className="text-right px-5 py-4 font-bold align-bottom"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WORKED_EXAMPLE.rows.map((r) => (
                    <tr
                      key={r.label}
                      className="border-b border-black/[0.05] last:border-0"
                    >
                      <th
                        scope="row"
                        className="text-left px-5 py-3.5 font-medium text-zinc-700"
                      >
                        {r.label}
                      </th>
                      {r.values.map((v, i) => (
                        <td
                          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-width column set
                          key={i}
                          className="text-right px-5 py-3.5 tabular-nums font-mono text-xs"
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-zinc-50 border-t-2 border-black/10">
                    <th scope="row" className="text-left px-5 py-4 font-bold">
                      {WORKED_EXAMPLE.total.label}
                    </th>
                    {WORKED_EXAMPLE.total.values.map((v, i) => (
                      <td
                        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-width column set
                        key={i}
                        className="text-right px-5 py-4 font-bold tabular-nums font-mono"
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-zinc-500 leading-relaxed max-w-3xl">
              Illustrative, to show how the charges stack. Actual VRT depends on
              Revenue&apos;s OMSP for the specific car and its exact emissions —
              treat these as directional, not as quotes.
            </p>

            <div className="mt-8 rounded-2xl border border-black/[0.07] bg-zinc-50/70 p-6">
              <p className="text-sm font-bold mb-2">
                Read the third column carefully
              </p>
              <p className="text-sm text-zinc-700 leading-relaxed">
                The EU-built premium car costs €4,000 more to buy than the
                Japanese hybrid, but €8,329 more to land. Two of the four
                charges turned against it at once: it pays 10% duty rather than
                0% because it was built in Germany rather than Britain, and its
                higher CO₂ pushes it several VRT bands up. Neither of those is
                visible in the advertised price.
              </p>
            </div>

            <Takeaway
              cta="Price my car"
              point={
                <>
                  The charges are the same for everyone. What changes is the car
                  you point them at — across these three examples the tax bill
                  alone runs from <strong>€5,275 to €10,654</strong>, and the
                  buyer decided that spread the moment they chose the car.
                </>
              }
            />
          </section>

          {/* ── 02 · THE FOUR CHARGES ──────────────────────────────────── */}
          <section className="py-16 border-b border-black/[0.07]">
            <SectionHeading
              id="charges"
              index="02"
              title="The four charges"
              standfirst="Customs duty, VAT, VRT and the NOx levy. They are assessed separately, they stack, and only two of them are meaningfully within your control."
            />

            {/* 2.1 Customs duty */}
            <div className="mt-12">
              <h3
                id="customs-duty"
                className="scroll-mt-28 text-xl font-bold tracking-tight mb-3"
              >
                2.1 · Customs duty — 0% or 10%
              </h3>
              <div className="space-y-4 text-zinc-700 leading-relaxed max-w-3xl">
                <p>
                  Duty applies to vehicles entering Ireland from outside the EU
                  customs union — which since Brexit includes Great Britain. It
                  is charged on the <strong>CIF value</strong>: the cost of the
                  car, plus insurance, plus freight.
                </p>
                <p>The rate is 10% by default. There are three routes to 0%:</p>
                <ul className="space-y-2.5 pl-1">
                  {[
                    "The car is in free circulation in the EU or Northern Ireland — no duty at all.",
                    "The car was built in Japan, under the EU–Japan Economic Partnership Agreement, which reached 0% on cars on 1 February 2026.",
                    "The car was built in the United Kingdom, under the EU–UK Trade and Cooperation Agreement.",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <CheckCircle2
                        size={17}
                        className="text-[#4da8da] shrink-0 mt-0.5"
                      />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Both preferential routes require a valid{" "}
                  <strong>statement of origin</strong> from the seller. Without
                  one, Revenue applies 10% regardless of where the car was
                  genuinely built.
                </p>
              </div>

              <Trap title="Country of registration is not country of origin">
                <p>
                  This is the most expensive misunderstanding in Irish
                  importing. A Nissan or Toyota built in the UK qualifies for
                  0%. A BMW, Audi, Mercedes or VW <em>sold</em> in Britain but{" "}
                  <em>built</em> in Germany pays the full 10% — EU-origin cars
                  in use in the UK do not qualify for the TCA rate. On a €20,000
                  landed value that is €2,000, plus the knock-on VAT, because
                  VAT is charged on the duty as well.
                </p>
              </Trap>
            </div>

            {/* 2.2 VAT */}
            <div className="mt-14">
              <h3
                id="vat"
                className="scroll-mt-28 text-xl font-bold tracking-tight mb-3"
              >
                2.2 · VAT — 23%
              </h3>
              <div className="space-y-4 text-zinc-700 leading-relaxed max-w-3xl">
                <p>
                  Irish VAT on vehicles is 23%, charged on the customs value{" "}
                  <em>plus</em> any customs duty already added. On a non-EU
                  import the 23% therefore effectively sits on top of the 10%.
                  Whether it applies at all depends on where the car comes from:
                </p>
              </div>

              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                {[
                  {
                    t: "From outside the EU",
                    s: "Japan, India, Australia, NZ",
                    b: "23% always applies at the point of import, regardless of the car's age or mileage.",
                    tone: "bad",
                  },
                  {
                    t: "From Great Britain",
                    s: "England, Scotland, Wales",
                    b: "23% always applies, new or used, because GB is outside the EU.",
                    tone: "bad",
                  },
                  {
                    t: "From the EU or NI",
                    s: "Germany, France, Northern Ireland",
                    b: "No VAT on a genuinely used car. 23% applies only if it counts as a 'new means of transport'.",
                    tone: "good",
                  },
                ].map((c) => (
                  <div
                    key={c.t}
                    className={`rounded-2xl border p-5 ${
                      c.tone === "good"
                        ? "border-emerald-300/60 bg-emerald-50/50"
                        : "border-black/[0.07] bg-zinc-50/70"
                    }`}
                  >
                    <p className="font-bold text-sm mb-0.5">{c.t}</p>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2.5">
                      {c.s}
                    </p>
                    <p className="text-sm text-zinc-700 leading-relaxed">
                      {c.b}
                    </p>
                  </div>
                ))}
              </div>

              <Trap title="The 'new means of transport' rule — an OR, not an AND">
                <p className="mb-2">
                  An EU or NI car is treated as <strong>new</strong> for VAT —
                  and attracts the full 23% — if <strong>either</strong>{" "}
                  threshold is met:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                  <li>it is under 6 months old, OR</li>
                  <li>it has under 6,000 km on the odometer.</li>
                </ul>
                <p>
                  Both conditions must be cleared for the car to count as used.
                  A nine-month-old car with 4,000 km is still &quot;new&quot;.
                  The clock and the odometer are read on the date the car
                  arrives in Ireland, not the invoice date.
                </p>
              </Trap>
            </div>

            {/* 2.3 VRT */}
            <div className="mt-14">
              <h3
                id="vrt"
                className="scroll-mt-28 text-xl font-bold tracking-tight mb-3"
              >
                2.3 · VRT — 7% to 41% of OMSP
              </h3>
              <div className="space-y-4 text-zinc-700 leading-relaxed max-w-3xl">
                <p>
                  Vehicle Registration Tax is the largest controllable cost. It
                  is charged on the <strong>OMSP</strong> — Revenue&apos;s own
                  estimate of what the car would sell for at Irish retail, not
                  the price you paid abroad — and the rate is set entirely by
                  CO₂ emissions.
                </p>
                <p className="font-mono text-sm bg-zinc-50 border border-black/[0.07] rounded-xl px-5 py-4">
                  VRT = OMSP × CO₂ rate (7% – 41%) &nbsp;+&nbsp; NOx levy
                </p>
                <p>
                  Because it is a percentage of Irish retail value, buying
                  cheaply abroad does not reduce your VRT. Choosing a lower-CO₂
                  car does — and it is the single biggest lever on the page.
                </p>
              </div>

              <div className="mt-8 overflow-x-auto -mx-6 px-6">
                <table className="w-full min-w-[620px] text-sm border border-black/[0.07] rounded-2xl overflow-hidden">
                  <caption className="sr-only">
                    2026 Irish VRT rates by WLTP CO₂ emissions band
                  </caption>
                  <thead>
                    <tr className="bg-zinc-50 border-b border-black/[0.07]">
                      <th scope="col" className="text-left px-5 py-4 font-bold">
                        CO₂ (g/km, WLTP)
                      </th>
                      <th scope="col" className="text-left px-5 py-4 font-bold">
                        VRT rate
                      </th>
                      <th
                        scope="col"
                        className="text-left px-5 py-4 font-bold hidden sm:table-cell"
                      >
                        Typical vehicle
                      </th>
                      <th
                        scope="col"
                        className="text-right px-5 py-4 font-bold"
                      >
                        On €20k OMSP
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {VRT_BANDS.map((b) => (
                      <tr
                        key={b.co2}
                        className={`border-b border-black/[0.05] last:border-0 ${
                          b.tone === "low"
                            ? "text-emerald-700"
                            : b.tone === "high"
                              ? "text-red-600"
                              : "text-zinc-700"
                        }`}
                      >
                        <th
                          scope="row"
                          className="text-left px-5 py-3 font-mono text-xs font-medium tabular-nums"
                        >
                          {b.co2}
                        </th>
                        <td className="px-5 py-3 font-bold">{b.rate}</td>
                        <td className="px-5 py-3 text-zinc-500 hidden sm:table-cell">
                          {b.typical}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-xs tabular-nums">
                          {b.onTwentyK}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-zinc-500 max-w-3xl">
                Condensed for readability — Revenue publishes 20 bands. The
                calculator applies all of them.
              </p>

              <Trap title="The NEDC-to-WLTP conversion trap">
                <p>
                  Cars first registered before roughly 2018–2020 often carry
                  only an older NEDC CO₂ figure. Revenue will not use it
                  directly — it applies a conversion formula that inflates the
                  number, which can push the car up a band or two. A car showing
                  95 g/km NEDC is assessed at roughly 114 g/km WLTP-equivalent,
                  moving it from the 11.25% band into the 15.25% band before you
                  have done anything wrong.
                </p>
              </Trap>
            </div>

            {/* 2.4 NOx */}
            <div className="mt-14">
              <h3
                id="nox"
                className="scroll-mt-28 text-xl font-bold tracking-tight mb-3"
              >
                2.4 · The NOx levy
              </h3>
              <div className="space-y-4 text-zinc-700 leading-relaxed max-w-3xl">
                <p>
                  Every petrol and diesel car, hybrids included, pays an
                  additional NOx levy on top of the CO₂ charge. It is a sliding
                  scale:
                </p>
              </div>

              <div className="mt-6 grid sm:grid-cols-3 gap-4 max-w-3xl">
                {[
                  { band: "First 40 mg/km", rate: "€5", per: "per mg" },
                  { band: "Next 40 mg/km (41–80)", rate: "€15", per: "per mg" },
                  { band: "Above 80 mg/km", rate: "€25", per: "per mg" },
                ].map((n) => (
                  <div
                    key={n.band}
                    className="rounded-2xl border border-black/[0.07] bg-zinc-50/70 p-5"
                  >
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
                      {n.band}
                    </p>
                    <p className="text-2xl font-bold tabular-nums">
                      {n.rate}{" "}
                      <span className="text-sm font-normal text-zinc-500">
                        {n.per}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 text-zinc-700 leading-relaxed max-w-3xl">
                <p>
                  The levy is capped at <strong>€600 for petrol</strong> and{" "}
                  <strong>€4,850 for diesel</strong>. Battery EVs produce no NOx
                  and pay nothing. In practice a hybrid around 10 mg/km pays
                  roughly €50, a typical petrol at 40 mg/km pays €200, and a
                  diesel at 80 mg/km pays €800.
                </p>
              </div>

              <Trap title="Undocumented diesels are assessed at the highest rate">
                <p>
                  Older diesels with no documented NOx figure are assessed at
                  the highest assumed rate rather than given the benefit of the
                  doubt. Combined with the €4,850 diesel cap against €600 for
                  petrol, this is a strong structural reason to favour petrol
                  and hybrid over diesel when importing.
                </p>
              </Trap>
            </div>

            <Takeaway
              cta="Have us check a car"
              point={
                <>
                  Two of the four are fixed by rules you cannot argue with — VAT
                  is 23% or it is not, duty is 0% or 10%. The other two,{" "}
                  <strong>VRT and the NOx levy, are chosen by the car</strong>,
                  and that is where an import is won or lost. Send us a
                  registration or a listing and we will tell you which side of
                  each line it falls on.
                </>
              }
            />
          </section>

          {/* ── 03 · ORDER ─────────────────────────────────────────────── */}
          <section className="py-16 border-b border-black/[0.07]">
            <SectionHeading
              id="order"
              index="03"
              title="How the charges stack"
              standfirst="Order matters, because each charge is calculated on the running total of the one before it. This is why a 10% duty costs far more than 10%."
            />

            <ol className="space-y-3 max-w-3xl">
              {[
                {
                  n: "1",
                  t: "CIF value",
                  b: "Cost of the car + insurance + freight. This is the base everything else is built on.",
                },
                {
                  n: "2",
                  t: "+ Customs duty",
                  b: "0% or 10% of the CIF value, depending on where the car was built and whether you hold a statement of origin.",
                },
                {
                  n: "3",
                  t: "+ VAT at 23%",
                  b: "Charged on CIF plus the duty — so duty is itself taxed. €1,545 of duty drags roughly €355 of extra VAT with it.",
                },
                {
                  n: "4",
                  t: "+ VRT and NOx",
                  b: "Assessed separately at the NCTS inspection, on Revenue's OMSP rather than on anything you have paid so far.",
                },
              ].map((s) => (
                <li
                  key={s.n}
                  className="flex gap-4 rounded-2xl border border-black/[0.07] bg-zinc-50/50 p-5"
                >
                  <span className="shrink-0 w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-bold text-sm mb-1">{s.t}</p>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {s.b}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Takeaway
              cta="Check my car's origin"
              point={
                <>
                  Because each charge compounds on the last, that €1,545 duty
                  bill really costs about <strong>€1,900</strong> once the VAT
                  charged on top of it is counted. Proving origin before you buy
                  is worth more than anything you will win haggling over the
                  purchase price.
                </>
              }
            />
          </section>

          {/* ── 04 · WHERE TO BUY ──────────────────────────────────────── */}
          <section className="py-16 border-b border-black/[0.07]">
            <SectionHeading
              id="where-to-buy"
              index="04"
              title="Where to buy from"
              standfirst="Four factors decide a source market: customs treatment, shipping cost and time, steering side, and whether the stock you want actually exists there."
            />

            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[860px] text-sm border border-black/[0.07] rounded-2xl overflow-hidden">
                <caption className="sr-only">
                  Comparison of source countries for importing a car to Ireland
                </caption>
                <thead>
                  <tr className="bg-zinc-50 border-b border-black/[0.07]">
                    <th scope="col" className="text-left px-5 py-4 font-bold">
                      Country
                    </th>
                    <th scope="col" className="text-left px-5 py-4 font-bold">
                      Customs duty
                    </th>
                    <th scope="col" className="text-left px-5 py-4 font-bold">
                      VAT
                    </th>
                    <th scope="col" className="text-left px-5 py-4 font-bold">
                      Transport
                    </th>
                    <th scope="col" className="text-left px-5 py-4 font-bold">
                      Transit
                    </th>
                    <th scope="col" className="text-left px-5 py-4 font-bold">
                      Steering
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SOURCE_COUNTRIES.map((c) => (
                    <tr
                      key={c.country}
                      className="border-b border-black/[0.05] last:border-0 align-top"
                    >
                      <th
                        scope="row"
                        className="text-left px-5 py-4 font-bold whitespace-nowrap"
                      >
                        {c.country}
                        {c.strong && (
                          <span className="ml-2 inline-block rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 align-middle">
                            Viable
                          </span>
                        )}
                      </th>
                      <td
                        className={`px-5 py-4 font-medium ${
                          c.dutyTone === "good"
                            ? "text-emerald-700"
                            : c.dutyTone === "bad"
                              ? "text-red-600"
                              : "text-zinc-700"
                        }`}
                      >
                        {c.duty}
                      </td>
                      <td className="px-5 py-4 text-zinc-600">{c.vat}</td>
                      <td className="px-5 py-4 font-mono text-xs tabular-nums text-zinc-600 whitespace-nowrap">
                        {c.transport}
                      </td>
                      <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">
                        {c.transit}
                      </td>
                      <td className="px-5 py-4 text-zinc-600 whitespace-nowrap">
                        {c.steering}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              {SOURCE_COUNTRIES.map((c) => (
                <div
                  key={c.country}
                  className="rounded-2xl border border-black/[0.07] p-5"
                >
                  <p className="font-bold text-sm mb-1.5">{c.country}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {c.verdict}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-zinc-600 leading-relaxed max-w-3xl">
              In short: <strong>Japan</strong> for mainstream value,{" "}
              <strong>the UK</strong> for speed on UK-built models, and{" "}
              <strong>Northern Ireland</strong> where a genuinely NI-resident
              car exists. India, Australia and New Zealand are niche — use them
              only when a specific model is unavailable elsewhere.{" "}
              <Link
                href="/source-cars-from/japan"
                className="font-semibold text-[#4da8da] hover:underline"
              >
                See our source-country network
              </Link>
              .
            </p>

            <Takeaway
              cta="Compare markets for me"
              point={
                <>
                  The right market depends on the car, not the other way round.
                  We buy directly in eight countries and compare the{" "}
                  <strong>total landed cost across every one</strong> that can
                  supply your specification — then buy where it lands cheapest,
                  which is not always where you expected.
                </>
              }
            />
          </section>

          {/* ── 05 · SWEET SPOT ────────────────────────────────────────── */}
          <section className="py-16 border-b border-black/[0.07]">
            <SectionHeading
              id="sweet-spot"
              index="05"
              title="Age, mileage and condition"
              standfirst="The tax rules push hard toward one particular band of car, and it is not the newest one you can afford."
            />

            <div className="rounded-2xl border-2 border-black/10 bg-zinc-50/70 p-6 md:p-8 mb-8">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">
                The sweet spot
              </p>
              <p className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                Three to eight years old, average mileage
              </p>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {[
                  "Comfortably clear of the 6-month / 6,000 km VAT trap.",
                  "The first owner has absorbed the steepest depreciation, so OMSP — and therefore VRT — is moderate.",
                  "Recent enough to carry a genuine WLTP CO₂ figure, avoiding the NEDC conversion penalty.",
                  "Old enough that condition is provable from service history and auction grading.",
                ].map((t) => (
                  <div key={t} className="flex gap-3">
                    <CheckCircle2
                      size={17}
                      className="text-[#4da8da] shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-zinc-700 leading-relaxed">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  t: "Brand new — generally the worst value",
                  b: "Highest possible OMSP and therefore the highest VRT in absolute euro. From the EU or NI a new car also triggers the 23% 'new means of transport' VAT with no escape, and you personally absorb the 20–35% of value a car can lose in its first year. The one exception is a battery EV registered before the relief deadline.",
                },
                {
                  t: "Very low mileage — a false economy",
                  b: "Revenue explicitly adjusts OMSP upward for below-average mileage, so an ultra-low-mileage import is assigned a higher OMSP and pays more VRT than an equivalent car with average mileage. The genuine value play is average or slightly-above-average mileage with documented good mechanical condition.",
                },
                {
                  t: "Over 30 years old — a special case",
                  b: "A vehicle more than 30 years old at registration falls into VRT Category C and pays a flat €200, regardless of value or emissions. Duty and 23% VAT still apply, but the VRT collapse is why classic importing from Japan and the UK remains popular.",
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="rounded-2xl border border-black/[0.07] p-5"
                >
                  <p className="font-bold text-sm mb-2">{c.t}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">{c.b}</p>
                </div>
              ))}
            </div>

            <Trap title="Any imported car four years or older needs an Irish NCT">
              <p>
                A valid foreign roadworthiness test does not carry over. Budget
                for the NCT on arrival — a well-kept car in the three-to-eight
                year band passes without drama, but it is a cost and a delay
                that people routinely forget to plan for.
              </p>
            </Trap>

            <Takeaway
              cta="Find me one in that band"
              point={
                <>
                  <strong>Three to eight years old, average mileage</strong>{" "}
                  beats both the newer car and the lower-mileage one — OMSP, the
                  VAT trap and the NEDC conversion all turn against you outside
                  that band. Tell us the model and we will source inside it.
                </>
              }
            />
          </section>

          {/* ── 06 · WHAT TO BUY ───────────────────────────────────────── */}
          <section className="py-16 border-b border-black/[0.07]">
            <SectionHeading
              id="what-to-buy"
              index="06"
              title="What to buy, what to avoid"
              standfirst="The ideal import qualifies for 0% duty, sits low in the CO₂ table, produces little NOx, is right-hand drive, and has a real price gap between the source market and Irish retail. Very few cars tick all five."
            />

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold tracking-[0.12em] uppercase text-emerald-700 mb-5">
                  <CheckCircle2 size={16} />
                  Worth calculating
                </h3>
                <div className="space-y-4">
                  {BUY.map((c) => (
                    <div
                      key={c.title}
                      className="rounded-2xl border border-emerald-300/50 bg-emerald-50/40 p-5"
                    >
                      <p className="font-bold text-sm mb-1.5">{c.title}</p>
                      <p className="text-sm text-zinc-700 leading-relaxed">
                        {c.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold tracking-[0.12em] uppercase text-red-600 mb-5">
                  <AlertTriangle size={16} />
                  Rarely worth it on cost
                </h3>
                <div className="space-y-4">
                  {AVOID.map((c) => (
                    <div
                      key={c.title}
                      className="rounded-2xl border border-red-200 bg-red-50/40 p-5"
                    >
                      <p className="font-bold text-sm mb-1.5">{c.title}</p>
                      <p className="text-sm text-zinc-700 leading-relaxed">
                        {c.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-8 text-sm text-zinc-600 leading-relaxed max-w-3xl">
              These are starting points, not verdicts. Whether a specific car
              works depends on its exact CO₂ figure, its OMSP and what you can
              buy it for —{" "}
              <Link
                href="/ireland-cost-calculator"
                className="font-semibold text-[#4da8da] hover:underline"
              >
                run the numbers
              </Link>{" "}
              before you commit.
            </p>

            <Takeaway
              cta="Shortlist cars for me"
              point={
                <>
                  A shortlist is not a decision. Two cars from the same
                  &quot;worth calculating&quot; list can land{" "}
                  <strong>thousands apart</strong> once their actual CO₂ figures
                  and OMSPs are applied. Give us your budget and use case and we
                  will come back with specific cars, priced landed.
                </>
              }
            />
          </section>

          {/* ── 07 · RELIEFS ───────────────────────────────────────────── */}
          <section className="py-16 border-b border-black/[0.07]">
            <SectionHeading
              id="reliefs"
              index="07"
              title="Reliefs you can legally claim"
              standfirst="These are legitimate mechanisms in Irish and EU rules, not evasion. Each has strict conditions, and Revenue audits them."
            />

            <div className="grid md:grid-cols-2 gap-5">
              {RELIEFS.map((r) => (
                <div
                  key={r.title}
                  className="rounded-2xl border border-black/[0.07] p-6"
                >
                  <p className="font-bold mb-2">{r.title}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                    {r.body}
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed border-t border-black/[0.06] pt-3">
                    <span className="font-semibold text-zinc-700">
                      The condition:{" "}
                    </span>
                    {r.caveat}
                  </p>
                </div>
              ))}
            </div>

            <Takeaway
              cta="Ask which reliefs apply"
              point={
                <>
                  Every one of these is claimable, and every one is auditable —
                  the conditions matter more than the headline. The EV relief is
                  the urgent one:{" "}
                  <strong>
                    registration, not purchase, has to happen before 31 December
                    2026
                  </strong>
                  , and shipping time has to fit inside that.
                </>
              }
            />
          </section>

          {/* ── 08 · PROCESS ───────────────────────────────────────────── */}
          <section className="py-16 border-b border-black/[0.07]">
            <SectionHeading
              id="process"
              index="08"
              title="The process and its deadlines"
              standfirst="Two deadlines carry penalties, and both start from the day the car arrives in the State — not from the day you bought it."
            />

            <ol className="space-y-4">
              {PROCESS.map((s, i) => (
                <li key={s.title} className="flex gap-5">
                  <span className="shrink-0 font-mono text-xs font-bold text-[#4da8da] tabular-nums pt-1 w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pb-4 border-b border-black/[0.05] w-full">
                    <p className="font-bold text-sm mb-1.5">{s.title}</p>
                    <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-2xl border border-black/[0.07] bg-zinc-50/70 p-6">
              <p className="text-sm font-bold mb-2">Keep every document</p>
              <p className="text-sm text-zinc-700 leading-relaxed">
                Statement of origin, purchase invoice, shipping and CIF
                paperwork, the Certificate of Conformity carrying the WLTP CO₂
                and NOx figures, and the customs declaration. Missing paperwork
                is what turns 0% duty into 10% and a low VRT band into a high
                one — the car has not changed, only what you can prove about it.
              </p>
            </div>

            <Takeaway
              cta="Hand this to us"
              point={
                <>
                  Both deadlines start the day the car lands, not the day you
                  buy it. We handle the customs declaration, the NCTS booking,
                  VRT and Irish registration end to end, so{" "}
                  <strong>the 30-day clock is our problem, not yours</strong>.
                </>
              }
            />
          </section>

          {/* ── 09 · TOOLS ─────────────────────────────────────────────── */}
          <section className="py-16 border-b border-black/[0.07]">
            <SectionHeading
              id="tools"
              index="09"
              title="Tools"
              standfirst="Everything we run that is useful at this stage of the decision."
            />

            <div className="grid sm:grid-cols-2 gap-4">
              {TOOLS.map((t) => {
                const Icon = t.icon;
                const inner = (
                  <>
                    <div className="flex items-start gap-3 mb-2">
                      <Icon
                        size={18}
                        className="text-[#4da8da] shrink-0 mt-0.5"
                      />
                      <p className="font-bold text-sm group-hover:text-[#4da8da] transition-colors">
                        {t.title}
                      </p>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {t.body}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 group-hover:text-[#4da8da] transition-colors">
                      {t.external ? "Open revenue.ie" : "Open"}
                      <ArrowRight size={13} />
                    </span>
                  </>
                );
                const cls =
                  "group block rounded-2xl border border-black/[0.07] p-6 hover:border-[#4da8da]/40 hover:bg-zinc-50/60 transition-colors";
                return t.external ? (
                  <a
                    key={t.href}
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link key={t.href} href={t.href} className={cls}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 10 · GUIDES ────────────────────────────────────────────── */}
          <section className="py-16 border-b border-black/[0.07]">
            <SectionHeading
              id="guides"
              index="10"
              title="Guides"
              standfirst="Longer reads on the parts of this page that deserve more than a paragraph."
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GUIDES.map((g) => (
                <Link
                  key={g.slug}
                  href={`${BLOG_BASE_PATH}/${g.slug}`}
                  className="group flex flex-col rounded-2xl border border-black/[0.07] p-5 hover:border-[#4da8da]/40 hover:bg-zinc-50/60 transition-colors"
                >
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400 mb-2.5">
                    {g.cluster}
                  </p>
                  <p className="font-bold text-sm leading-snug mb-2 group-hover:text-[#4da8da] transition-colors">
                    {g.title}
                  </p>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-4 grow">
                    {g.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                    <Clock size={12} />
                    {g.readingTimeMins} min read
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href={BLOG_BASE_PATH}
              className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#4da8da] hover:text-[#3d92c2] transition-colors"
            >
              Browse all import guides
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </section>

          {/* ── 11 · FAQS ──────────────────────────────────────────────── */}
          <section className="py-16 border-b border-black/[0.07]">
            <SectionHeading
              id="faqs"
              index="11"
              title="Questions buyers actually ask"
            />

            <div className="divide-y divide-black/[0.07] border-y border-black/[0.07]">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                    <span className="font-bold text-[15px] leading-snug">
                      {f.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 mt-1 text-zinc-400 text-lg leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed max-w-3xl">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>

            <p className="mt-8 text-xs text-zinc-500 leading-relaxed max-w-3xl">
              Every tax figure on this page reflects Revenue&apos;s 2026 rates
              and current EU trade agreements as reviewed on{" "}
              {LAST_REVIEWED_LABEL}. Rates, bands and trade terms change.
              Confirm the position for your specific vehicle with{" "}
              <a
                href="https://www.revenue.ie/en/importing-vehicles-duty-free-allowances/index.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#4da8da] hover:underline"
              >
                Revenue
              </a>{" "}
              before committing money. This page is general information, not tax
              advice.
            </p>
          </section>
        </div>

        {/* ── INQUIRY ──────────────────────────────────────────────────── */}
        <section id="inquiry" className="scroll-mt-24 px-6 py-20 bg-[#FAFAFA]">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-3xl mb-10">
              <p className="text-[11px] font-bold tracking-[0.25em] text-zinc-500 uppercase mb-4">
                Next step
              </p>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
                Tell us the car. We&apos;ll price it landed in Ireland.
              </h2>
              <p className="text-base md:text-lg text-zinc-600 font-light leading-relaxed">
                Give us the make, model and rough specification you are after
                and we will come back with the full landed cost — purchase
                price, shipping, duty, VAT, VRT and NOx — sourced from whichever
                of our eight markets lands it cheapest. No cost, and no
                obligation to proceed.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="w-full max-w-3xl mx-auto h-[550px] flex items-center justify-center bg-white rounded-[2.5rem] border border-black/5 text-zinc-500">
                  Loading form…
                </div>
              }
            >
              <RequestForm
                prefill={{ countryOfImport: "Ireland" }}
                defaultPhoneCountry="IE"
              />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
}
