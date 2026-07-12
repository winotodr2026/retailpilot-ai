# Tasks & Sprints

```
Gantt
Sprint 1 — Database       [Day 1]
Sprint 2 — Report Engine  [Day 2–3]  ← v1 functional milestone
Sprint 3 — Supervisor     [Day 3–4]
Sprint 4 — CEO Dashboard  [Day 4–5]
Sprint 5 — Polish+Deploy  [Day 5–6]
Sprint 6 — Lock It Down   [Day 7+, before real users]
```

---

## Sprint 1 — Database & Master Data
**Goal:** Schema live in Supabase, seed data queryable.
- [ ] Run migration SQL (all tables + RLS v1 policies + seed rows)
- [ ] Confirm 4 outlets, 4 SPGs, 2 supervisors, 3 daily_reports, 3 ai_analyses visible in Supabase Studio
- [ ] Verify select queries return rows via Supabase JS client
- [ ] `shelf_photos` Storage bucket created

**Done when:** `select * from daily_reports` returns 3 seeded rows with joined ai_analyses data.

---

## Sprint 2 — SPG Daily Report Engine ★ v1 functional
**Goal:** Core engine works end-to-end.
- [ ] `/report/new` form: all daily_report fields, photo upload input
- [ ] Form validation: required fields block submit, shows inline error
- [ ] Submit handler: insert `daily_reports` row, upload photo to Storage
- [ ] Supabase Edge Function `analyze-report`: structured prompt → OpenAI → parse JSON → insert `ai_analyses` row
- [ ] Fallback: if OpenAI fails, report still saves; `/report/[id]` shows "AI analysis pending"
- [ ] `/report/[id]` page: report summary + AI KPI card + problem flags list + recommended actions list
- [ ] All five UI states: loading skeleton, empty/validation, partial (report saved, AI pending), error toast, success
- [ ] `audit_logs` row written on every report submit

**Done when:** Submit form with real data → row in `daily_reports` + row in `ai_analyses` → `/report/[id]` renders both → confirmed in Supabase Studio.

---

## Sprint 3 — Supervisor Dashboard
**Goal:** Supervisor can review reports and add coaching notes.
- [ ] `/supervisor` page: list all daily_reports newest-first, with outlet name, SPG name, outlet_score badge, review_status pill
- [ ] Click report → expanded view with AI analysis + coaching note form
- [ ] Coaching note form: note text, action_plan, follow_up_date → inserts `coaching_notes` row
- [ ] Mark review_status = 'reviewed' → badge updates without page reload
- [ ] Empty state: "No reports submitted today"
- [ ] `audit_logs` row on coaching note save

**Done when:** Supervisor adds coaching note → row in `coaching_notes` → badge on report card updates to 'reviewed'.

---

## Sprint 4 — CEO / National Dashboard
**Goal:** Homepage shows live national performance, demoable without login.
- [ ] `/` (homepage): national KPI cards — active outlets, total transactions, total revenue, avg conversion rate, open AI flags count
- [ ] Outlet performance table: each outlet sorted by revenue desc, conversion rate, outlet_score
- [ ] AI flags panel: top 5 problem flags ranked by confidence desc
- [ ] Competitor activity feed: latest 5 competitor_activities rows
- [ ] Loading skeleton, empty state ("No reports yet — showing demo data"), error banner
- [ ] Homepage is the first thing a visitor sees — no redirect to /login

**Done when:** Anonymous visitor on live URL sees populated dashboard with seeded + any submitted reports.

---

## Sprint 5 — Polish & Deploy
**Goal:** Production-ready, mobile-friendly, shareable portfolio URL.
- [ ] Mobile-responsive layout for `/report/new` (primary SPG device is phone)
- [ ] Persistent nav: Home | Submit Report | Supervisor | Reports
- [ ] `/reports` archive: filterable by outlet and date range
- [ ] Favicon, og:image, meta description set for portfolio sharing
- [ ] Vercel deployment with `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` env vars set
- [ ] End-to-end smoke test on real mobile device
- [ ] No console errors on any page

**Done when:** Live URL passes full manual test plan on mobile; recruiter can try it in 30 seconds.

---

## Sprint 6 — Lock It Down *(before real SPGs use it)*
**Goal:** Per-user data isolation, role-based access.
- [ ] Supabase Auth: email/password signup + login
- [ ] `role` field on user profiles: `spg | supervisor | manager | ceo`
- [ ] Replace all v1 permissive RLS policies with owner-scoped (`auth.uid() = user_id`) + role-scoped policies
- [ ] SPG: read/write own reports only
- [ ] Supervisor: read reports for assigned outlets; write coaching_notes
- [ ] CEO/Manager: read all
- [ ] `/report/new` and `/supervisor` require session; homepage remains public (aggregate only, no PII)
- [ ] Test: SPG A cannot fetch SPG B's report rows

**Done when:** SPG A session cannot retrieve SPG B's `daily_reports` rows — confirmed via Supabase Studio RLS simulator.
