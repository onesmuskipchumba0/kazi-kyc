// app/api/conversations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    // Get current user from session (you'll need to implement this based on your auth)
    // For now, assuming you have a way to get current user ID from cookies/session
    // You might need to use getServerSession or similar
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie');
    
    // Make internal request to get current user
    const userResponse = await fetch(`${req.nextUrl.origin}/api/user`, {
      headers: {
        ...(authHeader && { 'authorization': authHeader }),
        ...(cookieHeader && { 'cookie': cookieHeader }),
      },
    });
    
    const userData = await userResponse.json();
    
    if (!userData.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const currentUserId = userData.user.public_id;

    // Get all messages involving the current user
    const { data: messages, error } = await supabaseAdmin
      .from("messages")
      .select(`
        id,
        content,
        created_at,
        is_read,
        sender_id,
        receiver_id
      `)
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get unique user IDs from conversations
    const userIds = new Set<string>();
    messages?.forEach((message: any) => {
      if (message.sender_id !== currentUserId) {
        userIds.add(message.sender_id);
      }
      if (message.receiver_id !== currentUserId) {
        userIds.add(message.receiver_id);
      }
    });

    if (userIds.size === 0) {
      return NextResponse.json({ conversations: [] });
    }

    // Fetch user details for all conversation participants
    const { data: users, error: usersError } = await supabaseAdmin
      .from("user")
      .select("public_id, name, email, phoneNumber, avatarUrl, location")
      .in("public_id", Array.from(userIds));

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    // Create a map of users for quick lookup
    const userMap = new Map();
    users?.forEach((user: any) => {
      userMap.set(user.public_id, user);
    });

    // Transform data to group by conversation and get last message
    const conversationMap = new Map();
    
    messages?.forEach((message: any) => {
  const otherUserId = message.sender_id === currentUserId
    ? message.receiver_id
    : message.sender_id;

  const otherUser = userMap.get(otherUserId);

  if (!otherUser) return; // Skip if user not found

  if (!conversationMap.has(otherUserId)) {
    const isUnread = message.receiver_id === currentUserId && !message.is_read;

    conversationMap.set(otherUserId, {
      id: otherUserId,
      otherUser,
      lastMessage: message.content,
      timestamp: message.created_at,
      unreadCount: isUnread ? 1 : 0,
    });
  } else {
    // Update unread count if message is unread
    const conversation = conversationMap.get(otherUserId);
    if (message.receiver_id === currentUserId && !message.is_read) {
      conversation.unreadCount += 1;
    }
  }
});


    const formattedConversations = Array.from(conversationMap.values());

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
