# Macrum 2 — Jobs To Be Done

## User-end JTBD

1. **"When I start my day, I want one briefing** so I know what's overdue, due today, and moving in the pipeline — without opening five apps."
2. **"When a new opportunity appears, I want to log it in a pipeline** so I can see every deal by stage and know the weighted value at a glance."
3. **"When I'm running a project, I want tasks in list AND board** so I can plan in a list and execute on a board, Asana-style."
4. **"When my CRM data lives in Twenty, I want Macrum to push/pull it** so Twenty stays the system of record and I don't double-enter."
5. **"When a project is just an idea, I want AI to break it into tasks** so I can approve a plan instead of typing one."
6. **"When I write messy notes, I want a summary with action items** so the thinking becomes tasks."
7. **"When I need to follow up, I want a drafted email** from the deal/contact context so I can copy, tweak, send."
8. **"When I add a company, I want projects to roll up under it** so I see each business's health in one place."
9. **"When my browser data could vanish, I want one-click backup** so years of projects aren't one clear-cache away from gone."

## Dev-plan JTBD

1. **Scaffold DDC docs** (intake/PRD/JTBD/NPAO/architecture/scorecard) so the build has a fence.
2. **Inventory the repo**: run `next build`, fix TS/build errors, catalog dead pages (files, expenses, notebook — wire or trim).
3. **Build deals domain**: context + kanban + detail, following existing context patterns exactly.
4. **Build task board**: DnD columns reusing Task context.
5. **Build Twenty server routes + UI**: verify against Twenty REST docs; never leak the key; empty-states when unset.
6. **Build AI server route + 4 features**: OpenAI-compatible; graceful degradation; no key in client.
7. **Backup export/import** in Settings.
8. **QA pass**: click every nav item; create/edit/delete across companies, projects, tasks, deals, contacts; Twenty test with real key (needs Patrick's key in env); AI test with key; `next build` clean.
9. **Deploy**: push `main` on `diamitani/macrum2`; Vercel redeploys (existing v0 project); verify `/api/health` live.
10. **Handoff**: tell Patrick his two moves — add `TWENTY_API_KEY` (+ optional `AI_API_KEY`) in Vercel env, then use it.
