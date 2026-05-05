import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AuthPage() {
  let isLoggedIn = false;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      isLoggedIn = true;
    }
  } catch {
    // Keep auth page usable before Supabase env is configured.
  }

  if (isLoggedIn) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.58fr_0.42fr] lg:items-start">
        <section>
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"
            href="/"
          >
            <ArrowLeft size={17} />
            Kembali
          </Link>
          <div className="mt-8">
            <p className="text-sm font-semibold text-mint">Login</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
              Masuk untuk cek progress request.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              Nanti halaman ini disambungkan ke Supabase Auth untuk email,
              password, dan Google login.
            </p>
          </div>
        </section>

        <AuthForm />
      </div>
    </main>
  );
}
