"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";
import { getSpecDossiersByTags } from "@/actions/spec-actions";

const appleEase = [0.16, 1, 0.3, 1];

export default function VehicleShowcaseCarousel({ tags }: { tags: string[] }) {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVehicles = async () => {
            const res = await getSpecDossiersByTags(tags);
            if (res.success && res.data) {
                setVehicles(res.data);
            }
            setLoading(false);
        };
        loadVehicles();
    }, [tags]);

    if (loading) {
        return (
            <div className="w-full h-72 flex items-center justify-center text-sm font-medium text-zinc-400">
                Sourcing synchronized catalog configurations...
            </div>
        );
    }

    if (vehicles.length === 0) return null;

    return (
        <section className="py-24 px-6 bg-[#FAFAFA] border-t border-black/5 overflow-hidden relative z-10">
            <div className="max-w-[1400px] mx-auto mb-12 flex items-end justify-between">
                <div>
                    <p className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-3">Available Collections</p>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase text-black">
                        Featured Blueprints
                    </h2>
                </div>
            </div>

            {/* Swipeable View Container */}
            <div className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                {vehicles.map((car: any, i: number) => {
                    const fallbackImg = "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2938&auto=format&fit=crop";
                    const heroImage = car.images && car.images.length > 0 ? car.images[0] : fallbackImg;

                    // Grab lowest landed price estimate if matrix is populated
                    const localEstimate = car.pricing && car.pricing.length > 0
                        ? car.pricing[0]
                        : null;

                    return (
                        <motion.div
                            key={car._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                            className="min-w-[320px] md:min-w-[420px] bg-white border border-black/5 rounded-[2.5rem] overflow-hidden snap-start flex flex-col group shadow-sm hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all duration-500"
                        >
                            {/* Graphic Frame */}
                            <div className="relative aspect-[4/3] w-full bg-zinc-100 overflow-hidden border-b border-black/5">
                                <img
                                    src={heroImage}
                                    alt={`${car.make} ${car.model}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-white/90 backdrop-blur-md border border-black/5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-black">
                                        {car.year}
                                    </span>
                                </div>
                            </div>

                            {/* Content Block */}
                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <h3 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
                                            {car.make} <span className="text-zinc-400">{car.model}</span>
                                        </h3>
                                        <Link
                                            href={`/gallery/${car._id}`}
                                            className="p-2 bg-zinc-50 border border-black/5 text-zinc-400 group-hover:text-black group-hover:bg-zinc-100 rounded-full transition-all shrink-0"
                                        >
                                            <ArrowUpRight size={18} />
                                        </Link>
                                    </div>
                                    <p className="text-sm text-zinc-500 font-medium tracking-wide mb-6">
                                        {car.trim || "Standard Specification"}
                                    </p>

                                    {/* Tech specs mini-row */}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5 mb-6 text-xs text-zinc-500">
                                        {car.displacement && (
                                            <div className="flex items-center gap-1.5">
                                                <ShieldCheck size={14} className="text-zinc-400" /> {car.displacement} {car.engineConfig}
                                            </div>
                                        )}
                                        {car.countryOfOrigin && (
                                            <div className="flex items-center gap-1.5">
                                                <Globe size={14} className="text-zinc-400" /> {car.countryOfOrigin} Spec
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Dynamic Pricing Footer */}
                                {localEstimate ? (
                                    <div className="mt-auto p-4 bg-zinc-50/50 rounded-2xl border border-black/5 flex justify-between items-center">
                                        <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                                            Est. Landed ({localEstimate.country})
                                        </div>
                                        <div className="text-lg font-bold text-black tracking-tight font-mono">
                                            <span className="text-xs text-zinc-400 font-sans font-medium mr-0.5">{localEstimate.currency}</span>
                                            {localEstimate.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-auto p-4 bg-zinc-50/50 rounded-2xl border border-black/5 text-center text-xs text-zinc-400 italic">
                                        Custom import pricing upon inquiry
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}