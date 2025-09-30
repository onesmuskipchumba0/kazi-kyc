// app/api/users/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ users: [] });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    // Search by email or phone number
    const { data: users, error } = await supabaseAdmin
      .from("user")
      .select("public_id, name, email, firstName, lastName, phoneNumber, profileType, location, experience, connections")
      .or(`email.ilike.%${query}%,phoneNumber.ilike.%${query}%`)
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}