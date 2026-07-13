import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "طلبك مرفوض — InstaPadel" };

export default async function OwnerRejectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: venues } = await supabase
    .from("venues")
    .select("name, status")
    .eq("owner_id", user.id);
  const hasApproved = venues?.some((v) => v.status === "approved");
  if (hasApproved) redirect("/owner/dashboard");

  return (
    <div
      className="auth-shell"
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <div className="auth-card" style={{ textAlign: "center" }}>
        <i
          className="fa-solid fa-circle-xmark"
          style={{ fontSize: 48, color: "#ff6b6b" }}
        ></i>
        <h1 style={{ marginTop: 16 }}>للأسف طلبك اتقفل</h1>
        <p className="auth-sub">
          مراجعة فريقنا لملعب {venues?.[0]?.name} لم توافق على النشر حاليًا. لو
          عايز تعرف السبب أو تعيد التقديم، تواصل معانا.
        </p>
        <a
          href="mailto:support@instapadel.com"
          className="btn btn-ghost btn-block"
          style={{ marginTop: 16 }}
        >
          تواصل مع الدعم
        </a>
        <Link
          href="/"
          className="btn btn-ghost btn-block"
          style={{ marginTop: 10 }}
        >
          رجوع للرئيسية
        </Link>
      </div>
    </div>
  );
}
