"use client";
import { useMemo, useState } from "react";
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

import "@/styles/pages/booking.css";

export default function BookingPage({ court }) {
  const router = useRouter();

  const [subCourt, setSubCourt] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]); // array of slot objects
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSelectSubCourt = (sc) => {
    setSubCourt(sc);
    setSelectedDay(null);
    setSelectedSlots([]);
  };

  const handleSelectDay = (d) => {
    setSelectedDay(d);
    setSelectedSlots([]);
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

    const bookedStartTimes = court.bookings.filter((b) => b.court_id === subCourt.id && b.date === selectedDay.date).map((b) => b.time.split(" الي ")[0]); // ناخد أول جزء بس (وقت البداية) للمقارنة

    return buildDefaultSlots(subCourt.pricePerHour).map((slot) => ({
      ...slot,
      status: bookedStartTimes.includes(slot.start) ? "booked" : "available",
    }));
  }, [subCourt, selectedDay, court]);

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

    // نبني صف منفصل لكل سلوت مختار
    const rows = selectedSlots.map((slot) => ({
      user_id: user.id,
      court_id: subCourt.id,
      venue_name: court.name,
      court_name: subCourt.name,
      date: summary.dateISO,
      time: `${slot.start} الي ${slot.end}`, // وقت السلوت ده بس، مش الرينج الكامل
      price: slot.price,
      status: "confirmed",
    }));

    const { data: bookingRows, error } = await supabase.from("bookings").insert(rows).select();

    if (error) {
      setConfirming(false);
      alert("حصل خطأ أثناء الحجز، حاول تاني");
      return;
    }

    fetch("/api/notifications/booking-confirmed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
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
      date: summary.dateLabel,
      time: summary.time,
      price: String(summary.total),
    });

    setTimeout(() => {
      router.push(`/booking/${court.slug}/confirmation?${params.toString()}`);
    }, 1400);
  };

  return (
    <>
      {/* <HeroActionsBar courtSlug={court.slug} /> */}

      <main className="booking-page">
        <VenueSummaryCard court={court} />

        <HeroImageSlider images={court.heroImages} />

        <StepBar hasCourtSub={!!subCourt} hasDate={!!selectedDay} hasTime={selectedSlots.length > 0} />

        <CourtGallerySelector subCourts={court.subCourts || []} selectedId={subCourt?.id} onSelect={handleSelectSubCourt} />

        <DaySelector days={court.days || []} selectedDate={selectedDay?.date} onSelect={handleSelectDay} locked={!subCourt} />

        <SlotsGrid slots={daySlots} selectedTimes={selectedSlots.map((s) => s.start)} onToggle={handleToggleSlot} locked={!subCourt || !selectedDay} />
      </main>

      <BookingSummaryFooter date={summary.dateLabel} time={summary.time} duration={summary.duration} price={summary.total} onBookNow={() => canBook && setSheetOpen(true)} disabled={!canBook} />

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
