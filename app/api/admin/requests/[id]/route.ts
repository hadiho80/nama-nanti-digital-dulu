import { NextResponse } from "next/server";
import { getSessionContext, isStaff, jsonError } from "@/app/api/_utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { profile, admin } = await getSessionContext();

  if (!isStaff(profile?.role)) {
    return jsonError("Forbidden", 403);
  }

  const { data, error } = await admin
    .from("requests")
    .select(
      "*, service_categories(name, slug), client:profiles!requests_client_id_fkey(full_name, email, phone, role), assigned_worker:profiles!requests_assigned_worker_id_fkey(full_name, email, role), offers(*, worker:profiles!offers_worker_id_fkey(full_name, email)), messages(*, sender:profiles!messages_sender_id_fkey(full_name, email, role)), request_files(*), status_history(*, changed_by_profile:profiles!status_history_changed_by_fkey(full_name, email, role))"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return jsonError(error.message);
  }

  if (!data) {
    return jsonError("Request not found", 404);
  }

  return NextResponse.json({ request: data });
}
