"use client";

import MinimalHeader from "@/app/components/MinimalHeader";
import Link from "next/link";
import { useState } from "react";
import { Globe, RefreshCw, LayoutDashboard } from "lucide-react";

export default function SaaSSignup() {
    const [activeTab, setActiveTab] = useState(0);

    const features = [
        {
            title: "Global Access Integration",
            desc: "Embed our global stock directly onto your website.",
            icon: <Globe className="w-6 h-6" />
        },
        {
            title: "Automated Fulfillment",
            desc: "Customers request a car, you make the commission, the system handles the sourcing and shipping automatically.",
            icon: <RefreshCw className="w-6 h-6" />
        },
        {
            title: "Real-Time Dashboard",
            desc: "Track every vehicle's journey across the ocean, manage customer requests, and see your margins in one beautiful interface.",
            icon: <LayoutDashboard className="w-6 h-6" />
        }
    ];

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white relative">
            <MinimalHeader />

            <div className="max-w-6xl mx-auto px-6 py-24 pt-32">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                        Welcome to the<br />Global Sourcing Portal.
                    </h1>
                    <p className="text-2xl text-gray-300 tracking-tight mb-4">
                        Transform your website into a borderless lot.
                    </p>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                        The ultimate B2B sourcing software. Fulfill customer inquiries faster, manage global orders seamlessly, and leverage AI to find the perfect vehicles.
                    </p>
                </div>

                {/* The Problem */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-10 mb-16 text-center max-w-4xl mx-auto">
                    <h2 className="text-red-400 font-semibold tracking-widest uppercase text-sm mb-4">The Problem</h2>
                    <h3 className="text-3xl font-bold mb-4 text-white">Manual sourcing doesn't scale.</h3>
                    <p className="text-gray-400 text-lg">
                        Tracking shipments on spreadsheets, checking dozens of international sites, and manually calculating import taxes is a bottleneck to your growth. It's time to automate.
                    </p>
                </div>

                {/* Interactive Tabs (The Solution) */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-blue-400 font-semibold tracking-widest uppercase text-sm mb-4">The Solution</h2>
                        <h3 className="text-4xl font-bold text-white">Your New Unfair Competitive Advantage.</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center bg-white/5 border border-white/10 rounded-[2rem] p-8 overflow-hidden">
                        {/* Tabs List */}
                        <div className="space-y-4">
                            {features.map((feature, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`w-full text-left p-6 rounded-2xl transition-all ${
                                        activeTab === idx
                                            ? "bg-white/10 border border-white/20 shadow-lg"
                                            : "hover:bg-white/5 border border-transparent opacity-60 hover:opacity-100"
                                    }`}
                                >
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className={activeTab === idx ? "text-white" : "text-gray-500"}>
                                            {feature.icon}
                                        </div>
                                        <h4 className="text-xl font-bold text-white">{feature.title}</h4>
                                    </div>
                                    <p className="text-gray-400 pl-10">{feature.desc}</p>
                                </button>
                            ))}
                        </div>

                        {/* Visual Display based on active tab */}
                        <div className="h-[400px] rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-white/10 flex items-center justify-center p-8 relative overflow-hidden">
                            {/* Abstract visual representation instead of an actual image for now */}
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700 via-gray-900 to-black"></div>
                            <div className="text-center z-10">
                                <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white">
                                    {features[activeTab].icon}
                                </div>
                                <h5 className="text-2xl font-bold text-white mb-2">{features[activeTab].title}</h5>
                                <p className="text-gray-500 text-sm">System Interface Mockup</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The FOMO & Final CTA */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-white">Don't get left behind.</h2>
                    <p className="text-gray-400 text-lg mb-12">
                        Technology is moving fast. Dealerships using our SaaS tool are fulfilling orders in days, while traditional dealers are spending weeks making phone calls. If you don't adopt tech-driven sourcing, you are artificially capping your own revenue.
                    </p>

                    <Link href="/signup" className="inline-block bg-black border border-gray-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-white hover:text-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] transition-all">
                        Sign up now, IT'S FREE FOREVER!
                    </Link>
                </div>
            </div>
        </main>
    );
}