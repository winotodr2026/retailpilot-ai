# Data Model

## outlets
`id` uuid PK · `user_id` uuid (nullable) · `name` text · `city` text · `store_chain` text · `region` text · `is_active` bool · `created_at` timestamptz

## supervisors
`id` uuid PK · `user_id` uuid (nullable) · `full_name` text · `email` text · `phone` text · `region` text · `created_at` timestamptz

## spgs
`id` uuid PK · `user_id` uuid (nullable) · `full_name` text · `email` text · `phone` text · `outlet_id` → outlets · `supervisor_id` → supervisors · `is_active` bool · `created_at` timestamptz

## daily_reports
`id` uuid PK · `user_id` uuid (nullable) · `report_date` date · `spg_id` → spgs · `outlet_id` → outlets · `supervisor_id` → supervisors · `daily_traffic` int · `greeting_count` int · `customer_stops` int · `testers_distributed` int · `transactions` int · `sku_sold` int · `sales_revenue` numeric · `basket_size` numeric · `display_compliant` bool · `stock_available` bool · `out_of_stock_skus` text · `competitor_notes` text · `customer_feedback` text · `customer_complaints` text · `shelf_photo_urls` text[] · `status` text · `created_at` timestamptz

## ai_analyses *(all fields are AI-generated — each carries source + confidence + review_status)*
`id` uuid PK · `daily_report_id` → daily_reports
- `kpi_summary` text + `kpi_summary_source` text + `kpi_summary_confidence` numeric + `kpi_summary_review_status` text
- `problem_flags` jsonb + `problem_flags_source` text + `problem_flags_confidence` numeric + `problem_flags_review_status` text
- `recommended_actions` jsonb + `recommended_actions_source` text + `recommended_actions_confidence` numeric + `recommended_actions_review_status` text
- `outlet_score` numeric + `outlet_score_source` text (rule-engine) + `outlet_score_confidence` numeric + `outlet_score_review_status` text
- `raw_prompt` text · `raw_response` text · `created_at` timestamptz

## coaching_notes
`id` uuid PK · `user_id` uuid (nullable) · `daily_report_id` → daily_reports · `supervisor_id` → supervisors · `spg_id` → spgs · `note` text · `action_plan` text · `follow_up_date` date · `status` text · `created_at` timestamptz

## competitor_activities
`id` uuid PK · `user_id` uuid (nullable) · `daily_report_id` → daily_reports · `outlet_id` → outlets · `report_date` date · `competitor_brand` text · `activity_type` text · `description` text · `severity` text · `photo_urls` text[] · `created_at` timestamptz

## audit_logs
`id` uuid PK · `user_id` uuid (nullable) · `actor` text · `action` text · `object_type` text · `object_id` uuid · `detail` jsonb · `risk_level` text · `created_at` timestamptz

## RLS
All tables: v1 permissive (select + all open). Lock-down sprint replaces with `auth.uid() = user_id` + role-based policies.
