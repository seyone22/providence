import { describe, expect, it } from "vitest";
import {
  angleBetween,
  arcPoint,
  fibonacciSphere,
  isLand,
  type LandMask,
  landPoints,
  latLngToVec3,
  liftFactor,
  project,
  rotateX,
  rotateY,
} from "@/lib/globe/geo";

const close = (a: number, b: number, tolerance = 1e-9) =>
  Math.abs(a - b) < tolerance;

/** Builds a mask where a rectangular lat/lng window is land and the rest ocean. */
function maskWithLandBox(
  width: number,
  height: number,
  box: { x0: number; x1: number; y0: number; y1: number },
): LandMask {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const inside = x >= box.x0 && x < box.x1 && y >= box.y0 && y < box.y1;
      const i = (y * width + x) * 4;
      data[i] = inside ? 255 : 0;
      data[i + 1] = data[i];
      data[i + 2] = data[i];
      data[i + 3] = 255;
    }
  }
  return { data, width, height };
}

describe("latLngToVec3", () => {
  it("puts the null island on the +Z axis, facing the camera", () => {
    const v = latLngToVec3({ lat: 0, lng: 0 });
    expect(close(v.x, 0)).toBe(true);
    expect(close(v.y, 0)).toBe(true);
    expect(close(v.z, 1)).toBe(true);
  });

  it("puts 90 degrees east on the +X axis", () => {
    const v = latLngToVec3({ lat: 0, lng: 90 });
    expect(close(v.x, 1)).toBe(true);
    expect(close(v.z, 0)).toBe(true);
  });

  it("puts the north pole on the +Y axis regardless of longitude", () => {
    for (const lng of [-180, -37, 0, 91, 180]) {
      const v = latLngToVec3({ lat: 90, lng });
      expect(close(v.y, 1, 1e-12)).toBe(true);
      expect(close(Math.hypot(v.x, v.z), 0, 1e-12)).toBe(true);
    }
  });

  it("always returns a unit vector", () => {
    for (const point of [
      { lat: 51.51, lng: -0.13 },
      { lat: -33.87, lng: 151.21 },
      { lat: 6.93, lng: 79.86 },
      { lat: -85, lng: 179 },
    ]) {
      const v = latLngToVec3(point);
      expect(close(Math.hypot(v.x, v.y, v.z), 1, 1e-12)).toBe(true);
    }
  });

  it("scales by the radius argument", () => {
    const v = latLngToVec3({ lat: 12, lng: 34 }, 5);
    expect(close(Math.hypot(v.x, v.y, v.z), 5, 1e-12)).toBe(true);
  });
});

describe("rotation", () => {
  it("rotateY by a quarter turn moves +Z onto +X", () => {
    const v = rotateY({ x: 0, y: 0, z: 1 }, Math.PI / 2);
    expect(close(v.x, 1, 1e-12)).toBe(true);
    expect(close(v.z, 0, 1e-12)).toBe(true);
  });

  it("rotateY leaves latitude untouched", () => {
    const v = latLngToVec3({ lat: 45, lng: 10 });
    const spun = rotateY(v, 1.234);
    expect(close(spun.y, v.y, 1e-12)).toBe(true);
  });

  it("rotations preserve length", () => {
    const v = latLngToVec3({ lat: -22, lng: 143 });
    for (const spun of [rotateY(v, 2.1), rotateX(v, -0.7)]) {
      expect(close(Math.hypot(spun.x, spun.y, spun.z), 1, 1e-12)).toBe(true);
    }
  });
});

describe("fibonacciSphere", () => {
  it("handles the degenerate counts", () => {
    expect(fibonacciSphere(0)).toEqual([]);
    expect(fibonacciSphere(-5)).toEqual([]);
    expect(fibonacciSphere(1)).toEqual([{ lat: 0, lng: 0 }]);
  });

  it("returns the requested number of in-range coordinates", () => {
    const points = fibonacciSphere(2000);
    expect(points).toHaveLength(2000);
    for (const { lat, lng } of points) {
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
      expect(lng).toBeGreaterThanOrEqual(-180);
      expect(lng).toBeLessThan(180);
      expect(Number.isNaN(lat)).toBe(false);
      expect(Number.isNaN(lng)).toBe(false);
    }
  });

  it("spans pole to pole", () => {
    const points = fibonacciSphere(500);
    const lats = points.map((p) => p.lat);
    expect(Math.min(...lats)).toBeCloseTo(-90, 5);
    expect(Math.max(...lats)).toBeCloseTo(90, 5);
  });

  it("distributes evenly by area rather than by latitude band", () => {
    // The point of the spiral: equal-area hemispheres get equal counts. A naive
    // lat/lng grid would pile points into the polar caps instead.
    const points = fibonacciSphere(10000);
    // The tropics (|lat| < 30) are half the sphere's surface area.
    const tropics = points.filter((p) => Math.abs(p.lat) < 30).length;
    expect(tropics / points.length).toBeGreaterThan(0.47);
    expect(tropics / points.length).toBeLessThan(0.53);
  });
});

describe("isLand", () => {
  const mask = maskWithLandBox(360, 180, { x0: 180, x1: 270, y0: 45, y1: 90 });

  it("maps lng/lat onto the equirectangular mask", () => {
    // Box covers lng [0, 90), lat (0, 45].
    expect(isLand(mask, { lat: 20, lng: 45 })).toBe(true);
    expect(isLand(mask, { lat: -20, lng: 45 })).toBe(false);
    expect(isLand(mask, { lat: 20, lng: -45 })).toBe(false);
  });

  it("clamps the antimeridian and the poles instead of reading out of bounds", () => {
    for (const point of [
      { lat: 90, lng: 180 },
      { lat: -90, lng: -180 },
      { lat: 90, lng: -180 },
    ]) {
      expect(() => isLand(mask, point)).not.toThrow();
      expect(typeof isLand(mask, point)).toBe("boolean");
    }
  });

  it("landPoints keeps only the land candidates", () => {
    const kept = landPoints(mask, [
      { lat: 20, lng: 45 },
      { lat: -20, lng: 45 },
      { lat: 10, lng: 10 },
    ]);
    expect(kept).toEqual([
      { lat: 20, lng: 45 },
      { lat: 10, lng: 10 },
    ]);
  });
});

describe("arcPoint", () => {
  const london = latLngToVec3({ lat: 51.51, lng: -0.13 });
  const tokyo = latLngToVec3({ lat: 35.68, lng: 139.69 });

  it("starts and ends on the endpoints when there is no lift", () => {
    const start = arcPoint(london, tokyo, 0, 0);
    const end = arcPoint(london, tokyo, 1, 0);
    expect(close(start.x, london.x, 1e-9)).toBe(true);
    expect(close(start.y, london.y, 1e-9)).toBe(true);
    expect(close(start.z, london.z, 1e-9)).toBe(true);
    expect(close(end.x, tokyo.x, 1e-9)).toBe(true);
    expect(close(end.z, tokyo.z, 1e-9)).toBe(true);
  });

  it("touches down at both ends even with lift, and bulges in the middle", () => {
    const radiusAt = (t: number) => {
      const p = arcPoint(london, tokyo, t, 0.4);
      return Math.hypot(p.x, p.y, p.z);
    };
    expect(radiusAt(0)).toBeCloseTo(1, 9);
    expect(radiusAt(1)).toBeCloseTo(1, 9);
    expect(radiusAt(0.5)).toBeCloseTo(1.4, 9);
    expect(radiusAt(0.25)).toBeGreaterThan(1);
  });

  it("stays on the great circle, not the straight chord", () => {
    // The chord midpoint sinks below the surface; the arc midpoint does not.
    const mid = arcPoint(london, tokyo, 0.5, 0);
    expect(Math.hypot(mid.x, mid.y, mid.z)).toBeCloseTo(1, 9);
    const chordMid = {
      x: (london.x + tokyo.x) / 2,
      y: (london.y + tokyo.y) / 2,
      z: (london.z + tokyo.z) / 2,
    };
    expect(Math.hypot(chordMid.x, chordMid.y, chordMid.z)).toBeLessThan(0.95);
  });

  it("does not divide by zero for coincident endpoints", () => {
    const p = arcPoint(london, london, 0.5, 0.3);
    expect(Number.isNaN(p.x)).toBe(false);
    expect(Number.isNaN(p.y)).toBe(false);
    expect(Number.isNaN(p.z)).toBe(false);
  });

  it("does not divide by zero for antipodal endpoints", () => {
    const antipode = { x: -london.x, y: -london.y, z: -london.z };
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const p = arcPoint(london, antipode, t, 0.3);
      expect(Number.isNaN(p.x)).toBe(false);
      expect(Number.isNaN(p.y)).toBe(false);
      expect(Number.isNaN(p.z)).toBe(false);
    }
  });
});

describe("liftFactor", () => {
  it("is flat at both ends and peaks at the midpoint", () => {
    expect(liftFactor(0, 0.2)).toBeCloseTo(1, 12);
    expect(liftFactor(1, 0.2)).toBeCloseTo(1, 12);
    expect(liftFactor(0.5, 0.2)).toBeCloseTo(1.2, 12);
  });

  it("is 1 everywhere when there is no lift", () => {
    for (const t of [0, 0.3, 0.5, 0.9, 1]) {
      expect(liftFactor(t, 0)).toBe(1);
    }
  });

  it("agrees with the scaling arcPoint applies", () => {
    // The contract the globe relies on: culling on the ground track and then
    // multiplying by liftFactor must land in the same place as asking arcPoint
    // for the lifted point directly.
    const a = latLngToVec3({ lat: 35.68, lng: 139.69 });
    const b = latLngToVec3({ lat: -1.29, lng: 36.82 });
    for (const t of [0.1, 0.35, 0.5, 0.8]) {
      const ground = arcPoint(a, b, t, 0);
      const k = liftFactor(t, 0.2);
      const lifted = arcPoint(a, b, t, 0.2);
      expect(ground.x * k).toBeCloseTo(lifted.x, 9);
      expect(ground.y * k).toBeCloseTo(lifted.y, 9);
      expect(ground.z * k).toBeCloseTo(lifted.z, 9);
    }
  });
});

describe("angleBetween", () => {
  it("is zero for identical vectors and pi for antipodes", () => {
    const v = latLngToVec3({ lat: 10, lng: 20 });
    expect(angleBetween(v, v)).toBeCloseTo(0, 6);
    expect(angleBetween(v, { x: -v.x, y: -v.y, z: -v.z })).toBeCloseTo(
      Math.PI,
      6,
    );
  });

  it("is a quarter turn between the equator and the pole", () => {
    expect(
      angleBetween(
        latLngToVec3({ lat: 0, lng: 0 }),
        latLngToVec3({ lat: 90, lng: 0 }),
      ),
    ).toBeCloseTo(Math.PI / 2, 9);
  });
});

describe("project", () => {
  it("maps the sphere centre to the canvas centre", () => {
    const p = project({ x: 0, y: 0, z: 1 }, 100, 200, 150);
    expect(p.x).toBe(200);
    expect(p.y).toBe(150);
    expect(p.visible).toBe(true);
  });

  it("flips the y axis so north is up on screen", () => {
    const north = project({ x: 0, y: 1, z: 0.001 }, 100, 200, 150);
    expect(north.y).toBeLessThan(150);
  });

  it("marks the far hemisphere invisible", () => {
    expect(project({ x: 0, y: 0, z: -1 }, 100, 0, 0).visible).toBe(false);
    expect(project({ x: 1, y: 0, z: 0 }, 100, 0, 0).visible).toBe(false);
  });
});
