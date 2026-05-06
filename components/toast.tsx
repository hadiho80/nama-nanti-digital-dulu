"use client";

import { useEffect } from "react";

export type ToastTone = "success" | "error" | "info";

export function Toast({
  message,
  tone = "info",
  onClose
}: {
  message: string;
  tone?: ToastTone;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  const toneClass = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-800",
    info: "border-line bg-white text-ink"
  }[tone];

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-[70] rounded-lg border p-3 text-sm font-medium shadow-soft sm:bottom-auto sm:left-auto sm:right-5 sm:top-5 sm:max-w-sm ${toneClass}`}
      role="status"
    >
      {message}
    </div>
  );
}
