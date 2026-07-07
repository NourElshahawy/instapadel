import { createClient } from "@/lib/supabase/server";
import { getOwnerBookings } from "@/services/ownerBookingsService";
import BookingsTable from "@/components/owner-dashboard/BookingsTable";

export default async function OwnerBookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const bookings = await getOwnerBookings(user.id);

  return (
    <div className="tw-max-w-6xl tw-mx-auto" dir="rtl">
      <h1 className="tw-text-2xl tw-font-bold tw-text-white tw-mb-6">الحجوزات</h1>
      <div className="tw-bg-slate-900 tw-border tw-border-slate-800 tw-rounded-xl tw-p-5">
        <BookingsTable initialBookings={bookings} />
      </div>
    </div>
  );
}