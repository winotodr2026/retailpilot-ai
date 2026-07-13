import type { SpgRankingRow } from "@/lib/dashboard/queries";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/lib/dashboard/format";

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span className="rounded-full bg-[var(--pm-border)] px-2 py-0.5 text-xs text-[var(--pm-muted)]">
        —
      </span>
    );
  }

  let color = "bg-emerald-500/15 text-emerald-700";
  if (score < 50) color = "bg-red-500/15 text-red-700";
  else if (score < 75) color = "bg-amber-500/15 text-amber-700";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {score}
    </span>
  );
}

export function SpgRanking({ rows }: { rows: SpgRankingRow[] }) {
  return (
    <section className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] shadow-sm">
      <div className="border-b border-[var(--pm-border)] px-5 py-4">
        <h2 className="text-base font-semibold text-[var(--pm-text)]">
          SPG Ranking
        </h2>
        <p className="text-xs text-[var(--pm-muted)]">
          Top sales promoters by revenue
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-[var(--pm-muted)]">
          No SPG data yet.
        </p>
      ) : (
        <ul className="divide-y divide-[var(--pm-border)]/60">
          {rows.map((row) => (
            <li
              key={row.spgId}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-[var(--pm-green-muted)]/30"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  row.rank === 1
                    ? "bg-[var(--pm-gold)] text-[var(--pm-green-dark)]"
                    : row.rank <= 3
                      ? "bg-[var(--pm-green-muted)] text-[var(--pm-green)]"
                      : "bg-[var(--pm-border)] text-[var(--pm-muted)]"
                }`}
              >
                {row.rank}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[var(--pm-text)]">
                  {row.spgName}
                </p>
                <p className="truncate text-xs text-[var(--pm-muted)]">
                  {row.outletName}
                </p>
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-[var(--pm-gold-dark)]">
                  {formatCurrency(row.revenue)}
                </p>
                <p className="text-xs text-[var(--pm-muted)]">
                  {formatNumber(row.transactions)} txns · {formatPercent(row.conversionRate)}
                </p>
              </div>

              <ScoreBadge score={row.outletScore} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
