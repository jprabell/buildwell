import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await db.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await db.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { name, structureType, answers, skipSnapshot } = await req.json() as {
    name: string;
    structureType: string;
    answers: Record<string, unknown>;
    skipSnapshot?: boolean;
  };

  // Preserve existing _purchases when updating answers
  const existingAnswers = (existing.answers ?? {}) as Record<string, unknown>;
  const updatedAnswers = {
    ...answers,
    _purchases: existingAnswers._purchases ?? [],
  };

  // Snapshot current state as a new version (unless caller opts out)
  if (!skipSnapshot) {
    const versionCount = await db.projectVersion.count({ where: { projectId: id } });
    await db.projectVersion.create({
      data: {
        projectId: id,
        version: versionCount + 1,
        name: existing.name,
        answers: existing.answers ?? {},
      },
    });
  }

  const project = await db.project.update({
    where: { id },
    data: { name, structureType: structureType as never, answers: updatedAnswers },
  });

  return NextResponse.json(project);
}
