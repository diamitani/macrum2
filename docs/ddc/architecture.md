# Macrum 2 — Architecture (Now slice)

## Topology
```
Browser (Next.js 15 client components, shadcn/ui, Tailwind)
  ├─ localStorage contexts (businesses, projects, tasks, clients, deals*)  ← single-user store
  └─ fetch → Next.js Route Handlers (server-only)
        ├─ /api/twenty/*  → https://api.twenty.com/rest/* (Bearer TWENTY_API_KEY)
        ├─ /api/ai/*      → OpenAI-compatible chat completions (Bearer AI_API_KEY)
        └─ /api/health, /api/ready
Vercel (existing v0 project redeploys from main)
```

## Key decisions (ADRs)
1. **Keep localStorage for Now.** Zero-backend, works today, no key rotation blockers. Backup export/import mitigates loss. Supabase migration is Next (intake-locked).
2. **Server routes for all external calls.** Twenty + AI keys never touch the client. Route handlers validate env presence and return 503 with a setup hint when missing — UI degrades, never crashes.
3. **Mirror existing context patterns** for the new deals store (`DealProvider`, `macrum_deals` key) — consistency over novelty.
4. **DnD:** `@dnd-kit/core` + `@dnd-kit/sortable` (small, accessible, React 19 compatible). Fallback: per-card "Move to ▸" menu for keyboard users.
5. **AI provider-agnostic:** OpenAI chat-completions shape; `AI_API_BASE_URL` default `https://openrouter.ai/api/v1`, `AI_MODEL` default `openai/gpt-4o-mini`. Swap by env, not code.

## Twenty REST contract (verify against developers.twenty.com during build)
- Base: `TWENTY_API_URL` (default `https://api.twenty.com`), Auth: `Authorization: Bearer <key>`
- `GET /rest/companies`, `GET /rest/people`, `GET /rest/opportunities` (query: `filter`, `limit`, `depth`)
- `POST /rest/companies|people|opportunities` create; `PATCH /rest/<object>/<id>` update
- Mapping: Macrum company → Twenty company `{name, domainName}`; contact → person `{name:{firstName,lastName}, email, companyId}`; deal → opportunity `{name, amount:{amountMicros, currencyCode}, stage, companyId, closeDate}`
- Store returned Twenty `id` as `twentyId` on the Macrum record; dedupe pulls by `twentyId` then email/name.

## Well-Architected answers (Now slice)
- **Operational excellence:** `/api/health` + `/api/ready`; docs/ddc versioned; deploy = push to main (Vercel auto-deploy).
- **Security:** keys server-side only; `.env.example` names-without-values; `.gitignore` covers `.env*`; no key echo in status APIs; no PII in logs; fake local gate kept (real auth = Next).
- **Reliability:** localStorage try/catch + corruption reset (existing pattern); export/import backup; Twenty/AI failures surface as toasts + badges, never blank pages.
- **Performance:** no new heavy deps beyond dnd-kit; AI/Twenty calls server-side with 25s timeout; dashboard unchanged weight.
- **Cost:** Vercel hobby; AI defaults to mini-class model; Twenty cloud free tier. No spend without Patrick's explicit key + usage.
- **Sustainability:** Next = Supabase migration reuses these route handlers as the integration layer (topology change, not rewrite).

## Env (server-only)
```
TWENTY_API_KEY=            # his key — he adds in Vercel dashboard
TWENTY_API_URL=https://api.twenty.com
AI_API_KEY=                # optional; OpenRouter or OpenAI key
AI_API_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=openai/gpt-4o-mini
```
