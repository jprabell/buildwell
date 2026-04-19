// Verified material spec tiers for residential/agricultural construction.
// Cost ranges are installed (material + labor) per unit, sourced from
// RSMeans 2024, National Estimator, and regional contractor averages.

export type SpecTierLevel = "good" | "better" | "best";

export interface TierSpec {
  spec: string;
  brandExamples: string;
  costRange: string; // e.g. "$3.50–$5.00/sqft installed"
  warranty: string;
  notes: string;
}

export interface SpecTierRow {
  category: string;
  subcategory: string;
  good: TierSpec;
  better: TierSpec;
  best: TierSpec;
}

export interface TierCostSummary {
  label: string;
  perSqftRange: string;
  totalRangeNote: string;
  description: string;
  colorClass: string;
  bgClass: string;
}

export const TIER_COST_SUMMARIES: TierCostSummary[] = [
  {
    label: "Good",
    perSqftRange: "$85–$120",
    totalRangeNote: "per sq ft finished (all-in)",
    description: "Code-compliant, budget-conscious. Entry-level materials from reputable manufacturers. Meets all local building codes with standard warranties.",
    colorClass: "text-slate-700",
    bgClass: "bg-slate-50 border-slate-200",
  },
  {
    label: "Better",
    perSqftRange: "$130–$175",
    totalRangeNote: "per sq ft finished (all-in)",
    description: "Mid-range value. Upgraded durability, appearance, and energy performance. The most common choice for owner-builders seeking long-term value.",
    colorClass: "text-amber-700",
    bgClass: "bg-amber-50 border-amber-200",
  },
  {
    label: "Best",
    perSqftRange: "$185–$280+",
    totalRangeNote: "per sq ft finished (all-in)",
    description: "Premium and custom-grade. Highest durability, energy efficiency, and finish quality. Often includes extended or lifetime warranties.",
    colorClass: "text-emerald-700",
    bgClass: "bg-emerald-50 border-emerald-200",
  },
];

export const SPEC_TIER_ROWS: SpecTierRow[] = [
  // ─── FRAMING ──────────────────────────────────────────────────────────────
  {
    category: "Structural Framing",
    subcategory: "Wall Framing",
    good: {
      spec: "Kiln-dried #2 SPF 2×4 @ 16\" OC",
      brandExamples: "Standard construction grade SPF or Hem-Fir",
      costRange: "$18–$22/sqft installed",
      warranty: "N/A",
      notes: "Minimum code for most climate zones. Thinner wall reduces insulation capacity.",
    },
    better: {
      spec: "KD #1 SPF or Hem-Fir 2×6 @ 16\" OC",
      brandExamples: "Weyerhaeuser, Idaho Pacific, Pacific Woodtech",
      costRange: "$22–$28/sqft installed",
      warranty: "N/A",
      notes: "2×6 walls allow R-21 insulation, standard in colder climates (zones 4–7).",
    },
    best: {
      spec: "LVL / LSL headers, 2×6 OC with advanced framing (OVE)",
      brandExamples: "Weyerhaeuser iLevel LVL, LP SolidStart LSL",
      costRange: "$28–$38/sqft installed",
      warranty: "25-year structural",
      notes: "Optimum Value Engineering reduces thermal bridging. LVL headers minimize deflection.",
    },
  },
  {
    category: "Structural Framing",
    subcategory: "Floor System",
    good: {
      spec: "2×10 dimensional lumber joists @ 16\" OC",
      brandExamples: "Standard #2 SPF or Douglas Fir",
      costRange: "$5–$7/sqft installed",
      warranty: "N/A",
      notes: "Traditional stick framing. Requires mid-span blocking. Limited span capability.",
    },
    better: {
      spec: "TJI engineered wood I-joists @ 16\" OC",
      brandExamples: "Weyerhaeuser TJI, Louisiana-Pacific TopNotch",
      costRange: "$7–$10/sqft installed",
      warranty: "Limited lifetime",
      notes: "Quieter floors, longer spans, consistent sizing. Pre-knocked web holes for MEP.",
    },
    best: {
      spec: "Open-web floor trusses, custom engineered",
      brandExamples: "MiTek, Alpine, Robbins Engineering",
      costRange: "$10–$14/sqft installed",
      warranty: "Limited lifetime",
      notes: "Full access for plumbing and HVAC through truss cavities. Up to 40' clear span.",
    },
  },
  // ─── INSULATION ───────────────────────────────────────────────────────────
  {
    category: "Insulation",
    subcategory: "Wall Insulation",
    good: {
      spec: "Fiberglass batt R-13 (2×4) or R-21 (2×6)",
      brandExamples: "Owens Corning EcoTouch, Johns Manville",
      costRange: "$0.80–$1.20/sqft installed",
      warranty: "Lifetime limited",
      notes: "Meets IECC code minimums for zones 1–4. Sensitive to installation gaps.",
    },
    better: {
      spec: "Rockwool mineral wool R-15 (2×4) or R-23 (2×6)",
      brandExamples: "ROCKWOOL Safe'n'Sound / Comfortbatt",
      costRange: "$1.40–$2.00/sqft installed",
      warranty: "Lifetime",
      notes: "Fire resistant to 2,150°F, sound dampening, moisture resistant. Easier to fit precisely.",
    },
    best: {
      spec: "Closed-cell spray polyurethane foam (ccSPF) 3.5\" @ R-22 + exterior rigid R-5 ci",
      brandExamples: "Icynene ProSeal, Lapolla FoamLok, Demilec",
      costRange: "$3.50–$5.50/sqft installed",
      warranty: "Lifetime",
      notes: "Air barrier and vapor retarder in one application. Adds structural rigidity to walls.",
    },
  },
  {
    category: "Insulation",
    subcategory: "Attic / Ceiling",
    good: {
      spec: "Blown-in fiberglass R-38 (12\")",
      brandExamples: "Owens Corning AttiCat, CertainTeed InsulSafe",
      costRange: "$1.20–$1.80/sqft installed",
      warranty: "Lifetime limited",
      notes: "Cost-effective for standard vented attics. Meets IECC for most zones.",
    },
    better: {
      spec: "Blown-in cellulose R-49 (14\") + air sealing",
      brandExamples: "National Fiber, GreenFiber, Nu-Wool",
      costRange: "$2.00–$2.80/sqft installed",
      warranty: "Lifetime",
      notes: "Better air sealing performance. Recycled content (75–85%). Dense-pack for full coverage.",
    },
    best: {
      spec: "Unvented roofline: ccSPF R-49 at roof deck",
      brandExamples: "Icynene, Lapolla, Demilec",
      costRange: "$4.50–$7.00/sqft installed",
      warranty: "Lifetime",
      notes: "Conditions the attic, eliminates duct losses to unconditioned space. Required for unvented assemblies.",
    },
  },
  // ─── WINDOWS & DOORS ──────────────────────────────────────────────────────
  {
    category: "Windows & Doors",
    subcategory: "Windows",
    good: {
      spec: "Double-pane vinyl frame, Low-E coating, U-0.30, SHGC 0.25, ENERGY STAR",
      brandExamples: "JELD-WEN W-2500, MI Windows, Simonton Reflections",
      costRange: "$350–$550 per window installed",
      warranty: "20–25 year limited",
      notes: "Lowest upfront cost. Vinyl can warp in extreme heat. Adequate for most climates.",
    },
    better: {
      spec: "Double-pane fiberglass or wood-clad, argon fill, Low-E3, U-0.25, SHGC 0.22",
      brandExamples: "Andersen 400 Series, Pella 250, Marvin Elevate",
      costRange: "$700–$1,100 per window installed",
      warranty: "20-year limited, glass 10-year",
      notes: "Fiberglass has same expansion rate as glass — better seal longevity. Stronger frame.",
    },
    best: {
      spec: "Triple-pane fiberglass, krypton/argon fill, triple Low-E, U-0.18, Passive House compatible",
      brandExamples: "Marvin Ultimate, Pella Impervia, Alpen HPP, Intus",
      costRange: "$1,200–$2,200 per window installed",
      warranty: "Limited lifetime",
      notes: "Near elimination of condensation. Dramatically reduces heating loads in cold climates.",
    },
  },
  {
    category: "Windows & Doors",
    subcategory: "Exterior Entry Door",
    good: {
      spec: "Fiberglass or steel prehung insulated door, 1-3/4\" thick, R-5 core",
      brandExamples: "Therma-Tru Benchmark, JELD-WEN Auburn Hill",
      costRange: "$600–$900 installed",
      warranty: "Limited lifetime (door), 1-year finish",
      notes: "Steel is dent-prone. Fiberglass resists warping, doesn't rust.",
    },
    better: {
      spec: "Fiberglass with composite frame, R-10 polyurethane core, multi-point lock",
      brandExamples: "Therma-Tru Smooth-Star, ProVia Legacy, Pella",
      costRange: "$1,100–$1,800 installed",
      warranty: "Limited lifetime",
      notes: "Higher R-value, better security. Multi-point locking is standard in Europe.",
    },
    best: {
      spec: "Solid mahogany or clad-wood custom door, triple-point lock, R-10+ core",
      brandExamples: "Simpson Door, Kolbe, TruStile, custom millwork",
      costRange: "$2,500–$6,000+ installed",
      warranty: "5-year structural, 1-year finish",
      notes: "Custom sizes and designs. Requires periodic finishing every 2–3 years for wood.",
    },
  },
  // ─── ROOFING ──────────────────────────────────────────────────────────────
  {
    category: "Roofing",
    subcategory: "Roof Covering",
    good: {
      spec: "3-tab asphalt shingle, 235 lb, 25-yr warranty, Class A fire rated",
      brandExamples: "GAF Royal Sovereign, Owens Corning Classic",
      costRange: "$2.50–$3.50/sqft of roof area installed",
      warranty: "25-year limited",
      notes: "Lowest-cost option. Flat profile, less wind resistance than architectural shingles.",
    },
    better: {
      spec: "Architectural/dimensional shingle, 240 lb, Class 4 impact rating, 30-yr",
      brandExamples: "GAF Timberline HDZ, CertainTeed Landmark PRO, Owens Corning Duration",
      costRange: "$4.00–$6.00/sqft of roof area installed",
      warranty: "30-year limited (lifetime with System Plus)",
      notes: "Industry standard for residential. Deeper shadow lines. Wind-rated to 130 mph.",
    },
    best: {
      spec: "24-gauge standing seam steel, Kynar 500 finish, 1.5\" seam, hidden fasteners",
      brandExamples: "MBCI, Sheffield Metals, Metal Sales, Drexel",
      costRange: "$9.00–$14.00/sqft of roof area installed",
      warranty: "40-year Kynar paint, lifetime structural",
      notes: "50+ year lifespan. Snow sheds cleanly. Excellent for rainwater collection.",
    },
  },
  {
    category: "Roofing",
    subcategory: "Roof Sheathing",
    good: {
      spec: "7/16\" OSB with H-clips, 8d ring-shank nails @ 6\" / 12\"",
      brandExamples: "LP OSB, Huber ZIP (unprimed), Georgia-Pacific",
      costRange: "$1.10–$1.50/sqft installed",
      warranty: "25-year limited",
      notes: "Standard code-compliant sheathing. Vulnerable to moisture if exposed.",
    },
    better: {
      spec: "1/2\" OSB ZIP System sheathing + tape (integrated WRB)",
      brandExamples: "Huber ZIP System",
      costRange: "$1.80–$2.30/sqft installed",
      warranty: "30-year limited",
      notes: "Built-in water/air barrier eliminates separate housewrap. Tape critical at seams.",
    },
    best: {
      spec: "5/8\" Advantech structural panels (moisture-resistant resin)",
      brandExamples: "Huber AdvanTech Roof",
      costRange: "$2.20–$2.80/sqft installed",
      warranty: "50-year limited",
      notes: "Superior moisture resistance. Can be exposed to weather for up to 6 months.",
    },
  },
  // ─── EXTERIOR ─────────────────────────────────────────────────────────────
  {
    category: "Exterior",
    subcategory: "Wall Cladding",
    good: {
      spec: "0.040\" vinyl lap siding, Dutch lap, 4\" exposure",
      brandExamples: "Ply Gem Mastic, CertainTeed Monogram, Alside",
      costRange: "$3.50–$5.50/sqft installed",
      warranty: "Limited lifetime",
      notes: "Maintenance-free. Can become brittle in extreme cold. Color fades over 15–20 years.",
    },
    better: {
      spec: "5/16\" fiber cement lap siding, pre-primed, 6.25\" exposure",
      brandExamples: "James Hardie HardiePlank, Allura, Nichiha",
      costRange: "$7.00–$11.00/sqft installed",
      warranty: "30-year limited",
      notes: "Fire resistant, pest resistant, dimensionally stable. Requires paint every 10–15 years.",
    },
    best: {
      spec: "5/4 × 6 clear cedar bevel siding or full brick veneer",
      brandExamples: "Western Red Cedar Lumber Assoc., Boral Bricks, Glen-Gery",
      costRange: "$16.00–$28.00/sqft installed",
      warranty: "Brick: lifetime; Cedar: 20-yr with maintenance",
      notes: "Brick requires no painting and lasts 100+ years. Cedar provides premium natural appearance.",
    },
  },
  {
    category: "Exterior",
    subcategory: "Weather-Resistant Barrier",
    good: {
      spec: "15 lb felt paper or Grade D building paper",
      brandExamples: "GAF, Owens Corning",
      costRange: "$0.25–$0.40/sqft installed",
      warranty: "N/A",
      notes: "Minimum code compliant. Susceptible to tearing and puncture during installation.",
    },
    better: {
      spec: "Housewrap, 3-layer spunbond polypropylene",
      brandExamples: "Tyvek HomeWrap, Typar BuildingWrap, Barricade",
      costRange: "$0.40–$0.65/sqft installed",
      warranty: "Limited lifetime",
      notes: "Higher perm rating allows wall to dry inward. Drainage mat option adds $0.20/sqft.",
    },
    best: {
      spec: "Self-adhered WRB membrane or ZIP System tape",
      brandExamples: "Henry Blueskin VP100, Huber ZIP tape, 475 Pro Clima",
      costRange: "$0.90–$1.50/sqft installed",
      warranty: "25-year limited",
      notes: "Eliminates fastener holes as leak points. Required for Passive House.",
    },
  },
  // ─── HVAC ──────────────────────────────────────────────────────────────────
  {
    category: "HVAC",
    subcategory: "Heating & Cooling System",
    good: {
      spec: "14 SEER2 air source split system + 80% AFUE gas furnace",
      brandExamples: "Carrier Performance 14, Goodman GSXM4, Rheem Classic",
      costRange: "$8–$12/sqft installed (system + ducts)",
      warranty: "10-year parts",
      notes: "Minimum SEER2 per 2023 DOE standards. Effective for mild-to-moderate climates.",
    },
    better: {
      spec: "16–18 SEER2 dual-fuel heat pump + 96% AFUE gas backup",
      brandExamples: "Carrier Infinity 16, Lennox XP16, Trane XV17",
      costRange: "$14–$19/sqft installed",
      warranty: "10-year parts, 20-year on heat exchanger",
      notes: "Heat pump handles shoulder seasons efficiently; gas takes over below ~35°F. Hybrid approach.",
    },
    best: {
      spec: "20–24 SEER2 variable-speed cold-climate heat pump + ERV/HRV",
      brandExamples: "Mitsubishi Hyper Heat, Bosch IDS, Carrier Infinity 24",
      costRange: "$20–$32/sqft installed",
      warranty: "12-year parts",
      notes: "Operates to -22°F. ERV recovers 70–80% of exhaust heat. Qualifies for 30% IRA tax credit.",
    },
  },
  {
    category: "HVAC",
    subcategory: "Water Heater",
    good: {
      spec: "40-gal natural gas storage, 0.67 UEF, 6-yr warranty",
      brandExamples: "A.O. Smith Signature, Rheem Performance, Bradford White",
      costRange: "$900–$1,400 installed",
      warranty: "6-year tank, 1-year parts/labor",
      notes: "Lowest upfront cost. Higher operating cost than heat pump or tankless alternatives.",
    },
    better: {
      spec: "Natural gas tankless, 0.95 UEF, 9.5 GPM, direct vent",
      brandExamples: "Rinnai V75iP, Navien NPE-240S, Noritz NR98-OD",
      costRange: "$2,200–$3,200 installed",
      warranty: "15-year heat exchanger, 5-year parts",
      notes: "Endless hot water, small footprint. Requires dedicated gas line and condensate drain.",
    },
    best: {
      spec: "Hybrid heat pump water heater, 3.75 UEF, 80-gal",
      brandExamples: "Rheem ProTerra, A.O. Smith Voltex, Stiebel Eltron",
      costRange: "$2,800–$3,800 installed",
      warranty: "10-year tank, 10-year compressor",
      notes: "65–70% lower operating cost than electric resistance. $300 IRA rebate eligible.",
    },
  },
  // ─── INTERIOR FINISHES ────────────────────────────────────────────────────
  {
    category: "Interior Finishes",
    subcategory: "Flooring",
    good: {
      spec: "6mm LVP luxury vinyl plank with attached underlayment, AC3 wear layer",
      brandExamples: "LifeProof, Shaw Floorté, COREtec One",
      costRange: "$3.50–$5.50/sqft installed",
      warranty: "Limited lifetime residential",
      notes: "100% waterproof, scratch resistant. Cannot be refinished. Glue-down or floating.",
    },
    better: {
      spec: "3/8\" engineered hardwood, 5\" white oak, aluminum oxide finish",
      brandExamples: "Shaw Repel, Armstrong Engineered, Boen",
      costRange: "$8.00–$13.00/sqft installed",
      warranty: "35-year finish",
      notes: "Can be lightly re-sanded 1–2 times. More dimensionally stable than solid in humid climates.",
    },
    best: {
      spec: "3/4\" solid hardwood 5\" white oak, site-sanded and oil finish",
      brandExamples: "Mirage, Somerset, Bruce, or local millwork",
      costRange: "$14.00–$24.00/sqft installed",
      warranty: "25-year finish (factory) or custom",
      notes: "Can be refinished 5–7 times over lifetime. Adds resale value. Requires climate control.",
    },
  },
  {
    category: "Interior Finishes",
    subcategory: "Kitchen Cabinets",
    good: {
      spec: "Stock frameless RTA cabinets, particle board box, thermofoil or melamine doors",
      brandExamples: "IKEA SEKTION, Home Depot Hampton Bay, RTA Cabinet Store",
      costRange: "$150–$250 per LF installed",
      warranty: "25-year limited",
      notes: "Assembly required. Particle board absorbs moisture if seal is damaged.",
    },
    better: {
      spec: "Semi-custom face-frame, 1/2\" plywood box, soft-close hinges/slides",
      brandExamples: "KraftMaid, MasterBrand Cabinetry, Aristokraft",
      costRange: "$350–$600 per LF installed",
      warranty: "Limited lifetime",
      notes: "Wide range of customization. Plywood box is significantly stronger than particle board.",
    },
    best: {
      spec: "Custom inset face-frame, full 3/4\" plywood, dovetail joinery, furniture-grade finish",
      brandExamples: "Wellborn, Wood-Mode, Brookhaven, local custom shop",
      costRange: "$750–$1,800+ per LF installed",
      warranty: "Limited lifetime",
      notes: "Built to exact measurements. Inset doors require high precision. 8–14 week lead time.",
    },
  },
  {
    category: "Interior Finishes",
    subcategory: "Countertops",
    good: {
      spec: "Post-form laminate, 1-1/2\" thick, seamless front edge",
      brandExamples: "Wilsonart, Formica, Pionite",
      costRange: "$20–$35/sqft installed",
      warranty: "1-year",
      notes: "Cannot be repaired if chipped. Heat/knife damage is permanent. Budget choice.",
    },
    better: {
      spec: "1-1/4\" engineered quartz, full-height splash, undermount sink",
      brandExamples: "Cambria, Silestone, MSI Q Premium, Viatera",
      costRange: "$55–$90/sqft installed",
      warranty: "Limited lifetime",
      notes: "Non-porous, no sealing required. Consistent pattern. UV can cause color shift outdoors.",
    },
    best: {
      spec: "1-1/4\" natural granite or marble full slab, book-matched",
      brandExamples: "MSI, Arizona Tile, Dal-Tile, local slab yard",
      costRange: "$90–$200+/sqft installed",
      warranty: "Installation only (natural variation inherent)",
      notes: "Marble requires annual sealing; prone to staining. Granite is harder and more stain-resistant.",
    },
  },
  // ─── ELECTRICAL & PLUMBING ────────────────────────────────────────────────
  {
    category: "Electrical",
    subcategory: "Electrical System",
    good: {
      spec: "200A main service, standard AFCI/GFCI per NEC 2017, LED overhead lighting",
      brandExamples: "Square D QO, Leviton, Hubbell",
      costRange: "$8–$11/sqft rough + finish",
      warranty: "1-year labor",
      notes: "Meets current NEC requirements. No provisions for EV or future expansion.",
    },
    better: {
      spec: "200A service, whole-home AFCI, USB-C outlets, EV-ready circuit (NEMA 14-50), LED dimmers",
      brandExamples: "Eaton, Siemens, Leviton Decora Smart",
      costRange: "$13–$18/sqft rough + finish",
      warranty: "1-year labor",
      notes: "EV-ready adds $400–600. Pre-wired for future solar/battery. Smart dimmer compatible.",
    },
    best: {
      spec: "400A service, whole-home generator transfer switch, smart panel, structured wiring",
      brandExamples: "Siemens EcoStar, Leviton Omni, Lutron RadioRA 3, Tesla Powerwall-ready",
      costRange: "$22–$35/sqft rough + finish",
      warranty: "1-year labor",
      notes: "Lutron RA3 adds $8,000–25,000. 400A supports EV charging + battery storage + induction cooking.",
    },
  },
  {
    category: "Plumbing",
    subcategory: "Supply & DWV",
    good: {
      spec: "CPVC or PEX-B supply, ABS DWV, builder-grade brass ball valves",
      brandExamples: "Lubrizol FlowGuard CPVC, SharkBite PEX, Charlotte ABS",
      costRange: "$8–$11/sqft rough plumbing",
      warranty: "10-year pipe limited",
      notes: "PEX-B is flexible and freeze-resistant. ABS is easier to glue than PVC.",
    },
    better: {
      spec: "PEX-A manifold system (home-run), PVC DWV, full-port isolation valves",
      brandExamples: "Uponor, Rehau, Viega PEX",
      costRange: "$12–$16/sqft rough plumbing",
      warranty: "25-year limited",
      notes: "Home-run manifold allows individual shutoff per fixture without cutting open walls.",
    },
    best: {
      spec: "Type L copper supply, cast iron DWV (quiet), PEX-A home-run, recirculation pump",
      brandExamples: "Mueller Streamline copper, Charlotte CAST IRON, Grundfos Comfort circ pump",
      costRange: "$18–$28/sqft rough plumbing",
      warranty: "Lifetime on copper",
      notes: "Cast iron DWV dramatically reduces drain noise. Recirculation delivers hot water instantly.",
    },
  },
  {
    category: "Plumbing",
    subcategory: "Plumbing Fixtures",
    good: {
      spec: "WaterSense-certified faucets, 1.5 GPM aerators, fiberglass/acrylic tub+shower",
      brandExamples: "Moen Adler, Delta Foundations, American Standard Cadet",
      costRange: "$800–$1,400 per bathroom installed",
      warranty: "Limited lifetime (faucets), 1-year finish",
      notes: "Functional and code compliant. Finishes may show wear over 5–10 years.",
    },
    better: {
      spec: "WaterSense faucets 1.2 GPM, solid brass body, acrylic alcove tub",
      brandExamples: "Moen Brantford, Delta Linden, Kohler Memoirs, American Standard Studio",
      costRange: "$1,600–$2,800 per bathroom installed",
      warranty: "Limited lifetime",
      notes: "Solid brass handles last decades. Alcove tubs easier to clean than drop-in.",
    },
    best: {
      spec: "Designer faucets 1.0 GPM, free-standing soaking tub, thermostatic shower system",
      brandExamples: "Kohler Artifacts, Brizo, Delta Trinsic Pro, Waterworks",
      costRange: "$3,500–$7,000+ per bathroom installed",
      warranty: "Limited lifetime",
      notes: "Thermostatic valves maintain exact temperature regardless of pressure changes.",
    },
  },
];

// ─── Barndominium / Metal Building Tiers ──────────────────────────────────────

export const BARNDOMINIUM_COST_SUMMARIES: TierCostSummary[] = [
  {
    label: "Good",
    perSqftRange: "$65–$95",
    totalRangeNote: "per sq ft finished (all-in)",
    description: "Pre-engineered or post-frame shell with basic finish-out. R-panel roof and walls, batt insulation, standard slab, builder-grade interior.",
    colorClass: "text-slate-700",
    bgClass: "bg-slate-50 border-slate-200",
  },
  {
    label: "Better",
    perSqftRange: "$100–$145",
    totalRangeNote: "per sq ft finished (all-in)",
    description: "Upgraded shell, spray foam insulation, polished or stained slab, standing seam roof option, quality HVAC for open spans, upgraded interior finishes.",
    colorClass: "text-amber-700",
    bgClass: "bg-amber-50 border-amber-200",
  },
  {
    label: "Best",
    perSqftRange: "$155–$220+",
    totalRangeNote: "per sq ft finished (all-in)",
    description: "Premium custom steel frame or post-frame with full spray foam, radiant heated slab, standing seam, high-end interior finishes — custom cabinetry, hardwood, stone.",
    colorClass: "text-emerald-700",
    bgClass: "bg-emerald-50 border-emerald-200",
  },
];

export const BARNDOMINIUM_SPEC_TIER_ROWS: SpecTierRow[] = [
  // ─── BUILDING SYSTEM ───────────────────────────────────────────────────────
  {
    category: "Building System",
    subcategory: "Structural Frame",
    good: {
      spec: "Post-frame (pole barn) construction, 6×6 or 6×8 treated posts @ 8' OC, pre-built wood trusses",
      brandExamples: "Standard treated timber, local truss manufacturer",
      costRange: "$12–$18/sqft of building footprint",
      warranty: "N/A (structural warranty per engineer)",
      notes: "Most affordable frame system. Very common for barndo builds. Posts bear directly on concrete. Wide bay spacing reduces column count.",
    },
    better: {
      spec: "Pre-engineered steel building kit, 26-gauge Galvalume primary/secondary framing, IBC-compliant",
      brandExamples: "Mueller Buildings, General Steel, Nucor Building Systems, Ameribuilt",
      costRange: "$18–$26/sqft of building footprint",
      warranty: "25-year structural, 40-year Galvalume on framing",
      notes: "Faster erection with engineered drawings included. Clear-span up to 200'. Pre-drilled for fast bolt-up. Better for large footprints.",
    },
    best: {
      spec: "Custom red-iron rigid frame steel, engineer-stamped, 3\" girts and purlins, fully welded connections",
      brandExamples: "VP Buildings, Robertson-Ceco, BlueScope Buildings, local structural steel fab",
      costRange: "$28–$42/sqft of building footprint",
      warranty: "Lifetime structural (with maintenance), 50-year Galvalume",
      notes: "Maximum design flexibility — custom bay spacing, lean-tos, monitors, cupolas. Required for complex multi-use layouts.",
    },
  },
  {
    category: "Building System",
    subcategory: "Foundation / Slab",
    good: {
      spec: "4\" unreinforced slab-on-grade, #4 rebar at perimeter, wire mesh center, standard broom finish",
      brandExamples: "Local concrete contractor, standard mix 3,000 PSI",
      costRange: "$5.50–$8.00/sqft installed",
      warranty: "N/A",
      notes: "Meets code for most light-use areas. No vapor barrier provisions for moisture in living areas. Adequate for shop/storage portion.",
    },
    better: {
      spec: "5\" reinforced slab, #4 rebar @ 18\" OC both ways, 6-mil poly vapor barrier, control joints, smooth trowel finish",
      brandExamples: "Local contractor, 4,000 PSI mix with fiber additive",
      costRange: "$8.00–$12.00/sqft installed",
      warranty: "N/A",
      notes: "Suitable for living space and shop. Smooth trowel finish is required for polishing or staining later. Vapor barrier protects flooring.",
    },
    best: {
      spec: "6\" post-tension or fiber-reinforced slab with radiant heat tubing, 6-mil vapor barrier, polished or stained finish",
      brandExamples: "Polished Concrete Solutions, Concrete Craft, Westcoat, Dur-A-Flex stains",
      costRange: "$16.00–$26.00/sqft installed (with radiant)",
      warranty: "Polished finish: lifetime structural; radiant tubing: 25-year PEX",
      notes: "Radiant adds $6–9/sqft but eliminates ductwork in slab zones. Polished concrete is essentially maintenance-free flooring.",
    },
  },
  // ─── ROOFING & WALLS ────────────────────────────────────────────────────────
  {
    category: "Roof & Exterior Walls",
    subcategory: "Roof Panel System",
    good: {
      spec: "26-gauge PBR (Purlin Bearing Rib) panel, exposed fasteners, Galvalume+ or painted, 36\" coverage",
      brandExamples: "NCI Building Systems, Sheffield Metals PBR, Metal Sales PBR",
      costRange: "$3.00–$4.50/sqft of roof area installed",
      warranty: "25-year paint, 40-year Galvalume substrate",
      notes: "Most common and most affordable metal roof panel. 12/12 pitch or less. Fastener washers must be inspected/replaced at 15–20 years.",
    },
    better: {
      spec: "24-gauge structural standing seam, 1.5\" mechanical seam, Kynar 500 painted finish, hidden fasteners",
      brandExamples: "Metal Sales Tuff-Rib SSM, MBCI Loc-Seam, Sheffield Metals SSR",
      costRange: "$7.00–$10.00/sqft of roof area installed",
      warranty: "35-year Kynar paint, 40-year Galvalume",
      notes: "No exposed fasteners = no leak points. Thermal movement accommodated by seam. Compatible with standing seam clips for solar.",
    },
    best: {
      spec: "24-gauge architectural standing seam, 2\" snap-lock or structural seam, Kynar 500, concealed insulation clip system",
      brandExamples: "ATAS International, Drexel Metals AIA Series, Metal Roof Outlet Signature",
      costRange: "$11.00–$16.00/sqft of roof area installed",
      warranty: "50-year Kynar paint warranty, lifetime structural",
      notes: "Premium residential aesthetics on metal structure. Smooth low-profile seam. Best option if mixing architecture styles. Solar-mount ready.",
    },
  },
  {
    category: "Roof & Exterior Walls",
    subcategory: "Wall Panel / Cladding",
    good: {
      spec: "26-gauge AG panel or R-panel metal siding, exposed fasteners, standard color palette",
      brandExamples: "NCI, Metal Sales, ABC Supply AG panel",
      costRange: "$2.50–$4.00/sqft installed",
      warranty: "25-year paint limited",
      notes: "Purely functional agricultural look. Low maintenance. Color selection limited but durable.",
    },
    better: {
      spec: "24-gauge PBR or concealed-fastener wall panel + board-and-batten trim accents or partial stone veneer",
      brandExamples: "MBCI, Sheffield Metals, Ply Gem Stone (Versetta), Boral Cultured Stone",
      costRange: "$5.50–$9.00/sqft installed",
      warranty: "30-year paint, lifetime stone veneer",
      notes: "Mixing metal panel with stone wainscot is the signature barndo look. Stone veneer adds $14–22/sqft for accented areas only.",
    },
    best: {
      spec: "Concealed-fastener flush wall panel or 5V crimp + full stone veneer base 4', board-on-board cedar or LP SmartSide accent gables",
      brandExamples: "LP SmartSide, Boral, Eldorado Stone, local cut stone",
      costRange: "$10.00–$18.00/sqft blended installed",
      warranty: "50-year LP SmartSide, lifetime natural stone",
      notes: "Custom architectural appearance. Mix of materials requires proper flashing at all transitions. Highest curb appeal.",
    },
  },
  // ─── INSULATION ─────────────────────────────────────────────────────────────
  {
    category: "Insulation",
    subcategory: "Wall & Ceiling Insulation",
    good: {
      spec: "Vinyl-faced fiberglass batt, 3.5\" R-13 wall / 6\" R-19 ceiling, friction-fit between girts/purlins",
      brandExamples: "Owens Corning EcoTouch VR, Johns Manville MICRO-LOCK",
      costRange: "$0.70–$1.10/sqft installed",
      warranty: "Lifetime limited",
      notes: "Standard for agricultural/shop buildings. Thermal bridging through metal frame is significant — R-value in practice is 30–50% lower than rated.",
    },
    better: {
      spec: "2\" closed-cell spray foam on metal panels (R-13) + R-13 fiberglass batt in stud cavity, continuous thermal break",
      brandExamples: "Demilec Heatlok, Icynene ProSeal Eco, NCFI MetalTite",
      costRange: "$2.50–$3.80/sqft installed",
      warranty: "Lifetime",
      notes: "ccSPF on metal panel eliminates condensation risk and thermal bridging. Hybrid approach balances cost and performance. Required for living space.",
    },
    best: {
      spec: "Full closed-cell spray foam throughout: 3\" wall cavity (R-19) + 4\" roof deck (R-25), vapor barrier built in",
      brandExamples: "NCFI ConSeal, Lapolla FoamLok 2000, Icynene ProSeal",
      costRange: "$4.50–$6.50/sqft installed",
      warranty: "Lifetime",
      notes: "Best thermal and air performance possible on metal building. Also structurally stiffens the frame. No additional vapor barrier required.",
    },
  },
  // ─── HVAC ────────────────────────────────────────────────────────────────────
  {
    category: "HVAC",
    subcategory: "Living Space Heating & Cooling",
    good: {
      spec: "Propane or natural gas forced-air furnace (80% AFUE) + 14 SEER2 central AC, standard duct in living area",
      brandExamples: "Goodman GMVC8, Carrier Performance 14, Rheem Classic",
      costRange: "$9–$13/sqft of living area installed",
      warranty: "10-year parts",
      notes: "Familiar system for most contractors. Ducts can run in conditioned space above ceiling. Works well if living area is well-insulated and separated from shop.",
    },
    better: {
      spec: "Multi-zone ductless mini-split system, 18–20 SEER2, heat pump with electric resistance backup",
      brandExamples: "Mitsubishi M-Series, Daikin Quaternity, LG Art Cool Premier",
      costRange: "$14–$22/sqft of living area installed",
      warranty: "12-year compressor, 7-year parts",
      notes: "Ideal for barndo — each zone (bedrooms, open living, shop office) controlled independently. No ductwork in high-ceiling areas. Very efficient.",
    },
    best: {
      spec: "Variable-speed cold-climate heat pump (whole system) + radiant floor in living areas + ERV ventilation",
      brandExamples: "Mitsubishi Hyper Heat + Warmup radiant, Bosch IDS, Uponor radiant panels",
      costRange: "$24–$38/sqft of living area installed",
      warranty: "12-year heat pump, 25-year radiant tubing",
      notes: "Radiant + mini-split combo is the premium barndo setup. Silent, even heat, no drafts. ERV required for tight spray-foam envelope. 30% IRA tax credit eligible.",
    },
  },
  {
    category: "HVAC",
    subcategory: "Shop / Bay Heating",
    good: {
      spec: "Propane or natural gas unit heater (radiant tube or force-air), 75,000–150,000 BTU per bay",
      brandExamples: "Reznor UDAP, Modine Hot Dawg, Sterling F-Series unit heater",
      costRange: "$1,200–$2,200 per unit installed",
      warranty: "5-year heat exchanger",
      notes: "Most common shop heat solution. Fast heat-up, no freeze concerns. Size based on bay volume and door opening frequency.",
    },
    better: {
      spec: "Infrared radiant tube heater (gas), low-intensity, ceiling mounted, zone controlled",
      brandExamples: "Roberts Gordon Vantage, Schwank EVO, Infratech Commercial",
      costRange: "$2,500–$4,000 per unit installed",
      warranty: "10-year emitter",
      notes: "Heats objects and floor rather than air — comfortable even with high ceilings. Less affected by air drafts from bay doors. 20–30% more efficient than unit heaters.",
    },
    best: {
      spec: "In-slab radiant hydronic heat throughout shop floor, propane or heat pump boiler",
      brandExamples: "Uponor, Warmboard, Viega, Weil-McLain boiler, Mitsubishi hydrokit",
      costRange: "$8–$14/sqft of shop floor installed (system)",
      warranty: "25-year PEX tubing",
      notes: "Warmest and most even heat for shop floor work. Eliminates cold concrete in winter. Must be designed into slab — cannot be added later.",
    },
  },
  // ─── INTERIOR FINISHES ──────────────────────────────────────────────────────
  {
    category: "Interior Finishes",
    subcategory: "Partition Walls & Ceiling",
    good: {
      spec: "2×4 wood stud partition walls @ 16\" OC, 1/2\" drywall, knock-down or orange-peel texture, flat paint",
      brandExamples: "USG Sheetrock, National Gypsum Gold Bond",
      costRange: "$4.50–$6.50/sqft of wall area installed",
      warranty: "N/A",
      notes: "Standard residential finish. Economical for separating living quarters. Metal building may require separate stud wall inside the shell.",
    },
    better: {
      spec: "2×6 partition walls, 5/8\" Type X drywall (fire-rated), smooth finish, semi-gloss or satin paint",
      brandExamples: "USG Sheetrock Plus, National Gypsum, PPG Speedhide",
      costRange: "$7.00–$10.00/sqft of wall area installed",
      warranty: "N/A",
      notes: "5/8\" drywall provides better sound isolation and fire separation between shop and living space. Smoother finish shows fewer imperfections.",
    },
    best: {
      spec: "Board-and-batten shiplap (1×6 or 1×8 pine/cedar), tongue & groove ceiling planks, exposed beam accents",
      brandExamples: "Woodtone RealPanel, Stikwood, local shiplap mill, Rustica Hardware",
      costRange: "$11.00–$20.00/sqft of wall/ceiling area installed",
      warranty: "N/A (natural material)",
      notes: "Defines the barndominium aesthetic — warm, rustic, industrial. Often painted white for modern farmhouse look. Exposed barn beams add $25–45 LF.",
    },
  },
  {
    category: "Interior Finishes",
    subcategory: "Flooring (Living Area)",
    good: {
      spec: "6mm LVP luxury vinyl plank, floating install, AC3 wear layer",
      brandExamples: "LifeProof, Shaw Floorté, COREtec One",
      costRange: "$3.50–$5.50/sqft installed",
      warranty: "Limited lifetime residential",
      notes: "100% waterproof, scratch resistant, works over slab. Cannot be refinished. Good match for casual barndo use.",
    },
    better: {
      spec: "Polished or stained concrete slab with area rugs, diamond-grind 400/800/1500 grit, penetrating sealer",
      brandExamples: "Prosoco, Ameripolish, L&M Chemical, Elite Crete Systems",
      costRange: "$4.00–$8.00/sqft polished and sealed",
      warranty: "Sealer recoat every 3–5 years",
      notes: "Signature barndo floor — zero transition between slab and living space. Must specify smooth trowel finish when pouring. Warm with radiant heat.",
    },
    best: {
      spec: "3/4\" solid white oak or hickory hardwood over slab (with subfloor), site-finished with hard-wax oil",
      brandExamples: "Mirage, Somerset, Carlisle Wide Plank, character-grade hickory",
      costRange: "$14.00–$24.00/sqft installed",
      warranty: "25-year finish (factory) or custom",
      notes: "Premium warmth and texture. Must use proper vapor barrier and subfloor over slab. Pairs well with shiplap and exposed beam aesthetic.",
    },
  },
  // ─── OVERHEAD DOORS ─────────────────────────────────────────────────────────
  {
    category: "Doors & Access",
    subcategory: "Overhead / Garage Doors",
    good: {
      spec: "Non-insulated 24-gauge steel sectional door, chain-drive opener, 1/2 HP motor",
      brandExamples: "Clopay Coiling Steel, Wayne Dalton 8000, Chamberlain chain drive",
      costRange: "$900–$1,600 per door installed (10×10)",
      warranty: "Limited lifetime door, 1-year opener",
      notes: "Functional for shop access. No insulation — heat loss significant in cold climates. Loud chain drive typical.",
    },
    better: {
      spec: "2\" insulated steel sectional, R-12 polystyrene core, belt-drive opener with battery backup",
      brandExamples: "Clopay Gallery, Wayne Dalton 9000, LiftMaster 87504",
      costRange: "$1,800–$3,200 per door installed (10×10)",
      warranty: "Limited lifetime door and opener",
      notes: "R-12 insulated door reduces shop heat loss and noise. Belt drive is quiet — important if living space is adjacent. Battery backup for power outages.",
    },
    best: {
      spec: "3\" insulated steel or wood-composite sectional, R-18 urethane core, smart jackshaft opener, Wi-Fi enabled",
      brandExamples: "Clopay Canyon Ridge (faux wood), Amarr Classica, LiftMaster 8500W jackshaft",
      costRange: "$3,500–$7,000 per door installed (10×10 with opener)",
      warranty: "Limited lifetime",
      notes: "Jackshaft mounts to side of door — frees ceiling for lighting and lifts. Smart control allows phone access. Faux-wood carriage style matches barndo aesthetic perfectly.",
    },
  },
  {
    category: "Doors & Access",
    subcategory: "Sliding Barn Doors (Interior)",
    good: {
      spec: "Pine or MDF flat panel sliding barn door, single-track bypass hardware, standard pull",
      brandExamples: "SMARTSTANDARD, ARTisan Hardware, Home Depot interior barn door kits",
      costRange: "$350–$650 per door installed",
      warranty: "N/A",
      notes: "Affordable and popular interior accent. Flat panel works with most styles. Hardware quality varies widely — inspect before buying.",
    },
    better: {
      spec: "Knotty alder or poplar X-brace barn door, solid core, heavy-duty 6' flat track, soft-close hardware",
      brandExamples: "Rustica Hardware, Barn Door Hardware Store, Artisan Hardware",
      costRange: "$800–$1,600 per door installed",
      warranty: "Lifetime hardware",
      notes: "X-brace is the classic barndo look. Solid core reduces sound transmission. Soft-close prevents slamming. Requires proper header backing.",
    },
    best: {
      spec: "Solid reclaimed wood or custom Douglas Fir Z-brace, industrial exposed-rod hardware, powder-coated steel track",
      brandExamples: "Reclaimed Designworks, Montana Reclaimed Lumber, Urban Woods, custom millwork",
      costRange: "$2,000–$5,000+ per door installed",
      warranty: "N/A (custom)",
      notes: "Statement piece for barndo interior. Reclaimed wood has unique character. Custom sizing available for oversized openings up to 8' wide × 10' tall.",
    },
  },
  // ─── ELECTRICAL ─────────────────────────────────────────────────────────────
  {
    category: "Electrical",
    subcategory: "Electrical Service & Distribution",
    good: {
      spec: "200A main service, standard residential panel, AFCI/GFCI per NEC, 120/240V circuits",
      brandExamples: "Square D QO, Siemens, Leviton",
      costRange: "$9–$13/sqft rough + finish",
      warranty: "1-year labor",
      notes: "Meets residential code. Adequate for living space. Will not support heavy shop equipment (3-phase welders, large compressors).",
    },
    better: {
      spec: "200A main + 100A shop sub-panel, 240V circuits for shop equipment, EV-ready NEMA 14-50 outlet, USB-C receptacles",
      brandExamples: "Eaton BR, Square D QO sub, Siemens",
      costRange: "$15–$22/sqft rough + finish",
      warranty: "1-year labor",
      notes: "Sub-panel for shop keeps circuits separate from living space. 240V circuits handle most home shop tools. EV adds $400–600.",
    },
    best: {
      spec: "400A service, separate 200A living panel + 200A shop panel, 3-phase option if available, generator transfer switch, structured wiring",
      brandExamples: "Siemens PL Series, Square D HOMT, Generac Transfer Switch, Lutron RadioRA 3",
      costRange: "$25–$40/sqft rough + finish",
      warranty: "1-year labor",
      notes: "3-phase enables commercial-grade CNC, welders, lifts. Generator transfer protects home and shop. Smart lighting throughout living area.",
    },
  },
  // ─── PLUMBING ────────────────────────────────────────────────────────────────
  {
    category: "Plumbing",
    subcategory: "Supply & DWV",
    good: {
      spec: "PEX-B supply, PVC DWV, builder-grade fixtures, utility mop sink in shop area",
      brandExamples: "SharkBite PEX, Charlotte PVC, Kohler Escale utility sink",
      costRange: "$9–$12/sqft rough plumbing (living area)",
      warranty: "10-year PEX limited",
      notes: "Standard residential rough-in. Utility sink in shop is very common and practical. PEX is freeze-resistant — important in unheated shop areas.",
    },
    better: {
      spec: "PEX-A manifold system with home-run layout, PVC DWV, full-port ball valves, floor drain in shop",
      brandExamples: "Uponor, Rehau, Viega; Watts floor drain",
      costRange: "$13–$18/sqft rough plumbing",
      warranty: "25-year PEX-A limited",
      notes: "Manifold allows shutoff per fixture without accessing walls. Floor drain in shop is critical for washing vehicles, equipment, or any wet work.",
    },
    best: {
      spec: "PEX-A manifold, cast iron DWV (noise reduction), recirculation pump, outdoor hose bibs on multiple sides, 2 floor drains in shop",
      brandExamples: "Uponor, Mueller cast iron, Grundfos Comfort circ pump",
      costRange: "$20–$30/sqft rough plumbing",
      warranty: "Lifetime copper/CI, 25-year PEX",
      notes: "Cast iron drain dramatically reduces noise in living area. Recirculation delivers instant hot water. Multiple hose bibs essential for large footprint.",
    },
  },
];

// ─── Helper: get structure-appropriate rows ────────────────────────────────────

const BARNDOMINIUM_TYPES = new Set(["BARNDOMINIUM"]);
const AGRICULTURAL_TYPES = new Set(["BARN", "POLE_BARN"]);

export function getSpecTierRows(structureType: string): SpecTierRow[] {
  if (BARNDOMINIUM_TYPES.has(structureType)) return BARNDOMINIUM_SPEC_TIER_ROWS;
  if (AGRICULTURAL_TYPES.has(structureType)) return BARNDOMINIUM_SPEC_TIER_ROWS; // similar metal-building spec
  return SPEC_TIER_ROWS;
}

export function getSpecTierCostSummaries(structureType: string): TierCostSummary[] {
  if (BARNDOMINIUM_TYPES.has(structureType) || AGRICULTURAL_TYPES.has(structureType)) {
    return BARNDOMINIUM_COST_SUMMARIES;
  }
  return TIER_COST_SUMMARIES;
}
