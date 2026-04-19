import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateMaterials } from "@/lib/materialCalculator";
import { ProjectAnswers } from "@/types";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await db.project.findUnique({
    where: { id: params.id },
  });

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const answers = (project.answers ?? {}) as ProjectAnswers;
  const purchases = (answers._purchases as string[] | undefined) ?? [];

  if (!purchases.includes("material_list")) {
    return NextResponse.json(
      { error: "Material list not purchased for this project." },
      { status: 403 }
    );
  }

  const result = calculateMaterials(answers, project.structureType, project.name);

  return NextResponse.json(result);
}
