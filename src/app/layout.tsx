import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// --- Metadata Configuration ---
export const metadata: Metadata = {
    title: {
        default: "Providence Auto | Premium Pre-Owned Vehicles",
        template: "%s | Providence Auto", // Allows sub-pages to be "Inventory | Providence Auto"
    },
    description: "Find your next high-quality vehicle at Providence Auto. Browse our extensive inventory of premium cars, trucks, and SUVs with competitive financing options.",
    keywords: ["Providence Auto", "car dealership", "used cars", "premium vehicles", "auto sales", "financing"],
    authors: [{ name: "Providence Auto" }],
    creator: "Providence Auto",

    // Favicon Configuration
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico", // Recommended for iOS home screen bookmarks
    },

    // OpenGraph (Social Media display)
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://www.providenceauto.com", // Replace with your actual domain
        siteName: "Providence Auto",
        title: "Providence Auto | Premium Pre-Owned Vehicles",
        description: "Quality vehicles and transparent financing. Visit Providence Auto today.",
        images: [
            {
                url: "/og-image.jpg", // Create a 1200x630 image for social sharing
                width: 1200,
                height: 630,
                alt: "Providence Auto Showroom",
            },
        ],
    },

    // Twitter/X Cards
    twitter: {
        card: "summary_large_image",
        title: "Providence Auto | Premium Pre-Owned Vehicles",
        description: "Browse our inventory of premium cars and SUVs.",
        images: ["/og-image.jpg"],
    },

    // Robots (SEO crawling instructions)
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
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}