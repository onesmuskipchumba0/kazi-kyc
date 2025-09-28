// app/api/user/[public_id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { public_id: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  try {
    const { public_id } = params;

    const { data, error } = await supabaseAdmin
      .from("user")
      .select("firstName, lastName, avatarUrl, public_id, rating")
      .eq("public_id", public_id)
      .single();

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: `User ${public_id} not found. ${error.message}` }, { status: 404 });
    }

    return NextResponse.json({ user: data }, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}