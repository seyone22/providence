/**
 * Stripe-style gradient-mesh background layer for hero/section backgrounds.
 * Renders absolutely-positioned, non-interactive layers; drop it inside any
 * `relative` section behind `z-10` content.
 *
 * - `image` (optional): a hero photo to show beneath the mesh. When provided,
 *   the photo sits at the back with soft white washes for text legibility, and
 *   the gradient mesh is layered over it at reduced opacity (so both read).
 * - `fade` (default true): adds a bottom fade to white so the hero blends into
 *   the page below.
 */
export default function GradientMesh({
  fade = true,
  image,
  className = "",
}: {
  fade?: boolean;
  image?: string;
  className?: string;
}) {
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
          {/* Soft white washes keep hero text readable over the photo */}
          <div className="absolute inset-0 bg-white/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/45 to-white/10" />
        </>
      )}
      <div
        className={`pa-mesh absolute inset-0 ${image ? "opacity-75" : ""}`}
      />
      {fade && (
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
      )}
    </div>
  );
}
