import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProjectAnswers } from "@/types";
import {
  buildFloorPlanPrompt,
  startApifyFloorPlanRun,
  checkApifyFloorPlanRun,
  AIFloorPlanResult,
} from "@/lib/apifyFloorPlan";
import { generatePlanningReport } from "@/lib/planningReport";
import { STRUCTURE_OPTIONS } from "@/lib/structures";

// Storage shape on project.answers._aiFloorPlan
interface AIFloorPlanState {
  status: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | string;
  runId?: string;
  startedAt?: string;
  prompt?: string;
  result?: AIFloorPlanResult;
  error?: string;
}

async function loadProject(id: string, userId: string) {
  return db.project.findFirst({ where: { id, userId } });
}

/**
 * POST — start a new AI floor plan generation run.
 * Returns immediately with the runId. Client polls GET to check status.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.APIFY_API_TOKEN) {
    return NextResponse.json(
      { error: "AI floor plan generation is not configured. APIFY_API_TOKEN missing." },
      { status: 503 },
    );
  }

  const project = await loadProject(id, session.user.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const structure = STRUCTURE_OPTIONS.find((s) => s.value === project.structureType);
  const report = generatePlanningReport(
    answers,
    project.structureType,
    structure?.label ?? project.structureType,
    project.name,
  );

  const totalSqft =
    report.squareFootage > 0
      ? report.squareFootage
      : report.rooms.reduce((s, r) => s + r.sqft, 0);

  const prompt = buildFloorPlanPrompt(answers, project.structureType, totalSqft);

  let runInfo;
  try {
    runInfo = await startApifyFloorPlanRun(prompt);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to start AI floor plan: ${message}` }, { status: 502 });
  }

  const state: AIFloorPlanState = {
    status: "RUNNING",
    runId: runInfo.runId,
    startedAt: new Date().toISOString(),
    prompt,
  };

  // Persist the in-flight run to project.answers._aiFloorPlan
  const newAnswers = { ...answers, _aiFloorPlan: state };
  await db.project.update({
    where: { id: project.id },
    data: { answers: newAnswers as object },
  });

  return NextResponse.json({ ok: true, status: state.status, runId: state.runId });
}

/**
 * GET — check the current AI floor plan state for this project.
 * If a run is in progress, polls Apify; if it just finished, persists the
 * result to project.answers._aiFloorPlan.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await loadProject(id, session.user.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const state = (answers._aiFloorPlan as unknown as AIFloorPlanState | undefined) ?? null;

  if (!state) return NextResponse.json({ status: "NONE" });

  // Already finished — return cached result
  if (state.status === "SUCCEEDED" && state.result) {
    return NextResponse.json({ status: "SUCCEEDED", result: state.result });
  }
  if (state.status === "FAILED") {
    return NextResponse.json({ status: "FAILED", error: state.error });
  }

  // Otherwise poll Apify for the latest status
  if (!state.runId) {
    return NextResponse.json({ status: state.status ?? "UNKNOWN" });
  }

  if (!process.env.APIFY_API_TOKEN) {
    return NextResponse.json({ status: state.status, error: "APIFY_API_TOKEN missing" });
  }

  let check;
  try {
    check = await checkApifyFloorPlanRun(state.runId);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ status: "RUNNING", error: `Poll failed: ${message}` });
  }

  // Persist whatever we got
  const updated: AIFloorPlanState = {
    ...state,
    status: check.status,
    result: check.result ?? state.result,
    error: check.error,
  };

  await db.project.update({
    where: { id: project.id },
    data: { answers: { ...answers, _aiFloorPlan: updated } as object },
  });

  if (check.status === "SUCCEEDED" && check.result) {
    return NextResponse.json({ status: "SUCCEEDED", result: check.result });
  }
  if (check.status === "FAILED" || check.status === "TIMED-OUT" || check.status === "ABORTED") {
    return NextResponse.json({ status: check.status, error: check.error });
  }
  return NextResponse.json({ status: check.status });
}

/**
 * DELETE — clear any cached AI floor plan for this project (force regenerate).
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await loadProject(id, session.user.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const newAnswers = { ...answers };
  delete (newAnswers as Record<string, unknown>)._aiFloorPlan;

  await db.project.update({
    where: { id: project.id },
    data: { answers: newAnswers as object },
  });

  return NextResponse.json({ ok: true });
}
