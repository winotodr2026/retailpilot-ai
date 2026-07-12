import type { SupabaseClient } from "@supabase/supabase-js";
import type { Company, Outlet, Spg, Supervisor } from "@/lib/supabase/types";

export async function getCompanies(supabase: SupabaseClient): Promise<Company[]> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getOutlets(
  supabase: SupabaseClient,
  filters: { companyId?: string; activeOnly?: boolean } = {},
): Promise<Outlet[]> {
  let query = supabase.from("outlets").select("*").order("name");
  if (filters.companyId) query = query.eq("company_id", filters.companyId);
  if (filters.activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getSupervisors(
  supabase: SupabaseClient,
  filters: { companyId?: string } = {},
): Promise<Supervisor[]> {
  let query = supabase.from("supervisors").select("*").order("full_name");
  if (filters.companyId) query = query.eq("company_id", filters.companyId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getSpgs(
  supabase: SupabaseClient,
  filters: { companyId?: string; outletId?: string; supervisorId?: string; activeOnly?: boolean } = {},
): Promise<Spg[]> {
  let query = supabase.from("spgs").select("*").order("full_name");
  if (filters.companyId) query = query.eq("company_id", filters.companyId);
  if (filters.outletId) query = query.eq("outlet_id", filters.outletId);
  if (filters.supervisorId) query = query.eq("supervisor_id", filters.supervisorId);
  if (filters.activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
