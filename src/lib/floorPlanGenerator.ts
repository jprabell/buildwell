// eslint-disable-next-line @typescript-eslint/no-require-imports
const Drawing = require("dxf-writer");

import { ProjectAnswers } from "@/types";

// ─── Number helpers ───────────────────────────────────────────────────────────

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
  const f = Math.pow(10, decimals);
  return Math.round(v * f) / f;
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

// Thickened wall: two parallel lines
function wallH(d: typeof Drawing, x1: number, y: number, x2: number, t: number) {
  d.drawLine(x1, y, x2, y);
  d.drawLine(x1, y + t, x2, y + t);
}

function wallV(d: typeof Drawing, x: number, y1: number, y2: number, t: number) {
  d.drawLine(x, y1, x, y2);
  d.drawLine(x + t, y1, x + t, y2);
}

// Door swing (hinge at hx,hy, radius, angles in degrees CCW from east)
function doorSwing(
  d: typeof Drawing,
  hx: number,
  hy: number,
  radius: number,
  startDeg: number,
  endDeg: number
) {
  d.drawArc(hx, hy, radius, startDeg, endDeg);
  const endRad = (endDeg * Math.PI) / 180;
  d.drawLine(hx, hy, hx + radius * Math.cos(endRad), hy + radius * Math.sin(endRad));
}

// Window symbol: two parallel lines crossing the wall gap
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

// Dimension line with ticks
function dim(
  d: typeof Drawing,
  x1: number, y1: number,
  x2: number, y2: number,
  offset: number,
  label: string
) {
  const isH = Math.abs(y2 - y1) < 0.01;
  const tick = 0.4;
  if (isH) {
    const dy = y1 + offset;
    d.drawLine(x1, dy, x2, dy);
    d.drawLine(x1, y1, x1, dy + (offset > 0 ? tick : -tick));
    d.drawLine(x2, y1, x2, dy + (offset > 0 ? tick : -tick));
    const cx = (x1 + x2) / 2 - label.length * 0.13;
    d.drawText(cx, dy + (offset > 0 ? 0.2 : -0.65), 0.45, 0, label);
  } else {
    const dx = x1 + offset;
    d.drawLine(dx, y1, dx, y2);
    d.drawLine(x1, y1, dx + (offset > 0 ? tick : -tick), y1);
    d.drawLine(x1, y2, dx + (offset > 0 ? tick : -tick), y2);
    const cy = (y1 + y2) / 2 - 0.2;
    d.drawText(dx + (offset > 0 ? 0.2 : -0.8), cy, 0.45, 90, label);
  }
}

// Room label: name on top, dimensions below
function label(
  d: typeof Drawing,
  x: number, y: number, w: number, h: number,
  name: string, dims = ""
) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const nameX = cx - name.length * 0.22;
  d.drawText(nameX, cy + (dims ? 0.35 : 0), 0.5, 0, name);
  if (dims) d.drawText(cx - dims.length * 0.14, cy - 0.3, 0.35, 0, dims);
}

// ─── Bathroom fixtures ────────────────────────────────────────────────────────

function bathFixtures(d: typeof Drawing, x: number, y: number, w: number, h: number) {
  const m = 0.4; // margin from walls
  // Toilet (oval)
  const tcx = x + w * 0.25;
  const tcy = y + m + 1.0;
  d.drawCircle(tcx, tcy, 0.85);
  d.drawCircle(tcx, tcy, 0.55);
  d.drawLine(tcx - 0.85, tcy - 0.9, tcx + 0.85, tcy - 0.9);
  d.drawLine(tcx - 0.85, tcy - 0.9, tcx - 0.85, tcy - 0.55);
  d.drawLine(tcx + 0.85, tcy - 0.9, tcx + 0.85, tcy - 0.55);
  d.drawArc(tcx, tcy - 0.55, 0.85, 0, 180);
  // Sink
  const scx = x + w * 0.72;
  const scy = y + m + 0.9;
  rect(d, scx - 0.8, scy - 0.75, 1.6, 1.5);
  d.drawCircle(scx, scy + 0.1, 0.35);
  // Tub / shower (if room tall enough)
  if (h > 6.5) {
    const tx = x + m;
    const ty = y + h - m - 4.5;
    const tw = w - m * 2;
    const th = 3.8;
    rect(d, tx, ty, tw, th);
    d.drawLine(tx + 0.35, ty + 0.35, tx + tw - 0.35, ty + 0.35);
    d.drawLine(tx + 0.35, ty + th - 0.35, tx + tw - 0.35, ty + th - 0.35);
    d.drawLine(tx + 0.35, ty + 0.35, tx + 0.35, ty + th - 0.35);
    d.drawLine(tx + tw - 0.35, ty + 0.35, tx + tw - 0.35, ty + th - 0.35);
  }
}

// Small bath (toilet + sink only, no tub)
function halfBathFixtures(d: typeof Drawing, x: number, y: number, w: number, h: number) {
  const m = 0.3;
  const tcx = x + w * 0.3;
  const tcy = y + m + 1.0;
  d.drawCircle(tcx, tcy, 0.8);
  d.drawCircle(tcx, tcy, 0.5);
  d.drawLine(tcx - 0.8, tcy - 0.85, tcx + 0.8, tcy - 0.85);
  d.drawLine(tcx - 0.8, tcy - 0.85, tcx - 0.8, tcy - 0.5);
  d.drawLine(tcx + 0.8, tcy - 0.85, tcx + 0.8, tcy - 0.5);
  d.drawArc(tcx, tcy - 0.5, 0.8, 0, 180);
  const scx = x + w * 0.72;
  const scy = y + m + 0.75;
  rect(d, scx - 0.65, scy - 0.6, 1.3, 1.2);
  d.drawCircle(scx, scy + 0.1, 0.28);
}

// Kitchen counter (L-shape along north + west interior walls)
function kitchenCounters(d: typeof Drawing, x: number, y: number, w: number, h: number) {
  const cD = 1.8; // counter depth
  // Counter along back (north) wall
  d.drawLine(x, y + h - cD, x + w * 0.8, y + h - cD);
  d.drawLine(x + w * 0.8, y + h, x + w * 0.8, y + h - cD);
  // Counter along left (west) wall
  d.drawLine(x + cD, y + h - cD, x + cD, y + h * 0.15);
  d.drawLine(x, y + h * 0.15, x + cD, y + h * 0.15);
  // Island in center
  const iW = rn(w * 0.42);
  const iH = rn(h * 0.28);
  const iX = x + (w - iW) / 2 + 0.5;
  const iY = y + (h - iH) / 2 - 0.5;
  rect(d, iX, iY, iW, iH);
}

// WIC shelving lines
function closetShelves(d: typeof Drawing, x: number, y: number, w: number, h: number) {
  const shelfD = 1.2;
  d.drawLine(x, y + shelfD, x + w, y + shelfD);
  d.drawLine(x, y + shelfD * 2, x + w, y + shelfD * 2);
  d.drawLine(x, y + h - shelfD, x + w, y + h - shelfD);
  d.drawLine(x, y + h - shelfD * 2, x + w, y + h - shelfD * 2);
}

// Stair symbol (series of parallel lines with arrow)
function stairs(d: typeof Drawing, x: number, y: number, w: number, h: number) {
  const steps = 12;
  const sh = h / steps;
  for (let i = 0; i <= steps; i++) {
    d.drawLine(x, y + i * sh, x + w, y + i * sh);
  }
  // Arrow indicating up direction
  d.drawLine(x + w / 2, y + h * 0.1, x + w / 2, y + h * 0.9);
  d.drawLine(x + w / 2, y + h * 0.9, x + w / 2 - 0.6, y + h * 0.75);
  d.drawLine(x + w / 2, y + h * 0.9, x + w / 2 + 0.6, y + h * 0.75);
  d.drawText(x + w / 2 - 0.2, y + h / 2 - 0.2, 0.4, 0, "UP");
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

// ─── Title block ─────────────────────────────────────────────────────────────

function titleBlock(
  d: typeof Drawing,
  x: number, y: number,
  projectName: string,
  structureType: string,
  sqft: number
) {
  const w = 14, h = 5;
  rect(d, x, y, w, h);
  d.drawLine(x, y + 3.2, x + w, y + 3.2);
  d.drawLine(x, y + 2.4, x + w, y + 2.4);
  d.drawLine(x + 7, y, x + 7, y + 2.4);
  d.drawText(x + 0.25, y + 4.3, 0.6, 0, projectName.substring(0, 24));
  d.drawText(x + 0.25, y + 3.5, 0.4, 0, structureType.replace(/_/g, " "));
  d.drawText(x + 0.25, y + 2.9, 0.35, 0, "FLOOR PLAN — SHEET 1 OF 1");
  d.drawText(x + 0.25, y + 1.95, 0.35, 0, `TOTAL AREA:`);
  d.drawText(x + 0.25, y + 1.45, 0.5, 0, `${sqft.toLocaleString()} SQ FT`);
  d.drawText(x + 7.25, y + 1.95, 0.35, 0, `SCALE:`);
  d.drawText(x + 7.25, y + 1.45, 0.5, 0, `1" = 10'-0"`);
  d.drawText(x + 0.25, y + 0.9, 0.35, 0, `DATE: ${new Date().toLocaleDateString("en-US")}`);
  d.drawText(x + 0.25, y + 0.4, 0.28, 0, "PRELIMINARY SCHEMATIC — NOT FOR CONSTRUCTION");
  d.drawText(x + 0.25, y + 0.1, 0.28, 0, "BUILDWELL LLC · ibuildwell.com");
}

// ─── Residential layout ───────────────────────────────────────────────────────

function drawResidential(
  d: typeof Drawing,
  answers: ProjectAnswers,
  W: number,
  H: number,
  bedrooms: number,
  bathrooms: number
) {
  const hasGarage = !s(answers.garageType, "none").startsWith("none");

  // ── Grid column lines (x) ──
  const xB = rn(W * 0.32);   // end of bedroom col
  const xC = rn(W * 0.49);   // end of bath/hall col  (= start of living zone)
  const xD = rn(W * 0.79);   // kitchen / dining split

  // ── Grid row lines (y, 0=south/front, H=north/back) ──
  const yB = rn(H * 0.20);   // front row top
  const yC = rn(H * 0.50);   // mid row top  (= start of bedroom back zone)
  const yD = rn(H * 0.75);   // master bath / WIC split
  const yBh = rn(H * 0.35);  // hall / bath2 split within mid row

  // ═══════════════════════════════════════════
  // LAYER: WALLS
  // ═══════════════════════════════════════════
  d.setActiveLayer("WALLS");

  // ── Front row (y=0..yB) ──
  if (hasGarage) {
    rect(d, 0, 0, xC, yB);            // Garage
    rect(d, xC, 0, W - xC, yB);       // Foyer / Entry
  } else {
    rect(d, 0, 0, xB, yB);            // Laundry
    rect(d, xB, 0, xC - xB, yB);      // Utility / Mud
    rect(d, xC, 0, W - xC, yB);       // Foyer
  }

  // ── Middle row (y=yB..yC) ──
  if (bedrooms >= 3) {
    const brW = rn(xB / 2);
    rect(d, 0, yB, brW, yC - yB);          // Bedroom 2
    rect(d, brW, yB, xB - brW, yC - yB);   // Bedroom 3
  } else {
    rect(d, 0, yB, xB, yC - yB);           // Bedroom 2 (wider)
  }
  rect(d, xB, yB, xC - xB, yBh - yB);     // Hall
  rect(d, xB, yBh, xC - xB, yC - yBh);    // Bath 2
  rect(d, xC, yB, xD - xC, yC - yB);      // Kitchen
  rect(d, xD, yB, W - xD, yC - yB);       // Dining

  // ── Back row (y=yC..H) ──
  rect(d, 0, yC, xB, H - yC);             // Master Bedroom
  rect(d, xB, yC, xC - xB, yD - yC);     // Master Bath
  rect(d, xB, yD, xC - xB, H - yD);      // Walk-in Closet
  rect(d, xC, yC, W - xC, H - yC);       // Living Room

  // ═══════════════════════════════════════════
  // LAYER: TEXT (room labels + sizes)
  // ═══════════════════════════════════════════
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

  // ═══════════════════════════════════════════
  // LAYER: DOORS
  // ═══════════════════════════════════════════
  d.setActiveLayer("DOORS");
  const dW = 3.0; // standard interior door width
  const edW = 3.2; // exterior door width

  // Front door (south wall, in foyer)
  const fdX = xC + (W - xC) * 0.35;
  doorSwing(d, fdX, 0, edW, 0, 90);

  // Garage door — overhead (represented by lines)
  if (hasGarage) {
    const gdW = Math.min(xC * 0.6, 16);
    const gdX = (xC - gdW) / 2;
    rect(d, gdX, 0, gdW, 1.0);
    d.setActiveLayer("TEXT");
    d.drawText(gdX + gdW / 2 - 3.5, -1.5, 0.4, 0, `OVERHEAD DOOR ${Math.round(gdW)}'-0"`);
    d.setActiveLayer("DOORS");
  }

  // Bedroom 2 door (from hall into BR2, south wall of hall at y=yB)
  if (bedrooms >= 3) {
    const brW = rn(xB / 2);
    doorSwing(d, brW - dW, yB, dW, 90, 180);   // BR2
    doorSwing(d, xB - dW, yB, dW, 90, 180);    // BR3
  } else {
    doorSwing(d, xB / 2, yB, dW, 90, 180);     // BR2 single
  }

  // Hall door into bath2
  doorSwing(d, xB, yBh + dW, dW, 270, 360);

  // Master BR door (from hall at y=yC)
  doorSwing(d, xB * 0.5, yC, dW, 0, 90);

  // Master bath door (from master BR into bath)
  doorSwing(d, xB, yC + dW, dW, 90, 180);

  // WIC door
  doorSwing(d, xB, yD + dW, dW, 90, 180);

  // Living room from foyer
  doorSwing(d, xC, yB * 0.5, dW, 90, 180);

  // ═══════════════════════════════════════════
  // LAYER: WINDOWS
  // ═══════════════════════════════════════════
  d.setActiveLayer("WINDOWS");
  const winW = 4.0;
  const winW2 = 3.0;
  const winD = 0.5;

  // South wall (y=0)
  if (!hasGarage) {
    winH(d, W * 0.08, 0, winW2, winD);
  }
  winH(d, xC + (W - xC) * 0.6, 0, winW, winD);

  // North wall (y=H)
  winH(d, W * 0.05, H - winD, winW2, winD);     // Master BR
  winH(d, xC + (W - xC) * 0.1, H - winD, winW, winD); // Living room
  winH(d, xC + (W - xC) * 0.55, H - winD, winW, winD); // Living room 2

  // West wall (x=0)
  winV(d, 0, yB + (yC - yB) * 0.35, winW2, winD);    // BR2
  winV(d, 0, yC + (H - yC) * 0.4, winW2, winD);       // Master BR

  // East wall (x=W)
  winV(d, W - winD, yC + (H - yC) * 0.25, winW, winD); // Living room
  winV(d, W - winD, yB + (yC - yB) * 0.45, winW2, winD); // Dining

  // ═══════════════════════════════════════════
  // FIXTURES (on WALLS layer for clarity)
  // ═══════════════════════════════════════════
  d.setActiveLayer("WALLS");

  // Master Bath fixtures
  bathFixtures(d, xB, yC, xC - xB, yD - yC);

  // Bath 2 fixtures (smaller — halfBath if not enough space)
  if ((xC - xB) * (yC - yBh) > 45) {
    bathFixtures(d, xB, yBh, xC - xB, yC - yBh);
  } else {
    halfBathFixtures(d, xB, yBh, xC - xB, yC - yBh);
  }

  // Kitchen counters + island
  kitchenCounters(d, xC, yB, xD - xC, yC - yB);

  // WIC shelves
  closetShelves(d, xB, yD, xC - xB, H - yD);

  // Living room fireplace on north wall
  const fpW = 5.0;
  const fpX = xC + (W - xC) / 2 - fpW / 2;
  rect(d, fpX, H - 1.3, fpW, 1.3);
  d.drawLine(fpX + 0.5, H - 1.0, fpX + fpW - 0.5, H - 1.0);
  d.setActiveLayer("TEXT");
  d.drawText(fpX + fpW / 2 - 0.35, H - 0.85, 0.35, 0, "FP");
}

// ─── Agricultural layout ──────────────────────────────────────────────────────

function drawAgricultural(
  d: typeof Drawing,
  answers: ProjectAnswers,
  W: number,
  H: number,
  structureType: string
) {
  const stallCount = n(answers.stallCount, 0);
  const postSpacing = n(answers.clearSpanWidth, 12) || 12;

  // ── Perimeter walls (heavy) ──
  d.setActiveLayer("EXTERIOR");
  rect(d, 0, 0, W, H);

  // ── Post symbols at bay intervals ──
  d.setActiveLayer("WALLS");
  const postSize = 0.75;
  const cols = Math.ceil(W / postSpacing);
  const rows = Math.ceil(H / postSpacing);

  for (let c = 0; c <= cols; c++) {
    const px = Math.min(c * postSpacing, W);
    for (let r = 0; r <= rows; r++) {
      const py = Math.min(r * postSpacing, H);
      rect(d, px - postSize / 2, py - postSize / 2, postSize, postSize);
      // Draw cross inside post
      d.drawLine(px - postSize / 2, py - postSize / 2, px + postSize / 2, py + postSize / 2);
      d.drawLine(px + postSize / 2, py - postSize / 2, px - postSize / 2, py + postSize / 2);
    }
  }

  // ── Bay lines (dashed representation as lighter lines) ──
  for (let c = 1; c < cols; c++) {
    const bx = c * postSpacing;
    d.drawLine(bx, 0, bx, H);
  }
  for (let r = 1; r < rows; r++) {
    const by = r * postSpacing;
    d.drawLine(0, by, W, by);
  }

  // ── Ridge line ──
  d.setActiveLayer("TEXT");
  d.drawText(W / 2 + 0.4, H / 2, 0.5, 90, "RIDGE LINE");
  d.setActiveLayer("WALLS");
  d.drawLine(W / 2 - 0.1, 0, W / 2 - 0.1, H);
  d.drawLine(W / 2 + 0.1, 0, W / 2 + 0.1, H);

  // ── Horse / livestock stalls ──
  if (stallCount > 0 && structureType === "BARN") {
    const stallW = Math.min(14, W * 0.22);
    const stallH = Math.min(14, H * 0.25);
    const stallsPerRow = Math.floor((W - 4) / stallW);
    const actualStalls = Math.min(stallCount, stallsPerRow * 2);
    const startX = (W - stallsPerRow * stallW) / 2;

    for (let i = 0; i < actualStalls; i++) {
      const col = i % stallsPerRow;
      const row = Math.floor(i / stallsPerRow);
      const sx = startX + col * stallW;
      const sy = row === 0 ? H * 0.05 : H - H * 0.05 - stallH;
      rect(d, sx, sy, stallW, stallH);
      d.setActiveLayer("TEXT");
      d.drawText(sx + stallW / 2 - 1.5, sy + stallH / 2 - 0.2, 0.4, 0, `STALL ${i + 1}`);
      d.drawText(sx + stallW / 2 - 2.0, sy + stallH / 2 - 0.7, 0.3, 0, `${Math.round(stallW)}' × ${Math.round(stallH)}'`);
      d.setActiveLayer("WALLS");
    }

    // Center aisle
    const aisleW = 12;
    const aisleX = (W - aisleW) / 2;
    d.setActiveLayer("TEXT");
    d.drawText(aisleX + aisleW / 2 - 1.5, H / 2 - 0.25, 0.5, 0, "CENTER AISLE");
    d.drawText(aisleX + aisleW / 2 - 1.8, H / 2 - 0.85, 0.35, 0, `${Math.round(aisleW)}' WIDE`);
    d.setActiveLayer("WALLS");
  }

  // ── Large sliding doors on gable end (south) ──
  d.setActiveLayer("DOORS");
  const bigDoorW = Math.min(W * 0.55, 20);
  const bigDoorX = (W - bigDoorW) / 2;
  // Sliding door symbol: rectangle with diagonal slash
  rect(d, bigDoorX, 0, bigDoorW / 2, 1.5);
  rect(d, bigDoorX + bigDoorW / 2, 0, bigDoorW / 2, 1.5);
  d.drawLine(bigDoorX, 0, bigDoorX + bigDoorW / 2, 1.5);
  d.drawLine(bigDoorX + bigDoorW / 2, 0, bigDoorX + bigDoorW, 1.5);
  d.setActiveLayer("TEXT");
  d.drawText(bigDoorX + bigDoorW / 2 - 3.5, -1.5, 0.4, 0, `SLIDING DOOR ${Math.round(bigDoorW)}'-0"`);

  // ── Main label ──
  d.setActiveLayer("TEXT");
  const mainLabel = structureType === "BARN" ? "BARN" : structureType === "POLE_BARN" ? "POLE BARN" : "BARNDOMINIUM";
  d.drawText(2, H * 0.5 - 0.3, 0.7, 0, mainLabel);
  d.drawText(2, H * 0.5 - 1.1, 0.4, 0, `${ft(W)} × ${ft(H)} CLEAR SPAN`);
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
      const col = i % 2;
      const row = Math.floor(i / 2);
      positions.push({ x: col * (cLength + 4), y: row * (cWidth + 4), rotated: false });
    }
  } else {
    // linear
    for (let i = 0; i < count; i++) {
      positions.push({ x: i * (cLength + 2), y: 0, rotated: false });
    }
  }

  positions.forEach((p, i) => {
    const cL = p.rotated ? cWidth : cLength;
    const cW = p.rotated ? cLength : cWidth;
    rect(d, p.x, p.y, cL, cW);
    // Corrugation ribs (visual detail)
    const ribSpacing = p.rotated ? cW / 8 : cL / 12;
    const ribCount = p.rotated ? 8 : 12;
    for (let r = 1; r < ribCount; r++) {
      if (p.rotated) {
        d.drawLine(p.x, p.y + r * ribSpacing, p.x + cL, p.y + r * ribSpacing);
      } else {
        d.drawLine(p.x + r * ribSpacing, p.y, p.x + r * ribSpacing, p.y + cW);
      }
    }
    // Door on one end
    d.setActiveLayer("DOORS");
    doorSwing(d, p.x + cL - 3, p.y, 3.0, 0, 90);
    // Window
    d.setActiveLayer("WINDOWS");
    winH(d, p.x + cL * 0.3, p.y, 2.5, 0.4);
    winH(d, p.x + cL * 0.6, p.y, 2.5, 0.4);
    d.setActiveLayer("WALLS");
    // Label
    d.setActiveLayer("TEXT");
    label(d, p.x, p.y, cL, cW, `CONTAINER ${i + 1}`, `${cL}' × ${cW}'`);
    d.setActiveLayer("WALLS");
  });
}

// ─── Simple outbuilding ───────────────────────────────────────────────────────

function drawOutbuilding(d: typeof Drawing, answers: ProjectAnswers, W: number, H: number, structureLabel: string) {
  const bays = n(answers.garageBays, 1);
  const bayW = W / Math.max(bays, 1);

  d.setActiveLayer("WALLS");
  rect(d, 0, 0, W, H);
  // Wall thickness
  const t = 0.5;
  rect(d, t, t, W - 2 * t, H - 2 * t);

  // Bay dividers
  for (let i = 1; i < bays; i++) {
    d.drawLine(i * bayW, 0, i * bayW, H * 0.4);
    d.drawLine(i * bayW, H * 0.6, i * bayW, H);
  }

  // Overhead doors on south wall
  d.setActiveLayer("DOORS");
  for (let i = 0; i < bays; i++) {
    const gdW = bayW * 0.7;
    const gdX = i * bayW + (bayW - gdW) / 2;
    rect(d, gdX, 0, gdW, 1.2);
    d.drawLine(gdX, 0, gdX + gdW, 1.2);
    d.setActiveLayer("TEXT");
    d.drawText(gdX + gdW / 2 - 3, -1.4, 0.4, 0, `OVERHEAD ${Math.round(gdW)}'-0"`);
    d.setActiveLayer("DOORS");
  }

  // Walk door on east wall
  doorSwing(d, W, H * 0.6, 3.0, 90, 180);

  // Windows
  d.setActiveLayer("WINDOWS");
  winH(d, W * 0.15, H - 0.5, 3.0, 0.5);
  winH(d, W * 0.6, H - 0.5, 3.0, 0.5);
  winV(d, W - 0.5, H * 0.5, 2.5, 0.5);

  // Work bench (for workshop/garage)
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
}

// ─── Dome layout ──────────────────────────────────────────────────────────────

function drawDome(d: typeof Drawing, W: number, H: number) {
  const r = Math.min(W, H) / 2;
  const cx = W / 2, cy = H / 2;
  d.setActiveLayer("EXTERIOR");
  d.drawCircle(cx, cy, r);
  d.drawCircle(cx, cy, r - 0.5);
  // Structural triangulation lines (geodesic pattern)
  d.setActiveLayer("WALLS");
  const freq = 4;
  for (let i = 0; i < freq; i++) {
    const a1 = (i / freq) * Math.PI * 2;
    const a2 = ((i + 1) / freq) * Math.PI * 2;
    const midA = (a1 + a2) / 2;
    d.drawLine(cx, cy, cx + r * Math.cos(a1), cy + r * Math.sin(a1));
    d.drawLine(cx + r * 0.5 * Math.cos(a1), cy + r * 0.5 * Math.sin(a1),
      cx + r * Math.cos(midA), cy + r * Math.sin(midA));
    d.drawLine(cx + r * 0.5 * Math.cos(a2), cy + r * 0.5 * Math.sin(a2),
      cx + r * Math.cos(midA), cy + r * Math.sin(midA));
  }
  // Interior rooms (radial partitions)
  d.drawLine(cx, cy - r * 0.5, cx, cy + r * 0.6);
  d.drawLine(cx - r * 0.6, cy, cx + r * 0.6, cy);
  d.setActiveLayer("TEXT");
  label(d, cx - r * 0.4, cy - r * 0.4, r * 0.4, r * 0.4, "LIVING", "");
  label(d, cx, cy - r * 0.4, r * 0.4, r * 0.4, "KITCHEN", "");
  label(d, cx - r * 0.4, cy, r * 0.4, r * 0.4, "BEDROOM", "");
  label(d, cx, cy, r * 0.4, r * 0.4, "BATH", "");
  d.drawText(cx - 2.5, cy + r * 0.8, 0.6, 0, "DOME / GEODESIC");
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

  // Building footprint: slightly wider than deep (1.4 aspect ratio)
  const W = rn(Math.sqrt(footprint * 1.4));
  const H = rn(Math.sqrt(footprint / 1.4));

  const d = new Drawing();
  d.setUnits("Feet");

  // Layers
  d.addLayer("EXTERIOR", Drawing.ACI.RED, "CONTINUOUS");
  d.addLayer("WALLS", Drawing.ACI.WHITE, "CONTINUOUS");
  d.addLayer("DOORS", Drawing.ACI.CYAN, "CONTINUOUS");
  d.addLayer("WINDOWS", Drawing.ACI.GREEN, "CONTINUOUS");
  d.addLayer("DIMENSIONS", Drawing.ACI.YELLOW, "CONTINUOUS");
  d.addLayer("TEXT", Drawing.ACI.WHITE, "CONTINUOUS");
  d.addLayer("TITLE", Drawing.ACI.WHITE, "CONTINUOUS");

  // ── Exterior shell with wall thickness ──
  d.setActiveLayer("EXTERIOR");
  rect(d, 0, 0, W, H);
  const et = 0.5; // exterior wall thickness
  rect(d, et, et, W - 2 * et, H - 2 * et);

  // ── Interior layout by category ──
  const cat = structureCategory(structureType);

  if (cat === "residential") {
    drawResidential(d, answers, W, H, bedrooms, bathrooms);
  } else if (cat === "agricultural") {
    drawAgricultural(d, answers, W, H, structureType);
  } else if (cat === "container") {
    drawContainer(d, answers, W, H);
  } else if (cat === "outbuilding") {
    const labels: Record<string, string> = {
      SHED: "STORAGE / SHED",
      WORKSHOP: "WORKSHOP",
      GARAGE: "GARAGE",
    };
    drawOutbuilding(d, answers, W, H, labels[structureType] ?? "OUTBUILDING");
  } else if (cat === "dome") {
    drawDome(d, W, H);
  } else if (cat === "quonset") {
    d.setActiveLayer("EXTERIOR");
    d.drawArc(W / 2, 0, W / 2, 0, 180);
    d.drawLine(0, 0, 0, H * 0.3);
    d.drawLine(W, 0, W, H * 0.3);
    d.setActiveLayer("WALLS");
    d.drawLine(0, H * 0.3, W, H * 0.3); // floor
    d.setActiveLayer("TEXT");
    label(d, 0, 0, W, H * 0.6, "QUONSET HUT", `${ft(W)} × ${ft(H)}`);
  } else {
    drawOutbuilding(d, answers, W, H, structureType.replace(/_/g, " "));
  }

  // ── Dimension lines ──
  d.setActiveLayer("DIMENSIONS");
  dim(d, 0, 0, W, 0, -4, `${ft(W)}`);
  dim(d, 0, 0, 0, H, -4, `${ft(H)}`);

  // ── North arrow ──
  d.setActiveLayer("TITLE");
  northArrow(d, W + 6, H / 2);

  // ── Title block ──
  d.setActiveLayer("TITLE");
  titleBlock(d, W + 4, 0, projectName, structureType, sqft);

  // ── Sheet border ──
  const sheetW = W + 22;
  const sheetH = H + 10;
  rect(d, -5, -6, sheetW, sheetH);
  d.drawText(-4, sheetH - 6.3, 0.5, 0, "FLOOR PLAN — SHEET A1");
  d.drawText(-4, sheetH - 6.9, 0.35, 0, "PRELIMINARY SCHEMATIC — NOT FOR CONSTRUCTION");

  // ── Draft watermark ──
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

// ─── Category helper ─────────────────────────────────────────────────────────

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
