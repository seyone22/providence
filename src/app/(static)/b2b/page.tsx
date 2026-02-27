"use client";

import MinimalHeader from "@/app/components/MinimalHeader";
import Link from "next/link";
import { Layers, ShieldCheck, Globe, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// Apple-style smooth easing curve
const appleEase: any = [0.16, 1, 0.3, 1];

export default function B2BLanding() {
    return (
        <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
            <MinimalHeader />

            {/* SECTION 1: The Hero */}
            <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 overflow-hidden">

                {/* === NEW BACKGROUND IMAGE LAYER === */}
                <motion.div
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: appleEase }}
                    className="absolute inset-0 z-0 pointer-events-none"
                >
                    <img
                        src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=3000&auto=format&fit=crop"
                        alt="Premium automotive inventory"
                        className="object-cover object-center"
                        style={{height:'100vh', objectFit: 'cover'}}
                    />
                    {/* Drastically reduced the white wash and added a slight blur for text readability */}
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 bg-linear-to-t from-white via-white/20 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_100%)]" />
                </motion.div>

                {/* Subtle top light gradient to give depth */}
                <div className="absolute top-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.05)_0%,rgba(255,255,255,0)_70%)] pointer-events-none z-0" />

                <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center mt-12">
                    <motion.div
                        initial={{ y: 30, opacity: 0, scale: 0.95 }}
                        whileInView={{ y: 0, opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.2 }} // Animate on scroll up AND down
                        transition={{ duration: 1, ease: appleEase }}
                    >
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-black via-black/80 to-black/60 leading-[1.05] drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                            Inventory.<br />On Demand.
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: appleEase }}
                        className="text-2xl md:text-3xl text-black font-medium tracking-tight mb-12 max-w-2xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                    >
                        Scale your lot without the overhead.
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: appleEase }}
                        className="flex flex-col sm:flex-row gap-6 w-full justify-center"
                    >
                        <Link href="/request" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                            <span className="relative z-10">Request a Car Now</span>
                        </Link>
                        <Link href="/saas" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-white border border-black/10 rounded-full backdrop-blur-xl transition-all hover:bg-black hover:text-white shadow-md">
                            Sign Up for the Platform
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: The Cinematic Statement */}
            <section className="py-32 md:py-48 px-6 bg-zinc-50 relative border-y border-black/5">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.p
                        initial={{ y: 40, opacity: 0, scale: 0.98 }}
                        whileInView={{ y: 0, opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.5 }} // Triggers again when scrolling back up
                        transition={{ duration: 1, ease: appleEase }}
                        className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-400"
                    >
                        We act as your <span className="text-black drop-shadow-sm">Virtual Warehouse</span>, giving your dealership the inventory power of a global conglomerate. Access over <span className="text-black drop-shadow-sm">100 global markets</span> to find the exact trims your customers are begging for.
                    </motion.p>
                </div>
            </section>

            {/* SECTION 4: The Bento Box (Uniform Grid) */}
            <section className="py-24 px-6 max-w-7xl mx-auto bg-white relative z-10">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: appleEase }}
                    className="mb-16 text-center lg:text-left"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black">
                        Your Power Advantages.
                    </h2>
                </motion.div>

                {/* Uniform Grid: 1 column on mobile, 2 columns on medium screens and up */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-[280px]">

                    {/* Uniform Item 1 */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: appleEase }} // No delay, animates with the others
                        className="bg-zinc-50 border border-black/5 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="absolute top-8 left-8 p-4 bg-white border border-black/5 rounded-2xl shadow-sm group-hover:bg-black transition-colors duration-500">
                            <Globe className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-2 relative z-10">Sell Beyond Your Lot</h3>
                        <p className="text-zinc-500 text-lg relative z-10 font-light">We allow you to sell cars you don't physically have. Borderless inventory.</p>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/5 rounded-full blur-[80px] group-hover:bg-blue-600/10 transition-colors duration-500" />
                    </motion.div>

                    {/* Uniform Item 2 */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: appleEase }}
                        className="bg-zinc-50 border border-black/5 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="absolute top-8 left-8 p-4 bg-white border border-black/5 rounded-2xl shadow-sm group-hover:bg-black transition-colors duration-500">
                            <ShieldCheck className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-2 relative z-10">We Handle the Hard Stuff</h3>
                        <p className="text-zinc-500 text-lg relative z-10 font-light">Bill of Lading, HS Codes, and Marine Insurance? Entirely done.</p>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/5 rounded-full blur-[80px] group-hover:bg-blue-600/10 transition-colors duration-500" />
                    </motion.div>

                    {/* Uniform Item 3 */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: appleEase }}
                        className="bg-zinc-50 border border-black/5 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="absolute top-8 left-8 p-4 bg-white border border-black/5 rounded-2xl shadow-sm group-hover:bg-black transition-colors duration-500">
                            <Layers className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-2 relative z-10">Virtual Warehouse</h3>
                        <p className="text-zinc-500 text-lg relative z-10 font-light">Your custom-branded dashboard keeps everything tracked.</p>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/5 rounded-full blur-[80px] group-hover:bg-blue-600/10 transition-colors duration-500" />
                    </motion.div>

                    {/* Uniform Item 4 */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: appleEase }}
                        className="bg-zinc-50 border border-black/5 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="absolute top-8 left-8 p-4 bg-white border border-black/5 rounded-2xl shadow-sm group-hover:bg-black transition-colors duration-500">
                            <Zap className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-2 relative z-10">Global Power</h3>
                        <p className="text-zinc-500 text-lg relative z-10 font-light">Give your local lot the operational power of a global conglomerate.</p>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/5 rounded-full blur-[80px] group-hover:bg-blue-600/10 transition-colors duration-500" />
                    </motion.div>

                </div>
            </section>

            {/* SECTION 5: Final Call to Action */}
            <section className="py-32 px-6 flex justify-center border-t border-black/5 bg-zinc-50 overflow-hidden">
                <motion.div
                    initial={{ y: 40, opacity: 0, scale: 0.95 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 1, ease: appleEase }}
                >
                    <Link href="/saas" className="group flex flex-col items-center">
                        <p className="text-zinc-400 font-medium mb-4 group-hover:text-black transition-colors">Ready to scale?</p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black flex items-center gap-4">
                            Join the Network
                            <span className="bg-black text-white rounded-full p-3 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-300 shadow-md">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </span>
                        </h2>
                    </Link>
                </motion.div>
            </section>
        </main>
    );
}