import { createClient } from "@/lib/supabase/server";
import { getOwnerStaff, getOwnerVenuesForStaff } from "@/services/staffService";
import StaffList from "@/components/owner-dashboard/StaffList";

export default async function OwnerStaffPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const staff = await getOwnerStaff(user.id);
  const venues = await getOwnerVenuesForStaff(user.id);

  return (
    <>
      <h1 className="owner-page-title">الموظفين ({staff.length})</h1>
      <StaffList staff={staff} venues={venues} />
    </>
  );
}
