import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquareText,
  MousePointerClick,
  ShieldCheck,
  UploadCloud
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { PublicContact } from "@/components/public-contact";
import { portfolioSamples, services } from "@/lib/data";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="border-b border-line">
        <div className="mx-auto grid w-full max-w-6xl gap-7 px-4 py-8 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted sm:mb-4 sm:text-sm">
              Working brand: Nama Nanti, Digital Dulu
            </p>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-ink sm:text-5xl lg:text-6xl">
              Request kerja digital, nanti kami bantu beresin.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:mt-5 sm:text-lg sm:leading-8">
              Web, aplikasi kecil, Excel, Word, PowerPoint, automation, sampai
              dashboard sederhana. Ceritakan kebutuhanmu, tulis budget awal,
              lalu pantau progress dari dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:gap-3">
              <Link
                className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-white transition hover:bg-black sm:h-12"
                href="/request"
              >
                Kirim Request
                <ArrowRight size={18} />
              </Link>
              <Link
                className="focus-ring inline-flex h-11 items-center justify-center rounded-lg border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-ink sm:h-12"
                href="#contoh"
              >
                Lihat Contoh
              </Link>
            </div>
            <div className="mt-5 grid gap-2 text-sm text-muted sm:mt-8 sm:grid-cols-3 sm:gap-3">
              {["Budget bisa nego", "File bisa upload", "Cocok dari HP"].map(
                (item) => (
                  <div className="flex items-center gap-2" key={item}>
                    <CheckCircle2 className="text-mint" size={18} />
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-[8px] border border-line bg-white p-3 shadow-soft sm:p-4">
            <div className="rounded-[8px] bg-[#eef7f4] p-3 sm:p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-mint">
                    Request masuk
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-ink sm:text-lg">
                    Landing page katalog snack
                  </h2>
                </div>
                <span className="rounded-full bg-mint/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Nego
                </span>
              </div>
              <div className="grid gap-3">
                {[
                  ["Kategori", "Web"],
                  ["Budget awal", "Rp500rb - Rp1jt"],
                  ["Deadline", "2 minggu"],
                  ["File", "logo.png, katalog.xlsx"]
                ].map(([label, value]) => (
                  <div
                    className="flex items-center justify-between rounded-lg bg-white px-3 py-3 text-sm"
                    key={label}
                  >
                    <span className="text-muted">{label}</span>
                    <span className="font-semibold text-ink">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-ink p-4 text-white">
                <p className="text-xs text-white/70">Penawaran admin</p>
                <p className="mt-1 text-xl font-semibold">Rp850.000</p>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  Scope: landing page 5 section, form WhatsApp, revisi 2x,
                  estimasi 5-7 hari.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="layanan" className="border-b border-line bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-mint">Layanan</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
              Kebutuhan kecil sampai MVP ringan bisa masuk dulu.
            </h2>
          </div>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  className="rounded-lg border border-line bg-paper p-4 sm:p-5"
                  key={service.name}
                >
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-white text-mint">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-ink">
                    {service.name}
                  </h3>
                  <p className="mt-2 min-h-14 text-sm leading-6 text-muted">
                    {service.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.examples.map((example) => (
                      <span
                        className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-muted"
                        key={example}
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-3">
          {[
            {
              icon: MousePointerClick,
              title: "Isi request dulu",
              body: "Client dari bio link bisa cerita kebutuhan, pilih kategori, tulis budget, dan upload file."
            },
            {
              icon: MessageSquareText,
              title: "Nego di thread",
              body: "Admin memberi penawaran berisi harga, scope, estimasi, revisi, dan syarat pembayaran."
            },
            {
              icon: ShieldCheck,
              title: "Pantau progress",
              body: "Status request, file, pesan, dan riwayat kerja tetap rapi dalam satu dashboard."
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-mint/10 text-mint">
                  <Icon size={23} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted">{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="contoh" className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-mint">Contoh dummy</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
                Contoh hasil yang bisa ditawarkan.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted">
              Portfolio ini dummy dulu untuk menunjukkan jenis pekerjaan. Nanti
              bisa diganti dengan case study client asli setelah ada izin.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3">
            {portfolioSamples.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  className="overflow-hidden rounded-lg border border-line"
                  key={item.title}
                >
                  <div className="grid aspect-[16/10] place-items-center bg-[#e9f3ff]">
                    <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white text-ocean shadow-soft">
                      <Icon size={34} />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase text-muted">
                      {item.category}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{item.metric}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="mx-auto grid w-full max-w-6xl gap-3 px-4 py-8 sm:grid-cols-4 sm:px-6 sm:py-10">
          {[
            ["Untuk UMKM", "Cocok untuk kebutuhan kecil yang harus cepat rapi."],
            ["Untuk Mahasiswa", "Bantu dokumen, presentasi, data, dan tools ringan."],
            ["Budget Nego", "Client bisa tulis budget awal dan diskusi scope."],
            ["Progress Jelas", "Status, chat, file, dan offer tersimpan di dashboard."]
          ].map(([title, body]) => (
            <article className="rounded-lg border border-line bg-white p-4" key={title}>
              <h3 className="text-sm font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-ink text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Punya request digital yang masih berantakan?
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Tulis dulu kebutuhannya. Budget, scope, dan timeline bisa dibahas
              setelah request masuk.
            </p>
          </div>
          <Link
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-ink"
            href="/request"
          >
            <UploadCloud size={18} />
            Mulai Request
          </Link>
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-semibold text-ink">Nama Nanti, Digital Dulu</p>
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-ink" href="/auth">
              Cek Progress
            </Link>
            <Link className="hover:text-ink" href="/request">
              Kirim Request
            </Link>
            <Link className="hover:text-ink" href="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-ink" href="/terms">
              Terms
            </Link>
            <PublicContact compact />
          </div>
        </div>
      </footer>
    </main>
  );
}
