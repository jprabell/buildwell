import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ id: string; versionId: string }> };

// DELETE /api/projects/[id]/versions/[versionId]
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id, versionId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify project ownership
  const project = await db.project.findFirst({ where: { id, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.projectVersion.deleteMany({ where: { id: versionId, projectId: id } });
  return NextResponse.json({ ok: true });
}

// PATCH /api/projects/[id]/versions/[versionId] — restore this version as current
export async function PATCH(_req: Request, { params }: Ctx) {
  const { id, versionId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await db.project.findFirst({ where: { id, userId: session.user.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const version = await db.projectVersion.findFirst({ where: { id: versionId, projectId: id } });
  if (!version) return NextResponse.json({ error: "Version not found" }, { status: 404 });

  // Snapshot the CURRENT state first before restoring
  const versionCount = await db.projectVersion.count({ where: { projectId: id } });
  await db.projectVersion.create({
    data: {
      projectId: id,
      version: versionCount + 1,
      name: project.name,
      answers: project.answers ?? {},
    },
  });

  // Restore the selected version's answers (preserve _purchases from current)
  const currentAnswers = (project.answers ?? {}) as Record<string, unknown>;
  const restoredAnswers = {
    ...((version.answers ?? {}) as Record<string, unknown>),
    _purchases: currentAnswers._purchases ?? [],
  };

  const updated = await db.project.update({
    where: { id },
    data: { name: version.name, answers: restoredAnswers },
  });

  return NextResponse.json(updated);
}
