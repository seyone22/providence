import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/Footer";
import { GoogleTagManager } from '@next/third-parties/google';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "World’s Largest Borderless Showroom | Global Car Sourcing & Direct Import",
        template: "%s | Providence Auto",
    },
    description: "Source any car from 40+ global markets with Providence Auto. We provide tax-efficient, premium pre-owned vehicles delivered with zero logistical friction.",
    keywords: [
        "Global car sourcing", "direct car import service", "tax-efficient vehicle procurement",
        "borderless car showroom", "luxury car exporter London", "buy cars from overseas",
        "7-seater family SUVs", "luxury executive sedans", "premium electric vehicles",
        "high-performance supercars", "right-hand drive imports"
    ],
    authors: [{ name: "Providence Auto" }],
    creator: "Providence Auto",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://providenceauto.co.uk/",
        siteName: "Providence Auto",
        title: "World’s Largest Borderless Showroom | Global Car Sourcing",
        description: "Save on luxury SUVs, sedans, and performance cars by cutting out the middleman. Direct delivery to your port.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Providence Auto Global Car Sourcing",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Providence Auto | Global Car Sourcing & Direct Import",
        description: "Source premium vehicles from 40+ global markets tax-efficiently.",
        images: ["/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    // Structured Data for SEO/AEO
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "AutoDealer",
        "name": "Providence Auto",
        "url": "https://providenceauto.co.uk/",
        "logo": "https://providenceauto.co.uk/logo.png",
        "description": "Global borderless showroom sourcing premium vehicles from 40+ markets.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "468 Church Lane, Kingsbury",
            "addressLocality": "London",
            "postalCode": "NW9 8UA",
            "addressCountry": "UK"
        },
        "telephone": "+44 208 004 3000",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Global Car Sourcing",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "B2C Direct Car Import",
                        "description": "Direct vehicle sourcing for individual buyers to save on local dealer markups."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "B2B Dealership Inventory Scaling",
                        "description": "Bulk sourcing and logistical handling for car dealerships worldwide."
                    }
                }
            ]
        }
    };

    const categorySchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Luxury Sedans" },
            { "@type": "ListItem", "position": 2, "name": "7-Seater SUVs" },
            { "@type": "ListItem", "position": 3, "name": "Electric Vehicles (BEV/PHEV)" },
            { "@type": "ListItem", "position": 4, "name": "High-Performance Sports Cars" },
            { "@type": "ListItem", "position": 5, "name": "Executive Coupes" }
        ]
    };

    return (
        <html lang="en">
        <head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
            />
        </head>
        <GoogleTagManager gtmId="GTM-K7GCCZXQ" />
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <div className="flex-1">
            {children}
        </div>
        <Footer />
        </body>
        </html>
    );
}