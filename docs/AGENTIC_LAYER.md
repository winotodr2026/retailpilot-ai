# Agentic Layer

## Risk Levels & Actions

### Low — Auto-execute (no approval needed)
- `generate_kpi_summary` — summarise daily report fields into plain text
- `score_outlet` — compute outlet_score from rule-engine
- `flag_problems` — parse competitor notes + compliance booleans into structured flags
- `draft_recommended_actions` — rank and draft action items from flags
- `tag_competitor_activity` — extract brand + activity_type from free text
- `retry_ai_analysis` — requeue a `failed` ai_analyses row back to `pending` (calls the `retry_ai_analysis` DB function; safe to auto-run since it only re-runs the same low-risk analysis job)

### Medium — Draft shown, 1-click approve
- `draft_coaching_note` — pre-fill coaching_notes form from AI analysis (supervisor approves before save)
- `flag_urgent_restock` — create restock reminder task visible to supervisor

### High — Explicit approval required
- `send_supervisor_report_email` — email report digest to supervisor (requires supervisor confirmation)
- `escalate_to_nsm` — flag issue to National Sales Manager

### Critical — Human-only, no agent execution
- Delete any daily report or audit log
- Modify historical sales figures
- Any bulk data export

## Named Tools (v1)
`analyze-report` (Supabase Edge Function) · `score-outlet` (server-side function) · `upload-photo` (Supabase Storage SDK) · `retry_ai_analysis` (Postgres function — resets a failed `ai_analyses` row to `pending`)

## Audit Log Fields
`actor` · `action` · `object_type` · `object_id` · `detail` (jsonb) · `risk_level` · `created_at`
Every agent action writes one audit_log row before and after execution.

## v1 vs Later
**v1:** Low-risk auto actions only (analyze, score, flag, draft). All others — Later.
