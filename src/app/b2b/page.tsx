import MinimalHeader from "@/app/components/MinimalHeader"; // Ensure path is correct
import Link from "next/link";
import { Layers, ShieldCheck, Globe, Zap } from "lucide-react";

export default function B2BLanding() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white font-sans overflow-x-hidden">
            <MinimalHeader />

            {/* SECTION 1: The Hero */}
            <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20">
                {/* Subtle top light leak */}
                <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(50,50,70,0.3)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />

                <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/20">
                        Inventory.<br />On Demand.
                    </h1>
                    <p className="text-2xl md:text-3xl text-zinc-400 font-medium tracking-tight mb-12 max-w-2xl">
                        Scale your lot without the overhead.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                        <Link href="/request" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105">
                            <span className="relative z-10">Request a Car Now</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/saas" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-white/5 border border-white/10 rounded-full backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20">
                            Sign Up for the Platform
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 2: The Cinematic Statement */}
            <section className="py-32 md:py-48 px-6 bg-zinc-950 relative">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-500">
                        We act as your <span className="text-white">Virtual Warehouse</span>, giving your dealership the inventory power of a global conglomerate. Access over <span className="text-white">100 global markets</span> to find the exact trims your customers are begging for.
                    </p>
                </div>
            </section>

            {/* SECTION 3: The Pitch / Financial Optimizer */}
            <section className="py-24 px-6 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-sm font-bold tracking-[0.3em] text-zinc-500 uppercase mb-8">The Strategy</h2>
                    <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-light">
                        Stop fighting over high local auction prices and limited stock variety. We aren't just a shipper; we are a <span className="font-semibold text-white">financial optimizer</span>. We find where a specific vehicle is cheapest globally, factoring in local market saturation and currency fluctuations to bypass heavy local markups.
                    </p>
                </div>
            </section>

            {/* SECTION 4: The Bento Box (Advantages Grid) */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                        Your Power Advantages.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">

                    {/* Bento Item 1 (Spans 2 columns on large screens) */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group">
                        <div className="absolute top-8 left-8 p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                            <Globe className="text-white h-6 w-6" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Sell Beyond Your Lot</h3>
                        <p className="text-zinc-400 text-lg max-w-md">We allow you to sell cars you don't even physically have on your lot. Borderless inventory.</p>
                        {/* Subtle background glow on hover */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 blur-[100px] group-hover:bg-blue-600/40 transition-colors" />
                    </div>

                    {/* Bento Item 2 */}
                    <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group">
                        <div className="absolute top-8 left-8 p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                            <ShieldCheck className="text-white h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">We Handle the Hard Stuff</h3>
                        <p className="text-zinc-400">Bill of Lading, HS Codes, and Marine Insurance? Done.</p>
                    </div>

                    {/* Bento Item 3 */}
                    <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group">
                        <div className="absolute top-8 left-8 p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                            <Layers className="text-white h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Virtual Warehouse</h3>
                        <p className="text-zinc-400">Your custom-branded dashboard keeps everything tracked.</p>
                    </div>

                    {/* Bento Item 4 (Spans 2 columns on large screens) */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group">
                        <div className="absolute top-8 left-8 p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                            <Zap className="text-white h-6 w-6" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Global Power</h3>
                        <p className="text-zinc-400 text-lg max-w-md">We give a small, local dealer the operational and inventory power of a massive global conglomerate.</p>
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none" />
                    </div>

                </div>
            </section>

            {/* SECTION 5: Final Call to Action */}
            <section className="py-32 px-6 flex justify-center border-t border-white/5 bg-black">
                <Link href="/saas" className="group flex flex-col items-center">
                    <p className="text-zinc-500 font-medium mb-4 group-hover:text-white transition-colors">Ready to scale?</p>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white flex items-center gap-4">
                        Join the Network
                        <span className="bg-white text-black rounded-full p-2 group-hover:rotate-45 transition-transform">
                            {/* Simple SVG Arrow */}
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </span>
                    </h2>
                </Link>
            </section>
        </main>
    );
}