import Link from "next/link";
import {
  ArrowUpRight,
  ClipboardList,
  FilePlus2,
  Filter,
  MessageSquare
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { sampleRequests } from "@/lib/data";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-mint">Admin solo</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink">
              Kelola request masuk
            </h1>
            <p className="mt-2 text-sm text-muted">
              Preview dashboard worker/admin. Struktur ini siap dibuat
              multi-worker nanti.
            </p>
          </div>
          <Link
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white"
            href="/request"
          >
            <FilePlus2 size={18} />
            Input Manual
          </Link>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ["Baru", "4"],
            ["Nego", "2"],
            ["Working", "1"],
            ["Menunggu client", "3"]
          ].map(([label, value]) => (
            <div className="rounded-lg border border-line bg-white p-5" key={label}>
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.68fr_0.32fr]">
          <div className="rounded-lg border border-line bg-white">
            <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <h2 className="text-lg font-semibold text-ink">Request terbaru</h2>
              <button className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink">
                <Filter size={16} />
                Filter
              </button>
            </div>
            <div className="divide-y divide-line">
              {sampleRequests.map((request) => (
                <article className="p-4 sm:p-5" key={request.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-muted">
                      {request.id}
                    </span>
                    <StatusBadge label={request.status} />
                    <span className="text-xs text-muted">
                      Client: {request.client}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-ink">
                    {request.title}
                  </h3>
                  <div className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-3">
                    <span>{request.category}</span>
                    <span>{request.budget}</span>
                    <span>Update {request.updated}</span>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white">
                      <ClipboardList size={16} />
                      Buat Offer
                    </button>
                    <button className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-4 text-sm font-semibold text-ink">
                      <MessageSquare size={16} />
                      Balas
                    </button>
                    <Link
                      className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-4 text-sm font-semibold text-ink"
                      href={`/admin/requests/${request.slug}`}
                    >
                      Detail
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="rounded-lg border border-line bg-white p-5">
              <h2 className="text-lg font-semibold text-ink">Status cepat</h2>
              <div className="mt-4 grid gap-2">
                {[
                  "submitted",
                  "reviewing",
                  "negotiating",
                  "waiting_payment",
                  "working",
                  "waiting_client",
                  "revision",
                  "done",
                  "cancelled"
                ].map((status) => (
                  <button
                    className="focus-ring h-10 rounded-lg border border-line px-3 text-left text-sm font-medium text-muted hover:border-ink hover:text-ink"
                    key={status}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-ink p-5 text-white">
              <h2 className="text-lg font-semibold">Offer template</h2>
              <p className="mt-3 text-sm leading-6 text-white/72">
                Harga, estimasi pengerjaan, scope, revisi, dan syarat
                pembayaran disiapkan dalam satu form agar nego lebih rapi.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
