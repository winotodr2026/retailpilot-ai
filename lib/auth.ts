import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}

export type RequireCeoResult =
  | { ok: true; user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>; profile: Profile }
  | { ok: false; redirect: string };

export async function requireCeo(): Promise<RequireCeoResult> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, redirect: "/login" };
  }

  const profile = await getUserProfile(user.id);
  if (!profile || profile.role !== "ceo") {
    return { ok: false, redirect: "/login?error=unauthorized" };
  }

  return { ok: true, user, profile };
}
