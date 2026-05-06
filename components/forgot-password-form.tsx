"use client";

import { useState } from "react";
import { Toast, type ToastTone } from "@/components/toast";
import { translateAuthError } from "@/lib/auth-errors";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<ToastTone>("info");
  const [isLoading, setIsLoading] = useState(false);

  async function handleReset() {
    setIsLoading(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`
      });

      if (error) {
        setTone("error");
        setMessage(translateAuthError(error.message));
        return;
      }

      setTone("success");
      setMessage("Link reset sudah dikirim. Cek inbox email kamu.");
    } catch {
      setTone("error");
      setMessage("Gagal mengirim link reset. Coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-line bg-white p-5 shadow-soft lg:mt-0">
      <label className="grid gap-2 text-sm font-medium text-ink">
        Email
        <input
          className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email@contoh.com"
          type="email"
          value={email}
        />
      </label>
      <button
        className="focus-ring mt-4 h-11 w-full rounded-lg bg-ink text-sm font-semibold text-white disabled:opacity-60"
        disabled={isLoading}
        onClick={handleReset}
        type="button"
      >
        {isLoading ? "Mengirim..." : "Kirim link reset"}
      </button>
      {message ? (
        <p className="mt-4 rounded-lg bg-paper p-3 text-sm leading-6 text-muted">
          {message}
        </p>
      ) : null}
      {message ? <Toast message={message} onClose={() => setMessage("")} tone={tone} /> : null}
    </section>
  );
}
