import { NextResponse } from "next/server";
import { getSessionContext, isStaff, jsonError } from "@/app/api/_utils";

export async function GET() {
  const { profile, admin } = await getSessionContext();

  if (!isStaff(profile?.role)) {
    return jsonError("Forbidden", 403);
  }

  const { data, error } = await admin
    .from("requests")
    .select(
      "id, title, description, budget_range, budget_amount, status, created_at, updated_at, expected_deadline, contact_name, contact_email, contact_phone, service_categories(name, slug), offers(id, price, status, created_at), messages(id)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return jsonError(error.message);
  }

  return NextResponse.json({ requests: data ?? [] });
}
