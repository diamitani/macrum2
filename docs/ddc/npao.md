# Macrum 2 — NPAO (Now / Next / Later / Out)

## NOW (this build — the vertical slice)
- Fix build; keep every existing page working
- Deals pipeline: context + kanban DnD + detail + forecast totals
- Tasks: add Board view (List ⇄ Board toggle)
- Twenty: server routes (status/list/push/pull), Settings integration card, sync buttons + badges, `/twenty` browser page
- AI: `/api/ai` route + 4 features (task breakdown, note summary, follow-up draft, daily briefing), graceful no-key state
- Data backup: export/import JSON in Settings
- `/api/health`, `/api/ready`
- `.env.example`, `docs/ddc/*`, `AGENTS.md`
- Deploy to Vercel via `main`; verify live

## NEXT (once Patrick uses it daily)
- Supabase migration: Postgres + RLS, real auth (email/magic link), data import from localStorage backup
- Twenty two-way sync (poll or webhooks), conflict resolution UI
- AI: project risk radar ("what's slipping and why"), meeting-prep briefs from calendar
- PWA installable; offline queue for Twenty pushes
- Seed his real companies/projects (Salesgency, Artispreneur, Rostr, TrainLola, CivicPie, Diamitani Industries…)

## LATER
- Team/multi-user, roles, shared pipelines
- Email send from drafts (Resend), calendar two-way (Google)
- Twenty custom objects mapping UI
- Native mobile

## OUT (never, unless a new intake says so)
- Billing/payments inside Macrum
- Public marketing site or multi-tenant SaaS
- Replacing Twenty as system of record — Twenty stays the CRM cloud; Macrum is the operator surface
