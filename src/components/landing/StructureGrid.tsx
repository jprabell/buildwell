"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { STRUCTURE_OPTIONS, STRUCTURE_CATEGORIES } from "@/lib/structures";

const CREATIVE_LINES: Record<string, string> = {
  SINGLE_FAMILY_HOME:
    "The heartbeat of every great neighborhood starts with four walls that are unmistakably yours.",
  CONTAINER_HOME:
    "What the world once shipped cargo in, you'll ship your dreams out of.",
  TINY_HOME:
    "Less square footage, more intention — the art of living exactly as large as you truly need.",
  BARNDOMINIUM:
    "Where the rooster crows at dawn and the coffee brews by noon — country living meets modern craft.",
  BARN:
    "Raised by hand and built to outlast generations — a barn isn't just shelter, it's a statement of permanence.",
  POLE_BARN:
    "Engineered simplicity that goes up fast, spans wide, and costs less than everything else on the market.",
  LOG_CABIN:
    "Every notched timber carries the memory of the forest — and the stories your family will make inside.",
  A_FRAME:
    "Architecture that points at the sky like an arrow, daring you to dream as tall as it stands.",
  DOME_HOME:
    "Nature doesn't build with corners, and neither will you — strength in every curve, energy in every angle.",
  QUONSET_HUT:
    "Military-grade bones, infinite civilian potential — the most versatile structure money can bolt together.",
  SILO:
    "A tower once built for grain becomes a tower built for you — the boldest reuse of vertical space in modern building.",
  SHED:
    "Every masterpiece started in a shed — this is where your next great project gets its address.",
  WORKSHOP:
    "Where the sawdust settles and the sparks fly, real things get made — and this space is all yours.",
  GARAGE:
    "Four walls and a door wide enough for your ambitions — this is where great ideas park until they're ready.",
  EARTHSHIP:
    "Built from the earth itself, heated by the sun, fed by the rain — this isn't just a home, it's a declaration.",
  PASSIVE_SOLAR:
    "Every window becomes a furnace, every overhang a thermostat — when you build smart, nature pays the utility bill.",
};

const DETAILED_DESCRIPTIONS: Record<string, string> = {
  SINGLE_FAMILY_HOME:
    "The gold standard of American residential construction. A stick-built or modular home on a permanent foundation, designed to last generations and appreciate in value. Fully customizable for any lot size, architectural style, or family configuration — from cozy ranch to three-story craftsman.",
  CONTAINER_HOME:
    "Repurposed ISO shipping containers — typically 20 ft or 40 ft — cut, welded, and modified into modern living spaces. Industrial-chic aesthetic with remarkable structural strength. Stack them, offset them, cantilever them: the design possibilities are as limitless as your imagination.",
  TINY_HOME:
    "Under 400 square feet, but never short on character. Whether on wheels or a permanent foundation, tiny homes demand intelligent design — lofted sleeping, hidden storage, multi-use furniture. Perfect for downsizing, off-grid living, or starting mortgage-free.",
  BARNDOMINIUM:
    "Half barn, half living space — all character. A metal or pole-frame shell that encloses open workshop or garage space on one end and fully-finished living quarters on the other. One foundation, one roof, and all the country aesthetics you've been dreaming of.",
  BARN:
    "The original American structure. Whether you need livestock housing, hay storage, equipment shelter, or event space, a traditionally framed or post-frame barn delivers decades of reliable service. The king-post trusses, the smell of timber, the hayloft overhead — there's nothing like it.",
  POLE_BARN:
    "Post-frame construction at its most economical. No traditional foundation required — posts go directly into engineered ground anchors. Spans are wide, walls go up fast, and the price per square foot beats almost every alternative. From farm storage to equestrian facilities to commercial workshops.",
  LOG_CABIN:
    "Hewn from the forest, assembled by hand, built to outlast everything around it. Modern log cabin construction uses kiln-dried timbers with precision joinery for superior insulation and structural performance. The rustic aesthetic and warm interior are unmatched by any other building style.",
  A_FRAME:
    "The most dramatic roofline in residential architecture. The steep triangular form sheds snow and rain effortlessly while creating soaring cathedral ceilings inside. Perfect for mountain retreats, lakefront getaways, and anywhere you want architecture that makes a statement.",
  DOME_HOME:
    "Geodesic and monolithic dome structures offer extraordinary structural efficiency — a sphere encloses the most volume for the least surface area. Immune to most natural disaster forces, energy-efficient by geometry, and utterly unlike anything your neighbors will ever build.",
  QUONSET_HUT:
    "Originally developed for rapid military deployment, the Quonset hut has become a civilian favorite for agricultural storage, retail space, event venues, and unconventional housing. The half-cylinder steel arch handles extreme snow loads and wind forces with zero internal supports.",
  SILO:
    "Convert an existing grain silo into a vertical living tower, or build a new cylindrical structure from scratch. The circular form maximizes structural strength, minimizes surface-area heat loss, and creates a dramatic architectural statement that no rectangular structure can match.",
  SHED:
    "Don't let the size fool you — a well-built storage shed is a foundation investment. The right shed frees your garage from clutter, gives your equipment a proper home, and adds real value to your property. Build it right the first time, and it'll outlast the house behind it.",
  WORKSHOP:
    "A purpose-built workshop is the ultimate multiplier for anyone who makes things. High ceilings, heavy electrical service, proper ventilation, and a floor that can take a beating — this is the space where hobbies become side hustles and side hustles become businesses.",
  GARAGE:
    "More than a parking spot — a garage is one of the highest-ROI structures on any residential property. Whether it's a single-car detached or a four-bay commercial-grade build, a proper garage adds storage, workspace, and immediate appraisal value.",
  EARTHSHIP:
    "Built from reclaimed tires packed with earth, glass bottles, and natural materials, an Earthship harvests its own water, generates its own power, and stays comfortable without mechanical heating or cooling. Radical sustainability meets raw building craftsmanship.",
  PASSIVE_SOLAR:
    "Passive solar design harnesses sunlight as a free heating system. South-facing glazing, thermal mass floors, proper overhangs, and strategic insulation work together to eliminate heating bills and slash cooling costs — without solar panels or mechanical systems.",
};

type StructureValue = (typeof STRUCTURE_OPTIONS)[0]["value"];

export default function StructureGrid() {
  const [selected, setSelected] = useState<StructureValue | null>(null);

  const structure = selected ? STRUCTURE_OPTIONS.find((s) => s.value === selected) : null;

  // Close on Escape key
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      {STRUCTURE_CATEGORIES.map((category) => {
        const structures = STRUCTURE_OPTIONS.filter((s) => s.category === category);
        return (
          <div key={category} className="mb-16">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-6 flex items-center gap-3">
              <span className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              {category}
              <span className="flex-1 h-px bg-gradient-to-l from-amber-200 to-transparent" />
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {structures.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSelected(s.value)}
                  className="text-left group relative bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400 transition-all duration-300 hover:shadow-[0_0_28px_rgba(217,119,6,0.25)] hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative h-36 overflow-hidden bg-stone-200">
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {s.icon}
                      </div>
                    )}
                    {/* Base gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent" />
                    {/* Hover creative line overlay — slides up from bottom */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white text-[10px] font-medium italic leading-snug line-clamp-3 drop-shadow-sm">
                        &ldquo;{CREATIVE_LINES[s.value]}&rdquo;
                      </p>
                    </div>
                    {/* "Explore" badge — hides when creative line shows */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        Explore →
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-stone-900 text-sm group-hover:text-amber-700 transition-colors leading-tight">
                      {s.label}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5 leading-tight group-hover:hidden">{s.description}</div>
                    <div className="text-xs text-amber-600 mt-0.5 leading-tight hidden group-hover:block font-medium">Click to explore →</div>
                    <div className="mt-2 text-xs font-semibold text-stone-400 group-hover:text-amber-600 transition-colors">
                      {s.costNote}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Modal */}
      {selected && structure && (
        <div
          className="model-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(10, 8, 4, 0.85)", backdropFilter: "blur(6px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="model-card relative bg-white rounded-3xl overflow-hidden w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Large image */}
            <div className="relative h-64 overflow-hidden bg-stone-200">
              {structure.image ? (
                <img
                  src={structure.image}
                  alt={structure.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl bg-stone-100">
                  {structure.icon}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur hover:bg-white/25 border border-white/20 text-white text-lg font-bold flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                ×
              </button>
              {/* Category badge on image */}
              <div className="absolute bottom-4 left-5">
                <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {structure.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-black text-stone-900 mb-3">{structure.label}</h2>

              {/* Creative AI sentence */}
              <p className="text-amber-700 font-medium italic text-sm leading-relaxed mb-4 border-l-2 border-amber-400 pl-4">
                &ldquo;{CREATIVE_LINES[structure.value]}&rdquo;
              </p>

              {/* Detailed description */}
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                {DETAILED_DESCRIPTIONS[structure.value]}
              </p>

              {/* Cost estimate */}
              <div className="flex items-center gap-2 mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                <span className="text-amber-600 font-bold text-sm">Est. Cost:</span>
                <span className="text-stone-700 font-semibold text-sm">{structure.costNote}</span>
                <span className="text-stone-400 text-xs ml-auto">national avg.</span>
              </div>

              {/* CTA */}
              <Link href="/register" onClick={() => setSelected(null)}>
                <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-2xl text-base transition-all duration-200 hover:shadow-[0_0_20px_rgba(217,119,6,0.5)] amber-pulse">
                  Start Building a {structure.label} →
                </button>
              </Link>
              <p className="text-center text-xs text-stone-400 mt-3">Free to start. No credit card required.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
