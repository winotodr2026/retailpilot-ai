create table if not exists outlets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  city text not null,
  store_chain text not null,
  region text not null,
  is_active boolean not null default true
);
alter table outlets enable row level security;
drop policy if exists "outlets_v1_read" on outlets;
create policy "outlets_v1_read" on outlets for select using (true);
drop policy if exists "outlets_v1_write" on outlets;
create policy "outlets_v1_write" on outlets for all using (true) with check (true);

create table if not exists supervisors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  full_name text not null,
  email text,
  phone text,
  region text not null
);
alter table supervisors enable row level security;
drop policy if exists "supervisors_v1_read" on supervisors;
create policy "supervisors_v1_read" on supervisors for select using (true);
drop policy if exists "supervisors_v1_write" on supervisors;
create policy "supervisors_v1_write" on supervisors for all using (true) with check (true);

create table if not exists spgs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  full_name text not null,
  email text,
  phone text,
  outlet_id uuid references outlets(id),
  supervisor_id uuid references supervisors(id),
  is_active boolean not null default true
);
alter table spgs enable row level security;
drop policy if exists "spgs_v1_read" on spgs;
create policy "spgs_v1_read" on spgs for select using (true);
drop policy if exists "spgs_v1_write" on spgs;
create policy "spgs_v1_write" on spgs for all using (true) with check (true);

create table if not exists daily_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  report_date date not null,
  spg_id uuid references spgs(id),
  outlet_id uuid references outlets(id),
  supervisor_id uuid references supervisors(id),
  daily_traffic integer not null default 0,
  greeting_count integer not null default 0,
  customer_stops integer not null default 0,
  testers_distributed integer not null default 0,
  transactions integer not null default 0,
  sku_sold integer not null default 0,
  sales_revenue numeric(12,2) not null default 0,
  basket_size numeric(8,2) not null default 0,
  display_compliant boolean not null default true,
  stock_available boolean not null default true,
  out_of_stock_skus text,
  competitor_notes text,
  customer_feedback text,
  customer_complaints text,
  shelf_photo_urls text[],
  status text not null default 'submitted'
);
alter table daily_reports enable row level security;
drop policy if exists "daily_reports_v1_read" on daily_reports;
create policy "daily_reports_v1_read" on daily_reports for select using (true);
drop policy if exists "daily_reports_v1_write" on daily_reports;
create policy "daily_reports_v1_write" on daily_reports for all using (true) with check (true);

create table if not exists ai_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  daily_report_id uuid references daily_reports(id),
  kpi_summary text,
  kpi_summary_source text default 'openai-gpt4o',
  kpi_summary_confidence numeric,
  kpi_summary_review_status text default 'unreviewed',
  problem_flags jsonb,
  problem_flags_source text default 'openai-gpt4o',
  problem_flags_confidence numeric,
  problem_flags_review_status text default 'unreviewed',
  recommended_actions jsonb,
  recommended_actions_source text default 'openai-gpt4o',
  recommended_actions_confidence numeric,
  recommended_actions_review_status text default 'unreviewed',
  outlet_score numeric,
  outlet_score_source text default 'rule-engine',
  outlet_score_confidence numeric,
  outlet_score_review_status text default 'unreviewed',
  raw_prompt text,
  raw_response text
);
alter table ai_analyses enable row level security;
drop policy if exists "ai_analyses_v1_read" on ai_analyses;
create policy "ai_analyses_v1_read" on ai_analyses for select using (true);
drop policy if exists "ai_analyses_v1_write" on ai_analyses;
create policy "ai_analyses_v1_write" on ai_analyses for all using (true) with check (true);

create table if not exists coaching_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  daily_report_id uuid references daily_reports(id),
  supervisor_id uuid references supervisors(id),
  spg_id uuid references spgs(id),
  note text not null,
  action_plan text,
  follow_up_date date,
  status text not null default 'open'
);
alter table coaching_notes enable row level security;
drop policy if exists "coaching_notes_v1_read" on coaching_notes;
create policy "coaching_notes_v1_read" on coaching_notes for select using (true);
drop policy if exists "coaching_notes_v1_write" on coaching_notes;
create policy "coaching_notes_v1_write" on coaching_notes for all using (true) with check (true);

create table if not exists competitor_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  daily_report_id uuid references daily_reports(id),
  outlet_id uuid references outlets(id),
  report_date date not null,
  competitor_brand text not null,
  activity_type text not null,
  description text,
  severity text not null default 'low',
  photo_urls text[]
);
alter table competitor_activities enable row level security;
drop policy if exists "competitor_activities_v1_read" on competitor_activities;
create policy "competitor_activities_v1_read" on competitor_activities for select using (true);
drop policy if exists "competitor_activities_v1_write" on competitor_activities;
create policy "competitor_activities_v1_write" on competitor_activities for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  actor text,
  action text not null,
  object_type text not null,
  object_id uuid,
  detail jsonb,
  risk_level text not null default 'low'
);
alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into outlets (id, name, city, store_chain, region, is_active) values
  ('a1000000-0000-0000-0000-000000000001', 'Transmart Cempaka Mas', 'Jakarta Pusat', 'Transmart', 'DKI Jakarta', true),
  ('a1000000-0000-0000-0000-000000000002', 'Hypermart Kelapa Gading', 'Jakarta Utara', 'Hypermart', 'DKI Jakarta', true),
  ('a1000000-0000-0000-0000-000000000003', 'Carrefour Kopo', 'Bandung', 'Carrefour', 'Jawa Barat', true),
  ('a1000000-0000-0000-0000-000000000004', 'Giant Bekasi Timur', 'Bekasi', 'Giant', 'Jawa Barat', true);

insert into supervisors (id, full_name, email, phone, region) values
  ('b1000000-0000-0000-0000-000000000001', 'Rina Kusuma', 'rina@pringmas.id', '081211110001', 'DKI Jakarta'),
  ('b1000000-0000-0000-0000-000000000002', 'Dedi Santoso', 'dedi@pringmas.id', '081211110002', 'Jawa Barat');

insert into spgs (id, full_name, email, phone, outlet_id, supervisor_id, is_active) values
  ('c1000000-0000-0000-0000-000000000001', 'Sari Dewi', 'sari@pringmas.id', '081311110001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', true),
  ('c1000000-0000-0000-0000-000000000002', 'Maya Putri', 'maya@pringmas.id', '081311110002', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', true),
  ('c1000000-0000-0000-0000-000000000003', 'Fitri Rahayu', 'fitri@pringmas.id', '081311110003', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', true),
  ('c1000000-0000-0000-0000-000000000004', 'Lestari Wulan', 'lestari@pringmas.id', '081311110004', 'a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', true);

insert into daily_reports (id, report_date, spg_id, outlet_id, supervisor_id, daily_traffic, greeting_count, customer_stops, testers_distributed, transactions, sku_sold, sales_revenue, basket_size, display_compliant, stock_available, out_of_stock_skus, competitor_notes, customer_feedback, status) values
  ('d1000000-0000-0000-0000-000000000001', current_date - 1, 'c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 420, 380, 95, 80, 42, 58, 3150000, 75000, true, true, null, 'Kompetitor Brand X melakukan demo gratis di lorong sebelah', 'Pelanggan suka aroma varian baru', 'submitted'),
  ('d1000000-0000-0000-0000-000000000002', current_date - 1, 'c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 310, 250, 60, 55, 18, 22, 1350000, 61364, false, false, 'Pring Mas 200ml Jasmine', 'Tidak ada aktivitas kompetitor', 'Stok mau habis, display berantakan', 'submitted'),
  ('d1000000-0000-0000-0000-000000000003', current_date - 1, 'c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 520, 490, 130, 115, 67, 89, 5025000, 75000, true, true, null, 'Brand Y promo bundling menarik', 'Respons sangat positif, minta varian baru', 'submitted');

insert into ai_analyses (daily_report_id, kpi_summary, kpi_summary_source, kpi_summary_confidence, kpi_summary_review_status, problem_flags, problem_flags_source, problem_flags_confidence, problem_flags_review_status, recommended_actions, recommended_actions_source, recommended_actions_confidence, recommended_actions_review_status, outlet_score, outlet_score_source, outlet_score_confidence, outlet_score_review_status) values
  ('d1000000-0000-0000-0000-000000000001', 'Performa outlet Transmart Cempaka Mas baik. Conversion rate 44% di atas target 35%. Revenue Rp 3,15 juta. Greeting rate 90% sempurna.', 'openai-gpt4o', 0.92, 'unreviewed', '[{"flag":"Competitor threat detected","detail":"Brand X running free demo nearby — monitor share-of-shelf"}]', 'openai-gpt4o', 0.88, 'unreviewed', '[{"priority":1,"action":"Coordinate with store manager to secure premium end-cap position before Brand X expands","owner":"Supervisor"},{"priority":2,"action":"Increase tester offer rate during peak hours 14:00-17:00","owner":"SPG Sari"}]', 'openai-gpt4o', 0.90, 'unreviewed', 82, 'rule-engine', 1.0, 'unreviewed'),
  ('d1000000-0000-0000-0000-000000000002', 'Performa outlet Hypermart Kelapa Gading di bawah target. Conversion rate hanya 29%. Display tidak compliance dan stok kosong terdeteksi.', 'openai-gpt4o', 0.94, 'unreviewed', '[{"flag":"Display non-compliant","detail":"Shelf display not meeting planogram standard"},{"flag":"Out of stock","detail":"Pring Mas 200ml Jasmine out of stock — lost sales risk"}]', 'openai-gpt4o', 0.95, 'unreviewed', '[{"priority":1,"action":"Urgent: request stock replenishment for 200ml Jasmine from distributor today","owner":"Supervisor Rina"},{"priority":2,"action":"Reset display to planogram standard before store opens tomorrow","owner":"SPG Maya"},{"priority":3,"action":"Schedule supervisor store visit within 48 hours","owner":"Supervisor Rina"}]', 'openai-gpt4o', 0.93, 'unreviewed', 41, 'rule-engine', 1.0, 'unreviewed'),
  ('d1000000-0000-0000-0000-000000000003', 'Performa outlet Carrefour Kopo excellent. Conversion rate 51% — tertinggi hari ini. Revenue Rp 5,025 juta. SPG Fitri layak menjadi role model tim.', 'openai-gpt4o', 0.96, 'unreviewed', '[{"flag":"Competitor bundling promo","detail":"Brand Y running bundling promotion — track impact on next 3 days sales"}]', 'openai-gpt4o', 0.87, 'unreviewed', '[{"priority":1,"action":"Document SPG Fitri best-practice selling script and share with full team","owner":"Supervisor Dedi"},{"priority":2,"action":"Monitor Brand Y bundling impact on daily transactions over next 3 days","owner":"SPG Fitri"}]', 'openai-gpt4o', 0.91, 'unreviewed', 94, 'rule-engine', 1.0, 'unreviewed');

insert into competitor_activities (daily_report_id, outlet_id, report_date, competitor_brand, activity_type, description, severity) values
  ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', current_date - 1, 'Brand X', 'Free Demo', 'SPG Brand X melakukan demo gratis di lorong 5 dekat gondola Pring Mas', 'high'),
  ('d1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', current_date - 1, 'Brand Y', 'Bundle Promo', 'Brand Y menawarkan bundling 3 produk dengan harga spesial', 'medium');

insert into coaching_notes (daily_report_id, supervisor_id, spg_id, note, action_plan, follow_up_date, status) values
  ('d1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'Maya perlu fokus pada perbaikan display dan follow-up stok. Conversion rate harus mencapai minimal 35% minggu depan.', 'Perbaiki display hari ini. Request stok hari ini. Laporkan update besok pagi.', current_date, 'open');