import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyResetToken } from "@/lib/resetToken";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const { token, password } = schema.parse(await req.json());

    const email = verifyResetToken(token);
    if (!email) {
      return NextResponse.json({ error: "Reset link is invalid or has expired." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await db.user.update({ where: { email }, data: { password: hashed } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message ?? "Invalid input." }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
