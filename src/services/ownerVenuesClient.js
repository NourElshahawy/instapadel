
"use client";
import { createClient } from "@/lib/supabase/client";

export async function updateCourtPrice(courtId, newPrice) {
  const supabase = createClient();
  const { error } = await supabase.from("courts").update({ price_per_hour: newPrice }).eq("id", courtId);
  if (error) throw error;
}

export async function addCourtToVenue(venueId, courtData) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courts")
    .insert({
      venue_id: venueId,
      name: courtData.name,
      type: courtData.type,
      price_per_hour: Number(courtData.price),
      images: [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// نفس createVenue القديمة، لكن هنسيبها بس لحالة "مكان جديد تمامًا"
export async function createVenue(ownerId, venueData, courts) {
  const supabase = createClient();

  const { data: venueRow, error: venueError } = await supabase
    .from("venues")
    .insert({
      owner_id: ownerId,
      name: venueData.name,
      address: venueData.address,
      phone: venueData.phone,
      email: venueData.email,
      description: venueData.description,
      amenities: venueData.amenities,
      status: "pending",
    })
    .select()
    .single();

  if (venueError) throw venueError;

  const courtRows = courts.map((c) => ({
    venue_id: venueRow.id,
    name: c.name,
    type: c.type,
    price_per_hour: Number(c.price),
    images: [],
  }));

  const { error: courtsError } = await supabase.from("courts").insert(courtRows);
  if (courtsError) throw courtsError;

  return venueRow;
}