# Macrum 2 — PRD (v1, Now slice)

## 1. Product
Macrum 2 is Patrick's personal operating system: **Asana-like execution + HubSpot-like CRM**, with **Twenty CRM as the cloud system of record** and **AI where it earns its place**. Single user. Web app (Next.js 15, React 19, Tailwind, shadcn/ui).

## 2. Users
One: Patrick Diamitani, founder running 6+ companies and 15+ projects. Phone-first dictation, desktop for deep work. Grade-7 intake language; board-level output.

## 3. Functional requirements

### 3.1 Keep (already in repo, must keep working)
- Dashboard (stats, recent projects, business overview, overdue alerts)
- Businesses/Companies CRUD + detail (projects roll up)
- Projects CRUD + detail
- Tasks list view (search, status/priority filters, create dialog, dependencies)
- Clients, Contacts, Calendar, Files, Notebook, Expenses, Marketing pages
- Sidebar nav, dashboard header, toasts, theme

### 3.2 NEW — Deals pipeline (HubSpot core)
- `Deal`: id, name, amount, currency, stage, companyId, contactId, closeDate, notes, twentyId?, createdAt, updatedAt
- Stages: `lead → qualified → proposal → negotiation → won | lost`
- Kanban board with drag-and-drop between stages; pipeline value totals per stage + weighted forecast
- Deal detail drawer/page: edit fields, linked company/contact, activity notes
- localStorage-backed `DealProvider` context mirroring existing patterns

### 3.3 NEW — Task board view (Asana core)
- Board columns: Todo / In Progress / In Review / Completed; drag-and-drop status change
- Toggle List ⇄ Board on `/tasks`; board respects project filter

### 3.4 NEW — Twenty integration
- Settings → Integrations → Twenty card: base URL (default `https://api.twenty.com`), connection status, Test button
- Secrets: `TWENTY_API_KEY`, `TWENTY_API_URL` — server-only env, never in client/git
- Server routes (`/api/twenty/...`):
  - `GET /api/twenty/status` — verifies key against Twenty (returns workspace info or error; never echoes key)
  - `GET /api/twenty/companies|people|opportunities` — list from Twenty
  - `POST /api/twenty/sync` — push one record `{type: company|person|opportunity, id}` → creates/updates in Twenty, stores `twentyId` back
  - `POST /api/twenty/pull` — import Twenty records into Macrum (dedup by twentyId/email)
- UI: "Sync to Twenty" buttons on company/contact/deal; sync badge (synced/not/failed); Twenty browser page (`/twenty`) to view + pull
- Graceful: every Twenty surface shows "Connect your Twenty API key" empty-state when unset

### 3.5 NEW — AI features (server route `/api/ai/*`, OpenAI-compatible)
- Env: `AI_API_KEY`, `AI_API_BASE_URL` (default `https://openrouter.ai/api/v1`), `AI_MODEL` (default cheap+capable, e.g. `openai/gpt-4o-mini` class)
- Features:
  1. **Break down into tasks** (project page): brief → proposed task list (title, priority, due offsets) → user approves → tasks created
  2. **Summarize** (notebook): note → 3-bullet summary + action items
  3. **Draft follow-up** (contact/deal): context → email draft copied to clipboard
  4. **Daily briefing** (dashboard): overdue + due-today + pipeline movement → morning brief card
- All AI UI degrades to "AI not configured — add AI_API_KEY" with setup hint when key missing; never blocks the app

### 3.6 Data safety
- Settings → Data: Export JSON (all stores) / Import JSON (merge by id); download filename `macrum-backup-YYYY-MM-DD.json`

### 3.7 Ops
- `GET /api/health` → `{ok:true, version, time}`; `GET /api/ready` → checks env presence (names only)

## 4. Non-functional
- Build: `tsc` + `next build` clean, zero new console errors on core flows
- Perf: dashboard interactive < 2s on broadband; no new heavy deps (dnd: use `@dnd-kit` — small, already-ecosystem-compatible; if it bloats, native HTML5 DnD)
- A11y: keyboard-reachable kanban (buttons to move stage as fallback), labels on all inputs
- Security: keys server-side only; `.env.example` documents names without values; no PII in logs
- Taste: shadcn tokens as-is; anti-slop pass — consistent spacing, one accent, no emoji icons, Lucide only

## 5. Out of scope (Now)
Supabase migration, real auth, teams, email sending, mobile native, Twenty webhooks/realtime, public sharing.
