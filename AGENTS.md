# AGENTS.md — entry point for Codex / OpenAI agents

You are building the **production version** of the studio landing page.

**Read `README.md` first**, then follow the package in order:
`01-design-system.md` → open `reference/Landing - Full.html` in a real browser →
`02-sections.md` → `03-robot.md` → keep `notes.md` open throughout.

**Stack:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Framer Motion,
i18n-ready (ship EN).

**Golden rule:** the files in `reference/` are the source of truth for look &
behaviour — *watch them run*, don't infer from code. Re-implement idiomatically with
scoped components; do **not** copy the prototype's global CSS / iframe assembly.

> This package is the same for Codex and Claude Code by design — the spec is
> stack-agnostic. This file and `CLAUDE.md` are identical pointers so each agent
> finds its conventional entry file. The real content is in the numbered docs.

Everything below `reference/` is runnable prototype, not production code. The Spline
robot needs a real browser (no WebGL in sandboxed previews).
