"use client";
import { createClient } from "@/lib/supabase/client";

export async function submitOwnerNews(authorId, title, body) {
  const supabase = createClient();
  const { error } = await supabase.from("news").insert({
    source_type: "owner_post",
    author_id: authorId,
    title,
    body,
    category: "maintenance",
    status: "pending",
  });
  if (error) throw error;
}
