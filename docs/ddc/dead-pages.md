# Dead / Placeholder Pages — Macrum 2 audit (2026-09-17, QA pass 2026-09-18)

Inventory + QA fixes. "Dead" = renders but does nothing / has no data source.
"Placeholder" = functional UI shell fed by hardcoded or mock data.

## Fixed in QA pass (2026-09-18)

### `/contacts` — rebuilt, wired to Client context (`macrum_clients`)
Search, add, edit, delete all work via dialog; shows Twenty sync badge per row.

### `/clients/[id]` — rebuilt (was a hardcoded `notFound()` mock)
Wired to `useClientContext`: real detail, Edit link, delete, `TwentyBadge` +
`TwentySyncButton type="person"`, `FollowupDialog recordType="contact"`,
projects tab via `ProjectList clientId`.

### `/clients/[id]/edit` — created
Uses existing `ClientForm clientId`; the card's Edit dropdown link now resolves.

### `/calendar` — wired to the task store
Replaced the hardcoded May-2023 sample events with real events derived from
tasks that have `dueDate`. "Add Event" opens the (working) task create dialog;
clicking an event navigates to `/tasks`.

### `/files` — honest coming-soon placeholder
Removed the dead "Upload Files" buttons. Uploads need a storage backend decision
(Supabase / open-source object storage) before wiring; the page says so plainly.

### `/marketing` — dead links fixed
Removed `#pricing` / `#about` header links (no such sections), retargeted
"Watch Demo" (`#demo` anchor) to a real Get Started CTA, removed 404 footer
links (`/marketing/security`, `/marketing/about`, `/marketing/privacy`,
`/marketing/help`, `/marketing/docs`). Remaining anchors all resolve.

### `/marketing/contact` — form now responds
`onSubmit` handler: validates the message, shows a toast acknowledging receipt,
and is explicit that the demo form doesn't send email yet (email sending is
out of scope per PRD §5).

### Sidebar sign-out — fixed
Was `router.push("/login")` (route doesn't exist → 404) plus a `console.log`
stub. Now clears `macrum_auth`/`macrum_user` and routes to `/auth/signin`.

## Still open

- `/files` uploads: blocked on the storage decision (Supabase / open-source) —
  flagged in the PRD intake as Patrick's move.
- `/marketing/contact` email delivery: needs a mail backend (out of scope, PRD §5).

## Functional (not dead — listed to avoid re-auditing)

- `/` — auth gate (`macrum_auth` in localStorage): redirects unauthenticated to `/marketing`.
- `/auth/signin`, `/auth/signup` — mock localStorage auth (`macrum_auth`, `macrum_user`).
- `/businesses`, `/businesses/new`, `/businesses/[id]`, `/businesses/[id]/edit` — context-backed CRUD + Twenty sync.
- `/projects`, `/projects/new`, `/projects/[id]` — context-backed CRUD + task-breakdown AI.
- `/clients`, `/clients/new`, `/clients/[id]`, `/clients/[id]/edit` — context-backed CRUD + Twenty sync.
- `/tasks` — list ⇄ board toggle (sibling agent owned), context-backed.
- `/notebook` — notes CRUD in `macrum_notes` localStorage key + summarize AI.
- `/contacts` — contacts CRUD wired to `macrum_clients`.
- `/deals`, `/deals/[id]` — kanban pipeline with `@dnd-kit/core` drag & drop; deal detail has Twenty sync + follow-up draft.
- `/twenty` — Twenty CRM page with "Connect your Twenty API key" empty state.
- `/settings` — Twenty integration card (Test button), Data backup export/import.
- `/api/health`, `/api/ready` — ops probes.
- `/api/ai/*` (breakdown, briefing, followup, summarize) — 503 + `hint:"add AI_API_KEY"` without a key.
- `/api/twenty/*` (status, sync, pull, `[type]`) — 503 + setup hint without a key.
