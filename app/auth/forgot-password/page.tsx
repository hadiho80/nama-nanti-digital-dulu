import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { SiteHeader } from "@/components/site-header";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.58fr_0.42fr]">
        <section>
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"
            href="/auth"
          >
            <ArrowLeft size={17} />
            Login
          </Link>
          <div className="mt-8">
            <p className="text-sm font-semibold text-mint">Lupa password</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
              Kirim link reset ke email.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              Masukkan email akunmu. Kalau email terdaftar, Supabase akan
              mengirim link untuk membuat password baru.
            </p>
          </div>
        </section>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
