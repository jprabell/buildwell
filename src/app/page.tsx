import Link from "next/link";
import Button from "@/components/ui/Button";
import StructureGrid from "@/components/landing/StructureGrid";

const TRUST_ITEMS = [
  "Professional-grade documents",
  "16 structure types supported",
  "DIY builders & contractors",
  "Save thousands vs. hiring architects",
  "Instant delivery after purchase",
  "Free to start — no credit card",
  "Blueprints, specs & bid docs",
  "From shed to custom home",
];

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
            <Link href="/structures" className="hover:text-amber-600 transition-colors">Structures</Link>
            <Link href="#documents" className="hover:text-amber-600 transition-colors">Documents</Link>
            <Link href="#how-it-works" className="hover:text-amber-600 transition-colors">How It Works</Link>
            <Link href="/faq" className="hover:text-amber-600 transition-colors">FAQ</Link>
            <Link href="/about" className="hover:text-amber-600 transition-colors">About</Link>
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
      <section className="relative pt-32 pb-40 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/65 via-stone-900/60 to-stone-950/80" />

        {/* Floating amber orb */}
        <div
          className="float-glow absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(217,119,6,0.35) 0%, rgba(217,119,6,0.1) 50%, transparent 70%)",
            left: "50%",
            top: "30%",
            transform: "translateX(-50%)",
            filter: "blur(2px)",
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-8 fade-up">
            🏗️ From sheds to custom homes — every structure type supported
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight fade-up">
            <span className="shimmer-text">Blueprints, specs, and bid docs</span><br />
            for your build — in an afternoon.
          </h1>
          <p className="text-xl text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed fade-up">
            Answer a few guided questions and get professional construction documents
            ready for permits, contractors, and suppliers — at a fraction of what an architect charges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-up">
            <Link href="/register">
              <button className="amber-pulse bg-amber-600 hover:bg-amber-500 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-xl transition-all duration-200">
                Start Your Design Free →
              </button>
            </Link>
            <Link href="#how-it-works">
              <button className="border border-white/30 text-white hover:bg-white/10 font-bold text-lg px-10 py-4 rounded-2xl transition-all duration-200">
                See How It Works
              </button>
            </Link>
          </div>
          <p className="mt-6 text-stone-400 text-sm fade-up">No credit card required to start. Save and return anytime.</p>
        </div>
      </section>

      {/* Scrolling Trust Bar */}
      <div className="bg-amber-700 py-4 overflow-hidden">
        <div className="ticker-inner flex gap-0 whitespace-nowrap text-white text-sm font-semibold">
          {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-2 px-8">
              <span className="text-amber-300 text-lg">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Structure Types */}
      <section id="structures" className="py-24 px-6 bg-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">16 Structure Types</p>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
              Whatever You&rsquo;re Building,<br />
              <span className="text-amber-600">We&rsquo;ve Got the Documents.</span>
            </h2>
            <p className="text-lg text-stone-500 max-w-xl mx-auto">
              Click any structure to explore it — then start your project free.
            </p>
          </div>
          <StructureGrid />
        </div>
      </section>

      {/* Document Packages */}
      <section id="documents" className="py-24 px-6 bg-stone-950 text-white relative overflow-hidden">
        {/* Subtle amber gradient glow top-left */}
        <div
          className="absolute top-0 left-0 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top left, rgba(217,119,6,0.15) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Professional Documentation</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Every Document Your<br />
              <span className="text-amber-400">Build Will Ever Need</span>
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              A fraction of what you&rsquo;d pay a traditional architect or contractor — with instant delivery.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Construction Planning Report */}
            <div className="group bg-stone-900 rounded-2xl overflow-hidden border border-stone-700 hover:border-amber-500/80 transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,119,6,0.2)] hover:-translate-y-1">
              <div className="relative h-48 bg-stone-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80"
                  alt="Construction planning documents"
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                <div className="absolute bottom-4 left-5"><span className="text-4xl">📐</span></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">Most Complete</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black mb-1">Construction Planning Report</h3>
                <div className="text-3xl font-black text-amber-400 mb-4">$250</div>
                <ul className="space-y-2 text-sm text-stone-300 mb-6">
                  {["Room schedule with dimensions", "Foundation & framing summary", "Roof & structural notes", "Systems overview (plumbing, electrical, HVAC)", "Material selections & specs", "Code compliance checklist"].map((item) => (
                    <li key={item} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 shrink-0">✓</span> {item}</li>
                  ))}
                </ul>
                <Link href="/register">
                  <button className="w-full amber-pulse bg-amber-600 hover:bg-amber-500 text-white font-black py-3 rounded-xl transition-all duration-200">Start Your Design</button>
                </Link>
              </div>
            </div>

            {/* Material & Specification List */}
            <div className="group bg-stone-900 rounded-2xl overflow-hidden border border-stone-700 hover:border-amber-500/80 transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,119,6,0.2)] hover:-translate-y-1">
              <div className="relative h-48 bg-stone-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1426927308491-6380b6a9936f?auto=format&fit=crop&w=600&q=80"
                  alt="Building materials"
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                <div className="absolute bottom-4 left-5"><span className="text-4xl">📋</span></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black mb-1">Material & Specification List</h3>
                <div className="text-3xl font-black text-amber-400 mb-4">$100</div>
                <ul className="space-y-2 text-sm text-stone-300 mb-6">
                  {["Full itemized material list", "Quantities & unit specifications", "Per-trade spec sheets", "Framing, roofing & insulation", "Windows, doors & finishes", "Ready for supplier ordering"].map((item) => (
                    <li key={item} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 shrink-0">✓</span> {item}</li>
                  ))}
                </ul>
                <Link href="/register">
                  <button className="w-full bg-stone-700 hover:bg-stone-600 text-white font-black py-3 rounded-xl transition-all duration-200">Start Your Design</button>
                </Link>
              </div>
            </div>

            {/* Contractor Bid Package */}
            <div className="group bg-stone-900 rounded-2xl overflow-hidden border border-stone-700 hover:border-amber-500/80 transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,119,6,0.2)] hover:-translate-y-1">
              <div className="relative h-48 bg-stone-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80"
                  alt="Contractor bid documents"
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                <div className="absolute bottom-4 left-5"><span className="text-4xl">💼</span></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black mb-1">Contractor Bid Package</h3>
                <div className="text-3xl font-black text-amber-400 mb-4">$250</div>
                <ul className="space-y-2 text-sm text-stone-300 mb-6">
                  {["Scope of work per trade", "Formatted bid request forms", "Line-item cost breakdowns", "Framing, electrical & plumbing", "HVAC & roofing bid sheets", "Ready to send to contractors"].map((item) => (
                    <li key={item} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 shrink-0">✓</span> {item}</li>
                  ))}
                </ul>
                <Link href="/register">
                  <button className="w-full bg-stone-700 hover:bg-stone-600 text-white font-black py-3 rounded-xl transition-all duration-200">Start Your Design</button>
                </Link>
              </div>
            </div>

            {/* Good / Better / Best Spec Report */}
            <div className="group bg-stone-900 rounded-2xl overflow-hidden border border-stone-700 hover:border-amber-500/80 transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,119,6,0.2)] hover:-translate-y-1">
              <div className="relative h-48 bg-stone-800 overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <div className="w-8 h-12 bg-stone-600 rounded-t-lg opacity-70" />
                    <div className="w-8 h-16 bg-amber-600 rounded-t-lg" />
                    <div className="w-8 h-20 bg-amber-400 rounded-t-lg" />
                  </div>
                  <p className="text-xs text-stone-400 font-semibold tracking-widest uppercase">Good · Better · Best</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black mb-1">Good / Better / Best Spec Report</h3>
                <div className="text-3xl font-black text-amber-400 mb-4">$75</div>
                <ul className="space-y-2 text-sm text-stone-300 mb-6">
                  {["3-tier verified material options", "Brand examples per category", "Installed cost ranges per tier", "Warranty comparison by product", "Framing, insulation & windows", "HVAC, flooring, cabinets & more"].map((item) => (
                    <li key={item} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 shrink-0">✓</span> {item}</li>
                  ))}
                </ul>
                <Link href="/register">
                  <button className="w-full bg-stone-700 hover:bg-stone-600 text-white font-black py-3 rounded-xl transition-all duration-200">Start Your Design</button>
                </Link>
              </div>
            </div>

            {/* Preferred Vendor List */}
            <div className="group bg-stone-900 rounded-2xl overflow-hidden border border-stone-700 hover:border-amber-500/80 transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,119,6,0.2)] hover:-translate-y-1">
              <div className="relative h-48 bg-stone-800 overflow-hidden flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="text-5xl mb-3">📞</div>
                  <p className="text-xs text-stone-400 font-semibold tracking-widest uppercase">Local · Rated · Ready</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black mb-1">Preferred Vendor List</h3>
                <div className="text-3xl font-black text-amber-400 mb-4">$40</div>
                <ul className="space-y-2 text-sm text-stone-300 mb-6">
                  {["3 local contractors per trade", "Phone & address per listing", "Google rating & review count", "All trades in build sequence", "Notes section per trade", "Print-ready procurement doc"].map((item) => (
                    <li key={item} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 shrink-0">✓</span> {item}</li>
                  ))}
                </ul>
                <Link href="/register">
                  <button className="w-full bg-stone-700 hover:bg-stone-600 text-white font-black py-3 rounded-xl transition-all duration-200">Start Your Design</button>
                </Link>
              </div>
            </div>

            {/* Construction Schedule */}
            <div className="group bg-stone-900 rounded-2xl overflow-hidden border border-stone-700 hover:border-amber-500/80 transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,119,6,0.2)] hover:-translate-y-1">
              <div className="relative h-48 bg-stone-800 overflow-hidden flex items-center justify-center">
                <div className="text-center px-6">
                  {/* Mini critical path diagram */}
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {["Pre", "Found", "Frame", "MEP", "Finish", "CO"].map((label, i) => (
                      <div key={label} className="flex items-center gap-1">
                        <div className={`text-[9px] font-black px-1.5 py-1 rounded ${i % 2 === 0 ? "bg-amber-600 text-white" : "bg-stone-600 text-stone-300"}`}>
                          {label}
                        </div>
                        {i < 5 && <div className="w-2 h-px bg-stone-500" />}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-stone-400 font-semibold tracking-widest uppercase">Critical Path · Phase by Phase</p>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">Interactive</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black mb-1">Construction Schedule</h3>
                <div className="text-3xl font-black text-amber-400 mb-4">$140</div>
                <ul className="space-y-2 text-sm text-stone-300 mb-6">
                  {["Phase-by-phase build sequence", "Critical path tasks highlighted", "Duration estimates per task", "Dependency tracking between tasks", "Check off tasks as you progress", "Live progress bar & completion %"].map((item) => (
                    <li key={item} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5 shrink-0">✓</span> {item}</li>
                  ))}
                </ul>
                <Link href="/register">
                  <button className="w-full bg-stone-700 hover:bg-stone-600 text-white font-black py-3 rounded-xl transition-all duration-200">Start Your Design</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center bg-stone-900/50 border border-stone-800 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-stone-400 text-sm">
              Get everything — all 6 documents — for{" "}
              <span className="text-amber-400 font-bold">$855 total</span>.
              A traditional architect charges <span className="text-stone-300 font-semibold">$5,000–$15,000</span> for comparable documentation.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">How Buildwell Works</h2>
            <p className="text-lg text-stone-500">Four steps from idea to complete document package</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 z-0" />
            {[
              { step: "01", icon: "🏗️", title: "Choose Your Structure", description: "Select from 16 structure types — homes, containers, barns, cabins, sheds, and more." },
              { step: "02", icon: "💬", title: "Answer Guided Questions", description: "Size, layout, foundation, utilities, sustainability goals — all tailored to your build." },
              { step: "03", icon: "📊", title: "Review Your Summary", description: "See a complete project overview with specifications, material categories, and system selections." },
              { step: "04", icon: "📁", title: "Unlock Your Documents", description: "Blueprints, material lists, spec sheets, and bid documents — ready for your contractor." },
            ].map((item) => (
              <div key={item.step} className="text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-amber-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-600/30">
                  {item.step}
                </div>
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
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Who It&rsquo;s For</p>
            <h2 className="text-4xl font-black text-stone-900 mb-4">Built for Everyone</h2>
            <p className="text-lg text-stone-500">Whether you&rsquo;re swinging a hammer yourself or managing a crew</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
                icon: "🔨",
                title: "DIY Builders",
                description: "Get the exact documents you need to pull permits, order materials, and manage your own build with confidence.",
              },
              {
                image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
                icon: "📋",
                title: "Contractors",
                description: "Streamline client projects with professional bid packages and material lists ready in minutes, not weeks.",
              },
              {
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
                icon: "🏢",
                title: "Developers",
                description: "Quickly scope multiple projects with accurate material estimates and professional documentation packages.",
              },
            ].map((item) => (
              <div key={item.title} className="group rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400 hover:shadow-[0_0_28px_rgba(217,119,6,0.18)] transition-all duration-300 bg-white">
                <div className="h-52 overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-5 text-3xl">{item.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/85 via-stone-900/80 to-stone-950/90" />
        <div className="relative max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-8">
            🏆 Professional documents. Fraction of the cost.
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Ready to Start<br />
            <span className="text-amber-400">Building?</span>
          </h2>
          <p className="text-amber-200/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Create your free account, answer a few questions, and preview your documents — no credit card needed.
          </p>
          <Link href="/register">
            <button className="amber-pulse bg-amber-600 hover:bg-amber-500 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-2xl transition-all duration-200">
              Create Free Account →
            </button>
          </Link>
          <p className="mt-5 text-stone-400 text-sm">Free to start. No commitment. Save and return anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-stone-950 text-stone-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xl font-black text-white">
            Build<span className="text-amber-500">well</span>
          </span>
          <div className="flex gap-8 text-stone-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/register" className="hover:text-white transition-colors">Get Started</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
          <p>© {new Date().getFullYear()} Build-Well LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
