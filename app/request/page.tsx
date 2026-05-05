import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { RequestForm } from "@/components/request-form";
import { SiteHeader } from "@/components/site-header";

export default function RequestPage() {
  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"
          href="/"
        >
          <ArrowLeft size={17} />
          Kembali
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold text-mint">Kirim request</p>
              <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
                Ceritakan dulu kebutuhan digitalmu.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                Isi form ini dulu, setelah submit kamu bisa lanjut buat akun
                untuk cek progress dan ngobrol di thread request.
              </p>
            </div>

            <RequestForm />
          </section>

          <aside className="rounded-lg border border-line bg-white p-5">
            <div className="flex gap-3">
              <Info className="mt-1 shrink-0 text-ocean" size={20} />
              <div>
                <h2 className="text-base font-semibold text-ink">
                  Tips biar cepat direspons
                </h2>
                <ul className="mt-3 grid gap-3 text-sm leading-6 text-muted">
                  <li>Tulis hasil akhir yang kamu mau.</li>
                  <li>Sertakan contoh/referensi kalau ada.</li>
                  <li>Tulis budget awal walau masih nego.</li>
                  <li>Upload file yang berkaitan dengan request.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
