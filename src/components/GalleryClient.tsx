"use client";

import MinimalHeader from "@/components/MinimalHeader";
import { motion } from "framer-motion";
import { MapPin, Gauge, CircleDollarSign, Calendar, ImageOff } from "lucide-react";
import Link from "next/link";

const appleEase: any = [0.16, 1, 0.3, 1];

// Type definition based on your Mongoose Schema
type Dossier = {
    _id: string;
    make: string;
    model: string;
    year: string;
    trim: string;
    price: string;
    countryOfOrigin: string;
    mileage: string;
    images: string[];
    status: string;
};

export default function GalleryClient({ dossiers }: { dossiers: Dossier[] }) {
    return (
        <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden">
            <MinimalHeader />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 bg-white overflow-hidden">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: appleEase }}
                    className="relative z-10 text-center max-w-4xl mx-auto"
                >
                    <p className="text-sm font-bold tracking-[0.4em] text-zinc-400 uppercase mb-6">
                        Portfolio
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter mb-6 text-black leading-[1.1]">
                        The Gallery.
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl mx-auto">
                        A curated selection of globally-sourced vehicles, secured and delivered to exacting standards.
                    </p>
                </motion.div>

                {/* Background ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-100 blur-[120px] rounded-full pointer-events-none -z-10" />
            </section>

            {/* Grid Section */}
            <section className="py-20 px-6 max-w-[1400px] mx-auto bg-white relative z-10">
                {dossiers.length === 0 ? (
                    <div className="text-center py-32 text-zinc-400 font-light text-lg">
                        No vehicles currently available in the gallery.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
                        {dossiers.map((car, index) => (
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

                                        {/* Status Badge */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className={`inline-flex px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full backdrop-blur-md border ${
                                                car.status.toLowerCase() === 'sold'
                                                    ? 'bg-black/70 text-white border-black/10'
                                                    : 'bg-white/80 text-black border-white/20 shadow-sm'
                                            }`}>
                                                {car.status}
                                            </span>
                                        </div>
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

                                        {/* Specs Grid */}
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-6 border-t border-black/5">
                                            <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                                                <Calendar size={16} className="text-zinc-400" />
                                                {car.year || "N/A"}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium capitalize">
                                                <MapPin size={16} className="text-zinc-400" />
                                                {car.countryOfOrigin}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                                                <Gauge size={16} className="text-zinc-400" />
                                                {car.mileage ? `${car.mileage} km` : "N/A"}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                                                <CircleDollarSign size={16} className="text-zinc-400" />
                                                {car.price || "P.O.A."}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}