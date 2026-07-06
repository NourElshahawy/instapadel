import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "طلبك قيد المراجعة — InstaPadel" };

export default async function PendingApprovalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: venue } = await supabase.from("venues").select("name, status").eq("owner_id", user.id).single();

  if (venue?.status === "approved") redirect("/owner/dashboard");

  return (
    <div className="auth-shell" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="auth-card" style={{ textAlign: "center" }}>
        <i className="fa-solid fa-clock" style={{ fontSize: 48, color: "var(--accent)" }}></i>
        <h1 style={{ marginTop: 16 }}>طلبك قيد المراجعة</h1>
        <p className="auth-sub">فريقنا بيراجع بيانات `{venue?.name}` دلوقتي، وهيوصلك إيميل أول ما يتم قبول ملعبك على InstaPadel — عادةً خلال 24 ساعة.</p>
        <Link href="/" className="btn btn-ghost btn-block" style={{ marginTop: 20 }}>
          رجوع للرئيسية
        </Link>
      </div>
    </div>
  );
}
