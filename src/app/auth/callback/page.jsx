"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    };

    checkUser();
  }, []);

  return <p>Loading...</p>;
}
