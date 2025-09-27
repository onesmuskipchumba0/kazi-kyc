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
    const { public_id: public_id } = await params;

    const { data, error } = await supabaseAdmin
      .from("user")
      .select("firstName, lastName, avatarUrl")
      .eq("public_id", public_id)
      .single();

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: data }, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}