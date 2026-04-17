import { QuestionStep, StructureType } from "@/types";

// Universal steps that apply to all structure types
const UNIVERSAL_STEPS: QuestionStep[] = [
  {
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
        options: [
          { value: "AL", label: "Alabama" },
          { value: "AK", label: "Alaska" },
          { value: "AZ", label: "Arizona" },
          { value: "AR", label: "Arkansas" },
          { value: "CA", label: "California" },
          { value: "CO", label: "Colorado" },
          { value: "CT", label: "Connecticut" },
          { value: "DE", label: "Delaware" },
          { value: "FL", label: "Florida" },
          { value: "GA", label: "Georgia" },
          { value: "HI", label: "Hawaii" },
          { value: "ID", label: "Idaho" },
          { value: "IL", label: "Illinois" },
          { value: "IN", label: "Indiana" },
          { value: "IA", label: "Iowa" },
          { value: "KS", label: "Kansas" },
          { value: "KY", label: "Kentucky" },
          { value: "LA", label: "Louisiana" },
          { value: "ME", label: "Maine" },
          { value: "MD", label: "Maryland" },
          { value: "MA", label: "Massachusetts" },
          { value: "MI", label: "Michigan" },
          { value: "MN", label: "Minnesota" },
          { value: "MS", label: "Mississippi" },
          { value: "MO", label: "Missouri" },
          { value: "MT", label: "Montana" },
          { value: "NE", label: "Nebraska" },
          { value: "NV", label: "Nevada" },
          { value: "NH", label: "New Hampshire" },
          { value: "NJ", label: "New Jersey" },
          { value: "NM", label: "New Mexico" },
          { value: "NY", label: "New York" },
          { value: "NC", label: "North Carolina" },
          { value: "ND", label: "North Dakota" },
          { value: "OH", label: "Ohio" },
          { value: "OK", label: "Oklahoma" },
          { value: "OR", label: "Oregon" },
          { value: "PA", label: "Pennsylvania" },
          { value: "RI", label: "Rhode Island" },
          { value: "SC", label: "South Carolina" },
          { value: "SD", label: "South Dakota" },
          { value: "TN", label: "Tennessee" },
          { value: "TX", label: "Texas" },
          { value: "UT", label: "Utah" },
          { value: "VT", label: "Vermont" },
          { value: "VA", label: "Virginia" },
          { value: "WA", label: "Washington" },
          { value: "WV", label: "West Virginia" },
          { value: "WI", label: "Wisconsin" },
          { value: "WY", label: "Wyoming" },
        ],
      },
      {
        id: "climateZone",
        label: "Climate Zone",
        type: "select",
        required: true,
        options: [
          { value: "hot_humid", label: "Hot & Humid (Gulf Coast, SE)" },
          { value: "hot_dry", label: "Hot & Dry (Desert SW)" },
          { value: "mixed_humid", label: "Mixed Humid (Mid-Atlantic, SE)" },
          { value: "mixed_dry", label: "Mixed Dry (Mountain West)" },
          { value: "cold", label: "Cold (Midwest, NE)" },
          { value: "very_cold", label: "Very Cold (Upper Midwest, Mountain)" },
          { value: "subarctic", label: "Subarctic / Arctic (Alaska)" },
          { value: "marine", label: "Marine (Pacific Coast)" },
        ],
      },
    ],
  },
  {
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
        options: [
          { value: "flat", label: "Flat" },
          { value: "gentle_slope", label: "Gentle Slope" },
          { value: "steep_slope", label: "Steep Slope" },
          { value: "hillside", label: "Hillside / Bluff" },
          { value: "wooded", label: "Wooded" },
          { value: "wetland", label: "Near Wetland / Flood Zone" },
        ],
      },
    ],
  },
  {
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
          { value: "slab", label: "Slab on Grade" },
          { value: "crawl_space", label: "Crawl Space" },
          { value: "full_basement", label: "Full Basement" },
          { value: "walkout_basement", label: "Walkout Basement" },
          { value: "pier_beam", label: "Pier & Beam" },
          { value: "helical_piers", label: "Helical Piers (slopes/unstable soil)" },
          { value: "none", label: "No Foundation (skids/gravel)" },
        ],
      },
    ],
  },
  {
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
          { value: "gable", label: "Gable (standard A-shape)" },
          { value: "hip", label: "Hip Roof" },
          { value: "gambrel", label: "Gambrel (barn-style)" },
          { value: "shed", label: "Shed / Mono-pitch" },
          { value: "flat", label: "Flat / Low-slope" },
          { value: "metal_standing_seam", label: "Standing Seam Metal" },
          { value: "butterfly", label: "Butterfly" },
          { value: "dome", label: "Dome" },
        ],
      },
      {
        id: "roofMaterial",
        label: "Roof Material",
        type: "select",
        options: [
          { value: "asphalt_shingle", label: "Asphalt Shingle" },
          { value: "metal_panel", label: "Metal Panel" },
          { value: "standing_seam_metal", label: "Standing Seam Metal" },
          { value: "metal_shingle", label: "Metal Shingle" },
          { value: "wood_shake", label: "Wood Shake" },
          { value: "clay_tile", label: "Clay Tile" },
          { value: "concrete_tile", label: "Concrete Tile" },
          { value: "tpo_membrane", label: "TPO Membrane (flat)" },
          { value: "epdm", label: "EPDM Rubber (flat)" },
          { value: "green_roof", label: "Living / Green Roof" },
        ],
      },
      {
        id: "exteriorMaterial",
        label: "Exterior Wall Material",
        type: "select",
        options: [
          { value: "vinyl_siding", label: "Vinyl Siding" },
          { value: "fiber_cement", label: "Fiber Cement (HardiePlank)" },
          { value: "wood_siding", label: "Wood Siding" },
          { value: "brick", label: "Brick" },
          { value: "stone", label: "Stone / Faux Stone" },
          { value: "stucco", label: "Stucco" },
          { value: "metal_panel", label: "Metal Panel" },
          { value: "log", label: "Log" },
          { value: "corten_steel", label: "Corten / Weathering Steel" },
          { value: "shipping_container", label: "Shipping Container (exposed)" },
          { value: "earth", label: "Rammed Earth / Adobe" },
        ],
      },
    ],
  },
  {
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
          { value: "central_hvac", label: "Central HVAC (forced air)" },
          { value: "mini_split", label: "Mini-Split System" },
          { value: "radiant_floor", label: "Radiant Floor Heat" },
          { value: "wood_stove", label: "Wood Stove / Pellet Stove" },
          { value: "geothermal", label: "Geothermal" },
          { value: "passive", label: "Passive (no mechanical)" },
          { value: "propane_furnace", label: "Propane Furnace" },
        ],
      },
    ],
  },
  {
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
  },
  {
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
  },
];

// Structure-specific steps
const RESIDENTIAL_STEPS: QuestionStep[] = [
  {
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
  },
];

const CONTAINER_STEPS: QuestionStep[] = [
  {
    id: "containers",
    title: "Container Configuration",
    description: "Define your container layout",
    questions: [
      {
        id: "containerSize",
        label: "Container Size",
        type: "radio",
        options: [
          { value: "20ft", label: '20 ft standard (160 sq ft)' },
          { value: "40ft", label: '40 ft standard (320 sq ft)' },
          { value: "40ft_hc", label: '40 ft high-cube (340 sq ft, 9.5 ft tall)' },
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
          { value: "linear", label: "Linear / End-to-End" },
          { value: "parallel", label: "Parallel / Side-by-Side" },
          { value: "l_shape", label: "L-Shape" },
          { value: "u_shape", label: "U-Shape" },
          { value: "stacked", label: "Stacked (multi-story)" },
          { value: "mixed", label: "Mixed / Custom" },
        ],
      },
    ],
  },
];

const AGRICULTURAL_STEPS: QuestionStep[] = [
  {
    id: "agricultural",
    title: "Agricultural Use",
    description: "Define how the structure will be used",
    questions: [
      {
        id: "agriculturalUse",
        label: "Primary Use",
        type: "multiselect",
        options: [
          { value: "livestock", label: "Livestock Housing" },
          { value: "hay_storage", label: "Hay / Feed Storage" },
          { value: "equipment_storage", label: "Equipment Storage" },
          { value: "living_quarters", label: "Living Quarters" },
          { value: "shop_workspace", label: "Shop / Workspace" },
          { value: "event_venue", label: "Event Venue" },
          { value: "grain_storage", label: "Grain Storage" },
        ],
      },
      {
        id: "clearSpanWidth",
        label: "Clear Span Width Needed",
        type: "radio",
        options: [
          { value: "up_to_30", label: "Up to 30 ft" },
          { value: "30_to_50", label: "30–50 ft" },
          { value: "50_to_80", label: "50–80 ft" },
          { value: "over_80", label: "Over 80 ft" },
        ],
      },
    ],
  },
];

export function getStepsForStructure(type: StructureType): QuestionStep[] {
  const residential = [
    "SINGLE_FAMILY_HOME",
    "TINY_HOME",
    "LOG_CABIN",
    "A_FRAME",
    "DOME_HOME",
    "EARTHSHIP",
    "PASSIVE_SOLAR",
    "BARNDOMINIUM",
  ];
  const container = ["CONTAINER_HOME"];
  const agricultural = ["BARN", "POLE_BARN", "BARNDOMINIUM", "SILO"];

  const steps: QuestionStep[] = [];

  if (residential.includes(type)) {
    steps.push(...RESIDENTIAL_STEPS);
  }
  if (container.includes(type)) {
    steps.push(...CONTAINER_STEPS);
  }
  if (agricultural.includes(type)) {
    steps.push(...AGRICULTURAL_STEPS);
  }

  return [...steps, ...UNIVERSAL_STEPS];
}
