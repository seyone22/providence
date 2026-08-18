/**
 * Sphere maths for <DotGlobe /> and <DotWorldMap />.
 *
 * Everything here is pure and framework-free so it can be unit-tested directly —
 * the canvas components are thin animation loops on top. Keep it that way: the
 * preview harness runs zero animation frames, so anything only reachable from
 * inside requestAnimationFrame is effectively untested.
 *
 * Coordinate convention (right-handed, camera on +Z looking towards the origin):
 *   lat  0, lng   0  ->  ( 0, 0,  1)  facing the viewer
 *   lat  0, lng  90  ->  ( 1, 0,  0)  right-hand edge
 *   lat 90, lng   0  ->  ( 0, 1,  0)  north pole, up
 */

export type LatLng = { lat: number; lng: number };
export type Vec3 = { x: number; y: number; z: number };

const DEG = Math.PI / 180;

/** Golden angle — the spacing that makes a Fibonacci sphere even. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function latLngToVec3({ lat, lng }: LatLng, radius = 1): Vec3 {
  const phi = lat * DEG;
  const lambda = lng * DEG;
  const cosPhi = Math.cos(phi);
  return {
    x: radius * cosPhi * Math.sin(lambda),
    y: radius * Math.sin(phi),
    z: radius * cosPhi * Math.cos(lambda),
  };
}

/** Spins a point about the polar axis. Positive `angle` scrolls the globe east. */
export function rotateY({ x, y, z }: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: x * cos + z * sin, y, z: z * cos - x * sin };
}

/** Tilts about the horizontal axis, so the globe can sit at a slight lean. */
export function rotateX({ x, y, z }: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x, y: y * cos - z * sin, z: y * sin + z * cos };
}

/**
 * Evenly distributes `count` points over the sphere using a Fibonacci spiral.
 *
 * The naive alternative — stepping latitude and longitude in fixed increments —
 * bunches points tightly at the poles and leaves the equator sparse. The spiral
 * keeps the spacing near-uniform everywhere, which is what makes the dot texture
 * read as a solid surface rather than a grid.
 */
export function fibonacciSphere(count: number): LatLng[] {
  if (count <= 0) return [];
  if (count === 1) return [{ lat: 0, lng: 0 }];

  const points: LatLng[] = [];
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const lat = Math.asin(Math.max(-1, Math.min(1, y))) / DEG;
    const theta = i * GOLDEN_ANGLE;
    // Wrap into [-180, 180] so the value is a normal longitude.
    const lng = ((((theta / DEG + 180) % 360) + 360) % 360) - 180;
    points.push({ lat, lng });
  }
  return points;
}

export type LandMask = {
  /** RGBA bytes, as returned by CanvasRenderingContext2D.getImageData. */
  data: Uint8ClampedArray | Uint8Array;
  width: number;
  height: number;
};

/**
 * Tests a coordinate against the equirectangular land mask produced by
 * scripts/generate-land-mask.mjs. White (red channel high) is land.
 */
export function isLand(mask: LandMask, { lat, lng }: LatLng): boolean {
  const u = (lng + 180) / 360;
  const v = (90 - lat) / 180;
  const x = Math.min(mask.width - 1, Math.max(0, Math.floor(u * mask.width)));
  const y = Math.min(mask.height - 1, Math.max(0, Math.floor(v * mask.height)));
  return mask.data[(y * mask.width + x) * 4] > 127;
}

/** Keeps only the candidate points that land on a continent. */
export function landPoints(mask: LandMask, candidates: LatLng[]): LatLng[] {
  return candidates.filter((point) => isLand(mask, point));
}

/**
 * A point `t` of the way along the great circle from `a` to `b`, lifted off the
 * surface so the arc bows outward.
 *
 * This is a spherical linear interpolation — the shortest path across the
 * sphere's surface, which is the route a ship or a flight actually takes, and
 * why these arcs look right rather than like straight chords. `lift` scales a
 * sine bulge that peaks at the midpoint; 0 hugs the surface.
 */
export function arcPoint(a: Vec3, b: Vec3, t: number, lift = 0.35): Vec3 {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega);

  let p: Vec3;
  if (sinOmega < 1e-6) {
    // Coincident or antipodal: fall back to a straight blend to avoid a
    // divide-by-zero. Antipodal pairs have no unique great circle anyway.
    p = {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      z: a.z + (b.z - a.z) * t,
    };
  } else {
    const wa = Math.sin((1 - t) * omega) / sinOmega;
    const wb = Math.sin(t * omega) / sinOmega;
    p = {
      x: a.x * wa + b.x * wb,
      y: a.y * wa + b.y * wb,
      z: a.z * wa + b.z * wb,
    };
  }

  const length = Math.hypot(p.x, p.y, p.z) || 1;
  const radius = 1 + lift * Math.sin(Math.PI * t);
  const scale = radius / length;
  return { x: p.x * scale, y: p.y * scale, z: p.z * scale };
}

/**
 * How far off the surface an arc sits at `t` — the sine bulge `arcPoint` applies,
 * exposed separately.
 *
 * Callers want this apart from the point itself because an arc must be culled by
 * where its *ground track* is, not by where the raised line is. A lifted point
 * near the limb can still have z > 0 while the ground beneath it has already
 * rotated out of sight; drawing it then flings the arc out past the edge of the
 * globe with nothing under it. Project the surface point, test its depth, and
 * only then scale by this factor.
 */
export function liftFactor(t: number, lift = 0.35): number {
  return 1 + lift * Math.sin(Math.PI * t);
}

/** Angular separation in radians — used to give longer routes longer flight times. */
export function angleBetween(a: Vec3, b: Vec3): number {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  return Math.acos(dot);
}

export type Projected = {
  x: number;
  y: number;
  depth: number;
  visible: boolean;
};

/**
 * Orthographic projection to canvas pixels.
 *
 * `depth` is the raw z, so callers can fade the far hemisphere. `visible` is the
 * near-side test; note it uses z > 0 against the unit sphere, so lifted arc
 * points just behind the limb still count as visible and the arc does not snap
 * off at the edge.
 */
export function project(
  v: Vec3,
  radius: number,
  cx: number,
  cy: number,
): Projected {
  return {
    x: cx + v.x * radius,
    y: cy - v.y * radius,
    depth: v.z,
    visible: v.z > 0,
  };
}
