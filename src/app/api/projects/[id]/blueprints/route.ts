import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Stripe from "stripe";

const BLUEPRINT_PRICES: Record<string, { name: string; description: string; price: number }> = {
  spec: {
    name: "Spec-Grade Blueprint Set",
    description: "Full construction document set — floor plans, elevations, sections, site plan, title sheet. AI-generated, PDF + DWG. Delivered in 3–5 business days.",
    price: 69900, // $699
  },
  permit: {
    name: "Permit-Ready Blueprint Set",
    description: "Full construction document set + licensed architect review, state-specific stamp, and code compliance verification. One revision included. Delivered in 7–10 business days.",
    price: 149900, // $1,499
  },
};

// ── GET /api/projects/[id]/blueprints — latest order for this project ──────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await db.project.findFirst({ where: { id, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const order = await db.blueprintOrder.findFirst({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ order });
}

// ── POST /api/projects/[id]/blueprints — create order + Stripe checkout ───
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await db.project.findFirst({ where: { id, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { architecturalData, tier } = await req.json() as {
    architecturalData: Record<string, unknown>;
    tier: "spec" | "permit";
  };

  const tierConfig = BLUEPRINT_PRICES[tier];
  if (!tierConfig) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  // Create the order record first (PENDING_PAYMENT)
  const order = await db.blueprintOrder.create({
    data: {
      projectId: id,
      tier,
      architecturalData: architecturalData as import("@prisma/client").Prisma.InputJsonValue,
      status: "PENDING_PAYMENT",
    },
  });

  // Create Stripe checkout session
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: tierConfig.name, description: tierConfig.description },
        unit_amount: tierConfig.price,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `https://ibuildwell.com/checkout/blueprint-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}&project_id=${id}`,
    cancel_url: `https://ibuildwell.com/projects/${id}/blueprints/order`,
    metadata: {
      blueprintOrderId: order.id,
      projectId: id,
      tier,
      userEmail: session.user.email,
    },
  });

  // Attach Stripe session ID to the order
  await db.blueprintOrder.update({
    where: { id: order.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return NextResponse.json({ url: checkoutSession.url, orderId: order.id });
}
