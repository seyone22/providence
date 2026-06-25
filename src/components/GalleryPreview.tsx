"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Images, ImageOff } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getAllSpecDossiers } from "@/actions/spec-actions";
import { formatVehicleTitle, formatLeadPrice, type PriceEntry } from "@/lib/vehicle";

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
};

export default function GalleryPreview() {
    const [cars, setCars] = useState<PreviewCar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        getAllSpecDossiers()
            .then((res) => {
                if (!active) return;
                const data = (res.success ? res.data : []) as PreviewCar[];
                // Pool cap only — how many are *visible* is driven by viewport
                // width via the responsive card widths + horizontal scroll.
                setCars(data.filter((c) => c.status === "Active").slice(0, 12));
                setLoading(false);
            })
            .catch(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

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
                                Portfolio
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-black">
                            The Gallery
                        </h2>
                        <p className="text-zinc-500 text-base md:text-lg font-light mt-3 max-w-xl">
                            A curated selection of globally-sourced vehicles, ready to be
                            commissioned to your exact specification.
                        </p>
                    </div>
                    <Link
                        href="/b2c/gallery"
                        className="hidden md:inline-flex shrink-0 items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-bold text-sm hover:bg-sky-500 transition-colors duration-300 group"
                    >
                        View Collection
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </Reveal>

            {/* Horizontally scrollable strip */}
            <div className="flex gap-5 overflow-x-auto pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 snap-x snap-mandatory hide-scrollbar">
                {loading
                    ? ["s1", "s2", "s3", "s4"].map((sk) => (
                          <div key={sk} className="snap-start shrink-0 w-[260px] md:w-[320px]">
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
                                      <p className="text-zinc-400 text-sm font-light">{car.year || ""}</p>
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
