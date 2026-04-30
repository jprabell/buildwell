@AGENTS.md

# Buildwell — Claude Project Memory

This file is the permanent brain for this project. Read it fully at the start of every session. Update it whenever significant decisions, new features, or architectural changes are made.

---

## 1. What Buildwell Is

**Buildwell** (ibuildwell.com) is an AI-powered construction planning platform that helps homeowners, DIY builders, and contractors go from idea to a fully documented build plan in minutes.

Users answer a guided questionnaire about their project → Buildwell generates professional-grade construction documents instantly.

**The founder** has 25+ years in construction across Hawaii, California, Vermont, Canada, and Mexico. He built this to solve the #1 problem he watched slow every project: people not knowing where to start or what documents they need.

**Core promise:** On time. Under budget. Ecstatic customer.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) — read AGENTS.md before writing any Next.js code |
| Language | TypeScript |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | NextAuth.js (credentials provider) |
| Styling | Tailwind CSS only — no custom CSS, no CSS modules |
| Payments | Stripe (currently test mode keys) |
| Email | Resend (`noreply@ibuildwell.com`) |
| Contractor Data | Google Places API (New) — `places.googleapis.com/v1/places:searchText` |
| Hosting | Netlify (auto-deploys from GitHub `main` branch) |
| Repo | https://github.com/jprabell/buildwell.git |

**Always commit and push after every code change.** Netlify auto-deploys on push to `main`. Never leave changes uncommitted.

---

## 3. Database Schema (Prisma)

### Models
- **User** — email + hashed password, owns many Projects
- **Project** — core model; has `structureType`, `status`, `answers` (JSON blob storing all questionnaire answers + `_purchases` array + `_quotes` map)
- **ProjectVersion** — snapshot history of project answers
- **BidInvitation** — contractor bid requests sent via email, unique token per invite, stores submitted bid data
- **BlueprintOrder** — permit-ready blueprint orders with Stripe checkout, tier (spec/permit), status workflow, file delivery

### Key JSON fields in `Project.answers`
- `_purchases: string[]` — tracks what the user has bought (e.g. `"blueprint_set"`, `"material_list"`, `"quote_package"`, `"vendor_list"`)
- `_quotes: QuoteMap` — saved contractor bid comparison board data
- `_contractorNames: [string, string, string]` — names for bid comparison board columns
- `_aiFloorPlan: { status, runId, prompt, result?: { imageUrl, summary, ... } }` — cached Apify AI floor plan generation state
- `zipCode`, `state`, `city` — location data
- `squareFootage` / `squareFeet` — project size
- `bedrooms`, `bathrooms`, `foundation`, `architecturalStyle`, etc.

### StructureTypes
`SINGLE_FAMILY_HOME`, `CONTAINER_HOME`, `BARNDOMINIUM`, `BARN`, `LOG_CABIN`, `A_FRAME`, `SHED`, `WORKSHOP`, `GARAGE`, `TINY_HOME`, `DOME_HOME`, `QUONSET_HUT`, `SILO`, `POLE_BARN`, `EARTHSHIP`, `PASSIVE_SOLAR`

---

## 4. Key Business Logic

### Document Products
Four purchasable documents per project (currently **FREE during beta**):

| Document | Route | Purchase Key | Price (post-beta) |
|---|---|---|---|
| Construction Planning Report + Floor Plan | `/projects/[id]/preview/blueprint_set` | `blueprint_set` | $250 |
| Material List + Spec Sheet | `/projects/[id]/material-list` | `material_list` | $100 |
| Contractor Bid Package | `/projects/[id]/preview/quote_package` | `quote_package` | $250 |
| Preferred Vendor List | `/projects/[id]/contractors` | `vendor_list` | $40 |

### Beta Free Access
All 4 document pages currently have:
```ts
const purchased = true || purchases.includes("...");
```
**To re-enable paid access:** remove `true ||` from each page. Files:
- `src/app/(dashboard)/projects/[id]/preview/blueprint_set/page.tsx`
- `src/app/(dashboard)/projects/[id]/material-list/page.tsx`
- `src/app/(dashboard)/projects/[id]/preview/quote_package/page.tsx`
- `src/app/(dashboard)/projects/[id]/contractors/page.tsx`

### Beta Disclaimer
Every document page shows an amber banner: **"BETA — AI-Generated · Still Being Fine-Tuned · NOT FOR CONSTRUCTION"**
This appears both on-screen and on print. Keep this until beta ends.

### Blueprint Orders (Premium)
Separate from the $250 blueprint_set document — this is a paid AI architect service:
- **Spec-Grade** ($699) — AI-generated floor plans, elevations, sections, site plan. PDF + DWG. 3–5 business days.
- **Permit-Ready** ($1,499) — Everything above + licensed architect stamp. 7–10 business days.

Flow: questionnaire → Stripe checkout → `blueprint-success` page marks PAID → admin email sent → admin submits to AI service → files uploaded via `PATCH /api/blueprints/[orderId]` → user notified.

### Contractor Bid System
- `SendBidButton` emails a unique bid portal link to a contractor
- Contractor fills out bid at `/bid/[token]`
- Submitted bids appear in the Quote Package under each trade section
- `BidInvitation` model tracks status and all bid data

### Preferred Vendor List
Uses Google Places API (New) to find 3 local contractors per trade based on the project's ZIP code. Requires `GOOGLE_PLACES_API_KEY`. Falls back to empty rows with "Contractor Data Pending" message if key is missing.

---

## 5. Key Library Files

| File | Purpose |
|---|---|
| `src/lib/contractorTrades.ts` | Trade lists per structure category (Civil, Structural, Envelope, MEP, Interior, Design) with budget %, license requirements, search keywords |
| `src/lib/googlePlaces.ts` | `geocodeZip()` + `findContractors()` — Google Places API integration |
| `src/lib/materialCalculator.ts` | Generates Material List line items from project answers |
| `src/lib/bidPackageSpecs.ts` | Generates trade-specific material specs for the Bid Package |
| `src/lib/planningReport.ts` | Generates the full Construction Planning Report (rooms, structural, MEP, code checklist, etc.) |
| `src/lib/floorPlanSVG.ts` | Generates the schematic floor plan SVG from room data (fallback while AI plan generates) |
| `src/lib/apifyFloorPlan.ts` | Apify AI Floor Plan integration — `buildFloorPlanPrompt()` + `startApifyFloorPlanRun()` + `checkApifyFloorPlanRun()` |
| `src/lib/structures.ts` | `STRUCTURE_OPTIONS` array with labels and values |
| `src/lib/questions.ts` | Questionnaire question definitions |
| `src/lib/auth.ts` | NextAuth configuration |
| `src/lib/db.ts` | Prisma client singleton |

---

## 6. API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/projects/[id]` | GET/PUT | Get/update project |
| `/api/projects/[id]/blueprints` | GET/POST | Get latest blueprint order / create + Stripe checkout |
| `/api/projects/[id]/send-bid` | POST | Send bid invitation email to contractor |
| `/api/projects/[id]/quotes` | PATCH | Save bid comparison board data |
| `/api/projects/[id]/material-list` | GET | Generate material list data |
| `/api/projects/[id]/ai-floor-plan` | POST/GET/DELETE | Start AI floor plan run (POST), poll status (GET), clear cache (DELETE). Caches result in `answers._aiFloorPlan` |
| `/api/blueprints/[orderId]` | GET/PATCH | Get order status / admin upload files (requires BLUEPRINT_ADMIN_SECRET) |
| `/api/webhooks/blueprint-complete` | POST | AI service webhook to mark order complete (requires BLUEPRINT_WEBHOOK_SECRET) |
| `/api/checkout` | POST | Create Stripe checkout session for document purchases |
| `/api/bid/[token]` | GET/POST | Get bid invitation / submit contractor bid |

---

## 7. Environment Variables

| Variable | Purpose | Status |
|---|---|---|
| `DATABASE_URL` | Supabase pooled connection | ✅ Set |
| `DIRECT_URL` | Supabase direct connection (migrations) | ✅ Set |
| `NEXTAUTH_SECRET` | NextAuth signing key | ⚠️ Still default placeholder — change in production |
| `NEXTAUTH_URL` | `https://ibuildwell.com` | ✅ Set |
| `STRIPE_SECRET_KEY` | Stripe test key | ✅ Set (test mode) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable test key | ✅ Set (test mode) |
| `GOOGLE_PLACES_API_KEY` | Google Places + Geocoding API | ✅ Set on Netlify |
| `RESEND_API_KEY` | Resend email service | ✅ Set on Netlify |
| `BLUEPRINT_ADMIN_SECRET` | Protects admin blueprint upload endpoint | ✅ Set on Netlify |
| `BLUEPRINT_WEBHOOK_SECRET` | Protects AI service webhook | ✅ Set on Netlify |
| `BLUEPRINT_ADMIN_EMAIL` | Where blueprint order notifications go | ✅ Set on Netlify |
| `APIFY_API_TOKEN` | Apify AI Floor Plan actor (`calm_necessity/ai-floor-planner`) | ⚠️ Needs to be set on Netlify |

**Note:** `NEXTAUTH_SECRET` should be changed to a proper random string before going fully live.
**Note:** Stripe is still on test keys — switch to live keys when ready to take real payments.

---

## 8. Design System

### Color Palette
- **Primary:** `amber-600` / `amber-500` (hover) — buttons, accents, highlights
- **Background dark:** `stone-950`, `stone-900` — hero sections, dark cards
- **Background light:** `white`, `stone-50` — content sections
- **Text primary:** `stone-900` — headings on white
- **Text secondary:** `stone-500`, `stone-600` — body text
- **Text on dark:** `white`, `stone-300`, `stone-400`
- **Danger:** `rose-600`
- **Success:** `green-600`

### Typography
- Headings: `font-black` always
- Subheadings: `font-bold`
- Body: default weight or `font-medium`
- Labels/badges: `text-xs font-bold uppercase tracking-widest`

### Component Patterns
- Cards: `bg-white border border-stone-200 rounded-2xl` (light) or `bg-stone-900 border border-stone-800 rounded-2xl` (dark)
- Primary button: `bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl transition-all duration-200`
- Ghost button: `text-stone-600 hover:text-amber-600 font-semibold transition-colors`
- Section badges: `inline-flex items-center bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5` with `text-amber-700 text-xs font-bold uppercase tracking-widest`
- Inputs: always include `text-stone-900` to prevent white text inheritance issues

### Page Structure Pattern
1. Fixed nav (`z-50 bg-white/95 backdrop-blur border-b`)
2. Hero section (dark `bg-stone-950` with radial amber glow gradients)
3. Content sections alternating white / stone-50
4. CTA section (dark `bg-stone-950` with radial glow)
5. Footer (`bg-stone-950 border-t border-stone-900`)

### "Flashier" Design Direction
The site should feel premium, bold, and confident — not corporate. Use:
- Large bold numbers and stats
- Radial amber glow gradients on dark backgrounds
- Hover scale effects (`hover:scale-105`) on CTAs
- Animated pulse dots on status badges
- Gradient text for hero headlines (`bg-clip-text text-transparent`)
- Dark cards with subtle amber border on hover

---

## 9. Brand Voice

- **Confident, not arrogant** — "I've done this for 25 years and I know what works"
- **Plain-spoken** — no jargon, no fluff. Say exactly what you mean
- **Founder-led** — personal, human, real. This is one person who's been on job sites
- **Empowering** — the user is capable; Buildwell just gives them the tools
- **No hedging** — don't say "might" or "could" — say "will" and "does"

**Tagline energy:** "Stop planning to plan. Start building."

---

## 10. Founder Personal Details (for About page / marketing)

- 25+ years in construction
- Worked with largest home builders + commercial contractors in the country
- Job sites: Hawaii, California, Vermont, Canada, Mexico
- Faith-driven (Christian), family first
- Wife and kids
- Two golden retrievers ("The Golden Girls")
- Believes in traveling smart, not expensively
- Core philosophy: On time. Under budget. Ecstatic customer.

---

## 11. Current State (Beta)

- **All documents are FREE** — beta access, no payment required
- **BETA banners** on all 4 documents — "Not for Construction"
- **Stripe is in test mode** — no real charges
- **Resend domain** (`ibuildwell.com`) — DNS records added to Squarespace, pending verification
- **Google Places API** — live on Netlify, vendor list pulling real contractors
- **Blueprint order system** — built and ready, admin workflow via email
- **Contractor portal** — built, bid invitations functional pending Resend verification

---

## 12. Known Issues / Next Steps

- [ ] `NEXTAUTH_SECRET` should be replaced with a proper random string
- [ ] Stripe needs to be switched to live keys when ready for real payments
- [ ] Resend domain needs to finish DNS verification (added, propagating)
- [ ] Floor plan SVG still needs improvement as the fallback (AI plan now overlays it via Apify integration)
- [ ] Google Places API key should be restricted in GCP to only Places + Geocoding APIs
- [ ] Premium Blueprint Orders ($699 / $1,499) still handled manually — Apify AI floor plan only powers the free `blueprint_set` document
- [ ] **APIFY_API_TOKEN must be set on Netlify** to enable AI floor plan generation. Without it, page shows the SVG only.

---

## 13. Deployment Workflow

1. Make code changes
2. `git add [files]`
3. `git commit -m "description"`
4. `git push origin main`
5. Netlify auto-deploys — live in ~1-2 minutes

**Always do this after every change. Never leave uncommitted work.**

If Prisma schema changes:
```bash
npx prisma db push
npx prisma generate
```

---

## 14. What NOT to Change Without Discussion

- The `AGENTS.md` Next.js rules — those are framework-level guardrails
- The Prisma schema — always discuss before adding/modifying models
- The `_purchases` array structure in `Project.answers` — payment logic depends on it
- Stripe product/price IDs — coordinate with live key migration
- The `purchased = true ||` beta override — leave the comment so it's easy to find and revert
