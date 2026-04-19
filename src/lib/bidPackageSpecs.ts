// Per-trade material specifications for the Contractor Bid Package.
// Each function returns bullet strings a contractor needs to accurately bid the work.

import { ProjectAnswers } from "@/types";

const BARNDO_TYPES = new Set(["BARNDOMINIUM", "BARN", "POLE_BARN"]);

function n(val: unknown, def = 0): number {
  return parseFloat(String(val ?? def)) || def;
}
function s(val: unknown, def = ""): string {
  return String(val ?? def).trim() || def;
}

type SpecFn = (a: ProjectAnswers, st: string) => string[];

const SPEC_MAP: Record<string, SpecFn> = {

  "Site Prep / Excavation": (a) => {
    const sqft = n(a.squareFootage, 1500);
    const stories = n(a.stories, 1);
    const foundation = s(a.foundation);
    const footprint = sqft / stories;
    const W = Math.round(Math.sqrt(footprint * 1.4));
    const H = Math.round(Math.sqrt(footprint / 1.4));
    return [
      `Building envelope: approximately ${W}′ × ${H}′ footprint`,
      foundation === "basement"
        ? `Excavate full basement: ${W}′ × ${H}′ approx., 8′ depth min — confirm with soils report`
        : "Grade building pad: cut/fill to level, compact to 95% Proctor density, 12″ depth",
      "Positive drainage: min 5% slope away from foundation for first 10′ on all sides",
      "Access drive rough-in: 12′ wide minimum, compacted gravel base course",
      "Erosion control: silt fence on downhill sides, inlet protection per local stormwater permit",
      "Stake building corners from survey — provide survey benchmark to framing contractor",
    ];
  },

  "Site Prep / Grading": (a) => {
    const sqft = n(a.squareFootage, 2400);
    const W = Math.round(Math.sqrt(sqft * 1.4));
    const H = Math.round(Math.sqrt(sqft / 1.4));
    return [
      `Building pad: ${W}′ × ${H}′ footprint, graded to level, compacted to 95% Proctor`,
      "Access road: 14′ wide, 8″ compacted 21AA limestone base or equivalent",
      "Positive drainage: 2% minimum slope across pad, 5% away from building",
      "Drainage swales: install per site plan if lot drains toward structure",
      "Silt fence: perimeter on downhill sides; install before any earthwork",
      "Remove and dispose of all stumps, debris, and topsoil from building envelope",
    ];
  },

  "Foundation / Concrete": (a, st) => {
    const sqft = n(a.squareFootage, 1500);
    const stories = n(a.stories, 1);
    const footprint = sqft / stories;
    const W = Math.round(Math.sqrt(footprint * 1.4));
    const H = Math.round(Math.sqrt(footprint / 1.4));
    const foundation = s(a.foundation, "slab");
    const isBarndo = BARNDO_TYPES.has(st);

    if (isBarndo) {
      return [
        `Slab-on-grade: ${W}′ × ${H}′ approx. (${Math.round(footprint).toLocaleString()} sqft)`,
        "Concrete mix: 4,000 PSI minimum, fiber-reinforced, 5–6 slump",
        "#4 rebar @ 18″ OC both ways in living area; #4 @ 24″ OC in shop",
        "6-mil poly vapor barrier, lapped 12″ at seams, taped at all penetrations",
        "Thickened edge (turndown): 16″ wide × 16″ deep, (2) #4 rebar continuous",
        "Interior grade beam at all post locations: 12″ wide × 16″ deep, #4 rebar",
        "Smooth trowel finish — living area; broom finish — shop/barn area",
        "Control joints saw-cut within 24 hrs; max 12′ × 12′ panel",
      ];
    }
    if (foundation === "basement") {
      return [
        `Footings: 24″ wide × 10″ deep, (2) #4 rebar continuous, 3,000 PSI`,
        `Basement walls: 8″ poured concrete, #4 @ 12″ OC vertical, 3,000 PSI — approx. ${(W + H) * 2}′ lineal`,
        "Dampproofing: 2-coat asphalt emulsion on exterior of all below-grade walls",
        "Perimeter drain: 4″ perforated pipe in washed gravel at footing, outlet to daylight or sump",
        "Floor slab: 4″, #4 rebar @ 18″ OC or 6×6 W2.9/W2.9 mesh, vapor barrier below, broom finish",
        "Anchor bolts: ½″ × 10″ @ 6′ OC, within 12″ of each corner, 2-bolt minimum each plate",
        "Window wells: where egress windows planned; 30″ min clear width, gravel base",
      ];
    }
    if (foundation === "crawl") {
      return [
        `Footings: 16″ wide × 8″ deep, (2) #4 rebar continuous, 3,000 PSI`,
        `Stem walls: 8″ block or poured concrete to 18″ min above finished grade — approx. ${(W + H) * 2}′`,
        "Perimeter insulation: 2″ rigid XPS on interior face of stem wall",
        "Vapor barrier: 6-mil poly on crawl floor, lapped and taped, 12″ up walls",
        "Crawl access: min 18″ × 24″ access hatch; 18″ clearance below joists at all points",
        "Anchor bolts: ½″ × 10″ @ 6′ OC, within 12″ of each corner",
        "Venting or conditioned crawl: per code and owner preference — note approach in bid",
      ];
    }
    return [
      `Footings: 16″ wide × 8″ deep, (2) #4 rebar continuous, 3,000 PSI — approx. ${(W + H) * 2}′ lineal`,
      `Slab: 4″ minimum, #4 rebar @ 18″ OC both ways, 3,000 PSI — ${Math.round(footprint).toLocaleString()} sqft`,
      "6-mil poly vapor barrier below slab; lap 12″ at all seams, tape at penetrations",
      "Exterior perimeter: 2″ XPS rigid foam insulation at edge (thermal break)",
      "Anchor bolts: ½″ × 10″ @ 6′ OC, within 12″ of corners, 2-bolt minimum per plate section",
      "Smooth trowel finish; control joints saw-cut at max 15′ OC both directions",
      "All concrete per ACI 318; provide mix design and test cylinders to building official",
    ];
  },

  "Foundation / Concrete Piers": (a) => {
    const sqft = n(a.squareFootage, 2400);
    const W = Math.round(Math.sqrt(sqft * 1.4));
    const H = Math.round(Math.sqrt(sqft / 1.4));
    return [
      `Building footprint: ${W}′ × ${H}′ approx. — post spacing per building package drawings`,
      "Piers: 18″ dia. drilled concrete piers, 4,000 PSI, (4) #4 rebar cage, bell at frost depth",
      "Depth: below frost line per local code (typ. 36″–48″ in northern climates)",
      "Post bases: Simpson AB66 or engineer-specified anchor bolt at each pier",
      "Apron slab option: 5″ concrete apron at overhead door openings — provide unit price",
      "All concrete work to be inspected by AHJ before backfill",
    ];
  },

  "Framing": (a) => {
    const stories = n(a.stories, 1);
    const sqft = n(a.squareFootage, 1500);
    return [
      "Exterior walls: 2×6 KD SPF or Hem-Fir @ 16″ OC, double top plate, single bottom plate",
      stories > 1
        ? "Interior bearing walls: 2×6 @ 16″ OC; partitions: 2×4 @ 16″ OC, double top plate"
        : "Interior partitions: 2×4 KD SPF @ 16″ OC, double top plate",
      "Headers: LVL at openings ≥ 3′-6″; 2×8 (dbl) at openings 3′-6″ and under",
      `Roof: pre-engineered trusses @ 24″ OC or site-framed rafters @ 16″ OC per plan — approx. ${Math.round(sqft / 24)} LF ridge`,
      "Wall sheathing: 7/16″ OSB, APA Rated Sheathing, 8d ring-shank nails @ 6″ edges / 12″ field",
      "Roof sheathing: 7/16″ OSB with H-clips, 8d ring-shank nails @ 6″ edges / 12″ field",
      "Housewrap: Tyvek HomeWrap or equal, applied before window and door install; all seams taped",
      "Connectors: hurricane ties / rafter ties at every rafter–to–plate connection (Simpson H2.5A or equal)",
      "Provide PE-stamped truss drawings to building official before inspection",
    ];
  },

  "Post-Frame / Steel Erection": (a) => {
    const sqft = n(a.squareFootage, 2400);
    const W = Math.round(Math.sqrt(sqft * 1.4));
    const H = Math.round(Math.sqrt(sqft / 1.4));
    return [
      `Building footprint: approximately ${W}′ × ${H}′ — confirm with engineer-stamped drawings`,
      "Posts: 6×6 or 6×8 #1 SYP, pressure-treated UC4B, set in concrete collars, 8′ OC max",
      "Trusses: pre-engineered per building span, sealed drawings required — provide to building dept",
      "Purlins: 2×6 SYP @ 24″ OC on roof; girts: 2×4 @ 36″ OC on walls",
      "Metal panels: 26-gauge Galvalume PBR or AG panel — color per owner; submit sample before order",
      "Ridge cap, corner trim, J-trim, eave trim, base angle: factory-painted to match panels",
      "Overhead door headers: LVL or steel header per span — provide unit price per door size",
      "All connections: per manufacturer and engineer — structural screws or 16d ring-shank nails",
    ];
  },

  "Roofing": (a, st) => {
    const sqft = n(a.squareFootage, 1500);
    const isMetal = BARNDO_TYPES.has(st);
    const roofArea = Math.round(sqft * 1.15);

    if (isMetal) {
      return [
        `Roof area: approximately ${roofArea.toLocaleString()} sqft — measure before ordering`,
        "Panels: 26-gauge PBR metal, Galvalume Plus or painted Kynar/SMP finish; color per owner",
        "Fasteners: #12 × 1-½″ hex-head with EPDM washer @ 12″ OC at each purlin",
        "Foam closures: eave and ridge closures, profile-matched to panel",
        "Ridge cap: vented closure strip + metal ridge cap; screw @ 12″ OC",
        "Gutters: 5″ K-style aluminum, 3×4 corrugated downspouts — qty per drainage area",
        "Flashing: all penetrations, valleys, wall intersections per SMACNA; provide sketches with bid",
        "Underlayment: synthetic or felt underlayment under all metal panels",
      ];
    }

    return [
      `Roof area: approximately ${roofArea.toLocaleString()} sqft — measure and verify`,
      "Shingles: 30-year architectural asphalt, 240 lb min, Class A fire, Class 4 impact rated",
      "Underlayment: synthetic underlayment (Grace Tri-Flex or equal) full coverage",
      "Ice & water shield: 24″ wide minimum at eaves and valleys, 36″ at all penetrations",
      "Starter strip: factory cut or field-cut shingle starter course",
      "Ridge vent: continuous ventilated ridge cap the full length of ridge",
      "Flashing: metal step, counter, and base at all walls, chimneys, skylights, and penetrations",
      "Gutters: 5″ K-style aluminum with 2½×3″ downspouts; splash blocks at base",
      "Drip edge: metal drip edge at all eaves and rakes, per manufacturer and code",
    ];
  },

  "Roofing (Metal / Metal Sheeting)": (a) => {
    const sqft = n(a.squareFootage, 2400);
    const roofArea = Math.round(sqft * 1.10);
    return [
      `Roof area: approximately ${roofArea.toLocaleString()} sqft — measure before ordering materials`,
      "Panels: 26-gauge PBR, Galvalume Plus; color per owner selection — submit sample board",
      "Fasteners: #12 × 1-½″ with EPDM washer @ 12″ OC at all purlin bearing points",
      "Eave closure: foam closure strips, profile-matched",
      "Ridge cap: vented or solid per design; factory-painted to match panels",
      "Gutters & downspouts: 5″ K-style aluminum; size downspouts per roof drainage area",
      "All flashing: per SMACNA Sheet Metal Manual; caulk all seams with polyurethane",
    ];
  },

  "Windows & Exterior Doors": (a) => {
    const bedrooms = n(a.bedrooms, 3);
    const bathrooms = parseFloat(String(a.bathrooms ?? "2")) || 2;
    const winEst = Math.max(bedrooms * 2 + Math.ceil(bathrooms) + 4, 10);
    return [
      `Window count: approximately ${winEst} units — provide line-item schedule with bid`,
      "Minimum spec: double-pane vinyl, Low-E2 coating, U-0.30, SHGC 0.25, ENERGY STAR certified",
      "Egress compliance: min 5.7 sqft clear opening in all sleeping rooms — verify dimensions",
      "Install method: flange or block-frame; apply sill pan flashing + head tape at all units",
      "Exterior entry door(s): 3′-0″ × 6′-8″ fiberglass insulated, R-10 core, multi-point lock",
      "Patio/slider: size and count TBD by owner — provide unit price per opening size",
      "Provide supply + install unit price AND install-only unit price separately",
    ];
  },

  "Plumbing (Rough)": (a) => {
    const bathrooms = parseFloat(String(a.bathrooms ?? "2")) || 2;
    const bedrooms = n(a.bedrooms, 3);
    return [
      `${Math.ceil(bathrooms)} full bath(s)${bathrooms % 1 !== 0 ? " + 1 half bath" : ""} — fixture count per plan`,
      "Supply: ¾″ main to manifold; ½″ branches, PEX-A or PEX-B — manifold preferred for shutoff flexibility",
      "DWV: 3″ horizontal drains, 4″ main and sewer line; PVC Schedule 40",
      "Underground rough-in: set before slab pour — coordinate with concrete contractor on timing",
      "Water service: 1″ copper or PEX from meter to house; pressure reducer valve if > 80 PSI",
      `Laundry: cold/hot ½″ supply, 2″ standpipe, 4″ floor drain option`,
      "Kitchen: dishwasher valve, disposal drain, icemaker stub-out",
      "Exterior: 2 frost-free hose bibs (front and rear), vacuum breaker required",
      "Water heater rough: ¾″ supply and return, gas stub or 240V circuit",
    ];
  },

  "HVAC (Rough)": (a) => {
    const sqft = n(a.squareFootage, 1500);
    const stories = n(a.stories, 1);
    const tons = Math.ceil(sqft / 500);
    return [
      `System sizing: approx. ${tons} ton cooling — Manual J heat load calculation required before equipment order`,
      "Equipment: 14 SEER2 minimum; provide bid for heat pump and for gas/AC split system",
      "Duct system: flex duct R-8 or sheet metal — size per ACCA Manual D",
      `Supply registers: approx. ${Math.round(sqft / 150)} supply / ${Math.round(sqft / 300)} return — verify with Manual D`,
      stories > 1 ? `Multi-story: ${stories}-story home — provide bid for single zoned system and for separate per-floor systems` : "",
      "Combustion air and venting: per appliance manufacturer if gas equipment selected",
      "Fresh air: OA damper on air handler; provide unit price upgrade to ERV or HRV",
      "Equipment pad: 3½″ concrete pad at exterior, 3″ larger than unit on all sides",
    ].filter(Boolean);
  },

  "Electrical (Rough)": (a) => {
    const sqft = n(a.squareFootage, 1500);
    const stories = n(a.stories, 1);
    const circuits = Math.round(sqft / 200);
    return [
      "Service entrance: 200A underground or overhead; coordinate metering with utility before rough-in",
      "Main panel: 200A, 40-space minimum, Square D QO or Siemens equivalent; indoor location preferred",
      "AFCI protection: all bedroom, hallway, living, dining, kitchen circuits per NEC 2020 §210.12",
      "GFCI protection: kitchen, baths, laundry, garage, exterior, and within 6′ of any water source",
      `Branch circuits: min ${circuits} 15A general circuits; (2) small appliance; (1) laundry; (1) dishwasher; (1) disposal`,
      "Smoke/CO detectors: hardwired, interconnected; each level, each bedroom hallway",
      stories > 1 ? `${stories}-story: confirm load schedule before ordering panel — provide panel schedule with bid` : "",
      "EV-ready: NEMA 14-50 outlet in garage on 50A circuit — include as line item",
      "Low voltage: conduit + pull strings for CAT6 and A/V; box locations per owner",
    ].filter(Boolean);
  },

  "Insulation": (a) => {
    const stories = n(a.stories, 1);
    const foundation = s(a.foundation, "slab");
    return [
      "Exterior walls (2×6): R-21 high-density fiberglass batt or R-23 mineral wool, full-fill, no voids",
      "Attic/ceiling: R-49 blown cellulose or fiberglass, per IECC climate zone",
      stories > 1 ? "Floor between stories: R-19 sound batt for noise reduction" : "",
      "Rim joist / band joist: R-19 ccSPF or rigid foam cut-and-cobble — seal all gaps with foam",
      foundation === "crawl" ? "Crawl walls: R-13 rigid foam; 6-mil poly on floor, lapped and taped" : "",
      "Air sealing included: caulk all framing penetrations; foam all penetrations > 1″ before drywall",
      "Spray foam option: provide unit price per sqft for ccSPF walls-only upgrade",
      "Blower door test: coordinate with AHJ if required; provide result with final inspection docs",
    ].filter(Boolean);
  },

  "Insulation (if conditioned)": (a) => {
    return [
      "Metal wall cavity: 2″ ccSPF applied directly to metal panels (R-13) — eliminates condensation",
      "Stud cavity (if framed interior walls): R-13 fiberglass batt between studs",
      "Roof deck (inside): 4″ ccSPF at roof panels for conditioned space (R-25)",
      "Vapor/air barrier: ccSPF serves as both vapor retarder and air barrier",
      "Provide unit price for full ccSPF vs. hybrid (ccSPF + batt) system",
      "Spray foam contractor must be certified installer for product being used",
    ];
  },

  "Drywall": (a) => {
    const sqft = n(a.squareFootage, 1500);
    const stories = n(a.stories, 1);
    const hasGarage = s(a.garage) !== "no";
    return [
      `Board quantity: approximately ${Math.round(sqft * stories * 3.2 / 32)} sheets 4×8 — verify with material takeoff`,
      "Standard: ½″ Type X throughout all living areas; screw-applied",
      hasGarage ? "Garage separation: 5/8″ Type X both sides of garage–living wall; tape and coat (ASTM E119 fire assembly)" : "",
      "Ceilings: 5/8″ sag-resistant drywall, screw @ 12″ OC — hang before walls",
      "Level 4 finish: all painted wall surfaces; Level 5 on ceilings (under flat paint)",
      "Texture: per owner selection (knock-down, smooth, or skip-trowel) — submit sample on drywall board",
      "Wet areas: use moisture-resistant greenboard or DensArmor in all shower/tub surrounds and 2′ around",
      "Contractor to tape, coat, sand — provide unit price with and without texture",
    ].filter(Boolean);
  },

  "Exterior Siding / Cladding": (a, st) => {
    const sqft = n(a.squareFootage, 1500);
    const stories = n(a.stories, 1);
    const wallArea = Math.round(Math.sqrt(sqft / stories) * 4 * n(a.ceilingHeight, 9) * stories);
    const isMetal = BARNDO_TYPES.has(st);

    if (isMetal) {
      return [
        `Wall panel area: approximately ${wallArea.toLocaleString()} sqft — measure before ordering`,
        "Wall panels: 26-gauge PBR metal siding, matching roof panel finish; color per owner",
        "Corner trim, J-trim, base angle, window/door trim: factory-painted to match panel",
        "Fasteners: #12 hex-head screws with EPDM washers; stainless in coastal environments",
        "Sealant: polyurethane caulk at all penetrations and trim laps",
        "Wainscot option: provide unit price for cultured or cut stone accent at base (4′ ht)",
        "LP SmartSide or cedar option for gable ends: provide unit price per option",
      ];
    }

    return [
      `Wall area: approximately ${wallArea.toLocaleString()} sqft — measure before ordering`,
      "Siding: 5/16″ fiber cement lap (HardiePlank or equal), 6.25″ exposure, factory prime",
      "Housewrap: Tyvek HomeWrap, installed by framing contractor — inspect before siding begins",
      "Corner boards: 5/4×4 PVC or fiber cement; window/door J-channel: PVC",
      "Soffit & fascia: prefinished aluminum coil-wrapped or fiber cement",
      "Caulk: paintable siliconized acrylic at all penetrations, trim joints, and corner boards",
      "Paint (exterior): 1 coat bonding prime + 2 coats 100% acrylic — provide unit price",
      "Provide unit price upgrade to LP SmartSide or cedar accents on gable ends",
    ];
  },

  "Doors & Sliding / Rolling Doors": (a) => {
    return [
      "Overhead doors: sectional steel, insulated (R-12 minimum) — size schedule TBD by owner",
      "Openers: belt-drive with battery backup; provide unit price per door",
      "Walk-in doors: 3′-0″ × 6′-8″ fiberglass or steel insulated, self-closing, keyed alike option",
      "Sliding barn doors (if any): size and hardware per owner selection — provide unit price each",
      "Weather seals: bottom seal and side seals on all overhead doors; replace at all existing openings",
      "Coordinate header framing with framing contractor before ordering doors",
    ];
  },

  "Interior Trim / Finish Carpentry": (a) => {
    const sqft = n(a.squareFootage, 1500);
    const bedrooms = n(a.bedrooms, 3);
    const stories = n(a.stories, 1);
    const doorCount = bedrooms + 4 + (stories > 1 ? 2 : 0);
    return [
      `Interior doors: approximately ${doorCount} units, 3′-0″ × 6′-8″ hollow-core 6-panel — provide supply+install unit price`,
      "Door hardware: passage and privacy sets; provide unit price per finish (satin nickel standard)",
      `Baseboard: approx. ${Math.round(sqft * stories * 3.2).toLocaleString()} LF, 3-½″ colonial or craftsman profile`,
      "Window/door casing: 2-¼″ colonial or craftsman at all openings — included in LF bid",
      "Crown molding: per owner; provide unit price per LF for 3-½″ and 5-½″ profiles",
      "Closet shelving: ventilated wire shelving (ClosetMaid/Rubbermaid) — include all bedrooms in bid",
      stories > 1 ? "Stair rail: code-compliant baluster system, wood cap rail — provide unit price (36″ and 42″)" : "",
    ].filter(Boolean);
  },

  "Cabinets & Countertops": (a) => {
    const bathrooms = parseFloat(String(a.bathrooms ?? "2")) || 2;
    const bedrooms = n(a.bedrooms, 3);
    return [
      "Kitchen cabinets: semi-custom, ¾″ plywood box, soft-close hinges and drawer slides — provide LF unit price",
      "Kitchen layout: provide price for uppers + lowers; pantry and tall cabinets as separate line items",
      "Countertops: 1-¼″ quartz, eased edge — fabricate and install after cabinets in place",
      "Kitchen backsplash: include tile labor (owner to supply tile); or provide supply+install with 3×6 subway",
      `Bathroom vanities: ${Math.ceil(bathrooms)} units — owner may supply; provide install-only and supply+install pricing`,
      `Bath countertops: ${Math.ceil(bathrooms)} tops — quartz or cultured marble, undermount sink cutout included`,
      `Bathroom medicine cabinets or mirrors: ${Math.ceil(bathrooms)} units — include as line item`,
      "Laundry/mudroom base cabinets: provide unit price per LF if applicable",
      "Coordinate plumbing and electrical rough-in locations before cabinet install",
    ];
  },

  "Flooring": (a) => {
    const sqft = n(a.squareFootage, 1500);
    const bathrooms = parseFloat(String(a.bathrooms ?? "2")) || 2;
    const tileArea = Math.round(bathrooms * 65 + 130); // baths + kitchen
    const mainArea = Math.max(sqft - tileArea, 200);
    return [
      `LVP — living areas: approx. ${mainArea.toLocaleString()} sqft, 6mm min, AC3 wear layer; floating install`,
      `Tile — kitchen/baths: approx. ${tileArea.toLocaleString()} sqft, 12×24″ porcelain; owner selects tile from sample`,
      "Subfloor prep: level to within 3/16″ in 10′ — grind high spots, skim-coat low spots",
      "Transitions: T-mold, reducer, and threshold at all material changes — include in bid",
      `Tile showers: ${Math.ceil(bathrooms)} shower stall(s) — provide unit price each (mud bed, backer, tile, grout, grout sealer)`,
      "Tile grout: sanded ³⁄₁₆″ joints; apply penetrating sealer after 28-day cure",
      "Carpet option: provide unit price per sqft for bedroom carpeting if requested",
      "All flooring installed after paint complete",
    ];
  },

  "Plumbing (Finish)": (a) => {
    const bathrooms = parseFloat(String(a.bathrooms ?? "2")) || 2;
    return [
      `${Math.ceil(bathrooms)} bathroom(s): set tub/shower unit or tile-ready pan, install toilet, vanity top, faucet`,
      "Kitchen: set sink, connect dishwasher supply and drain, install disposal",
      "Water heater: final connection, PRV, expansion tank if closed system, drain pan with drain",
      "Laundry: connect washer valves, confirm standpipe height (24″–48″)",
      "Supply stops, wax rings, supply lines, P-traps: contractor to supply standard grade",
      "Pressure test at 100 PSI air for 15 min before occupancy",
      "Coordinate AHJ inspection — rough plumbing and final inspections both required",
    ];
  },

  "HVAC (Finish / Start-up)": () => [
    "Install air handler / furnace in mechanical room; outdoor condenser on equipment pad",
    "Connect refrigerant lines: evacuate system to < 500 microns, charge per manufacturer spec",
    "Connect supply and return duct collars; seal all joints with mastic or UL-listed foil tape",
    "Wire and set thermostat — smart thermostat (Nest or Ecobee) preferred; coordinate with electrician",
    "Balance airflow: all supply registers within ±10% of design CFM",
    "Startup commissioning: record supply/return air temps, static pressure, refrigerant charge",
    "Owner walkthrough: demonstrate thermostat, filter location, and maintenance schedule",
    "Provide manufacturer warranty documentation and AHRI certificate with closeout package",
  ],

  "Electrical (Finish)": () => [
    "Install all devices: outlets, switches, dimmers per plan — Decora style standard",
    "Install owner-selected fixtures (coordinate delivery schedule before install date)",
    "Panel trim-out: install all breakers, label all circuits on directory card",
    "Smoke/CO detectors: install hardwired units, test interconnect function",
    "Bath exhaust fans: 50 CFM min, ducted to exterior with backdraft damper — test CFM",
    "Exterior lighting: GFCI-protected; photocell or timer per owner preference",
    "Final AHJ electrical inspection: schedule and provide results to owner",
    "Provide as-built panel schedule at closeout",
  ],

  "Painting / Interior Finishes": (a) => {
    const sqft = n(a.squareFootage, 1500);
    const stories = n(a.stories, 1);
    const wallArea = Math.round(sqft * stories * 3.2);
    return [
      `Interior wall area: approx. ${wallArea.toLocaleString()} sqft + ceilings`,
      "Prep: fill nail holes, sand drywall joints, clean all surfaces — no exceptions",
      "New drywall prime coat: 1 coat PVA drywall primer on all new surfaces",
      "Walls: 2 finish coats eggshell or satin latex — owner selects up to 3 standard colors",
      "Ceilings: 2 coats flat ceiling white — no rolling texture accepted on Level 5 ceilings",
      "Trim and doors: 2 coats semi-gloss — owner selects color (typically bright white)",
      "Exterior: 1 coat bonding primer + 2 finish coats 100% acrylic latex on siding and trim",
      "Provide unit price per room for accent or feature wall colors",
    ];
  },

  "Landscaping / Final Grade": (a) => {
    const sqft = n(a.squareFootage, 1500);
    return [
      "Final grade: dress all disturbed areas; maintain 5% positive slope away from foundation",
      `Topsoil: 4″ depth spread across approx. ${Math.round(sqft * 0.6).toLocaleString()} sqft disturbed yard`,
      "Seeding: contractor-grade grass seed per climate zone; 80% germination guarantee within 60 days",
      "Straw erosion mat on all slopes > 3:1 until vegetation established",
      "Driveway: provide unit price for (a) 4″ compacted 21AA limestone, and (b) 3″ asphalt over 4″ base",
      "Remove all silt fence, construction debris, and excess soil before final walk",
    ];
  },

  // Agricultural-only versions
  "Electrical": (a) => {
    const sqft = n(a.squareFootage, 2400);
    return [
      "Service entrance: 200A overhead or underground — coordinate meter location with utility",
      "Main panel: 200A, 40-space, Square D or Siemens; locate at entry end of building",
      `Shop circuits: (4) 20A 120V general; (2) 240V/30A tool circuits; (1) 240V/50A welder outlet`,
      "Lighting: LED shop fixtures @ 50–100 FC at work surfaces — provide lighting layout",
      "Exterior: (2) dusk-to-dawn flood lights at door locations; (1) security light at entry",
      "GFCI: all outlets in wash areas, exterior, and within 6′ of water sources",
      "Barndo living area: sub-panel 100A minimum, separate from shop panel",
      `Total building: approx. ${Math.round(sqft / 180)} circuits total — provide full panel schedule`,
    ];
  },

  "Plumbing (if included)": () => [
    "Water service: 1″ main to building; 1″ inside riser to distribution",
    "Shop supply: ¾″ trunk line with ¾″ drops at work areas",
    "Frost-free hydrants: minimum 2 (1 inside, 1 exterior) — all self-draining",
    "Wash-down bibs: ¾″ hose bibs at both ends of building",
    "Floor drain: 4″ cast iron floor drain in shop area, trap primer or waterless trap",
    "Water heater: 40-gal propane or electric; upgrade to 50-gal if any living space",
    "Living area plumbing (barndo): full residential rough-in — see Residential Plumbing section",
  ],

  "Concrete Floors": (a) => {
    const sqft = n(a.squareFootage, 2400);
    return [
      `Slab area: approximately ${sqft.toLocaleString()} sqft — confirm final dimensions before bid`,
      "Mix: 4,000 PSI minimum, fiber-reinforced, 5–6 slump",
      "#4 rebar @ 18″ OC both ways in living area; wire mesh or fiber in shop area",
      "6-mil poly vapor barrier; 4″ compacted crushed stone base",
      "Apron slabs at overhead door openings: 10′ wide × 8′ deep, broom finish",
      "Thickness: 5″ minimum at drive-through bays and heavy equipment areas",
      "Control joints: saw-cut within 24 hrs; max 12′ × 12′ panel size",
      "Smooth trowel finish — living area; broom — shop/barn",
    ];
  },

  // Container trades
  "Structural Engineer": () => [
    "PE-stamped drawings required: container modifications, wall openings, stacking connections",
    "Provide stamped foundation design, anchor detail, and connection details to AHJ",
    "Drawings must include: floor plan, elevations, sections, connection details, and load calcs",
    "Coordinate stamped drawings with general contractor before any cutting or welding begins",
    "All structural modifications to containers must be shown on PE drawings prior to work",
  ],

  "Container Delivery & Placement": (a) => {
    const sqft = n(a.squareFootage, 1000);
    const containers = Math.ceil(sqft / 320); // 40′ container ≈ 320 sqft
    return [
      `Estimated ${containers} × 40′ ISO shipping containers (or mix of 20′/40′) — confirm count with owner`,
      "Transport: flatbed or step-deck per container length; confirm site access road width (14′ min)",
      "Placement: crane or forklift on pads — crane required for stacked configurations",
      "Coordinate crane and forklift rental; confirm weight and reach requirements before scheduling",
      "Containers must be placed exactly on foundation corner support points per PE drawing",
      "Containers: check containers for structural integrity, rust, and floor damage before acceptance",
    ];
  },

  "Steel Fabrication / Modification": () => [
    "All cuts and openings: per PE-stamped drawings only — no field modifications without PE approval",
    "Opening reinforcement: weld in structural steel frames at all door/window openings per PE detail",
    "Connection plates: weld corner connection plates for stacked containers per PE drawing",
    "Welding: AWS D1.1 or D1.6 standard; certified welder required for structural welds",
    "Rust treatment: wire brush all cut edges and welds; apply two-part epoxy primer",
    "Penetrations: all plumbing and electrical penetrations to receive waterproof sleeves",
    "Contractor to provide weld inspection documentation to AHJ if required",
  ],

  // Sustainable/Solar
  "Solar / PV Installer": (a) => {
    const sqft = n(a.squareFootage, 1500);
    const estimatedKw = Math.round((sqft / 1000) * 8);
    return [
      `System size: approx. ${estimatedKw} kW DC — final size per energy audit and utility interconnect`,
      "Panels: Tier 1 monocrystalline, 400W+ per panel, 25-year product and power warranty",
      "Inverter: string inverter with optimizer per panel, or microinverter per panel — provide bid for each",
      "Racking: UL-listed flush-mount on composition shingles or standing seam clip on metal roof",
      "Battery storage: provide unit price for 10 kWh battery (Tesla Powerwall or LG Chem equivalent)",
      "Interconnect: coordinate with utility for net metering agreement and inspection",
      "Permits: installer to pull all permits; coordinate AHJ inspection",
      "NABCEP-certified installer required; provide certification number with bid",
    ];
  },

  "Rainwater / Greywater System": () => [
    "First-flush diverter: installed on each downspout feeding collection system",
    "Storage tanks: food-grade poly tanks, sized per daily demand estimate",
    "Filtration: sediment filter + UV sterilizer for potable use; check local code for non-potable",
    "Distribution pump: pressure tank + pump to maintain household pressure",
    "Greywater: separate drain lines from laundry and bath sinks to irrigation or secondary treatment",
    "All systems must comply with local health department requirements — confirm before design",
    "Licensed plumber required for any connection to domestic water system",
  ],
};

export function getBidSpecs(
  tradeName: string,
  answers: ProjectAnswers,
  structureType: string
): string[] {
  const fn = SPEC_MAP[tradeName];
  if (!fn) return [];
  return fn(answers, structureType).filter(Boolean);
}
