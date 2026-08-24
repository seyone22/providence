// ─────────────────────────────────────────────────────────────────────────────
// Providence Auto — global office & source-country registry.
//
// Single source of truth for the eight countries where we operate a physical
// office. Drives:
//   • /source-cars-from            (network hub page)
//   • /source-cars-from/[country]  (per-country landing page)
//   • the footer office list, the Organization JSON-LD, and the global FAQ
//
// ── FILL IN ──────────────────────────────────────────────────────────────────
// Every `office` block below is deliberately left blank apart from London.
// Add the real city, street address, phone, email and opening hours as each
// office is confirmed. The landing page degrades gracefully while they are
// empty: it shows the local team's remit and routes enquiries to head office
// instead of printing a half-finished address.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Anchor,
  BadgeCheck,
  Boxes,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Globe2,
  Handshake,
  Landmark,
  Mountain,
  Search,
  ShieldCheck,
  Ship,
  Snowflake,
  Sparkles,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

/** What the country is to us: a place we buy from, a place we operate from, or both. */
export type CountryRole = "source" | "hub" | "both";

export type CountryOffice = {
  /** City the office sits in. Empty until confirmed — the page falls back to the country name. */
  city: string;
  /** Street address, one line per element. Empty array renders the "on request" fallback. */
  addressLines: string[];
  /** E.164-ish display number. Empty falls back to head office. */
  phone: string;
  /** Local mailbox. Empty falls back to head office. */
  email: string;
  /** Local opening hours, e.g. "Mon–Fri, 09:00–18:00 JST". */
  hours: string;
  /** Always populated — what the people in this office actually do. */
  remit: string[];
};

export type CountryPageConfig = {
  slug: string;
  country: string;
  /** Short label for nav, cards and breadcrumbs. */
  shortName: string;
  region: string;
  role: CountryRole;
  /** One line for the hub-page card. */
  cardBlurb: string;
  meta: { title: string; description: string; keywords: string[] };
  hero: {
    tagline: string;
    /** \n is rendered as a line break. */
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  /** Scannable proof numbers under the hero. */
  stats: { value: string; label: string }[];
  intro: { highlight: string; text: string };
  /** What this country is genuinely known for building or supplying. */
  specialty: {
    eyebrow: string;
    title: string;
    blurb: string;
    items: {
      icon: any /* Lucide icon reference */;
      title: string;
      desc: string;
    }[];
  };
  /** Signature vehicles. `make` must exist in requestForm's CAR_MAKES for the prefill to land. */
  signature: { make: string; model: string; note: string; image: string }[];
  /** Why buy from here rather than anywhere else. */
  advantages: {
    icon: any /* Lucide icon reference */;
    title: string;
    desc: string;
  }[];
  /** Find → inspect → ship, told with the local team in the frame. */
  process: { title: string; desc: string }[];
  office: CountryOffice;
  /** Where cars leave from and who we ship to. */
  logistics: { ports: string[]; shipsTo: string; transit: string };
  faqs: { q: string; a: string }[];
  /** Blog slugs in this country's cluster (src/config/blog-countries.ts). */
  blogSlugs: string[];
  /** Optional existing campaign page to cross-link. */
  relatedCampaign?: { href: string; label: string };
};

const LOCAL = (name: string) => `/import-cars/${name}.jpg`;
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=2400&auto=format&fit=crop`;

// ── JAPAN ────────────────────────────────────────────────────────────────────
const japan: CountryPageConfig = {
  slug: "japan",
  country: "Japan",
  shortName: "Japan",
  region: "East Asia",
  role: "source",
  cardBlurb:
    "The world's deepest graded auction network — 100,000+ independently inspected cars a week.",
  meta: {
    title:
      "Source Cars From Japan — Auction Floor to Your Door | Providence Auto",
    description:
      "Providence Auto's Japan team buys direct from the graded auction network — Land Cruisers, Alphards, hybrids and JDM performance cars — inspected, deregistered and shipped by our own team. Full landed cost quoted before we bid.",
    keywords: [
      "source cars from japan",
      "japanese car auction buying agent",
      "import cars from japan",
      "japan car exporter",
      "jdm import specialist",
    ],
  },
  hero: {
    tagline: "Providence Auto · Japan",
    title: "Japan.\nThe auction floor, in person.",
    subtitle:
      "Our Japan team stands on the auction floor every week, reads the original sheet in Japanese, and inspects the car before it is ever loaded. You get the grade, the photographs and one landed price before a single yen moves.",
    backgroundImage: "/import-cars/hero-land-cruiser.jpg",
  },
  stats: [
    { value: "100k+", label: "Cars graded at auction each week" },
    { value: "5", label: "Export ports we load from" },
    { value: "3.5+", label: "Minimum auction grade we buy" },
  ],
  intro: {
    highlight: "We do not buy cars from photographs.",
    text: "Japan's auction network is the most transparent used-car market on earth, but a grade sheet is only as good as the person reading it. Our Japan team bids in the hall, inspects the car in the compound, and signs off the export paperwork in person. We do not buy cars from photographs.",
  },
  specialty: {
    eyebrow: "What Japan builds best",
    title: "The most over-maintained used cars in the world.",
    blurb:
      "Japan's shaken roadworthiness regime makes keeping an older car expensive, so owners sell early and sell often. The result is a market flooded with low-mileage, dealer-serviced vehicles that simply do not exist anywhere else at the price.",
    items: [
      {
        icon: Mountain,
        title: "Land Cruisers & 4x4s",
        desc: "The 70, 200 and 300 Series, Prado and Hilux Surf — built for export durability and kept to service schedules that make Japanese examples the global benchmark for condition.",
      },
      {
        icon: Sparkles,
        title: "Luxury MPVs nobody else builds",
        desc: "The Alphard, Vellfire and Granace are Japan-market products with no European equivalent — captain's chairs, hybrid drivetrains and a chauffeur-grade cabin at a fraction of the German alternative.",
      },
      {
        icon: Gauge,
        title: "Hybrids at genuine scale",
        desc: "Aqua, Prius, Note e-Power, Fit and Vezel hybrids are ordinary cars in Japan, which means ordinary prices — and the lowest emissions banding in most import tax regimes.",
      },
      {
        icon: Wrench,
        title: "JDM performance & classics",
        desc: "GT-R, Supra, RX-7, Lancer Evolution, Impreza STI and the kei sports cars. Japan has no age limit on what it exports, so the pool runs from last year's model to genuine 30-year classics.",
      },
    ],
  },
  signature: [
    {
      make: "Toyota",
      model: "Land Cruiser",
      note: "70 / 200 / 300 Series",
      image: LOCAL("lc300"),
    },
    {
      make: "Toyota",
      model: "Alphard",
      note: "Luxury hybrid MPV",
      image: LOCAL("alphard"),
    },
    {
      make: "Toyota",
      model: "Harrier",
      note: "Premium hybrid SUV",
      image: LOCAL("harrier"),
    },
    {
      make: "Toyota",
      model: "Aqua",
      note: "The cheapest hybrid to land",
      image: LOCAL("aqua"),
    },
    {
      make: "Nissan",
      model: "GT-R",
      note: "JDM performance",
      image: LOCAL("gtr"),
    },
    {
      make: "Honda",
      model: "Vezel",
      note: "Compact hybrid crossover",
      image: LOCAL("vezel"),
    },
    {
      make: "Nissan",
      model: "Note",
      note: "e-Power series hybrid",
      image: LOCAL("note"),
    },
    {
      make: "Toyota",
      model: "Noah",
      note: "Eight-seat family MPV",
      image: LOCAL("noah"),
    },
  ],
  advantages: [
    {
      icon: ClipboardCheck,
      title: "An independent grade, translated",
      desc: "Every auction car carries a sheet written by an inspector who does not work for the seller: an overall grade, an interior grade and a panel-by-panel damage map. We send you the original plus a full English translation before we bid.",
    },
    {
      icon: Gauge,
      title: "Mileage you can actually verify",
      desc: "Odometer readings are recorded at every shaken inspection, again at auction and again on the export certificate. Three independent records have to agree before we buy. If they do not, we walk.",
    },
    {
      icon: Landmark,
      title: "Wholesale prices, not retail",
      desc: "We buy on the same floor the Japanese trade buys on. You pay the hammer price plus our transparent fee — not a retail markup dressed up as an export price.",
    },
    {
      icon: Users,
      title: "Our own people, not an agent",
      desc: "Bidding, inspection, deregistration and loading are handled by Providence staff in Japan. There is no third-party exporter between you and the car, which is why nothing gets lost in translation.",
    },
  ],
  process: [
    {
      title: "We find it on the floor",
      desc: "Tell us the model, grade, colour and budget. Our Japan team searches the weekly auction catalogues across the major houses, shortlists the cars that match, and sends you the sheets with translations before anything is bid on.",
    },
    {
      title: "We inspect it in person",
      desc: "Once won, the car goes to our compound for a multi-point physical inspection — engine, transmission, underbody, electronics, panel gaps and interior — photographed in daylight. If it does not match its grade, it does not ship, and you are not charged.",
    },
    {
      title: "We clear it for export",
      desc: "The team handles deregistration, the export certificate with certified mileage, any pre-shipment inspection your country requires (JEVIC, QISJ, KEBS and similar), and the biosecurity steam clean for Australasian and African destinations.",
    },
    {
      title: "We load and track it",
      desc: "RoRo or container from Yokohama, Nagoya, Osaka, Kobe or Hakata, under marine insurance from the compound gate to your port, with vessel tracking and milestone updates the whole way.",
    },
  ],
  office: {
    // ── FILL IN: Japan office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "Auction bidding across the major Japanese auction houses",
      "Physical pre-export inspection and daylight photography",
      "Deregistration, export certificates and mileage certification",
      "Pre-shipment inspections, biosecurity cleaning and port loading",
    ],
  },
  logistics: {
    ports: ["Yokohama", "Nagoya", "Osaka", "Kobe", "Hakata"],
    shipsTo:
      "Right-hand-drive markets worldwide, plus factory left-hand-drive stock for Europe, the Middle East and the Americas",
    transit:
      "Roughly 3–5 weeks to East Africa, 4–6 to South Asia, 6–8 to Europe and Australasia",
  },
  faqs: [
    {
      q: "Why buy a car from Japan rather than locally?",
      a: "Because of how Japan treats old cars. The shaken roadworthiness test gets progressively more expensive as a car ages, so owners sell young and sell often, and more than 100,000 vehicles pass through independently graded auctions every week. That combination — low mileage, documented servicing and wholesale auction pricing — routinely lands a Japanese import below the local forecourt price for the same car, even after freight and taxes.",
    },
    {
      q: "What does having our own team in Japan actually change?",
      a: "It removes the layer where most import problems start. Our own staff read the auction sheet in Japanese, stand in the hall when the car is bid on, physically inspect it afterwards, and file the export paperwork themselves. A broker working remotely from your country is relying on the same photographs you are.",
    },
    {
      q: "How does the Japanese auction grading system work?",
      a: "An independent inspector grades every car on a standard scale — 5 is close to new, 4 is excellent, 3.5 is very good with minor cosmetic marks — and accident-repaired cars are flagged separately as Grade R. The sheet also carries an interior grade and a diagram marking every scratch, dent and repair. We buy 3.5 and above as standard, and we send you the original sheet with a translation before we bid.",
    },
    {
      q: "Can Japan supply left-hand-drive cars?",
      a: "Yes. A significant number of premium models were sold new in Japan in factory left-hand drive, and they come through the same auction network. These are native LHD cars, not conversions, which matters for registration and for resale value. Our left-hand-drive campaign page covers the marques we source most often.",
    },
    {
      q: "Is there an age limit on cars exported from Japan?",
      a: "Japan itself imposes none — the limits come from your destination. Kenya accepts vehicles under eight years old, Uganda under fifteen, Sri Lanka and several other markets set their own bands, and the UK, Ireland and New Zealand have no age cap at all. We check your country's rule before we bid, not after the car is bought.",
    },
  ],
  blogSlugs: [
    "how-to-buy-a-car-at-japanese-auction",
    "japanese-auction-grades-explained",
    "best-cars-to-import-from-japan",
    "cost-to-import-a-car-from-japan",
    "japan-car-export-documents-explained",
  ],
  relatedCampaign: {
    href: "/import-japanese-cars",
    label: "Import Japanese cars",
  },
};

// ── UNITED KINGDOM ───────────────────────────────────────────────────────────
const unitedKingdom: CountryPageConfig = {
  slug: "united-kingdom",
  country: "the United Kingdom",
  shortName: "United Kingdom",
  region: "Western Europe",
  role: "both",
  cardBlurb:
    "Our founding office, and the source for British-built luxury, 4x4s and the deepest service-history records anywhere.",
  meta: {
    title:
      "Source Cars From the UK — British-Built & Fully Documented | Providence Auto",
    description:
      "Providence Auto's UK office sources British-built cars — Range Rover, Defender, Bentley, Aston Martin, McLaren, Mini — plus the widest documented used stock in Europe. HPI-checked, MOT history verified, shipped worldwide.",
    keywords: [
      "source cars from the uk",
      "uk car exporter",
      "import cars from the uk",
      "british built cars export",
      "uk car buying agent",
    ],
  },
  hero: {
    tagline: "Providence Auto · United Kingdom",
    title: "The United Kingdom.\nWhere the paper trail is complete.",
    subtitle:
      "Britain builds the world's most desirable 4x4s and luxury saloons, and records the life of every car on the road in a public database. Our UK office buys against that record — not against a description.",
    backgroundImage: UNSPLASH("1637859460045-ac3ae9ced99d"),
  },
  stats: [
    { value: "15+", label: "Years trading from our London base" },
    { value: "100%", label: "Cars provenance-checked before purchase" },
    { value: "4", label: "Export ports we load from" },
  ],
  intro: {
    highlight:
      "Nothing about a British car's history has to be taken on trust.",
    text: "Every MOT test, every advisory, every recorded mileage reading and every finance interest on a UK car is written down and checkable. We check all of it before we buy, on every single car. Nothing about a British car's history has to be taken on trust.",
  },
  specialty: {
    eyebrow: "What Britain builds best",
    title:
      "Luxury, off-road capability, and things built in very small numbers.",
    blurb:
      "British manufacturing did not disappear — it moved upmarket. The country still builds the definitive luxury 4x4, three of the world's great limousine marques, and a supercar industry clustered within an hour of a single motorway.",
    items: [
      {
        icon: Mountain,
        title: "The luxury 4x4, invented here",
        desc: "Range Rover, Range Rover Sport, Velar, Discovery and the reborn Defender are built in Solihull and Halewood. No other country makes a credible substitute, which is why they hold value in every market we ship to.",
      },
      {
        icon: Sparkles,
        title: "Three great luxury marques",
        desc: "Bentley in Crewe, Rolls-Royce at Goodwood and Aston Martin at Gaydon and St Athan. Hand-built, individually specified, and easiest to buy where they are made — with the build records to prove the specification.",
      },
      {
        icon: Gauge,
        title: "A supercar cluster",
        desc: "McLaren in Woking and Lotus at Hethel, alongside the motorsport valley that supplies most of the grid. Low-volume cars with documented histories and, from the UK, a straightforward export route.",
      },
      {
        icon: Boxes,
        title: "Volume production too",
        desc: "Nissan in Sunderland and Toyota at Burnaston build some of Europe's highest-volume models, and Mini in Oxford builds the only small car with genuine global brand pull. UK-built origin also matters for tariffs in several markets.",
      },
    ],
  },
  signature: [
    {
      make: "Land Rover",
      model: "Range Rover",
      note: "Solihull-built",
      image: UNSPLASH("1494976388531-d1058494cdd8"),
    },
    {
      make: "Land Rover",
      model: "Defender",
      note: "The modern icon",
      image: LOCAL("gwagon"),
    },
    {
      make: "Bentley",
      model: "Continental GT",
      note: "Hand-built in Crewe",
      image: UNSPLASH("1614162692292-7ac56d7f7f1e"),
    },
    {
      make: "Aston Martin",
      model: "DB11",
      note: "Gaydon-built",
      image: UNSPLASH("1503376780353-7e6692767b70"),
    },
    {
      make: "Mini",
      model: "Cooper",
      note: "Oxford-built",
      image: LOCAL("swift"),
    },
    {
      make: "McLaren",
      model: "720S",
      note: "Woking-built",
      image: UNSPLASH("1552519507-da3b142c6e3d"),
    },
    {
      make: "BMW",
      model: "5 Series",
      note: "Deep UK used supply",
      image: LOCAL("bmw"),
    },
    {
      make: "Mercedes-Benz",
      model: "E-Class",
      note: "Full main-dealer history",
      image: LOCAL("mercedes"),
    },
  ],
  advantages: [
    {
      icon: FileCheck2,
      title: "A public, checkable history",
      desc: "The UK publishes every MOT test result and mileage reading for every car. Add a provenance check for outstanding finance, insurance write-offs and theft markers, and you can reconstruct a car's entire life before you bid.",
    },
    {
      icon: Landmark,
      title: "Origin that can cut your duty",
      desc: "A car actually manufactured in the UK can qualify for preferential tariff treatment in several markets, including the EU, where an EU-built car bought in Britain would not. We supply the origin documentation, because without it the preference is worthless.",
    },
    {
      icon: Ship,
      title: "The shortest sea route in our network",
      desc: "Ireland and mainland Europe are days away, not weeks. For buyers on that side of the world the UK is simply the fastest source country we operate in, and the cheapest to freight from.",
    },
    {
      icon: BadgeCheck,
      title: "Specification you can actually order",
      desc: "British stock runs deep enough that you can hold out for the exact trim, colour and option pack rather than settling for what happens to be available. On low-volume cars we can also work directly with the marque's own approved network.",
    },
  ],
  process: [
    {
      title: "We find it across the whole market",
      desc: "Trade auctions, main-dealer stock, specialist retailers and private vendors — our UK buyers work all four. You get a shortlist with full provenance already run, not a list of adverts.",
    },
    {
      title: "We verify before we commit",
      desc: "Full MOT and mileage history, provenance and finance check, service-book audit and a physical inspection by our own buyer. Anything with a mileage discrepancy, an undisclosed write-off marker or an outstanding finance interest is rejected outright.",
    },
    {
      title: "We handle the export side",
      desc: "Notification of permanent export, VAT treatment for qualifying export sales, customs declaration and origin documentation where the destination gives preference to UK-built cars. You do none of the paperwork.",
    },
    {
      title: "We ship and clear it",
      desc: "Container or RoRo from Southampton, Tilbury, Liverpool or Grimsby, roll-on ferry for Ireland, marine insurance throughout, and clearance and registration support at the other end.",
    },
  ],
  office: {
    city: "London",
    addressLines: [
      "468 Church Lane, Kingsbury",
      "London NW9 8UA",
      "United Kingdom",
    ],
    phone: "+44 208 004 3000",
    email: "info@providenceauto.uk.com",
    // ── FILL IN: confirm published opening hours ──
    hours: "",
    remit: [
      "Group head office, finance and customer support",
      "UK sourcing across trade auctions, dealers and private vendors",
      "Provenance, MOT history and finance checks on every purchase",
      "Export declarations, origin documentation and European freight",
    ],
  },
  logistics: {
    ports: ["Southampton", "Tilbury", "Liverpool", "Grimsby"],
    shipsTo:
      "Ireland and mainland Europe by short-sea ferry; Africa, the Middle East, South Asia and the Caribbean by container or RoRo",
    transit: "Days to Ireland and Europe, roughly 3–6 weeks further afield",
  },
  faqs: [
    {
      q: "What makes the UK a good country to buy a used car from?",
      a: "Record-keeping. Every MOT test, advisory note and mileage reading is published on a public government database, and a commercial provenance check adds outstanding finance, write-off history and theft markers. Combined with a large, competitive market and a service-history culture, it means a UK car's past is verifiable rather than described.",
    },
    {
      q: "Does a car bought in Britain always count as British for customs?",
      a: "No, and this catches out a lot of buyers. Customs preference depends on where the car was manufactured, not where it was purchased. A German-built saloon bought in London is an EU-origin car and can attract full duty on import to some markets, while a Solihull-built Range Rover may enter at a preferential rate. We confirm the build origin and supply the paperwork before you commit.",
    },
    {
      q: "Can you buy a specific specification rather than whatever is in stock?",
      a: "Yes — that is the main reason to use the UK. The market is deep enough that holding out for a specific trim, colour, drivetrain or option pack is realistic rather than aspirational. Tell us the specification you want and we will wait for the right car rather than sell you the near-miss.",
    },
    {
      q: "Do you handle VAT on export sales?",
      a: "We handle the treatment and the documentation. Whether a sale can be zero-rated depends on the seller, the buyer and the export evidence, and we structure the purchase correctly for your situation. The VAT position is stated explicitly in your landed-cost quote so there is no ambiguity about what you are paying.",
    },
    {
      q: "How quickly can a UK car reach Ireland or Europe?",
      a: "Far faster than anywhere else we operate. Roll-on ferry crossings to Ireland run daily and short-sea routes to mainland Europe take days, so the constraint is usually the paperwork rather than the sailing. Longer-haul destinations run on standard container or RoRo schedules.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-the-uk",
    "best-cars-to-import-from-the-uk",
    "uk-car-history-checks-explained",
    "cost-to-import-a-car-from-the-uk",
    "uk-car-export-documents-explained",
  ],
};

// ── AUSTRALIA ────────────────────────────────────────────────────────────────
const australia: CountryPageConfig = {
  slug: "australia",
  country: "Australia",
  shortName: "Australia",
  region: "Oceania",
  role: "source",
  cardBlurb:
    "Utes and 4x4s built for the harshest conditions on earth — plus dry-climate bodies and a homegrown performance heritage.",
  meta: {
    title:
      "Source Cars From Australia — Utes, 4x4s & Dry-Climate Stock | Providence Auto",
    description:
      "Providence Auto's Australia team sources HiLux, Ranger, LandCruiser and Prado 4x4s, ADR-compliant right-hand-drive stock and Australian performance classics. Inspected, deregistered and shipped by our own team.",
    keywords: [
      "source cars from australia",
      "import a car from australia",
      "australia car exporter",
      "import a ute from australia",
      "australian 4x4 export",
    ],
  },
  hero: {
    tagline: "Providence Auto · Australia",
    title: "Australia.\nBuilt for the worst roads on earth.",
    subtitle:
      "Nothing tests a vehicle like the Australian outback, and nothing is specified for it like an Australian-delivery 4x4. Our team buys the utes, wagons and touring rigs that were built to survive it — and checks every one against a national provenance register first.",
    backgroundImage: UNSPLASH("1610064094665-57e727e29f8b"),
  },
  stats: [
    { value: "RHD", label: "Native right-hand drive, English documents" },
    { value: "PPSR", label: "National provenance check on every car" },
    { value: "5", label: "Export ports we load from" },
  ],
  intro: {
    highlight:
      "Australia stopped building cars. It never stopped specifying them.",
    text: "Local manufacturing ended in 2017, so nothing here is made in Australia any more — and we would rather say that plainly than sell you a story. What Australia still has is the world's toughest 4x4 specification culture, dry inland climates that keep bodies clean, and a national register that makes provenance checkable. Australia stopped building cars. It never stopped specifying them.",
  },
  specialty: {
    eyebrow: "What Australia supplies best",
    title: "Vehicles set up for real work, by people who actually use them.",
    blurb:
      "The Australian market buys 4x4 dual cabs and touring wagons in volumes that distort the entire model range, and it accessorises them harder than anywhere else. That produces a used pool of genuinely well-specified, heavy-duty vehicles you cannot assemble anywhere else.",
    items: [
      {
        icon: Truck,
        title: "The dual-cab ute market",
        desc: "HiLux, Ranger, D-Max, Triton, Navara and BT-50 sell in numbers here that no European market approaches, which means depth of stock, competitive pricing and every trim level from base workhorse to fully loaded flagship.",
      },
      {
        icon: Mountain,
        title: "Serious touring 4x4s",
        desc: "LandCruiser 70, 200 and 300 Series, Prado, Patrol and Everest, frequently fitted from new with bull bars, snorkels, long-range tanks, dual batteries, upgraded suspension and recovery gear — kit that costs a fortune to add later.",
      },
      {
        icon: Sparkles,
        title: "A performance heritage that only exists here",
        desc: "Holden Commodore and HSV, Ford Falcon and FPV. Large rear-drive V8 saloons that were never sold anywhere else in this form, now genuinely collectable, and only ever available from Australia.",
      },
      {
        icon: Snowflake,
        title: "Dry-climate bodies",
        desc: "Inland Queensland, South Australia and Western Australia are about as unkind to rust as any environment on earth is kind to it. For buyers in salt-belt countries, that underbody condition is worth real money.",
      },
    ],
  },
  signature: [
    {
      make: "Toyota",
      model: "LandCruiser 79",
      note: "Dual-cab workhorse",
      image: LOCAL("lc70"),
    },
    {
      make: "Toyota",
      model: "HiLux",
      note: "The default Australian ute",
      image: LOCAL("prado"),
    },
    {
      make: "Ford",
      model: "Ranger",
      note: "Wildtrak and Raptor",
      image: LOCAL("lc200"),
    },
    {
      make: "Toyota",
      model: "Prado",
      note: "Touring-spec wagon",
      image: LOCAL("prado"),
    },
    {
      make: "Nissan",
      model: "Patrol",
      note: "Y62 and Y61 options",
      image: LOCAL("lc300"),
    },
    {
      make: "Mitsubishi",
      model: "Triton",
      note: "Value dual cab",
      image: LOCAL("harrier"),
    },
    {
      make: "Ford",
      model: "Falcon",
      note: "XR6 Turbo and FPV",
      image: UNSPLASH("1552519507-da3b142c6e3d"),
    },
    {
      make: "Isuzu",
      model: "D-Max",
      note: "Fleet-maintained stock",
      image: LOCAL("noah"),
    },
  ],
  advantages: [
    {
      icon: ShieldCheck,
      title: "A national security register",
      desc: "Australia's Personal Property Securities Register shows outstanding finance, written-off status and stolen markers against a vehicle's VIN. We run it on every car and reject anything flagged, before money moves.",
    },
    {
      icon: Wrench,
      title: "Accessories worth more than the discount",
      desc: "A well-set-up Australian tourer often carries tens of thousands of dollars of fitted equipment that adds far less than that to its resale price. Buying the already-modified car is usually cheaper than buying a base vehicle and building it.",
    },
    {
      icon: Globe2,
      title: "Right-hand drive, English paperwork",
      desc: "Australian-delivered vehicles are natively right-hand drive and built to Australian Design Rules, and every document in the file is already in English. For RHD destinations that removes both a conversion problem and a translation problem.",
    },
    {
      icon: Anchor,
      title: "The natural source for the Pacific and southern Africa",
      desc: "For New Zealand, the Pacific islands, Papua New Guinea and much of southern and eastern Africa, Australia is closer, faster and cheaper to ship from than Japan or Europe.",
    },
  ],
  process: [
    {
      title: "We find it across dealers and trade auctions",
      desc: "Our Australia team works the major trade auction houses, dealer networks, fleet disposals and mining-company sell-downs — the last of which is where the best-maintained heavy-duty 4x4s usually surface.",
    },
    {
      title: "We check the register, then the car",
      desc: "A PPSR check runs first, so a car with finance owing or a written-off marker never reaches you. Cleared vehicles then get a physical multi-point inspection with underbody photographs, which is the whole point of buying from a dry climate.",
    },
    {
      title: "We clear it for export",
      desc: "Deregistration and plate surrender in the state of registration, proof of ownership, customs export declaration, and the biosecurity steam clean that Australasian, Pacific and African destinations require on arrival.",
    },
    {
      title: "We load and track it",
      desc: "RoRo or container from Sydney, Melbourne, Brisbane, Fremantle or Adelaide, marine insurance door to port, and milestone updates from compound to quayside.",
    },
  ],
  office: {
    // ── FILL IN: Australia office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "Sourcing across trade auctions, dealer networks and fleet disposals",
      "PPSR provenance checks and physical pre-export inspection",
      "State deregistration, export declarations and biosecurity cleaning",
      "Freight coordination for Pacific, Asian and African destinations",
    ],
  },
  logistics: {
    ports: ["Sydney", "Melbourne", "Brisbane", "Fremantle", "Adelaide"],
    shipsTo:
      "New Zealand, the Pacific, Papua New Guinea, southern and eastern Africa, South and South-East Asia",
    transit: "Roughly 2–4 weeks across Oceania, 4–7 weeks to Africa and Europe",
  },
  faqs: [
    {
      q: "Are cars still manufactured in Australia?",
      a: "No. Ford closed its Australian plant in 2016, and Holden and Toyota followed in 2017, ending mass vehicle manufacturing in the country. Everything sold new in Australia today is imported. We say that plainly because the reason to source from Australia is not manufacturing — it is the specification, condition and provenance record of the vehicles the market has accumulated.",
    },
    {
      q: "What is Australia actually the best country to buy from?",
      a: "Heavy-duty 4x4s and dual-cab utes, by a wide margin. Australia buys and equips these vehicles at a scale nowhere else matches, so the used pool is deep, competitively priced and frequently fitted with serious touring equipment from new. It is also the only source in the world for Holden and Ford Australia performance cars.",
    },
    {
      q: "How do you check an Australian car's history?",
      a: "Through the Personal Property Securities Register, the national database that records outstanding finance, written-off vehicle status and stolen markers against a VIN. We run it on every vehicle before purchase and reject anything that comes back flagged. State registration and service records are checked alongside it.",
    },
    {
      q: "Is rust really less of a problem on Australian cars?",
      a: "In the dry inland regions, generally yes — low humidity and no road salt are a genuinely favourable combination, and it shows on the underbody. It is not universal, though: coastal vehicles see salt air, and northern vehicles see monsoon humidity. That is exactly why our inspection includes underbody photographs rather than a blanket claim about the climate.",
    },
    {
      q: "Can you export a heavily modified 4x4?",
      a: "Usually yes, but the destination decides. Some countries accept aftermarket bull bars, lift kits and long-range tanks without comment, and others require specific approval or want equipment removed before registration. We check your country's position before purchase and tell you what will and will not be accepted.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-australia",
    "best-cars-to-import-from-australia",
    "importing-a-ute-or-4x4-from-australia",
    "cost-to-import-a-car-from-australia",
    "australia-car-export-documents-explained",
  ],
};

// ── NEW ZEALAND ──────────────────────────────────────────────────────────────
const newZealand: CountryPageConfig = {
  slug: "new-zealand",
  country: "New Zealand",
  shortName: "New Zealand",
  region: "Oceania",
  role: "both",
  cardBlurb:
    "Ex-Japan stock already complied to one of the world's strictest entry standards — and one of our busiest destination markets.",
  meta: {
    title:
      "Source Cars From New Zealand — Complied, Documented, Ready | Providence Auto",
    description:
      "Providence Auto's New Zealand team sources ex-Japan and NZ-new right-hand-drive stock that has already passed entry certification, plus one of the world's densest supplies of used EVs and hybrids. Inspected and shipped by our own team.",
    keywords: [
      "source cars from new zealand",
      "import a car from new zealand",
      "new zealand car exporter",
      "nz used car export",
      "used ev import new zealand",
    ],
  },
  hero: {
    tagline: "Providence Auto · New Zealand",
    title: "New Zealand.\nJapan's best cars, already vetted twice.",
    subtitle:
      "New Zealand imports more used Japanese cars per head than anywhere on earth, and puts every one through entry certification before it can be registered. Buying here means buying a car that has already survived somebody else's inspection regime.",
    backgroundImage: UNSPLASH("1471444928139-48c5bf5173f8"),
  },
  stats: [
    { value: "2×", label: "Inspected — in Japan, then at NZ entry" },
    { value: "RHD", label: "Native right-hand drive throughout" },
    { value: "3", label: "Export ports we load from" },
  ],
  intro: {
    highlight: "Somebody else already did the hard inspection.",
    text: "Every used import that enters New Zealand is checked for structural integrity, frontal-impact standards, emissions and odometer accuracy before it can be plated. That record follows the car. When you buy an ex-Japan vehicle out of New Zealand, somebody else already did the hard inspection.",
  },
  specialty: {
    eyebrow: "What New Zealand supplies best",
    title: "The world's best-curated pool of second-hand Japanese cars.",
    blurb:
      "New Zealand has been importing ex-Japan stock at enormous scale for decades, filtering it through a strict entry standard and maintaining it in a temperate climate. The result is a market that functions as a quality-controlled version of the Japanese auction network.",
    items: [
      {
        icon: ClipboardCheck,
        title: "Pre-complied ex-Japan stock",
        desc: "Structural, frontal-impact, emissions and odometer checks are already done and recorded against the vehicle. For a buyer in a third country, that is a second independent verification of a car's integrity.",
      },
      {
        icon: Gauge,
        title: "Unusual EV and hybrid density",
        desc: "New Zealand absorbed used Nissan Leafs, Outlander PHEVs, Aqua and Prius hybrids in extraordinary numbers. For markets now building out electrification, it is one of the few places with genuine used-EV depth and battery-health records.",
      },
      {
        icon: FileCheck2,
        title: "A clean digital record",
        desc: "Registration, inspection and odometer history are held centrally and are straightforward to interrogate. Combined with the entry-certification file, it makes a New Zealand car about as documented as a used car gets.",
      },
      {
        icon: Truck,
        title: "NZ-new utes and wagons",
        desc: "Ranger, HiLux, Amarok and Outlander sold new in New Zealand come with local service histories and a temperate-climate life — a different, and often better, proposition than the same model from a harsher market.",
      },
    ],
  },
  signature: [
    {
      make: "Toyota",
      model: "Aqua",
      note: "Ex-Japan, NZ-complied",
      image: LOCAL("aqua"),
    },
    {
      make: "Nissan",
      model: "Leaf",
      note: "Used EV with battery report",
      image: LOCAL("note"),
    },
    {
      make: "Toyota",
      model: "Prius",
      note: "High-mileage-proof hybrid",
      image: LOCAL("prius"),
    },
    {
      make: "Mitsubishi",
      model: "Outlander",
      note: "PHEV in volume",
      image: LOCAL("harrier"),
    },
    {
      make: "Ford",
      model: "Ranger",
      note: "NZ-new, local history",
      image: LOCAL("lc200"),
    },
    {
      make: "Toyota",
      model: "Hiace",
      note: "Fleet-maintained vans",
      image: LOCAL("noah"),
    },
    {
      make: "Suzuki",
      model: "Swift",
      note: "Cheap to land, cheap to run",
      image: LOCAL("swift"),
    },
    {
      make: "Honda",
      model: "Fit",
      note: "Ex-Japan supply depth",
      image: LOCAL("fit"),
    },
  ],
  advantages: [
    {
      icon: ShieldCheck,
      title: "A second inspection you did not pay for",
      desc: "Entry certification has already screened out structurally compromised and odometer-tampered cars. That filtering happened at somebody else's expense, and the record travels with the vehicle.",
    },
    {
      icon: Snowflake,
      title: "A temperate climate, mostly",
      desc: "No road salt in most of the country and a mild climate are kind to bodies and to rubber. Coastal exposure is the caveat, which is why our inspection photographs the underbody rather than assuming.",
    },
    {
      icon: Gauge,
      title: "Real used-EV supply",
      desc: "Very few countries have enough used electric and plug-in stock to choose from. New Zealand does, and we supply a battery state-of-health reading with every EV we export rather than leaving you to guess.",
    },
    {
      icon: Anchor,
      title: "Close to the Pacific and Asia",
      desc: "Short, frequent sailings to Australia, the Pacific islands and South-East Asia, and established RoRo routes onward to Africa and the Middle East.",
    },
  ],
  process: [
    {
      title: "We find it in a filtered market",
      desc: "Our New Zealand team works the main auction houses, dealer stock and fleet disposals, and reads the entry-certification file alongside the advert. Cars whose compliance history looks thin never make your shortlist.",
    },
    {
      title: "We inspect and verify",
      desc: "Physical multi-point inspection with underbody photographs, registration and odometer history check, and a battery state-of-health test on every electric or plug-in hybrid.",
    },
    {
      title: "We clear it for export",
      desc: "Deregistration, proof of ownership, customs export documentation and the biosecurity clean that Australia, the Pacific and most African destinations require on arrival.",
    },
    {
      title: "We load and track it",
      desc: "RoRo or container from Auckland, Tauranga or Lyttelton, marine insurance throughout, and clearance support at your destination port.",
    },
  ],
  office: {
    // ── FILL IN: New Zealand office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "Sourcing ex-Japan and NZ-new stock through auctions and dealers",
      "Entry-certification file review and physical inspection",
      "Battery state-of-health testing on electric and plug-in vehicles",
      "Deregistration, export clearance and Pacific freight coordination",
    ],
  },
  logistics: {
    ports: ["Auckland", "Tauranga", "Lyttelton"],
    shipsTo:
      "Australia, the Pacific islands, South-East Asia, eastern and southern Africa, and the United Kingdom",
    transit:
      "Roughly 2–3 weeks to Australia and the Pacific, 5–8 weeks further afield",
  },
  faqs: [
    {
      q: "Why buy a Japanese car from New Zealand rather than from Japan?",
      a: "Because it has already been through a second, independent inspection. Every used import entering New Zealand must pass entry certification covering structure, frontal-impact standards, emissions and odometer accuracy before it can be registered, and that record stays with the car. You also get English-language paperwork, a local service history since compliance, and in many cases a lower price than the equivalent car currently at Japanese auction.",
    },
    {
      q: "When is buying from Japan the better option?",
      a: "When you want the widest possible choice or the newest possible car. Japan's weekly auction volume is vastly larger, so if you are hunting a specific grade, colour or trim, Japan will find it faster. New Zealand's advantage is verification and documentation, not selection.",
    },
    {
      q: "Is New Zealand a genuinely good source for used electric cars?",
      a: "It is one of the best in the world, largely because the country absorbed used Nissan Leafs and plug-in hybrids in enormous numbers. Battery condition is the only thing that matters on a used EV, so we test state of health and supply the reading with the car. We will not export an EV without one.",
    },
    {
      q: "Do New Zealand cars suffer from rust?",
      a: "Less than most, but it is not a free pass. Roads are not salted and the climate is temperate, which is favourable, but coastal areas see salt air and some ex-Japan cars arrived with corrosion already underway. Our inspection photographs the underbody on every vehicle for exactly that reason.",
    },
    {
      q: "Do you also import cars into New Zealand?",
      a: "Yes — New Zealand is one of our busiest destination markets as well as a source. We source from Japan, Australia, the UK and elsewhere into New Zealand, arrange the biosecurity clean before departure, and handle entry certification, GST and registration on arrival through the same local team.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-new-zealand",
    "best-cars-to-import-from-new-zealand",
    "new-zealand-vs-japan-for-used-imports",
    "cost-to-import-a-car-from-new-zealand",
    "importing-a-used-ev-from-new-zealand",
  ],
};

// ── UNITED ARAB EMIRATES ─────────────────────────────────────────────────────
const uae: CountryPageConfig = {
  slug: "uae",
  country: "the United Arab Emirates",
  shortName: "UAE",
  region: "Middle East",
  role: "both",
  cardBlurb:
    "The world's largest used-car re-export hub — low-mileage GCC-spec luxury, and a free-zone route to three continents.",
  meta: {
    title:
      "Source Cars From the UAE — GCC-Spec Luxury & Free-Zone Export | Providence Auto",
    description:
      "Providence Auto's UAE team sources low-mileage GCC-spec luxury SUVs and supercars — G-Class, LX, Land Cruiser, Patrol, Range Rover — and re-exports through Jebel Ali to Africa, Asia and the CIS. Inspected before shipment.",
    keywords: [
      "source cars from dubai",
      "uae car exporter",
      "import a car from the uae",
      "gcc spec cars export",
      "dubai used car export",
    ],
  },
  hero: {
    tagline: "Providence Auto · UAE",
    title: "The UAE.\nThe world's re-export crossroads.",
    subtitle:
      "Dubai turns over more used vehicles for export than any city on earth, and does it at the intersection of Africa, Asia and Europe. Our UAE team buys the low-mileage luxury stock the market is famous for, and moves it through the free zone without friction.",
    backgroundImage: UNSPLASH("1634823929885-b12342dfc408"),
  },
  stats: [
    { value: "LHD", label: "Left-hand drive, GCC specification" },
    { value: "3", label: "Continents inside a short sailing" },
    { value: "1–3 yr", label: "Typical age of the luxury stock we buy" },
  ],
  intro: {
    highlight: "Cars here are replaced, not worn out.",
    text: "The UAE does not build cars. What it does is buy them in extraordinary volume, keep them for a couple of years, service them at main dealers, and sell them on with mileage figures that look like typing errors. Cars here are replaced, not worn out.",
  },
  specialty: {
    eyebrow: "What the UAE supplies best",
    title:
      "Nearly new luxury, in the specification the region actually orders.",
    blurb:
      "High incomes, no vehicle purchase tax and short ownership cycles produce a used market weighted heavily toward large SUVs, luxury saloons and performance cars — usually one to three years old, usually high-specification, and almost always low-mileage.",
    items: [
      {
        icon: Sparkles,
        title: "Luxury SUVs in depth",
        desc: "Mercedes G-Class, Lexus LX and GX, Land Cruiser 300, Nissan Patrol and Range Rover are ordinary sights here, which means genuine choice of colour, trim and specification rather than taking what exists.",
      },
      {
        icon: Gauge,
        title: "Supercar turnover",
        desc: "Ferrari, Lamborghini, McLaren, Porsche and Rolls-Royce change hands quickly in the Emirates. Low mileage, main-dealer service and an established export route make it one of the most practical places in the world to buy one.",
      },
      {
        icon: Snowflake,
        title: "Built for heat, which travels well",
        desc: "GCC specification means uprated cooling, larger radiators, heavy-duty air conditioning and heat-resistant materials. In hot destination markets that is not a quirk — it is the specification you actually want.",
      },
      {
        icon: Globe2,
        title: "Left-hand drive at scale",
        desc: "For LHD markets across Africa, the CIS, Central Asia, the Middle East and Latin America, the UAE is the single largest accessible pool of nearly new left-hand-drive stock anywhere.",
      },
    ],
  },
  signature: [
    {
      make: "Mercedes-Benz",
      model: "G-Class",
      note: "The definitive Gulf SUV",
      image: LOCAL("gwagon"),
    },
    {
      make: "Lexus",
      model: "LX600",
      note: "Low-mileage flagship",
      image: LOCAL("lx600"),
    },
    {
      make: "Toyota",
      model: "Land Cruiser 300",
      note: "GCC heavy-duty spec",
      image: LOCAL("lc300"),
    },
    {
      make: "Nissan",
      model: "Patrol",
      note: "Y62 in volume",
      image: LOCAL("lc200"),
    },
    {
      make: "Land Rover",
      model: "Range Rover",
      note: "High-spec, low miles",
      image: UNSPLASH("1494976388531-d1058494cdd8"),
    },
    {
      make: "Porsche",
      model: "911",
      note: "Fast-turnover performance",
      image: UNSPLASH("1552519507-da3b142c6e3d"),
    },
    {
      make: "Ferrari",
      model: "488",
      note: "Main-dealer serviced",
      image: UNSPLASH("1614162692292-7ac56d7f7f1e"),
    },
    {
      make: "BMW",
      model: "X7",
      note: "Full-option Gulf trim",
      image: LOCAL("bmw"),
    },
  ],
  advantages: [
    {
      icon: Landmark,
      title: "A free-zone export route",
      desc: "Jebel Ali is built for exactly this. Vehicles bought for export move through the free zone under an established customs regime, which is why the UAE clears cars for shipment faster than almost anywhere in our network.",
    },
    {
      icon: Gauge,
      title: "Mileage that is genuinely low",
      desc: "Short ownership cycles and a culture of replacing rather than repairing mean two-year-old cars with mileage a European example would show in six months. We verify against service records rather than taking the odometer at face value.",
    },
    {
      icon: ShieldCheck,
      title: "Accident history you can check",
      desc: "Vehicle history in the Emirates is traceable through official registration and inspection records, and we run it on every car. Flood and accident damage is the known risk in any hot re-export market, and screening for it is the whole job.",
    },
    {
      icon: Anchor,
      title: "Sailings to everywhere",
      desc: "East and West Africa, the Indian subcontinent, the CIS and Central Asia, the wider Middle East and the Mediterranean are all short, frequent runs from Jebel Ali.",
    },
  ],
  process: [
    {
      title: "We find it across dealers and auctions",
      desc: "Our UAE team works main-dealer trade-ins, the Dubai export yards and the trade auctions. For supercars and limited-run models we also work the specialist retailers directly.",
    },
    {
      title: "We check history, then condition",
      desc: "Registration and inspection history first, to screen for accident and flood-damage markers. Then a physical multi-point inspection covering cooling system, air conditioning, underbody, paint depth and electronics, photographed and sent to you.",
    },
    {
      title: "We handle export clearance",
      desc: "Export certificate, customs clearance through the free zone, chassis and engine verification, and confirmation of whether GCC specification will satisfy your destination's emissions and lighting requirements before the car sails.",
    },
    {
      title: "We load and track it",
      desc: "Container or RoRo from Jebel Ali, air freight where the value justifies it, marine insurance throughout, and clearance support at your destination.",
    },
  ],
  office: {
    // ── FILL IN: UAE office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "Sourcing from main dealers, export yards and trade auctions",
      "Registration and accident-history screening before purchase",
      "Physical inspection with cooling, AC and paint-depth checks",
      "Free-zone customs clearance and Jebel Ali freight coordination",
    ],
  },
  logistics: {
    ports: ["Jebel Ali", "Port Rashid", "Khalifa Port"],
    shipsTo:
      "East and West Africa, the Indian subcontinent, the CIS and Central Asia, the wider Middle East, and the Mediterranean",
    transit:
      "Roughly 1–2 weeks to South Asia and East Africa, 3–5 weeks further afield",
  },
  faqs: [
    {
      q: "Are cars manufactured in the UAE?",
      a: "No. The UAE is not a vehicle manufacturing country — it is the largest used-vehicle re-export hub in the world. Its value to a buyer is the depth and youth of the stock passing through it, and the speed with which the free-zone customs regime can move a car onward.",
    },
    {
      q: "What is GCC specification, and does it matter?",
      a: "GCC-spec cars are built for Gulf conditions: larger radiators, uprated air conditioning, heat-resistant interior materials and, on some models, different emissions and lighting equipment. In hot climates that is a genuine advantage. In cold or emissions-strict markets it can require checking — some GCC models omit equipment that European or Japanese-spec cars carry as standard. We confirm compatibility with your destination before purchase, not after.",
    },
    {
      q: "How do you avoid flood-damaged or accident-repaired cars?",
      a: "By treating it as the primary risk rather than an afterthought. Every car is screened against official registration and inspection history for accident and damage markers, then physically inspected with paint-depth readings, underbody photographs and an electronics check. Anything with an inconsistent history is rejected regardless of how it presents.",
    },
    {
      q: "Is the low mileage on UAE cars real?",
      a: "Usually, and for a structural reason: high incomes, no purchase tax and short ownership cycles mean cars are replaced rather than run into the ground. That said, we verify against main-dealer service records rather than reading the odometer and hoping. A mileage claim without a service record behind it is not a mileage claim we pass on.",
    },
    {
      q: "Can you export supercars and limited-run models?",
      a: "Yes, and the UAE is one of the better places in the world to do it. Turnover is fast, main-dealer servicing is the norm, and the free-zone export route is well established. High-value cars ship in containers rather than RoRo, under full marine cover, with air freight available where the timeline justifies the cost.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-the-uae",
    "best-cars-to-import-from-dubai",
    "gcc-spec-cars-explained",
    "cost-to-import-a-car-from-the-uae",
    "uae-car-export-documents-explained",
  ],
};

// ── INDIA ────────────────────────────────────────────────────────────────────
const india: CountryPageConfig = {
  slug: "india",
  country: "India",
  shortName: "India",
  region: "South Asia",
  role: "source",
  cardBlurb:
    "The world's third-largest car market, building global models at roughly 30% below the global average price.",
  meta: {
    title:
      "Source Cars From India — Global Badges, Built for Less | Providence Auto",
    description:
      "Providence Auto's India team sources India-built Suzuki, Toyota, Hyundai, Kia, Tata and Mahindra models through direct dealer relationships. Safety-inspected before export, full landed cost quoted up front.",
    keywords: [
      "source cars from india",
      "import cars from india",
      "india built cars export",
      "indian manufactured cars",
      "india car exporter",
    ],
  },
  hero: {
    tagline: "Providence Auto · India",
    title: "India.\nThe same badge, engineered for less.",
    subtitle:
      "India builds global models on global platforms and exports them to some of the most demanding markets in the world. Our India team buys through direct dealer relationships and inspects every car before it leaves — because a lower price should never mean a lower standard.",
    backgroundImage: UNSPLASH("1663852408695-f57f4d75a536"),
  },
  stats: [
    { value: "~30%", label: "Below the global average vehicle price" },
    { value: "3rd", label: "Largest car market in the world" },
    { value: "90–95%", label: "Locally sourced components" },
  ],
  intro: {
    highlight: "The saving is engineered in, not cut out.",
    text: "India's price advantage comes from tax rules that reward compact design, supply chains that are almost entirely domestic, and factories building millions of units a year for the world's third-largest market. None of that is corner-cutting. The saving is engineered in, not cut out.",
  },
  specialty: {
    eyebrow: "What India builds best",
    title: "Small, tough, efficient — and increasingly, everything else.",
    blurb:
      "India's manufacturing base spans Suzuki, Hyundai, Kia, Toyota, Honda, Volkswagen, Skoda, Nissan, Tata and Mahindra, and now exports India-built cars back to Japan, Europe, Africa and Latin America. What began as a small-car industry has become a full-range one.",
    items: [
      {
        icon: Boxes,
        title: "The sub-four-metre specialists",
        desc: "India's tax code rewards cars under four metres with small engines, so manufacturers engineer entire model families to that envelope. Swift, Baleno, Nexon, Magnite and Venue are packaging masterclasses, and cheap by design rather than by omission.",
      },
      {
        icon: Mountain,
        title: "Genuinely tough off-roaders",
        desc: "Mahindra's Thar and Scorpio and Toyota's India-built Fortuner and Innova are engineered for roads that punish vehicles. In African, South Asian and Latin American markets that durability is the entire buying case.",
      },
      {
        icon: Wrench,
        title: "Parts availability everywhere",
        desc: "India-built models are supported by an aftermarket that reaches across Africa, South Asia and the Middle East. Serviceability is a real ownership cost, and it is one of the strongest arguments for an India-built car.",
      },
      {
        icon: ShieldCheck,
        title: "Safety standards that caught up",
        desc: "Bharat NCAP now crash-tests and publicly rates new models, and Indian manufacturers compete openly on five-star scores. The historic quality gap has closed while the price advantage has held.",
      },
    ],
  },
  signature: [
    {
      make: "Suzuki",
      model: "Swift",
      note: "The global small car",
      image: LOCAL("swift"),
    },
    {
      make: "Toyota",
      model: "Fortuner",
      note: "India-built 4x4",
      image: LOCAL("prado"),
    },
    {
      make: "Kia",
      model: "Seltos",
      note: "Export-spec crossover",
      image: UNSPLASH("1685019718640-6e562edc365e"),
    },
    {
      make: "Hyundai",
      model: "Creta",
      note: "Best-selling SUV",
      image: UNSPLASH("1663852408695-f57f4d75a536"),
    },
    {
      make: "Mahindra",
      model: "Thar",
      note: "Purpose-built off-roader",
      image: LOCAL("lc70"),
    },
    {
      make: "Tata",
      model: "Nexon",
      note: "Five-star rated",
      image: UNSPLASH("1685019718640-6e562edc365e"),
    },
    {
      make: "Nissan",
      model: "Magnite",
      note: "Sub-four-metre value",
      image: LOCAL("note"),
    },
    {
      make: "Honda",
      model: "City",
      note: "Long-run export model",
      image: LOCAL("fit"),
    },
  ],
  advantages: [
    {
      icon: Handshake,
      title: "Direct dealer relationships",
      desc: "We buy through relationships our India team built over years, not through a broker chain. Fewer intermediaries means a better price, a faster search and provenance we can actually verify.",
    },
    {
      icon: ShieldCheck,
      title: "Inspection is where we spend",
      desc: "Every car passes an independent multi-point pre-export inspection covering structure, brakes, engine, transmission, electronics and safety equipment. You see the report and the photographs before any payment is released.",
    },
    {
      icon: Landmark,
      title: "The saving lands in your pocket",
      desc: "One all-in landed cost covering the car, freight, insurance, duty and destination taxes. The point of an India-built car is a better deal, and hidden fees are how that gets quietly undone elsewhere.",
    },
    {
      icon: Boxes,
      title: "Volume without a drop in standard",
      desc: "Whether it is one car in an exact specification or a regular multi-unit allocation for a dealership, the inspection standard and the landed-cost transparency are identical on every unit.",
    },
  ],
  process: [
    {
      title: "We find it through the network",
      desc: "Tell us the model, trim and colour. Our India team works its dealer relationships to locate the exact specification — including export-market variants that are not sold domestically in your country.",
    },
    {
      title: "We inspect before anything moves",
      desc: "An independent multi-point inspection covering structure, brakes, drivetrain, electronics and safety equipment, with full documentation checks and photographs. If it does not pass, it does not ship, and you are not charged.",
    },
    {
      title: "We clear it for export",
      desc: "Export documentation, chassis verification, customs clearance and any pre-shipment inspection your destination requires, all handled by the local team.",
    },
    {
      title: "We load and track it",
      desc: "Container or RoRo from Mumbai, Chennai, Mundra or Kolkata, marine insurance throughout, and clearance and registration support on arrival.",
    },
  ],
  office: {
    // ── FILL IN: India office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "Sourcing through direct relationships with India's dealer networks",
      "Independent multi-point pre-export safety inspection",
      "Export documentation, chassis verification and customs clearance",
      "Multi-unit allocation management for dealership customers",
    ],
  },
  logistics: {
    ports: ["Mumbai (Nhava Sheva)", "Chennai", "Mundra", "Kolkata"],
    shipsTo:
      "Africa, the Middle East, South and South-East Asia, the Indian Ocean islands, and Latin America",
    transit:
      "Roughly 2–3 weeks to the Gulf and Sri Lanka, 3–5 weeks to Africa, 5–7 weeks to Europe",
  },
  faqs: [
    {
      q: "Why are India-built cars so much cheaper?",
      a: "Five reinforcing reasons: a tax code that rewards compact, efficient design; 90–95% of components sourced domestically, so almost nothing pays a tariff or crosses an ocean; factory operating costs well below Europe or Japan; engineering aimed at what buyers actually use; and the scale of the world's third-largest car market spreading development costs across millions of units. India's comparative vehicle price index sits around 70 against a global benchmark of 100.",
    },
    {
      q: "Is the quality of Indian-built cars low?",
      a: "Not any more, and the change is checkable rather than rhetorical. Modern Indian plants build global models for Suzuki, Toyota, Hyundai, Kia, Honda and the Volkswagen Group on the same worldwide platforms, manufacturers export India-built cars back to markets as demanding as Japan and Europe, and Bharat NCAP independently crash-tests and publicly rates new models. On top of that, every car we ship passes our own pre-export inspection.",
    },
    {
      q: "Which brands can you source from India?",
      a: "Suzuki, Toyota, Kia, Nissan, Hyundai, Honda, Tata, Mahindra, Renault, Volkswagen, Skoda and MG among others — from the Swift and Creta to the Fortuner, Seltos, Nexon and Thar. If you have a specific model, trim or colour in mind, our team sources it through the dealer network.",
    },
    {
      q: "Can you supply multiple units to a dealership?",
      a: "Yes, and the India network is built for it. Regular multi-unit allocations run on the same inspection standard and the same landed-cost transparency as a single car. Dealers typically use India for high-turnover compact SUVs and hatchbacks where the price gap is widest.",
    },
    {
      q: "Are India-built cars available in left-hand drive?",
      a: "Many are. India produces left-hand-drive variants specifically for export markets across Africa, Latin America and the Middle East alongside right-hand-drive domestic production. Tell us your destination and we will confirm which configuration is available for the model you want before you commit.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-india",
    "best-cars-to-import-from-india",
    "importing-cars-from-india-for-dealers",
    "cost-to-import-a-car-from-india",
    "india-car-export-documents-explained",
  ],
  relatedCampaign: {
    href: "/indian-manufactured-cars",
    label: "Indian-manufactured cars",
  },
};

// ── THAILAND ─────────────────────────────────────────────────────────────────
const thailand: CountryPageConfig = {
  slug: "thailand",
  country: "Thailand",
  shortName: "Thailand",
  region: "South-East Asia",
  role: "source",
  cardBlurb:
    "The Detroit of Asia — the world's pickup capital, and the fastest-growing EV assembly base outside China.",
  meta: {
    title:
      "Source Cars From Thailand — The World's Pickup Capital | Providence Auto",
    description:
      "Providence Auto's Thailand team sources Hilux Revo, Ranger, D-Max, Triton and Fortuner pickups and SUVs, plus Thai-assembled EVs, direct from the export market. Inspected, documented and shipped by our own team.",
    keywords: [
      "source cars from thailand",
      "thailand pickup exporter",
      "import a hilux from thailand",
      "thailand car exporter",
      "thai built pickup export",
    ],
  },
  hero: {
    tagline: "Providence Auto · Thailand",
    title: "Thailand.\nWhere the world's pickups are built.",
    subtitle:
      "One in every few pickup trucks on earth was assembled in Thailand. Our team buys them where they are made — new export-specification double cabs and low-mileage used stock, both, with the accessory market that grew up around them.",
    backgroundImage: UNSPLASH("1559416523-140ddc3d238c"),
  },
  stats: [
    { value: "Top 5", label: "Vehicle exporting nation worldwide" },
    { value: "RHD", label: "Native right-hand drive production" },
    { value: "100+", label: "Countries served from Laem Chabang" },
  ],
  intro: {
    highlight: "Buy the pickup where the pickup is made.",
    text: "Toyota, Isuzu, Ford, Mitsubishi, Mazda and Nissan all build their global one-tonne pickups in Thailand, and export them from there to more than a hundred countries. Every layer of markup between the plant and a foreign showroom is a layer you can remove. Buy the pickup where the pickup is made.",
  },
  specialty: {
    eyebrow: "What Thailand builds best",
    title: "One-tonne pickups, and the SUVs built on them.",
    blurb:
      "Thailand's automotive industry was built around the pickup truck and the tax structure that favours it. The country is consistently among the world's largest pickup producers, and it exports them in export specification rather than domestic-only trim.",
    items: [
      {
        icon: Truck,
        title: "The global pickup platform",
        desc: "Hilux Revo, Ranger, D-Max, Triton, BT-50 and Navara are all built here for worldwide export. Double cab, extra cab, single cab, 2WD and 4x4 — the full range, in the specification your market actually buys.",
      },
      {
        icon: Mountain,
        title: "Body-on-frame SUVs",
        desc: "Fortuner, Pajero Sport, MU-X and Everest share their underpinnings with those pickups, which is precisely why they last. Seven seats, ladder chassis, and parts availability anywhere a Hilux has ever been sold.",
      },
      {
        icon: Sparkles,
        title: "A serious accessory industry",
        desc: "Thailand's aftermarket for canopies, tonneau covers, bull bars, lift kits, tray bodies and interior upgrades is one of the deepest in the world, and it is far cheaper to fit at source than at destination.",
      },
      {
        icon: Gauge,
        title: "The new EV assembly base",
        desc: "BYD, MG, GWM and Neta have all built assembly capacity in Thailand, making it the leading right-hand-drive source for affordable Chinese electric vehicles outside China itself.",
      },
    ],
  },
  signature: [
    {
      make: "Toyota",
      model: "Hilux",
      note: "Revo, export spec",
      image: LOCAL("prado"),
    },
    {
      make: "Ford",
      model: "Ranger",
      note: "Wildtrak and Raptor",
      image: LOCAL("lc200"),
    },
    {
      make: "Isuzu",
      model: "D-Max",
      note: "Fleet favourite",
      image: LOCAL("noah"),
    },
    {
      make: "Mitsubishi",
      model: "Triton",
      note: "Value double cab",
      image: LOCAL("harrier"),
    },
    {
      make: "Toyota",
      model: "Fortuner",
      note: "Seven-seat ladder-frame",
      image: LOCAL("lc300"),
    },
    {
      make: "Mitsubishi",
      model: "Pajero Sport",
      note: "Pickup-based SUV",
      image: LOCAL("prado"),
    },
    {
      make: "Mazda",
      model: "BT-50",
      note: "D-Max underpinnings",
      image: LOCAL("voxy"),
    },
    {
      make: "BYD",
      model: "Atto 3",
      note: "Thai-assembled EV",
      image: LOCAL("vezel"),
    },
  ],
  advantages: [
    {
      icon: Landmark,
      title: "Factory-gate pricing on new stock",
      desc: "Because Thailand is where these vehicles are produced for export, brand-new export-specification pickups can be bought without the layers of distributor and dealer margin that a foreign showroom adds.",
    },
    {
      icon: Wrench,
      title: "Accessorise before it sails",
      desc: "Canopies, trays, bar work, suspension and protection equipment cost a fraction of destination-market prices and are fitted before the vehicle is loaded. The vehicle arrives ready to work rather than ready to modify.",
    },
    {
      icon: Globe2,
      title: "Right-hand drive, built for export",
      desc: "Thai production is natively right-hand drive and specified for export markets, with tropical-duty cooling and filtration already fitted. It is not a domestic vehicle repurposed for you.",
    },
    {
      icon: Anchor,
      title: "A port built for vehicle export",
      desc: "Laem Chabang is one of the world's major vehicle export terminals, with frequent RoRo sailings across Asia, Oceania, Africa and the Middle East.",
    },
  ],
  process: [
    {
      title: "We find it new or used",
      desc: "For new vehicles, our team orders the exact export specification through the dealer network. For used, we work the Thai auction houses and fleet disposals — a market with unusually good supply of well-maintained commercial 4x4s.",
    },
    {
      title: "We inspect and specify",
      desc: "Multi-point inspection on used stock with underbody and chassis photographs. On new vehicles we confirm the build specification line by line against your order, including any accessory fitment, before it leaves the compound.",
    },
    {
      title: "We clear it for export",
      desc: "Export documentation, chassis and engine number verification, customs clearance and any destination-required pre-shipment inspection, handled locally.",
    },
    {
      title: "We load and track it",
      desc: "RoRo or container from Laem Chabang or Bangkok, marine insurance throughout, and clearance and registration support at your port.",
    },
  ],
  office: {
    // ── FILL IN: Thailand office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "New export-specification ordering through the dealer network",
      "Used sourcing via Thai auction houses and fleet disposals",
      "Accessory specification and fitment before loading",
      "Export clearance and Laem Chabang freight coordination",
    ],
  },
  logistics: {
    ports: ["Laem Chabang", "Bangkok"],
    shipsTo:
      "South and South-East Asia, Oceania, eastern and southern Africa, the Middle East, and the Pacific",
    transit: "Roughly 1–3 weeks across Asia, 3–5 weeks to Africa and Oceania",
  },
  faqs: [
    {
      q: "Why is Thailand called the Detroit of Asia?",
      a: "Because of pickups. Thailand's tax structure has favoured one-tonne pickup trucks for decades, and Toyota, Isuzu, Ford, Mitsubishi, Mazda and Nissan all built major plants there to serve that market and to export worldwide. It is consistently one of the largest vehicle-exporting nations on earth, and the single most important global source for the pickup segment.",
    },
    {
      q: "Can you supply brand-new vehicles from Thailand, not just used?",
      a: "Yes, and for pickups that is often the better route. Because Thailand is the production source, new export-specification vehicles can be ordered through the dealer network without the distributor and dealer margins stacked on top in a destination market. You choose the exact trim, drivetrain and accessory package.",
    },
    {
      q: "Is Thai-built quality the same as Japanese-built?",
      a: "For these models, they are the same vehicles. A Hilux, D-Max or Ranger built in Thailand is produced on the manufacturer's global export line to the manufacturer's own standards — Thailand is the primary source for these models in most of the world, not a secondary one. The relevant question is specification, not origin, and we confirm that against your destination's requirements.",
    },
    {
      q: "Should I fit accessories in Thailand or at home?",
      a: "In Thailand, almost always. The accessory industry that grew up around Thai pickup production is one of the deepest and cheapest anywhere, and fitting before loading means the vehicle arrives ready to work. The exception is any equipment your destination will not register — we check that first and will tell you when to wait.",
    },
    {
      q: "Can you source electric vehicles from Thailand?",
      a: "Yes. BYD, MG, GWM and Neta have all established assembly in Thailand, which makes it the leading right-hand-drive source for affordable Chinese-brand EVs outside China. We check charging standards, warranty coverage and homologation for your market before purchase, because those vary far more than the vehicles do.",
    },
  ],
  blogSlugs: [
    "how-to-import-a-car-from-thailand",
    "best-pickups-to-import-from-thailand",
    "thailand-vs-japan-for-pickup-imports",
    "cost-to-import-a-car-from-thailand",
    "thailand-car-export-documents-explained",
  ],
};

// ── SRI LANKA ────────────────────────────────────────────────────────────────
const sriLanka: CountryPageConfig = {
  slug: "sri-lanka",
  country: "Sri Lanka",
  shortName: "Sri Lanka",
  region: "South Asia",
  role: "hub",
  cardBlurb:
    "Our South Asia operations hub — and one of the most demanding import markets we serve, where the paperwork decides everything.",
  meta: {
    title:
      "Providence Auto Sri Lanka — South Asia Operations & Vehicle Imports",
    description:
      "Providence Auto's Sri Lanka team runs South Asia operations and handles vehicle imports into Colombo — hybrids, compact cars and SUVs sourced from Japan, Thailand, India and the UK, with permits, duty and clearance managed locally.",
    keywords: [
      "import a car to sri lanka",
      "sri lanka vehicle import",
      "car importers colombo",
      "sri lanka car import taxes",
      "hybrid car import sri lanka",
    ],
  },
  hero: {
    tagline: "Providence Auto · Sri Lanka",
    title: "Sri Lanka.\nWhere the paperwork decides the price.",
    subtitle:
      "Sri Lanka has one of the most complex vehicle import regimes in the world, and rules that move. Our Colombo team runs South Asia operations for the group and handles every import into the island end to end — permits, valuation, duty and clearance included.",
    backgroundImage: UNSPLASH("1715526575128-88b04cb67556"),
  },
  stats: [
    { value: "CIF", label: "Duty is assessed on landed value, not invoice" },
    { value: "Local", label: "Clearance handled by our own Colombo team" },
    { value: "Hybrid", label: "The market's dominant drivetrain" },
  ],
  intro: {
    highlight: "Here, the customs file matters as much as the car.",
    text: "In most markets the car is the hard part and the paperwork is routine. In Sri Lanka it is the other way round: engine capacity, drivetrain, manufacture date, valuation method and permit status can move the final cost dramatically. Here, the customs file matters as much as the car.",
  },
  specialty: {
    eyebrow: "What the Colombo team does",
    title:
      "A regional operations base, and an import desk that knows the rules.",
    blurb:
      "Sri Lanka is not a vehicle manufacturing country, and we will not pretend otherwise. The Colombo team exists for two reasons: it coordinates a large part of our South Asian operations, and it handles the island's notoriously demanding import process for our customers directly.",
    items: [
      {
        icon: Users,
        title: "South Asia operations",
        desc: "Documentation, customer support and regional coordination for shipments moving between our Japan, India, Thailand and UAE teams and the wider Indian Ocean region.",
      },
      {
        icon: FileCheck2,
        title: "Import clearance, done locally",
        desc: "Customs valuation, duty and excise assessment, permits and registration are handled by people in Colombo who deal with the authorities in person, not by a broker in another time zone.",
      },
      {
        icon: Gauge,
        title: "A hybrid-first market",
        desc: "Sri Lanka's duty structure has long pushed buyers toward small-capacity hybrids, which is why the Aqua, Prius, Axio, Fit and Vezel dominate the roads. We source them at the specification the duty bands actually reward.",
      },
      {
        icon: BadgeCheck,
        title: "Advice before commitment",
        desc: "Import rules and duty rates in Sri Lanka change more often than in any market we operate in. We confirm the current position with Sri Lanka Customs for your specific vehicle before you commit — never from last year's rate card.",
      },
    ],
  },
  signature: [
    {
      make: "Toyota",
      model: "Aqua",
      note: "The island's default hybrid",
      image: LOCAL("aqua"),
    },
    {
      make: "Toyota",
      model: "Prius",
      note: "Proven at high mileage",
      image: LOCAL("prius"),
    },
    {
      make: "Honda",
      model: "Fit",
      note: "Compact hybrid supply",
      image: LOCAL("fit"),
    },
    {
      make: "Honda",
      model: "Vezel",
      note: "Crossover demand",
      image: LOCAL("vezel"),
    },
    {
      make: "Suzuki",
      model: "Swift",
      note: "Low duty band",
      image: LOCAL("swift"),
    },
    {
      make: "Toyota",
      model: "Prado",
      note: "Premium SUV segment",
      image: LOCAL("prado"),
    },
    {
      make: "Nissan",
      model: "Leaf",
      note: "Electric, where duty favours it",
      image: LOCAL("note"),
    },
    {
      make: "Toyota",
      model: "Alphard",
      note: "Executive transport",
      image: LOCAL("alphard"),
    },
  ],
  advantages: [
    {
      icon: Landmark,
      title: "The duty calculation, before you buy",
      desc: "Sri Lankan duty and excise depend on engine capacity, drivetrain, manufacture date and customs valuation — not on what you paid. We model the full landed figure against the current tariff before you commit a rupee.",
    },
    {
      icon: Search,
      title: "Sourced from four of our source countries",
      desc: "Japan, Thailand, India and the UK all feed the Sri Lankan market. Rather than pushing you at one source, we compare the landed cost from each for the specification you want.",
    },
    {
      icon: ClipboardCheck,
      title: "Inspected before it sails",
      desc: "Every vehicle is inspected at origin by the Providence team in that country, with the report and photographs sent to you before payment is released — because a car that fails inspection at Colombo is an expensive problem.",
    },
    {
      icon: Users,
      title: "A local team you can visit",
      desc: "Clearance queries, registration, and post-delivery support are handled by people you can sit down with. For a process this document-heavy, that is worth more than any online tracker.",
    },
  ],
  process: [
    {
      title: "We confirm the rules for your vehicle",
      desc: "Before anything is sourced, the Colombo team checks the current import position for that exact specification — eligibility, engine capacity band, drivetrain treatment, age limits and permit requirements — against the authorities as they stand today.",
    },
    {
      title: "We source it from the best origin",
      desc: "We compare landed cost from our Japan, Thailand, India and UK teams for the same specification, and buy where the total lands cheapest. Inspection happens at origin, by our own people.",
    },
    {
      title: "We handle valuation and clearance",
      desc: "Customs valuation, duty and excise assessment, permit documentation and port clearance are managed locally, with the assessment explained to you line by line rather than presented as a total.",
    },
    {
      title: "We register and hand over",
      desc: "Registration paperwork, plating and handover in Colombo, with the local team available afterwards for anything the process throws up.",
    },
  ],
  office: {
    // ── FILL IN: Sri Lanka office details ──
    city: "",
    addressLines: [],
    phone: "",
    email: "",
    hours: "",
    remit: [
      "South Asia operations, documentation and customer support",
      "Current-rule verification with Sri Lanka Customs before purchase",
      "Customs valuation, duty assessment, permits and port clearance",
      "Registration, plating and post-delivery support in Colombo",
    ],
  },
  logistics: {
    ports: ["Colombo", "Hambantota"],
    shipsTo:
      "Sri Lanka is primarily a destination market for us; Colombo also acts as a transhipment point for the Maldives and the wider Indian Ocean",
    transit:
      "Roughly 2–4 weeks from Japan and Thailand, 1–2 weeks from India and the Gulf",
  },
  faqs: [
    {
      q: "Are cars manufactured in Sri Lanka?",
      a: "No. Sri Lanka has assembly operations but is not a vehicle manufacturing country in any meaningful export sense. Our Colombo team exists as a South Asia operations hub and as an import desk — Sri Lanka is one of the most active destination markets we serve, and one of the hardest to get right without people on the ground.",
    },
    {
      q: "What actually drives the cost of importing a car to Sri Lanka?",
      a: "The tax structure, far more than the car. Duty and excise are assessed on the customs valuation of the vehicle rather than your invoice, and the rate depends on engine capacity, drivetrain type and the vehicle's age. Two cars with the same purchase price can land at very different totals. That is why we model the full landed cost against the current tariff before anything is bought.",
    },
    {
      q: "Why are hybrids so dominant on Sri Lankan roads?",
      a: "Because the duty structure has historically favoured small-capacity and hybrid vehicles, which pushed the market decisively toward the Toyota Aqua, Prius and Axio and the Honda Fit and Vezel. Fuel prices reinforce it. The practical effect is deep local parts availability and strong resale for exactly those models.",
    },
    {
      q: "How current is your information on Sri Lankan import rules?",
      a: "We verify it per shipment. Sri Lanka's vehicle import policy has changed substantially and repeatedly in recent years, including extended restrictions and phased reopenings, so anything published as a fixed rate card goes out of date quickly. Our Colombo team confirms the current position with Sri Lanka Customs for your specific vehicle before you commit, and you should treat any figure you read online — including ours — as indicative until then.",
    },
    {
      q: "Can I deal with someone in person?",
      a: "Yes, and for this market we would encourage it. The Colombo team handles clearance, valuation queries, registration and post-delivery support directly. For a process this document-heavy, being able to speak directly to the person handling your file is the single biggest reduction in risk available to you.",
    },
  ],
  blogSlugs: [
    "importing-a-car-to-sri-lanka",
    "sri-lanka-vehicle-import-taxes-explained",
    "best-cars-to-import-to-sri-lanka",
    "sri-lanka-car-import-documents-explained",
    "importing-hybrids-and-evs-to-sri-lanka",
  ],
};

// ── REGISTRY ─────────────────────────────────────────────────────────────────

export const COUNTRY_PAGES: CountryPageConfig[] = [
  japan,
  unitedKingdom,
  uae,
  india,
  thailand,
  australia,
  newZealand,
  sriLanka,
];

export const COUNTRY_BASE_PATH = "/source-cars-from";

export function getCountryPage(slug: string): CountryPageConfig | undefined {
  return COUNTRY_PAGES.find((c) => c.slug === slug);
}

export function getCountrySlugs(): string[] {
  return COUNTRY_PAGES.map((c) => c.slug);
}

/** Plain-English office list used in copy, e.g. the global FAQ answer. */
export const OFFICE_COUNTRY_NAMES = [
  "the United Kingdom",
  "Japan",
  "the UAE",
  "India",
  "Thailand",
  "Australia",
  "New Zealand",
  "Sri Lanka",
];

/** "the UK, Japan, the UAE, India, Thailand, Australia, New Zealand and Sri Lanka" */
export const OFFICE_COUNTRIES_SENTENCE =
  "the UK, Japan, the UAE, India, Thailand, Australia, New Zealand and Sri Lanka";
