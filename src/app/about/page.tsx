import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Founder | Buildwell",
  description:
    "25+ years in construction — from Hawaii to Vermont, California to Canada. Buildwell was built by someone who knows exactly how painful the planning process can be, and decided to fix it.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-950">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/90 backdrop-blur border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-white tracking-tight">
              Build<span className="text-amber-500">well</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-400">
            <Link href="/structures" className="hover:text-amber-500 transition-colors">Structures</Link>
            <Link href="/#documents" className="hover:text-amber-500 transition-colors">Documents</Link>
            <Link href="/#how-it-works" className="hover:text-amber-500 transition-colors">How It Works</Link>
            <Link href="/about" className="text-amber-500 font-bold">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm font-semibold text-stone-400 hover:text-white px-3 py-2 transition-colors">Sign In</button>
            </Link>
            <Link href="/register">
              <button className="bg-amber-600 hover:bg-amber-500 text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-amber-900/30">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(217,119,6,0.15) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at bottom right, rgba(217,119,6,0.08) 0%, transparent 65%)" }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-amber-500 text-sm font-semibold hover:text-amber-400 transition-colors">
              ← Back to Home
            </Link>
          </div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-600/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">The Person Behind Buildwell</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight">
              25 Years.<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%)" }}>
                Zero Shortcuts.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-stone-400 max-w-3xl mx-auto leading-relaxed">
              On time. Under budget. Customer walking away thrilled. After two and a half decades of chasing that trifecta across every corner of this country — I built the tool I always wished existed.
            </p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { number: "25+", label: "Years on Job Sites" },
              { number: "6", label: "States & Countries" },
              { number: "100s", label: "Projects Completed" },
              { number: "1", label: "Goal — Built Right" },
            ].map((stat) => (
              <div key={stat.label} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center hover:border-amber-600/40 transition-colors">
                <p className="text-4xl font-black text-amber-500 mb-1">{stat.number}</p>
                <p className="text-stone-400 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
              <span className="text-amber-700 text-xs font-bold uppercase tracking-widest">The Story</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 leading-tight">
              From Hawaii to Vermont —<br />
              <span className="text-amber-600">I&rsquo;ve Seen It All.</span>
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              Over 25 years I worked alongside the largest home builders and commercial contractors in the country. Every climate. Every code. Every type of crew and every type of client. If it was built in America, there&rsquo;s a good chance I&rsquo;ve stood on a job site just like it.
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                icon: "🔥",
                title: "The Real Problem",
                body: "It's not building — it's starting. Homeowners, first-time builders, even experienced contractors waste thousands of dollars and weeks of their lives just figuring out where to begin. They don't know what documents they need, who to call, or what anything costs."
              },
              {
                icon: "💡",
                title: "What I Watched Happen",
                body: "Clients overpaying architects for documents that could be standardized. DIY builders stalling on planning and never breaking ground. Contractors losing bids because they didn't have clean documentation to hand their subs."
              },
              {
                icon: "⚡",
                title: "Why I Built This",
                body: "Not as a side project. As a direct answer to the most common problem I watched slow down every single project I've ever been part of. Buildwell is what I always wished I could hand every client on day one."
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 bg-stone-50 border border-stone-200 rounded-2xl hover:border-amber-300 transition-colors">
                <div className="text-2xl shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <h3 className="font-black text-stone-900 mb-1">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three goals */}
      <section className="py-24 px-6 relative overflow-hidden bg-stone-950">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(217,119,6,0.08) 0%, transparent 70%)" }} />
        <div className="relative max-w-6xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-600/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">The Standard I&rsquo;ve Always Held</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            Every Project.<br />
            <span className="text-amber-500">Every Time.</span>
          </h2>
          <p className="text-stone-400 text-xl mb-16 max-w-2xl mx-auto">Three non-negotiables I&rsquo;ve held myself to for 25 years — and built into every corner of Buildwell.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: "01",
                title: "On Time",
                description: "A project that runs late is a project that costs more, strains relationships, and frustrates everyone. Planning is the antidote — and it starts before day one.",
                color: "from-amber-600/20 to-amber-600/5"
              },
              {
                number: "02",
                title: "Under Budget",
                description: "Surprises kill budgets. The right documentation upfront means accurate bids, fewer change orders, and a number you can actually trust from start to finish.",
                color: "from-amber-500/20 to-amber-500/5"
              },
              {
                number: "03",
                title: "Ecstatic Customer",
                description: "Not satisfied. Not fine. Ecstatic. When someone builds something meaningful, the experience should match the outcome — every single time.",
                color: "from-amber-400/20 to-amber-400/5"
              },
            ].map((item) => (
              <div key={item.number}
                className={`bg-gradient-to-b ${item.color} border border-stone-800 rounded-3xl p-8 text-left hover:border-amber-600/40 transition-all duration-300`}>
                <div className="text-amber-500 text-5xl font-black mb-6 opacity-60">{item.number}</div>
                <h3 className="text-2xl font-black mb-4 text-white">{item.title}</h3>
                <p className="text-stone-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal / Values */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
              <span className="text-amber-700 text-xs font-bold uppercase tracking-widest">Outside the Job Site</span>
            </div>
            <h2 className="text-5xl font-black text-stone-900 leading-tight">
              Faith. Family.<br />
              <span className="text-amber-600">Two Golden Girls.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5 text-stone-600 leading-relaxed text-lg">
              <p>
                When I&rsquo;m not thinking about construction documents, I&rsquo;m with my wife and kids — that&rsquo;s where the real project is. My faith guides how I show up every single day, both at home and in business. I believe in doing things right, doing them honestly, and making sure the people around you are genuinely taken care of.
              </p>
              <p>
                We travel as a family whenever we can — not expensively, but well. I&rsquo;ve always believed the best experiences don&rsquo;t require the biggest budgets. You just have to know what you&rsquo;re doing. Sound familiar?
              </p>
              <p>
                And then there are the Golden Girls — our two golden retrievers who have strong opinions about being included in everything and absolutely zero respect for personal space. Wouldn&rsquo;t trade them for anything.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "✝️", label: "Faith-Driven", description: "Christianity is the foundation — in life and in how we treat every customer." },
                { icon: "👨‍👩‍👧‍👦", label: "Family First", description: "Wife, kids, dogs. Everything else runs a distant second." },
                { icon: "🐾", label: "The Golden Girls", description: "Two golden retrievers who run the house and don't apologize for it." },
                { icon: "✈️", label: "Always Exploring", description: "Traveling smart and stretching every dollar — the only way to do it." },
              ].map((item) => (
                <div key={item.label} className="bg-stone-950 rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-base font-black text-white mb-1">{item.label}</h3>
                  <p className="text-stone-400 text-sm leading-snug">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 relative overflow-hidden bg-stone-950">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(217,119,6,0.12) 0%, transparent 65%)" }} />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">Why It Matters</p>
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            &ldquo;I Just Don&rsquo;t Know<br />
            <span className="text-amber-500">Where to Begin.&rdquo;</span>
          </h2>
          <p className="text-stone-400 text-xl leading-relaxed mb-6 max-w-3xl mx-auto">
            I heard those words for 25 years. From homeowners, from builders, from people with a dream and the drive — but no roadmap. They didn&rsquo;t deserve to feel lost. Neither do you.
          </p>
          <p className="text-stone-300 text-xl leading-relaxed mb-12 max-w-3xl mx-auto">
            Buildwell is the starting line. The &ldquo;here&rsquo;s exactly what you need and exactly how to get there&rdquo; I always wished I could hand every client on day one. Now I can — and it&rsquo;s yours.
          </p>
          <Link href="/register">
            <button className="group bg-amber-600 hover:bg-amber-500 text-white font-black text-xl px-14 py-6 rounded-2xl shadow-2xl shadow-amber-900/40 transition-all duration-200 hover:scale-105 hover:shadow-amber-900/60">
              Start Building Free
              <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
          <p className="mt-5 text-stone-500 text-sm">No credit card. No commitment. Just a better way to build.</p>
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
            <Link href="/register" className="hover:text-white transition-colors">Get Started</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
          <p>© {new Date().getFullYear()} Build-Well LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
