import { redirect } from "next/navigation";
import { AdminSettingsForm } from "@/components/admin-settings-form";
import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminSettingsPage() {
  let target: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      target = "/auth?next=/admin/settings";
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        target = "/dashboard";
      }
    }
  } catch {
    target = "/dashboard";
  }

  if (target) redirect(target);

  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold text-mint">Admin</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Atur kontak publik, pola password, privacy, dan terms.
        </p>
        <AdminSettingsForm />
      </div>
    </main>
  );
}
