/**
 * Stripe-style gradient-mesh + fine-grid background layer for hero/section
 * backgrounds. Renders absolutely-positioned, non-interactive layers; drop it
 * inside any `relative` section behind `z-10` content.
 *
 * - `fade` (default true) adds a bottom fade to white so the hero blends into
 *   the page. Set false for sections that aren't followed by a white block.
 */
export default function GradientMesh({
    fade = true,
    className = "",
}: {
    fade?: boolean;
    className?: string;
}) {
    return (
        <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
        >
            <div className="pa-mesh absolute inset-0" />
            <div className="pa-grid absolute inset-0" />
            {fade && (
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
            )}
        </div>
    );
}
