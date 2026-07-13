-- 0004: User profiles with role — foundation for CEO-only auth (Sprint 6 phase 1).
-- Never edit 0001–0003 — this migration builds on top of them.
--
-- MANUAL SETUP (run in Supabase SQL Editor AFTER this migration):
--   1. Supabase Dashboard → Authentication → Users → Add user (email + password)
--   2. Copy the new user's UUID, then run:
--        insert into public.profiles (id, role, full_name)
--        values ('<AUTH-USER-UUID>', 'ceo', 'CEO Name');
--   3. Authentication → Providers → disable "Enable sign ups" for email provider

-- ── Role enum via check constraint ───────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('ceo', 'supervisor', 'spg', 'manager')),
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users may read only their own profile (needed for role checks in the app)
drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own" on public.profiles
  for select using (auth.uid() = id);

-- No insert/update/delete policies for authenticated users.
-- Profile rows are created manually by an admin via the SQL Editor (service role).

-- ── Helper: is the current session a CEO? ────────────────────────────────────
-- SECURITY DEFINER so it can read profiles regardless of caller RLS context.
create or replace function public.is_ceo()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'ceo'
  );
$$;

revoke all on function public.is_ceo() from public;
grant execute on function public.is_ceo() to authenticated;
