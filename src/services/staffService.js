import { createClient } from "@/lib/supabase/server";

const DOW_NAMES = ["الأحد", "الإثنين", "الثلاثاء", "الأربع", "الخميس", "الجمعة", "السبت"];

function timeToMinutes(label) {
  const match = label?.trim().match(/^(\d{1,2}):(\d{2})\s*(ص|م)$/);
  if (!match) return null;
  let [, h, m, period] = match;
  h = parseInt(h, 10);
  m = parseInt(m, 10);
  if (period === "ص") {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  return h * 60 + m;
}

function cairoDowAndMinutes(isoTimestamp) {
  const d = new Date(isoTimestamp);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const map = {};
  parts.forEach((p) => (map[p.type] = p.value));

  const localMidnightUTC = new Date(Date.UTC(Number(map.year), Number(map.month) - 1, Number(map.day)));
  const dowIndex = localMidnightUTC.getUTCDay(); // 0 = الأحد
  const hour = Number(map.hour) % 24; // بعض المتصفحات بترجع "24" لمنتصف الليل بدل "00"
  const minute = Number(map.minute);

  return { dow: DOW_NAMES[dowIndex], minutes: hour * 60 + minute };
}

function fallsInShift(dow, minutes, shiftSchedule) {
  return (shiftSchedule || []).some((s) => {
    if (s.day !== dow) return false;
    const start = timeToMinutes(s.start);
    const end = timeToMinutes(s.end);
    if (start === null || end === null) return false;
    return minutes >= start && minutes < end;
  });
}

function weeklyHours(shiftSchedule) {
  return (shiftSchedule || []).reduce((sum, s) => {
    const start = timeToMinutes(s.start);
    const end = timeToMinutes(s.end);
    if (start === null || end === null) return sum;
    return sum + (end - start) / 60;
  }, 0);
}

export async function getOwnerStaff(ownerId) {
  const supabase = await createClient();
  const { data } = await supabase.from("staff").select("id, name, phone, venue_id, shift_schedule, venues(name)").eq("owner_id", ownerId).order("created_at", { ascending: false });

  return (data || []).map((s) => ({
    id: s.id,
    name: s.name,
    phone: s.phone,
    venueName: s.venue_id ? s.venues?.name || "—" : "كل الملاعب",
    weeklyHours: weeklyHours(s.shift_schedule),
    shiftsCount: (s.shift_schedule || []).length,
  }));
}

export async function getStaffDetail(staffId, ownerId) {
  const supabase = await createClient();
  const { data: staff } = await supabase.from("staff").select("id, name, phone, venue_id, shift_schedule, venues(name)").eq("id", staffId).eq("owner_id", ownerId).maybeSingle();

  if (!staff) return null;

  let courtIds = [];
  if (staff.venue_id) {
    const { data: venueCourts } = await supabase.from("courts").select("id").eq("venue_id", staff.venue_id);
    courtIds = (venueCourts || []).map((c) => c.id);
  } else {
    const { data: ownerVenues } = await supabase.from("venues").select("id").eq("owner_id", ownerId);
    const venueIds = (ownerVenues || []).map((v) => v.id);
    if (venueIds.length > 0) {
      const { data: allCourts } = await supabase.from("courts").select("id").in("venue_id", venueIds);
      courtIds = (allCourts || []).map((c) => c.id);
    }
  }

  let bookingsInShift = 0;
  let cancellationsInShift = 0;

  if (courtIds.length > 0) {
   const { data: bookings } = await supabase.from("bookings").select("group_id, created_at, cancelled_at, status").in("court_id", courtIds);

   // نجمع الصفوف لكل عملية حجز مع بعض (نفس group_id) عشان نعدّها مرة واحدة بس
   const bookingGroups = new Map();
   const cancelGroups = new Map();

   (bookings || []).forEach((b) => {
     const key = b.group_id || `single-${b.created_at}`;

     // الحجوزات الملغية مش بتتحسب ضمن "حجوزات في الشيفت" — بتتحسب في الإلغاءات بس
     if (b.status !== "cancelled" && b.created_at && !bookingGroups.has(key)) {
       bookingGroups.set(key, b.created_at);
     }
     if (b.status === "cancelled" && b.cancelled_at) {
       const cancelKey = b.group_id || `single-cancel-${b.cancelled_at}`;
       if (!cancelGroups.has(cancelKey)) {
         cancelGroups.set(cancelKey, b.cancelled_at);
       }
     }
   });

    bookingGroups.forEach((createdAt) => {
      const { dow, minutes } = cairoDowAndMinutes(createdAt);
      if (fallsInShift(dow, minutes, staff.shift_schedule)) bookingsInShift++;
    });

    cancelGroups.forEach((cancelledAt) => {
      const { dow, minutes } = cairoDowAndMinutes(cancelledAt);
      if (fallsInShift(dow, minutes, staff.shift_schedule)) cancellationsInShift++;
    });
  }

  return {
    id: staff.id,
    name: staff.name,
    phone: staff.phone,
    venueName: staff.venue_id ? staff.venues?.name || "—" : "كل الملاعب",
    shiftSchedule: staff.shift_schedule || [],
    weeklyHours: weeklyHours(staff.shift_schedule),
    bookingsInShift,
    cancellationsInShift,
  };
}

export async function getOwnerVenuesForStaff(ownerId) {
  const supabase = await createClient();
  const { data } = await supabase.from("venues").select("id, name").eq("owner_id", ownerId).eq("status", "approved");
  return data || [];
}
