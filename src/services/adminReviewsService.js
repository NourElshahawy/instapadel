import { createClient } from "@/lib/supabase/server";

export async function getAllReviewsForAdmin(page = 1, pageSize = 50) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("court_reviews")
    .select("id, rating, comment, site_feedback, created_at, courts(name, venue_id, venues(name)), profiles(name, phone, email)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    reviews: (data || []).map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      siteFeedback: r.site_feedback,
      venueName: r.courts?.venues?.name || "—",
      courtName: r.courts?.name || "—",
      customerName: r.profiles?.name || "—",
      customerPhone: r.profiles?.phone || "—",
      customerEmail: r.profiles?.email || "—",
      createdAt: r.created_at,
    })),
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
