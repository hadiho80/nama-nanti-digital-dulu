import { NextResponse } from "next/server";
import { getSessionContext, isStaff, jsonError } from "@/app/api/_utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, profile, admin } = await getSessionContext();
  const body = (await request.json()) as { body?: string; isInternal?: boolean };

  if (!user || !isStaff(profile?.role)) {
    return jsonError("Forbidden", 403);
  }

  if (!body.body?.trim()) {
    return jsonError("Message cannot be empty");
  }

  const { data, error } = await admin
    .from("messages")
    .insert({
      request_id: id,
      sender_id: user.id,
      body: body.body.trim(),
      is_internal: Boolean(body.isInternal)
    })
    .select("*")
    .single();

  if (error) {
    return jsonError(error.message);
  }

  return NextResponse.json({ message: data });
}
