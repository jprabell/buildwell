import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

// ── PATCH /api/blueprints/[orderId] ────────────────────────────────────────
// Used by admin or AI service webhook to update order status + upload files.
// Protected by a shared secret in the Authorization header.
//
// Body: { status?: "PROCESSING"|"COMPLETE"|"FAILED", files?: {name,url,format,size?}[], externalOrderId?: string }

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  // Simple shared-secret auth for admin/webhook calls
  const auth = req.headers.get("Authorization");
  const expected = `Bearer ${process.env.BLUEPRINT_ADMIN_SECRET}`;
  if (!process.env.BLUEPRINT_ADMIN_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await db.blueprintOrder.findUnique({
    where: { id: orderId },
    include: { project: { select: { id: true, name: true, user: { select: { email: true } } } } },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { status, files, externalOrderId } = await req.json() as {
    status?: "PROCESSING" | "COMPLETE" | "FAILED";
    files?: { name: string; url: string; format: string; size?: number }[];
    externalOrderId?: string;
  };

  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (files)  updateData.files = files;
  if (externalOrderId) updateData.externalOrderId = externalOrderId;
  if (status === "PROCESSING") updateData.submittedAt = new Date();
  if (status === "COMPLETE")   updateData.completedAt  = new Date();

  const updated = await db.blueprintOrder.update({
    where: { id: orderId },
    data: updateData,
  });

  // Notify user when blueprints are ready
  if (status === "COMPLETE" && order.project.user.email && process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Buildwell <noreply@ibuildwell.com>",
      to: order.project.user.email,
      subject: `Your Blueprints Are Ready — ${order.project.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fafaf9">
          <p style="font-size:22px;font-weight:900;color:#1c1917;margin:0 0 4px">
            Build<span style="color:#d97706">well</span>
          </p>
          <p style="color:#a8a29e;font-size:12px;margin:0 0 28px">Blueprint Delivery · ibuildwell.com</p>

          <p style="color:#374151;font-size:15px;margin:0 0 16px">Great news — your blueprint set for <strong>${order.project.name}</strong> is ready for download.</p>

          <div style="background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:16px 20px;margin-bottom:24px">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;color:#a8a29e;margin:0 0 10px">Files Included</p>
            ${(files ?? []).map(f => `<p style="font-size:13px;color:#374151;margin:0 0 4px">▸ ${f.name} (${f.format.toUpperCase()})</p>`).join("")}
          </div>

          <a href="https://ibuildwell.com/projects/${order.project.id}/preview/blueprint_set"
             style="display:inline-block;background:#d97706;color:white;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px">
            Download Your Blueprints →
          </a>

          <hr style="border:none;border-top:1px solid #e7e5e4;margin:28px 0"/>
          <p style="color:#a8a29e;font-size:11px">Buildwell LLC · ibuildwell.com</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true, order: updated });
}

// ── GET /api/blueprints/[orderId] — public status check ───────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const order = await db.blueprintOrder.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    status: order.status,
    tier: order.tier,
    files: order.files,
    completedAt: order.completedAt,
  });
}
