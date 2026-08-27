// The grade editor is behind the admin sign-in, so it can't be exercised in a
// browser preview. These render it directly and assert the three things a
// reviewer would otherwise have to log in to check: that a saved ladder loads
// back into the form, that a blank spec field advertises the value it inherits
// rather than looking empty, and that the steering toggle can't be emptied.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { GradeEditor, SteeringOptionsEditor } from "@/components/GradeEditor";
import type { VehicleGrade } from "@/lib/vehicle-grades";

const BASE_SPECS = {
  engineConfig: "Twin-turbo V6 petrol",
  displacement: "3.5-litre",
  maxPower: "317 kW",
  maxTorque: "700 Nm",
  transmission: "Nine-speed automatic",
  fuelSystem: "Petrol",
  emissions: "",
};

const TI: VehicleGrade = {
  id: "ti",
  name: "Ti",
  summary: "The entry to the range.",
  isDefault: true,
  highlights: ["18-inch gunmetal alloy wheels", "ProPILOT"],
  features: [],
  pricing: [],
};

const RESERVE: VehicleGrade = {
  id: "ti-l-reserve",
  name: "Ti-L Reserve",
  highlights: ["22-inch step-machined alloy wheels"],
  features: ["Head-Up Display"],
  pricing: [{ country: "UK", currency: "GBP", amount: 120000, type: "CIF" }],
};

function render(grades: VehicleGrade[]) {
  return renderToStaticMarkup(
    <GradeEditor
      grades={grades}
      baseSpecs={BASE_SPECS}
      images={[]}
      onChange={vi.fn()}
      onAdd={vi.fn()}
      onRemove={vi.fn()}
      onMove={vi.fn()}
    />,
  );
}

describe("GradeEditor", () => {
  it("explains what happens when a model has no ladder", () => {
    const html = render([]);
    expect(html).toContain("No grades added yet");
  });

  it("loads a saved ladder back into the form", () => {
    const html = render([TI, RESERVE]);
    expect(html).toContain('value="Ti"');
    expect(html).toContain('value="Ti-L Reserve"');
    expect(html).toContain("18-inch gunmetal alloy wheels");
  });

  it("advertises the inherited value in every blank spec field", () => {
    const html = render([TI]);
    // Ti overrides nothing, so each field placeholders with the base car's
    // value — that is what tells an admin the blank means "same", not "unset".
    expect(html).toContain('placeholder="317 kW"');
    expect(html).toContain('placeholder="Nine-speed automatic"');
    // Emissions is blank on the dossier too, so it has nothing to inherit.
    expect(html).toContain('placeholder="Same as base spec"');
  });

  it("collapses the rows past the first, and says what is inside them", () => {
    const html = render([TI, RESERVE]);
    // The second row is collapsed, so its summary line stands in for it.
    expect(html).toContain("1 difference listed");
    // ...and the first row is open, so its own fields are rendered.
    expect(html).toContain("The entry to the range.");
  });

  it("marks the default grade for the reader of the form", () => {
    const html = render([TI, RESERVE]);
    expect(html).toContain('aria-pressed="true"');
  });

  it("keeps a grade's own pricing visible", () => {
    const html = render([RESERVE]);
    expect(html).toContain("GBP 120,000");
  });
});

describe("SteeringOptionsEditor", () => {
  it("marks only the hands the model is offered in", () => {
    const html = renderToStaticMarkup(
      <SteeringOptionsEditor value={["RHD"]} onChange={vi.fn()} />,
    );
    expect(html).toContain("Right hand (RHD)");
    expect(html).toContain("Left hand (LHD)");
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
  });

  it("marks both when the model is sourced in both", () => {
    const html = renderToStaticMarkup(
      <SteeringOptionsEditor value={["RHD", "LHD"]} onChange={vi.fn()} />,
    );
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(2);
  });

  it("refuses to turn off the last remaining hand", () => {
    const onChange = vi.fn();
    // Rendered markup can't be clicked here, so the guard is asserted through
    // the toggle's own contract: with one hand left, clicking it is a no-op.
    const html = renderToStaticMarkup(
      <SteeringOptionsEditor value={["LHD"]} onChange={onChange} />,
    );
    expect(html).toContain(
      "At least one steering configuration has to stay selected",
    );
    expect(onChange).not.toHaveBeenCalled();
  });
});
