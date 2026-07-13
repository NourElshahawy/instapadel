import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import "@/styles/pages/owner-dashboard.css";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminMobileHeader from "@/components/admin-dashboard/AdminMobileHeader";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role, name").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="owner-shell" dir="rtl">
      <AdminSidebar adminName={profile?.name} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminMobileHeader adminName={profile?.name} />
        <div className="owner-content">
          <div className="owner-content-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}