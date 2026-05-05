"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  MessageCircle,
  Paperclip,
  Plus,
  RefreshCw,
  Save,
  Send,
  UploadCloud,
  XCircle
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import {
  canClientCancel,
  formatCurrency,
  formatDateTime,
  type RequestStatus,
  requestStatusOptions,
  statusLabels
} from "@/lib/status";

type AnyRequest = Record<string, any>;
const DASHBOARD_POLL_MS = 15000;
const DETAIL_POLL_MS = 5000;

function categoryName(request: AnyRequest) {
  return request.service_categories?.name ?? "Lainnya";
}

function messageCount(request: AnyRequest) {
  return Array.isArray(request.messages) ? request.messages.length : 0;
}

function latestOffer(request: AnyRequest) {
  const offers = [...(request.offers ?? [])];
  return offers.sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime()
  )[0];
}

function statusLabel(status?: string | null) {
  return statusLabels[status as RequestStatus] ?? status ?? "-";
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }

  return data as T;
}

function useVisiblePolling(callback: () => void | Promise<void>, intervalMs: number, deps: unknown[]) {
  useEffect(() => {
    void callback();

    const tick = () => {
      if (document.visibilityState === "visible") {
        void callback();
      }
    };

    const timer = window.setInterval(tick, intervalMs);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void callback();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function ClientDashboardLive() {
  const [requests, setRequests] = useState<AnyRequest[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    try {
      const data = await fetchJson<{ requests: AnyRequest[] }>(
        "/api/client/requests"
      );
      setRequests(data.requests);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil request.");
    } finally {
      setIsLoading(false);
    }
  }

  useVisiblePolling(load, DASHBOARD_POLL_MS, []);

  const activeCount = requests.filter(
    (request) => !["done", "cancelled"].includes(request.status)
  ).length;
  const waitingCount = requests.filter((request) =>
    ["waiting_client", "waiting_approval", "waiting_payment"].includes(
      request.status
    )
  ).length;
  const doneCount = requests.filter((request) => request.status === "done").length;

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-mint">Dashboard client</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Request kamu</h1>
          <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted">
            <RefreshCw size={15} />
            Auto refresh tiap 15 detik saat tab aktif
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
          ["Request aktif", activeCount],
          ["Menunggu aksi", waitingCount],
          ["Selesai", doneCount]
        ].map(([label, value]) => (
          <div className="rounded-lg border border-line bg-white p-5" key={label}>
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
          </div>
        ))}
      </section>

      <RequestList
        basePath="/dashboard/requests"
        error={error}
        isLoading={isLoading}
        requests={requests}
        showClient={false}
      />
    </>
  );
}

export function AdminDashboardLive() {
  const [requests, setRequests] = useState<AnyRequest[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    try {
      const data = await fetchJson<{ requests: AnyRequest[] }>(
        "/api/admin/requests"
      );
      setRequests(data.requests);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil request.");
    } finally {
      setIsLoading(false);
    }
  }

  useVisiblePolling(load, DASHBOARD_POLL_MS, []);

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-mint">Admin solo</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">
            Kelola request masuk
          </h1>
          <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted">
            <RefreshCw size={15} />
            List request auto refresh tiap 15 detik saat tab aktif
          </p>
        </div>
        <Link
          className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white"
          href="/request"
        >
          <Plus size={18} />
          Input Manual
        </Link>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["Baru", requests.filter((item) => item.status === "submitted").length],
          ["Nego", requests.filter((item) => item.status === "negotiating").length],
          ["Working", requests.filter((item) => item.status === "working").length],
          [
            "Menunggu client",
            requests.filter((item) => item.status === "waiting_client").length
          ]
        ].map(([label, value]) => (
          <div className="rounded-lg border border-line bg-white p-5" key={label}>
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
          </div>
        ))}
      </section>

      <RequestList
        basePath="/admin/requests"
        error={error}
        isLoading={isLoading}
        requests={requests}
        showClient
      />
    </>
  );
}

function RequestList({
  requests,
  isLoading,
  error,
  basePath,
  showClient
}: {
  requests: AnyRequest[];
  isLoading: boolean;
  error: string;
  basePath: string;
  showClient: boolean;
}) {
  return (
    <section className="mt-6 rounded-lg border border-line bg-white">
      <div className="border-b border-line p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-ink">Daftar request</h2>
      </div>
      {error ? <p className="p-5 text-sm text-rose-700">{error}</p> : null}
      {isLoading ? <p className="p-5 text-sm text-muted">Memuat data...</p> : null}
      {!isLoading && requests.length === 0 ? (
        <p className="p-5 text-sm text-muted">Belum ada request.</p>
      ) : null}
      <div className="divide-y divide-line">
        {requests.map((request) => (
          <article
            className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center"
            key={request.id}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted">
                  {request.id.slice(0, 8)}
                </span>
                <StatusBadge label={statusLabel(request.status)} />
                {showClient ? (
                  <span className="text-xs text-muted">
                    Client: {request.contact_name ?? request.contact_email ?? "-"}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-ink">
                {request.title}
              </h3>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <FileText size={16} />
                  {categoryName(request)}
                </span>
                <span>
                  {request.budget_range || formatCurrency(request.budget_amount)}
                </span>
                <span>Update {formatDateTime(request.updated_at)}</span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle size={16} />
                  {messageCount(request)} pesan
                </span>
              </div>
            </div>
            <Link
              className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line px-4 text-sm font-semibold text-ink hover:border-ink"
              href={`${basePath}/${request.id}`}
            >
              Detail
              <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ClientRequestDetailLive({ id }: { id: string }) {
  return <RequestDetailLive id={id} mode="client" />;
}

export function AdminRequestDetailLive({ id }: { id: string }) {
  return <RequestDetailLive id={id} mode="admin" />;
}

function RequestDetailLive({ id, mode }: { id: string; mode: "client" | "admin" }) {
  const [request, setRequest] = useState<AnyRequest | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [offer, setOffer] = useState({
    price: "",
    estimatedDays: "",
    estimatedUnit: "hari",
    revisionCount: "1",
    scope: "",
    paymentTerms: ""
  });
  const [offerError, setOfferError] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const endpoint = mode === "admin" ? `/api/admin/requests/${id}` : `/api/client/requests/${id}`;

  async function load() {
    try {
      const data = await fetchJson<{ request: AnyRequest }>(endpoint);
      setRequest(data.request);
      setStatus(data.request.status);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil detail.");
    }
  }

  useVisiblePolling(load, DETAIL_POLL_MS, [id, mode]);

  const activeOffer = useMemo(() => (request ? latestOffer(request) : null), [request]);
  const messages = useMemo(
    () =>
      [...(request?.messages ?? [])].sort(
        (a, b) =>
          new Date(a.created_at ?? 0).getTime() -
          new Date(b.created_at ?? 0).getTime()
      ),
    [request]
  );
  const histories = useMemo(
    () =>
      [...(request?.status_history ?? [])].sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      ),
    [request]
  );

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    await fetchJson(
      `${mode === "admin" ? "/api/admin" : "/api/client"}/requests/${id}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: message })
      }
    );
    setMessage("");
    await load();
  }

  async function uploadFiles() {
    if (!files?.length) return;
    const data = new FormData();
    Array.from(files).forEach((file) => data.append("files", file));
    if (mode === "admin") data.set("fileKind", "deliverable");
    await fetchJson(`${mode === "admin" ? "/api/admin" : "/api/client"}/requests/${id}/files`, {
      method: "POST",
      body: data
    });
    setFiles(null);
    await load();
  }

  async function acceptOffer() {
    if (!activeOffer) return;
    await fetchJson(`/api/client/offers/${activeOffer.id}/accept`, {
      method: "POST"
    });
    await load();
  }

  async function cancelRequest() {
    const ok = window.confirm("Yakin ingin membatalkan request ini?");
    if (!ok) return;
    try {
      await fetchJson(`/api/client/requests/${id}/cancel`, { method: "POST" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request tidak bisa dibatalkan.");
    }
  }

  async function updateStatus(event: FormEvent) {
    event.preventDefault();
    await fetchJson(`/api/admin/requests/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note: statusNote })
    });
    setStatusNote("");
    await load();
  }

  async function createOffer(event: FormEvent) {
    event.preventDefault();
    setOfferError("");

    if (!offer.price || Number(offer.price) <= 0) {
      setOfferError("Harga penawaran wajib diisi dengan angka yang valid.");
      return;
    }

    if (!offer.estimatedDays || Number(offer.estimatedDays) <= 0) {
      setOfferError("Estimasi pengerjaan wajib diisi.");
      return;
    }

    if (!offer.scope.trim()) {
      setOfferError("Scope pekerjaan wajib diisi agar client paham penawarannya untuk apa.");
      return;
    }

    try {
      await fetchJson(`/api/admin/requests/${id}/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offer)
      });
      setOffer({
        price: "",
        estimatedDays: "",
        estimatedUnit: "hari",
        revisionCount: "1",
        scope: "",
        paymentTerms: ""
      });
      await load();
    } catch (err) {
      setOfferError(err instanceof Error ? err.message : "Offer gagal dikirim.");
    }
  }

  if (error && !request) {
    return <p className="rounded-lg border border-line bg-white p-5 text-sm text-rose-700">{error}</p>;
  }

  if (!request) {
    return <p className="rounded-lg border border-line bg-white p-5 text-sm text-muted">Memuat detail request...</p>;
  }

  const clientCanCancel = mode === "client" && canClientCancel(request.status);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.64fr_0.36fr]">
      <section className="grid gap-5">
        <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted">{request.id.slice(0, 8)}</span>
            <StatusBadge label={statusLabel(request.status)} />
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-ink">{request.title}</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{request.description}</p>
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <InfoBox label="Kategori" value={categoryName(request)} />
            <InfoBox label="Budget" value={request.budget_range || formatCurrency(request.budget_amount)} />
            <InfoBox label="Deadline" value={request.expected_deadline ?? "-"} />
          </div>
          {mode === "client" ? (
            <div className="mt-5 rounded-lg bg-paper p-4 text-sm leading-6 text-muted">
              Detail pembayaran manual/DP akan dikirim oleh admin lewat WhatsApp atau thread request ini.
            </div>
          ) : null}
        </article>

        <article className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-lg font-semibold text-ink">Thread</h2>
          <div className="mt-4 grid max-h-[460px] gap-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <p className="text-sm text-muted">Belum ada pesan.</p>
            ) : null}
            {messages.map((item) => (
              <div className="rounded-lg bg-paper p-3 text-sm leading-6 text-muted" key={item.id}>
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-ink">
                    {item.sender?.full_name ?? item.sender?.email ?? "User"}
                  </span>
                  <span>{formatDateTime(item.created_at)}</span>
                </div>
                {item.body}
              </div>
            ))}
          </div>
          <form className="mt-4 flex gap-2" onSubmit={sendMessage}>
            <input
              className="focus-ring h-11 min-w-0 flex-1 rounded-lg border border-line px-3 text-sm"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tulis balasan..."
              type="text"
              value={message}
            />
            <button className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ink text-white" type="submit">
              <Send size={18} />
            </button>
          </form>
        </article>
      </section>

      <aside className="grid gap-5">
        <article className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-lg font-semibold text-ink">Penawaran</h2>
          {activeOffer ? (
            <>
              <p className="mt-4 text-sm text-muted">Total</p>
              <p className="mt-1 text-3xl font-semibold text-ink">{formatCurrency(activeOffer.price)}</p>
              <p className="mt-4 text-sm leading-6 text-muted">{activeOffer.scope}</p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted">
                <CalendarDays size={16} />
                Estimasi {activeOffer.estimated_days ?? "-"}{" "}
                {activeOffer.estimated_unit ?? "hari"}
              </p>
              <p className="mt-2 text-sm text-muted">Status offer: {activeOffer.status}</p>
              {mode === "client" && activeOffer.status === "sent" ? (
                <div className="mt-5 grid gap-2">
                  <button className="focus-ring h-11 rounded-lg bg-ink text-sm font-semibold text-white" onClick={acceptOffer} type="button">
                    Setuju dan lanjut pembayaran
                  </button>
                  <p className="text-xs leading-5 text-muted">
                    Kalau masih ingin nego, balas lewat thread.
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">Belum ada penawaran.</p>
          )}
        </article>

        {mode === "admin" ? (
          <>
            <form className="rounded-lg border border-line bg-white p-5" onSubmit={updateStatus}>
              <h2 className="text-lg font-semibold text-ink">Update status</h2>
              <select className="focus-ring mt-4 h-11 w-full rounded-lg border border-line px-3 text-sm" onChange={(event) => setStatus(event.target.value)} value={status}>
                {requestStatusOptions.map((item) => (
                  <option key={item} value={item}>{statusLabels[item]}</option>
                ))}
              </select>
              <textarea className="focus-ring mt-3 min-h-20 w-full rounded-lg border border-line p-3 text-sm" onChange={(event) => setStatusNote(event.target.value)} placeholder="Catatan status" value={statusNote} />
              <button className="focus-ring mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-semibold text-white" type="submit">
                <Save size={17} />
                Simpan Status
              </button>
            </form>

            <form className="rounded-lg border border-line bg-white p-5" onSubmit={createOffer}>
              <h2 className="text-lg font-semibold text-ink">Buat offer</h2>
              <div className="mt-4 grid gap-3">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Harga penawaran (Rp)
                  <input className="focus-ring h-11 rounded-lg border border-line px-3 text-sm" onChange={(event) => setOffer((current) => ({ ...current, price: event.target.value }))} placeholder="Contoh: 1000000" type="number" value={offer.price} />
                </label>
                <div className="grid gap-3 sm:grid-cols-[1fr_0.8fr]">
                  <label className="grid gap-2 text-sm font-medium text-ink">
                    Estimasi pengerjaan
                    <input className="focus-ring h-11 rounded-lg border border-line px-3 text-sm" onChange={(event) => setOffer((current) => ({ ...current, estimatedDays: event.target.value }))} placeholder="Contoh: 1" type="number" value={offer.estimatedDays} />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-ink">
                    Satuan
                    <select className="focus-ring h-11 rounded-lg border border-line px-3 text-sm" onChange={(event) => setOffer((current) => ({ ...current, estimatedUnit: event.target.value }))} value={offer.estimatedUnit}>
                      <option value="hari">Hari</option>
                      <option value="minggu">Minggu</option>
                      <option value="bulan">Bulan</option>
                      <option value="tahun">Tahun</option>
                    </select>
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Jumlah revisi
                  <input className="focus-ring h-11 rounded-lg border border-line px-3 text-sm" onChange={(event) => setOffer((current) => ({ ...current, revisionCount: event.target.value }))} placeholder="Contoh: 1" type="number" value={offer.revisionCount} />
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Scope pekerjaan
                  <textarea className="focus-ring min-h-24 rounded-lg border border-line p-3 text-sm" onChange={(event) => setOffer((current) => ({ ...current, scope: event.target.value }))} placeholder="Contoh: landing page 5 section, form WhatsApp, upload ke Vercel, revisi minor." value={offer.scope} />
                </label>
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Syarat pembayaran manual/DP
                  <textarea className="focus-ring min-h-20 rounded-lg border border-line p-3 text-sm" onChange={(event) => setOffer((current) => ({ ...current, paymentTerms: event.target.value }))} placeholder="Contoh: DP 50% sebelum pengerjaan, pelunasan setelah preview disetujui." value={offer.paymentTerms} />
                </label>
                {offerError ? (
                  <p className="rounded-lg bg-rose-50 p-3 text-sm leading-6 text-rose-700">
                    {offerError}
                  </p>
                ) : null}
                <button className="focus-ring h-11 rounded-lg bg-mint text-sm font-semibold text-white" type="submit">
                  Kirim Offer
                </button>
              </div>
            </form>
          </>
        ) : (
          <article className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-lg font-semibold text-ink">Pembatalan</h2>
            {clientCanCancel ? (
              <button className="focus-ring mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-rose-200 text-sm font-semibold text-rose-700" onClick={cancelRequest} type="button">
                <XCircle size={17} />
                Batalkan request
              </button>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted">
                Request sudah masuk tahap pengerjaan/pembayaran. Pembatalan hanya bisa lewat admin.
              </p>
            )}
          </article>
        )}

        <article className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-lg font-semibold text-ink">File</h2>
          <div className="mt-4 grid gap-2">
            {(request.request_files ?? []).length === 0 ? <p className="text-sm text-muted">Belum ada file.</p> : null}
            {(request.request_files ?? []).map((file: AnyRequest) => (
              <a className="focus-ring flex h-10 items-center justify-between rounded-lg border border-line px-3 text-sm text-muted" href={`/api/files/${file.id}`} key={file.id} target="_blank">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <Paperclip size={16} />
                  <span className="truncate">{file.file_name}</span>
                </span>
                <span className="text-xs">{file.file_kind}</span>
              </a>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            <input className="text-sm" multiple onChange={(event) => setFiles(event.target.files)} type="file" />
            <button className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line text-sm font-semibold text-ink" onClick={uploadFiles} type="button">
              <UploadCloud size={16} />
              Upload file
            </button>
          </div>
        </article>

        <article className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-lg font-semibold text-ink">Riwayat status</h2>
          <div className="mt-4 grid gap-3">
            {histories.length === 0 ? <p className="text-sm text-muted">Belum ada riwayat.</p> : null}
            {histories.map((item) => (
              <div className="rounded-lg bg-paper p-3 text-sm leading-6 text-muted" key={item.id}>
                <p className="font-semibold text-ink">
                  {statusLabel(item.from_status) === "-" ? "Awal" : statusLabel(item.from_status)}{" "}
                  {"->"} {statusLabel(item.to_status)}
                </p>
                <p>{item.note}</p>
                <p className="text-xs">
                  {formatDateTime(item.created_at)} oleh {item.changed_by_profile?.full_name ?? item.changed_by_profile?.email ?? "-"}
                </p>
              </div>
            ))}
          </div>
        </article>

        {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      </aside>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paper p-3">
      <p className="text-muted">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  );
}
