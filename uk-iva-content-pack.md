# UK IVA & Registration — Blog Content Pack

**Cluster:** `UK Registration & IVA` (new)
**Posts:** 6
**Published / updated date on all six:** 2026-09-01
**Every figure fact-checked against its primary source on 1 September 2026.**

This pack is the readable companion to the code. The live posts are database-free
— they are registry entries in `src/config/blog.ts` plus body components in
`src/content/blog/` — so this file is the version you can read, edit and send
without opening the repo.

| # | Slug | Primary keyword | Live at |
|---|---|---|---|
| 1 | `iva-test-explained` | iva test | `/blog/iva-test-explained` |
| 2 | `do-i-need-an-iva-test` | do i need an iva test | `/blog/do-i-need-an-iva-test` |
| 3 | `iva-test-cost` | iva test cost | `/blog/iva-test-cost` |
| 4 | `iva-test-requirements` | iva test requirements | `/blog/iva-test-requirements` |
| 5 | `iva-test-centres-uk` | iva test centres | `/blog/iva-test-centres-uk` |
| 6 | `registering-an-imported-car-in-the-uk` | registering an imported car uk | `/blog/registering-an-imported-car-in-the-uk` |

**Why a new cluster rather than the existing "United Kingdom" one.** That
cluster is about buying *from* Britain — where the stock is, how to read an MOT
history, what the origin rules do to your duty bill. These six are about
importing *into* Britain. Same country, different reader, different question.
The UK sits in two of our lists (source market and destination market), and this
cluster serves the second one.

---

## Part 1 — What we found on the news side

The brief asked whether there is anything new around IVA. There is, and it is
worth separating what actually changed from what the third-party guides claim
changed.

### Genuinely new, and confirmed

| Date | What | Source | Why it matters to a buyer |
|---|---|---|---|
| **14 Aug 2026** | Milton Keynes (Ship My Car) added to the IVA test centre list | GOV.UK, *IVA test centre locations*, updated 14 August 2026 | The newest passenger-car IVA site in the country, and it is an importer's own premises — the VEF model landing in practice |
| **4 Feb 2026** | DVSA announced a **Vehicle Examination Facility (VEF)** network for IVA and MSVA | DVSA *Moving On* blog, 4 February 2026 | Approval tests move to third-party sites with DVSA examiners visiting. Aimed squarely at the travel distance problem |
| **25 Feb 2026** | **MyVT** replaced TAS; DVSA reports a significant fall in rejected applications | DVSA *Moving On* blog, 25 February 2026 | Applications and card payments are online. Full migration completed March 2025; new digital application form from 16 June 2025 |
| **18 Nov 2025** | Noise testing for exhaust modifications over 2m in height added at Livingston, Avonmouth, Gillingham, Derby and Chadderton | GOV.UK test centre update log | Narrow, but relevant to modified 4x4 imports |

### Confirmed *non*-changes — which matter as much

- **IVA fees have not moved.** The GOV.UK page carrying DVSA's IVA fee tables
  for cars was last updated **13 December 2022**. £199 / £450 are still the
  published inspection fees. A good deal of 2026-dated web content quotes
  figures (£289–£741, "£456 for 2026") that do not appear in the published
  table.
- **The M1 inspection manual is unchanged since 14 July 2025.** The 2026 IVA
  manual updates that surface in search results are the **lorries and trailers**
  manuals (5 May 2026) and **buses and coaches** (20 July 2026), not cars.
- **The 10-year exemption is unchanged.**

### An inconsistency in DVSA's own documents, worth knowing about

The published *Individual Vehicle Approval scheme guide* was last updated
**25 March 2024** and still describes applying through the **Technical
Application System (TAS)**. TAS was fully replaced by MyVT in **March 2025**.
The guide remains the right reference for standards and model reports; its
application chapter is out of date.

### Deliberately *not* written up as a `/latest-news` story

Per `news-editorial-playbook.md`, a story publishes only if it changes price,
permission, tax or availability **and** changes reader behaviour — and
`/latest-news` is dated reporting. The freshest confirmed item here is
14 August 2026, and the substantive ones are February 2026. That is stale for a
news slot and perfect for an evergreen cluster, so the news has been folded into
the pillar post's "What changed in 2025 and 2026" section, dated and sourced,
rather than published as a backdated article.

**If you want a news piece:** the honest hook would be the VEF rollout reaching a
visible milestone — but it needs a second data point (a further site added, or
DVSA publishing rollout numbers) before it clears the relevance gate. Worth
re-checking the test centre list monthly; that page is the leading indicator.

---

## Part 2 — The posts

### 1 · IVA Explained: The UK Approval Test for Imported Cars

- **Slug:** `iva-test-explained`
- **H1:** What an IVA Test Is, and When an Imported Car Needs One
- **SEO title:** IVA Test Explained: UK Vehicle Approval for Imports *(51 chars)*
- **Meta description:** What Individual Vehicle Approval is, which imported cars need it, what DVSA inspects, what it costs and how long it takes — checked against GOV.UK on 1 September 2026.
- **Reading time:** 12 min

**Standfirst.** A car with no approval attached to it is, as far as the DVLA is
concerned, not a car yet. Individual Vehicle Approval is the inspection that
turns an imported vehicle into a registrable one — and knowing before you buy
whether your car needs it, and which version of it, is worth more than any other
single piece of information in a UK import.

**The short version**

- IVA is a construction test, not a roadworthiness test. DVSA inspects how the
  vehicle is built. The MOT is a separate question with a separate answer.
- Cars and minibuses of eight passenger seats or fewer that are over 10 years
  old need no approval at all.
- The published DVSA inspection fee for a car is £199 in working hours, with
  amateur-built and rebuilt vehicles at £450.
- DVSA aims to answer an application in 10 working days and offer an inspection
  within 20.
- You cannot use the car on the road until it is registered, with one exception:
  driving to a pre-booked MOT or approval test.

#### What an IVA actually is

Nearly every car sold new in Britain is covered by a **type approval** — an
approval granted once to a whole model, which every example of that model
inherits. It is why nobody inspects a new Golf individually.

Individual Vehicle Approval exists for the cars that fall outside that system.
GOV.UK lists five triggers: a vehicle that has been **built, rebuilt, radically
altered, reconstructed from a classic vehicle, or imported**. For our readers it
is nearly always the last one. A Japanese-market Alphard, a Gulf-spec Land
Cruiser, an Australian ute — none carries a British or European type approval,
because none was ever intended for this market.

DVSA inspects that individual car against British construction and environmental
standards. Pass, and it issues an **Individual Approval Certificate (IAC)**. The
DVLA will not register the vehicle without it, or without one of the
alternatives.

> **IVA is not the MOT, and the MOT is not IVA.** DVSA draws the line itself:
> the IVA inspection looks at the way your vehicle is constructed or adapted,
> while the annual MOT test looks at roadworthiness — and your vehicle might
> pass the MOT test without passing an IVA inspection. A sound car fails IVA on
> beam pattern, a missing rear fog lamp or a speedometer marked in km/h. None of
> those is an MOT failure.

#### Which cars need one

| The car | What it needs | Why |
|---|---|---|
| Import, under 10 years old, non-EU | Individual Vehicle Approval | No type approval covers it, and no exemption applies |
| Import, over 10 years old | No approval | Cars and minibuses of 8 seats or fewer over 10 years old are exempt |
| EU-registered, right-hand drive | European Certificate of Conformity | The EU approval is recognised; you just have to evidence it |
| EU-registered, left-hand drive | CoC plus GB conversion IVA certificate | The conversion for British use has to be certified — £100, no test |
| 2, 3 or small 4-wheeled vehicle | Motorcycle Single Vehicle Approval | A separate scheme with its own inspection |
| Already registered in the UK once | Voluntary IVA | GOV.UK: you cannot use the IVA scheme if the vehicle has been registered in the UK before |

That last row matters more than its size suggests. If a car has ever held a UK
registration — a re-import, a car exported and brought back — the IVA scheme is
closed to it, and voluntary IVA is the route instead, at a different fee and
with VAT on top.

#### Basic IVA and normal IVA

**Basic IVA** is a visual inspection and a set of tests, with no documentary
evidence normally needed. It is available to a passenger car or light goods
vehicle that is: left-hand drive; a personal import; amateur built (kit car);
rebuilt; very low volume production; an ambulance, motor caravan or hearse; an
armoured passenger vehicle; or manufactured using parts of a registered vehicle.

**Normal IVA** is everything else — a more detailed inspection, extra standards,
and documentary evidence you supply rather than simply presenting the car. A
right-hand-drive Japanese import bought as trade stock rather than as a personal
import is the common case.

> **Normal does not mean more expensive.** DVSA's published fee for a car
> inspection is £199 in working hours for *both* normal IVA and basic IVA in the
> low-volume, hearse, left-hand-drive and personal-import classes. What differs
> is the average inspection length — 60 minutes for normal, 110 for basic — and
> the paperwork. The £450 fee attaches to amateur-built, rebuilt and
> parts-of-a-registered-vehicle cars, which is a different question entirely.

#### What happens on the day

The examiner works through the M1 inspection manual — 335 pages, last updated
14 July 2025. Expect a brake test on rollers, a speedometer check on calibrated
rollers between 35 and 70 mph, a headlamp aim check on an approved tester, an
emissions test, and a physical survey of the exterior with a 100 mm sphere and a
radius gauge. The examiner may ask for bolts to be removed to see how a seat
belt anchorage is actually attached.

A car in category M1 must be presented in person. DVSA's video-call option
covers vans, HGVs and trailers (N1, N2, N3, O1–O4) — not cars.

#### How long the whole thing takes

| Figure | What it is |
|---|---|
| 10 working days | DVSA target for an application decision |
| 20 working days | DVSA target to offer an inspection |
| 22 | IVA test centres in Great Britain (14 Aug 2026) |
| 18 | of those able to test passenger cars |
| 60 min | average normal IVA inspection, car |
| 6 weeks | for the V5C after registration |

The first two run consecutively rather than in parallel. Add pre-test remedial
work and a realistic plan from vessel discharge to number plate runs to a couple
of months.

Geography is the constraint nobody budgets for. Scotland has one IVA centre.
Wales has one. If you are in Inverness or Bangor, the drive is part of the cost.

#### What the certificate gets you

The IAC is your proof of approval in the DVLA registration pack. It does not tax
the car, insure it or put plates on it — it unlocks the application. After a
pass: NOVA confirmed and duty and VAT paid (both must already be done), DVLA
registration application with originals, £55 first registration fee with the
vehicle taxed at the same time, V5C in up to six weeks.

#### What changed in 2025 and 2026

| What | When | What it means for you |
|---|---|---|
| MyVT replaces TAS | Fully live March 2025; new digital application 16 June 2025 | Applications made and paid online by card; DVSA reports a significant fall in rejected applications |
| Vehicle Examination Facility network | Announced 4 February 2026 | Approval tests move to third-party sites with DVSA examiners visiting |
| Milton Keynes added to the centre list | 14 August 2026 | The newest passenger-car IVA site, and an importer's own premises |
| IVA fees unchanged | Fee page last updated 13 December 2022 | £199 and £450 are still the published car inspection fees |

> **One inconsistency in DVSA's own documents.** The published *IVA scheme
> guide* was last updated 25 March 2024 and still describes applying through
> TAS, which was fully replaced in March 2025. Use it for standards and model
> reports; ignore its application chapter.

#### Where this sits in an import we handle

We tell you the approval position on a specific car **before you commit to
buying it**, because it is a cost and a delay that belongs in the landed figure
rather than in a surprise after discharge. For UK-bound cars we file the NOVA
declaration and prepare and submit the DVLA registration pack, and you get the
full scanned document set when the vessel departs.

What we do not do is pretend the process disappears. There is a test, or there
is an exemption, and either way you will know which before your money moves.

**FAQs** — What is an IVA test? · Is an IVA test the same as an MOT? · How long
does an IVA test take? · Can an imported car be driven before it passes IVA? ·
What happens if a car fails its IVA inspection?

---

### 2 · Do You Need an IVA Test? The Exemptions, Plainly

- **Slug:** `do-i-need-an-iva-test`
- **H1:** Do You Need an IVA Test? The 10-Year Rule and Four Other Routes
- **SEO title:** Do I Need an IVA Test? UK Import Approval Rules 2026 *(52 chars)*
- **Reading time:** 10 min

**Standfirst.** Most guides to Individual Vehicle Approval start by explaining
the test. That is the second question. The first is whether your car needs one
at all — and for a very large share of imported cars, it does not.

**The short version**

- Cars and minibuses with eight passenger seats or fewer, over 10 years old, do
  not need vehicle approval.
- A car already registered in the EU uses its European Certificate of Conformity
  instead of a test.
- An EU-registered left-hand-drive car also needs a GB conversion IVA
  certificate — £100, a form, not an inspection.
- Exempt from approval is not the same as exempt from needing approval *to tax
  the car*.
- A seriously damaged vehicle cannot be registered or taxed at all, and nothing
  you spend on approval comes back.

#### The question that decides the budget

Two identical Toyota Alphards land at Southampton on the same vessel. One is
eleven years old and goes straight into the DVLA registration queue. The other
is nine and needs an inspection, a headlamp conversion, a rear fog lamp, a test
slot at one of eighteen centres in the country, and another month before it can
legally be driven. Nothing about the cars differs. The age does.

#### The exemption list in full

GOV.UK publishes a single list of vehicles that need no approval:

- Heavy goods vehicles (more than 3,500kg maximum weight) **over 25 years old**
- Light goods vehicles (3,500kg maximum weight or less) **over 10 years old**
- Cars and minibuses with 8 passenger seats or less (not including the driver)
  **over 10 years old**
- Buses, coaches and minibuses with more than 8 passenger seats built by a
  single manufacturer before 29 July 2010
- The same, with different body and chassis manufacturers, made before
  29 July 2011
- Tracked vehicles
- Vehicles designed and constructed for use on construction sites, quarries,
  ports and airports
- Vehicles designed and constructed for, and used by, the armed services, fire
  and rescue forces, or used in maintaining public order

#### Reading the 10-year rule properly

The exemption page says *over 10 years old*. The import guidance puts the same
rule as *first registered or manufactured more than 10 years ago*, and adds the
word *might*. Both are current GOV.UK wording as at 1 September 2026.

> **Manufacture date, registration date, shipping date.** A car manufactured in
> November 2015 and first registered in March 2016 crosses the ten-year line at
> two different moments. If your purchase sits near the boundary, the date you
> rely on has to be the one you can **evidence** — and DVLA asks for the original
> foreign registration certificate showing when the vehicle was manufactured. Do
> not plan an exemption around a car that will cross the line while it is at sea.

The exemption is about approval, not the rest of the process. A fifteen-year-old
import still needs the NOVA declaration, duty, VAT, MOT and DVLA pack.

#### Cars already registered in the EU

Get a **European Certificate of Conformity** from the manufacturer. If they
cannot or will not supply one, DVSA charges **£100** for a *Mutual Recognition /
EC Approved Vehicles without Certificate of Conformity* certificate — the
cheapest line on the whole published fee table.

#### Left-hand drive and GB conversion IVA

| Vehicle | Route | Fee | Inspection? |
|---|---|---|---|
| EU-registered, RHD | European Certificate of Conformity | Manufacturer's charge | No |
| EU-registered, RHD, no CoC available | Mutual recognition certificate (DVSA) | £100 | No |
| EU-registered, LHD | CoC plus GB conversion IVA (VCA) | £100 | No |
| Non-EU import, under 10 years | Individual Vehicle Approval (DVSA) | £199 in working hours | Yes |
| Goods vehicle over 3,500kg from the EU | Full IVA — GB conversion not available | See lorry fee table | Yes |

#### When it is MSVA rather than IVA

A single 2-wheeled, 3-wheeled or smaller 4-wheeled vehicle goes through
Motorcycle Single Vehicle Approval — a parallel scheme with its own centre list,
which is not identical to the IVA one.

#### The cars that cannot be registered at all

GOV.UK: you cannot register or tax a **seriously damaged** vehicle, and if you
pay for vehicle approval and then try, you will not be refunded. For a UK car
that means Category A or B. For an import, look for wording like *statutory
write-off*, *scrapped* or *non-repairable* on the foreign registration
certificate — and if it is not seriously damaged, ask the issuing authority for
evidence of that in writing.

> This is a buying check, not a shipping check. A car with a non-repairable
> marker is worth its parts value in Britain, and you find that out after paying
> freight, duty and VAT. Our people check the source-market status before we
> bid, and a car that fails it does not ship.

#### The exemption that still needs a certificate

GOV.UK states you will need vehicle approval *to tax your vehicle* if it was
first registered on or after 1 March 2001 with EU type approval and it is either
a light goods vehicle up to 3,500kg, or a car or minibus of eight passenger
seats or fewer **with a CO₂ emissions figure in g/km**.

The reason is the tax system rather than the safety system: CO₂-based vehicle
tax bands need a certified emissions figure, and the approval document is where
it comes from. Without one, DVLA's instruction is to send a covering letter
explaining why.

#### Working the answer for your car

1. **Is it seriously damaged?** Then it cannot be registered. Stop.
2. **Is it over 10 years old?** No approval needed — but check the CO₂ rule.
3. **Was it registered in the EU?** Certificate of Conformity, plus GB
   conversion IVA if left-hand drive.
4. **Has it ever been registered in the UK?** Voluntary IVA, not IVA.
5. **Otherwise:** Individual Vehicle Approval.

**FAQs** — Do cars over 10 years old need an IVA test? · Does an EU car need an
IVA test to register in the UK? · What is GB conversion IVA? · Do I still need
vehicle approval to tax an exempt car? · Can a written-off or salvage car be
imported and registered?

---

### 3 · What an IVA Test Costs

- **Slug:** `iva-test-cost`
- **H1:** What an IVA Test Costs: Every DVSA Fee, Line by Line
- **SEO title:** IVA Test Cost 2026: Every DVSA Fee, Line by Line *(48 chars)*
- **Reading time:** 10 min

**Standfirst.** Search for the cost of an IVA test and you will be told anything
between £199 and £741. Both numbers appear in real published tables; neither is
the answer on its own.

#### The statutory fee table for cars

**Basic IVA — low-volume (L), hearses (M), left-hand drive (N), personal imports (P)**

| Test type | In working hours | Outside working hours | Average length |
|---|---|---|---|
| Inspection | £199 | £294 | 110 minutes |
| Re-inspection | £40 | £59 | 35 minutes |
| Appeal | £199 | £294 | 70 minutes |

**Basic IVA — amateur built (A), rebuilt (S), parts of a registered vehicle (C)**

| Test type | In working hours | Outside working hours | Average length |
|---|---|---|---|
| Inspection | £450 | £545 | 240 minutes |
| Re-inspection | £90 | £109 | 45 minutes |
| Appeal | £450 | £545 | 180 minutes |

**Normal IVA**

| Test type | In working hours | Outside working hours | Average length |
|---|---|---|---|
| Inspection | £199 | £294 | 60 minutes |
| Re-inspection | £40 | £59 | 20 minutes |
| Appeal | £199 | £294 | 70 minutes |

Add 45 minutes to the average inspection length for vehicles over 3,500kg.
Out-of-hours testing costs roughly 48% more.

#### Voluntary IVA, and why it carries VAT

Statutory fees are shown as one figure; voluntary fees as a service charge plus
VAT. A statutory test is a statutory function; a voluntary one is a service
being sold.

| Voluntary IVA, in working hours | Service charge | VAT | Total |
|---|---|---|---|
| Inspection — LHD, personal import, hearse, low volume | £213.98 | £42.80 | £256.78 |
| Re-inspection, same classes | £43.01 | £8.60 | £51.61 |
| Inspection — amateur built, rebuilt, parts | £483.87 | £96.77 | £580.64 |
| Re-inspection, same classes | £52.40 | £10.48 | £62.88 |

Out-of-hours voluntary inspections run to £379.37 and £703.24 respectively.

#### Certificates and replacements

| Certificate | Cost | When you need it |
|---|---|---|
| Mutual Recognition / EC approved vehicle without a CoC | £100 | An EU-approved car whose manufacturer will not supply a CoC |
| GB conversion IVA certificate (VCA) | £100 | An EU-registered LHD vehicle being converted for GB use |
| Replacement Individual Approval Certificate | £25 | The original IAC has been lost before registration |

#### The costs either side of the test

- **Headlamp conversion or replacement** — DVSA states headlamps on vehicles
  imported from countries that drive on the right may need converting or
  replacing, and masking is not accepted.
- **Rear fog lamp supply and fitting** — DVSA expects a car imported from
  outside the EU not to have one.
- **Speedometer** — must indicate mph. A dual-marked dial usually passes; a
  km/h-only dial does not, and a GPS or bicycle instrument is explicitly not
  accepted.
- **Transport to the test centre** — 22 centres in Great Britain, 18 taking
  passenger cars, one in Scotland and one in Wales.
- **Storage while you wait** — DVSA aims to respond within 10 working days and
  offer an inspection within 20.

> **The re-inspection fee is the cheap part of failing.** £40 is not what a
> failure costs. The cost is the second transporter movement, another slot in
> the queue, and the remedial work.

#### A worked total for a Japanese import

Nine-year-old Japanese car, approval required, on an illustrative £12,000
customs value.

| Line | Amount |
|---|---|
| Customs duty — 0% with a valid Japanese proof of origin | £0 |
| Import VAT at 20% on the duty-inclusive value | £2,400 |
| IVA inspection, normal, in working hours | £199 |
| Headlamp and rear fog lamp work (varies widely) | £350 |
| MOT — maximum permitted fee for a car | £54.85 |
| DVLA first registration | £55 |
| **Everything on top of the car** | **£3,058.85** |

Two things stand out. **VAT dwarfs everything else** — the approval line is
under £700 of a £3,000 stack. And the duty line is £0 only because a
Japanese-built car with valid proof of origin qualifies for preference. Without
that document the same car attracts the third-country rate of **10%**, which on
£12,000 is £1,200 of duty and a further £240 of VAT charged on top of it. One
piece of paper, £1,440.

#### What has not changed

The GOV.UK page carrying these tables was last updated **13 December 2022**.
There has been no IVA fee increase since. If a 2026 guide quotes a car
inspection fee that is not £199, £294, £450 or £545, it did not come from the
published table.

**FAQs** — How much does an IVA test cost for a car? · Is there VAT on an IVA
test? · What does it cost to register an imported car in the UK? · Do I pay
again if my car fails the IVA? · Have IVA fees gone up in 2026?

---

### 4 · How to Pass an IVA Test

- **Slug:** `iva-test-requirements`
- **H1:** How to Pass an IVA Test: DVSA's Own Top Ten Failure Points
- **SEO title:** IVA Test Requirements: How to Pass It First Time *(48 chars)*
- **Reading time:** 11 min

**Standfirst.** DVSA publishes the top ten reasons cars fail Individual Vehicle
Approval. That is unusually generous of a regulator, and it means nobody has to
guess. Four of the ten are things an imported car will fail on for reasons of
geography rather than condition — and all four can be dealt with before the car
is ever booked in.

#### DVSA's own top ten

| # | Failure point | Import-specific? |
|---|---|---|
| 1 | Headlamp aim | Yes — the biggest single one for cars from drive-on-the-right markets |
| 2 | General construction | Rarely, on a factory-built car |
| 3 | Brakes | Condition-dependent |
| 4 | Rear fog lamps | Yes — DVSA expects non-EU imports not to have one fitted |
| 5 | Exterior projections | Occasionally, on accessories and bull bars |
| 6 | Speedometers | Yes — km/h-only dials fail |
| 7 | Statutory plates and VIN | Sometimes — plate format and content are prescribed |
| 8 | Seat belt anchorages | Rarely, on a factory-built car |
| 9 | Emissions | Sometimes — the standard is set by engine age, which needs evidence |
| 10 | Interior fittings | Occasionally, after aftermarket work |

> DVSA says so itself: full compliance with the guide does not guarantee a pass,
> and the inspection manual holds the complete requirements.

#### Headlamp aim, the number one failure

Checked on an approved aim tester for three things: a good clear beam image, the
cut-off to the left, and correct height and horizontal alignment. DVSA is
explicit that headlamps on vehicles imported from countries that drive on the
right may need **converting or replacing** — and equally explicit that **the IVA
inspection does not allow any kind of internal or external masking of the
headlamp**. Beam-bender stickers are a holiday measure, not an approval measure.

RHD Japanese and Australian cars already dip to the left, so this is a Gulf,
European-LHD and American problem rather than a JDM one. Even so, have the aim
set on a calibrated tester first — DVSA suggests a class 4 MOT station can do it.

#### The rear fog lamp an import will not have

DVSA's expectation: a vehicle imported from **outside the EU** is likely not to
have a rear fog lamp fitted at all, and one from **inside the EU** will probably
have it only on the nearside and need a second on the offside.

The lamp must be:

- Fitted to the **centre or offside** rear, squarely to the rear
- If two are fitted, a matched pair mounted symmetrically
- Insulated, secure wiring through a grommet where applicable, securely fitted
  switch
- Fitted with a warning system
- Illuminating **only** when dipped, main or front fog lamps are lit
- Marked **'e' or 'E'** (approved) with **'B' or 'F'** (fog lamp)

Height above ground and distance in from the extreme outer edge are both
measured. A correctly fitted lamp can still fail the exterior-projections
section if the 100 mm sphere can contact it.

#### Speedometers, and why km/h fails

Accuracy is tested on calibrated rollers between **35 and 70 mph**. The
instrument must indicate mph, read accurately, be readable by the driver at all
times, light up, carry maximum marked increments of 20 mph, and read to the
vehicle's maximum declared speed. A speedometer hidden behind the steering wheel
rim fails. **GPS, bicycle and racing instruments are not allowed** — which rules
out the cheapest fix for a km/h-only dial.

#### The brake efficiency figures

| Brake | Minimum efficiency |
|---|---|
| Service brake | 60% |
| Secondary brake, where testable | 25% |
| Parking brake | 18% |

Calculated on design gross weight or calculated laden weight. These differ from
MOT requirements. Braking ratios between axles must not be manually adjustable,
there must be a driver-reachable way of testing for hydraulic failure, and an
indelible label identifying the brake fluid must sit within 100 mm of the master
cylinder.

#### Exterior projections and the 100mm sphere

A **100 mm sphere** — standing in for a pedestrian's knee — is run over the
outside of the car, with a 30-degree cone establishing the floor line and
everything above it checked up to two metres from the ground.

- Parts projecting **more than 5 mm** must be radiused to at least **2.5 mm**
- Parts projecting **less than 5 mm** must be blunted
- **Tape wrapped around a sharp edge is not accepted**

For a factory car this is usually about what has been added: bull bars, light
bars, roof racks, aftermarket mirrors, towing eyes.

#### Plates, belts, emissions and interior

**Statutory plates and VIN.** A statutory plate for each build stage, with the
required information in a **clearly defined rectangle** in a fixed order —
manufacturer's name, approval number or build stage, VIN, maximum permitted
laden mass, maximum train weight if applicable, then maximum laden mass per axle
front to rear. Anything else must sit outside that rectangle. A stamped-in VIN
must be on the chassis or frame and permanent.

**Emissions.** For spark-ignition engines the standard is set by the **age of
the engine**, not the age of the car. An engine from another vehicle may need
proof of age — a letter from the engine manufacturer or a recognised authority,
or the donor vehicle's original V5C. On pre-catalyst engines the examiner can
raise engine speed to around 2,000 rpm and re-check hydrocarbons.

**Seat belt anchorages.** Strength and suitability, and the examiner can ask for
bolts to be removed. A kit-car and rebuild problem far more than a factory-car
one — unless seats have been moved or the floor rebuilt.

#### The order to do the work in

1. **Before you bid** — establish whether the car needs approval at all.
2. **Before it ships** — photograph the headlamp units, rear light cluster and
   instrument binnacle. Those three pictures are your parts list.
3. **On arrival** — headlamp conversion, rear fog lamp, speedometer. These have
   lead times.
4. **Then book** — DVSA aims to respond within 10 working days and offer an
   inspection within 20. The parts are the bottleneck, not the booking.
5. **Day before** — headlamp aim on a calibrated tester, brake efficiency
   checked, every hard exterior edge you added checked by hand.

**FAQs** — What is the most common reason cars fail an IVA test? · Does an
imported car need a rear fog lamp for IVA? · Does an IVA speedometer have to
read in mph? · What brake efficiency does an IVA require? · Can I do the IVA
test by video call?

---

### 5 · Every IVA Test Centre in Great Britain

- **Slug:** `iva-test-centres-uk`
- **H1:** Every IVA Test Centre in Great Britain, and Which Ones Take Cars
- **SEO title:** IVA Test Centres UK: Full List and Which Take Cars *(50 chars)*
- **Reading time:** 10 min

**Standfirst.** Twenty-two IVA test centres in Great Britain, seven of them run
by private companies rather than by DVSA, and only three of those seven will
look at a car.

#### Who actually carries out the test

The correction the post exists to make. A privately operated IVA site is a
**venue**, not an approving authority. DVSA's Vehicle Examination Facility
model, announced 4 February 2026, allows approval tests to be conducted at
third-party sites — and DVSA's own description settles it: **DVSA staff will
continue to carry out the test.** Same examiner, same manual, same fee. There is
no such thing as a privately approved IVA tester.

VEF sites can operate on their own account, as open-access sites testing
third-party vehicles, or as a combination. Existing Privately Owned Testing
Facilities can apply for VEF status.

#### The seven privately operated sites

| Centre | Operator | Location | What it can test |
|---|---|---|---|
| Castle Donington | My Car Import | Willow Park Industrial Estate, Trent Lane, Derbyshire DE74 2PY | Passenger vehicles (incl. motor caravans, ambulances, hearses), vans up to 3,500kg, light trailers |
| Milton Keynes | Ship My Car | 20 Tanners Drive, Blakelands, MK14 5BN | Passenger vehicles — normal and basic IVA — and vans up to 3,500kg |
| Purfleet | Ensign Bus Company | Juliette Close, Purfleet Industrial Park, Essex RM15 4YF | Passenger vehicles and vans (normal IVA only), lorries over 3,500kg, buses and coaches (M3 class 1), dangerous goods, trailers |
| Halesowen | Motus Group (UK) Ltd (Imperial Commercials Ltd) | Park Rd, Halesowen B63 2RL | Vans up to 3,500kg, lorries over 3,500kg, dangerous goods, trailers |
| Peterborough | Aebi Schmidt UK Limited | Southgate Way, Orton Southgate, PE2 6GP | M class ambulances (no weight restriction), vans up to 3,500kg (normal IVA only), lorries over 3,500kg |
| Sheffield | Newell and Wright | Templeborough Depot, Sheffield Road, S9 1RT | Lorries over 3,500kg, dangerous goods, trailers |
| Lancashire | Wheelbase Engineering | Chanters Way, off Lower Eccleshill Road, Lower Darwen BB3 0RP | Vans up to 3,500kg, lorries over 3,500kg, dangerous goods, trailers |

Milton Keynes was added on 14 August 2026 and is the only entry on the whole
list that publishes its own telephone, email and website. **Those details are
deliberately not reproduced in the post** — see Part 5.

#### Only three of them take cars

Four of the seven are commercial-vehicle, trailer and specialist operations.

- **Castle Donington (My Car Import)** — passenger vehicles, vans, light
  trailers. Nothing over 6,500kg.
- **Milton Keynes (Ship My Car)** — passenger vehicles for both normal *and*
  basic IVA. The broadest car offer of the three.
- **Purfleet (Ensign Bus Company)** — **normal IVA only**. A basic IVA case (a
  personal import, a left-hand-drive car, a hearse, a very low volume car)
  cannot be tested there.

#### All 22 centres, by region

| Region | Centre | Run by | Takes cars? |
|---|---|---|---|
| London and the South East | Gillingham, Kent | DVSA | Yes |
| | Southampton (Northam) | DVSA | Yes — normal and basic |
| | Yeading, Hayes | DVSA | Yes |
| South West | Bristol (Avonmouth) | DVSA | Yes |
| | Exeter | DVSA | Yes |
| West Midlands | Halesowen | Motus Group (UK) Ltd | No |
| | Kidderminster | DVSA | Yes |
| East Midlands | Castle Donington | My Car Import | Yes |
| | Derby | DVSA | Yes |
| | Nottingham | DVSA | Yes |
| East of England | Leighton Buzzard | DVSA | Yes |
| | Milton Keynes | Ship My Car | Yes — normal and basic |
| | Norwich | DVSA | Yes |
| | Peterborough | Aebi Schmidt UK Limited | No |
| | Purfleet | Ensign Bus Company | Yes — normal IVA only |
| Yorkshire and Humberside | Beverley | DVSA | Yes |
| | Sheffield | Newell and Wright | No |
| North West | Chadderton, Oldham | DVSA | Yes |
| | Lancashire (Lower Darwen) | Wheelbase Engineering | No |
| North East | Newcastle (Gosforth) | DVSA | Yes |
| Scotland | Edinburgh (Livingston) | DVSA | Yes |
| Wales | Cardiff (Miskin) | DVSA | Yes |

**22 centres · 15 DVSA-run · 7 privately operated · 18 take passenger vehicles ·
3 private sites take cars · 1 centre each in Scotland and Wales.**

#### Restrictions worth reading first

- **Milton Keynes** — cannot book amateur built, parts-of-a-registered-vehicle,
  rebuilt or very low volume vehicles. Cannot test over 4 metres in height, over
  3,500kg, or anything needing a turning circle.
- **Castle Donington** — nothing over 6,500kg.
- **Southampton** — DVSA-run, but its basic IVA list adds a mechanical
  condition: the vehicle **must not have a limited slip differential**, and must
  be two-wheel drive or have selectable two-wheel drive. That rules out a lot of
  Land Cruisers, Patrols and performance saloons.
- Five centres can noise-test exhaust modifications over two metres in height:
  Gillingham, Bristol, Derby, Chadderton and Edinburgh.

#### How you choose a centre

You do not ring the site. GOV.UK's instruction is to say which centre you want
when you apply — the choice is part of the DVSA application. DVSA will usually
offer an inspection within 20 working days at the location you chose,
*wherever possible*. The fee is identical whichever you name.

#### The geography problem

Scotland has one centre. Wales has one. The whole north of England has three.
Five of the eighteen car-capable sites are in the East of England alone. The car
is unregistered and cannot legally be driven anywhere except a pre-booked test,
so where it lands and where it can be tested should be one decision.

Northern Ireland is not on the list at all — the publication covers England,
Scotland and Wales.

**FAQs** — Can a private company carry out an IVA test? · How many IVA test
centres are there in the UK? · Which private IVA centres can test cars? · How do
I book an IVA test at a particular centre? · Are there IVA test centres in
Scotland and Wales?

---

### 6 · Registering an Imported Car in the UK

- **Slug:** `registering-an-imported-car-in-the-uk`
- **H1:** Registering an Imported Car in the UK, Step by Step
- **SEO title:** Registering an Imported Car in the UK: Full Process *(51 chars)*
- **Reading time:** 12 min

**Standfirst.** Six steps in a fixed order, and each one gates the next. You
cannot pay the duty before the declaration, cannot get approval to count before
the duty is paid, and cannot register before HMRC has confirmed the arrival.

#### The sequence

| # | Step | Who does it | The gate it opens |
|---|---|---|---|
| 1 | Import declaration | Shipping company or customs agent | Lets the vehicle clear the border |
| 2 | Pay VAT and customs duty | Usually the agent, at the border | Nothing can be registered until this is paid |
| 3 | Tell HMRC within 14 days (NOVA) | You, your agent, or HMRC's CARS team | Registration is blocked until NOVA is processed |
| 4 | Get vehicle approval | DVSA, VCA, or nobody if exempt | Produces the proof DVLA demands |
| 5 | Register and tax with DVLA | You, by post with originals | Produces a registration number |
| 6 | Insure it | You | Legal use on the road |

> GOV.UK: you can be prosecuted if you use your vehicle on a public road before
> completing these steps. One exception — driving it to a pre-booked MOT or
> vehicle approval test. Everything else is a transporter.

#### Telling HMRC within 14 days

Fourteen days from the vehicle arriving permanently. You cannot register until
it is done, and you may be fined if you are late.

**Who makes the declaration.** A VAT-registered company uses NOVA directly (or a
spreadsheet for volume). A private individual with a shipped vehicle can have
the shipping company or customs agent do it — they may charge extra — or
HMRC's CARS team. Bringing it in yourself: contact the CARS team directly.

**What they will need:** the C88 and E2 customs documents or your Movement
Reference Number; the invoice or bill of sale if bought in the last six months;
if bought more than six months ago, a **current valuation carried out in person
in the UK** by a garage, dealership or other recognised business; and a copy of
an official document confirming the VIN or chassis number.

> A vehicle with an engine of 48cc or less (7.2kW or less if electric) can be
> registered without telling HMRC first. A vehicle registered in the Isle of Man
> needs no NOVA application at all — send DVLA form V55 and the Isle of Man
> registration document instead.

#### Duty and VAT at the border

VAT is charged on the total cost of the vehicle plus accessories bought with it,
delivery and extra charges, **and the customs duty**. So duty is calculated
first, then VAT on a figure that includes it.

On 1 September 2026 the UK Integrated Online Tariff showed, for a used petrol
car of 1,500–3,000cc, a third-country duty rate of **10%** and **VAT at 20%**.

| Origin | Duty rate | What it depends on |
|---|---|---|
| No agreement (the default) | 10% | Nothing — this is the fallback |
| Japan, EU, Australia, New Zealand, Canada and others | 0% | Valid proof of origin under the relevant agreement |
| CPTPP members | 2% | Valid CPTPP origin claim |
| Collectors' vehicle, 30+ years, original state | Reduced VAT route | Classification under tariff heading 9705 — check with HMRC before buying |

The 9705 route deserves a caution. Historical collectors' vehicles at least
thirty years old, in original state and without substantial changes to the
chassis, body, steering, braking, transmission, engine or wings, can qualify for
a reduced effective VAT rate — but modernised or modified vehicles are excluded,
and HMRC's own advice is to email the Tariff Classification Service **before
making a purchase**.

If you are VAT-registered you can reclaim the import VAT on your next return. If
not, it is a cost. Either way, you must pay any VAT and customs duty before you
can register.

#### The DVLA pack

Originals only — GOV.UK says do not send photocopies or faxed copies.

| Document | When | Note |
|---|---|---|
| Proof of vehicle approval | Where approval is required | The IAC, CoC or GB conversion certificate |
| Form V267, 'declaration of newness' | New vehicles only | |
| Evidence of the collection date | Always | The supplier's invoice does this |
| Original foreign registration certificate | Always | Shows the manufacture date. You will not get it back |
| Form V627/3 | If structurally modified beyond the manufacturer's specification | |

Without the original foreign registration certificate, DVLA might accept other
proof of manufacture date — a letter from the manufacturer or a vehicle
enthusiast club is named as an example. DVLA might also ask to inspect the
vehicle.

> **The certificate you hand over is gone.** Scan and photograph every page
> before it goes in the envelope, and keep the export certificate and auction
> sheet with it. That file is worth real money at resale and cannot be
> reconstructed later.

#### MOT, tax and the number plate

| Figure | What it is |
|---|---|
| £55 | DVLA first registration fee |
| £54.85 | maximum a garage may charge for a car MOT |
| 3 years | age at which a car first needs an MOT |
| 6 weeks | for the V5C to arrive |

Tax and MOT are linked: you cannot renew vehicle tax if the MOT has expired, and
a car needs an MOT by the third anniversary of its registration. For an import
older than three years, the MOT belongs in the pre-registration plan. The MOT
fee is a maximum, not a fixed price, and no VAT is charged on it.

#### Where classics get an easier run

| Threshold | What it removes | Conditions |
|---|---|---|
| Over 10 years old | Vehicle approval | Cars and minibuses with 8 passenger seats or fewer |
| Over 30 years old | Potentially, the full VAT rate | Only via tariff heading 9705, original state, no substantial changes |
| Over 40 years old | The annual MOT | No substantial changes — chassis, body, axles or engine that change how it works |
| Built before 1 January 1986 | Vehicle tax, from 1 April 2026 | Apply for the historic tax class; registration before 8 January 1986 works if the build date is unknown |

A 40-year MOT exemption is not an exemption from roadworthiness. You must still
keep the vehicle roadworthy, and using one in a dangerous condition can cost
£2,500 and three penalty points.

#### Where we fit in this

For cars we land in the United Kingdom, we file the NOVA declaration and prepare
and submit the DVLA registration pack, and you get the full scanned document set
when the vessel departs. Before that — before you commit to a car at all — we
tell you which approval route it falls into and what that route costs.

The parts of this you keep are the parts that are yours by law: the vehicle is
registered in your name, and the duty, VAT and tax are charged to you as the
registered owner. What you get from us is that none of it arrives as a surprise.

**FAQs** — How long do I have to tell HMRC about an imported car? · How much is
customs duty and VAT on a car imported to the UK? · How long does DVLA take to
register an imported car? · What documents does DVLA need for an imported
vehicle? · Does an imported classic car need an MOT?

---

## Part 3 — Fact-check log

Every claim carrying a number, a date or a rule was checked against a primary
source on **1 September 2026**. Where a source page carries its own "last
updated" date, that date is stated in the post so a reader can tell how fresh
the underlying rule is.

| Claim | Source | Source last updated |
|---|---|---|
| IVA triggers: built, rebuilt, radically altered, reconstructed from a classic, imported | GOV.UK, *Apply for IVA: cars* | 6 July 2026 |
| Basic IVA categories; normal IVA; 20 working days to offer an inspection; 14-day appeal window; cannot use IVA if previously UK-registered | GOV.UK, *Vehicle approval: individual vehicle approval* | — |
| 10 working days for an application decision | GOV.UK, *Apply for IVA: cars* | 6 July 2026 |
| Exemption list (10-year rule, 25-year HGV rule, bus/coach dates, etc.) | GOV.UK, *Exemptions from vehicle approval* | — |
| "First registered or manufactured more than 10 years ago"; CoC route; GB conversion IVA £100; not available over 3,500kg; the CO₂ / 1 March 2001 tax rule | GOV.UK, *Importing vehicles into the UK: getting vehicle approval* | 10 December 2024 |
| Statutory and voluntary IVA fee tables; £100 mutual recognition; £25 replacement IAC | GOV.UK / DVSA, *Vehicle approval test costs: cars* | **13 December 2022** |
| Top ten failure points; headlamp dip and no masking; rear fog lamp rules and 'e'/'E' + 'B'/'F' marks; speedometer mph, 35–70 mph, no GPS; brake minimums 60/25/18%; 100 mm sphere and 2.5 mm radius; statutory plate order; emissions by engine age | GOV.UK / DVSA, *IVA for cars: help to get a pass* | 29 June 2017 |
| M1 inspection manual, 335 pages | GOV.UK, *IVA inspection manual: cars* | 14 July 2025 |
| Video-call IVA covers N1, N2, N3, O1–O4 — not M1 | GOV.UK, *Get an IVA test done by video call* | 18 November 2020 |
| 22 IVA test centres, 18 taking passenger cars, 15 DVSA-run, 7 third-party; every operator name, address, capability and restriction; Milton Keynes added 14 Aug 2026, Castle Donington 16 Apr 2024 | GOV.UK, *IVA test centre locations* | **14 August 2026** |
| "DVSA staff will continue to carry out the test" at VEF sites; own-account / open-access site models; POTFs may apply for VEF status | DVSA *Moving On* blog | 4 February 2026 |
| 14-day NOVA deadline; who declares; documents needed; 48cc/7.2kW exception; Isle of Man exception | GOV.UK, *Importing vehicles into the UK: telling HMRC* | 10 December 2024 |
| VAT charged on vehicle + accessories + delivery + duty; must pay before registering | GOV.UK, *Importing vehicles into the UK: paying VAT and duty* | 10 December 2024 |
| £55 registration fee; V267; V627/3; original foreign registration certificate not returned; up to 6 weeks for V5C | GOV.UK, *Registering an imported vehicle* | 10 December 2024 |
| Used car duty 10% third country, VAT 20%, Japan 0%, CPTPP 2% | UK Integrated Online Tariff, commodity 8703 23 90 00 (used) | Live, queried 1 September 2026 |
| Collectors' vehicles, heading 9705, 30 years, original state, effective 5% VAT; email the Tariff Classification Service first | GOV.UK, *How to value goods for import VAT* / HMRC IMPS05200 | — |
| Max car MOT fee £54.85, class 4, first MOT at 3 years, no VAT on the fee; cannot renew tax with an expired MOT | GOV.UK, *Getting an MOT: MOT test fees* | 28 November 2024 |
| 40-year MOT exemption; historic tax class, built before 1 Jan 1986 / registered before 8 Jan 1986, from 1 April 2026; £2,500 and 3 points | GOV.UK, *Historic (classic) vehicles: MOT and vehicle tax* | 24 January 2025 |
| VEF network announcement | DVSA *Moving On* blog | 4 February 2026 |
| MyVT timeline: 11 Nov 2024 pre-funded pilot, 27 Jan 2025 all applications, March 2025 TAS retired, 16 June 2025 new digital form | DVSA *Moving On* blog | 25 February 2026 |
| IVA scheme guide still describes TAS | GOV.UK, *IVA scheme guide* | 25 March 2024 |

### Claims we found in third-party sources and did **not** publish

| Claim seen | Why it was rejected |
|---|---|
| "IVA test costs £289–£741" | Not a range in any DVSA table. Appears to blend car, van and HGV fees |
| "£456 test fee for 2026" | Does not appear in the published table |
| "Partial retest at £54–£131" | DVSA publishes a *re-inspection* fee (£40/£90 for cars); no "partial retest" tier exists in the car table |
| "IVA waiting times average 4–8 weeks, 10–12 weeks March–August" | No DVSA source. DVSA publishes a 20-working-day target and nothing about seasonality |
| "An IVA certificate cannot be issued to a vehicle manufactured more than 10 years before application" | Inverts the actual rule. GOV.UK's rule is an *exemption* for vehicles over 10 years old, not a prohibition on approving them |
| "All M & N vehicles must hold full GB type approval by 31 January 2026" | A manufacturer-side type-approval deadline, not an IVA rule. The VCA page we could reach confirms only that provisional GB type approval closed to new M, N and O applications on 1 February 2025. Left out rather than published on a secondary source |

---

## Part 4 — Files changed

| File | Change |
|---|---|
| `src/config/blog.ts` | New `UK Registration & IVA` cluster; new `UK_IVA_POSTS` array (6 entries); added to `BLOG_POSTS` and `CLUSTER_ORDER`; new optional `ogImage` field on `BlogPost`; UK destination now suggests the registration guides first |
| `src/content/blog/iva-test-explained.tsx` | New body |
| `src/content/blog/do-i-need-an-iva-test.tsx` | New body |
| `src/content/blog/iva-test-cost.tsx` | New body |
| `src/content/blog/iva-test-requirements.tsx` | New body |
| `src/content/blog/iva-test-centres-uk.tsx` | New body |
| `src/content/blog/registering-an-imported-car-in-the-uk.tsx` | New body |
| `src/content/blog/index.ts` | Six imports and six `BLOG_BODIES` entries |
| `src/app/(marketing)/blog/[slug]/page.tsx` | Open Graph image now declares `width`/`height` when a post supplies a purpose-built 1200×630 `ogImage`; posts without one behave exactly as before |

`sitemap.ts` needed no change — it maps `BLOG_POSTS`, so the five new URLs are
already in it.

The centre directory also adds two inline cross-links: from the pillar's
timeline section, and from the cost post's transport line.

---

## Part 5 — Three things for a human to decide

1. **The blog index's OG images.** All 50 pre-existing posts still ship an
   Open Graph image with no declared dimensions (their Unsplash heroes are
   ~2400px wide, not 1200×630), which `CLAUDE.md`'s SEO section treats as
   incomplete. The five new posts are compliant via the new `ogImage` field, and
   the mechanism now exists to fix the rest — but backfilling 50 posts was
   outside this brief, so it has been left alone rather than done silently.

2. **Naming competitors in the centre directory.** Two of the seven private
   sites are run by car-import companies — My Car Import and Ship My Car. Their
   names are reproduced because you have to name the centre on the DVSA
   application, so it is action-relevant information a reader cannot use the
   page without. Their published phone, email and website details are **not**
   reproduced, and the post's disclaimer states that listing a company records
   what DVSA publishes and is not an endorsement. If you would rather the post
   described them by location only, that is a one-line change.

3. **A `/latest-news` piece on the VEF rollout.** Not written, for the reason in
   Part 1 — the freshest confirmed item is 14 August 2026 and the substantive
   ones are February 2026, which is stale for dated reporting. If you want it,
   the trigger to watch is the IVA test centre list: a second or third
   third-party site being added would make it a real story about approval
   capacity rather than a single announcement.
