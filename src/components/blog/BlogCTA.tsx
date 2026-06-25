import { ArrowRight, Calculator } from "lucide-react";
import { Reveal } from "@/components/Reveal";

// End-of-post call to action. Two genuine next steps: get an exact landed-cost
// quote (inquiry on the Japan landing page) or estimate it yourself (calculator).
export default function BlogCTA({
  heading = "Thinking about importing? Let's price your exact car.",
  body = "Tell us the make, model and year you want and we'll come back with a full landed-cost quote — car price, shipping, customs, VAT and VRT included — before you commit to a single euro.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <Reveal
      y={24}
      duration={0.7}
      className="my-14 overflow-hidden rounded-[2rem] bg-black p-8 md:p-12 relative"
    >
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-sky-500/20 blur-[90px] pointer-events-none" />
      <div className="relative z-10 max-w-2xl">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-sky-400 mb-3">
          Free · No commitment
        </p>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4">
          {heading}
        </h2>
        <p className="text-white/60 font-light leading-relaxed mb-8 text-base md:text-lg">
          {body}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/import-japanese-cars-to-ireland#inquiry"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition-transform hover:scale-105"
          >
            Begin your import inquiry
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="/ireland-cost-calculator"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            <Calculator size={16} className="text-sky-400" />
            Estimate the cost yourself
          </a>
        </div>
      </div>
    </Reveal>
  );
}
