# 02 — Sections

Build top to bottom. Each block below gives: **purpose · structure · real copy ·
interactions/animation · responsive · placeholders**. Reference files in
`reference/`. Copy text is final English unless marked `[placeholder]`.

A **shared sticky nav** sits above everything (all pages):
`Services · Work · Venture Labs · About · Contact`; brand (3 dots + name) on the
left → Home. Hanken Grotesk, translucent bg with `backdrop-filter: blur(12px)`,
1px bottom hairline. ≤720px → hamburger opening a right-side drawer (serif links).

---

## HERO  (`reference/Hero - Robot 3D (Silver).html`)

The most custom section — full spec in `03-robot.md`. Summary here:

- **Two-column** on desktop: left = copy, right = the 3D robot. Single column on
  mobile (order: headline → robot full-bleed → CTA over robot → subtitle → "See
  our work").
- **H1:** "Stop doing work a system could do." (serif, gradient fill, line break
  after "work"). **Subtitle:** short, one line. **No eyebrow** in the hero.
- **Robot:** Spline scene, real dark-metal finish nudged silver via
  `filter: saturate(.8) brightness(1.18) contrast(.98)`. Entrance zooms from the
  face out over ~2.4s.
- **CTA:** a glassy pill **"Ask me a quick audit"** floating over the robot
  (bottom-center). Clicking it starts the audit conversation → see `03-robot.md`.
  Secondary text link: **"See our work"**.
- Background lighting: desktop = soft Aceternity-style spotlight SVG; mobile = one
  diagonal teal-ish beam from the top-left.

---

## 01 · SERVICES  (`reference/Section - Services.html`)

**Purpose:** the three things the studio does ("What we do"). Editorial, not cards.

**Structure**
- Eyebrow `●●● 01 — SERVICES`, **centered**.
- Centered H2: **"Three ways we take *friction* out of the work."** (*friction* in
  italic. On mobile force two lines.) No lede paragraph (removed by request).
- A **divided list** (NOT boxed cards — this deliberately avoids the agency
  cliché). Three rows separated by hairlines. Each row:
  - left: stacked **index** (`01/02/03`, mono) + an **animated SVG icon**;
  - middle: serif **title** + one-line **summary**;
  - right: a circular **+ / −** toggle.

**The three services**

1. **Process Mapping & Solution Design** — teal **FLAGSHIP** pill next to the title.
   Summary: *"We map how work actually happens, find the friction, and design the
   simplest system that removes it."*
   - Icon: a node-graph with a teal pulse tracing the flow.
   - Expanded body: *"Before any code, we sit with the process, digital or non. We
     trace every handoff, queues, copy-pastes... the invisible work nobody
     documents."*
   - Examples (each tagged neutral **"Example"**):
     - **Invoice reader.** "Reads every new invoice the moment it lands in your
       folders or cloud, and writes each line straight into your spreadsheet — no
       manual typing."
     - **Guest handover, for hotels.** "We mapped what quietly slips through the
       cracks at each shift change — a promised late checkout, an allergy, a
       half-fixed complaint — and built a calm handover that carries every guest's
       context to whoever's on next."

2. **Lead Magnet Design**
   Summary: *"Interactive tools that live inside a client's funnel and turn
   attention into qualified leads."*
   - Icon: a magnet drawing lead-dots into its poles.
   - Body: *"Not another contact form. A small tool the visitor actually wants to
     use — and that hands you a warm, qualified lead at the end. We design the
     logic, the interaction, and the flow that notifies your team the moment
     someone's ready."*
   - Examples:
     - **Mortgage-eligibility calculator.** "A few guided questions and the visitor
       sees, in seconds, whether they qualify and for how much — while the warm
       lead reaches your team by WhatsApp or email."
     - **Before / after visualizer.** "A tool that lets a client see the result
       before they commit — their hands after the spa, their car back from the body
       shop, the room once it's remodeled."

3. **Web Experience Optimization**
   Summary: *"We don't rebuild your site. We audit it for friction and remove what
   quietly slows people down."*
   - Icon: a browser with a before/after divider sweeping left↔right.
   - Body: *"Most sites don't need a rebuild — they need the friction taken out. We
     read the graphic and UX detail through the same process lens, and fix what
     quietly costs you clarity and conversions. When a rebuild genuinely helps, we
     do that too."*
   - Examples:
     - **Friction audit.** "A focused pass over your existing site that returns a
       prioritized list of fixes — the quiet frictions costing you clarity and
       conversions."
     - **Landing & web builds.** (no description)

**Interactions / animation**
- **Expand-in-place accordion**, one open at a time. Animate panel height. *(In the
  reference, the `0fr→1fr` grid trick computed 0 — so it uses JS `max-height`. In
  Framer Motion use `animate={{height:'auto'}}` which is reliable; don't replicate
  the max-height hack.)*
- **Scroll-highlight:** the row nearest the **viewport center** is "active" (full
  opacity, index turns teal); the others recede to `opacity:0.4`. Kept **on for
  mobile too** (the user likes it). Drive it off the real page scroll.
- **Animated icons:** inline SVG + CSS; teal only on the moving part; respect
  reduced-motion (freeze resolved).
- The **+/−** toggle morphs (fills `ink`, minus bar hides) when its row opens.

**Capabilities strip — "We also build"** (closes the section)
- Separated from the list by a hairline + centered mono label **"We also build"**.
- A **slow horizontal marquee** of pill-chips (icon + label), **pauses on hover**,
  fades at both edges. Icons do **not** rotate; each has a small teal accent that
  pulses. Reduced-motion → static wrap, centered.
- Chips: *WhatsApp & email automations · Social DM replies · Before / after
  visualizers · Lead-magnet tools · Landing & web builds · Internal tools & MVPs ·
  Chrome extensions · Dashboards & reports.*
- Purpose: signal breadth honestly without inflating it into a full section.

**Responsive:** header 2-line; rows keep index+icon stacked left; panel full-width;
zero horizontal overflow open or closed.

---

## 02 · SELECTED WORK  (`reference/Section - Selected Work.html`)

**Purpose:** proof — only real, shipped work. **Never inflate or invent metrics**
(see `notes.md` §proof). Two groups of three.

**Header:** eyebrow `●●● 02 — SELECTED WORK`, centered H2 **"Small, real, and
*working*."**, sub: *"A few examples of systems and sites we've actually shipped —
described by what they do, not by inflated numbers."*

**Group 01 — "Some tools & systems we've built"**
Three **animated CSS mini-mockups** of the *mechanism* (not screenshots — these
tools are functional, not pretty, so we illustrate what they do). Each sits in a
browser-style frame (**aspect 1900/845, same wide-short shape as group 02**) with a
serif title + one line:
- **Invoice reader** (tag *Automation tool*): docs flow → spreadsheet rows fill in
  sequence. "Drop a folder of invoices and each line is read and written straight
  into a clean spreadsheet — no manual typing."
- **Mortgage-eligibility calculator** (tag *Lead tool*): questions get answered →
  "Calculating…" → a teal **donut fills to 82%** + "You qualify · Lead sent →".
  "Part of a full sales-funnel automation we built: visitors learn in seconds
  whether they qualify and for how much, and each warm lead is routed straight to
  the team by WhatsApp or email."
- **Term-glossary extension** (tag *Browser extension*): a term gets a
  double-highlight → a dark tooltip pops. "A Chrome add-on that explains jargon
  inline — hover any tricky term on any page and a plain-language definition
  appears."

**Group 02 — "Some landing & web work"**
Three browser frames at **aspect 1900/845** (matches real laptop captures) holding
**looping site clips** (the entrance animation of each real site). Behaviour:
**play once on scroll-in, then freeze on the last frame** (not looping); muted;
one **unified muted color grade** so the three sit together
(`filter: saturate(0.6) brightness(1.04) contrast(0.95) sepia(0.09)`).
- **e-Sup Tours** (tag *Landing page*, `esupwatamu.com`) — clip
  `assets/esup-home.mp4`, **played at 0.5×** (its real banner anim is too fast).
  "A landing for an African excursions company — the kind of arrival animation that
  makes a small operator feel like a brand."
- **Foxplan** (tag **"Web app — Collaboration"**, `foxplan.es`) — clip
  `assets/foxplan.mp4` at 1×. "A platform that matches a city's experiences to your
  tastes and free time — and to the free time of the friends and family you're
  connected with." **Must read as a collaboration, never as solely our build** (see
  `notes.md`).
- **Gecko Resort** (tag *Landing page*, `garodagecko.com`) — clip
  `assets/gecko.mp4` at 1×. "The portal to a little African paradise, to rest your
  days."

All three "View site / Visit →" links are live to the real domains (open new tab).

**Implementation notes:** clips start/pause via IntersectionObserver (threshold
~0.35), `playbackRate` is per-clip (`data-rate`), and on `ended` they hold the last
frame. In React: an `useInView` hook + a `<video muted playsInline preload="metadata">`
that `.play()`s once on enter and doesn't loop. Keep the mini-mockups (group 01) as
CSS/Framer components.

**Responsive:** ≤900px → 2 columns; ≤600px → 1 column.

---

## 03 · VENTURE LABS  (`reference/Section - Venture Labs.html`)

**Purpose:** plant the seed that the studio also builds **its own / co-owned**
products and partners under flexible models. Short, centered, low-pressure.

**Structure (centered):**
- Eyebrow `●●● 03 — VENTURE LABS`.
- A **two-robot high-five** illustration (see motion below).
- H2: **"We don't only build for clients. We build *with* people."**
- Lede: *"Venture Labs is where we develop our own products — and co-own them with
  the creators and companies we partner with, under whatever model fits,
  **equity-for-work included**."*
- An **"Example in development"** pill (yellow pulsing status dot) +
  *"**Butcamp** — an experience-design platform. Its **Corporate** line builds
  team-building, workshops and HR tools, B2B."*
- CTA: filled pill **"Have an idea? Let's talk →"** → routes to **/contact**. Note
  under it: *"We'll explore building it together — and under what model."*

**The two-robot motion (signature piece)**
Two small robots, same dot-eye language as the hero robot: **ours = filled ink**,
**theirs (the collaborator) = outline**. Each has two arms; the **inner arms angle
up and the palms meet high in a high-five**, where a **teal burst** fires (a solid
core + an expanding ring + 4 spark particles). They lean in for the bump, eyes
blink and glance toward each other, antenna tips glow teal. Loop ~3.8s. Arms
originate from the **upper torso just below eye level** (not the face). Reduced-motion
→ freeze at a clean resolved frame.

---

## 04 · ABOUT  (route `/about` — `reference/Section - About.html`)

**Purpose:** the two co-founders, presented like a **football-team line-up intro**.

**Structure:** shared nav on top; eyebrow `●●● 04 — WHO WE ARE`; centered H2
**"A small team that likes *quiet* systems."**; sub: *"We're builders first — we
design the tools, write the systems, and sit with the process until the friction is
gone. Here's who you'd be working with."* Then **2 portraits** side by side
(`grid` 2-up; 1 column ≤560px). Dark footer below.

**Each "player" card:** a 3:4 portrait frame with a shirt-style **number tab**
(01/02), then below: serif **name**, mono teal **role**, one-line bio.

**The two people**
- **Michel Bertoni** — *Co-founder · Growth & Strategy*. Bio: "Industrial engineer
  with a Master's in Entrepreneurship & Innovation (Barcelona). 5+ years across
  tourism, travel services and digital platforms — sales, customer experience and
  product, hands-on with CRM / PMS and AI-assisted tools."
- **Esther Marchisano** — *Co-founder · Build & Systems*. Bio: "Developer and
  graphic / web designer with deep experience in tourism — from hotel management to
  building digital products for travel structures and processes."

**Animation (the "player intro"):** as each card scrolls into view (staggered ~180ms),
a teal **spotlight** fades up behind it, a **diagonal light beam sweeps** across, the
frame **rises into pose** (translateY + scale) and a **floor shadow** sets; then a
gentle **idle float** loops, plus a slow **Ken-Burns breathe** on the photo itself
(so even a still photo feels alive). **Hover = step forward** into the light.
Reduced-motion → all resolved, no beam.

**Portraits = placeholder.** Currently `image-slot` drop zones. The user will supply
**posed AI video clips** (move → settle into a pose / natural smile). When they
arrive, **swap each portrait to a looping `<video>`** exactly like Selected Work
(the float + spotlight ride on top). Until then, render a tasteful empty frame.

---

## 05 · CONTACT  (route `/contact` — `reference/Section - Contact.html`)

**Purpose:** one calm path to get in touch. Reached only via nav (not the home
scroll), because Venture Labs' CTA already funnels here.

**Structure:** shared nav; eyebrow `●●● 05 — CONTACT`; centered H2 **"Tell us where
the *friction* is."**; lede: *"Send one message about the part of your work that
eats the most time. We'll reply with whether a small system could take it off your
hands — no pitch, no forms."*
- Two **channel cards** (2-up; 1 col ≤600px): **Email** (`mailto:`) and **WhatsApp**
  (`wa.me`, teal icon tile, opens new tab).
- Secondary CTA pill: **"Or let the robot run a quick audit →"** (teal pip) →
  routes to **Home / hero**. Micro-note: *"Three questions, about 30 seconds. It's
  the same place we start every project."*
- Dark footer below.

**Placeholders:** email is `hello@studio.com`, WhatsApp is `wa.me/000000000`,
socials are `#` — all to be replaced (see `notes.md`).

---

## FOOTER (global, dark) — see `notes.md` for the exact minimalist spec.
