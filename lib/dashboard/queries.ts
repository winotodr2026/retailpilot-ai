import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AiAnalysis,
  CompetitorActivity,
  Outlet,
  ProblemFlag,
  Spg,
} from "@/lib/supabase/types";
import { conversionRate } from "@/lib/dashboard/format";

type OutletJoin = Pick<Outlet, "id" | "name" | "city" | "store_chain" | "is_active">;
type SpgJoin = Pick<Spg, "id" | "full_name">;

type ReportRow = {
  id: string;
  report_date: string;
  outlet_id: string | null;
  spg_id: string | null;
  transactions: number;
  sales_revenue: number;
  customer_stops: number;
  outlets: OutletJoin | OutletJoin[] | null;
  spgs: SpgJoin | SpgJoin[] | null;
  ai_analyses: AiAnalysis | AiAnalysis[] | null;
};

type CompetitorRow = {
  id: string;
  daily_report_id: string | null;
  outlet_id: string;
  report_date: string;
  competitor_brand: string;
  activity_type: string;
  description: string | null;
  severity: string;
  photo_urls: string[] | null;
  created_at: string;
  outlets: Pick<Outlet, "name"> | Pick<Outlet, "name">[] | null;
};

export type DashboardNationalKpis = {
  activeOutlets: number;
  totalTransactions: number;
  totalRevenue: number;
  avgConversionRate: number;
  aiAlertCount: number;
  reportCount: number;
  latestReportDate: string | null;
};

export type OutletRankingRow = {
  rank: number;
  outletId: string;
  outletName: string;
  city: string;
  storeChain: string;
  revenue: number;
  transactions: number;
  conversionRate: number;
  outletScore: number | null;
  reportCount: number;
};

export type SpgRankingRow = {
  rank: number;
  spgId: string;
  spgName: string;
  outletName: string;
  revenue: number;
  transactions: number;
  conversionRate: number;
  outletScore: number | null;
  reportCount: number;
};

export type AiAlert = {
  id: string;
  flag: string;
  detail: string;
  severity: string;
  confidence: number;
  outletName: string;
  reportDate: string;
};

export type DashboardData = {
  companyName: string;
  kpis: DashboardNationalKpis;
  outletRanking: OutletRankingRow[];
  spgRanking: SpgRankingRow[];
  aiAlerts: AiAlert[];
  competitorActivities: Array<
    CompetitorActivity & { outletName: string }
  >;
};

function pickOne<T>(raw: T | T[] | null): T | null {
  if (!raw) return null;
  return Array.isArray(raw) ? (raw[0] ?? null) : raw;
}

function pickAnalysis(
  raw: AiAnalysis | AiAnalysis[] | null,
): AiAnalysis | null {
  return pickOne(raw);
}

function severityRank(severity: string): number {
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

export async function getDashboardData(
  supabase: SupabaseClient,
): Promise<DashboardData> {
  const [
    { data: company, error: companyErr },
    { count: activeOutlets, error: outletsErr },
    { data: reports, error: reportsErr },
    { data: competitors, error: competitorsErr },
  ] = await Promise.all([
    supabase.from("companies").select("name").eq("is_active", true).limit(1).maybeSingle(),
    supabase
      .from("outlets")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("daily_reports")
      .select(
        `
        id,
        report_date,
        outlet_id,
        spg_id,
        transactions,
        sales_revenue,
        customer_stops,
        outlets ( id, name, city, store_chain, is_active ),
        spgs ( id, full_name ),
        ai_analyses ( id, daily_report_id, outlet_score, problem_flags, problem_flags_confidence, status )
      `,
      )
      .order("report_date", { ascending: false }),
    supabase
      .from("competitor_activities")
      .select(
        `
        id,
        daily_report_id,
        outlet_id,
        report_date,
        competitor_brand,
        activity_type,
        description,
        severity,
        photo_urls,
        created_at,
        outlets ( name )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  if (companyErr) throw companyErr;
  if (outletsErr) throw outletsErr;
  if (reportsErr) throw reportsErr;
  if (competitorsErr) throw competitorsErr;

  const rows = (reports ?? []) as unknown as ReportRow[];

  let totalTransactions = 0;
  let totalRevenue = 0;
  let conversionSum = 0;
  let conversionCount = 0;
  let aiAlertCount = 0;
  let latestReportDate: string | null = null;

  const outletMap = new Map<
    string,
    {
      outletName: string;
      city: string;
      storeChain: string;
      revenue: number;
      transactions: number;
      customerStops: number;
      outletScore: number | null;
      reportCount: number;
    }
  >();

  const spgMap = new Map<
    string,
    {
      spgName: string;
      outletName: string;
      revenue: number;
      transactions: number;
      customerStops: number;
      outletScore: number | null;
      reportCount: number;
    }
  >();

  const aiAlerts: AiAlert[] = [];

  for (const row of rows) {
    totalTransactions += row.transactions;
    totalRevenue += Number(row.sales_revenue);

    if (row.customer_stops > 0) {
      conversionSum += conversionRate(row.transactions, row.customer_stops);
      conversionCount += 1;
    }

    if (!latestReportDate || row.report_date > latestReportDate) {
      latestReportDate = row.report_date;
    }

    const analysis = pickAnalysis(row.ai_analyses);
    const outletScore = analysis?.outlet_score ?? null;
    const outlet = pickOne(row.outlets);
    const spg = pickOne(row.spgs);
    const outletName = outlet?.name ?? "Unknown outlet";
    const spgName = spg?.full_name ?? "Unknown SPG";

    if (row.outlet_id && outlet) {
      const existing = outletMap.get(row.outlet_id) ?? {
        outletName,
        city: outlet.city,
        storeChain: outlet.store_chain,
        revenue: 0,
        transactions: 0,
        customerStops: 0,
        outletScore: null,
        reportCount: 0,
      };
      existing.revenue += Number(row.sales_revenue);
      existing.transactions += row.transactions;
      existing.customerStops += row.customer_stops;
      existing.reportCount += 1;
      if (outletScore !== null) existing.outletScore = outletScore;
      outletMap.set(row.outlet_id, existing);
    }

    if (row.spg_id && spg) {
      const existing = spgMap.get(row.spg_id) ?? {
        spgName,
        outletName,
        revenue: 0,
        transactions: 0,
        customerStops: 0,
        outletScore: null,
        reportCount: 0,
      };
      existing.revenue += Number(row.sales_revenue);
      existing.transactions += row.transactions;
      existing.customerStops += row.customer_stops;
      existing.reportCount += 1;
      if (outletScore !== null) existing.outletScore = outletScore;
      spgMap.set(row.spg_id, existing);
    }

    const flags = (analysis?.problem_flags ?? []) as ProblemFlag[];
    const confidence = analysis?.problem_flags_confidence ?? 0.5;

    for (const [index, flag] of flags.entries()) {
      aiAlertCount += 1;
      aiAlerts.push({
        id: `${row.id}-${index}`,
        flag: flag.flag,
        detail: flag.detail,
        severity: flag.severity ?? "medium",
        confidence,
        outletName,
        reportDate: row.report_date,
      });
    }
  }

  aiAlerts.sort((a, b) => {
    const sev = severityRank(b.severity) - severityRank(a.severity);
    if (sev !== 0) return sev;
    return b.confidence - a.confidence;
  });

  const outletRanking: OutletRankingRow[] = [...outletMap.entries()]
    .map(([outletId, o]) => ({
      rank: 0,
      outletId,
      outletName: o.outletName,
      city: o.city,
      storeChain: o.storeChain,
      revenue: o.revenue,
      transactions: o.transactions,
      conversionRate: conversionRate(o.transactions, o.customerStops),
      outletScore: o.outletScore,
      reportCount: o.reportCount,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  const spgRanking: SpgRankingRow[] = [...spgMap.entries()]
    .map(([spgId, s]) => ({
      rank: 0,
      spgId,
      spgName: s.spgName,
      outletName: s.outletName,
      revenue: s.revenue,
      transactions: s.transactions,
      conversionRate: conversionRate(s.transactions, s.customerStops),
      outletScore: s.outletScore,
      reportCount: s.reportCount,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  const competitorActivities = ((competitors ?? []) as unknown as CompetitorRow[]).map(
    (c) => ({
      id: c.id,
      user_id: null,
      daily_report_id: c.daily_report_id,
      outlet_id: c.outlet_id,
      report_date: c.report_date,
      competitor_brand: c.competitor_brand,
      activity_type: c.activity_type,
      description: c.description,
      severity: c.severity,
      photo_urls: c.photo_urls,
      created_at: c.created_at,
      outletName: pickOne(c.outlets)?.name ?? "Unknown outlet",
    }),
  );

  return {
    companyName: company?.name ?? "Pring Mas",
    kpis: {
      activeOutlets: activeOutlets ?? 0,
      totalTransactions,
      totalRevenue,
      avgConversionRate: conversionCount > 0 ? conversionSum / conversionCount : 0,
      aiAlertCount,
      reportCount: rows.length,
      latestReportDate,
    },
    outletRanking,
    spgRanking,
    aiAlerts: aiAlerts.slice(0, 6),
    competitorActivities,
  };
}
