"use client";

import { ArrowRight, CalendarClock, ImageOff, Images } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getGalleryPreviewCars } from "@/actions/spec-actions";
import { Reveal } from "@/components/Reveal";
import {
  formatLeadPrice,
  formatVehicleTitle,
  type PriceEntry,
} from "@/lib/vehicle";

type PreviewCar = {
  _id: string;
  make: string;
  model: string;
  year?: string;
  slug?: string;
  images?: string[];
  heroImageUrl?: string;
  status?: string;
  pricing?: PriceEntry[];
  isUpcoming?: boolean;
};

type GalleryPreviewProps = {
  /**
   * When provided, only dossiers carrying one of these search tags are shown
   * (matched case-insensitively server-side). Omit to preview the whole live
   * catalogue, as the home page does.
   */
  tags?: string[];
  /** Small uppercase kicker above the heading. */
  eyebrow?: string;
  /** Section heading. */
  title?: string;
  /** Supporting copy under the heading. */
  subtitle?: string;
};

export default function GalleryPreview({
  tags,
  eyebrow = "Portfolio",
  title = "The Gallery",
  subtitle = "A curated selection of globally-sourced vehicles, ready to be commissioned to your exact specification.",
}: GalleryPreviewProps = {}) {
  const [cars, setCars] = useState<PreviewCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // Lean, purpose-built read: filters to Active and caps at 12 in SQL, and
    // only selects the columns a preview card renders — see
    // getGalleryPreviewCars for why that matters.
    getGalleryPreviewCars(tags, 12)
      .then((res) => {
        if (!active) return;
        setCars(res.success ? (res.data as PreviewCar[]) : []);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tags]);

  // Don't render an empty band when there's nothing published to show.
  if (!loading && cars.length === 0) return null;

  return (
    <section className="mt-24 md:mt-32">
      <Reveal y={30} duration={0.8}>
        <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Images className="text-sky-500 h-5 w-5" />
              <span className="text-zinc-400 font-bold tracking-[0.2em] uppercase text-xs">
                {eyebrow}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-black">
              {title}
            </h2>
            <p className="text-zinc-500 text-base md:text-lg font-light mt-3 max-w-xl">
              {subtitle}
            </p>
          </div>
          <Link
            href="/b2c/gallery"
            className="hidden md:inline-flex shrink-0 items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-bold text-sm hover:bg-sky-500 transition-colors duration-300 group"
          >
            View Collection
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </Reveal>

      {/* Horizontally scrollable strip. snap-proximity (not snap-mandatory)
          because mandatory snapping fights free-scrolling trackpad/wheel
          gestures — the strip visibly stutters as it forces a hard stop at
          every card. Proximity still aligns cards once you stop near one.
          overscroll-x-contain stops the gesture from bubbling into page
          scroll once the strip hits its end. */}
      <div className="flex gap-5 overflow-x-auto overscroll-x-contain pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 snap-x snap-proximity hide-scrollbar">
        {loading
          ? ["s1", "s2", "s3", "s4"].map((sk) => (
              <div
                key={sk}
                className="snap-start shrink-0 w-[260px] md:w-[320px]"
              >
                <div className="aspect-[4/3] rounded-[1.75rem] bg-zinc-100 animate-pulse" />
                <div className="h-4 w-2/3 bg-zinc-100 rounded-full mt-4 animate-pulse" />
              </div>
            ))
          : cars.map((car) => {
              const img = car.heroImageUrl || car.images?.[0];
              const title = formatVehicleTitle(car.make, car.model);
              const price = formatLeadPrice(car.pricing);
              return (
                <Link
                  key={car._id}
                  href={`/b2c/gallery/${car.slug || car._id}`}
                  className="snap-start shrink-0 w-[260px] md:w-[320px] group"
                >
                  <div className="relative aspect-[4/3] rounded-[1.75rem] overflow-hidden bg-zinc-100 border border-black/[0.07]">
                    {img ? (
                      <img
                        src={img}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <ImageOff size={28} />
                      </div>
                    )}
                    {/* Without this, an upcoming car reads as in-stock in the
                        strip — a "From £X" badge on a car nobody can order
                        yet is the misleading combination. */}
                    {car.isUpcoming && (
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-sky-600/95 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full backdrop-blur-sm">
                        <CalendarClock size={11} /> Coming Soon
                      </div>
                    )}
                    {price && (
                      <div className="absolute bottom-3 right-3 bg-white/95 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                        {price}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 px-1">
                    <h3 className="font-bold text-black tracking-tight group-hover:text-sky-500 transition-colors duration-300 line-clamp-1">
                      {title}
                    </h3>
                    <p className="text-zinc-400 text-sm font-light">
                      {car.year || ""}
                    </p>
                  </div>
                </Link>
              );
            })}
      </div>

      {/* Mobile-only view-all */}
      <div className="md:hidden mt-2">
        <Link
          href="/b2c/gallery"
          className="inline-flex items-center gap-2 font-bold text-black"
        >
          View Collection
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
