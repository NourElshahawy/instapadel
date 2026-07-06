import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, owner_status")
        .eq("id", user.id)
        .single();

      if (profile?.role === "owner") {
        const redirectPath = profile.owner_status === "approved" ? "/owner/dashboard" : "/owner/pending-approval";
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
      if (profile?.role === "admin") {
        return NextResponse.redirect(`${origin}/admin/dashboard`);
      }
      return NextResponse.redirect(`${origin}/`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}