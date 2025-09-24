"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type SupabaseUser = {
  public_id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

export function useSupabaseUser() {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/user");
        const user = response.data.user;
  
        if (user) {
          setSupabaseUser(user as SupabaseUser);
        } else {
          setSupabaseUser(null);
        }
      } catch (err) {
        console.error("Error fetching Supabase user:", err);
        setSupabaseUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  
  return { supabaseUser, loading };
}
