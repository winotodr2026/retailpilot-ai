-- 0002: Company entity, outlet/SPG/supervisor/report linkage to Company,
-- duplicate-report prevention, performance indexes, and AI analysis status/retry.
-- Never edit 0001_init.sql — this migration builds on top of it.

-- 1. Company table
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  is_active boolean not null default true
);
alter table companies enable row level security;
drop policy if exists "companies_v1_read" on companies;
create policy "companies_v1_read" on companies for select using (true);
drop policy if exists "companies_v1_write" on companies;
create policy "companies_v1_write" on companies for all using (true) with check (true);

-- 2. Sample company
insert into companies (id, name, is_active)
values ('f1000000-0000-0000-0000-000000000001', 'Pring Mas', true)
on conflict (id) do nothing;

-- 3. Connect outlets, supervisors, spgs, daily_reports to Company
alter table outlets add column if not exists company_id uuid references companies(id);
update outlets set company_id = 'f1000000-0000-0000-0000-000000000001' where company_id is null;
alter table outlets alter column company_id set default 'f1000000-0000-0000-0000-000000000001';
alter table outlets alter column company_id set not null;

alter table supervisors add column if not exists company_id uuid references companies(id);
update supervisors set company_id = 'f1000000-0000-0000-0000-000000000001' where company_id is null;
alter table supervisors alter column company_id set default 'f1000000-0000-0000-0000-000000000001';
alter table supervisors alter column company_id set not null;

alter table spgs add column if not exists company_id uuid references companies(id);
update spgs set company_id = 'f1000000-0000-0000-0000-000000000001' where company_id is null;
alter table spgs alter column company_id set default 'f1000000-0000-0000-0000-000000000001';
alter table spgs alter column company_id set not null;

alter table daily_reports add column if not exists company_id uuid references companies(id);
update daily_reports set company_id = 'f1000000-0000-0000-0000-000000000001' where company_id is null;
alter table daily_reports alter column company_id set default 'f1000000-0000-0000-0000-000000000001';
alter table daily_reports alter column company_id set not null;

-- 4. Prevent duplicate daily reports: same SPG + same outlet + same date
alter table daily_reports drop constraint if exists daily_reports_unique_spg_outlet_date;
alter table daily_reports add constraint daily_reports_unique_spg_outlet_date
  unique (spg_id, outlet_id, report_date);

-- 5. Indexes for faster report queries
create index if not exists idx_outlets_company_id on outlets(company_id);
create index if not exists idx_supervisors_company_id on supervisors(company_id);
create index if not exists idx_spgs_company_id on spgs(company_id);
create index if not exists idx_spgs_outlet_id on spgs(outlet_id);
create index if not exists idx_spgs_supervisor_id on spgs(supervisor_id);

create index if not exists idx_daily_reports_company_id on daily_reports(company_id);
create index if not exists idx_daily_reports_report_date on daily_reports(report_date);
create index if not exists idx_daily_reports_outlet_id on daily_reports(outlet_id);
create index if not exists idx_daily_reports_spg_id on daily_reports(spg_id);
create index if not exists idx_daily_reports_supervisor_id on daily_reports(supervisor_id);

create index if not exists idx_ai_analyses_daily_report_id on ai_analyses(daily_report_id);
create index if not exists idx_coaching_notes_daily_report_id on coaching_notes(daily_report_id);
create index if not exists idx_coaching_notes_supervisor_id on coaching_notes(supervisor_id);
create index if not exists idx_competitor_activities_outlet_id on competitor_activities(outlet_id);
create index if not exists idx_competitor_activities_report_date on competitor_activities(report_date);
create index if not exists idx_audit_logs_object on audit_logs(object_type, object_id);

-- 6. AI analysis status lifecycle + retry support
alter table ai_analyses add column if not exists status text not null default 'pending';
alter table ai_analyses drop constraint if exists ai_analyses_status_check;
alter table ai_analyses add constraint ai_analyses_status_check
  check (status in ('pending', 'processing', 'completed', 'failed'));

alter table ai_analyses add column if not exists retry_count integer not null default 0;
alter table ai_analyses add column if not exists last_error text;
alter table ai_analyses add column if not exists last_attempted_at timestamptz;

create index if not exists idx_ai_analyses_status on ai_analyses(status);

-- Existing seeded analyses already completed successfully
update ai_analyses set status = 'completed', last_attempted_at = created_at
where status = 'pending';

-- 7. Retry mechanism: resets a failed analysis back to pending for reprocessing
create or replace function retry_ai_analysis(p_daily_report_id uuid)
returns void as $$
begin
  update ai_analyses
  set status = 'pending',
      retry_count = retry_count + 1,
      last_error = null,
      last_attempted_at = now()
  where daily_report_id = p_daily_report_id;
end;
$$ language plpgsql;
