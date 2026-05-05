import { NextResponse } from "next/server";
import { getSessionContext, jsonError } from "@/app/api/_utils";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { user, admin } = await getSessionContext();

  if (!user) {
    return jsonError("Unauthorized", 401);
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

  const formData = await request.formData();
  const files = formData.getAll("files").filter((item) => item instanceof File);
  const uploaded = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${user.id}/${id}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await admin.storage
      .from("request-files")
      .upload(path, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      return jsonError(uploadError.message);
    }

    const { data, error } = await admin
      .from("request_files")
      .insert({
        request_id: id,
        uploaded_by: user.id,
        bucket: "request-files",
        path,
        file_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        file_kind: "attachment"
      })
      .select("*")
      .single();

    if (error) {
      return jsonError(error.message);
    }

    uploaded.push(data);
  }

  return NextResponse.json({ files: uploaded });
}
