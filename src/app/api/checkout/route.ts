import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const DOCUMENT_PACKAGES = {
  blueprint_set: {
    name: "Construction Planning Report",
    description: "Room schedule, structural summary, systems overview, material selections & code compliance checklist",
    price: 25000, // $250 in cents
  },
  material_list: {
    name: "Material List + Spec Sheet",
    description: "Itemized material list with quantities and per-trade spec sheets",
    price: 10000, // $100 in cents
  },
  quote_package: {
    name: "Contractor Bid Package",
    description: "Scope of work per trade, formatted bid request forms, and line-item cost breakdowns",
    price: 25000, // $250 in cents
  },
  spec_tier: {
    name: "Good / Better / Best Spec Report",
    description: "3-tier material options with brand examples, installed cost ranges, and warranty comparison",
    price: 7500, // $75 in cents
  },
  vendor_list: {
    name: "Preferred Vendor List",
    description: "3 local contractors per trade with phone, address, and rating — print-ready spreadsheet",
    price: 4000, // $40 in cents
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
    success_url: `https://ibuildwell.com/checkout/success?session_id={CHECKOUT_SESSION_ID}&project_id=${projectId}&package=${packageType}`,
    cancel_url: `https://ibuildwell.com/projects/${projectId}`,
    metadata: {
      projectId,
      packageType,
      userEmail: session.user.email,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
