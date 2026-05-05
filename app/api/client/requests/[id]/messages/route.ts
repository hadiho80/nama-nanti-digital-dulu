import { NextResponse } from "next/server";
import { getSessionContext, jsonError } from "@/app/api/_utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, admin } = await getSessionContext();
  const body = (await request.json()) as { body?: string };

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  if (!body.body?.trim()) {
    return jsonError("Message cannot be empty");
  }

  const { data: existing } = await admin
    .from("requests")
    .select("id")
    .eq("id", id)
    .eq("client_id", user.id)
    .maybeSingle();

  if (!existing) {
    return jsonError("Request not found", 404);
  }

  const { data, error } = await admin
    .from("messages")
    .insert({
      request_id: id,
      sender_id: user.id,
      body: body.body.trim()
    })
    .select("*")
    .single();

  if (error) {
    return jsonError(error.message);
  }

  return NextResponse.json({ message: data });
}
