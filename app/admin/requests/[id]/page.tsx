import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminRequestDetailLive } from "@/components/request-live";
import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminRequestDetailPage({ params }: PageProps) {
  const { id } = await params;
  let target: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      target = `/auth?next=/admin/requests/${id}`;
    }

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role !== "admin" && profile?.role !== "worker") {
        target = "/dashboard";
      }
    }
  } catch {
    target = "/dashboard";
  }

  if (target) {
    redirect(target);
  }

  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"
          href="/admin"
        >
          <ArrowLeft size={17} />
          Admin
        </Link>
        <AdminRequestDetailLive id={id} />
      </div>
    </main>
  );
}
