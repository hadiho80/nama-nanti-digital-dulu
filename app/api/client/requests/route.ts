import { NextResponse } from "next/server";
import { getSessionContext, jsonError } from "@/app/api/_utils";

export async function POST(request: Request) {
  const { user, admin } = await getSessionContext();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const formData = await request.formData();
  const categorySlug = String(formData.get("categorySlug") ?? "");
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");

  if (!categorySlug || !title.trim() || !description.trim()) {
    return jsonError("Kategori, judul, dan deskripsi wajib diisi.");
  }

  const { data: category } = await admin
    .from("service_categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();

  const budgetAmount = String(formData.get("budgetAmount") ?? "");
  const expectedDeadline = String(formData.get("expectedDeadline") ?? "");

  const { data: created, error: createError } = await admin
    .from("requests")
    .insert({
      client_id: user.id,
      category_id: category?.id ?? null,
      title: title.trim(),
      description: description.trim(),
      detail_type: String(formData.get("detailType") ?? "") || null,
      budget_range: String(formData.get("budgetRange") ?? "") || null,
      budget_amount: budgetAmount ? Number(budgetAmount) : null,
      expected_deadline: expectedDeadline || null,
      contact_name: String(formData.get("contactName") ?? "") || null,
      contact_email: String(formData.get("contactEmail") ?? "") || null,
      contact_phone: String(formData.get("contactPhone") ?? "") || null,
      source: "website",
      created_by: user.id,
      status: "submitted"
    })
    .select("id")
    .single();

  if (createError || !created) {
    return jsonError(createError?.message ?? "Request gagal dibuat.");
  }

  await admin.from("status_history").insert({
    request_id: created.id,
    changed_by: user.id,
    from_status: null,
    to_status: "submitted",
    note: "Client membuat request dari website."
  });

  const files = formData.getAll("files").filter((item) => item instanceof File);

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${user.id}/${created.id}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await admin.storage
      .from("request-files")
      .upload(path, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      continue;
    }

    await admin.from("request_files").insert({
      request_id: created.id,
      uploaded_by: user.id,
      bucket: "request-files",
      path,
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size,
      file_kind: "attachment"
    });
  }

  return NextResponse.json({ requestId: created.id });
}

export async function GET() {
  const { user, admin } = await getSessionContext();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const { data, error } = await admin
    .from("requests")
    .select(
      "id, title, description, budget_range, budget_amount, status, created_at, updated_at, expected_deadline, service_categories(name, slug), offers(id, price, status, created_at), messages(id)"
    )
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return jsonError(error.message);
  }

  return NextResponse.json({ requests: data ?? [] });
}
