"use client";

import { useEffect, useState } from "react";
import { Toast, type ToastTone } from "@/components/toast";
import { defaultPasswordPolicy, type ContactSettings, type ContentSettings, type PasswordPolicy } from "@/lib/settings";

export function AdminSettingsForm() {
  const [contact, setContact] = useState<ContactSettings>({});
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>(defaultPasswordPolicy);
  const [content, setContent] = useState<ContentSettings>({});
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<ToastTone>("success");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/admin/settings");
        const data = await response.json();
        setContact(data.contact ?? {});
        setPasswordPolicy({ ...defaultPasswordPolicy, ...(data.passwordPolicy ?? {}) });
        setContent(data.content ?? {});
      } catch {
        setTone("error");
        setMessage("Gagal memuat settings.");
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  async function save() {
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, passwordPolicy, content })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error ?? "Settings gagal disimpan.");
      }

      setTone("success");
      setMessage("Settings berhasil disimpan.");
    } catch (err) {
      setTone("error");
      setMessage(err instanceof Error ? err.message : "Settings gagal disimpan.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="mt-6 rounded-lg border border-line bg-white p-5 text-sm text-muted">Memuat settings...</p>;
  }

  return (
    <section className="mt-6 grid gap-5">
      <div className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-semibold text-ink">Kontak publik</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Email
            <input className="focus-ring h-11 rounded-lg border border-line px-3 text-sm" onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))} placeholder="halo@domain.com" type="email" value={contact.email ?? ""} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            WhatsApp
            <input className="focus-ring h-11 rounded-lg border border-line px-3 text-sm" onChange={(event) => setContact((current) => ({ ...current, whatsapp: event.target.value }))} placeholder="08xxxx / 628xxxx" type="tel" value={contact.whatsapp ?? ""} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Instagram
            <input className="focus-ring h-11 rounded-lg border border-line px-3 text-sm" onChange={(event) => setContact((current) => ({ ...current, instagram: event.target.value }))} placeholder="@username" type="text" value={contact.instagram ?? ""} />
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-semibold text-ink">Password policy</h2>
        <div className="mt-4 grid gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input checked={passwordPolicy.enabled} onChange={(event) => setPasswordPolicy((current) => ({ ...current, enabled: event.target.checked }))} type="checkbox" />
            Aktifkan aturan password custom
          </label>
          <label className="grid max-w-xs gap-2 text-sm font-medium text-ink">
            Minimal karakter
            <input className="focus-ring h-11 rounded-lg border border-line px-3 text-sm" min={6} onChange={(event) => setPasswordPolicy((current) => ({ ...current, minLength: Number(event.target.value) }))} type="number" value={passwordPolicy.minLength} />
          </label>
          <div className="grid gap-2 sm:grid-cols-3">
            <label className="flex items-center gap-2 text-sm text-muted">
              <input checked={passwordPolicy.requireLetter} onChange={(event) => setPasswordPolicy((current) => ({ ...current, requireLetter: event.target.checked }))} type="checkbox" />
              Wajib huruf
            </label>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input checked={passwordPolicy.requireNumber} onChange={(event) => setPasswordPolicy((current) => ({ ...current, requireNumber: event.target.checked }))} type="checkbox" />
              Wajib angka
            </label>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input checked={passwordPolicy.requireSymbol} onChange={(event) => setPasswordPolicy((current) => ({ ...current, requireSymbol: event.target.checked }))} type="checkbox" />
              Wajib simbol
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-semibold text-ink">Privacy & Terms</h2>
        <div className="mt-4 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Custom Privacy
            <textarea className="focus-ring min-h-44 rounded-lg border border-line p-3 text-sm leading-6" onChange={(event) => setContent((current) => ({ ...current, privacy: event.target.value }))} placeholder="Kosongkan untuk pakai teks default." value={content.privacy ?? ""} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Custom Terms
            <textarea className="focus-ring min-h-44 rounded-lg border border-line p-3 text-sm leading-6" onChange={(event) => setContent((current) => ({ ...current, terms: event.target.value }))} placeholder="Kosongkan untuk pakai teks default." value={content.terms ?? ""} />
          </label>
        </div>
      </div>

      <button className="focus-ring h-11 rounded-lg bg-ink text-sm font-semibold text-white disabled:opacity-60" disabled={isSaving} onClick={save} type="button">
        {isSaving ? "Menyimpan..." : "Simpan Settings"}
      </button>
      {message ? <Toast message={message} onClose={() => setMessage("")} tone={tone} /> : null}
    </section>
  );
}
