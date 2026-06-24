# notes.md — i18n, placeholders, footer spec, and design rationale

Keep this open while building. It explains what's deliberately unfinished and what
must **not** be "fixed".

---

## i18n (ship EN, add IT/ES later)

- Ship **English** now. Structure so **Italian** and **Spanish** drop in later
  without touching components — `next-intl` (or similar), one dictionary per locale.
- **Every** visible string goes in the dictionary, including the robot's entire
  `AUDIT_SCRIPT` (it's already a single object — port it whole).
- The footer carries a tiny locale marker ("EN") — wire it to the active locale.
- Watch line-breaks that are hard-coded for English (e.g. the Services H2 forced to
  two lines on mobile, the hero H1 break after "work"). Those are layout hints, not
  content — re-evaluate per language.

---

## Content still pending (all currently placeholder)

| Where | Placeholder now | Needs |
|---|---|---|
| Studio **name** | "Digital Systems Studio" (nav + footer) | Final name undecided (candidate "Quiet System", deferred). Keep it in **one constant** so it swaps everywhere at once. |
| **Contact** email | `hello@studio.com` | Real email. |
| **Contact** WhatsApp | `wa.me/000000000` | Real number. |
| **Socials** (footer + contact) | `#` | Instagram, LinkedIn, WhatsApp URLs. |
| **About** portraits | empty `image-slot` frames | Posed **AI video clips** of Michel & Esther → swap to looping `<video>` (see `02-sections.md` §About). |
| **Selected Work** | e-Sup, Foxplan, Gecko clips are real | A **CRM / booking** example of Esther's was discussed but deferred — may become a 4th web tile later. |
| Robot `finals` actions | visual only | Real WhatsApp / calendar / mailto targets. |
| Robot **voice** | synthetic word-timing | Real TTS / audio → drive `speakingRef.level` (see `03-robot.md`). |

Centralize name, email, phone, and social URLs as config/env so non-devs can edit.

---

## Footer — minimalist spec (global, dark)

One footer on **every** page (home + /about + /contact). Deliberately tiny:

- Background **`--ink`** (dark), text `#d9d9d4`.
- **Left:** the three brand dots + studio name (serif, `#fbfbfa`).
- **Center/meta:** `© 2026 — All rights reserved` (IBM Plex Mono, 11px, `#8a8a83`).
  (A "Built to remove friction · EN" locale line is acceptable too.)
- **Right:** three circular icon buttons — **Instagram · LinkedIn · WhatsApp**
  (40px, 1px translucent-white border, hover border → teal, lift 1px). WhatsApp is
  the "contact" affordance.
- ≤600px: stack centered.

That's the whole footer — no link columns, no newsletter, nothing else.

---

## Design rationale — do NOT "improve" these

These were deliberate calls. Changing them undoes the point of the design.

- **Services is an editorial divided list, not boxed cards.** The boxed-card grid is
  the agency cliché we're specifically avoiding. Keep the hairline-divided rows.
- **Selected Work shows only real, shipped work, and never invents metrics.**
  No fabricated "+300% conversions". Describe what each thing *does*. The studio's
  whole pitch is honesty about removing friction — fake proof would poison it.
- **Foxplan is a "Web app — Collaboration", never "built by us".** Michel knows the
  build deeply but did not build it; presenting it as solely ours is off-limits.
  The honest "Collaboration" tag is the agreed treatment. (This rule generalizes:
  never present others' work as the studio's.)
- **Capabilities is a light strip inside Services ("We also build"), not its own
  section.** It signals breadth without padding the page or repeating Services.
- **The tool mockups in Selected Work are illustrations, not screenshots.** The real
  tools are functional, not pretty; the animated mechanism sells the idea better
  than an ugly UI screenshot would.
- **About & Contact are separate routes, not in the home scroll.** The home funnels
  to contact via Venture Labs' CTA; forcing contact into the scroll was rejected.
- **The robot does a *playful teaser* audit, not a real diagnostic.** The serious
  "Microprocess Audit" CTA section was **dropped** — the robot + Contact cover it.
- **Motion is quiet.** Subtle loops, teal-only movement, always a reduced-motion
  fallback. Don't make it bouncy or busy.

---

## Grid relief — keep it aligned across sections (production)

Each section paints its own faint 44×44px grid relief (see `01-design-system.md`).
In the prototype the sections are isolated, so their grids start from each
section's own top-left and **don't line up where one section meets the next**
(visible as a slight horizontal offset at the seam). In the real single-page build,
the grid must read as **one continuous field**: use a **single shared 44px grid
origin** for the whole page (e.g. one fixed/absolute background layer behind all
sections, or the same `background-position` reference on every section so columns
and rows are continuous from top to bottom). Don't let each section restart its own
grid.

## Reference quirks to ignore (prototype-only)
- `Landing - Full.html` assembles sections with **iframes** so each prototype
  section keeps its own scope. In production these are sibling components — no
  iframes. Section spacing is just each section's own consistent vertical padding
  (no margin hacks); every seam equals the hero→section-01 gap.
- Section CSS reuses the same class names (`.eyebrow`, `.head`, `h2`, `.frame`,
  `.cta`…) with different values per file. That's why the prototype isolates them;
  your scoped components make this a non-issue.
- The Services accordion uses a JS `max-height` hack (the `0fr→1fr` grid trick
  measured 0 in the prototype). Use `height:auto` animation instead.
- Mobile preview wrappers (`Section - … (Mobile).html`) are just iPhone-frame
  viewers for review — not part of the site.

---

## Quick QA checklist (parity with the reference)

- [ ] Tokens + 3 fonts wired; eyebrow label + 3 dots reusable.
- [ ] Hero: robot finish, face-zoom entrance, glassy CTA, audit conversation, dot
      mouth + eye glows, `speakingRef.level` seam kept.
- [ ] Services: divided list, flagship pill, accordion (one open), scroll-highlight
      (incl. mobile), animated icons, "We also build" marquee (pause on hover).
- [ ] Selected Work: 3 animated mockups + 3 site clips (play-once-then-freeze,
      unified grade, esup @0.5×), Foxplan = "Web app — Collaboration".
- [ ] Venture Labs: two-robot high-five + teal burst, "Example in development",
      CTA → /contact.
- [ ] About: 2 co-founders, player-intro reveals + Ken-Burns, portraits ready to
      swap to video.
- [ ] Contact: email + WhatsApp + robot-audit CTA (→ hero).
- [ ] Global dark footer on all pages; shared nav + mobile drawer.
- [ ] `prefers-reduced-motion` respected everywhere.
- [ ] All strings in i18n dictionaries (EN), name/email/phone/socials in config.
