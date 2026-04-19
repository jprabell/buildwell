import { QuestionStep, StructureType } from "@/types";

// ─── Shared building blocks ────────────────────────────────────────────────────

const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
];

const CLIMATE_ZONES = [
  { value: "hot_humid", label: "Hot & Humid (Gulf Coast, SE)" },
  { value: "hot_dry", label: "Hot & Dry (Desert SW)" },
  { value: "mixed_humid", label: "Mixed Humid (Mid-Atlantic, SE)" },
  { value: "mixed_dry", label: "Mixed Dry (Mountain West)" },
  { value: "cold", label: "Cold (Midwest, NE)" },
  { value: "very_cold", label: "Very Cold (Upper Midwest, Mountain)" },
  { value: "subarctic", label: "Subarctic / Arctic (Alaska)" },
  { value: "marine", label: "Marine (Pacific Coast)" },
];

const LOT_TERRAIN = [
  { value: "flat", label: "Flat" },
  { value: "gentle_slope", label: "Gentle Slope" },
  { value: "steep_slope", label: "Steep Slope" },
  { value: "hillside", label: "Hillside / Bluff" },
  { value: "wooded", label: "Wooded" },
  { value: "wetland", label: "Near Wetland / Flood Zone" },
];

// ─── Universal steps ───────────────────────────────────────────────────────────

const STEP_BASICS: QuestionStep = {
  id: "basics",
  title: "Basic Information",
  description: "Tell us about your project",
  questions: [
    {
      id: "projectName",
      label: "Project Name",
      type: "text",
      placeholder: "e.g. My Mountain Cabin",
      required: true,
    },
    {
      id: "state",
      label: "State / Province",
      type: "select",
      required: true,
      options: US_STATES,
    },
    {
      id: "zipCode",
      label: "Build Location ZIP Code (optional — needed to generate your preferred vendor list)",
      type: "text",
      placeholder: "e.g. 78701",
      required: false,
    },
    {
      id: "climateZone",
      label: "Climate Zone",
      type: "select",
      required: true,
      options: CLIMATE_ZONES,
    },
  ],
};

const STEP_SIZE: QuestionStep = {
  id: "size",
  title: "Size & Layout",
  description: "Define the footprint and scale of your structure",
  questions: [
    {
      id: "squareFootage",
      label: "Approximate Square Footage",
      type: "number",
      placeholder: "e.g. 1500",
      unit: "sq ft",
      required: true,
    },
    {
      id: "stories",
      label: "Number of Stories",
      type: "radio",
      required: true,
      options: [
        { value: "1", label: "Single Story" },
        { value: "1.5", label: "1.5 Story (loft/partial upper)" },
        { value: "2", label: "Two Story" },
        { value: "3", label: "Three Story" },
      ],
    },
    {
      id: "lotTerrain",
      label: "Lot Terrain",
      type: "select",
      options: LOT_TERRAIN,
    },
  ],
};

// Outbuildings: no stories question, adds explicit dimensions
const STEP_SIZE_OUTBUILDING: QuestionStep = {
  id: "size",
  title: "Size & Dimensions",
  description: "Define the footprint of your structure",
  questions: [
    {
      id: "squareFootage",
      label: "Approximate Square Footage",
      type: "number",
      placeholder: "e.g. 576",
      unit: "sq ft",
      required: true,
    },
    {
      id: "buildingWidth",
      label: "Width",
      type: "number",
      placeholder: "e.g. 24",
      unit: "ft",
    },
    {
      id: "buildingLength",
      label: "Length",
      type: "number",
      placeholder: "e.g. 24",
      unit: "ft",
    },
    {
      id: "lotTerrain",
      label: "Lot Terrain",
      type: "select",
      options: LOT_TERRAIN,
    },
  ],
};

// Full foundation options (all 7)
const STEP_FOUNDATION: QuestionStep = {
  id: "foundation",
  title: "Foundation",
  description: "Choose your foundation type",
  questions: [
    {
      id: "foundationType",
      label: "Foundation Type",
      type: "radio",
      required: true,
      options: [
        { value: "slab", label: "Slab on Grade", image: "/images/questionnaire/found-slab.svg" },
        { value: "crawl_space", label: "Crawl Space", image: "/images/questionnaire/found-crawlspace.svg" },
        { value: "full_basement", label: "Full Basement", image: "/images/questionnaire/found-basement.svg" },
        { value: "walkout_basement", label: "Walkout Basement", image: "/images/questionnaire/found-walkout.svg" },
        { value: "pier_beam", label: "Pier & Beam", image: "/images/questionnaire/found-pier-beam.svg" },
        { value: "helical_piers", label: "Helical Piers (slopes/unstable soil)", image: "/images/questionnaire/found-helical-piers.svg" },
        { value: "none", label: "No Foundation (skids/gravel)", image: "/images/questionnaire/found-gravel-skid.svg" },
      ],
    },
  ],
};

// Simplified foundation for small outbuildings
const STEP_FOUNDATION_SIMPLE: QuestionStep = {
  id: "foundation",
  title: "Foundation",
  description: "How will your structure be supported?",
  questions: [
    {
      id: "foundationType",
      label: "Foundation Type",
      type: "radio",
      required: true,
      options: [
        { value: "slab", label: "Concrete Slab", image: "/images/questionnaire/found-slab.svg" },
        { value: "pier_beam", label: "Pier & Beam", image: "/images/questionnaire/found-pier-beam.svg" },
        { value: "helical_piers", label: "Helical Piers", image: "/images/questionnaire/found-helical-piers.svg" },
        { value: "none", label: "Skids / Gravel Pad", image: "/images/questionnaire/found-gravel-skid.svg" },
      ],
    },
  ],
};

// Full exterior (roof + materials)
const STEP_EXTERIOR: QuestionStep = {
  id: "exterior",
  title: "Exterior",
  description: "Define the look and shell of your structure",
  questions: [
    {
      id: "roofType",
      label: "Roof Style",
      type: "select",
      required: true,
      options: [
        { value: "gable", label: "Gable (standard A-shape)", image: "/images/questionnaire/roof-gable.svg" },
        { value: "hip", label: "Hip Roof", image: "/images/questionnaire/roof-hip.svg" },
        { value: "gambrel", label: "Gambrel (barn-style)", image: "/images/questionnaire/roof-gambrel.svg" },
        { value: "shed", label: "Shed / Mono-pitch", image: "/images/questionnaire/roof-shed.svg" },
        { value: "flat", label: "Flat / Low-slope", image: "/images/questionnaire/roof-flat.svg" },
        { value: "metal_standing_seam", label: "Standing Seam Metal", image: "/images/questionnaire/roof-standing-seam.svg" },
        { value: "butterfly", label: "Butterfly", image: "/images/questionnaire/roof-butterfly.svg" },
        { value: "dome", label: "Dome", image: "/images/questionnaire/roof-dome.svg" },
      ],
    },
    {
      id: "roofMaterial",
      label: "Roof Material",
      type: "select",
      options: [
        { value: "asphalt_shingle", label: "Asphalt Shingle", image: "/images/questionnaire/roofmat-asphalt-shingle.jpg" },
        { value: "metal_panel", label: "Metal Panel", image: "/images/questionnaire/roofmat-metal-panel.jpg" },
        { value: "standing_seam_metal", label: "Standing Seam Metal", image: "/images/questionnaire/roofmat-standing-seam.jpg" },
        { value: "metal_shingle", label: "Metal Shingle", image: "/images/questionnaire/roofmat-metal-shingle.jpg" },
        { value: "wood_shake", label: "Wood Shake", image: "/images/questionnaire/roofmat-wood-shake.jpg" },
        { value: "clay_tile", label: "Clay Tile", image: "/images/questionnaire/roofmat-clay-tile.jpg" },
        { value: "concrete_tile", label: "Concrete Tile", image: "/images/questionnaire/roofmat-concrete-tile.jpg" },
        { value: "tpo_membrane", label: "TPO Membrane (flat)", image: "/images/questionnaire/roofmat-tpo.jpg" },
        { value: "epdm", label: "EPDM Rubber (flat)", image: "/images/questionnaire/roofmat-epdm.jpg" },
        { value: "green_roof", label: "Living / Green Roof", image: "/images/questionnaire/roofmat-green-roof.jpg" },
      ],
    },
    {
      id: "exteriorMaterial",
      label: "Exterior Wall Material",
      type: "select",
      options: [
        { value: "vinyl_siding", label: "Vinyl Siding", image: "/images/questionnaire/ext-vinyl-siding.jpg" },
        { value: "fiber_cement", label: "Fiber Cement (HardiePlank)", image: "/images/questionnaire/ext-fiber-cement.jpg" },
        { value: "wood_siding", label: "Wood Siding", image: "/images/questionnaire/ext-wood-siding.jpg" },
        { value: "brick", label: "Brick", image: "/images/questionnaire/ext-brick.jpg" },
        { value: "stone", label: "Stone / Faux Stone", image: "/images/questionnaire/ext-stone.jpg" },
        { value: "stucco", label: "Stucco", image: "/images/questionnaire/ext-stucco.jpg" },
        { value: "metal_panel", label: "Metal Panel", image: "/images/questionnaire/ext-metal-panel.jpg" },
        { value: "log", label: "Log", image: "/images/questionnaire/ext-log.jpg" },
        { value: "corten_steel", label: "Corten / Weathering Steel", image: "/images/questionnaire/ext-corten.jpg" },
        { value: "shipping_container", label: "Shipping Container (exposed)", image: "/images/questionnaire/ext-container.jpg" },
        { value: "earth", label: "Rammed Earth / Adobe", image: "/images/questionnaire/ext-rammed-earth.jpg" },
      ],
    },
  ],
};

// Simplified exterior for agricultural / outbuildings
const STEP_EXTERIOR_AGRICULTURAL: QuestionStep = {
  id: "exterior",
  title: "Exterior",
  description: "Define the exterior materials",
  questions: [
    {
      id: "roofType",
      label: "Roof Style",
      type: "select",
      required: true,
      options: [
        { value: "gable", label: "Gable", image: "/images/questionnaire/barn-roof-gable.svg" },
        { value: "gambrel", label: "Gambrel (barn-style)", image: "/images/questionnaire/barn-roof-gambrel.svg" },
        { value: "shed", label: "Shed / Mono-pitch", image: "/images/questionnaire/barn-roof-shed.svg" },
        { value: "monitor", label: "Monitor / Raised Center Ridge", image: "/images/questionnaire/barn-roof-monitor.svg" },
        { value: "hip", label: "Hip Roof", image: "/images/questionnaire/barn-roof-hip.svg" },
      ],
    },
    {
      id: "roofMaterial",
      label: "Roof Material",
      type: "select",
      options: [
        { value: "metal_panel", label: "Metal Panel (most common)", image: "/images/questionnaire/barn-roofmat-metal-panel.svg" },
        { value: "standing_seam_metal", label: "Standing Seam Metal", image: "/images/questionnaire/barn-roofmat-standing-seam.svg" },
        { value: "asphalt_shingle", label: "Asphalt Shingle", image: "/images/questionnaire/barn-roofmat-asphalt.svg" },
      ],
    },
    {
      id: "exteriorMaterial",
      label: "Wall Material",
      type: "select",
      options: [
        { value: "metal_panel", label: "Steel / Metal Panel", image: "/images/questionnaire/ext-metal-panel.jpg" },
        { value: "wood_siding", label: "Wood / T1-11 Siding", image: "/images/questionnaire/ext-wood-siding.jpg" },
        { value: "fiber_cement", label: "Fiber Cement", image: "/images/questionnaire/ext-fiber-cement.jpg" },
        { value: "vinyl_siding", label: "Vinyl Siding", image: "/images/questionnaire/ext-vinyl-siding.jpg" },
      ],
    },
  ],
};

// Full utilities (with HVAC)
const STEP_UTILITIES: QuestionStep = {
  id: "utilities",
  title: "Utilities & Systems",
  description: "How will your structure be serviced?",
  questions: [
    {
      id: "utilityConnection",
      label: "Utility Connection",
      type: "multiselect",
      options: [
        { value: "grid_electric", label: "Grid Electric" },
        { value: "solar", label: "Solar (on-grid)" },
        { value: "solar_offgrid", label: "Solar (off-grid)" },
        { value: "generator", label: "Generator Backup" },
        { value: "municipal_water", label: "Municipal Water" },
        { value: "well_water", label: "Well Water" },
        { value: "municipal_sewer", label: "Municipal Sewer" },
        { value: "septic", label: "Septic System" },
        { value: "composting_toilet", label: "Composting Toilet" },
        { value: "propane", label: "Propane" },
        { value: "natural_gas", label: "Natural Gas" },
      ],
    },
    {
      id: "hvacType",
      label: "Heating & Cooling",
      type: "select",
      options: [
        { value: "central_hvac", label: "Central HVAC (forced air)", image: "/images/questionnaire/hvac-central.svg" },
        { value: "mini_split", label: "Mini-Split System", image: "/images/questionnaire/hvac-mini-split.svg" },
        { value: "radiant_floor", label: "Radiant Floor Heat", image: "/images/questionnaire/hvac-radiant-floor.svg" },
        { value: "wood_stove", label: "Wood Stove / Pellet Stove", image: "/images/questionnaire/hvac-wood-stove.svg" },
        { value: "geothermal", label: "Geothermal", image: "/images/questionnaire/hvac-geothermal.svg" },
        { value: "passive", label: "Passive (no mechanical)", image: "/images/questionnaire/hvac-passive.svg" },
        { value: "propane_furnace", label: "Propane Furnace", image: "/images/questionnaire/hvac-propane.svg" },
      ],
    },
  ],
};

// Simple utilities for outbuildings (no HVAC choice)
const STEP_UTILITIES_OUTBUILDING: QuestionStep = {
  id: "utilities",
  title: "Utilities",
  description: "What utilities will this building need?",
  questions: [
    {
      id: "utilityConnection",
      label: "Utility Connection",
      type: "multiselect",
      options: [
        { value: "grid_electric", label: "Grid Electric (subpanel from house)" },
        { value: "solar", label: "Solar / Standalone Power" },
        { value: "generator", label: "Generator" },
        { value: "no_electric", label: "No Electrical" },
        { value: "water_hookup", label: "Water Hookup" },
        { value: "no_water", label: "No Water / Plumbing" },
      ],
    },
  ],
};

// Sustainability
const STEP_SUSTAINABILITY: QuestionStep = {
  id: "sustainability",
  title: "Sustainability Goals",
  description: "Select any sustainable features you want to incorporate",
  questions: [
    {
      id: "sustainabilityFeatures",
      label: "Sustainable Features",
      type: "multiselect",
      options: [
        { value: "solar_panels", label: "Solar Panels" },
        { value: "rainwater_collection", label: "Rainwater Collection" },
        { value: "greywater_recycling", label: "Greywater Recycling" },
        { value: "spray_foam_insulation", label: "Spray Foam Insulation" },
        { value: "sip_panels", label: "SIP Panels (Structural Insulated)" },
        { value: "icf_construction", label: "ICF (Insulated Concrete Forms)" },
        { value: "passive_solar_design", label: "Passive Solar Design" },
        { value: "green_roof", label: "Green / Living Roof" },
        { value: "reclaimed_materials", label: "Reclaimed Materials" },
        { value: "ev_charging", label: "EV Charging Rough-In" },
        { value: "battery_storage", label: "Battery Storage" },
        { value: "energy_star_appliances", label: "Energy Star Appliances" },
      ],
    },
  ],
};

// Full budget (for larger builds)
const STEP_BUDGET: QuestionStep = {
  id: "budget",
  title: "Budget",
  description: "Help us tailor material selections to your range",
  questions: [
    {
      id: "budgetRange",
      label: "Total Project Budget",
      type: "radio",
      options: [
        { value: "under_50k", label: "Under $50,000" },
        { value: "50k_100k", label: "$50,000 – $100,000" },
        { value: "100k_200k", label: "$100,000 – $200,000" },
        { value: "200k_400k", label: "$200,000 – $400,000" },
        { value: "400k_750k", label: "$400,000 – $750,000" },
        { value: "over_750k", label: "Over $750,000" },
      ],
    },
    {
      id: "diyLevel",
      label: "Owner / DIY Involvement",
      type: "select",
      options: [
        { value: "none", label: "None — fully contracted out" },
        { value: "some", label: "Some — owner doing finish work" },
        { value: "substantial", label: "Substantial — owner-builder" },
        { value: "full", label: "Full — I'm building it myself" },
      ],
    },
  ],
};

// Smaller budget ranges for sheds / small outbuildings
const STEP_BUDGET_SMALL: QuestionStep = {
  id: "budget",
  title: "Budget",
  description: "Help us tailor material selections to your range",
  questions: [
    {
      id: "budgetRange",
      label: "Total Project Budget",
      type: "radio",
      options: [
        { value: "under_5k", label: "Under $5,000" },
        { value: "5k_15k", label: "$5,000 – $15,000" },
        { value: "15k_30k", label: "$15,000 – $30,000" },
        { value: "30k_75k", label: "$30,000 – $75,000" },
        { value: "over_75k", label: "Over $75,000" },
      ],
    },
    {
      id: "diyLevel",
      label: "Owner / DIY Involvement",
      type: "select",
      options: [
        { value: "none", label: "None — fully contracted out" },
        { value: "some", label: "Some — owner doing finish work" },
        { value: "substantial", label: "Substantial — owner-builder" },
        { value: "full", label: "Full — I'm building it myself" },
      ],
    },
  ],
};

// ─── Structure-specific steps ──────────────────────────────────────────────────

// ── SINGLE_FAMILY_HOME ────────────────────────────────────────────────────────

const STEP_ROOMS: QuestionStep = {
  id: "rooms",
  title: "Rooms & Layout",
  description: "Define your living spaces",
  questions: [
    {
      id: "bedrooms",
      label: "Bedrooms",
      type: "radio",
      required: true,
      options: [
        { value: "1", label: "1 Bedroom" },
        { value: "2", label: "2 Bedrooms" },
        { value: "3", label: "3 Bedrooms" },
        { value: "4", label: "4 Bedrooms" },
        { value: "5", label: "5+ Bedrooms" },
      ],
    },
    {
      id: "bathrooms",
      label: "Bathrooms",
      type: "radio",
      required: true,
      options: [
        { value: "1", label: "1 Bath" },
        { value: "1.5", label: "1.5 Bath" },
        { value: "2", label: "2 Bath" },
        { value: "2.5", label: "2.5 Bath" },
        { value: "3", label: "3 Bath" },
        { value: "4+", label: "4+ Bath" },
      ],
    },
    {
      id: "garageType",
      label: "Garage",
      type: "select",
      options: [
        { value: "none", label: "No Garage" },
        { value: "attached_1", label: "Attached 1-Car" },
        { value: "attached_2", label: "Attached 2-Car" },
        { value: "attached_3", label: "Attached 3-Car" },
        { value: "detached_1", label: "Detached 1-Car" },
        { value: "detached_2", label: "Detached 2-Car" },
      ],
    },
  ],
};

const STEP_HOME_FEATURES: QuestionStep = {
  id: "home_features",
  title: "Home Features",
  description: "Select additional spaces and features",
  questions: [
    {
      id: "homeFeatures",
      label: "Included Spaces",
      type: "multiselect",
      options: [
        { value: "home_office", label: "Home Office / Study" },
        { value: "bonus_room", label: "Bonus Room / Flex Space" },
        { value: "mudroom", label: "Mudroom / Laundry Room" },
        { value: "formal_dining", label: "Formal Dining Room" },
        { value: "open_floor_plan", label: "Open Floor Plan (kitchen/living/dining)" },
        { value: "covered_porch", label: "Covered Porch / Patio" },
        { value: "deck", label: "Deck" },
        { value: "sunroom", label: "Sunroom / Screened Porch" },
        { value: "in_law_suite", label: "In-Law Suite / ADU" },
        { value: "media_room", label: "Media Room / Theater" },
        { value: "gym", label: "Exercise Room / Gym" },
        { value: "pool", label: "Pool (rough-in)" },
      ],
    },
    {
      id: "masterFeatures",
      label: "Primary Suite Features",
      type: "multiselect",
      options: [
        { value: "walk_in_closet", label: "Walk-In Closet" },
        { value: "dual_closets", label: "Dual Walk-In Closets" },
        { value: "en_suite_bath", label: "En-Suite Bathroom" },
        { value: "soaking_tub", label: "Soaking / Freestanding Tub" },
        { value: "walk_in_shower", label: "Walk-In Shower" },
        { value: "double_vanity", label: "Double Vanity" },
        { value: "private_balcony", label: "Private Balcony / Deck" },
      ],
    },
  ],
};

// ── LOG_CABIN ─────────────────────────────────────────────────────────────────

const STEP_LOG_CONFIG: QuestionStep = {
  id: "log_config",
  title: "Log Construction",
  description: "Specify your log style and construction method",
  questions: [
    {
      id: "logStyle",
      label: "Log Style",
      type: "radio",
      required: true,
      options: [
        { value: "full_round", label: "Full Round Log (traditional)" },
        { value: "half_log", label: "Half-Log (flat interior face)" },
        { value: "d_log", label: "D-Log (flat exterior, round interior)" },
        { value: "hand_hewn", label: "Hand-Hewn (rustic, square)" },
        { value: "milled", label: "Milled / Uniform (precision-cut)" },
      ],
    },
    {
      id: "logDiameter",
      label: "Log Diameter",
      type: "radio",
      options: [
        { value: "6_8", label: '6"–8" (light cabin)' },
        { value: "8_12", label: '8"–12" (standard)' },
        { value: "12_16", label: '12"–16" (substantial)' },
        { value: "16_plus", label: '16"+ (large / handcrafted)' },
      ],
    },
    {
      id: "chinkingStyle",
      label: "Chinking / Sealing Method",
      type: "radio",
      options: [
        { value: "traditional_chinking", label: "Traditional White Chinking" },
        { value: "color_chinking", label: "Colored Chinking (matched to log)" },
        { value: "no_chink", label: "No-Chink Profile (machined tight fit)" },
        { value: "caulk_backer", label: "Caulk & Backer Rod" },
      ],
    },
    {
      id: "cabinFeatures",
      label: "Cabin Features",
      type: "multiselect",
      options: [
        { value: "loft", label: "Open Loft" },
        { value: "wraparound_porch", label: "Wraparound Porch" },
        { value: "front_porch", label: "Covered Front Porch" },
        { value: "back_deck", label: "Rear Deck" },
        { value: "stone_fireplace", label: "Stone / Masonry Fireplace" },
        { value: "vaulted_ceiling", label: "Vaulted / Cathedral Ceiling" },
        { value: "exposed_beams", label: "Exposed Timber Beams" },
        { value: "root_cellar", label: "Root Cellar" },
      ],
    },
  ],
};

const STEP_ROOMS_CABIN: QuestionStep = {
  id: "rooms",
  title: "Rooms & Spaces",
  description: "Define the cabin's living spaces",
  questions: [
    {
      id: "bedrooms",
      label: "Bedrooms (not counting sleeping loft)",
      type: "radio",
      required: true,
      options: [
        { value: "0", label: "Open Studio / No Separate Bedroom" },
        { value: "1", label: "1 Bedroom" },
        { value: "2", label: "2 Bedrooms" },
        { value: "3", label: "3 Bedrooms" },
        { value: "4", label: "4+ Bedrooms" },
      ],
    },
    {
      id: "bathrooms",
      label: "Bathrooms",
      type: "radio",
      required: true,
      options: [
        { value: "1", label: "1 Bath" },
        { value: "1.5", label: "1.5 Bath" },
        { value: "2", label: "2 Bath" },
        { value: "2.5", label: "2.5 Bath" },
        { value: "3+", label: "3+ Bath" },
      ],
    },
  ],
};

// ── A_FRAME ───────────────────────────────────────────────────────────────────

const STEP_AFRAME_CONFIG: QuestionStep = {
  id: "aframe_config",
  title: "A-Frame Configuration",
  description: "Define your A-frame's geometry and features",
  questions: [
    {
      id: "aframePeakHeight",
      label: "Peak Height (at ridge)",
      type: "radio",
      required: true,
      options: [
        { value: "16_20", label: "16–20 ft (compact)" },
        { value: "20_28", label: "20–28 ft (standard)" },
        { value: "28_36", label: "28–36 ft (tall / dramatic)" },
        { value: "36_plus", label: "36 ft+ (very tall)" },
      ],
    },
    {
      id: "aframeKneeWall",
      label: "Knee Wall Space Usage",
      type: "radio",
      options: [
        { value: "storage", label: "Storage / Utility Space" },
        { value: "closets", label: "Built-In Closets" },
        { value: "beds", label: "Built-In Platform Beds" },
        { value: "open", label: "Open / No Knee Wall" },
      ],
    },
    {
      id: "aframeGlazing",
      label: "Front Gable Glazing",
      type: "radio",
      options: [
        { value: "minimal", label: "Minimal — small windows only" },
        { value: "partial", label: "Partial — upper triangle glazed" },
        { value: "full", label: "Full — floor-to-peak glass gable" },
        { value: "mixed", label: "Mixed — glass panels + solid sections" },
      ],
    },
    {
      id: "aframeFeatures",
      label: "Additional Features",
      type: "multiselect",
      options: [
        { value: "loft", label: "Upper Sleeping Loft" },
        { value: "deck_front", label: "Front Deck / Platform" },
        { value: "deck_rear", label: "Rear Deck / Balcony" },
        { value: "dormer", label: "Dormer Window" },
        { value: "shed_addition", label: "Side Shed Addition (extra room)" },
        { value: "carport", label: "Attached Carport" },
        { value: "screened_porch", label: "Screened Porch" },
        { value: "wood_stove", label: "Wood Stove / Pellet Stove" },
      ],
    },
  ],
};

// ── TINY_HOME ─────────────────────────────────────────────────────────────────

const STEP_TINY_CONFIG: QuestionStep = {
  id: "tiny_config",
  title: "Tiny Home Configuration",
  description: "Define your tiny home style and features",
  questions: [
    {
      id: "tinyMobility",
      label: "Mobility",
      type: "radio",
      required: true,
      options: [
        { value: "on_wheels", label: "On Wheels (THOW — trailer-mounted)" },
        { value: "fixed_skids", label: "Fixed on Skids / Block Piers" },
        { value: "permanent", label: "Permanent Foundation" },
      ],
    },
    {
      id: "tinyLoft",
      label: "Sleeping Arrangement",
      type: "radio",
      options: [
        { value: "standard_loft", label: "Standard Loft (7–8 ft overhead)" },
        { value: "murphy_bed", label: "Murphy / Wall Bed (no loft)" },
        { value: "ground_level", label: "Ground-Level Bedroom" },
        { value: "multiple_lofts", label: "Multiple Lofts" },
      ],
    },
    {
      id: "tinyBathroom",
      label: "Bathroom Style",
      type: "radio",
      options: [
        { value: "full_bath", label: "Full Bath (shower, toilet, sink)" },
        { value: "wet_bath", label: "Wet Bath (combo shower/toilet room)" },
        { value: "outdoor_shower", label: "Outdoor Shower + Indoor Toilet" },
        { value: "composting", label: "Composting Toilet + Outdoor Shower" },
      ],
    },
    {
      id: "tinyFeatures",
      label: "Space-Saving Features",
      type: "multiselect",
      options: [
        { value: "fold_out_deck", label: "Fold-Out / Drop Deck" },
        { value: "kitchen_full", label: "Full Kitchen (standard appliances)" },
        { value: "kitchen_compact", label: "Compact Kitchen (apartment-scale)" },
        { value: "washer_dryer_combo", label: "Washer/Dryer Combo Unit" },
        { value: "built_in_storage", label: "Built-In Storage Throughout" },
        { value: "slide_out", label: "Slide-Out Room Section" },
        { value: "skylight", label: "Skylight / Roof Window" },
        { value: "mini_split", label: "Mini-Split HVAC" },
      ],
    },
  ],
};

// ── DOME_HOME ─────────────────────────────────────────────────────────────────

const STEP_DOME_CONFIG: QuestionStep = {
  id: "dome_config",
  title: "Dome Configuration",
  description: "Define your dome's geometry and construction method",
  questions: [
    {
      id: "domeType",
      label: "Dome Construction Type",
      type: "radio",
      required: true,
      options: [
        { value: "geodesic", label: "Geodesic Dome (hub-and-strut steel/aluminum)" },
        { value: "monolithic", label: "Monolithic Dome (concrete over airform)" },
        { value: "timber_geodesic", label: "Timber Geodesic (wood strut frame)" },
        { value: "prefab_panel", label: "Prefab Panel System (EPS + connectors)" },
      ],
    },
    {
      id: "domeDiameter",
      label: "Dome Diameter",
      type: "radio",
      required: true,
      options: [
        { value: "under_30", label: "Under 30 ft (~700 sq ft interior)" },
        { value: "30_40", label: "30–40 ft (~800–1,250 sq ft)" },
        { value: "40_50", label: "40–50 ft (~1,250–1,960 sq ft)" },
        { value: "50_plus", label: "50 ft+ (1,960+ sq ft)" },
      ],
    },
    {
      id: "geodesicFrequency",
      label: "Geodesic Frequency (complexity of triangulation)",
      type: "radio",
      options: [
        { value: "2v", label: "2V — fewer, larger triangles (simple)" },
        { value: "3v", label: "3V — standard complexity" },
        { value: "4v", label: "4V — smoother, more panels" },
        { value: "6v", label: "6V+ — very smooth, complex geometry" },
      ],
    },
    {
      id: "domeFeatures",
      label: "Dome Features",
      type: "multiselect",
      options: [
        { value: "entryway", label: "Entryway / Airlock Addition" },
        { value: "shed_dormer", label: "Shed Dormer Addition" },
        { value: "cupola", label: "Cupola / Skylight at Peak" },
        { value: "wraparound_deck", label: "Wraparound Deck" },
        { value: "second_dome", label: "Second / Linked Dome" },
        { value: "earth_bermed", label: "Partially Underground / Earth-Bermed" },
      ],
    },
  ],
};

// ── CONTAINER_HOME ────────────────────────────────────────────────────────────

const STEP_CONTAINER_CONFIG: QuestionStep = {
  id: "containers",
  title: "Container Configuration",
  description: "Define your container layout",
  questions: [
    {
      id: "containerSize",
      label: "Container Size",
      type: "radio",
      options: [
        { value: "20ft", label: "20 ft standard (160 sq ft)" },
        { value: "40ft", label: "40 ft standard (320 sq ft)" },
        { value: "40ft_hc", label: "40 ft high-cube (340 sq ft, 9.5 ft tall)" },
      ],
    },
    {
      id: "containerCount",
      label: "Number of Containers",
      type: "radio",
      options: [
        { value: "1", label: "1 Container" },
        { value: "2", label: "2 Containers" },
        { value: "3-4", label: "3–4 Containers" },
        { value: "5-8", label: "5–8 Containers" },
        { value: "9+", label: "9+ Containers" },
      ],
    },
    {
      id: "containerArrangement",
      label: "Container Arrangement",
      type: "select",
      options: [
        { value: "linear", label: "Linear / End-to-End", image: "/images/questionnaire/container-linear.svg" },
        { value: "parallel", label: "Parallel / Side-by-Side", image: "/images/questionnaire/container-parallel.svg" },
        { value: "l_shape", label: "L-Shape", image: "/images/questionnaire/container-l-shape.svg" },
        { value: "u_shape", label: "U-Shape", image: "/images/questionnaire/container-u-shape.svg" },
        { value: "stacked", label: "Stacked (multi-story)", image: "/images/questionnaire/container-stacked.svg" },
        { value: "mixed", label: "Mixed / Custom", image: "/images/questionnaire/container-mixed.svg" },
      ],
    },
    {
      id: "containerModifications",
      label: "Container Modifications",
      type: "multiselect",
      options: [
        { value: "cut_openings", label: "Cut Openings (windows / doors)" },
        { value: "remove_walls", label: "Remove Interior Walls (open plan)" },
        { value: "spray_foam", label: "Spray Foam Insulation (interior)" },
        { value: "furring_walls", label: "Furring Strip Walls + Drywall Finish" },
        { value: "exterior_cladding", label: "Exterior Cladding (wood/metal/stucco)" },
        { value: "roof_addition", label: "Pitched Roof Addition / Overhang" },
        { value: "deck_between", label: "Deck Between Containers" },
        { value: "rust_treatment", label: "Corten Sealed or Painted Finish" },
      ],
    },
  ],
};

// ── BARNDOMINIUM ──────────────────────────────────────────────────────────────

const STEP_BARNDO_LIVING: QuestionStep = {
  id: "barndo_living",
  title: "Living Area",
  description: "Define the residential portion of your barndominium",
  questions: [
    {
      id: "bedrooms",
      label: "Bedrooms",
      type: "radio",
      required: true,
      options: [
        { value: "1", label: "1 Bedroom" },
        { value: "2", label: "2 Bedrooms" },
        { value: "3", label: "3 Bedrooms" },
        { value: "4", label: "4 Bedrooms" },
        { value: "5", label: "5+ Bedrooms" },
      ],
    },
    {
      id: "bathrooms",
      label: "Bathrooms",
      type: "radio",
      required: true,
      options: [
        { value: "1", label: "1 Bath" },
        { value: "1.5", label: "1.5 Bath" },
        { value: "2", label: "2 Bath" },
        { value: "2.5", label: "2.5 Bath" },
        { value: "3+", label: "3+ Bath" },
      ],
    },
    {
      id: "livingAreaPercent",
      label: "Living Area as % of Total Building",
      type: "radio",
      required: true,
      options: [
        { value: "25", label: "25% — primarily shop / barn" },
        { value: "50", label: "50% — equal split" },
        { value: "75", label: "75% — primarily living space" },
        { value: "custom", label: "Custom layout" },
      ],
    },
  ],
};

const STEP_BARNDO_SHOP: QuestionStep = {
  id: "barndo_shop",
  title: "Shop / Barn Area",
  description: "Define the working or agricultural portion",
  questions: [
    {
      id: "shopUse",
      label: "Shop / Barn Primary Use",
      type: "multiselect",
      options: [
        { value: "vehicle_storage", label: "Vehicle / Equipment Storage" },
        { value: "workshop", label: "Workshop / Metal Fab" },
        { value: "livestock", label: "Livestock Housing" },
        { value: "hay_storage", label: "Hay / Feed Storage" },
        { value: "hobby_garage", label: "Hobby Garage" },
        { value: "events", label: "Events / Entertaining Space" },
      ],
    },
    {
      id: "shopDoors",
      label: "Large Access Doors",
      type: "multiselect",
      options: [
        { value: "overhead_12", label: "12 ft Overhead Door (1 bay)" },
        { value: "overhead_14", label: "14 ft Overhead Door (RV / equipment)" },
        { value: "double_12", label: "Two 12 ft Overhead Doors" },
        { value: "sliding_barn", label: "Sliding Barn Door (10 ft+)" },
        { value: "roll_up", label: "Roll-Up Door" },
      ],
    },
    {
      id: "shopConcreteThickness",
      label: "Shop Floor Concrete Thickness",
      type: "radio",
      options: [
        { value: "4", label: '4" — standard residential' },
        { value: "6", label: '6" — light vehicles / equipment' },
        { value: "8", label: '8" — heavy equipment' },
      ],
    },
    {
      id: "clearSpanWidth",
      label: "Shop Clear Span Width Needed",
      type: "radio",
      options: [
        { value: "up_to_30", label: "Up to 30 ft" },
        { value: "30_to_50", label: "30–50 ft" },
        { value: "50_to_80", label: "50–80 ft" },
        { value: "over_80", label: "Over 80 ft" },
      ],
    },
  ],
};

// ── BARN ──────────────────────────────────────────────────────────────────────

const STEP_BARN_CONFIG: QuestionStep = {
  id: "barn_config",
  title: "Barn Configuration",
  description: "Define your barn's internal layout and features",
  questions: [
    {
      id: "barnPrimaryUse",
      label: "Primary Use",
      type: "multiselect",
      options: [
        { value: "horse_stalls", label: "Horse Stalls" },
        { value: "livestock", label: "Other Livestock (cattle, goats, sheep)" },
        { value: "hay_storage", label: "Hay / Feed Storage" },
        { value: "equipment", label: "Equipment Storage" },
        { value: "events", label: "Event Venue / Wedding Barn" },
        { value: "shop", label: "Shop / Workspace" },
      ],
    },
    {
      id: "stallCount",
      label: "Number of Stalls (if applicable)",
      type: "radio",
      options: [
        { value: "0", label: "No Stalls" },
        { value: "2_4", label: "2–4 Stalls" },
        { value: "5_8", label: "5–8 Stalls" },
        { value: "9_16", label: "9–16 Stalls" },
        { value: "17_plus", label: "17+ Stalls" },
      ],
    },
    {
      id: "stallSize",
      label: "Stall Size",
      type: "radio",
      options: [
        { value: "10x10", label: "10×10 ft (small horse / pony)" },
        { value: "12x12", label: "12×12 ft (standard horse)" },
        { value: "14x14", label: "14×14 ft (large horse / quarantine)" },
        { value: "run_in", label: "Run-In / Loafing Shed Style" },
      ],
    },
    {
      id: "barnFeatures",
      label: "Barn Features",
      type: "multiselect",
      options: [
        { value: "hay_loft", label: "Hay Loft" },
        { value: "tack_room", label: "Tack Room" },
        { value: "wash_bay", label: "Wash Bay" },
        { value: "feed_room", label: "Feed / Vet Supply Room" },
        { value: "center_aisle", label: "Center Aisle" },
        { value: "lean_to", label: "Lean-To / Run-In Shed Addition" },
        { value: "bathroom", label: "Bathroom / Restroom" },
        { value: "living_quarters", label: "Apartment / Living Quarters" },
        { value: "arena_connection", label: "Indoor Arena Connection" },
      ],
    },
    {
      id: "clearSpanWidth",
      label: "Clear Span Width",
      type: "radio",
      options: [
        { value: "up_to_30", label: "Up to 30 ft" },
        { value: "30_to_50", label: "30–50 ft" },
        { value: "50_to_80", label: "50–80 ft" },
        { value: "over_80", label: "Over 80 ft" },
      ],
    },
  ],
};

// ── POLE_BARN ─────────────────────────────────────────────────────────────────

const STEP_POLE_BARN_CONFIG: QuestionStep = {
  id: "pole_barn_config",
  title: "Pole Barn Configuration",
  description: "Define your post-frame structure",
  questions: [
    {
      id: "poleBarnUse",
      label: "Primary Use",
      type: "multiselect",
      options: [
        { value: "equipment_storage", label: "Equipment / Vehicle Storage" },
        { value: "livestock", label: "Livestock Housing" },
        { value: "hay_storage", label: "Hay / Feed Storage" },
        { value: "shop_workspace", label: "Workshop / Metal Shop" },
        { value: "commercial", label: "Commercial / Light Industrial" },
        { value: "garage", label: "Garage" },
        { value: "event", label: "Event / Entertainment Space" },
      ],
    },
    {
      id: "sidewallHeight",
      label: "Sidewall Height",
      type: "radio",
      required: true,
      options: [
        { value: "10", label: "10 ft — standard ag / storage" },
        { value: "12", label: "12 ft — standard shop / garage" },
        { value: "14", label: "14 ft — tall vehicles / RV" },
        { value: "16", label: "16 ft — heavy equipment" },
        { value: "18_plus", label: "18 ft+ — commercial / industrial" },
      ],
    },
    {
      id: "poleSpacing",
      label: "Post Spacing",
      type: "radio",
      options: [
        { value: "8", label: "8 ft on center (lighter loads)" },
        { value: "10", label: "10 ft on center" },
        { value: "12", label: "12 ft on center (standard)" },
        { value: "14_16", label: "14–16 ft on center (wide bays)" },
      ],
    },
    {
      id: "poleBarnEnclosure",
      label: "Enclosure Level",
      type: "radio",
      options: [
        { value: "fully_enclosed", label: "Fully Enclosed" },
        { value: "open_sides", label: "Open Sides (roof only)" },
        { value: "partial", label: "Partial — one or two enclosed sides" },
        { value: "mixed", label: "Mixed — enclosed shop + open lean-to" },
      ],
    },
    {
      id: "poleBarnOptions",
      label: "Additional Options",
      type: "multiselect",
      options: [
        { value: "lean_to", label: "Lean-To Attachment" },
        { value: "overhead_door_12", label: "12 ft Overhead Door" },
        { value: "overhead_door_14", label: "14 ft Overhead Door (RV / equipment)" },
        { value: "wainscot", label: "Steel Wainscot Interior Liner" },
        { value: "cupola", label: "Cupola / Roof Ventilator" },
        { value: "ridge_vent", label: "Ridge Vent" },
        { value: "concrete_floor", label: "Concrete Floor (partial or full)" },
        { value: "insulated", label: "Insulated Walls & Ceiling" },
      ],
    },
  ],
};

// ── SHED ──────────────────────────────────────────────────────────────────────

const STEP_SHED_CONFIG: QuestionStep = {
  id: "shed_config",
  title: "Shed Configuration",
  description: "Define your shed's use and features",
  questions: [
    {
      id: "shedPrimaryUse",
      label: "Primary Use",
      type: "multiselect",
      options: [
        { value: "general_storage", label: "General Storage" },
        { value: "lawn_garden", label: "Lawn & Garden / Potting Shed" },
        { value: "workshop", label: "Workshop / Hobby Room" },
        { value: "tool_storage", label: "Tool Storage" },
        { value: "pool_equipment", label: "Pool House / Equipment Storage" },
        { value: "firewood", label: "Firewood / Wood Storage" },
        { value: "chicken_coop", label: "Chicken Coop / Backyard Animals" },
        { value: "she_shed", label: "She Shed / Studio / Retreat" },
        { value: "kids_playhouse", label: "Kids Playhouse" },
      ],
    },
    {
      id: "shedDoor",
      label: "Door Type",
      type: "radio",
      required: true,
      options: [
        { value: "single_hinged", label: "Single Hinged Door" },
        { value: "double_hinged", label: "Double Hinged Doors" },
        { value: "roll_up", label: "Roll-Up Door" },
        { value: "sliding", label: "Sliding Barn Door" },
        { value: "french_doors", label: "French / Glass Doors" },
      ],
    },
    {
      id: "shedFloor",
      label: "Floor Type",
      type: "radio",
      options: [
        { value: "wood_floor", label: "Pressure-Treated Wood Floor" },
        { value: "concrete_slab", label: "Concrete Slab" },
        { value: "gravel", label: "Gravel / Compacted Base" },
        { value: "no_floor", label: "No Floor (bare ground)" },
      ],
    },
    {
      id: "shedFeatures",
      label: "Additional Features",
      type: "multiselect",
      options: [
        { value: "loft", label: "Storage Loft" },
        { value: "workbench", label: "Built-In Workbench" },
        { value: "shelving", label: "Built-In Shelving" },
        { value: "skylight", label: "Skylight / Roof Window" },
        { value: "window_boxes", label: "Window Boxes / Flower Boxes" },
        { value: "ramp", label: "Entry Ramp (for mowers / equipment)" },
        { value: "electric", label: "Electrical (outlets + lighting)" },
        { value: "insulated", label: "Insulated (walls + ceiling)" },
        { value: "hvac", label: "Heating / Cooling (mini-split)" },
      ],
    },
  ],
};

// ── WORKSHOP ──────────────────────────────────────────────────────────────────

const STEP_WORKSHOP_CONFIG: QuestionStep = {
  id: "workshop_config",
  title: "Workshop Configuration",
  description: "Define your workshop's functional requirements",
  questions: [
    {
      id: "workshopType",
      label: "Workshop Type",
      type: "multiselect",
      options: [
        { value: "woodworking", label: "Woodworking / Carpentry" },
        { value: "metalworking", label: "Metal Fabrication / Welding" },
        { value: "auto_mechanics", label: "Automotive / Mechanics" },
        { value: "general_hobby", label: "General Hobby / Crafts" },
        { value: "commercial_light", label: "Light Commercial / Trade Use" },
        { value: "studio_art", label: "Art Studio / Maker Space" },
      ],
    },
    {
      id: "electricalService",
      label: "Electrical Service Size",
      type: "radio",
      required: true,
      options: [
        { value: "100a", label: "100A / 120-240V (light hobby use)" },
        { value: "200a", label: "200A / 120-240V (standard workshop)" },
        { value: "200a_3phase", label: "200A / 3-Phase (commercial tools)" },
        { value: "400a", label: "400A (heavy commercial)" },
      ],
    },
    {
      id: "ceilingHeight",
      label: "Interior Clearance Height",
      type: "radio",
      required: true,
      options: [
        { value: "9_10", label: "9–10 ft (standard)" },
        { value: "12", label: "12 ft (shop height)" },
        { value: "14", label: "14 ft (tall equipment)" },
        { value: "16_plus", label: "16 ft+ (industrial / vehicle lifts)" },
      ],
    },
    {
      id: "workshopFeatures",
      label: "Workshop Features",
      type: "multiselect",
      options: [
        { value: "overhead_door_10", label: "10 ft Overhead Door" },
        { value: "overhead_door_12", label: "12 ft Overhead Door" },
        { value: "floor_drain", label: "Floor Drain" },
        { value: "compressed_air", label: "Compressed Air Rough-In" },
        { value: "dust_collection", label: "Dust Collection Rough-In" },
        { value: "spray_booth", label: "Spray Booth / Paint Area" },
        { value: "car_lift", label: "Car Lift Pit / Rough-In" },
        { value: "loft_storage", label: "Storage Loft" },
        { value: "hvac", label: "Heating / Cooling" },
        { value: "epoxy_floor", label: "Epoxy / Sealed Concrete Floor" },
      ],
    },
  ],
};

// ── GARAGE ────────────────────────────────────────────────────────────────────

const STEP_GARAGE_CONFIG: QuestionStep = {
  id: "garage_config",
  title: "Garage Configuration",
  description: "Define your garage layout and features",
  questions: [
    {
      id: "garageBays",
      label: "Number of Bays",
      type: "radio",
      required: true,
      options: [
        { value: "1", label: "1 Bay (single car)" },
        { value: "2", label: "2 Bays (standard)" },
        { value: "3", label: "3 Bays" },
        { value: "4", label: "4 Bays" },
        { value: "rv", label: "RV / Oversized Bay" },
        { value: "tandem", label: "Tandem (deep single lane)" },
      ],
    },
    {
      id: "garageDoorType",
      label: "Garage Door Style",
      type: "radio",
      required: true,
      options: [
        { value: "sectional_standard", label: "Sectional Steel (standard)" },
        { value: "sectional_insulated", label: "Sectional Insulated" },
        { value: "carriage_style", label: "Carriage Style (decorative)" },
        { value: "glass_aluminum", label: "Full-View Glass & Aluminum (modern)" },
        { value: "wood", label: "Custom Wood" },
      ],
    },
    {
      id: "garageFinishLevel",
      label: "Interior Finish Level",
      type: "radio",
      required: true,
      options: [
        { value: "unfinished", label: "Unfinished (exposed framing)" },
        { value: "drywalled", label: "Drywalled & Painted" },
        { value: "fully_finished", label: "Fully Finished (like living space)" },
        { value: "commercial_grade", label: "Commercial Grade (epoxy / sealed)" },
      ],
    },
    {
      id: "garageFeatures",
      label: "Additional Features",
      type: "multiselect",
      options: [
        { value: "living_above", label: "Living Space / ADU Above Garage" },
        { value: "floor_drain", label: "Floor Drain" },
        { value: "floor_heat", label: "In-Floor Radiant Heat" },
        { value: "mini_split", label: "Mini-Split HVAC" },
        { value: "ev_charger", label: "EV Charger Rough-In" },
        { value: "car_lift", label: "Car Lift Rough-In" },
        { value: "workbench", label: "Built-In Workbench" },
        { value: "overhead_storage", label: "Overhead Storage Loft" },
        { value: "sink", label: "Utility Sink" },
        { value: "man_door", label: "Side Man Door + Keypad" },
      ],
    },
  ],
};

// ── QUONSET_HUT ───────────────────────────────────────────────────────────────

const STEP_QUONSET_CONFIG: QuestionStep = {
  id: "quonset_config",
  title: "Quonset Hut Configuration",
  description: "Define your arch-rib steel structure",
  questions: [
    {
      id: "quonsetSpan",
      label: "Arch Span Width",
      type: "radio",
      required: true,
      options: [
        { value: "20", label: "20 ft span" },
        { value: "30", label: "30 ft span" },
        { value: "40", label: "40 ft span" },
        { value: "50", label: "50 ft span" },
        { value: "60_plus", label: "60 ft+ span" },
      ],
    },
    {
      id: "quonsetEndwall",
      label: "Endwall Type",
      type: "radio",
      required: true,
      options: [
        { value: "steel_flush", label: "Steel Flush Endwall" },
        { value: "framed_wood", label: "Framed Wood Endwall" },
        { value: "framed_insulated", label: "Framed Insulated Endwall" },
        { value: "open", label: "Open Endwalls (canopy / shade only)" },
      ],
    },
    {
      id: "quonsetUse",
      label: "Primary Use",
      type: "multiselect",
      options: [
        { value: "storage", label: "Storage (equipment, hay, materials)" },
        { value: "workshop", label: "Workshop / Manufacturing" },
        { value: "agricultural", label: "Agricultural" },
        { value: "hangar", label: "Aircraft Hangar" },
        { value: "residential", label: "Residential / Living" },
        { value: "commercial", label: "Commercial / Retail" },
      ],
    },
    {
      id: "quonsetFeatures",
      label: "Features",
      type: "multiselect",
      options: [
        { value: "insulation_spray", label: "Spray Foam Insulation" },
        { value: "insulation_liner", label: "Liner System (blanket insulation)" },
        { value: "skylights", label: "Polycarbonate Skylights" },
        { value: "overhead_door_12", label: "12 ft Overhead Door" },
        { value: "overhead_door_14", label: "14 ft Overhead Door" },
        { value: "side_entry", label: "Walk-Through Side Entry Door" },
        { value: "ventilation", label: "Ridge Ventilation" },
        { value: "concrete_floor", label: "Concrete Floor" },
      ],
    },
  ],
};

// ── SILO ──────────────────────────────────────────────────────────────────────

const STEP_SILO_CONFIG: QuestionStep = {
  id: "silo_config",
  title: "Silo Configuration",
  description: "Define your silo's dimensions and systems",
  questions: [
    {
      id: "siloPurpose",
      label: "Silo Purpose",
      type: "radio",
      required: true,
      options: [
        { value: "grain", label: "Grain Storage (corn, wheat, soybeans)" },
        { value: "silage", label: "Silage / Haylage (fermented forage)" },
        { value: "dry_feed", label: "Dry Feed / Supplement Storage" },
        { value: "bulk_liquid", label: "Bulk Liquid Storage" },
        { value: "aesthetic", label: "Repurpose / Decorative / Residential" },
      ],
    },
    {
      id: "siloDiameter",
      label: "Diameter",
      type: "radio",
      required: true,
      options: [
        { value: "12", label: "12 ft (small farm)" },
        { value: "18", label: "18 ft (mid-size)" },
        { value: "24", label: "24 ft (standard)" },
        { value: "30", label: "30 ft (large)" },
        { value: "36_plus", label: "36 ft+ (commercial)" },
      ],
    },
    {
      id: "siloHeight",
      label: "Height",
      type: "radio",
      required: true,
      options: [
        { value: "20_30", label: "20–30 ft" },
        { value: "30_50", label: "30–50 ft" },
        { value: "50_70", label: "50–70 ft" },
        { value: "70_plus", label: "70 ft+" },
      ],
    },
    {
      id: "siloMaterial",
      label: "Construction Material",
      type: "radio",
      options: [
        { value: "concrete_stave", label: "Concrete Stave (traditional)" },
        { value: "poured_concrete", label: "Cast-in-Place Concrete" },
        { value: "steel", label: "Steel / Corrugated Metal" },
        { value: "fiberglass", label: "Fiberglass / Polymer" },
      ],
    },
    {
      id: "siloSystems",
      label: "Systems & Equipment",
      type: "multiselect",
      options: [
        { value: "aeration", label: "Aeration / Temperature Management" },
        { value: "sweep_auger", label: "Sweep Auger" },
        { value: "unloading_system", label: "Unloading / Conveying System" },
        { value: "monitor", label: "Grain Temperature Monitoring" },
        { value: "fill_chute", label: "Fill Chute / Distributor" },
        { value: "access_ladder", label: "Interior Access Ladder + Safety Cage" },
      ],
    },
  ],
};

// ── EARTHSHIP ─────────────────────────────────────────────────────────────────

const STEP_EARTHSHIP_CONFIG: QuestionStep = {
  id: "earthship_config",
  title: "Earthship Configuration",
  description: "Define your off-grid earthship features",
  questions: [
    {
      id: "earthshipConstruction",
      label: "Primary Construction Method",
      type: "radio",
      required: true,
      options: [
        { value: "tire_rammed", label: "Tire Rammed Earth (classic Earthship)" },
        { value: "cob", label: "Cob (clay / sand / straw)" },
        { value: "adobe", label: "Adobe Block" },
        { value: "rammed_earth_form", label: "Rammed Earth (formed wall system)" },
        { value: "hybrid", label: "Hybrid (tire + conventional framing)" },
      ],
    },
    {
      id: "earthBermLevel",
      label: "Earth Berm / Burial",
      type: "radio",
      required: true,
      options: [
        { value: "full_berm", label: "Full Berm (3 sides buried into hillside)" },
        { value: "partial_berm", label: "Partial Berm (rear + two sides)" },
        { value: "rear_only", label: "Rear Berm Only" },
        { value: "no_berm", label: "No Berm (standalone structure)" },
      ],
    },
    {
      id: "earthshipSolar",
      label: "South-Facing Passive Solar Wall",
      type: "radio",
      required: true,
      options: [
        { value: "angled_greenhouse", label: "Angled Greenhouse / Sunspace (classic Earthship)" },
        { value: "vertical_glass", label: "Vertical Glass Wall (simplified)" },
        { value: "minimal_glass", label: "Minimal Glass (cold climate adaptation)" },
      ],
    },
    {
      id: "earthshipSystems",
      label: "Earthship Systems & Features",
      type: "multiselect",
      options: [
        { value: "integrated_planters", label: "Integrated Indoor Food Planters" },
        { value: "rainwater_catchment", label: "Rainwater Catchment + Cistern" },
        { value: "greywater_cells", label: "Interior Greywater Botanical Cells" },
        { value: "blackwater_cells", label: "Exterior Blackwater Botanical Cells" },
        { value: "solar_battery", label: "Solar Panels + Battery Bank" },
        { value: "wind_turbine", label: "Wind Turbine" },
        { value: "thermal_mass", label: "Enhanced Thermal Mass (heavy masonry)" },
        { value: "earthen_plaster", label: "Earthen / Clay Plaster Interior Finish" },
        { value: "bottle_walls", label: "Bottle Walls / Glass Block Features" },
        { value: "living_roof", label: "Living / Green Roof" },
      ],
    },
  ],
};

// ── PASSIVE_SOLAR ─────────────────────────────────────────────────────────────

const STEP_PASSIVE_SOLAR_CONFIG: QuestionStep = {
  id: "passive_solar_config",
  title: "Passive Solar Design",
  description: "Define your passive solar heating and cooling strategy",
  questions: [
    {
      id: "southGlazingPercent",
      label: "South-Facing Glazing (% of south wall area)",
      type: "radio",
      required: true,
      options: [
        { value: "20_30", label: "20–30% (conservative / supplemental)" },
        { value: "40_60", label: "40–60% (standard passive solar)" },
        { value: "60_80", label: "60–80% (high solar gain)" },
        { value: "over_80", label: "80%+ (sunspace / solar wall)" },
      ],
    },
    {
      id: "thermalMassType",
      label: "Thermal Mass (select all planned)",
      type: "multiselect",
      options: [
        { value: "concrete_slab", label: "Exposed Concrete Slab" },
        { value: "tile_floor", label: "Tile over Concrete" },
        { value: "masonry_wall", label: "Masonry / Brick Interior Walls" },
        { value: "trombe_wall", label: "Trombe Wall (glazed masonry collector)" },
        { value: "water_wall", label: "Water Thermal Mass (tubes / tanks)" },
        { value: "phase_change", label: "Phase Change Materials (PCM)" },
      ],
    },
    {
      id: "passiveCooling",
      label: "Passive Cooling Strategy",
      type: "multiselect",
      options: [
        { value: "overhangs", label: "Deep Roof Overhangs (summer shading)" },
        { value: "clerestory", label: "Clerestory Windows (stack ventilation)" },
        { value: "cross_ventilation", label: "Cross-Ventilation Window Layout" },
        { value: "earth_tubes", label: "Earth / Ground Cooling Tubes" },
        { value: "whole_house_fan", label: "Whole House Fan" },
        { value: "exterior_shading", label: "Exterior Shading Devices / Fins" },
      ],
    },
    {
      id: "passiveSolarFeatures",
      label: "Additional Passive Solar Features",
      type: "multiselect",
      options: [
        { value: "sunspace", label: "Sunspace / Solar Greenhouse Addition" },
        { value: "earth_berming", label: "Earth Berming (north + east side)" },
        { value: "sip_envelope", label: "SIP Panel Building Envelope" },
        { value: "triple_glazing", label: "Triple-Pane Windows (south)" },
        { value: "r30_walls", label: "R-30+ Wall Insulation Target" },
        { value: "r60_ceiling", label: "R-60+ Ceiling Insulation Target" },
        { value: "net_zero", label: "Net-Zero Energy Goal" },
        { value: "hers_rated", label: "HERS Rating / Energy Audit Targeted" },
      ],
    },
  ],
};

// ─── Assembly function ─────────────────────────────────────────────────────────

export function getStepsForStructure(type: StructureType): QuestionStep[] {
  switch (type) {
    case "SINGLE_FAMILY_HOME":
      return [
        STEP_BASICS,
        STEP_SIZE,
        STEP_ROOMS,
        STEP_HOME_FEATURES,
        STEP_FOUNDATION,
        STEP_EXTERIOR,
        STEP_UTILITIES,
        STEP_SUSTAINABILITY,
        STEP_BUDGET,
      ];

    case "LOG_CABIN":
      return [
        STEP_BASICS,
        STEP_SIZE,
        STEP_LOG_CONFIG,
        STEP_ROOMS_CABIN,
        STEP_FOUNDATION,
        STEP_EXTERIOR,
        STEP_UTILITIES,
        STEP_BUDGET,
      ];

    case "A_FRAME":
      return [
        STEP_BASICS,
        STEP_SIZE,
        STEP_AFRAME_CONFIG,
        STEP_ROOMS_CABIN,
        STEP_FOUNDATION,
        STEP_UTILITIES,
        STEP_BUDGET,
      ];

    case "TINY_HOME":
      return [
        STEP_BASICS,
        STEP_SIZE_OUTBUILDING,
        STEP_TINY_CONFIG,
        STEP_FOUNDATION_SIMPLE,
        STEP_UTILITIES,
        STEP_SUSTAINABILITY,
        STEP_BUDGET,
      ];

    case "DOME_HOME":
      return [
        STEP_BASICS,
        STEP_SIZE,
        STEP_DOME_CONFIG,
        STEP_ROOMS,
        STEP_FOUNDATION,
        STEP_UTILITIES,
        STEP_SUSTAINABILITY,
        STEP_BUDGET,
      ];

    case "CONTAINER_HOME":
      return [
        STEP_BASICS,
        STEP_SIZE,
        STEP_CONTAINER_CONFIG,
        STEP_ROOMS,
        STEP_FOUNDATION,
        STEP_EXTERIOR,
        STEP_UTILITIES,
        STEP_SUSTAINABILITY,
        STEP_BUDGET,
      ];

    case "BARNDOMINIUM":
      return [
        STEP_BASICS,
        STEP_SIZE,
        STEP_BARNDO_LIVING,
        STEP_BARNDO_SHOP,
        STEP_FOUNDATION,
        STEP_EXTERIOR_AGRICULTURAL,
        STEP_UTILITIES,
        STEP_SUSTAINABILITY,
        STEP_BUDGET,
      ];

    case "BARN":
      return [
        STEP_BASICS,
        STEP_SIZE_OUTBUILDING,
        STEP_BARN_CONFIG,
        STEP_FOUNDATION_SIMPLE,
        STEP_EXTERIOR_AGRICULTURAL,
        STEP_UTILITIES_OUTBUILDING,
        STEP_BUDGET,
      ];

    case "POLE_BARN":
      return [
        STEP_BASICS,
        STEP_SIZE_OUTBUILDING,
        STEP_POLE_BARN_CONFIG,
        STEP_FOUNDATION_SIMPLE,
        STEP_EXTERIOR_AGRICULTURAL,
        STEP_UTILITIES_OUTBUILDING,
        STEP_BUDGET,
      ];

    case "SHED":
      return [
        STEP_BASICS,
        STEP_SIZE_OUTBUILDING,
        STEP_SHED_CONFIG,
        STEP_FOUNDATION_SIMPLE,
        STEP_BUDGET_SMALL,
      ];

    case "WORKSHOP":
      return [
        STEP_BASICS,
        STEP_SIZE_OUTBUILDING,
        STEP_WORKSHOP_CONFIG,
        STEP_FOUNDATION,
        STEP_EXTERIOR,
        STEP_BUDGET,
      ];

    case "GARAGE":
      return [
        STEP_BASICS,
        STEP_SIZE_OUTBUILDING,
        STEP_GARAGE_CONFIG,
        STEP_FOUNDATION,
        STEP_EXTERIOR,
        STEP_UTILITIES_OUTBUILDING,
        STEP_BUDGET,
      ];

    case "QUONSET_HUT":
      return [
        STEP_BASICS,
        STEP_SIZE_OUTBUILDING,
        STEP_QUONSET_CONFIG,
        STEP_FOUNDATION_SIMPLE,
        STEP_UTILITIES_OUTBUILDING,
        STEP_BUDGET,
      ];

    case "SILO":
      return [
        STEP_BASICS,
        STEP_SILO_CONFIG,
        STEP_FOUNDATION,
        STEP_BUDGET,
      ];

    case "EARTHSHIP":
      return [
        STEP_BASICS,
        STEP_SIZE,
        STEP_EARTHSHIP_CONFIG,
        STEP_ROOMS_CABIN,
        STEP_UTILITIES,
        STEP_SUSTAINABILITY,
        STEP_BUDGET,
      ];

    case "PASSIVE_SOLAR":
      return [
        STEP_BASICS,
        STEP_SIZE,
        STEP_PASSIVE_SOLAR_CONFIG,
        STEP_ROOMS,
        STEP_HOME_FEATURES,
        STEP_FOUNDATION,
        STEP_EXTERIOR,
        STEP_UTILITIES,
        STEP_SUSTAINABILITY,
        STEP_BUDGET,
      ];

    default:
      return [
        STEP_BASICS,
        STEP_SIZE,
        STEP_FOUNDATION,
        STEP_EXTERIOR,
        STEP_UTILITIES,
        STEP_BUDGET,
      ];
  }
}
