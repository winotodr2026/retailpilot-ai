export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-[var(--pm-border)]"
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-2xl bg-[var(--pm-border)] lg:col-span-2" />
        <div className="h-80 rounded-2xl bg-[var(--pm-border)]" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-[var(--pm-border)]" />
        <div className="h-64 rounded-2xl bg-[var(--pm-border)]" />
      </div>
    </div>
  );
}
