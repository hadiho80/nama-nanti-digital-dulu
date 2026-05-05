import Link from "next/link";
import { ArrowRight, FileText, MessageCircle, Plus } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { sampleRequests } from "@/lib/data";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-mint">Dashboard client</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink">
              Request kamu
            </h1>
            <p className="mt-2 text-sm text-muted">
              Ini preview UI. Nanti data asli datang dari Supabase sesuai akun
              client.
            </p>
          </div>
          <Link
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white"
            href="/request"
          >
            <Plus size={18} />
            Request Baru
          </Link>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Request aktif", "3"],
            ["Menunggu balasan", "1"],
            ["Selesai", "0"]
          ].map(([label, value]) => (
            <div className="rounded-lg border border-line bg-white p-5" key={label}>
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-lg border border-line bg-white">
          <div className="border-b border-line p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-ink">Daftar request</h2>
          </div>
          <div className="divide-y divide-line">
            {sampleRequests.map((request) => (
              <article
                className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center"
                key={request.id}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-muted">
                      {request.id}
                    </span>
                    <StatusBadge label={request.status} />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-ink">
                    {request.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <FileText size={16} />
                      {request.category}
                    </span>
                    <span>{request.budget}</span>
                    <span>Update {request.updated}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle size={16} />
                      {request.messages} pesan
                    </span>
                  </div>
                </div>
                <Link
                  className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-4 text-sm font-semibold text-ink hover:border-ink"
                  href={`/dashboard/requests/${request.slug}`}
                >
                  Detail
                  <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.58fr_0.42fr]">
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-semibold text-ink">Thread terakhir</h2>
            <div className="mt-4 grid gap-3">
              <div className="max-w-[86%] rounded-lg bg-paper p-3 text-sm leading-6 text-muted">
                Halo, budget awalnya bisa. Kami cek dulu file katalog dan
                susun scope yang paling pas.
              </div>
              <div className="ml-auto max-w-[86%] rounded-lg bg-ink p-3 text-sm leading-6 text-white">
                Oke, saya tunggu penawarannya. Deadline ideal minggu depan.
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-semibold text-ink">Penawaran aktif</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Landing page 5 section, form WhatsApp, katalog produk, revisi 2x,
              estimasi 5-7 hari.
            </p>
            <div className="mt-4 rounded-lg bg-mint/10 p-4">
              <p className="text-sm text-muted">Total penawaran</p>
              <p className="mt-1 text-2xl font-semibold text-ink">Rp850.000</p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button className="focus-ring h-11 rounded-lg bg-ink text-sm font-semibold text-white">
                Setuju
              </button>
              <button className="focus-ring h-11 rounded-lg border border-line text-sm font-semibold text-ink">
                Nego dulu
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
