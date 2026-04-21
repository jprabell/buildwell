import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getBidSpecs } from "@/lib/bidPackageSpecs";
import { ProjectAnswers } from "@/types";
import { Resend } from "resend";

// ── GET /api/bid/[token] — public, no auth ─────────────────────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const inv = await db.bidInvitation.findUnique({
    where: { token },
    include: { project: { select: { name: true, structureType: true, answers: true } } },
  });

  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const answers = (inv.project.answers ?? {}) as ProjectAnswers;
  const specs = getBidSpecs(inv.tradeName, answers, inv.project.structureType);

  return NextResponse.json({
    projectName:     inv.project.name,
    contractorName:  inv.contractorName,
    tradeName:       inv.tradeName,
    tradeDescription: inv.tradeDescription,
    tradeCategory:   inv.tradeCategory,
    budgetLow:       inv.budgetLow,
    budgetHigh:      inv.budgetHigh,
    licenseNote:     inv.licenseNote,
    specs,
    alreadySubmitted: !!inv.submittedAt,
    submittedAt:     inv.submittedAt,
  });
}

// ── POST /api/bid/[token] — contractor submits bid ─────────────────────────
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const inv = await db.bidInvitation.findUnique({
    where: { token },
    include: { project: { select: { name: true, userId: true, user: { select: { email: true } } } } },
  });

  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (inv.submittedAt) return NextResponse.json({ error: "Already submitted" }, { status: 409 });

  const {
    companyName,
    licenseNumber,
    insuranceInfo,
    bidAmount,
    startDate,
    durationWeeks,
    materialsIncluded,
    exclusions,
    notes,
  } = await req.json() as {
    companyName?: string;
    licenseNumber?: string;
    insuranceInfo?: string;
    bidAmount?: number;
    startDate?: string;
    durationWeeks?: number;
    materialsIncluded?: string;
    exclusions?: string;
    notes?: string;
  };

  if (!bidAmount || bidAmount <= 0) {
    return NextResponse.json({ error: "Bid amount is required" }, { status: 400 });
  }

  const updated = await db.bidInvitation.update({
    where: { token },
    data: {
      companyName:      companyName   || null,
      licenseNumber:    licenseNumber || null,
      insuranceInfo:    insuranceInfo || null,
      bidAmount,
      startDate:        startDate     || null,
      durationWeeks:    durationWeeks ? Number(durationWeeks) : null,
      materialsIncluded: materialsIncluded || null,
      exclusions:       exclusions    || null,
      notes:            notes         || null,
      submittedAt:      new Date(),
    },
  });

  // Notify project owner
  const ownerEmail = inv.project.user.email;
  if (ownerEmail && process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
    await resend.emails.send({
      from: "Buildwell <noreply@ibuildwell.com>",
      to: ownerEmail,
      subject: `New Bid Received: ${inv.tradeName} — ${inv.project.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fafaf9">
          <p style="font-size:22px;font-weight:900;color:#1c1917;margin:0 0 4px">
            Build<span style="color:#d97706">well</span>
          </p>
          <p style="color:#a8a29e;font-size:12px;margin:0 0 28px">New Bid Received · ibuildwell.com</p>

          <div style="background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:20px;margin-bottom:20px">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#a8a29e;margin:0 0 12px">Bid Details</p>
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <tr><td style="color:#6b7280;padding:4px 0;width:140px">Trade</td><td style="font-weight:700;color:#111827">${inv.tradeName}</td></tr>
              <tr><td style="color:#6b7280;padding:4px 0">Project</td><td style="font-weight:600;color:#111827">${inv.project.name}</td></tr>
              ${companyName ? `<tr><td style="color:#6b7280;padding:4px 0">Company</td><td style="color:#111827">${companyName}</td></tr>` : ""}
              ${updated.contractorName ? `<tr><td style="color:#6b7280;padding:4px 0">Contact</td><td style="color:#111827">${updated.contractorName}</td></tr>` : ""}
              <tr><td style="color:#6b7280;padding:4px 0">Email</td><td style="color:#111827">${inv.contractorEmail}</td></tr>
              <tr><td style="color:#6b7280;padding:4px 0">Bid Amount</td><td style="font-weight:900;color:#92400e;font-size:16px">${fmt(bidAmount)}</td></tr>
              ${durationWeeks ? `<tr><td style="color:#6b7280;padding:4px 0">Duration</td><td style="color:#111827">${durationWeeks} weeks</td></tr>` : ""}
              ${startDate ? `<tr><td style="color:#6b7280;padding:4px 0">Start Date</td><td style="color:#111827">${startDate}</td></tr>` : ""}
              ${materialsIncluded ? `<tr><td style="color:#6b7280;padding:4px 0">Materials</td><td style="color:#111827">${materialsIncluded}</td></tr>` : ""}
            </table>
          </div>

          ${exclusions ? `<div style="background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:16px 20px;margin-bottom:16px"><p style="font-size:11px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin:0 0 6px">Exclusions / Clarifications</p><p style="font-size:13px;color:#374151;margin:0">${exclusions}</p></div>` : ""}
          ${notes ? `<div style="background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:16px 20px;margin-bottom:16px"><p style="font-size:11px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin:0 0 6px">Notes</p><p style="font-size:13px;color:#374151;margin:0">${notes}</p></div>` : ""}

          <a href="https://ibuildwell.com/projects/${inv.projectId}/preview/quote_package"
             style="display:inline-block;background:#d97706;color:white;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px">
            View Bid Comparison Board →
          </a>

          <hr style="border:none;border-top:1px solid #e7e5e4;margin:28px 0"/>
          <p style="color:#a8a29e;font-size:11px">Buildwell LLC · ibuildwell.com</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}
