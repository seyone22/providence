"use client";

import { useState } from "react";
import { MessageCircle, Phone, PhoneCall, Mail, Clock, Globe, CalendarDays } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatInIST, formatInTz } from "@/lib/contactScheduling";

const METHOD_ICONS: Record<string, any> = {
    "WhatsApp": MessageCircle,
    "Call": Phone,
    "WhatsApp Call": PhoneCall,
    "Email": Mail,
};

interface Props {
    contactMethod?: string;
    contactDays?: string[];
    contactTimeWindow?: string;
    contactTimezone?: string;
    contactTimezoneLabel?: string;
    preferredContactAt?: string | Date | null;
}

export default function ContactPreferenceBadge({
    contactMethod, contactDays, contactTimeWindow, contactTimezone, contactTimezoneLabel, preferredContactAt,
}: Props) {
    const [open, setOpen] = useState(false);

    // Nothing captured yet — don't render the badge.
    if (!contactMethod) return null;

    const Icon = METHOD_ICONS[contactMethod] || MessageCircle;
    const istShort = preferredContactAt ? formatInIST(preferredContactAt) : null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                title="Preferred contact method & time"
                className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[11px] font-semibold transition-colors"
            >
                <Icon size={14} className="shrink-0" />
                <span className="hidden sm:inline">{istShort || contactMethod}</span>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm bg-white border-black/5 rounded-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-black flex items-center gap-2">
                            <Icon size={16} className="text-indigo-600" /> Contact Preferences
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3 py-1 text-sm">
                        <Row icon={<Icon size={14} className="text-indigo-600" />} label="Method" value={contactMethod} />
                        <Row
                            icon={<CalendarDays size={14} className="text-indigo-600" />}
                            label="When"
                            value={`${contactTimeWindow || "—"}${contactDays?.length ? ` · ${contactDays.join(", ")}` : ""}`}
                        />

                        {preferredContactAt && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 uppercase tracking-wide mb-0.5">
                                    <Clock size={13} /> Follow up by (IST)
                                </div>
                                <div className="text-emerald-900 font-semibold">{formatInIST(preferredContactAt)}</div>
                            </div>
                        )}

                        {preferredContactAt && contactTimezone && (
                            <Row
                                icon={<Globe size={14} className="text-zinc-400" />}
                                label="Customer local"
                                value={`${formatInTz(preferredContactAt, contactTimezone)} (${contactTimezoneLabel || contactTimezone})`}
                            />
                        )}
                        {!preferredContactAt && contactTimezone && (
                            <Row icon={<Globe size={14} className="text-zinc-400" />} label="Timezone" value={contactTimezoneLabel || contactTimezone} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-2">
            <div className="mt-0.5">{icon}</div>
            <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">{label}</div>
                <div className="text-zinc-800">{value}</div>
            </div>
        </div>
    );
}
