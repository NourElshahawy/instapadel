"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import HeroActionsBar from "./HeroActionsBar";
import VenueSummaryCard from "./VenueSummaryCard";
import HeroImageSlider from "./HeroImageSlider";
import StepBar from "./StepBar";
import CourtGallerySelector from "./CourtGallerySelector";
import DaySelector from "./DaySelector";
import SlotsGrid from "./SlotsGrid";
import BookingSummaryFooter from "./BookingSummaryFooter";
import ConfirmSheet from "./ConfirmSheet";
import BookingSuccessToast from "./BookingSuccessToast";
import { buildDefaultSlots } from "@/services/courtLogic";
import { createClient } from "@/lib/supabase/client";
import BookingGuideModal from "./BookingGuideModal";
import { getEgyptISODate } from "@/services/courtLogic";
// import "@/styles/pages/booking.css";

export default function BookingPage({ court }) {
  const [showGuide, setShowGuide] = useState(true);
  const daysSectionRef = useRef(null);
  const slotsSectionRef = useRef(null);
  const router = useRouter();

  const [subCourt, setSubCourt] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]); // array of slot objects
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [liveBookings, setLiveBookings] = useState(court.bookings || []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  // اشتراك لحظي في تغييرات الحجوزات لكل الكورتات الفرعية بتاعة الملعب ده،
  // عشان أي حد يحجز ساعة، الناس التانية اللي فاتحة نفس الصفحة تشوفها اتقفلت فورًا من غير ريفريش
  useEffect(() => {
    const supabase = createClient();
    const courtIds = (court.subCourts || []).map((c) => c.id);
    if (courtIds.length === 0) return;

    const channel = supabase
      .channel(`bookings-venue-${court.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "booking_slots" }, // <-- ده الوحيد اللي اتغيّر (كان "bookings")
        (payload) => {
          const row = payload.new && Object.keys(payload.new).length ? payload.new : payload.old;
          if (!row || !courtIds.includes(row.court_id)) return;

          setLiveBookings((prev) => {
            const sameSlot = (b) => b.court_id === row.court_id && b.date === row.date && b.time === row.time;

            if (payload.eventType === "DELETE" || row.status === "cancelled") {
              return prev.filter((b) => !sameSlot(b));
            }

            if (prev.some(sameSlot)) return prev;
            return [...prev, { court_id: row.court_id, date: row.date, time: row.time }];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [court]);

  const handleSelectSubCourt = (sc) => {
    setSubCourt(sc);
    setSelectedDay(null);
    setSelectedSlots([]);

    setTimeout(() => {
      daysSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  const handleSelectDay = (d) => {
    setSelectedDay(d);
    setSelectedSlots([]);

    setTimeout(() => {
      slotsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  const summary = useMemo(() => {
    const total = selectedSlots.reduce((sum, s) => sum + s.price, 0);
    const time = selectedSlots.length ? `${selectedSlots[0].start} الي ${selectedSlots[selectedSlots.length - 1].end}` : "";
    const duration = selectedSlots.length ? (selectedSlots.length === 1 ? "ساعة واحدة" : `${selectedSlots.length} ساعات`) : "";
    const dateLabel = selectedDay ? `${selectedDay.dow} ${selectedDay.dom} ${selectedDay.month}` : "";
    const dateISO = selectedDay?.date || ""; // ← جديد: الـ ISO date جاي من court-details.json / الداتا الأصلية
    return { total, time, duration, dateLabel, dateISO };
  }, [selectedSlots, selectedDay]);

  const daySlots = useMemo(() => {
    if (!subCourt || !selectedDay) return [];

    const bookedStartTimes = liveBookings.filter((b) => b.court_id === subCourt.id && b.date === selectedDay.date).map((b) => b.time.split(" الي ")[0]); // ناخد أول جزء بس (وقت البداية) للمقارنة

    const now = new Date();
    const todayISO = getEgyptISODate(now);
    const isToday = selectedDay.date === todayISO;
    const currentHour = Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Cairo",
        hour: "numeric",
        hour12: false,
      }).format(now),
    );

    return buildDefaultSlots(subCourt.pricePerHour).map((slot, index) => {
      // ترتيب buildDefaultSlots بيبدأ من 12:00 ص (ساعة 0) لحد 11:00 م (ساعة 23)،
      // فالـ index هنا بيطابق رقم الساعة في اليوم مباشرة
      const isPast = isToday && index <= currentHour;
      const status = bookedStartTimes.includes(slot.start) ? "booked" : isPast ? "past" : "available";
      return { ...slot, status };
    });
  }, [subCourt, selectedDay, liveBookings]);

  const handleToggleSlot = (slot) => {
    if (!selectedDay) return;
    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.start === slot.start);
      if (exists) return prev.filter((s) => s.start !== slot.start);
      return [...prev, slot].sort((a, b) => daySlots.findIndex((s) => s.start === a.start) - daySlots.findIndex((s) => s.start === b.start));
    });
  };

  const canBook = !!subCourt && !!selectedDay && selectedSlots.length > 0;

  const handleConfirm = async () => {
    setConfirming(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const groupId = crypto.randomUUID();
    const rows = selectedSlots.map((slot) => ({
      user_id: user.id,
      court_id: subCourt.id,
      venue_name: court.name,
      court_name: subCourt.name,
      date: summary.dateISO,
      time: `${slot.start} الي ${slot.end}`,
      price: slot.price,
      status: "confirmed",
      group_id: groupId,
    }));

    const { data: bookingRows, error } = await supabase.from("bookings").insert(rows).select();

    if (error) {
      setConfirming(false);
      if (error.code === "23505") {
        // unique constraint violation — حد تاني حجز نفس السلوت قبلك
        alert("للأسف حد تاني حجز واحد أو أكتر من المواعيد دي قبلك. حدّث الصفحة واختار مواعيد تانية.");
        window.location.reload();
      } else {
        alert("حصل خطأ أثناء الحجز، حاول تاني");
      }
      return;
    }

    // تحديث فوري محليًا (optimistic) بدل ما نستنى رجوع حدث الـ realtime
    setLiveBookings((prev) => [
      ...prev,
      ...bookingRows.map((b) => ({
        court_id: b.court_id,
        date: b.date,
        time: b.time,
      })),
    ]);
    fetch("/api/notifications/booking-confirmed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        userId: user.id,
        courtId: subCourt.id,
        userName: user.user_metadata?.name || "لاعب InstaPadel",
        venueName: court.name,
        courtName: subCourt.name,
        date: summary.dateLabel,
        time: summary.time, // في الإيميل نعرض الرينج الكامل، ده مفهوم للقراءة
        price: summary.total,
        bookingId: bookingRows[0].id,
      }),
    }).catch(() => {});

    setSheetOpen(false);
    setShowToast(true);

    const params = new URLSearchParams({
      court: court.name,
      subCourt: subCourt.name,
      subCourtId: subCourt.id,
      date: summary.dateLabel,
      time: summary.time,
      price: String(summary.total),
    });

    setTimeout(() => {
      router.push(`/booking/${court.slug}/confirmation?${params.toString()}&bookingId=${bookingRows[0].id}`);
    }, 1400);
  };

  const handleBookNowClick = () => {
    if (!canBook) return;
    if (currentUser === null) {
      router.push(`/login?redirect=/booking/${court.slug}`);
      return;
    }
    setSheetOpen(true);
  };

  return (
    <>
      {/* <HeroActionsBar courtSlug={court.slug} /> */}

      <main className="booking-page">
        {/* <VenueSummaryCard court={court} /> */}
        {/* <HeroImageSlider images={court.heroImages} /> */}
        <StepBar hasCourtSub={!!subCourt} hasDate={!!selectedDay} hasTime={selectedSlots.length > 0} />

        <CourtGallerySelector subCourts={court.subCourts || []} selectedId={subCourt?.id} onSelect={handleSelectSubCourt} />

        <div ref={daysSectionRef}>
          <DaySelector days={court.days || []} selectedDate={selectedDay?.date} onSelect={handleSelectDay} locked={!subCourt} />
        </div>

        <div ref={slotsSectionRef}>
          <SlotsGrid slots={daySlots} selectedTimes={selectedSlots.map((s) => s.start)} onToggle={handleToggleSlot} locked={!subCourt || !selectedDay} />
        </div>
      </main>

      {showGuide && <BookingGuideModal onClose={() => setShowGuide(false)} />}

      <BookingSummaryFooter date={summary.dateLabel} time={summary.time} duration={summary.duration} price={summary.total} onBookNow={handleBookNowClick} disabled={!canBook} />

      <ConfirmSheet
        isOpen={sheetOpen}
        onClose={() => !confirming && setSheetOpen(false)}
        onConfirm={handleConfirm}
        confirming={confirming}
        review={{
          venueName: court.name,
          subCourtName: subCourt?.name || "—",
          date: summary.dateLabel,
          time: summary.time,
          price: summary.total,
        }}
      />

      <BookingSuccessToast show={showToast} />
    </>
  );
}
