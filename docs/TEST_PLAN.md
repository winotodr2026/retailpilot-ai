# Test Plan

## Success Scenario (manual, end-to-end)
1. Open live URL `/` — verify KPI cards and outlet table render with data (not blank).
2. Click "Submit Report" → `/report/new` loads with empty form.
3. Select outlet "Transmart Cempaka Mas", fill all numeric fields, enter competitor note, add feedback text.
4. Attach a JPG photo — verify preview appears.
5. Click Submit — verify loading spinner appears, button disables.
6. Verify redirect to `/report/[id]` — page shows: outlet name, all submitted numbers, AI KPI summary text, at least 1 problem flag, at least 1 recommended action.
7. Open Supabase Studio → `daily_reports` table → confirm new row exists with correct outlet_id.
8. Open `ai_analyses` table → confirm row linked to same report with `kpi_summary` not null, `outlet_score` between 0–100.
9. Open `/supervisor` → new report appears at top with outlet_score badge.
10. Click report → expand → type coaching note + action plan → click Save.
11. Verify badge updates to 'reviewed' without page reload.
12. Open Supabase Studio → `coaching_notes` → confirm row exists.
13. Return to `/` → transaction count and revenue KPI cards reflect the new report.

## Empty / Error States
- Submit form with missing required fields → inline validation errors appear, no DB insert.
- Simulate OpenAI timeout (disconnect network after submit) → report saves, `/report/[id]` shows "AI analysis pending" fallback message — no crash.
- Navigate to `/report/[fake-uuid]` → 404 / "Report not found" message, not a blank screen.
- Open `/supervisor` with no reports submitted today → "No reports submitted today" empty state shown.
- Open `/` with all reports from yesterday only → KPI cards show yesterday's totals with date label, not zeros with no label.

## Deployment Check
- Open live Vercel URL on a real Android phone → `/report/new` form is fully usable without horizontal scroll.
- Confirm `OPENAI_API_KEY` is NOT visible in browser network tab or page source.
- Confirm Supabase `service_role` key is NOT visible in browser network tab or page source.
