import type { CompetitorActivity } from "@/lib/supabase/types";
import { formatDate } from "@/lib/dashboard/format";

function SeverityDot({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-emerald-500",
  };

  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colors[severity] ?? colors.medium}`}
      title={severity}
    />
  );
}

export function CompetitorFeed({
  activities,
}: {
  activities: Array<CompetitorActivity & { outletName: string }>;
}) {
  return (
    <section className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] shadow-sm">
      <div className="border-b border-[var(--pm-border)] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pm-gold-muted)]">
            <svg className="h-4 w-4 text-[var(--pm-gold-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--pm-text)]">
              Competitor Activities
            </h2>
            <p className="text-xs text-[var(--pm-muted)]">
              Latest field intelligence from SPG reports
            </p>
          </div>
        </div>
      </div>

      {activities.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-[var(--pm-muted)]">
          No competitor activity reported.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--pm-border)]/60">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="px-5 py-4 transition hover:bg-[var(--pm-gold-muted)]/20"
            >
              <div className="flex items-start gap-3">
                <SeverityDot severity={activity.severity} />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[var(--pm-text)]">
                      {activity.competitor_brand}
                    </span>
                    <span className="rounded-md bg-[var(--pm-green-muted)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--pm-green)]">
                      {activity.activity_type}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-[var(--pm-muted)]">
                      {activity.description}
                    </p>
                  )}
                  <p className="text-xs text-[var(--pm-muted)]">
                    {activity.outletName} · {formatDate(activity.report_date)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
