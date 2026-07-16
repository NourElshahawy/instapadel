import { createClient } from "@/lib/supabase/server";
import { buildNextSevenDays, buildDefaultSlots } from "./courtLogic";

export async function getAllCourts({ date } = {}) {
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

  const allCourtIds = venues.flatMap((v) => v.courts.map((c) => c.id));

  // العدد الحقيقي والموحّد لكل الناس عبر RPC (بدل الاعتماد على select مباشر بيتأثر بـ RLS)
  const countByCourtId = {};
  await Promise.all(
    allCourtIds.map(async (courtId) => {
      const { data: count } = await supabase.rpc("get_court_booking_count", { target_court_id: courtId });
      countByCourtId[courtId] = count || 0;
    }),
  );

  // فلترة حسب التاريخ لو موجود
  let bookingsForDate = [];
  if (date) {
    const { data } = await supabase
      .from("bookings")
      .select("court_id, time")
      .in("court_id", allCourtIds.length ? allCourtIds : ["00000000-0000-0000-0000-000000000000"])
      .eq("date", date)
      .eq("status", "confirmed");
    bookingsForDate = data || [];
  }

  // تقييمات الكورتس (اتنقلت هنا جوه الفنكشن بدل ما تكون طليقة برا)
  const { data: allReviews } = await supabase
    .from("court_reviews")
    .select("court_id, rating")
    .in("court_id", allCourtIds.length ? allCourtIds : ["00000000-0000-0000-0000-000000000000"]);

  const ratingByCourtId = {};
  (allReviews || []).forEach((r) => {
    if (!ratingByCourtId[r.court_id]) ratingByCourtId[r.court_id] = [];
    ratingByCourtId[r.court_id].push(r.rating);
  });

  return venues
    .filter((v) => v.courts.length > 0)
    .filter((venue) => {
      if (!date) return true;
      return venue.courts.some((court) => {
        const bookedTimesForCourt = bookingsForDate.filter((b) => b.court_id === court.id).map((b) => b.time);
        return bookedTimesForCourt.length < 12;
      });
    })
    .map((venue) => {
      const prices = venue.courts.map((c) => c.price_per_hour);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const totalBookings = venue.courts.reduce((sum, c) => sum + (countByCourtId[c.id] || 0), 0);

      const venueRatings = venue.courts.flatMap((c) => ratingByCourtId[c.id] || []);
      const avgRating = venueRatings.length > 0
        ? (venueRatings.reduce((a, b) => a + b, 0) / venueRatings.length).toFixed(1)
        : null;

      return {
        id: venue.id,
        slug: `${slugify(venue.name)}-${venue.id.slice(0, 8)}`,
        name: venue.name,
        venueId: venue.id,
        image: venue.courts[0]?.images?.[0] || "/assets/imgs/img1.jpg",
        location: venue.address,
        locationLink: null,
        isLive: true,
        rating: avgRating || "جديد",
        pricePerHour: minPrice,
        priceRangeLabel: minPrice === maxPrice ? `${minPrice}` : `${minPrice}-${maxPrice}`,
        courtsCount: venue.courts.length,
        bookingsCount: formatBookingsCount(totalBookings),
        featured: false,
        todaySlots: [],
      };
    });
}

export async function getAllCourtsFlat() {
  const supabase = await createClient();

  const { data: venues, error } = await supabase.from("venues").select("id, name, address, courts(id, name, price_per_hour, images)").eq("status", "approved");

  if (error) throw error;

  return venues.flatMap((venue) =>
    (venue.courts || []).map((court) => ({
      id: court.id,
      name: venue.courts.length > 1 ? `${venue.name} — ${court.name}` : venue.name,
      image: court.images?.[0] || "/assets/imgs/img1.jpg",
      location: venue.address,
      rating: 4.7,
    })),
  );
}

export async function getFeaturedCourts() {
  const courts = await getAllCourts();
  const featured = courts.filter((c) => c.featured);
  return featured.length > 0 ? featured : courts.slice(0, 3);
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

  const todayISO = new Date().toISOString().split("T")[0];

  return {
    ...court,
    logo: court.image,
    coverImage: court.image,
    reviewsCount: "0",
    amenities: (venue?.amenities || []).map((a) => ({ icon: amenityIcon(a), label: amenityLabel(a) })),
    heroImages: venue?.courts?.flatMap((c) => c.images || []) || [court.image],
    subCourts: (venue?.courts || []).map((c) => {
      const bookedTodayCount = (bookings || []).filter((b) => b.court_id === c.id && b.date === todayISO).length;
      return {
        id: c.id,
        name: c.name,
        pricePerHour: c.price_per_hour,
        image: c.images?.[0] || court.image,
        description: `ملعب ${c.type === "panoramic" ? "بانوراما" : c.type === "indoor" ? "داخلي" : "خارجي"}`,
        tags: [{ icon: "fa-table-tennis-paddle-ball", label: c.type }],
        isFullyBookedToday: bookedTodayCount >= 12,
      };
    }),
    days: buildNextSevenDays(),
    bookings: bookings || [],
  };
}

function formatBookingsCount(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

function slugify(str) {
  const cleaned = str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "");
  return cleaned || "venue";
}
function amenityIcon(key) {
  const map = { parking: "fa-car", cafeteria: "fa-mug-hot", showers: "fa-shower", lockers: "fa-lock", wifi: "fa-wifi" };
  return map[key] || "fa-check";
}
function amenityLabel(key) {
  const map = { parking: "موقف سيارات", cafeteria: "كافتيريا", showers: "غرف تغيير", lockers: "خزائن", wifi: "واي فاي" };
  return map[key] || key;
}