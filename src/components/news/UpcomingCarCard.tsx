import { ArrowRight, CalendarClock, ImageOff, Newspaper } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { NEWS_BASE_PATH } from "@/config/news";
import {
  formatLeadPrice,
  formatVehicleTitle,
  type PriceEntry,
} from "@/lib/vehicle";

/**
 * Shape returned by `getUpcomingCars()` — a lean projection of a spec dossier,
 * not the full record.
 */
export type UpcomingCar = {
  _id: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  slug: string;
  heroImageUrl: string;
  images: string[];
  pricing: unknown;
  expectedAvailability: string;
  newsSlug: string;
  /**
   * Absent on the upcoming rail (every car there is upcoming by definition);
   * present when a story links cars that may already be on sale. Defaults to
   * true so the rail keeps its badge without passing the flag.
   */
  isUpcoming?: boolean;
};

/**
 * A card for one announced-but-not-yet-available model.
 *
 * Carries two destinations on purpose: the car page (where the reader can
 * register interest) and, when the dossier names one, the news story the model
 * was announced in. The article link is a nested <Link>, so the card itself is
 * a plain container rather than one big anchor — nesting anchors is invalid
 * HTML and breaks keyboard navigation.
 */
export default function UpcomingCarCard({
  car,
  index = 0,
}: {
  car: UpcomingCar;
  index?: number;
}) {
  const image = car.heroImageUrl || car.images?.[0] || "";
  const title = formatVehicleTitle(car.make, car.model);
  const price = formatLeadPrice(car.pricing as PriceEntry[] | undefined);
  const carHref = `/b2c/gallery/${car.slug || car._id}`;
  const isUpcoming = car.isUpcoming !== false;

  return (
    <Reveal
      as="div"
      y={24}
      delay={(index % 3) * 0.06}
      duration={0.6}
      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-sky-500/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.07)]"
    >
      <Link href={carHref} className="block outline-none">
        <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
          {image ? (
            // biome-ignore lint/performance/noImgElement: remote R2 asset, intentional <img> per site convention
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-zinc-300">
              <ImageOff size={26} className="mb-1.5 opacity-50" />
              <span className="text-[11px] font-medium uppercase tracking-widest">
                No image
              </span>
            </div>
          )}
          {isUpcoming && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-sky-600/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              <CalendarClock size={11} /> Coming Soon
            </span>
          )}
          {price && (
            <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-black shadow-lg backdrop-blur-sm">
              {price}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Link href={carHref} className="outline-none">
          <h3 className="text-lg font-bold tracking-tight text-black transition-colors group-hover:text-sky-600 line-clamp-1">
            {title}
          </h3>
          <p className="mt-0.5 text-sm font-light text-zinc-500 line-clamp-1">
            {[car.year, car.trim].filter(Boolean).join(" · ") ||
              "Specification to be confirmed"}
          </p>
        </Link>

        {isUpcoming && car.expectedAvailability && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-600">
            <CalendarClock size={12} />
            {car.expectedAvailability}
          </p>
        )}

        <div className="mt-5 flex flex-1 flex-col justify-end gap-2.5 border-t border-black/5 pt-4">
          <Link
            href={carHref}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 transition-colors hover:text-sky-700"
          >
            {isUpcoming ? "Register interest" : "View the car"}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          {car.newsSlug && (
            <Link
              href={`${NEWS_BASE_PATH}/${car.newsSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-black"
            >
              <Newspaper size={13} className="shrink-0" />
              Read the announcement
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  );
}
