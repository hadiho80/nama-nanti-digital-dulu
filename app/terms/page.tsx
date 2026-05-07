import { LegalContent } from "@/components/legal-content";
import { SiteHeader } from "@/components/site-header";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold text-mint">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Terms of Service</h1>
        <LegalContent type="terms" />
      </div>
    </main>
  );
}
