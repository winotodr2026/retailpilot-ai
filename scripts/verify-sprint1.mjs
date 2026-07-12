// Sprint 1 validation script — run this yourself, it never leaves your machine.
//
// Usage:
//   vercel link
//   vercel env pull .env.local
//   node --env-file=.env.local scripts/verify-sprint1.mjs
//
// Uses only the public anon key (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY),
// the same credentials the browser app uses. No service role key required or read.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
      "Run `vercel link` then `vercel env pull .env.local` first, then re-run with:\n" +
      "  node --env-file=.env.local scripts/verify-sprint1.mjs",
  );
  process.exit(1);
}

const supabase = createClient(url, anonKey);
const results = [];

function record(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"} — ${name}${detail ? `: ${detail}` : ""}`);
}

async function count(table) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

async function main() {
  console.log("Sprint 1 verification — connecting to", url);
  console.log("----------------------------------------");

  // 1. Seed row counts
  const expected = { companies: 1, outlets: 4, spgs: 4, supervisors: 2, daily_reports: 3, ai_analyses: 3 };
  for (const [table, expectedCount] of Object.entries(expected)) {
    const actual = await count(table);
    record(`${table} row count`, actual === expectedCount, `expected ${expectedCount}, got ${actual}`);
  }

  // 2. Every outlet/spg/supervisor/daily_report is linked to a company
  const { data: companies, error: companiesErr } = await supabase.from("companies").select("id, name");
  if (companiesErr) throw companiesErr;
  const companyIds = new Set((companies ?? []).map((c) => c.id));
  record("companies table has Pring Mas", (companies ?? []).some((c) => c.name === "Pring Mas"));

  for (const table of ["outlets", "supervisors", "spgs", "daily_reports"]) {
    const { data, error } = await supabase.from(table).select("id, company_id");
    if (error) throw error;
    const allLinked = (data ?? []).length > 0 && (data ?? []).every((row) => row.company_id && companyIds.has(row.company_id));
    record(`${table} all linked to a company`, allLinked);
  }

  // 3. daily_reports JOIN ai_analyses returns usable data
  const { data: joined, error: joinErr } = await supabase
    .from("daily_reports")
    .select("id, outlet_id, ai_analyses(kpi_summary, outlet_score, status)");
  if (joinErr) throw joinErr;
  const joinOk =
    (joined ?? []).length === 3 &&
    (joined ?? []).every((r) => {
      const analysis = Array.isArray(r.ai_analyses) ? r.ai_analyses[0] : r.ai_analyses;
      return (
        analysis &&
        analysis.kpi_summary &&
        typeof analysis.outlet_score === "number" &&
        analysis.outlet_score >= 0 &&
        analysis.outlet_score <= 100 &&
        analysis.status === "completed"
      );
    });
  record("daily_reports joins ai_analyses with valid kpi_summary/outlet_score/status", joinOk);

  // 4. Duplicate daily_report (same spg_id + outlet_id + report_date) must be rejected
  const { data: sample, error: sampleErr } = await supabase
    .from("daily_reports")
    .select("spg_id, outlet_id, report_date, company_id")
    .limit(1)
    .single();
  if (sampleErr) throw sampleErr;

  const { data: dup, error: dupErr } = await supabase
    .from("daily_reports")
    .insert({
      spg_id: sample.spg_id,
      outlet_id: sample.outlet_id,
      report_date: sample.report_date,
      company_id: sample.company_id,
    })
    .select("id");

  if (dup && dup.length > 0) {
    // Should never happen — clean up immediately so we don't pollute real data.
    await supabase.from("daily_reports").delete().eq("id", dup[0].id);
    record("duplicate daily_report insert is rejected", false, "insert unexpectedly SUCCEEDED and was rolled back manually");
  } else {
    const isUniqueViolation = dupErr && (dupErr.code === "23505" || /duplicate key/i.test(dupErr.message));
    record("duplicate daily_report insert is rejected", Boolean(isUniqueViolation), dupErr?.message);
  }

  // 5. shelf_photos Storage bucket is reachable
  const { error: bucketErr } = await supabase.storage.from("shelf_photos").list("", { limit: 1 });
  record("shelf_photos Storage bucket exists and is readable", !bucketErr, bucketErr?.message);

  console.log("----------------------------------------");
  const failed = results.filter((r) => !r.pass);
  if (failed.length === 0) {
    console.log(`All ${results.length} checks passed. Sprint 1 is verified.`);
    process.exit(0);
  } else {
    console.log(`${failed.length} of ${results.length} checks FAILED. See above.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Verification script crashed:", err);
  process.exit(1);
});
