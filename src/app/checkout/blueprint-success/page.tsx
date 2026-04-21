import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";
import { db } from "@/lib/db";
import Link from "next/link";
import { Resend } from "resend";

interface Props {
  searchParams: Promise<{ session_id?: string; order_id?: string; project_id?: string }>;
}

export default async function BlueprintSuccessPage({ searchParams }: Props) {
  const { session_id, order_id, project_id } = await searchParams;
  if (!session_id || !order_id || !project_id) notFound();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.payment_status !== "paid") {
    redirect(`/projects/${project_id}/blueprints/order`);
  }

  const order = await db.blueprintOrder.findUnique({ where: { id: order_id } });
  if (!order || order.status !== "PENDING_PAYMENT") {
    // Already processed or doesn't exist
    return redirect(`/projects/${project_id}/preview/blueprint_set`);
  }

  // Mark as paid
  await db.blueprintOrder.update({
    where: { id: order_id },
    data: { status: "PAID", paidAt: new Date() },
  });

  // Notify admin with the order data so it can be submitted to the AI service
  if (process.env.RESEND_API_KEY && process.env.BLUEPRINT_ADMIN_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const archData = order.architecturalData as Record<string, unknown>;
    const summaryRows = Object.entries(archData)
      .filter(([, v]) => v && (typeof v === "string" ? v.length > 0 : (Array.isArray(v) ? v.length > 0 : true)))
      .map(([k, v]) => `<tr><td style="color:#6b7280;padding:3px 8px;font-size:12px">${k}</td><td style="color:#111827;padding:3px 8px;font-size:12px">${Array.isArray(v) ? (v as string[]).join(", ") : String(v)}</td></tr>`)
      .join("");

    await resend.emails.send({
      from: "Buildwell <noreply@ibuildwell.com>",
      to: process.env.BLUEPRINT_ADMIN_EMAIL,
      subject: `New Blueprint Order — ${order.tier.toUpperCase()} — Order ${order_id}`,
      html: `
        <div style="font-family:sans-serif;max-width:700px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 8px">New Blueprint Order</h2>
          <p style="color:#6b7280;font-size:14px">Order ID: <strong>${order_id}</strong> · Tier: <strong>${order.tier}</strong> · Project: <strong>${project_id}</strong></p>
          <p style="color:#6b7280;font-size:13px">Admin endpoint: <code>PATCH https://ibuildwell.com/api/blueprints/${order_id}</code></p>
          <hr style="margin:16px 0"/>
          <h3 style="margin:0 0 8px">Architectural Data</h3>
          <table style="border-collapse:collapse;width:100%">${summaryRows}</table>
          <hr style="margin:16px 0"/>
          <p style="font-size:12px;color:#9ca3af">Update order status by calling PATCH /api/blueprints/${order_id} with Authorization: Bearer {BLUEPRINT_ADMIN_SECRET}</p>
        </div>
      `,
    });
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-5">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-2xl font-black text-stone-900 mb-2">Order Confirmed!</p>
        <p className="text-stone-500 mb-6 leading-relaxed">
          Your {order.tier === "permit" ? "Permit-Ready" : "Spec-Grade"} Blueprint Set is in production.
          You&apos;ll receive an email with a download link when your blueprints are ready — typically {order.tier === "permit" ? "7–10" : "3–5"} business days.
        </p>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6 text-left space-y-2 text-sm">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">What Happens Next</p>
          {[
            { step: "1", label: "Design review", detail: "Our team reviews your specifications for completeness and flags any issues." },
            { step: "2", label: order.tier === "permit" ? "AI generation + architect review" : "AI generation", detail: order.tier === "permit" ? "AI generates the full document set; a licensed architect in your state reviews and stamps each sheet." : "AI generates floor plans, elevations, sections, and site plan from your specifications." },
            { step: "3", label: "Delivery", detail: "You'll receive an email with download links for PDF and DWG files." },
          ].map(item => (
            <div key={item.step} className="flex gap-3">
              <span className="bg-amber-100 text-amber-700 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{item.step}</span>
              <div>
                <p className="font-semibold text-stone-800">{item.label}</p>
                <p className="text-stone-500 text-xs">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-stone-400 mb-6">
          Order reference: <span className="font-mono text-stone-600">{order_id}</span>
        </p>

        <Link href={`/projects/${project_id}`}>
          <button className="bg-stone-900 hover:bg-stone-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
            Back to Project →
          </button>
        </Link>
      </div>
    </div>
  );
}
