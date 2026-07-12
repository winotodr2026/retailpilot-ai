// Hand-written types mirroring supabase/migrations/0001_init.sql, 0002_*, 0003_*.
// Keep in sync with the SQL migrations — this is not generated.

export type Company = {
  id: string;
  user_id: string | null;
  name: string;
  is_active: boolean;
  created_at: string;
};

export type Outlet = {
  id: string;
  user_id: string | null;
  company_id: string;
  name: string;
  city: string;
  store_chain: string;
  region: string;
  is_active: boolean;
  created_at: string;
};

export type Supervisor = {
  id: string;
  user_id: string | null;
  company_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  region: string;
  created_at: string;
};

export type Spg = {
  id: string;
  user_id: string | null;
  company_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  outlet_id: string | null;
  supervisor_id: string | null;
  is_active: boolean;
  created_at: string;
};

export type DailyReportStatus = "submitted";

export type DailyReport = {
  id: string;
  user_id: string | null;
  company_id: string;
  report_date: string;
  spg_id: string | null;
  outlet_id: string | null;
  supervisor_id: string | null;
  daily_traffic: number;
  greeting_count: number;
  customer_stops: number;
  testers_distributed: number;
  transactions: number;
  sku_sold: number;
  sales_revenue: number;
  basket_size: number;
  display_compliant: boolean;
  stock_available: boolean;
  out_of_stock_skus: string | null;
  competitor_notes: string | null;
  customer_feedback: string | null;
  customer_complaints: string | null;
  shelf_photo_urls: string[] | null;
  status: string;
  created_at: string;
};

export type AiAnalysisStatus = "pending" | "processing" | "completed" | "failed";

export type ProblemFlag = {
  flag: string;
  detail: string;
  severity?: "low" | "medium" | "high";
};

export type RecommendedAction = {
  priority: number;
  action: string;
  owner: string;
};

export type AiAnalysis = {
  id: string;
  daily_report_id: string;
  status: AiAnalysisStatus;
  retry_count: number;
  last_error: string | null;
  last_attempted_at: string | null;
  kpi_summary: string | null;
  kpi_summary_source: string | null;
  kpi_summary_confidence: number | null;
  kpi_summary_review_status: string | null;
  problem_flags: ProblemFlag[] | null;
  problem_flags_source: string | null;
  problem_flags_confidence: number | null;
  problem_flags_review_status: string | null;
  recommended_actions: RecommendedAction[] | null;
  recommended_actions_source: string | null;
  recommended_actions_confidence: number | null;
  recommended_actions_review_status: string | null;
  outlet_score: number | null;
  outlet_score_source: string | null;
  outlet_score_confidence: number | null;
  outlet_score_review_status: string | null;
  raw_prompt: string | null;
  raw_response: string | null;
  created_at: string;
};

export type CoachingNote = {
  id: string;
  user_id: string | null;
  daily_report_id: string;
  supervisor_id: string;
  spg_id: string;
  note: string;
  action_plan: string | null;
  follow_up_date: string | null;
  status: string;
  created_at: string;
};

export type CompetitorActivity = {
  id: string;
  user_id: string | null;
  daily_report_id: string | null;
  outlet_id: string;
  report_date: string;
  competitor_brand: string;
  activity_type: string;
  description: string | null;
  severity: string;
  photo_urls: string[] | null;
  created_at: string;
};

export type AuditLog = {
  id: string;
  user_id: string | null;
  actor: string | null;
  action: string;
  object_type: string;
  object_id: string | null;
  detail: unknown | null;
  risk_level: string;
  created_at: string;
};
