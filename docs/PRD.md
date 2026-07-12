# RetailPilot AI — Product Requirements

## Problem
SPGs at Pring Mas modern trade outlets submit daily activity reports manually. There is no automated KPI analysis, no instant problem detection, and supervisors receive no structured recommended actions. The National Sales Manager and CEO have no real-time national view.

## Target Users
| Role | Primary need |
|---|---|
| SPG | Fast mobile report submission, instant AI feedback |
| Sales Supervisor | Outlet performance digest, coaching prompts |
| National Sales Manager / CEO | Single-screen national KPI view, top AI-flagged problems |

## Core Objects
`outlets` · `spgs` · `supervisors` · `daily_reports` · `ai_analyses` · `coaching_notes` · `competitor_activities` · `audit_logs`

## MVP Must-Haves (v1)
- [ ] SPG submits daily report (traffic, greetings, stops, testers, transactions, SKU, revenue, display compliance, stock, photos, competitor notes)
- [ ] AI instantly returns KPI summary, problem flags, and ranked recommended actions
- [ ] `/report/[id]` shows full report + AI analysis card
- [ ] Supervisor dashboard lists all outlet reports with AI recommendations and coaching note entry
- [ ] CEO homepage shows national KPI cards + outlet performance table — no login required
- [ ] App deployed and publicly accessible

## Non-Goals (v1)
Payroll · HR · ERP integration · WhatsApp automation · Forecasting / ML · Power BI · Distributor management · Loyalty program · Per-user auth (Sprint 6)

## Definition of Done
**Pass:** An anonymous visitor opens the live URL, sees real aggregate KPI cards from seeded data, navigates to `/report/new`, submits a complete daily report, is redirected to `/report/[id]` where AI-generated KPI summary, at least one problem flag, and at least one recommended action are visible — all persisted in the database and confirmed by a Supabase Studio row check.

**Fail:** Any step shows a blank screen, a dead button, a spinner that never resolves, or data visible only from seeds without the ability to create/edit/delete.
