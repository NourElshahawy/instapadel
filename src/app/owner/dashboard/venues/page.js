import { createClient } from "@/lib/supabase/server";
import VenuesManager from "@/components/owner-dashboard/VenuesManager";

export default async function OwnerVenuesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: venues } = await supabase
    .from("venues")
    .select("id, name, status, courts(id, name, price_per_hour)")
    .eq("owner_id", user.id);

  return (
    <div className="tw-max-w-6xl tw-mx-auto" dir="rtl">
      <h1 className="tw-text-2xl tw-font-bold tw-text-white tw-mb-6">ملاعبي</h1>
      <VenuesManager venues={venues || []} />
    </div>
  );
}