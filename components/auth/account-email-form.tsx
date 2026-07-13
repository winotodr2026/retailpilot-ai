"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AccountEmailForm({ currentEmail }: { currentEmail: string }) {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = newEmail.trim().toLowerCase();
    const trimmedConfirm = confirmEmail.trim().toLowerCase();

    if (!trimmed || !trimmedConfirm) {
      setError("Please enter and confirm your new email address.");
      return;
    }

    if (trimmed !== trimmedConfirm) {
      setError("The new email addresses do not match.");
      return;
    }

    if (trimmed === currentEmail.trim().toLowerCase()) {
      setError("The new email must be different from your current email.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      email: trimmed,
    });

    if (updateError) {
      setError(
        updateError.message ||
          "Unable to update email. Please try again or contact your administrator.",
      );
      setLoading(false);
      return;
    }

    setSuccess(
      "Email update requested. If your project requires confirmation, check your inbox and confirm the new address before it becomes active. You may need to sign in again with the new email after confirming.",
    );
    setNewEmail("");
    setConfirmEmail("");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-[var(--pm-green)]/25 bg-[var(--pm-green-muted)]/50 px-4 py-3 text-sm text-[var(--pm-green-dark)]"
        >
          {success}
        </div>
      )}

      <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-bg)] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--pm-muted)]">
          Current email
        </p>
        <p className="mt-1 text-sm font-medium text-[var(--pm-text)]">
          {currentEmail}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--pm-gold)]/30 bg-[var(--pm-gold-muted)]/40 px-4 py-3 text-sm text-[var(--pm-gold-dark)]">
        Changing your email may require confirmation via a link sent to the new
        address. Your account ID and access permissions will stay the same.
      </div>

      <div className="space-y-2">
        <label
          htmlFor="new-email"
          className="block text-sm font-medium text-[var(--pm-text)]"
        >
          New email address
        </label>
        <input
          id="new-email"
          type="email"
          autoComplete="email"
          required
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full rounded-xl border border-[var(--pm-border)] bg-white px-4 py-3 text-sm text-[var(--pm-text)] shadow-sm outline-none transition focus:border-[var(--pm-green)] focus:ring-2 focus:ring-[var(--pm-green)]/20"
          placeholder="new.email@pringmas.id"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirm-email"
          className="block text-sm font-medium text-[var(--pm-text)]"
        >
          Confirm new email address
        </label>
        <input
          id="confirm-email"
          type="email"
          autoComplete="email"
          required
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          className="w-full rounded-xl border border-[var(--pm-border)] bg-white px-4 py-3 text-sm text-[var(--pm-text)] shadow-sm outline-none transition focus:border-[var(--pm-green)] focus:ring-2 focus:ring-[var(--pm-green)]/20"
          placeholder="new.email@pringmas.id"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-gradient-to-r from-[var(--pm-green-dark)] via-[var(--pm-green)] to-[var(--pm-green-light)] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Updating…" : "Update email"}
      </button>
    </form>
  );
}
