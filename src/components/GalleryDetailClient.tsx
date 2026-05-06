"use client";

import {useRef, useState} from "react";
import MinimalHeader from "@/components/MinimalHeader";
import {motion} from "framer-motion";
import {ArrowLeft, FileText, Loader2, Mail, Globe} from "lucide-react";
import Link from "next/link";
import {generateDossierPdfAction} from "@/actions/pdf-actions";
import RequestForm from "@/components/requestForm";

const appleEase: any = [0.16, 1, 0.3, 1];

// Updated Type to include Pricing Matrix
type PriceEntry = {
    country: string;
    currency: string;
    amount: number;
    type: string;
};

type Dossier = {
    _id: string;
    make: string;
    model: string;
    year: string;
    trim: string;
    countryOfOrigin: string;
    engineConfig: string;
    displacement: string;
    maxPower: string;
    maxTorque: string;
    transmission: string;
    fuelSystem: string;
    steering: string;
    emissions: string;
    upholstery: string;
    infotainment: string;
    features: string[];
    searchTags: string[];
    images: string[];
    notes: string;
    status: string;
    pricing?: PriceEntry[]; // Added Pricing
};

export default function GalleryDetailClient({car}: { car: Dossier }) {
    const [activeImage, setActiveImage] = useState(0);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const inquiryRef = useRef<HTMLDivElement>(null);

    const scrollToInquiry = () => {
        inquiryRef.current?.scrollIntoView({behavior: "smooth", block: "start"});
    };

    const prefillData = {
        make: car.make,
        vehicle_model: car.model,
        specs: `Inquiry for ${car.year} ${car.make} ${car.model} (${car.trim}). Features: ${car.features?.join(", ")}`,
    };

    const displayImages = car.images?.length > 0
        ? car.images
        : ["https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2938&auto=format&fit=crop"];

    const handleDownloadPdf = async () => {
        setIsGeneratingPdf(true);
        try {
            const res = await generateDossierPdfAction(car._id);
            if (res.success && res.pdfBase64) {
                const byteCharacters = atob(res.pdfBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], {type: 'application/pdf'});
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank');
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            } else {
                alert(res.message || "Failed to generate PDF.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while generating the PDF.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFCFB] text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden pb-32">
            <MinimalHeader/>

            {/* Top Section */}
            <section className="pt-32 px-6 max-w-[1400px] mx-auto">
                <Link href="/b2c/gallery" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-black transition-colors mb-12">
                    <ArrowLeft size={16}/> Back to Gallery
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, ease: appleEase}}
                        className="lg:col-span-5 flex flex-col justify-center sticky top-32"
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.9] mb-4 uppercase">
                            {car.make} <br/>
                            <span className="text-zinc-400">{car.model}</span> <br/>
                            {car.year}
                        </h1>
                        <div className="h-px w-full bg-black/10 my-8"/>
                        <div className="prose prose-lg text-zinc-600 font-light leading-relaxed">
                            {car.notes ? <p>{car.notes}</p> : <p>A pristine example of engineering and design...</p>}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 1, ease: appleEase, delay: 0.1}}
                        className="lg:col-span-7"
                    >
                        <div className="relative aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden bg-zinc-100 shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-black/5">
                            <img src={displayImages[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover"/>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Specs, Pricing & Gallery */}
            <section className="mt-24 lg:mt-40 px-6 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Left Column */}
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true, margin: "-100px"}}
                        transition={{duration: 0.8, ease: appleEase}}
                        className="lg:col-span-5 flex flex-col"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-12 uppercase leading-tight">
                            Vehicle <br/> Details
                        </h2>

                        {/* 1. PRICING MATRIX (New Section) */}
                        {car.pricing && car.pricing.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                                    <Globe size={20} className="text-[#4da8da]"/> Landed Pricing Estimate
                                </h3>
                                <div className="space-y-3">
                                    {car.pricing.map((p, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-black/5 shadow-sm">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{p.country}</p>
                                                <p className="text-xs font-bold text-zinc-500 uppercase">{p.type}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-black tracking-tight">
                                                    <span className="text-sm font-medium mr-1 text-[#4da8da]">{p.currency}</span>
                                                    {p.amount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <p className="text-[10px] text-zinc-400 italic px-2 mt-2">
                                        * Estimates include logistics and estimated duties. Final quote provided upon inquiry.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 2. TECHNICAL SPECS */}
                        <h3 className="text-2xl font-serif text-zinc-500 mb-6 italic">Technical Specifications</h3>
                        <div className="bg-white rounded-[2rem] border border-black/5 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] mb-10">
                            <dl className="divide-y divide-black/5">
                                {[
                                    {label: "Variant / Trim", value: car.trim},
                                    {label: "Origin", value: car.countryOfOrigin},
                                    {label: "Engine", value: `${car.displacement || ''} ${car.engineConfig || ''}`.trim()},
                                    {label: "Transmission", value: car.transmission},
                                    {label: "Fuel System", value: car.fuelSystem},
                                    {label: "Steering", value: car.steering}
                                ].map((spec, i) => spec.value && (
                                    <div key={i} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                                        <dt className="text-zinc-500 text-sm font-medium">{spec.label}</dt>
                                        <dd className="text-black font-semibold text-right">{spec.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button
                                onClick={handleDownloadPdf}
                                disabled={isGeneratingPdf}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-zinc-800 hover:bg-black text-white text-sm font-bold uppercase tracking-wider rounded-full transition-colors disabled:opacity-70"
                            >
                                {isGeneratingPdf ? <Loader2 className="animate-spin" size={18}/> : <FileText size={18}/>}
                                {isGeneratingPdf ? "Generating..." : "Print Dossier"}
                            </button>

                            <button
                                onClick={scrollToInquiry}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-black/10 hover:border-black/30 hover:bg-zinc-50 text-black text-sm font-bold uppercase tracking-wider rounded-full transition-all"
                            >
                                <Mail size={18}/> Inquire Now
                            </button>
                        </div>

                        {/* Features */}
                        {car.features && car.features.length > 0 && (
                            <div className="mt-auto pt-8 border-t border-black/10">
                                <p className="text-zinc-500 font-bold tracking-widest uppercase text-sm mb-4">Included Features</p>
                                <div className="flex flex-wrap gap-2">
                                    {car.features.map((feature, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-zinc-100/80 text-zinc-800 text-xs font-bold uppercase tracking-wider rounded-xl border border-black/5">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Right Column: Interactive Gallery */}
                    <motion.div
                        initial={{opacity: 0, y: 30}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true, margin: "-100px"}}
                        transition={{duration: 0.8, ease: appleEase, delay: 0.2}}
                        className="lg:col-span-7 flex flex-col gap-6"
                    >
                        <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden bg-black flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <img key={activeImage} src={displayImages[activeImage]} alt={`${car.make} - View ${activeImage + 1}`} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"/>
                        </div>
                        {displayImages.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                {displayImages.map((img, idx) => (
                                    <button key={idx} onClick={() => setActiveImage(idx)} className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 border-2 transition-all duration-300 ${activeImage === idx ? "border-black shadow-lg scale-105" : "border-transparent hover:border-black/20"}`}>
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover"/>
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Inquiry Section */}
            <section ref={inquiryRef} className="mt-32 lg:mt-56 px-6 py-24 bg-zinc-50 border-y border-black/5">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-4">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.8] mb-6">
                            Start Your <br/> <span className="text-[#4da8da]">Acquisition</span>
                        </h2>
                        <p className="text-zinc-500 text-lg font-light leading-relaxed">
                            Our team will verify the availability of this {car.model} and provide a landed cost estimate for your destination country.
                        </p>
                    </div>
                    <div className="lg:col-span-8">
                        <RequestForm prefill={prefillData}/>
                    </div>
                </div>
            </section>
        </main>
    );
}