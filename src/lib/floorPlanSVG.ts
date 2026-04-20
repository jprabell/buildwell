/**
 * Professional SVG floor plan generator.
 * Produces an architectural-quality schematic with:
 *  – Double-line exterior walls (6") with diagonal poché fill
 *  – Interior walls (4½") as single thick lines
 *  – Door arc symbols and window glazing marks
 *  – Outer + inner dimension strings with tick marks
 *  – Room labels (name + sq ft)
 *  – North arrow, graphic scale bar
 *  – Full ANSI-B sheet border and title block
 *  – "PRELIMINARY — NOT FOR CONSTRUCTION" disclaimer
 *
 * Coordinate system: all values in FEET; the viewBox is scaled to px for display.
 */

import { RoomEntry } from "./planningReport";

// ── Constants ─────────────────────────────────────────────────────────────────

const SCALE     = 14;     // display px per foot
const T_EXT     = 0.5;    // exterior wall thickness (ft) – drawn as two lines
const T_INT     = 0.375;  // interior wall thickness (ft)

/** Convert feet → display pixels */
const px  = (ft: number) => ft * SCALE;
const round1 = (n: number) => Math.round(n * 10) / 10;

// ── Foot / inch label ─────────────────────────────────────────────────────────

function ftLabel(feet: number): string {
  const whole = Math.floor(Math.abs(feet));
  const inches = Math.round((Math.abs(feet) - whole) * 12);
  if (inches === 0)  return `${whole}'-0"`;
  if (inches === 12) return `${whole + 1}'-0"`;
  return `${whole}'-${inches}"`;
}

// ── XML escaping ──────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Zone classification ───────────────────────────────────────────────────────

type Zone = "public" | "service" | "private" | "garage";

function zoneOf(name: string): Zone {
  const n = name.toLowerCase();
  if (n.includes("garage") || n.includes("carport")) return "garage";
  if (n.includes("bed") || n.includes("master") || n.includes("suite") || n.includes("closet")) return "private";
  if (n.includes("kitchen") || n.includes("bath") || n.includes("laundry") ||
      n.includes("utility") || n.includes("mechanical") || n.includes("pantry") ||
      n.includes("mud") || n.includes("powder") || n.includes("wc") || n.includes("toilet")) {
    return "service";
  }
  return "public";
}

// ── Room fill by zone ─────────────────────────────────────────────────────────

function roomFill(zone: Zone): string {
  if (zone === "service") return "#eef2f7";   // blue-tint for wet/utility
  if (zone === "garage")  return "#f0f0ee";   // neutral gray for garage
  return "#fafaf8";                           // warm white for living/bedrooms
}

// ── Layout algorithm ──────────────────────────────────────────────────────────

interface PlacedRoom {
  name: string;
  sqft: number;
  w: number;  // ft
  h: number;  // ft
  x: number;  // ft from interior origin (after outer wall T_EXT)
  y: number;
  zone: Zone;
}

function layoutRooms(rooms: RoomEntry[], extW: number, extH: number): PlacedRoom[] {
  const iW = extW - 2 * T_EXT;
  const iH = extH - 2 * T_EXT;

  // Separate into zones
  const pub  = rooms.filter(r => zoneOf(r.name) === "public");
  const svc  = rooms.filter(r => zoneOf(r.name) === "service");
  const prv  = rooms.filter(r => zoneOf(r.name) === "private");
  const gar  = rooms.filter(r => zoneOf(r.name) === "garage");

  // Column widths proportional to zone importance
  // pub 38% | svc 27% | prv 35%
  const wPub = round1(iW * 0.38);
  const wSvc = round1(iW * 0.27);
  const wPrv = round1(iW - wPub - wSvc);

  const placed: PlacedRoom[] = [];

  // ── Stack rooms within a column ─────────────────────────────────────────────
  function stackZone(
    zoneRooms: RoomEntry[],
    colX: number,
    colW: number,
    zone: Zone
  ) {
    if (!zoneRooms.length) return;

    // Total unscaled sqft height vs available depth
    const totalRawH = zoneRooms.reduce((s, r) => s + (r.sqft / colW), 0);
    // Scale factor: fit rooms into column height (with small gap)
    const scaleH = Math.min(1.0, (iH - T_INT * (zoneRooms.length - 1)) / totalRawH);

    let curY = 0;
    for (const room of zoneRooms) {
      const rW = Math.min(room.width, colW - T_INT);
      const rawH = room.sqft / rW;
      const rH = round1(rawH * scaleH);

      placed.push({
        name: room.name,
        sqft: room.sqft,
        w: Math.min(rW, colW),
        h: Math.max(rH, 7), // minimum 7' per room
        x: colX,
        y: curY,
        zone,
      });
      curY += rH + T_INT;
    }
  }

  stackZone(pub, 0,            wPub, "public");
  stackZone(svc, wPub + T_INT, wSvc, "service");
  stackZone(prv, wPub + T_INT + wSvc + T_INT, wPrv, "private");

  // Garage appended to bottom if present
  if (gar.length) {
    const gSqft = gar.reduce((s, r) => s + r.sqft, 0);
    const gW = Math.min(iW * 0.5, 26);
    const gH = round1(gSqft / gW);
    placed.push({
      name: gar.map(r => r.name).join(" / "),
      sqft: gSqft,
      w: gW,
      h: Math.max(gH, 20),
      x: 0,
      y: iH + T_EXT * 2 + 2, // below main plan (separate attachment)
      zone: "garage",
    });
  }

  return placed;
}

// ── SVG element helpers ───────────────────────────────────────────────────────

function rect(x: number, y: number, w: number, h: number,
              fill: string, stroke: string, sw: number,
              extra = "") {
  return `<rect x="${px(x).toFixed(1)}" y="${px(y).toFixed(1)}" `
       + `width="${px(w).toFixed(1)}" height="${px(h).toFixed(1)}" `
       + `fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
}

function line(x1: number, y1: number, x2: number, y2: number,
              stroke: string, sw: number, dash = "") {
  const d = dash ? `stroke-dasharray="${dash}"` : "";
  return `<line x1="${px(x1).toFixed(1)}" y1="${px(y1).toFixed(1)}" `
       + `x2="${px(x2).toFixed(1)}" y2="${px(y2).toFixed(1)}" `
       + `stroke="${stroke}" stroke-width="${sw}" ${d}/>`;
}

function text(x: number, y: number, content: string,
              size: number, anchor: "start" | "middle" | "end",
              fill: string, weight = "normal", transform = "") {
  const t = transform ? `transform="${transform}"` : "";
  return `<text x="${px(x).toFixed(1)}" y="${px(y).toFixed(1)}" `
       + `font-size="${size}" text-anchor="${anchor}" fill="${fill}" `
       + `font-weight="${weight}" font-family="'Courier New',Courier,monospace" ${t}>`
       + esc(content) + `</text>`;
}

// ── Dimension line (external, horizontal or vertical) ─────────────────────────

function dimLineH(x1: number, x2: number, y: number, offset: number, label: string): string {
  // offset < 0 → above, offset > 0 → below
  const dy = y + offset;
  const tick = 0.5;
  const extDir = offset < 0 ? -tick : tick;
  const parts: string[] = [];

  parts.push(line(x1, dy, x2, dy, "#555", 0.8));
  parts.push(line(x1, y, x1, dy + extDir, "#555", 0.8));
  parts.push(line(x2, y, x2, dy + extDir, "#555", 0.8));

  // Tick marks (oblique) at each end
  parts.push(`<line x1="${(px(x1) - px(tick) * 0.6).toFixed(1)}" y1="${(px(dy) - px(tick) * 0.6).toFixed(1)}" `
           + `x2="${(px(x1) + px(tick) * 0.6).toFixed(1)}" y2="${(px(dy) + px(tick) * 0.6).toFixed(1)}" `
           + `stroke="#555" stroke-width="0.8"/>`);
  parts.push(`<line x1="${(px(x2) - px(tick) * 0.6).toFixed(1)}" y1="${(px(dy) - px(tick) * 0.6).toFixed(1)}" `
           + `x2="${(px(x2) + px(tick) * 0.6).toFixed(1)}" y2="${(px(dy) + px(tick) * 0.6).toFixed(1)}" `
           + `stroke="#555" stroke-width="0.8"/>`);

  const mx = (x1 + x2) / 2;
  const textY = offset < 0 ? dy - 0.4 : dy + 0.85;
  parts.push(text(mx, textY, label, 9.5, "middle", "#333", "normal"));
  return parts.join("\n");
}

function dimLineV(y1: number, y2: number, x: number, offset: number, label: string): string {
  const dx = x + offset;
  const tick = 0.5;
  const extDir = offset < 0 ? -tick : tick;
  const parts: string[] = [];

  parts.push(line(dx, y1, dx, y2, "#555", 0.8));
  parts.push(line(x, y1, dx + extDir, y1, "#555", 0.8));
  parts.push(line(x, y2, dx + extDir, y2, "#555", 0.8));

  parts.push(`<line x1="${(px(dx) - px(tick) * 0.6).toFixed(1)}" y1="${(px(y1) - px(tick) * 0.6).toFixed(1)}" `
           + `x2="${(px(dx) + px(tick) * 0.6).toFixed(1)}" y2="${(px(y1) + px(tick) * 0.6).toFixed(1)}" `
           + `stroke="#555" stroke-width="0.8"/>`);
  parts.push(`<line x1="${(px(dx) - px(tick) * 0.6).toFixed(1)}" y1="${(px(y2) - px(tick) * 0.6).toFixed(1)}" `
           + `x2="${(px(dx) + px(tick) * 0.6).toFixed(1)}" y2="${(px(y2) + px(tick) * 0.6).toFixed(1)}" `
           + `stroke="#555" stroke-width="0.8"/>`);

  const my = (y1 + y2) / 2;
  const tX = offset < 0 ? dx - 0.25 : dx + 0.25;
  const rot = `rotate(-90,${px(tX).toFixed(1)},${px(my).toFixed(1)})`;
  parts.push(text(tX, my + 0.35, label, 9.5, "middle", "#333", "normal", rot));
  return parts.join("\n");
}

// ── Door symbol (arc + door panel, placed on bottom wall of a room) ──────────

function doorSymbol(wx: number, wy: number, doorW: number, side: "left" | "right"): string {
  const sw = 0.025; // door panel, 3" thick
  if (side === "right") {
    // Hinge at left, swing right and forward
    const hx = wx, hy = wy;
    const ex = wx + doorW, ey = wy;
    const arcPath = `M ${px(ex).toFixed(1)},${px(ey).toFixed(1)} A ${px(doorW).toFixed(1)},${px(doorW).toFixed(1)} 0 0,1 ${px(hx).toFixed(1)},${px(hy + doorW).toFixed(1)}`;
    return [
      `<line x1="${px(hx)}" y1="${px(hy)}" x2="${px(ex)}" y2="${px(ey)}" stroke="#666" stroke-width="1.2"/>`,
      `<path d="${arcPath}" fill="none" stroke="#888" stroke-width="0.8" stroke-dasharray="3,2"/>`,
      `<line x1="${px(hx)}" y1="${px(hy)}" x2="${px(hx)}" y2="${px(hy + doorW)}" stroke="#888" stroke-width="0.8" stroke-dasharray="3,2"/>`,
    ].join("");
  } else {
    const hx = wx + doorW, hy = wy;
    const ex = wx, ey = wy;
    const arcPath = `M ${px(ex).toFixed(1)},${px(ey).toFixed(1)} A ${px(doorW).toFixed(1)},${px(doorW).toFixed(1)} 0 0,0 ${px(hx).toFixed(1)},${px(hy + doorW).toFixed(1)}`;
    return [
      `<line x1="${px(hx)}" y1="${px(hy)}" x2="${px(ex)}" y2="${px(ey)}" stroke="#666" stroke-width="1.2"/>`,
      `<path d="${arcPath}" fill="none" stroke="#888" stroke-width="0.8" stroke-dasharray="3,2"/>`,
      `<line x1="${px(hx)}" y1="${px(hy)}" x2="${px(hx)}" y2="${px(hy + doorW)}" stroke="#888" stroke-width="0.8" stroke-dasharray="3,2"/>`,
    ].join("");
  }
}

// ── Window symbol (three parallel lines across a wall) ───────────────────────

function windowSymbol(wx: number, wy: number, winW: number, isH = true): string {
  if (isH) {
    const mid = wy + T_EXT / 2;
    return [
      `<rect x="${px(wx).toFixed(1)}" y="${px(wy).toFixed(1)}" width="${px(winW).toFixed(1)}" height="${px(T_EXT).toFixed(1)}" fill="#d0e8f5" stroke="none"/>`,
      `<line x1="${px(wx)}" y1="${px(mid - T_EXT * 0.12)}" x2="${px(wx + winW)}" y2="${px(mid - T_EXT * 0.12)}" stroke="#5599bb" stroke-width="1.2"/>`,
      `<line x1="${px(wx)}" y1="${px(mid + T_EXT * 0.12)}" x2="${px(wx + winW)}" y2="${px(mid + T_EXT * 0.12)}" stroke="#5599bb" stroke-width="1.2"/>`,
    ].join("");
  } else {
    const mid = wx + T_EXT / 2;
    return [
      `<rect x="${px(wx).toFixed(1)}" y="${px(wy).toFixed(1)}" width="${px(T_EXT).toFixed(1)}" height="${px(winW).toFixed(1)}" fill="#d0e8f5" stroke="none"/>`,
      `<line x1="${px(mid - T_EXT * 0.12)}" y1="${px(wy)}" x2="${px(mid - T_EXT * 0.12)}" y2="${px(wy + winW)}" stroke="#5599bb" stroke-width="1.2"/>`,
      `<line x1="${px(mid + T_EXT * 0.12)}" y1="${px(wy)}" x2="${px(mid + T_EXT * 0.12)}" y2="${px(wy + winW)}" stroke="#5599bb" stroke-width="1.2"/>`,
    ].join("");
  }
}

// ── North arrow ───────────────────────────────────────────────────────────────

function northArrow(cx: number, cy: number): string {
  const r = 1.8; // ft radius
  const shaft = r * 0.85;
  const arrow = 0.45;
  const cpx = px(cx), cpy = px(cy), rp = px(r);
  const sp = px(shaft), ap = px(arrow);
  return [
    `<circle cx="${cpx}" cy="${cpy}" r="${rp}" fill="none" stroke="#444" stroke-width="1"/>`,
    // North arrow — filled left half
    `<polygon points="${cpx},${cpy - sp} ${cpx - ap},${cpy + sp * 0.5} ${cpx},${cpy + sp * 0.25}" fill="#222"/>`,
    `<polygon points="${cpx},${cpy - sp} ${cpx + ap},${cpy + sp * 0.5} ${cpx},${cpy + sp * 0.25}" fill="white" stroke="#222" stroke-width="0.6"/>`,
    `<text x="${cpx}" y="${cpy - sp - 3}" font-size="11" text-anchor="middle" fill="#222" font-weight="bold" font-family="'Courier New',Courier,monospace">N</text>`,
  ].join("");
}

// ── Graphic scale bar ─────────────────────────────────────────────────────────

function scaleBar(x: number, y: number): string {
  const segFt = 10;
  const segs = 3;
  const segPx = px(segFt);
  const barH = px(0.5);
  const parts: string[] = [];

  for (let i = 0; i < segs; i++) {
    const bx = px(x) + i * segPx;
    const fill = i % 2 === 0 ? "#333" : "white";
    parts.push(`<rect x="${bx.toFixed(1)}" y="${px(y).toFixed(1)}" width="${segPx.toFixed(1)}" height="${barH.toFixed(1)}" fill="${fill}" stroke="#333" stroke-width="0.8"/>`);
    parts.push(`<text x="${bx.toFixed(1)}" y="${(px(y) - 2).toFixed(1)}" font-size="8" text-anchor="middle" fill="#444" font-family="'Courier New',Courier,monospace">${i * segFt}'</text>`);
  }
  parts.push(`<text x="${(px(x) + segs * segPx).toFixed(1)}" y="${(px(y) - 2).toFixed(1)}" font-size="8" text-anchor="middle" fill="#444" font-family="'Courier New',Courier,monospace">${segs * segFt}'</text>`);
  parts.push(`<text x="${(px(x) + segs * segPx / 2).toFixed(1)}" y="${(px(y) + barH + 9).toFixed(1)}" font-size="8" text-anchor="middle" fill="#555" font-family="'Courier New',Courier,monospace">SCALE: 1" = 10'-0"</text>`);

  return parts.join("\n");
}

// ── Title block ───────────────────────────────────────────────────────────────

function titleBlock(
  svgW: number,     // total SVG width in ft
  svgH: number,     // total SVG height in ft
  tbH: number,      // title block height in ft
  projectName: string,
  structureType: string,
  totalSqft: number,
  location: string,
  isDraft: boolean,
  dateStr: string,
): string {
  const tbY = svgH - tbH;
  const parts: string[] = [];

  // Outer border
  parts.push(rect(0, 0, svgW, svgH, "none", "#222", 1.5));
  // Title block top border
  parts.push(line(0, tbY, svgW, tbY, "#222", 1.0));

  // Vertical dividers in title block
  const col1 = svgW * 0.36;
  const col2 = svgW * 0.60;
  const col3 = svgW * 0.78;
  parts.push(line(col1, tbY, col1, svgH, "#222", 0.7));
  parts.push(line(col2, tbY, col2, svgH, "#222", 0.7));
  parts.push(line(col3, tbY, col3, svgH, "#222", 0.7));

  // Horizontal sub-dividers
  const row1 = tbY + tbH * 0.45;
  parts.push(line(0, row1, col1, row1, "#222", 0.5));
  parts.push(line(col2, row1, svgW, row1, "#222", 0.5));

  // Company / title
  parts.push(text(1.0, tbY + 1.0, "BUILDWELL", 14, "start", "#1a1a1a", "bold"));
  parts.push(text(1.0, tbY + 1.9, "ibuildwell.com", 8, "start", "#666"));
  parts.push(text(1.0, tbY + 3.0, esc(projectName).substring(0, 28), 10, "start", "#111", "bold"));
  parts.push(text(1.0, tbY + 3.8, esc(structureType.replace(/_/g, " ")), 8, "start", "#555"));
  parts.push(text(1.0, tbY + 4.5, esc(location), 8, "start", "#555"));

  // Sheet info
  parts.push(text(col2 + 0.5, tbY + 1.1, "SHEET", 7, "start", "#888"));
  parts.push(text(col2 + 0.5, tbY + 2.0, "A1", 18, "start", "#111", "bold"));
  parts.push(text(col2 + 0.5, tbY + 3.0, "FLOOR PLAN", 8, "start", "#333", "bold"));
  parts.push(text(col2 + 0.5, tbY + 3.8, "SCHEMATIC DESIGN", 7, "start", "#666"));

  // Area / date
  parts.push(text(col3 + 0.5, tbY + 1.1, "GROSS AREA", 7, "start", "#888"));
  parts.push(text(col3 + 0.5, tbY + 2.0, `${totalSqft.toLocaleString()} SF`, 11, "start", "#111", "bold"));
  parts.push(text(col3 + 0.5, tbY + 3.0, "DATE", 7, "start", "#888"));
  parts.push(text(col3 + 0.5, tbY + 3.8, dateStr, 8, "start", "#444"));

  // Scale
  parts.push(text(col1 + 0.5, tbY + 1.1, "SCALE", 7, "start", "#888"));
  parts.push(text(col1 + 0.5, tbY + 2.0, `1" = 10'-0"`, 9, "start", "#111", "bold"));
  parts.push(text(col1 + 0.5, tbY + 3.0, "DRAWN BY", 7, "start", "#888"));
  parts.push(text(col1 + 0.5, tbY + 3.8, "BUILDWELL AI", 8, "start", "#444"));

  // Draft watermark / disclaimer
  if (isDraft) {
    parts.push(text(svgW / 2, tbY + 0.9, "DRAFT — NOT FOR CONSTRUCTION — OWNED BY BUILD-WELL LLC", 7.5, "middle", "#b45309", "bold"));
  } else {
    parts.push(text(svgW / 2, tbY + 0.7, "PRELIMINARY SCHEMATIC — NOT FOR CONSTRUCTION", 7.5, "middle", "#555"));
    parts.push(text(svgW / 2, tbY + 1.4, "BUILDWELL LLC · All drawings require licensed engineer review before permit submittal.", 6.5, "middle", "#888"));
  }

  // General notes (right panel below row1)
  const notes = [
    "1. ALL DIMS TO FACE OF FRAMING UNLESS NOTED.",
    "2. VERIFY ALL DIMS IN FIELD BEFORE CONSTRUCTION.",
    "3. DO NOT SCALE DRAWINGS.",
    "4. COMPLY WITH ALL APPLICABLE LOCAL CODES.",
    "5. STRUCTURAL MEMBERS REQUIRE LICENSED PE.",
    "6. FOUNDATION TYPE PER SOILS REPORT.",
  ];
  notes.forEach((note, i) => {
    parts.push(text(col3 + 0.4, row1 + 0.9 + i * 0.95, note, 6.5, "start", "#555"));
  });

  return parts.join("\n");
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateFloorPlanSVG(
  rooms: RoomEntry[],
  projectName: string,
  structureType: string,
  totalSqft: number,
  isDraft: boolean,
  location = "",
): string {
  const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // ── Compute exterior plan dimensions from total sqft ──────────────────────
  const aspect = structureType.includes("BARN") || structureType.includes("POLE") ? 2.2 : 1.65;
  const rawW   = Math.sqrt(totalSqft * aspect);
  const rawH   = totalSqft / rawW;
  const extW   = Math.round(rawW / 2) * 2;        // round to even foot
  const extH   = Math.round(rawH / 2) * 2;

  const placed = layoutRooms(rooms, extW, extH);

  // ── SVG canvas dimensions ──────────────────────────────────────────────────
  const MARGIN_L = 6;   // ft – left margin for vertical dims
  const MARGIN_R = 5;   // ft
  const MARGIN_T = 5;   // ft – top margin for horizontal dims
  const MARGIN_B = 8;   // ft – title block height
  const DIM_OFFSET = 3; // ft – how far dim lines sit outside the plan

  const svgW = MARGIN_L + DIM_OFFSET + extW + DIM_OFFSET + MARGIN_R;
  const svgH = MARGIN_T + DIM_OFFSET + extH + DIM_OFFSET + MARGIN_B;

  const planX = MARGIN_L + DIM_OFFSET;  // plan origin in SVG space
  const planY = MARGIN_T + DIM_OFFSET;

  const vbW = px(svgW);
  const vbH = px(svgH);

  // ── SVG defs ──────────────────────────────────────────────────────────────
  const defs = `
<defs>
  <!-- Diagonal wall poché pattern (45° hatch, 45° pitch) -->
  <pattern id="wallHatch" x="0" y="0" width="${px(0.5)}" height="${px(0.5)}"
           patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="${px(0.5)}" stroke="#999" stroke-width="0.7"/>
  </pattern>
  <!-- Light grid for wet rooms -->
  <pattern id="wetGrid" x="0" y="0" width="${px(1)}" height="${px(1)}"
           patternUnits="userSpaceOnUse">
    <rect width="${px(1)}" height="${px(1)}" fill="#eef2f7"/>
    <line x1="0" y1="0" x2="${px(1)}" y2="0" stroke="#c5d4e8" stroke-width="0.5"/>
    <line x1="0" y1="0" x2="0" y2="${px(1)}" stroke="#c5d4e8" stroke-width="0.5"/>
  </pattern>
  <!-- Garage concrete dots -->
  <pattern id="concreteFill" x="0" y="0" width="${px(2)}" height="${px(2)}"
           patternUnits="userSpaceOnUse">
    <rect width="${px(2)}" height="${px(2)}" fill="#f0f0ee"/>
    <circle cx="${px(1)}" cy="${px(1)}" r="1" fill="#ccc"/>
  </pattern>
</defs>`;

  const parts: string[] = [];
  parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" `
           + `width="${vbW}" height="${vbH}" style="background:#fff;font-family:'Courier New',Courier,monospace">`);
  parts.push(defs);

  // ── Background ─────────────────────────────────────────────────────────────
  parts.push(`<rect width="${vbW}" height="${vbH}" fill="#fff"/>`);

  // ── Plan group (offset to plan origin) ────────────────────────────────────
  parts.push(`<g transform="translate(${px(planX).toFixed(1)},${px(planY).toFixed(1)})">`);

  // ── Outer wall shell – hatched fill ──────────────────────────────────────
  parts.push(rect(0, 0, extW, extH, "url(#wallHatch)", "#111", 3));

  // ── Inner clearance (white inside the walls) ──────────────────────────────
  parts.push(rect(T_EXT, T_EXT, extW - 2 * T_EXT, extH - 2 * T_EXT, "#fff", "none", 0));

  // ── Placed rooms ──────────────────────────────────────────────────────────
  const iX = T_EXT;  // interior origin X (after outer wall)
  const iY = T_EXT;  // interior origin Y

  for (const room of placed) {
    if (room.zone === "garage") continue; // handle separately

    const rx = iX + room.x;
    const ry = iY + room.y;
    const fill = room.zone === "service" ? "url(#wetGrid)" : roomFill(room.zone);

    // Room fill
    parts.push(rect(rx, ry, room.w, room.h, fill, "#444", 1.5));

    // Room label (name)
    const cx = rx + room.w / 2;
    const cy = ry + room.h / 2;
    const maxChars = Math.floor(room.w * 1.8);
    const labelName = room.name.length > maxChars && maxChars > 4
      ? room.name.substring(0, maxChars - 1) + "…"
      : room.name;

    parts.push(text(cx, cy - 0.3, labelName, Math.min(11, Math.max(7, room.w * 1.1)), "middle", "#222", "bold"));
    parts.push(text(cx, cy + 0.7, `${room.sqft} SF`, 8, "middle", "#666"));
    parts.push(text(cx, cy + 1.4, `${ftLabel(room.w)} × ${ftLabel(room.h)}`, 7, "middle", "#999"));

    // Door symbol on bottom wall (simple arc, not for baths/closets)
    if (room.zone !== "service" && room.h > 8 && room.w > 6) {
      const doorW = 2.8;
      const dX = rx + room.w * 0.25;
      const dY = ry + room.h - T_INT / 2;
      parts.push(doorSymbol(dX, dY, doorW, "right"));
    }

    // Window marks on exterior walls for front-facing rooms
    if (room.y === 0 && room.zone !== "service") {
      const winW = Math.min(room.w * 0.4, 5);
      parts.push(windowSymbol(rx + (room.w - winW) / 2, 0, winW, true));
    }
  }

  // ── Exterior wall outline (over rooms) ────────────────────────────────────
  parts.push(rect(0, 0, extW, T_EXT, "url(#wallHatch)", "#111", 2));             // top wall
  parts.push(rect(0, extH - T_EXT, extW, T_EXT, "url(#wallHatch)", "#111", 2));  // bottom wall
  parts.push(rect(0, 0, T_EXT, extH, "url(#wallHatch)", "#111", 2));             // left wall
  parts.push(rect(extW - T_EXT, 0, T_EXT, extH, "url(#wallHatch)", "#111", 2)); // right wall

  // Outer perimeter outline (thick)
  parts.push(rect(0, 0, extW, extH, "none", "#111", 3));

  // ── Garage (appended below if present) ────────────────────────────────────
  const garRoom = placed.find(r => r.zone === "garage");
  if (garRoom) {
    const gY = extH + 1.5;
    const gX = T_EXT;
    parts.push(rect(gX, gY, garRoom.w, garRoom.h, "url(#concreteFill)", "#666", 1.5));
    parts.push(text(gX + garRoom.w / 2, gY + garRoom.h / 2 - 0.3, garRoom.name, 10, "middle", "#444", "bold"));
    parts.push(text(gX + garRoom.w / 2, gY + garRoom.h / 2 + 0.7, `${garRoom.sqft} SF`, 8, "middle", "#888"));

    // Overhead door symbol (horizontal lines)
    const gdH = px(0.4);
    for (let p = 1; p <= 4; p++) {
      const gy = px(gY) + p * (px(garRoom.h) / 6);
      parts.push(`<line x1="${px(gX)}" y1="${gy.toFixed(1)}" x2="${px(gX + garRoom.w)}" y2="${gy.toFixed(1)}" stroke="#aaa" stroke-width="0.7"/>`);
    }
  }

  parts.push(`</g>`); // end plan group

  // ── Dimension strings (outside plan group – in SVG root coords) ───────────
  // Top: overall width
  parts.push(`<g transform="translate(${px(planX).toFixed(1)},${px(planY).toFixed(1)})">`);
  parts.push(dimLineH(0, extW, 0, -DIM_OFFSET, ftLabel(extW)));
  // Bottom: second dimension level
  parts.push(dimLineH(0, extW, extH, DIM_OFFSET, ftLabel(extW)));
  // Left: overall depth
  parts.push(dimLineV(0, extH, 0, -DIM_OFFSET, ftLabel(extH)));
  // Right
  parts.push(dimLineV(0, extH, extW, DIM_OFFSET, ftLabel(extH)));
  parts.push(`</g>`);

  // ── North arrow ───────────────────────────────────────────────────────────
  const naX = planX + extW + DIM_OFFSET + 1.5;
  const naY = planY + 3.5;
  parts.push(northArrow(naX, naY));

  // ── Scale bar ─────────────────────────────────────────────────────────────
  const sbX = planX;
  const sbY = planY + extH + DIM_OFFSET + 1.2;
  parts.push(scaleBar(sbX, sbY));

  // ── Drawing title ─────────────────────────────────────────────────────────
  parts.push(text(planX + extW / 2, planY - DIM_OFFSET - 0.5, "FLOOR PLAN — SCHEMATIC DESIGN", 11, "middle", "#111", "bold"));
  parts.push(text(planX + extW / 2, planY - DIM_OFFSET + 0.6, `SCALE 1/4" = 1'-0"   (DISPLAY APPROX.)`, 8, "middle", "#666"));

  // ── Room count note ───────────────────────────────────────────────────────
  const nonGarRooms = placed.filter(r => r.zone !== "garage");
  parts.push(text(naX, naY + 3.5, `${nonGarRooms.length} ROOMS`, 8, "middle", "#666"));
  parts.push(text(naX, naY + 4.5, `${totalSqft.toLocaleString()} SF GROSS`, 8, "middle", "#666"));

  // ── Title block ───────────────────────────────────────────────────────────
  const tbH = MARGIN_B;
  parts.push(titleBlock(svgW, svgH, tbH, projectName, structureType, totalSqft, location, isDraft, dateStr));

  // ── Draft diagonal watermark ──────────────────────────────────────────────
  if (isDraft) {
    const midX = vbW / 2, midY = vbH * 0.4;
    parts.push(
      `<text x="${midX}" y="${midY}" font-size="72" text-anchor="middle" fill="rgba(180,83,9,0.10)" `
      + `font-weight="bold" font-family="'Courier New',Courier,monospace" `
      + `transform="rotate(-30,${midX},${midY})">DRAFT PREVIEW</text>`
    );
  }

  parts.push(`</svg>`);
  return parts.join("\n");
}
