import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { STRUCTURE_OPTIONS } from "@/lib/structures";
import Button from "@/components/ui/Button";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!project) notFound();

  const structure = STRUCTURE_OPTIONS.find((s) => s.value === project.structureType);
  const answers = project.answers as Record<string, unknown>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-slate-900">
            Build<span className="text-amber-600">well</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">← Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{structure?.icon}</span>
            <div>
              <h1 className="text-3xl font-black text-slate-900">{project.name}</h1>
              <p className="text-slate-500">{structure?.label}</p>
            </div>
          </div>
          <span
            className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
              project.status === "COMPLETE"
                ? "bg-green-100 text-green-700"
                : project.status === "IN_PROGRESS"
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {project.status === "COMPLETE"
              ? "Complete"
              : project.status === "IN_PROGRESS"
              ? "In Progress"
              : "Draft"}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Project Summary */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Project Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(answers)
                  .filter(([, v]) => v !== "" && v !== null && v !== undefined)
                  .map(([key, value]) => {
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase());
                    const display = Array.isArray(value)
                      ? (value as string[]).join(", ")
                      : String(value);
                    return (
                      <div key={key} className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                          {label}
                        </p>
                        <p className="text-sm font-medium text-slate-800">{display}</p>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Documents section — placeholder for Phase 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Documents</h2>
              <p className="text-slate-400 text-sm mb-6">
                Your material list, spec sheets, and quote-ready documents will be generated here.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "📋", title: "Bill of Materials", status: "Coming soon" },
                  { icon: "📄", title: "Spec Sheets", status: "Coming soon" },
                  { icon: "💰", title: "Quote Package", status: "Coming soon" },
                  { icon: "🏗️", title: "Framing Summary", status: "Coming soon" },
                ].map((doc) => (
                  <div
                    key={doc.title}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <span className="text-2xl">{doc.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{doc.title}</p>
                      <p className="text-xs text-slate-400">{doc.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Actions</h3>
              <div className="flex flex-col gap-2">
                <Link href={`/design?edit=${project.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Answers
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="w-full opacity-50 cursor-not-allowed" disabled>
                  Download BOM (soon)
                </Button>
                <Button variant="ghost" size="sm" className="w-full opacity-50 cursor-not-allowed" disabled>
                  Download Quote Pkg (soon)
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-800 mb-1">Document Generation</p>
              <p className="text-xs text-amber-600 leading-relaxed">
                Full Bill of Materials, spec sheets, and quote packages are coming in the next phase.
                Your project answers are saved and ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
