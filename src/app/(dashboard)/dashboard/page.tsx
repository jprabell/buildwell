import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { STRUCTURE_OPTIONS } from "@/lib/structures";
import Button from "@/components/ui/Button";
type Project = {
  id: string;
  name: string;
  structureType: string;
  status: string;
  updatedAt: Date;
  userId: string;
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const projects = await db.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-slate-900">
            Build<span className="text-amber-600">well</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{session.user.name || session.user.email}</span>
            <Link href="/api/auth/signout">
              <Button variant="ghost" size="sm">Sign Out</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">My Projects</h1>
            <p className="text-slate-500 mt-1">
              {projects.length === 0
                ? "No projects yet — start your first design"
                : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link href="/design">
            <Button>+ New Project</Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Start your first design</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Answer a few questions about your structure and get a complete material list and documents.
            </p>
            <Link href="/design">
              <Button size="lg">Start Designing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project: Project) => {
              const structure = STRUCTURE_OPTIONS.find(
                (s) => s.value === project.structureType
              );
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-amber-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{structure?.icon || "🏠"}</span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
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
                  <h3 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-slate-400">{structure?.label}</p>
                  <p className="text-xs text-slate-300 mt-3">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              );
            })}

            {/* New project card */}
            <Link
              href="/design"
              className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6 hover:border-amber-400 transition-all flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-amber-600 min-h-[160px]"
            >
              <span className="text-4xl">+</span>
              <span className="font-semibold text-sm">New Project</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
