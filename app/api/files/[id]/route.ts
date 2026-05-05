import { NextResponse } from "next/server";
import { getSessionContext, isStaff, jsonError } from "@/app/api/_utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, profile, admin } = await getSessionContext();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const { data: file, error } = await admin
    .from("request_files")
    .select("*, requests(client_id)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return jsonError(error.message);
  }

  if (!file) {
    return jsonError("File not found", 404);
  }

  if (!isStaff(profile?.role) && file.requests?.client_id !== user.id) {
    return jsonError("Forbidden", 403);
  }

  const { data, error: signedError } = await admin.storage
    .from(file.bucket)
    .createSignedUrl(file.path, 60);

  if (signedError || !data?.signedUrl) {
    return jsonError(signedError?.message ?? "Cannot create file URL");
  }

  return NextResponse.redirect(data.signedUrl);
}
