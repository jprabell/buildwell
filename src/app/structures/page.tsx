import Link from "next/link";
import { Metadata } from "next";
import { STRUCTURE_PAGE_DATA } from "@/lib/structurePageData";
import { STRUCTURE_OPTIONS } from "@/lib/structures";

export const metadata: Metadata = {
  title: "Structure Types — All 15 Build Categories | Buildwell",
  description:
    "Browse all 15 structure types supported by Buildwell — from single family homes to barns, container homes, A-frames, and more. Professional construction documents for every build.",
};

const categoryOrder = ["Residential", "Agricultural", "Specialty", "Outbuilding", "Sustainable"];

export default function StructuresIndexPage() {
  const byCategory = categoryOrder.map((cat) => ({
    category: cat,
    structures: STRUCTURE_OPTIONS.filter((s) => s.category === cat),
  }));

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-stone-900 tracking-tight">
              Build<span className="text-amber-600">well</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <Link href="/#documents" className="hover:text-amber-600 transition-colors">Documents</Link>
            <Link href="/#how-it-works" className="hover:text-amber-600 transition-colors">How It Works</Link>
            <Link href="/faq" className="hover:text-amber-600 transition-colors">FAQ</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm font-semibold text-stone-600 hover:text-amber-600 px-3 py-2 transition-colors">Sign In</button>
            </Link>
            <Link href="/register">
              <button className="bg-amber-600 hover:bg-amber-500 text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all duration-200">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-36 pb-16 px-6 bg-white border-b border-stone-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">All Structure Types</p>
          <h1 className="text-5xl md:text-6xl font-black text-stone-900 mb-6 leading-tight">
            Whatever You&rsquo;re Building,<br />
            <span className="text-amber-600">We&rsquo;ve Got the Documents.</span>
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl mx-auto">
            Browse all 15 structure types. Click any to see what&rsquo;s included in your document package — then start your project free.
          </p>
        </div>
      </section>

      {/* Structures by category */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          {byCategory.map(({ category, structures }) => (
            <div key={category}>
              <div className="flex items-center gap-4 mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600">{category}</p>
                <div className="flex-1 h-px bg-amber-200" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {structures.map((s) => {
                  const pageData = STRUCTURE_PAGE_DATA.find((p) => p.value === s.value);
                  const slug = s.value.toLowerCase().replace(/_/g, "-");
                  return (
                    <Link key={s.value} href={`/structures/${slug}`} className="group">
                      <div className="bg-white rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-[0_0_28px_rgba(217,119,6,0.15)] transition-all duration-300 overflow-hidden">
                        {pageData?.heroImage && (
                          <div className="h-44 overflow-hidden relative">
                            <img
                              src={pageData.heroImage}
                              alt={s.label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                            <div className="absolute bottom-4 left-5 text-3xl">{s.icon}</div>
                            <div className="absolute top-4 right-4">
                              <span className="bg-black/50 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full">
                                {s.costNote}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="p-6">
                          <h2 className="text-xl font-black text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
                            {s.label}
                          </h2>
                          <p className="text-stone-500 text-sm leading-relaxed mb-4">{s.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-amber-600 text-sm font-bold">View documents →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Start?<br />
            <span className="text-amber-400">It&rsquo;s Free to Begin.</span>
          </h2>
          <p className="text-stone-400 text-lg mb-10">
            Choose your structure, answer guided questions, and get your complete document package — no credit card required.
          </p>
          <Link href="/register">
            <button className="bg-amber-600 hover:bg-amber-500 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-2xl transition-all duration-200">
              Create Free Account →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-stone-950 border-t border-stone-900 text-stone-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/">
            <span className="text-xl font-black text-white">
              Build<span className="text-amber-500">well</span>
            </span>
          </Link>
          <div className="flex gap-8 text-stone-400">
            <Link href="/structures" className="hover:text-white transition-colors">All Structures</Link>
            <Link href="/register" className="hover:text-white transition-colors">Get Started</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
          <p>© {new Date().getFullYear()} Build-Well LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
