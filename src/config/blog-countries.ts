// ─────────────────────────────────────────────────────────────────────────────
// Source-country blog clusters — five posts per country where Providence Auto
// operates a physical office, answering the questions dealers and direct buyers
// actually ask before committing to an import.
//
// Metadata only. Post BODIES live in src/content/blog/<slug>.tsx and are mapped
// by slug in src/content/blog/index.ts. These entries are concatenated into
// BLOG_POSTS in src/config/blog.ts, which drives the blog index, per-post
// metadata, JSON-LD, related-post linking and the sitemap.
//
// Tax, duty and rule-of-thumb figures in these posts are deliberately framed as
// indicative and cross-referenced to the official authority in each market.
// Import regimes change frequently — every post carries a disclaimer, and the
// landed-cost quote we give a customer is always modelled per shipment rather
// than from a published rate card.
// ─────────────────────────────────────────────────────────────────────────────

import type { BlogPost } from "./blog";

const AUTHOR = "Providence Auto";
const PUBLISHED = "2026-08-10";
const UPDATED = "2026-08-10";

const LOCAL = (name: string) => `/import-cars/${name}.jpg`;
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=2400&auto=format&fit=crop`;

/** Fills in the fields that are identical on every country post. */
function post(
  p: Omit<BlogPost, "author" | "publishDate" | "updatedDate">,
): BlogPost {
  return {
    ...p,
    author: AUTHOR,
    publishDate: PUBLISHED,
    updatedDate: UPDATED,
  };
}

// ── JAPAN ────────────────────────────────────────────────────────────────────

const japanPosts: BlogPost[] = [
  post({
    slug: "how-to-buy-a-car-at-japanese-auction",
    title: "How to Buy a Car at a Japanese Auction",
    h1: "How to Buy a Car at a Japanese Auction Without Being in the Room",
    seoTitle:
      "How to Buy a Car at a Japanese Auction (Step by Step, From Abroad)",
    description:
      "How the Japanese used-car auction system actually works, who is allowed to bid, what a proxy bid costs you, and the seven steps between choosing a car and having it loaded on a vessel.",
    excerpt:
      "You cannot bid at a Japanese auction yourself. Here is exactly how the system works, and what a good agent does on the floor that a broker cannot.",
    cluster: "Japan",
    primaryKeyword: "how to buy a car at japanese auction",
    keywords: [
      "how to buy a car at japanese auction",
      "japanese car auction for foreigners",
      "japan auction proxy bidding",
      "buy car from japan auction",
      "japanese car auction agent",
    ],
    readingTimeMins: 11,
    heroImage: UNSPLASH("1612704065655-fa070fe6c254"),
    heroAlt:
      "Cars on a Tokyo street, where the auction network feeds the market",
    related: [
      "japanese-auction-grades-explained",
      "cost-to-import-a-car-from-japan",
      "best-cars-to-import-from-japan",
      "japan-car-export-documents-explained",
    ],
    toc: [
      { id: "who-can-bid", label: "Who is actually allowed to bid" },
      { id: "the-network", label: "How the auction network works" },
      { id: "steps", label: "The seven steps, start to finish" },
      { id: "bidding", label: "How bidding and limits work" },
      { id: "costs", label: "What sits on top of the hammer price" },
      { id: "mistakes", label: "The four mistakes that cost real money" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Can a foreigner bid at a Japanese car auction?",
        a: "Not directly. Japan's major used-vehicle auctions are trade-only: bidding requires membership, which requires a registered Japanese business, a deposit and a trading record. Overseas buyers bid through a licensed member acting on their behalf, which is why every legitimate Japan import involves an agent or exporter somewhere in the chain.",
      },
      {
        q: "How long does it take to win a car at Japanese auction?",
        a: "Usually one to three weeks. Auctions run on a weekly cycle across the major houses, so if your specification is common you will often see suitable cars in the first week's catalogues. Narrow requirements — a specific grade, colour and mileage band together — can take several cycles, and holding out is almost always cheaper than compromising.",
      },
      {
        q: "What happens if I lose the bid?",
        a: "Nothing, other than moving to the next car. A lost auction costs you no fee with us: you are quoted a landed cost for a specific vehicle at a specific maximum bid, and if the car goes above it we do not buy. The deposit position is stated in writing before bidding starts so there is no ambiguity about what happens either way.",
      },
    ],
  }),
  post({
    slug: "japanese-auction-grades-explained",
    title: "Japanese Auction Grades Explained",
    h1: "Japanese Auction Grades Explained: How to Read the Sheet Yourself",
    seoTitle:
      "Japanese Auction Grades Explained: Reading an Auction Sheet (R, RA, 3.5, 4, 5)",
    description:
      "What each Japanese auction grade means, how the interior grade and panel map work, what Grade R and RA really tell you, and the notes on an auction sheet that should stop a purchase dead.",
    excerpt:
      "The auction sheet is the single most valuable document in a Japanese import. Learn to read one and you stop depending on anybody's description.",
    cluster: "Japan",
    primaryKeyword: "japanese auction grades explained",
    keywords: [
      "japanese auction grades explained",
      "japanese auction sheet",
      "grade r japanese car",
      "auction grade 4 meaning",
      "japan car auction inspection",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1450101499163-c8848c66ca85"),
    heroAlt:
      "Vehicle inspection paperwork of the kind used at Japanese auctions",
    related: [
      "how-to-buy-a-car-at-japanese-auction",
      "best-cars-to-import-from-japan",
      "japan-car-export-documents-explained",
      "cost-to-import-a-car-from-japan",
    ],
    toc: [
      { id: "what-it-is", label: "What an auction sheet is" },
      { id: "overall-grades", label: "The overall grade scale" },
      { id: "grade-r", label: "Grade R and RA: repaired, not written off" },
      { id: "interior", label: "The interior grade" },
      { id: "map", label: "The panel map and its shorthand" },
      { id: "red-flags", label: "Notes that should stop a purchase" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is a good auction grade for a Japanese car?",
        a: "Grade 4 and above is genuinely excellent for a used car, and Grade 3.5 is very good with minor cosmetic marks that most buyers accept happily. Grade 5 is close to new and priced accordingly. Below 3.5 the car needs cosmetic or mechanical work, which can still make sense for a trade buyer with a workshop but rarely does for a private one.",
      },
      {
        q: "Should I avoid a Grade R car?",
        a: "Not automatically, but you need to know what was repaired. Grade R means the car has had accident repair recorded — which in Japan can mean anything from a replaced bumper skin to structural work. The panel map and inspector's notes tell you which. We buy Grade R only where the repair is documented, cosmetic and verified on physical inspection, and we always disclose it.",
      },
      {
        q: "Can an auction sheet be faked?",
        a: "The original sheets are issued by the auction house, not the seller, which is what makes them trustworthy — but reproductions circulate. The protection is provenance: insist on the original sheet as issued, with the auction house, lot number and date visible, and cross-check the mileage against the export certificate. An exporter who will not show you the original as issued is telling you something.",
      },
    ],
  }),
  post({
    slug: "best-cars-to-import-from-japan",
    title: "The Best Cars to Import From Japan",
    h1: "The Best Cars to Import From Japan in 2026 (By What You Need)",
    seoTitle: "The Best Cars to Import From Japan in 2026, By Category",
    description:
      "The Japanese models that consistently make sense to import — the cheapest hybrids, the family MPVs Europe never got, the 4x4s worth crossing an ocean for, and the JDM performance cars — plus the ones to leave alone.",
    excerpt:
      "Japan exports everything. These are the models where the price, condition and parts availability all line up — and the ones that flatter to deceive.",
    cluster: "Japan",
    primaryKeyword: "best cars to import from japan",
    keywords: [
      "best cars to import from japan",
      "best japanese imports",
      "cheapest japanese car to import",
      "jdm cars worth importing",
      "japanese hybrid import",
    ],
    readingTimeMins: 12,
    heroImage: UNSPLASH("1689594016155-3f912af12e59"),
    heroAlt: "Toyota AE86 Trueno at a Japanese car meet",
    related: [
      "cost-to-import-a-car-from-japan",
      "how-to-buy-a-car-at-japanese-auction",
      "japanese-auction-grades-explained",
      "japan-car-export-documents-explained",
    ],
    toc: [
      { id: "what-makes-a-good-import", label: "What makes a good import" },
      { id: "hybrids", label: "Cheapest to land: the hybrids" },
      { id: "family", label: "Family: the MPVs Europe never got" },
      { id: "suvs", label: "The 4x4s worth crossing an ocean for" },
      { id: "performance", label: "Performance and modern classics" },
      { id: "commercial", label: "Vans and commercials" },
      { id: "avoid", label: "The ones that flatter to deceive" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is the cheapest car to import from Japan?",
        a: "Small hybrids, by a wide margin — the Toyota Aqua, Honda Fit hybrid and Nissan Note e-Power. They are ordinary cars in Japan so auction prices are low, they are compact enough to keep freight costs down, and their low emissions put them in the cheapest tax band in most import regimes. The Suzuki Swift and Toyota Vitz are the cheapest petrol equivalents.",
      },
      {
        q: "Which Japanese cars hold their value best after import?",
        a: "Land Cruisers, in every generation and almost every market, followed by the Alphard and Vellfire MPVs where local alternatives do not exist, and genuine JDM performance cars with documented provenance. What these share is scarcity in the destination market — a car nobody else can easily supply is a car that holds its price.",
      },
      {
        q: "Are Japanese imports reliable?",
        a: "As a population, they are unusually good, and the reason is structural rather than mythical: the shaken inspection regime forces regular maintenance, and expensive-to-keep older cars get sold rather than neglected. That said, reliability is a property of the individual car, not the country. The auction grade, the service record and an independent inspection are what tell you about yours.",
      },
    ],
  }),
  post({
    slug: "cost-to-import-a-car-from-japan",
    title: "What It Really Costs to Import a Car From Japan",
    h1: "What It Really Costs to Import a Car From Japan (Every Line)",
    seoTitle: "The Real Cost of Importing a Car From Japan: Full Breakdown",
    description:
      "Every cost between a Japanese auction hall and your driveway — hammer price, auction fees, inland transport, freight, marine insurance, duty, VAT and local registration — and where buyers get caught out.",
    excerpt:
      "The hammer price is roughly half the story. Here is every other line on the bill, in the order it hits you.",
    cluster: "Japan",
    primaryKeyword: "cost to import a car from japan",
    keywords: [
      "cost to import a car from japan",
      "how much to import a car from japan",
      "japan import landed cost",
      "japanese car import fees",
      "japan car shipping cost",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1554224155-6726b3ff858f"),
    heroAlt: "Working out the landed cost of importing a car from Japan",
    related: [
      "best-cars-to-import-from-japan",
      "how-to-buy-a-car-at-japanese-auction",
      "japan-car-export-documents-explained",
      "japanese-auction-grades-explained",
    ],
    toc: [
      { id: "structure", label: "How the total is built" },
      { id: "in-japan", label: "Costs inside Japan" },
      { id: "freight", label: "Freight and insurance" },
      { id: "destination", label: "Costs at your end" },
      { id: "example", label: "A worked example" },
      { id: "traps", label: "Where buyers get caught" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How much does it cost to import a car from Japan?",
        a: "The total is the hammer price plus auction and agent fees, inland transport in Japan, ocean freight, marine insurance, then your own country's duty, consumption tax and registration charges. The destination side varies enormously — the same car can land for very different totals in two countries — which is why the only number worth acting on is an all-in landed quote for your specific vehicle and destination.",
      },
      {
        q: "Is shipping cheaper by RoRo or container?",
        a: "RoRo is usually cheaper for a single ordinary car and is the default for most imports. Containers cost more per vehicle but make sense for high-value cars that should not be handled by port drivers, for non-running vehicles, and for multiple cars shipped together, where a shared container can undercut RoRo per unit.",
      },
      {
        q: "What unexpected costs catch importers out?",
        a: "Four, repeatedly: port storage and demurrage when clearance paperwork is slow; destination-mandated pre-shipment inspection fees that had to be paid in Japan; local compliance or certification work that only surfaces on arrival; and currency movement between quoting and payment. All four are avoidable by pricing them in up front, which is exactly what an all-in landed quote is for.",
      },
    ],
  }),
  post({
    slug: "japan-car-export-documents-explained",
    title: "Every Document You Get With a Japanese Import",
    h1: "Every Document You Get When You Import a Car From Japan",
    seoTitle:
      "Japanese Car Export Documents Explained (Export Certificate, BL, Auction Sheet)",
    description:
      "The export certificate, deregistration certificate, auction sheet, Bill of Lading and pre-shipment inspection certificates — what each document proves, and which ones you cannot register the car without.",
    excerpt:
      "A Japanese import is a paperwork exercise with a car attached. Here is what every document in the file actually proves.",
    cluster: "Japan",
    primaryKeyword: "japan car export documents",
    keywords: [
      "japan car export documents",
      "japanese export certificate",
      "deregistration certificate japan",
      "bill of lading car import",
      "jevic inspection certificate",
    ],
    readingTimeMins: 9,
    heroImage: UNSPLASH("1502877338535-766e1452684a"),
    heroAlt: "Handover of keys and documents for an imported Japanese car",
    related: [
      "how-to-buy-a-car-at-japanese-auction",
      "japanese-auction-grades-explained",
      "cost-to-import-a-car-from-japan",
      "best-cars-to-import-from-japan",
    ],
    toc: [
      { id: "why-it-matters", label: "Why the file matters more than the car" },
      { id: "export-certificate", label: "The export certificate" },
      { id: "auction-sheet", label: "The auction sheet and translation" },
      { id: "bill-of-lading", label: "The Bill of Lading" },
      { id: "inspections", label: "Pre-shipment inspection certificates" },
      { id: "checklist", label: "The document checklist" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is a Japanese export certificate?",
        a: "It is the document Japan issues when a vehicle is deregistered for export, and it is the single most important paper in the file. It carries the chassis number, engine model, date of first registration, dimensions and — critically — the certified odometer reading at deregistration. Most countries will not register an imported Japanese car without it, along with a certified translation.",
      },
      {
        q: "Do I need a pre-shipment inspection certificate?",
        a: "That depends entirely on your destination. A number of countries require an accredited pre-shipment inspection carried out in Japan before the vehicle sails, covering roadworthiness, mileage verification and sometimes radiation screening. If your country requires one and it was not done in Japan, it cannot be fixed retrospectively at your port — which is why we confirm the requirement before bidding.",
      },
      {
        q: "What happens if a document is lost in transit?",
        a: "Replacements are possible but slow and, in the meantime, the car sits at the port accruing storage. Originals should travel by tracked courier separately from the vehicle, with scanned copies issued to you at the point of shipment. We send the full scanned set when the vessel departs so nothing depends on a single envelope arriving.",
      },
    ],
  }),
];

// ── UNITED KINGDOM ───────────────────────────────────────────────────────────

const ukPosts: BlogPost[] = [
  post({
    slug: "how-to-import-a-car-from-the-uk",
    title: "How to Import a Car From the UK",
    h1: "How to Import a Car From the UK: The Complete Process",
    seoTitle: "How to Import a Car From the UK (Step-by-Step Process, 2026)",
    description:
      "How to buy and export a car from the United Kingdom — where the stock is, how to verify a car's history, what permanent export notification involves, and how the origin rules decide your duty bill.",
    excerpt:
      "Britain has the most checkable used cars in the world and one of the easiest export routes. Here is the process in order.",
    cluster: "United Kingdom",
    primaryKeyword: "how to import a car from the uk",
    keywords: [
      "how to import a car from the uk",
      "export a car from the uk",
      "buy a car in the uk from abroad",
      "uk car export process",
      "permanent export uk car",
    ],
    readingTimeMins: 11,
    heroImage: UNSPLASH("1494976388531-d1058494cdd8"),
    heroAlt: "British-built car of the kind exported from the UK",
    related: [
      "uk-car-history-checks-explained",
      "cost-to-import-a-car-from-the-uk",
      "best-cars-to-import-from-the-uk",
      "uk-car-export-documents-explained",
    ],
    toc: [
      { id: "why-uk", label: "Why buy in the UK at all" },
      { id: "where-stock-is", label: "Where the stock actually is" },
      { id: "verify", label: "Verifying the car before you commit" },
      { id: "origin", label: "The origin rule that decides your duty" },
      { id: "export", label: "Exporting it: notification and paperwork" },
      { id: "shipping", label: "Shipping and clearance" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Can I buy a car in the UK if I do not live there?",
        a: "Yes. There is no residency requirement to buy a vehicle in the UK, and buying for immediate export is routine. What you cannot easily do from abroad is verify the car, handle the export notification and arrange freight — which is the practical reason overseas buyers work through a UK-based buyer rather than dealing with vendors directly.",
      },
      {
        q: "Do I pay UK VAT if I am exporting the car?",
        a: "It depends on the seller and the transaction. Some export sales can be zero-rated where the correct evidence of export is held, while a private sale carries no recoverable VAT at all. It is not a universal saving and it is not automatic — the position needs to be established before purchase, and stated explicitly in the landed-cost quote.",
      },
      {
        q: "How long does it take to import a car from the UK?",
        a: "To Ireland or mainland Europe, often under two weeks, because the sailing is short and the paperwork is the constraint. To Africa, the Middle East or Asia, expect roughly four to eight weeks door to port depending on the route and sailing frequency, plus clearance and registration at your end.",
      },
    ],
  }),
  post({
    slug: "best-cars-to-import-from-the-uk",
    title: "The Best Cars to Import From the UK",
    h1: "The Best Cars to Import From the UK (And Why Origin Matters)",
    seoTitle: "The Best Cars to Import From the UK in 2026",
    description:
      "The models that make the most sense to buy in Britain — British-built 4x4s and luxury cars that can qualify for tariff preference, the depth of the used premium market, and the cars that are a trap.",
    excerpt:
      "Some cars are cheaper to import from Britain because of what they are. Others are only cheaper because of where they were built.",
    cluster: "United Kingdom",
    primaryKeyword: "best cars to import from the uk",
    keywords: [
      "best cars to import from the uk",
      "british built cars to import",
      "uk cars worth importing",
      "range rover import",
      "uk built car origin",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1549632891-a0bea6d0355b"),
    heroAlt: "Range Rover on a forest track — a British-built export",
    related: [
      "how-to-import-a-car-from-the-uk",
      "cost-to-import-a-car-from-the-uk",
      "uk-car-history-checks-explained",
      "uk-car-export-documents-explained",
    ],
    toc: [
      { id: "two-reasons", label: "Two different reasons to buy British" },
      { id: "british-built", label: "The genuinely British-built cars" },
      { id: "luxury", label: "Luxury and low-volume marques" },
      { id: "used-depth", label: "Where the used market wins" },
      { id: "traps", label: "The origin trap" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Which cars are actually built in the UK?",
        a: "Land Rover and Range Rover models at Solihull and Halewood, Mini at Oxford, Bentley at Crewe, Rolls-Royce at Goodwood, Aston Martin at Gaydon and St Athan, McLaren at Woking, Lotus at Hethel, and high-volume models at Nissan Sunderland and Toyota Burnaston. A great many other brands are sold in Britain but built elsewhere, and the distinction can change your duty bill.",
      },
      {
        q: "Is a German car cheaper if I buy it in the UK?",
        a: "Often less than buyers expect. A BMW, Mercedes, Audi or Volkswagen sold in Britain was almost certainly built in the EU, so it does not qualify as UK-origin for tariff purposes and can attract full duty on import to markets that grant UK-built cars preference. The used price may still be competitive, but the duty assumption is where people lose money.",
      },
      {
        q: "Are UK cars right-hand drive only?",
        a: "The domestic market is right-hand drive, which suits RHD destinations perfectly and rules the UK out as a source for left-hand-drive markets in most cases. If you need LHD, the UAE and Japan are the two source countries in our network with genuine depth of native left-hand-drive stock.",
      },
    ],
  }),
  post({
    slug: "uk-car-history-checks-explained",
    title: "UK Car History Checks Explained",
    h1: "UK Car History Checks Explained: What You Can Verify Before You Buy",
    seoTitle:
      "UK Car History Checks Explained: MOT History, Provenance and Mileage",
    description:
      "How to verify a British used car before buying it from abroad — the public MOT and mileage record, provenance checks for finance, write-offs and theft, and what none of it can tell you.",
    excerpt:
      "Britain publishes more about its used cars than any market on earth. Here is how to read all of it — and what still needs human eyes.",
    cluster: "United Kingdom",
    primaryKeyword: "uk car history check",
    keywords: [
      "uk car history check",
      "mot history check",
      "hpi check explained",
      "check uk car mileage",
      "uk write off categories",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1450101499163-c8848c66ca85"),
    heroAlt: "Vehicle history documents for a UK used car",
    related: [
      "how-to-import-a-car-from-the-uk",
      "best-cars-to-import-from-the-uk",
      "uk-car-export-documents-explained",
      "cost-to-import-a-car-from-the-uk",
    ],
    toc: [
      { id: "why-britain", label: "Why Britain is different" },
      { id: "mot", label: "The MOT record: a year-by-year biography" },
      { id: "mileage", label: "Reading the mileage timeline" },
      { id: "provenance", label: "Provenance: finance, theft and write-offs" },
      { id: "categories", label: "Write-off categories, plainly" },
      { id: "limits", label: "What the data cannot tell you" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What does an MOT history actually show?",
        a: "Every annual roadworthiness test the car has taken, with the date, the result, the recorded mileage and every advisory and failure note. Read in sequence it is close to a biography: you can see corrosion advisories appearing, a suspension issue recurring, or a year where the mileage barely moved. It is the single most useful free document in the used-car world.",
      },
      {
        q: "How do I spot a clocked car in the UK?",
        a: "Plot the mileage recorded at each MOT. Genuine cars produce a broadly rising line; a clocked car produces a step backwards, an implausibly flat stretch, or a sudden change of slope. Any inconsistency is a hard stop rather than a negotiating point — and it is the check we run on every UK car before purchase.",
      },
      {
        q: "Should I buy a Category N or Category S car?",
        a: "Only knowingly, and only at the right price. Category N means non-structural damage was recorded and Category S means structural damage was — both are legally repairable and re-registerable in the UK, but both affect value and some destination markets will not register them at all. We disclose any recorded write-off marker and check your country's position before proceeding.",
      },
    ],
  }),
  post({
    slug: "cost-to-import-a-car-from-the-uk",
    title: "What It Costs to Import a Car From the UK",
    h1: "What It Costs to Import a Car From the UK (Every Line)",
    seoTitle: "The Real Cost of Importing a Car From the UK: Full Breakdown",
    description:
      "The full cost of a UK car export — purchase price, VAT treatment, inland transport, freight by ferry or container, marine insurance, and the destination duty that origin rules can halve or double.",
    excerpt:
      "The UK is the cheapest source in our network for European buyers and a middling one for everybody else. Here is why, line by line.",
    cluster: "United Kingdom",
    primaryKeyword: "cost to import a car from the uk",
    keywords: [
      "cost to import a car from the uk",
      "uk car export cost",
      "shipping a car from the uk",
      "uk import landed cost",
      "uk car export vat",
    ],
    readingTimeMins: 9,
    heroImage: UNSPLASH("1605559424843-9e4c228bf1c2"),
    heroAlt: "Calculating the cost of importing a car from the UK",
    related: [
      "how-to-import-a-car-from-the-uk",
      "best-cars-to-import-from-the-uk",
      "uk-car-export-documents-explained",
      "uk-car-history-checks-explained",
    ],
    toc: [
      { id: "structure", label: "How the total is built" },
      { id: "in-the-uk", label: "Costs inside the UK" },
      { id: "vat", label: "The VAT question" },
      { id: "freight", label: "Ferry vs container vs RoRo" },
      { id: "destination", label: "Duty, tax and the origin rule" },
      { id: "example", label: "A worked comparison" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is it cheaper to import a car from the UK than from Japan?",
        a: "For buyers in Ireland and mainland Europe, frequently yes, because the freight leg is measured in days rather than weeks. For buyers further afield the freight advantage disappears and the decision comes down to the car: the UK wins on British-built models and premium used depth, Japan wins on low-mileage hybrids and 4x4s at auction prices.",
      },
      {
        q: "How much does it cost to ship a car from the UK?",
        a: "It depends far more on the route than on the car. Short-sea and ferry crossings to Ireland and Europe are the cheapest freight in our whole network; deep-sea RoRo or container to Africa, Asia or the Caribbean costs several times as much. Because the spread is so wide, we quote the actual sailing rather than an average.",
      },
      {
        q: "Can I reclaim the VAT on a car I export from the UK?",
        a: "Sometimes, and it hinges on the seller and the evidence rather than on your intentions. A qualifying export sale by a VAT-registered vendor can be zero-rated where correct proof of export is held; a private-sale car carries no recoverable VAT regardless. Treat any saving as unconfirmed until the position is established in writing before purchase.",
      },
    ],
  }),
  post({
    slug: "uk-car-export-documents-explained",
    title: "UK Car Export Documents Explained",
    h1: "UK Car Export Documents Explained: What Travels With the Car",
    seoTitle:
      "UK Car Export Documents Explained (V5C, Export Notification, Origin)",
    description:
      "The V5C and its export section, permanent export notification, the customs declaration, proof of origin for tariff preference, and the Bill of Lading — what each does and what happens when one is missing.",
    excerpt:
      "One missing statement of origin can cost you ten percent of the car's value. Here is the full document set and why each piece exists.",
    cluster: "United Kingdom",
    primaryKeyword: "uk car export documents",
    keywords: [
      "uk car export documents",
      "v5c export section",
      "permanent export notification",
      "statement of origin car",
      "uk customs export declaration car",
    ],
    readingTimeMins: 9,
    heroImage: UNSPLASH("1542362567-b07e54358753"),
    heroAlt: "Export documentation for a car leaving the United Kingdom",
    related: [
      "how-to-import-a-car-from-the-uk",
      "cost-to-import-a-car-from-the-uk",
      "uk-car-history-checks-explained",
      "best-cars-to-import-from-the-uk",
    ],
    toc: [
      { id: "the-set", label: "The document set at a glance" },
      { id: "v5c", label: "The V5C and permanent export" },
      { id: "customs", label: "The export declaration" },
      { id: "origin", label: "Proof of origin: the expensive one" },
      { id: "shipping-docs", label: "Bill of Lading and insurance" },
      { id: "missing", label: "What happens when one is missing" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is the V5C export section for?",
        a: "The V5C is the UK registration document, and it carries a section used to notify the authorities that the vehicle is being permanently exported. Completing it removes the car from UK registration, which matters both for the seller's liability and for your ability to register it cleanly at destination. The remaining part of the document travels with the car.",
      },
      {
        q: "What is a statement of origin and why does it matter?",
        a: "It is a declaration that the vehicle was manufactured in the UK, and in markets that grant preferential tariffs to UK-origin goods it is the difference between paying duty and not. Without it, preference cannot be claimed even on a genuinely British-built car — the entitlement exists but is unprovable, and customs will assess full duty.",
      },
      {
        q: "Who is responsible for the export declaration?",
        a: "The exporter of record, which in a managed import is us rather than you. It has to be lodged correctly and in time, because an error surfaces as a hold at the destination port where every day costs storage. This is the least glamorous part of an import and the one where using a party with its own export history genuinely reduces risk.",
      },
    ],
  }),
];

// ── UNITED ARAB EMIRATES ─────────────────────────────────────────────────────

const uaePosts: BlogPost[] = [
  post({
    slug: "how-to-import-a-car-from-the-uae",
    title: "How to Import a Car From the UAE",
    h1: "How to Import a Car From the UAE: The Complete Process",
    seoTitle: "How to Import a Car From the UAE (Dubai Export Process, 2026)",
    description:
      "How the Dubai re-export machine works — where the stock comes from, how to screen for accident and flood damage, what free-zone export clearance involves, and how GCC specification affects registration at your end.",
    excerpt:
      "Dubai moves more used cars for export than any city on earth. That is an opportunity and a risk, and both come from the same place.",
    cluster: "UAE",
    primaryKeyword: "how to import a car from the uae",
    keywords: [
      "how to import a car from the uae",
      "import a car from dubai",
      "dubai car export process",
      "uae export certificate car",
      "buy a car in dubai for export",
    ],
    readingTimeMins: 11,
    heroImage: UNSPLASH("1571607388263-1044f9ea01dd"),
    heroAlt: "Supercar on a Dubai desert road at sunset",
    related: [
      "gcc-spec-cars-explained",
      "best-cars-to-import-from-dubai",
      "cost-to-import-a-car-from-the-uae",
      "uae-car-export-documents-explained",
    ],
    toc: [
      { id: "why-uae", label: "Why the UAE is a re-export hub" },
      { id: "stock", label: "Where the stock comes from" },
      { id: "screening", label: "Screening: accident and flood history" },
      { id: "spec", label: "The specification question" },
      { id: "clearance", label: "Free-zone export clearance" },
      { id: "shipping", label: "Shipping from Jebel Ali" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Why do so many used cars come out of Dubai?",
        a: "Because of how quickly they turn over. High incomes, no vehicle purchase tax and short ownership cycles mean a very large volume of low-mileage cars reaching the used market every year, far more than the domestic market absorbs. The free-zone customs regime at Jebel Ali then makes re-exporting them straightforward, which is how Dubai became the world's clearing house for nearly new vehicles.",
      },
      {
        q: "Are UAE cars flood damaged?",
        a: "Some are, and pretending otherwise would be dishonest — any market this large with this much turnover accumulates damaged stock, and the region has seen significant flooding events. The answer is screening rather than avoidance: official registration and inspection history, paint-depth readings, underbody and interior inspection, and electronics testing. Anything with an inconsistent history is rejected regardless of how well it presents.",
      },
      {
        q: "Can I import a UAE car into Europe?",
        a: "Sometimes, but specification is the deciding factor rather than paperwork. GCC-spec vehicles are built for heat and may differ from European specification in emissions equipment, lighting and driver-assistance systems, and homologation for European registration can be difficult or expensive as a result. We check the specific model against your country's requirements before purchase, and we will tell you when the answer is no.",
      },
    ],
  }),
  post({
    slug: "best-cars-to-import-from-dubai",
    title: "The Best Cars to Import From Dubai",
    h1: "The Best Cars to Import From Dubai (And What to Leave There)",
    seoTitle: "The Best Cars to Import From Dubai in 2026",
    description:
      "What the UAE market is genuinely best at supplying — nearly new luxury SUVs, high-specification saloons, supercars with main-dealer history — and the categories where Dubai is the wrong source country.",
    excerpt:
      "Dubai is unbeatable on nearly new luxury SUVs and a poor choice for several other things. Knowing which is which is the whole skill.",
    cluster: "UAE",
    primaryKeyword: "best cars to import from dubai",
    keywords: [
      "best cars to import from dubai",
      "dubai used luxury cars export",
      "import g wagon from dubai",
      "land cruiser from dubai",
      "supercar import from uae",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1638835373951-3a67da7aaf8d"),
    heroAlt: "Land Cruisers driving the dunes outside Dubai",
    related: [
      "how-to-import-a-car-from-the-uae",
      "gcc-spec-cars-explained",
      "cost-to-import-a-car-from-the-uae",
      "uae-car-export-documents-explained",
    ],
    toc: [
      { id: "what-uae-wins", label: "What the UAE wins on" },
      { id: "suvs", label: "The luxury SUVs" },
      { id: "saloons", label: "High-specification saloons" },
      { id: "supercars", label: "Supercars and limited runs" },
      { id: "lhd", label: "Left-hand drive at scale" },
      { id: "avoid", label: "What to leave in Dubai" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is the most exported car from Dubai?",
        a: "Large SUVs dominate — the Toyota Land Cruiser, Nissan Patrol, Lexus LX and GX, Mercedes G-Class and Range Rover. They are the vehicles the market buys in the greatest numbers, replaces the fastest, and specifies most heavily, which makes them the deepest and most competitively priced pool available for export.",
      },
      {
        q: "Is a Land Cruiser from Dubai better than one from Japan?",
        a: "It is a different vehicle for a different buyer. The Dubai car is likely newer, higher-specification and GCC-built for heat, and is left-hand drive. The Japanese car is likely right-hand drive, cheaper, and comes with an independently graded auction sheet. For hot left-hand-drive markets Dubai usually wins; for right-hand-drive markets Japan usually does.",
      },
      {
        q: "What should I not buy from the UAE?",
        a: "Right-hand-drive vehicles, since the market is left-hand drive and RHD stock is thin. Cars destined for cold-climate or emissions-strict registration, where GCC specification creates homologation problems. And anything where you need a fully independent condition grade of the kind the Japanese auction system produces — the UAE has no direct equivalent, so inspection has to do that work instead.",
      },
    ],
  }),
  post({
    slug: "gcc-spec-cars-explained",
    title: "GCC Spec Cars Explained",
    h1: "GCC Spec Cars Explained: What Changes, and Where It Matters",
    seoTitle: "GCC Spec vs European and Japanese Spec Cars Explained",
    description:
      "What GCC specification actually changes on a vehicle — cooling, air conditioning, materials, emissions and driver-assistance equipment — and when that helps you, when it costs you, and when it blocks registration.",
    excerpt:
      "GCC spec is a genuine engineering difference, not a marketing label. In a hot country it is an advantage. In a cold one it can be a problem.",
    cluster: "UAE",
    primaryKeyword: "gcc spec cars explained",
    keywords: [
      "gcc spec cars explained",
      "gcc spec vs european spec",
      "what is gcc specification",
      "gcc spec car import",
      "gcc vs japanese spec",
    ],
    readingTimeMins: 9,
    heroImage: UNSPLASH("1552519507-da3b142c6e3d"),
    heroAlt:
      "Car in desert country — the conditions GCC specification is built for",
    related: [
      "how-to-import-a-car-from-the-uae",
      "best-cars-to-import-from-dubai",
      "uae-car-export-documents-explained",
      "cost-to-import-a-car-from-the-uae",
    ],
    toc: [
      { id: "what-it-is", label: "What GCC spec means" },
      { id: "cooling", label: "Cooling and air conditioning" },
      { id: "materials", label: "Materials and trim" },
      { id: "emissions", label: "Emissions and fuel quality" },
      { id: "equipment", label: "Equipment differences" },
      { id: "decision", label: "When GCC spec is right for you" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is the difference between GCC spec and European spec?",
        a: "GCC-specification vehicles are engineered for sustained extreme heat: larger radiators and uprated cooling, higher-capacity air conditioning, heat- and UV-resistant interior materials, and calibration for the fuel available in the region. European-spec cars are optimised instead for strict emissions standards and cold-weather operation, which is why the two are not interchangeable in either direction.",
      },
      {
        q: "Is GCC spec worse than European spec?",
        a: "Neither is worse — they are optimised for different conditions. In a hot climate a GCC car is genuinely better suited and will hold up better. In a cold or emissions-strict market it can lack equipment that registration requires, and its heat-focused engineering brings no benefit. The mistake is treating specification as a quality ranking rather than a fit question.",
      },
      {
        q: "Can a GCC spec car pass European emissions testing?",
        a: "Not reliably, and it should never be assumed. Some models are effectively identical across regions and present no problem; others differ in exhaust after-treatment or engine calibration in ways that make homologation expensive or impossible. This is model-specific, it changes by year, and it must be checked before purchase — never after the car has sailed.",
      },
    ],
  }),
  post({
    slug: "cost-to-import-a-car-from-the-uae",
    title: "What It Costs to Import a Car From the UAE",
    h1: "What It Costs to Import a Car From the UAE (Every Line)",
    seoTitle: "The Real Cost of Importing a Car From the UAE: Full Breakdown",
    description:
      "Every cost in a UAE vehicle export — purchase price, export certificate and free-zone clearance, inland transport, container or RoRo freight from Jebel Ali, insurance, and destination duty on a high-value car.",
    excerpt:
      "UAE cars are usually newer and more valuable than the network average, which changes the shape of the bill. Here is how.",
    cluster: "UAE",
    primaryKeyword: "cost to import a car from the uae",
    keywords: [
      "cost to import a car from the uae",
      "cost to import a car from dubai",
      "dubai car export cost",
      "jebel ali car shipping cost",
      "uae import landed cost",
    ],
    readingTimeMins: 9,
    heroImage: UNSPLASH("1554224155-6726b3ff858f"),
    heroAlt: "Calculating the landed cost of a car imported from the UAE",
    related: [
      "how-to-import-a-car-from-the-uae",
      "best-cars-to-import-from-dubai",
      "gcc-spec-cars-explained",
      "uae-car-export-documents-explained",
    ],
    toc: [
      { id: "structure", label: "How the total is built" },
      { id: "in-the-uae", label: "Costs inside the UAE" },
      { id: "freight", label: "Container, RoRo or air" },
      { id: "value", label: "Why high value changes the maths" },
      { id: "destination", label: "Duty and tax at your end" },
      { id: "example", label: "A worked example" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How much does it cost to ship a car from Dubai?",
        a: "Less than most people expect for short routes and more than they expect for high-value cars. Sailings from Jebel Ali to South Asia and East Africa are short and frequent, which keeps freight low; but a nearly new luxury SUV usually travels in a container rather than by RoRo and carries higher insurance, both of which add cost that a cheap RoRo quote would not include.",
      },
      {
        q: "Is there VAT to pay on a car exported from the UAE?",
        a: "Vehicles purchased for export through the free-zone regime are treated differently from a domestic retail sale, which is a large part of why Dubai works as a re-export hub. The exact treatment depends on the seller and the structure of the transaction, so we state the tax position explicitly in the quote rather than leaving it as an assumption.",
      },
      {
        q: "Why is destination duty the biggest line on a UAE import?",
        a: "Because duty is normally assessed on the vehicle's value, and UAE cars tend to be newer and worth more than stock from other source countries. A nearly new luxury SUV can attract more duty and tax than the entire purchase price of an older car from Japan. It is why we model the total landed figure by country before recommending a source.",
      },
    ],
  }),
  post({
    slug: "uae-car-export-documents-explained",
    title: "UAE Car Export Documents Explained",
    h1: "UAE Car Export Documents Explained: What You Need to Register",
    seoTitle:
      "UAE Car Export Documents Explained (Export Certificate, Clearance, BL)",
    description:
      "The UAE export certificate, deregistration and plate cancellation, customs clearance through the free zone, chassis verification, and the Bill of Lading — what each proves and what registration depends on.",
    excerpt:
      "A UAE export lives or dies on the export certificate. Here is the whole file and what each part is for.",
    cluster: "UAE",
    primaryKeyword: "uae car export documents",
    keywords: [
      "uae car export documents",
      "dubai export certificate car",
      "uae car deregistration",
      "uae customs clearance vehicle",
      "car import documents from dubai",
    ],
    readingTimeMins: 8,
    heroImage: UNSPLASH("1502877338535-766e1452684a"),
    heroAlt: "Documentation handed over with a car exported from the UAE",
    related: [
      "how-to-import-a-car-from-the-uae",
      "cost-to-import-a-car-from-the-uae",
      "gcc-spec-cars-explained",
      "best-cars-to-import-from-dubai",
    ],
    toc: [
      { id: "the-set", label: "The document set at a glance" },
      { id: "export-certificate", label: "The export certificate" },
      { id: "dereg", label: "Deregistration and plate cancellation" },
      { id: "customs", label: "Free-zone customs clearance" },
      { id: "verification", label: "Chassis and engine verification" },
      { id: "shipping-docs", label: "Bill of Lading and insurance" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is a UAE export certificate?",
        a: "It is the document issued when a vehicle is deregistered in the Emirates specifically for export, confirming the chassis number, engine details, ownership and that the registration and plates have been cancelled. Without it a destination authority has no proof the car was lawfully released for export, and registration will normally be refused.",
      },
      {
        q: "Do I need the original documents or will copies do?",
        a: "Originals, in almost every market. Customs and registration authorities want to see the issued document rather than a scan, and a car sitting at port while an original is couriered accrues storage charges daily. Originals should travel by tracked courier separately from the vehicle, with the full scanned set issued to you at the point of shipment.",
      },
      {
        q: "What if there is finance outstanding on the car?",
        a: "Then it cannot lawfully be exported until the finance is cleared and the lender's interest released, and any deregistration attempt will fail. This is a routine check rather than an exotic one: ownership and encumbrance status are verified before purchase, and a car with an unresolved finance interest is not bought.",
      },
    ],
  }),
];

// ── INDIA ────────────────────────────────────────────────────────────────────

const indiaPosts: BlogPost[] = [
  post({
    slug: "how-to-import-a-car-from-india",
    title: "How to Import a Car From India",
    h1: "How to Import a Car From India: The Complete Process",
    seoTitle: "How to Import a Car From India (Step-by-Step Process, 2026)",
    description:
      "How to source and export a vehicle from India — new versus used, buying through dealer networks, pre-export safety inspection, export documentation, and which ports serve which destinations.",
    excerpt:
      "India's price advantage is real. Capturing it depends entirely on buying through a network that can verify what it sells you.",
    cluster: "India",
    primaryKeyword: "how to import a car from india",
    keywords: [
      "how to import a car from india",
      "export a car from india",
      "india car export process",
      "buy a car from india for export",
      "import india built car",
    ],
    readingTimeMins: 11,
    heroImage: UNSPLASH("1709620435533-56483034bdd4"),
    heroAlt: "SUV on the Indian coast — India-built stock heading for export",
    related: [
      "best-cars-to-import-from-india",
      "cost-to-import-a-car-from-india",
      "importing-cars-from-india-for-dealers",
      "india-car-export-documents-explained",
    ],
    toc: [
      { id: "why-india", label: "Why buy in India" },
      { id: "new-vs-used", label: "New or used: a real decision" },
      { id: "network", label: "Buying through a dealer network" },
      { id: "inspection", label: "Pre-export inspection" },
      { id: "documents", label: "Export documentation" },
      { id: "shipping", label: "Ports and shipping" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Can you export new cars from India?",
        a: "Yes, and for many buyers new is the better route. India is a manufacturing country, so buying new through the dealer network avoids the used-vehicle condition risk entirely while still capturing the price advantage. Availability of export-market variants and left-hand-drive configurations is model-specific, so it is confirmed before you commit.",
      },
      {
        q: "Are India-built cars available in left-hand drive?",
        a: "Many are. India produces left-hand-drive variants specifically for export markets across Africa, Latin America and the Middle East alongside right-hand-drive domestic production. Which configuration is available depends on the model and the plant, so tell us your destination and we will confirm before sourcing.",
      },
      {
        q: "How long does an India export take?",
        a: "Typically six to ten weeks from confirmed order to delivery. Sourcing and inspection come first, then export clearance, then a sailing of roughly two to three weeks to the Gulf and Sri Lanka, three to five weeks to Africa, or five to seven weeks to Europe, followed by clearance and registration at your end.",
      },
    ],
  }),
  post({
    slug: "best-cars-to-import-from-india",
    title: "The Best Cars to Import From India",
    h1: "The Best Cars to Import From India (Where the Value Really Is)",
    seoTitle: "The Best Cars to Import From India in 2026",
    description:
      "The India-built models that make the strongest case for export — sub-four-metre hatchbacks and compact SUVs, the tough off-roaders, the seven-seaters — and where parts availability decides the argument.",
    excerpt:
      "India's cheapest cars are not always its best exports. These are the models where price, durability and parts supply all agree.",
    cluster: "India",
    primaryKeyword: "best cars to import from india",
    keywords: [
      "best cars to import from india",
      "india built cars to import",
      "maruti suzuki export",
      "mahindra thar export",
      "india built fortuner",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1685019718640-6e562edc365e"),
    heroAlt: "Modern India-built SUV",
    related: [
      "how-to-import-a-car-from-india",
      "cost-to-import-a-car-from-india",
      "why-are-indian-manufactured-cars-cheaper",
      "importing-cars-from-india-for-dealers",
    ],
    toc: [
      { id: "criteria", label: "What makes a good India export" },
      { id: "hatchbacks", label: "The sub-four-metre hatchbacks" },
      { id: "compact-suvs", label: "Compact SUVs" },
      { id: "offroad", label: "The genuinely tough ones" },
      { id: "seven-seat", label: "Seven-seaters and people carriers" },
      { id: "parts", label: "Why parts availability decides it" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is the best-value car to import from India?",
        a: "The sub-four-metre compact segment — Suzuki Swift and Baleno, Hyundai Grand i10, Tata Tiago, Nissan Magnite — is where India's price advantage is widest, because those cars are engineered specifically to the tax envelope that rewards them. They also have the deepest parts supply across Africa and South Asia, which matters more to total cost than the sticker price does.",
      },
      {
        q: "Are Indian SUVs tough enough for African roads?",
        a: "The right ones are, and it is not a coincidence — India's own road conditions are demanding, so durability is engineered in rather than added. Mahindra's Thar and Scorpio and Toyota's India-built Fortuner and Innova have long, proven service records in exactly these markets. As always the individual unit's condition is what our inspection is for.",
      },
      {
        q: "Is a Toyota built in India the same as one built in Japan?",
        a: "For the models India builds for export, it is produced on the manufacturer's own global platform to the manufacturer's own standards. Specification can differ between markets — trim, safety equipment and emissions calibration are not always identical — so the useful question is which specification you are getting, not which country pressed the panels. We confirm that in writing before purchase.",
      },
    ],
  }),
  post({
    slug: "importing-cars-from-india-for-dealers",
    title: "Importing Cars From India: A Dealer's Guide",
    h1: "Importing Cars From India: What Dealers Need to Know",
    seoTitle: "Importing Cars From India for Dealers: Margins, Volume and Risk",
    description:
      "A dealer-focused guide to Indian vehicle sourcing — where the margin actually sits, how multi-unit allocations work, managing specification consistency across a batch, and the risks worth pricing in.",
    excerpt:
      "For a dealership, India is a margin play with a consistency problem attached. Here is how to run it properly.",
    cluster: "India",
    primaryKeyword: "importing cars from india for dealers",
    keywords: [
      "importing cars from india for dealers",
      "bulk car import from india",
      "dealer vehicle sourcing india",
      "multi unit car import",
      "india car import margin",
    ],
    readingTimeMins: 11,
    heroImage: UNSPLASH("1552519507-da3b142c6e3d"),
    heroAlt: "Dealer forecourt stock of the kind supplied from India",
    related: [
      "best-cars-to-import-from-india",
      "cost-to-import-a-car-from-india",
      "how-to-import-a-car-from-india",
      "india-car-export-documents-explained",
    ],
    toc: [
      { id: "where-margin-sits", label: "Where the margin actually sits" },
      { id: "allocations", label: "How multi-unit allocations work" },
      { id: "consistency", label: "The consistency problem" },
      { id: "cashflow", label: "Cashflow and lead time" },
      { id: "aftersales", label: "Warranty and aftersales" },
      { id: "risks", label: "The risks worth pricing in" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is the minimum order for a multi-unit import from India?",
        a: "There is no fixed floor — we ship single cars and we ship regular allocations. What changes with volume is the economics: shared container loading, consolidated documentation and a single clearance event spread fixed costs across more units, so the per-car landed figure improves noticeably once you are shipping several at a time.",
      },
      {
        q: "How do I keep specification consistent across a batch?",
        a: "By specifying at the order stage and verifying at the inspection stage, in writing, per unit. The failure mode on volume orders is silent substitution — a different trim or a different colour arriving because it was available. Every unit in an allocation is documented against the agreed specification before loading, and any variance is raised before the vehicle sails, not after.",
      },
      {
        q: "What warranty can I offer on an India-built import?",
        a: "That depends on the model and your market, and it needs establishing before you commit rather than after a customer asks. Manufacturer warranty transferability across borders varies considerably, so many dealers back these units with their own workshop cover instead. We confirm in writing what factory cover, if any, applies to your specific units as part of the quote.",
      },
    ],
  }),
  post({
    slug: "cost-to-import-a-car-from-india",
    title: "What It Costs to Import a Car From India",
    h1: "What It Costs to Import a Car From India (Every Line)",
    seoTitle: "The Real Cost of Importing a Car From India: Full Breakdown",
    description:
      "The full landed cost of an Indian vehicle export — purchase price, inspection, inland transport, freight from Nhava Sheva or Chennai, insurance, and the destination duty that can erase the price advantage.",
    excerpt:
      "India's 30% price advantage is easy to lose at the destination port. Here is where it goes, and how to keep it.",
    cluster: "India",
    primaryKeyword: "cost to import a car from india",
    keywords: [
      "cost to import a car from india",
      "india car export cost",
      "shipping a car from india",
      "india import landed cost",
      "india car export freight",
    ],
    readingTimeMins: 9,
    heroImage: UNSPLASH("1605559424843-9e4c228bf1c2"),
    heroAlt: "Calculating the landed cost of a car imported from India",
    related: [
      "how-to-import-a-car-from-india",
      "best-cars-to-import-from-india",
      "importing-cars-from-india-for-dealers",
      "why-are-indian-manufactured-cars-cheaper",
    ],
    toc: [
      { id: "structure", label: "How the total is built" },
      { id: "in-india", label: "Costs inside India" },
      { id: "freight", label: "Freight and insurance" },
      { id: "destination", label: "Where the advantage gets eaten" },
      { id: "keeping-it", label: "How to keep the saving" },
      { id: "example", label: "A worked example" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is importing from India actually cheaper once taxes are added?",
        a: "It depends on your destination's duty structure more than on the car. Where duty is assessed as a percentage of value, a cheaper vehicle attracts proportionally less duty and the advantage survives the journey intact. Where duty is charged on engine capacity or a fixed schedule, the saving compresses. The only way to know is to model your specific destination, which is why we quote rather than generalise.",
      },
      {
        q: "How much does it cost to ship a car from India?",
        a: "The Gulf and Sri Lanka are short, cheap sailings; East and West Africa are moderate; Europe and Latin America are the expensive end. Because India's advantage is a percentage of a relatively low vehicle price, freight is a larger share of the total than it would be on a luxury import — which makes container consolidation on multi-unit orders unusually worthwhile.",
      },
      {
        q: "Should I buy new or used from India to get the best value?",
        a: "For most buyers, new. India's price advantage is a manufacturing advantage, so you capture it most cleanly at the factory gate, and you avoid used-vehicle condition risk in a market where verifying an individual car's history is harder than it is in the UK or Japan. Used makes sense mainly where budget is the binding constraint.",
      },
    ],
  }),
  post({
    slug: "india-car-export-documents-explained",
    title: "India Car Export Documents Explained",
    h1: "India Car Export Documents Explained: The Full File",
    seoTitle:
      "India Car Export Documents Explained (Invoice, Shipping Bill, BL)",
    description:
      "The commercial invoice, shipping bill and customs clearance, chassis verification, inspection certificate and Bill of Lading — the document set behind an Indian vehicle export and why each piece matters.",
    excerpt:
      "Indian export paperwork is procedural rather than complicated. It is also unforgiving of small errors. Here is the whole set.",
    cluster: "India",
    primaryKeyword: "india car export documents",
    keywords: [
      "india car export documents",
      "shipping bill car export india",
      "india vehicle export invoice",
      "chassis verification india export",
      "import documents from india",
    ],
    readingTimeMins: 8,
    heroImage: UNSPLASH("1542362567-b07e54358753"),
    heroAlt: "Export documentation for a vehicle leaving India",
    related: [
      "how-to-import-a-car-from-india",
      "cost-to-import-a-car-from-india",
      "importing-cars-from-india-for-dealers",
      "best-cars-to-import-from-india",
    ],
    toc: [
      { id: "the-set", label: "The document set at a glance" },
      { id: "invoice", label: "Commercial invoice and packing list" },
      { id: "shipping-bill", label: "The shipping bill" },
      { id: "verification", label: "Chassis and engine verification" },
      { id: "inspection", label: "The inspection certificate" },
      { id: "shipping-docs", label: "Bill of Lading and insurance" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is a shipping bill and why does it matter?",
        a: "It is the export declaration lodged with Indian customs, and it is what authorises the vehicle to leave the country. It must describe the goods, the value and the destination consistently with the invoice and the Bill of Lading, because any discrepancy between those three documents becomes a hold at the destination port, where every day of delay costs storage.",
      },
      {
        q: "Do I need a pre-export inspection certificate for an Indian car?",
        a: "Whether one is legally required depends on your destination — several markets mandate an accredited pre-shipment inspection. Whether you should have one is a different question, and our answer is always yes. Every vehicle we export from India carries our own multi-point inspection report and photographs whether or not the destination demands it.",
      },
      {
        q: "How is the customs value of the car established?",
        a: "Normally from the commercial invoice, supported by the underlying purchase documentation. Undervaluing an invoice to reduce duty is fraud, it is routinely detected, and it exposes you to penalties and seizure at your own border rather than ours. Every vehicle we export is invoiced at its actual transaction value.",
      },
    ],
  }),
];

// ── THAILAND ─────────────────────────────────────────────────────────────────

const thailandPosts: BlogPost[] = [
  post({
    slug: "how-to-import-a-car-from-thailand",
    title: "How to Import a Car From Thailand",
    h1: "How to Import a Car From Thailand: The Complete Process",
    seoTitle: "How to Import a Car From Thailand (Step-by-Step Process, 2026)",
    description:
      "How Thai vehicle export works — ordering new export-specification pickups through the dealer network, buying used through Thai auctions, accessory fitment before loading, and shipping from Laem Chabang.",
    excerpt:
      "Thailand is where most of the world's pickups are made. Buying at the source removes every layer of margin between the plant and you.",
    cluster: "Thailand",
    primaryKeyword: "how to import a car from thailand",
    keywords: [
      "how to import a car from thailand",
      "thailand car export process",
      "import a hilux from thailand",
      "buy a pickup from thailand",
      "thailand vehicle exporter",
    ],
    readingTimeMins: 11,
    heroImage: UNSPLASH("1610647929723-a8922852cd44"),
    heroAlt: "Double-cab pickup of the kind built in Thailand",
    related: [
      "best-pickups-to-import-from-thailand",
      "cost-to-import-a-car-from-thailand",
      "thailand-vs-japan-for-pickup-imports",
      "thailand-car-export-documents-explained",
    ],
    toc: [
      { id: "why-thailand", label: "Why Thailand" },
      { id: "new-vs-used", label: "New export spec or used" },
      { id: "specifying", label: "Specifying the vehicle properly" },
      { id: "accessories", label: "Accessories: fit before it sails" },
      { id: "export", label: "Export clearance" },
      { id: "shipping", label: "Shipping from Laem Chabang" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Why import a pickup from Thailand rather than locally?",
        a: "Because Thailand is where it was built. Toyota, Isuzu, Ford, Mitsubishi, Mazda and Nissan all produce their global one-tonne pickups there and export them worldwide, so buying at source removes the distributor and dealer margins that a destination showroom adds. You also get the full range of trims and drivetrains rather than the subset your local importer chose to stock.",
      },
      {
        q: "Can I order a brand-new vehicle from Thailand?",
        a: "Yes, and for pickups it is usually the better route. New export-specification vehicles are ordered through the dealer network to your exact trim, drivetrain and accessory requirements, which removes used-vehicle condition risk entirely. Lead time depends on the model and build slot, and is confirmed before you commit.",
      },
      {
        q: "Is Thai-built the same quality as Japanese-built?",
        a: "For these models they are the same vehicles. A Hilux, D-Max or Ranger built in Thailand comes off the manufacturer's global export line to the manufacturer's own standards — Thailand is the primary production source for these models in most of the world, not a secondary one. Specification differences between markets are the real variable, and we confirm those against your destination's rules.",
      },
    ],
  }),
  post({
    slug: "best-pickups-to-import-from-thailand",
    title: "The Best Pickups to Import From Thailand",
    h1: "The Best Pickups to Import From Thailand (And the SUVs Built on Them)",
    seoTitle: "The Best Pickups and 4x4s to Import From Thailand in 2026",
    description:
      "The Thai-built pickups and body-on-frame SUVs worth importing — Hilux Revo, Ranger, D-Max, Triton, BT-50, Fortuner, Pajero Sport and MU-X — compared on payload, drivetrain and parts availability.",
    excerpt:
      "Six pickups, four SUVs built on them, and one honest comparison of which suits which job.",
    cluster: "Thailand",
    primaryKeyword: "best pickups to import from thailand",
    keywords: [
      "best pickups to import from thailand",
      "hilux revo export",
      "isuzu d-max export thailand",
      "ford ranger thailand export",
      "fortuner import",
    ],
    readingTimeMins: 11,
    heroImage: UNSPLASH("1612057473117-3e16246121e6"),
    heroAlt: "Double-cab pickup working off-road",
    related: [
      "how-to-import-a-car-from-thailand",
      "thailand-vs-japan-for-pickup-imports",
      "cost-to-import-a-car-from-thailand",
      "thailand-car-export-documents-explained",
    ],
    toc: [
      { id: "how-to-choose", label: "How to choose between them" },
      { id: "hilux", label: "Toyota Hilux Revo" },
      { id: "ranger", label: "Ford Ranger" },
      { id: "dmax", label: "Isuzu D-Max and Mazda BT-50" },
      { id: "triton", label: "Mitsubishi Triton" },
      { id: "suvs", label: "The SUVs built on the same frames" },
      { id: "evs", label: "The new arrival: Thai-assembled EVs" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Which Thai pickup is the most reliable?",
        a: "The Hilux and the D-Max have the strongest reputations across the widest range of markets, and both are chosen by fleets and aid organisations for exactly that reason. The Ranger is more capable and better equipped in higher trims but more complex; the Triton and BT-50 offer the best value. Reliability at this level is more about maintenance and specification than about badge.",
      },
      {
        q: "Should I buy 2WD or 4WD?",
        a: "4WD if the vehicle will actually leave sealed roads, work in mud or sand, or tow on loose surfaces. 2WD is meaningfully cheaper to buy, cheaper to run and adequate for road and light-site use, and it makes up a large share of Thai production. Buying 4WD you never engage is one of the more common ways to overspend on a pickup.",
      },
      {
        q: "Are the SUV versions as tough as the pickups?",
        a: "Broadly yes, and that is the point of them. The Fortuner, Pajero Sport and MU-X sit on the same ladder frames and share drivetrains with the Hilux, Triton and D-Max, so they inherit the durability and the parts supply while adding seven seats and a covered load area. What they lose is payload capacity.",
      },
    ],
  }),
  post({
    slug: "thailand-vs-japan-for-pickup-imports",
    title: "Thailand vs Japan for Pickup Imports",
    h1: "Thailand vs Japan: Where Should You Import Your Pickup From?",
    seoTitle:
      "Thailand vs Japan for Pickup and 4x4 Imports: The Honest Comparison",
    description:
      "A direct comparison of Thailand and Japan as pickup source countries — new versus used, price, condition verification, specification, parts supply and freight — and which wins for your use case.",
    excerpt:
      "Thailand builds them new; Japan sells them used with an independent grade attached. The right answer depends on what you actually need.",
    cluster: "Thailand",
    primaryKeyword: "thailand vs japan pickup import",
    keywords: [
      "thailand vs japan pickup import",
      "import hilux from thailand or japan",
      "best country to import a pickup",
      "japan vs thailand car export",
      "used vs new pickup import",
    ],
    readingTimeMins: 10,
    heroImage: LOCAL("hero-land-cruiser"),
    heroAlt: "Comparing Thai-built and Japanese-market 4x4 imports",
    related: [
      "best-pickups-to-import-from-thailand",
      "how-to-import-a-car-from-thailand",
      "best-cars-to-import-from-japan",
      "cost-to-import-a-car-from-thailand",
    ],
    toc: [
      { id: "headline", label: "The headline difference" },
      { id: "new-vs-used", label: "New versus used" },
      { id: "verification", label: "Verifying condition" },
      { id: "spec", label: "Specification and equipment" },
      { id: "parts", label: "Parts and aftermarket" },
      { id: "freight", label: "Freight and lead time" },
      { id: "verdict", label: "The verdict" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is it cheaper to import a pickup from Thailand or Japan?",
        a: "For a used vehicle, Japan is usually cheaper, because the auction system produces wholesale prices and depreciation has already done its work. For a new vehicle Thailand is the only realistic option, and it is far cheaper than buying the same new vehicle through a destination-market dealer. They are answers to different questions.",
      },
      {
        q: "Which source gives better condition verification?",
        a: "Japan, clearly, and it is the single strongest argument for buying used from there. The auction system produces an independent inspector's grade with a panel-by-panel damage map before anyone bids. Thailand has no direct equivalent, so on used Thai stock the verification work has to be done by physical inspection instead.",
      },
      {
        q: "Which is better for a working fleet?",
        a: "Thailand, in most cases. New export-specification vehicles arrive identical to one another, under factory warranty where transferable, with the accessory fitment you specified, which is exactly what fleet operation wants. Japan's advantage — individual low-mileage used bargains — is less useful when you need ten of the same thing.",
      },
    ],
  }),
  post({
    slug: "cost-to-import-a-car-from-thailand",
    title: "What It Costs to Import a Car From Thailand",
    h1: "What It Costs to Import a Car From Thailand (Every Line)",
    seoTitle: "The Real Cost of Importing a Car From Thailand: Full Breakdown",
    description:
      "Every cost in a Thai vehicle export — purchase or factory price, accessory fitment, inland transport, export clearance, freight from Laem Chabang, insurance and destination duty on a commercial vehicle.",
    excerpt:
      "Pickups are taxed differently from cars in a lot of countries. That single fact changes the whole calculation.",
    cluster: "Thailand",
    primaryKeyword: "cost to import a car from thailand",
    keywords: [
      "cost to import a car from thailand",
      "thailand car export cost",
      "shipping a pickup from thailand",
      "laem chabang car shipping",
      "thailand import landed cost",
    ],
    readingTimeMins: 9,
    heroImage: UNSPLASH("1554224155-6726b3ff858f"),
    heroAlt: "Calculating the landed cost of a vehicle imported from Thailand",
    related: [
      "how-to-import-a-car-from-thailand",
      "best-pickups-to-import-from-thailand",
      "thailand-vs-japan-for-pickup-imports",
      "thailand-car-export-documents-explained",
    ],
    toc: [
      { id: "structure", label: "How the total is built" },
      { id: "in-thailand", label: "Costs inside Thailand" },
      {
        id: "accessories",
        label: "Accessories: the cheapest line you will ever add",
      },
      { id: "freight", label: "Freight and insurance" },
      { id: "commercial", label: "Why commercial classification matters" },
      { id: "example", label: "A worked example" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Are pickups taxed differently from cars on import?",
        a: "In many countries, yes, and it can be the largest single variable in the whole calculation. Commercial or goods-vehicle classification often carries a different duty rate and different tax treatment from a passenger car, and the classification can hinge on details like seating, payload or whether the load area is separated. We confirm how your destination will classify the specific vehicle before purchase.",
      },
      {
        q: "How much does it cost to ship a pickup from Thailand?",
        a: "Pickups take more space than a passenger car, which shows up in RoRo pricing, and Laem Chabang is a major vehicle terminal with frequent sailings that partly offsets it. Asia and Oceania are short, cheap runs; Africa and the Middle East are moderate; Europe is the expensive end. Consolidating multiple units into containers changes the maths noticeably.",
      },
      {
        q: "Is it worth fitting accessories in Thailand?",
        a: "Almost always. The accessory industry that grew around Thai pickup production means canopies, trays, bar work, suspension and protection equipment cost a fraction of destination-market prices, and fitting before loading means the vehicle arrives ready to work. The exception is equipment your destination will not register, which we check first.",
      },
    ],
  }),
  post({
    slug: "thailand-car-export-documents-explained",
    title: "Thailand Car Export Documents Explained",
    h1: "Thailand Car Export Documents Explained: The Full File",
    seoTitle:
      "Thailand Car Export Documents Explained (Invoice, Export Entry, BL)",
    description:
      "The commercial invoice, Thai export entry and customs clearance, chassis and engine verification, inspection certificate and Bill of Lading — the paperwork behind a Thai vehicle export.",
    excerpt:
      "New-vehicle exports and used-vehicle exports carry different files. Here is what each one contains and why.",
    cluster: "Thailand",
    primaryKeyword: "thailand car export documents",
    keywords: [
      "thailand car export documents",
      "thai export entry vehicle",
      "thailand vehicle export invoice",
      "import documents from thailand",
      "thailand car deregistration export",
    ],
    readingTimeMins: 8,
    heroImage: UNSPLASH("1502877338535-766e1452684a"),
    heroAlt: "Documentation for a vehicle exported from Thailand",
    related: [
      "how-to-import-a-car-from-thailand",
      "cost-to-import-a-car-from-thailand",
      "best-pickups-to-import-from-thailand",
      "thailand-vs-japan-for-pickup-imports",
    ],
    toc: [
      { id: "the-set", label: "The document set at a glance" },
      { id: "new-vs-used", label: "New and used files differ" },
      { id: "invoice", label: "Invoice and packing list" },
      { id: "export-entry", label: "The export entry" },
      { id: "verification", label: "Chassis and engine verification" },
      { id: "shipping-docs", label: "Bill of Lading and insurance" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What documents come with a new vehicle exported from Thailand?",
        a: "A commercial invoice from the supplying dealer, the manufacturer's certificate or equivalent build documentation, the Thai export entry lodged with customs, chassis and engine verification, an inspection report where required, and the Bill of Lading. Because the vehicle was never registered in Thailand there is no deregistration document to obtain, which makes new exports the cleaner file.",
      },
      {
        q: "What is different about exporting a used Thai vehicle?",
        a: "It has to be deregistered and released from Thai registration first, and ownership and any outstanding finance interest have to be cleared before that can happen. That extra step is the main reason used Thai exports take longer to clear than new ones, and it is where delays originate when they occur.",
      },
      {
        q: "Do accessories need to be documented separately?",
        a: "Yes, and it matters more than it sounds. Accessories fitted before shipment form part of the vehicle's declared value for customs purposes, and some destinations require specific equipment to be declared or approved. Under-declaring fitted equipment creates a valuation problem at your own border, so everything fitted appears on the invoice.",
      },
    ],
  }),
];

// ── AUSTRALIA ────────────────────────────────────────────────────────────────

const australiaPosts: BlogPost[] = [
  post({
    slug: "how-to-import-a-car-from-australia",
    title: "How to Import a Car From Australia",
    h1: "How to Import a Car From Australia: The Complete Process",
    seoTitle: "How to Import a Car From Australia (Step-by-Step Process, 2026)",
    description:
      "How to buy and export a vehicle from Australia — where the stock is, running a PPSR provenance check, state deregistration, the biosecurity clean nobody warns you about, and shipping from five ports.",
    excerpt:
      "Australia stopped making cars in 2017. It is still one of the best places on earth to buy a 4x4 — for entirely different reasons.",
    cluster: "Australia",
    primaryKeyword: "how to import a car from australia",
    keywords: [
      "how to import a car from australia",
      "export a car from australia",
      "australia car export process",
      "ppsr check",
      "australia vehicle deregistration export",
    ],
    readingTimeMins: 11,
    heroImage: UNSPLASH("1686715018049-f73970aa97d3"),
    heroAlt: "Dual-cab 4x4 in outback desert country",
    related: [
      "importing-a-ute-or-4x4-from-australia",
      "best-cars-to-import-from-australia",
      "cost-to-import-a-car-from-australia",
      "australia-car-export-documents-explained",
    ],
    toc: [
      { id: "why-australia", label: "Why Australia, given it builds nothing" },
      { id: "where-stock-is", label: "Where the stock actually is" },
      { id: "ppsr", label: "The PPSR check comes first" },
      { id: "inspection", label: "Inspection and the rust question" },
      { id: "dereg", label: "Deregistration, state by state" },
      { id: "biosecurity", label: "The biosecurity clean" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Are cars still made in Australia?",
        a: "No. Ford ceased Australian manufacturing in 2016 and Holden and Toyota followed in 2017, ending mass vehicle production in the country. Every new car sold in Australia today is imported. The reason to source from Australia is the specification, condition and provenance record of the vehicles already there — not manufacturing.",
      },
      {
        q: "What is a PPSR check?",
        a: "The Personal Property Securities Register is Australia's national database of security interests, and for a vehicle it reveals outstanding finance, written-off status and stolen markers against the VIN. It is the single most important check on any Australian used car, it costs very little, and no vehicle should be purchased without it.",
      },
      {
        q: "Why does an Australian export need a steam clean?",
        a: "Because of where it is going. New Zealand, the Pacific islands and many African and Asian destinations enforce strict biosecurity rules on arriving vehicles, and soil, seeds or plant material in the wheel arches or underbody can mean the car is refused entry or cleaned at your expense on the quayside. Doing it before departure is far cheaper than doing it on arrival.",
      },
    ],
  }),
  post({
    slug: "best-cars-to-import-from-australia",
    title: "The Best Cars to Import From Australia",
    h1: "The Best Cars to Import From Australia (And Why)",
    seoTitle: "The Best Cars to Import From Australia in 2026",
    description:
      "What Australia is genuinely the best source for — dual-cab utes, touring 4x4s with serious equipment fitted, and the Holden and Ford performance cars that were never sold anywhere else.",
    excerpt:
      "Three categories where Australia beats every other source country, and one where it is the only source country at all.",
    cluster: "Australia",
    primaryKeyword: "best cars to import from australia",
    keywords: [
      "best cars to import from australia",
      "import a landcruiser from australia",
      "holden commodore export",
      "ford falcon import",
      "australian 4x4 import",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1717046633197-dc628db1dd4a"),
    heroAlt:
      "Touring-specification Land Cruiser of the kind sourced from Australia",
    related: [
      "how-to-import-a-car-from-australia",
      "importing-a-ute-or-4x4-from-australia",
      "cost-to-import-a-car-from-australia",
      "australia-car-export-documents-explained",
    ],
    toc: [
      { id: "three-categories", label: "Three categories, one monopoly" },
      { id: "utes", label: "Dual-cab utes" },
      { id: "touring", label: "Touring 4x4s, already equipped" },
      { id: "performance", label: "The cars only Australia had" },
      { id: "climate", label: "The dry-climate argument" },
      { id: "avoid", label: "What not to buy from Australia" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Why import a 4x4 from Australia specifically?",
        a: "Because of how Australians specify and equip them. The market buys touring 4x4s at a scale that distorts the model range and fits them from new with bull bars, snorkels, long-range tanks, dual batteries and upgraded suspension — kit that costs a fortune to add later and adds far less than that to resale value. Buying the already-equipped vehicle is usually cheaper than building one.",
      },
      {
        q: "Can I still buy a Holden Commodore or Ford Falcon?",
        a: "Yes, from the used market — and Australia is the only place you can. Large rear-drive V8 saloons in HSV and FPV form were never sold in this configuration anywhere else, which is why they are becoming genuinely collectable. Condition and provenance vary widely on cars of this age, so the PPSR check and physical inspection matter more here than anywhere.",
      },
      {
        q: "What should I not import from Australia?",
        a: "Left-hand-drive vehicles, since the market is right-hand drive. Ordinary small passenger cars, where Japan is cheaper and better documented. And anything where you need an independent condition grade before bidding — Australia has no equivalent of the Japanese auction sheet, so verification comes from physical inspection instead.",
      },
    ],
  }),
  post({
    slug: "importing-a-ute-or-4x4-from-australia",
    title: "Importing a Ute or 4x4 From Australia",
    h1: "Importing a Ute or 4x4 From Australia: What to Check Before You Buy",
    seoTitle: "Importing a Ute or 4x4 From Australia: The Buyer's Checklist",
    description:
      "A practical checklist for buying an Australian ute or touring 4x4 for export — reading fitted equipment, judging outback wear, mining-fleet stock, and whether your destination will register the modifications.",
    excerpt:
      "A well-set-up Australian tourer is a bargain. A hard-worked one is a liability. Here is how to tell them apart from 10,000 miles away.",
    cluster: "Australia",
    primaryKeyword: "importing a ute from australia",
    keywords: [
      "importing a ute from australia",
      "australian 4x4 export checklist",
      "buying an ex mining 4x4",
      "modified 4x4 import rules",
      "landcruiser 79 export",
    ],
    readingTimeMins: 11,
    heroImage: UNSPLASH("1559416523-140ddc3d238c"),
    heroAlt: "Australian dual-cab ute with touring equipment fitted",
    related: [
      "best-cars-to-import-from-australia",
      "how-to-import-a-car-from-australia",
      "cost-to-import-a-car-from-australia",
      "australia-car-export-documents-explained",
    ],
    toc: [
      { id: "two-kinds", label: "Two very different used utes" },
      { id: "equipment", label: "Reading the fitted equipment" },
      { id: "wear", label: "Judging outback wear" },
      { id: "fleet", label: "Ex-mining and ex-fleet stock" },
      { id: "modifications", label: "Will your country register it?" },
      { id: "checklist", label: "The inspection checklist" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is an ex-mining 4x4 a good buy?",
        a: "Frequently it is one of the best buys in the market, which surprises people. Mine-site vehicles run to enforced maintenance schedules with documented servicing and are retired on a fixed timetable rather than when they break. The trade-offs are high hours at low speed, dust exposure and sometimes cosmetic damage — all of which shows up on inspection and in the price.",
      },
      {
        q: "Will my country register a modified Australian 4x4?",
        a: "It depends on the modification and the country, and it must be checked before purchase rather than after arrival. Bull bars, lift kits, long-range tanks and roof racks are accepted without comment in some markets and require engineering approval or removal in others. We check your destination's position on the specific vehicle before we buy it.",
      },
      {
        q: "How do I judge wear on a vehicle I cannot see?",
        a: "Through a structured inspection rather than photographs of the paintwork. Underbody and chassis-rail images, suspension bush and mount condition, diff and transfer-case seal condition, evidence of dust ingress in the air intake and cabin filters, and the service record read against the odometer. That set tells you far more than mileage alone, and it is what our inspection produces.",
      },
    ],
  }),
  post({
    slug: "cost-to-import-a-car-from-australia",
    title: "What It Costs to Import a Car From Australia",
    h1: "What It Costs to Import a Car From Australia (Every Line)",
    seoTitle: "The Real Cost of Importing a Car From Australia: Full Breakdown",
    description:
      "The full cost of an Australian vehicle export — purchase price, PPSR and inspection, inland transport across a very large country, biosecurity cleaning, freight, insurance and destination duty.",
    excerpt:
      "Australia has one cost line no other source country has: moving the car to a port that may be 2,000 miles away.",
    cluster: "Australia",
    primaryKeyword: "cost to import a car from australia",
    keywords: [
      "cost to import a car from australia",
      "australia car export cost",
      "shipping a car from australia",
      "australia import landed cost",
      "car shipping from sydney",
    ],
    readingTimeMins: 9,
    heroImage: UNSPLASH("1605559424843-9e4c228bf1c2"),
    heroAlt: "Calculating the landed cost of a car imported from Australia",
    related: [
      "how-to-import-a-car-from-australia",
      "best-cars-to-import-from-australia",
      "importing-a-ute-or-4x4-from-australia",
      "australia-car-export-documents-explained",
    ],
    toc: [
      { id: "structure", label: "How the total is built" },
      { id: "in-australia", label: "Costs inside Australia" },
      { id: "distance", label: "The distance problem" },
      { id: "biosecurity", label: "Cleaning and inspection" },
      { id: "freight", label: "Freight and insurance" },
      { id: "example", label: "A worked example" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Why is inland transport such a big cost in Australia?",
        a: "Because of the geography. The best-value 4x4s are often in inland Queensland, South Australia or Western Australia, and the export ports are on the coast — which can mean a road move of well over a thousand kilometres before the car reaches a ship. It is a real line item, it varies enormously by vehicle location, and any quote that omits it is incomplete.",
      },
      {
        q: "How much does it cost to ship a car from Australia?",
        a: "New Zealand and the Pacific are short, relatively cheap runs. Southern and eastern Africa and South-East Asia are moderate. Europe and the Americas are the expensive end, and for an ordinary vehicle the freight can approach the purchase price — which is why Australia makes most sense as a source for nearby markets or for vehicles you cannot get elsewhere.",
      },
      {
        q: "Are there export taxes on a car leaving Australia?",
        a: "Australia does not impose an export duty on used private vehicles as a general matter, so the Australian-side costs are commercial rather than fiscal: purchase, provenance check, inspection, inland transport, cleaning, port handling and documentation. The tax you pay is at your own border, and that is where the bulk of it sits.",
      },
    ],
  }),
  post({
    slug: "australia-car-export-documents-explained",
    title: "Australia Car Export Documents Explained",
    h1: "Australia Car Export Documents Explained: The Full File",
    seoTitle:
      "Australia Car Export Documents Explained (PPSR, Deregistration, BL)",
    description:
      "The PPSR certificate, proof of ownership, state deregistration, customs export declaration, biosecurity cleaning certificate and Bill of Lading — the file behind an Australian vehicle export.",
    excerpt:
      "Australian export paperwork has one item most source countries do not: a cleaning certificate that can stop your car at the far end.",
    cluster: "Australia",
    primaryKeyword: "australia car export documents",
    keywords: [
      "australia car export documents",
      "ppsr certificate export",
      "australia vehicle deregistration",
      "biosecurity cleaning certificate car",
      "import documents from australia",
    ],
    readingTimeMins: 8,
    heroImage: UNSPLASH("1450101499163-c8848c66ca85"),
    heroAlt: "Export documentation for a vehicle leaving Australia",
    related: [
      "how-to-import-a-car-from-australia",
      "cost-to-import-a-car-from-australia",
      "importing-a-ute-or-4x4-from-australia",
      "best-cars-to-import-from-australia",
    ],
    toc: [
      { id: "the-set", label: "The document set at a glance" },
      { id: "ppsr", label: "The PPSR certificate" },
      { id: "ownership", label: "Proof of ownership and deregistration" },
      { id: "customs", label: "The export declaration" },
      { id: "cleaning", label: "The biosecurity cleaning certificate" },
      { id: "shipping-docs", label: "Bill of Lading and insurance" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Why does deregistration vary between Australian states?",
        a: "Because vehicle registration is administered state by state rather than federally, so the process, forms and plate-surrender requirements differ depending on where the car is registered. It is procedural rather than difficult, but it means the paperwork route is not identical for every vehicle — which is a practical argument for a buyer who has done it in each state before.",
      },
      {
        q: "What is a biosecurity cleaning certificate?",
        a: "It is evidence that the vehicle was cleaned to remove soil, seeds and plant material before shipment, and destinations with strict biosecurity regimes — New Zealand and much of the Pacific in particular — take it seriously. Without it, expect inspection, mandatory cleaning at your expense and delay at the port, or in the worst case refusal of entry.",
      },
      {
        q: "Do I need the PPSR certificate after purchase?",
        a: "Keep it. It is the documentary evidence that the vehicle was free of security interests at the time of purchase, and it can matter if ownership is ever questioned at your end. We run the check before buying and include the certificate in the document set that travels with the car.",
      },
    ],
  }),
];

// ── NEW ZEALAND ──────────────────────────────────────────────────────────────

const newZealandPosts: BlogPost[] = [
  post({
    slug: "how-to-import-a-car-from-new-zealand",
    title: "How to Import a Car From New Zealand",
    h1: "How to Import a Car From New Zealand: The Complete Process",
    seoTitle:
      "How to Import a Car From New Zealand (Step-by-Step Process, 2026)",
    description:
      "How New Zealand vehicle export works — reading the entry-certification history on ex-Japan stock, checking registration and odometer records, deregistration, biosecurity cleaning and shipping from three ports.",
    excerpt:
      "New Zealand's used cars have already been through somebody else's inspection regime. Here is how to use that to your advantage.",
    cluster: "New Zealand",
    primaryKeyword: "how to import a car from new zealand",
    keywords: [
      "how to import a car from new zealand",
      "export a car from new zealand",
      "nz car export process",
      "new zealand entry certification",
      "buy a car in new zealand from abroad",
    ],
    readingTimeMins: 11,
    heroImage: UNSPLASH("1503376780353-7e6692767b70"),
    heroAlt: "Imported car on the road after entry certification",
    related: [
      "new-zealand-vs-japan-for-used-imports",
      "best-cars-to-import-from-new-zealand",
      "cost-to-import-a-car-from-new-zealand",
      "importing-a-used-ev-from-new-zealand",
    ],
    toc: [
      { id: "why-nz", label: "Why New Zealand" },
      { id: "compliance-file", label: "The entry-certification file" },
      { id: "records", label: "Registration and odometer records" },
      { id: "inspection", label: "Inspection and the coastal caveat" },
      { id: "dereg", label: "Deregistration and export" },
      { id: "shipping", label: "Biosecurity and shipping" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is New Zealand entry certification?",
        a: "It is the inspection every used import must pass before it can be registered in New Zealand, covering structural integrity, frontal-impact standards, emissions and odometer accuracy. For a third-country buyer that record is genuinely valuable: it means a second independent authority has already screened the car for structural damage and odometer tampering, at somebody else's expense.",
      },
      {
        q: "Is a New Zealand car better documented than a Japanese one?",
        a: "Differently documented. A Japanese auction car comes with an independent condition grade and panel map at the point of sale, which New Zealand has no equivalent of. A New Zealand car comes with a compliance history, a registration record and a local service history since compliance. For verification of integrity, New Zealand; for verification of cosmetic condition, Japan.",
      },
      {
        q: "Does New Zealand restrict vehicle exports?",
        a: "Used private vehicles can generally be exported once ownership is clear and the vehicle is deregistered. The practical constraints are on the receiving side rather than the New Zealand side — your destination's age limits, emissions standards and biosecurity requirements are what determine whether a given car is worth buying, and those are checked before purchase.",
      },
    ],
  }),
  post({
    slug: "best-cars-to-import-from-new-zealand",
    title: "The Best Cars to Import From New Zealand",
    h1: "The Best Cars to Import From New Zealand (And Why They Are There)",
    seoTitle: "The Best Cars to Import From New Zealand in 2026",
    description:
      "What New Zealand supplies best — pre-complied ex-Japan hybrids, one of the world's deepest used-EV pools, NZ-new utes with local service history, and fleet-maintained vans.",
    excerpt:
      "New Zealand is a filtered version of the Japanese market, plus more used EVs per head than almost anywhere. Both matter.",
    cluster: "New Zealand",
    primaryKeyword: "best cars to import from new zealand",
    keywords: [
      "best cars to import from new zealand",
      "nz used car export",
      "import nissan leaf from new zealand",
      "ex japan cars new zealand",
      "nz new ute export",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1770319942638-a5989632f2ad"),
    heroAlt: "Rows of used cars at a vehicle marshalling yard",
    related: [
      "how-to-import-a-car-from-new-zealand",
      "importing-a-used-ev-from-new-zealand",
      "new-zealand-vs-japan-for-used-imports",
      "cost-to-import-a-car-from-new-zealand",
    ],
    toc: [
      { id: "what-nz-wins", label: "What New Zealand wins on" },
      { id: "hybrids", label: "Pre-complied ex-Japan hybrids" },
      { id: "evs", label: "The used-EV pool" },
      { id: "utes", label: "NZ-new utes and wagons" },
      { id: "vans", label: "Fleet-maintained vans" },
      { id: "avoid", label: "When to buy from Japan instead" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Why are there so many used EVs in New Zealand?",
        a: "Because the country absorbed used Nissan Leafs and plug-in hybrids from Japan in extraordinary numbers over more than a decade, on top of strong local EV uptake. Very few markets have enough used electric stock to choose from at all, which makes New Zealand one of the few realistic sources for buyers in countries now building out electrification.",
      },
      {
        q: "Are NZ-new cars better than ex-Japan cars in New Zealand?",
        a: "Not better, different. An NZ-new vehicle has a single-market history with a local service record and no compliance conversion in its past. An ex-Japan car is usually cheaper, often lower-mileage, and has been through entry certification. Which is right depends on whether you are optimising for price or for a simpler history.",
      },
      {
        q: "Is rust a problem on New Zealand cars?",
        a: "Less than most markets, but not never. Roads are not salted and the climate is temperate, which is genuinely favourable — but coastal exposure is real, and some ex-Japan cars arrived with corrosion already started. That is precisely why our inspection photographs the underbody on every vehicle rather than relying on a claim about the climate.",
      },
    ],
  }),
  post({
    slug: "new-zealand-vs-japan-for-used-imports",
    title: "New Zealand vs Japan for Used Imports",
    h1: "New Zealand vs Japan: Where Should You Buy Your Used Import?",
    seoTitle:
      "New Zealand vs Japan for Used Car Imports: The Honest Comparison",
    description:
      "A direct comparison of New Zealand and Japan as sources for used right-hand-drive cars — price, choice, condition verification, documentation, freight and which one suits your requirement.",
    excerpt:
      "New Zealand's stock came from Japan in the first place. So why would you ever buy the second-hand version? There are three good answers.",
    cluster: "New Zealand",
    primaryKeyword: "new zealand vs japan car import",
    keywords: [
      "new zealand vs japan car import",
      "buy used car from japan or new zealand",
      "ex japan car nz",
      "best country for rhd used cars",
      "japan auction vs nz dealer",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1746014029717-37e5d3d51c48"),
    heroAlt:
      "Cars on a Japanese coastal street — the origin of most New Zealand stock",
    related: [
      "how-to-import-a-car-from-new-zealand",
      "best-cars-to-import-from-new-zealand",
      "best-cars-to-import-from-japan",
      "cost-to-import-a-car-from-new-zealand",
    ],
    toc: [
      { id: "headline", label: "The headline difference" },
      { id: "choice", label: "Choice and volume" },
      { id: "verification", label: "Verifying condition" },
      { id: "price", label: "Price" },
      { id: "documents", label: "Documentation and language" },
      { id: "freight", label: "Freight and destination rules" },
      { id: "verdict", label: "The verdict" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is it cheaper to buy from Japan or New Zealand?",
        a: "Japan, more often than not, because the auction system produces wholesale prices and volume is vastly larger. New Zealand's prices reflect a retail market that has already paid to import and comply the car. What you buy with the difference is verification, English documentation and a local service history.",
      },
      {
        q: "Which has more choice?",
        a: "Japan, by an enormous margin — more than a hundred thousand graded cars pass through auction every week. If you need a specific model in a specific grade, colour and mileage band, Japan will find it faster and probably cheaper. New Zealand's market is a filtered subset of what Japan sold years ago.",
      },
      {
        q: "So when is New Zealand the better choice?",
        a: "Three cases. When you want the extra verification that entry certification represents. When you want used electric or plug-in stock, which New Zealand has and Japanese auctions supply less predictably. And when your destination is in Oceania or the Pacific, where freight from Auckland beats freight from Yokohama on both cost and time.",
      },
    ],
  }),
  post({
    slug: "cost-to-import-a-car-from-new-zealand",
    title: "What It Costs to Import a Car From New Zealand",
    h1: "What It Costs to Import a Car From New Zealand (Every Line)",
    seoTitle:
      "The Real Cost of Importing a Car From New Zealand: Full Breakdown",
    description:
      "Every cost in a New Zealand vehicle export — purchase price, checks and inspection, inland transport, biosecurity cleaning, freight from Auckland or Tauranga, insurance and destination duty.",
    excerpt:
      "New Zealand prices are retail, not wholesale. The question is whether what you get for the difference is worth it.",
    cluster: "New Zealand",
    primaryKeyword: "cost to import a car from new zealand",
    keywords: [
      "cost to import a car from new zealand",
      "nz car export cost",
      "shipping a car from new zealand",
      "auckland car shipping cost",
      "nz import landed cost",
    ],
    readingTimeMins: 9,
    heroImage: UNSPLASH("1554224155-6726b3ff858f"),
    heroAlt: "Calculating the landed cost of a car imported from New Zealand",
    related: [
      "how-to-import-a-car-from-new-zealand",
      "new-zealand-vs-japan-for-used-imports",
      "best-cars-to-import-from-new-zealand",
      "importing-a-used-ev-from-new-zealand",
    ],
    toc: [
      { id: "structure", label: "How the total is built" },
      { id: "in-nz", label: "Costs inside New Zealand" },
      { id: "retail-premium", label: "The retail premium, honestly" },
      { id: "freight", label: "Freight and insurance" },
      { id: "destination", label: "Duty and tax at your end" },
      { id: "example", label: "A worked comparison with Japan" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Why are New Zealand cars more expensive than Japanese ones?",
        a: "Because you are buying at retail rather than wholesale. Somebody already paid to import, comply, register and market the car, and that cost is in the price. Whether it is worth paying depends on how much you value the entry-certification record, the English documentation and the local service history that come with it.",
      },
      {
        q: "How much does it cost to ship a car from New Zealand?",
        a: "Australia and the Pacific are short, frequent and comparatively cheap. South-East Asia is moderate. Africa, Europe and the Americas are long and expensive, and on an inexpensive car the freight can exceed the purchase price — which is why New Zealand works best as a source for nearby markets or for stock you cannot get elsewhere.",
      },
      {
        q: "Is the biosecurity clean a significant cost?",
        a: "It is a small line item, and skipping it is an expensive false economy. Cleaning before departure costs a modest fixed sum; arriving dirty at a destination with a strict biosecurity regime means inspection, mandatory cleaning at port rates, and days of storage while it happens. We clean every vehicle before loading as standard.",
      },
    ],
  }),
  post({
    slug: "importing-a-used-ev-from-new-zealand",
    title: "Importing a Used EV From New Zealand",
    h1: "Importing a Used EV From New Zealand: Battery Health Is the Whole Deal",
    seoTitle:
      "Importing a Used EV From New Zealand: Battery Health, Charging and Range",
    description:
      "What matters when importing a used electric car from New Zealand — measuring battery state of health, understanding real range loss, charging standards, and whether your market can support the car.",
    excerpt:
      "On a used EV, the battery is most of the value. Everything else about the car is secondary — and testable.",
    cluster: "New Zealand",
    primaryKeyword: "importing a used ev from new zealand",
    keywords: [
      "importing a used ev from new zealand",
      "used nissan leaf import",
      "ev battery state of health",
      "used electric car import",
      "chademo vs ccs import",
    ],
    readingTimeMins: 11,
    heroImage: UNSPLASH("1639302610362-4c86747e8680"),
    heroAlt: "Used electric car plugged in to charge",
    related: [
      "best-cars-to-import-from-new-zealand",
      "how-to-import-a-car-from-new-zealand",
      "cost-to-import-a-car-from-new-zealand",
      "new-zealand-vs-japan-for-used-imports",
    ],
    toc: [
      { id: "why-nz", label: "Why New Zealand for a used EV" },
      { id: "soh", label: "State of health: the only number that matters" },
      { id: "degradation", label: "How batteries actually degrade" },
      { id: "charging", label: "Charging standards and compatibility" },
      { id: "market-fit", label: "Can your market support the car?" },
      { id: "checklist", label: "The pre-purchase checklist" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What is battery state of health and why does it matter so much?",
        a: "State of health is the battery's remaining usable capacity as a percentage of its original capacity, and on a used EV it is effectively the value of the car. A vehicle with 90% state of health and one with 65% can look identical, have similar mileage, and be worth very different money, because replacing a battery pack often costs more than the car. We will not export an EV without a measured reading.",
      },
      {
        q: "Will a New Zealand EV charge in my country?",
        a: "It depends on the connector and the network, and it needs checking before purchase rather than after. Older Japanese-origin EVs commonly use the CHAdeMO fast-charging standard while much of the world has moved to CCS, and an incompatible fast-charge standard leaves you on slow AC charging only. Adapters exist but are not universally supported.",
      },
      {
        q: "How much range should I expect to lose?",
        a: "Enough that it should be measured rather than estimated. Degradation depends on age, chemistry, climate, charging habits and how often the pack was fast-charged, so two same-year cars can differ substantially. The practical approach is to ignore the original brochure figure entirely, read the measured state of health, and calculate real-world range from that.",
      },
    ],
  }),
];

// ── SRI LANKA ────────────────────────────────────────────────────────────────

const sriLankaPosts: BlogPost[] = [
  post({
    slug: "importing-a-car-to-sri-lanka",
    title: "Importing a Car to Sri Lanka: The Complete Guide",
    h1: "Importing a Car to Sri Lanka: How the Process Actually Works",
    seoTitle: "Importing a Car to Sri Lanka: The Complete Guide (2026)",
    description:
      "How vehicle import to Sri Lanka works — eligibility and policy, choosing a source country, how customs valuation drives your cost, clearance at Colombo, and registration. Rules change often; verify before committing.",
    excerpt:
      "In Sri Lanka the car is the easy part. The valuation, the duty bands and the permit position are what decide your final cost.",
    cluster: "Sri Lanka",
    primaryKeyword: "importing a car to sri lanka",
    keywords: [
      "importing a car to sri lanka",
      "sri lanka vehicle import",
      "car import sri lanka process",
      "colombo car clearance",
      "sri lanka car import 2026",
    ],
    readingTimeMins: 12,
    heroImage: UNSPLASH("1709620435533-56483034bdd4"),
    heroAlt: "SUV on a South Asian coastal road",
    related: [
      "sri-lanka-vehicle-import-taxes-explained",
      "best-cars-to-import-to-sri-lanka",
      "sri-lanka-car-import-documents-explained",
      "importing-hybrids-and-evs-to-sri-lanka",
    ],
    toc: [
      { id: "policy", label: "Start with the policy, not the car" },
      { id: "source", label: "Choosing a source country" },
      { id: "valuation", label: "How customs valuation drives the cost" },
      { id: "shipping", label: "Shipping and arrival" },
      { id: "clearance", label: "Clearance at Colombo" },
      { id: "registration", label: "Registration and handover" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Can I import a car to Sri Lanka right now?",
        a: "It depends on the current policy position, which is exactly why this is the first question to settle rather than the last. Sri Lanka restricted vehicle imports substantially from 2020 and has moved through phased reopening since, with eligibility varying by vehicle category. Any answer published online — including this one — should be treated as indicative until confirmed with Sri Lanka Customs for your specific vehicle, which we do per shipment.",
      },
      {
        q: "What is the first step in importing a car to Sri Lanka?",
        a: "Establishing what the vehicle will actually cost to clear, before you choose it. Duty and excise are driven by customs valuation, engine capacity, drivetrain and age rather than by what you paid, so two cars with the same purchase price can land at very different totals. Model the landed cost first, then pick the car that fits.",
      },
      {
        q: "Which country should I import from?",
        a: "Japan supplies most of the market's small hybrids and does so with an independent auction grade attached. Thailand is the source for pickups. India is strongest on new compact cars. The UK suits specific premium models. We compare the landed cost from each for your specification rather than defaulting to one origin.",
      },
    ],
  }),
  post({
    slug: "sri-lanka-vehicle-import-taxes-explained",
    title: "Sri Lanka Vehicle Import Taxes Explained",
    h1: "Sri Lanka Vehicle Import Taxes Explained: What Drives the Final Bill",
    seoTitle:
      "Sri Lanka Vehicle Import Taxes Explained (Valuation, Excise, Duty)",
    description:
      "How Sri Lanka assesses vehicle import tax — CIF-based customs valuation, engine-capacity bands, drivetrain treatment, age factors and why the invoice price is not the basis of your bill.",
    excerpt:
      "Sri Lanka does not tax what you paid. It taxes what it decides the car is worth — and that distinction is worth understanding.",
    cluster: "Sri Lanka",
    primaryKeyword: "sri lanka vehicle import tax",
    keywords: [
      "sri lanka vehicle import tax",
      "sri lanka car import duty",
      "cif valuation sri lanka",
      "excise duty vehicle sri lanka",
      "sri lanka car tax calculation",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1450101499163-c8848c66ca85"),
    heroAlt: "Customs and duty paperwork for a vehicle imported to Sri Lanka",
    related: [
      "importing-a-car-to-sri-lanka",
      "best-cars-to-import-to-sri-lanka",
      "importing-hybrids-and-evs-to-sri-lanka",
      "sri-lanka-car-import-documents-explained",
    ],
    toc: [
      { id: "principle", label: "The principle: value, not invoice" },
      { id: "cif", label: "What CIF means for you" },
      { id: "engine", label: "Engine capacity bands" },
      { id: "drivetrain", label: "Drivetrain treatment" },
      { id: "age", label: "Age and depreciation" },
      { id: "modelling", label: "How we model it before you buy" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Is Sri Lankan import duty based on what I paid for the car?",
        a: "No, and this is the single most misunderstood point. Duty and excise are assessed on a customs valuation of the vehicle rather than your invoice, so finding a cheap car abroad does not automatically produce a cheap import. Understanding how the valuation will be reached for your specific vehicle is more valuable than negotiating the purchase price.",
      },
      {
        q: "Why does engine capacity matter so much?",
        a: "Because Sri Lanka's excise structure has long been banded by engine capacity, with the rate stepping up as capacity increases. The practical consequence is that crossing a band boundary by a small margin can cost far more than the extra capacity is worth, which is why specification choice — not just model choice — moves the final figure so much.",
      },
      {
        q: "How current are published Sri Lankan duty rates?",
        a: "Assume they are not. Sri Lanka's vehicle tax structure has been revised repeatedly and substantially, so any published rate card ages quickly, including anything you read here. We confirm the applicable position with Sri Lanka Customs for the specific vehicle before purchase, and the figure in your quote is modelled on that rather than on a table.",
      },
    ],
  }),
  post({
    slug: "best-cars-to-import-to-sri-lanka",
    title: "The Best Cars to Import to Sri Lanka",
    h1: "The Best Cars to Import to Sri Lanka (And Why the Same Models Keep Winning)",
    seoTitle: "The Best Cars to Import to Sri Lanka in 2026",
    description:
      "The models that make the most sense for Sri Lankan roads and Sri Lankan tax bands — small hybrids, compact crossovers, the durable SUVs — plus why local parts availability should shape your shortlist.",
    excerpt:
      "The same handful of cars dominate Sri Lankan roads for a reason. Understand the reason and the shortlist writes itself.",
    cluster: "Sri Lanka",
    primaryKeyword: "best cars to import to sri lanka",
    keywords: [
      "best cars to import to sri lanka",
      "best car to buy in sri lanka",
      "toyota aqua sri lanka",
      "hybrid cars sri lanka import",
      "sri lanka suv import",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1692305610636-f5157dbe6008"),
    heroAlt: "Compact hatchback of the kind widely imported to Sri Lanka",
    related: [
      "importing-a-car-to-sri-lanka",
      "sri-lanka-vehicle-import-taxes-explained",
      "importing-hybrids-and-evs-to-sri-lanka",
      "sri-lanka-car-import-documents-explained",
    ],
    toc: [
      { id: "three-filters", label: "Three filters that decide everything" },
      { id: "small-hybrids", label: "The small hybrids" },
      { id: "crossovers", label: "Compact crossovers" },
      { id: "suvs", label: "The durable SUVs" },
      { id: "parts", label: "Why parts availability matters most" },
      { id: "resale", label: "Resale: the quiet consideration" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Why is the Toyota Aqua so popular in Sri Lanka?",
        a: "Three reasons compound. Its small engine capacity and hybrid drivetrain have sat favourably in the tax structure, its fuel consumption suits both fuel prices and congested urban driving, and the sheer number already on the island means parts and specialist knowledge are everywhere. That last point is what keeps resale strong, and it is the most underrated factor in the whole decision.",
      },
      {
        q: "Should I import an SUV to Sri Lanka?",
        a: "It can be the right call for road conditions and for out-of-town use, but the tax structure makes it a considered decision rather than a casual one — larger engines and heavier vehicles generally sit in less favourable bands. The Prado and similar are proven on Sri Lankan roads with good parts support; model the landed cost before committing, because the gap versus a compact car is wide.",
      },
      {
        q: "Is a brand-new car from India worth considering?",
        a: "For many buyers, yes. New India-built compact cars remove used-vehicle condition risk entirely, arrive with factory paint and interior, and are supported by parts networks that reach across South Asia. The landed cost depends on how the valuation and duty bands treat that specific model, which is exactly the comparison we run before recommending an origin.",
      },
    ],
  }),
  post({
    slug: "sri-lanka-car-import-documents-explained",
    title: "Sri Lanka Car Import Documents Explained",
    h1: "Sri Lanka Car Import Documents Explained: The Clearance File",
    seoTitle:
      "Sri Lanka Car Import Documents Explained (BL, Invoice, Clearance)",
    description:
      "The documents Sri Lankan clearance depends on — Bill of Lading, commercial invoice, export certificate from the source country, inspection certificates, customs declaration and registration paperwork.",
    excerpt:
      "In Sri Lanka a missing document is not an inconvenience, it is daily storage charges. Here is the complete file.",
    cluster: "Sri Lanka",
    primaryKeyword: "sri lanka car import documents",
    keywords: [
      "sri lanka car import documents",
      "colombo port car clearance documents",
      "sri lanka customs vehicle declaration",
      "vehicle registration sri lanka import",
      "bill of lading sri lanka car",
    ],
    readingTimeMins: 9,
    heroImage: UNSPLASH("1542362567-b07e54358753"),
    heroAlt: "Import clearance documentation for a vehicle arriving in Colombo",
    related: [
      "importing-a-car-to-sri-lanka",
      "sri-lanka-vehicle-import-taxes-explained",
      "best-cars-to-import-to-sri-lanka",
      "importing-hybrids-and-evs-to-sri-lanka",
    ],
    toc: [
      { id: "the-set", label: "The document set at a glance" },
      { id: "bl", label: "The Bill of Lading" },
      { id: "invoice", label: "Invoice and valuation support" },
      { id: "origin-docs", label: "Source-country export documents" },
      { id: "inspection", label: "Inspection certificates" },
      { id: "registration", label: "Customs declaration and registration" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "What documents do I need to clear a car at Colombo?",
        a: "The Bill of Lading, the commercial invoice with supporting valuation documentation, the export certificate and deregistration document from the source country with certified translation where needed, any required pre-shipment inspection certificate, and the customs declaration. Registration paperwork follows clearance. Missing any one of them means the vehicle waits, and waiting costs money daily.",
      },
      {
        q: "Do documents need to be translated?",
        a: "Yes, where they are not in English. A Japanese export certificate, for example, requires a certified translation to be usable for clearance and registration, and an uncertified translation is not a substitute. Translations are arranged at origin as part of the document set rather than left as a problem to solve after arrival.",
      },
      {
        q: "What happens if the vehicle arrives before the documents?",
        a: "It sits, and storage charges begin accruing. This is the most common avoidable cost in the whole process. Originals should travel by tracked courier ahead of or separately from the vessel, with the full scanned set issued at the point of shipment so clearance preparation can begin before the ship docks.",
      },
    ],
  }),
  post({
    slug: "importing-hybrids-and-evs-to-sri-lanka",
    title: "Importing Hybrids and EVs to Sri Lanka",
    h1: "Importing Hybrids and EVs to Sri Lanka: What to Weigh Up",
    seoTitle:
      "Importing Hybrids and Electric Cars to Sri Lanka: A Practical Guide",
    description:
      "Why hybrids dominate Sri Lankan roads, how drivetrain affects the duty position, what to check on a used hybrid battery, and the realistic case for and against a used EV on the island.",
    excerpt:
      "Sri Lanka is a hybrid country by tax design. Whether it is ready to be an EV country is a more interesting question.",
    cluster: "Sri Lanka",
    primaryKeyword: "importing hybrids to sri lanka",
    keywords: [
      "importing hybrids to sri lanka",
      "ev import sri lanka",
      "hybrid battery check sri lanka",
      "electric car sri lanka import",
      "sri lanka hybrid duty",
    ],
    readingTimeMins: 10,
    heroImage: UNSPLASH("1671785253964-bdb43087ed99"),
    heroAlt: "Electric car charging at a wall box",
    related: [
      "best-cars-to-import-to-sri-lanka",
      "sri-lanka-vehicle-import-taxes-explained",
      "importing-a-car-to-sri-lanka",
      "importing-a-used-ev-from-new-zealand",
    ],
    toc: [
      { id: "why-hybrids", label: "Why hybrids took over" },
      { id: "duty", label: "How drivetrain affects the duty position" },
      { id: "battery", label: "Checking a used hybrid battery" },
      { id: "ev-case", label: "The case for a used EV" },
      { id: "ev-against", label: "The case against" },
      { id: "verdict", label: "A practical recommendation" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "Why are hybrids so common in Sri Lanka?",
        a: "Tax structure first, fuel prices second. Duty and excise treatment has historically favoured small-capacity hybrid vehicles, which pushed buyers decisively toward the Toyota Aqua, Prius and Axio and the Honda Fit and Vezel. Fuel costs and congested urban driving reinforced it, and the resulting volume created deep local parts availability that keeps the cycle going.",
      },
      {
        q: "How do I check a used hybrid battery before buying?",
        a: "Have it tested, not described. A hybrid battery diagnostic reads individual module voltages and can show imbalance long before a warning light appears, which is the difference between a car that needs nothing and one that needs a pack. Any hybrid we source is tested at origin and the result is included in the report you see before payment is released.",
      },
      {
        q: "Is a used electric car a good idea in Sri Lanka?",
        a: "It can be, with two conditions. The battery's measured state of health has to be good, because a degraded pack often costs more to replace than the car is worth. And your charging situation has to be realistic — reliable home charging changes the calculation completely, while depending on public fast charging is a bigger assumption. Weigh those honestly before the tax position.",
      },
    ],
  }),
  // Dealer-facing operations guide. Deliberately not run through post(), which
  // pins every country post to the cluster's original publish date — this one
  // was written against the August 2026 gazette position and is dated honestly.
  {
    slug: "sri-lanka-vehicle-import-rules-for-dealers",
    title: "Sri Lanka Vehicle Import Rules for Dealers",
    h1: "Sri Lanka Vehicle Import Rules for Dealers: The Clocks That Cost You Money",
    seoTitle: "Sri Lanka Vehicle Import Rules for Dealers (2026 Guide)",
    description:
      "The Sri Lankan import rules that decide dealer margin — the 90-day registration clock at 3% of CIF per month, how vehicle age is measured, importer registration limits and the re-export penalty.",
    excerpt:
      "The margin is not made at the auction. It is made by not owning an unregistered car in month five.",
    cluster: "Sri Lanka",
    primaryKeyword: "sri lanka vehicle import rules for dealers",
    keywords: [
      "sri lanka vehicle import rules for dealers",
      "sri lanka 90 day vehicle registration rule",
      "sri lanka vehicle import age limit",
      "sri lanka motor vehicle importer registration",
      "importing cars to sri lanka for resale",
      "sri lanka vehicle re-export penalty",
    ],
    author: AUTHOR,
    publishDate: "2026-08-18",
    updatedDate: "2026-08-18",
    readingTimeMins: 11,
    heroImage: UNSPLASH("1554224155-6726b3ff858f"),
    heroAlt:
      "Working through the landed cost and holding cost of vehicles imported into Sri Lanka",
    related: [
      "importing-a-car-to-sri-lanka",
      "sri-lanka-vehicle-import-taxes-explained",
      "sri-lanka-car-import-documents-explained",
      "best-cars-to-import-to-sri-lanka",
    ],
    toc: [
      { id: "five-gates", label: "The five gates" },
      { id: "registration-clock", label: "The 90-day registration clock" },
      { id: "importer-status", label: "Importer status and volume" },
      { id: "age-rule", label: "How age is measured" },
      { id: "lc-discipline", label: "Letter of credit discipline" },
      { id: "re-export", label: "The re-export penalty" },
      { id: "duty-timing", label: "Buy on the gate, not the rate" },
      { id: "checklist", label: "The pre-purchase checklist" },
      { id: "faqs", label: "FAQs" },
    ],
    faqs: [
      {
        q: "How long do I have to register an imported vehicle in Sri Lanka?",
        a: "Ninety days from the date of the Customs Declaration. After that the importer owes a monthly late fee of 3% of the CIF value, computed non-compounded and linearly, payable to the Commissioner General of the Department of Motor Traffic at the point of registration. The fee is capped at 45% of CIF, reached after fifteen months, and the regulations state that no waiver is granted under any circumstances.",
      },
      {
        q: "How is a vehicle's age measured for Sri Lankan import eligibility?",
        a: "From the date of manufacture to the date of the bill of lading or airway bill — not to arrival, clearance or registration. Where the manufacturer's certificate or export inspection certificate gives a month, the date of manufacture is deemed to be the fifteenth of that month. Where only a year appears, it is deemed to be 15 January of that year, which can cost most of a year of eligibility.",
      },
      {
        q: "How many vehicles can I import into Sri Lanka?",
        a: "It depends on your status. An importer registered with the Department of Motor Traffic as a motor vehicle importer may import the number of vehicles required, subject to the rest of the regulations. Any other importer is limited to one vehicle within any twelve-month period, measured from the date of the Bill of Entry. Trading through a company name does not by itself lift the limit.",
      },
      {
        q: "What happens if I import a vehicle that turns out to be ineligible?",
        a: "It must be re-exported by the importer within 90 days of the date of the Bill of Entry, with all associated costs borne by the importer. There is no fine-and-keep alternative written into the provision, which makes it the largest single downside risk in the trade — and an avoidable one, since age, HS classification and propulsion type are all knowable before you bid.",
      },
    ],
  },
];

export const COUNTRY_BLOG_POSTS: BlogPost[] = [
  ...japanPosts,
  ...ukPosts,
  ...uaePosts,
  ...indiaPosts,
  ...thailandPosts,
  ...australiaPosts,
  ...newZealandPosts,
  ...sriLankaPosts,
];
