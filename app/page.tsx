import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard/queries";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { OutletRanking } from "@/components/dashboard/outlet-ranking";
import { SpgRanking } from "@/components/dashboard/spg-ranking";
import { AiAlertsPanel } from "@/components/dashboard/ai-alerts-panel";
import { CompetitorFeed } from "@/components/dashboard/competitor-feed";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import {
  DashboardEmpty,
  DashboardError,
} from "@/components/dashboard/dashboard-states";

async function DashboardContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return (
      <DashboardError message="Supabase environment variables are not configured. Pull them from Vercel with vercel env pull .env.local." />
    );
  }

  try {
    const supabase = await createClient();
    const data = await getDashboardData(supabase);

    if (data.kpis.reportCount === 0) {
      return (
        <AppShell companyName={data.companyName}>
          <DashboardEmpty />
        </AppShell>
      );
    }

    return (
      <AppShell companyName={data.companyName}>
        <div className="space-y-6">
          {/* Hero banner */}
          <div className="relative overflow-hidden rounded-2xl border border-[var(--pm-green)]/20 bg-gradient-to-r from-[var(--pm-green-dark)] via-[var(--pm-green)] to-[var(--pm-green-light)] px-6 py-8 text-white shadow-lg sm:px-8">
            <div className="relative z-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pm-gold-light)]">
                Executive Overview
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                National Modern Trade Performance
              </h2>
              <p className="mt-2 text-sm text-white/80 sm:text-base">
                Live aggregation across {data.kpis.activeOutlets} active outlets
                with AI-powered problem detection and competitor intelligence.
              </p>
            </div>
            <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-[var(--pm-gold)]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 right-1/4 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
          </div>

          <KpiCards kpis={data.kpis} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <OutletRanking rows={data.outletRanking} />
            </div>
            <AiAlertsPanel alerts={data.aiAlerts} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SpgRanking rows={data.spgRanking} />
            <CompetitorFeed activities={data.competitorActivities} />
          </div>
        </div>
      </AppShell>
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return <DashboardError message={message} />;
  }
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
