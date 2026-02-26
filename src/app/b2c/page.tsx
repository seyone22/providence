"use client";

import { useRef } from "react";
import MinimalHeader from "@/app/components/MinimalHeader";
import Image from "next/image";
import Link from "next/link";
import { Landmark, Compass, Ship, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

// Apple-style smooth easing curve for initial page load
const appleEase: any = [0.16, 1, 0.3, 1];

export default function B2CLanding() {
    // 1. Setup Scroll Tracking for the Hero Section
    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"] // Tracks from top of page to bottom of hero
    });

    // Transform values: As you scroll down, scale shrinks to 0.8, fades to 0, and moves down slightly
    const heroScale = useTransform(heroScroll, [0, 1], [1, 0.8]);
    const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
    const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);

    // 2. Setup Scroll Tracking for the Manifesto Section
    const manifestoRef = useRef(null);
    const { scrollYProgress: manifestoScroll } = useScroll({
        target: manifestoRef,
        offset: ["start end", "center center"] // Tracks as it enters the screen until it hits the middle
    });

    // Transform values: As it enters the screen, it grows from 0.85 to 1
    const manifestoScale = useTransform(manifestoScroll, [0, 1], [0.85, 1]);
    const manifestoOpacity = useTransform(manifestoScroll, [0, 1], [0.3, 1]);

    return (
        <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
            <MinimalHeader />

            {/* SECTION 1: The Cinematic Dark Hero */}
            {/* Note the bg-black here to keep this section dark */}
            <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 bg-black overflow-hidden">
                {/* Background Image Wrapper */}
                <motion.div
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: appleEase }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="/black-car.avif" // Back to the dark, sexy car
                        alt="Providence Auto Premium Sourcing"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                    {/* Dark Gradients to make the white text pop */}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-transparent h-1/2" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </motion.div>

                {/* SCROLL-BOUND CONTAINER: This shrinks and fades as you scroll down */}
                <motion.div
                    style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
                    className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center mt-12"
                >
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
                        className="text-sm font-bold tracking-[0.4em] text-zinc-400 uppercase mb-8"
                    >
                        Direct Import Network
                    </motion.p>

                    <motion.h1
                        initial={{ y: 30, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: appleEase }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40 leading-[1.1]"
                    >
                        The Global Shortcut to<br />Your Dream Car.
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: appleEase }}
                        className="text-xl md:text-3xl text-zinc-300 font-medium tracking-tight mb-12 max-w-2xl"
                    >
                        Don't settle for what's on the lot.
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
                    >
                        <Link href="/request" className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                            <span className="relative z-10 flex items-center gap-2">
                                Begin Your Inquiry <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* SECTION 2: The Manifesto */}
            <section ref={manifestoRef} className="py-32 md:py-48 px-6 bg-white border-y border-black/5 relative z-10 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center">
                    {/* SCROLL-BOUND TEXT: This grows and fades in as you scroll down to it */}
                    <motion.p
                        style={{ scale: manifestoScale, opacity: manifestoOpacity }}
                        className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-400"
                    >
                        For the last 12 years, we’ve supplied the top car dealers in your country. For the first time ever, we are <span className="text-black drop-shadow-sm">cutting out the middleman</span> and offering our global sourcing network <span className="text-black drop-shadow-sm">directly to you</span>.
                    </motion.p>
                </div>
            </section>

            {/* SECTION 3: Features (White theme retained) */}
            <section className="py-32 px-6 max-w-7xl mx-auto bg-white relative z-10">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: appleEase }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6">
                        Never compromise again.
                    </h2>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light">
                        We are industry experts. We know exactly where to source your desired vehicle for the cheapest price, with the exact specifications you demand.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                    {[
                        {
                            icon: Compass,
                            title: "Currency & Market Optimization",
                            desc: "We don't just find the car; we analyze global markets to optimize currency conversions, ensuring you buy from the most financially efficient country at that exact moment.",
                            glowColor: "group-hover:bg-blue-500/15" // Subtle blue
                        },
                        {
                            icon: Landmark,
                            title: "Mastery of Tax Law",
                            desc: "Importing luxury vehicles requires navigating complex tax codes. We know every loophole, tariff, and regulation to legally minimize your import duties.",
                            glowColor: "group-hover:bg-emerald-500/15" // Subtle green
                        },
                        {
                            icon: Ship,
                            title: "White-Glove Logistics",
                            desc: "From the showroom floor in Germany to your driveway. We handle every single form, marine insurance policy, and freight mile for you. Zero friction.",
                            glowColor: "group-hover:bg-indigo-500/15" // Subtle indigo
                        },
                        {
                            icon: ShieldCheck,
                            title: "12 Years of Heritage",
                            desc: "We aren't a startup guessing how to ship cars. We have over a decade of established infrastructure, delivering the most reliable service in the industry.",
                            glowColor: "group-hover:bg-amber-500/15" // Subtle amber
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 40, opacity: 0, scale: 0.95 }}
                            whileInView={{ y: 0, opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: appleEase }}
                            // Added 'group', 'overflow-hidden', and premium hover states
                            className="relative overflow-hidden group flex flex-col items-start p-8 rounded-[2rem] bg-transparent hover:bg-zinc-50 transition-all duration-500 border border-transparent hover:border-black/5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
                        >
                            {/* The Blurred Hover Effect Thingy */}
                            <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] bg-transparent transition-colors duration-700 ${feature.glowColor}`} />

                            {/* Content wrapped in z-10 to stay above the background glow */}
                            <div className="relative z-10">
                                <div className="p-4 bg-black/5 border border-black/10 rounded-2xl mb-6 inline-flex group-hover:bg-black transition-colors duration-500">
                                    <feature.icon className="text-black h-8 w-8 group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-black mb-4">{feature.title}</h3>
                                <p className="text-zinc-500 text-lg leading-relaxed font-light">
                                    {feature.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* SECTION 4: The Final Ask */}
            <section className="py-32 px-6 relative flex flex-col justify-center items-center bg-zinc-50 border-t border-black/5 z-10 overflow-hidden">
                <motion.div
                    initial={{ y: 40, opacity: 0, scale: 0.95 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: appleEase }}
                    className="relative z-10 text-center max-w-4xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black mb-8">
                        Tell us exactly what you want.
                    </h2>
                    <p className="text-xl md:text-2xl text-zinc-500 font-light mb-12">
                        Like a <span className="text-black font-medium">2023 Defender in Fuji White</span>. Our team will generate a fully-landed Sourcing Quote within 24 hours.
                    </p>

                    <Link href="/request" className="inline-flex items-center justify-center px-12 py-6 text-xl font-bold text-white bg-black rounded-full transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                        Tell Us What You Want
                    </Link>
                </motion.div>
            </section>
        </main>
    );
}