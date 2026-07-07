import { createClient } from "@/lib/supabase/server";
import VenuesManager from "@/components/owner-dashboard/VenuesManager";

export default async function OwnerVenuesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: venues } = await supabase.from("venues").select("id, name, status, courts(id, name, price_per_hour)").eq("owner_id", user.id);

  return (
    <>
      <h1 className="owner-page-title">ملاعبي</h1>
      <div className="owner-card">
        <VenuesManager venues={venues || []} />
      </div>
    </>
  );
}
