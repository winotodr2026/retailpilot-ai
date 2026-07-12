# Intelligence Layer

## Messy Input (what SPG submits)
Free-text competitor notes, customer feedback blobs, numeric counts, boolean compliance flags, and photos — mixed quality, Indonesian language, variable completeness.

## Auto-Structure Schema (what the Edge Function produces)
```json
{
  "kpi_summary": "Conversion rate 44% — above 35% target. Revenue Rp 3.15 juta.",
  "outlet_score": 82,
  "problem_flags": [
    { "flag": "Competitor threat", "detail": "Brand X free demo nearby", "severity": "high" }
  ],
  "recommended_actions": [
    { "priority": 1, "action": "Secure end-cap before Brand X expands", "owner": "Supervisor" }
  ]
}
```

## Scoring Rules (v1 — rule-based, no ML)
| Signal | Weight |
|---|---|
| Conversion rate ≥ 35% | +30 pts |
| Display compliant | +20 pts |
| Stock available | +20 pts |
| Revenue ≥ daily target | +20 pts |
| No competitor threat | +10 pts |
`outlet_score` = sum (0–100). Source = `rule-engine`, confidence = 1.0.

## Analysis Status Lifecycle
Each `ai_analyses` row moves through `pending` → `processing` → `completed` | `failed`. `retry_count`, `last_error`, and `last_attempted_at` track failures. A `failed` row can be requeued with the `retry_ai_analysis(daily_report_id)` database function, which resets it to `pending` and clears `last_error`.

## Events to Track
- Report submitted
- AI analysis started (status → processing)
- AI analysis returned (latency, confidence, status → completed)
- AI analysis failed (status → failed, error recorded)
- AI analysis retried (status → pending, retry_count incremented)
- Problem flag triggered
- Supervisor reviewed
- Coaching note added
- Recommended action marked done

## v1 vs Later
**v1:** Rule-based outlet score + GPT-4o KPI summary + flags + action recommendations (low risk, auto-run).
**Later:** Trend analysis across 7/30 days, photo shelf-compliance scoring, SPG performance ranking, weekly digest compilation.
