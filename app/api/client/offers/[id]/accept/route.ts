import { NextResponse } from "next/server";
import { getSessionContext, jsonError } from "@/app/api/_utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, admin } = await getSessionContext();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const { data: offer, error: offerError } = await admin
    .from("offers")
    .select("*, requests(id, client_id, status)")
    .eq("id", id)
    .maybeSingle();

  if (offerError) {
    return jsonError(offerError.message);
  }

  if (!offer || offer.requests?.client_id !== user.id) {
    return jsonError("Offer not found", 404);
  }

  await admin.from("offers").update({ status: "accepted" }).eq("id", id);
  await admin
    .from("offers")
    .update({ status: "cancelled" })
    .eq("request_id", offer.request_id)
    .neq("id", id)
    .eq("status", "sent");

  const now = new Date().toISOString();
  await admin
    .from("requests")
    .update({ status: "waiting_payment", updated_at: now })
    .eq("id", offer.request_id);

  await admin.from("status_history").insert({
    request_id: offer.request_id,
    changed_by: user.id,
    from_status: offer.requests.status,
    to_status: "waiting_payment",
    note: "Client menyetujui penawaran. Menunggu pembayaran manual/DP."
  });

  return NextResponse.json({ ok: true });
}
