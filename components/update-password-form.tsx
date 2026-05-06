"use client";

import { useState } from "react";
import { Toast, type ToastTone } from "@/components/toast";
import { translateAuthError } from "@/lib/auth-errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<ToastTone>("info");
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate() {
    setIsLoading(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setTone("error");
        setMessage(translateAuthError(error.message));
        return;
      }

      const response = await fetch("/api/me");
      const data = await response.json();
      const role = data.profile?.role;
      setTone("success");
      setMessage("Password berhasil diganti.");
      window.setTimeout(() => {
        window.location.href = role === "admin" || role === "worker" ? "/admin" : "/dashboard";
      }, 800);
    } catch {
      setTone("error");
      setMessage("Gagal mengganti password. Buka ulang link reset dari email.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-line bg-white p-5 shadow-soft">
      <label className="grid gap-2 text-sm font-medium text-ink">
        Password baru
        <input
          className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimal 6 karakter"
          type="password"
          value={password}
        />
      </label>
      <button
        className="focus-ring mt-4 h-11 w-full rounded-lg bg-ink text-sm font-semibold text-white disabled:opacity-60"
        disabled={isLoading}
        onClick={handleUpdate}
        type="button"
      >
        {isLoading ? "Menyimpan..." : "Simpan password baru"}
      </button>
      {message ? <Toast message={message} onClose={() => setMessage("")} tone={tone} /> : null}
    </section>
  );
}
