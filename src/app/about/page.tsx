import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Founder | Buildwell",
  description:
    "25+ years in construction — from Hawaii to Vermont, California to Canada. Buildwell was built by someone who knows exactly how painful the planning process can be, and decided to fix it.",
};

export default function AboutPage() {
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
            <Link href="/#documents" className="hover:text-amber-600 transition-colors">Documents</Link>
            <Link href="/#how-it-works" className="hover:text-amber-600 transition-colors">How It Works</Link>
            <Link href="/about" className="text-amber-600 font-bold transition-colors">About</Link>
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
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-stone-950 text-white">
        <div
          className="absolute top-0 right-0 w-[700px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top right, rgba(217,119,6,0.18) 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at bottom left, rgba(217,119,6,0.1) 0%, transparent 65%)" }}
        />
        <div className="relative max-w-5xl mx-auto">
          <div className="mb-4">
            <Link href="/" className="text-amber-400 text-sm font-semibold hover:text-amber-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">The Person Behind Buildwell</p>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                25 Years.<br />
                <span className="text-amber-400">One Clear Goal.</span>
              </h1>
              <p className="text-stone-300 text-xl leading-relaxed">
                On time. Under budget. Customer walking away thrilled.
                After two and a half decades of chasing that trifecta on job sites across the entire country,
                I built the tool I always wished existed.
              </p>
            </div>
            {/* Photo placeholder */}
            <div className="flex justify-center md:justify-end">
              <div className="w-72 h-80 rounded-3xl bg-stone-800 border-2 border-stone-700 flex flex-col items-center justify-center gap-4 shadow-2xl">
                <div className="text-6xl">👷</div>
                <p className="text-stone-500 text-sm font-medium text-center px-8 leading-relaxed">
                  Photo coming soon —<br />stay tuned.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">The Story</p>
          <h2 className="text-4xl font-black text-stone-900 mb-10 leading-tight">
            I&rsquo;ve Stood on Job Sites From<br />
            <span className="text-amber-600">Hawaii to Vermont — and Everywhere Between.</span>
          </h2>

          <div className="prose prose-stone prose-lg max-w-none space-y-6 text-stone-600 leading-relaxed">
            <p>
              Over more than 25 years in the construction industry, I&rsquo;ve worked alongside some of the largest
              home builders and commercial contractors in the country. Hawaii. California. Vermont. Canada. Mexico.
              Every climate, every code, every type of crew, every type of client. If it was built in the United States,
              there&rsquo;s a good chance I&rsquo;ve stood on a job site just like it.
            </p>
            <p>
              What I learned over those 25 years isn&rsquo;t just how to build things — it&rsquo;s how painful the
              process is <em>before</em> the first shovel hits the ground. Homeowners, first-time builders, and even
              experienced contractors spend thousands of dollars and weeks of their lives just trying to figure out
              where to start. They don&rsquo;t know what documents they need, who to call, what questions to ask,
              or what anything will cost. They just know they want to build something — and that they&rsquo;re not
              sure how to get from dream to done.
            </p>
            <p>
              That gap frustrated me for years. I watched clients overpay architects for documents that could be
              standardized. I watched DIY builders stall out on planning and never break ground. I watched contractors
              lose bids because they didn&rsquo;t have clean documentation to hand to subs.
            </p>
            <p>
              So I built Buildwell to fix it. Not as a side project — as a direct answer to the most common
              problem I&rsquo;ve watched slow down every project I&rsquo;ve ever been part of.
            </p>
          </div>
        </div>
      </section>

      {/* Three goals callout */}
      <section className="py-20 px-6 bg-amber-600">
        <div className="max-w-5xl mx-auto text-center text-white">
          <p className="text-amber-200 text-sm font-bold uppercase tracking-widest mb-4">The Standard I&rsquo;ve Always Held</p>
          <h2 className="text-4xl md:text-5xl font-black mb-12 leading-tight">
            Every Project. Every Time. Three Goals.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "01", title: "On Time", description: "A project that runs late is a project that costs more, strains relationships, and frustrates everyone involved. Planning is the antidote." },
              { number: "02", title: "Under Budget", description: "Surprises kill budgets. The right documentation upfront means accurate bids, fewer change orders, and a number you can actually trust." },
              { number: "03", title: "Ecstatic Customer", description: "Not satisfied. Not fine. Ecstatic. When someone builds something meaningful, the experience of building it should match the outcome." },
            ].map((item) => (
              <div key={item.number} className="bg-amber-700/50 rounded-2xl p-8 text-left">
                <div className="text-amber-300 text-4xl font-black mb-4">{item.number}</div>
                <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                <p className="text-amber-100 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-amber-200 text-lg font-medium max-w-2xl mx-auto">
            Buildwell is designed to hit all three — before you ever swing a hammer.
          </p>
        </div>
      </section>

      {/* Personal / Values */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">Outside the Job Site</p>
            <h2 className="text-4xl font-black text-stone-900 mb-8 leading-tight">
              Faith, Family,<br />
              <span className="text-amber-600">and Two Golden Girls.</span>
            </h2>
            <div className="space-y-5 text-stone-600 leading-relaxed text-lg">
              <p>
                When I&rsquo;m not thinking about construction documents, I&rsquo;m with my wife and kids —
                that&rsquo;s where the real project is. My faith guides how I show up every day, both at home
                and in business. I believe in doing things right, doing them honestly, and making sure the people
                around you are taken care of.
              </p>
              <p>
                We travel as a family whenever we can — not expensively, but well. I&rsquo;ve always believed
                the best experiences don&rsquo;t require the biggest budgets. You just have to know what you&rsquo;re
                doing. (Sound familiar?)
              </p>
              <p>
                And then there are the Golden Girls — our two golden retrievers who have strong opinions about
                being included in everything and absolutely no respect for personal space. They&rsquo;re a perfect
                fit for this family.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "✝️", label: "Faith-Driven", description: "Christianity is the foundation — in life and in how we treat customers." },
              { icon: "👨‍👩‍👧‍👦", label: "Family First", description: "Wife, kids, dogs. Everything else is secondary." },
              { icon: "🐾", label: "The Golden Girls", description: "Two golden retrievers who run the house and don't apologize for it." },
              { icon: "✈️", label: "Always Exploring", description: "Traveling smart and stretching every dollar — the only way to do it." },
            ].map((item) => (
              <div key={item.label} className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-base font-black text-stone-900 mb-1">{item.label}</h3>
                <p className="text-stone-500 text-sm leading-snug">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this matters */}
      <section className="py-24 px-6 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-block w-full"
            style={{ background: "none" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">Why It Matters</p>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              &ldquo;It&rsquo;s So Hard to Start<br />
              <span className="text-amber-400">When You Don&rsquo;t Know Where to Begin.&rdquo;</span>
            </h2>
            <p className="text-stone-400 text-xl leading-relaxed mb-8">
              That sentence captures every frustrated client, every stalled project, every builder who had the vision
              and the drive but couldn&rsquo;t find the roadmap. I heard it for 25 years. I lived it alongside people
              who just wanted to build something great and didn&rsquo;t deserve to feel lost.
            </p>
            <p className="text-stone-300 text-xl leading-relaxed mb-12">
              Buildwell is the starting line. It&rsquo;s the &ldquo;here&rsquo;s exactly what you need and here&rsquo;s
              exactly how to get there&rdquo; that I always wished I could hand every client on day one.
              Now I can — and so can you.
            </p>
            <Link href="/register">
              <button className="bg-amber-600 hover:bg-amber-500 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-2xl transition-all duration-200">
                Start Your Project Free →
              </button>
            </Link>
            <p className="mt-5 text-stone-500 text-sm">No credit card required. Free to start, save, and return anytime.</p>
          </div>
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
