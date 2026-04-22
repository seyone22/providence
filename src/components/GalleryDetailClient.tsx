"use client";

import { useState } from "react";
import MinimalHeader from "@/components/MinimalHeader";
import { motion } from "framer-motion";
import { ArrowLeft, Download, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

const appleEase: any = [0.16, 1, 0.3, 1];

type Dossier = {
    _id: string;
    make: string;
    model: string;
    year: string;
    trim: string;
    color: string;
    price: string;
    countryOfOrigin: string;
    mileage: string;
    images: string[];
    notes: string;
    engineConfig: string;
    displacement: string;
    transmission: string;
    fuelSystem: string;
    auctionGrade: string;
    steering: string;
    status: string;
};

export default function GalleryDetailClient({ car }: { car: Dossier }) {
    const [activeImage, setActiveImage] = useState(0);

    // Fallback images if none are provided
    const displayImages = car.images?.length > 0
        ? car.images
        : ["https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2938&auto=format&fit=crop"];

    return (
        <main className="min-h-screen bg-[#FDFCFB] text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden pb-32">
            <MinimalHeader />

            {/* Top Section: Title & Hero Image */}
            <section className="pt-32 px-6 max-w-[1400px] mx-auto">
                <Link href="/b2c/gallery" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-black transition-colors mb-12">
                    <ArrowLeft size={16} /> Back to Gallery
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                    {/* Left: Typography & Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: appleEase }}
                        className="lg:col-span-5 flex flex-col justify-center sticky top-32"
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.9] mb-4 uppercase">
                            {car.make} <br />
                            <span className="text-zinc-400">{car.model}</span> <br />
                            {car.year}
                        </h1>

                        <div className="h-px w-full bg-black/10 my-8" />

                        <div className="prose prose-lg text-zinc-600 font-light leading-relaxed">
                            {car.notes ? (
                                <p>{car.notes}</p>
                            ) : (
                                <p>
                                    A pristine example of engineering and design. This {car.year} {car.make} {car.model} is sourced directly from {car.countryOfOrigin}, ensuring impeccable provenance and condition. Featuring {car.trim ? `the ${car.trim} specification` : 'premium specifications'}, it represents an uncompromised standard of automotive excellence.
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Main Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: appleEase, delay: 0.1 }}
                        className="lg:col-span-7"
                    >
                        <div className="relative aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden bg-zinc-100 shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-black/5">
                            <img
                                src={displayImages[0]}
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-6 right-6">
                                <span className={`inline-flex px-4 py-2 text-sm font-bold uppercase tracking-widest rounded-full backdrop-blur-xl border ${
                                    car.status.toLowerCase() === 'sold'
                                        ? 'bg-black/80 text-white border-black/20'
                                        : 'bg-white/90 text-black border-black/10 shadow-lg'
                                }`}>
                                    {car.status}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bottom Section: Specs & Gallery */}
            <section className="mt-24 lg:mt-40 px-6 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Left: Specs & Pricing */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: appleEase }}
                        className="lg:col-span-5 flex flex-col"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-12 uppercase leading-tight">
                            Import Directly <br/> To Your Country
                        </h2>

                        <h3 className="text-2xl font-serif text-zinc-500 mb-6 italic">Spec Details</h3>

                        {/* Premium Spec List (Replaces the blue table) */}
                        <div className="bg-white rounded-[2rem] border border-black/5 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] mb-10">
                            <dl className="divide-y divide-black/5">
                                {[
                                    { label: "Variant", value: car.trim || "Standard" },
                                    { label: "Fuel Type", value: car.fuelSystem },
                                    { label: "Mileage", value: car.mileage ? `${car.mileage} km` : "Delivery Miles" },
                                    { label: "Gear Box", value: car.transmission },
                                    { label: "Color", value: car.color },
                                    { label: "Engine", value: `${car.displacement || ''} ${car.engineConfig || ''}`.trim() || 'N/A' },
                                    { label: "Steering", value: car.steering },
                                    { label: "Auction Grade", value: car.auctionGrade },
                                    { label: "Origin", value: <span className="capitalize">{car.countryOfOrigin}</span> }
                                ].map((spec, i) => (
                                    <div key={i} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                                        <dt className="text-zinc-500 text-sm font-medium">{spec.label}</dt>
                                        <dd className="text-black font-semibold text-right max-w-[60%] truncate">{spec.value || "N/A"}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-zinc-800 hover:bg-black text-white text-sm font-bold uppercase tracking-wider rounded-full transition-colors">
                                <FileText size={18} /> Spec Sheet
                            </button>
                            <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-black/10 hover:border-black/30 hover:bg-zinc-50 text-black text-sm font-bold uppercase tracking-wider rounded-full transition-all">
                                <Download size={18} /> Inspection
                            </button>
                        </div>

                        {/* Price */}
                        <div className="mt-auto pt-8 border-t border-black/10">
                            <p className="text-zinc-500 font-bold tracking-widest uppercase text-sm mb-2">CNF Price</p>
                            <p className="text-5xl md:text-6xl font-bold tracking-tighter">
                                {car.price ? car.price : "P.O.A."}
                            </p>
                        </div>
                    </motion.div>

                    {/* Right: Interactive Gallery */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: appleEase, delay: 0.2 }}
                        className="lg:col-span-7 flex flex-col gap-6"
                    >
                        {/* Interactive Main Image */}
                        <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden bg-black flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <img
                                key={activeImage}
                                src={displayImages[activeImage]}
                                alt={`${car.make} - View ${activeImage + 1}`}
                                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
                            />
                        </div>

                        {/* Thumbnails */}
                        {displayImages.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                {displayImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 border-2 transition-all duration-300 ${
                                            activeImage === idx
                                                ? "border-black shadow-lg scale-105"
                                                : "border-transparent hover:border-black/20 hover:opacity-80"
                                        }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                </div>
            </section>
        </main>
    );
}