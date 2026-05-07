"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Toast, type ToastTone } from "@/components/toast";
import { translateAuthError } from "@/lib/auth-errors";
import { defaultPasswordPolicy, passwordPolicyDescription, type PasswordPolicy, validatePasswordPolicy } from "@/lib/settings";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<ToastTone>("info");
  const [isLoading, setIsLoading] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [canUpdate, setCanUpdate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>(defaultPasswordPolicy);

  useEffect(() => {
    async function prepareRecoverySession() {
      setIsPreparing(true);

      try {
        const supabase = createSupabaseBrowserClient();
        const settingsResponse = await fetch("/api/site-settings");
        const settings = await settingsResponse.json().catch(() => ({}));
        setPasswordPolicy({
          ...defaultPasswordPolicy,
          ...(settings.passwordPolicy ?? {})
        });
        const url = new URL(window.location.href);
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const code = url.searchParams.get("code");
        const accessToken =
          url.searchParams.get("access_token") || hash.get("access_token");
        const refreshToken =
          url.searchParams.get("refresh_token") || hash.get("refresh_token");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            setTone("error");
            setMessage(translateAuthError(error.message));
            setCanUpdate(false);
            return;
          }

          cleanUrl();
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            setTone("error");
            setMessage(translateAuthError(error.message));
            setCanUpdate(false);
            return;
          }

          cleanUrl();
        }

        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!session) {
          setTone("error");
          setMessage(
            "Sesi reset password tidak ditemukan. Buka link reset dari email di browser yang sama, atau copy link reset ke browser ini."
          );
          setCanUpdate(false);
          return;
        }

        setCanUpdate(true);
      } catch {
        setTone("error");
        setMessage("Gagal menyiapkan sesi reset password. Buka ulang link dari email.");
        setCanUpdate(false);
      } finally {
        setIsPreparing(false);
      }
    }

    void prepareRecoverySession();
  }, []);

  function cleanUrl() {
    window.history.replaceState(null, "", "/auth/update-password");
  }

  async function handleUpdate() {
    setIsLoading(true);
    setMessage("");

    try {
      const validation = validatePasswordPolicy(password, passwordPolicy);
      if (validation) {
        setTone("error");
        setMessage(validation);
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) {
        setTone("error");
        setMessage(
          "Sesi reset password sudah tidak aktif. Buka ulang link reset dari email."
        );
        return;
      }

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
      {isPreparing ? (
        <p className="mb-4 rounded-lg bg-paper p-3 text-sm leading-6 text-muted">
          Menyiapkan sesi reset password...
        </p>
      ) : null}
      {!isPreparing && !canUpdate ? (
        <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm leading-6 text-rose-700">
          Link reset belum valid di browser ini. Buka link dari email secara
          langsung di browser yang sama, atau copy link reset ke browser ini.
        </p>
      ) : null}
      <label className="grid gap-2 text-sm font-medium text-ink">
        Password baru
        <span className="relative">
          <input
            className="focus-ring h-11 w-full rounded-lg border border-line px-3 pr-11 text-sm"
            onChange={(event) => setPassword(event.target.value)}
            placeholder={`Minimal ${passwordPolicy.minLength} karakter`}
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted hover:text-ink"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </span>
        <span className="text-xs leading-5 text-muted">
          {passwordPolicyDescription(passwordPolicy)}
        </span>
      </label>
      <button
        className="focus-ring mt-4 h-11 w-full rounded-lg bg-ink text-sm font-semibold text-white disabled:opacity-60"
        disabled={isLoading || isPreparing || !canUpdate}
        onClick={handleUpdate}
        type="button"
      >
        {isLoading ? "Menyimpan..." : "Simpan password baru"}
      </button>
      {message ? <Toast message={message} onClose={() => setMessage("")} tone={tone} /> : null}
    </section>
  );
}
