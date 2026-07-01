import { Landmark, ShieldCheck, Ship, FileSearch } from "lucide-react";

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
        description: "Source left-hand drive (LHD) luxury cars — Rolls-Royce, Ferrari, Lamborghini, Porsche, Bentley and more — direct from Japan's grade-verified auctions. Fully landed to Europe, the Middle East, and the Americas."
    },
    hero: {
        tagline: "Providence Auto · Left-Hand Drive Specialists",
        title: "Luxury Cars,\nLeft-Hand Drive.",
        subtitle: "Grade-verified LHD supercars and luxury saloons, sourced direct from Japan and landed at your door — no conversions, no compromise.",
        backgroundImage: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=3000&auto=format&fit=cover"
    },
    intro: {
        highlight: "No conversions. No compromise.",
        text: "Every car we source is genuine factory left-hand drive, hand-picked from Japan's most reputable auctions, certified dealers, and private collections. Native LHD means simpler registration, no engineering sign-off, and stronger long-term resale value than a converted car ever holds."
    },
    valueProps: {
        title: "Why Import From Providence Auto",
        containerImage: "/gallery_image.jpg",
        features: [
            {
                icon: FileSearch,
                title: "Complete Verification",
                desc: "Every vehicle is verified through original Japanese auction sheets and full service history where available.",
                glowColor: "group-hover:bg-blue-500/15"
            },
            {
                icon: ShieldCheck,
                title: "Pre-Export Inspection",
                desc: "Comprehensive multi-point pre-export inspection covering engine, transmission, suspension, electronics, and bodywork.",
                glowColor: "group-hover:bg-emerald-500/15"
            },
            {
                icon: Landmark,
                title: "Tax & Compliance",
                desc: "We navigate complex international tax codes and import duties so you don't have to.",
                glowColor: "group-hover:bg-indigo-500/15"
            },
            {
                icon: Ship,
                title: "Global Logistics",
                desc: "Curated specifically for export to countries that drive on the right side of the road across Europe, the Middle East, and the Americas.",
                glowColor: "group-hover:bg-amber-500/15"
            }
        ]
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
                rating: 5
            },
            {
                name: "Sofia M.",
                date: "1 month ago",
                title: "Genuine factory LHD — not a conversion",
                desc: "I was nervous about buying from Japan, but every car they offered was verified native left-hand drive. My Bentley Continental arrived in Germany exactly as graded. Communication was excellent throughout.",
                rating: 5
            },
            {
                name: "Daniel K.",
                date: "1 month ago",
                title: "Handled the taxes and shipping end to end",
                desc: "They quoted the full landed cost — car, freight, duty and VAT — up front, then handled customs clearance for me. My LHD Lexus LX arrived on schedule and well under the local dealer price.",
                rating: 5
            }
        ]
    },
    featuredReview: {
        title: "Customer story:",
        carName: "Left-Hand Drive Import",
        text: "I'd spent months trying to find a genuine left-hand drive example in Europe with no luck. Providence found one at a graded Japanese auction within a fortnight, sent me the full auction sheet and inspection report, and shipped it door-to-door with every tax handled. It arrived exactly as described.",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2940&auto=format&fit=crop"
    },
    faqs: {
        title: "Left-Hand Drive Imports — Your Questions Answered",
        subtitle: "Everything you need to know about sourcing an LHD luxury car from Japan with Providence.",
        categories: [
            {
                category: "Left-Hand Drive & Sourcing",
                items: [
                    {
                        q: "Are these cars genuine factory left-hand drive?",
                        a: "Yes. Every vehicle we offer on this page is native, factory-built left-hand drive — not a right-hand drive car converted after the fact. We confirm the configuration on the original auction sheet and export documents before you commit, so there is no engineering sign-off, no aftermarket steering conversion, and no hit to resale value."
                    },
                    {
                        q: "Why buy a left-hand drive luxury car from Japan?",
                        a: "Japan runs one of the world's largest, most transparent used-car auction networks, with strict independent grading and exceptional maintenance culture. Many premium marques were sold there in factory left-hand drive for export markets. That means grade-verified condition, wholesale auction pricing, and genuine LHD spec — ideal for buyers in Europe, the Middle East, and the Americas."
                    },
                    {
                        q: "Which luxury brands can you source?",
                        a: "Rolls-Royce, Bentley, Ferrari, Lamborghini, Aston Martin, McLaren, Bugatti, Porsche, Mercedes-Benz, BMW, Audi, Maserati, Lexus, Genesis, Lucid and Lotus, among others. If you have a specific model, spec, or colour in mind, tell us in your inquiry and we'll hunt it down at auction."
                    },
                    {
                        q: "How do I know the car's true condition before I buy?",
                        a: "You receive the original Japanese auction grade sheet, a full multi-point pre-export inspection, and detailed photographs before any payment is released. Japanese auction grades are independently assessed and widely trusted across the trade. If a car doesn't match its grade, we don't ship it."
                    }
                ]
            },
            {
                category: "Taxes, Shipping & Delivery",
                items: [
                    {
                        q: "Will you tell me the full landed cost before I commit?",
                        a: "Yes. Before you pay anything, we give you a single all-in landed-cost quote covering the car, freight, insurance, import duty and VAT for your destination country. No surprise charges on arrival."
                    },
                    {
                        q: "Which countries can you deliver to?",
                        a: "We specialise in export to left-hand-drive markets across Europe, the Middle East, and the Americas. We arrange RoRo or container shipping door-to-port or door-to-door, and manage customs clearance and registration paperwork on your behalf."
                    },
                    {
                        q: "How long does the whole process take?",
                        a: "Typically 8–12 weeks from confirmed inquiry to delivery: 1–2 weeks to source and win the car at auction, 4–8 weeks shipping depending on destination, then customs clearance and local registration. You get live milestone updates the whole way."
                    },
                    {
                        q: "Is my payment protected?",
                        a: "Yes. Funds are held securely until your vehicle is confirmed, inspected, and cleared for shipment, and every car is covered by comprehensive marine insurance door-to-door. Providence is an established UK-based sourcing and export company with a global office network."
                    }
                ]
            }
        ]
    }
};