import { requestStatuses } from "@/lib/data";

export function StatusBadge({ label }: { label: string }) {
  const match = requestStatuses.find((status) => status.label === label);

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        match?.color ?? "bg-line text-ink"
      }`}
    >
      {label}
    </span>
  );
}
