/**
 * Stripe-style gradient-mesh background layer for hero/section backgrounds.
 * Renders absolutely-positioned, non-interactive layers; drop it inside any
 * `relative` section behind `z-10` content.
 *
 * - `image` (optional): a hero photo to show beneath the mesh.
 * - `fade` (default true): adds a bottom fade to white so the hero blends into
 *   the page below.
 * - `overlay` (default "wash"): how the photo is treated for text legibility.
 *
 * ## Overlay variants
 *
 * `"wash"` — the original treatment: flat 25% white plus a strong bottom-up
 * white gradient across the entire photo. Legible anywhere, but it bleaches the
 * subject, so it only suits photos used as abstract texture.
 *
 * - `animated` (default false): swaps the painted mesh for four drifting blobs.
 *
 * `"spotlight"` — for heroes where the photo is content rather than texture.
 * Instead of bleaching the whole frame it buys contrast only where the copy
 * actually sits: a soft radial scrim centred on the text column, a much lighter
 * flat wash, and the mesh dropped to a third of its opacity so the photo keeps
 * its own colour. The frame's edges and lower third stay saturated, so the
 * subject reads. Pair it with `pa-text-scrim` on the copy (see globals.css) —
 * the radial scrim handles the bulk of the contrast and the text shadow covers
 * the places where a busy photo pokes through.
 */
/**
 * The four colour stops of `.pa-mesh`, restated as movable blobs.
 *
 * Positions are deliberately outside the box on at least one edge — a blob whose
 * whole circle is visible reads as a circle, however heavily it is blurred. The
 * durations are mutually prime-ish so the four never resynchronise into an
 * obvious loop.
 */
const MESH_BLOBS = [
  {
    colour: "rgba(56, 189, 248, 0.5)",
    left: "-15%",
    top: "-20%",
    size: "70%",
    animation: "pa-drift-a",
    duration: "13s",
    delay: "0s",
  },
  {
    colour: "rgba(139, 92, 246, 0.45)",
    left: "55%",
    top: "-25%",
    size: "75%",
    animation: "pa-drift-b",
    duration: "17s",
    delay: "-3s",
  },
  {
    colour: "rgba(236, 72, 153, 0.36)",
    left: "35%",
    top: "45%",
    size: "80%",
    animation: "pa-drift-c",
    duration: "11s",
    delay: "-6s",
  },
  {
    colour: "rgba(45, 212, 191, 0.4)",
    left: "-10%",
    top: "40%",
    size: "68%",
    animation: "pa-drift-d",
    duration: "19s",
    delay: "-9s",
  },
] as const;

export default function GradientMesh({
  fade = true,
  image,
  overlay = "wash",
  animated = false,
  className = "",
}: {
  fade?: boolean;
  image?: string;
  overlay?: "wash" | "spotlight";
  /** Drifting blobs instead of the static painted mesh. */
  animated?: boolean;
  className?: string;
}) {
  const spotlight = overlay === "spotlight";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {image && (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {spotlight ? (
            <>
              {/* Barely-there flat lift; the radial scrim does the real work */}
              <div className="absolute inset-0 bg-white/10" />
              {/* Contrast only under the copy — edges keep the photo's colour */}
              <div className="pa-hero-spotlight absolute inset-0" />
              {/* Light bottom fade so the section still meets the white page */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent" />
            </>
          ) : (
            <>
              {/* Soft white washes keep hero text readable over the photo */}
              <div className="absolute inset-0 bg-white/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/45 to-white/10" />
            </>
          )}
        </>
      )}
      {animated ? (
        <div
          className={`absolute inset-0 ${image ? (spotlight ? "opacity-30" : "opacity-75") : ""}`}
        >
          {MESH_BLOBS.map((blob) => (
            <div
              key={blob.animation}
              className="pa-mesh-blob"
              style={{
                background: blob.colour,
                left: blob.left,
                top: blob.top,
                width: blob.size,
                height: blob.size,
                animation: `${blob.animation} ${blob.duration} ease-in-out infinite`,
                animationDelay: blob.delay,
              }}
            />
          ))}
        </div>
      ) : (
        <div
          className={`pa-mesh absolute inset-0 ${image ? (spotlight ? "opacity-30" : "opacity-75") : ""}`}
        />
      )}
      {fade && (
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
      )}
    </div>
  );
}
