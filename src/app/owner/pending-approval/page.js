import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "طلبك قيد المراجعة — InstaPadel" };

export default async function PendingApprovalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: venues } = await supabase
    .from("venues")
    .select("name, status")
    .eq("owner_id", user.id);

  const hasApproved = venues?.some((v) => v.status === "approved");
  if (hasApproved) redirect("/owner/dashboard");

  const venueNames = venues?.map((v) => v.name).join("، ") || "ملعبك";

  return (
    <div className="auth-shell" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="auth-card" style={{ textAlign: "center" }}>
        <span className="material-symbols-rounded" style={{ fontSize: 48, color: "var(--accent)" }}>schedule</span>
        <h1 style={{ marginTop: 16 }}>طلبك قيد المراجعة</h1>
        <p className="auth-sub">
          فريقنا بيراجع بيانات {venueNames} دلوقتي، وهيوصلك إيميل أول ما يتم قبول ملعبك على InstaPadel — عادةً خلال 24 ساعة.
        </p>
        <Link href="/" className="btn btn-ghost btn-block" style={{ marginTop: 20 }}>رجوع للرئيسية</Link>
      </div>
    </div>
  );
}