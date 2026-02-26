import MinimalHeader from "@/app/components/MinimalHeader";
import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import { notFound } from "next/navigation";
import {
    Inbox, Search, Handshake, CreditCard, FileCheck,
    Wrench, Ship, Anchor, Flag, CheckCircle2, ArrowRight
} from "lucide-react";

// Updated Pipeline Stages matching your admin dashboard perfectly
const TIMELINE_STEPS = [
    { id: "New", label: "Inquiry Received", icon: Inbox, desc: "Your request is actively in our system." },
    { id: "Vehicle Selection", label: "Vehicle Selection", icon: Search, desc: "Sourcing the perfect global match." },
    { id: "Price Agreement", label: "Price Agreement", icon: Handshake, desc: "Finalizing the landed cost." },
    { id: "Deposit Collected", label: "Deposit Collected", icon: CreditCard, desc: "Securing the vehicle." },
    { id: "Vehicle Purchased", label: "Vehicle Purchased", icon: FileCheck, desc: "Vehicle officially bought globally." },
    { id: "Preparation", label: "Preparation", icon: Wrench, desc: "Garage tests & export documentation." },
    { id: "Shipped", label: "Shipping & Docs", icon: Ship, desc: "In transit on the ocean." },
    { id: "Arrived at Port", label: "Port Arrival", icon: Anchor, desc: "Vessel has docked at destination." },
    { id: "Cleared Customs", label: "Customs Cleared", icon: Flag, desc: "Ready for final delivery!" },
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

    const currentStatus = requestData.status || "New";
    const currentIndex = TIMELINE_STEPS.findIndex(s => s.id === currentStatus);
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;

    return (
        <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden pb-32">
            <MinimalHeader />

            {/* Light theme subtle top gradient for depth */}
            <div className="absolute top-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03)_0%,rgba(255,255,255,0)_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 md:pt-40">

                {/* Header Section */}
                <div className="text-center mb-20">
                    <p className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase mb-6 drop-shadow-sm">
                        Live Logistics Tracker
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-black mb-4">
                        {requestData.make} {requestData.vehicle_model}
                    </h1>
                    <p className="text-lg text-zinc-500 font-light">
                        Requested on {new Date(requestData.createdAt).toLocaleDateString()}
                    </p>

                    <div className="inline-flex items-center gap-3 mt-10 px-6 py-3 rounded-full bg-zinc-50 border border-black/5 shadow-sm">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        <span className="text-sm font-bold text-black tracking-wide">
                            Status: {TIMELINE_STEPS[activeIndex].label}
                        </span>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="max-w-2xl mx-auto relative">
                    {/* Background Line */}
                    <div className="absolute left-8 top-8 bottom-8 w-[2px] bg-zinc-100" />

                    {/* Active Progress Line */}
                    <div
                        className="absolute left-8 top-8 w-[2px] bg-black transition-all duration-1000 ease-in-out"
                        style={{ height: `${(activeIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                    />

                    <div className="space-y-12 relative z-10">
                        {TIMELINE_STEPS.map((step, index) => {
                            const isCompleted = index < activeIndex;
                            const isActive = index === activeIndex;
                            const isFuture = index > activeIndex;

                            return (
                                <div key={step.id} className="flex items-start gap-8 group">

                                    {/* Timeline Node */}
                                    <div className="relative flex items-center justify-center shrink-0">
                                        <div className={`
                                            h-16 w-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500
                                            ${isActive ? "bg-black border border-black shadow-[0_10px_30px_rgba(0,0,0,0.2)] scale-110" : ""}
                                            ${isCompleted ? "bg-zinc-50 border border-black/10" : ""}
                                            ${isFuture ? "bg-white border border-black/5 opacity-50" : ""}
                                        `}>
                                            <step.icon className={`h-6 w-6 transition-colors duration-500 ${isActive ? "text-white" : isCompleted ? "text-black" : "text-zinc-300"}`} />

                                            {isCompleted && (
                                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm">
                                                    <CheckCircle2 className="h-5 w-5 text-black" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Step Content */}
                                    <div className={`pt-3 pb-6 transition-all duration-500 w-full ${isFuture ? "opacity-40" : "opacity-100"}`}>
                                        <h3 className={`text-2xl font-bold tracking-tight mb-2 ${isActive ? "text-black" : "text-zinc-800"}`}>
                                            {step.label}
                                        </h3>
                                        <p className="text-zinc-500 text-lg font-light leading-relaxed mb-4">{step.desc}</p>

                                        {/* === DYNAMIC CONTEXTUAL DATA === */}
                                        {/* We show this data if the step is active OR completed, so the user has a history */}

                                        {(isActive || isCompleted) && (
                                            <div className="space-y-3 mt-4">

                                                {step.id === "Price Agreement" && requestData.agreedPrice && (
                                                    <div className="p-4 rounded-2xl bg-zinc-50 border border-black/5 text-sm font-medium flex justify-between items-center">
                                                        <span className="text-zinc-500">Agreed Landed Price:</span>
                                                        <span className="text-lg text-black font-bold">${Number(requestData.agreedPrice).toLocaleString()}</span>
                                                    </div>
                                                )}

                                                {step.id === "Deposit Collected" && requestData.depositAmount && (
                                                    <div className="p-4 rounded-2xl bg-zinc-50 border border-black/5 text-sm">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-zinc-500">Deposit Secured:</span>
                                                            <span className="text-black font-bold">${Number(requestData.depositAmount).toLocaleString()}</span>
                                                        </div>
                                                        {requestData.transactionId && (
                                                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-black/5">
                                                                <span className="text-zinc-400">Transaction ID:</span>
                                                                <span className="text-zinc-600 font-mono text-xs">{requestData.transactionId}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {step.id === "Vehicle Purchased" && requestData.invoiceNumber && (
                                                    <div className="p-4 rounded-2xl bg-zinc-50 border border-black/5 text-sm font-medium flex justify-between items-center">
                                                        <span className="text-zinc-500">Purchase Invoice:</span>
                                                        <span className="text-black font-mono bg-white px-2 py-1 rounded shadow-sm border border-black/5">{requestData.invoiceNumber}</span>
                                                    </div>
                                                )}

                                                {step.id === "Preparation" && requestData.inspectionNotes && (
                                                    <div className="p-5 rounded-2xl bg-zinc-50 border border-black/5 text-sm leading-relaxed">
                                                        <span className="block text-zinc-800 font-bold mb-2">Garage Update:</span>
                                                        <span className="text-zinc-600 font-light italic">"{requestData.inspectionNotes}"</span>
                                                    </div>
                                                )}

                                                {step.id === "Shipped" && requestData.trackingNumber && (
                                                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 text-sm">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <span className="text-blue-800 font-bold">Ocean Freight Active</span>
                                                            <Ship className="h-4 w-4 text-blue-500" />
                                                        </div>
                                                        <div className="space-y-2 text-blue-900/80">
                                                            <div className="flex justify-between"><span className="opacity-70">Tracking / BOL:</span> <span className="font-mono font-medium">{requestData.trackingNumber}</span></div>
                                                            {requestData.vesselName && <div className="flex justify-between"><span className="opacity-70">Vessel:</span> <span className="font-medium">{requestData.vesselName}</span></div>}
                                                            {requestData.eta && <div className="flex justify-between"><span className="opacity-70">ETA:</span> <span className="font-medium">{new Date(requestData.eta).toLocaleDateString()}</span></div>}
                                                        </div>
                                                    </div>
                                                )}

                                                {step.id === "Arrived at Port" && requestData.portName && (
                                                    <div className="p-4 rounded-2xl bg-zinc-50 border border-black/5 text-sm font-medium flex justify-between items-center">
                                                        <span className="text-zinc-500">Arrival Port:</span>
                                                        <span className="text-black font-bold">{requestData.portName}</span>
                                                    </div>
                                                )}

                                                {step.id === "Cleared Customs" && requestData.customsNotes && (
                                                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm leading-relaxed">
                                                        <span className="block text-emerald-800 font-bold mb-2">Release Notes:</span>
                                                        <span className="text-emerald-700 font-light">"{requestData.customsNotes}"</span>
                                                    </div>
                                                )}

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