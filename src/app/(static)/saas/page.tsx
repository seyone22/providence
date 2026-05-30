"use client";

import MinimalHeader from "@/components/MinimalHeader";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Globe, RefreshCw, LayoutDashboard, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, appleEase } from "@/components/Reveal";

export default function SaaSSignup() {
    const [activeTab, setActiveTab] = useState(0);

    const features = [
        {
            title: "Global Access Integration",
            desc: "Embed our global stock directly onto your website.",
            icon: <Globe className="w-6 h-6" />,
            // Clean, bright image of a modern global workspace/digital network
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"
        },
        {
            title: "Automated Fulfillment",
            desc: "Customers request a car, you make the commission, the system handles the sourcing and shipping automatically.",
            icon: <RefreshCw className="w-6 h-6" />,
            // Premium logistics/shipping aesthetic
            image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop"
        },
        {
            title: "Real-Time Dashboard",
            desc: "Track every vehicle's journey across the ocean, manage customer requests, and see your margins in one beautiful interface.",
            icon: <LayoutDashboard className="w-6 h-6" />,
            // Clean analytics/dashboard aesthetic
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop"
        }
    ];

    return (
        <main className="min-h-screen bg-white text-black relative font-sans overflow-x-hidden selection:bg-black/10 selection:text-black">

            {/* Gradient mesh background (hero band) */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[760px] z-0 overflow-hidden">
                <div className="pa-mesh absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
            </div>

            <MinimalHeader />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 pt-40">

                {/* === HERO SECTION === */}
                <div className="text-center mb-32 max-w-4xl mx-auto">
                    <Reveal immediate y={30} scale={0.95} delay={0.1} duration={1}>
                        <h1 className="pa-headline-gradient text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[1.05]">
                            Welcome to the<br />Global Portal.
                        </h1>
                    </Reveal>

                    <Reveal
                        immediate
                        as="p"
                        y={20}
                        delay={0.3}
                        duration={0.8}
                        className="text-2xl md:text-3xl text-zinc-500 font-medium tracking-tight mb-6"
                    >
                        Transform your website into a borderless lot.
                    </Reveal>

                    <Reveal
                        immediate
                        as="p"
                        y={20}
                        delay={0.4}
                        duration={0.8}
                        className="text-xl text-zinc-400 font-light max-w-2xl mx-auto"
                    >
                        The ultimate B2B sourcing software. Fulfill customer inquiries faster, manage global orders seamlessly, and leverage AI to find the perfect vehicles.
                    </Reveal>
                </div>

                {/* === THE PROBLEM === */}
                <Reveal
                    y={40}
                    duration={0.8}
                    className="bg-zinc-50 border border-black/5 rounded-[3rem] p-12 md:p-16 mb-32 text-center max-w-4xl mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-shadow duration-500"
                >
                    <h2 className="text-red-500 font-bold tracking-[0.2em] uppercase text-sm mb-6">The Bottleneck</h2>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 text-black tracking-tight">Manual sourcing doesn't scale.</h3>
                    <p className="text-zinc-500 text-lg md:text-xl leading-relaxed font-light">
                        Tracking shipments on spreadsheets, checking dozens of international sites, and manually calculating import taxes is a barrier to your growth. It's time to let software do the heavy lifting.
                    </p>
                </Reveal>

                {/* === INTERACTIVE TABS (THE SOLUTION) === */}
                <div className="mb-32">
                    <Reveal y={40} duration={0.8} className="text-center mb-16">
                        <h2 className="text-blue-600 font-bold tracking-[0.2em] uppercase text-sm mb-4">The Solution</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-black tracking-tight">Your New Unfair Advantage.</h3>
                    </Reveal>

                    <div className="grid lg:grid-cols-2 gap-12 items-center bg-zinc-50 border border-black/5 rounded-[3rem] p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.03)]">

                        {/* Tabs List */}
                        <div className="space-y-4 flex flex-col justify-center h-full">
                            {features.map((feature, idx) => (
                                <Reveal key={idx} x={-20} y={0} delay={idx * 0.1} duration={0.5}>
                                    <button
                                        onClick={() => setActiveTab(idx)}
                                        className={`w-full text-left p-6 md:p-8 rounded-[2rem] transition-all duration-300 relative overflow-hidden ${
                                            activeTab === idx
                                                ? "bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/5"
                                                : "hover:bg-black/5 border border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                    >
                                        <div className="relative z-10 flex items-center gap-5 mb-3">
                                            <div className={`p-3 rounded-2xl transition-colors duration-300 ${activeTab === idx ? "bg-black text-white" : "bg-black/10 text-black"}`}>
                                                {feature.icon}
                                            </div>
                                            <h4 className="text-2xl font-bold text-black tracking-tight">{feature.title}</h4>
                                        </div>
                                        <p className="text-zinc-500 text-lg font-light leading-relaxed pl-[4.5rem] relative z-10">{feature.desc}</p>
                                    </button>
                                </Reveal>
                            ))}
                        </div>

                        {/* Visual Display (Crossfading Images) */}
                        <div className="h-[400px] lg:h-[600px] w-full rounded-[2.5rem] bg-zinc-100 border border-black/5 relative overflow-hidden shadow-inner">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.6, ease: appleEase }}
                                    className="absolute inset-0"
                                >
                                    <img
                                        src={features[activeTab].image}
                                        alt={features[activeTab].title}
                                        className="object-cover object-center h-[400px] lg:h-[600px]"
                                        height="600px"
                                    />
                                    {/* Subtle inner shadow overlay to make the image feel embedded */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* === THE FOMO & FINAL CTA === */}
                <Reveal
                    y={40}
                    scale={0.95}
                    duration={1}
                    className="text-center max-w-4xl mx-auto py-20 border-t border-black/5"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight">Don't get left behind.</h2>
                    <p className="text-zinc-500 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">
                        Technology is moving fast. Dealerships using our SaaS tool are fulfilling orders in days, while traditional dealers spend weeks making calls. Stop artificially capping your revenue.
                    </p>

                    <Link href="/signup" className="group inline-flex items-center justify-center gap-3 bg-black text-white px-10 py-5 rounded-full text-xl font-bold hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-300">
                        Sign up now — Free Forever
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Reveal>
            </div>
        </main>
    );
}