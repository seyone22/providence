// @/app/components/ClientAgentCard.tsx
"use client";

import { User, MessageCircle } from "lucide-react";
import { markLeadAsQualified } from "@/actions/tracking-actions";

interface ClientAgentCardProps {
    requestId: string;
    clientFirstName: string;
    agentName: string;
    agentEmail: string;
    agentWhatsapp: string;
    agentImage: string;
}

export default function ClientAgentCard({
                                            requestId,
                                            clientFirstName,
                                            agentName,
                                            agentEmail,
                                            agentWhatsapp,
                                            agentImage
                                        }: ClientAgentCardProps) {

    // This fires the server action in the background when either link is clicked
    const handleContactClick = () => {
        markLeadAsQualified(requestId);
    };

    return (
        <div className="mb-16 md:mb-24">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-black mb-8">
                Hello {clientFirstName}, <span className="text-zinc-400 font-light">thank you for verifying your request.</span>
            </h2>

            <div className="bg-white border border-black/5 shadow-2xl shadow-black/[0.03] rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left mx-auto max-w-3xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-[0.02] pointer-events-none">
                    <MessageCircle size={200} />
                </div>

                <div className="w-16 h-16 shrink-0 bg-zinc-50 border border-black/5 rounded-full flex items-center justify-center relative z-10 shadow-sm overflow-hidden">
                    {agentImage ? (
                        <img src={agentImage} alt={agentName} className="w-full h-full object-cover" />
                    ) : (
                        <User className="h-7 w-7 text-zinc-400" />
                    )}
                </div>

                <div className="flex-1 relative z-10">
                    <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                        I'm <strong className="text-black font-bold">{agentName}</strong>, and I'm here to assist you with securing your dream vehicle. The details of your inquiry are shown below along with your live tracker.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-6">

                        {/* Email Button */}
                        <a
                            href={`mailto:${agentEmail}`}
                            onClick={handleContactClick}
                            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl shadow-black/10 hover:scale-[1.02] transition-transform"
                        >
                            <MessageCircle size={18} /> Email Me
                        </a>

                        {/* WhatsApp Button */}
                        {agentWhatsapp && (
                            <a
                                href={`https://wa.me/${agentWhatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={handleContactClick}
                                className="inline-flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#128C7E] px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/20"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                </svg>
                                WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}