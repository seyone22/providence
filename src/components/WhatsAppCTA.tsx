"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import {
  GENERAL_WHATSAPP_LINK,
  GENERAL_WHATSAPP_NUMBER,
} from "@/config/contact";

/** WhatsApp glyph — inlined so it stays crisp and needs no icon dependency. */
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <title>WhatsApp</title>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

/**
 * General-enquiries WhatsApp band for the home page. Deliberately shows the
 * number in plain text as well as linking it — a lot of people would rather
 * save it and message on their own terms than tap through.
 */
export default function WhatsAppCTA() {
  return (
    <Reveal
      y={30}
      duration={0.8}
      className="mt-20 md:mt-28 rounded-[2rem] md:rounded-[2.5rem] border border-black/[0.07] bg-zinc-50/60 p-8 md:p-12 overflow-hidden relative"
    >
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-[90px] bg-emerald-500/10" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
        <div className="flex-1">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white border border-black/10 shadow-sm mb-6">
            <WhatsAppIcon className="h-6 w-6 text-emerald-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-black mb-3">
            Got a question? Message us.
          </h2>
          <p className="text-zinc-600 text-base md:text-lg font-light leading-relaxed max-w-xl">
            General enquiries go straight to our team on WhatsApp — pricing,
            timelines, whether a car can even be imported into your country. No
            form required.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
          <div className="text-left md:text-right">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-1">
              WhatsApp (General)
            </p>
            <a
              href={`tel:${GENERAL_WHATSAPP_NUMBER.replace(/\s/g, "")}`}
              className="text-xl md:text-2xl font-bold tracking-tight text-black hover:text-emerald-600 transition-colors"
            >
              {GENERAL_WHATSAPP_NUMBER}
            </a>
          </div>

          <a
            href={GENERAL_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base px-7 py-4 rounded-2xl transition-colors shadow-md shadow-emerald-500/20"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat on WhatsApp
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>
      </div>
    </Reveal>
  );
}
