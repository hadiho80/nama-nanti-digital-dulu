import { LegalContent } from "@/components/legal-content";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold text-mint">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Privacy Policy</h1>
        <LegalContent type="privacy" />
      </div>
    </main>
  );
}
