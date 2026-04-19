import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { STRUCTURE_OPTIONS } from "@/lib/structures";
import Button from "@/components/ui/Button";
import PackagesSection from "@/components/ui/PackagesSection";

const PACKAGES = [
  {
    id: "blueprint_set",
    icon: "📐",
    title: "Construction Planning Report",
    price: "$250",
    priceNum: 250,
    badge: "Most Complete",
    includes: [
      "Room schedule with dimensions",
      "Foundation & framing summary",
      "Roof & structural notes",
      "Systems overview (plumbing, electrical, HVAC)",
      "Material selections & specs",
      "Code compliance checklist",
    ],
  },
  {
    id: "material_list",
    icon: "📋",
    title: "Material & Specification List",
    price: "$100",
    priceNum: 100,
    badge: null,
    includes: [
      "Full itemized material list",
      "Quantities & unit specifications",
      "Per-trade spec sheets",
      "Framing, roofing & insulation",
      "Windows, doors & finishes",
      "Ready for supplier ordering",
    ],
  },
  {
    id: "quote_package",
    icon: "💼",
    title: "Contractor Bid Package",
    price: "$250",
    priceNum: 250,
    badge: null,
    includes: [
      "Scope of work per trade",
      "Formatted bid request forms",
      "Line-item cost breakdowns",
      "Framing, electrical & plumbing",
      "HVAC & roofing bid sheets",
      "Ready to send to contractors",
    ],
  },
  {
    id: "spec_tier",
    icon: "⭐",
    title: "Good / Better / Best Spec Report",
    price: "$75",
    priceNum: 75,
    badge: null,
    includes: [
      "3-tier verified material options",
      "Brand examples per category",
      "Installed cost ranges per tier",
      "Warranty comparison by product",
      "Framing, insulation & windows",
      "HVAC, flooring, cabinets & more",
    ],
  },
  {
    id: "vendor_list",
    icon: "📞",
    title: "Preferred Vendor List",
    price: "$40",
    priceNum: 40,
    badge: null,
    includes: [
      "3 local contractors per trade",
      "Phone & address per listing",
      "Google rating & review count",
      "All trades in build sequence",
      "Notes section per trade",
      "Print-ready procurement doc",
    ],
  },
  {
    id: "construction_schedule",
    icon: "📅",
    title: "Construction Schedule",
    price: "$140",
    priceNum: 140,
    badge: "Interactive",
    includes: [
      "Phase-by-phase build sequence",
      "Critical path tasks highlighted",
      "Duration estimates per task",
      "Dependency tracking between tasks",
      "Check off tasks as you progress",
      "Live progress bar & completion %",
    ],
  },
];

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) notFound();

  const structure = STRUCTURE_OPTIONS.find((s) => s.value === project.structureType);
  const answers = project.answers as Record<string, unknown>;
  const purchases = (answers._purchases as string[]) || [];

  const displayAnswers = Object.entries(answers).filter(
    ([key, v]) => !key.startsWith("_") && v !== "" && v !== null && v !== undefined
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-stone-900">
            Build<span className="text-amber-600">well</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">← Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-4">
            {structure?.image ? (
              <img src={structure.image} alt={structure.label} className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <span className="text-5xl">{structure?.icon}</span>
            )}
            <div>
              <h1 className="text-3xl font-black text-stone-900">{project.name}</h1>
              <p className="text-stone-500">{structure?.label} · {structure?.costNote}</p>
            </div>
          </div>
          <span
            className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
              project.status === "COMPLETE"
                ? "bg-green-100 text-green-700"
                : project.status === "IN_PROGRESS"
                ? "bg-amber-100 text-amber-700"
                : "bg-stone-100 text-stone-500"
            }`}
          >
            {project.status === "COMPLETE" ? "Complete" : project.status === "IN_PROGRESS" ? "In Progress" : "Draft"}
          </span>
        </div>

        {/* Project Summary */}
        {displayAnswers.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">Project Summary</h2>
              <Link href={`/design?edit=${project.id}`}>
                <Button variant="outline" size="sm">Edit Answers</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {displayAnswers.map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
                const display = Array.isArray(value) ? (value as string[]).join(", ") : String(value);
                return (
                  <div key={key} className="bg-stone-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-sm font-medium text-stone-800">{display}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Document Packages */}
        <div className="mb-4">
          <h2 className="text-2xl font-black text-stone-900 mb-1">Document Packages</h2>
          <p className="text-stone-500 text-sm mb-6">
            Preview any document free. Purchase to unlock the full version.
          </p>
        </div>

        <PackagesSection
          packages={PACKAGES.map((pkg) => ({
            ...pkg,
            viewPath: `/projects/${project.id}/${
              pkg.id === "material_list"          ? "material-list"
              : pkg.id === "spec_tier"            ? "spec-tier"
              : pkg.id === "vendor_list"          ? "contractors"
              : pkg.id === "construction_schedule"? "schedule"
              : `preview/${pkg.id}`
            }`,
          }))}
          purchases={purchases}
          projectId={project.id}
        />

        {/* Watermark note */}
        <p className="text-center text-stone-400 text-xs mt-6">
          Free previews include a "DRAFT DOCUMENT — OWNED BY BUILD-WELL LLC" watermark. Purchased documents are clean and ready to use.
        </p>

      </div>
    </div>
  );
}
