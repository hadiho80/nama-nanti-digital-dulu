import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ClipboardCheck,
  History,
  MessageSquare,
  Paperclip,
  Save
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { getSampleRequest } from "@/lib/data";

type AdminDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const statusOptions = [
  "submitted",
  "reviewing",
  "negotiating",
  "waiting_approval",
  "waiting_payment",
  "working",
  "waiting_client",
  "revision",
  "waiting_final_payment",
  "done",
  "cancelled"
];

export default async function AdminRequestDetailPage({
  params
}: AdminDetailPageProps) {
  const { slug } = await params;
  const request = getSampleRequest(slug);

  if (!request) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"
          href="/admin"
        >
          <ArrowLeft size={17} />
          Admin
        </Link>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.62fr_0.38fr]">
          <section className="grid gap-5">
            <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted">
                  {request.id}
                </span>
                <StatusBadge label={request.status} />
                <span className="text-xs text-muted">
                  Client: {request.client}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-ink">
                {request.title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted">
                {request.description}
              </p>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-lg bg-paper p-3">
                  <p className="text-muted">Kategori</p>
                  <p className="mt-1 font-semibold text-ink">
                    {request.category}
                  </p>
                </div>
                <div className="rounded-lg bg-paper p-3">
                  <p className="text-muted">Budget</p>
                  <p className="mt-1 font-semibold text-ink">
                    {request.budget}
                  </p>
                </div>
                <div className="rounded-lg bg-paper p-3">
                  <p className="text-muted">Deadline</p>
                  <p className="mt-1 font-semibold text-ink">
                    {request.deadline}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-lg border border-line bg-white p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <MessageSquare size={19} />
                Thread client
              </h2>
              <div className="mt-4 grid gap-3">
                <div className="max-w-[88%] rounded-lg bg-paper p-3 text-sm leading-6 text-muted">
                  Saya butuh dibuatkan secepatnya, tapi budget masih bisa
                  dibahas.
                </div>
                <div className="ml-auto max-w-[88%] rounded-lg bg-ink p-3 text-sm leading-6 text-white">
                  Siap, kami kirim penawaran dengan scope yang jelas dulu.
                </div>
              </div>
              <textarea
                className="focus-ring mt-4 min-h-24 w-full rounded-lg border border-line p-3 text-sm leading-6"
                placeholder="Balas client..."
              />
              <button className="focus-ring mt-3 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white">
                <Save size={17} />
                Kirim Balasan
              </button>
            </article>
          </section>

          <aside className="grid gap-5">
            <article className="rounded-lg border border-line bg-white p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <ClipboardCheck size={19} />
                Update request
              </h2>
              <label className="mt-4 grid gap-2 text-sm font-medium text-ink">
                Status
                <select className="focus-ring h-11 rounded-lg border border-line px-3 text-sm">
                  {statusOptions.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className="mt-4 grid gap-2 text-sm font-medium text-ink">
                Catatan internal
                <textarea
                  className="focus-ring min-h-24 rounded-lg border border-line p-3 text-sm leading-6"
                  placeholder="Catatan hanya untuk admin/worker."
                />
              </label>
              <button className="focus-ring mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-semibold text-white">
                <Save size={17} />
                Simpan Update
              </button>
            </article>

            <article className="rounded-lg border border-line bg-white p-5">
              <h2 className="text-lg font-semibold text-ink">Buat offer</h2>
              <div className="mt-4 grid gap-3">
                <input
                  className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
                  placeholder="Harga, contoh: 850000"
                  type="number"
                />
                <input
                  className="focus-ring h-11 rounded-lg border border-line px-3 text-sm"
                  placeholder="Estimasi, contoh: 5-7 hari"
                  type="text"
                />
                <textarea
                  className="focus-ring min-h-28 rounded-lg border border-line p-3 text-sm leading-6"
                  placeholder="Scope pekerjaan, jumlah revisi, dan syarat pembayaran."
                />
                <button className="focus-ring h-11 rounded-lg bg-mint text-sm font-semibold text-white">
                  Kirim Offer
                </button>
              </div>
            </article>

            <article className="rounded-lg border border-line bg-white p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <Paperclip size={19} />
                File client
              </h2>
              <div className="mt-4 grid gap-2">
                {request.files.map((file) => (
                  <button
                    className="focus-ring h-10 rounded-lg border border-line px-3 text-left text-sm text-muted"
                    key={file}
                  >
                    {file}
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-line bg-white p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <History size={19} />
                Riwayat
              </h2>
              <div className="mt-4 grid gap-3 text-sm text-muted">
                <p>Request dibuat dari website.</p>
                <p>Status berubah ke reviewing.</p>
                <p>Offer pertama disiapkan admin.</p>
              </div>
            </article>
          </aside>
        </div>
      </div>
    </main>
  );
}
