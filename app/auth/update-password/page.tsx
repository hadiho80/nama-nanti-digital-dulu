import { UpdatePasswordForm } from "@/components/update-password-form";
import { SiteHeader } from "@/components/site-header";

export default function UpdatePasswordPage() {
  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto grid w-full max-w-xl px-4 py-8 sm:px-6">
        <div>
          <p className="text-sm font-semibold text-mint">Password baru</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">
            Buat password baru.
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            Setelah berhasil, kamu akan diarahkan ke halaman sesuai role akun.
          </p>
        </div>
        <UpdatePasswordForm />
      </div>
    </main>
  );
}
