# Data Model

## companies
`id` uuid PK · `user_id` uuid (nullable) · `name` text · `is_active` bool · `created_at` timestamptz

Single tenant for now — seeded with one row, **Pring Mas**. `outlets`, `supervisors`, `spgs`, and `daily_reports` all reference this company via `company_id`, so the schema is ready for more companies later without another migration.

## outlets
`id` uuid PK · `user_id` uuid (nullable) · `company_id` → companies · `name` text · `city` text · `store_chain` text · `region` text · `is_active` bool · `created_at` timestamptz

## supervisors
`id` uuid PK · `user_id` uuid (nullable) · `company_id` → companies · `full_name` text · `email` text · `phone` text · `region` text · `created_at` timestamptz

## spgs
`id` uuid PK · `user_id` uuid (nullable) · `company_id` → companies · `full_name` text · `email` text · `phone` text · `outlet_id` → outlets · `supervisor_id` → supervisors · `is_active` bool · `created_at` timestamptz

## daily_reports
`id` uuid PK · `user_id` uuid (nullable) · `company_id` → companies · `report_date` date · `spg_id` → spgs · `outlet_id` → outlets · `supervisor_id` → supervisors · `daily_traffic` int · `greeting_count` int · `customer_stops` int · `testers_distributed` int · `transactions` int · `sku_sold` int · `sales_revenue` numeric · `basket_size` numeric · `display_compliant` bool · `stock_available` bool · `out_of_stock_skus` text · `competitor_notes` text · `customer_feedback` text · `customer_complaints` text · `shelf_photo_urls` text[] · `status` text · `created_at` timestamptz

**Uniqueness rule:** one report per SPG, per outlet, per day — enforced by a unique constraint on (`spg_id`, `outlet_id`, `report_date`). A second submission for the same SPG/outlet/date is rejected at the database level.

## ai_analyses *(all analysis fields are AI-generated — each carries source + confidence + review_status)*
`id` uuid PK · `daily_report_id` → daily_reports
- `status` text — lifecycle state: `pending` → `processing` → `completed` | `failed` (default `pending`)
- `retry_count` int (default 0) · `last_error` text · `last_attempted_at` timestamptz
- `kpi_summary` text + `kpi_summary_source` text + `kpi_summary_confidence` numeric + `kpi_summary_review_status` text
- `problem_flags` jsonb + `problem_flags_source` text + `problem_flags_confidence` numeric + `problem_flags_review_status` text
- `recommended_actions` jsonb + `recommended_actions_source` text + `recommended_actions_confidence` numeric + `recommended_actions_review_status` text
- `outlet_score` numeric + `outlet_score_source` text (rule-engine) + `outlet_score_confidence` numeric + `outlet_score_review_status` text
- `raw_prompt` text · `raw_response` text · `created_at` timestamptz

**Retry:** calling the `retry_ai_analysis(daily_report_id)` database function resets a `failed` row to `status = 'pending'`, increments `retry_count`, and clears `last_error`, so the analysis job can pick it up again. (The job that watches for `pending`/`failed` rows and actually calls OpenAI is built in Sprint 2 — not part of this change.)

## coaching_notes
`id` uuid PK · `user_id` uuid (nullable) · `daily_report_id` → daily_reports · `supervisor_id` → supervisors · `spg_id` → spgs · `note` text · `action_plan` text · `follow_up_date` date · `status` text · `created_at` timestamptz

## competitor_activities
`id` uuid PK · `user_id` uuid (nullable) · `daily_report_id` → daily_reports · `outlet_id` → outlets · `report_date` date · `competitor_brand` text · `activity_type` text · `description` text · `severity` text · `photo_urls` text[] · `created_at` timestamptz

## audit_logs
`id` uuid PK · `user_id` uuid (nullable) · `actor` text · `action` text · `object_type` text · `object_id` uuid · `detail` jsonb · `risk_level` text · `created_at` timestamptz

## RLS
All tables (including `companies`): v1 permissive (select + all open). Lock-down sprint replaces with `auth.uid() = user_id` + role-based policies, and can additionally scope by `company_id` once more than one company exists.

## Indexes
`report_date`, `outlet_id`, `spg_id`, `supervisor_id`, and `company_id` are indexed on `daily_reports`; `company_id` is indexed on `outlets`, `supervisors`, `spgs`; `status` and `daily_report_id` are indexed on `ai_analyses`; `daily_report_id`/`supervisor_id` on `coaching_notes`; `outlet_id`/`report_date` on `competitor_activities`; `(object_type, object_id)` on `audit_logs`. Added in `0002_company_dedup_indexes_ai_status.sql` to keep dashboard and report queries fast as data grows.
