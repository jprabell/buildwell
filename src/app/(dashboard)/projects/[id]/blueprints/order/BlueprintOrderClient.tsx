"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────
export interface ArchitecturalData {
  // Step 1 – Site
  city: string;
  state: string;
  county: string;
  lotWidth: string;
  lotDepth: string;
  setbackFront: string;
  setbackRear: string;
  setbackSide: string;
  orientation: string;
  terrain: string;
  drivewaySide: string;
  // Step 2 – Program
  targetSqft: string;
  stories: string;
  foundation: string;
  garage: string;
  bedrooms: string;
  fullBaths: string;
  halfBaths: string;
  // Step 3 – Room Layout
  masterLocation: string;
  masterBath: string;
  kitchenStyle: string;
  diningStyle: string;
  livingStyle: string;
  laundryLocation: string;
  office: string;
  specialRooms: string[];
  // Step 4 – Style
  architecturalStyle: string;
  roofType: string;
  roofPitch: string;
  exteriorCladding: string;
  ceilingHeight: string;
  vaultedCeilings: string;
  // Step 5 – Features
  porch: string;
  deck: string;
  ada: string;
  solar: string;
  additionalFeatures: string[];
  adjacentStructure: string;
  notes: string;
}

const STEPS = ["Site", "Program", "Rooms", "Style", "Features", "Review"];

const TIER_OPTIONS = [
  {
    id: "spec",
    label: "Spec-Grade Blueprint Set",
    price: "$699",
    priceNum: 69900,
    badge: "AI-Generated",
    description: "Full construction document set: floor plans, elevations, sections, site plan, and title sheet. AI-generated from your specifications. For estimating, contractor review, and lender submissions.",
    includes: [
      "Floor plan (all levels)",
      "4 exterior elevations",
      "Building sections",
      "Site/foundation plan",
      "Window & door schedule",
      "Delivered in PDF + DWG",
    ],
    turnaround: "3–5 business days",
  },
  {
    id: "permit",
    label: "Permit-Ready Blueprint Set",
    price: "$1,499",
    priceNum: 149900,
    badge: "Architect Stamped",
    description: "Everything in Spec-Grade, plus review and stamp by a licensed architect in your state. Accepted by most permitting offices. Includes one revision round.",
    includes: [
      "Everything in Spec-Grade",
      "Licensed architect review",
      "Official PE/Architect stamp",
      "Code compliance verification",
      "One revision round included",
      "Accepted for permit submission",
    ],
    turnaround: "7–10 business days",
  },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold text-stone-500 uppercase tracking-wide block mb-1">{label}</label>
      {hint && <p className="text-xs text-stone-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none bg-white"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select…</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function MultiCheck({ value, onChange, options }: { value: string[]; onChange: (v: string[]) => void; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <label key={o} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${value.includes(o) ? "bg-amber-100 border-amber-400 text-amber-800" : "border-stone-200 text-stone-600 hover:border-amber-300"}`}>
          <input type="checkbox" className="hidden" checked={value.includes(o)} onChange={() => {
            onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o]);
          }} />
          {value.includes(o) ? "✓ " : ""}{o}
        </label>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
interface Props {
  projectId: string;
  projectName: string;
  prefill: Partial<ArchitecturalData>;
}

export default function BlueprintOrderClient({ projectId, projectName, prefill }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [tier, setTier] = useState<"spec" | "permit">("spec");
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<ArchitecturalData>({
    city: "",
    state: "",
    county: "",
    lotWidth: "",
    lotDepth: "",
    setbackFront: "",
    setbackRear: "",
    setbackSide: "",
    orientation: "",
    terrain: "Flat",
    drivewaySide: "",
    targetSqft: "",
    stories: "1",
    foundation: "",
    garage: "",
    bedrooms: "",
    fullBaths: "",
    halfBaths: "",
    masterLocation: "Main floor",
    masterBath: "En-suite",
    kitchenStyle: "",
    diningStyle: "",
    livingStyle: "",
    laundryLocation: "Main floor",
    office: "None",
    specialRooms: [],
    architecturalStyle: "",
    roofType: "",
    roofPitch: "",
    exteriorCladding: "",
    ceilingHeight: "9 ft",
    vaultedCeilings: "None",
    porch: "None",
    deck: "None",
    ada: "None",
    solar: "No",
    additionalFeatures: [],
    adjacentStructure: "None",
    notes: "",
    ...prefill,
  });

  function set<K extends keyof ArchitecturalData>(key: K, val: ArchitecturalData[K]) {
    setData(prev => ({ ...prev, [key]: val }));
  }

  async function checkout() {
    setSubmitting(true);
    const selectedTier = TIER_OPTIONS.find(t => t.id === tier)!;
    const res = await fetch(`/api/projects/${projectId}/blueprints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ architecturalData: data, tier, price: selectedTier.priceNum }),
    });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      alert("Something went wrong — please try again.");
      setSubmitting(false);
    }
  }

  const progress = Math.round(((step) / (STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xl font-black text-stone-900">Build<span className="text-amber-600">well</span></p>
            <p className="text-xs text-stone-400 mt-0.5">Blueprint Order · {projectName}</p>
          </div>
          <button onClick={() => router.back()} className="text-sm font-semibold text-stone-500 hover:text-stone-700">← Back</button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => i < step && setStep(i)}
                className={`text-xs font-bold transition-colors ${i === step ? "text-amber-600" : i < step ? "text-stone-600 cursor-pointer" : "text-stone-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="h-1 bg-stone-100 rounded-full">
            <div className="h-1 bg-amber-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* ── Step 0: Site ── */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-stone-900">Site Information</h2>
              <p className="text-sm text-stone-500 mt-1">This determines local code requirements and lot constraints.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="City"><TextInput value={data.city} onChange={v => set("city", v)} placeholder="e.g. Austin" /></Field>
              <Field label="State"><TextInput value={data.state} onChange={v => set("state", v)} placeholder="e.g. TX" /></Field>
              <Field label="County"><TextInput value={data.county} onChange={v => set("county", v)} placeholder="e.g. Travis" /></Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Lot Width (ft)" hint="Leave blank if unknown"><TextInput value={data.lotWidth} onChange={v => set("lotWidth", v)} placeholder="e.g. 75" /></Field>
              <Field label="Lot Depth (ft)"><TextInput value={data.lotDepth} onChange={v => set("lotDepth", v)} placeholder="e.g. 125" /></Field>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Front Setback (ft)" hint="Required clearance from street"><TextInput value={data.setbackFront} onChange={v => set("setbackFront", v)} placeholder="e.g. 25" /></Field>
              <Field label="Rear Setback (ft)"><TextInput value={data.setbackRear} onChange={v => set("setbackRear", v)} placeholder="e.g. 20" /></Field>
              <Field label="Side Setback (ft)"><TextInput value={data.setbackSide} onChange={v => set("setbackSide", v)} placeholder="e.g. 5" /></Field>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Front of House Faces">
                <SelectInput value={data.orientation} onChange={v => set("orientation", v)} options={["North", "South", "East", "West", "Northeast", "Northwest", "Southeast", "Southwest"]} />
              </Field>
              <Field label="Terrain">
                <SelectInput value={data.terrain} onChange={v => set("terrain", v)} options={["Flat", "Gentle slope", "Moderate slope", "Steep slope"]} />
              </Field>
              <Field label="Driveway Location">
                <SelectInput value={data.drivewaySide} onChange={v => set("drivewaySide", v)} options={["Left side", "Right side", "Front / center", "Rear alley"]} />
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 1: Program ── */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-stone-900">Building Program</h2>
              <p className="text-sm text-stone-500 mt-1">Define the size and basic layout of your building.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Target Square Footage"><TextInput value={data.targetSqft} onChange={v => set("targetSqft", v)} placeholder="e.g. 2,400" /></Field>
              <Field label="Number of Stories">
                <SelectInput value={data.stories} onChange={v => set("stories", v)} options={["1", "1.5 (bonus room)", "2", "3"]} />
              </Field>
            </div>
            <Field label="Foundation Type">
              <SelectInput value={data.foundation} onChange={v => set("foundation", v)} options={["Slab on grade", "Crawl space", "Full basement", "Walkout basement", "Pier & beam", "ICF / insulated"]} />
            </Field>
            <Field label="Garage">
              <SelectInput value={data.garage} onChange={v => set("garage", v)} options={["None", "Attached 1-car", "Attached 2-car", "Attached 3-car", "Detached 1-car", "Detached 2-car", "Carport"]} />
            </Field>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Bedrooms">
                <SelectInput value={data.bedrooms} onChange={v => set("bedrooms", v)} options={["1", "2", "3", "4", "5", "6"]} />
              </Field>
              <Field label="Full Baths">
                <SelectInput value={data.fullBaths} onChange={v => set("fullBaths", v)} options={["1", "2", "3", "4"]} />
              </Field>
              <Field label="Half Baths">
                <SelectInput value={data.halfBaths} onChange={v => set("halfBaths", v)} options={["0", "1", "2"]} />
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 2: Room Layout ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-stone-900">Room Layout</h2>
              <p className="text-sm text-stone-500 mt-1">How you want the spaces to flow and relate to each other.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Master Bedroom Location">
                <SelectInput value={data.masterLocation} onChange={v => set("masterLocation", v)} options={["Main floor", "Upper floor", "Either / architect's choice"]} />
              </Field>
              <Field label="Master Bathroom">
                <SelectInput value={data.masterBath} onChange={v => set("masterBath", v)} options={["En-suite (private)", "Shared bathroom"]} />
              </Field>
            </div>
            <Field label="Kitchen Layout Style">
              <SelectInput value={data.kitchenStyle} onChange={v => set("kitchenStyle", v)} options={["Open concept with island", "Open concept with peninsula", "U-shape", "L-shape", "Galley / single wall", "Architect's choice"]} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Dining Area">
                <SelectInput value={data.diningStyle} onChange={v => set("diningStyle", v)} options={["Open to kitchen / breakfast nook", "Separate dining room", "Formal dining + breakfast nook", "None"]} />
              </Field>
              <Field label="Living Room">
                <SelectInput value={data.livingStyle} onChange={v => set("livingStyle", v)} options={["Open concept (flows to kitchen)", "Separate / defined room", "Great room (large open)", "Formal + family room"]} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Laundry Location">
                <SelectInput value={data.laundryLocation} onChange={v => set("laundryLocation", v)} options={["Main floor", "Upper floor (near bedrooms)", "Basement", "Garage"]} />
              </Field>
              <Field label="Home Office">
                <SelectInput value={data.office} onChange={v => set("office", v)} options={["None", "Small study nook", "Dedicated room (100–150 sf)", "Dedicated room (150–250 sf)", "Two offices"]} />
              </Field>
            </div>
            <Field label="Special Rooms (select all that apply)">
              <MultiCheck value={data.specialRooms} onChange={v => set("specialRooms", v)} options={["Mudroom / entry drop zone", "Pantry / walk-in pantry", "Media room / home theater", "Exercise / gym room", "Craft / hobby room", "Wine cellar", "Safe room", "In-law suite"]} />
            </Field>
          </div>
        )}

        {/* ── Step 3: Style ── */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-stone-900">Architectural Style</h2>
              <p className="text-sm text-stone-500 mt-1">Visual and material preferences for the exterior and interior.</p>
            </div>
            <Field label="Exterior Architectural Style">
              <SelectInput value={data.architecturalStyle} onChange={v => set("architecturalStyle", v)} options={["Modern Farmhouse", "Craftsman / Bungalow", "Contemporary / Modern", "Traditional / Colonial", "Ranch / Low-profile", "Cape Cod", "Tudor / European", "Transitional", "Rustic / Mountain lodge", "Mediterranean / Spanish", "Industrial / Loft", "Other (describe in notes)"]} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Roof Type">
                <SelectInput value={data.roofType} onChange={v => set("roofType", v)} options={["Gable", "Hip", "Shed / mono-pitch", "Flat / low-slope", "Gambrel / barn", "Mansard", "Combination (gable + shed)"]} />
              </Field>
              <Field label="Roof Pitch">
                <SelectInput value={data.roofPitch} onChange={v => set("roofPitch", v)} options={["Flat (under 2:12)", "Low (2:12–4:12)", "Moderate (5:12–8:12)", "Steep (9:12–12:12)", "Very steep (12:12+)"]} />
              </Field>
            </div>
            <Field label="Primary Exterior Cladding">
              <SelectInput value={data.exteriorCladding} onChange={v => set("exteriorCladding", v)} options={["Fiber cement siding (HardiePlank)", "Wood / engineered wood siding", "Brick", "Stone / stone veneer", "Stucco / EIFS", "Metal / standing seam", "Vinyl siding", "Mixed (describe in notes)"]} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Primary Ceiling Height">
                <SelectInput value={data.ceilingHeight} onChange={v => set("ceilingHeight", v)} options={["8 ft", "9 ft", "10 ft", "11 ft", "12 ft"]} />
              </Field>
              <Field label="Vaulted / Cathedral Ceilings">
                <SelectInput value={data.vaultedCeilings} onChange={v => set("vaultedCeilings", v)} options={["None", "Living room only", "Master bedroom only", "Living + master", "Open living / kitchen area", "Entire main floor"]} />
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 4: Features ── */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-stone-900">Special Features</h2>
              <p className="text-sm text-stone-500 mt-1">Outdoor spaces, accessibility, and other requirements.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Covered Porch / Patio">
                <SelectInput value={data.porch} onChange={v => set("porch", v)} options={["None", "Small front porch", "Large front porch", "Rear covered patio", "Wrap-around porch", "Front + rear porch"]} />
              </Field>
              <Field label="Deck">
                <SelectInput value={data.deck} onChange={v => set("deck", v)} options={["None", "Small deck (under 200 sf)", "Medium deck (200–400 sf)", "Large deck (400+ sf)"]} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="ADA / Accessibility">
                <SelectInput value={data.ada} onChange={v => set("ada", v)} options={["None", "Aging-in-place features", "Full ADA / wheelchair accessible"]} />
              </Field>
              <Field label="Solar / Energy">
                <SelectInput value={data.solar} onChange={v => set("solar", v)} options={["No special requirements", "Solar-ready roof orientation", "Solar panels planned (pre-wire)", "Passive solar design", "Net-zero / high performance"]} />
              </Field>
            </div>
            <Field label="Additional Features (select all that apply)">
              <MultiCheck value={data.additionalFeatures} onChange={v => set("additionalFeatures", v)} options={["EV charging station", "Whole-home generator hookup", "Hot tub / spa", "Pool equipment room", "Outdoor kitchen", "Fire sprinkler system", "Safe room / storm shelter", "Elevator / lift"]} />
            </Field>
            <Field label="Adjacent / Outbuilding">
              <SelectInput value={data.adjacentStructure} onChange={v => set("adjacentStructure", v)} options={["None", "Detached garage", "Guest house / ADU", "Workshop", "Barn / storage building", "Pool house"]} />
            </Field>
            <Field label="Additional Notes or Requirements" hint="Describe anything specific: views to preserve, lot challenges, neighborhood design standards, etc.">
              <textarea
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-amber-500 outline-none resize-none"
                rows={4}
                placeholder="e.g. Preserve mountain view to the west. HOA requires brick on front elevation minimum 50%. Strong preference for open great room feel…"
                value={data.notes}
                onChange={e => set("notes", e.target.value)}
              />
            </Field>
          </div>
        )}

        {/* ── Step 5: Review + Choose Tier ── */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-stone-900">Review & Order</h2>
              <p className="text-sm text-stone-500 mt-1">Choose your blueprint tier and confirm your order.</p>
            </div>

            {/* Summary card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">Your Design Summary</p>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {[
                  ["Location", [data.city, data.state].filter(Boolean).join(", ") || "—"],
                  ["Target Sq Ft", data.targetSqft || "—"],
                  ["Stories", data.stories],
                  ["Foundation", data.foundation || "—"],
                  ["Bedrooms / Baths", `${data.bedrooms || "—"} bed / ${data.fullBaths || "—"} full + ${data.halfBaths || "0"} half`],
                  ["Garage", data.garage || "—"],
                  ["Style", data.architecturalStyle || "—"],
                  ["Roof", [data.roofType, data.roofPitch].filter(Boolean).join(" · ") || "—"],
                  ["Exterior", data.exteriorCladding || "—"],
                  ["Ceilings", data.ceilingHeight],
                  ["Kitchen", data.kitchenStyle || "—"],
                  ["Master Bed", data.masterLocation],
                  ["Porch / Deck", [data.porch, data.deck].filter(v => v !== "None").join(" + ") || "None"],
                  ["Special Rooms", data.specialRooms.length ? data.specialRooms.join(", ") : "None"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-stone-50 pb-1.5">
                    <span className="text-stone-400">{k}</span>
                    <span className="font-semibold text-stone-800 text-right max-w-[180px]">{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(0)} className="mt-3 text-xs text-amber-600 font-bold hover:underline">Edit details →</button>
            </div>

            {/* Tier selection */}
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-3">Choose Blueprint Tier</p>
              <div className="space-y-3">
                {TIER_OPTIONS.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setTier(t.id as "spec" | "permit")}
                    className={`cursor-pointer border-2 rounded-2xl p-5 transition-all ${tier === t.id ? "border-amber-500 bg-amber-50" : "border-stone-200 hover:border-amber-300"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${tier === t.id ? "border-amber-500 bg-amber-500" : "border-stone-300"}`}>
                          {tier === t.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-black text-stone-900">{t.label}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.id === "permit" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{t.badge}</span>
                          </div>
                          <p className="text-xs text-stone-500 leading-relaxed mb-3">{t.description}</p>
                          <ul className="space-y-0.5">
                            {t.includes.map(i => (
                              <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                                <span className="text-amber-500 shrink-0 mt-0.5">▸</span>{i}
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-stone-400 mt-2">⏱ {t.turnaround}</p>
                        </div>
                      </div>
                      <p className="font-black text-xl text-stone-900 shrink-0">{t.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-stone-100 rounded-xl px-4 py-3 text-xs text-stone-500">
              After payment you&apos;ll receive an order confirmation. Blueprints will appear on your project page when ready. Revisions and questions handled via email.
            </div>

            <button
              onClick={checkout}
              disabled={submitting}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-black py-4 rounded-xl text-base transition-colors"
            >
              {submitting ? "Redirecting to checkout…" : `Order ${TIER_OPTIONS.find(t2 => t2.id === tier)?.price} Blueprint Set →`}
            </button>
          </div>
        )}

        {/* Navigation */}
        {step < 5 && (
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 rounded-xl font-bold text-stone-600 hover:bg-stone-200 transition-colors">
                ← Back
              </button>
            )}
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex-1 bg-stone-900 hover:bg-stone-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
