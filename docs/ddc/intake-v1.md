# DDC Intake — Macrum 2 (immutable v1)

**Date:** 2026-09-17
**Source:** Patrick Diamitani, voice brief (side chat)
**Status:** LOCKED — do not reinterpret in later chats; supersede only by new intake version.

## What was said (verbatim-ish)

> "Finish building macrum it's macrum 2 on my GitHub. So I can use it to manage all my projects and companies etc incorporate twenty.com into it I just put an api key. Also remember asana like plus Hubspot combined. Use an ai feature as well where needed. Delali design principles"

## PAL parse

- **Parse:** Finish the existing `diamitani/macrum2` repo (v0-generated "Modular CRM System") into a usable personal OS: manage ALL projects + companies. Asana-like (projects/tasks) PLUS HubSpot-like (companies/contacts/deals CRM). Integrate Twenty CRM (twenty.com) using an API key he says he just put somewhere. Add AI features where they earn their place. Follow Delali (DDC) principles.
- **Ambiguity scan (what would wreck us if wrong):**
  1. Where is the Twenty API key? Not in the repo, not in env, not reachable from sandbox vault. → Build reads `TWENTY_API_KEY` from server env; Patrick adds it in Vercel (his move) or tells us where he put it.
  2. "Manage all my projects and companies" — single-user personal tool, not multi-tenant SaaS. → No signup flows, no billing, no team features in Now.
  3. Data today is localStorage-only. → Keep it for Now (works today, zero backend); add export/import backup; Supabase migration is Next.
  4. Which AI key? → `/api/ai` uses OpenAI-compatible `AI_API_KEY` (default base OpenRouter); graceful "not configured" state when unset.
- **Latent intent:** One command center for his ~15 companies/projects (Salesgency, Artispreneur, Rostr, TrainLola, CivicPie, Diamitani Industries…) instead of scattered tools. He wants Asana's execution + HubSpot's pipeline + Twenty as the CRM system of record, with AI doing the grunt work.
- **Expand:** Screens — dashboard, companies, projects (+detail), tasks (list+board), deals pipeline (NEW), contacts, clients, calendar, files, notebook, settings/integrations. Data — existing 4 contexts + new deals context; server routes only for Twenty + AI. Threats — API keys in client/git (mitigate: server-only env), localStorage loss (mitigate: export/import). Cost — Vercel hobby, OpenRouter pennies.
- **Compile:** This file + prd.md + jtbd.md + npao.md + architecture.md + quality-scorecard.md are the fence. Build unlocks after quality ≥ 4/5.

## Non-goals (fence)

- No multi-user, teams, roles, or permissions (single operator).
- No payments/billing.
- No real auth system in Now (keep existing local gate; Supabase Auth is Next).
- No email sending; AI drafts copy, user sends.
- No v0.dev round-trip — we build directly on `main`.

## Done-when (acceptance)

1. `next build` clean, deployed to Vercel, `/api/health` 200.
2. Deals pipeline works end-to-end (create → drag across stages → won/lost).
3. Task board view works alongside list view.
4. Twenty: connection test passes with his key; push company/contact/deal to Twenty; pull lists from Twenty.
5. AI: task breakdown, note summary, follow-up draft, daily briefing — all working with key, all degrade gracefully without.
6. Export/import backup works.
7. No secrets in client bundle or git.
