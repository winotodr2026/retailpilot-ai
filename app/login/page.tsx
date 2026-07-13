import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

function LoginFormFallback() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-12 rounded-xl bg-[var(--pm-border)]" />
      <div className="h-12 rounded-xl bg-[var(--pm-border)]" />
      <div className="h-12 rounded-xl bg-[var(--pm-border)]" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--pm-green)] to-[var(--pm-green-light)] shadow-lg shadow-[var(--pm-green)]/20">
            <span className="text-lg font-bold text-[var(--pm-gold-light)]">PM</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pm-gold)]">
            RetailPilot AI
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--pm-text)]">
            Executive Sign In
          </h1>
          <p className="mt-2 text-sm text-[var(--pm-muted)]">
            Pring Mas National Command Center
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 shadow-sm sm:p-8">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
