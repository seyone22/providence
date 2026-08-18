import type { Metadata } from "next";
import DotGlobe, {
  GLOBE_PALETTE_DARK,
  GLOBE_PALETTE_LIGHT,
} from "@/components/DotGlobe";
import GradientMesh from "@/components/GradientMesh";
import LandedCostBar from "@/components/LandedCostBar";
import OdometerCounter from "@/components/OdometerCounter";
import RadialBurst from "@/components/RadialBurst";
import VoyageTrack from "@/components/VoyageTrack";
import { GLOBE_PLACES, GLOBE_ROUTES } from "@/config/globe";

/**
 * Internal preview of the canvas motion pieces. Not linked from anywhere and
 * explicitly de-indexed — it exists so these can be reviewed at real size,
 * against both backgrounds, before they are dropped into a marketing page.
 */
export const metadata: Metadata = {
  title: "Motion lab — Providence Auto",
  robots: { index: false, follow: false },
};

function Panel({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-24">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
        {title}
      </h2>
      <p className="mt-2 mb-8 max-w-2xl text-sm leading-relaxed text-zinc-500">
        {note}
      </p>
      {children}
    </section>
  );
}

export default function MotionLabPage() {
  const destinations = GLOBE_PLACES.filter(
    (place) => place.role === "destination",
  ).length;

  return (
    <main className="min-h-screen bg-white px-6 py-20 font-sans text-black">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
          Internal preview
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Motion lab
        </h1>
        <p className="mt-4 mb-4 max-w-2xl leading-relaxed text-zinc-600">
          Animated visuals for marketing pages. The two canvas pieces run one{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
            requestAnimationFrame
          </code>{" "}
          loop each and pause when scrolled out of view; the rest play once on
          entry. All of them settle to their finished state under{" "}
          <em>prefers-reduced-motion</em>.
        </p>
        <p className="mb-20 max-w-2xl text-sm leading-relaxed text-zinc-500">
          The data-bearing ones render <em>finished</em> on the server and
          rewind on the client before the first paint, so a crawler or a visitor
          without JavaScript gets the real figures rather than an empty bar
          reading £0.
        </p>

        <Panel
          title="Dot globe"
          note={`${GLOBE_PLACES.length} markers and ${GLOBE_ROUTES.length} shipping lanes, ${destinations} of them delivery markets — all read from src/config/globe.ts. Drag to spin it. Land comes from an equirectangular mask sampled with getImageData, the same technique Stripe uses.`}
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-white p-4">
              <DotGlobe palette={GLOBE_PALETTE_LIGHT} />
              <p className="pb-2 text-center text-xs text-zinc-400">
                Light palette
              </p>
            </div>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
              <DotGlobe palette={GLOBE_PALETTE_DARK} />
              <p className="pb-2 text-center text-xs text-zinc-500">
                Dark palette
              </p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Radial burst"
          note="Particles travelling outward along fixed spokes. Every spoke keeps its angle for the life of the component — only the radius animates — which is what gives the clean fan instead of a scatter."
        >
          <div className="space-y-10">
            <RadialBurst className="h-[420px] w-full rounded-3xl" />
            <div className="grid gap-10 md:grid-cols-2">
              <RadialBurst
                className="h-[280px] w-full rounded-3xl"
                origin={[0.5, 0.5]}
                spread={360}
                rays={220}
                colours={["#0ea5e9", "#8b5cf6"]}
                backdrop={false}
              />
              <RadialBurst
                className="h-[280px] w-full rounded-3xl bg-zinc-950"
                origin={[0, 1]}
                spread={90}
                rotation={-45}
                rays={120}
                colours={["#2dd4bf", "#ec4899"]}
                backdrop={false}
              />
            </div>
          </div>
        </Panel>

        <Panel
          title="Voyage track"
          note="The globe's arc reveal flattened into a section band: the sea lane strokes on from the origin port, a vessel rides the leading end, and each stage pip lights as it is passed. The route is a Bézier evaluated in code rather than measured off the DOM, so the marker position is computable without a laid-out document. Pass real statusHistory to drive it from a request."
        >
          <div className="rounded-3xl border border-zinc-200 p-6">
            <VoyageTrack />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 p-4">
              <p className="mb-2 text-xs text-zinc-400">Held at 35% — at sea</p>
              <VoyageTrack progress={0.35} />
            </div>
            <div className="rounded-3xl border border-zinc-200 p-4">
              <p className="mb-2 text-xs text-zinc-400">
                Held at 90% — cleared
              </p>
              <VoyageTrack progress={0.9} />
            </div>
          </div>
        </Panel>

        <Panel
          title="Landed cost build-up"
          note="The argument that the auction price is only part of what a car costs to land. Every figure is computed by the same HMRC-derived engine as the admin sourcing tool (lib/uk-landed-cost.ts) — no rate is written down here, so this cannot drift from the real calculator."
        >
          <div className="rounded-3xl border border-zinc-200 p-8">
            <LandedCostBar />
          </div>
        </Panel>

        <Panel
          title="Odometer"
          note="A count-up as the instrument the number would actually come from. Columns are geared to each other rather than animated independently — the units drum spins while the higher ones sit still and flick over, as a real drum does. The three figures below are placeholders chosen to show different digit counts; replace them with real ones before this goes on a public page."
        >
          <div className="grid gap-8 rounded-3xl border border-zinc-200 p-8 sm:grid-cols-3">
            <OdometerCounter
              value={4812}
              label="Cars landed"
              className="text-4xl"
            />
            <OdometerCounter
              value={24}
              label="Markets served"
              className="text-4xl"
            />
            <OdometerCounter
              value={128400}
              prefix="£"
              label="Duty saved via CEPA"
              className="text-4xl"
            />
          </div>
        </Panel>

        <Panel
          title="Gradient mesh"
          note="The existing background layer, now with an animated variant: four blurred blobs drifting on their own transforms. Compositor-only, so it costs nothing per frame regardless of hero size."
        >
          <div className="grid gap-10 md:grid-cols-2">
            <div className="relative h-[280px] overflow-hidden rounded-3xl border border-zinc-200">
              <GradientMesh fade={false} />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-zinc-500">
                Static
              </span>
            </div>
            <div className="relative h-[280px] overflow-hidden rounded-3xl border border-zinc-200">
              <GradientMesh fade={false} animated />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-zinc-500">
                Animated
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </main>
  );
}
