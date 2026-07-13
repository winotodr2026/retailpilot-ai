export function DashboardError({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-300/40 bg-red-50 p-6 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-red-900">
        Unable to load dashboard
      </h2>
      <p className="mt-2 text-sm text-red-700">{message}</p>
      <p className="mt-4 text-xs text-red-600">
        Run{" "}
        <code className="rounded bg-red-100 px-1.5 py-0.5">
          vercel link &amp;&amp; vercel env pull .env.local
        </code>{" "}
        then restart the dev server.
      </p>
    </div>
  );
}

export function DashboardEmpty() {
  return (
    <div className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--pm-green-muted)]">
        <svg className="h-7 w-7 text-[var(--pm-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-[var(--pm-text)]">
        No reports yet
      </h2>
      <p className="mt-2 text-sm text-[var(--pm-muted)]">
        Showing demo data once daily reports are available in Supabase.
      </p>
    </div>
  );
}
