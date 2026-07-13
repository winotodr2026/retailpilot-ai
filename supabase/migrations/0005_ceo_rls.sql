-- 0005: Lock down v1 open-demo RLS — CEO read-only access, anonymous denied.
-- Never edit 0001–0004 — this migration builds on top of them.
--
-- ⚠️  DESTRUCTIVE RELATIVE TO v1: drops all permissive *_v1_* policies.
--     Apply only after 0004_profiles.sql and after creating a CEO profile row.
--     Anonymous users will lose ALL access to operational data.

-- ── Drop v1 open policies on all operational tables ──────────────────────────
drop policy if exists "companies_v1_read" on public.companies;
drop policy if exists "companies_v1_write" on public.companies;
drop policy if exists "outlets_v1_read" on public.outlets;
drop policy if exists "outlets_v1_write" on public.outlets;
drop policy if exists "supervisors_v1_read" on public.supervisors;
drop policy if exists "supervisors_v1_write" on public.supervisors;
drop policy if exists "spgs_v1_read" on public.spgs;
drop policy if exists "spgs_v1_write" on public.spgs;
drop policy if exists "daily_reports_v1_read" on public.daily_reports;
drop policy if exists "daily_reports_v1_write" on public.daily_reports;
drop policy if exists "ai_analyses_v1_read" on public.ai_analyses;
drop policy if exists "ai_analyses_v1_write" on public.ai_analyses;
drop policy if exists "coaching_notes_v1_read" on public.coaching_notes;
drop policy if exists "coaching_notes_v1_write" on public.coaching_notes;
drop policy if exists "competitor_activities_v1_read" on public.competitor_activities;
drop policy if exists "competitor_activities_v1_write" on public.competitor_activities;
drop policy if exists "audit_logs_v1_read" on public.audit_logs;
drop policy if exists "audit_logs_v1_write" on public.audit_logs;

-- ── CEO SELECT-only policies (no client write access in this phase) ───────────
drop policy if exists "companies_ceo_select" on public.companies;
create policy "companies_ceo_select" on public.companies
  for select using (public.is_ceo());

drop policy if exists "outlets_ceo_select" on public.outlets;
create policy "outlets_ceo_select" on public.outlets
  for select using (public.is_ceo());

drop policy if exists "supervisors_ceo_select" on public.supervisors;
create policy "supervisors_ceo_select" on public.supervisors
  for select using (public.is_ceo());

drop policy if exists "spgs_ceo_select" on public.spgs;
create policy "spgs_ceo_select" on public.spgs
  for select using (public.is_ceo());

drop policy if exists "daily_reports_ceo_select" on public.daily_reports;
create policy "daily_reports_ceo_select" on public.daily_reports
  for select using (public.is_ceo());

drop policy if exists "ai_analyses_ceo_select" on public.ai_analyses;
create policy "ai_analyses_ceo_select" on public.ai_analyses
  for select using (public.is_ceo());

drop policy if exists "coaching_notes_ceo_select" on public.coaching_notes;
create policy "coaching_notes_ceo_select" on public.coaching_notes
  for select using (public.is_ceo());

drop policy if exists "competitor_activities_ceo_select" on public.competitor_activities;
create policy "competitor_activities_ceo_select" on public.competitor_activities
  for select using (public.is_ceo());

drop policy if exists "audit_logs_ceo_select" on public.audit_logs;
create policy "audit_logs_ceo_select" on public.audit_logs
  for select using (public.is_ceo());

-- ── Storage: shelf_photos — CEO read-only, anonymous denied ───────────────────
drop policy if exists "shelf_photos_v1_read" on storage.objects;
drop policy if exists "shelf_photos_v1_insert" on storage.objects;
drop policy if exists "shelf_photos_v1_update" on storage.objects;
drop policy if exists "shelf_photos_v1_delete" on storage.objects;

drop policy if exists "shelf_photos_ceo_select" on storage.objects;
create policy "shelf_photos_ceo_select" on storage.objects
  for select using (bucket_id = 'shelf_photos' and public.is_ceo());
