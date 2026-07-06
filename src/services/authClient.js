"use client";
import { createClient } from "@/lib/supabase/client";

export async function signUpPlayer({ name, email, phone, password }) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone, role: "player" },
    },
  });
  if (error) throw error;
  return data;
}

export async function signUpOwner({ email, password, venueName, venuePhone }) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: venueName, phone: venuePhone, role: "owner" },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithPassword({ email, password }) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}