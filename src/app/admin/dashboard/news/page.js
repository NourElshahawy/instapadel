import { createClient } from "@/lib/supabase/server";
import AdminNewsManager from "@/components/admin-dashboard/AdminNewsManager";

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pendingNews } = await supabase.from("news").select("id, title, body").eq("source_type", "owner_post").eq("status", "pending").order("created_at", { ascending: false });

  return (
    <>
      <h1 className="owner-page-title">إدارة الأخبار</h1>
      <AdminNewsManager authorId={user.id} pendingNews={pendingNews || []} />
    </>
  );
}
