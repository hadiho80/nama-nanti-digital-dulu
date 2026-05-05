import { NextResponse } from "next/server";
import { getSessionContext, jsonError } from "@/app/api/_utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, admin } = await getSessionContext();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const { data, error } = await admin
    .from("requests")
    .select(
      "*, service_categories(name, slug), offers(*, worker:profiles!offers_worker_id_fkey(full_name, email)), messages(*, sender:profiles!messages_sender_id_fkey(full_name, email, role)), request_files(*), status_history(*, changed_by_profile:profiles!status_history_changed_by_fkey(full_name, email, role))"
    )
    .eq("id", id)
    .eq("client_id", user.id)
    .maybeSingle();

  if (error) {
    return jsonError(error.message);
  }

  if (!data) {
    return jsonError("Request not found", 404);
  }

  return NextResponse.json({ request: data });
}
