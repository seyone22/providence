"use client";

import { useRef } from "react";
import MinimalHeader from "@/app/components/MinimalHeader";
import { Landmark, Compass, Ship, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import RequestForm from "@/app/components/requestForm";

const appleEase: any = [0.16, 1, 0.3, 1];

export default function B2CLanding() {
    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroScale = useTransform(heroScroll, [0, 1], [1, 0.8]);
    const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
    const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);

    const manifestoRef = useRef(null);
    const { scrollYProgress: manifestoScroll } = useScroll({
        target: manifestoRef,
        offset: ["start end", "center center"]
    });

    const manifestoScale = useTransform(manifestoScroll, [0, 1], [0.85, 1]);
    const manifestoOpacity = useTransform(manifestoScroll, [0, 1], [0.3, 1]);

    return (
        <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
            <MinimalHeader />

            <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 bg-white overflow-hidden">
                <motion.div
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: appleEase }}
                    className="absolute inset-0 z-0 pointer-events-none"
                >
                    <img
                        src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=3000&auto=format&fit=cover"
                        alt="Providence Auto Premium Sourcing"
                        className="object-cover object-center"
                        style={{height:'100vh', width:'100vw', objectFit: 'cover'}}
                    />
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-[30%]" />
                    <div className="absolute top-1/2 bottom-0 w-full bg-gradient-to-t from-white via-white/30 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7)_0%,transparent_50%)]" />
                </motion.div>

                <motion.div
                    style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
                    className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center mt-12"
                >
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
                        className="text-sm font-bold tracking-[0.4em] text-zinc-500 uppercase mb-8"
                    >
                        Direct Import Network
                    </motion.p>
                    <motion.h1
                        initial={{ y: 30, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: appleEase }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-black via-black/80 to-black/50 leading-[1.1] drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
                    >
                        The Global Shortcut to<br />Your Dream Car.
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: appleEase }}
                        className="text-xl md:text-3xl text-zinc-600 font-medium tracking-tight mb-12 max-w-2xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                    >
                        Don't settle for what's on the lot.
                    </motion.p>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
                    >
                        {/* UPDATED: Changed from Link to a anchor tag to scroll down smoothly to the form */}
                        <a href="#inquiry" className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                            <span className="relative z-10 flex items-center gap-2">
                                Begin Your Inquiry <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </a>
                    </motion.div>
                </motion.div>
            </section>

            <section ref={manifestoRef} className="py-32 md:py-48 px-6 bg-white border-y border-black/5 relative z-10 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.p
                        style={{ scale: manifestoScale, opacity: manifestoOpacity }}
                        className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-400"
                    >
                        For the last 12 years, we’ve supplied the top car dealers in your country. For the first time ever, we are <span className="text-black drop-shadow-sm">cutting out the middleman</span> and offering our global sourcing network <span className="text-black drop-shadow-sm">directly to you</span>.
                    </motion.p>
                </div>
            </section>

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
                        { icon: Compass, title: "Currency & Market Optimization", desc: "We don't just find the car; we analyze global markets to optimize currency conversions, ensuring you buy from the most financially efficient country at that exact moment.", glowColor: "group-hover:bg-blue-500/15" },
                        { icon: Landmark, title: "Mastery of Tax Law", desc: "Importing luxury vehicles requires navigating complex tax codes. We know every loophole, tariff, and regulation to legally minimize your import duties.", glowColor: "group-hover:bg-emerald-500/15" },
                        { icon: Ship, title: "White-Glove Logistics", desc: "From the showroom floor in Germany to your driveway. We handle every single form, marine insurance policy, and freight mile for you. Zero friction.", glowColor: "group-hover:bg-indigo-500/15" },
                        { icon: ShieldCheck, title: "12 Years of Heritage", desc: "We aren't a startup guessing how to ship cars. We have over a decade of established infrastructure, delivering the most reliable service in the industry.", glowColor: "group-hover:bg-amber-500/15" }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 40, opacity: 0, scale: 0.95 }}
                            whileInView={{ y: 0, opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: appleEase }}
                            className="relative overflow-hidden group flex flex-col items-start p-8 rounded-[2rem] bg-transparent hover:bg-zinc-50 transition-all duration-500 border border-transparent hover:border-black/5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
                        >
                            <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] bg-transparent transition-colors duration-700 ${feature.glowColor}`} />
                            <div className="relative z-10">
                                {/* Container: Turns blue on hover */}
                                <div className="p-4 bg-black/5 border border-black/10 rounded-2xl mb-6 inline-flex group-hover:bg-sky-500 group-hover:border-sky-500 transition-colors duration-500">
                                    {/* Icon: Starts blue, turns white on hover */}
                                    <feature.icon className="text-sky-500 h-8 w-8 group-hover:text-white transition-colors duration-500" />
                                </div>

                                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-sky-500 transition-colors duration-500">
                                    {feature.title}
                                </h3>

                                <p className="text-zinc-500 text-lg leading-relaxed font-light">
                                    {feature.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* SECTION 4: The Final Ask & Embedded Form */}
            {/* Added id="inquiry" so the hero button scrolls down here */}
            <section id="inquiry" className="py-32 px-6 relative flex flex-col justify-center items-center bg-zinc-50 border-t border-black/5 z-10 overflow-hidden">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: appleEase }}
                    className="relative z-10 text-center max-w-4xl mx-auto mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black mb-6">
                        Tell us exactly what you want.
                    </h2>
                    <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
                        Like a <span className="text-black font-medium">2023 Defender in Fuji White</span>. Our team will find that version in the global markets where it costs you the least.
                    </p>
                </motion.div>

                {/* Render the extracted component here */}
                <div className="w-full relative z-20">
                    <RequestForm />
                </div>

                {/* Subtle background glow behind the form */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
            </section>
        </main>
    );
}