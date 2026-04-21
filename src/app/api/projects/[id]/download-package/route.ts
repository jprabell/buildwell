import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import JSZip from "jszip";
import { STRUCTURE_OPTIONS } from "@/lib/structures";
import { generatePlanningReport } from "@/lib/planningReport";
import { generateFloorPlanSVG } from "@/lib/floorPlanSVG";
import { calculateMaterials } from "@/lib/materialCalculator";
import { generateSchedule } from "@/lib/constructionSchedule";
import { getTradesForStructure } from "@/lib/contractorTrades";
import { getBidSpecs } from "@/lib/bidPackageSpecs";
import { ProjectAnswers } from "@/types";
import { StructureType } from "@/types";

// ── CSV helpers ───────────────────────────────────────────────────────────────

function csvRow(cells: (string | number)[]): string {
  return cells.map(c => {
    const s = String(c ?? "").replace(/"/g, '""');
    return /[,"\n\r]/.test(s) ? `"${s}"` : s;
  }).join(",");
}

// ── HTML report builder ───────────────────────────────────────────────────────

function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 24px;color:#1c1917;line-height:1.5}
  h1{font-size:22px;font-weight:900;margin:0 0 4px}
  h2{font-size:15px;font-weight:800;margin:28px 0 8px;padding-bottom:4px;border-bottom:2px solid #e7e5e4}
  h3{font-size:13px;font-weight:700;margin:16px 0 6px;color:#57534e}
  table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px}
  th{background:#f5f5f4;text-align:left;padding:6px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#78716c}
  td{padding:6px 10px;border-bottom:1px solid #e7e5e4}
  tr:last-child td{border-bottom:none}
  .badge{display:inline-block;background:#fef3c7;color:#92400e;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px}
  .meta{color:#78716c;font-size:12px;margin:0 0 24px}
  .disclaimer{background:#f5f5f4;border-radius:8px;padding:14px 18px;font-size:11px;color:#78716c;margin-top:32px}
  .draft-banner{background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:10px 16px;font-size:12px;font-weight:700;color:#92400e;margin-bottom:20px}
  @media print{body{margin:20px auto}}
</style>
</head>
<body>${body}</body>
</html>`;
}

// ── Main route ────────────────────────────────────────────────────────────────

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await db.project.findFirst({ where: { id, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const purchases = (answers._purchases as string[] | undefined) ?? [];
  const hasBlueprintSet  = purchases.includes("blueprint_set");
  const hasMaterialList  = purchases.includes("material_list");
  const hasSchedule      = purchases.includes("construction_schedule");
  const hasQuotePackage  = purchases.includes("quote_package");
  // Allow download if at least one document has been purchased
  const hasAny = hasBlueprintSet || hasMaterialList || hasSchedule || hasQuotePackage;
  if (!hasAny) {
    return NextResponse.json({ error: "No purchased documents" }, { status: 403 });
  }

  const structure = STRUCTURE_OPTIONS.find(s => s.value === project.structureType);
  const structureLabel = structure?.label ?? project.structureType;
  const report = generatePlanningReport(answers, project.structureType, structureLabel, project.name);
  const totalRoomSqft = report.rooms.reduce((s, r) => s + r.sqft, 0);
  const sqft = report.squareFootage > 0 ? report.squareFootage : totalRoomSqft;
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const zip = new JSZip();
  const folder = zip.folder(project.name.replace(/[^a-zA-Z0-9_-]/g, "_"))!;

  // ── README.txt ───────────────────────────────────────────────────────────────
  const purchased = [
    hasBlueprintSet  && "Blueprint Set (floor-plan.svg, project-report.html)",
    hasMaterialList  && "Material List (material-list.csv)",
    hasSchedule      && "Construction Schedule (construction-schedule.csv)",
    hasQuotePackage  && "Contractor Bid Package (bid-package.html)",
  ].filter(Boolean).join("\n  ");

  folder.file("README.txt", [
    "BUILDWELL — ARCHITECT HANDOFF PACKAGE",
    "======================================",
    "",
    `Project:    ${project.name}`,
    `Structure:  ${structureLabel}`,
    `Location:   ${report.location || "—"}`,
    `Total Area: ${sqft.toLocaleString()} sq ft`,
    `Budget Est: ${report.budgetRange}`,
    `Generated:  ${dateStr}`,
    `Owner:      ${session.user.email ?? "—"}`,
    "",
    "INCLUDED DOCUMENTS",
    "------------------",
    `  ${purchased}`,
    "",
    "IMPORTANT NOTICES",
    "-----------------",
    "• All drawings are SCHEMATIC / PRELIMINARY — NOT FOR CONSTRUCTION.",
    "• Dimensions and areas are AI-generated estimates. Verify in field.",
    "• Structural members require review by a licensed PE before permit.",
    "• Floor plan (SVG) should be used as a reference base only.",
    "• All documents require review by a licensed architect or engineer.",
    "",
    "Buildwell LLC · ibuildwell.com",
  ].join("\n"));

  // ── Floor plan SVG ────────────────────────────────────────────────────────────
  if (hasBlueprintSet) {
    const svg = generateFloorPlanSVG(
      report.rooms,
      project.name,
      project.structureType,
      sqft,
      false, // purchased = clean (no draft watermark)
      report.location,
    );
    folder.file("floor-plan.svg", svg);

    // ── Project report HTML ─────────────────────────────────────────────────
    const roomRows = report.rooms.map(r =>
      `<tr><td>${r.name}</td><td>${r.width}</td><td>${r.length}</td><td><strong>${r.sqft.toLocaleString()}</strong></td><td>${r.notes}</td></tr>`
    ).join("");

    const structRows = report.structural.map(s =>
      `<tr><td>${s.label}</td><td>${s.value}</td><td>${s.notes}</td></tr>`
    ).join("");

    const assumptionsList = report.assumptions.map(a => `<li>${a}</li>`).join("");

    const reportBody = `
      <h1>Build<span style="color:#d97706">well</span> — Construction Planning Report</h1>
      <p class="meta">${project.name} · ${structureLabel} · ${report.location || "—"} · ${dateStr}</p>
      <div class="draft-banner">PRELIMINARY SCHEMATIC — NOT FOR CONSTRUCTION · Buildwell LLC</div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px">
        <div style="background:#f5f5f4;border-radius:8px;padding:12px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin-bottom:4px">Total Area</div>
          <div style="font-size:18px;font-weight:900">${sqft.toLocaleString()} SF</div>
        </div>
        <div style="background:#f5f5f4;border-radius:8px;padding:12px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin-bottom:4px">Stories</div>
          <div style="font-size:18px;font-weight:900">${report.stories}</div>
        </div>
        <div style="background:#f5f5f4;border-radius:8px;padding:12px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin-bottom:4px">Budget Est.</div>
          <div style="font-size:18px;font-weight:900">${report.budgetRange}</div>
        </div>
        <div style="background:#f5f5f4;border-radius:8px;padding:12px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin-bottom:4px">Rooms</div>
          <div style="font-size:18px;font-weight:900">${report.rooms.length}</div>
        </div>
      </div>

      <h2>Project Scope &amp; Assumptions</h2>
      <ul style="font-size:12px;color:#57534e;line-height:1.7">${assumptionsList}</ul>

      <h2>01 — Room Schedule</h2>
      <table>
        <thead><tr><th>Room</th><th>Width (ft)</th><th>Length (ft)</th><th>Sq Ft</th><th>Notes</th></tr></thead>
        <tbody>${roomRows}</tbody>
        <tfoot><tr><td colspan="3"><strong>Total</strong></td><td><strong>${totalRoomSqft.toLocaleString()}</strong></td><td>sq ft</td></tr></tfoot>
      </table>

      <h2>02 — Foundation &amp; Framing Summary</h2>
      <table>
        <thead><tr><th>Element</th><th>Specification</th><th>Notes</th></tr></thead>
        <tbody>${structRows}</tbody>
      </table>

      <div class="disclaimer">
        <strong>Disclaimer:</strong> ${report.disclaimer}
      </div>
    `;
    folder.file("project-report.html", wrapHtml(`${project.name} — Construction Planning Report`, reportBody));

    // ── Room schedule CSV ───────────────────────────────────────────────────
    const roomCsvRows = [
      csvRow(["Room / Space", "Width (ft)", "Length (ft)", "Sq Ft", "Notes"]),
      ...report.rooms.map(r => csvRow([r.name, r.width, r.length, r.sqft, r.notes])),
      csvRow(["TOTAL", "", "", totalRoomSqft, "sq ft"]),
    ];
    folder.file("room-schedule.csv", roomCsvRows.join("\n"));
  }

  // ── Material list CSV ─────────────────────────────────────────────────────
  if (hasMaterialList) {
    const matResult = calculateMaterials(answers, project.structureType, project.name);
    const matRows = [
      csvRow(["Division", "Category", "Item", "Specification", "Quantity", "Unit", "Notes"]),
      ...matResult.items.map(m =>
        csvRow([`${m.division} - ${m.divisionName}`, m.category, m.item, m.spec, m.quantity, m.unit, m.notes])
      ),
    ];
    folder.file("material-list.csv", matRows.join("\n"));
  }

  // ── Construction schedule CSV ─────────────────────────────────────────────
  if (hasSchedule) {
    const schedule = generateSchedule(project.structureType as StructureType, answers);
    const schedRows = [
      csvRow(["Phase", "Phase Order", "Task ID", "Task Name", "Duration (days)", "Depends On", "Critical Path", "Notes"]),
    ];
    for (const phase of schedule.phases) {
      for (const task of phase.tasks) {
        schedRows.push(csvRow([
          phase.name,
          phase.order,
          task.id,
          task.name,
          task.durationDays,
          task.dependsOn.join(" | "),
          task.isCritical ? "Yes" : "No",
          task.notes ?? "",
        ]));
      }
    }
    schedRows.push(csvRow([]));
    schedRows.push(csvRow(["Total Weeks", schedule.totalWeeks, "", "", "", "", "", schedule.criticalPathSummary]));
    folder.file("construction-schedule.csv", schedRows.join("\n"));
  }

  // ── Bid package HTML ──────────────────────────────────────────────────────
  if (hasQuotePackage) {
    const trades = getTradesForStructure(project.structureType as StructureType);
    const sqftNum = Number(answers.squareFootage ?? answers.squareFeet ?? 0) || sqft;
    const totalLow  = sqftNum * 80;
    const totalHigh = sqftNum * 200;

    function fmtMoney(n: number) { return "$" + Math.round(n).toLocaleString("en-US"); }
    function pctLow(range: string)  { const m = range.match(/([\d.]+)/);         return m ? totalLow  * (parseFloat(m[1]) / 100) : 0; }
    function pctHigh(range: string) { const m = range.match(/–\s*([\d.]+)/);     return m ? totalHigh * (parseFloat(m[1]) / 100) : 0; }

    const tradeSections = trades.map(trade => {
      const specs = getBidSpecs(trade.trade, answers, project.structureType);
      const specList = specs.map(s => `<li style="font-size:12px;margin:3px 0;color:#374151">${s}</li>`).join("");
      const lo = pctLow(trade.budgetPctRange);
      const hi = pctHigh(trade.budgetPctRange);

      return `
        <div style="border:1px solid #e7e5e4;border-radius:10px;margin-bottom:20px;overflow:hidden;page-break-inside:avoid">
          <div style="background:#1c1917;color:white;padding:10px 16px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <span style="font-size:12px;font-weight:700;color:#a8a29e;margin-right:10px">${String(trade.order).padStart(2,"0")}</span>
              <span style="font-size:14px;font-weight:900">${trade.trade}</span>
              <span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:10px;font-weight:700;padding:1px 8px;border-radius:999px;margin-left:8px">${trade.category}</span>
            </div>
            ${lo > 0 ? `<span style="font-size:11px;color:#fcd34d;font-weight:700">${fmtMoney(lo)} – ${fmtMoney(hi)}</span>` : ""}
          </div>
          <div style="padding:14px 16px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div>
              <p style="font-size:10px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin:0 0 6px">Scope of Work</p>
              <p style="font-size:13px;color:#374151;line-height:1.5;margin:0 0 12px">${trade.description}</p>
              ${specList ? `<p style="font-size:10px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin:0 0 6px">Specified Materials &amp; Standards</p><ul style="margin:0;padding-left:16px">${specList}</ul>` : ""}
              <p style="font-size:10px;font-weight:700;color:${trade.licenseRequired ? "#e11d48" : "#a8a29e"};margin-top:12px">
                ${trade.licenseRequired ? "✓ License Required — " : ""}${trade.licenseNote}
              </p>
            </div>
            <div>
              <p style="font-size:10px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin:0 0 10px">Bid Response Form</p>
              ${["Contractor Company Name","License Number","Insurance Cert / Exp Date","Base Bid Amount ($)","Estimated Start Date","Estimated Duration (weeks)"].map(f =>
                `<div style="margin-bottom:10px"><p style="font-size:9px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin:0 0 3px">${f}</p><div style="border-bottom:1px solid #d1d5db;height:20px"></div></div>`
              ).join("")}
            </div>
          </div>
        </div>`;
    }).join("");

    const bidBody = `
      <h1>Build<span style="color:#d97706">well</span> — Contractor Bid Package</h1>
      <p class="meta">${project.name} · ${structureLabel} · ${report.location || "—"} · ${dateStr}</p>
      <div class="draft-banner">Send one section per trade to a minimum of 3 licensed contractors. Verify license and insurance before awarding.</div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px">
        <div style="background:#f5f5f4;border-radius:8px;padding:12px;text-align:center">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin-bottom:4px">Sq Ft</div>
          <div style="font-size:18px;font-weight:900">${sqftNum.toLocaleString()}</div>
        </div>
        <div style="background:#fef3c7;border-radius:8px;padding:12px;text-align:center">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#92400e;margin-bottom:4px">Est. Budget Low</div>
          <div style="font-size:18px;font-weight:900">${fmtMoney(totalLow)}</div>
        </div>
        <div style="background:#fef3c7;border-radius:8px;padding:12px;text-align:center">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#92400e;margin-bottom:4px">Est. Budget High</div>
          <div style="font-size:18px;font-weight:900">${fmtMoney(totalHigh)}</div>
        </div>
      </div>

      <h2>Trade Bid Sections</h2>
      ${tradeSections}

      <div class="disclaimer">
        Budget estimates are derived from industry-standard cost percentages and provided for planning purposes only.
        Buildwell LLC does not guarantee any pricing. Obtain at least 3 competitive bids per trade.
      </div>
    `;
    folder.file("bid-package.html", wrapHtml(`${project.name} — Contractor Bid Package`, bidBody));
  }

  // ── Generate zip ──────────────────────────────────────────────────────────
  const nodeBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const buffer = new Uint8Array(nodeBuffer);

  const safeName = project.name.replace(/[^a-zA-Z0-9_-]/g, "_");
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safeName}_Buildwell_Package.zip"`,
      "Content-Length": String(nodeBuffer.byteLength),
    },
  });
}
