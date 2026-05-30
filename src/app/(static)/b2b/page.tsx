"use client";

import MinimalHeader from "@/components/MinimalHeader";
import Link from "next/link";
import { Layers, ShieldCheck, Globe, Zap } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import GradientMesh from "@/components/GradientMesh";

export default function B2BLanding() {
    return (
        <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
            <MinimalHeader />

            {/* SECTION 1: The Hero */}
            <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 overflow-hidden">

                {/* === HERO IMAGE + GRADIENT MESH BACKGROUND === */}
                <GradientMesh image="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=3000&auto=format&fit=crop" />

                <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center mt-12">
                    {/* Above-the-fold hero content animates on mount so it shows immediately on load. */}
                    <Reveal immediate y={30} scale={0.95} duration={1}>
                        <h1 className="pa-headline-gradient text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[1.05] drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                            Inventory.<br />On Demand.
                        </h1>
                    </Reveal>

                    <Reveal
                        immediate
                        as="p"
                        y={20}
                        delay={0.15}
                        duration={0.8}
                        className="text-2xl md:text-3xl text-black font-medium tracking-tight mb-12 max-w-2xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                    >
                        Scale your lot without the overhead.
                    </Reveal>

                    <Reveal
                        immediate
                        y={20}
                        delay={0.3}
                        duration={0.8}
                        className="flex flex-col sm:flex-row gap-6 w-full justify-center"
                    >
                        <Link href="/request" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                            <span className="relative z-10">Request a Car Now</span>
                        </Link>
                        <Link href="/saas" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-white border border-black/10 rounded-full backdrop-blur-xl transition-all hover:bg-black hover:text-white shadow-md">
                            Sign Up for the Platform
                        </Link>
                    </Reveal>
                </div>
            </section>

            {/* SECTION 2: The Cinematic Statement */}
            <section className="py-32 md:py-48 px-6 bg-zinc-50 relative border-y border-black/5">
                <div className="max-w-5xl mx-auto text-center">
                    <Reveal
                        as="p"
                        y={40}
                        scale={0.98}
                        duration={1}
                        className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-400"
                    >
                        We act as your <span className="text-black drop-shadow-sm">Virtual Warehouse</span>, giving your dealership the inventory power of a global conglomerate. Access over <span className="text-black drop-shadow-sm">100 global markets</span> to find the exact trims your customers are begging for.
                    </Reveal>
                </div>
            </section>

            {/* SECTION 4: The Bento Box (Uniform Grid) */}
            <section className="py-24 px-6 max-w-7xl mx-auto bg-white relative z-10">
                <Reveal y={40} duration={0.8} className="mb-16 text-center lg:text-left">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black">
                        Your Power Advantages.
                    </h2>
                </Reveal>

                {/* Uniform Grid: 1 column on mobile, 2 columns on medium screens and up */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-[280px]">

                    {/* Uniform Item 1 */}
                    <Reveal
                        y={40}
                        duration={0.8}
                        className="bg-zinc-50 border border-black/5 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="absolute top-8 left-8 p-4 bg-white border border-black/5 rounded-2xl shadow-sm group-hover:bg-black transition-colors duration-500">
                            <Globe className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-2 relative z-10">Sell Beyond Your Lot</h3>
                        <p className="text-zinc-500 text-lg relative z-10 font-light">We allow you to sell cars you don't physically have. Borderless inventory.</p>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/5 rounded-full blur-[80px] group-hover:bg-blue-600/10 transition-colors duration-500" />
                    </Reveal>

                    {/* Uniform Item 2 */}
                    <Reveal
                        y={40}
                        duration={0.8}
                        className="bg-zinc-50 border border-black/5 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="absolute top-8 left-8 p-4 bg-white border border-black/5 rounded-2xl shadow-sm group-hover:bg-black transition-colors duration-500">
                            <ShieldCheck className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-2 relative z-10">We Handle the Hard Stuff</h3>
                        <p className="text-zinc-500 text-lg relative z-10 font-light">Bill of Lading, HS Codes, and Marine Insurance? Entirely done.</p>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/5 rounded-full blur-[80px] group-hover:bg-blue-600/10 transition-colors duration-500" />
                    </Reveal>

                    {/* Uniform Item 3 */}
                    <Reveal
                        y={40}
                        duration={0.8}
                        className="bg-zinc-50 border border-black/5 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="absolute top-8 left-8 p-4 bg-white border border-black/5 rounded-2xl shadow-sm group-hover:bg-black transition-colors duration-500">
                            <Layers className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-2 relative z-10">Virtual Warehouse</h3>
                        <p className="text-zinc-500 text-lg relative z-10 font-light">Your custom-branded dashboard keeps everything tracked.</p>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/5 rounded-full blur-[80px] group-hover:bg-blue-600/10 transition-colors duration-500" />
                    </Reveal>

                    {/* Uniform Item 4 */}
                    <Reveal
                        y={40}
                        duration={0.8}
                        className="bg-zinc-50 border border-black/5 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="absolute top-8 left-8 p-4 bg-white border border-black/5 rounded-2xl shadow-sm group-hover:bg-black transition-colors duration-500">
                            <Zap className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-2 relative z-10">Global Power</h3>
                        <p className="text-zinc-500 text-lg relative z-10 font-light">Give your local lot the operational power of a global conglomerate.</p>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/5 rounded-full blur-[80px] group-hover:bg-blue-600/10 transition-colors duration-500" />
                    </Reveal>

                </div>
            </section>

            {/* SECTION 5: Final Call to Action */}
            <section className="relative py-32 px-6 flex justify-center border-t border-black/5 bg-zinc-50 overflow-hidden">
                <GradientMesh fade={false} />
                <Reveal y={40} scale={0.95} duration={1} className="relative z-10">
                    <Link href="/saas" className="group flex flex-col items-center">
                        <p className="text-zinc-400 font-medium mb-4 group-hover:text-black transition-colors">Ready to scale?</p>
                        <h2 className="pa-headline-gradient text-4xl md:text-6xl font-bold tracking-tighter flex items-center gap-4">
                            Join the Network
                            <span className="bg-black text-white rounded-full p-3 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-300 shadow-md">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </span>
                        </h2>
                    </Link>
                </Reveal>
            </section>
        </main>
    );
}
