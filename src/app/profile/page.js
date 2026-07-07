import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BookingHistorySection from "@/components/pages/profile/BookingHistorySection";
import ComingSoonSection from "@/components/pages/profile/ComingSoonSection";
import "@/styles/pages/profile.css";

export const metadata = { title: "الملف الشخصي — InstaPadel" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, phone, role")
    .eq("id", user.id)
    .single();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="profile-page" dir="rtl">
      <div className="profile-header">
        <span className="profile-menu-avatar">{profile?.name?.charAt(0)?.toUpperCase() || "U"}</span>
        <div>
          <h1>{profile?.name}</h1>
          <p>{user.email} {profile?.phone && `· ${profile.phone}`}</p>
        </div>
      </div>

      <BookingHistorySection bookings={bookings || []} />

      <ComingSoonSection
        icon="emoji_events"
        title="بطولاتي"
        text="البطولات اللي اشتركت فيها ونتايجها هتظهر هنا أول ما ننقل نظام البطولات بالكامل لقاعدة البيانات الحقيقية."
      />

      <ComingSoonSection
        icon="group_add"
        title="طلبات البحث عن شريك"
        text="طلبات الشريك اللي عملتها أو اشتركت فيها هتظهر هنا قريبًا."
      />
    </div>
  );
}