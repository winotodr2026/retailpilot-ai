import type { DashboardNationalKpis } from "@/lib/dashboard/queries";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
} from "@/lib/dashboard/format";

function KpiCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: "green" | "gold" | "alert";
  icon: React.ReactNode;
}) {
  const accentStyles = {
    green: "from-[var(--pm-green)]/10 to-transparent border-[var(--pm-green)]/20",
    gold: "from-[var(--pm-gold)]/15 to-transparent border-[var(--pm-gold)]/30",
    alert: "from-red-500/10 to-transparent border-red-400/25",
  };

  const iconStyles = {
    green: "bg-[var(--pm-green)] text-white",
    gold: "bg-[var(--pm-gold)] text-[var(--pm-green-dark)]",
    alert: "bg-red-500 text-white",
  };

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${accentStyles[accent]} bg-[var(--pm-card)] p-5 shadow-sm transition hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--pm-muted)]">
            {label}
          </p>
          <p className="text-2xl font-bold tracking-tight text-[var(--pm-text)] sm:text-3xl">
            {value}
          </p>
          {sub && (
            <p className="text-xs text-[var(--pm-muted)]">{sub}</p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${iconStyles[accent]}`}
        >
          {icon}
        </div>
      </div>
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
    </article>
  );
}

function IconRevenue() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconTransactions() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function IconConversion() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function IconAlerts() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function IconOutlets() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

export function KpiCards({ kpis }: { kpis: DashboardNationalKpis }) {
  const dateLabel = kpis.latestReportDate
    ? `Latest report: ${formatDate(kpis.latestReportDate)}`
    : "No reports yet";

  return (
    <section aria-label="National KPIs">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--pm-text)]">
            National Performance
          </h2>
          <p className="text-sm text-[var(--pm-muted)]">
            {kpis.reportCount} daily report{kpis.reportCount !== 1 ? "s" : ""} aggregated · {dateLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Total Revenue"
          value={formatCurrency(kpis.totalRevenue)}
          sub="Across all outlets"
          accent="gold"
          icon={<IconRevenue />}
        />
        <KpiCard
          label="Transactions"
          value={formatNumber(kpis.totalTransactions)}
          sub="Units sold today (seed)"
          accent="green"
          icon={<IconTransactions />}
        />
        <KpiCard
          label="Avg Conversion"
          value={formatPercent(kpis.avgConversionRate)}
          sub="Transactions ÷ customer stops"
          accent="green"
          icon={<IconConversion />}
        />
        <KpiCard
          label="AI Alerts"
          value={formatNumber(kpis.aiAlertCount)}
          sub="Open problem flags"
          accent="alert"
          icon={<IconAlerts />}
        />
        <KpiCard
          label="Active Outlets"
          value={formatNumber(kpis.activeOutlets)}
          sub="Modern trade locations"
          accent="gold"
          icon={<IconOutlets />}
        />
      </div>
    </section>
  );
}
