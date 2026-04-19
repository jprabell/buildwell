import { redirect } from "next/navigation";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import Stripe from "stripe";
import Link from "next/link";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

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
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/dashboard");

  // Verify payment with Stripe — all user/project info comes from Stripe metadata
  // This does NOT require the browser session cookie to be present
  const stripeSession = await stripe.checkout.sessions.retrieve(session_id);
  if (stripeSession.payment_status !== "paid") redirect("/dashboard");

  const userEmail = stripeSession.metadata?.userEmail;
  const projectId = stripeSession.metadata?.projectId;
  const packageType = stripeSession.metadata?.packageType;

  if (!userEmail || !projectId || !packageType) redirect("/dashboard");

  // Find user by email from Stripe metadata
  const user = await db.user.findUnique({ where: { email: userEmail } });
  if (!user) redirect("/dashboard");

  // Record the purchase
  const project = await db.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) redirect("/dashboard");

  const currentAnswers = (project.answers as Record<string, unknown>) || {};
  const currentPurchases = (currentAnswers._purchases as string[]) || [];
  const isNewPurchase = !currentPurchases.includes(packageType);

  if (isNewPurchase) {
    await db.project.update({
      where: { id: projectId },
      data: {
        answers: {
          ...currentAnswers,
          _purchases: [...currentPurchases, packageType],
        },
      },
    });
  }

  const packageLabel = PACKAGE_LABELS[packageType] || packageType;

  // Send confirmation email on new purchases only
  if (isNewPurchase) {
    const projectUrl = `https://ibuildwell.com/projects/${projectId}`;
    await resend.emails
      .send({
        from: "Buildwell <noreply@ibuildwell.com>",
        to: userEmail,
        subject: `Your Buildwell document is ready: ${packageLabel}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fafaf9">
            <h1 style="font-size:24px;font-weight:900;color:#1c1917;margin-bottom:4px">Payment confirmed ✓</h1>
            <p style="color:#78716c;margin-bottom:24px;font-size:15px">
              Thank you for your purchase. Your document is ready to view.
            </p>
            <div style="background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:20px 24px;margin-bottom:24px">
              <p style="color:#a8a29e;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin:0 0 4px">Document purchased</p>
              <p style="color:#92400e;font-size:17px;font-weight:800;margin:0">${packageLabel}</p>
            </div>
            <a href="${projectUrl}" style="display:inline-block;background:#d97706;color:white;font-weight:700;padding:13px 32px;border-radius:10px;text-decoration:none;font-size:15px">
              View My Document →
            </a>
            <p style="color:#a8a29e;font-size:12px;margin-top:32px">Your document is always accessible from your project page.</p>
            <hr style="border:none;border-top:1px solid #e7e5e4;margin:24px 0"/>
            <p style="color:#a8a29e;font-size:11px">Buildwell LLC · ibuildwell.com</p>
          </div>
        `,
      })
      .catch(() => {});
  }

  // Check if the browser session is active (optional — only affects the button label)
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  const token = await getToken({
    req: { headers: { cookie: cookieHeader } } as Parameters<typeof getToken>[0]["req"],
    secret: process.env.NEXTAUTH_SECRET!,
  }).catch(() => null);

  const isLoggedIn = !!token?.id;
  const projectPath = `/projects/${projectId}`;

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-12 max-w-md w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-black text-stone-900 mb-3">Payment Successful!</h1>
        <p className="text-stone-500 mb-2">You&apos;ve unlocked:</p>
        <p className="text-xl font-bold text-amber-700 mb-6">{packageLabel}</p>
        <p className="text-stone-400 text-sm mb-8 leading-relaxed">
          Your document is ready. Access it any time from your project page.
        </p>
        <Link href={isLoggedIn ? projectPath : `/login?callbackUrl=${encodeURIComponent(projectPath)}`}>
          <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-2xl transition-colors text-lg">
            {isLoggedIn ? "View My Project →" : "Sign In to View Project →"}
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
