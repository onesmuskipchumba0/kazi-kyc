// app/api/messages/[user_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { user_id: string } }
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
    const otherUserId = params.user_id;

    if(!otherUserId) return NextResponse.json({ error: `No other user id found`}, { status: 404});

    // Fetch all messages between current user and otherUserId
    const { data: messages, error } = await supabaseAdmin
      .from("messages")
      .select(
        `
        id,
        content,
        created_at,
        is_read,
        sender:user!sender_id ( public_id, name, email, phoneNumber, avatarUrl, location ),
        receiver:user!receiver_id ( public_id, name, email, phoneNumber, avatarUrl, location )
      `
      )
      .or(
        `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: `${error.message} ${error.hint}` }, { status: 500 });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Add PUT endpoint to mark messages as read
export async function PUT(
  req: NextRequest,
  { params }: { params: { user_id: string } }
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
    const otherUserId = params.user_id;

    if(!otherUserId) return NextResponse.json({ error: `No other user id found`}, { status: 404});

    // First, get the count of unread messages before updating
    const { count, error: countError } = await supabaseAdmin
      .from("messages")
      .select('*', { count: 'exact', head: true })
      .eq("receiver_id", currentUserId)
      .eq("sender_id", otherUserId)
      .eq("is_read", false);

    if (countError) {
      return NextResponse.json({ error: `Failed to count unread messages: ${countError.message}` }, { status: 500 });
    }

    // Mark all unread messages from this conversation as read
    const { data, error } = await supabaseAdmin
      .from("messages")
      .update({ is_read: true })
      .eq("receiver_id", currentUserId)
      .eq("sender_id", otherUserId)
      .eq("is_read", false);

    if (error) {
      return NextResponse.json({ error: `Failed to mark messages as read: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Messages marked as read",
      updatedCount: count || 0
    });
  } catch (err) {
    console.error("Error marking messages as read:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}