import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Founder | Buildwell",
  description:
    "25+ years in construction — from Hawaii to Vermont, California to Canada. Buildwell was built by someone who knows exactly how painful the planning process can be, and decided to fix it.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="text-amber-400 text-sm font-semibold hover:text-amber-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">The Person Behind Buildwell</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Just a builder who got tired of watching people struggle to get started.
          </h1>
          <p className="text-stone-400 text-lg leading-relaxed">
            Twenty-five years on job sites taught me a lot about construction. But the most important thing I learned had nothing to do with framing or foundations — it was how hard the very beginning is for most people.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
            <p>
              I&rsquo;ve worked with some of the largest home builders and commercial contractors in the country — Hawaii, California, Vermont, Canada, Mexico. Every climate, every code, every type of client. I&rsquo;ve been fortunate to see a lot of how this industry works from the inside.
            </p>
            <p>
              What I kept seeing, over and over, was the same problem: people who genuinely wanted to build something — a home, a barn, a shop — who had the drive and the resources, but didn&rsquo;t know where to start. They didn&rsquo;t know what documents they needed, who to call, what questions to ask, or what anything would cost. And that uncertainty stopped a lot of great projects before they ever broke ground.
            </p>
            <p>
              I watched clients overpay for documents that could be standardized. I watched first-time builders get lost in the planning phase and give up. I watched contractors lose bids because they didn&rsquo;t have clean documentation to hand to subs. It frustrated me for years.
            </p>
            <p>
              So I built Buildwell — not because I have all the answers, but because I&rsquo;ve seen what the right starting point looks like, and I wanted to make it accessible to everyone. That&rsquo;s really all this is.
            </p>
          </div>
        </div>
      </section>

      {/* Three goals */}
      <section className="py-16 px-6 bg-stone-50 border-y border-stone-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">A Simple Standard</p>
          <h2 className="text-3xl font-black text-stone-900 mb-10">
            Three things I&rsquo;ve always tried to hold myself to.
          </h2>
          <div className="space-y-6">
            {[
              { number: "01", title: "On Time", description: "A project that runs late costs more money, strains relationships, and frustrates everyone. Good planning at the beginning is the best way I know to prevent it." },
              { number: "02", title: "Under Budget", description: "Surprises are the enemy of budgets. The right documentation upfront leads to accurate bids, fewer change orders, and numbers you can actually trust." },
              { number: "03", title: "Ecstatic Customer", description: "Not satisfied. Not fine. Ecstatic. When someone builds something meaningful, the experience of building it should be something they&rsquo;re proud of too." },
            ].map((item) => (
              <div key={item.number} className="flex gap-5 p-5 bg-white border border-stone-200 rounded-2xl">
                <div className="text-2xl font-black text-amber-500 shrink-0 w-8">{item.number}</div>
                <div>
                  <h3 className="font-black text-stone-900 mb-1">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Outside the Job Site</p>
          <h2 className="text-3xl font-black text-stone-900 mb-8">A little about who I actually am.</h2>
          <div className="space-y-5 text-stone-600 text-lg leading-relaxed">
            <p>
              My faith is the foundation of everything — how I treat people, how I run this business, how I try to show up every day. My wife and kids are my real project. Everything else fits around them.
            </p>
            <p>
              We travel when we can — nothing fancy, just making the most of the time we have. And then there are our two golden retrievers, who have strong opinions about being included in everything and absolutely no respect for personal space. They fit right in.
            </p>
            <p className="text-stone-400 italic">
              — The Founder, Build-Well LLC
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {[
              { icon: "✝️", label: "Faith-Driven" },
              { icon: "👨‍👩‍👧‍👦", label: "Family First" },
              { icon: "🐾", label: "The Golden Girls" },
              { icon: "✈️", label: "Always Exploring" },
            ].map((item) => (
              <div key={item.label} className="bg-stone-50 border border-stone-100 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-xs font-bold text-stone-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-4 leading-tight">
            If you&rsquo;ve ever said &ldquo;I just don&rsquo;t know where to begin&rdquo; — this is for you.
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed mb-8">
            I heard that sentence for 25 years. It&rsquo;s the reason Buildwell exists. Start your project for free — no credit card, no commitment.
          </p>
          <Link href="/register">
            <button className="bg-amber-600 hover:bg-amber-500 text-white font-black px-8 py-4 rounded-xl transition-all duration-200">
              Start Building Free →
            </button>
          </Link>
          <p className="mt-4 text-stone-500 text-sm">Free to start, save, and return to anytime.</p>
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
