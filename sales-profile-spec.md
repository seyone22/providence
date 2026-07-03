# Sales Profile Landing Pages — Spec & Content Pack

> Feature branch: `sales-profile` (based on `uk-cost-calculator` HEAD; rebase or merge that branch before PR).
> Authored with Fable 5 as the design/content phase. Implementation continues from this document.

## 1. What we're building

A personal landing page for each Sales team member (`/team/[slug]`) that promotes them as a
named specialist, introduces their personality/experience/expertise/sourcing countries, showcases
vehicles they pick from the gallery, and captures inquiries that are assigned **directly to them**
(bypassing round-robin). Plus a private "My Profile" editor and a "My Stats" dashboard section.

Sample page ships for **Abdallah** at `/team/abdallah`.

---

## 2. Public page — `/team/[slug]` (route group `(marketing)`)

Sections top to bottom. All content is editable via the My Profile editor; copy below is the
Abdallah launch content.

### 2.1 Hero — "the handshake"
- Large portrait photo (left/overlap), Providence Auto badge ("Providence Auto · Personal Sourcing Consultant")
- Name + headline + one-line tagline
- Quick-fact chips: years of experience · languages · sourcing countries (flag row)
- Two CTAs: **"Message me on WhatsApp"** (wa.me deep link) and **"Start an inquiry"** (smooth-scroll to form)
- Small trust line: "Backed by Providence Auto — UK-registered vehicle sourcing & export"

### 2.2 About / "Who you're dealing with"
- 2–3 paragraph personal bio (personality-forward, first person)
- Portrait or candid secondary photo
- Signature-style sign-off with name

### 2.3 Expertise — "What I'm good at"
- 4 icon cards (same visual grammar as `valueProps` in `src/config/landing-pages.ts`)

### 2.4 Sourcing countries — "Where I source from"
- Card/flag grid: country, flag, one-sentence note on the member's edge in that market

### 2.5 Track-record strip (public vanity stats — manually entered, NOT live DB numbers)
- e.g. "120+ cars delivered · 14 countries · <1 hr avg. response" — three editable stat fields
- These are marketing claims the member maintains themselves; do not wire to live data

### 2.6 Featured vehicles — "Cars I'm sourcing right now"
- Grid of SpecDossier cards chosen by the member from the gallery list (picker in the editor)
- Each card links to the existing `/b2c/gallery/[id]` detail page
- Empty state: hide the section entirely

### 2.7 Testimonials — "Clients I've helped"
- 2–3 review cards (name, title line, text, stars) — editable list, same style as campaign reviews

### 2.8 Inquiry form — "Work with {firstName} directly"
- Embeds the existing `<RequestForm />` with a new `assignedAgentId` prop (see §4)
- Header copy makes the direct-assignment promise explicit: "Your inquiry comes straight to me — no queue, no handoffs."

### 2.9 Footer trust strip
- Providence branding, link back to main site, standard footer

### SEO / meta
- Title: `{Name} — Personal Car Sourcing Consultant | Providence Auto`
- Description built from headline + sourcing countries
- Add published profiles to `src/app/sitemap.ts`

---

## 3. Data model — `src/models/SalesProfile.ts`

```ts
SalesProfile {
  userId: ObjectId (ref "user", unique, required)   // Better-Auth user, role must be Sales/admin
  slug: string (unique, required, kebab-case)       // "abdallah"
  isPublished: boolean (default false)

  displayName: string
  headline: string                                  // hero H1 support line
  tagline: string                                   // one-liner under headline
  bio: string                                       // long text, paragraphs split on \n\n
  photoUrl: string                                  // R2/S3 upload (reuse existing upload path)
  coverImageUrl: string

  yearsExperience: number
  languages: string[]
  expertise: [{ icon: string, title: string, desc: string }]     // icon = lucide icon name
  sourcingCountries: [{ country: string, flag: string, note: string }]
  trackRecord: [{ value: string, label: string }]                // max 3, vanity stats
  testimonials: [{ name: string, title: string, text: string, rating: number }]

  featuredDossierIds: ObjectId[] (ref SpecDossier)  // picked from gallery list
  whatsappNumber: string                            // prefill from user.whatsappNumber
  timestamps: true
}
```

---

## 4. Lead assignment — direct-to-owner

Changes in `src/actions/request-actions.ts` (`submitCarRequest`):

1. New optional input `assignedAgentId?: string`.
2. **Validate server-side**: it must resolve to a user with `role: "Sales"` (or admin). If invalid → fall back to round-robin. Never trust the client value blindly.
3. When direct-assigned, store `assignmentMethod: "direct"` on the Request (new field, default `"round-robin"`).
4. **Round-robin fix**: the rotation anchor currently reads the single most recent request
   (`request-actions.ts:90`). Change it to the most recent request where
   `assignmentMethod !== "direct"`, otherwise profile-page leads would skew the rotation
   (the next round-robin lead would continue from the profile owner's position).
5. The existing update path (`data.id` present) already preserves assignment — no change.

Changes in `src/components/requestForm.tsx`:
- New prop `assignedAgentId?: string`, passed through to `submitCarRequest`.
- `pathnameToSource()` (line 663): add `if (slug.startsWith("team/")) return "My Profile Page";`
  — this is the label that shows in the existing per-lead landing-page feature. (All member
  pages share the label by design, per product decision; the lead is always assigned to the
  page owner so "My Profile Page" reads correctly in *their* lead list.)

---

## 5. Server actions — `src/actions/sales-profile-actions.ts`

| Action | Auth | Purpose |
|---|---|---|
| `getPublishedProfileBySlug(slug)` | public | Page data + populated featured dossiers (published dossiers only) |
| `getMyProfile()` | session (Sales/admin) | Load own profile for the editor, create-on-first-open |
| `updateMyProfile(input)` | session, **owner only** | Upsert own profile; admins may edit any by `userId` |
| `listGalleryForPicker()` | session | Minimal dossier list (id, make, model, year, heroImageUrl, status) for the vehicle picker |
| `getMyStats()` | session | Aggregates below, always filtered `assignedToId = session.user.id`, `isDraft: { $ne: true }` |

Slug rules: unique, kebab-case, reserved words blocked (`admin`, `api`, `request`, ...). Editing
your slug 404s old links — warn in the editor.

---

## 6. "My Profile" editor + "My Stats" — admin area

New page `/admin/my-profile` (linked from the admin sidebar for Sales users; keep `/admin/me` as-is).
Two tabs:

### Tab 1 — My Profile (editor)
- All §3 fields as a form; photo upload; expertise/testimonial/country repeaters
- **Vehicle picker**: searchable modal listing gallery dossiers (`listGalleryForPicker`), multi-select, drag-to-reorder
- Publish toggle + "View my page" button (pattern exists in the spec builder, commit `fde665a`)
- Copy-link button for sharing (`https://…/team/abdallah`)

### Tab 2 — My Stats (live numbers, owner-scoped)
Stat cards:
1. **Assigned leads** — total + this month (`assignedToId = me`)
2. **Action required** — count where `leadStatus === "Action required"` (the schema default → these are untouched leads)
3. **Follow-ups due** — `followUpAt <= now` (overdue) and due today
4. **Pipeline value** — sum of `agreedPrice` across my leads
5. **In transit** — my leads with status `Shipped` / `Cleared Customs`
6. **Closed / delivered** — my leads in terminal success status

Breakdown widget: **Inquiries by landing page** — group my leads by `source` label
(bar list: "My Profile Page", "Home Page", "Campaign: …", etc.). This reuses the existing
per-lead landing-page data; the member's own page appears as **"My Profile Page"**.

---

## 7. Files to touch (implementation checklist)

- [ ] `src/models/SalesProfile.ts` — new model (§3)
- [ ] `src/models/Request.ts` — add `assignmentMethod` field
- [ ] `src/actions/sales-profile-actions.ts` — new actions (§5)
- [ ] `src/actions/request-actions.ts` — direct assignment + round-robin anchor fix (§4)
- [ ] `src/components/requestForm.tsx` — `assignedAgentId` prop + "My Profile Page" source label (§4)
- [ ] `src/app/(marketing)/team/[slug]/page.tsx` — public page (§2), plus section components
- [ ] `src/app/admin/my-profile/page.tsx` — editor + stats tabs (§6)
- [ ] Admin sidebar/nav — add "My Profile" entry for Sales role
- [ ] `src/app/sitemap.ts` — published profiles
- [ ] Seed Abdallah's profile with the content pack below (script or editor)

---

## 8. Abdallah — launch content pack

> Placeholders marked ⚠️ need real values from Abdallah before publish. Testimonials and
> track-record figures below are **launch placeholders in house style** — replace with real
> ones via the editor before heavy promotion.

**Slug:** `abdallah` · **Display name:** Abdallah ⚠️(surname?) · **WhatsApp:** ⚠️ · **Photo:** ⚠️

**Meta title:** `Abdallah — Personal Car Sourcing Consultant | Providence Auto`
**Meta description:** `Work directly with Abdallah, Providence Auto's sourcing consultant for Japan, India and the UK. Grade-verified cars, one honest landed price, and one person handling your import end to end.`

### Hero
- Tagline chip: `Providence Auto · Personal Sourcing Consultant`
- H1: `Your car, sourced by someone\nwho picks up the phone.`
- Sub: `I'm Abdallah. I find, verify and land cars from Japan, India and the UK for clients who want a specialist on their side — not a ticket number.`
- Chips: `7+ years in vehicle sourcing` ⚠️ · `English · Arabic` ⚠️ · 🇯🇵 🇮🇳 🇬🇧 🇦🇪
- CTA 1: `Message me on WhatsApp` · CTA 2: `Start an inquiry`

### About (first person)
> Most people buy a car from a listing. My clients buy from a person.
>
> I started in this trade because I watched too many buyers get burned by photos that hid rust and "clean" cars with rolled-back odometers. Seven years later, I've built my reputation on one habit: I never ask a client to pay for a car I wouldn't buy myself. If the auction sheet doesn't add up, I walk away — and I tell you why.
>
> When you send an inquiry through this page, it doesn't go into a pool. It comes to my phone, and I answer it personally — usually within the hour. From the first search to the day your car clears customs, you deal with one person: me.
>
> — Abdallah

### Expertise cards
1. **FileSearch · Auction-Sheet Literacy** — "I read Japanese auction grade sheets daily and translate what they actually mean for you — grade, repair history, the notes other importers skim past."
2. **Handshake · Straight-Talk Negotiation** — "I bid with your ceiling, not mine. If the car runs past its value, I let it go and find the next one — there is always a next one."
3. **Landmark · Landed-Cost Clarity** — "One all-in figure — car, freight, insurance, duty and VAT — before you commit a penny. The price I quote is the price you pay."
4. **Ship · Door-to-Door Ownership** — "I stay on your file through shipping, customs and registration. You get milestone updates from me, not a tracking portal."

### Sourcing countries
- 🇯🇵 **Japan** — "Grade-verified auction cars — my home turf. Low mileage, honest history, wholesale pricing."
- 🇮🇳 **India** — "Factory-fresh value through Providence's direct dealer network — the same badges for ~30% less."
- 🇬🇧 **United Kingdom** — "Right-hand-drive stock and UK-market specials, sourced and inspected before export."
- 🇦🇪 **UAE** ⚠️(confirm) — "GCC-spec cars and re-exports through Dubai's trade hubs."

### Track-record strip ⚠️(replace with real figures)
`120+ cars delivered` · `14 countries served` · `< 1 hr avg. first response`

### Testimonials ⚠️(placeholders, house style)
1. **Omar R.** — *"He talked me out of the first car."* — "The auction grade looked fine to me, but Abdallah spotted repair notes on the sheet and refused to bid. The car he found a week later was better and cheaper. That's whose hands you want your money in." ★5
2. **Ciara N.** — *"One person, start to finish."* — "Every question — shipping, VAT, registration in Ireland — answered by the same person on WhatsApp, usually in minutes. My Swace landed exactly on the quoted price." ★5
3. **Yusuf A.** — *"Felt like having a friend in the trade."* — "Abdallah sent me videos from the yard before shipping and flagged a scratch I'd never have seen. Second car already on the way." ★5

### Inquiry form header
- H2: `Work with Abdallah directly`
- Sub: `This form comes straight to me — no queue, no handoffs. Tell me what you're looking for and I'll come back with real options and a full landed price.`

### Featured vehicles
Pick 3–6 published dossiers via the editor at launch (suggest: mix of Japan auction + India-built stock).
