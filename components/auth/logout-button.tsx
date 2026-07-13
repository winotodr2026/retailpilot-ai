"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton({ userEmail }: { userEmail?: string | null }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {userEmail && (
        <span className="hidden max-w-[180px] truncate text-xs text-[var(--pm-muted)] sm:inline">
          {userEmail}
        </span>
      )}
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg border border-[var(--pm-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--pm-text)] shadow-sm transition hover:border-[var(--pm-green)]/30 hover:bg-[var(--pm-green-muted)]/40"
      >
        Log out
      </button>
    </div>
  );
}
