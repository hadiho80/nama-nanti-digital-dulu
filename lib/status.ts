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
