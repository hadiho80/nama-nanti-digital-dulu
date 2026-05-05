"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Profile = {
  role?: "client" | "worker" | "admin" | null;
  full_name?: string | null;
  email?: string | null;
};

export function AuthNav() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();
        setProfile(data.profile);
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, []);

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (isLoading) {
    return <span className="text-muted">...</span>;
  }

  if (!profile) {
    return (
      <>
        <Link className="hover:text-ink" href="/#layanan">
          Layanan
        </Link>
        <Link className="hover:text-ink" href="/#contoh">
          Contoh
        </Link>
        <Link className="hover:text-ink" href="/auth">
          Login
        </Link>
        <Link
          className="focus-ring inline-flex h-10 items-center justify-center rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-black"
          href="/request"
        >
          Kirim Request
        </Link>
      </>
    );
  }

  const isStaff = profile.role === "admin" || profile.role === "worker";
  const displayName = profile.full_name || profile.email || "User";

  return (
    <>
      <Link
        className="hover:text-ink"
        href={isStaff ? "/admin" : "/dashboard"}
      >
        {isStaff ? "Kelola Request" : "My Request"}
      </Link>
      {!isStaff ? (
        <Link className="hover:text-ink" href="/request">
          Request Baru
        </Link>
      ) : null}
      <span className="max-w-[220px] truncate text-sm font-medium text-ink">
        Halo, {displayName} ({profile.role ?? "client"})
      </span>
      <button
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
        onClick={handleSignOut}
        type="button"
      >
        <LogOut size={15} />
        Keluar
      </button>
    </>
  );
}
