import { NextResponse } from "next/server";
import { getSessionContext, isStaff, jsonError } from "@/app/api/_utils";
import { defaultPasswordPolicy } from "@/lib/settings";

export async function GET() {
  const { profile, admin } = await getSessionContext();

  if (profile?.role !== "admin") {
    return jsonError("Forbidden", 403);
  }

  const { data, error } = await admin
    .from("site_settings")
    .select("key, value")
    .in("key", ["contact", "password_policy", "content"]);

  if (error) return jsonError(error.message);

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

export async function POST(request: Request) {
  const { user, profile, admin } = await getSessionContext();

  if (!user || profile?.role !== "admin" || !isStaff(profile.role)) {
    return jsonError("Forbidden", 403);
  }

  const body = await request.json();
  const rows = [
    { key: "contact", value: body.contact ?? {}, updated_by: user.id },
    { key: "password_policy", value: body.passwordPolicy ?? defaultPasswordPolicy, updated_by: user.id },
    { key: "content", value: body.content ?? {}, updated_by: user.id }
  ];

  const { error } = await admin
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });

  if (error) return jsonError(error.message);

  return NextResponse.json({ ok: true });
}
