import Link from "next/link";
import { STRUCTURE_OPTIONS, STRUCTURE_CATEGORIES } from "@/lib/structures";
import Button from "@/components/ui/Button";

export default function LandingPage() {
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
            <Link href="#structures" className="hover:text-amber-600 transition-colors">Structures</Link>
            <Link href="#documents" className="hover:text-amber-600 transition-colors">Documents</Link>
            <Link href="#how-it-works" className="hover:text-amber-600 transition-colors">How It Works</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-36 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/60 via-stone-900/55 to-stone-950/70" />
        <div className="relative max-w-5xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-8">
            🏗️ From sheds to custom homes — every structure type supported
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Design Your Build.<br />
            <span className="text-amber-400">Get Every Document.</span>
          </h1>
          <p className="text-xl text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Answer guided questions and receive professional blueprints, material lists,
            spec sheets, and contractor bid documents — at a fraction of traditional costs.
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
          <p className="mt-6 text-stone-400 text-sm">No credit card required to start. Save and return anytime.</p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-amber-700 py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center gap-6 sm:gap-16 text-white text-sm font-medium text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-300">✓</span> Professional-grade documents
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-300">✓</span> DIY builders &amp; contractors
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-300">✓</span> Save thousands vs. hiring architects
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-amber-300">✓</span> 16 structure types supported
          </div>
        </div>
      </section>

      {/* Structure Types */}
      <section id="structures" className="py-24 px-6 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-stone-900 mb-4">Every Structure Type</h2>
            <p className="text-lg text-stone-500 max-w-xl mx-auto">
              From a simple storage shed to a full custom home — Buildwell supports them all.
            </p>
          </div>
          {STRUCTURE_CATEGORIES.map((category) => {
            const structures = STRUCTURE_OPTIONS.filter((s) => s.category === category);
            return (
              <div key={category} className="mb-14">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-5 border-b border-stone-200 pb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {structures.map((s) => (
                    <Link href="/register" key={s.value}>
                      <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="relative h-36 overflow-hidden bg-stone-200">
                          {s.image ? (
                            <img
                              src={s.image}
                              alt={s.label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                              {s.icon}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                        </div>
                        <div className="p-3">
                          <div className="font-bold text-stone-900 text-sm group-hover:text-amber-700 transition-colors">
                            {s.label}
                          </div>
                          <div className="text-xs text-stone-400 mt-0.5 leading-tight mb-2">{s.description}</div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs">
                              <span className="text-amber-500">{"$".repeat(s.costLevel)}</span>
                              <span className="text-stone-200">{"$".repeat(4 - s.costLevel)}</span>
                            </span>
                            <span className="text-xs text-stone-400">{s.costNote}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Document Packages */}
      <section id="documents" className="py-24 px-6 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-4">Professional Document Packages</h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              A fraction of what you'd pay a traditional architect or contractor — with instant delivery.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Blueprint Set */}
            <div className="bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-amber-500/60 transition-colors">
              <div className="relative h-48 bg-stone-700 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80"
                  alt="Blueprints"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl">📐</span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Most Complete</div>
                <h3 className="text-xl font-black mb-1">Full Blueprint Set</h3>
                <div className="text-3xl font-black text-amber-400 mb-4">$2,000</div>
                <ul className="space-y-2 text-sm text-stone-300 mb-6">
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Floor plan layout</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Exterior elevations</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Framing plan</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Roofing &amp; truss plan</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Plumbing, Electrical &amp; HVAC</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Exterior detail sheets</li>
                </ul>
                <p className="text-xs text-stone-500 italic mb-4">First page preview available free. Full set unlocked after purchase.</p>
                <Link href="/register">
                  <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors">
                    Start Your Design
                  </button>
                </Link>
              </div>
            </div>

            {/* Material List + Spec Sheet */}
            <div className="bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-amber-500/60 transition-colors">
              <div className="relative h-48 bg-stone-700 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
                  alt="Material List"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl">📋</span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Great Value</div>
                <h3 className="text-xl font-black mb-1">Material List + Spec Sheet</h3>
                <div className="text-3xl font-black text-amber-400 mb-4">$250</div>
                <ul className="space-y-2 text-sm text-stone-300 mb-6">
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Full itemized material list</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Quantities &amp; specifications</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Per-trade spec sheets</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Framing, roofing, insulation</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Windows, doors, finishes</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Ready for supplier ordering</li>
                </ul>
                <p className="text-xs text-stone-500 italic mb-4">First page preview available free. Full document unlocked after purchase.</p>
                <Link href="/register">
                  <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors">
                    Start Your Design
                  </button>
                </Link>
              </div>
            </div>

            {/* Quote Package */}
            <div className="bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-amber-500/60 transition-colors">
              <div className="relative h-48 bg-stone-700 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80"
                  alt="Quote Package"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl">💼</span>
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Contractor Ready</div>
                <h3 className="text-xl font-black mb-1">Quote Package + Bid Docs</h3>
                <div className="text-3xl font-black text-amber-400 mb-4">$250</div>
                <ul className="space-y-2 text-sm text-stone-300 mb-6">
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Formatted quote documents</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Vendor pricing included</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Bid docs by trade</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Framing, electrical, plumbing</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> HVAC &amp; roofing bids</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Ready to send to contractors</li>
                </ul>
                <p className="text-xs text-stone-500 italic mb-4">First page preview available free. Full package unlocked after purchase.</p>
                <Link href="/register">
                  <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors">
                    Start Your Design
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <p className="text-center text-stone-500 text-sm mt-10">
            Compare: A full architect-drawn blueprint set typically costs <span className="text-stone-300 font-semibold">$5,000–$15,000</span>. Buildwell delivers professional documentation at a fraction of the cost.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-stone-900 mb-4">How Buildwell Works</h2>
            <p className="text-lg text-stone-500">Four steps from idea to complete document package</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: "🏗️",
                title: "Choose Your Structure",
                description: "Select from 16 structure types — homes, containers, barns, cabins, sheds, and more.",
              },
              {
                step: "02",
                icon: "💬",
                title: "Answer Guided Questions",
                description: "Size, layout, foundation, utilities, sustainability goals, and budget — all tailored to your build.",
              },
              {
                step: "03",
                icon: "📊",
                title: "Review Your Summary",
                description: "See a complete project overview with specifications, material categories, and system selections.",
              },
              {
                step: "04",
                icon: "📁",
                title: "Unlock Your Documents",
                description: "Blueprints, material lists, spec sheets, and bid documents — ready for your contractor.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-black text-amber-200 mb-1">{item.step}</div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 px-6 bg-amber-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-stone-900 mb-4">Built for Everyone</h2>
            <p className="text-lg text-stone-500">Whether you're swinging a hammer yourself or managing a crew</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
                title: "DIY Builders",
                description: "Get the exact documents you need to pull permits, order materials, and manage your own build with confidence.",
              },
              {
                image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
                title: "Contractors",
                description: "Streamline client projects with professional bid packages and material lists ready in minutes, not weeks.",
              },
              {
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
                title: "Developers",
                description: "Quickly scope multiple projects with accurate material estimates and professional documentation packages.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-amber-900/80" />
        <div className="relative max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to Start Building?</h2>
          <p className="text-amber-200 text-lg mb-10 max-w-xl mx-auto">
            Create your free account, answer a few questions, and preview your documents — no credit card needed.
          </p>
          <Link href="/register">
            <button className="bg-white text-amber-900 hover:bg-amber-50 font-black text-lg px-10 py-4 rounded-2xl shadow-xl transition-colors">
              Create Free Account →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-stone-950 text-stone-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xl font-black text-white">
            Build<span className="text-amber-500">well</span>
          </span>
          <div className="flex gap-8 text-stone-400">
            <Link href="/register" className="hover:text-white transition-colors">Get Started</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
          <p>© {new Date().getFullYear()} Build-Well LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
