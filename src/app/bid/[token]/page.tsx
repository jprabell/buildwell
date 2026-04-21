import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getBidSpecs } from "@/lib/bidPackageSpecs";
import { ProjectAnswers } from "@/types";
import BidPortalClient from "./BidPortalClient";

export default async function BidPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const inv = await db.bidInvitation.findUnique({
    where: { token },
    include: { project: { select: { name: true, structureType: true, answers: true } } },
  });

  if (!inv) notFound();

  const answers = (inv.project.answers ?? {}) as ProjectAnswers;
  const specs = getBidSpecs(inv.tradeName, answers, inv.project.structureType);

  return (
    <BidPortalClient
      token={token}
      projectName={inv.project.name}
      contractorName={inv.contractorName}
      tradeName={inv.tradeName}
      tradeDescription={inv.tradeDescription}
      tradeCategory={inv.tradeCategory}
      budgetLow={inv.budgetLow}
      budgetHigh={inv.budgetHigh}
      licenseNote={inv.licenseNote}
      specs={specs}
      alreadySubmitted={!!inv.submittedAt}
    />
  );
}
