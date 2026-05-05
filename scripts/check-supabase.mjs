import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

const { data, error } = await supabase
  .from("service_categories")
  .select("name, slug")
  .order("sort_order", { ascending: true });

if (error) {
  console.error("Supabase connection failed:");
  console.error(error.message);
  process.exit(1);
}

console.log("Supabase connection OK.");
console.table(data);
