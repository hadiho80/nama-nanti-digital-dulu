import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";

export function SiteHeader() {
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
        <AuthNav />
      </div>
    </header>
  );
}
