import { createClient } from "@/lib/supabase/server";
import { buildNextSevenDays, buildDefaultSlots } from "./courtLogic";
export async function getAllCourts() {
  const supabase = await createClient();

  const { data: venues, error } = await supabase
    .from("venues")
    .select(
      `
      id, name, address, phone, description, amenities,
      courts (id, name, type, price_per_hour, images)
    `,
    )
    .eq("status", "approved");

  if (error) throw error;

  // كل "court" فعلي (مش venue) بيبقى صف مستقل في نتيجة الصفحة،
  // زي ما كان شكل courts.json بالظبط عشان مانكسرش الكومبوننتات الموجودة
  return venues.flatMap((venue) =>
    (venue.courts || []).map((court) => ({
      id: court.id,
      slug: `${slugify(venue.name)}-${court.id.slice(0, 8)}`,
      name:
        venue.courts.length > 1 ? `${venue.name} — ${court.name}` : venue.name,
      venueId: venue.id,
      venueName: venue.name,
      image: court.images?.[0] || "/assets/imgs/img1.jpg",
      location: venue.address,
      locationLink: null,
      isLive: true,
      rating: 4.7, // TODO: يتحسب من جدول reviews لما نعمله
      pricePerHour: court.price_per_hour,
      courtsCount: venue.courts.length,
      bookingsCount: "0",
      featured: false,
      todaySlots: [], // TODO: يتحسب من جدول bookings الحقيقي
    })),
  );
}

export async function getCourtDetails(slug) {
  const courts = await getAllCourts();
  const court = courts.find((c) => c.slug === slug);
  if (!court) return null;

  const supabase = await createClient();
  const { data: venue } = await supabase
    .from("venues")
    .select("*, courts(*)")
    .eq("id", court.venueId)
    .single();

  const courtIds = (venue?.courts || []).map((c) => c.id);
  const { data: bookings } = await supabase
    .from("bookings")
    .select("court_id, date, time")
    .in("court_id", courtIds)
    .eq("status", "confirmed");

  return {
    ...court,
    logo: court.image,
    coverImage: court.image,
    reviewsCount: "0",
    amenities: (venue?.amenities || []).map((a) => ({
      icon: amenityIcon(a),
      label: amenityLabel(a),
    })),
    heroImages: venue?.courts?.flatMap((c) => c.images || []) || [court.image],
    subCourts: (venue?.courts || []).map((c) => ({
      id: c.id,
      name: c.name,
      image: c.images?.[0] || court.image,
      description: `ملعب ${c.type === "panoramic" ? "بانوراما" : c.type === "indoor" ? "داخلي" : "خارجي"}`,
      tags: [{ icon: "fa-table-tennis-paddle-ball", label: c.type }],
    })),
    days: buildNextSevenDays(),
    slots: buildDefaultSlots(court.pricePerHour),
    bookings: bookings || [],
  };
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function amenityIcon(key) {
  const map = {
    parking: "fa-car",
    cafeteria: "fa-mug-hot",
    showers: "fa-shower",
    lockers: "fa-lock",
    wifi: "fa-wifi",
  };
  return map[key] || "fa-check";
}
function amenityLabel(key) {
  const map = {
    parking: "موقف سيارات",
    cafeteria: "كافتيريا",
    showers: "غرف تغيير",
    lockers: "خزائن",
    wifi: "واي فاي",
  };
  return map[key] || key;
}




export async function getFeaturedCourts() {
  const courts = await getAllCourts();
  const featured = courts.filter((c) => c.featured);
  // لحد ما نعمل نظام حقيقي لتحديد الملاعب المميزة، اعرض أول 3 ملاعب موجودين لو مفيش featured
  return featured.length > 0 ? featured : courts.slice(0, 3);
}
