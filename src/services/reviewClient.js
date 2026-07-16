"use client";
import { createClient } from "@/lib/supabase/client";

export async function submitCourtReview(bookingId, courtId, userId, rating, comment) {
  const supabase = createClient();
  const { error } = await supabase.from("court_reviews").insert({
    booking_id: bookingId, court_id: courtId, user_id: userId, rating, comment: comment || null,
  });
  if (error) throw error;
}