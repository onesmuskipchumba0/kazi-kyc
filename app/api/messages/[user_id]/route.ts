// app/api/messages/[user_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { user_id: string } }
) {
  try {
    // Verify authentication with Clerk
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    // Get current user from database using Clerk ID from clerk_id column
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("user")
      .select("public_id")
      .eq("clerk_id", clerkUserId) // Using clerk_id column
      .single();

    if (userError || !currentUser) {
      console.error("User not found for clerk_id:", clerkUserId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUserId = currentUser.public_id;
    const otherUserId = params.user_id;

    if (!otherUserId) {
      return NextResponse.json({ error: "No other user id found" }, { status: 404 });
    }

    // Verify that the current user is part of this conversation
    const { data: conversationCheck, error: conversationError } = await supabaseAdmin
      .from("messages")
      .select("id")
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
      .limit(1);

    if (conversationError) {
      console.error("Conversation check error:", conversationError);
      return NextResponse.json({ error: "Error verifying conversation access" }, { status: 500 });
    }

    if (!conversationCheck) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    

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
      console.error("Error fetching messages:", error);
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (err) {
    console.error("Error in messages GET:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { user_id: string } }
) {
  try {
    // Verify authentication with Clerk
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    // Get current user from database using Clerk ID from clerk_id column
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("user")
      .select("public_id")
      .eq("clerk_id", clerkUserId) // Using clerk_id column
      .single();

    if (userError || !currentUser) {
      console.error("User not found for clerk_id:", clerkUserId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUserId = currentUser.public_id;
    const otherUserId = params.user_id;

    if (!otherUserId) {
      return NextResponse.json({ error: "No other user id found" }, { status: 404 });
    }

    // Verify that the current user is part of this conversation
    const { data: conversationCheck, error: conversationError } = await supabaseAdmin
      .from("messages")
      .select("id")
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
      .limit(1);

    if (conversationError) {
      console.error("Conversation check error:", conversationError);
      return NextResponse.json({ error: "Error verifying conversation access" }, { status: 500 });
    }

    if (!conversationCheck || conversationCheck.length === 0) {
      return NextResponse.json({ error: "Access denied - conversation not found" }, { status: 403 });
    }

    // First, get the count of unread messages before updating
    const { count, error: countError } = await supabaseAdmin
      .from("messages")
      .select('*', { count: 'exact', head: true })
      .eq("receiver_id", currentUserId)
      .eq("sender_id", otherUserId)
      .eq("is_read", false);

    if (countError) {
      console.error("Count error:", countError);
      return NextResponse.json({ error: "Failed to count unread messages" }, { status: 500 });
    }

    // Mark all unread messages from this conversation as read
    const { error: updateError } = await supabaseAdmin
      .from("messages")
      .update({ is_read: true })
      .eq("receiver_id", currentUserId)
      .eq("sender_id", otherUserId)
      .eq("is_read", false);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Messages marked as read",
      updatedCount: count || 0
    });
  } catch (err) {
    console.error("Error in messages PUT:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}