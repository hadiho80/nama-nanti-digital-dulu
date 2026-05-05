import {
  AppWindow,
  Bot,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  MonitorCog,
  Palette,
  Smartphone
} from "lucide-react";

export const services = [
  {
    name: "Web",
    slug: "web",
    icon: LayoutDashboard,
    description: "Landing page, company profile, katalog, toko online sederhana.",
    examples: ["Landing page UMKM", "Dashboard admin", "Bug fixing website"]
  },
  {
    name: "Mobile Apps",
    slug: "mobile-apps",
    icon: Smartphone,
    description: "Prototype app, aplikasi Android sederhana, UI mobile, integrasi API.",
    examples: ["Prototype MVP", "Form order mobile", "Perbaikan UI app"]
  },
  {
    name: "Desktop Apps",
    slug: "desktop-apps",
    icon: MonitorCog,
    description: "Tools lokal untuk input data, stok, kasir kecil, dan automation.",
    examples: ["Tools inventory", "Kasir sederhana", "Input data offline"]
  },
  {
    name: "Dokumen & Office",
    slug: "office",
    icon: FileText,
    description: "Word, Excel, PowerPoint, PDF, template, dan dokumen kerja.",
    examples: ["PPT presentasi", "Rapikan Word", "Excel formula"]
  },
  {
    name: "Automation & Data",
    slug: "automation-data",
    icon: Bot,
    description: "Google Sheets, scraping sederhana, auto laporan, dan data cleaning.",
    examples: ["Auto laporan", "Data cleaning", "Google Sheets workflow"]
  },
  {
    name: "Desain Ringan",
    slug: "desain-digital",
    icon: Palette,
    description: "Banner, poster, asset presentasi, dan UI mockup sederhana.",
    examples: ["Banner promo", "Poster digital", "Mockup tampilan"]
  }
];

export const requestStatuses = [
  { label: "Baru masuk", value: "submitted", color: "bg-ocean/10 text-ocean" },
  { label: "Dicek dulu", value: "reviewing", color: "bg-sun/20 text-amber-800" },
  { label: "Nego", value: "negotiating", color: "bg-blush/10 text-rose-700" },
  { label: "Dikerjakan", value: "working", color: "bg-mint/10 text-emerald-700" },
  { label: "Selesai", value: "done", color: "bg-ink text-white" }
];

export const sampleRequests = [
  {
    id: "REQ-1042",
    slug: "req-1042",
    title: "Landing page untuk katalog snack rumahan",
    category: "Web",
    budget: "Rp500rb - Rp1jt",
    status: "Dikerjakan",
    client: "Rina",
    updated: "Hari ini",
    messages: 5,
    description:
      "Client butuh landing page sederhana untuk katalog snack rumahan, berisi hero, produk unggulan, testimoni dummy, dan tombol WhatsApp.",
    deadline: "2 minggu",
    files: ["logo.png", "katalog.xlsx"],
    offer: {
      price: "Rp850.000",
      scope: "Landing page 5 section, form WhatsApp, katalog produk, revisi 2x.",
      estimate: "5-7 hari",
      revisions: "2x revisi"
    }
  },
  {
    id: "REQ-1041",
    slug: "req-1041",
    title: "Rapikan PPT sidang dan bikin template konsisten",
    category: "Dokumen & Office",
    budget: "< Rp500rb",
    status: "Nego",
    client: "Fajar",
    updated: "Kemarin",
    messages: 3,
    description:
      "Rapikan deck presentasi sidang agar struktur, warna, spacing, dan visual lebih konsisten tanpa mengubah isi utama.",
    deadline: "4 hari",
    files: ["draft-sidang.pptx", "logo-kampus.png"],
    offer: {
      price: "Rp250.000",
      scope: "Rapikan 20-25 slide, template konsisten, revisi minor 1x.",
      estimate: "2-3 hari",
      revisions: "1x revisi"
    }
  },
  {
    id: "REQ-1040",
    slug: "req-1040",
    title: "Excel stok barang dengan rumus otomatis",
    category: "Automation & Data",
    budget: "Rp500rb - Rp1jt",
    status: "Dicek dulu",
    client: "Toko Sinar",
    updated: "2 hari lalu",
    messages: 2,
    description:
      "Toko ingin file Excel stok barang yang bisa menghitung stok masuk, stok keluar, sisa stok, dan warning barang menipis.",
    deadline: "1 minggu",
    files: ["contoh-stok.xlsx"],
    offer: {
      price: "Belum dikirim",
      scope: "Admin masih cek struktur file dan alur stok yang dibutuhkan.",
      estimate: "Menunggu review",
      revisions: "Belum ditentukan"
    }
  }
];

export function getSampleRequest(slug: string) {
  return sampleRequests.find((request) => request.slug === slug);
}

export const portfolioSamples = [
  {
    title: "Dashboard stok sederhana",
    category: "Excel + dashboard",
    metric: "Input stok lebih rapi",
    icon: FileSpreadsheet
  },
  {
    title: "Landing page UMKM",
    category: "Web",
    metric: "Siap dipasang di bio",
    icon: AppWindow
  },
  {
    title: "Deck presentasi",
    category: "PowerPoint",
    metric: "Struktur lebih jelas",
    icon: FileText
  }
];
