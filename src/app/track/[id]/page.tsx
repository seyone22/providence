import MinimalHeader from "@/app/components/MinimalHeader";
import connectToDatabase from "@/lib/mongoose";
import Request from "@/models/Request";
import { notFound } from "next/navigation";
import {
    Inbox, Search, Handshake, CreditCard, FileCheck,
    Wrench, Ship, Anchor, Flag, CheckCircle2,
    FileText, Image as ImageIcon, ExternalLink,
    User, MessageCircle
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

    // Extract names for the welcome block
    const clientFirstName = requestData.name ? requestData.name.split(' ')[0] : 'there';
    const agentName = requestData.assignedToName || "your dedicated import specialist";

    return (
        <main className="min-h-screen bg-white text-black selection:bg-black/10 selection:text-black font-sans overflow-x-hidden pb-32">
            <MinimalHeader />

            {/* Light theme subtle top gradient for depth */}
            <div className="absolute top-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03)_0%,rgba(255,255,255,0)_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 md:pt-40">

                {/* === NEW: AGENT WELCOME CARD === */}
                <div className="mb-16 md:mb-24">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-black mb-8">
                        Hello {clientFirstName}, <span className="text-zinc-400 font-light">thank you for verifying your request.</span>
                    </h2>

                    <div className="bg-white border border-black/5 shadow-2xl shadow-black/[0.03] rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left mx-auto max-w-3xl relative overflow-hidden">
                        {/* Subtle background decoration */}
                        <div className="absolute -top-10 -right-10 opacity-[0.02] pointer-events-none">
                            <MessageCircle size={200} />
                        </div>

                        <div className="w-16 h-16 shrink-0 bg-zinc-50 border border-black/5 rounded-full flex items-center justify-center relative z-10 shadow-sm">
                            <User className="h-7 w-7 text-zinc-400" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                                I'm <strong className="text-black font-bold">{agentName}</strong>, and I'm here to assist you with securing your dream vehicle. The details of your inquiry are shown below along with your live tracker. Once you're ready, click below to initiate our conversation.
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-6">
                                <a href="mailto:support@providenceauto.com" className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl shadow-black/10 hover:scale-[1.02] transition-transform">
                                    <MessageCircle size={18} /> Chat Now
                                </a>
                                <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#128C7E] px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/20">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* === END WELCOME CARD === */}


                {/* Header Section */}
                <div className="text-center mb-20">
                    <p className="text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4 drop-shadow-sm">
                        Requested Vehicle
                    </p>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-black mb-4">
                        {requestData.make} {requestData.vehicle_model}
                    </h1>
                    <p className="text-lg text-zinc-500 font-medium">
                        Initiated on {new Date(requestData.createdAt).toLocaleDateString()}
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
                <div className="max-w-2xl mx-auto relative mt-8">
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

                            // Filter documents that belong to this specific timeline stage
                            const stepDocuments = requestData.documents?.filter((doc: any) => doc.stageAdded === step.id) || [];

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
                                        {(isActive || isCompleted) && (
                                            <div className="space-y-4 mt-4">

                                                {/* Text Data specific to each stage */}
                                                {step.id === "Vehicle Selection" && requestData.options && (
                                                    <div className="p-5 rounded-2xl bg-zinc-50 border border-black/5 text-sm leading-relaxed">
                                                        <span className="block text-zinc-800 font-bold mb-2">Proposed Options & Links:</span>
                                                        <span className="text-zinc-600 font-light whitespace-pre-wrap">{requestData.options}</span>
                                                    </div>
                                                )}

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

                                                {/* DYNAMIC DOCUMENTS / FILES associated with this stage */}
                                                {stepDocuments.length > 0 && (
                                                    <div className="grid gap-2 mt-2">
                                                        {stepDocuments.map((doc: any, idx: number) => (
                                                            <a
                                                                key={idx}
                                                                href={doc.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 p-3 bg-white border border-black/5 rounded-xl shadow-sm hover:shadow-md hover:border-black/10 transition-all group"
                                                            >
                                                                <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500 group-hover:text-black group-hover:bg-black/5 transition-colors shrink-0">
                                                                    {doc.fileType === "pdf" ? <FileText size={18} /> : <ImageIcon size={18} />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold text-black truncate">{doc.fieldName}</p>
                                                                    <p className="text-[10px] text-zinc-400 mt-0.5">Click to view document</p>
                                                                </div>
                                                                <ExternalLink size={16} className="text-zinc-300 group-hover:text-black mr-2 transition-colors shrink-0" />
                                                            </a>
                                                        ))}
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