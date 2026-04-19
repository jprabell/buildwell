import { ProjectAnswers } from "@/types";

export interface MaterialLineItem {
  division: number;
  divisionName: string;
  category: string;
  item: string;
  spec: string;
  quantity: number;
  unit: string;
  notes: string;
}

export interface MaterialCalculationResult {
  projectName: string;
  structureType: string;
  squareFootage: number;
  generatedAt: string;
  items: MaterialLineItem[];
  assumptions: string[];
  disclaimer: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function num(val: string | number | string[] | undefined, fallback = 0): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") return parseFloat(val) || fallback;
  return fallback;
}

function str(val: string | number | string[] | undefined, fallback = ""): string {
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  return fallback;
}

function arr(val: string | number | string[] | undefined): string[] {
  if (Array.isArray(val)) return val;
  return [];
}

function round(n: number, decimals = 0): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

function ceil10(n: number): number {
  return Math.ceil(n / 10) * 10;
}

// ─── Insulation R-values by climate zone (IECC) ───────────────────────────────

function wallRValue(climateZone: string): { r: number; label: string } {
  const map: Record<string, { r: number; label: string }> = {
    hot_humid:   { r: 13, label: "R-13 batt" },
    hot_dry:     { r: 13, label: "R-13 batt" },
    mixed_humid: { r: 20, label: "R-20 batt or R-13+5ci" },
    mixed_dry:   { r: 20, label: "R-20 batt or R-13+5ci" },
    cold:        { r: 21, label: "R-21 batt or R-13+8ci" },
    very_cold:   { r: 30, label: "R-30 continuous or advanced framing" },
    subarctic:   { r: 38, label: "R-38 SIP or double-wall" },
    marine:      { r: 20, label: "R-20 batt or R-13+5ci" },
  };
  return map[climateZone] ?? { r: 20, label: "R-20 batt (assumed)" };
}

function ceilingRValue(climateZone: string): { r: number; label: string } {
  const map: Record<string, { r: number; label: string }> = {
    hot_humid:   { r: 38, label: "R-38 blown" },
    hot_dry:     { r: 38, label: "R-38 blown" },
    mixed_humid: { r: 49, label: "R-49 blown" },
    mixed_dry:   { r: 49, label: "R-49 blown" },
    cold:        { r: 60, label: "R-60 blown" },
    very_cold:   { r: 60, label: "R-60 blown" },
    subarctic:   { r: 60, label: "R-60 blown" },
    marine:      { r: 49, label: "R-49 blown" },
  };
  return map[climateZone] ?? { r: 49, label: "R-49 blown (assumed)" };
}

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function estimatePerimeter(sqft: number, stories: number): number {
  // Assume roughly square footprint per story
  const footprint = sqft / Math.max(stories, 1);
  const side = Math.sqrt(footprint);
  return round(side * 4, 0);
}

function roofAreaFromPitch(footprintSqft: number, roofType: string): number {
  const pitchFactors: Record<string, number> = {
    flat: 1.02,
    shed: 1.1,
    gable: 1.25,
    hip: 1.3,
    gambrel: 1.4,
    metal_standing_seam: 1.2,
    butterfly: 1.15,
    dome: 1.57, // half-sphere approximation
  };
  return round(footprintSqft * (pitchFactors[roofType] ?? 1.25), 0);
}

// ─── Structure category detection ─────────────────────────────────────────────

type StructureCategory =
  | "residential"
  | "container"
  | "agricultural"
  | "outbuilding"
  | "dome"
  | "quonset"
  | "earthship";

function structureCategory(structureType: string): StructureCategory {
  const map: Record<string, StructureCategory> = {
    SINGLE_FAMILY_HOME: "residential",
    TINY_HOME: "residential",
    LOG_CABIN: "residential",
    A_FRAME: "residential",
    PASSIVE_SOLAR: "residential",
    BARNDOMINIUM: "residential",
    CONTAINER_HOME: "container",
    BARN: "agricultural",
    POLE_BARN: "agricultural",
    SILO: "agricultural",
    SHED: "outbuilding",
    WORKSHOP: "outbuilding",
    GARAGE: "outbuilding",
    DOME_HOME: "dome",
    QUONSET_HUT: "quonset",
    EARTHSHIP: "earthship",
  };
  return map[structureType] ?? "residential";
}

// ─── Main calculator ───────────────────────────────────────────────────────────

export function calculateMaterials(
  answers: ProjectAnswers,
  structureType: string,
  projectName: string
): MaterialCalculationResult {
  const sqft = num(answers.squareFootage, 1500);
  const stories = num(answers.stories, 1);
  const footprint = round(sqft / Math.max(stories, 1), 0);
  const perimeter = estimatePerimeter(sqft, stories);
  const wallHeight = stories > 1 ? 9 : 9; // 9 ft per floor standard
  const totalWallHeight = wallHeight * stories;
  const exteriorWallSqft = round(perimeter * totalWallHeight, 0);
  const roofSqft = roofAreaFromPitch(footprint, str(answers.roofType, "gable"));
  const climateZone = str(answers.climateZone, "mixed_humid");
  const wallInsulation = wallRValue(climateZone);
  const ceilInsulation = ceilingRValue(climateZone);
  const cat = structureCategory(structureType);

  const bedrooms = num(answers.bedrooms, 3);
  const bathrooms = parseFloat(str(answers.bathrooms, "2")) || 2;
  const utilities = arr(answers.utilityConnection);
  const sustainability = arr(answers.sustainabilityFeatures);
  const hvacType = str(answers.hvacType, "central_hvac");
  const roofMaterial = str(answers.roofMaterial, "asphalt_shingle");
  const exteriorMaterial = str(answers.exteriorMaterial, "vinyl_siding");
  const foundationType = str(answers.foundationType, "slab");
  const roofType = str(answers.roofType, "gable");

  const items: MaterialLineItem[] = [];
  const assumptions: string[] = [];

  // Helper to push items
  function add(
    division: number,
    divisionName: string,
    category: string,
    item: string,
    spec: string,
    quantity: number,
    unit: string,
    notes = ""
  ) {
    items.push({ division, divisionName, category, item, spec, quantity, unit, notes });
  }

  // ── Division 2: Site Work ────────────────────────────────────────────────────
  const excavationFactor =
    foundationType === "full_basement" || foundationType === "walkout_basement" ? 2.0
    : foundationType === "crawl_space" ? 0.5
    : 0.1;
  add(2, "Site Work", "Earthwork", "Excavation", "Machine excavation", round(footprint * excavationFactor, 0), "cu yd", `Foundation type: ${foundationType}`);
  add(2, "Site Work", "Earthwork", "Fill & Compaction", "Granular fill, compacted", round(footprint * 0.15, 0), "cu yd", "Under slab/footings");
  add(2, "Site Work", "Utilities", "Trench for Utilities", "Machine trench, 4 ft deep", round(perimeter * 0.5, 0), "lin ft", "Water, sewer, electric service");
  if (utilities.includes("septic")) {
    add(2, "Site Work", "Septic", "Septic System", "1,000–1,500 gal tank + drain field", 1, "system", "Size per bedroom count and perc test");
    assumptions.push("Septic system sized for " + bedrooms + " bedrooms; confirm with local engineer.");
  }
  if (utilities.includes("well_water")) {
    add(2, "Site Work", "Well", "Drilled Well", "6-inch cased well, up to 300 ft", 1, "each", "Depth varies by geology");
    assumptions.push("Well depth assumed 300 ft; actual depth determined by driller.");
  }
  add(2, "Site Work", "Driveway", "Gravel Driveway", "4 in compacted gravel base", round(150 * 20 * (1 / 27) * 0.5, 0), "tons", "Assumed 150 ft x 12 ft driveway");

  // ── Division 3: Concrete ─────────────────────────────────────────────────────
  if (foundationType === "slab" || foundationType === "none") {
    add(3, "Concrete", "Slab", "Concrete Slab", "4 in, 3000 PSI, wire mesh", round(footprint / 81, 1), "cu yd", "4-inch slab");
    add(3, "Concrete", "Slab", "Vapor Barrier", "10 mil poly under slab", round(footprint * 1.1, 0), "sq ft", "10% overlap");
    add(3, "Concrete", "Footings", "Perimeter Footing", "12 in wide x 12 in deep, continuous", round(perimeter * 1.2, 0), "lin ft", "Per IRC for frost depth");
    add(3, "Concrete", "Slab", "Rebar #4", "18 in grid in footings", round(perimeter * 2, 0), "lin ft", "");
  } else if (foundationType === "full_basement" || foundationType === "walkout_basement") {
    add(3, "Concrete", "Foundation Wall", "8 in Poured Concrete Wall", "3000 PSI, rebar", round(perimeter * 8, 0), "sq ft", "8-foot basement height");
    add(3, "Concrete", "Slab", "Basement Floor Slab", "4 in, 3000 PSI", round(footprint / 81, 1), "cu yd", "");
    add(3, "Concrete", "Footings", "Spread Footings", "16 in wide x 10 in deep", round(perimeter, 0), "lin ft", "");
    add(3, "Concrete", "Wall", "Waterproofing", "Membrane + drain board", round(perimeter * 8, 0), "sq ft", "Exterior face of wall");
  } else if (foundationType === "crawl_space") {
    add(3, "Concrete", "Footings", "Perimeter Footing", "16 in x 8 in continuous", round(perimeter, 0), "lin ft", "");
    add(3, "Concrete", "Piers", "Interior Piers", "12 in round poured", round(footprint / 100, 0), "each", "One per ~100 sq ft footprint");
    add(3, "Concrete", "Wall", "Crawl Space Wall", "8 in block or poured, 3 ft high", round(perimeter * 3, 0), "sq ft", "");
  } else if (foundationType === "pier_beam" || foundationType === "helical_piers") {
    add(3, "Concrete", "Piers", "Concrete Piers / Helical Piles", foundationType === "helical_piers" ? "Helical screw piles" : "Poured concrete piers", round(footprint / 64, 0), "each", "Grid spacing ~8 ft OC");
  }

  // ── Division 6: Wood Framing ──────────────────────────────────────────────────
  if (cat === "residential" || cat === "outbuilding" || cat === "earthship") {
    // Stud walls: 16 in OC = 0.75 studs per linear ft + top/bottom plates
    const studCount = round(perimeter * stories * 0.75 + perimeter * stories * 2 * 0.33, 0); // studs + plates
    const plateLf = round(perimeter * stories * 3, 0); // 3 plates (2 bottom, 1 top min)
    add(6, "Wood Framing", "Exterior Walls", "2x6 Studs, 16 in OC", "Douglas Fir #2 or better", studCount, "each", `${sqft} sq ft building, ${stories} stor${stories > 1 ? "ies" : "y"}`);
    add(6, "Wood Framing", "Exterior Walls", "2x6 Top/Bottom Plates", "Douglas Fir #2", plateLf, "lin ft", "Double top plate, single bottom");
    add(6, "Wood Framing", "Interior Walls", "2x4 Studs, 16 in OC", "Interior partitions", round(sqft * 0.4, 0), "each", "Estimated interior wall linear footage");
    add(6, "Wood Framing", "Interior Walls", "2x4 Plates (Interior)", "Interior partition plates", round(sqft * 0.6, 0), "lin ft", "");
    add(6, "Wood Framing", "Floor System", "Floor Joists", "2x10 or 2x12, 16 in OC", round(footprint / 16 * 1.1, 0), "lin ft", "Sized per span; engineer to confirm");
    add(6, "Wood Framing", "Floor System", "Rim Joists", "2x10", round(perimeter * 2, 0), "lin ft", "Double rim");
    add(6, "Wood Framing", "Floor System", "Subfloor", '3/4 in T&G OSB', round(footprint * 1.05, 0), "sq ft", "5% waste");
    // Roof framing
    if (roofType !== "flat") {
      add(6, "Wood Framing", "Roof", "Roof Trusses or Rafters", "Engineered trusses or 2x10 rafters, 24 in OC", round(footprint / 2 + 5, 0), "each", "Confirm with truss engineer");
      add(6, "Wood Framing", "Roof", "Ridge Board", '2x12 ridge, LVL', round(Math.sqrt(footprint) * 1.05, 0), "lin ft", "");
      add(6, "Wood Framing", "Roof", "Roof Sheathing", '7/16 in OSB', round(roofSqft * 1.1, 0), "sq ft", "10% waste + overhang");
    }
    add(6, "Wood Framing", "Beams", "LVL Beams", "3.5 x 11.25 in or per engineer", round(perimeter * 0.15, 0), "lin ft", "Header beams over openings");
    add(6, "Wood Framing", "Sheathing", "Exterior Wall Sheathing", '7/16 in OSB', round(exteriorWallSqft * 1.05, 0), "sq ft", "5% waste");
  }

  if (cat === "agricultural") {
    const clearSpan = str(answers.clearSpanWidth, "up_to_30");
    const spanFt = clearSpan === "over_80" ? 90 : clearSpan === "50_to_80" ? 65 : clearSpan === "30_to_50" ? 40 : 28;
    add(6, "Wood Framing", "Post Frame", "Laminated Posts (6x6)", "Southern Yellow Pine, preservative treated", round(perimeter / 8, 0), "each", "Posts at 8 ft OC");
    add(6, "Wood Framing", "Post Frame", "Girts (2x6)", "Wall girts, horizontal", round(perimeter * stories * 3, 0), "lin ft", "3 rows per story height");
    add(6, "Wood Framing", "Post Frame", "Purlins (2x4)", "Roof purlins, 2 ft OC", round(roofSqft / 2, 0), "lin ft", `${spanFt}-ft clear span`);
    add(6, "Wood Framing", "Post Frame", "Trusses", "Engineered roof trusses", round(footprint / Math.sqrt(footprint) / 4, 0), "each", "4 ft OC spacing");
  }

  if (cat === "container") {
    const containerCount = num(answers.containerCount, 2);
    const containerSize = str(answers.containerSize, "40ft");
    const cLength = containerSize === "20ft" ? 20 : 40;
    add(6, "Wood Framing", "Container Framing", "ISO Shipping Containers", `${containerSize} standard containers`, Math.ceil(containerCount), "each", "Structurally sound, inspect before purchase");
    add(6, "Wood Framing", "Container Framing", "Steel Header Beams", "W6x12 or W8x18 over openings", round(containerCount * 2, 0), "each", "Required for cut openings");
    add(6, "Wood Framing", "Interior", "Interior Furring", "2x4 furring walls, 16 in OC", round(sqft * 0.6, 0), "lin ft", "For insulation and drywall");
    add(6, "Wood Framing", "Roof", "Roof Framing (if added)", "2x8 rafters or light steel, 16 in OC", round(footprint / 16, 0), "each", "For pitched roof overlay");
    assumptions.push(`Container home: ${Math.ceil(containerCount)} x ${containerSize} containers assumed.`);
  }

  if (cat === "quonset") {
    add(6, "Wood Framing", "Quonset", "Steel Arch Panels", "22 ga corrugated galvanized steel", round(roofSqft * 1.1, 0), "sq ft", "Prefab arch kit");
    add(6, "Wood Framing", "Quonset", "End Walls", "Steel stud framed end walls", round(sqft / Math.sqrt(footprint) * 2 * 10, 0), "sq ft", "Both end walls");
    add(6, "Wood Framing", "Quonset", "Anchor Bolts", "5/8 in x 12 in", round(perimeter / 2, 0), "each", "At base plates per arch");
    assumptions.push("Quonset: prefab arch kit system assumed; spans up to 80 ft available.");
  }

  if (cat === "dome") {
    add(6, "Wood Framing", "Dome", "Geodesic Struts", "Steel or aluminum geodesic hub system", round(sqft * 0.08, 0), "each", "Hub-and-strut system");
    add(6, "Wood Framing", "Dome", "Dome Panels", "SIP panels curved or flat triangular", round(roofSqft * 1.15, 0), "sq ft", "15% waste for cutting");
    assumptions.push("Geodesic dome: prefab kit system recommended. Confirm diameter and frequency class.");
  }

  // ── Division 7: Thermal & Moisture Protection ─────────────────────────────────
  if (cat !== "quonset" && cat !== "container") {
    add(7, "Thermal & Moisture", "Insulation", "Wall Batt Insulation", wallInsulation.label, round(exteriorWallSqft, 0), "sq ft", `Climate zone: ${climateZone}`);
    add(7, "Thermal & Moisture", "Insulation", "Ceiling Insulation", ceilInsulation.label, round(footprint, 0), "sq ft", `R-${ceilInsulation.r} target`);
    if (foundationType === "crawl_space") {
      add(7, "Thermal & Moisture", "Insulation", "Floor Insulation", "R-30 batt between joists", round(footprint, 0), "sq ft", "");
    }
  }

  if (cat === "container") {
    const hasSF = sustainability.includes("spray_foam_insulation");
    add(7, "Thermal & Moisture", "Insulation", hasSF ? "Closed-Cell Spray Foam" : "Rigid Foam + Batt", hasSF ? "2 in closed-cell (R-13) + 2 in rigid board" : "2 in rigid board + R-13 batt", round(exteriorWallSqft + footprint, 0), "sq ft", "Interior to avoid condensation on steel");
  }

  if (sustainability.includes("spray_foam_insulation") && cat !== "container") {
    add(7, "Thermal & Moisture", "Insulation", "Spray Foam Upgrade", "2 in closed-cell walls, 4 in roof", round(exteriorWallSqft + roofSqft, 0), "sq ft", "Replaces batt; air barrier included");
  }

  if (sustainability.includes("sip_panels")) {
    add(7, "Thermal & Moisture", "Insulation", "SIP Panels (Walls)", "4.5 in SIP, R-21 (walls)", round(exteriorWallSqft, 0), "sq ft", "Replaces studs + batt");
    add(7, "Thermal & Moisture", "Insulation", "SIP Panels (Roof)", "6.5 in SIP, R-30 (roof)", round(roofSqft, 0), "sq ft", "");
  }

  add(7, "Thermal & Moisture", "Air Barrier", "House Wrap", "Tyvek HomeWrap or equiv.", round(exteriorWallSqft * 1.1, 0), "sq ft", "10% overlap");
  add(7, "Thermal & Moisture", "Roofing", "Roofing Material", roofMaterialSpec(roofMaterial), round(roofSqft / 100, 1), "squares", `1 square = 100 sq ft; ${roofSqft} sq ft total`);
  add(7, "Thermal & Moisture", "Roofing", "Roofing Underlayment", "30 lb felt or synthetic", round(roofSqft * 1.1, 0), "sq ft", "");
  add(7, "Thermal & Moisture", "Roofing", "Ice & Water Shield", "First 3 ft from eave + valleys", round(perimeter * 0.25 * 3, 0), "sq ft", "IRC requirement in cold zones");
  add(7, "Thermal & Moisture", "Roofing", "Drip Edge", "Aluminum, 1.5 in face", round(perimeter * 2.2, 0), "lin ft", "Eaves and rakes");
  add(7, "Thermal & Moisture", "Roofing", "Roof Ventilation", "Ridge vent + soffit baffles", round(Math.sqrt(footprint) * 1.05, 0), "lin ft", "1:150 net free area ratio");
  add(7, "Thermal & Moisture", "Waterproofing", "Caulk & Sealant", "Silicone/polyurethane tubes", round(sqft / 100, 0), "tubes", "Windows, penetrations, transitions");
  if (foundationType === "full_basement" || foundationType === "walkout_basement") {
    add(7, "Thermal & Moisture", "Waterproofing", "Foundation Waterproofing", "Rubber membrane + drain board", round(perimeter * 8, 0), "sq ft", "Exterior below-grade walls");
    add(7, "Thermal & Moisture", "Drainage", "French Drain", "4 in perforated pipe + fabric sock", round(perimeter + 10, 0), "lin ft", "Footing drain to daylight");
  }

  if (sustainability.includes("green_roof")) {
    add(7, "Thermal & Moisture", "Green Roof", "Green Roof Assembly", "Root barrier, drainage mat, growing media, plants", round(footprint * 0.3, 0), "sq ft", "30% of roof assumed as green roof");
  }

  // ── Division 8: Openings (Doors & Windows) ───────────────────────────────────
  const windowCount = windowEstimate(sqft, bedrooms, stories, structureType);
  const doorCount = doorEstimate(sqft, bedrooms, cat);
  add(8, "Openings", "Windows", "Double-Hung Windows", windowSpec(climateZone), windowCount, "each", `${sqft} sq ft, ${bedrooms} BR — adjust to taste`);
  add(8, "Openings", "Windows", "Window Flashing Tape", "Self-adhering flashing, 6 in", round(windowCount * 16, 0), "lin ft", "All four sides per window");
  add(8, "Openings", "Exterior Doors", "Exterior Entry Door", "Fiberglass or steel, pre-hung, w/ frame", Math.max(doorCount.exterior, 1), "each", "Front + rear minimum");
  add(8, "Openings", "Exterior Doors", "Patio/Sliding Door", "6 ft or 8 ft slider or French", doorCount.patio, "each", "Per bedroom + living area");
  add(8, "Openings", "Interior Doors", "Interior Passage Doors", "Hollow-core, pre-hung, 2/8 x 6/8", doorCount.interior, "each", `~1 per room`);
  add(8, "Openings", "Garage", "Garage Door", "16x8 insulated overhead door w/ opener", num(answers.garageType?.toString()?.includes("none") ? "0" : "1"), "each", "");
  assumptions.push(`Windows: ${windowCount} units estimated. Adjust to architectural design.`);

  // ── Division 9: Finishes ─────────────────────────────────────────────────────
  const interiorWallSqft = round(sqft * 2.8, 0); // walls + ceiling approx
  add(9, "Finishes", "Drywall", "5/8 in Type X Drywall", "Ceilings and walls", round(interiorWallSqft / 32, 0), "sheets", `${interiorWallSqft} sq ft total (32 sq ft/sheet)`);
  add(9, "Finishes", "Drywall", "Joint Compound", "All-purpose, buckets", round(interiorWallSqft / 400, 1), "buckets", "1 bucket per ~400 sq ft");
  add(9, "Finishes", "Drywall", "Drywall Tape", "Paper tape", round(interiorWallSqft / 300, 0), "rolls", "");
  add(9, "Finishes", "Drywall", "Drywall Screws", "1-5/8 in coarse thread", round(interiorWallSqft / 4, 0), "each", "~1 screw per 4 sq ft");
  add(9, "Finishes", "Paint", "Interior Paint", "2 coats (primer + finish)", round(interiorWallSqft * 2 / 350, 1), "gallons", "350 sq ft/gal per coat");
  add(9, "Finishes", "Paint", "Exterior Paint or Primer", "2 coats, latex exterior", round(exteriorWallSqft * 2 / 350, 1), "gallons", "If applicable to exterior material");
  add(9, "Finishes", "Flooring", "Flooring — Living Areas", flooringSpec(answers), round(sqft * 0.65, 0), "sq ft", "65% of total sq ft for living");
  add(9, "Finishes", "Flooring", "Tile — Bathrooms", "12x24 porcelain tile", round(bathrooms * 60, 0), "sq ft", "~60 sq ft per bath");
  add(9, "Finishes", "Flooring", "Flooring Underlayment", "6 mil poly + foam pad", round(sqft * 0.65, 0), "sq ft", "");
  add(9, "Finishes", "Trim", "Baseboard Trim", "3.5 in MDF, painted", round(sqft * 0.8, 0), "lin ft", "~0.8 lf per sq ft");
  add(9, "Finishes", "Trim", "Door & Window Casing", "2.5 in MDF casing", round((windowCount + doorCount.exterior + doorCount.interior) * 20, 0), "lin ft", "~20 lf per opening");
  add(9, "Finishes", "Cabinets", "Kitchen Cabinets", "Base + upper, 10 ft run", round(sqft / 150, 1), "lin ft", "1 lf per 150 sq ft of house");
  add(9, "Finishes", "Countertops", "Countertops", "Laminate standard or quartz", round(sqft / 150 * 2, 0), "lin ft", "");
  add(9, "Finishes", "Exterior", "Exterior Cladding", exteriorCladdingSpec(exteriorMaterial), round(exteriorWallSqft * 1.1, 0), "sq ft", "10% waste");

  // ── Division 15: Plumbing ─────────────────────────────────────────────────────
  const fullBaths = Math.floor(bathrooms);
  const halfBaths = bathrooms % 1 > 0 ? 1 : 0;
  add(15, "Plumbing", "Supply", "Supply Pipe — PEX", "1/2 in and 3/4 in PEX-A with fittings", round(sqft * 1.2, 0), "lin ft", "Manifold or home run system");
  add(15, "Plumbing", "Drain", "DWV Pipe — ABS/PVC", "2 in, 3 in, 4 in schedule 40", round(sqft * 0.7, 0), "lin ft", "Sloped drain runs");
  add(15, "Plumbing", "Fixtures", "Toilets", "1.28 gpf elongated", fullBaths + halfBaths, "each", "");
  add(15, "Plumbing", "Fixtures", "Tub/Shower Combos", "60 in alcove tub or shower pan", fullBaths, "each", "");
  add(15, "Plumbing", "Fixtures", "Lavatories (Bath Sinks)", "Undermount, 18x21 in", fullBaths + halfBaths, "each", "");
  add(15, "Plumbing", "Fixtures", "Kitchen Sink", "Double bowl stainless, 33 in", 1, "each", "");
  add(15, "Plumbing", "Fixtures", "Laundry Hookup", "Washer box + standpipe", 1, "each", "");
  add(15, "Plumbing", "Fixtures", "Outdoor Hose Bib", "3/4 in frost-free", 2, "each", "Front and rear");
  add(15, "Plumbing", "Water Heater", "Water Heater", waterHeaterSpec(hvacType, sustainability), 1, "each", "");
  if (utilities.includes("rainwater_collection") || sustainability.includes("rainwater_collection")) {
    add(15, "Plumbing", "Rainwater", "Rainwater Collection Tank", "1,500–5,000 gal polyethylene", 1, "each", "Size per roof area and rainfall");
    assumptions.push("Rainwater collection: confirm legality and sizing with local authority.");
  }

  // ── Division 16: Electrical ──────────────────────────────────────────────────
  const hasSolar = utilities.includes("solar") || utilities.includes("solar_offgrid");
  const hasEV = sustainability.includes("ev_charging");
  const hasBattery = sustainability.includes("battery_storage");
  const circuitCount = electricalCircuits(sqft, bedrooms, kitchenCircuits(answers), hvacType, hasSolar, hasEV);
  add(16, "Electrical", "Service", "Main Panel", `${circuitCount.panelAmps}-amp service entrance panel`, 1, "each", `${circuitCount.total} circuits estimated`);
  add(16, "Electrical", "Service", "Service Entrance Cable", "SE cable or conduit from meter", 1, "set", "Utility to panel; length varies");
  add(16, "Electrical", "Wiring", "NM-B Wire — 14-2", "General lighting circuits, 15A", round(sqft * 1.5, 0), "lin ft", "");
  add(16, "Electrical", "Wiring", "NM-B Wire — 12-2", "General receptacle circuits, 20A", round(sqft * 1.2, 0), "lin ft", "");
  add(16, "Electrical", "Wiring", "NM-B Wire — 12-3", "MWBC + switch legs", round(sqft * 0.4, 0), "lin ft", "");
  add(16, "Electrical", "Wiring", "10-2 or 8-2 for Appliances", "Dryer, range, AC, etc.", round(sqft * 0.15, 0), "lin ft", "");
  add(16, "Electrical", "Devices", "Receptacles — Duplex", "20A tamper-resistant", round(sqft / 12, 0), "each", "NEC 210.52 spacing");
  add(16, "Electrical", "Devices", "GFCI Receptacles", "Kitchen, bath, garage, exterior", round(bedrooms + bathrooms + 4, 0), "each", "");
  add(16, "Electrical", "Devices", "AFCI Breakers", "All bedroom and living circuits", round(bedrooms + 4, 0), "each", "NEC 210.12 requirement");
  add(16, "Electrical", "Devices", "Light Fixtures", "Rough count, fixtures TBD by owner", round(sqft / 60, 0), "each", "~1 per 60 sq ft");
  add(16, "Electrical", "Devices", "Smoke / CO Detectors", "Interconnected", round(bedrooms + stories + 1, 0), "each", "IRC R314/R315");
  add(16, "Electrical", "Low Voltage", "Data/Cat-6 Wiring", "Structured wiring to rooms", round(bedrooms + 3, 0), "drops", "");
  if (hasSolar) {
    const panelCount = round(sqft / 100, 0); // rough estimate
    add(16, "Electrical", "Solar", "PV Solar Panels", "400W monocrystalline panels", panelCount, "each", `~${panelCount * 400}W system; size by energy audit`);
    add(16, "Electrical", "Solar", "Solar Inverter", "String or micro-inverters", 1, "system", "");
    add(16, "Electrical", "Solar", "Conduit — Solar Runs", "1 in EMT from roof to panel", round(stories * 15 + 20, 0), "lin ft", "");
    assumptions.push(`Solar: ${panelCount} x 400W panels estimated. Size confirmed by energy audit.`);
  }
  if (hasEV) {
    add(16, "Electrical", "EV Charging", "EV Charging Outlet", "NEMA 14-50 or Level 2 EVSE, 50A circuit", 1, "each", "240V 50A circuit from panel");
  }
  if (hasBattery) {
    add(16, "Electrical", "Battery Storage", "Battery Storage System", "10–20 kWh lithium system", 1, "system", "e.g., Tesla Powerwall or Enphase IQ Battery");
  }

  // ── HVAC ──────────────────────────────────────────────────────────────────────
  const hvacDiv = 15; // often Division 15 or 23; using 15 for simplicity
  add(hvacDiv, "HVAC", "Ductwork", "Sheet Metal Ductwork", hvacDuctSpec(hvacType), round(sqft * 0.6, 0), "lin ft", "Trunk and branch system");
  add(hvacDiv, "HVAC", "Equipment", "HVAC Equipment", hvacEquipmentSpec(hvacType, sqft), 1, "system", `~${round(sqft / 500, 1)} tons cooling`);
  add(hvacDiv, "HVAC", "Ventilation", "Bath Exhaust Fans", "110 CFM", fullBaths + halfBaths, "each", "");
  add(hvacDiv, "HVAC", "Ventilation", "Kitchen Range Hood", "400 CFM, vented exterior", 1, "each", "");
  add(hvacDiv, "HVAC", "Ventilation", "ERV / HRV Unit", "Energy recovery ventilator", sustainability.includes("passive_solar_design") ? 1 : 0, "each", "Tight buildings require mechanical fresh air");
  if (hvacType === "radiant_floor") {
    add(hvacDiv, "HVAC", "Radiant", "PEX Radiant Tubing", "1/2 in PEX, 12 in OC loops", round(footprint * 1.0, 0), "lin ft", "Full floor coverage");
    add(hvacDiv, "HVAC", "Radiant", "Radiant Manifold", "Stainless manifold, valves", round(sqft / 600, 0), "each", "One manifold per zone");
    add(hvacDiv, "HVAC", "Radiant", "Boiler / Water Heater", "Combi boiler for radiant + DHW", 1, "each", "Size per BTU loss calc");
  }

  // ── Sustainability add-ons ────────────────────────────────────────────────────
  if (sustainability.includes("greywater_recycling")) {
    add(15, "Plumbing", "Greywater", "Greywater Recycling System", "Laundry-to-landscape or 3-tank system", 1, "system", "Confirm local code compliance");
  }
  if (sustainability.includes("passive_solar_design") && cat === "residential") {
    add(8, "Openings", "Windows", "South-Facing High-Solar-Gain Windows", "SHGC ≥ 0.4, Low-E, triple pane", round(windowCount * 0.4, 0), "each", "40% of windows oriented south for passive gain");
    assumptions.push("Passive solar: south-facing glass optimized. Thermal mass (concrete or tile) recommended.");
  }
  if (cat === "earthship") {
    add(3, "Concrete", "Earthship", "Rammed Earth Tires", "Recycled automobile tires, rammed with earth", round(sqft * 0.5, 0), "each", "~2 tires per sq ft of wall");
    add(7, "Thermal & Moisture", "Earthship", "Earthen Plaster", "Adobe/earthen plaster, 1.5 in", round(exteriorWallSqft * 0.7, 0), "sq ft", "Exterior and interior face");
    assumptions.push("Earthship: tire-rammed earth walls assumed. Confirm local building code acceptance.");
  }

  // ── Misc Fasteners & Hardware ─────────────────────────────────────────────────
  add(6, "Wood Framing", "Hardware", "Framing Hardware", "Joist hangers, hurricane ties, hold-downs", round(sqft / 50, 0), "each", "Approximate count");
  add(6, "Wood Framing", "Hardware", "Structural Screws / Bolts", "Ledger-LOK, through-bolts, lag screws", round(sqft / 30, 0), "each", "");
  add(6, "Wood Framing", "Hardware", "Framing Nails", "16d sinker nails", round(sqft / 5, 0), "each", "");

  // Sort by division then category
  items.sort((a, b) => a.division - b.division || a.category.localeCompare(b.category));

  // Core assumptions always included
  assumptions.unshift(
    `Total conditioned area: ${sqft.toLocaleString()} sq ft across ${stories} stor${stories > 1 ? "ies" : "y"}.`,
    `Estimated footprint: ${footprint.toLocaleString()} sq ft; exterior perimeter: ~${perimeter} lin ft.`,
    `Climate zone: ${climateZone} — insulation values follow IECC requirements.`,
    `Foundation type: ${foundationType}.`,
    "Quantities include standard waste factors. Verify with structural and MEP engineers before procurement.",
    "Pricing not included — obtain current quotes from local suppliers and contractors."
  );

  return {
    projectName,
    structureType,
    squareFootage: sqft,
    generatedAt: new Date().toISOString(),
    items,
    assumptions,
    disclaimer:
      "This material list is an AI-generated preliminary estimate for planning purposes only. " +
      "It is not a licensed engineering document, stamped plan, or building permit submittal. " +
      "All quantities, specifications, and material selections must be reviewed and approved by a " +
      "licensed architect, structural engineer, and applicable trade professionals before construction. " +
      "Local codes, soil conditions, and site-specific factors may significantly alter requirements. " +
      "Buildwell LLC assumes no liability for construction decisions made based on this document.",
  };
}

// ─── Spec helpers ──────────────────────────────────────────────────────────────

function roofMaterialSpec(mat: string): string {
  const m: Record<string, string> = {
    asphalt_shingle: "30-yr architectural asphalt shingle",
    metal_panel: "29 ga corrugated metal panel",
    standing_seam_metal: "Snap-lock standing seam metal",
    metal_shingle: "Stone-coated steel shingle",
    wood_shake: "Cedar shake, Class A treated",
    clay_tile: "Interlocking clay tile",
    concrete_tile: "Concrete barrel tile",
    tpo_membrane: "60 mil TPO membrane, mechanically attached",
    epdm: "60 mil EPDM, fully adhered",
    green_roof: "TPO base + growing media assembly",
  };
  return m[mat] ?? "Asphalt shingle, 30-yr architectural";
}

function exteriorCladdingSpec(mat: string): string {
  const m: Record<string, string> = {
    vinyl_siding: "Vinyl lap siding, 0.44 in, insulated back",
    fiber_cement: "Fiber cement lap siding, 7.25 in",
    wood_siding: "Cedar bevel siding, 1x6",
    brick: "Modular brick veneer + ties + mortar",
    stone: "Cultured stone or natural stone veneer",
    stucco: "3-coat stucco system (scratch, brown, finish)",
    metal_panel: "Steel or aluminum metal panel",
    log: "8-10 in round or D-log, kiln-dried",
    corten_steel: "COR-TEN weathering steel panels",
    shipping_container: "Container steel (existing skin) + paint",
    earth: "Rammed earth or adobe block",
  };
  return m[mat] ?? "Fiber cement lap siding";
}

function flooringSpec(answers: ProjectAnswers): string {
  const budget = str(answers.budgetRange, "100k_200k");
  if (budget === "over_750k" || budget === "400k_750k") return "Engineered hardwood, 5 in plank, site finished";
  if (budget === "200k_400k") return "LVP (luxury vinyl plank), 6 mil wear layer";
  return "LVP (luxury vinyl plank), 4 mil wear layer, click-lock";
}

function windowEstimate(sqft: number, bedrooms: number, stories: number, structureType: string): number {
  if (structureType === "SHED") return 2;
  if (structureType === "GARAGE") return 2;
  if (structureType === "BARN" || structureType === "POLE_BARN") return 4;
  return Math.max(round(sqft / 100 + bedrooms * 1.5, 0), 4);
}

function doorEstimate(sqft: number, bedrooms: number, cat: StructureCategory) {
  if (cat === "outbuilding") return { exterior: 1, patio: 0, interior: 1 };
  if (cat === "agricultural") return { exterior: 2, patio: 0, interior: 0 };
  return {
    exterior: 2,
    patio: Math.max(round(bedrooms / 2, 0), 1),
    interior: bedrooms + 3,
  };
}

function waterHeaterSpec(hvacType: string, sustainability: string[]): string {
  if (hvacType === "radiant_floor") return "Combi boiler (radiant + DHW), see HVAC";
  if (sustainability.includes("solar_panels")) return "Heat pump water heater, 50 gal (pairs with solar)";
  return "50-gal electric resistance or heat pump water heater";
}

function kitchenCircuits(answers: ProjectAnswers): number {
  return 4; // small appliance, dishwasher, disposal, refrigerator
}

function electricalCircuits(
  sqft: number,
  bedrooms: number,
  kitchenExtra: number,
  hvacType: string,
  hasSolar: boolean,
  hasEV: boolean
) {
  const lighting = Math.ceil(sqft / 500) * 2;
  const receptacles = Math.ceil(sqft / 400) * 2;
  const hvacCircuits = hvacType === "mini_split" ? bedrooms + 1 : 2;
  const dedicated = kitchenExtra + (hasEV ? 1 : 0) + 2; // dryer + range
  const solar = hasSolar ? 2 : 0;
  const total = lighting + receptacles + hvacCircuits + dedicated + solar + 4; // 4 misc
  const panelAmps = total > 40 ? 200 : 150;
  return { total, panelAmps };
}

function hvacDuctSpec(hvacType: string): string {
  if (hvacType === "mini_split") return "Line sets only (refrigerant + control) — no ductwork";
  if (hvacType === "radiant_floor") return "PEX tubing loops — no ductwork";
  if (hvacType === "passive") return "No mechanical ductwork";
  return "Round and rectangular sheet metal, sealed with mastic";
}

function hvacEquipmentSpec(hvacType: string, sqft: number): string {
  const tons = round(sqft / 500, 1);
  const specs: Record<string, string> = {
    central_hvac: `Central split system, ${tons} tons, 16+ SEER2 heat pump`,
    mini_split: `Multi-zone mini-split, ${tons} tons total, 20+ SEER2`,
    radiant_floor: "Hydronic radiant system; boiler separate line item",
    wood_stove: "EPA-certified wood stove + chimney system",
    geothermal: `Geothermal heat pump, ${tons} tons, COP 4.0+; ground loop separate`,
    passive: "Passive design — no mechanical cooling/heating system",
    propane_furnace: `Propane forced-air furnace, 96% AFUE + AC coil, ${tons} tons`,
  };
  return specs[hvacType] ?? `Central split system, ${tons} tons`;
}
