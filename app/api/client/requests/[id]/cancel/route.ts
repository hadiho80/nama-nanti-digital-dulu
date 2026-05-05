import { NextResponse } from "next/server";
import { getSessionContext, jsonError } from "@/app/api/_utils";
import { canClientCancel } from "@/lib/status";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, admin } = await getSessionContext();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const { data: existing, error } = await admin
    .from("requests")
    .select("id, client_id, status")
    .eq("id", id)
    .eq("client_id", user.id)
    .maybeSingle();

  if (error) {
    return jsonError(error.message);
  }

  if (!existing) {
    return jsonError("Request not found", 404);
  }

  if (!canClientCancel(existing.status)) {
    return jsonError(
      "Request sudah masuk tahap pengerjaan/pembayaran. Pembatalan hanya bisa lewat admin.",
      409
    );
  }

  await admin
    .from("requests")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id);

  await admin.from("status_history").insert({
    request_id: id,
    changed_by: user.id,
    from_status: existing.status,
    to_status: "cancelled",
    note: "Client membatalkan request sebelum tahap pengerjaan."
  });

  return NextResponse.json({ ok: true });
}
