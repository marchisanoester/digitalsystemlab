# Studio Landing — Developer Handoff

> **What this is.** A faithful, working **design reference** for the studio's
> landing page, plus the specs needed to rebuild it in production. This is *not*
> production code to copy — the reference is plain HTML/CSS/JS (prototype-grade,
> isolated per section). Your job is to **re-implement it idiomatically** in the
> target stack, matching the look, copy, motion and responsive behaviour exactly.

---

## Target stack (agreed)

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** — seed the config from `01-design-system.md`
- **shadcn/ui** for conventional primitives (buttons, drawers, etc.)
- **Framer Motion** for the animations described in `02-sections.md`
- **i18n-ready** — ship **English** now; structure copy so **Italian / Spanish**
  can be added later (e.g. `next-intl`). All visible strings live in dictionaries,
  never hard-coded in JSX.

## The golden rule

**The reference HTML is the source of truth for appearance and behaviour.**
Open the files in `reference/` and *watch them run* — don't infer from the code
alone. When the spec text and the rendered reference disagree, the **rendered
reference wins**; note the discrepancy back to the team.

Do **not** reproduce the reference's architecture (one big HTML per section, global
CSS, iframes for assembly). That structure exists only to isolate prototypes. Build
real components with scoped styles.

---

## How this package is organised

| File | What's in it |
|---|---|
| `README.md` | This file — entry point, stack, rules. |
| `01-design-system.md` | Tokens: color, type, spacing, grid relief, the mono "eyebrow" label. Tailwind/CSS-var ready. |
| `02-sections.md` | Section by section: structure, **real copy**, interactions, animations, responsive rules, and exactly what is **placeholder**. |
| `03-robot.md` | The hero's 3D robot + audit experience: Spline setup, `AUDIT_SCRIPT`, the dot-matrix mouth, and the `speakingRef.level` hook reserved for voice/TTS. |
| `notes.md` | i18n, content still pending, the minimalist footer spec, and *why* certain design decisions were made (so you don't "fix" them). |
| `next-steps.md` | What to do with this package (EN + IT) — how to brief the agent, the build order, and the comparison test. |
| `reference/` | The runnable HTML/CSS/JS + media. Open `reference/Landing - Full.html` to see the whole thing. |

## Recommended reading order

1. This README.
2. `01-design-system.md` — set up tokens first; everything depends on them.
3. Open `reference/Landing - Full.html` in a browser (desktop **and** a phone
   width) and scroll the whole thing once.
4. `02-sections.md` — build sections top to bottom.
5. `03-robot.md` — tackle the hero last; it's the most custom piece.
6. `notes.md` — keep open throughout for the placeholders + i18n rules.

---

## Page architecture (the real build)

A single landing page (`/`) that scrolls:

```
Hero  →  Services (01)  →  Selected Work (02)  →  Venture Labs (03)  →  Footer
```

Two **separate routes**, reachable only from the nav / hamburger (not in the home
scroll):

```
/about     →  About (team)        + same footer
/contact   →  Contact             + same footer
```

- The sticky top nav is **shared** across all pages: `Services · Work · Venture
  Labs · About · Contact`, brand on the left returns Home. On mobile it collapses
  to a hamburger → right-side drawer.
- **Venture Labs' CTA** ("Have an idea? Let's talk") routes to **`/contact`**.
- **Contact's** secondary CTA ("let the robot run a quick audit") routes back to
  **Home / the hero**.
- The **footer is dark** and global (see `notes.md` for its minimalist spec).

> ⚠️ In the reference, `Landing - Full.html` stitches sections with **iframes** and
> uses **negative margins** to close the doubled section padding. Both are
> prototype hacks — in production these are just sibling components with one
> consistent vertical rhythm. Ignore the iframes and the negative margins.

## Environment caveat (important)

The hero's **Spline WebGL scene does not render inside sandboxed previews** (you'll
see only a spinner). Always verify the robot in a **real browser**. This is
expected — not a bug in the scene.
