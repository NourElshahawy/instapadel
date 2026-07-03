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

  const handleToggleSlot = (slot) => {
    if (!selectedDay) return;
    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.start === slot.start);
      if (exists) return prev.filter((s) => s.start !== slot.start);
      return [...prev, slot].sort((a, b) => court.slots.indexOf(a) - court.slots.indexOf(b));
    });
  };

  const summary = useMemo(() => {
    const total = selectedSlots.reduce((sum, s) => sum + s.price, 0);
    const time = selectedSlots.length ? `${selectedSlots[0].start} الي ${selectedSlots[selectedSlots.length - 1].end}` : "";
    const duration = selectedSlots.length ? (selectedSlots.length === 1 ? "ساعة واحدة" : `${selectedSlots.length} ساعات`) : "";
    const dateLabel = selectedDay ? `${selectedDay.dow} ${selectedDay.dom} ${selectedDay.month}` : "";
    return { total, time, duration, dateLabel };
  }, [selectedSlots, selectedDay]);

  const canBook = !!subCourt && !!selectedDay && selectedSlots.length > 0;

  const handleConfirm = async () => {
    setConfirming(true);
    // TODO: هنا لازم يتبعت request حقيقي لـ POST /api/bookings يرجعله bookingId
    await new Promise((r) => setTimeout(r, 1200));

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

        <SlotsGrid slots={court.slots || []} selectedTimes={selectedSlots.map((s) => s.start)} onToggle={handleToggleSlot} locked={!subCourt || !selectedDay} />
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
