import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await db.project.findFirst({ where: { id, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { quotes, contractorNames } = await req.json();

  const currentAnswers = (project.answers as Record<string, unknown>) || {};
  await db.project.update({
    where: { id },
    data: {
      answers: {
        ...currentAnswers,
        _quotes: quotes,
        _contractorNames: contractorNames,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
