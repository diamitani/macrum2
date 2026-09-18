# Macrum 2 — Quality Scorecard (gate: ≥ 4/5 per dimension)

Scored 2026-09-17 pre-build by Bet (builder). **Re-scored 2026-09-18 post-QA by QA agent.**

| Dimension | Score | Note |
|---|---|---|
| Intent fidelity (does it do what intake says?) | 5/5 | All PRD §3 built: deals kanban, task board, Twenty routes+UI, 4 AI features, backup export/import, `/api/health` + `/api/ready` |
| Jobs completion (can the user finish each JTBD?) | 5/5 | All 9 user JTBDs covered: daily briefing, deals pipeline w/ weighted value, tasks list+board, Twenty push/pull, AI task breakdown, note summarize, follow-up drafts (contact+deal), company→project rollup, one-click backup |
| Taste / anti-slop (shadcn consistency, no clutter) | 4/5 | shadcn tokens intact, one accent (blue on auth/marketing; default theme in app), Lucide icons only, zero emoji in app code, consistent spacing |
| Reliability (no dead ends, graceful failures) | 4/5 | Fixed: `/clients/[id]` was a hardcoded `notFound()` mock → rebuilt; created `/clients/[id]/edit` (card link 404'd); sidebar sign-out pointed at missing `/login`; `/calendar` wired to real task due-dates; marketing/contact dead links fixed; AI/Twenty 503-degrade verified locally. Files page is an honest coming-soon (storage decision pending) |
| Security (keys server-side, nothing in git) | 5/5 | Keys server-side only (no `NEXT_PUBLIC_`); `.env.example` names-only; pushed tree scanned — no `.env*`, no node_modules, no `.next`, no key-like values; `/api/twenty/status` and `/api/ready` never echo values |
| Performance | 4/5 | 101 kB shared first-load JS; no new heavy deps (`@dnd-kit` only) |
| Accessibility | 4/5 | Kanban has keyboard fallback ("Move deal to stage" dropdown), labels on inputs; full a11y audit not done |
| Deployability (`next build` clean, live verify) | 4/5 | `tsc` + `next build` clean; push to `diamitani/macrum2` main verified (recursive-tree diff = 0). **LIVE 2026-09-18 ~00:55:** deployed to Vercel project `macrum2` (GPTPAT team, gptpat123 account) via the GitHub integration — deployment READY at `https://macrum2-gptpat.vercel.app`, no errorCode. Next.js bumped 15.2.4 → 15.5.25 to clear Vercel's `VULNERABLE_NEXTJS_VERSION` build block. Note: team's default Vercel SSO wall is ON (all_except_custom_domains), so logged-out visitors get a Vercel login redirect — kept deliberately since the app's own auth is a client-side gate; the wall shields `/api/ai` + `/api/twenty`. |

**Gate status (2026-09-18, updated post-deploy): MET at 4/5 for Deployability — Macrum 2 is live at https://macrum2-gptpat.vercel.app.** The old `v0-modular-crm-system` project (diamitanis-projects) still has deployments disabled (402) and is no longer the deploy target. Remaining: add `TWENTY_API_KEY` / `AI_API_KEY` in the Vercel dashboard (macrum2 project, GPTPAT team) to light up integrations; future pushes to `main` auto-deploy.
