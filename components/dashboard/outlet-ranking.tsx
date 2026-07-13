import type { OutletRankingRow } from "@/lib/dashboard/queries";
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

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--pm-gold)] text-xs font-bold text-[var(--pm-green-dark)]">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--pm-gold-muted)] text-xs font-bold text-[var(--pm-gold-dark)]">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--pm-green-muted)] text-xs font-bold text-[var(--pm-green)]">
        3
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--pm-border)] text-xs font-medium text-[var(--pm-muted)]">
      {rank}
    </span>
  );
}

export function OutletRanking({ rows }: { rows: OutletRankingRow[] }) {
  return (
    <section className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] shadow-sm">
      <div className="border-b border-[var(--pm-border)] px-5 py-4">
        <h2 className="text-base font-semibold text-[var(--pm-text)]">
          Outlet Ranking
        </h2>
        <p className="text-xs text-[var(--pm-muted)]">
          Sorted by revenue · AI outlet score
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-[var(--pm-muted)]">
          No outlet data yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--pm-border)] text-xs uppercase tracking-wider text-[var(--pm-muted)]">
                <th className="px-5 py-3 font-semibold">#</th>
                <th className="px-3 py-3 font-semibold">Outlet</th>
                <th className="px-3 py-3 font-semibold text-right">Revenue</th>
                <th className="px-3 py-3 font-semibold text-right">Txns</th>
                <th className="px-3 py-3 font-semibold text-right">Conv.</th>
                <th className="px-5 py-3 font-semibold text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.outletId}
                  className="border-b border-[var(--pm-border)]/60 transition hover:bg-[var(--pm-green-muted)]/30"
                >
                  <td className="px-5 py-3.5">
                    <RankMedal rank={row.rank} />
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="font-medium text-[var(--pm-text)]">{row.outletName}</p>
                    <p className="text-xs text-[var(--pm-muted)]">
                      {row.storeChain} · {row.city}
                    </p>
                  </td>
                  <td className="px-3 py-3.5 text-right font-medium text-[var(--pm-gold-dark)]">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="px-3 py-3.5 text-right text-[var(--pm-text)]">
                    {formatNumber(row.transactions)}
                  </td>
                  <td className="px-3 py-3.5 text-right text-[var(--pm-text)]">
                    {formatPercent(row.conversionRate)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <ScoreBadge score={row.outletScore} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
