import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { STRUCTURE_OPTIONS } from "@/lib/structures";
import Button from "@/components/ui/Button";
import PurchaseButton from "@/components/ui/PurchaseButton";
import MaterialListThumbnail from "@/components/ui/MaterialListThumbnail";

const PACKAGES = [
  {
    id: "blueprint_set",
    icon: "📐",
    title: "Full Blueprint Set",
    price: "$2,000",
    includes: [
      "Floor plan layout",
      "Exterior elevations",
      "Framing plan",
      "Roofing & truss plan",
      "Plumbing, Electrical & HVAC",
      "Exterior detail sheets",
    ],
  },
  {
    id: "material_list",
    icon: "📋",
    title: "Material List + Spec Sheet",
    price: "$250",
    includes: [
      "Full itemized material list",
      "Quantities & specifications",
      "Per-trade spec sheets",
      "Framing, roofing, insulation",
      "Windows, doors & finishes",
      "Ready for supplier ordering",
    ],
  },
  {
    id: "quote_package",
    icon: "💼",
    title: "Quote Package + Bid Docs",
    price: "$250",
    includes: [
      "Formatted quote documents",
      "Vendor pricing included",
      "Bid documents by trade",
      "Framing, electrical, plumbing",
      "HVAC & roofing bids",
      "Ready to send to contractors",
    ],
  },
  {
    id: "spec_tier",
    icon: "⭐",
    title: "Good / Better / Best Spec Tier",
    price: "$150",
    includes: [
      "3-tier verified material specs",
      "Brand examples per category",
      "Installed cost ranges",
      "Warranty info by product",
      "Framing, insulation, windows",
      "HVAC, flooring, cabinets & more",
    ],
  },
];

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const project = await db.project.findFirst({
    where: { id: params.id, userId: session.user.id },
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

        <div className="grid md:grid-cols-3 gap-5">
          {PACKAGES.map((pkg) => {
            const purchased = purchases.includes(pkg.id);
            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl border p-6 flex flex-col ${
                  purchased ? "border-green-300 shadow-sm" : "border-stone-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{pkg.icon}</span>
                  {purchased && (
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✓ Purchased
                    </span>
                  )}
                </div>
                <h3 className="font-black text-stone-900 mb-1">{pkg.title}</h3>
                <p className="text-2xl font-black text-amber-600 mb-4">{pkg.price}</p>

                {pkg.id === "material_list" && (
                  <div className="mb-4 -mx-1">
                    <MaterialListThumbnail />
                  </div>
                )}

                <ul className="space-y-1.5 text-xs text-stone-500 mb-6 flex-1">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5">✓</span> {item}
                    </li>
                  ))}
                </ul>

                {purchased ? (
                  <div className="space-y-2">
                    {pkg.id === "blueprint_set" ? (
                      <a href={`/api/projects/${project.id}/floor-plan`} download>
                        <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                          Download Blueprint Set (.dxf)
                        </button>
                      </a>
                    ) : (
                      <Link href={`/projects/${project.id}/${
                        pkg.id === "material_list" ? "material-list"
                        : pkg.id === "spec_tier" ? "spec-tier"
                        : `preview/${pkg.id}`
                      }`}>
                        <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                          {pkg.id === "material_list" ? "View Material List"
                           : pkg.id === "spec_tier" ? "View Spec Tier Report"
                           : "Download Full Document"}
                        </button>
                      </Link>
                    )}
                    {pkg.id !== "blueprint_set" && pkg.id !== "spec_tier" && (
                      <Link href={`/projects/${project.id}/preview/${pkg.id}`}>
                        <button className="w-full border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium py-2 rounded-xl transition-colors text-sm">
                          View Preview
                        </button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <PurchaseButton
                      packageType={pkg.id}
                      projectId={project.id}
                      label={`Purchase — ${pkg.price}`}
                    />
                    <Link href={`/projects/${project.id}/${
                      pkg.id === "material_list" ? "material-list"
                      : pkg.id === "spec_tier" ? "spec-tier"
                      : `preview/${pkg.id}`
                    }`}>
                      <button className="w-full border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium py-2 rounded-xl transition-colors text-sm">
                        Preview Free (watermarked)
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Watermark note */}
        <p className="text-center text-stone-400 text-xs mt-6">
          Free previews include a "DRAFT DOCUMENT — OWNED BY BUILD-WELL LLC" watermark. Purchased documents are clean and ready to use.
        </p>
      </div>
    </div>
  );
}
