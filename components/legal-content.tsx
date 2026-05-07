"use client";

import { useEffect, useState } from "react";

const defaults = {
  privacy: `Kami mengumpulkan data yang kamu kirim melalui form request, termasuk nama, email, nomor WhatsApp, deskripsi kebutuhan, budget awal, chat, dan file pendukung. Data ini digunakan untuk memahami request, memberi penawaran, mengerjakan project, dan menghubungi kamu terkait progress pekerjaan.

File yang kamu upload hanya digunakan untuk kebutuhan request terkait. Jangan upload data sensitif yang tidak diperlukan. Kami tidak menjual data pribadi kamu ke pihak lain.

Karena pembayaran awal masih manual, detail transaksi dapat dilakukan melalui WhatsApp atau kanal komunikasi yang disepakati. Untuk pertanyaan penghapusan data atau koreksi data, hubungi kontak resmi yang tersedia di website.`,
  terms: `Dengan menggunakan layanan ini, kamu setuju bahwa request yang dikirim akan direview terlebih dahulu sebelum ada kesepakatan pekerjaan. Harga, scope, deadline, revisi, dan syarat pembayaran ditentukan melalui penawaran admin/worker.

Client dapat membatalkan request sebelum masuk tahap pengerjaan atau pembayaran. Jika pekerjaan sudah berjalan, pembatalan perlu dibahas dengan admin.

File, brief, dan materi yang dikirim client harus memiliki izin penggunaan yang sah. Kami berhak menolak request yang melanggar hukum, merugikan pihak lain, atau berada di luar kemampuan layanan.

Pembayaran saat ini dilakukan manual melalui instruksi admin. Jangan melakukan pembayaran sebelum penawaran dan instruksi pembayaran jelas.`
};

export function LegalContent({ type }: { type: "privacy" | "terms" }) {
  const [content, setContent] = useState(defaults[type]);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/site-settings");
        const data = await response.json();
        const custom = data.content?.[type];
        if (custom?.trim()) setContent(custom);
      } catch {
        setContent(defaults[type]);
      }
    }

    void load();
  }, [type]);

  return (
    <div className="mt-6 grid gap-4 rounded-lg border border-line bg-white p-5 text-sm leading-7 text-muted shadow-soft">
      {content.split("\n").filter(Boolean).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
