import type { AiAlert } from "@/lib/dashboard/queries";
import { formatDate } from "@/lib/dashboard/format";

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    high: "bg-red-500/15 text-red-700 border-red-400/30",
    medium: "bg-amber-500/15 text-amber-800 border-amber-400/30",
    low: "bg-[var(--pm-green-muted)] text-[var(--pm-green)] border-[var(--pm-green)]/20",
  };

  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[severity] ?? styles.medium}`}
    >
      {severity}
    </span>
  );
}

export function AiAlertsPanel({ alerts }: { alerts: AiAlert[] }) {
  return (
    <section className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] shadow-sm">
      <div className="border-b border-[var(--pm-border)] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--pm-text)]">
              AI Alerts
            </h2>
            <p className="text-xs text-[var(--pm-muted)]">
              Problem flags ranked by severity
            </p>
          </div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-[var(--pm-muted)]">
          No AI alerts — all outlets performing well.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--pm-border)]/60">
          {alerts.map((alert) => (
            <li key={alert.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="font-medium text-[var(--pm-text)]">{alert.flag}</p>
                  <p className="text-sm text-[var(--pm-muted)]">{alert.detail}</p>
                  <p className="text-xs text-[var(--pm-muted)]">
                    {alert.outletName} · {formatDate(alert.reportDate)}
                  </p>
                </div>
                <SeverityBadge severity={alert.severity} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--pm-border)]">
                  <div
                    className="h-full rounded-full bg-[var(--pm-gold)]"
                    style={{ width: `${Math.round(alert.confidence * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-[var(--pm-muted)]">
                  {Math.round(alert.confidence * 100)}% conf.
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
