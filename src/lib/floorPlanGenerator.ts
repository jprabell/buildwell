// eslint-disable-next-line @typescript-eslint/no-require-imports
const Drawing = require("dxf-writer");

import { ProjectAnswers } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function n(val: string | number | string[] | undefined, fallback = 0): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") return parseFloat(val) || fallback;
  return fallback;
}

function s(val: string | number | string[] | undefined, fallback = ""): string {
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  return fallback;
}

function r(v: number, decimals = 1): number {
  const f = Math.pow(10, decimals);
  return Math.round(v * f) / f;
}

// ─── Drawing primitives ───────────────────────────────────────────────────────

function rect(d: typeof Drawing, x: number, y: number, w: number, h: number) {
  d.drawLine(x, y, x + w, y);
  d.drawLine(x + w, y, x + w, y + h);
  d.drawLine(x + w, y + h, x, y + h);
  d.drawLine(x, y + h, x, y);
}

// Wall with door opening: draws two segments leaving a gap
function wallWithGap(
  d: typeof Drawing,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  gaps: { pos: number; width: number }[] // pos = 0..1 along the wall
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const sorted = [...gaps].sort((a, b) => a.pos - b.pos);

  let prev = 0;
  for (const gap of sorted) {
    const gapStart = gap.pos;
    const gapEnd = gap.pos + gap.width / len;
    if (prev < gapStart) {
      d.drawLine(
        x1 + dx * prev, y1 + dy * prev,
        x1 + dx * gapStart, y1 + dy * gapStart
      );
    }
    prev = gapEnd;
  }
  if (prev < 1) {
    d.drawLine(x1 + dx * prev, y1 + dy * prev, x2, y2);
  }
}

// Door swing arc (quarter circle at hinge point)
function doorSwing(
  d: typeof Drawing,
  hingeX: number,
  hingeY: number,
  swingRadius: number,
  startAngle: number,
  endAngle: number
) {
  d.drawArc(hingeX, hingeY, swingRadius, startAngle, endAngle);
  // door leaf line
  const endRad = (endAngle * Math.PI) / 180;
  d.drawLine(hingeX, hingeY, hingeX + swingRadius * Math.cos(endRad), hingeY + swingRadius * Math.sin(endRad));
}

// Window symbol: gap with two short lines across it
function windowSymbol(
  d: typeof Drawing,
  x: number,
  y: number,
  width: number,
  isHorizontal: boolean,
  inset = 0.2
) {
  if (isHorizontal) {
    d.drawLine(x, y - inset, x, y + inset);
    d.drawLine(x + width, y - inset, x + width, y + inset);
    d.drawLine(x, y, x + width, y);
    d.drawLine(x, y + inset * 0.5, x + width, y + inset * 0.5);
  } else {
    d.drawLine(x - inset, y, x + inset, y);
    d.drawLine(x - inset, y + width, x + inset, y + width);
    d.drawLine(x, y, x, y + width);
    d.drawLine(x + inset * 0.5, y, x + inset * 0.5, y + width);
  }
}

// Dimension line with arrows and text
function dimension(
  d: typeof Drawing,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  offset: number,
  isHorizontal: boolean,
  label: string
) {
  const tickLen = 0.3;
  if (isHorizontal) {
    const oy = y1 + offset;
    d.drawLine(x1, oy, x2, oy);
    d.drawLine(x1, y1, x1, oy + (offset > 0 ? tickLen : -tickLen));
    d.drawLine(x2, y1, x2, oy + (offset > 0 ? tickLen : -tickLen));
    d.drawText((x1 + x2) / 2 - label.length * 0.15, oy + (offset > 0 ? 0.15 : -0.5), 0.4, 0, label);
  } else {
    const ox = x1 + offset;
    d.drawLine(ox, y1, ox, y2);
    d.drawLine(x1, y1, ox + (offset > 0 ? tickLen : -tickLen), y1);
    d.drawLine(x1, y2, ox + (offset > 0 ? tickLen : -tickLen), y2);
    d.drawText(ox + (offset > 0 ? 0.15 : -0.8), (y1 + y2) / 2 - 0.2, 0.4, 90, label);
  }
}

// ─── Room label ───────────────────────────────────────────────────────────────

function roomLabel(d: typeof Drawing, x: number, y: number, w: number, h: number, text: string) {
  const cx = x + w / 2 - text.length * 0.2;
  const cy = y + h / 2 - 0.2;
  d.drawText(cx, cy, 0.5, 0, text);
}

// ─── Title block ─────────────────────────────────────────────────────────────

function titleBlock(
  d: typeof Drawing,
  x: number,
  y: number,
  projectName: string,
  structureType: string,
  sqft: number
) {
  const w = 12;
  const h = 4;
  rect(d, x, y, w, h);
  d.drawLine(x, y + 2.5, x + w, y + 2.5);
  d.drawText(x + 0.2, y + 3.2, 0.55, 0, projectName.substring(0, 28));
  d.drawText(x + 0.2, y + 2.7, 0.35, 0, structureType.replace(/_/g, " "));
  d.drawText(x + 0.2, y + 2.0, 0.32, 0, `TOTAL AREA: ${sqft.toLocaleString()} SQ FT`);
  d.drawText(x + 0.2, y + 1.5, 0.32, 0, `SCALE: 1" = 10'-0"`);
  d.drawText(x + 0.2, y + 1.0, 0.32, 0, `DATE: ${new Date().toLocaleDateString("en-US")}`);
  d.drawText(x + 0.2, y + 0.5, 0.25, 0, "PRELIMINARY SCHEMATIC - NOT FOR CONSTRUCTION");
  d.drawText(x + 0.2, y + 0.15, 0.25, 0, "BUILDWELL LLC - ibuildwell.com");
}

// ─── Structure-specific layouts ──────────────────────────────────────────────

function drawResidential(
  d: typeof Drawing,
  answers: ProjectAnswers,
  W: number,
  H: number,
  bedrooms: number,
  bathrooms: number
) {
  const hasGarage = !s(answers.garageType, "none").startsWith("none");
  const garageH = hasGarage ? H * 0.28 : 0;
  const livingH = H - garageH;

  // Zone split: left 42% = bedrooms/baths, right 58% = living
  const leftW = W * 0.42;
  const rightW = W - leftW;
  const bedroomH = (livingH * 0.85) / Math.max(bedrooms, 1);
  const bathW = leftW * 0.38;

  // ── Bedroom zone ──
  d.setActiveLayer("WALLS");
  for (let i = 0; i < bedrooms; i++) {
    const bY = garageH + i * bedroomH;
    const bH = bedroomH;
    const bW = leftW - bathW;
    rect(d, 0, bY, bW, bH);
    d.setActiveLayer("TEXT");
    roomLabel(d, 0, bY, bW, bH, i === 0 ? "MASTER BR" : `BEDROOM ${i + 1}`);
    d.setActiveLayer("WALLS");
  }

  // ── Bath zone ──
  const fullBaths = Math.floor(bathrooms);
  const bathH = (livingH * 0.85) / Math.max(fullBaths, 1);
  for (let i = 0; i < fullBaths; i++) {
    const bY = garageH + i * bathH;
    rect(d, leftW - bathW, bY, bathW, bathH);
    d.setActiveLayer("TEXT");
    roomLabel(d, leftW - bathW, bY, bathW, bathH, "BATH");
    d.setActiveLayer("WALLS");
  }

  // Hallway label in remaining left zone
  const hallY = garageH + livingH * 0.85;
  const hallH = livingH * 0.15;
  rect(d, 0, hallY, leftW, hallH);
  d.setActiveLayer("TEXT");
  roomLabel(d, 0, hallY, leftW, hallH, "HALL");
  d.setActiveLayer("WALLS");

  // ── Right zone: living, kitchen, dining ──
  const livingZoneH = livingH * 0.45;
  const kitchenH = livingH * 0.3;
  const diningH = livingH - livingZoneH - kitchenH;
  rect(d, leftW, garageH, rightW, livingZoneH);
  rect(d, leftW, garageH + livingZoneH, rightW, kitchenH);
  rect(d, leftW, garageH + livingZoneH + kitchenH, rightW, diningH);
  d.setActiveLayer("TEXT");
  roomLabel(d, leftW, garageH, rightW, livingZoneH, "LIVING ROOM");
  roomLabel(d, leftW, garageH + livingZoneH, rightW, kitchenH, "KITCHEN");
  roomLabel(d, leftW, garageH + livingZoneH + kitchenH, rightW, diningH, "DINING");
  d.setActiveLayer("WALLS");

  // ── Garage ──
  if (hasGarage) {
    rect(d, 0, 0, W, garageH);
    d.setActiveLayer("TEXT");
    roomLabel(d, 0, 0, W, garageH, "GARAGE");
    d.setActiveLayer("WALLS");
  }

  // ── Doors ──
  d.setActiveLayer("DOORS");
  // Front door on south wall
  const frontDoorX = W * 0.5 - 1.5;
  const doorW = 3;
  wallWithGap(d, 0, 0, W, 0, [{ pos: frontDoorX / W, width: doorW }]);
  doorSwing(d, frontDoorX, 0.5, doorW, 0, 90);
  // Bedroom doors
  for (let i = 0; i < bedrooms; i++) {
    const bY = garageH + i * bedroomH + bedroomH * 0.5;
    d.drawLine(leftW - bathW - 0.05, bY, leftW - bathW + 2.8, bY); // passage door opening
    doorSwing(d, leftW - bathW, bY, 2.8, 0, 90);
  }

  // ── Windows ──
  d.setActiveLayer("WINDOWS");
  // South wall windows (living + bedrooms face)
  windowSymbol(d, W * 0.15, 0, 3, true);
  windowSymbol(d, W * 0.65, 0, 3, true);
  // North wall
  windowSymbol(d, leftW * 0.1, H, 2.5, true);
  windowSymbol(d, leftW + rightW * 0.2, H, 3, true);
  windowSymbol(d, leftW + rightW * 0.6, H, 3, true);
  // East wall
  windowSymbol(d, W, garageH + livingH * 0.1, 2.5, false);
  windowSymbol(d, W, garageH + livingZoneH * 0.5, 2.5, false);
}

function drawAgricultural(d: typeof Drawing, W: number, H: number, structureType: string) {
  // Open plan with center ridge line and optional loft
  d.setActiveLayer("WALLS");
  const postSpacing = 8;
  // Posts along perimeter
  for (let x = 0; x <= W; x += postSpacing) {
    d.drawLine(x, 0, x, 0); // column marker (point)
    d.drawLine(x, H, x, H);
    if (x > 0 && x < W) {
      d.drawLine(x - 0.25, 0, x + 0.25, 0);
      d.drawLine(x - 0.25, H, x + 0.25, H);
    }
  }
  for (let y = 0; y <= H; y += postSpacing) {
    if (y > 0 && y < H) {
      d.drawLine(0, y - 0.25, 0, y + 0.25);
      d.drawLine(W, y - 0.25, W, y + 0.25);
    }
  }
  // Center ridge dashed (use regular line, label it)
  d.drawLine(W / 2, 0, W / 2, H);
  d.setActiveLayer("TEXT");
  d.drawText(W / 2 + 0.3, H / 2, 0.5, 90, "RIDGE LINE");
  roomLabel(d, 0, 0, W, H, structureType === "BARN" ? "BARN / OPEN" : "POLE BARN / OPEN");
  // Large doors on south end
  d.setActiveLayer("DOORS");
  const bigDoorW = Math.min(W * 0.5, 16);
  d.drawLine(W / 2 - bigDoorW / 2, 0, W / 2 + bigDoorW / 2, 0);
  d.drawText(W / 2 - bigDoorW / 4, -1.5, 0.4, 0, `SLIDING DOOR ${Math.round(bigDoorW)}'-0"`);
}

function drawContainer(d: typeof Drawing, answers: ProjectAnswers, W: number, H: number) {
  const containerSize = s(answers.containerSize, "40ft");
  const cLength = containerSize === "20ft" ? 20 : 40;
  const cWidth = 8;
  const count = Math.ceil(n(answers.containerCount, 2));
  const arrangement = s(answers.containerArrangement, "linear");

  d.setActiveLayer("WALLS");
  if (arrangement === "stacked" || arrangement === "parallel") {
    for (let i = 0; i < Math.min(count, 4); i++) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const cx = col * (cLength + 2);
      const cy = row * (cWidth + 2);
      rect(d, cx, cy, cLength, cWidth);
      d.setActiveLayer("TEXT");
      roomLabel(d, cx, cy, cLength, cWidth, `CONTAINER ${i + 1}`);
      d.setActiveLayer("WALLS");
    }
  } else if (arrangement === "l_shape") {
    rect(d, 0, 0, cLength, cWidth);
    rect(d, 0, cWidth + 2, cWidth, cLength);
    d.setActiveLayer("TEXT");
    roomLabel(d, 0, 0, cLength, cWidth, "CONTAINER 1");
    roomLabel(d, 0, cWidth + 2, cWidth, cLength, "CONTAINER 2");
    d.setActiveLayer("WALLS");
  } else {
    // linear
    for (let i = 0; i < Math.min(count, 4); i++) {
      const cx = i * (cLength + 1);
      rect(d, cx, 0, cLength, cWidth);
      d.setActiveLayer("TEXT");
      roomLabel(d, cx, 0, cLength, cWidth, `CONTAINER ${i + 1}`);
      d.setActiveLayer("WALLS");
    }
  }
  // Windows on each container
  d.setActiveLayer("WINDOWS");
  windowSymbol(d, cLength * 0.25, 0, 3, true);
  windowSymbol(d, cLength * 0.65, 0, 3, true);
}

function drawSimpleShell(d: typeof Drawing, W: number, H: number, label: string) {
  d.setActiveLayer("WALLS");
  rect(d, 0, 0, W, H);
  d.setActiveLayer("TEXT");
  roomLabel(d, 0, 0, W, H, label);
  d.setActiveLayer("DOORS");
  const doorX = W / 2 - 1.5;
  doorSwing(d, doorX, 0.5, 3, 0, 90);
  d.setActiveLayer("WINDOWS");
  windowSymbol(d, W * 0.15, H, 2.5, true);
  windowSymbol(d, W * 0.6, H, 2.5, true);
  windowSymbol(d, W, H * 0.5, 2.5, false);
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloorPlanDXF(
  answers: ProjectAnswers,
  structureType: string,
  projectName: string
): string {
  const sqft = n(answers.squareFootage, 1500);
  const stories = Math.max(n(answers.stories, 1), 1);
  const footprint = sqft / stories;
  const bedrooms = n(answers.bedrooms, 3);
  const bathrooms = parseFloat(String(answers.bathrooms ?? "2")) || 2;

  // Building footprint dimensions (slightly wider than deep)
  const W = r(Math.sqrt(footprint * 1.4));
  const H = r(Math.sqrt(footprint / 1.4));

  const d = new Drawing();
  d.setUnits("Feet");

  // Layers
  d.addLayer("WALLS", Drawing.ACI.WHITE, "CONTINUOUS");
  d.addLayer("DOORS", Drawing.ACI.CYAN, "CONTINUOUS");
  d.addLayer("WINDOWS", Drawing.ACI.GREEN, "CONTINUOUS");
  d.addLayer("DIMENSIONS", Drawing.ACI.YELLOW, "CONTINUOUS");
  d.addLayer("TEXT", Drawing.ACI.WHITE, "CONTINUOUS");
  d.addLayer("TITLE", Drawing.ACI.WHITE, "CONTINUOUS");
  d.addLayer("EXTERIOR", Drawing.ACI.RED, "CONTINUOUS");

  // ── Exterior shell ──
  d.setActiveLayer("EXTERIOR");
  rect(d, 0, 0, W, H);
  // Wall thickness lines (0.5ft inset)
  const t = 0.5;
  rect(d, t, t, W - 2 * t, H - 2 * t);

  // ── Interior layout ──
  const cat = structureCategory(structureType);

  if (cat === "residential") {
    drawResidential(d, answers, W, H, bedrooms, bathrooms);
  } else if (cat === "agricultural") {
    drawAgricultural(d, W, H, structureType);
  } else if (cat === "container") {
    drawContainer(d, answers, W, H);
  } else if (cat === "outbuilding") {
    const labels: Record<string, string> = {
      SHED: "STORAGE / SHED",
      WORKSHOP: "WORKSHOP",
      GARAGE: "GARAGE",
    };
    drawSimpleShell(d, W, H, labels[structureType] ?? "OUTBUILDING");
  } else if (cat === "dome") {
    d.setActiveLayer("EXTERIOR");
    d.drawCircle(W / 2, H / 2, W / 2);
    d.setActiveLayer("TEXT");
    roomLabel(d, 0, 0, W, H, "DOME / GEODESIC");
    d.setActiveLayer("WALLS");
    d.drawCircle(W / 2, H / 2, W / 2 - 0.5);
  } else if (cat === "quonset") {
    d.setActiveLayer("EXTERIOR");
    d.drawArc(W / 2, 0, W / 2, 0, 180);
    d.drawLine(0, 0, 0, H / 3);
    d.drawLine(W, 0, W, H / 3);
    d.setActiveLayer("TEXT");
    roomLabel(d, 0, 0, W, H * 0.5, "QUONSET / OPEN");
  } else {
    drawSimpleShell(d, W, H, structureType.replace(/_/g, " "));
  }

  // ── Dimension lines ──
  d.setActiveLayer("DIMENSIONS");
  dimension(d, 0, 0, W, 0, -3, true, `${r(W, 0)}'-0"`);
  dimension(d, 0, 0, 0, H, -3, false, `${r(H, 0)}'-0"`);

  // ── Title block ──
  d.setActiveLayer("TITLE");
  titleBlock(d, W + 4, 0, projectName, structureType, sqft);

  // ── Sheet border ──
  d.setActiveLayer("TITLE");
  const sheetW = W + 20;
  const sheetH = H + 8;
  rect(d, -4, -5, sheetW, sheetH);
  // Sheet label
  d.drawText(-3, sheetH - 5.5, 0.5, 0, "FLOOR PLAN — SHEET 1 OF 1");
  d.drawText(-3, sheetH - 6.1, 0.35, 0, `PRELIMINARY SCHEMATIC — NOT FOR CONSTRUCTION`);

  return d.toDxfString();
}

// ─── Category helper (mirrors materialCalculator) ─────────────────────────────

type StructureCategory = "residential" | "container" | "agricultural" | "outbuilding" | "dome" | "quonset" | "earthship";

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
