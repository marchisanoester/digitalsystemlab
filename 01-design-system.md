# 01 — Design System

The whole landing runs on a small, deliberate token set. Lock these first.

---

## Color

| Token | Hex | Role |
|---|---|---|
| `bg` | `#fbfbfa` | Page background (warm off-white). The whole site is light. |
| `ink` | `#1b1b1a` | Primary text, filled buttons, the dark footer bg. |
| `ink-soft` | `#3c3c39` | Secondary headings / emphasised body. |
| `muted` | `#5f5f5a` | Body copy. |
| `muted-2` | `#76766f` | Tertiary text, captions. |
| `faint` | `#9a9a93` | Eyebrow labels, footer meta, the faintest text. |
| `teal` | `#54b394` | **The** accent. Active states, the moving part of every animated icon, the brand's first dot, links-on-hover. Use sparingly — it earns attention. |
| `orange` | `#e9674c` | Brand dot #2. Rare as a UI color. |
| `yellow` | `#edbb52` | Brand dot #3; the "in development" status pulse. |
| `line` | `rgba(20,20,20,0.10)` | Hairline borders / dividers. |
| `line-soft` | `rgba(20,20,20,0.07)` | Even fainter inner dividers. |

```css
:root{
  --bg:#fbfbfa; --ink:#1b1b1a; --ink-soft:#3c3c39;
  --muted:#5f5f5a; --muted-2:#76766f; --faint:#9a9a93;
  --teal:#54b394; --orange:#e9674c; --yellow:#edbb52;
  --line:rgba(20,20,20,0.10); --line-soft:rgba(20,20,20,0.07);
}
```

- **Dark footer** inverts: bg `--ink`, text `#d9d9d4`, brand name `#fbfbfa`,
  meta `#8a8a83`, social-icon borders `rgba(255,255,255,0.16)`, hover border `--teal`.
- The three **brand dots** (teal / orange / yellow, 6–7px circles, 4px gap) are a
  recurring motif: in the eyebrow label, the nav brand, and the footer.

---

## Typography

Three families, each with one job. Google Fonts import:

```
Newsreader        — ital,opsz,wght@0,6..72,400 ; 0,6..72,500 ; 1,6..72,400
Hanken Grotesk    — wght@400;500;600;700
IBM Plex Mono     — wght@400;500
```

| Family | Use | Notes |
|---|---|---|
| **Newsreader** (serif) | All headlines (h1/h2), section titles, names, the footer brand name. | weight 400, `letter-spacing:-0.02em`, `line-height:~1.04`. Italic is used for one emphasised word per headline (e.g. *friction*, *quiet*, *working*) in `ink-soft`. |
| **Hanken Grotesk** (sans) | Body, UI, buttons, nav links. | 400 body, 600 buttons/strong. |
| **IBM Plex Mono** | Eyebrow labels, section numbers, tags, footer meta, status pills. | uppercase, wide tracking (0.14–0.22em). |

### Type scale (reference values — keep fluid with `clamp`)

| Element | Size |
|---|---|
| Hero H1 | `clamp(40px, 5.2vw, 66px)` (mobile floor `clamp(33px,9vw,46px)`) |
| Section H2 | `clamp(34px, 4.8–5.2vw, 58–62px)` |
| Section title (service row / case / name) | 20–33px |
| Body / lede | 16.5–19px, `line-height:1.55–1.62`, `text-wrap:pretty` |
| Eyebrow label | 11.5px mono, `0.22em`, uppercase |
| Tags / chips / meta | 9.5–13.5px |

> Hero H1 uses a subtle **vertical gradient fill** on the serif text:
> `linear-gradient(to bottom, #151514 0%, #3c3c39 62%, #6b6b66 100%)` clipped to
> the text. Optional but it's the intended look.

---

## The "eyebrow" label (recurring component)

Every section opens with the same mono label: **three brand dots + section number
+ name**, centered (left-aligned only in the hero).

```
●●●  01 — SERVICES
```

- Dots: teal / orange / yellow, 6px circles, 4px gap.
- Text: IBM Plex Mono, 11.5px, `letter-spacing:0.22em`, uppercase, color `faint`.
- Numbering (current order): **01 Services · 02 Selected work · 03 Venture Labs ·
  04 Who we are (About) · 05 Contact**.

---

## Grid relief (the faint background texture)

A **44 × 44px** grid of 1px lines at `rgba(27,27,26,0.045)`, applied as a section
`::before` / `::after` and **radially masked** so it only whispers near a corner
and fades out — never a full visible grid. It's continuity glue: most sections
carry one patch top (near a corner) and one bottom, so the texture appears to flow
from one section into the next.

```css
background-image:
  linear-gradient(to right, rgba(27,27,26,0.045) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(27,27,26,0.045) 1px, transparent 1px);
background-size:44px 44px;
-webkit-mask-image: radial-gradient(90% 70% at 12% 8%, #000 0%, transparent 62%);
        mask-image: radial-gradient(90% 70% at 12% 8%, #000 0%, transparent 62%);
```

Vary the mask's origin per section (top-left, top-center, top-right, bottom) so it
doesn't look mechanical. Keep it **near-invisible** — if you can clearly read a
grid, it's too strong.

---

## Spacing & layout

- **Section padding:** `clamp(72px, 11vh, 140px)` block / `clamp(22px, 5vw, 64px)`
  inline. Hero and Venture Labs run a touch taller.
- **Content max-width:** `1180px`, centered.
- **Radii:** pills `999px`; cards/frames `12–22px`; small inner chips `6–12px`.
- **Hairlines:** 1px `--line` for all dividers and card borders.
- **Shadows:** soft and low — e.g. cards `0 18px 40px -28px rgba(20,20,20,0.4)`;
  glassy pills `0 10–14px 30–40px rgba(15,15,16,0.14–0.16)`. Nothing harsh.

## Motion principles

- Calm and **mechanical-but-quiet**. Accent (`teal`) carries the only moving color.
- Looping decorative micro-animations are fine but **subtle** (2.4–6s, low
  amplitude). No bouncy easing on content.
- **Always** honour `prefers-reduced-motion: reduce` — every animated piece in the
  reference has a reduced-motion fallback that shows the resolved end-state.
- Standard easing in use: `cubic-bezier(.2,.7,.2,1)` for entrances/expansions.

## Buttons & links (patterns)

- **Primary:** filled `--ink` pill, text `--bg`, 14–17px/600, `padding:14–16px
  24–30px`, hover lifts `-1px` + bg `#2c2c2a`. Often a teal `pip` dot or `→` that
  nudges on hover.
- **Secondary / link:** text with a 1px bottom border that darkens on hover.
- **Chip / option:** white pill, `--line` border, hover border → teal.
- **Glassy pill (hero CTA):** translucent white, `backdrop-filter: blur(8px)`,
  hairline border — it floats over the robot.
