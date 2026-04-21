import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { getBidSpecs } from "@/lib/bidPackageSpecs";
import { ProjectAnswers } from "@/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await db.project.findFirst({ where: { id, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const {
    contractorEmail,
    contractorName,
    tradeName,
    tradeDescription,
    tradeCategory,
    budgetLow,
    budgetHigh,
    licenseNote,
  } = await req.json() as {
    contractorEmail: string;
    contractorName?: string;
    tradeName: string;
    tradeDescription: string;
    tradeCategory: string;
    budgetLow: number;
    budgetHigh: number;
    licenseNote: string;
  };

  if (!contractorEmail || !tradeName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const specs = getBidSpecs(tradeName, answers, project.structureType);

  // Create a BidInvitation record and get a unique portal token
  const invitation = await db.bidInvitation.create({
    data: {
      projectId: id,
      tradeName,
      tradeDescription,
      tradeCategory,
      budgetLow,
      budgetHigh,
      licenseNote,
      contractorEmail,
      contractorName: contractorName || null,
    },
  });
  const portalUrl = `https://ibuildwell.com/bid/${invitation.token}`;

  function fmtMoney(n: number) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  const specsHtml = specs.length
    ? specs.map(s => `<li style="margin:4px 0;color:#374151;font-size:13px">${s}</li>`).join("")
    : "";

  const bidFields = [
    "Contractor Company Name",
    "License Number",
    "Insurance Cert / Exp Date",
    "Base Bid Amount ($)",
    "Alternate / Allowance Items ($)",
    "Estimated Start Date",
    "Estimated Duration (weeks)",
    "Key Subcontractors (if any)",
  ];

  const bidFormHtml = bidFields
    .map(f => `
      <div style="margin-bottom:14px">
        <p style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af;margin:0 0 4px">${f}</p>
        <div style="border-bottom:1px solid #d1d5db;height:22px;width:100%"></div>
      </div>`)
    .join("");

  const greeting = contractorName ? `Hi ${contractorName},` : "Hello,";

  const html = `
    <div style="font-family:sans-serif;max-width:620px;margin:0 auto;padding:32px 24px;background:#fafaf9">
      <p style="font-size:22px;font-weight:900;color:#1c1917;margin:0 0 4px">
        Build<span style="color:#d97706">well</span>
      </p>
      <p style="color:#a8a29e;font-size:12px;margin:0 0 28px">Contractor Bid Request · ibuildwell.com</p>

      <p style="color:#374151;font-size:15px;margin:0 0 20px">${greeting}</p>
      <p style="color:#374151;font-size:15px;margin:0 0 28px">
        We are soliciting bids for the <strong>${tradeName}</strong> scope of work on the project below.
        Please review the specifications and complete the bid form at the bottom of this email.
      </p>

      <!-- Project summary -->
      <div style="background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:18px 20px;margin-bottom:24px">
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#a8a29e;margin:0 0 10px">Project Details</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <tr>
            <td style="padding:4px 0;color:#6b7280;width:120px">Project</td>
            <td style="padding:4px 0;color:#111827;font-weight:600">${project.name}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#6b7280">Trade</td>
            <td style="padding:4px 0;color:#111827;font-weight:600">${tradeName}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#6b7280">Category</td>
            <td style="padding:4px 0;color:#111827">${tradeCategory}</td>
          </tr>
          ${budgetLow > 0 ? `<tr>
            <td style="padding:4px 0;color:#6b7280">Budget Range</td>
            <td style="padding:4px 0;color:#92400e;font-weight:700">${fmtMoney(budgetLow)} – ${fmtMoney(budgetHigh)}</td>
          </tr>` : ""}
        </table>
      </div>

      <!-- Scope -->
      <div style="background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:18px 20px;margin-bottom:24px">
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#a8a29e;margin:0 0 8px">Scope of Work</p>
        <p style="color:#374151;font-size:14px;line-height:1.6;margin:0">${tradeDescription}</p>
      </div>

      ${specsHtml ? `
      <!-- Specs -->
      <div style="background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:18px 20px;margin-bottom:24px">
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#a8a29e;margin:0 0 8px">Specified Materials &amp; Standards</p>
        <ul style="margin:0;padding-left:18px">${specsHtml}</ul>
      </div>` : ""}

      <!-- License note -->
      <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:10px;padding:12px 16px;margin-bottom:24px">
        <p style="font-size:12px;font-weight:700;color:#92400e;margin:0">⚠️ Licensing: ${licenseNote}</p>
      </div>

      <!-- Bid form -->
      <div style="background:#fff;border:2px solid #d97706;border-radius:12px;padding:20px 24px;margin-bottom:24px">
        <p style="font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:#1c1917;margin:0 0 16px">Bid Response Form</p>
        ${bidFormHtml}
        <div style="margin-top:18px;padding-top:14px;border-top:1px solid #e7e5e4">
          <p style="font-size:11px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin:0 0 6px">Materials Included?</p>
          <p style="font-size:12px;color:#6b7280;margin:0">☐ All materials included &nbsp;&nbsp; ☐ Labor only &nbsp;&nbsp; ☐ Partial (explain in exclusions)</p>
        </div>
        <div style="margin-top:14px">
          <p style="font-size:11px;font-weight:700;text-transform:uppercase;color:#9ca3af;margin:0 0 6px">Exclusions / Clarifications</p>
          <div style="border-bottom:1px solid #d1d5db;height:22px;width:100%"></div>
          <div style="border-bottom:1px solid #d1d5db;height:22px;width:100%;margin-top:8px"></div>
        </div>
      </div>

      <p style="color:#374151;font-size:14px;margin:0 0 20px">
        Please return this completed form by replying to this email. We are accepting bids from at least 3 qualified contractors for this scope.
      </p>

      <!-- Portal CTA -->
      <div style="background:#fff;border:2px solid #d97706;border-radius:12px;padding:16px 20px;margin-bottom:24px;text-align:center">
        <p style="font-size:13px;color:#374151;margin:0 0 12px">
          Use your personal portal to view scope details and submit your bid digitally — no email reply needed.
        </p>
        <a href="${portalUrl}" style="display:inline-block;background:#d97706;color:white;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px">
          Open Your Bid Portal →
        </a>
        <p style="font-size:11px;color:#a8a29e;margin:10px 0 0">Or reply to this email with your completed form below.</p>
      </div>

      <hr style="border:none;border-top:1px solid #e7e5e4;margin:32px 0"/>
      <p style="color:#a8a29e;font-size:11px">Buildwell LLC · ibuildwell.com · This bid request was generated by Buildwell's automated project management platform.</p>
    </div>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: "Buildwell <noreply@ibuildwell.com>",
    to: contractorEmail,
    subject: `Bid Request: ${tradeName} — ${project.name}`,
    html,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: result.data?.id, portalUrl, token: invitation.token });
}
