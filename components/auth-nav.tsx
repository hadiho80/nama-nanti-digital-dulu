"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthNavProps = {
  isLoggedIn: boolean;
  role?: "client" | "worker" | "admin" | null;
};

export function AuthNav({ isLoggedIn, role }: AuthNavProps) {
  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!isLoggedIn) {
    return (
      <Link className="hover:text-ink" href="/auth">
        Login
      </Link>
    );
  }

  return (
    <>
      <Link
        className="hover:text-ink"
        href={role === "admin" || role === "worker" ? "/admin" : "/dashboard"}
      >
        {role === "admin" || role === "worker" ? "Admin" : "Dashboard"}
      </Link>
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
