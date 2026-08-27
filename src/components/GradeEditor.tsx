"use client";

import { ChevronDown, GripVertical, Plus, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GRADE_SPEC_FIELDS, type VehicleGrade } from "@/lib/vehicle-grades";

/**
 * Editor for a model's grade ladder — Ti, Ti+, Ti-L, Ti-L Reserve.
 *
 * The authoring rule this UI is built around: **fill in only what changes.**
 * Every spec field placeholders with the dossier's own value and saving it
 * blank means "same as the base car", so a four-grade ladder is four short
 * lists of differences rather than four full spec sheets. That is also why
 * "What this grade adds" is the most prominent field on each row — it is
 * both the thing the admin actually knows and the thing the customer is
 * trying to find out.
 *
 * Rows are collapsed by default past the first: a Patrol has four grades and
 * an expanded row is tall enough that four of them bury the rest of the page.
 */
export function GradeEditor({
  grades,
  baseSpecs,
  images,
  onChange,
  onAdd,
  onRemove,
  onMove,
}: {
  grades: VehicleGrade[];
  /** The dossier's own spec values, shown as the placeholder for each override. */
  baseSpecs: Record<string, string>;
  /** The dossier's gallery, in order — `imageIndex` points into this. */
  images: string[];
  onChange: (index: number, patch: Partial<VehicleGrade>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="p-6 bg-zinc-50 rounded-[2.5rem] border border-zinc-200 space-y-4">
        {grades.length === 0 && (
          <p className="text-zinc-500 text-sm italic px-1">
            No grades added yet. The car page will show a single specification,
            and the inquiry form won&rsquo;t ask which grade the customer wants.
          </p>
        )}

        {grades.map((grade, index) => (
          <GradeRow
            // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional and freely reordered; no stable id exists while the name is still being typed
            key={index}
            grade={grade}
            index={index}
            total={grades.length}
            baseSpecs={baseSpecs}
            images={images}
            onChange={(patch) => onChange(index, patch)}
            onRemove={() => onRemove(index)}
            onMove={(direction) => onMove(index, direction)}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="w-full h-12 rounded-xl border-dashed border-zinc-300 text-zinc-600 hover:text-black hover:border-zinc-400 bg-white"
        >
          <Plus size={16} className="mr-2" /> Add grade
        </Button>
      </div>
    </div>
  );
}

function GradeRow({
  grade,
  index,
  total,
  baseSpecs,
  images,
  onChange,
  onRemove,
  onMove,
}: {
  grade: VehicleGrade;
  index: number;
  total: number;
  baseSpecs: Record<string, string>;
  images: string[];
  onChange: (patch: Partial<VehicleGrade>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  // The first grade opens expanded so the shape of a row is obvious; a new
  // unnamed row opens too, because it was just added deliberately.
  const [open, setOpen] = useState(index === 0 || !grade.name);
  const [newHighlight, setNewHighlight] = useState("");
  const [newFeature, setNewFeature] = useState("");

  const addHighlight = () => {
    const value = newHighlight.trim();
    if (!value) return;
    onChange({ highlights: [...grade.highlights, value] });
    setNewHighlight("");
  };

  const addFeature = () => {
    const value = newFeature.trim();
    if (!value || grade.features.includes(value)) return;
    onChange({ features: [...grade.features, value] });
    setNewFeature("");
  };

  return (
    <div className="bg-white rounded-[1.75rem] border border-black/5 overflow-hidden">
      {/* Row header — name, default marker, reorder, collapse. */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex flex-col shrink-0 text-zinc-300">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label={`Move ${grade.name || "grade"} up`}
            className="h-4 leading-none hover:text-black disabled:opacity-30 disabled:hover:text-zinc-300"
          >
            <ChevronDown size={14} className="rotate-180" />
          </button>
          <GripVertical size={14} aria-hidden="true" />
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label={`Move ${grade.name || "grade"} down`}
            className="h-4 leading-none hover:text-black disabled:opacity-30 disabled:hover:text-zinc-300"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        <Input
          value={grade.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Grade name, e.g. Ti-L Reserve"
          className="h-11 rounded-xl bg-zinc-50 border-transparent focus:bg-white transition-all font-bold"
        />

        {/* The grade the public page opens on. Exactly one, so this is a
            radio in behaviour even though it looks like a toggle. */}
        <button
          type="button"
          onClick={() => onChange({ isDefault: !grade.isDefault })}
          aria-pressed={grade.isDefault === true}
          title={
            grade.isDefault
              ? "This grade is shown first on the car page"
              : "Show this grade first on the car page"
          }
          className={`shrink-0 inline-flex items-center gap-1.5 h-11 px-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all ${
            grade.isDefault
              ? "border-amber-300 bg-amber-50 text-amber-700"
              : "border-zinc-200 bg-white text-zinc-400 hover:border-zinc-400"
          }`}
        >
          <Star
            size={13}
            className={grade.isDefault ? "fill-amber-400 text-amber-500" : ""}
          />
          <span className="hidden sm:inline">Default</span>
        </button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`${open ? "Collapse" : "Expand"} ${grade.name || "grade"}`}
          className="shrink-0 text-zinc-400 hover:text-black rounded-xl"
        >
          <ChevronDown
            size={18}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label={`Remove ${grade.name || "grade"}`}
          className="shrink-0 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {/* Collapsed summary: enough to tell the rows apart without opening one. */}
      {!open && (
        <div className="px-5 pb-4 -mt-1 text-[11px] text-zinc-400 font-medium">
          {grade.highlights.length > 0
            ? `${grade.highlights.length} difference${grade.highlights.length === 1 ? "" : "s"} listed`
            : "No differences listed yet"}
          {grade.summary ? ` · ${grade.summary}` : ""}
        </div>
      )}

      {open && (
        <div className="px-5 pb-6 space-y-6 border-t border-black/5 pt-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-zinc-600">
              One-line summary
            </Label>
            <Input
              value={grade.summary || ""}
              onChange={(e) => onChange({ summary: e.target.value })}
              placeholder="e.g. The flagship — air suspension, 22-inch wheels, rear entertainment"
              className="h-11 rounded-xl bg-zinc-50 border-transparent focus:bg-white transition-all"
            />
            <p className="text-[10px] text-zinc-400 pl-1 font-medium">
              Shown under the grade name on the car page. Optional.
            </p>
          </div>

          {/* The differences. This is the point of the whole feature, so it
              sits above the spec overrides rather than below them. */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-zinc-600">
              What this grade adds
            </Label>
            {grade.highlights.length > 0 && (
              <ul className="space-y-2">
                {grade.highlights.map((highlight, hIndex) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: positional list, freely reordered by add/remove
                    key={hIndex}
                    className="flex items-start gap-2 bg-zinc-50 rounded-xl px-3 py-2"
                  >
                    <span className="text-sm text-zinc-700 flex-1 leading-snug">
                      {highlight}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          highlights: grade.highlights.filter(
                            (_, i) => i !== hIndex,
                          ),
                        })
                      }
                      aria-label={`Remove "${highlight}"`}
                      className="shrink-0 text-zinc-400 hover:text-red-600 mt-0.5"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <Input
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
                placeholder="e.g. 22-inch step-machined alloy wheels"
                className="h-11 rounded-xl bg-zinc-50 border-transparent focus:bg-white transition-all"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addHighlight}
                className="h-11 rounded-xl shrink-0"
              >
                <Plus size={16} />
              </Button>
            </div>
            <p className="text-[10px] text-zinc-400 pl-1 font-medium">
              One line per difference. These are listed against the grade on the
              car page, so write them the way the manufacturer does.
            </p>
          </div>

          {/* Spec overrides. Placeholder = the dossier's value, so a blank
              field is visibly "same as the base car" rather than "missing". */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-zinc-600">
              Specification changes
            </Label>
            <div className="grid sm:grid-cols-2 gap-3">
              {GRADE_SPEC_FIELDS.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-zinc-400">
                    {label}
                  </Label>
                  <Input
                    value={grade[key] || ""}
                    onChange={(e) =>
                      onChange({
                        [key]: e.target.value,
                      } as Partial<VehicleGrade>)
                    }
                    placeholder={baseSpecs[key] || "Same as base spec"}
                    className="h-10 rounded-xl bg-zinc-50 border-transparent focus:bg-white transition-all text-sm"
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-400 pl-1 font-medium">
              Leave a field blank to inherit the dossier&rsquo;s value (shown
              greyed in the box).
            </p>
          </div>

          {/* Grade-only equipment. Merged with the dossier's standard
              features on the page, so only list what this grade adds. */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-zinc-600">
              Grade-only features
            </Label>
            {grade.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {grade.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 border border-black/5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-zinc-700"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          features: grade.features.filter((f) => f !== feature),
                        })
                      }
                      aria-label={`Remove ${feature}`}
                      className="text-zinc-400 hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="e.g. Head-Up Display"
                className="h-11 rounded-xl bg-zinc-50 border-transparent focus:bg-white transition-all"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                className="h-11 rounded-xl shrink-0"
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          <GradePricingEditor grade={grade} onChange={onChange} />

          {/* Link this grade to the photograph that shows it, so selecting
              the grade swaps the gallery the way a colour swatch does. */}
          {images.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-bold text-zinc-600">
                Linked photo
              </Label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ imageIndex: undefined })}
                  aria-pressed={grade.imageIndex === undefined}
                  className={`h-12 px-3 rounded-lg border-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    grade.imageIndex === undefined
                      ? "border-black bg-black text-white"
                      : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400"
                  }`}
                >
                  None
                </button>
                {images.map((img, imgIdx) => (
                  <button
                    // biome-ignore lint/suspicious/noArrayIndexKey: the index IS the stored value
                    key={imgIdx}
                    type="button"
                    onClick={() => onChange({ imageIndex: imgIdx })}
                    aria-pressed={grade.imageIndex === imgIdx}
                    title={`Link photo ${imgIdx + 1}`}
                    className={`h-12 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                      grade.imageIndex === imgIdx
                        ? "border-sky-500 ring-2 ring-sky-200"
                        : "border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {/* biome-ignore lint/performance/noImgElement: R2 admin thumbnail, intentional <img> per site convention */}
                    <img
                      src={img}
                      alt={`Gallery slot ${imgIdx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const PRICE_TYPES = ["CIF", "CNF", "FOB", "Landed", "Ex-works"];

/**
 * Per-grade landed pricing. Empty means the grade shows the dossier's own
 * pricing matrix — the common case while a model is still coming soon and no
 * grade has a confirmed number yet.
 */
function GradePricingEditor({
  grade,
  onChange,
}: {
  grade: VehicleGrade;
  onChange: (patch: Partial<VehicleGrade>) => void;
}) {
  const [draft, setDraft] = useState({
    country: "",
    currency: "GBP",
    amount: "",
    type: "CIF",
  });

  const addPrice = () => {
    const amount = parseFloat(draft.amount);
    if (!draft.country.trim() || !Number.isFinite(amount)) return;
    onChange({
      pricing: [
        ...grade.pricing,
        { ...draft, country: draft.country.trim(), amount },
      ],
    });
    setDraft({
      country: "",
      currency: draft.currency,
      amount: "",
      type: draft.type,
    });
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-bold text-zinc-600">
        Grade pricing (optional)
      </Label>

      {grade.pricing.length > 0 && (
        <div className="space-y-2">
          {grade.pricing.map((price, pIndex) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: positional list, freely reordered by add/remove
              key={pIndex}
              className="flex items-center justify-between gap-3 bg-zinc-50 rounded-xl px-3 py-2"
            >
              <span className="text-sm text-zinc-700">
                <strong className="font-bold">{price.country}</strong>{" "}
                <span className="text-zinc-400 text-xs uppercase">
                  {price.type}
                </span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-sm font-bold text-black">
                  {price.currency} {price.amount.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      pricing: grade.pricing.filter((_, i) => i !== pIndex),
                    })
                  }
                  aria-label={`Remove ${price.country} price`}
                  className="text-zinc-400 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <Input
          value={draft.country}
          onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))}
          placeholder="Country"
          className="h-10 rounded-xl bg-zinc-50 border-transparent focus:bg-white text-sm sm:col-span-2"
        />
        <Input
          value={draft.currency}
          onChange={(e) =>
            setDraft((d) => ({ ...d, currency: e.target.value.toUpperCase() }))
          }
          placeholder="GBP"
          maxLength={3}
          className="h-10 rounded-xl bg-zinc-50 border-transparent focus:bg-white text-sm"
        />
        <Input
          value={draft.amount}
          onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
          placeholder="Amount"
          inputMode="decimal"
          className="h-10 rounded-xl bg-zinc-50 border-transparent focus:bg-white text-sm"
        />
        <select
          value={draft.type}
          onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
          aria-label="Price basis"
          className="h-10 rounded-xl bg-zinc-50 border border-transparent focus:bg-white text-sm px-2"
        >
          {PRICE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={addPrice}
        className="h-10 rounded-xl w-full text-xs"
      >
        <Plus size={14} className="mr-1.5" /> Add a price for this grade
      </Button>
      <p className="text-[10px] text-zinc-400 pl-1 font-medium">
        Leave empty and the grade shows the dossier&rsquo;s own pricing.
      </p>
    </div>
  );
}

/**
 * Which hands this model can be sourced in. Both may be selected — the same
 * model is frequently built RHD for Australia and LHD for the Gulf, and the
 * customer's destination decides which one they need.
 *
 * At least one has to stay selected: a car that comes in no hand at all is
 * not a state the public page can render.
 */
export function SteeringOptionsEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const options = [
    { code: "RHD", label: "Right hand (RHD)" },
    { code: "LHD", label: "Left hand (LHD)" },
  ];

  const toggle = (code: string) => {
    const isOn = value.includes(code);
    // Never let the last one be turned off.
    if (isOn && value.length === 1) return;
    const next = isOn
      ? value.filter((c) => c !== code)
      : [...value, code].filter((c) => c === "RHD" || c === "LHD");
    // Keep a stable order so the page's pills don't reshuffle between saves.
    onChange(["RHD", "LHD"].filter((c) => next.includes(c)));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {options.map((option) => {
          const active = value.includes(option.code);
          const isLast = active && value.length === 1;
          return (
            <button
              key={option.code}
              type="button"
              onClick={() => toggle(option.code)}
              aria-pressed={active}
              title={
                isLast
                  ? "At least one steering configuration has to stay selected"
                  : undefined
              }
              className={`flex-1 h-11 rounded-xl text-xs font-bold border transition-all ${
                active
                  ? "bg-black text-white border-black shadow-md"
                  : "bg-zinc-50 text-zinc-500 border-transparent hover:border-black/20"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-zinc-400 pl-1 font-medium">
        Select both if the model can be sourced in either hand — the car page
        then lets the customer choose, and their choice lands on the lead.
      </p>
    </div>
  );
}
