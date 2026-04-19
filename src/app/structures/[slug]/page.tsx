import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { STRUCTURE_PAGE_DATA, getStructurePageData } from "@/lib/structurePageData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return STRUCTURE_PAGE_DATA.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getStructurePageData(slug);
  if (!data) return {};
  return {
    title: `${data.label} Plans & Construction Documents | Buildwell`,
    description: data.metaDescription,
    openGraph: {
      title: `${data.label} Plans & Construction Documents | Buildwell`,
      description: data.metaDescription,
      images: [{ url: data.heroImage }],
    },
  };
}

export default async function StructurePage({ params }: PageProps) {
  const { slug } = await params;
  const data = getStructurePageData(slug);
  if (!data) notFound();

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
            <Link href="/structures" className="hover:text-amber-600 transition-colors">All Structures</Link>
            <Link href="/#documents" className="hover:text-amber-600 transition-colors">Documents</Link>
            <Link href="/#how-it-works" className="hover:text-amber-600 transition-colors">How It Works</Link>
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
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${data.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-900/65 to-amber-950/75" />
        <div className="relative max-w-4xl mx-auto text-white">
          <div className="mb-4">
            <Link href="/structures" className="text-amber-300 text-sm font-semibold hover:text-amber-200 transition-colors">
              ← All Structure Types
            </Link>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">Construction Documents</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">{data.label}</h1>
          <p className="text-xl text-stone-300 max-w-2xl leading-relaxed mb-8">{data.tagline}</p>
          <div className="flex flex-wrap gap-6 text-sm text-stone-300 mb-10">
            <div>
              <span className="text-amber-400 font-bold block text-xs uppercase tracking-widest mb-1">Typical Size</span>
              {data.typicalSize}
            </div>
            <div>
              <span className="text-amber-400 font-bold block text-xs uppercase tracking-widest mb-1">Cost Range</span>
              {data.costRange}
            </div>
            <div>
              <span className="text-amber-400 font-bold block text-xs uppercase tracking-widest mb-1">Build Timeline</span>
              {data.timelineToBuild}
            </div>
          </div>
          <Link href="/register">
            <button className="bg-amber-600 hover:bg-amber-500 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-xl transition-all duration-200">
              Start Your {data.label} Documents Free →
            </button>
          </Link>
        </div>
      </section>

      {/* Overview + Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Overview</p>
            <h2 className="text-3xl font-black text-stone-900 mb-6">
              What Goes Into a {data.label} Build?
            </h2>
            <p className="text-stone-600 leading-relaxed text-lg">{data.overview}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Key Features</p>
            <h2 className="text-3xl font-black text-stone-900 mb-6">What Buildwell Covers</h2>
            <ul className="space-y-3">
              {data.keyFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="text-amber-600 font-black mt-0.5 shrink-0">✓</span>
                  <span className="text-stone-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Documents Needed */}
      <section className="py-20 px-6 bg-stone-950 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Document Package</p>
            <h2 className="text-4xl font-black mb-4">
              Everything Your {data.label} Build Needs
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto">
              Buildwell generates all of these documents from your guided questionnaire — no architect required.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {data.documentsNeeded.map((doc) => (
              <div
                key={doc}
                className="bg-stone-900 border border-stone-800 hover:border-amber-600/60 rounded-xl p-5 transition-colors"
              >
                <span className="text-amber-500 text-lg mr-2">📄</span>
                <span className="text-stone-200 font-semibold">{doc}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/register">
              <button className="bg-amber-600 hover:bg-amber-500 text-white font-black text-lg px-10 py-4 rounded-2xl shadow-xl transition-all duration-200">
                Generate My Documents Free →
              </button>
            </Link>
            <p className="mt-4 text-stone-500 text-sm">No credit card required to start.</p>
          </div>
        </div>
      </section>

      {/* Ideal For + Permit Notes */}
      <section className="py-20 px-6 bg-amber-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Ideal For</p>
            <h3 className="text-2xl font-black text-stone-900 mb-6">Who Builds {data.label}s?</h3>
            <ul className="space-y-3">
              {data.idealFor.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-amber-600 font-black mt-0.5 shrink-0">→</span>
                  <span className="text-stone-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Permits & Codes</p>
            <h3 className="text-2xl font-black text-stone-900 mb-6">What to Know About Permitting</h3>
            <p className="text-stone-600 leading-relaxed">{data.permitNotes}</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">FAQ</p>
            <h2 className="text-4xl font-black text-stone-900">
              Common Questions About {data.label}s
            </h2>
          </div>
          <div className="space-y-6">
            {data.faqs.map((faq) => (
              <div key={faq.q} className="border border-stone-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-3">{faq.q}</h3>
                <p className="text-stone-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-28 px-6 overflow-hidden bg-stone-950 text-white">
        <div
          className="absolute top-0 left-0 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top left, rgba(217,119,6,0.15) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Get Started Free</p>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Ready to Start Your<br />
            <span className="text-amber-400">{data.label} Documents?</span>
          </h2>
          <p className="text-stone-400 text-lg mb-10 max-w-xl mx-auto">
            Answer a few guided questions and get professional construction documents — blueprints, material lists, spec sheets, and bid packages — ready in an afternoon.
          </p>
          <Link href="/register">
            <button className="bg-amber-600 hover:bg-amber-500 text-white font-black text-xl px-12 py-5 rounded-2xl shadow-2xl transition-all duration-200">
              Create Free Account →
            </button>
          </Link>
          <p className="mt-5 text-stone-500 text-sm">Free to start. No commitment. Save and return anytime.</p>
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
