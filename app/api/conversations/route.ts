// app/api/conversations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    // Get current user from session
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
      console.error("Error fetching messages:", error);
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
      console.error("Error fetching users:", usersError);
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

      if (!otherUser) {
        console.warn(`User not found for ID: ${otherUserId}`);
        return; // Skip if user not found
      }

      const existingConversation = conversationMap.get(otherUserId);
      
      if (!existingConversation) {
        const isUnread = message.receiver_id === currentUserId && !message.is_read;

        conversationMap.set(otherUserId, {
          id: otherUserId,
          otherUser,
          lastMessage: message.content,
          timestamp: message.created_at,
          unreadCount: isUnread ? 1 : 0,
        });
      } else {
        // Update unread count if message is unread and this is the first time we see it
        // (since messages are sorted by date, we only count unread for the latest messages)
        if (message.receiver_id === currentUserId && !message.is_read) {
          existingConversation.unreadCount += 1;
        }
      }
    });

    const formattedConversations = Array.from(conversationMap.values());
    
    console.log(`API: Returning ${formattedConversations.length} conversations`);
    
    // Make sure we return an array in the conversations field
    return NextResponse.json({ 
      conversations: formattedConversations,
      count: formattedConversations.length 
    });
    
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}