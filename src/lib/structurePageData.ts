export interface StructurePageData {
  slug: string;
  value: string;
  label: string;
  tagline: string;
  metaDescription: string;
  heroImage: string;
  overview: string;
  typicalSize: string;
  costRange: string;
  timelineToBuild: string;
  keyFeatures: string[];
  idealFor: string[];
  permitNotes: string;
  documentsNeeded: string[];
  faqs: { q: string; a: string }[];
}

export const STRUCTURE_PAGE_DATA: StructurePageData[] = [
  {
    slug: "single-family-home",
    value: "SINGLE_FAMILY_HOME",
    label: "Single Family Home",
    tagline: "Complete blueprints and bid docs for your custom home build",
    metaDescription:
      "Get professional blueprints, material lists, spec sheets, and contractor bid documents for your single family home — in an afternoon, not weeks.",
    heroImage:
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
    overview:
      "A single family home is the most common and most documented build type in the country. Whether you're planning a 1,200 sq ft starter home or a 3,500 sq ft custom build, the document requirements are substantial — and expensive if you hire a traditional architecture firm. Buildwell generates every document you need from a guided questionnaire, typically in under 30 minutes.",
    typicalSize: "1,200–4,000 sq ft",
    costRange: "$150–$350 per sq ft",
    timelineToBuild: "6–18 months depending on size and complexity",
    keyFeatures: [
      "Stick-frame or modular construction options",
      "Full foundation options: slab, crawlspace, or basement",
      "Single or two-story configurations",
      "Custom room layouts and bedroom/bath counts",
      "Garage integration (attached or detached)",
      "Utility systems: HVAC, plumbing, electrical",
    ],
    idealFor: [
      "Owner-builders and DIY homebuilders",
      "First-time custom home builders",
      "Contractors scoping client projects",
      "Rural property developers",
    ],
    permitNotes:
      "Most jurisdictions require stamped engineering drawings and permit applications for new single family construction. Buildwell documents are designed to support permit prep — your local building department will specify if a licensed engineer must stamp drawings for your county.",
    documentsNeeded: [
      "Floor plan with room dimensions",
      "Elevation drawings (4 sides)",
      "Foundation and framing plan",
      "Electrical, plumbing, and HVAC layouts",
      "Material and specification list",
      "Contractor bid package",
    ],
    faqs: [
      {
        q: "How long does it take to get my documents?",
        a: "After completing the guided questionnaire (typically 15–30 minutes), your documents are generated and available for purchase immediately.",
      },
      {
        q: "Can I use these documents to pull a building permit?",
        a: "Buildwell documents are professional-grade and designed to support permit applications. Requirements vary by county — some require a licensed engineer's stamp, which we note clearly in the document package.",
      },
      {
        q: "What if I want to make changes to the layout?",
        a: "You can return and regenerate documents with updated answers at any time. Each generation is treated as a new project.",
      },
      {
        q: "Do I need an architect?",
        a: "For most single family homes under 3,500 sq ft, Buildwell documents replace the need for expensive architectural drawings for documentation purposes. Your jurisdiction may still require a licensed engineer for structural review.",
      },
    ],
  },
  {
    slug: "container-home",
    value: "CONTAINER_HOME",
    label: "Container Home",
    tagline: "Design documents for your shipping container home build",
    metaDescription:
      "Get blueprints, spec sheets, and bid documents for your container home. ISO and Connex container configurations, custom layouts, full document package.",
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    overview:
      "Container homes use repurposed ISO or Connex shipping containers as the primary structural element. They're increasingly popular for their lower material cost, speed of construction, and unique aesthetic. But they still require full construction documentation — especially for permits, which many counties handle on a case-by-case basis for non-traditional structures.",
    typicalSize: "160–2,400 sq ft (1–12 containers)",
    costRange: "$100–$250 per sq ft finished",
    timelineToBuild: "3–12 months depending on container count and finish level",
    keyFeatures: [
      "Single or multi-container configurations",
      "Standard 20ft and 40ft container options",
      "High-cube containers for extra headroom",
      "Custom cutout layouts for doors and windows",
      "Insulation and vapor barrier details",
      "Foundation: slab, pier, or grade beam",
    ],
    idealFor: [
      "Off-grid and sustainable living enthusiasts",
      "Budget-conscious custom home builders",
      "Short-term rental property developers",
      "Remote site builds with logistics constraints",
    ],
    permitNotes:
      "Container homes face additional permit scrutiny in many jurisdictions. Your documents should include engineering notes about container structural capacity and any modifications (cutouts, stacking). Some counties classify container homes as manufactured housing.",
    documentsNeeded: [
      "Container layout plan with cutout locations",
      "Foundation and anchoring plan",
      "Insulation and weatherproofing spec",
      "Electrical and plumbing rough-in",
      "Material list for finish work",
      "Contractor bid package",
    ],
    faqs: [
      {
        q: "How many containers do I need for a livable home?",
        a: "A single 40ft high-cube container gives you roughly 320 sq ft — enough for a studio. Most comfortable single-family layouts use 2–4 containers.",
      },
      {
        q: "Are container homes hard to permit?",
        a: "It varies significantly by county. Some treat them like conventional structures; others require additional engineering review. Buildwell documents include notes to support permit discussions with your local department.",
      },
      {
        q: "What foundation type works best for container homes?",
        a: "Concrete pier foundations are most common for container homes — they allow moisture drainage under the structure and are cost-effective. Buildwell supports all foundation types.",
      },
    ],
  },
  {
    slug: "tiny-home",
    value: "TINY_HOME",
    label: "Tiny Home",
    tagline: "Professional documents for your tiny home — on foundation or wheels",
    metaDescription:
      "Tiny home blueprints, material lists, and bid documents. Foundation-based or THOW configurations. Get your full document package in an afternoon.",
    heroImage:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
    overview:
      "Tiny homes pack a surprisingly complex build into under 400 square feet. Whether you're building on a foundation or a trailer (THOW), the structural, electrical, and plumbing requirements are the same as any home — just smaller. Efficient layout planning and precise material lists matter even more when you're working with limited space.",
    typicalSize: "120–400 sq ft",
    costRange: "$200–$450 per sq ft (high due to custom fittings)",
    timelineToBuild: "2–8 months for most builds",
    keyFeatures: [
      "Foundation-based or trailer (THOW) configuration",
      "Loft sleeping area options",
      "Murphy bed and fold-out furniture layouts",
      "Mini-split HVAC or wood stove options",
      "Composting toilet and greywater options",
      "Off-grid solar and battery system notes",
    ],
    idealFor: [
      "Minimalist lifestyle seekers",
      "Accessory dwelling unit (ADU) builders",
      "Vacation or seasonal retreat builds",
      "First-time owner-builders on tight budgets",
    ],
    permitNotes:
      "Foundation tiny homes are permitted as conventional structures in most jurisdictions. Trailer-based tiny homes (THOWs) fall into a regulatory gray area — some states classify them as RVs, others as manufactured housing. Check your local zoning for minimum square footage requirements.",
    documentsNeeded: [
      "Compact floor plan with multi-use areas",
      "Loft framing and access plan",
      "Foundation or trailer specs",
      "Mini systems: electrical, plumbing, HVAC",
      "Material list optimized for small builds",
      "Bid package for finish contractors",
    ],
    faqs: [
      {
        q: "What's the difference between a tiny home on wheels and a foundation tiny home?",
        a: "A THOW (Tiny House on Wheels) is built on a trailer and classified as a vehicle in many states. A foundation tiny home is a permanent structure subject to standard building codes.",
      },
      {
        q: "Can I put a tiny home on my existing property as an ADU?",
        a: "In many jurisdictions, yes — ADU rules have relaxed significantly in recent years. A tiny home as an ADU typically needs to meet local setback, utility connection, and minimum size requirements.",
      },
    ],
  },
  {
    slug: "barndominium",
    value: "BARNDOMINIUM",
    label: "Barndominium",
    tagline: "Barndominium plans and documents — from shell to finished interior",
    metaDescription:
      "Get full construction documents for your barndominium. Floor plans, material lists, and bid packages for combined barn and living space builds.",
    heroImage:
      "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=1200&q=80",
    overview:
      "A barndominium combines a metal or post-frame barn structure with a residential living space. It's one of the fastest-growing build categories in rural America — offering large open spans, lower cost per square foot, and faster construction timelines than traditional stick-frame homes. The hybrid nature of the build requires careful documentation for both the shop/barn and the residential portions.",
    typicalSize: "1,500–6,000 sq ft total (varies widely)",
    costRange: "$95–$200 per sq ft",
    timelineToBuild: "4–12 months",
    keyFeatures: [
      "Post-frame or metal building primary structure",
      "Integrated shop/barn and living area",
      "Open-concept living with high ceilings",
      "Roll-up doors for shop or garage access",
      "Full residential systems in living zone",
      "Optional mezzanine or loft storage",
    ],
    idealFor: [
      "Rural property owners with land",
      "Hobbyists needing workshop and living space",
      "Small farm and agriculture operations",
      "Budget-conscious large-footprint builders",
    ],
    permitNotes:
      "Barndominiums are generally permitted as hybrid residential/agricultural structures. The residential portion must meet residential code; the barn portion may fall under agricultural exemptions depending on your county. Buildwell documents clearly delineate both zones.",
    documentsNeeded: [
      "Combined floor plan (living + shop zones)",
      "Post-frame structural summary",
      "Residential systems layout (plumbing, electrical, HVAC)",
      "Material list separated by zone",
      "Roll-up door and opening schedule",
      "Contractor bid package",
    ],
    faqs: [
      {
        q: "Are barndominiums cheaper to build than traditional homes?",
        a: "Generally yes — post-frame construction is faster and the metal building shell is less expensive than stick framing. The savings are most significant on larger footprints.",
      },
      {
        q: "Can I get a mortgage on a barndominium?",
        a: "Yes, but it can be more complicated. Many lenders treat barndominiums as standard residential properties; others require specialized rural or agricultural loans.",
      },
      {
        q: "How do I separate the shop from the living area in my documents?",
        a: "Buildwell's questionnaire asks about your zone split — living area size, shop/barn size, and the connection between them. Your documents clearly label both portions.",
      },
    ],
  },
  {
    slug: "barn",
    value: "BARN",
    label: "Barn",
    tagline: "Agricultural barn plans and construction documents",
    metaDescription:
      "Professional barn construction documents. Floor plans, framing specs, and material lists for agricultural storage and livestock barns.",
    heroImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    overview:
      "A well-designed barn is a serious investment that will serve your property for decades. Whether you're building for livestock, hay storage, equipment, or a combination, proper construction documents ensure you're building to code, ordering the right materials, and getting accurate bids from contractors.",
    typicalSize: "1,200–10,000 sq ft",
    costRange: "$25–$75 per sq ft",
    timelineToBuild: "2–6 months",
    keyFeatures: [
      "Gable, gambrel, or monitor roof options",
      "Stall configurations for horses and livestock",
      "Hay loft and storage mezzanine options",
      "Large drive-through openings",
      "Sliding or swing door options",
      "Ventilation ridge cap and cupola details",
    ],
    idealFor: [
      "Horse and livestock operations",
      "Hay and equipment storage",
      "Small farm operations",
      "Rural homesteads",
    ],
    permitNotes:
      "Agricultural structures in rural areas often qualify for agricultural exemptions from standard building codes. However, larger barns, barns with electrical service, or barns near residential structures may still require permits. Check your county's agricultural exemption thresholds.",
    documentsNeeded: [
      "Floor plan with stall and door layout",
      "Roof framing and truss summary",
      "Foundation and site preparation notes",
      "Electrical and water rough-in (if applicable)",
      "Material list and lumber schedule",
      "Contractor bid package",
    ],
    faqs: [
      {
        q: "Do I need a permit for an agricultural barn?",
        a: "Many rural counties have agricultural exemptions that allow barn construction without a standard building permit. Exemption thresholds vary — typically by acreage and use type.",
      },
      {
        q: "What roof style works best for a barn?",
        a: "Gable roofs are the most common and economical. Gambrel roofs maximize loft storage space. Monitor (raised center) roofs provide excellent ventilation for livestock.",
      },
    ],
  },
  {
    slug: "pole-barn",
    value: "POLE_BARN",
    label: "Pole Barn",
    tagline: "Pole barn plans and documents — fast, affordable post-frame construction",
    metaDescription:
      "Get pole barn construction documents including floor plans, post-frame framing specs, and material lists. The most economical large structure option.",
    heroImage:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
    overview:
      "Pole barns (post-frame buildings) are the most economical way to build a large structure. The technique uses vertical posts embedded in the ground or set on concrete piers, eliminating the need for a full perimeter foundation. This makes pole barns fast to build, highly versatile, and very affordable — ideal for equipment storage, workshops, event venues, or agricultural use.",
    typicalSize: "1,000–20,000+ sq ft",
    costRange: "$15–$55 per sq ft",
    timelineToBuild: "1–4 months",
    keyFeatures: [
      "Posts embedded or surface-mounted on concrete",
      "No perimeter foundation required",
      "Wide clear-span interiors (60ft+ possible)",
      "Metal or wood siding and roofing options",
      "Large sliding, swing, or roll-up doors",
      "Easily expandable with additional bays",
    ],
    idealFor: [
      "Equipment and vehicle storage",
      "Agricultural operations",
      "Workshops and hobby spaces",
      "Event venues and riding arenas",
    ],
    permitNotes:
      "Pole barns in agricultural zones often qualify for agricultural building exemptions. In residential or commercial zones, standard building permits apply. Post-frame buildings have well-established engineering standards (NFBA guidelines) that support permitting.",
    documentsNeeded: [
      "Bay layout and post spacing plan",
      "Post-frame framing summary",
      "Door and opening schedule",
      "Roof and gutter plan",
      "Material and hardware list",
      "Bid package for post-frame contractors",
    ],
    faqs: [
      {
        q: "What's the difference between a pole barn and a steel building?",
        a: "A pole barn uses wood posts as the primary structural element. A steel building uses a pre-engineered metal frame. Pole barns are typically cheaper for smaller sizes; steel buildings become more competitive on large clear-span designs.",
      },
      {
        q: "Can a pole barn be converted to living space?",
        a: "Yes, but it requires significant modification — insulation, vapor barrier, utilities, and often a concrete floor. A barndominium starts with this end use in mind and is better planned from the beginning.",
      },
    ],
  },
  {
    slug: "log-cabin",
    value: "LOG_CABIN",
    label: "Log Cabin",
    tagline: "Log cabin construction documents for traditional and modern log builds",
    metaDescription:
      "Professional log cabin plans, material lists, and bid documents. Traditional handcrafted or milled log construction. Full document package in an afternoon.",
    heroImage:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    overview:
      "Log cabins range from rustic handcrafted structures to precision-milled contemporary log homes. Both approaches require detailed documentation for structural performance, thermal performance, and permitting. Log construction has unique considerations — settling, chinking, and moisture management — that must be addressed in your construction documents.",
    typicalSize: "600–3,500 sq ft",
    costRange: "$175–$400 per sq ft",
    timelineToBuild: "6–24 months (kit homes faster, handcrafted longer)",
    keyFeatures: [
      "Handcrafted or milled log options",
      "Round or D-profile log selection",
      "Full scribe or chinkless joinery",
      "Settling allowance details in framing",
      "Roof options: gable, hip, shed",
      "Traditional or modern interior layouts",
    ],
    idealFor: [
      "Mountain retreat and vacation property builds",
      "Off-grid or remote location builds",
      "Buyers of log home kit packages",
      "Homesteaders and traditional lifestyle builders",
    ],
    permitNotes:
      "Log homes require specific attention to thermal envelope compliance (energy codes) since logs provide lower insulation R-values than insulated frame walls. Your building department may require energy calculations. Structural settling must be documented for door and window frames.",
    documentsNeeded: [
      "Floor plan with log wall notation",
      "Elevation drawings with log profile",
      "Foundation plan (full basement or slab common)",
      "Settling allowance details",
      "Chinking and weatherproofing spec",
      "Material list and log schedule",
    ],
    faqs: [
      {
        q: "Should I buy a log home kit or build from scratch?",
        a: "Kit homes are faster and have pre-engineered components with documentation included. Custom builds allow more design freedom but require more upfront documentation work. Buildwell supports both approaches.",
      },
      {
        q: "How do log homes handle energy codes?",
        a: "Logs have thermal mass that provides some insulation effect, but most jurisdictions require supplemental insulation or alternative energy compliance paths for log construction.",
      },
    ],
  },
  {
    slug: "a-frame",
    value: "A_FRAME",
    label: "A-Frame",
    tagline: "A-frame cabin plans and construction documents",
    metaDescription:
      "Get professional A-frame cabin blueprints, material lists, and bid documents. Distinctive triangular design for mountain retreats, vacation homes, and short-term rentals.",
    heroImage:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=80",
    overview:
      "The A-frame's iconic steep roofline doubles as the exterior walls, creating a dramatic interior aesthetic while shedding snow and rain efficiently. A-frames are extremely popular as vacation homes, short-term rentals, and mountain retreats. Their compact footprint and simple structure make them one of the more affordable specialty builds.",
    typicalSize: "400–1,800 sq ft",
    costRange: "$150–$300 per sq ft",
    timelineToBuild: "3–10 months",
    keyFeatures: [
      "Steep gable roof extending to ground level",
      "Open main floor with dramatic ceiling height",
      "Sleeping loft in upper triangle",
      "Large glass gable ends for views and light",
      "Efficient heating due to compact volume",
      "Post-and-beam or rafter-based framing",
    ],
    idealFor: [
      "Mountain and lake vacation properties",
      "Short-term rental (Airbnb) investments",
      "Compact primary or secondary residences",
      "Owner-builders looking for a manageable project",
    ],
    permitNotes:
      "A-frames are permitted as standard residential structures. The steep roof angle and loft sleeping area may require specific egress compliance (minimum window size and sill height for the sleeping loft).",
    documentsNeeded: [
      "Floor plan (main level + loft)",
      "Rafter and ridge beam framing plan",
      "Gable elevation with glass schedule",
      "Foundation plan",
      "Electrical and plumbing rough-in",
      "Material list and bid package",
    ],
    faqs: [
      {
        q: "Are A-frames good short-term rentals?",
        a: "A-frames are one of the most photographed and booked structure types on short-term rental platforms. Their distinctive look drives strong occupancy rates in mountain and lake markets.",
      },
      {
        q: "Can I use the loft as a legal bedroom?",
        a: "It depends on ceiling height, egress window size, and local code. Many A-frame lofts meet bedroom requirements; some jurisdictions count them as sleeping lofts rather than legal bedrooms.",
      },
    ],
  },
  {
    slug: "dome-home",
    value: "DOME_HOME",
    label: "Dome Home",
    tagline: "Geodesic and monolithic dome home construction documents",
    metaDescription:
      "Get dome home construction documents including structural notes, material lists, and bid packages. Geodesic and monolithic dome configurations.",
    heroImage:
      "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80",
    overview:
      "Dome homes — whether geodesic (triangulated frame) or monolithic (sprayed concrete over a form) — offer exceptional structural strength, energy efficiency, and resistance to extreme weather. They remain niche builds, but their unique documentation requirements make professional document generation especially valuable.",
    typicalSize: "800–3,000 sq ft",
    costRange: "$150–$350 per sq ft",
    timelineToBuild: "6–18 months",
    keyFeatures: [
      "Geodesic (frame) or monolithic (concrete) options",
      "Exceptional structural strength against wind and snow",
      "Natural thermal mass in monolithic designs",
      "Open interior floor plan flexibility",
      "Skylight and window placement constraints",
      "Unique foundation requirements",
    ],
    idealFor: [
      "Off-grid and sustainable living",
      "High-wind or severe weather regions",
      "Unique vacation property builds",
      "Earthship-adjacent alternative builders",
    ],
    permitNotes:
      "Dome homes often require additional engineering review due to their non-standard geometry. Monolithic domes in particular may need structural engineering stamps. Many permit offices have limited experience with dome structures — your documentation needs to be especially thorough.",
    documentsNeeded: [
      "Floor plan within dome footprint",
      "Structural summary (geodesic frequency or monolithic specs)",
      "Foundation and ring beam plan",
      "Window and door placement schedule",
      "Insulation and vapor barrier spec",
      "Material list and specialized contractor bid notes",
    ],
    faqs: [
      {
        q: "Which is better — geodesic or monolithic dome?",
        a: "Geodesic domes are easier to build yourself and use conventional framing. Monolithic domes use a foam form and sprayed concrete — they're stronger and more energy-efficient but require specialized contractors.",
      },
      {
        q: "Are dome homes hard to furnish?",
        a: "The curved walls create challenges for standard furniture placement. Most dome owners use custom or freestanding furniture and embrace the open floor plan.",
      },
    ],
  },
  {
    slug: "quonset-hut",
    value: "QUONSET_HUT",
    label: "Quonset Hut",
    tagline: "Quonset hut plans and construction documents",
    metaDescription:
      "Get Quonset hut construction documents. Semi-cylindrical corrugated steel buildings — one of the most affordable large structure options available.",
    heroImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    overview:
      "Quonset huts are semi-cylindrical corrugated steel structures originally developed for military use. Today they're popular for agricultural storage, workshops, equipment bays, and even living spaces. Their prefabricated panels make them extremely fast to erect — many owners assemble them without a general contractor.",
    typicalSize: "600–5,000+ sq ft",
    costRange: "$15–$50 per sq ft (shell only)",
    timelineToBuild: "1–3 months for shell; longer with interior finish",
    keyFeatures: [
      "Prefabricated corrugated steel arched panels",
      "No interior columns or support walls",
      "Extremely fast assembly",
      "Modular — additional sections can be added",
      "Endwall options: open, framed, or insulated",
      "Foundation: concrete slab or grade beam",
    ],
    idealFor: [
      "Equipment and vehicle storage",
      "Agricultural operations",
      "Budget-conscious workshop builds",
      "Fast-deploy temporary or permanent structures",
    ],
    permitNotes:
      "Quonset huts fall under standard commercial or agricultural building codes depending on use. Most manufacturers provide stamped engineering drawings with their kits — your Buildwell documents supplement these with site-specific planning and material coordination.",
    documentsNeeded: [
      "Site plan and foundation layout",
      "Endwall framing plan",
      "Interior layout (if applicable)",
      "Utility rough-in notes",
      "Insulation spec (if conditioned space)",
      "Material list and erection coordination",
    ],
    faqs: [
      {
        q: "Can a Quonset hut be used as a home?",
        a: "Yes — with proper insulation, finished endwalls, and interior build-out, a Quonset can be a livable space. It's non-standard and may face zoning challenges in residential areas.",
      },
      {
        q: "Do I need a permit for a Quonset hut?",
        a: "Most permanent Quonset huts require permits. Agricultural uses in rural areas may qualify for exemptions. Always check with your local building department.",
      },
    ],
  },
  {
    slug: "silo",
    value: "SILO",
    label: "Silo / Round Structure",
    tagline: "Grain silo conversion and cylindrical structure build documents",
    metaDescription:
      "Construction documents for grain silo conversions and custom cylindrical round structures. Unique builds that need specialized documentation.",
    heroImage:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80",
    overview:
      "Silo conversions and purpose-built cylindrical structures are among the most dramatic and unique builds available. A repurposed grain silo can become a striking home, studio, or vacation rental. The cylindrical form creates unique structural and layout challenges that require careful documentation.",
    typicalSize: "300–2,000 sq ft (single to multiple silos)",
    costRange: "$175–$450 per sq ft",
    timelineToBuild: "8–24 months",
    keyFeatures: [
      "Repurposed grain silo or purpose-built cylinder",
      "Custom curved floor plans",
      "Multi-story configurations with internal staircase",
      "Rooftop deck options",
      "Unique window placement in curved walls",
      "Significant structural engineering required",
    ],
    idealFor: [
      "Unique vacation and short-term rental properties",
      "Art studios and creative workspaces",
      "Trophy residential builds",
      "Agricultural property repurposing",
    ],
    permitNotes:
      "Silo conversions require thorough structural engineering review — the existing shell must be assessed for integrity. Purpose-built cylindrical structures are non-standard and will require engineering stamps in most jurisdictions.",
    documentsNeeded: [
      "Cylindrical floor plan by level",
      "Structural assessment notes (conversions)",
      "Staircase and egress plan",
      "Window and door penetration schedule",
      "Foundation or existing base assessment",
      "Material list and specialized bid notes",
    ],
    faqs: [
      {
        q: "How do you furnish a circular room?",
        a: "Curved rooms work best with custom or modular furniture. Many silo homes use the central cylinder for a kitchen or wet room, with outbuildings or additions for living and sleeping.",
      },
      {
        q: "Is a silo conversion cheaper than building new?",
        a: "The shell acquisition can be inexpensive, but the conversion cost per square foot is typically high due to custom fabrication and structural engineering requirements.",
      },
    ],
  },
  {
    slug: "shed",
    value: "SHED",
    label: "Shed",
    tagline: "Storage shed plans and construction documents",
    metaDescription:
      "Get shed construction documents including floor plans, framing specs, and material lists. From small garden sheds to large storage buildings.",
    heroImage:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
    overview:
      "A well-built shed adds significant utility and property value. Whether you need garden storage, a tool shed, or a larger utility outbuilding, proper documentation ensures accurate material ordering and a clean permit process where required.",
    typicalSize: "64–400 sq ft",
    costRange: "$15–$65 per sq ft",
    timelineToBuild: "1–4 weeks for most sizes",
    keyFeatures: [
      "Simple gable or saltbox roof options",
      "Single or double door configurations",
      "Window options for light and ventilation",
      "Skid, concrete block, or slab foundation",
      "Loft storage option for larger sheds",
      "Electrical rough-in option",
    ],
    idealFor: [
      "Garden and lawn equipment storage",
      "Tool and hobby storage",
      "Pool equipment and patio storage",
      "Backyard utility outbuilding",
    ],
    permitNotes:
      "Many jurisdictions exempt sheds under 120–200 sq ft from permit requirements. Larger sheds and any shed with electrical service typically require permits. Check your local setback requirements — sheds often must be a minimum distance from property lines.",
    documentsNeeded: [
      "Floor plan with door placement",
      "Framing and roof plan",
      "Foundation detail",
      "Window and door schedule",
      "Material list",
      "Electrical rough-in (if applicable)",
    ],
    faqs: [
      {
        q: "Do I need a permit for a shed?",
        a: "It depends on size and location. Most counties allow small sheds (under 120–200 sq ft) without a permit. Check your local rules for setback requirements even for exempt structures.",
      },
      {
        q: "What's the best foundation for a shed?",
        a: "Pressure-treated wood skids on compacted gravel are the most common and easiest. Concrete blocks work well too. For larger sheds or electrical service, a concrete slab is recommended.",
      },
    ],
  },
  {
    slug: "workshop",
    value: "WORKSHOP",
    label: "Workshop",
    tagline: "Workshop and hobby shop construction documents",
    metaDescription:
      "Get workshop construction documents including floor plans, electrical plans, and material lists. Dedicated workspace builds for hobbyists and professionals.",
    heroImage:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    overview:
      "A dedicated workshop is one of the highest-ROI outbuildings you can build. Whether you're doing woodworking, metalworking, automotive, or general hobbyist work, the electrical, ventilation, and layout requirements are specific. Good planning upfront means a functional shop that you'll use for decades.",
    typicalSize: "400–2,400 sq ft",
    costRange: "$45–$130 per sq ft",
    timelineToBuild: "1–4 months",
    keyFeatures: [
      "Heavy electrical service (100–200A subpanel)",
      "220V outlet placement for large tools",
      "Compressed air rough-in",
      "Dust collection system layout",
      "Workbench and storage wall planning",
      "Overhead door for large material access",
    ],
    idealFor: [
      "Woodworkers and cabinetmakers",
      "Automotive and fabrication shops",
      "General hobbyists and makers",
      "Home-based tradespeople",
    ],
    permitNotes:
      "Workshops with electrical service require permits in most jurisdictions. A 200A or larger subpanel may require utility coordination. Dust collection systems with exterior venting may require additional approvals.",
    documentsNeeded: [
      "Floor plan with tool placement zones",
      "Heavy electrical plan (subpanel, 220V outlets)",
      "Compressed air and ventilation layout",
      "Overhead door and access plan",
      "Material list",
      "Electrical contractor bid package",
    ],
    faqs: [
      {
        q: "How much electrical service does a workshop need?",
        a: "A minimum of 100A is recommended for a basic shop. Serious woodworking or metalworking setups benefit from 200A to support multiple large tools running simultaneously.",
      },
      {
        q: "Should I heat and cool my workshop?",
        a: "A mini-split is a popular choice — it provides both heating and cooling efficiently in a single-zone building. Radiant heat is popular for shops where you work near the floor.",
      },
    ],
  },
  {
    slug: "garage",
    value: "GARAGE",
    label: "Garage",
    tagline: "Garage construction documents — attached and detached",
    metaDescription:
      "Professional garage construction documents. Attached and detached garage plans, material lists, and bid packages for 1-car to 4-car garages.",
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    overview:
      "A properly documented garage project — whether attached or detached — protects your investment and ensures you get accurate contractor bids. Garage documentation needs include structural plans, fire separation requirements (for attached garages), electrical, and often plumbing if a utility sink or bathroom is included.",
    typicalSize: "400–1,200 sq ft (1 to 4 cars)",
    costRange: "$45–$135 per sq ft",
    timelineToBuild: "1–3 months",
    keyFeatures: [
      "1-car, 2-car, 3-car, or 4-car configurations",
      "Attached (with fire separation) or detached",
      "Standard or tall door heights (for trucks/RVs)",
      "Storage loft option above garage bays",
      "Utility sink and floor drain options",
      "EV charging outlet pre-wiring",
    ],
    idealFor: [
      "Homeowners adding vehicle storage",
      "RV and boat storage",
      "Home gym or flex space conversions",
      "Rental property additions",
    ],
    permitNotes:
      "Garages require building permits in virtually all jurisdictions. Attached garages have specific fire separation requirements (typically 5/8\" Type X drywall on shared walls and ceilings). EV charging outlet circuits require electrical permit.",
    documentsNeeded: [
      "Floor plan with bay and door layout",
      "Attached fire separation detail (if applicable)",
      "Framing and roof plan",
      "Electrical plan (outlets, EV charging, lighting)",
      "Foundation and slab plan",
      "Material list and bid package",
    ],
    faqs: [
      {
        q: "Does an attached garage add home value?",
        a: "Yes — attached garages typically return 60–80% of their cost in added home value, and they dramatically improve marketability in most US markets.",
      },
      {
        q: "What's the standard garage door height?",
        a: "Standard garage doors are 7ft tall. For trucks, SUVs with roof racks, or RVs, 8ft or taller doors are recommended. Document your door height requirement upfront.",
      },
    ],
  },
  {
    slug: "passive-solar",
    value: "PASSIVE_SOLAR",
    label: "Passive Solar Home",
    tagline: "Passive solar home plans optimized for natural heating and cooling",
    metaDescription:
      "Get passive solar home construction documents. Energy-optimized floor plans, south-facing glazing specs, thermal mass details, and full build documentation.",
    heroImage:
      "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?auto=format&fit=crop&w=1200&q=80",
    overview:
      "Passive solar homes are designed from the ground up to minimize mechanical heating and cooling by capturing winter sun, blocking summer sun, and storing thermal energy in mass materials. They're among the most energy-efficient builds possible — but they require more upfront design precision than conventional homes. The orientation, window placement, overhang depth, and thermal mass specification all interact and must be documented carefully.",
    typicalSize: "1,200–3,500 sq ft",
    costRange: "$175–$375 per sq ft",
    timelineToBuild: "8–18 months",
    keyFeatures: [
      "South-facing orientation (critical)",
      "High-performance south-facing glazing",
      "Calculated roof overhang for seasonal sun control",
      "Thermal mass: concrete, tile, or stone floors",
      "Minimal north-facing window area",
      "High-insulation envelope (R-30+ walls, R-50+ roof)",
    ],
    idealFor: [
      "Sustainability-focused owner-builders",
      "Net-zero energy home aspirants",
      "Off-grid and rural builds",
      "Builders wanting long-term utility cost reduction",
    ],
    permitNotes:
      "Passive solar homes meet and typically exceed energy code requirements. Some jurisdictions offer expedited permitting for high-performance buildings. Your energy calculations (Manual J or similar) should be included in your permit application.",
    documentsNeeded: [
      "Orientation-specific floor plan",
      "South elevation with glazing schedule",
      "Overhang and shading calculation notes",
      "Thermal mass specification",
      "High-performance envelope spec",
      "Energy system overview (mechanical backup)",
    ],
    faqs: [
      {
        q: "How much can a passive solar home reduce energy bills?",
        a: "Well-designed passive solar homes can reduce heating and cooling costs by 50–90% compared to a code-minimum conventional home. The exact savings depend on climate, design quality, and occupant behavior.",
      },
      {
        q: "Does passive solar work in cold climates?",
        a: "Passive solar is most effective in cold, sunny climates (Colorado, Utah, New Mexico, etc.). Cloudy climates need a higher-insulation envelope to compensate for lower solar gain.",
      },
      {
        q: "Do I still need a mechanical heating system?",
        a: "Yes — most passive solar homes include a backup system (mini-split, wood stove, radiant) for extended cloudy periods. The system is much smaller than a conventional home requires.",
      },
    ],
  },
];

export function getStructurePageData(slug: string): StructurePageData | undefined {
  return STRUCTURE_PAGE_DATA.find((s) => s.slug === slug);
}

export function valueToSlug(value: string): string {
  return value.toLowerCase().replace(/_/g, "-");
}
