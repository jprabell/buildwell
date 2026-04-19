import { StructureType } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScheduleTask {
  id: string;
  name: string;
  durationDays: number; // calendar days
  dependsOn: string[];  // task IDs that must complete first
  isCritical: boolean;  // on the critical path
  notes?: string;
}

export interface SchedulePhase {
  id: string;
  name: string;
  order: number;
  color: string;       // Tailwind bg class for the badge
  tasks: ScheduleTask[];
}

export interface ConstructionSchedule {
  phases: SchedulePhase[];
  totalWeeks: number;
  criticalPathSummary: string;
}

// ─── Phase color palette ──────────────────────────────────────────────────────

const PHASE_COLORS: Record<string, string> = {
  "pre-construction": "bg-slate-600",
  "site-work":        "bg-amber-700",
  "foundation":       "bg-stone-700",
  "framing":          "bg-amber-600",
  "rough-mep":        "bg-blue-700",
  "envelope":         "bg-emerald-700",
  "insulation-drywall":"bg-purple-700",
  "interior-finish":  "bg-rose-700",
  "final-mep":        "bg-blue-600",
  "completion":       "bg-green-700",
};

// ─── Duration scalar based on project size ───────────────────────────────────

function sizeMultiplier(sqft: number): number {
  if (sqft <= 800)   return 0.6;
  if (sqft <= 1500)  return 0.8;
  if (sqft <= 2500)  return 1.0;
  if (sqft <= 4000)  return 1.25;
  return 1.5;
}

// ─── Residential / Single-Family / Barndo / Log Cabin / A-Frame / Dome ────────

function residentialSchedule(sqft: number): SchedulePhase[] {
  const m = sizeMultiplier(sqft);
  const d = (n: number) => Math.max(1, Math.round(n * m));

  return [
    {
      id: "pre-construction",
      name: "Pre-Construction",
      order: 1,
      color: PHASE_COLORS["pre-construction"],
      tasks: [
        { id: "permits",     name: "Secure building permits",        durationDays: d(21), dependsOn: [],         isCritical: true,  notes: "Submit full permit application with site plan, floor plan, and structural drawings." },
        { id: "survey",      name: "Site survey & soil test",        durationDays: d(7),  dependsOn: [],         isCritical: false, notes: "Soil bearing capacity test and boundary survey required before foundation design." },
        { id: "engineering", name: "Engineering review & stamp",     durationDays: d(14), dependsOn: ["survey"], isCritical: true,  notes: "Structural engineer reviews and stamps foundation and framing plans." },
        { id: "contracts",   name: "Contractor selection & contracts",durationDays: d(14), dependsOn: ["permits"],isCritical: true,  notes: "Sign contracts with GC and key subs. Lock in material lead times." },
      ],
    },
    {
      id: "site-work",
      name: "Site Work",
      order: 2,
      color: PHASE_COLORS["site-work"],
      tasks: [
        { id: "clearing",    name: "Land clearing & grading",        durationDays: d(5),  dependsOn: ["contracts"], isCritical: true,  notes: "Remove trees, stumps, and debris. Rough grade for drainage away from building." },
        { id: "temp-power",  name: "Temporary power & water",        durationDays: d(2),  dependsOn: ["clearing"],  isCritical: false, notes: "Install temporary electric panel and water source for construction use." },
        { id: "utility-stub", name: "Utility rough-in (water / sewer / electric)", durationDays: d(7), dependsOn: ["clearing"], isCritical: true },
      ],
    },
    {
      id: "foundation",
      name: "Foundation",
      order: 3,
      color: PHASE_COLORS["foundation"],
      tasks: [
        { id: "footings",    name: "Form & pour footings",           durationDays: d(5),  dependsOn: ["utility-stub"], isCritical: true,  notes: "Set footing forms, place rebar, pour concrete. Allow cure time before next step." },
        { id: "foundation-walls", name: "Foundation walls / slab",  durationDays: d(7),  dependsOn: ["footings"],     isCritical: true,  notes: "Poured concrete walls, block, or slab depending on foundation type." },
        { id: "waterproofing", name: "Waterproofing & drainage board", durationDays: d(3),  dependsOn: ["foundation-walls"], isCritical: false },
        { id: "backfill",    name: "Backfill & compaction",          durationDays: d(2),  dependsOn: ["waterproofing"], isCritical: true, notes: "Compact backfill in lifts. Do not over-compact against walls." },
      ],
    },
    {
      id: "framing",
      name: "Framing",
      order: 4,
      color: PHASE_COLORS["framing"],
      tasks: [
        { id: "floor-frame", name: "Floor framing & subfloor",       durationDays: d(4),  dependsOn: ["backfill"], isCritical: true,  notes: "Floor joists or slab prep, OSB subfloor glued and screwed." },
        { id: "wall-frame",  name: "Wall framing",                   durationDays: d(6),  dependsOn: ["floor-frame"], isCritical: true, notes: "Exterior and interior walls. Verify plumb, level, and square before sheathing." },
        { id: "roof-frame",  name: "Roof framing / trusses",         durationDays: d(6),  dependsOn: ["wall-frame"],  isCritical: true, notes: "Set engineered trusses or cut rafters. Install ridge beam and collar ties." },
        { id: "sheathing",   name: "Sheathing & housewrap",          durationDays: d(4),  dependsOn: ["roof-frame"],  isCritical: true, notes: "OSB sheathing on walls and roof deck. Install WRB / housewrap before any openings." },
        { id: "windows-rough", name: "Window & door rough openings", durationDays: d(2),  dependsOn: ["sheathing"],   isCritical: false, notes: "Confirm rough opening sizes match window/door schedule." },
      ],
    },
    {
      id: "rough-mep",
      name: "Rough MEP",
      order: 5,
      color: PHASE_COLORS["rough-mep"],
      tasks: [
        { id: "rough-elec",  name: "Electrical rough-in",            durationDays: d(6),  dependsOn: ["sheathing"], isCritical: true,  notes: "Run circuits, panel location, outlet and switch boxes. No devices yet." },
        { id: "rough-plumb", name: "Plumbing rough-in",              durationDays: d(6),  dependsOn: ["sheathing"], isCritical: false, notes: "All supply and drain lines stubbed. Pressure test before closing walls." },
        { id: "rough-hvac",  name: "HVAC rough-in & ductwork",       durationDays: d(5),  dependsOn: ["sheathing"], isCritical: false, notes: "Run all duct trunk lines and branches. Install air handler platform." },
        { id: "rough-insp",  name: "Rough inspection & approval",    durationDays: d(5),  dependsOn: ["rough-elec","rough-plumb","rough-hvac"], isCritical: true, notes: "CRITICAL: Building inspector must sign off before closing any walls." },
      ],
    },
    {
      id: "envelope",
      name: "Exterior Envelope",
      order: 6,
      color: PHASE_COLORS["envelope"],
      tasks: [
        { id: "roofing",     name: "Roofing installation",           durationDays: d(5),  dependsOn: ["sheathing"], isCritical: false, notes: "Underlayment, drip edge, and shingles or metal panels. Flash all penetrations." },
        { id: "siding",      name: "Exterior siding",                durationDays: d(7),  dependsOn: ["roofing"],   isCritical: false, notes: "Install siding over weather-resistive barrier. Caulk all joints and transitions." },
        { id: "windows-install", name: "Windows & exterior doors", durationDays: d(4),  dependsOn: ["windows-rough"], isCritical: false, notes: "Set units. Flash and tape every window per manufacturer specs to avoid leaks." },
        { id: "ext-paint",   name: "Exterior paint / finish",        durationDays: d(4),  dependsOn: ["siding","windows-install"], isCritical: false },
      ],
    },
    {
      id: "insulation-drywall",
      name: "Insulation & Drywall",
      order: 7,
      color: PHASE_COLORS["insulation-drywall"],
      tasks: [
        { id: "insulation",  name: "Insulation",                     durationDays: d(4),  dependsOn: ["rough-insp"], isCritical: true,  notes: "Walls, ceiling, and floor insulation. Insulation inspection may be required before drywall." },
        { id: "drywall-hang", name: "Drywall hang", durationDays: d(5),  dependsOn: ["insulation"], isCritical: true,  notes: "Hang 5/8\" Type-X on garage walls/ceilings (fire separation). Standard elsewhere." },
        { id: "drywall-finish", name: "Tape, mud & sand", durationDays: d(10), dependsOn: ["drywall-hang"], isCritical: true, notes: "Three coats of joint compound with drying time between coats. Sand smooth." },
        { id: "texture-prime", name: "Texture & prime coat", durationDays: d(4),  dependsOn: ["drywall-finish"], isCritical: true },
      ],
    },
    {
      id: "interior-finish",
      name: "Interior Finish",
      order: 8,
      color: PHASE_COLORS["interior-finish"],
      tasks: [
        { id: "flooring",    name: "Flooring installation",          durationDays: d(6),  dependsOn: ["texture-prime"], isCritical: true,  notes: "Tile, hardwood, or LVP. Install before cabinets so flooring runs beneath." },
        { id: "cabinets",    name: "Cabinets & vanities",            durationDays: d(4),  dependsOn: ["flooring"],      isCritical: true,  notes: "Level and shim all cabinets. Countertop template after cabinets are set." },
        { id: "countertops", name: "Countertop template & install",  durationDays: d(10), dependsOn: ["cabinets"],      isCritical: true,  notes: "Stone tops require template, fabrication, and return trip. Allow 7–10 days lead." },
        { id: "interior-trim", name: "Interior trim & doors", durationDays: d(6),  dependsOn: ["flooring"],      isCritical: false, notes: "Baseboard, casing, doors, and closet systems. Caulk and fill nail holes." },
        { id: "int-paint",   name: "Interior paint",                 durationDays: d(6),  dependsOn: ["interior-trim","countertops"], isCritical: true },
      ],
    },
    {
      id: "final-mep",
      name: "Final MEP",
      order: 9,
      color: PHASE_COLORS["final-mep"],
      tasks: [
        { id: "final-elec",  name: "Electrical trim-out",            durationDays: d(4),  dependsOn: ["int-paint"], isCritical: true,  notes: "Install all devices, fixtures, panel trim-out, and service entrance." },
        { id: "final-plumb", name: "Plumbing trim-out",              durationDays: d(4),  dependsOn: ["int-paint"], isCritical: false, notes: "Set all fixtures, hook up appliances, test for leaks." },
        { id: "hvac-commission", name: "HVAC commissioning", durationDays: d(3),  dependsOn: ["final-elec"], isCritical: false, notes: "Commission air handler and condenser. Balance airflow to all rooms." },
        { id: "low-voltage", name: "Low voltage & smart home",       durationDays: d(3),  dependsOn: ["int-paint"], isCritical: false },
      ],
    },
    {
      id: "completion",
      name: "Final Completion",
      order: 10,
      color: PHASE_COLORS["completion"],
      tasks: [
        { id: "landscaping", name: "Landscaping & grading",          durationDays: d(7),  dependsOn: ["ext-paint"],   isCritical: false, notes: "Final grade, topsoil, seed or sod, driveway, walkways." },
        { id: "final-insp",  name: "Final building inspection",      durationDays: d(5),  dependsOn: ["final-elec","final-plumb","hvac-commission"], isCritical: true, notes: "Inspector walks entire building. All systems must be operational." },
        { id: "punch-list",  name: "Punch list & corrections",       durationDays: d(7),  dependsOn: ["final-insp"],  isCritical: true,  notes: "Address all inspector and owner punch list items before certificate." },
        { id: "co",          name: "Certificate of Occupancy",       durationDays: d(5),  dependsOn: ["punch-list"],  isCritical: true,  notes: "Final CO issued by building department. Do not move in before CO is in hand." },
      ],
    },
  ];
}

// ─── Agricultural (Barn, Pole Barn, Barndominium) ─────────────────────────────

function agriculturalSchedule(sqft: number): SchedulePhase[] {
  const m = sizeMultiplier(sqft);
  const d = (n: number) => Math.max(1, Math.round(n * m));

  return [
    {
      id: "pre-construction",
      name: "Pre-Construction",
      order: 1,
      color: PHASE_COLORS["pre-construction"],
      tasks: [
        { id: "permits",   name: "Permits & agricultural exemptions",  durationDays: d(14), dependsOn: [],          isCritical: true,  notes: "Verify agricultural exemptions. Rural counties may not require permits for structures under certain sq ft." },
        { id: "site-plan", name: "Site plan & layout staking",         durationDays: d(5),  dependsOn: [],          isCritical: false },
        { id: "contracts", name: "Contractor selection",               durationDays: d(10), dependsOn: ["permits"], isCritical: true },
      ],
    },
    {
      id: "site-work",
      name: "Site Work",
      order: 2,
      color: PHASE_COLORS["site-work"],
      tasks: [
        { id: "clearing",    name: "Land clearing & grading",          durationDays: d(5), dependsOn: ["contracts"], isCritical: true },
        { id: "utility-stub", name: "Utility rough-in (if applicable)", durationDays: d(5), dependsOn: ["clearing"],  isCritical: false, notes: "Basic water and electric service to building." },
      ],
    },
    {
      id: "foundation",
      name: "Foundation",
      order: 3,
      color: PHASE_COLORS["foundation"],
      tasks: [
        { id: "post-holes", name: "Post holes / anchor bolts",         durationDays: d(3), dependsOn: ["utility-stub"], isCritical: true,  notes: "Drill or dig post holes per engineered spacing. Set anchor bolts in concrete." },
        { id: "slab",       name: "Concrete floor slab",               durationDays: d(6), dependsOn: ["post-holes"],   isCritical: true,  notes: "Steel-reinforced slab with control joints. Cure 7+ days before heavy loads." },
      ],
    },
    {
      id: "framing",
      name: "Post-Frame Erection",
      order: 4,
      color: PHASE_COLORS["framing"],
      tasks: [
        { id: "posts",      name: "Post setting & plumbing",           durationDays: d(3), dependsOn: ["slab"],    isCritical: true },
        { id: "trusses",    name: "Truss / rafter installation",       durationDays: d(4), dependsOn: ["posts"],   isCritical: true },
        { id: "girts",      name: "Girts, purlins & bracing",          durationDays: d(4), dependsOn: ["trusses"], isCritical: true },
        { id: "metal-skin", name: "Metal roofing & siding panels",     durationDays: d(6), dependsOn: ["girts"],   isCritical: true,  notes: "Install roofing first to get building watertight. Then wall panels." },
        { id: "doors",      name: "Sliding / roll-up doors & windows", durationDays: d(3), dependsOn: ["metal-skin"], isCritical: false },
      ],
    },
    {
      id: "rough-mep",
      name: "Rough MEP",
      order: 5,
      color: PHASE_COLORS["rough-mep"],
      tasks: [
        { id: "rough-elec", name: "Electrical rough-in & subpanel",    durationDays: d(4), dependsOn: ["metal-skin"], isCritical: true },
        { id: "rough-plumb", name: "Plumbing rough-in (if applicable)", durationDays: d(3), dependsOn: ["metal-skin"], isCritical: false },
        { id: "rough-insp", name: "Rough inspection",                  durationDays: d(3), dependsOn: ["rough-elec"], isCritical: true },
      ],
    },
    {
      id: "insulation-drywall",
      name: "Interior Liner & Insulation",
      order: 6,
      color: PHASE_COLORS["insulation-drywall"],
      tasks: [
        { id: "insulation", name: "Wall & ceiling insulation",         durationDays: d(3), dependsOn: ["rough-insp"], isCritical: true,  notes: "Spray foam or batt insulation on interior face of metal panels." },
        { id: "liner",      name: "Interior liner panels / drywall",   durationDays: d(5), dependsOn: ["insulation"], isCritical: true },
      ],
    },
    {
      id: "completion",
      name: "Final Completion",
      order: 7,
      color: PHASE_COLORS["completion"],
      tasks: [
        { id: "final-elec", name: "Electrical trim-out",               durationDays: d(3), dependsOn: ["liner"],       isCritical: true },
        { id: "final-insp", name: "Final inspection",                  durationDays: d(3), dependsOn: ["final-elec"],  isCritical: true },
        { id: "grading",    name: "Final grading & site cleanup",      durationDays: d(4), dependsOn: ["final-insp"],  isCritical: false },
      ],
    },
  ];
}

// ─── Small structures (Shed, Workshop, Garage) ───────────────────────────────

function smallStructureSchedule(sqft: number): SchedulePhase[] {
  const m = Math.min(sizeMultiplier(sqft), 1.0);
  const d = (n: number) => Math.max(1, Math.round(n * m));

  return [
    {
      id: "pre-construction",
      name: "Pre-Construction",
      order: 1,
      color: PHASE_COLORS["pre-construction"],
      tasks: [
        { id: "permits",   name: "Permit application (if required)",  durationDays: d(10), dependsOn: [],          isCritical: true,  notes: "Many jurisdictions exempt sheds under 200 sq ft. Garages and workshops typically require permits." },
        { id: "contracts", name: "Contractor selection",              durationDays: d(7),  dependsOn: ["permits"], isCritical: true },
      ],
    },
    {
      id: "foundation",
      name: "Foundation",
      order: 2,
      color: PHASE_COLORS["foundation"],
      tasks: [
        { id: "foundation", name: "Concrete slab or skid foundation", durationDays: d(4), dependsOn: ["contracts"], isCritical: true, notes: "For garages: 4\" minimum concrete slab with rebar or wire mesh. Sheds can use pressure-treated skids on gravel." },
      ],
    },
    {
      id: "framing",
      name: "Framing & Envelope",
      order: 3,
      color: PHASE_COLORS["framing"],
      tasks: [
        { id: "framing",    name: "Wall & roof framing",              durationDays: d(4), dependsOn: ["foundation"], isCritical: true },
        { id: "sheathing",  name: "Sheathing, roofing & siding",      durationDays: d(5), dependsOn: ["framing"],    isCritical: true },
        { id: "doors-windows", name: "Doors, windows & overhead doors", durationDays: d(2), dependsOn: ["sheathing"],  isCritical: true },
      ],
    },
    {
      id: "rough-mep",
      name: "Electrical",
      order: 4,
      color: PHASE_COLORS["rough-mep"],
      tasks: [
        { id: "rough-elec", name: "Electrical rough-in",              durationDays: d(3), dependsOn: ["sheathing"], isCritical: true, notes: "Subpanel or single circuit depending on size. 220V outlets for workshop equipment." },
        { id: "rough-insp", name: "Electrical inspection",            durationDays: d(3), dependsOn: ["rough-elec"], isCritical: true },
      ],
    },
    {
      id: "interior-finish",
      name: "Interior Finish",
      order: 5,
      color: PHASE_COLORS["interior-finish"],
      tasks: [
        { id: "insulation", name: "Insulation (if conditioned)",      durationDays: d(2), dependsOn: ["rough-insp"], isCritical: false },
        { id: "drywall",    name: "Drywall / interior finish",        durationDays: d(4), dependsOn: ["insulation"], isCritical: false, notes: "5/8\" Type-X drywall on garage walls/ceilings shared with dwelling." },
        { id: "final-elec", name: "Electrical trim-out",              durationDays: d(2), dependsOn: ["drywall"],    isCritical: true },
      ],
    },
    {
      id: "completion",
      name: "Final Completion",
      order: 6,
      color: PHASE_COLORS["completion"],
      tasks: [
        { id: "final-insp", name: "Final inspection",                 durationDays: d(3), dependsOn: ["final-elec"], isCritical: true },
        { id: "grading",    name: "Site cleanup & grading",           durationDays: d(2), dependsOn: ["final-insp"], isCritical: false },
      ],
    },
  ];
}

// ─── Schedule durations (rough total-week calculator) ─────────────────────────

function calcTotalWeeks(phases: SchedulePhase[]): number {
  // Sum all tasks on the critical path, convert days → weeks, add 10% buffer
  let days = 0;
  for (const phase of phases) {
    for (const task of phase.tasks) {
      if (task.isCritical) days += task.durationDays;
    }
  }
  return Math.ceil((days * 1.1) / 7);
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateSchedule(
  structureType: StructureType | string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers: Record<string, any>
): ConstructionSchedule {
  const sqft = Number(answers.squareFootage) || 1500;

  const agriculturalTypes = ["BARN", "POLE_BARN", "BARNDOMINIUM"];
  const smallTypes        = ["SHED", "WORKSHOP", "GARAGE"];

  let phases: SchedulePhase[];
  let criticalPathSummary: string;

  if (agriculturalTypes.includes(structureType)) {
    phases = agriculturalSchedule(sqft);
    criticalPathSummary =
      "Permits → Site Work → Foundation → Post-Frame Erection → Rough MEP → Rough Inspection → Interior Liner → Final Inspection";
  } else if (smallTypes.includes(structureType)) {
    phases = smallStructureSchedule(sqft);
    criticalPathSummary =
      "Permits → Foundation → Framing → Electrical Rough-in → Electrical Inspection → Final Inspection";
  } else {
    // Everything else (residential, container, tiny home, log cabin, A-frame, dome, etc.)
    phases = residentialSchedule(sqft);
    criticalPathSummary =
      "Permits → Engineering → Site Work → Foundation → Framing → Rough Inspection → Insulation → Drywall → Interior Finish → Electrical Trim → Final Inspection → Certificate of Occupancy";
  }

  const totalWeeks = calcTotalWeeks(phases);
  return { phases, totalWeeks, criticalPathSummary };
}
