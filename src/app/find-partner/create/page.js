import { redirect } from "next/navigation";
import CreatePartnerRequestForm from "@/components/pages/find-partner/CreatePartnerRequestForm";
import { getAllCourts } from "@/services/courtService";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "إنشاء طلب شريك — InstaPadel" };

export default async function CreatePartnerRequestPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const courts = await getAllCourts();

  return (
    <section className="section" style={{ paddingTop: 140 }}>
      <div className="container">
        <CreatePartnerRequestForm courts={courts} hostId={user.id} />
      </div>
    </section>
  );
}