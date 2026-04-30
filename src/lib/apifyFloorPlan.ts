/**
 * Apify AI Floor Plan integration.
 *
 * The actor `calm_necessity/ai-floor-planner` takes a text prompt and
 * generates a floor plan image. Generation takes 1–2 minutes, so we use
 * the async run pattern (start run → poll for status) to stay within
 * serverless function timeout limits.
 *
 * Docs: https://apify.com/calm_necessity/ai-floor-planner
 *
 * Required env: APIFY_API_TOKEN
 */

import { ProjectAnswers } from "@/types";

const ACTOR_ID = "calm_necessity~ai-floor-planner";
const APIFY_BASE = "https://api.apify.com/v2";

export interface AIFloorPlanResult {
  imageUrl: string;
  summary?: string;
  detailedDescription?: string;
  autocadCommands?: string;
  generatedAt: string;
  prompt: string;
  runId: string;
}

export interface ApifyRunStatus {
  status: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "TIMED-OUT" | "ABORTED" | string;
  defaultDatasetId?: string;
}

// ── Prompt builder ────────────────────────────────────────────────────────────

/**
 * Structure-specific architectural detail. Drawn from
 * docs/blueprint-reference.md — this is what makes the AI output
 * actually look like the right kind of building, not a generic floor plan.
 */
interface StructureSpec {
  shape: string;       // overall footprint shape
  features: string[];  // must-have drawing features
  rooms: string;       // typical room layout pattern
}

const STRUCTURE_SPECS: Record<string, StructureSpec> = {
  SINGLE_FAMILY_HOME: {
    shape: "rectangular or L-shaped footprint, 6\" double-line exterior walls and 4\" interior partitions",
    features: [
      "front entry foyer leading to a great room",
      "open kitchen-dining-living core",
      "master suite separated from secondary bedrooms",
      "attached 2-car garage (20×20 to 24×24)",
      "laundry off kitchen or garage hallway",
    ],
    rooms: "3 bedrooms, 2 baths, kitchen, dining, living, master suite with walk-in closet, laundry, garage",
  },
  CONTAINER_HOME: {
    shape: "narrow rectangular shipping containers 8 ft wide, joined side-by-side or end-to-end",
    features: [
      "thin steel exterior walls (~3-4\" equivalent)",
      "plumbing concentrated at one end of containers",
      "container module joints visible as wall lines",
      "stacked or L-shape configuration possible",
    ],
    rooms: "open kitchen + living/dining in one container, bedrooms + bath in adjacent container",
  },
  BARNDOMINIUM: {
    shape: "large rectangle bisected into shop half and living half",
    features: [
      "shop side: 2-3 overhead roll-up doors on gable end (shown as thick dashed lines)",
      "living side: standard residential room partitions",
      "covered porch on front of living half",
      "mudroom bridging living and shop zones",
      "heavy exterior steel frame lines",
    ],
    rooms: "shop bay (one half), kitchen + great room + 2-3 bedrooms + 2 baths + laundry (other half)",
  },
  BARN: {
    shape: "rectangle with center aisle running full length, post-and-beam bents every 8-12 ft",
    features: [
      "center aisle 10-12 ft wide running gable to gable",
      "horse stalls 10×12 or 12×12 flanking aisle",
      "large sliding doors at both gable ends (12-16 ft wide)",
      "tack room, feed room, wash stall at one end",
      "hayloft accessible by interior stair",
    ],
    rooms: "stalls along both sides, tack room, feed room, wash stall, central aisle",
  },
  LOG_CABIN: {
    shape: "compact rectangle, 8-12 inch thick log walls drawn with hatching between double lines",
    features: [
      "corner log notches visible at wall intersections",
      "stone fireplace mass on end wall or interior wall",
      "full-width covered front porch (6-8 ft deep)",
      "sleeping loft accessed by open stair",
    ],
    rooms: "great room (living + dining + kitchen), 1-2 bedrooms or sleeping loft, full bathroom",
  },
  A_FRAME: {
    shape: "narrow rectangle, loft level much narrower than main floor (only central head-clearance zone usable)",
    features: [
      "loft drawn as dashed partial rectangle inside main outline",
      "open-riser staircase to loft, centrally placed",
      "front deck/porch on gable face",
      "large triangular glass gable walls front and rear",
      "no vertical exterior side walls — roof to grade",
    ],
    rooms: "open living/kitchen/dining + bath + ground bedroom on main floor; sleeping loft above",
  },
  SHED: {
    shape: "simple small rectangle, no foundation, no plumbing",
    features: [
      "double doors on gable end for equipment access",
      "1-2 windows on side walls",
      "roof overhang shown as dashed line outside walls",
    ],
    rooms: "single open room",
  },
  WORKSHOP: {
    shape: "medium rectangle, wide entry doors on gable wall",
    features: [
      "workbenches drawn as 2 ft deep rectangles along 1-3 walls",
      "central open floor area for equipment (60-70% of space)",
      "windows on side walls for natural light",
      "optional small bathroom and office nook in corner",
    ],
    rooms: "open work floor, workbenches, optional office and bathroom",
  },
  GARAGE: {
    shape: "rectangle sized to car bays, overhead door across front wall",
    features: [
      "overhead door drawn as double parallel lines with hidden-line hatching across front",
      "single entry door on side or rear wall",
      "optional workbench (2 ft deep) along rear wall",
    ],
    rooms: "parking bays, optional workbench, side entry",
  },
  TINY_HOME: {
    shape: "very narrow rectangle, 8 ft wide for THOW or 16-20 ft for foundation tiny home",
    features: [
      "sleeping loft at one or both ends drawn as dashed rectangle",
      "ship's ladder or stair-step bookcase to loft",
      "galley kitchen (2 ft deep counter) along one wall",
      "compact bathroom (4×6 or 4×8)",
    ],
    rooms: "living area, galley kitchen, bath, sleeping loft above",
  },
  DOME_HOME: {
    shape: "TRUE CIRCLE — every wall is an arc or radiates from center, NOT a rectangle",
    features: [
      "rooms arranged like pie slices around a central open great room",
      "entry vestibule at perimeter",
      "optional partial-circle mezzanine ring loft",
    ],
    rooms: "central living/dining/kitchen, 3 pie-wedge bedrooms, 2 bathrooms around perimeter",
  },
  QUONSET_HUT: {
    shape: "long rectangular floor plan with semicircular arch ceiling shown above",
    features: [
      "entry doors only on flat gable endwalls",
      "center of plan = tallest zone (used for kitchen/living)",
      "side zones = lower ceiling (used for bedrooms/baths)",
      "windows cut into arch sides or gable ends",
    ],
    rooms: "central living/kitchen at full arch height, side bedrooms and baths under lower curve",
  },
  SILO: {
    shape: "TRUE CIRCLE per floor level — NO right-angle rooms, all walls are arcs",
    features: [
      "rooms carved as quadrant pie slices",
      "entry door cut into base of cylindrical wall",
      "interior straight or spiral staircase against curved wall",
      "stacked floor levels possible",
    ],
    rooms: "entry + kitchen quadrant, bath quadrant, living half-circle on level 1; bedroom on level 2",
  },
  POLE_BARN: {
    shape: "large open rectangle, perimeter posts every 8-12 ft, NO interior structural walls",
    features: [
      "posts drawn as solid squares around perimeter at regular intervals",
      "completely open clear-span interior",
      "large sliding or overhead doors on gable ends",
      "optional corner partition for office/bathroom/storage",
    ],
    rooms: "single open clear-span space, optional small corner office and bathroom",
  },
  EARTHSHIP: {
    shape: "U-SHAPE / horseshoe footprint, ALWAYS south-facing",
    features: [
      "north wall buried in earth berm — extremely thick (24-36 inches), no windows",
      "south face: continuous greenhouse glazing wall, 6-10 ft deep, full width",
      "raised planting beds along south glazing",
      "east and west wings of rooms connected by greenhouse corridor",
      "cisterns/water tanks in north berm zone",
    ],
    rooms: "south greenhouse corridor, west wing master + bath, east wing 2 bedrooms + bath, center kitchen + living",
  },
  PASSIVE_SOLAR: {
    shape: "elongated rectangle with longer east-west axis than north-south depth",
    features: [
      "south wall heavily glazed (large windows = 5-10% of floor area)",
      "north wall has few or no windows — solid, garage backing it",
      "compact room depth (≤18 ft) for solar effectiveness",
      "roof overhangs drawn as dashed lines extending 2-3 ft beyond south wall",
      "thermal mass zones: concrete slab in sun-exposed rooms",
    ],
    rooms: "south side: living + dining + sunroom; center: kitchen + master; north: garage + utility + storage",
  },
};

export function buildFloorPlanPrompt(
  answers: ProjectAnswers,
  structureType: string,
  totalSqft: number,
): string {
  const spec = STRUCTURE_SPECS[structureType];
  const beds = Number(answers.bedrooms ?? 0);
  const baths = Number(answers.bathrooms ?? 0);
  const stories = Number(answers.stories ?? 1);
  const foundation = (answers.foundation as string) || "";
  const style = (answers.architecturalStyle as string) || "";
  const garage = (answers.garage as string) || "";
  const features = Array.isArray(answers.features) ? (answers.features as string[]).join(", ") : "";

  const lines: string[] = [];

  // Header — what we want
  lines.push("Generate a clean, professional architectural floor plan drawing — top-down 2D view, black ink on white paper, like a real construction document.");

  // Structure type with specific shape
  if (spec) {
    lines.push(`Structure: ${structureType.replace(/_/g, " ").toLowerCase()}.`);
    lines.push(`Footprint: ${spec.shape}.`);
  } else {
    lines.push(`Structure: ${structureType.replace(/_/g, " ").toLowerCase()}.`);
  }

  // Size and program
  if (totalSqft > 0) lines.push(`Total floor area: approximately ${totalSqft.toLocaleString()} square feet.`);
  if (stories > 1) lines.push(`${stories} stories — render the main floor plan.`);
  if (beds > 0) lines.push(`${beds} bedroom${beds === 1 ? "" : "s"}.`);
  if (baths > 0) lines.push(`${baths} bathroom${baths === 1 ? "" : "s"}.`);
  if (foundation) lines.push(`Foundation: ${foundation}.`);
  if (style) lines.push(`Architectural style influence: ${style}.`);
  if (garage && /yes|attached|detached/i.test(garage)) lines.push(`Include ${garage.toLowerCase()} garage.`);
  if (features) lines.push(`Notable features: ${features}.`);

  // Structure-specific drawing features (this is the secret sauce)
  if (spec) {
    lines.push("Required drawing elements specific to this structure:");
    spec.features.forEach((f) => lines.push(`- ${f}`));
    lines.push(`Typical rooms: ${spec.rooms}.`);
  }

  // Universal architectural drawing standards
  lines.push("Drawing standards:");
  lines.push("- Double-line exterior walls with poché (hatched fill) showing wall thickness");
  lines.push("- Single-line interior partitions");
  lines.push("- Clearly labeled rooms (name + square footage + dimensions in feet-inches)");
  lines.push("- Doors shown as breaks in walls with quarter-circle swing arcs");
  lines.push("- Windows shown as thin parallel lines breaking exterior walls");
  lines.push("- Dimension strings outside the plan with tick marks at each end");
  lines.push("- North arrow with N label");
  lines.push("- Graphic scale bar");
  lines.push("- Title block at the bottom with project info");

  // Style anchors
  lines.push("Style: clean black-and-white CAD-quality line drawing — NOT a 3D render, NOT a colored illustration, NOT a marketing brochure image. Drafted line work with monospace technical labels. Plain white background.");

  return lines.join("\n");
}

// ── Apify API calls ───────────────────────────────────────────────────────────

function getToken(): string {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN is not set");
  return token;
}

/**
 * Kick off an Apify actor run. Returns immediately with the runId.
 * Generation typically completes in 1–2 minutes.
 */
export async function startApifyFloorPlanRun(prompt: string): Promise<{ runId: string; datasetId: string }> {
  const token = getToken();
  const url = `${APIFY_BASE}/acts/${ACTOR_ID}/runs?token=${token}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Apify start-run failed: ${res.status} ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const runId = data?.data?.id as string;
  const datasetId = data?.data?.defaultDatasetId as string;
  if (!runId) throw new Error("Apify start-run returned no runId");
  return { runId, datasetId };
}

/**
 * Check the status of a running Apify run. If finished, fetch the output.
 */
export async function checkApifyFloorPlanRun(runId: string): Promise<{
  status: ApifyRunStatus["status"];
  result?: AIFloorPlanResult;
  error?: string;
}> {
  const token = getToken();

  // 1) Get run status
  const runRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${token}`, {
    cache: "no-store",
  });
  if (!runRes.ok) {
    const text = await runRes.text().catch(() => "");
    return { status: "FAILED", error: `Run status fetch failed: ${runRes.status} ${text.slice(0, 200)}` };
  }
  const runData = await runRes.json();
  const status = runData?.data?.status as string;
  const datasetId = runData?.data?.defaultDatasetId as string | undefined;

  if (status !== "SUCCEEDED") {
    return { status };
  }

  // 2) Fetch dataset items (the floor plan output)
  if (!datasetId) return { status: "FAILED", error: "Run succeeded but no datasetId" };

  const dsRes = await fetch(
    `${APIFY_BASE}/datasets/${datasetId}/items?token=${token}&limit=1&clean=true`,
    { cache: "no-store" },
  );
  if (!dsRes.ok) {
    const text = await dsRes.text().catch(() => "");
    return { status: "FAILED", error: `Dataset fetch failed: ${dsRes.status} ${text.slice(0, 200)}` };
  }
  const items = (await dsRes.json()) as Array<{
    status?: number;
    imageUrl?: string;
    details?: {
      imageUrl?: string;
      summary?: string;
      detailedDescription?: string;
      autocadCommands?: string;
      originalPrompt?: string;
    };
  }>;

  const item = items?.[0];
  const imageUrl = item?.imageUrl || item?.details?.imageUrl;
  if (!imageUrl) {
    return { status: "FAILED", error: "Apify run succeeded but no imageUrl in output" };
  }

  return {
    status: "SUCCEEDED",
    result: {
      imageUrl,
      summary: item?.details?.summary,
      detailedDescription: item?.details?.detailedDescription,
      autocadCommands: item?.details?.autocadCommands,
      generatedAt: new Date().toISOString(),
      prompt: item?.details?.originalPrompt ?? "",
      runId,
    },
  };
}
