import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/account", label: "Account" },
  { href: "/report/new", label: "Submit Report", soon: true },
  { href: "/supervisor", label: "Supervisor", soon: true },
];

function isNavActive(href: string, currentPath: string) {
  if (href === "/") return currentPath === "/";
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function AppShell({
  companyName,
  userEmail,
  currentPath = "/",
  children,
}: {
  companyName: string;
  userEmail?: string | null;
  currentPath?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--pm-bg)]">
      <header className="sticky top-0 z-50 border-b border-[var(--pm-border)] bg-[var(--pm-surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--pm-green)] to-[var(--pm-green-light)] shadow-lg shadow-[var(--pm-green)]/20">
              <span className="text-sm font-bold text-[var(--pm-gold-light)]">PM</span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--pm-gold)]">
                RetailPilot AI
              </p>
              <h1 className="text-sm font-semibold text-[var(--pm-text)] sm:text-base">
                {companyName} · National Command Center
              </h1>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) =>
              item.soon ? (
                <span
                  key={item.href}
                  className="cursor-not-allowed rounded-lg px-3 py-2 text-sm text-[var(--pm-muted)] opacity-60"
                  title="Coming in Sprint 2"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isNavActive(item.href, currentPath)
                      ? "rounded-lg bg-[var(--pm-green)] px-3 py-2 text-sm font-medium text-white shadow-sm"
                      : "rounded-lg px-3 py-2 text-sm text-[var(--pm-muted)] transition hover:bg-[var(--pm-green-muted)] hover:text-[var(--pm-text)]"
                  }
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <LogoutButton userEmail={userEmail} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-[var(--pm-border)] bg-[var(--pm-surface)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-[var(--pm-muted)] sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} {companyName} · Modern Trade Intelligence</span>
          <span>Powered by RetailPilot AI</span>
        </div>
      </footer>
    </div>
  );
}
