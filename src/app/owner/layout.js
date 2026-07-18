import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import "@/styles/pages/owner-dashboard.css";
import OwnerSidebar from "@/components/owner-dashboard/OwnerSidebar";
import OwnerMobileHeader from "@/components/owner-dashboard/OwnerMobileHeader";

export default async function OwnerLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role, name, avatar_url").eq("id", user.id).single();
  if (profile?.role !== "owner") redirect("/");

  const { data: venues } = await supabase.from("venues").select("id, status").eq("owner_id", user.id);

  const hasApprovedVenue = venues?.some((v) => v.status === "approved");
  const allRejected = venues?.length > 0 && venues.every((v) => v.status === "rejected");

  if (allRejected) redirect("/owner/rejected");
  if (!hasApprovedVenue) redirect("/owner/pending-approval");

  return (
    <div className="owner-shell" dir="rtl">
      <OwnerSidebar ownerName={profile?.name} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <OwnerMobileHeader ownerName={profile?.name} />
        <div className="owner-content">
          <div className="owner-content-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}