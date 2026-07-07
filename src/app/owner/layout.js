import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import "./dashboard-globals.css";
import OwnerSidebar from "@/components/owner-dashboard/OwnerSidebar";
import OwnerMobileHeader from "@/components/owner-dashboard/OwnerMobileHeader";

export default async function OwnerLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "owner") redirect("/");

  const { data: venues } = await supabase
    .from("venues")
    .select("id, name, status")
    .eq("owner_id", user.id);

  const hasApprovedVenue = venues?.some((v) => v.status === "approved");
  if (!hasApprovedVenue) redirect("/owner/pending-approval");

  return (
    <div className="tw-flex tw-min-h-screen tw-bg-slate-950 tw-relative" dir="rtl">
      <OwnerSidebar ownerName={profile?.name} />
      <div className="tw-flex-1 tw-flex tw-flex-col">
        <OwnerMobileHeader ownerName={profile?.name} />
        <main className="tw-flex-1 tw-p-4 lg:tw-p-8">{children}</main>
      </div>
    </div>
  );
}