"use client";

import { useRef, Suspense } from "react";
import MinimalHeader from "@/components/MinimalHeader";
import { ArrowRight, Star, Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import RequestForm from "@/components/requestForm";
import FAQSection from "@/components/faqSection";
import { lhdCampaignConfig } from "@/config/landing-pages"; // Adjust path as needed
import VehicleShowcaseCarousel from "@/components/vehicleShowcaseCarousel";

const appleEase: any = [0.16, 1, 0.3, 1];

// Hardcoded array using the specific files you highlighted
const highlightedCarLogos = [
    { src: "/car_logo/Aston Martin Logo.png", alt: "Aston Martin" },
    { src: "/car_logo/ferrari logo.png", alt: "Ferrari" },
    { src: "/car_logo/lamborghini logo.png", alt: "Lamborghini" },
    { src: "/car_logo/land rover logo.png", alt: "Land Rover" },
    { src: "/car_logo/lexus logo.png", alt: "Lexus" },
    { src: "/car_logo/porsche logo.png", alt: "Porsche" },
    { src: "/car_logo/rolls royce logo.png", alt: "Rolls Royce" },
];

export default function ConfigurableLanding() {
    // In a real dynamic route, you would find the config by slug here.
    // For now, we use the hardcoded one.
    const config = lhdCampaignConfig;

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

            {/* Configurable Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center items-start px-6 pt-20 bg-white overflow-hidden">
                <motion.div
                    initial={{ scale: 1.05, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: appleEase }}
                    className="absolute inset-0 z-0 pointer-events-none"
                >
                    <img
                        src={config.hero.backgroundImage}
                        alt={config.hero.title}
                        className="object-cover object-center w-full h-full"
                    />
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-[30%]" />
                    <div className="absolute top-1/2 bottom-0 w-full bg-gradient-to-t from-white via-white/40 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7)_0%,transparent_50%)]" />
                </motion.div>

                <motion.div
                    style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
                    className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center mt-0"
                >
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
                        className="text-sm font-bold tracking-[0.4em] text-zinc-500 uppercase mb-8"
                    >
                        {config.hero.tagline}
                    </motion.p>
                    <motion.h1
                        initial={{ y: 30, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: appleEase }}
                        className="text-4xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-black via-black/80 to-black/50 leading-[1.1] drop-shadow-[0_0_15px_rgba(255,255,255,1)] whitespace-pre-line"
                    >
                        {config.hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: appleEase }}
                        className="text-xl md:text-3xl text-zinc-600 font-medium tracking-tight mb-12 max-w-2xl drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                    >
                        {config.hero.subtitle}
                    </motion.p>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
                    >
                        <a href="#inquiry" className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-black rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                            <span className="relative z-10 flex items-center gap-2">
                                Begin Your Inquiry <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </a>
                    </motion.div>
                </motion.div>
            </section>

            {/* Hardcoded Brand Logos Section */}
            <section className="py-16 md:py-20 px-6 bg-white relative z-10 border-t border-black/5">
                <div className="max-w-[1400px] mx-auto flex flex-col items-center">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: appleEase }}
                        className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-10"
                    >
                        Sourcing the world's finest
                    </motion.p>

                    <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-24 opacity-60">
                        {highlightedCarLogos.map((logo, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1, ease: appleEase }}
                                className="w-16 md:w-20 lg:w-24 grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 cursor-pointer"
                            >
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="w-full h-auto object-contain"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- ADD THIS DYNAMIC COMPONENT HERE --- */}
            {/* Passes the campaign search tags array directly down to fetch matches */}
            <VehicleShowcaseCarousel tags={config.slug ? [config.slug] : ["LHD", "SUV"]} />

            {/* Configurable Manifesto/Intro */}
            <section ref={manifestoRef} className="py-32 md:py-48 px-6 bg-white border-y border-black/5 relative z-10 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.p
                        style={{ scale: manifestoScale, opacity: manifestoOpacity }}
                        className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-zinc-400"
                    >
                        {config.intro.text.replace(config.intro.highlight, '')} <span className="text-black drop-shadow-sm">{config.intro.highlight}</span>
                    </motion.p>
                </div>
            </section>

            {/* Configurable Value Props Section */}
            <section className="py-32 px-6 max-w-[1400px] mx-auto bg-white relative z-10">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: appleEase }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6 uppercase">
                        {config.valueProps.title}
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
                    <div className="space-y-6">
                        {config.valueProps.features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ y: 40, opacity: 0, x: -20 }}
                                whileInView={{ y: 0, opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: appleEase }}
                                className="relative overflow-hidden group flex flex-col items-start p-8 rounded-[2rem] bg-transparent hover:bg-zinc-50 transition-all duration-500 border border-transparent hover:border-black/5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
                            >
                                <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] bg-transparent transition-colors duration-700 ${feature.glowColor}`} />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-black/5 border border-black/10 rounded-2xl group-hover:bg-black group-hover:border-black transition-colors duration-500">
                                            <feature.icon className="text-black h-6 w-6 group-hover:text-white transition-colors duration-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-black group-hover:translate-x-2 transition-transform duration-500">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className="text-zinc-500 text-lg leading-relaxed font-light pl-16">
                                        {feature.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: appleEase }}
                        className="relative h-[600px] lg:h-[800px] rounded-[2.5rem] overflow-hidden bg-zinc-200"
                    >
                        <img
                            src={config.valueProps.containerImage}
                            alt="Logistics"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Configurable Trustpilot & Review Section */}
            <section className="py-32 px-6 bg-[#FAFAFA] border-y border-black/5 overflow-hidden">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                                Our customers' Trustpilot reviews
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="text-xl font-bold">Excellent</span>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="bg-[#00B67A] p-1 rounded-sm">
                                            <Star size={16} fill="white" stroke="none" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-zinc-500 font-light ml-2">{config.reviews.averageRating} average rating based on {config.reviews.totalReviews} reviews</span>
                            </div>
                        </div>
                        <img src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-black.svg" alt="Trustpilot" className="h-8" />
                    </div>

                    <div className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                        {config.reviews.items.map((review, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1, ease: appleEase }}
                                className="min-w-[320px] md:min-w-[400px] bg-white border border-black/5 rounded-[2rem] p-8 snap-start hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <div key={i} className="bg-[#00B67A] p-1 rounded-sm">
                                            <Star size={12} fill="white" stroke="none" />
                                        </div>
                                    ))}
                                </div>
                                <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                                <p className="text-zinc-500 font-light mb-6 line-clamp-3">{review.desc}</p>
                                <div className="mt-auto flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                                        {/* Generic avatar block */}
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold bg-zinc-100">{review.name.charAt(0)}</div>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{review.name}</p>
                                        <p className="text-zinc-400 text-xs">{review.date}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Featured Video Block */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: appleEase }}
                        className="mt-16 bg-white rounded-[2.5rem] p-4 md:p-8 border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center shadow-sm"
                    >
                        <div className="relative aspect-video rounded-[1.5rem] overflow-hidden group cursor-pointer">
                            <img
                                src={config.featuredReview.image}
                                alt={config.featuredReview.carName}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors group-hover:bg-black/30">
                                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-black transform transition-transform group-hover:scale-110">
                                    <Play size={24} className="ml-1" fill="currentColor" />
                                </div>
                            </div>
                            <div className="absolute top-6 left-6 flex items-center gap-2">
                                <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase text-black">
                                    NEW {config.featuredReview.carName.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="pr-4 md:pr-12 py-4">
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tighter mb-4">{config.featuredReview.title} {config.featuredReview.carName}</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-black text-white px-3 py-1 font-bold text-sm rounded-md">{config.featuredReview.rating.toFixed(1)}</div>
                                <div className="flex gap-1">
                                    {[...Array(Math.floor(config.featuredReview.rating))].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    {[...Array(5 - Math.floor(config.featuredReview.rating))].map((_, i) => <Star key={i} size={16} className="text-zinc-300" />)}
                                </div>
                            </div>
                            <p className="text-zinc-500 font-light leading-relaxed mb-8">
                                "{config.featuredReview.text}"
                            </p>
                            <button className="px-8 py-3 rounded-full border border-black/20 font-medium hover:bg-black hover:text-white transition-colors duration-300">
                                Read the full review
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Existing Forms and FAQs */}
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
                        Like an <span className="text-black font-medium">Aston Martin Chiron</span>. Our team will find that version in the global markets where it costs you the least.
                    </p>
                </motion.div>

                <div className="w-full relative z-20">
                    <Suspense fallback={
                        <div className="w-full max-w-3xl mx-auto h-[550px] flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-black/5 text-zinc-500">
                            Loading form...
                        </div>
                    }>
                        <RequestForm />
                    </Suspense>
                </div>

                <div className="mt-24 w-full relative z-20">
                    <FAQSection data={config.faqs} />
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-black/5 blur-[120px] rounded-full pointer-events-none" />
            </section>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </main>
    );
}