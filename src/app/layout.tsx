import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/Footer";
import { GoogleTagManager } from '@next/third-parties/google'; //

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
        default: "Providence Auto | Premium Pre-Owned Vehicles",
        template: "%s | Providence Auto",
    },
    description: "Find your next high-quality vehicle at Providence Auto. Browse our extensive inventory of premium cars, trucks, and SUVs with competitive financing options.",
    keywords: ["Providence Auto", "car dealership", "used cars", "premium vehicles", "auto sales", "financing"],
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
        url: "https://www.providenceauto.com",
        siteName: "Providence Auto",
        title: "Providence Auto | Premium Pre-Owned Vehicles",
        description: "Quality vehicles and transparent financing. Visit Providence Auto today.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Providence Auto Showroom",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Providence Auto | Premium Pre-Owned Vehicles",
        description: "Browse our inventory of premium cars and SUVs.",
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
    return (
        <html lang="en">
        {/* 1. GTM Component added here handles the script in <head> and fallback in <body> */}
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