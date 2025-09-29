import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  console.log("POST /api/messages called");

  try {
    // Parse request body
    const body = await req.json();
    console.log("Request body:", body);

    const { sender_id, receiver_id, content } = body;

    // Validate required fields
    if (!sender_id || !receiver_id || !content) {
      console.log("Missing required fields:", { sender_id, receiver_id, content });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check Supabase client
    if (!supabaseAdmin) {
      console.log("Supabase client not initialized");
      return NextResponse.json({ error: "Supabase not initialized." }, { status: 500 });
    }

    // Insert message
    console.log("Inserting message into Supabase...");
    const { data, error } = await supabaseAdmin
      .from("messages")
      .insert([
        { sender_id, receiver_id, content, is_read: false },
      ])
      .select(`
        id,
        content,
        created_at,
        is_read,
        sender:user!sender_id(id, public_id, email, phoneNumber, avatarUrl, location, name),
        receiver:user!receiver_id(id, public_id, email, phoneNumber, avatarUrl, location, name)
      `);

    console.log("Insert result:", { data, error });

    if (error) {
      console.log("Error inserting message:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || !data.length) {
      console.log("Insert succeeded but no data returned");
      return NextResponse.json({ error: "Insert succeeded but no data returned" }, { status: 500 });
    }

    console.log("Message inserted successfully:", data[0]);
    return NextResponse.json({ message: data[0] });

  } catch (err) {
    console.error("Error sending message:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}