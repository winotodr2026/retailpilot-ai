import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireCeo } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";
import { AccountEmailForm } from "@/components/auth/account-email-form";

export default async function AccountPage() {
  const auth = await requireCeo();
  if (!auth.ok) {
    redirect(auth.redirect);
  }

  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const currentEmail = auth.user.email;
  if (!currentEmail) {
    redirect("/login?error=unauthorized");
  }

  return (
    <AppShell
      companyName={company?.name ?? "Pring Mas"}
      userEmail={currentEmail}
      currentPath="/account"
    >
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pm-gold)]">
            Account Settings
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--pm-text)]">
            Executive Account
          </h2>
          <p className="mt-2 text-sm text-[var(--pm-muted)]">
            Manage your sign-in email. Your user ID and CEO permissions are
            unchanged.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 shadow-sm sm:p-8">
          <AccountEmailForm currentEmail={currentEmail} />
        </div>
      </div>
    </AppShell>
  );
}
