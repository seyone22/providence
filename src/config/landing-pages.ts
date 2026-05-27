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
        title: "Premium LHD Japanese Imports | Providence Auto",
        description: "Explore a premium selection of luxury cars with Japanese specifications in left-hand drive (LHD) configuration."
    },
    hero: {
        tagline: "Providence Auto",
        title: "Luxury Japanese\nCars (LHD).",
        subtitle: "Premium left-hand drive imports sourced directly from Japan.",
        backgroundImage: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=3000&auto=format&fit=cover"
    },
    intro: {
        highlight: "Eliminate costly conversions.",
        text: "Explore a premium selection of luxury cars with Japanese specifications in left-hand drive (LHD) configuration, sourced directly from Japan's most reputable auctions, certified dealers, and private collectors. Choosing LHD simplifies registration and protects long-term resale value."
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
                name: "Alena Rosser",
                date: "3 hours ago",
                title: "Good quality and stylish.",
                desc: "The only issue I had was with the sizing, as some items ran a bit small, but the return process was smooth.",
                rating: 5
            },
            {
                name: "Mary Adams",
                date: "1 day ago",
                title: "Absolutely fantastic!",
                desc: "The styles are unique and the fit is just right. Shipping was fast and everything arrived in perfect condition.",
                rating: 5
            },
            {
                name: "Daniel Kim",
                date: "5 days ago",
                title: "Shop all the hottest trends",
                desc: "Shop all the hottest trends here, including dark denim, baggy low-rise jeans, and vintage jackets.",
                rating: 5
            }
        ]
    },
    featuredReview: {
        title: "Our review of the",
        carName: "Golf",
        text: "The Volkswagen Golf needs no introduction. For 50 years it has been a staple on British roads, becoming the definition of a mid-size family hatchback. However, times are a-changing and with the rise electrification and SUV...",
        rating: 4.0,
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2940&auto=format&fit=crop"
    },
    faqs: {
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know about our global direct import network.",
        categories: [
            {
                category: "Tax & Compliance",
                items: [
                    {
                        q: "Is this IRD compliant?",
                        a: "Yes, our reporting and documentation are fully compliant with Inland Revenue Department standards."
                    },
                    {
                        q: "What if I need help?",
                        a: "Our dedicated support team is available to assist you through every step of the import and compliance process."
                    },
                    {
                        q: "Will it help with deductions?",
                        a: "Yes, we provide fully itemized invoices suitable for commercial tax deductions."
                    },
                    {
                        q: "Do I need tax knowledge to use it?",
                        a: "Not at all. We handle the complex compliance requirements and provide ready-to-file documentation."
                    },
                    {
                        q: "Can I upload my T-10 forms?",
                        a: "Yes, our secure portal allows you to upload any necessary regional tax forms required for clearance."
                    },
                    {
                        q: "Can I use this if I'm self-employed or have foreign income?",
                        a: "Absolutely. Our importing structure accommodates a wide variety of personal and corporate income structures."
                    }
                ]
            }
        ]
    }
};