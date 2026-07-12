# Security

## Secret Handling
- `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — Vercel env vars only, never in client bundle or repo.
- Edge Function calls OpenAI server-side; client never touches OpenAI directly.
- `SUPABASE_ANON_KEY` is public by design — safe because RLS controls data access.

## Permission Model (v1 — open demo)
- All tables: permissive RLS (select + write open) so anonymous visitors can demo the app.
- No PII in seed data beyond demo names.
- Lock-down sprint replaces policies with `auth.uid() = user_id` + role enum (`spg | supervisor | manager | ceo`).

## Approved Tools Rule
The `analyze-report` Edge Function may only call: OpenAI Chat Completions API and Supabase DB insert. It cannot execute arbitrary shell commands, send emails, or call external webhooks. Any new tool must be explicitly added and code-reviewed.

## Audit Principle
Every meaningful write (report submit, AI analysis insert, coaching note save, review_status change) logs one `audit_logs` row. Risk level is attached at write time. Audit rows are never deleted — no delete policy is granted on `audit_logs`.

## Before Real Users Go Live
- Run lock-down sprint: replace v1 RLS policies with owner-scoped policies.
- Confirm no service role key is exposed in any client-accessible file.
- Test that SPG A cannot read SPG B's reports.
- If adding email delivery: use a transactional email provider with rate limits — get a human to review the integration.
