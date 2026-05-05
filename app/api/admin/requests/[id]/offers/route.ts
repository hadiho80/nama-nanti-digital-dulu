import { NextResponse } from "next/server";
import { getSessionContext, isStaff, jsonError } from "@/app/api/_utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, profile, admin } = await getSessionContext();
  const body = (await request.json()) as {
    price?: string | number;
    estimatedDays?: string | number;
    estimatedUnit?: string;
    scope?: string;
    revisionCount?: string | number;
    paymentTerms?: string;
  };

  if (!user || !isStaff(profile?.role)) {
    return jsonError("Forbidden", 403);
  }

  const price = Number(body.price);

  if (!price || !body.scope?.trim()) {
    return jsonError("Price and scope are required");
  }

  const estimatedUnit = ["hari", "minggu", "bulan", "tahun"].includes(
    body.estimatedUnit ?? ""
  )
    ? body.estimatedUnit
    : "hari";

  const { data, error } = await admin
    .from("offers")
    .insert({
      request_id: id,
      worker_id: user.id,
      price,
      estimated_days: body.estimatedDays ? Number(body.estimatedDays) : null,
      estimated_unit: estimatedUnit,
      scope: body.scope.trim(),
      revision_count: body.revisionCount ? Number(body.revisionCount) : 1,
      payment_terms: body.paymentTerms?.trim() || null,
      status: "sent"
    })
    .select("*")
    .single();

  if (error) {
    return jsonError(error.message);
  }

  const { data: req } = await admin
    .from("requests")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (req?.status !== "negotiating" && req?.status !== "waiting_approval") {
    await admin
      .from("requests")
      .update({ status: "waiting_approval", updated_at: new Date().toISOString() })
      .eq("id", id);

    await admin.from("status_history").insert({
      request_id: id,
      changed_by: user.id,
      from_status: req?.status ?? null,
      to_status: "waiting_approval",
      note: "Admin mengirim penawaran."
    });
  }

  return NextResponse.json({ offer: data });
}
