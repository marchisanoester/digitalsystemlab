# Next steps — building the production site

This `handoff/` folder is everything a coding agent needs to build the production
site. Read this after `README.md`.

### 1. Where the files go
Put the **whole `handoff/` folder** at the root of a fresh repo (or inside the
Next.js project). Claude Code reads `CLAUDE.md` first; Codex reads `AGENTS.md`.
Both point to `README.md`, which drives the rest.

### 2. Look at the target first
Open `reference/Landing - Full.html` in a real browser — desktop **and** a phone
width — and scroll the whole thing. Open `reference/Section - About.html` and
`reference/Section - Contact.html` too (they're separate pages). That rendered
result is the goal. *(The robot needs internet; if it spins forever, that's the
sandbox — it works in a normal browser.)*

### 3. How to brief the agent
Start the agent in the repo and say, in essence:

> "Read `handoff/README.md` and the numbered docs, then build this as a Next.js +
> TypeScript + Tailwind + shadcn + Framer Motion app, i18n-ready in English. The
> files in `handoff/reference/` are the source of truth for look and behaviour —
> match them. Start with the design tokens, then build section by section."

Then work through it **section by section** (Hero last — it's the robot). Check
each against the matching `reference/` file as you go.

### 4. Build order
1. Design tokens + base layout (`01-design-system.md`).
2. Shared nav + mobile drawer + dark footer.
3. Services → Selected Work → Venture Labs (the home scroll).
4. About + Contact (separate routes).
5. Hero + robot + audit experience last (`03-robot.md`).

### 5. Before launch — fill the placeholders
See `notes.md` for the full list: studio name, real email + WhatsApp + social
links, the team's posed AI video clips (swap into About), and the robot's
final-step actions. Keep all of it in config/dictionaries so it's easy to edit.

---

### Package contents

```
handoff/
├── README.md              entry point
├── CLAUDE.md              pointer for Claude Code
├── AGENTS.md              pointer for Codex
├── 01-design-system.md    tokens, type, grid
├── 02-sections.md         every section: copy + motion
├── 03-robot.md            the robot + audit + voice hook
├── notes.md               i18n, placeholders, rationale
├── next-steps.md          this file
└── reference/             runnable HTML/CSS/JS + media
    ├── Landing - Full.html      ← open this first
    ├── Hero - Robot 3D (Silver).html
    ├── Section - *.html
    ├── robot-speech.jsx · tweaks-panel.jsx · image-slot.js
    └── assets/  (esup-home.mp4, foxplan.mp4, gecko.mp4, michel.png, esther.jpg)
```
