import Link from "next/link";
import Button from "@/components/ui/Button";
import StructureGrid from "@/components/landing/StructureGrid";

const TRUST_ITEMS = [
  "Professional-grade documents",
  "16 structure types supported",
  "DIY builders & contractors",
  "Save thousands vs. hiring architects",
  "Free during beta — no credit card",
  "Blueprints, specs & bid docs",
  "From shed to custom home",
  "Instant delivery after signup",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
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
        <div
          className="float-glow absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(217,119,6,0.35) 0%, rgba(217,119,6,0.1) 50%, transparent 70%)",
            left: "50%", top: "30%", transform: "translateX(-50%)", filter: "blur(2px)",
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
          <p className="mt-6 text-stone-400 text-sm fade-up">No credit card required. Free during beta. Save and return anytime.</p>
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

      {/* Pain Points — "Sound Familiar?" */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Sound Familiar?</p>
            <h2 className="text-4xl font-black text-stone-900 mb-4">
              Most builds stall before they ever start.
            </h2>
            <p className="text-lg text-stone-500 max-w-xl mx-auto">
              The planning phase stops more great projects than bad weather, bad contractors, or bad budgets combined.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "😤", problem: "\"I don't know what documents I even need.\"", solution: "Buildwell tells you exactly what you need based on your structure type — nothing guessed, nothing missed." },
              { icon: "💸", problem: "\"An architect quoted me $8,000 just to get started.\"", solution: "Get professional-grade planning documents for a fraction of the cost — generated in minutes, not months." },
              { icon: "📞", problem: "\"I don't know which contractors to call or what to ask them.\"", solution: "Get a trade-by-trade bid package with scope, budget ranges, and local contractor lists ready to go." },
            ].map((item) => (
              <div key={item.problem} className="bg-stone-50 border border-stone-200 rounded-2xl p-6 hover:border-amber-300 hover:shadow-md transition-all duration-200">
                <div className="text-4xl mb-4">{item.icon}</div>
                <p className="text-stone-700 font-bold mb-3 italic text-sm leading-relaxed">{item.problem}</p>
                <div className="w-8 h-0.5 bg-amber-500 mb-3" />
                <p className="text-stone-500 text-sm leading-relaxed">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structure Types */}
      <section id="structures" className="py-24 px-6 bg-stone-50 border-y border-stone-100">
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
        <div
          className="absolute top-0 left-0 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top left, rgba(217,119,6,0.15) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Free During Beta</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Professional Documentation</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Every Document Your<br />
              <span className="text-amber-400">Build Will Ever Need</span>
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              All documents are free during our beta period. A traditional architect charges <span className="text-white font-semibold">$5,000–$15,000</span> for comparable work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📐", label: "Most Complete", labelColor: "bg-amber-600",
                title: "Construction Planning Report",
                features: ["Room schedule with dimensions", "Foundation & framing summary", "Systems overview (MEP)", "Material selections & specs", "Code compliance checklist", "Schematic floor plan"],
                highlight: true,
              },
              {
                icon: "📋", label: null, labelColor: "",
                title: "Material & Specification List",
                features: ["Full itemized material list", "Quantities & unit specs", "Per-trade spec sheets", "Framing, roofing & insulation", "Windows, doors & finishes", "Ready for supplier ordering"],
                highlight: false,
              },
              {
                icon: "💼", label: null, labelColor: "",
                title: "Contractor Bid Package",
                features: ["Scope of work per trade", "Formatted bid request forms", "Line-item cost breakdowns", "Email directly to contractors", "Bid comparison board", "Received bids tracking"],
                highlight: false,
              },
              {
                icon: "📊", label: null, labelColor: "",
                title: "Good / Better / Best Spec Report",
                features: ["3-tier material options", "Brand examples per category", "Installed cost ranges per tier", "Warranty comparison", "Framing, insulation & windows", "HVAC, flooring, cabinets & more"],
                highlight: false,
              },
              {
                icon: "📞", label: null, labelColor: "",
                title: "Preferred Vendor List",
                features: ["3 local contractors per trade", "Phone & address per listing", "Google rating & review count", "All trades in build sequence", "Notes section per trade", "Print-ready doc"],
                highlight: false,
              },
              {
                icon: "📅", label: "Interactive", labelColor: "bg-blue-600",
                title: "Construction Schedule",
                features: ["Phase-by-phase build sequence", "Critical path highlighted", "Duration estimates per task", "Dependency tracking", "Check off tasks as you go", "Live progress bar"],
                highlight: false,
              },
            ].map((doc) => (
              <div key={doc.title}
                className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                  doc.highlight
                    ? "bg-stone-900 border-amber-500/50 hover:border-amber-400 hover:shadow-[0_0_40px_rgba(217,119,6,0.25)]"
                    : "bg-stone-900 border-stone-700 hover:border-amber-500/80 hover:shadow-[0_0_40px_rgba(217,119,6,0.2)]"
                }`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{doc.icon}</span>
                    <div className="flex items-center gap-2">
                      {doc.label && (
                        <span className={`${doc.labelColor} text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wide`}>{doc.label}</span>
                      )}
                      <span className="bg-green-500/20 text-green-400 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wide">Free</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-black mb-4 text-white">{doc.title}</h3>
                  <ul className="space-y-2 text-sm text-stone-300 mb-6">
                    {doc.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5 shrink-0">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <button className={`w-full font-black py-3 rounded-xl transition-all duration-200 ${
                      doc.highlight
                        ? "amber-pulse bg-amber-600 hover:bg-amber-500 text-white"
                        : "bg-stone-700 hover:bg-stone-600 text-white"
                    }`}>
                      Start Your Design
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison — Buildwell vs. Architect */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">The Honest Comparison</p>
            <h2 className="text-4xl font-black text-stone-900 mb-4">
              Buildwell vs. The Traditional Way
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-stone-200">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left px-6 py-4 bg-stone-50 text-stone-500 font-bold text-xs uppercase tracking-wide w-1/3 border-b border-stone-200"></th>
                  <th className="px-6 py-4 bg-stone-50 text-stone-700 font-black text-sm border-b border-stone-200 text-center">Traditional Architect</th>
                  <th className="px-6 py-4 bg-amber-600 text-white font-black text-sm text-center border-b border-amber-500">Buildwell</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Cost", "$5,000 – $15,000+", "Free during beta"],
                  ["Time to Documents", "4 – 12 weeks", "Same afternoon"],
                  ["Revisions", "Costly & slow", "Instant — redo anytime"],
                  ["Contractor Bid Docs", "Rarely included", "Built in"],
                  ["Material Lists", "Rarely included", "Built in"],
                  ["Vendor List", "Not included", "Built in"],
                  ["Available 24/7", "No", "Yes"],
                ].map(([feature, traditional, buildwell], i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-stone-50/50"}>
                    <td className="px-6 py-4 font-semibold text-stone-700 border-r border-stone-100">{feature}</td>
                    <td className="px-6 py-4 text-stone-500 text-center">{traditional}</td>
                    <td className="px-6 py-4 text-center font-bold text-amber-700 bg-amber-50/50">{buildwell}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-stone-50 border-y border-stone-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">How Buildwell Works</h2>
            <p className="text-lg text-stone-500">Four steps from idea to complete document package</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 z-0" />
            {[
              { step: "01", icon: "🏗️", title: "Choose Your Structure", description: "Select from 16 structure types — homes, containers, barns, cabins, sheds, and more." },
              { step: "02", icon: "💬", title: "Answer Guided Questions", description: "Size, layout, foundation, utilities, sustainability goals — all tailored to your build." },
              { step: "03", icon: "📊", title: "Review Your Summary", description: "See a complete project overview with specifications, material categories, and system selections." },
              { step: "04", icon: "📁", title: "Get Your Documents", description: "Blueprints, material lists, spec sheets, and bid documents — ready for your contractor." },
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
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Who It&rsquo;s For</p>
            <h2 className="text-4xl font-black text-stone-900 mb-4">Built for Real Builders</h2>
            <p className="text-lg text-stone-500">Whether you&rsquo;re swinging a hammer yourself or managing a crew</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
                icon: "🔨", title: "DIY Builders",
                description: "Get the exact documents you need to pull permits, order materials, and manage your own build with confidence — without paying an architect.",
              },
              {
                image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
                icon: "📋", title: "Contractors",
                description: "Streamline client projects with professional bid packages and material lists ready in minutes, not weeks. Win more bids with better documentation.",
              },
              {
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
                icon: "🏡", title: "First-Time Builders",
                description: "Never built before? Buildwell walks you through everything step by step — so you know exactly what you need before you spend a dollar.",
              },
            ].map((item) => (
              <div key={item.title} className="group rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-400 hover:shadow-[0_0_28px_rgba(217,119,6,0.15)] transition-all duration-300 bg-white">
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
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Free During Beta — No Credit Card</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Ready to Start<br />
            <span className="text-amber-400">Building?</span>
          </h2>
          <p className="text-stone-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Create your free account, answer a few questions, and get your full document package — everything you need to break ground with confidence.
          </p>
          <Link href="/register">
            <button className="amber-pulse bg-amber-600 hover:bg-amber-500 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-2xl transition-all duration-200 hover:scale-105">
              Create Free Account →
            </button>
          </Link>
          <p className="mt-5 text-stone-400 text-sm">Free to start. No commitment. Save and return anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 px-6 bg-stone-950 text-stone-500 text-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <span className="text-xl font-black text-white block mb-3">
                Build<span className="text-amber-500">well</span>
              </span>
              <p className="text-stone-400 text-sm leading-relaxed">
                Professional construction documents for every builder — from first-timers to seasoned contractors.
              </p>
            </div>
            <div>
              <p className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Product</p>
              <div className="space-y-2">
                <Link href="/structures" className="block hover:text-white transition-colors">Structures</Link>
                <Link href="#documents" className="block hover:text-white transition-colors">Documents</Link>
                <Link href="#how-it-works" className="block hover:text-white transition-colors">How It Works</Link>
                <Link href="/register" className="block hover:text-white transition-colors">Get Started Free</Link>
              </div>
            </div>
            <div>
              <p className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Company</p>
              <div className="space-y-2">
                <Link href="/about" className="block hover:text-white transition-colors">About the Founder</Link>
                <Link href="/faq" className="block hover:text-white transition-colors">FAQ</Link>
              </div>
            </div>
            <div>
              <p className="text-white font-bold mb-4 text-xs uppercase tracking-widest">Account</p>
              <div className="space-y-2">
                <Link href="/register" className="block hover:text-white transition-colors">Create Account</Link>
                <Link href="/login" className="block hover:text-white transition-colors">Sign In</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Build-Well LLC. All rights reserved.</p>
            <p className="text-stone-600 text-xs">Built by a builder, for builders. ibuildwell.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
