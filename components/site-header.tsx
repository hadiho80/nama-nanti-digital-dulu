import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  let isLoggedIn = false;
  let role: "client" | "worker" | "admin" | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      isLoggedIn = true;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      role = profile?.role ?? "client";
    }
  } catch {
    isLoggedIn = false;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/92 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-sm font-semibold text-white">
            ND
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-ink">
              Nama Nanti
            </span>
            <span className="block text-xs text-muted">Digital Dulu</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link className="hover:text-ink" href="/#layanan">
            Layanan
          </Link>
          <Link className="hover:text-ink" href="/#contoh">
            Contoh
          </Link>
          <AuthNav isLoggedIn={isLoggedIn} role={role} />
        </nav>
        <Link
          className="focus-ring inline-flex h-10 items-center justify-center rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-black"
          href="/request"
        >
          Kirim Request
        </Link>
      </div>
    </header>
  );
}
