import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createResetToken } from "@/lib/resetToken";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const { email } = schema.parse(await req.json());

    const user = await db.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ ok: true });

    const token = createResetToken(email);
    const resetUrl = `${process.env.NEXTAUTH_URL ?? "https://ibuildwell.com"}/reset-password?token=${token}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Buildwell <noreply@ibuildwell.com>",
      to: email,
      subject: "Reset your Buildwell password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <h1 style="font-size:24px;font-weight:900;color:#1c1917;margin-bottom:8px">
            Reset your password
          </h1>
          <p style="color:#78716c;margin-bottom:24px">
            We received a request to reset the password for your Buildwell account.
            Click the button below to choose a new password. This link expires in 1 hour.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block;background:#d97706;color:white;font-weight:700;
                    padding:12px 28px;border-radius:10px;text-decoration:none;font-size:15px">
            Reset Password
          </a>
          <p style="color:#a8a29e;font-size:12px;margin-top:32px">
            If you didn't request this, you can safely ignore this email.
            Your password won't change.
          </p>
          <hr style="border:none;border-top:1px solid #e7e5e4;margin:24px 0"/>
          <p style="color:#a8a29e;font-size:11px">
            Buildwell LLC · ibuildwell.com
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
