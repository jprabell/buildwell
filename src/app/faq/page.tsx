import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Buildwell | Construction Documents & Building Plans",
  description:
    "Frequently asked questions about Buildwell — professional construction documents, material lists, vendor spreadsheets, and planning reports for DIY builders and contractors.",
  keywords: [
    "construction planning documents",
    "building material list",
    "contractor bid package",
    "DIY building plans",
    "construction spec sheet",
    "preferred vendor list contractors",
    "custom home building documents",
    "pole barn construction documents",
  ],
};

const FAQ_SECTIONS = [
  {
    heading: "About Buildwell",
    questions: [
      {
        q: "What is Buildwell?",
        a: "Buildwell is an online platform that generates professional construction documents for anyone building a structure — from backyard sheds and garages to pole barns, log cabins, barndominiums, and custom homes. You answer questions about your project, and Buildwell produces print-ready documents that you'd otherwise pay an architect or consultant thousands of dollars to prepare.",
      },
      {
        q: "Who is Buildwell for?",
        a: "Buildwell is built for owner-builders, DIY enthusiasts, general contractors, and developers who want professional documentation without the overhead of hiring a full design team. If you're planning a build and need organized, credible paperwork — material lists, bid packages, vendor spreadsheets, or planning reports — Buildwell produces them instantly.",
      },
      {
        q: "Do I need construction experience to use Buildwell?",
        a: "No. The design questionnaire is written in plain language and guides you step by step through your project details — square footage, structure type, materials, site conditions, and more. Buildwell handles the translation from your answers into professional documentation.",
      },
    ],
  },
  {
    heading: "Documents & What You Get",
    questions: [
      {
        q: "What documents does Buildwell generate?",
        a: "Buildwell currently offers five documents per project: (1) Construction Planning Report — a full room schedule, structural summary, systems overview, material selections, and code compliance checklist; (2) Material List & Spec Sheet — a line-item list of every material needed, organized by CSI division with quantities and specifications; (3) Spec Tier Summary — a tiered comparison of budget, standard, and premium material options for every major category; (4) Preferred Vendor List — a printable contractor spreadsheet with three local contractors per trade, pre-filled from Google Places data; (5) Contractor Bid Package — formatted scope-of-work sections for soliciting competitive bids from licensed contractors.",
      },
      {
        q: "Are these real blueprints or architectural drawings?",
        a: "Buildwell documents are professional planning and procurement documents — not stamped architectural or structural drawings. They are the same category of paperwork a knowledgeable general contractor would hand a sub, a homeowner would use to organize a build, or a developer would use to kick off bid solicitation. For permitted structures that require stamped drawings, you will still need a licensed architect or engineer in your jurisdiction — Buildwell's documents complement and accelerate that process.",
      },
      {
        q: "What can I actually use these documents for?",
        a: "Common uses include: (1) soliciting competitive bids from subcontractors using the Contractor Bid Package; (2) ordering materials with confidence using the Material List; (3) comparing material quality levels with the Spec Tier Summary; (4) calling local contractors using the Preferred Vendor List spreadsheet; (5) presenting a project plan to a lender, partner, or municipality using the Planning Report; (6) staying organized across a multi-trade build.",
      },
      {
        q: "How accurate are the material quantity estimates?",
        a: "Material quantities are calculated from your project's square footage, structure type, foundation type, number of stories, and other answers you provide. Estimates include standard industry waste factors (typically 10–15% for framing lumber, sheathing, and finish materials). All documents include a disclaimer noting that quantities should be verified by a licensed contractor before final ordering. Treat them as a strong planning baseline, not a guaranteed takeoff.",
      },
      {
        q: "What structure types are supported?",
        a: "Buildwell supports 16 structure types: Single-Family Home, Container Home, Tiny Home, Barndominium, Barn, Pole Barn, Log Cabin, A-Frame, Dome Home, Quonset Hut, Silo Conversion, Shed, Workshop, Garage, Earthship, and Passive Solar Home. Each structure type generates trade sequences and material lists specific to its construction method.",
      },
    ],
  },
  {
    heading: "Pricing & Payment",
    questions: [
      {
        q: "How does pricing work?",
        a: "Creating a project and previewing documents is always free — no credit card required. Each document is purchased individually when you're ready: Construction Planning Report ($250), Material List & Spec Sheet ($100), Spec Tier Summary ($75), Preferred Vendor List ($40), Contractor Bid Package ($250). You only pay for the documents you actually need.",
      },
      {
        q: "Is there a subscription or recurring charge?",
        a: "No. Buildwell is entirely pay-per-document. There are no monthly fees, no subscriptions, and no hidden charges. You create your project for free, preview each document, and purchase only what you want to keep.",
      },
      {
        q: "What payment methods are accepted?",
        a: "Payments are processed securely through Stripe. All major credit and debit cards are accepted (Visa, Mastercard, American Express, Discover). Apple Pay and Google Pay are supported where available.",
      },
      {
        q: "Do you offer refunds?",
        a: "Because documents are generated and delivered instantly upon purchase, all sales are final. If you believe there is a material error in a document — incorrect structure type applied, wrong square footage used, etc. — contact support at hello@ibuildwell.com and we will review it and make it right.",
      },
    ],
  },
  {
    heading: "The Preferred Vendor List",
    questions: [
      {
        q: "How does the Preferred Vendor List work?",
        a: "After purchasing the Vendor List ($40), Buildwell queries Google Places for up to 3 local contractors per trade in your project's location — using the ZIP code or state you entered during design. The spreadsheet is pre-filled with contractor name, phone number, address, and Google rating, and is print-ready for your records. A notes column is included for writing in your own bid amounts and impressions.",
      },
      {
        q: "Are the contractors vetted or endorsed by Buildwell?",
        a: "No. Contractor data is sourced directly from Google Places and is provided for reference and convenience only. Buildwell does not vet, endorse, or guarantee any contractor listed. Always verify licensing, insurance, and references independently before signing any contract. Obtain at least 3 competitive bids per trade.",
      },
      {
        q: "What if there is no ZIP code on my project?",
        a: "If your project has a state but no ZIP code, contractor results are broadened to your state. If neither is on file, the search uses a general 'near me' query. For the most precise local results, add your 5-digit ZIP code in your project design answers.",
      },
    ],
  },
  {
    heading: "Account & Project Management",
    questions: [
      {
        q: "Do I need an account to use Buildwell?",
        a: "You need a free account to create a project and generate documents. Registration takes under a minute and requires only an email address and password. No credit card is required to sign up or preview documents.",
      },
      {
        q: "Can I have multiple projects?",
        a: "Yes. Your dashboard can hold multiple projects simultaneously — useful if you're planning several structures or comparing design options. Each project generates its own set of documents based on its specific answers.",
      },
      {
        q: "Can I edit my project answers after creating the project?",
        a: "Yes. You can update your project's design answers at any time from the project page. Documents re-generate based on your latest answers. Note that if you have already purchased a document, the purchased version remains accessible — regenerated content reflects any new answers going forward.",
      },
      {
        q: "Is my data secure?",
        a: "Yes. Project data is stored in a secured database accessible only to your account. Payments are handled entirely by Stripe — Buildwell never sees or stores your card details. Accounts are protected by hashed passwords and authenticated sessions.",
      },
    ],
  },
  {
    heading: "Technical & Compatibility",
    questions: [
      {
        q: "Can I print the documents?",
        a: "Yes. Every document page includes a print button that triggers an optimized print layout — letterhead, clean formatting, no navigation chrome. Documents are designed to print cleanly on standard US Letter paper.",
      },
      {
        q: "Can I export to PDF?",
        a: "You can save any document as a PDF using your browser's native Print → Save as PDF function. Dedicated PDF export is on the product roadmap.",
      },
      {
        q: "What browsers are supported?",
        a: "Buildwell works in all modern browsers: Chrome, Firefox, Safari, and Edge. Mobile browsing is supported for reviewing documents, though the full desktop experience is recommended for printing and working with spreadsheet-style tables.",
      },
    ],
  },
];

export default function FAQPage() {
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
            <Link href="/#structures" className="hover:text-amber-600 transition-colors">Structures</Link>
            <Link href="/#documents" className="hover:text-amber-600 transition-colors">Documents</Link>
            <Link href="/#how-it-works" className="hover:text-amber-600 transition-colors">How It Works</Link>
            <Link href="/faq" className="text-amber-600 font-semibold">FAQ</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors px-3 py-1.5">
              Sign In
            </Link>
            <Link href="/register" className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-stone-900 to-stone-800">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Help Center</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-300 text-lg leading-relaxed">
            Everything you need to know about Buildwell — professional construction documents for DIY builders and contractors.
          </p>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-white border-b border-stone-200 px-6 py-4 sticky top-[69px] z-40">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-2 justify-center">
          {FAQ_SECTIONS.map((section) => (
            <a
              key={section.heading}
              href={`#${section.heading.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`}
              className="text-xs font-semibold text-stone-500 hover:text-amber-600 hover:bg-amber-50 border border-stone-200 px-3 py-1 rounded-full transition-colors"
            >
              {section.heading}
            </a>
          ))}
        </div>
      </section>

      {/* FAQ Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        {FAQ_SECTIONS.map((section) => (
          <section
            key={section.heading}
            id={section.heading.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}
            className="mb-16 scroll-mt-32"
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-6 flex items-center gap-3">
              <span className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              {section.heading}
              <span className="flex-1 h-px bg-gradient-to-l from-amber-200 to-transparent" />
            </h2>

            <div className="space-y-4">
              {section.questions.map((item, i) => (
                <details
                  key={i}
                  className="group bg-white border border-stone-200 rounded-2xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-stone-50 transition-colors">
                    <span className="font-bold text-stone-900 text-sm pr-4">{item.q}</span>
                    <span className="shrink-0 w-6 h-6 rounded-full bg-stone-100 group-open:bg-amber-100 flex items-center justify-center text-stone-400 group-open:text-amber-600 transition-colors font-bold text-sm">
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-1 border-t border-stone-100">
                    <p className="text-sm text-stone-600 leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="bg-stone-900 rounded-3xl p-10 text-center mt-8">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Ready to Build?</p>
          <h2 className="text-2xl font-black text-white mb-3">Start your project free</h2>
          <p className="text-stone-400 text-sm mb-6 max-w-sm mx-auto">
            No credit card required. Create your project, preview every document, and purchase only what you need.
          </p>
          <Link href="/register">
            <button className="bg-amber-600 hover:bg-amber-500 text-white font-black px-8 py-3 rounded-2xl text-base transition-colors">
              Get Started Free →
            </button>
          </Link>
          <p className="text-stone-500 text-xs mt-3">
            Still have questions?{" "}
            <a href="mailto:hello@ibuildwell.com" className="text-amber-400 hover:text-amber-300">
              hello@ibuildwell.com
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 px-6 py-8 text-center">
        <p className="text-stone-500 text-xs">
          © {new Date().getFullYear()} Buildwell LLC · ibuildwell.com ·{" "}
          <Link href="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link>
          {" · "}
          <a href="mailto:hello@ibuildwell.com" className="hover:text-amber-400 transition-colors">Contact</a>
        </p>
      </footer>
    </div>
  );
}
