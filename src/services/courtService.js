import { createClient } from "@/lib/supabase/server";
import { buildNextSevenDays, buildDefaultSlots } from "./courtLogic";

export async function getAllCourts() {
  const supabase = await createClient();

  const { data: venues, error } = await supabase
    .from("venues")
    .select(`
      id, name, address, phone, description, amenities,
      courts (id, name, type, price_per_hour, images)
    `)
    .eq("status", "approved");

  if (error) throw error;

  // نجيب عدد الحجوزات الحقيقي لكل الـ courts دفعة واحدة (أسرع من query لكل ملعب لوحده)
  const allCourtIds = venues.flatMap((v) => v.courts.map((c) => c.id));
  const { data: bookingCounts } = await supabase
    .from("bookings")
    .select("court_id")
    .in("court_id", allCourtIds.length ? allCourtIds : ["00000000-0000-0000-0000-000000000000"])
    .neq("status", "cancelled");

  const countByCourtId = {};
  (bookingCounts || []).forEach((b) => {
    countByCourtId[b.court_id] = (countByCourtId[b.court_id] || 0) + 1;
  });

  // كل صف دلوقتي = venue كاملة (مش court لوحده)
  return venues
    .filter((v) => v.courts.length > 0)
    .map((venue) => {
      const prices = venue.courts.map((c) => c.price_per_hour);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      const totalBookings = venue.courts.reduce((sum, c) => sum + (countByCourtId[c.id] || 0), 0);

      return {
        id: venue.id,
        slug: `${slugify(venue.name)}-${venue.id.slice(0, 8)}`,
        name: venue.name,
        venueId: venue.id,
        image: venue.courts[0]?.images?.[0] || "/assets/imgs/img1.jpg",
        location: venue.address,
        locationLink: null,
        isLive: true,
        rating: 4.7, // TODO: من جدول reviews لما نعمله
        pricePerHour: minPrice, // للفلترة/الترتيب بالسعر الأقل
        priceRangeLabel: minPrice === maxPrice ? `${minPrice}` : `${minPrice}-${maxPrice}`,
        courtsCount: venue.courts.length,
        bookingsCount: formatBookingsCount(totalBookings),
        featured: false,
        todaySlots: [],
      };
    });
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
    .in("court_id", courtIds.length ? courtIds : ["00000000-0000-0000-0000-000000000000"])
    .eq("status", "confirmed");


  return {
    ...court,
    logo: court.image,
    coverImage: court.image,
    reviewsCount: "0",
    amenities: (venue?.amenities || []).map((a) => ({ icon: amenityIcon(a), label: amenityLabel(a) })),
    heroImages: venue?.courts?.flatMap((c) => c.images || []) || [court.image],
    subCourts: (venue?.courts || []).map((c) => ({
      id: c.id,
      name: c.name,
      pricePerHour: c.price_per_hour,
      image: c.images?.[0] || court.image,
      description: `ملعب ${c.type === "panoramic" ? "بانوراما" : c.type === "indoor" ? "داخلي" : "خارجي"}`,
      tags: [{ icon: "fa-table-tennis-paddle-ball", label: c.type }],
    })),
    days: buildNextSevenDays(),
    bookings: bookings || [],
  };
}

function formatBookingsCount(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

function amenityIcon(key) {
  const map = { parking: "fa-car", cafeteria: "fa-mug-hot", showers: "fa-shower", lockers: "fa-lock", wifi: "fa-wifi" };
  return map[key] || "fa-check";
}
function amenityLabel(key) {
  const map = { parking: "موقف سيارات", cafeteria: "كافتيريا", showers: "غرف تغيير", lockers: "خزائن", wifi: "واي فاي" };
  return map[key] || key;
}

export async function getFeaturedCourts() {
  const courts = await getAllCourts();
  const featured = courts.filter((c) => c.featured);
  return featured.length > 0 ? featured : courts.slice(0, 3);
}