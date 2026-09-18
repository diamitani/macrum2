# AGENTS.md — Macrum 2 repo-local operating notes

## Stack
Next.js 15.2.4 + React 19 + Tailwind 3.4 + shadcn/ui. All data is
client-side localStorage via React contexts (no database yet).

## Install
- `pnpm-lock.yaml` is the source of truth.
- This VM has NO `pnpm`/`corepack` on PATH. Use: `npx -y pnpm@9 install`
  (plain `npm install` fails on a react-day-picker@8 ↔ react@19 peer conflict;
  `npm install --legacy-peer-deps` is the last-resort fallback).
- `@dnd-kit/core` + `@dnd-kit/sortable` are required deps (kanban DnD).
- PITFALL (2026-09-17): a `pnpm-workspace.yaml` containing only
  `allowBuilds: sharp: true` makes pnpm 9 fail with
  "ERROR packages field missing or empty". It is pnpm-10 syntax and this
  repo is NOT a workspace — delete the file if it reappears, then re-run install.

## Build
1. `node_modules/.bin/tsc --noEmit` — must be clean.
2. `node_modules/.bin/next build` — must be clean.
- NEVER run `next dev` while a build is running — they share `.next/`
  and the build fails (2026-09-16 lesson, still true).
- Also do NOT `next start` (serve) `.next` while rebuilding: a sibling's
  `next start` server died mid-build and the build failed at
  "Collecting page data" with `ENOENT .next/server/pages-manifest.json`.
  Fix: stop all next processes, `rm -rf .next`, rebuild.
- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` — fix TS errors
  anyway; the build gate must be genuinely clean, not skipped.

## localStorage store pattern (see `context/task-context.tsx`)
Every entity context follows the same shape:
- `const <NAME>_STORAGE_KEY = "macrum_<entity>"`
- Load once on mount inside `useEffect` (JSON.parse, try/catch; toast + clear on corruption).
- Persist on change in a second `useEffect`, gated on `!isLoading`.
- Async CRUD fns with `useCallback`; toasts on success/failure via `@/components/ui/use-toast`.
- IDs via `generateId()` from `@/lib/utils`.

Known keys (all `macrum_` prefixed, all lowercase snake):
`macrum_auth`, `macrum_user`, `macrum_businesses`, `macrum_projects`,
`macrum_clients`, `macrum_tasks`, `macrum_deals`, `macrum_notes`.

## Secrets
- ALL Twenty/AI keys are SERVER-SIDE ONLY. Never use a `NEXT_PUBLIC_` prefix
  for a secret; only server code (`app/api/*`, server actions) may read them.
- `.env.local` is gitignored; `.env.example` holds variable NAMES only.
- Required names: `TWENTY_API_KEY`, `TWENTY_API_URL`, `AI_API_KEY`,
  `AI_API_BASE_URL`, `AI_MODEL`. The app degrades gracefully without AI keys.

## File ownership (sibling agents — do NOT edit their files)
`app/providers.tsx`, `components/sidebar.tsx`, `app/tasks/*`, `app/deals/*`,
`app/twenty/*`, `app/api/*`, `context/deal-context.tsx`,
`components/*kanban*`, `components/*board*`, `components/twenty*`, `components/ai*`.
Bug-fixes in `page.tsx`/`components`/`lib`/`types` are OK; no new features.

## Git push flow (NOT done by build agents)
- No local git repo in this directory. The final push is done by a later agent
  via `~/workspace/github-helpers/tree_sync.py` (syncs exact tree as one commit,
  then moves the ref and verifies with a recursive-tree diff).
- When using the github helpers yourself: read `~/workspace/skills/github/SKILL.md`
  FIRST; use `~/workspace/skills/github/bin/ghapi.py` with the stored
  `custom.github` credential. NEVER raw tokens, NEVER print token values.
