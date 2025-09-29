// app/api/messages/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    // Get current user
    const authHeader = req.headers.get("authorization");
    const cookieHeader = req.headers.get("cookie");

    const userResponse = await fetch(`${req.nextUrl.origin}/api/user`, {
      headers: {
        ...(authHeader && { authorization: authHeader }),
        ...(cookieHeader && { cookie: cookieHeader }),
      },
    });

    const userData = await userResponse.json();
    if (!userData.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const currentUserId = userData.user.public_id;
    const otherUserId = params.id;

    // Fetch all messages between current user and otherUserId
    const { data: messages, error } = await supabaseAdmin
      .from("messages")
      .select(
        `
        id,
        content,
        created_at,
        read,
        sender:user!sender_id ( public_id, name, email, phoneNumber, avatarUrl, location ),
        receiver:user!receiver_id ( public_id, name, email, phoneNumber, avatarUrl, location )
      `
      )
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
