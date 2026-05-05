import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getSessionContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, profile: null, admin: createSupabaseAdminClient() };
  }

  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, role, full_name, email, phone")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile, admin };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function isStaff(role?: string | null) {
  return role === "admin" || role === "worker";
}
