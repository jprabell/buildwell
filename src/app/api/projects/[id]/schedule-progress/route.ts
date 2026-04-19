import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * PATCH /api/projects/[id]/schedule-progress
 * Body: { taskId: string; completed: boolean }
 *
 * Merges a single task completion toggle into answers._scheduleProgress
 * without touching any other answers fields.
 */
export async function PATCH(
  req: Request,
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

  const { taskId, completed } = await req.json();
  if (typeof taskId !== "string" || typeof completed !== "boolean") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const existing = (project.answers ?? {}) as Record<string, unknown>;
  const prev = (existing._scheduleProgress ?? {}) as Record<string, boolean>;

  const updated = await db.project.update({
    where: { id },
    data: {
      answers: {
        ...existing,
        _scheduleProgress: { ...prev, [taskId]: completed },
      },
    },
  });

  return NextResponse.json({ ok: true, progress: (updated.answers as Record<string, unknown>)._scheduleProgress });
}
