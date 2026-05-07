"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Toast, type ToastTone } from "@/components/toast";
import { translateAuthError } from "@/lib/auth-errors";
import { defaultPasswordPolicy, passwordPolicyDescription, type PasswordPolicy, validatePasswordPolicy } from "@/lib/settings";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthMode = "signin" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [toastTone, setToastTone] = useState<ToastTone>("info");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>(defaultPasswordPolicy);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/site-settings");
        const data = await response.json();
        setPasswordPolicy({ ...defaultPasswordPolicy, ...(data.passwordPolicy ?? {}) });
      } catch {
        setPasswordPolicy(defaultPasswordPolicy);
      }
    }

    void loadSettings();
  }, []);

  function getNextPath() {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");

    if (next?.startsWith("/")) {
      return next;
    }

    return "/dashboard";
  }

  async function handleEmailAuth() {
    setIsLoading(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();

      if (mode === "signup") {
        const validation = validatePasswordPolicy(password, passwordPolicy);
        if (validation) {
          setToastTone("error");
          setMessage(validation);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              getNextPath()
            )}`
          }
        });

        if (error) {
          setToastTone("error");
          setMessage(translateAuthError(error.message));
          return;
        }

        setToastTone("success");
        setMessage(
          "Akun dibuat. Kalau email confirmation aktif, cek inbox dulu ya."
        );
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setToastTone("error");
        setMessage(translateAuthError(error.message));
        return;
      }

      const response = await fetch("/api/me");
      const data = await response.json();
      const role = data.profile?.role;
      window.location.href =
        role === "admin" || role === "worker" ? "/admin" : getNextPath();
    } catch {
      setToastTone("error");
      setMessage(
        "Supabase belum dikonfigurasi. Isi .env.local dulu sebelum login dipakai."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleAuth() {
    setIsLoading(true);
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            getNextPath()
          )}`
        }
      });

      if (error) {
        setToastTone("error");
        setMessage(translateAuthError(error.message));
      }
    } catch {
      setToastTone("error");
      setMessage(
        "Supabase belum dikonfigurasi. Isi .env.local dulu sebelum Google login dipakai."
      );
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-paper p-1">
        <button
          className={`h-10 rounded-md text-sm font-semibold ${
            mode === "signin" ? "bg-white text-ink shadow-sm" : "text-muted"
          }`}
          onClick={() => setMode("signin")}
          type="button"
        >
          Masuk
        </button>
        <button
          className={`h-10 rounded-md text-sm font-semibold ${
            mode === "signup" ? "bg-white text-ink shadow-sm" : "text-muted"
          }`}
          onClick={() => setMode("signup")}
          type="button"
        >
          Daftar
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        {mode === "signup" ? (
          <>
            <label className="grid gap-2 text-sm font-medium text-ink">
              Nama
              <input
                className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Nama lengkap"
                type="text"
                value={fullName}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink">
              Nomor WhatsApp
              <input
                className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
                onChange={(event) => setPhone(event.target.value)}
                placeholder="08xxxxxxxxxx"
                type="tel"
                value={phone}
              />
            </label>
          </>
        ) : null}

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
        <label className="grid gap-2 text-sm font-medium text-ink">
          Password
          <span className="relative">
            <input
              className="focus-ring h-11 w-full rounded-lg border border-line px-3 pr-11 text-sm"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimal 8 karakter"
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
          {mode === "signup" ? (
            <span className="text-xs leading-5 text-muted">
              {passwordPolicyDescription(passwordPolicy)}
            </span>
          ) : null}
        </label>
        <button
          className="focus-ring inline-flex h-11 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
          onClick={handleEmailAuth}
          type="button"
        >
          {isLoading ? "Memproses..." : mode === "signin" ? "Masuk" : "Daftar"}
        </button>
        {mode === "signin" ? (
          <Link className="text-sm font-medium text-ocean hover:text-ink" href="/auth/forgot-password">
            Lupa password?
          </Link>
        ) : null}
        <button
          className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
          onClick={handleGoogleAuth}
          type="button"
        >
          <Mail size={17} />
          Lanjut dengan Google
        </button>
        {message ? (
          <p className="rounded-lg bg-paper p-3 text-sm leading-6 text-muted">
            {message}
          </p>
        ) : null}
      </div>
      {message ? (
        <Toast message={message} onClose={() => setMessage("")} tone={toastTone} />
      ) : null}
    </section>
  );
}
