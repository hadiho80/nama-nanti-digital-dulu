import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ClientRequestDetailLive } from "@/components/request-live";
import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientRequestDetailPage({ params }: PageProps) {
  const { id } = await params;
  let shouldRedirect = false;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      shouldRedirect = true;
    }
  } catch {
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    redirect(`/auth?next=/dashboard/requests/${id}`);
  }

  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"
          href="/dashboard"
        >
          <ArrowLeft size={17} />
          Dashboard
        </Link>
        <ClientRequestDetailLive id={id} />
      </div>
    </main>
  );
}
