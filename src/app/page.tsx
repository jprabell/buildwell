import Link from "next/link";
import { STRUCTURE_OPTIONS, STRUCTURE_CATEGORIES } from "@/lib/structures";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Build<span className="text-amber-600">well</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#structures" className="hover:text-amber-600 transition-colors">Structures</Link>
            <Link href="#how-it-works" className="hover:text-amber-600 transition-colors">How It Works</Link>
            <Link href="#features" className="hover:text-amber-600 transition-colors">Features</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-400 text-sm font-medium mb-8">
            🏗️ Design any structure — from sheds to custom homes
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Design Your Build.<br />
            <span className="text-amber-400">Get Every Document.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Answer a guided set of questions and receive a complete material list, spec sheets,
            and quote-ready documents — exactly what a professional home builder would produce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Start Your Design Free</Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                See How It Works
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-slate-400 text-sm">No credit card required. Save and revisit anytime.</p>
        </div>
      </section>

      {/* Structure Types */}
      <section id="structures" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Every Structure Type</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              From a simple storage shed to a full container home — Buildwell supports them all.
            </p>
          </div>
          {STRUCTURE_CATEGORIES.map((category) => {
            const structures = STRUCTURE_OPTIONS.filter((s) => s.category === category);
            return (
              <div key={category} className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {structures.map((s) => (
                    <div
                      key={s.value}
                      className="bg-white rounded-xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="text-3xl mb-2">{s.icon}</div>
                      <div className="font-semibold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
                        {s.label}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 leading-tight mb-2">{s.description}</div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm">
                          <span className="text-amber-500">{"$".repeat(s.costLevel)}</span>
                          <span className="text-slate-300">{"$".repeat(4 - s.costLevel)}</span>
                        </span>
                        <span className="text-xs text-slate-400">{s.costNote}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 mb-4">How Buildwell Works</h2>
            <p className="text-lg text-slate-500">Four steps from idea to complete document package</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Structure",
                description:
                  "Select from 16 structure types — homes, containers, barns, cabins, sheds, and more.",
              },
              {
                step: "02",
                title: "Answer Guided Questions",
                description:
                  "Size, layout, foundation, utilities, sustainability goals, budget, and more — all tailored to your structure type.",
              },
              {
                step: "03",
                title: "Get Your Design Summary",
                description:
                  "Review a complete project summary with specifications, material categories, and system selections.",
              },
              {
                step: "04",
                title: "Download Your Documents",
                description:
                  "Bill of Materials, spec sheets, supplier material lists, and quote-ready documents — ready to hand to contractors.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-black text-amber-100 mb-3">{item.step}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-4">Everything a Builder Needs</h2>
            <p className="text-lg text-slate-400">Professional-grade documentation, built for everyone</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📋",
                title: "Bill of Materials",
                description:
                  "Itemized material lists with quantities — framing, roofing, insulation, windows, doors, and more.",
              },
              {
                icon: "📄",
                title: "Spec Sheets",
                description:
                  "Per-trade specification sheets ready to hand to your framing sub, electrician, plumber, and HVAC contractor.",
              },
              {
                icon: "💰",
                title: "Quote-Ready Docs",
                description:
                  "Formatted documents that any supplier or contractor can use to provide an accurate quote.",
              },
              {
                icon: "🌱",
                title: "Sustainable Options",
                description:
                  "Solar, rainwater collection, SIP panels, ICF, passive solar, and more — integrated into your material list.",
              },
              {
                icon: "🚚",
                title: "National Supplier Packages",
                description:
                  "Specialty structures like container homes can be sourced through a single national supplier with one delivery.",
              },
              {
                icon: "📍",
                title: "Local Vendor Pricing",
                description:
                  "For standard builds, get approximate pricing from local vendors with easy-to-quote material sheets.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-amber-500/50 transition-colors"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-amber-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to Start Building?</h2>
          <p className="text-amber-100 text-lg mb-10">
            Create your free account and start designing in minutes.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-amber-700 hover:bg-amber-50 shadow-xl"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xl font-black text-white">
            Build<span className="text-amber-500">well</span>
          </span>
          <p>© {new Date().getFullYear()} Buildwell. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
