import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateFloorPlanDXF } from "@/lib/floorPlanGenerator";
import { ProjectAnswers } from "@/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await db.project.findUnique({ where: { id } });
  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const purchases = (answers._purchases as string[] | undefined) ?? [];
  const isDraft = !purchases.includes("blueprint_set");

  const dxf = generateFloorPlanDXF(answers, project.structureType, project.name, isDraft);
  const suffix = isDraft ? "_DRAFT" : "";
  const filename = `${project.name.replace(/[^a-z0-9]/gi, "_")}_floor_plan${suffix}.dxf`;

  return new Response(dxf, {
    headers: {
      "Content-Type": "application/dxf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
