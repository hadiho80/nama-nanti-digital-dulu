import { type RequestStatus, statusColors } from "@/lib/status";

export function StatusBadge({ label }: { label: string }) {
  const color = statusColors[label as RequestStatus] ?? statusColors[labelToStatus(label)];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        color ?? "bg-line text-ink"
      }`}
    >
      {label}
    </span>
  );
}

function labelToStatus(label: string) {
  const map: Record<string, RequestStatus> = {
    "Baru masuk": "submitted",
    "Dicek dulu": "reviewing",
    Nego: "negotiating",
    "Menunggu persetujuan": "waiting_approval",
    Disetujui: "approved",
    "Menunggu pembayaran": "waiting_payment",
    Dikerjakan: "working",
    "Menunggu client": "waiting_client",
    Revisi: "revision",
    "Menunggu pelunasan": "waiting_final_payment",
    Selesai: "done",
    Dibatalkan: "cancelled"
  };

  return map[label];
}
