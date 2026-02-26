import MinimalHeader from "@/app/components/MinimalHeader";
import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import { notFound } from "next/navigation";
import {
    Search, Handshake, CreditCard, FileCheck,
    Wrench, Ship, Anchor, Flag, CheckCircle2
} from "lucide-react";

const TIMELINE_STEPS = [
    { id: "New", label: "Vehicle Selection", icon: Search, desc: "Sourcing the perfect match." },
    { id: "Accepted", label: "Price Agreed", icon: Handshake, desc: "Finalizing landed cost." },
    { id: "Deposit", label: "Deposit Collected", icon: CreditCard, desc: "Securing the vehicle." },
    { id: "Confirmed", label: "Purchase Confirmed", icon: FileCheck, desc: "Vehicle bought globally." },
    { id: "Processing", label: "Preparation", icon: Wrench, desc: "Garage tests & documentation." },
    { id: "Shipped", label: "Shipping & Docs", icon: Ship, desc: "In transit on the ocean." },
    { id: "Port", label: "Port Arrival", icon: Anchor, desc: "Vessel has docked." },
    { id: "Cleared", label: "Customs Cleared", icon: Flag, desc: "Ready for delivery!" },
];

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
    let requestData = null;
    const id = (await params).id;

    try {
        await connectToDatabase();
        requestData = await Request.findById(id).lean();
    } catch (error) {
        console.error("Invalid Request ID");
    }

    if (!requestData) {
        notFound();
    }

    const currentStatus = requestData.status;
    const currentIndex = TIMELINE_STEPS.findIndex(s => s.id === currentStatus);
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;

    return (
        <main className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white font-sans overflow-x-hidden pb-24">
            <MinimalHeader />

            <div className="absolute top-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(30,40,70,0.4)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32">
                <div className="text-center mb-16 border-b border-white/10 pb-12">
                    <p className="text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase mb-4">
                        Live Logistics Tracker
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
                        {/* UPDATED: Changed .model to .vehicle_model */}
                        {requestData.make} {requestData.vehicle_model}
                    </h1>
                    <p className="text-lg text-zinc-400">
                        Requested on {new Date(requestData.createdAt).toLocaleDateString()}
                    </p>

                    <div className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-white tracking-wide">
                            Status: {TIMELINE_STEPS[activeIndex].label}
                        </span>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto relative">
                    <div className="absolute left-8 top-8 bottom-8 w-px bg-zinc-800" />
                    <div
                        className="absolute left-8 top-8 w-px bg-gradient-to-b from-blue-500 to-emerald-500 transition-all duration-1000 ease-in-out"
                        style={{ height: `${(activeIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                    />

                    <div className="space-y-12 relative z-10">
                        {TIMELINE_STEPS.map((step, index) => {
                            const isCompleted = index < activeIndex;
                            const isActive = index === activeIndex;
                            const isFuture = index > activeIndex;

                            return (
                                <div key={step.id} className="flex items-start gap-8">
                                    <div className="relative flex items-center justify-center shrink-0">
                                        <div className={`
                                            h-16 w-16 rounded-2xl border backdrop-blur-md flex items-center justify-center transition-all duration-500
                                            ${isActive ? "bg-white border-white shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-110" : ""}
                                            ${isCompleted ? "bg-zinc-900 border-zinc-700" : ""}
                                            ${isFuture ? "bg-black border-zinc-800 opacity-50" : ""}
                                        `}>
                                            <step.icon className={`h-6 w-6 ${isActive ? "text-black" : isCompleted ? "text-zinc-400" : "text-zinc-600"}`} />
                                            {isCompleted && (
                                                <div className="absolute -bottom-2 -right-2 bg-black rounded-full">
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`pt-3 transition-all duration-500 ${isFuture ? "opacity-40" : "opacity-100"}`}>
                                        <h3 className={`text-xl font-bold tracking-tight mb-1 ${isActive ? "text-white" : "text-zinc-300"}`}>
                                            {step.label}
                                        </h3>
                                        <p className="text-zinc-500">{step.desc}</p>

                                        {isActive && step.id === "Shipped" && requestData.trackingNumber && (
                                            <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-sm">
                                                Tracking: {requestData.trackingNumber}
                                            </div>
                                        )}

                                        {isActive && step.id === "Processing" && requestData.garageNotes && (
                                            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-sm italic">
                                                "{requestData.garageNotes}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}