import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  MessageSquare,
  Paperclip,
  Send
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { getSampleRequest } from "@/lib/data";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ClientRequestDetailPage({
  params
}: DetailPageProps) {
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
          href="/dashboard"
        >
          <ArrowLeft size={17} />
          Dashboard
        </Link>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.68fr_0.32fr]">
          <section className="grid gap-5">
            <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted">
                  {request.id}
                </span>
                <StatusBadge label={request.status} />
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
                  <p className="text-muted">Budget awal</p>
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
              <h2 className="text-lg font-semibold text-ink">
                Thread dengan worker
              </h2>
              <div className="mt-4 grid gap-3">
                <div className="max-w-[86%] rounded-lg bg-paper p-3 text-sm leading-6 text-muted">
                  Halo, request sudah kami terima. Kami cek dulu scope dan file
                  pendukungnya.
                </div>
                <div className="ml-auto max-w-[86%] rounded-lg bg-ink p-3 text-sm leading-6 text-white">
                  Oke, saya tunggu. Budget masih bisa nego kalau scopenya
                  jelas.
                </div>
                <div className="max-w-[86%] rounded-lg bg-paper p-3 text-sm leading-6 text-muted">
                  Siap. Kami kirim penawaran awal di panel sebelah.
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  className="focus-ring h-11 min-w-0 flex-1 rounded-lg border border-line px-3 text-sm"
                  placeholder="Tulis balasan..."
                  type="text"
                />
                <button className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ink text-white">
                  <Send size={18} />
                </button>
              </div>
            </article>
          </section>

          <aside className="grid gap-5">
            <article className="rounded-lg border border-line bg-white p-5">
              <h2 className="text-lg font-semibold text-ink">Penawaran</h2>
              <p className="mt-4 text-sm text-muted">Total</p>
              <p className="mt-1 text-3xl font-semibold text-ink">
                {request.offer.price}
              </p>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-muted">
                <p>{request.offer.scope}</p>
                <p className="inline-flex items-center gap-2">
                  <CalendarDays size={16} />
                  Estimasi {request.offer.estimate}
                </p>
                <p>{request.offer.revisions}</p>
              </div>
              <div className="mt-5 grid gap-2">
                <button className="focus-ring h-11 rounded-lg bg-ink text-sm font-semibold text-white">
                  Setuju
                </button>
                <button className="focus-ring h-11 rounded-lg border border-line text-sm font-semibold text-ink">
                  Nego dulu
                </button>
              </div>
            </article>

            <article className="rounded-lg border border-line bg-white p-5">
              <h2 className="text-lg font-semibold text-ink">File</h2>
              <div className="mt-4 grid gap-2">
                {request.files.map((file) => (
                  <button
                    className="focus-ring flex h-11 items-center justify-between rounded-lg border border-line px-3 text-sm text-muted"
                    key={file}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Paperclip size={16} />
                      {file}
                    </span>
                    <Download size={16} />
                  </button>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </div>
    </main>
  );
}
