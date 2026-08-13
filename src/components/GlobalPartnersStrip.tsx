import Image from "next/image";
import { Reveal } from "@/components/Reveal";

/**
 * "Trusted by our global partners" logo strip. Shared by the home page and
 * the campaign landing pages — same seven marks, sizing and grayscale-to-
 * colour hover everywhere, so every page reads as one brand.
 */
export default function GlobalPartnersStrip({
  className = "mt-24 md:mt-32",
}: {
  className?: string;
}) {
  return (
    <Reveal
      y={30}
      duration={1}
      className={`max-w-5xl mx-auto w-full text-center ${className}`}
    >
      <p className="text-[10px] md:text-xs font-bold tracking-[0.25em] md:tracking-[0.3em] text-zinc-400 uppercase mb-8 md:mb-10 drop-shadow-sm">
        Trusted by our global partners
      </p>

      <div className="flex flex-nowrap justify-center items-center gap-3 sm:gap-6 md:gap-10 lg:gap-16 w-full">
        {[1, 2, 3, 4, 5, 6, 7].map((num, index) => (
          <Reveal
            key={num}
            y={0}
            scale={0.95}
            delay={index * 0.1}
            duration={0.8}
            className="relative shrink h-6 w-12 sm:h-8 sm:w-16 md:h-12 md:w-24 lg:h-16 lg:w-32 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-500 cursor-pointer"
          >
            <Image
              src={`/affiliate/${num}.png`}
              alt={`Global Partner ${num}`}
              fill
              className="object-contain"
            />
          </Reveal>
        ))}
      </div>
    </Reveal>
  );
}
