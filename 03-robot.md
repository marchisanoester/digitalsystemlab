# 03 — The Robot & the Audit Experience

The hero's centerpiece is a 3D robot that **talks to the visitor and runs a playful
"audit"**. It's the brand's personality and the most custom build. Reference:
`reference/Hero - Robot 3D (Silver).html` + `reference/robot-speech.jsx`.

---

## The 3D robot (Spline)

- Scene: `https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode`, loaded via
  the **`<spline-viewer>`** web component (`@splinetool/viewer`). In the reference
  the viewer tag is **injected at runtime** (it's an ES module with relative chunk
  imports — don't inline it into a bundle).
- The **"Built with Spline" watermark** is stripped from the viewer's shadow DOM
  after load (poll the shadow root, remove the badge anchor). Keep doing this.
- **Finish:** keep the robot's real dark-metal materials, nudged silver for the
  light field: `filter: saturate(0.8) brightness(1.18) contrast(0.98)`.
- **Entrance:** start hidden + zoomed into the face (`scale(2.7)`, transform-origin
  ~`50% 28%`), then pull back to `scale(1)` over ~2.4s. To avoid a squashed first
  frame, keep the viewer hidden until the canvas aspect ≈ host aspect, then reveal.
- WebGL **does not render in sandboxed previews** — verify in a real browser.

### Production approach
Two honest options — discuss with the team:
1. **Keep Spline** as-is (fastest path to identical result). Wrap `<spline-viewer>`
   in a client component; replicate the watermark-strip + entrance.
2. **Replace** the scene with your own Canvas/R3F/Rive/Lottie robot if you want full
   control and lighter weight. Higher effort; only if the team wants it.

Either way, the **speech/audit layer below is independent of the 3D tech** and
should be rebuilt as real components.

---

## The audit conversation

When the visitor clicks the hero CTA **"Ask me a quick audit"**, the glassy pill
**morphs into a console** anchored in the same spot (bottom-center over the robot),
and the robot "speaks": a mono label + pulsing pip at the top, **word-by-word
subtitles**, then **answer chips**. It's a tiny state machine.

**Phases:** `idle → speaking → choose → … → finals → done`.

**All copy lives in one object, `AUDIT_SCRIPT`** (already i18n-shaped — move it into
your locale dictionaries):

- `cta`: "Ask me a quick audit"
- `label`: "Quick audit · live"
- `intro`: "Right — a quick audit. Three questions, no forms."
- `steps[0].q`: "First: where does your team lose hours every week?"
  options (label → ack):
  - Manual data entry → "Copying things between tools. Seen it a hundred times —
    and it's the easiest to automate."
  - Excel & Reports → "Reports that build themselves are something of a speciality
    here."
  - Answering the same messages → "The same replies, over and over. A system can
    handle the repeats and leave you the real conversations."
  - Invoices & paperwork → "Invoices and forms. Tedious for a human, trivial for a
    system — and it never makes a typo."
  - Something else → "Fair — every team has its own time sink. The humans love an
    unusual one."
- `steps[1].q`: "How many people touch that process?"
  - Just me → "A one-person bottleneck. Good news: small systems ship in weeks, not
    months."
  - 2 to 10 → "A small team. That's real hours back, every single week."
  - More than 10 → "At that scale the waste compounds. So do the savings."
- `close`: "My read: a strong candidate for a simple system. Want the humans to take
  a proper look?"
- `finals`: **WhatsApp them** (primary) · **Book a short call** (primary) · **Email
  me the summary**
- `outro`: "Done — I've left them a note. They'll take it from here."
- `again`: "Run it again"

**Flow:** intro+Q1 → pick → ack+Q2 → pick → ack+close → finals → pick → outro →
"Run it again". Subtitles reveal one word at a time; chips fade in staggered.

> The `finals` actions are currently visual. Wire them to real targets later
> (WhatsApp deep link, calendar link, mailto with a prefilled summary).

---

## The dot-matrix mouth + eyes (the "face rig")

Since the 3D scene can't be edited, the face animation is an **overlay** positioned
over the visor via CSS variables (`--face-x/y`, with a mobile override). Three parts:

1. **DotMouth** — a `<canvas>` LED grid (**13 × 5 dots**). While speaking, columns
   rise/fall in **quantized ~85ms steps** (mechanical, not fluid); between lines it
   rests as a dim center line (closed mouth). Driven by a "mouth energy" value.
2. **EyeGlows** — soft white glows over the robot's real eyes that **pulse with
   speech** and **blink** occasionally (screen blend).
3. **A glare-cover** — a soft dark radial patch behind the mouth that masks the
   visor's specular highlight while talking (so the dot mouth reads cleanly).

Alignment is **estimate-based** (the overlay can't know the exact 3D mouth position),
so the reference exposes tweak offsets (X / Y / scale, separate desktop & mobile)
and an "Alignment guide" toggle. Current tuned values (desktop / mobile):
`mouthDX −0.5 / mouthDXm 1`, `mouthDY −5 / mouthDYm −21`, `mouthScale 0.5 /
mouthScalem 0.4`, `glareCover 0.55`, `headFollow 4`, `voiceSpeed 1.3`.

> **Open polish item:** the user noted the glare-cover may not fully kill the chin
> highlight on some displays — they'll verify on mobile. Expose mouth alignment +
> glare as adjustable constants so this can be dialed in on real devices.

**Head gestures while talking:** the real Spline head follows the cursor. While the
robot speaks, the reference **mutes the viewer's pointer events** and dispatches a
slow **synthetic `pointermove` wander** near center, so the head/eyes face the
viewer with subtle life. The face rig can also lightly **follow that motion**
(`headFollow`) so mouth+eyes ride with the head.

---

## ⭐ The voice hook (`speakingRef.level`) — reserved for TTS

The mouth is driven by a single normalized **"energy" signal**, `speakingRef.level`
(0–1), bumped per spoken word and decayed each animation frame. **This is the
integration point for real audio/voice**, which the team plans to add later (TTS or
free voice clips):

> Replace the per-word synthetic energy with the **real-time amplitude of the
> playing audio** (e.g. Web Audio `AnalyserNode` RMS → `speakingRef.level`). The dot
> mouth then lip-syncs to the actual sound instead of estimated word timing — no
> other change needed. Keep `level` normalized 0–1.

Preserve this seam when you rebuild: a single `level` signal feeding the mouth, with
the *source* of that signal swappable (synthetic now, audio later).

---

## Tweaks panel

The reference wires a small in-page **Tweaks** panel (`reference/tweaks-panel.jsx`)
exposing the mouth alignment, glare, head-follow, eye-glow, head-gestures and voice
speed. That's a **prototype authoring aid** — you don't need to ship it, but keep
the underlying values as configurable constants so the face can be tuned on real
hardware.
