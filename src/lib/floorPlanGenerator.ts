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

function rn(v: number, decimals = 1): number {
  return Math.round(v * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function ft(v: number): string {
  const whole = Math.floor(Math.abs(v));
  const inches = Math.round((Math.abs(v) - whole) * 12);
  if (inches === 0) return `${whole}'-0"`;
  if (inches === 12) return `${whole + 1}'-0"`;
  return `${whole}'-${inches}"`;
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function rect(d: typeof Drawing, x: number, y: number, w: number, h: number) {
  d.drawLine(x, y, x + w, y);
  d.drawLine(x + w, y, x + w, y + h);
  d.drawLine(x + w, y + h, x, y + h);
  d.drawLine(x, y + h, x, y);
}

function wallH(d: typeof Drawing, x1: number, y: number, x2: number, t: number) {
  d.drawLine(x1, y, x2, y);
  d.drawLine(x1, y + t, x2, y + t);
}

function wallV(d: typeof Drawing, x: number, y1: number, y2: number, t: number) {
  d.drawLine(x, y1, x, y2);
  d.drawLine(x + t, y1, x + t, y2);
}

function doorSwing(d: typeof Drawing, hx: number, hy: number, radius: number, startDeg: number, endDeg: number) {
  d.drawArc(hx, hy, radius, startDeg, endDeg);
  const endRad = (endDeg * Math.PI) / 180;
  d.drawLine(hx, hy, hx + radius * Math.cos(endRad), hy + radius * Math.sin(endRad));
}

function winH(d: typeof Drawing, x: number, y: number, w: number, depth = 0.5) {
  d.drawLine(x, y, x + w, y);
  d.drawLine(x, y + depth, x + w, y + depth);
  d.drawLine(x, y, x, y + depth);
  d.drawLine(x + w, y, x + w, y + depth);
}

function winV(d: typeof Drawing, x: number, y: number, h: number, depth = 0.5) {
  d.drawLine(x, y, x, y + h);
  d.drawLine(x + depth, y, x + depth, y + h);
  d.drawLine(x, y, x + depth, y);
  d.drawLine(x, y + h, x + depth, y + h);
}

// Full dimension line with extension lines and label
function dim(d: typeof Drawing, x1: number, y1: number, x2: number, y2: number, offset: number, lbl: string) {
  const isH = Math.abs(y2 - y1) < 0.01;
  const tick = 0.4;
  if (isH) {
    const dy = y1 + offset;
    d.drawLine(x1, dy, x2, dy);
    d.drawLine(x1, y1, x1, dy + (offset > 0 ? tick : -tick));
    d.drawLine(x2, y1, x2, dy + (offset > 0 ? tick : -tick));
    d.drawText((x1 + x2) / 2 - lbl.length * 0.13, dy + (offset > 0 ? 0.2 : -0.65), 0.45, 0, lbl);
  } else {
    const dx = x1 + offset;
    d.drawLine(dx, y1, dx, y2);
    d.drawLine(x1, y1, dx + (offset > 0 ? tick : -tick), y1);
    d.drawLine(x1, y2, dx + (offset > 0 ? tick : -tick), y2);
    d.drawText(dx + (offset > 0 ? 0.2 : -0.8), (y1 + y2) / 2 - 0.2, 0.45, 90, lbl);
  }
}

// Compact interior dimension (smaller offset, smaller text)
function dimI(d: typeof Drawing, x1: number, y1: number, x2: number, y2: number, offset: number, lbl: string) {
  const isH = Math.abs(y2 - y1) < 0.01;
  const tick = 0.28;
  if (isH) {
    const dy = y1 + offset;
    d.drawLine(x1, dy, x2, dy);
    d.drawLine(x1, y1, x1, dy + (offset > 0 ? tick : -tick));
    d.drawLine(x2, y1, x2, dy + (offset > 0 ? tick : -tick));
    d.drawText((x1 + x2) / 2 - lbl.length * 0.09, dy + (offset > 0 ? 0.12 : -0.48), 0.35, 0, lbl);
  } else {
    const dx = x1 + offset;
    d.drawLine(dx, y1, dx, y2);
    d.drawLine(x1, y1, dx + (offset > 0 ? tick : -tick), y1);
    d.drawLine(x1, y2, dx + (offset > 0 ? tick : -tick), y2);
    d.drawText(dx + (offset > 0 ? 0.12 : -0.6), (y1 + y2) / 2 - 0.15, 0.35, 90, lbl);
  }
}

function label(d: typeof Drawing, x: number, y: number, w: number, h: number, name: string, dims = "") {
  const cx = x + w / 2;
  const cy = y + h / 2;
  d.drawText(cx - name.length * 0.22, cy + (dims ? 0.35 : 0), 0.5, 0, name);
  if (dims) d.drawText(cx - dims.length * 0.14, cy - 0.3, 0.35, 0, dims);
}

// 45-degree hatch fill (for foundations, etc.)
function hatch(d: typeof Drawing, x: number, y: number, w: number, h: number, spacing = 1.5) {
  for (let t = spacing; t < w + h; t += spacing) {
    const x1 = x + Math.max(0, t - h);
    const y1 = y + Math.min(h, t);
    const x2 = x + Math.min(w, t);
    const y2 = y + Math.max(0, t - w);
    d.drawLine(x1, y1, x2, y2);
  }
}

// Graphic scale bar (10-ft segments)
function scaleBar(d: typeof Drawing, x: number, y: number) {
  const segW = 10;
  for (let i = 0; i < 3; i++) {
    rect(d, x + i * segW, y, segW, 0.7);
    d.drawText(x + i * segW - 0.2, y - 0.9, 0.38, 0, `${i * 10}'`);
  }
  d.drawText(x + 30 - 0.2, y - 0.9, 0.38, 0, "30'");
  d.drawText(x + 5, y + 1.0, 0.38, 0, "SCALE: 1\" = 10'-0\"");
}

// North arrow
function northArrow(d: typeof Drawing, x: number, y: number) {
  const shaft = 3.0;
  d.drawLine(x, y, x, y + shaft);
  d.drawLine(x, y + shaft, x - 0.7, y + shaft - 1.2);
  d.drawLine(x, y + shaft, x + 0.7, y + shaft - 1.2);
  d.drawCircle(x, y, 1.0);
  d.drawText(x - 0.3, y + shaft + 0.3, 0.8, 0, "N");
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function bathFixtures(d: typeof Drawing, x: number, y: number, w: number, h: number) {
  const m = 0.4;
  const tcx = x + w * 0.25, tcy = y + m + 1.0;
  d.drawCircle(tcx, tcy, 0.85);
  d.drawCircle(tcx, tcy, 0.55);
  d.drawLine(tcx - 0.85, tcy - 0.9, tcx + 0.85, tcy - 0.9);
  d.drawLine(tcx - 0.85, tcy - 0.9, tcx - 0.85, tcy - 0.55);
  d.drawLine(tcx + 0.85, tcy - 0.9, tcx + 0.85, tcy - 0.55);
  d.drawArc(tcx, tcy - 0.55, 0.85, 0, 180);
  const scx = x + w * 0.72, scy = y + m + 0.9;
  rect(d, scx - 0.8, scy - 0.75, 1.6, 1.5);
  d.drawCircle(scx, scy + 0.1, 0.35);
  if (h > 6.5) {
    const tx = x + m, ty = y + h - m - 4.5, tw = w - m * 2, th = 3.8;
    rect(d, tx, ty, tw, th);
    d.drawLine(tx + 0.35, ty + 0.35, tx + tw - 0.35, ty + 0.35);
    d.drawLine(tx + 0.35, ty + th - 0.35, tx + tw - 0.35, ty + th - 0.35);
    d.drawLine(tx + 0.35, ty + 0.35, tx + 0.35, ty + th - 0.35);
    d.drawLine(tx + tw - 0.35, ty + 0.35, tx + tw - 0.35, ty + th - 0.35);
  }
}

function halfBathFixtures(d: typeof Drawing, x: number, y: number, w: number, h: number) {
  const m = 0.3;
  const tcx = x + w * 0.3, tcy = y + m + 1.0;
  d.drawCircle(tcx, tcy, 0.8);
  d.drawCircle(tcx, tcy, 0.5);
  d.drawLine(tcx - 0.8, tcy - 0.85, tcx + 0.8, tcy - 0.85);
  d.drawLine(tcx - 0.8, tcy - 0.85, tcx - 0.8, tcy - 0.5);
  d.drawLine(tcx + 0.8, tcy - 0.85, tcx + 0.8, tcy - 0.5);
  d.drawArc(tcx, tcy - 0.5, 0.8, 0, 180);
  const scx = x + w * 0.72, scy = y + m + 0.75;
  rect(d, scx - 0.65, scy - 0.6, 1.3, 1.2);
  d.drawCircle(scx, scy + 0.1, 0.28);
}

function kitchenCounters(d: typeof Drawing, x: number, y: number, w: number, h: number) {
  const cD = 1.8;
  d.drawLine(x, y + h - cD, x + w * 0.8, y + h - cD);
  d.drawLine(x + w * 0.8, y + h, x + w * 0.8, y + h - cD);
  d.drawLine(x + cD, y + h - cD, x + cD, y + h * 0.15);
  d.drawLine(x, y + h * 0.15, x + cD, y + h * 0.15);
  const iW = rn(w * 0.42), iH = rn(h * 0.28);
  rect(d, x + (w - iW) / 2 + 0.5, y + (h - iH) / 2 - 0.5, iW, iH);
}

function closetShelves(d: typeof Drawing, x: number, y: number, w: number, h: number) {
  const shelfD = 1.2;
  d.drawLine(x, y + shelfD, x + w, y + shelfD);
  d.drawLine(x, y + shelfD * 2, x + w, y + shelfD * 2);
  d.drawLine(x, y + h - shelfD, x + w, y + h - shelfD);
  d.drawLine(x, y + h - shelfD * 2, x + w, y + h - shelfD * 2);
}

// ─── Title block ──────────────────────────────────────────────────────────────

function titleBlock(d: typeof Drawing, x: number, y: number, projectName: string, structureType: string, sqft: number) {
  const w = 18, h = 6.5;
  rect(d, x, y, w, h);
  d.drawLine(x, y + 4.5, x + w, y + 4.5);
  d.drawLine(x, y + 3.4, x + w, y + 3.4);
  d.drawLine(x, y + 1.8, x + w, y + 1.8);
  d.drawLine(x + 6, y, x + 6, y + 1.8);
  d.drawLine(x + 12, y, x + 12, y + 1.8);
  d.drawLine(x + 9, y + 1.8, x + 9, y + 3.4);

  d.drawText(x + 0.3, y + 5.6, 0.7, 0, projectName.substring(0, 22));
  d.drawText(x + 0.3, y + 4.85, 0.4, 0, structureType.replace(/_/g, " "));
  d.drawText(x + 0.3, y + 4.1, 0.42, 0, "FLOOR PLAN + FRONT ELEVATION");
  d.drawText(x + 0.3, y + 3.6, 0.3, 0, "PRELIMINARY SCHEMATIC — SHEET A1");

  d.drawText(x + 0.3, y + 2.5, 0.28, 0, "TOTAL AREA");
  d.drawText(x + 0.3, y + 2.0, 0.48, 0, `${sqft.toLocaleString()} SF`);
  d.drawText(x + 9.3, y + 2.5, 0.28, 0, "SCALE");
  d.drawText(x + 9.3, y + 2.0, 0.42, 0, "1\" = 10'-0\"");

  d.drawText(x + 0.3, y + 1.3, 0.28, 0, "DATE:");
  d.drawText(x + 0.3, y + 0.8, 0.32, 0, new Date().toLocaleDateString("en-US"));
  d.drawText(x + 6.3, y + 1.3, 0.28, 0, "DRAWN BY:");
  d.drawText(x + 6.3, y + 0.8, 0.32, 0, "BUILDWELL AI");
  d.drawText(x + 12.3, y + 1.3, 0.28, 0, "SHEET:");
  d.drawText(x + 12.3, y + 0.8, 0.48, 0, "A1");

  d.drawText(x + 0.3, y + 0.25, 0.25, 0, "NOT FOR CONSTRUCTION  ·  BUILDWELL LLC  ·  ibuildwell.com");
}

// ─── Elevation helpers ────────────────────────────────────────────────────────

function elevFooter(d: typeof Drawing, x: number, y: number, W: number, foundH: number) {
  d.setActiveLayer("TEXT");
  d.drawLine(x - 3, y + foundH, x + W + 3, y + foundH);
  d.drawText(x - 7.5, y + foundH - 0.3, 0.38, 0, "F.F.E.");
  d.drawText(x + W / 2 - 5.5, y - 2.0, 0.55, 0, "FRONT ELEVATION");
  d.drawText(x + W / 2 - 7.5, y - 2.9, 0.35, 0, "PRELIMINARY — NOT FOR CONSTRUCTION");
}

function elevFoundation(d: typeof Drawing, x: number, y: number, W: number, foundH: number) {
  d.setActiveLayer("WALLS");
  rect(d, x, y, W, foundH);
  hatch(d, x + 0.1, y + 0.1, W - 0.2, foundH - 0.2, 1.2);
}

// Gable elevation — residential, barndominium, agricultural, outbuildings, log cabin, passive solar
function drawGableElevation(d: typeof Drawing, x: number, y: number, W: number, structureType: string, answers: ProjectAnswers) {
  const cat = structureCategory(structureType);
  const wallHt = structureType === "TINY_HOME" ? 8.0 : 9.0;
  const isBarn = cat === "barndominium" || cat === "agricultural";
  const pitch = isBarn ? 3 / 12 : 5.5 / 12;
  const rise = (W / 2) * pitch;
  const foundH = 2.0;
  const hasGarage = !s(answers.garageType, "none").startsWith("none");
  const overhang = isBarn ? 1.0 : 2.0;

  elevFoundation(d, x, y, W, foundH);

  // Walls
  d.setActiveLayer("EXTERIOR");
  rect(d, x, y + foundH, W, wallHt);
  // Log cabin horizontal courses
  if (structureType === "LOG_CABIN") {
    const logH = 0.65;
    for (let ly = foundH + logH; ly < foundH + wallHt; ly += logH) {
      d.drawLine(x, y + ly, x + W, y + ly);
    }
  }

  // Roof gable + overhangs
  const plateY = y + foundH + wallHt;
  d.drawLine(x - overhang, plateY, x + W + overhang, plateY);
  d.drawLine(x - overhang, plateY, x + W / 2, plateY + rise + 0.5);
  d.drawLine(x + W + overhang, plateY, x + W / 2, plateY + rise + 0.5);
  d.drawLine(x + W / 2 - 0.15, plateY, x + W / 2 - 0.15, plateY + rise + 0.5);
  d.drawLine(x + W / 2 + 0.15, plateY, x + W / 2 + 0.15, plateY + rise + 0.5);

  // Metal roofing ribs for barn types
  if (isBarn) {
    const ribCount = Math.floor(W / 3);
    for (let i = 1; i < ribCount; i++) {
      const bx = x + i * (W / ribCount);
      const brise = (bx <= x + W / 2) ? (bx - x) * pitch : (x + W - bx) * pitch;
      d.drawLine(bx, plateY, bx, plateY + brise);
    }
  }

  // Front door
  d.setActiveLayer("DOORS");
  const fdW = structureType === "TINY_HOME" ? 2.8 : 3.0;
  const fdH = structureType === "TINY_HOME" ? 6.8 : 7.0;
  const fdX = x + W * 0.45;
  rect(d, fdX, y + foundH, fdW, fdH);
  if (!isBarn) {
    d.drawArc(fdX + fdW / 2, y + foundH + fdH, fdW / 2, 0, 180);
    d.drawLine(fdX + fdW / 2, y + foundH, fdX + fdW / 2, y + foundH + fdH);
    d.drawLine(fdX, y + foundH + fdH * 0.5, fdX + fdW, y + foundH + fdH * 0.5);
  }

  // Garage door (if applicable)
  if (hasGarage) {
    d.setActiveLayer("DOORS");
    const gdW = W * 0.38, gdX2 = x + W * 0.05;
    rect(d, gdX2, y + foundH, gdW, 8.0);
    for (let p = 1; p < 5; p++) d.drawLine(gdX2, y + foundH + p * 2.0, gdX2 + gdW, y + foundH + p * 2.0);
    for (let v = 1; v < 4; v++) d.drawLine(gdX2 + v * (gdW / 4), y + foundH, gdX2 + v * (gdW / 4), y + foundH + 8.0);
  } else if (isBarn) {
    // Sliding barn doors
    d.setActiveLayer("DOORS");
    const bdW = W * 0.35, bdX = x + (W - bdW) / 2;
    rect(d, bdX, y + foundH, bdW, 12.0);
    d.drawLine(bdX + bdW / 2, y + foundH, bdX + bdW / 2, y + foundH + 12.0);
    d.drawLine(bdX, y + foundH + 6, bdX + bdW, y + foundH + 6);
  }

  // Windows
  d.setActiveLayer("WINDOWS");
  const winW = structureType === "TINY_HOME" ? 2.5 : 4.0;
  const winHt = structureType === "TINY_HOME" ? 3.0 : 4.5;
  const winY = y + foundH + 2.8;
  if (hasGarage) {
    rect(d, x + W * 0.58, winY, winW, winHt);
    rect(d, x + W * 0.74, winY, 3.0, winHt);
    d.drawLine(x + W * 0.58 - 0.3, winY, x + W * 0.58 + winW + 0.3, winY);
    d.drawLine(x + W * 0.74 - 0.3, winY, x + W * 0.74 + 3.3, winY);
  } else if (!isBarn) {
    rect(d, x + W * 0.08, winY, winW, winHt);
    rect(d, x + W * 0.72, winY, winW, winHt);
    d.drawLine(x + W * 0.08 - 0.3, winY, x + W * 0.08 + winW + 0.3, winY);
    d.drawLine(x + W * 0.72 - 0.3, winY, x + W * 0.72 + winW + 0.3, winY);
    d.drawLine(x + W * 0.08 + winW / 2, winY, x + W * 0.08 + winW / 2, winY + winHt);
    d.drawLine(x + W * 0.72 + winW / 2, winY, x + W * 0.72 + winW / 2, winY + winHt);
    d.drawLine(x + W * 0.08, winY + winHt / 2, x + W * 0.08 + winW, winY + winHt / 2);
    d.drawLine(x + W * 0.72, winY + winHt / 2, x + W * 0.72 + winW, winY + winHt / 2);
  } else {
    // Barn side windows
    rect(d, x + W * 0.12, winY, 3.5, 3.5);
    rect(d, x + W * 0.72, winY, 3.5, 3.5);
  }

  // Chimney (residential/cabin, not barns)
  if (cat === "residential" && structureType !== "TINY_HOME") {
    d.setActiveLayer("WALLS");
    const chX = x + W * 0.7, chW = 2.5;
    const chTop = plateY + rise * 0.55 + 3.0;
    rect(d, chX, plateY - 1, chW, chTop - plateY + 1);
    d.drawLine(chX - 0.4, chTop, chX + chW + 0.4, chTop);
  }

  // Outbuilding overhead doors
  if (cat === "outbuilding") {
    d.setActiveLayer("DOORS");
    const bays = n(answers.garageBays, 1);
    const bayW2 = W / Math.max(bays, 1);
    for (let i = 0; i < bays; i++) {
      const gdW2 = bayW2 * 0.72, gdX3 = x + i * bayW2 + (bayW2 - gdW2) / 2;
      rect(d, gdX3, y + foundH, gdW2, 8.0);
      for (let p = 1; p < 5; p++) d.drawLine(gdX3, y + foundH + p * 2.0, gdX3 + gdW2, y + foundH + p * 2.0);
      for (let v = 1; v < 4; v++) d.drawLine(gdX3 + v * (gdW2 / 4), y + foundH, gdX3 + v * (gdW2 / 4), y + foundH + 8.0);
    }
  }

  d.setActiveLayer("DIMENSIONS");
  dim(d, x, y + foundH, x + W, y + foundH, -3.5, ft(W));
  dim(d, x, y + foundH, x, plateY, -5.0, `PLATE: ${wallHt}'-0"`);
  dim(d, x + W, y + foundH, x + W, plateY + rise, 4.5, ft(wallHt + rise));

  elevFooter(d, x, y, W, foundH);
}

// A-Frame elevation — steep triangle, roof reaches to foundation
function drawAFrameElevation(d: typeof Drawing, x: number, y: number, W: number) {
  const foundH = 1.5;
  const pitch = 1.1; // ~13:12 — true A-frame steepness
  const rise = (W / 2) * pitch;
  const baseY = y + foundH;

  elevFoundation(d, x, y, W, foundH);

  d.setActiveLayer("EXTERIOR");
  // Roof slopes go directly to grade (no vertical wall)
  d.drawLine(x + W / 2, baseY + rise, x, baseY);
  d.drawLine(x + W / 2, baseY + rise, x + W, baseY);
  d.drawLine(x, baseY, x + W, baseY);
  // Slight overhang at ridge
  d.drawLine(x + W / 2, baseY + rise, x + W / 2, baseY + rise + 0.8);

  // Front door (centered at base)
  d.setActiveLayer("DOORS");
  const fdW = 3.0, fdH = 7.5;
  rect(d, x + W / 2 - fdW / 2, baseY, fdW, fdH);
  d.drawArc(x + W / 2, baseY + fdH, fdW / 2, 0, 180);
  d.drawLine(x + W / 2, baseY, x + W / 2, baseY + fdH);

  // Upper gable window (large glazing — classic A-frame feature)
  d.setActiveLayer("WINDOWS");
  const upWinW = W * 0.38, upWinH = rise * 0.38;
  const upWinX = x + (W - upWinW) / 2;
  const upWinY = baseY + rise * 0.52;
  rect(d, upWinX, upWinY, upWinW, upWinH);
  d.drawLine(upWinX + upWinW / 3, upWinY, upWinX + upWinW / 3, upWinY + upWinH);
  d.drawLine(upWinX + upWinW * 2 / 3, upWinY, upWinX + upWinW * 2 / 3, upWinY + upWinH);
  d.drawLine(upWinX, upWinY + upWinH / 2, upWinX + upWinW, upWinY + upWinH / 2);
  // Lower side windows
  const sWinW = 3.0, sWinH = 3.5, sWinY = baseY + 1.5;
  rect(d, x + W * 0.07, sWinY, sWinW, sWinH);
  rect(d, x + W * 0.78, sWinY, sWinW, sWinH);

  d.setActiveLayer("DIMENSIONS");
  dim(d, x, baseY, x + W, baseY, -3.5, ft(W));
  dim(d, x + W, baseY, x + W, baseY + rise, 4.5, ft(rise));

  elevFooter(d, x, y, W, foundH);
}

// Dome elevation — hemisphere profile
function drawDomeElevation(d: typeof Drawing, x: number, y: number, W: number) {
  const foundH = 1.5;
  const r = W / 2;
  const cx = x + W / 2;
  const baseY = y + foundH;

  elevFoundation(d, x, y, W, foundH);

  d.setActiveLayer("EXTERIOR");
  d.drawArc(cx, baseY, r, 0, 180);
  d.drawLine(x, baseY, x + W, baseY);
  // Inner dome line (shell thickness)
  d.drawArc(cx, baseY, r - 0.5, 0, 180);
  // Geodesic triangulation lines
  for (let i = 1; i < 4; i++) {
    const ang = (i / 4) * 180;
    const rad = (ang * Math.PI) / 180;
    d.drawLine(cx, baseY, cx + r * Math.cos(Math.PI - rad), baseY + r * Math.sin(Math.PI - rad));
  }

  // Entry door (arched, centered at base)
  d.setActiveLayer("DOORS");
  const fdW = 3.5, fdH = 7.0;
  rect(d, cx - fdW / 2, baseY, fdW, fdH);
  d.drawArc(cx, baseY + fdH, fdW / 2, 0, 180);

  // Circular porthole windows
  d.setActiveLayer("WINDOWS");
  d.drawCircle(cx - r * 0.52, baseY + r * 0.52, 2.2);
  d.drawCircle(cx + r * 0.52, baseY + r * 0.52, 2.2);
  // Skylight at apex
  d.drawCircle(cx, baseY + r * 0.88, 1.5);

  d.setActiveLayer("DIMENSIONS");
  dim(d, x, baseY, x + W, baseY, -3.5, ft(W));
  dim(d, x + W, baseY, x + W, baseY + r, 4.5, `R: ${ft(r)}`);

  elevFooter(d, x, y, W, foundH);
}

// Quonset hut elevation — semi-cylinder arch
function drawQuonsetElevation(d: typeof Drawing, x: number, y: number, W: number) {
  const foundH = 1.5;
  const legH = W * 0.12; // short vertical leg walls
  const archR = W / 2;
  const cx = x + W / 2;
  const baseY = y + foundH;

  elevFoundation(d, x, y, W, foundH);

  d.setActiveLayer("EXTERIOR");
  d.drawLine(x, baseY, x, baseY + legH);
  d.drawLine(x + W, baseY, x + W, baseY + legH);
  d.drawArc(cx, baseY + legH, archR, 0, 180);
  d.drawLine(x, baseY, x + W, baseY);
  // Inner arch (shell thickness)
  d.drawArc(cx, baseY + legH, archR - 0.5, 0, 180);
  // Corrugation ribs on arch
  const ribCount = 8;
  for (let i = 1; i < ribCount; i++) {
    const ang = (i / ribCount) * 180;
    const rad = (ang * Math.PI) / 180;
    const rx = cx + archR * Math.cos(Math.PI - rad);
    const ry = baseY + legH + archR * Math.sin(Math.PI - rad);
    d.drawLine(cx + (archR - 0.5) * Math.cos(Math.PI - rad), baseY + legH + (archR - 0.5) * Math.sin(Math.PI - rad), rx, ry);
  }

  // Roll-up door (centered, large)
  d.setActiveLayer("DOORS");
  const rdW = W * 0.58, rdH = Math.min(legH + archR * 0.72, 14.0);
  const rdX = cx - rdW / 2;
  rect(d, rdX, baseY, rdW, rdH);
  for (let p = 1; p < 6; p++) d.drawLine(rdX, baseY + p * rdH / 6, rdX + rdW, baseY + p * rdH / 6);
  for (let v = 1; v < 5; v++) d.drawLine(rdX + v * rdW / 5, baseY, rdX + v * rdW / 5, baseY + rdH);
  // Walk door on right
  const wdX = x + W * 0.86;
  rect(d, wdX, baseY, 3.0, 7.0);

  // Windows (porthole style)
  d.setActiveLayer("WINDOWS");
  d.drawCircle(cx - archR * 0.62, baseY + legH + archR * 0.52, 2.0);
  d.drawCircle(cx + archR * 0.62, baseY + legH + archR * 0.52, 2.0);

  d.setActiveLayer("DIMENSIONS");
  dim(d, x, baseY, x + W, baseY, -3.5, ft(W));
  dim(d, x + W, baseY, x + W, baseY + legH + archR, 4.5, ft(legH + archR));

  elevFooter(d, x, y, W, foundH);
}

// Container home elevation — flat/low roof, containers visible
function drawContainerElevation(d: typeof Drawing, x: number, y: number, W: number, answers: ProjectAnswers) {
  const foundH = 2.0;
  const cH = 9.5; // standard HC container height
  const count = Math.min(n(answers.containerCount, 2), 6);
  const stacked = Math.ceil(count / 2);
  const totalH = stacked * cH;
  const cx = x + W / 2;
  const baseY = y + foundH;

  elevFoundation(d, x, y, W, foundH);

  d.setActiveLayer("EXTERIOR");
  for (let i = 0; i < stacked; i++) {
    const cY = baseY + i * cH;
    rect(d, x, cY, W, cH);
    // Corrugation ribs
    const ribCount = Math.floor(W / 5);
    for (let r2 = 1; r2 < ribCount; r2++) d.drawLine(x + r2 * W / ribCount, cY, x + r2 * W / ribCount, cY + cH);
  }
  // Flat roof overhang
  d.drawLine(x - 1.5, baseY + totalH, x + W + 1.5, baseY + totalH);
  d.drawLine(x - 1.5, baseY + totalH - 0.5, x - 1.5, baseY + totalH);
  d.drawLine(x + W + 1.5, baseY + totalH - 0.5, x + W + 1.5, baseY + totalH);

  // Front door
  d.setActiveLayer("DOORS");
  const fdW = 3.0, fdH = 7.5;
  rect(d, cx - fdW / 2, baseY, fdW, fdH);
  d.drawLine(cx, baseY, cx, baseY + fdH);
  d.drawLine(cx - fdW / 2, baseY + fdH * 0.45, cx + fdW / 2, baseY + fdH * 0.45);

  // Windows per container level
  d.setActiveLayer("WINDOWS");
  const winW2 = 4.5, winHt2 = 4.0;
  for (let i = 0; i < stacked; i++) {
    const wBaseY = baseY + i * cH + 2.5;
    rect(d, x + W * 0.08, wBaseY, winW2, winHt2);
    rect(d, x + W * 0.68, wBaseY, winW2, winHt2);
    d.drawLine(x + W * 0.08 + winW2 / 2, wBaseY, x + W * 0.08 + winW2 / 2, wBaseY + winHt2);
    d.drawLine(x + W * 0.68 + winW2 / 2, wBaseY, x + W * 0.68 + winW2 / 2, wBaseY + winHt2);
    d.drawLine(x + W * 0.08, wBaseY + winHt2 / 2, x + W * 0.08 + winW2, wBaseY + winHt2 / 2);
    d.drawLine(x + W * 0.68, wBaseY + winHt2 / 2, x + W * 0.68 + winW2, wBaseY + winHt2 / 2);
  }
  // Container seam labels
  if (stacked > 1) {
    d.setActiveLayer("TEXT");
    d.drawText(x + W + 1.5, baseY + cH - 0.3, 0.32, 0, "CONTAINER JOINT");
  }

  d.setActiveLayer("DIMENSIONS");
  dim(d, x, baseY, x + W, baseY, -3.5, ft(W));
  dim(d, x + W, baseY, x + W, baseY + totalH, 4.5, ft(totalH));

  elevFooter(d, x, y, W, foundH);
}

// Silo elevation — cylindrical with dome cap
function drawSiloElevation(d: typeof Drawing, x: number, y: number, W: number) {
  const foundH = 2.0;
  const cylH = Math.min(W * 2.2, 50); // tall but capped
  const domR = W / 2;
  const cx = x + W / 2;
  const baseY = y + foundH;

  elevFoundation(d, x, y, W, foundH);

  d.setActiveLayer("EXTERIOR");
  // Cylinder walls
  d.drawLine(x, baseY, x, baseY + cylH);
  d.drawLine(x + W, baseY, x + W, baseY + cylH);
  d.drawLine(x, baseY, x + W, baseY);
  // Dome cap
  d.drawArc(cx, baseY + cylH, domR, 0, 180);
  // Horizontal stave bands
  const bandCount = 8;
  for (let i = 1; i <= bandCount; i++) d.drawLine(x, baseY + i * cylH / bandCount, x + W, baseY + i * cylH / bandCount);
  // Ladder on right face
  const ladW = 1.2, ladX = x + W - ladW - 0.5;
  d.drawLine(ladX, baseY + 2, ladX, baseY + cylH * 0.85);
  d.drawLine(ladX + ladW, baseY + 2, ladX + ladW, baseY + cylH * 0.85);
  for (let r3 = 0; r3 < 12; r3++) d.drawLine(ladX, baseY + 2 + r3 * (cylH * 0.83) / 12, ladX + ladW, baseY + 2 + r3 * (cylH * 0.83) / 12);

  // Entry door
  d.setActiveLayer("DOORS");
  rect(d, cx - 1.5, baseY, 3.0, 7.0);
  d.drawArc(cx, baseY + 7.0, 1.5, 0, 180);

  // Ventilation port near top
  d.setActiveLayer("WINDOWS");
  d.drawCircle(cx, baseY + cylH * 0.82, 1.2);

  d.setActiveLayer("DIMENSIONS");
  dim(d, x, baseY, x + W, baseY, -3.5, ft(W));
  dim(d, x + W, baseY, x + W, baseY + cylH, 4.5, ft(cylH));

  elevFooter(d, x, y, W, foundH);
}

// ─── Front elevation dispatcher ───────────────────────────────────────────────

function drawFrontElevation(d: typeof Drawing, x: number, y: number, W: number, structureType: string, answers: ProjectAnswers) {
  switch (structureType) {
    case "A_FRAME":
      drawAFrameElevation(d, x, y, W);
      break;
    case "DOME_HOME":
      drawDomeElevation(d, x, y, W);
      break;
    case "QUONSET_HUT":
      drawQuonsetElevation(d, x, y, W);
      break;
    case "CONTAINER_HOME":
      drawContainerElevation(d, x, y, W, answers);
      break;
    case "SILO":
      drawSiloElevation(d, x, y, W);
      break;
    default:
      drawGableElevation(d, x, y, W, structureType, answers);
      break;
  }
}

// ─── Residential layout ───────────────────────────────────────────────────────

function drawResidential(d: typeof Drawing, answers: ProjectAnswers, W: number, H: number, bedrooms: number, bathrooms: number) {
  const hasGarage = !s(answers.garageType, "none").startsWith("none");
  const xB = rn(W * 0.32), xC = rn(W * 0.49), xD = rn(W * 0.79);
  const yB = rn(H * 0.20), yC = rn(H * 0.50), yD = rn(H * 0.75), yBh = rn(H * 0.35);

  // Walls
  d.setActiveLayer("WALLS");
  if (hasGarage) {
    rect(d, 0, 0, xC, yB);
    rect(d, xC, 0, W - xC, yB);
  } else {
    rect(d, 0, 0, xB, yB);
    rect(d, xB, 0, xC - xB, yB);
    rect(d, xC, 0, W - xC, yB);
  }
  if (bedrooms >= 3) {
    const brW = rn(xB / 2);
    rect(d, 0, yB, brW, yC - yB);
    rect(d, brW, yB, xB - brW, yC - yB);
  } else {
    rect(d, 0, yB, xB, yC - yB);
  }
  rect(d, xB, yB, xC - xB, yBh - yB);
  rect(d, xB, yBh, xC - xB, yC - yBh);
  rect(d, xC, yB, xD - xC, yC - yB);
  rect(d, xD, yB, W - xD, yC - yB);
  rect(d, 0, yC, xB, H - yC);
  rect(d, xB, yC, xC - xB, yD - yC);
  rect(d, xB, yD, xC - xB, H - yD);
  rect(d, xC, yC, W - xC, H - yC);

  // Interior dimension lines
  d.setActiveLayer("DIMENSIONS");
  if (bedrooms >= 3) {
    const brW = rn(xB / 2);
    dimI(d, 0, yB, brW, yB, -1.2, ft(brW));
    dimI(d, brW, yB, xB, yB, -1.2, ft(xB - brW));
  } else {
    dimI(d, 0, yB, xB, yB, -1.2, ft(xB));
  }
  dimI(d, xC, yB, xD, yB, -1.2, ft(xD - xC));
  dimI(d, xD, yB, W, yB, -1.2, ft(W - xD));
  dimI(d, 0, 0, 0, yB, -1.8, ft(yB));
  dimI(d, 0, yB, 0, yC, -1.8, ft(yC - yB));
  dimI(d, 0, yC, 0, H, -1.8, ft(H - yC));

  // Room labels
  d.setActiveLayer("TEXT");
  if (hasGarage) {
    label(d, 0, 0, xC, yB, "GARAGE", `${ft(xC)} × ${ft(yB)}`);
    label(d, xC, 0, W - xC, yB, "FOYER / ENTRY", `${ft(W - xC)} × ${ft(yB)}`);
  } else {
    label(d, 0, 0, xB, yB, "LAUNDRY", `${ft(xB)} × ${ft(yB)}`);
    label(d, xB, 0, xC - xB, yB, "UTILITY", "");
    label(d, xC, 0, W - xC, yB, "FOYER", `${ft(W - xC)} × ${ft(yB)}`);
  }
  if (bedrooms >= 3) {
    const brW = rn(xB / 2);
    label(d, 0, yB, brW, yC - yB, "BEDROOM 2", `${ft(brW)} × ${ft(yC - yB)}`);
    label(d, brW, yB, xB - brW, yC - yB, "BEDROOM 3", `${ft(xB - brW)} × ${ft(yC - yB)}`);
  } else {
    label(d, 0, yB, xB, yC - yB, "BEDROOM 2", `${ft(xB)} × ${ft(yC - yB)}`);
  }
  label(d, xB, yB, xC - xB, yBh - yB, "HALL", "");
  label(d, xB, yBh, xC - xB, yC - yBh, "BATH", `${ft(xC - xB)} × ${ft(yC - yBh)}`);
  label(d, xC, yB, xD - xC, yC - yB, "KITCHEN", `${ft(xD - xC)} × ${ft(yC - yB)}`);
  label(d, xD, yB, W - xD, yC - yB, "DINING", `${ft(W - xD)} × ${ft(yC - yB)}`);
  label(d, 0, yC, xB, H - yC, "MASTER BEDROOM", `${ft(xB)} × ${ft(H - yC)}`);
  label(d, xB, yC, xC - xB, yD - yC, "M. BATH", `${ft(xC - xB)} × ${ft(yD - yC)}`);
  label(d, xB, yD, xC - xB, H - yD, "W.I.C.", "");
  label(d, xC, yC, W - xC, H - yC, "LIVING ROOM", `${ft(W - xC)} × ${ft(H - yC)}`);

  // Doors
  d.setActiveLayer("DOORS");
  const dW = 3.0, edW = 3.2;
  doorSwing(d, xC + (W - xC) * 0.35, 0, edW, 0, 90);
  if (hasGarage) {
    const gdW = Math.min(xC * 0.6, 16), gdX = (xC - gdW) / 2;
    rect(d, gdX, 0, gdW, 1.0);
    d.setActiveLayer("TEXT");
    d.drawText(gdX + gdW / 2 - 3.5, -1.5, 0.4, 0, `OVERHEAD DOOR ${Math.round(gdW)}'-0"`);
    d.setActiveLayer("DOORS");
  }
  if (bedrooms >= 3) {
    const brW = rn(xB / 2);
    doorSwing(d, brW - dW, yB, dW, 90, 180);
    doorSwing(d, xB - dW, yB, dW, 90, 180);
  } else {
    doorSwing(d, xB / 2, yB, dW, 90, 180);
  }
  doorSwing(d, xB, yBh + dW, dW, 270, 360);
  doorSwing(d, xB * 0.5, yC, dW, 0, 90);
  doorSwing(d, xB, yC + dW, dW, 90, 180);
  doorSwing(d, xB, yD + dW, dW, 90, 180);
  doorSwing(d, xC, yB * 0.5, dW, 90, 180);

  // Windows
  d.setActiveLayer("WINDOWS");
  const winW = 4.0, winW2 = 3.0, winD = 0.5;
  if (!hasGarage) winH(d, W * 0.08, 0, winW2, winD);
  winH(d, xC + (W - xC) * 0.6, 0, winW, winD);
  winH(d, W * 0.05, H - winD, winW2, winD);
  winH(d, xC + (W - xC) * 0.1, H - winD, winW, winD);
  winH(d, xC + (W - xC) * 0.55, H - winD, winW, winD);
  winV(d, 0, yB + (yC - yB) * 0.35, winW2, winD);
  winV(d, 0, yC + (H - yC) * 0.4, winW2, winD);
  winV(d, W - winD, yC + (H - yC) * 0.25, winW, winD);
  winV(d, W - winD, yB + (yC - yB) * 0.45, winW2, winD);

  // Fixtures
  d.setActiveLayer("WALLS");
  bathFixtures(d, xB, yC, xC - xB, yD - yC);
  if ((xC - xB) * (yC - yBh) > 45) {
    bathFixtures(d, xB, yBh, xC - xB, yC - yBh);
  } else {
    halfBathFixtures(d, xB, yBh, xC - xB, yC - yBh);
  }
  kitchenCounters(d, xC, yB, xD - xC, yC - yB);
  closetShelves(d, xB, yD, xC - xB, H - yD);
  const fpW = 5.0, fpX = xC + (W - xC) / 2 - fpW / 2;
  rect(d, fpX, H - 1.3, fpW, 1.3);
  d.drawLine(fpX + 0.5, H - 1.0, fpX + fpW - 0.5, H - 1.0);
  d.setActiveLayer("TEXT");
  d.drawText(fpX + fpW / 2 - 0.35, H - 0.85, 0.35, 0, "FP");
}

// ─── Barndominium layout ──────────────────────────────────────────────────────

function drawBarndominium(d: typeof Drawing, answers: ProjectAnswers, W: number, H: number, bedrooms: number) {
  const shopW = rn(W * 0.55);
  const livingW = W - shopW;
  const t = 0.5;

  // Shop side — open bay with post grid
  d.setActiveLayer("WALLS");
  rect(d, 0, 0, shopW, H);
  const postSp = 12, postSz = 0.75;
  for (let px = postSp; px < shopW; px += postSp) {
    for (let py = postSp; py < H; py += postSp) {
      rect(d, px - postSz / 2, py - postSz / 2, postSz, postSz);
      d.drawLine(px - postSz / 2, py - postSz / 2, px + postSz / 2, py + postSz / 2);
      d.drawLine(px + postSz / 2, py - postSz / 2, px - postSz / 2, py + postSz / 2);
    }
  }

  // Overhead doors on shop south wall
  d.setActiveLayer("DOORS");
  const ohW = Math.min(shopW * 0.4, 14);
  const ohX1 = shopW * 0.08, ohX2 = shopW * 0.52;
  rect(d, ohX1, 0, ohW, 1.2);
  d.drawLine(ohX1, 0, ohX1 + ohW, 1.2);
  rect(d, ohX2, 0, ohW, 1.2);
  d.drawLine(ohX2, 0, ohX2 + ohW, 1.2);
  d.setActiveLayer("TEXT");
  d.drawText(ohX1 + ohW / 2 - 3.5, -1.6, 0.38, 0, `OVERHEAD ${Math.round(ohW)}'-0"`);
  d.drawText(ohX2 + ohW / 2 - 3.5, -1.6, 0.38, 0, `OVERHEAD ${Math.round(ohW)}'-0"`);

  // Shop label
  d.setActiveLayer("TEXT");
  label(d, 0, H * 0.5, shopW, H * 0.3, "SHOP / GARAGE", `${ft(shopW)} × ${ft(H)}`);
  d.drawText(shopW * 0.06, H * 0.22, 0.4, 0, "CLEAR SPAN — SEE STRUCTURAL");
  d.drawText(shopW * 0.06, H * 0.14, 0.35, 0, "CONCRETE SLAB ON GRADE");

  // Separator wall
  d.setActiveLayer("WALLS");
  wallV(d, shopW, 0, H, t);

  // Living side layout
  const yEntry = rn(H * 0.18);
  const yLiving = rn(H * 0.50);
  const yBeds = rn(H * 0.72);
  const bathW = rn(livingW * 0.35);
  const bed1W = rn((livingW - bathW) / 2);
  const bed2W = livingW - bathW - bed1W;

  d.setActiveLayer("WALLS");
  rect(d, shopW, 0, livingW, yEntry);
  rect(d, shopW, yEntry, livingW, yLiving - yEntry);
  rect(d, shopW, yLiving, bed1W, yBeds - yLiving);
  rect(d, shopW + bed1W, yLiving, bathW, yBeds - yLiving);
  rect(d, shopW + bed1W + bathW, yLiving, bed2W, yBeds - yLiving);

  if (bedrooms >= 3) {
    const masterW = rn(livingW * 0.55), mbathW = livingW - masterW;
    rect(d, shopW, yBeds, masterW, H - yBeds);
    rect(d, shopW + masterW, yBeds, mbathW, H - yBeds);
    d.setActiveLayer("TEXT");
    label(d, shopW, yBeds, masterW, H - yBeds, "MASTER BEDROOM", `${ft(masterW)} × ${ft(H - yBeds)}`);
    label(d, shopW + masterW, yBeds, mbathW, H - yBeds, "M. BATH / WIC", "");
    d.setActiveLayer("WALLS");
    bathFixtures(d, shopW + masterW, yBeds, mbathW, H - yBeds);
    closetShelves(d, shopW + masterW + mbathW * 0.55, yBeds, mbathW * 0.45, H - yBeds);
  } else {
    rect(d, shopW, yBeds, livingW, H - yBeds);
    d.setActiveLayer("TEXT");
    label(d, shopW, yBeds, livingW, H - yBeds, "MASTER BEDROOM", `${ft(livingW)} × ${ft(H - yBeds)}`);
    d.setActiveLayer("WALLS");
    bathFixtures(d, shopW, yBeds, livingW * 0.45, H - yBeds);
  }

  // Fixtures
  d.setActiveLayer("WALLS");
  halfBathFixtures(d, shopW + bed1W, yLiving, bathW, yBeds - yLiving);
  kitchenCounters(d, shopW, yEntry, livingW, yLiving - yEntry);

  // Room labels
  d.setActiveLayer("TEXT");
  label(d, shopW, 0, livingW, yEntry, "ENTRY / LAUNDRY", `${ft(livingW)} × ${ft(yEntry)}`);
  label(d, shopW, yEntry, livingW, yLiving - yEntry, "OPEN LIVING / KITCHEN", `${ft(livingW)} × ${ft(yLiving - yEntry)}`);
  label(d, shopW, yLiving, bed1W, yBeds - yLiving, "BEDROOM 2", `${ft(bed1W)} × ${ft(yBeds - yLiving)}`);
  label(d, shopW + bed1W, yLiving, bathW, yBeds - yLiving, "BATH", "");
  label(d, shopW + bed1W + bathW, yLiving, bed2W, yBeds - yLiving, "BEDROOM 3", `${ft(bed2W)} × ${ft(yBeds - yLiving)}`);

  // Doors
  d.setActiveLayer("DOORS");
  const dW = 3.0;
  doorSwing(d, shopW + livingW * 0.45, 0, 3.5, 0, 90);
  doorSwing(d, shopW, yEntry + dW, dW, 270, 360);
  doorSwing(d, shopW + bed1W * 0.5, yLiving, dW, 0, 90);
  doorSwing(d, shopW + bed1W, yLiving + dW, dW, 90, 180);
  doorSwing(d, shopW + bed1W + bathW + bed2W * 0.5, yLiving, dW, 0, 90);

  // Windows
  d.setActiveLayer("WINDOWS");
  winH(d, shopW + livingW * 0.28, 0, 4.0, 0.5);
  winH(d, shopW + livingW * 0.62, 0, 3.0, 0.5);
  winH(d, shopW + livingW * 0.12, H - 0.5, 4.0, 0.5);
  winH(d, shopW + livingW * 0.6, H - 0.5, 4.0, 0.5);
  winV(d, W - 0.5, yEntry + (yLiving - yEntry) * 0.3, 4.0, 0.5);
  winV(d, W - 0.5, yLiving + (yBeds - yLiving) * 0.4, 3.0, 0.5);
  // Shop windows
  winV(d, 0, H * 0.3, 4.0, 0.5);
  winV(d, 0, H * 0.6, 4.0, 0.5);

  // Interior dims
  d.setActiveLayer("DIMENSIONS");
  dimI(d, 0, 0, shopW, 0, -1.5, ft(shopW));
  dimI(d, shopW, 0, W, 0, -1.5, ft(livingW));
  dimI(d, W, 0, W, yEntry, 2.5, ft(yEntry));
  dimI(d, W, yEntry, W, yLiving, 2.5, ft(yLiving - yEntry));
  dimI(d, W, yLiving, W, yBeds, 2.5, ft(yBeds - yLiving));
}

// ─── Agricultural layout ──────────────────────────────────────────────────────

function drawAgricultural(d: typeof Drawing, answers: ProjectAnswers, W: number, H: number, structureType: string) {
  const stallCount = n(answers.stallCount, 0);
  const postSpacing = n(answers.clearSpanWidth, 12) || 12;

  d.setActiveLayer("EXTERIOR");
  rect(d, 0, 0, W, H);

  d.setActiveLayer("WALLS");
  const postSize = 0.75;
  const cols = Math.ceil(W / postSpacing), rows = Math.ceil(H / postSpacing);
  for (let c = 0; c <= cols; c++) {
    const px = Math.min(c * postSpacing, W);
    for (let r = 0; r <= rows; r++) {
      const py = Math.min(r * postSpacing, H);
      rect(d, px - postSize / 2, py - postSize / 2, postSize, postSize);
      d.drawLine(px - postSize / 2, py - postSize / 2, px + postSize / 2, py + postSize / 2);
      d.drawLine(px + postSize / 2, py - postSize / 2, px - postSize / 2, py + postSize / 2);
    }
  }
  for (let c = 1; c < cols; c++) d.drawLine(c * postSpacing, 0, c * postSpacing, H);
  for (let r = 1; r < rows; r++) d.drawLine(0, r * postSpacing, W, r * postSpacing);

  d.setActiveLayer("TEXT");
  d.drawText(W / 2 + 0.4, H / 2, 0.5, 90, "RIDGE LINE");
  d.setActiveLayer("WALLS");
  d.drawLine(W / 2 - 0.1, 0, W / 2 - 0.1, H);
  d.drawLine(W / 2 + 0.1, 0, W / 2 + 0.1, H);

  if (stallCount > 0 && structureType === "BARN") {
    const stallW = Math.min(14, W * 0.22), stallH = Math.min(14, H * 0.25);
    const stallsPerRow = Math.floor((W - 4) / stallW);
    const actualStalls = Math.min(stallCount, stallsPerRow * 2);
    const startX = (W - stallsPerRow * stallW) / 2;
    for (let i = 0; i < actualStalls; i++) {
      const col = i % stallsPerRow, row = Math.floor(i / stallsPerRow);
      const sx = startX + col * stallW;
      const sy = row === 0 ? H * 0.05 : H - H * 0.05 - stallH;
      rect(d, sx, sy, stallW, stallH);
      d.setActiveLayer("TEXT");
      d.drawText(sx + stallW / 2 - 1.5, sy + stallH / 2 - 0.2, 0.4, 0, `STALL ${i + 1}`);
      d.drawText(sx + stallW / 2 - 2.0, sy + stallH / 2 - 0.7, 0.3, 0, `${Math.round(stallW)}' × ${Math.round(stallH)}'`);
      d.setActiveLayer("WALLS");
    }
    const aisleW = 12, aisleX = (W - aisleW) / 2;
    d.setActiveLayer("TEXT");
    d.drawText(aisleX + aisleW / 2 - 1.5, H / 2 - 0.25, 0.5, 0, "CENTER AISLE");
    d.drawText(aisleX + aisleW / 2 - 1.8, H / 2 - 0.85, 0.35, 0, `${Math.round(aisleW)}' WIDE`);
    d.setActiveLayer("WALLS");
  }

  d.setActiveLayer("DOORS");
  const bigDoorW = Math.min(W * 0.55, 20), bigDoorX = (W - bigDoorW) / 2;
  rect(d, bigDoorX, 0, bigDoorW / 2, 1.5);
  rect(d, bigDoorX + bigDoorW / 2, 0, bigDoorW / 2, 1.5);
  d.drawLine(bigDoorX, 0, bigDoorX + bigDoorW / 2, 1.5);
  d.drawLine(bigDoorX + bigDoorW / 2, 0, bigDoorX + bigDoorW, 1.5);
  d.setActiveLayer("TEXT");
  d.drawText(bigDoorX + bigDoorW / 2 - 3.5, -1.5, 0.4, 0, `SLIDING DOOR ${Math.round(bigDoorW)}'-0"`);

  d.setActiveLayer("TEXT");
  const mainLabel = structureType === "BARN" ? "BARN" : structureType === "POLE_BARN" ? "POLE BARN" : "AGRICULTURAL";
  d.drawText(2, H * 0.5 - 0.3, 0.7, 0, mainLabel);
  d.drawText(2, H * 0.5 - 1.1, 0.4, 0, `${ft(W)} × ${ft(H)} CLEAR SPAN`);

  d.setActiveLayer("DIMENSIONS");
  dimI(d, 0, H / 2, postSpacing, H / 2, 1.5, `${postSpacing}' BAY`);
}

// ─── Container layout ─────────────────────────────────────────────────────────

function drawContainer(d: typeof Drawing, answers: ProjectAnswers, W: number, H: number) {
  const containerSize = s(answers.containerSize, "40ft");
  const cLength = containerSize === "20ft" ? 20 : 40;
  const cWidth = 8;
  const count = Math.min(n(answers.containerCount, 2), 6);
  const arrangement = s(answers.containerArrangement, "linear");

  d.setActiveLayer("WALLS");
  interface ContainerPos { x: number; y: number; rotated: boolean; }
  const positions: ContainerPos[] = [];

  if (arrangement === "l_shape") {
    positions.push({ x: 0, y: 0, rotated: false });
    positions.push({ x: 0, y: cWidth + 4, rotated: true });
  } else if (arrangement === "stacked" || arrangement === "parallel") {
    for (let i = 0; i < count; i++) {
      positions.push({ x: (i % 2) * (cLength + 4), y: Math.floor(i / 2) * (cWidth + 4), rotated: false });
    }
  } else {
    for (let i = 0; i < count; i++) positions.push({ x: i * (cLength + 2), y: 0, rotated: false });
  }

  positions.forEach((p, i) => {
    const cL = p.rotated ? cWidth : cLength, cW = p.rotated ? cLength : cWidth;
    rect(d, p.x, p.y, cL, cW);
    const ribCount = p.rotated ? 8 : 12;
    for (let r = 1; r < ribCount; r++) {
      if (p.rotated) d.drawLine(p.x, p.y + r * (cW / 8), p.x + cL, p.y + r * (cW / 8));
      else d.drawLine(p.x + r * (cL / 12), p.y, p.x + r * (cL / 12), p.y + cW);
    }
    d.setActiveLayer("DOORS");
    doorSwing(d, p.x + cL - 3, p.y, 3.0, 0, 90);
    d.setActiveLayer("WINDOWS");
    winH(d, p.x + cL * 0.3, p.y, 2.5, 0.4);
    winH(d, p.x + cL * 0.6, p.y, 2.5, 0.4);
    d.setActiveLayer("TEXT");
    label(d, p.x, p.y, cL, cW, `CONTAINER ${i + 1}`, `${cL}' × ${cW}'`);
    d.setActiveLayer("WALLS");
  });
}

// ─── Outbuilding layout ───────────────────────────────────────────────────────

function drawOutbuilding(d: typeof Drawing, answers: ProjectAnswers, W: number, H: number, structureLabel: string) {
  const bays = n(answers.garageBays, 1);
  const bayW = W / Math.max(bays, 1);
  const t = 0.5;
  d.setActiveLayer("WALLS");
  rect(d, 0, 0, W, H);
  rect(d, t, t, W - 2 * t, H - 2 * t);
  for (let i = 1; i < bays; i++) {
    d.drawLine(i * bayW, 0, i * bayW, H * 0.4);
    d.drawLine(i * bayW, H * 0.6, i * bayW, H);
  }
  d.setActiveLayer("DOORS");
  for (let i = 0; i < bays; i++) {
    const gdW = bayW * 0.7, gdX = i * bayW + (bayW - gdW) / 2;
    rect(d, gdX, 0, gdW, 1.2);
    d.drawLine(gdX, 0, gdX + gdW, 1.2);
    d.setActiveLayer("TEXT");
    d.drawText(gdX + gdW / 2 - 3, -1.4, 0.4, 0, `OVERHEAD ${Math.round(gdW)}'-0"`);
    d.setActiveLayer("DOORS");
  }
  doorSwing(d, W, H * 0.6, 3.0, 90, 180);
  d.setActiveLayer("WINDOWS");
  winH(d, W * 0.15, H - 0.5, 3.0, 0.5);
  winH(d, W * 0.6, H - 0.5, 3.0, 0.5);
  winV(d, W - 0.5, H * 0.5, 2.5, 0.5);
  if (structureLabel.includes("WORKSHOP") || structureLabel.includes("GARAGE")) {
    d.setActiveLayer("WALLS");
    d.drawLine(t + 0.1, H - t - 2.0, W - t - 0.1, H - t - 2.0);
    d.drawLine(t + 0.1, H - t, t + 0.1, H - t - 2.0);
    d.drawLine(W - t - 0.1, H - t, W - t - 0.1, H - t - 2.0);
    d.setActiveLayer("TEXT");
    d.drawText(W / 2 - 2.5, H - t - 1.2, 0.4, 0, "WORK BENCH");
  }
  d.setActiveLayer("TEXT");
  label(d, 0, 0, W, H, structureLabel, `${ft(W)} × ${ft(H)}`);
  d.setActiveLayer("DIMENSIONS");
  dimI(d, 0, H / 2, W, H / 2, 1.5, ft(W));
  dimI(d, W / 2, 0, W / 2, H, 1.5, ft(H));
}

// ─── Dome layout ──────────────────────────────────────────────────────────────

function drawDome(d: typeof Drawing, W: number, H: number) {
  const r = Math.min(W, H) / 2, cx = W / 2, cy = H / 2;
  d.setActiveLayer("EXTERIOR");
  d.drawCircle(cx, cy, r);
  d.drawCircle(cx, cy, r - 0.5);
  d.setActiveLayer("WALLS");
  for (let i = 0; i < 4; i++) {
    const a1 = (i / 4) * Math.PI * 2, a2 = ((i + 1) / 4) * Math.PI * 2, midA = (a1 + a2) / 2;
    d.drawLine(cx, cy, cx + r * Math.cos(a1), cy + r * Math.sin(a1));
    d.drawLine(cx + r * 0.5 * Math.cos(a1), cy + r * 0.5 * Math.sin(a1), cx + r * Math.cos(midA), cy + r * Math.sin(midA));
    d.drawLine(cx + r * 0.5 * Math.cos(a2), cy + r * 0.5 * Math.sin(a2), cx + r * Math.cos(midA), cy + r * Math.sin(midA));
  }
  d.drawLine(cx, cy - r * 0.5, cx, cy + r * 0.6);
  d.drawLine(cx - r * 0.6, cy, cx + r * 0.6, cy);
  d.setActiveLayer("TEXT");
  label(d, cx - r * 0.4, cy - r * 0.4, r * 0.4, r * 0.4, "LIVING", "");
  label(d, cx, cy - r * 0.4, r * 0.4, r * 0.4, "KITCHEN", "");
  label(d, cx - r * 0.4, cy, r * 0.4, r * 0.4, "BEDROOM", "");
  label(d, cx, cy, r * 0.4, r * 0.4, "BATH", "");
  d.drawText(cx - 2.5, cy + r * 0.8, 0.6, 0, "DOME / GEODESIC");
}

// ─── Category helper ──────────────────────────────────────────────────────────

type StructureCategory = "residential" | "barndominium" | "container" | "agricultural" | "outbuilding" | "dome" | "quonset";

function structureCategory(structureType: string): StructureCategory {
  const map: Record<string, StructureCategory> = {
    SINGLE_FAMILY_HOME: "residential",
    TINY_HOME: "residential",
    LOG_CABIN: "residential",
    A_FRAME: "residential",
    PASSIVE_SOLAR: "residential",
    BARNDOMINIUM: "barndominium",
    CONTAINER_HOME: "container",
    BARN: "agricultural",
    POLE_BARN: "agricultural",
    SILO: "agricultural",
    SHED: "outbuilding",
    WORKSHOP: "outbuilding",
    GARAGE: "outbuilding",
    DOME_HOME: "dome",
    QUONSET_HUT: "quonset",
  };
  return map[structureType] ?? "residential";
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateFloorPlanDXF(
  answers: ProjectAnswers,
  structureType: string,
  projectName: string,
  isDraft = false
): string {
  const sqft = n(answers.squareFootage, 1500);
  const stories = Math.max(n(answers.stories, 1), 1);
  const footprint = sqft / stories;
  const bedrooms = n(answers.bedrooms, 3);
  const bathrooms = parseFloat(String(answers.bathrooms ?? "2")) || 2;

  const W = rn(Math.sqrt(footprint * 1.4));
  const H = rn(Math.sqrt(footprint / 1.4));

  const d = new Drawing();
  d.setUnits("Feet");

  d.addLayer("EXTERIOR", Drawing.ACI.RED, "CONTINUOUS");
  d.addLayer("WALLS", Drawing.ACI.WHITE, "CONTINUOUS");
  d.addLayer("DOORS", Drawing.ACI.CYAN, "CONTINUOUS");
  d.addLayer("WINDOWS", Drawing.ACI.GREEN, "CONTINUOUS");
  d.addLayer("DIMENSIONS", Drawing.ACI.YELLOW, "CONTINUOUS");
  d.addLayer("TEXT", Drawing.ACI.WHITE, "CONTINUOUS");
  d.addLayer("TITLE", Drawing.ACI.WHITE, "CONTINUOUS");

  // Exterior shell
  d.setActiveLayer("EXTERIOR");
  rect(d, 0, 0, W, H);
  const et = 0.5;
  rect(d, et, et, W - 2 * et, H - 2 * et);

  // Interior layout
  const cat = structureCategory(structureType);
  if (cat === "barndominium") {
    drawBarndominium(d, answers, W, H, bedrooms);
  } else if (cat === "residential") {
    drawResidential(d, answers, W, H, bedrooms, bathrooms);
  } else if (cat === "agricultural") {
    drawAgricultural(d, answers, W, H, structureType);
  } else if (cat === "container") {
    drawContainer(d, answers, W, H);
  } else if (cat === "outbuilding") {
    const labels: Record<string, string> = { SHED: "STORAGE / SHED", WORKSHOP: "WORKSHOP", GARAGE: "GARAGE" };
    drawOutbuilding(d, answers, W, H, labels[structureType] ?? "OUTBUILDING");
  } else if (cat === "dome") {
    drawDome(d, W, H);
  } else if (cat === "quonset") {
    d.setActiveLayer("EXTERIOR");
    d.drawArc(W / 2, 0, W / 2, 0, 180);
    d.drawLine(0, 0, 0, H * 0.3);
    d.drawLine(W, 0, W, H * 0.3);
    d.setActiveLayer("WALLS");
    d.drawLine(0, H * 0.3, W, H * 0.3);
    d.setActiveLayer("TEXT");
    label(d, 0, 0, W, H * 0.6, "QUONSET HUT", `${ft(W)} × ${ft(H)}`);
  } else {
    drawOutbuilding(d, answers, W, H, structureType.replace(/_/g, " "));
  }

  // Overall dimension lines
  d.setActiveLayer("DIMENSIONS");
  dim(d, 0, 0, W, 0, -7, ft(W));
  dim(d, 0, 0, 0, H, -7, ft(H));

  // Front elevation (placed below floor plan)
  const elevGap = 20;
  const elevTotalH = structureType === "SILO" ? 70 : 30; // silo elevations are very tall
  const elevY = -(elevGap + elevTotalH);
  drawFrontElevation(d, 0, elevY, W, structureType, answers);

  // Section label between floor plan and elevation
  d.setActiveLayer("TITLE");
  d.drawText(W / 2 - 6, -elevGap / 2 - 0.3, 0.45, 0, "▼ FRONT ELEVATION BELOW");

  // North arrow
  northArrow(d, W + 8, H * 0.65);

  // Scale bar
  d.setActiveLayer("TITLE");
  scaleBar(d, W + 4, H * 0.25);

  // Title block
  titleBlock(d, W + 4, 0, projectName, structureType, sqft);

  // Sheet border
  const sheetW = W + 28;
  const sheetH = H + 12 + elevGap + elevTotalH + 10;
  const sheetX = -8;
  const sheetY = elevY - 12;
  d.setActiveLayer("TITLE");
  // Outer border
  rect(d, sheetX, sheetY, sheetW, sheetH);
  // Inner border (title margin)
  rect(d, sheetX + 0.5, sheetY + 0.5, sheetW - 1, sheetH - 1);
  // Sheet header
  d.drawText(sheetX + 1, sheetY + sheetH - 3.5, 0.65, 0, "FLOOR PLAN — SHEET A1");
  d.drawText(sheetX + 1, sheetY + sheetH - 4.4, 0.38, 0, "PRELIMINARY SCHEMATIC — NOT FOR CONSTRUCTION");
  d.drawText(sheetX + 1, sheetY + sheetH - 5.1, 0.35, 0, `PROJECT: ${projectName.substring(0, 30)}`);

  // Draft watermark
  if (isDraft) {
    d.addLayer("DRAFT", Drawing.ACI.RED, "CONTINUOUS");
    d.setActiveLayer("DRAFT");
    const dh = Math.min(W, H) * 0.14;
    d.drawText(W * 0.05, H * 0.12, dh, 38, "DRAFT");
    d.drawText(W * 0.05, H * 0.55, dh, 38, "DRAFT");
    d.drawText(W * 0.05, H * 0.35, dh * 0.55, 0, "NOT FOR CONSTRUCTION");
    d.drawText(W * 0.05, H * 0.78, dh * 0.55, 0, "NOT FOR CONSTRUCTION");
  }

  return d.toDxfString();
}
