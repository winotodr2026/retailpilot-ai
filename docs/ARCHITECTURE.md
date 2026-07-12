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
All report data is stored in `daily_reports` regardless of AI success. Rule-based `outlet_score` is computed server-side from conversion rate, display compliance, and stock status. If the OpenAI call fails, `ai_analyses` row is skipped and the report page shows a "AI analysis pending" fallback — the report is not lost.
