import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

// ── POST /api/webhooks/blueprint-complete ──────────────────────────────────
// Receives a callback from the AI blueprint service when drawings are ready.
// Expected body: { orderId, files: [{name, url, format, size?}], externalOrderId? }
// Authenticated by BLUEPRINT_WEBHOOK_SECRET header.

export async function POST(req: Request) {
  const secret = req.headers.get("x-webhook-secret");
  if (!process.env.BLUEPRINT_WEBHOOK_SECRET || secret !== process.env.BLUEPRINT_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, files, externalOrderId } = await req.json() as {
    orderId: string;
    files: { name: string; url: string; format: string; size?: number }[];
    externalOrderId?: string;
  };

  const order = await db.blueprintOrder.findUnique({
    where: { id: orderId },
    include: { project: { select: { id: true, name: true, user: { select: { email: true } } } } },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  await db.blueprintOrder.update({
    where: { id: orderId },
    data: {
      status: "COMPLETE",
      files: files as import("@prisma/client").Prisma.InputJsonValue,
      completedAt: new Date(),
      ...(externalOrderId ? { externalOrderId } : {}),
    },
  });

  // Notify user
  if (order.project.user.email && process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Buildwell <noreply@ibuildwell.com>",
      to: order.project.user.email,
      subject: `Your Blueprints Are Ready — ${order.project.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fafaf9">
          <p style="font-size:22px;font-weight:900;color:#1c1917;margin:0 0 4px">Build<span style="color:#d97706">well</span></p>
          <p style="color:#a8a29e;font-size:12px;margin:0 0 28px">Blueprint Delivery</p>
          <p style="color:#374151;font-size:15px;margin:0 0 20px">
            Your <strong>${order.tier === "permit" ? "Permit-Ready" : "Spec-Grade"} Blueprint Set</strong> for <strong>${order.project.name}</strong> is ready.
          </p>
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

  return NextResponse.json({ ok: true });
}
