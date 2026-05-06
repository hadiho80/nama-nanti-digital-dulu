export const requestStatusOptions = [
  "submitted",
  "reviewing",
  "negotiating",
  "waiting_approval",
  "approved",
  "waiting_payment",
  "working",
  "waiting_client",
  "revision",
  "waiting_final_payment",
  "done",
  "cancelled"
] as const;

export type RequestStatus = (typeof requestStatusOptions)[number];

export const statusLabels: Record<RequestStatus, string> = {
  submitted: "Baru masuk",
  reviewing: "Dicek dulu",
  negotiating: "Nego",
  waiting_approval: "Menunggu persetujuan",
  approved: "Disetujui",
  waiting_payment: "Menunggu pembayaran",
  working: "Dikerjakan",
  waiting_client: "Menunggu client",
  revision: "Revisi",
  waiting_final_payment: "Menunggu pelunasan",
  done: "Selesai",
  cancelled: "Dibatalkan"
};

export const statusColors: Record<RequestStatus, string> = {
  submitted: "bg-ocean/10 text-ocean",
  reviewing: "bg-sun/20 text-amber-800",
  negotiating: "bg-blush/10 text-rose-700",
  waiting_approval: "bg-purple-100 text-purple-700",
  approved: "bg-cyan-100 text-cyan-800",
  waiting_payment: "bg-amber-100 text-amber-800",
  working: "bg-mint/10 text-emerald-700",
  waiting_client: "bg-orange-100 text-orange-800",
  revision: "bg-indigo-100 text-indigo-700",
  waiting_final_payment: "bg-yellow-100 text-yellow-800",
  done: "bg-ink text-white",
  cancelled: "bg-line text-muted"
};

export const cancelableByClient: RequestStatus[] = [
  "submitted",
  "reviewing",
  "negotiating",
  "waiting_approval",
  "approved",
  "waiting_payment"
];

export function canClientCancel(status: string) {
  return cancelableByClient.includes(status as RequestStatus);
}

export function formatCurrency(value?: number | null) {
  if (!value) {
    return "Belum ada";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
