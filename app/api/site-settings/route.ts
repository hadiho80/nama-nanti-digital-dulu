import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { defaultPasswordPolicy } from "@/lib/settings";

export async function GET() {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("site_settings")
    .select("key, value")
    .in("key", ["contact", "password_policy", "content"]);

  const map = Object.fromEntries((data ?? []).map((item) => [item.key, item.value]));

  return NextResponse.json({
    contact: map.contact ?? {},
    passwordPolicy: {
      ...defaultPasswordPolicy,
      ...(map.password_policy ?? {})
    },
    content: map.content ?? {}
  });
}
