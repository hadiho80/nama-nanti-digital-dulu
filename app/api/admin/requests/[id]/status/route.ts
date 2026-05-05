import { NextResponse } from "next/server";
import { getSessionContext, isStaff, jsonError } from "@/app/api/_utils";
import { requestStatusOptions } from "@/lib/status";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, profile, admin } = await getSessionContext();
  const body = (await request.json()) as { status?: string; note?: string };

  if (!user || !isStaff(profile?.role)) {
    return jsonError("Forbidden", 403);
  }

  if (!body.status || !requestStatusOptions.includes(body.status as never)) {
    return jsonError("Invalid status");
  }

  const { data: existing } = await admin
    .from("requests")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (!existing) {
    return jsonError("Request not found", 404);
  }

  if (existing.status === body.status) {
    return NextResponse.json({ ok: true });
  }

  await admin
    .from("requests")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", id);

  await admin.from("status_history").insert({
    request_id: id,
    changed_by: user.id,
    from_status: existing.status,
    to_status: body.status,
    note: body.note?.trim() || "Admin memperbarui status request."
  });

  return NextResponse.json({ ok: true });
}
