import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Buildwell | ibuildwell.com",
  description:
    "Buildwell was built to solve the most common problem in construction — people not knowing where to start. Professional planning documents for every builder.",
};

export default function AboutPage() {
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
            <Link href="/#documents" className="hover:text-amber-600 transition-colors">Documents</Link>
            <Link href="/#how-it-works" className="hover:text-amber-600 transition-colors">How It Works</Link>
            <Link href="/about" className="text-amber-600 font-bold">About</Link>
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

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-stone-950 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-amber-400 text-sm font-semibold hover:text-amber-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">About Buildwell</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Professional construction documents — for every builder, at every level.
          </h1>
          <p className="text-stone-400 text-lg leading-relaxed max-w-2xl">
            Buildwell was built on one simple idea: the planning phase of a construction project shouldn&rsquo;t cost a fortune or take months. Every builder — from first-timers to seasoned contractors — deserves a clear starting point.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">The Problem We Solve</p>
            <h2 className="text-3xl font-black text-stone-900 mb-5 leading-tight">
              Most builds stall before they ever break ground.
            </h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                The construction industry has a planning problem. Homeowners and builders routinely spend thousands of dollars and weeks of their time just trying to figure out where to start — what documents they need, who to hire, what questions to ask, and what everything will cost.
              </p>
              <p>
                Traditional architects charge $5,000–$15,000 for planning documents that can take months to deliver. Most of that cost goes toward overhead, not the actual document work. The result is that everyday builders — people who have the land, the vision, and the drive — get priced out of professional planning before they ever swing a hammer.
              </p>
              <p>
                Buildwell closes that gap. Answer a guided questionnaire about your project and get professional-grade construction documents — floor plans, material lists, bid packages, and more — in the same afternoon.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { icon: "📐", title: "Built on Real Experience", description: "Buildwell was designed from 25+ years of hands-on construction work across residential, commercial, and agricultural projects — every document reflects how the industry actually works." },
              { icon: "⚡", title: "Instant, Not Weeks", description: "Documents are generated immediately based on your project inputs. No waiting. No back-and-forth. No retainer fees." },
              { icon: "💰", title: "A Fraction of the Cost", description: "A traditional architect charges $5,000–$15,000 for comparable documentation. Buildwell delivers the same starting point for a fraction of that — or free during beta." },
              { icon: "🔧", title: "Built for Every Structure", description: "16 structure types supported — from single-family homes and barndominiums to pole barns, container homes, A-frames, and off-grid earthships." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 bg-stone-50 border border-stone-200 rounded-2xl">
                <div className="text-2xl shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-black text-stone-900 mb-1 text-sm">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we believe */}
      <section className="py-16 px-6 bg-stone-50 border-y border-stone-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">What We Believe</p>
          <h2 className="text-3xl font-black text-stone-900 mb-10">
            Every project deserves a strong start.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { number: "01", title: "On Time", description: "A project that runs late costs more money, strains every relationship involved, and rarely recovers. Proper planning at the start is the single best way to prevent it." },
              { number: "02", title: "Under Budget", description: "Budget overruns almost always trace back to poor documentation and vague scope. The right paperwork upfront creates the accountability that keeps costs in line." },
              { number: "03", title: "Done Right", description: "Not just finished — done right. The goal of every Buildwell document is to give builders the information they need to make good decisions from the very first step." },
            ].map((item) => (
              <div key={item.number} className="bg-white border border-stone-200 rounded-2xl p-6 hover:border-amber-300 transition-colors">
                <div className="text-2xl font-black text-amber-500 mb-4 opacity-70">{item.number}</div>
                <h3 className="font-black text-stone-900 mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">What Buildwell Provides</p>
          <h2 className="text-3xl font-black text-stone-900 mb-8">
            Everything from the first question to the first shovel.
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { doc: "Construction Planning Report", detail: "Floor plan, room schedule, structural summary, systems overview, code checklist" },
              { doc: "Material & Specification List", detail: "Full itemized material list with quantities, specs, and supplier-ready line items" },
              { doc: "Contractor Bid Package", detail: "Trade-by-trade scope of work, bid forms, budget ranges, and email-to-contractor tools" },
              { doc: "Preferred Vendor List", detail: "3 local contractors per trade with phone, address, and Google ratings" },
              { doc: "Good / Better / Best Spec Report", detail: "Three-tier material options per category with cost ranges and brand examples" },
              { doc: "Construction Schedule", detail: "Phase-by-phase build timeline with critical path, dependencies, and progress tracking" },
            ].map((item) => (
              <div key={item.doc} className="flex items-start gap-3 p-4 border border-stone-100 rounded-xl">
                <span className="text-amber-500 font-black mt-0.5 shrink-0">✓</span>
                <div>
                  <p className="font-bold text-stone-900 text-sm">{item.doc}</p>
                  <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-4 leading-tight">
            Ready to start your project?
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed mb-8">
            Create a free account, answer a few questions about your build, and get your full document package — no credit card required.
          </p>
          <Link href="/register">
            <button className="bg-amber-600 hover:bg-amber-500 text-white font-black px-8 py-4 rounded-xl transition-all duration-200">
              Get Started Free →
            </button>
          </Link>
          <p className="mt-4 text-stone-500 text-sm">Free during beta. No commitment. Save and return anytime.</p>
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
            <Link href="/structures" className="hover:text-white transition-colors">Structures</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/register" className="hover:text-white transition-colors">Get Started</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
          <p>© {new Date().getFullYear()} Build-Well LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
