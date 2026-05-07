"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Profile = {
  role?: "client" | "worker" | "admin" | null;
  full_name?: string | null;
  email?: string | null;
};

export function AuthNav() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

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

  const close = () => setIsOpen(false);
  const navItems = getNavItems(profile);
  const displayName = profile?.full_name || profile?.email || "User";

  if (isLoading) {
    return <span className="text-sm text-muted">...</span>;
  }

  return (
    <>
      <div className="hidden items-center gap-6 text-sm text-muted md:flex">
        {navItems.map((item) => (
          <Link
            className={item.primary ? "focus-ring inline-flex h-10 items-center justify-center rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-black" : "hover:text-ink"}
            href={item.href}
            key={item.href + item.label}
          >
            {item.label}
          </Link>
        ))}
        {profile ? (
          <>
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
        ) : null}
      </div>

      <button
        aria-label="Buka menu"
        className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-ink md:hidden"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-16 z-40 border-b border-line bg-paper shadow-soft md:hidden">
          <div className="mx-auto w-full max-w-6xl px-4 py-4">
            {profile ? (
              <div className="mb-3 rounded-lg bg-white p-3">
                <p className="truncate text-sm font-semibold text-ink">
                  Halo, {displayName}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Role: {profile.role ?? "client"}
                </p>
              </div>
            ) : null}

            <nav className="grid gap-1">
              {navItems.map((item) => (
                <Link
                  className={
                    item.primary
                      ? "focus-ring mt-2 flex h-11 items-center justify-center rounded-lg bg-ink px-3 text-sm font-semibold text-white"
                      : "focus-ring flex min-h-11 items-center border-b border-line/70 py-3 text-sm font-semibold text-ink last:border-b-0"
                  }
                  href={item.href}
                  key={item.href + item.label}
                  onClick={close}
                >
                  {item.label}
                </Link>
              ))}
              {profile ? (
                <button
                  className="focus-ring mt-2 inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-muted"
                  onClick={handleSignOut}
                  type="button"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              ) : null}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}

function getNavItems(profile: Profile | null) {
  if (!profile) {
    return [
      { href: "/#layanan", label: "Layanan" },
      { href: "/#contoh", label: "Contoh" },
      { href: "/auth", label: "Cek Progress" },
      { href: "/request", label: "Kirim Request", primary: true }
    ];
  }

  const isStaff = profile.role === "admin" || profile.role === "worker";

  if (isStaff) {
    const items = [{ href: "/admin", label: "Kelola Request" }];
    if (profile.role === "admin") {
      items.push({ href: "/admin/settings", label: "Settings" });
    }
    return items;
  }

  return [
    { href: "/dashboard", label: "My Request" },
    { href: "/request", label: "Request Baru", primary: true }
  ];
}
