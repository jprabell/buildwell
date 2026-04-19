import { ProjectAnswers } from "@/types";

export interface RoomEntry {
  name: string;
  width: number;
  length: number;
  sqft: number;
  notes: string;
}

export interface StructuralSection {
  label: string;
  value: string;
  notes: string;
}

export interface SystemItem {
  item: string;
  spec: string;
  notes: string;
}

export interface MaterialItem {
  category: string;
  selection: string;
  spec: string;
}

export interface CodeItem {
  code: string;
  requirement: string;
  status: "required" | "verify" | "n_a";
}

export interface PlanningReport {
  projectName: string;
  structureType: string;
  generatedAt: string;
  squareFootage: number;
  stories: number;
  location: string;
  budgetRange: string;
  rooms: RoomEntry[];
  structural: StructuralSection[];
  plumbing: SystemItem[];
  electrical: SystemItem[];
  hvac: SystemItem[];
  materials: MaterialItem[];
  codeChecklist: CodeItem[];
  assumptions: string[];
  disclaimer: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v) || fallback;
  return fallback;
}

function str(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return fallback;
}

function arr(v: unknown): string[] {
  return Array.isArray(v) ? v : [];
}

function round(n: number, d = 0): number {
  return Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
}

function labelFoundation(type: string): string {
  const m: Record<string, string> = {
    slab: "Monolithic Slab-on-Grade",
    crawl_space: "Crawl Space w/ Perimeter Footing",
    full_basement: "Full Basement (8 ft depth)",
    walkout_basement: "Walkout Basement",
    pier_beam: "Pier & Beam",
    helical_piers: "Helical Screw Piles",
    none: "Grade Beam / Compacted Gravel Pad",
    post_frame: "Embedded Post-Frame",
  };
  return m[type] ?? type.replace(/_/g, " ");
}

function labelRoof(type: string): string {
  const m: Record<string, string> = {
    gable: "Gable Roof",
    hip: "Hip Roof",
    shed: "Shed / Mono-Slope Roof",
    flat: "Flat / Low-Slope Roof",
    gambrel: "Gambrel Roof",
    metal_standing_seam: "Metal Standing Seam",
    butterfly: "Butterfly Roof",
    dome: "Geodesic Dome",
  };
  return m[type] ?? type.replace(/_/g, " ");
}

function labelRoofMaterial(mat: string): string {
  const m: Record<string, string> = {
    asphalt_shingle: "30-yr Architectural Asphalt Shingle",
    metal_panel: "29 ga Corrugated Metal Panel",
    standing_seam_metal: "Snap-Lock Standing Seam Metal",
    metal_shingle: "Stone-Coated Steel Shingle",
    wood_shake: "Cedar Shake (Class A treated)",
    clay_tile: "Interlocking Clay Tile",
    concrete_tile: "Concrete Barrel Tile",
    tpo_membrane: "60 mil TPO Membrane",
    epdm: "60 mil EPDM (Fully Adhered)",
    green_roof: "Green Roof Assembly (TPO + Growing Media)",
  };
  return m[mat] ?? mat.replace(/_/g, " ");
}

function labelExterior(mat: string): string {
  const m: Record<string, string> = {
    vinyl_siding: "Vinyl Lap Siding (Insulated)",
    fiber_cement: "Fiber Cement Lap Siding (HardiePlank)",
    wood_siding: "Cedar Bevel Siding",
    brick: "Brick Veneer",
    stone: "Stone Veneer (Cultured or Natural)",
    stucco: "3-Coat Stucco System",
    metal_panel: "Metal Panel Cladding",
    log: "Log Siding (8–10 in, Kiln-Dried)",
    corten_steel: "COR-TEN Weathering Steel",
    shipping_container: "Container Steel (Painted)",
    earth: "Rammed Earth / Adobe",
  };
  return m[mat] ?? mat.replace(/_/g, " ");
}

function labelHvac(type: string): string {
  const m: Record<string, string> = {
    central_hvac: "Central Ducted Heat Pump",
    mini_split: "Ductless Mini-Split System",
    radiant_floor: "Hydronic Radiant Floor Heat",
    wood_stove: "EPA-Certified Wood Stove",
    geothermal: "Geothermal Heat Pump",
    passive: "Passive Design (No Mechanical)",
    propane_furnace: "Propane Forced-Air Furnace + AC",
  };
  return m[type] ?? type.replace(/_/g, " ");
}

function labelBudget(range: string): string {
  const m: Record<string, string> = {
    under_50k: "Under $50,000",
    "50k_100k": "$50,000 – $100,000",
    "100k_200k": "$100,000 – $200,000",
    "200k_400k": "$200,000 – $400,000",
    "400k_750k": "$400,000 – $750,000",
    over_750k: "Over $750,000",
  };
  return m[range] ?? range.replace(/_/g, " ");
}

function labelClimate(zone: string): string {
  const m: Record<string, string> = {
    hot_humid: "Hot-Humid (IECC Zone 1–2)",
    hot_dry: "Hot-Dry (IECC Zone 2–3)",
    mixed_humid: "Mixed-Humid (IECC Zone 3–4)",
    mixed_dry: "Mixed-Dry (IECC Zone 3–4)",
    cold: "Cold (IECC Zone 5–6)",
    very_cold: "Very Cold (IECC Zone 7)",
    subarctic: "Subarctic / Arctic (IECC Zone 8)",
    marine: "Marine (IECC Zone 3C–4C)",
  };
  return m[zone] ?? zone.replace(/_/g, " ");
}

// ─── Room Schedule ─────────────────────────────────────────────────────────────

function buildRoomSchedule(answers: ProjectAnswers, structureType: string): RoomEntry[] {
  const sqft = num(answers.squareFootage, 1500);
  const stories = num(answers.stories, 1);
  const bedrooms = num(answers.bedrooms, 3);
  const bathrooms = parseFloat(str(answers.bathrooms, "2")) || 2;
  const fullBaths = Math.floor(bathrooms);
  const halfBaths = bathrooms % 1 > 0 ? 1 : 0;
  const hasGarage = !str(answers.garageType).includes("none") && str(answers.garageType) !== "";
  const hasBasement = str(answers.foundationType).includes("basement");

  const rooms: RoomEntry[] = [];

  // Non-residential structures get simple room schedule
  if (["BARN", "POLE_BARN", "SHED", "WORKSHOP", "GARAGE", "QUONSET_HUT", "SILO"].includes(structureType)) {
    const primarySqft = round(sqft * 0.8, 0);
    const side = Math.sqrt(primarySqft);
    rooms.push({ name: "Primary Space", width: round(side, 0), length: round(primarySqft / side, 0), sqft: primarySqft, notes: "Main use area" });
    if (sqft > 400) {
      rooms.push({ name: "Storage / Secondary", width: 12, length: round(sqft * 0.15 / 12, 0), sqft: round(sqft * 0.15, 0), notes: "" });
    }
    if (structureType === "WORKSHOP" || structureType === "GARAGE") {
      rooms.push({ name: "Utility / Mechanical", width: 8, length: 10, sqft: 80, notes: "Electrical panel, water heater if applicable" });
    }
    return rooms;
  }

  // Residential: distribute sq footage across rooms
  const remainingSqft = sqft;
  const masterSqft = round(Math.min(remainingSqft * 0.13, 280), 0);
  const masterW = 14; const masterL = round(masterSqft / masterW, 0);
  rooms.push({ name: "Master Bedroom", width: masterW, length: masterL, sqft: masterW * masterL, notes: "Primary suite" });

  if (fullBaths >= 1) {
    rooms.push({ name: "Master Bathroom", width: 10, length: 9, sqft: 90, notes: "En-suite; double vanity, walk-in shower" });
  }
  if (bedrooms >= 2) {
    rooms.push({ name: "Bedroom 2", width: 12, length: 12, sqft: 144, notes: "" });
  }
  if (bedrooms >= 3) {
    rooms.push({ name: "Bedroom 3", width: 11, length: 12, sqft: 132, notes: "" });
  }
  if (bedrooms >= 4) {
    rooms.push({ name: "Bedroom 4", width: 11, length: 11, sqft: 121, notes: "" });
  }
  if (fullBaths >= 2) {
    rooms.push({ name: "Full Bathroom", width: 8, length: 6, sqft: 48, notes: "Hall bath; tub/shower combo" });
  }
  if (halfBaths > 0) {
    rooms.push({ name: "Half Bath / Powder Room", width: 6, length: 5, sqft: 30, notes: "Toilet + sink only" });
  }

  const livingSqft = round(Math.min(sqft * 0.15, 350), 0);
  const livingW = 16; const livingL = round(livingSqft / livingW, 0);
  rooms.push({ name: "Living Room", width: livingW, length: livingL, sqft: livingW * livingL, notes: "Open to dining if open plan" });

  const kitchenSqft = round(Math.min(sqft * 0.09, 200), 0);
  const kitchenW = 12; const kitchenL = round(kitchenSqft / kitchenW, 0);
  rooms.push({ name: "Kitchen", width: kitchenW, length: kitchenL, sqft: kitchenW * kitchenL, notes: "Island if >150 sq ft" });

  rooms.push({ name: "Dining Room / Eating Area", width: 12, length: 12, sqft: 144, notes: "" });
  rooms.push({ name: "Laundry / Utility Room", width: 8, length: 7, sqft: 56, notes: "W/D connections, utility sink" });

  if (hasGarage) {
    const garageType = str(answers.garageType, "2_car");
    const garageSqft = garageType.includes("3") ? 900 : garageType.includes("1") ? 400 : 600;
    const gW = garageType.includes("3") ? 36 : garageType.includes("1") ? 20 : 24;
    rooms.push({ name: "Attached Garage", width: gW, length: round(garageSqft / gW, 0), sqft: garageSqft, notes: `${garageType.replace(/_/g, " ")}` });
  }

  if (hasBasement) {
    const bsmtSqft = round(sqft / Math.max(stories, 1), 0);
    rooms.push({ name: "Basement", width: round(Math.sqrt(bsmtSqft), 0), length: round(Math.sqrt(bsmtSqft), 0), sqft: bsmtSqft, notes: "Unfinished unless specified" });
  }

  if (stories >= 2) {
    rooms.push({ name: "Upper Hall / Landing", width: 10, length: 8, sqft: 80, notes: "Stair access to upper floor" });
  }

  // Add walk-in closets for larger bedrooms
  if (bedrooms >= 3 && sqft > 1500) {
    rooms.push({ name: "Walk-In Closet (Master)", width: 7, length: 8, sqft: 56, notes: "Off master bedroom" });
  }

  return rooms;
}

// ─── Structural Summary ────────────────────────────────────────────────────────

function buildStructural(answers: ProjectAnswers, structureType: string): StructuralSection[] {
  const sqft = num(answers.squareFootage, 1500);
  const stories = num(answers.stories, 1);
  const foundationType = str(answers.foundationType, "slab");
  const roofType = str(answers.roofType, "gable");
  const roofMaterial = str(answers.roofMaterial, "asphalt_shingle");
  const climateZone = str(answers.climateZone, "mixed_humid");
  const footprint = round(sqft / Math.max(stories, 1), 0);
  const perimeter = round(Math.sqrt(footprint) * 4, 0);
  const isAgri = ["BARN", "POLE_BARN", "QUONSET_HUT"].includes(structureType);
  const isContainer = structureType === "CONTAINER_HOME";

  const sections: StructuralSection[] = [];

  sections.push({
    label: "Foundation System",
    value: labelFoundation(foundationType),
    notes: foundationType === "full_basement"
      ? "8 ft poured concrete walls, waterproofed exterior, footing drain"
      : foundationType === "slab"
      ? `4 in, 3000 PSI slab; perimeter footing 12 in wide × 12 in deep; vapor barrier`
      : foundationType === "crawl_space"
      ? "Perimeter footing + piers; min 18 in clearance; vapor barrier on ground"
      : foundationType === "pier_beam"
      ? "18 in concrete piers at 8 ft OC; grade beam or pressure-treated sill"
      : "Confirm with structural engineer for local soil conditions",
  });

  if (isContainer) {
    sections.push({
      label: "Structural System",
      value: "ISO Shipping Container Frame",
      notes: "Containers provide primary structural frame; openings require W-beam headers; PE-stamped drawings required",
    });
  } else if (isAgri) {
    sections.push({
      label: "Structural System",
      value: "Post-Frame (Pole Barn) Construction",
      notes: "Laminated posts at 8 ft OC; engineered trusses; metal or wood girts and purlins",
    });
  } else {
    sections.push({
      label: "Structural System",
      value: `${stories > 1 ? stories + "-Story " : ""}Platform Frame — 2×6 Studs @ 16 in OC`,
      notes: "Double top plate; single bottom plate; OSB sheathing; blocking at mid-height",
    });
    sections.push({
      label: "Floor System",
      value: stories > 1 ? "2×10 or 2×12 Floor Joists @ 16 in OC" : "On slab or crawl space",
      notes: stories > 1 ? `Engineered I-joists or lumber; LVL beams at bearing points; ¾ in T&G OSB subfloor` : "Per foundation type above",
    });
  }

  sections.push({
    label: "Roof Structure",
    value: `${labelRoof(roofType)} — Engineered Trusses or Rafters`,
    notes: roofType === "flat"
      ? "Structural deck; min ¼:12 slope to drain; TPO or EPDM membrane"
      : `24 in OC truss spacing; OSB sheathing; ridge vent + soffit vents; ${round(footprint * 0.1, 0)} sq ft net free area`,
  });

  sections.push({
    label: "Roof Material",
    value: labelRoofMaterial(roofMaterial),
    notes: roofMaterial.includes("metal")
      ? "50+ year lifespan; Class A fire rating; minimal maintenance"
      : roofMaterial === "asphalt_shingle"
      ? "30-year warranty; install per manufacturer (4 nails minimum); 6 in headlap"
      : "",
  });

  sections.push({
    label: "Wall Insulation",
    value: climateZone === "cold" || climateZone === "very_cold" ? "R-21 Batt or R-13+8ci" : "R-20 Batt or R-13+5ci",
    notes: `IECC compliance for ${labelClimate(climateZone)} climate`,
  });

  sections.push({
    label: "Ceiling / Attic Insulation",
    value: climateZone === "hot_humid" || climateZone === "hot_dry" ? "R-38 Blown Insulation" : "R-49 to R-60 Blown Insulation",
    notes: "Blow-in fiberglass or cellulose; air seal all penetrations before insulating",
  });

  sections.push({
    label: "Estimated Footprint",
    value: `${footprint.toLocaleString()} sq ft (${round(Math.sqrt(footprint), 0)}′ × ${round(Math.sqrt(footprint), 0)}′ approx)`,
    notes: `Perimeter ~${perimeter} lin ft; adjust for non-square floor plan`,
  });

  sections.push({
    label: "Exterior Wall Height",
    value: `${stories * 9} ft total (9 ft per floor)`,
    notes: "Standard 9 ft plate height; adjust to design",
  });

  return sections;
}

// ─── Plumbing ──────────────────────────────────────────────────────────────────

function buildPlumbing(answers: ProjectAnswers): SystemItem[] {
  const bathrooms = parseFloat(str(answers.bathrooms, "2")) || 2;
  const fullBaths = Math.floor(bathrooms);
  const halfBaths = bathrooms % 1 > 0 ? 1 : 0;
  const utilities = arr(answers.utilityConnection);
  const hvacType = str(answers.hvacType, "central_hvac");
  const sustainability = arr(answers.sustainabilityFeatures);
  const hasSolar = utilities.includes("solar") || utilities.includes("solar_offgrid") || sustainability.includes("solar_panels");

  return [
    { item: "Supply Piping", spec: "PEX-A with ProPEX fittings, ½ in and ¾ in", notes: "Manifold or home-run system; red = hot, blue = cold" },
    { item: "Drain / Waste / Vent", spec: "Schedule 40 PVC, 2 in / 3 in / 4 in", notes: "Sloped ⅛ in per ft minimum; cleanouts at all bends" },
    { item: "Toilets", spec: `WaterSense 1.28 gpf elongated — ${fullBaths + halfBaths} units`, notes: "One per full bath + powder room" },
    { item: "Tub/Shower", spec: `60 in alcove or walk-in — ${fullBaths} units`, notes: "Full baths only" },
    { item: "Lavatories", spec: `Undermount 18×21 in — ${fullBaths + halfBaths} units`, notes: "" },
    { item: "Kitchen Sink", spec: "Double bowl stainless, 33 in", notes: "" },
    { item: "Laundry Hookup", spec: "Washing machine box + standpipe, ¾ in supply", notes: "" },
    { item: "Exterior Hose Bibs", spec: "Frost-free ¾ in — 2 units (front + rear)", notes: "" },
    {
      item: "Water Heater",
      spec: hvacType === "radiant_floor"
        ? "Combi boiler (radiant + DHW combined)"
        : hasSolar
        ? "Heat pump water heater, 50 gal, 4.0+ UEF"
        : "50-gal heat pump or electric resistance water heater",
      notes: "",
    },
    ...(utilities.includes("well_water") ? [{ item: "Well Pump & Pressure Tank", spec: "Submersible pump, 40–80 PSI pressure tank", notes: "Confirm GPM with driller" }] : []),
    ...(utilities.includes("septic") ? [{ item: "Septic System", spec: `1,000–1,500 gal tank + drain field sized per bedrooms`, notes: "Perc test + engineer required" }] : []),
    ...(sustainability.includes("rainwater_collection") ? [{ item: "Rainwater Collection", spec: "1,500–5,000 gal poly tank + first-flush diverter", notes: "Confirm local code" }] : []),
  ];
}

// ─── Electrical ───────────────────────────────────────────────────────────────

function buildElectrical(answers: ProjectAnswers): SystemItem[] {
  const sqft = num(answers.squareFootage, 1500);
  const bedrooms = num(answers.bedrooms, 3);
  const stories = num(answers.stories, 1);
  const utilities = arr(answers.utilityConnection);
  const sustainability = arr(answers.sustainabilityFeatures);
  const hasSolar = utilities.includes("solar") || utilities.includes("solar_offgrid") || sustainability.includes("solar_panels");
  const hasEV = sustainability.includes("ev_charging");
  const hasBattery = sustainability.includes("battery_storage");
  const panelAmps = (sqft > 2500 || hasSolar || hasEV) ? 200 : 150;
  const lightingCircuits = Math.ceil(sqft / 500) * 2;
  const receptacleCircuits = Math.ceil(sqft / 400) * 2;
  const totalCircuits = lightingCircuits + receptacleCircuits + 6; // dedicated + HVAC

  return [
    { item: "Main Service Panel", spec: `${panelAmps}-amp, ${totalCircuits + 4}-space panel with main breaker`, notes: "200A recommended for all builds > 1,500 sq ft" },
    { item: "Lighting Circuits (15A)", spec: `${lightingCircuits} circuits — NM-B 14-2`, notes: "AFCI required in all habitable rooms (NEC 210.12)" },
    { item: "Receptacle Circuits (20A)", spec: `${receptacleCircuits} circuits — NM-B 12-2`, notes: "NEC 210.52 spacing: outlet every 12 ft on walls" },
    { item: "Kitchen Circuits", spec: "2 × 20A small appliance + 20A dishwasher + 20A disposal", notes: "GFCI required at countertop (NEC 210.8)" },
    { item: "Bathrooms", spec: `${Math.max(bedrooms, 1)} × 20A GFCI circuits`, notes: "At least 1 circuit per bath; GFCI all outlets" },
    { item: "Dryer Circuit", spec: "30A, 240V — NM-B 10-3", notes: "" },
    { item: "Range / Oven Circuit", spec: "50A, 240V — NM-B 8-3", notes: "" },
    { item: "AFCI Breakers", spec: `${bedrooms + 4} breakers`, notes: "All bedrooms + living/dining (NEC 210.12)" },
    { item: "GFCI Receptacles", spec: `${bedrooms + 6} locations`, notes: "Bathrooms, kitchen, garage, exterior (NEC 210.8)" },
    { item: "Smoke + CO Detectors", spec: `${bedrooms + stories + 1} interconnected units`, notes: "IRC R314/R315 requirements" },
    { item: "Low Voltage / Cat-6", spec: `${bedrooms + 3} data drops structured wiring`, notes: "" },
    ...(hasSolar ? [{
      item: "Solar PV System",
      spec: `${round(sqft / 100, 0)} × 400W panels (~${round(sqft / 100, 0) * 400}W system)`,
      notes: "Size by energy audit; NABCEP installer recommended",
    }] : []),
    ...(hasEV ? [{ item: "EV Charging Circuit", spec: "50A, 240V NEMA 14-50 or Level 2 EVSE", notes: "" }] : []),
    ...(hasBattery ? [{ item: "Battery Storage", spec: "10–20 kWh lithium (e.g. Tesla Powerwall)", notes: "" }] : []),
  ];
}

// ─── HVAC ──────────────────────────────────────────────────────────────────────

function buildHVAC(answers: ProjectAnswers): SystemItem[] {
  const sqft = num(answers.squareFootage, 1500);
  const bathrooms = parseFloat(str(answers.bathrooms, "2")) || 2;
  const fullBaths = Math.floor(bathrooms);
  const halfBaths = bathrooms % 1 > 0 ? 1 : 0;
  const hvacType = str(answers.hvacType, "central_hvac");
  const sustainability = arr(answers.sustainabilityFeatures);
  const tons = round(sqft / 500, 1);

  const items: SystemItem[] = [
    {
      item: "Primary HVAC System",
      spec: labelHvac(hvacType),
      notes: hvacType === "central_hvac"
        ? `${tons}-ton heat pump; 16+ SEER2; variable-speed blower`
        : hvacType === "mini_split"
        ? `${tons} tons total capacity; multi-zone; 20+ SEER2`
        : hvacType === "radiant_floor"
        ? "Hydronic boiler; PEX loops at 12 in OC; manifold per zone"
        : "",
    },
    {
      item: "Ductwork",
      spec: hvacType === "mini_split" || hvacType === "radiant_floor" || hvacType === "passive"
        ? "No ductwork required"
        : "Sheet metal trunk + branch; sealed with mastic; insulated in unconditioned spaces",
      notes: hvacType === "central_hvac" ? `~${round(sqft * 0.6, 0)} lin ft of duct` : "",
    },
    { item: "Bath Exhaust Fans", spec: `${fullBaths + halfBaths} × 110 CFM vented to exterior`, notes: "ASHRAE 62.2 requirement" },
    { item: "Kitchen Range Hood", spec: "400+ CFM, vented to exterior", notes: "" },
    {
      item: "Fresh Air Ventilation",
      spec: sustainability.includes("passive_solar_design") ? "ERV (Energy Recovery Ventilator) — required for tight buildings" : "Passive or mechanical per ASHRAE 62.2",
      notes: "Tight construction (< 3 ACH50) requires mechanical ventilation",
    },
  ];

  if (hvacType === "radiant_floor") {
    items.push({ item: "Radiant Tubing", spec: `${round(sqft, 0)} lin ft PEX @ 12 in OC loops`, notes: "Embedded in slab or stapled to subfloor" });
    items.push({ item: "Boiler", spec: "Combi boiler 80,000–120,000 BTU (heating + DHW)", notes: "Size per Manual J heat loss calculation" });
  }

  return items;
}

// ─── Material Selections ──────────────────────────────────────────────────────

function buildMaterials(answers: ProjectAnswers): MaterialItem[] {
  const budgetRange = str(answers.budgetRange, "100k_200k");
  const isHighEnd = budgetRange === "over_750k" || budgetRange === "400k_750k";
  const isMidRange = budgetRange === "200k_400k";

  return [
    { category: "Exterior Cladding", selection: labelExterior(str(answers.exteriorMaterial, "vinyl_siding")), spec: "See structural section for spec details" },
    { category: "Roof Material", selection: labelRoofMaterial(str(answers.roofMaterial, "asphalt_shingle")), spec: "See structural section for spec details" },
    {
      category: "Interior Flooring",
      selection: isHighEnd ? "Engineered Hardwood (5 in plank, site-finished)" : isMidRange ? "LVP — 6 mil wear layer, click-lock" : "LVP — 4 mil wear layer, click-lock",
      spec: "Tile in wet areas (bathrooms, mudroom)",
    },
    {
      category: "Kitchen Cabinets",
      selection: isHighEnd ? "Custom or semi-custom wood cabinets" : isMidRange ? "RTA or stock cabinets, soft-close" : "Builder-grade stock cabinets",
      spec: "Base + uppers; confirm linear footage with designer",
    },
    {
      category: "Countertops",
      selection: isHighEnd ? "Quartz or natural stone slab" : isMidRange ? "Quartz or butcher block" : "Laminate or builder-grade tile",
      spec: "",
    },
    {
      category: "Windows",
      selection: ["cold", "very_cold", "subarctic"].includes(str(answers.climateZone))
        ? "Triple-pane, Low-E, U-0.20 or better"
        : "Double-pane, Low-E, ENERGY STAR (U-0.27, SHGC 0.30)",
      spec: "All windows must meet IECC fenestration requirements",
    },
    { category: "Exterior Doors", selection: "Insulated fiberglass or steel entry doors", spec: "Min U-0.21; weatherstripped; deadbolt pre-drilled" },
    {
      category: "Interior Finishes",
      selection: isHighEnd ? "Level 5 drywall finish, 9 ft ceilings, crown molding" : "Level 4 drywall, 9 ft ceilings",
      spec: "Eggshell paint standard; primer + 2 finish coats",
    },
  ];
}

// ─── Code Compliance Checklist ────────────────────────────────────────────────

function buildCodeChecklist(answers: ProjectAnswers, structureType: string): CodeItem[] {
  const isResidential = !["BARN", "POLE_BARN", "SHED", "WORKSHOP", "GARAGE", "SILO", "QUONSET_HUT"].includes(structureType);
  const hasBasement = str(answers.foundationType).includes("basement");
  const hasSolar = arr(answers.sustainabilityFeatures).includes("solar_panels") || arr(answers.utilityConnection).includes("solar");
  const stories = num(answers.stories, 1);

  const items: CodeItem[] = [
    { code: "IRC R301", requirement: "Structural design loads (snow, wind, seismic) per local jurisdiction", status: "required" },
    { code: "IRC R302", requirement: "Fire-resistant construction at property lines < 5 ft", status: "verify" },
    { code: "IRC R303", requirement: "Natural light: habitable rooms ≥ 8% of floor area", status: "required" },
    { code: "IRC R304", requirement: "Minimum room sizes: habitable rooms ≥ 70 sq ft, 7 ft ceiling", status: "required" },
    { code: "IRC R305", requirement: "Ceiling heights: habitable rooms ≥ 7 ft", status: "required" },
    { code: "IRC R306", requirement: "Sanitation: at least 1 toilet, 1 lavatory, 1 bathtub or shower", status: isResidential ? "required" : "n_a" },
    { code: "IRC R308", requirement: "Safety glazing at hazardous locations (shower, door sidelites, stair)", status: "required" },
    { code: "IRC R310", requirement: "Emergency escape openings: bedrooms ≥ 5.7 sq ft net clear", status: isResidential ? "required" : "n_a" },
    { code: "IRC R311", requirement: "Means of egress: 36 in wide hallways, landing at all doors", status: "required" },
    { code: "IRC R312", requirement: `Guards: required at open sides > 30 in above grade${stories > 1 ? " (upper floor)" : ""}`, status: stories > 1 ? "required" : "verify" },
    { code: "IRC R313", requirement: "Automatic fire sprinkler system (some jurisdictions require for new construction)", status: "verify" },
    { code: "IRC R314", requirement: "Smoke alarms in each sleeping room + outside sleeping area + each story", status: "required" },
    { code: "IRC R315", requirement: "CO alarms: required where fuel-fired appliances or attached garage", status: "required" },
    { code: "IRC R401", requirement: "Footings bear on undisturbed soil or engineered fill; below frost depth", status: "required" },
    { code: "IRC R408", requirement: "Under-floor ventilation: crawl spaces require 1 sq ft per 150 sq ft", status: hasBasement || str(answers.foundationType) === "crawl_space" ? "required" : "n_a" },
    { code: "IECC R402", requirement: "Insulation levels meet IECC for climate zone (wall, ceiling, foundation)", status: "required" },
    { code: "IECC R403", requirement: "HVAC equipment meets minimum efficiency (SEER2, HSPF2, AFUE)", status: "required" },
    { code: "IECC R404", requirement: "Electrical power allowance per IECC Table R404.1", status: "required" },
    { code: "NEC 210.8", requirement: "GFCI protection at bathrooms, kitchens, garages, exterior, unfinished basements", status: "required" },
    { code: "NEC 210.12", requirement: "AFCI protection in all habitable rooms", status: "required" },
    { code: "NEC 230.79", requirement: "Service entrance: 100A minimum residential (200A recommended)", status: "required" },
    { code: "NFPA 13D", requirement: "Residential fire sprinkler system (if locally required)", status: "verify" },
    ...(hasSolar ? [{ code: "NEC 690", requirement: "Solar PV system installation, disconnects, and labeling", status: "required" as const }] : []),
    ...(hasBasement ? [{ code: "IRC R406", requirement: "Basement waterproofing: membrane + drainage board at below-grade walls", status: "required" as const }] : []),
    { code: "LOCAL", requirement: "Building permit required before construction begins", status: "required" },
    { code: "LOCAL", requirement: "Setback and zoning compliance (front/rear/side yard requirements)", status: "required" },
    { code: "LOCAL", requirement: "Septic/well permits if not on municipal utilities", status: arr(answers.utilityConnection).includes("septic") ? "required" : "verify" },
  ];

  return items;
}

// ─── Main Generator ────────────────────────────────────────────────────────────

export function generatePlanningReport(
  answers: ProjectAnswers,
  structureType: string,
  structureLabel: string,
  projectName: string
): PlanningReport {
  const sqft = num(answers.squareFootage, 0);
  const stories = num(answers.stories, 1);
  const zipCode = str(answers.zipCode, "");
  const state = str(answers.state, "");
  const location = zipCode || state || "Not specified";
  const budgetRange = str(answers.budgetRange, "");

  const assumptions: string[] = [
    `Total area: ${sqft > 0 ? sqft.toLocaleString() + " sq ft" : "Not specified"} across ${stories} stor${stories > 1 ? "ies" : "y"}.`,
    "Room dimensions are estimates based on total square footage and program. Confirm with architectural drawings.",
    "All quantities and specifications require review by a licensed architect and structural engineer.",
    "Code checklist is based on IRC/IECC/NEC model codes — verify adopted code cycle with local jurisdiction.",
    "Material selections reflect project answers; upgrade or value-engineer as budget dictates.",
  ];

  return {
    projectName,
    structureType,
    generatedAt: new Date().toISOString(),
    squareFootage: sqft,
    stories,
    location,
    budgetRange: budgetRange ? labelBudget(budgetRange) : "Not specified",
    rooms: buildRoomSchedule(answers, structureType),
    structural: buildStructural(answers, structureType),
    plumbing: buildPlumbing(answers),
    electrical: buildElectrical(answers),
    hvac: buildHVAC(answers),
    materials: buildMaterials(answers),
    codeChecklist: buildCodeChecklist(answers, structureType),
    assumptions,
    disclaimer:
      "This Construction Planning Report is an AI-generated preliminary planning document for informational purposes only. " +
      "It does not constitute a licensed engineering document, architectural drawing, stamped plan, or building permit submittal. " +
      "All specifications, dimensions, and code references must be reviewed and approved by a licensed architect, structural " +
      "engineer, and applicable trade professionals prior to construction. Local building codes, soil conditions, and " +
      "site-specific factors may significantly alter requirements. Buildwell LLC assumes no liability for construction " +
      "decisions made based on this document.",
  };
}
