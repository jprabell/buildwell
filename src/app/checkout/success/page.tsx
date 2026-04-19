import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Stripe from "stripe";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PACKAGE_LABELS: Record<string, string> = {
  blueprint_set: "Construction Planning Report",
  material_list: "Material List + Spec Sheet",
  quote_package: "Contractor Bid Package",
  spec_tier: "Good / Better / Best Spec Report",
  vendor_list: "Preferred Vendor List",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; project_id?: string; package?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { session_id, project_id, package: packageType } = searchParams;

  if (!session_id || !project_id || !packageType) redirect("/dashboard");

  // Verify the Stripe session
  const stripeSession = await stripe.checkout.sessions.retrieve(session_id);
  if (stripeSession.payment_status !== "paid") redirect("/dashboard");

  // Mark the package as purchased in the project answers
  const project = await db.project.findFirst({
    where: { id: project_id, userId: session.user.id },
  });

  if (!project) redirect("/dashboard");

  const currentAnswers = (project.answers as Record<string, unknown>) || {};
  const currentPurchases = (currentAnswers._purchases as string[]) || [];

  if (!currentPurchases.includes(packageType)) {
    await db.project.update({
      where: { id: project_id },
      data: {
        answers: {
          ...currentAnswers,
          _purchases: [...currentPurchases, packageType],
        },
      },
    });
  }

  const packageLabel = PACKAGE_LABELS[packageType] || packageType;

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-12 max-w-md w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-black text-stone-900 mb-3">Payment Successful!</h1>
        <p className="text-stone-500 mb-2">You've unlocked:</p>
        <p className="text-xl font-bold text-amber-700 mb-6">{packageLabel}</p>
        <p className="text-stone-400 text-sm mb-8 leading-relaxed">
          Your documents are being prepared. You can view and download them from your project page.
          Full documents will be available shortly.
        </p>
        <Link href={`/projects/${project_id}`}>
          <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-2xl transition-colors text-lg">
            View My Project →
          </button>
        </Link>
        <Link href="/dashboard">
          <p className="text-stone-400 text-sm mt-4 hover:text-stone-600 cursor-pointer transition-colors">
            Go to Dashboard
          </p>
        </Link>
      </div>
    </div>
  );
}
