"use client";
import { createClient } from "@/lib/supabase/client";

export async function submitAdminNews(authorId, title, body, category) {
  const supabase = createClient();
  const { error } = await supabase.from("news").insert({
    source_type: "admin_post",
    author_id: authorId,
    title,
    body,
    category,
    status: "published", // منشور فورًا
  });
  if (error) throw error;
}

export async function respondToOwnerNews(newsId, approve) {
  const supabase = createClient();
  const { error } = await supabase
    .from("news")
    .update({ status: approve ? "published" : "rejected" })
    .eq("id", newsId);
  if (error) throw error;
}
