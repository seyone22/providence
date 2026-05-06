"use client";

import MinimalHeader from "@/components/MinimalHeader";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Calendar,
    ImageOff,
    ChevronDown,
    Star,
    Play,
    Fuel,
    Cog,
    Filter
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import FAQSection from "@/components/faqSection";

const appleEase: any = [0.16, 1, 0.3, 1];

// Updated to perfectly match your Blueprint Schema
type Dossier = {
    _id: string;
    make: string;
    model: string;
    year: string;
    trim: string;
    countryOfOrigin: string;
    fuelSystem: string;
    transmission: string;
    images: string[];
    features: string[];
    searchTags: string[];
    status: string;
};

export default function GalleryClient({ dossiers }: { dossiers: Dossier[] }) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Extract all unique search tags from all active dossiers
    const availableTags = useMemo(() => {
        const tags = new Set<string>();
        dossiers.forEach(car => {
            if (car.searchTags) {
                car.searchTags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags).sort();
    }, [dossiers]);

    // Filter logic: If tags are selected, the car must have ALL selected tags
    const filteredDossiers = useMemo(() => {
        if (selectedTags.length === 0) return dossiers;
        return dossiers.filter(car =>
            selectedTags.every(tag => car.searchTags?.includes(tag))
        );
    }, [dossiers, selectedTags]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    return (
        <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
            <MinimalHeader />

            {/* Hero Section */}
            <section className="relative pt-40 pb-10 px-6 bg-white overflow-hidden">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: appleEase }}
                    className="relative z-10 text-center max-w-4xl mx-auto"
                >
                    <p className="text-sm font-bold tracking-[0.4em] text-zinc-400 uppercase mb-6">
                        Master Blueprints
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter mb-6 text-black leading-[1.1]">
                        The Gallery.
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
                        A curated selection of globally-sourced vehicle specifications, ready to be commissioned to your exacting standards.
                    </p>
                </motion.div>

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-100 blur-[120px] rounded-full pointer-events-none -z-10" />
            </section>

            {/* Filter Section */}
            {availableTags.length > 0 && (
                <section className="px-6 max-w-[1400px] mx-auto relative z-20 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center border-b border-black/5 pb-8">
                        <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-xs shrink-0">
                            <Filter size={14} /> Filter By:
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map(tag => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                                            isSelected
                                                ? 'bg-black text-white border-black shadow-md scale-105'
                                                : 'bg-zinc-50 text-zinc-500 border-black/5 hover:border-black/20 hover:bg-zinc-100'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                            {selectedTags.length > 0 && (
                                <button
                                    onClick={() => setSelectedTags([])}
                                    className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Grid Section */}
            <section className="pb-20 px-6 max-w-[1400px] mx-auto bg-white relative z-10">
                {filteredDossiers.length === 0 ? (
                    <div className="text-center py-32 bg-zinc-50 rounded-[2.5rem] border border-black/5">
                        <p className="text-zinc-400 font-medium text-lg">
                            No vehicles match your current filter selection.
                        </p>
                        <button
                            onClick={() => setSelectedTags([])}
                            className="mt-4 text-sm font-bold border-b border-black pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
                        {filteredDossiers.map((car, index) => (
                            <motion.div
                                key={car._id}
                                initial={{ y: 40, opacity: 0, scale: 0.98 }}
                                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: appleEase }}
                                className="group relative flex flex-col rounded-[2rem] bg-white border border-black/5 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:border-black/10 transition-all duration-700 cursor-pointer"
                            >
                                <Link href={`/b2c/gallery/${car._id}`} className="flex flex-col h-full outline-none">
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
                                        {car.images && car.images.length > 0 ? (
                                            <img
                                                src={car.images[0]}
                                                alt={`${car.make} ${car.model}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                                                <ImageOff size={32} className="mb-2 opacity-50" />
                                                <span className="text-sm font-medium uppercase tracking-widest">No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Container */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="mb-6 flex-grow">
                                            <h2 className="text-2xl font-bold tracking-tight text-black mb-1 group-hover:text-sky-600 transition-colors duration-500 line-clamp-1">
                                                {car.make} {car.model}
                                            </h2>
                                            <p className="text-zinc-500 font-light line-clamp-1">
                                                {car.trim || "Standard Specification"}
                                            </p>
                                        </div>

                                        {/* Specs Grid (Updated to match blueprint schema) */}
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-6 border-t border-black/5">
                                            <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                                                <Calendar size={16} className="text-zinc-400" />
                                                {car.year || "Year N/A"}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium capitalize truncate">
                                                <MapPin size={16} className="text-zinc-400 shrink-0" />
                                                <span className="truncate">{car.countryOfOrigin || "Global"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium truncate">
                                                <Fuel size={16} className="text-zinc-400 shrink-0" />
                                                <span className="truncate">{car.fuelSystem || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium truncate">
                                                <Cog size={16} className="text-zinc-400 shrink-0" />
                                                <span className="truncate">{car.transmission || "N/A"}</span>
                                            </div>
                                        </div>

                                        {/* Tags Container */}
                                        {car.searchTags && car.searchTags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-black/5">
                                                {car.searchTags.slice(0, 3).map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider rounded-md"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {car.searchTags.length > 3 && (
                                                    <span className="px-2.5 py-1 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                                                        +{car.searchTags.length - 3} More
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Value Propositions Section */}
            <section className="py-32 px-6 bg-[#FAFAFA] border-y border-black/5">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: appleEase }}
                    >
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-16 uppercase leading-tight">
                            Why Import From <br/>Providence Auto
                        </h2>

                        <div className="space-y-12">
                            {[
                                { title: "Unrestricted Market Access", desc: "Gain direct entry to global wholesale markets in Japan, the UK, and Europe. Stop paying domestic dealership markups and secure vehicles at their true international value." },
                                { title: "Mastery of Compliance", desc: "Import regulations are notoriously complex. Our team handles all homologation, emissions testing, and customs clearances to ensure full legal compliance in your country." },
                                { title: "White-Glove Logistics", desc: "From the moment of purchase to your driveway, your vehicle is fully insured and tracked. We utilize secure, enclosed container shipping to guarantee pristine condition upon arrival." },
                                { title: "Rigorous Quality Assurance", desc: "We deploy independent inspectors to physically verify every vehicle before purchase. You receive a comprehensive 150-point dossier, ensuring zero surprises." }
                            ].map((prop, idx) => (
                                <div key={idx} className="relative pl-8 border-l border-black/10 hover:border-black/50 transition-colors duration-500">
                                    <h3 className="text-xl font-bold tracking-tight mb-3 uppercase text-zinc-800">{prop.title}</h3>
                                    <p className="text-zinc-500 font-light leading-relaxed">{prop.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: appleEase }}
                        className="relative h-[600px] lg:h-[800px] rounded-[2.5rem] overflow-hidden bg-zinc-200"
                    >
                        <img
                            src="/gallery_image.jpg"
                            alt="Vehicles being loaded into a shipping container"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Trustpilot & Featured Review Section */}
            <section className="py-32 px-6 bg-white overflow-hidden">
                <div className="max-w-[1400px] mx-auto">
                    {/* Trustpilot Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                                Trusted Globally.
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
                                <span className="text-zinc-500 font-light ml-2">4.9 out of 5 based on 250+ reviews</span>
                            </div>
                        </div>
                        <img src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-black.svg" alt="Trustpilot" className="h-8" />
                    </div>

                    {/* Trustpilot Carousel */}
                    <div className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                        {[
                            { name: "Alexander R.", date: "2 days ago", title: "Flawless import of my G-Wagon", desc: "The team at Providence handled everything. I saved nearly 20% compared to buying locally, and the car arrived in immaculate condition." },
                            { name: "Sarah M.", date: "1 week ago", title: "Incredible communication", desc: "I was nervous about importing from Japan, but their weekly updates and detailed inspection reports gave me complete peace of mind." },
                            { name: "David T.", date: "3 weeks ago", title: "Exactly as described", desc: "The 150-point inspection is no joke. The Defender was exactly as pictured. Will absolutely be using Providence for my next vehicle." },
                            { name: "Michael H.", date: "1 month ago", title: "Seamless customs clearance", desc: "I didn't have to fill out a single confusing form. They managed the entire tax and compliance process. True white-glove service." },
                            { name: "James L.", date: "2 months ago", title: "Highly professional outfit", desc: "Their market knowledge is unparalleled. They advised me to wait two weeks for a better exchange rate, saving me thousands." }
                        ].map((review, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1, ease: appleEase }}
                                className="min-w-[320px] md:min-w-[400px] bg-[#FDFCFB] border border-black/5 rounded-[2rem] p-8 snap-start hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="bg-[#00B67A] p-1 rounded-sm">
                                            <Star size={12} fill="white" stroke="none" />
                                        </div>
                                    ))}
                                </div>
                                <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                                <p className="text-zinc-500 font-light mb-6 line-clamp-3">{review.desc}</p>
                                <div className="mt-auto">
                                    <p className="font-medium text-sm">{review.name}</p>
                                    <p className="text-zinc-400 text-xs">{review.date}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Featured Video / Review Block */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: appleEase }}
                        className="mt-16 bg-[#FAFAFA] rounded-[2.5rem] p-4 md:p-8 border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center"
                    >
                        <div className="relative aspect-video rounded-[1.5rem] overflow-hidden group cursor-pointer">
                            <img
                                src="https://images.unsplash.com/photo-1549314454-78d1fdc3b5ec?q=80&w=2940&auto=format&fit=crop"
                                alt="Featured Review"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors group-hover:bg-black/30">
                                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-black transform transition-transform group-hover:scale-110">
                                    <Play size={24} className="ml-1" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                        <div className="pr-4 md:pr-12 py-4">
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tighter mb-4">Our review of the 2024 Range Rover</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-black text-white px-3 py-1 font-bold text-sm rounded-md">4.5</div>
                                <div className="flex gap-1">
                                    {[...Array(4)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    <Star size={16} className="text-zinc-300" />
                                </div>
                            </div>
                            <p className="text-zinc-500 font-light leading-relaxed mb-8">
                                "The Range Rover needs no introduction. For 50 years it has been a staple of luxury, becoming the definition of a premium SUV. However, navigating the import market for one requires expertise. Here is why importing direct remains the superior choice..."
                            </p>
                            <button className="px-8 py-3 rounded-full border border-black/20 font-medium hover:bg-black hover:text-white transition-colors duration-300">
                                Read the full review
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQs Section */}
            <FAQSection/>

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