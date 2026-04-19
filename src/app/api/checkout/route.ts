import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const DOCUMENT_PACKAGES = {
  blueprint_set: {
    name: "Full Blueprint Set",
    description: "Floor plan, elevations, framing, roofing, plumbing, electrical & HVAC",
    price: 200000, // $2,000 in cents
  },
  material_list: {
    name: "Material List + Spec Sheet",
    description: "Itemized material list with quantities and per-trade spec sheets",
    price: 25000, // $250 in cents
  },
  quote_package: {
    name: "Quote Package + Bid Documents",
    description: "Formatted quote docs with vendor pricing and trade bid documents",
    price: 25000, // $250 in cents
  },
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { packageType, projectId } = await req.json();
  const pkg = DOCUMENT_PACKAGES[packageType as keyof typeof DOCUMENT_PACKAGES];

  if (!pkg) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: pkg.name,
            description: pkg.description,
          },
          unit_amount: pkg.price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&project_id=${projectId}&package=${packageType}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/projects/${projectId}`,
    metadata: {
      projectId,
      packageType,
      userEmail: session.user.email,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
