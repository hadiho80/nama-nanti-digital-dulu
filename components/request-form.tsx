"use client";

import { FormEvent, useEffect, useState } from "react";
import { FileUp, Send } from "lucide-react";
import { services } from "@/lib/data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const budgetRanges = [
  "< Rp500rb",
  "Rp500rb - Rp1jt",
  "Rp1jt - Rp3jt",
  "Rp3jt - Rp7jt",
  "> Rp7jt",
  "Belum tahu"
];

type RequestFormState = {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  categorySlug: string;
  title: string;
  detailType: string;
  description: string;
  budgetRange: string;
  budgetAmount: string;
  expectedDeadline: string;
};

const initialState: RequestFormState = {
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  categorySlug: "",
  title: "",
  detailType: "",
  description: "",
  budgetRange: "",
  budgetAmount: "",
  expectedDeadline: ""
};

export function RequestForm() {
  const [form, setForm] = useState<RequestFormState>(initialState);
  const [files, setFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const pendingRequest = window.localStorage.getItem("pending-request");

    if (!pendingRequest) {
      return;
    }

    try {
      const parsed = JSON.parse(pendingRequest) as Partial<RequestFormState>;
      setForm((current) => ({
        ...current,
        ...Object.fromEntries(
          Object.entries(parsed).filter(([key]) => key in current)
        )
      }));
      setMessage("Draft request sebelumnya sudah dimuat. Kamu bisa submit lagi.");
    } catch {
      window.localStorage.removeItem("pending-request");
    }
  }, []);

  function updateField<Key extends keyof RequestFormState>(
    key: Key,
    value: RequestFormState[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.localStorage.setItem(
          "pending-request",
          JSON.stringify({ ...form, savedAt: new Date().toISOString() })
        );
        window.location.href = "/auth?next=/request";
        return;
      }

      const { data: categories, error: categoryError } = await supabase
        .from("service_categories")
        .select("id, slug")
        .eq("slug", form.categorySlug)
        .maybeSingle();

      if (categoryError) {
        setMessage(categoryError.message);
        return;
      }

      const { data: request, error: requestError } = await supabase
        .from("requests")
        .insert({
          client_id: user.id,
          category_id: categories?.id ?? null,
          title: form.title,
          description: form.description,
          detail_type: form.detailType || null,
          budget_range: form.budgetRange || null,
          budget_amount: form.budgetAmount ? Number(form.budgetAmount) : null,
          expected_deadline: form.expectedDeadline || null,
          contact_name: form.contactName,
          contact_email: form.contactEmail,
          contact_phone: form.contactPhone,
          source: "website"
        })
        .select("id")
        .single();

      if (requestError || !request) {
        setMessage(requestError?.message ?? "Request gagal dibuat.");
        return;
      }

      if (files?.length) {
        for (const file of Array.from(files)) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
          const path = `${user.id}/${request.id}/${Date.now()}-${safeName}`;
          const { error: uploadError } = await supabase.storage
            .from("request-files")
            .upload(path, file, { upsert: false });

          if (uploadError) {
            setMessage(
              `Request dibuat, tapi upload ${file.name} gagal: ${uploadError.message}`
            );
            continue;
          }

          await supabase.from("request_files").insert({
            request_id: request.id,
            uploaded_by: user.id,
            bucket: "request-files",
            path,
            file_name: file.name,
            mime_type: file.type,
            file_size: file.size
          });
        }
      }

      window.localStorage.removeItem("pending-request");
      window.location.href = "/dashboard";
    } catch {
      window.localStorage.setItem(
        "pending-request",
        JSON.stringify({ ...form, savedAt: new Date().toISOString() })
      );
      setMessage(
        "Supabase belum dikonfigurasi. Draft request disimpan di browser sementara."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Nama
          <input
            className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
            onChange={(event) => updateField("contactName", event.target.value)}
            placeholder="Nama kamu"
            required
            type="text"
            value={form.contactName}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Nomor WhatsApp
          <input
            className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
            onChange={(event) => updateField("contactPhone", event.target.value)}
            placeholder="08xxxxxxxxxx"
            required
            type="tel"
            value={form.contactPhone}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Email
          <input
            className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
            onChange={(event) => updateField("contactEmail", event.target.value)}
            placeholder="email@contoh.com"
            required
            type="email"
            value={form.contactEmail}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Kategori
          <select
            className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
            onChange={(event) => updateField("categorySlug", event.target.value)}
            required
            value={form.categorySlug}
          >
            <option value="">Pilih kategori</option>
            {services.map((service) => (
              <option key={service.name} value={service.slug}>
                {service.name}
              </option>
            ))}
            <option value="lainnya">Lainnya</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Judul request
          <input
            className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Contoh: Landing page katalog produk"
            required
            type="text"
            value={form.title}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Detail kebutuhan
          <input
            className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
            onChange={(event) => updateField("detailType", event.target.value)}
            placeholder="Contoh: company profile, Excel, PPT, automation"
            type="text"
            value={form.detailType}
          />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-medium text-ink">
        Deskripsi
        <textarea
          className="focus-ring min-h-36 resize-y rounded-lg border border-line p-3 text-sm leading-6"
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Ceritakan masalahnya, hasil yang diinginkan, deadline, referensi, dan hal penting lain."
          required
          value={form.description}
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Range budget
          <select
            className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
            onChange={(event) => updateField("budgetRange", event.target.value)}
            value={form.budgetRange}
          >
            <option value="">Pilih range</option>
            {budgetRanges.map((range) => (
              <option key={range}>{range}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Budget angka
          <input
            className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
            onChange={(event) => updateField("budgetAmount", event.target.value)}
            placeholder="Contoh: 750000"
            type="number"
            value={form.budgetAmount}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Deadline harapan
          <input
            className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
            onChange={(event) =>
              updateField("expectedDeadline", event.target.value)
            }
            type="date"
            value={form.expectedDeadline}
          />
        </label>
      </div>

      <label className="mt-4 grid cursor-pointer place-items-center rounded-lg border border-dashed border-line bg-paper p-6 text-center">
        <FileUp className="text-mint" size={26} />
        <span className="mt-2 text-sm font-semibold text-ink">
          Upload file pendukung
        </span>
        <span className="mt-1 max-w-md text-xs leading-5 text-muted">
          Gambar, PDF, Word, Excel, PowerPoint, ZIP, atau video kecil. Maks 20
          MB per file saat MVP.
        </span>
        <input
          className="sr-only"
          multiple
          onChange={(event) => setFiles(event.target.files)}
          type="file"
        />
      </label>

      {message ? (
        <p className="mt-4 rounded-lg bg-paper p-3 text-sm leading-6 text-muted">
          {message}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted">
          Setelah submit, kamu akan diarahkan untuk login atau buat akun agar
          bisa cek progress.
        </p>
        <button
          className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          <Send size={18} />
          {isSubmitting ? "Mengirim..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
}
