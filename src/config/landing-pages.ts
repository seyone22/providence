import {
  Compass,
  FileSearch,
  Handshake,
  Landmark,
  ShieldCheck,
  Ship,
} from "lucide-react";

export type LandingPageConfig = {
  slug: string;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    tagline: string;
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  intro: {
    highlight: string;
    text: string;
  };
  valueProps: {
    title: string;
    features: Array<{
      icon: any; // Lucide icon reference
      title: string;
      desc: string;
      glowColor: string;
    }>;
    containerImage: string;
  };
  reviews: {
    averageRating: number;
    totalReviews: string;
    items: Array<{
      name: string;
      date: string;
      title: string;
      desc: string;
      rating: number;
    }>;
  };
  featuredReview: {
    title: string;
    carName: string;
    text: string;
    rating: number;
    image: string;
  };
  faqs: {
    title: string;
    subtitle: string;
    categories: Array<{
      category: string;
      items: Array<{
        q: string;
        a: string;
      }>;
    }>;
  };
};

export const lhdCampaignConfig: LandingPageConfig = {
  slug: "luxury-lhd-japan",
  meta: {
    title: "Left-Hand Drive Luxury Cars from Japan | Providence Auto",
    description:
      "Source left-hand drive (LHD) luxury cars — Rolls-Royce, Ferrari, Lamborghini, Porsche, Bentley and more — direct from Japan's grade-verified auctions. Fully landed to Europe, the Middle East, and the Americas.",
  },
  hero: {
    tagline: "Providence Auto · Left-Hand Drive Specialists",
    title: "Japanese Luxury,\nLeft-Hand Drive.",
    subtitle:
      "Grade-verified LHD supercars and luxury saloons, sourced direct from Japan and landed at your door — no conversions, no compromise.",
    backgroundImage:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=3000&auto=format&fit=cover",
  },
  intro: {
    highlight: "No conversions. No compromise.",
    text: "Every car we source is genuine factory left-hand drive, hand-picked from Japan's most reputable auctions, certified dealers, and private collections. Native LHD means simpler registration, no engineering sign-off, and stronger long-term resale value than a converted car ever holds.",
  },
  valueProps: {
    title: "Why Import From Providence Auto",
    containerImage: "/gallery_image.jpg",
    features: [
      {
        icon: FileSearch,
        title: "Complete Verification",
        desc: "Every vehicle is verified through original Japanese auction sheets and full service history where available.",
        glowColor: "group-hover:bg-blue-500/15",
      },
      {
        icon: ShieldCheck,
        title: "Pre-Export Inspection",
        desc: "Comprehensive multi-point pre-export inspection covering engine, transmission, suspension, electronics, and bodywork.",
        glowColor: "group-hover:bg-emerald-500/15",
      },
      {
        icon: Landmark,
        title: "Tax & Compliance",
        desc: "We navigate complex international tax codes and import duties so you don't have to.",
        glowColor: "group-hover:bg-indigo-500/15",
      },
      {
        icon: Ship,
        title: "Global Logistics",
        desc: "Curated specifically for export to countries that drive on the right side of the road across Europe, the Middle East, and the Americas.",
        glowColor: "group-hover:bg-amber-500/15",
      },
    ],
  },
  reviews: {
    averageRating: 4.9,
    totalReviews: "250+",
    items: [
      {
        name: "Karim A.",
        date: "2 weeks ago",
        title: "My LHD 911 landed in Dubai flawlessly",
        desc: "Sourced a low-mileage left-hand drive Porsche 911 from a Japanese auction. Auction sheet, inspection photos and landed-cost quote came before I paid a cent. Registered in the UAE with zero drama.",
        rating: 5,
      },
      {
        name: "Sofia M.",
        date: "1 month ago",
        title: "Genuine factory LHD — not a conversion",
        desc: "I was nervous about buying from Japan, but every car they offered was verified native left-hand drive. My Bentley Continental arrived in Germany exactly as graded. Communication was excellent throughout.",
        rating: 5,
      },
      {
        name: "Daniel K.",
        date: "1 month ago",
        title: "Handled the taxes and shipping end to end",
        desc: "They quoted the full landed cost — car, freight, duty and VAT — up front, then handled customs clearance for me. My LHD Lexus LX arrived on schedule and well under the local dealer price.",
        rating: 5,
      },
    ],
  },
  featuredReview: {
    title: "Customer story:",
    carName: "Left-Hand Drive Import",
    text: "I'd spent months trying to find a genuine left-hand drive example in Europe with no luck. Providence found one at a graded Japanese auction within a fortnight, sent me the full auction sheet and inspection report, and shipped it door-to-door with every tax handled. It arrived exactly as described.",
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2940&auto=format&fit=crop",
  },
  faqs: {
    title: "Left-Hand Drive Imports — Your Questions Answered",
    subtitle:
      "Everything you need to know about sourcing an LHD luxury car from Japan with Providence.",
    categories: [
      {
        category: "Left-Hand Drive & Sourcing",
        items: [
          {
            q: "Are these cars genuine factory left-hand drive?",
            a: "Yes. Every vehicle we offer on this page is native, factory-built left-hand drive — not a right-hand drive car converted after the fact. We confirm the configuration on the original auction sheet and export documents before you commit, so there is no engineering sign-off, no aftermarket steering conversion, and no hit to resale value.",
          },
          {
            q: "Why buy a left-hand drive luxury car from Japan?",
            a: "Japan runs one of the world's largest, most transparent used-car auction networks, with strict independent grading and exceptional maintenance culture. Many premium marques were sold there in factory left-hand drive for export markets. That means grade-verified condition, wholesale auction pricing, and genuine LHD spec — ideal for buyers in Europe, the Middle East, and the Americas.",
          },
          {
            q: "Which luxury brands can you source?",
            a: "Rolls-Royce, Bentley, Ferrari, Lamborghini, Aston Martin, McLaren, Bugatti, Porsche, Mercedes-Benz, BMW, Audi, Maserati, Lexus, Genesis, Lucid and Lotus, among others. If you have a specific model, spec, or colour in mind, tell us in your inquiry and we'll hunt it down at auction.",
          },
          {
            q: "How do I know the car's true condition before I buy?",
            a: "You receive the original Japanese auction grade sheet, a full multi-point pre-export inspection, and detailed photographs before any payment is released. Japanese auction grades are independently assessed and widely trusted across the trade. If a car doesn't match its grade, we don't ship it.",
          },
        ],
      },
      {
        category: "Taxes, Shipping & Delivery",
        items: [
          {
            q: "Will you tell me the full landed cost before I commit?",
            a: "Yes. Before you pay anything, we give you a single all-in landed-cost quote covering the car, freight, insurance, import duty and VAT for your destination country. No surprise charges on arrival.",
          },
          {
            q: "Which countries can you deliver to?",
            a: "We specialise in export to left-hand-drive markets across Europe, the Middle East, and the Americas. We arrange RoRo or container shipping door-to-port or door-to-door, and manage customs clearance and registration paperwork on your behalf.",
          },
          {
            q: "How long does the whole process take?",
            a: "Typically 8–12 weeks from confirmed inquiry to delivery: 1–2 weeks to source and win the car at auction, 4–8 weeks shipping depending on destination, then customs clearance and local registration. You get live milestone updates the whole way.",
          },
          {
            q: "Is my payment protected?",
            a: "Yes. Funds are held securely until your vehicle is confirmed, inspected, and cleared for shipment, and every car is covered by comprehensive marine insurance door-to-door. Providence is an established UK-based sourcing and export company with a global office network.",
          },
        ],
      },
    ],
  },
};

export const japanImportCampaignConfig: LandingPageConfig = {
  slug: "import-japanese-cars",
  meta: {
    title: "Import Japanese Cars — Fast Movers, Fully Landed | Providence Auto",
    description:
      "Import Japan's fastest-moving cars — Toyota Aqua, Prius, Harrier, Honda Fit, Vezel and more — grade-verified at auction and landed in the UK, Ireland, Sri Lanka, Kenya, Tanzania, Uganda or any right-hand-drive country. Full landed cost quoted before you commit.",
  },
  hero: {
    tagline: "Providence Auto · Japan Import Specialists",
    title: "Japan's Fastest Movers,\nLanded at Your Door.",
    subtitle:
      "The hybrids, SUVs and workhorses the whole right-hand-drive world is buying — grade-verified at Japanese auction, then shipped, cleared and registered in your country for one honest landed price.",
    backgroundImage:
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=3000&auto=format&fit=cover",
  },
  intro: {
    highlight: "You see the auction sheet before we spend a yen.",
    text: "Every car we bid on carries an original Japanese auction sheet — an independent condition grade the entire trade relies on. We translate it, cross-check the mileage against Japan's inspection records, and send it to you with photographs before any money moves. You see the auction sheet before we spend a yen.",
  },
  valueProps: {
    title: "Why Import From Providence Auto",
    containerImage: "/gallery_image.jpg",
    features: [
      {
        icon: FileSearch,
        title: "Auction-Grade Verified",
        desc: "Original auction sheet, translated and explained. Mileage cross-checked against Japan's export certificate and inspection history. If the car doesn't match its grade, we don't bid.",
        glowColor: "group-hover:bg-blue-500/15",
      },
      {
        icon: Compass,
        title: "Your Country's Rules, Handled",
        desc: "Age limits, pre-export inspections, emissions rules, registration deadlines — every right-hand-drive market plays by different rules, and we've shipped through all of them. You pick the car; we make it compliant.",
        glowColor: "group-hover:bg-emerald-500/15",
      },
      {
        icon: Landmark,
        title: "One Honest Landed Price",
        desc: "Before you commit a penny, you get a single all-in quote — car, auction fees, freight, insurance, duty and every local tax for your destination. The price we quote is the price you pay.",
        glowColor: "group-hover:bg-indigo-500/15",
      },
      {
        icon: Ship,
        title: "Door-to-Door Logistics",
        desc: "RoRo or container from Japan's ports to yours, marine insurance the whole way, customs clearance and local registration managed for you — with live milestone updates from auction hall to driveway.",
        glowColor: "group-hover:bg-amber-500/15",
      },
    ],
  },
  reviews: {
    averageRating: 4.9,
    totalReviews: "250+",
    items: [
      {
        name: "Njeri W.",
        date: "2 weeks ago",
        title: "My Harrier cleared Mombasa without a hitch",
        desc: "They confirmed the car was under Kenya's 8-year rule, handled the pre-export inspection, and sent me the auction sheet before I paid a thing. It landed exactly as graded — friends keep asking where I got it.",
        rating: 5,
      },
      {
        name: "Ruwan P.",
        date: "1 month ago",
        title: "Toyota Aqua landed in Colombo, paperwork perfect",
        desc: "I was worried about the import rules changing, but Providence knew exactly what qualified. Full landed cost up front, live vessel tracking, and the car arrived with lower mileage than anything I'd seen locally.",
        rating: 5,
      },
      {
        name: "Ciarán D.",
        date: "1 month ago",
        title: "Hybrid import to Ireland — VRT handled end to end",
        desc: "Zero customs duty on a Japan-built hybrid, VRT calculated before I committed, NCTS appointment booked for me. It still came in thousands under the forecourt price for the same car here.",
        rating: 5,
      },
    ],
  },
  featuredReview: {
    title: "Customer story:",
    carName: "Japan Auction Import",
    text: "I'd been burned before by an importer who promised one grade and delivered another. Providence sent me the original auction sheet, the translation, and the inspection photos before I paid anything — then the exact car in those photos turned up at my door. That's the whole difference.",
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2940&auto=format&fit=crop",
  },
  faqs: {
    title: "Importing From Japan — Your Questions Answered",
    subtitle:
      "Everything you need to know about sourcing a Japanese car and landing it in your country with Providence.",
    categories: [
      {
        category: "Buying From Japan",
        items: [
          {
            q: "Why buy a used car from Japan?",
            a: "Japan's strict shaken roadworthiness regime makes older cars expensive to keep, so owners sell young — which floods the auction network with low-mileage, meticulously maintained cars. Over 100,000 vehicles pass through graded auctions every week, each independently inspected, and buying at wholesale auction prices means a Japanese import routinely lands below local used prices even after freight and taxes.",
          },
          {
            q: "How does the Japanese auction grading system work?",
            a: "Independent inspectors grade every auction car on a standard scale: Grade 5 is near-new, Grade 4 is excellent, Grade 3.5 is very good with minor cosmetic marks, and accident-repaired cars are flagged separately as Grade R. The grade, panel-by-panel condition map and inspector's notes all appear on the auction sheet. We source Grade 3.5 and above, send you the original sheet with a translation before bidding, and if a car doesn't match its grade on our own inspection, we don't ship it.",
          },
          {
            q: "Is the mileage on Japanese import cars genuine?",
            a: "Yes — and it's verifiable. Japan records odometer readings at every shaken inspection and at auction, and auction houses flag any inconsistency directly on the sheet. Before export, the mileage is certified again on the official export certificate. We cross-check all three records on every car we buy, and we walk away from any vehicle where the history doesn't line up perfectly.",
          },
          {
            q: "How much does it cost to import a car from Japan?",
            a: "The total is the auction price plus auction fees, inland transport in Japan, ocean freight, marine insurance, and your country's import duties and taxes — which vary widely by destination and vehicle. That's why we quote one all-in landed cost for your specific car and country before you commit anything. The number we quote is the number you pay; there are no surprise charges on arrival.",
          },
          {
            q: "How long does it take to import a car from Japan?",
            a: "Typically 6–14 weeks door to door, depending on destination: 1–2 weeks to source and win the right car at auction, then roughly 3–5 weeks shipping to East African ports, 4–6 weeks to South Asia, or 6–8 weeks to the UK and Ireland, followed by customs clearance and local registration. You get live milestone updates the whole way.",
          },
        ],
      },
      {
        category: "Your Country's Rules",
        items: [
          {
            q: "What are the rules for importing a Japanese car to the UK?",
            a: "The UK has no age limit on imports, which is why it's the natural home of the JDM classic. Your car must be notified to HMRC through NOVA within 14 days of arrival, approved where required, and registered with the DVLA — all of which we handle. Duty and VAT depend on the vehicle and are included in your up-front landed-cost quote.",
          },
          {
            q: "What does it cost to import a Japanese car to Ireland?",
            a: "Three charges apply: customs duty — 0% for Japan-built cars under the EU–Japan Economic Partnership Agreement — VAT at 23% on the landed value, and VRT based on CO2 emissions, which runs as low as 7–14% for efficient Japanese hybrids. Every import must be registered at NCTS within 30 days of arrival. We calculate, declare and pay all of it on your behalf, quoted in full before you commit.",
          },
          {
            q: "Can I import a Japanese car to Sri Lanka now?",
            a: "Yes — vehicle imports have reopened after the multi-year suspension, with strict conditions: only recently registered used cars qualify, and duties scale steeply with engine capacity, which is exactly why compact hybrids like the Toyota Aqua, Vitz and Honda Fit dominate the market. We confirm your chosen car qualifies under the current regulations before you commit a cent, and manage the shipping and clearance into Colombo.",
          },
          {
            q: "What is the age limit for importing a car to Kenya?",
            a: "Kenya only accepts vehicles under 8 years old from the year of first registration, right-hand drive only, and every car must pass a mandatory pre-export roadworthiness inspection in Japan for KEBS compliance. We source age-compliant stock, arrange the inspection, and ship into Mombasa with duties quoted up front — the Toyota Harrier, Fielder, Vitz and Land Cruiser Prado are the perennial fast movers.",
          },
          {
            q: "Can I import an older Japanese car to Tanzania?",
            a: "Yes — Tanzania has no outright age ban, though vehicles more than 10 years old attract additional excise duty, which we include in your landed-cost quote so there are no surprises. Cars ship into Dar es Salaam and must pass pre-shipment inspection in Japan, which we arrange. The IST, Harrier, Noah and Land Cruiser are among the most in-demand imports.",
          },
          {
            q: "What are Uganda's rules for Japanese car imports?",
            a: "Uganda bans vehicles older than 15 years and applies an environmental levy to older eligible cars, so the sweet spot is a 5–9 year-old Japanese vehicle — think Harrier, Premio, Wish or Hiace. Your car lands at Mombasa and travels overland to Kampala under a bonded transit we arrange, with URA taxes included in the single landed price we quote before you buy.",
          },
          {
            q: "Do you deliver to other right-hand-drive countries?",
            a: "Yes. Beyond the UK, Ireland, Sri Lanka, Kenya, Tanzania and Uganda, we ship to right-hand-drive markets worldwide — including the wider Caribbean, southern Africa, and the Pacific. Tell us your country in the inquiry form and we'll come back with the exact rules, timeline and full landed cost for your destination.",
          },
        ],
      },
      {
        category: "Shipping, Payment & Protection",
        items: [
          {
            q: "Is my payment protected when buying a car from Japan?",
            a: "Yes. Funds are held securely until your vehicle is confirmed, inspected and cleared for shipment, and every car is covered by comprehensive marine insurance door to door. Providence is an established UK-based sourcing and export company with a global office network — you always know exactly where your car and your money are.",
          },
          {
            q: "Will my car ship by RoRo or container?",
            a: "Both are available. RoRo (roll-on, roll-off) is the economical default for most imports; containerised shipping suits higher-value cars or multi-vehicle orders. We recommend the right method for your car and destination, and either way it's covered by marine insurance with live vessel tracking from Japan to your port.",
          },
          {
            q: "What documents do I receive with my import?",
            a: "The original Japanese auction sheet with translation, the export certificate with verified mileage, the deregistration certificate, the Bill of Lading, any required pre-export inspection certificates for your country, and full customs clearance paperwork on arrival — everything needed to register and own the car outright.",
          },
        ],
      },
    ],
  },
};

export const indianCampaignConfig: LandingPageConfig = {
  slug: "indian-manufactured-cars",
  meta: {
    title: "India-Built Cars, Landed for Less | Providence Auto",
    description:
      "Source Indian-manufactured cars — Suzuki, Toyota, Kia, Nissan, Hyundai and more — through Providence's dealer network in India. Safety-inspected before export, full landed cost quoted up front, delivered to your door.",
  },
  hero: {
    tagline: "Providence Auto · India-Built Specialists",
    title: "Built in India,\nDriven by Value.",
    subtitle:
      "The badges you already trust — Suzuki, Toyota, Kia, Nissan — built in India's most efficient factories for around 30% less, safety-inspected by our own team, and landed at your door.",
    backgroundImage:
      "https://images.unsplash.com/photo-1663852408695-f57f4d75a536?q=80&w=3000&auto=format&fit=cover",
  },
  intro: {
    highlight: "The saving never comes at the cost of safety.",
    text: "Every car we source is built in India by the world's biggest manufacturers, in some of the most efficient factories on earth — same badge, smarter price. Our team inspects every car before it ships, because we'd rather lose a sale than ship a car we wouldn't put our own families in. The saving never comes at the cost of safety.",
  },
  valueProps: {
    title: "Why Import From Providence Auto",
    containerImage: "/gallery_image.jpg",
    features: [
      {
        icon: Handshake,
        title: "Direct India Network",
        desc: "We've spent years building direct relationships with India's largest dealer networks. Buying closer to the source means we find your car faster, negotiate harder, and land it cheaper.",
        glowColor: "group-hover:bg-blue-500/15",
      },
      {
        icon: ShieldCheck,
        title: "Safety Before Everything",
        desc: "Safety is where we spend the most time and money — full stop. Every car passes an independent multi-point pre-export inspection covering structure, brakes, engine, electronics and crash-safety spec before it's cleared to ship.",
        glowColor: "group-hover:bg-emerald-500/15",
      },
      {
        icon: Landmark,
        title: "One Honest Price",
        desc: "Before you commit a penny, you get a single all-in landed cost — car, freight, insurance, duty and VAT. The India price advantage lands in your pocket, not in hidden fees.",
        glowColor: "group-hover:bg-indigo-500/15",
      },
      {
        icon: Ship,
        title: "Faster, Safer Logistics",
        desc: "From booking to delivery, we manage shipping, customs and paperwork end to end — with marine insurance door-to-door and live milestone updates the whole way.",
        glowColor: "group-hover:bg-amber-500/15",
      },
    ],
  },
  reviews: {
    averageRating: 4.9,
    totalReviews: "250+",
    items: [
      {
        name: "Priya S.",
        date: "3 weeks ago",
        title: "My India-built Seltos landed for thousands less",
        desc: "I'd priced the same spec locally and couldn't believe the difference. Providence sent the inspection report and the full landed cost before I paid anything. The car arrived exactly as described — you'd never guess it cost me that little.",
        rating: 5,
      },
      {
        name: "James O.",
        date: "1 month ago",
        title: "Six cars in, zero surprises",
        desc: "We take regular stock through Providence's India network now. Every car arrives inspected, documented and ready to retail. The margins work because they buy at the source — and their safety checks mean nothing comes back to bite us.",
        rating: 5,
      },
      {
        name: "Amira H.",
        date: "1 month ago",
        title: "They talked me OUT of a cheaper car",
        desc: "The first car I picked didn't pass their inspection, so they refused to ship it and found me a better one for nearly the same money. That's when I knew I'd picked the right importer.",
        rating: 5,
      },
    ],
  },
  featuredReview: {
    title: "Customer story:",
    carName: "India-Built Import",
    text: 'I always assumed "cheaper" meant "worse" — then I did the maths on an India-built car with Providence. They showed me the inspection report, the crash-test rating, the full landed cost, everything, before I committed. The car turned up better equipped than the one I\'d almost bought locally, for a lot less money.',
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1685019718640-6e562edc365e?q=80&w=2940&auto=format&fit=crop",
  },
  faqs: {
    title: "India-Built Imports — Your Questions Answered",
    subtitle:
      "Everything you need to know about sourcing an Indian-manufactured car with Providence.",
    categories: [
      {
        category: "Indian-Built Cars & Quality",
        items: [
          {
            q: "Why are Indian-manufactured cars so much cheaper?",
            a: "Because the whole ecosystem is built for cost-efficiency, not because corners are cut. India's tax rules reward compact, efficient design; 90–95% of parts are sourced domestically; factory operating costs run 10–25% below Europe; and the world's third-largest car market spreads development costs across millions of units. The result is a comparative price index of roughly 70 against a global benchmark of 100 — about 30% cheaper, engineered in from day one.",
          },
          {
            q: "Is the quality of Indian-built cars low?",
            a: "No — and the gap that once existed has closed fast. Modern Indian plants build for Suzuki, Toyota, Hyundai, Kia, Honda and the Volkswagen Group on the same global platforms sold worldwide, manufacturers now export India-built cars back to markets as demanding as Japan and Europe, and the Bharat NCAP crash-test programme holds new models to independent safety standards. On top of that, every car we ship passes our own multi-point pre-export inspection — if it doesn't pass, it doesn't ship.",
          },
          {
            q: "Which brands and models can you source from India?",
            a: "Suzuki, Toyota, Kia, Nissan, Hyundai, Honda, Tata, Mahindra, Renault, Volkswagen, Skoda and MG, among others — from the Swift and Creta to the Fortuner, Seltos and Nexon. If you have a specific model, trim or colour in mind, tell us in your inquiry and we'll source it through our dealer network.",
          },
          {
            q: "How do you make sure my car is safe before it ships?",
            a: "Safety is our single biggest investment of time and money. Every car goes through an independent multi-point pre-export inspection — structure, brakes, engine, transmission, electronics and safety equipment — plus full documentation checks. You see the inspection report and photographs before any payment is released, and if a car doesn't meet our standard, we don't ship it. Ever.",
          },
        ],
      },
      {
        category: "Sourcing, Taxes & Delivery",
        items: [
          {
            q: "Will you tell me the full landed cost before I commit?",
            a: "Yes. Before you pay anything, we give you a single all-in landed-cost quote covering the car, freight, insurance, import duty and VAT for your destination. The saving you see is the saving you keep — no surprise charges on arrival.",
          },
          {
            q: "How does Providence source cars from India?",
            a: "Directly. Our team has built relationships with India's largest dealer networks, which lets us buy closer to the source than a traditional importer. That's how we bring cars in faster, at better prices, and with the provenance of every car verified before we commit your money.",
          },
          {
            q: "Can you supply more than one car at a time?",
            a: "Absolutely. Whether you're after a single car in an exact spec or a regular multi-unit allocation, our India network is built for volume — same inspection standard, same landed-cost transparency, on every unit.",
          },
          {
            q: "How long does delivery take, and is my payment protected?",
            a: "Typically 6–10 weeks from confirmed order to delivery, depending on destination — sourcing and inspection first, then shipping, customs clearance and registration, with live milestone updates throughout. Funds are held securely until your car is confirmed, inspected and cleared to ship, and every car is covered by marine insurance door-to-door.",
          },
        ],
      },
    ],
  },
};
