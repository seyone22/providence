/**
 * Spoke maths for <RadialBurst />.
 *
 * Pure and framework-free, for the same reason as geo.ts: the component is a
 * requestAnimationFrame loop, and anything only reachable from inside one cannot
 * be tested or rendered outside a compositing browser.
 */

export type Rgb = [number, number, number];

export type Spoke = {
  /** Fixed for the life of the burst — only the particle's radius animates. */
  angle: number;
  colour: Rgb;
  /** How far along the maximum radius this spoke reaches, 0..1. */
  reach: number;
  /** Revolutions per second through its cycle. */
  velocity: number;
  /** Starting offset into the cycle, 0..1. */
  phase: number;
  /** Trail length as a fraction of the maximum radius. */
  trail: number;
};

/** Mixes two #rrggbb colours. */
export function mixHex(from: string, to: string, t: number): Rgb {
  const parse = (hex: string): Rgb => {
    const value = Number.parseInt(hex.replace("#", ""), 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  };
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  return [
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
  ];
}

/**
 * Deterministic pseudo-random in [0, 1), hashed from the spoke index.
 *
 * Not Math.random: the layout must be identical on every mount, and identical
 * between a server render and the client that hydrates it.
 */
export function hashNoise(index: number, salt: number): number {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export type SpokeOptions = {
  rays: number;
  /** Angular span in degrees. 360 is a full starburst. */
  spread: number;
  /** Direction the fan points, in degrees. -90 is straight up. */
  rotation: number;
  colours: [string, string];
};

export function buildSpokes({
  rays,
  spread,
  rotation,
  colours,
}: SpokeOptions): Spoke[] {
  return Array.from({ length: rays }, (_, i) => {
    const t = rays === 1 ? 0.5 : i / (rays - 1);
    return {
      angle: (rotation - spread / 2 + spread * t) * (Math.PI / 180),
      colour: mixHex(colours[0], colours[1], t),
      // Varying the reach is what stops the outer edge reading as a hard circle.
      reach: 0.55 + hashNoise(i, 1) * 0.45,
      velocity: 0.12 + hashNoise(i, 2) * 0.22,
      phase: hashNoise(i, 3),
      trail: 0.1 + hashNoise(i, 4) * 0.22,
    };
  });
}

export type SpokeFrame = {
  /** Distance of the particle from the origin, in pixels. */
  head: number;
  /** Distance of the trail's far end, in pixels. */
  tail: number;
  /** 0..1 opacity envelope — fades in on departure and out on arrival. */
  life: number;
};

/**
 * Where a spoke's particle is at `elapsed` seconds.
 *
 * The `life` envelope is a sine over the cycle rather than a hard cut, so a
 * particle never pops into or out of existence at the origin or the rim.
 */
export function spokeFrame(
  spoke: Spoke,
  elapsed: number,
  speed: number,
  maxRadius: number,
): SpokeFrame {
  const progress =
    (((elapsed * spoke.velocity * speed + spoke.phase) % 1) + 1) % 1;
  const head = progress * spoke.reach * maxRadius;
  return {
    head,
    tail: Math.max(0, head - spoke.trail * maxRadius),
    life: Math.sin(Math.PI * progress) ** 0.6,
  };
}

/** The radius that reaches the furthest corner from an origin inside the box. */
export function maxRadiusFrom(
  originX: number,
  originY: number,
  width: number,
  height: number,
): number {
  return Math.hypot(
    Math.max(originX, width - originX),
    Math.max(originY, height - originY),
  );
}
