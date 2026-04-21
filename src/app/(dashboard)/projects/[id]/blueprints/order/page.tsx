import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { ProjectAnswers } from "@/types";
import BlueprintOrderClient from "./BlueprintOrderClient";
import type { ArchitecturalData } from "./BlueprintOrderClient";

export default async function BlueprintOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!project) notFound();

  const answers = (project.answers ?? {}) as ProjectAnswers;

  // Pre-fill from existing project answers where possible
  const prefill: Partial<ArchitecturalData> = {
    city:        (answers.city       as string) || (answers.location as string) || "",
    state:       (answers.state      as string) || "",
    targetSqft:  String(answers.squareFootage ?? answers.squareFeet ?? ""),
    bedrooms:    String(answers.bedrooms        ?? ""),
    foundation:  (answers.foundation as string) || "",
    architecturalStyle: (answers.exteriorStyle as string) || "",
  };

  return (
    <BlueprintOrderClient
      projectId={id}
      projectName={project.name}
      prefill={prefill}
    />
  );
}
