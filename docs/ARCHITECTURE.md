# Architecture

## Stack
- **Frontend:** Next.js 14 (App Router) — mobile-first, deployed on Vercel
- **Database + Auth:** Supabase (Postgres + Storage for shelf photos)
- **AI:** OpenAI GPT-4o via Supabase Edge Function (`analyze-report`)
- **Storage:** Supabase Storage bucket `shelf_photos`

## What to Build Now vs Later
**Now:** Daily report form → AI analysis → supervisor review → CEO dashboard (all open, no auth).
**Later:** Auth + RLS owner policies, weekly/monthly compiled reports, photo compliance AI, WhatsApp delivery.

## Key User Action — Step-by-Step
1. SPG opens `/report/new` on phone, fills form fields, attaches shelf photo.
2. `POST /api/submit-report` inserts `daily_reports` row, uploads photo to Storage.
3. Same request calls Edge Function `analyze-report` with structured field payload.
4. Edge Function builds a prompt, calls OpenAI, parses JSON response, inserts `ai_analyses` row.
5. Response returns `report_id`; browser redirects to `/report/[id]`.
6. Page fetches `daily_reports` JOIN `ai_analyses` — renders KPI card, problem flags, recommended actions.
7. Supervisor opens `/supervisor`, sees new report badge, opens it, adds `coaching_notes` row.
8. CEO homepage `/` aggregates all `daily_reports` + `ai_analyses` via Supabase views.

## Why the Core Runs Without AI
All report data is stored in `daily_reports` regardless of AI success. Rule-based `outlet_score` is computed server-side from conversion rate, display compliance, and stock status. `ai_analyses.status` tracks the AI job as `pending` → `processing` → `completed` | `failed`. If the OpenAI call fails, the row is marked `failed` (with `last_error` set) instead of being skipped, and the report page shows an "AI analysis pending/failed" fallback — the report is never lost, and a failed analysis can be requeued via the `retry_ai_analysis` database function.

## Company Scope
Every `outlet`, `spg`, `supervisor`, and `daily_report` belongs to a `company` (seeded: **Pring Mas**). v1 still runs as a single company end-to-end; the column exists so multi-company support doesn't require a schema migration later.

## Master Data Access
`lib/master-data/queries.ts` holds read-only helpers (`getCompanies`, `getOutlets`, `getSupervisors`, `getSpgs`) for fetching reference/master data through the Supabase JS client. These are plain data-access functions — no UI is built on top of them yet; Sprint 2+ wires them into the report form and dashboards.
