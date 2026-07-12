import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import "@/styles/pages/owner-dashboard.css";
import Link from "next/link";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role, name").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="owner-shell" dir="rtl">
      <aside className="owner-sidebar">
        <div>
          <p className="owner-sidebar-greeting">مرحبًا</p>
          <p className="owner-sidebar-name">{profile?.name} (أدمن)</p>
        </div>
        <nav className="owner-nav">
          <a href="/admin/dashboard" className="owner-nav-link is-active">
            🏟️ موافقة الملاعب
          </a>
          <a href="/admin/dashboard/news" className="owner-nav-link">
            📰 الأخبار
          </a>
        </nav>
        <Link href="/" className="owner-sidebar-back">
          ← رجوع للموقع
        </Link>
      </aside>
      <div style={{ flex: 1 }}>
        <div className="owner-content">
          <div className="owner-content-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
