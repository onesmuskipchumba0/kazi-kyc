import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role key for RLS inserts
);

// GET /api/messages?sender=uuid&receiver=uuid
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sender = searchParams.get("sender");
  const receiver = searchParams.get("receiver");

  if (!sender || !receiver) {
    return NextResponse.json({ error: "sender and receiver required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select(`
      id, content, created_at, is_read, sender_id, receiver_id,
      sender:user!messages_sender_id_fkey(public_id, firstName, lastName),
      receiver:user!messages_receiver_id_fkey(public_id, firstName, lastName)
    `)
    .or(`and(sender_id.eq.${sender},receiver_id.eq.${receiver}),and(sender_id.eq.${receiver},receiver_id.eq.${sender})`)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/messages
export async function POST(req: Request) {
  const body = await req.json();
  const { sender_id, receiver_id, content } = body;

  if (!sender_id || !receiver_id || !content) {
    return NextResponse.json({ error: "sender_id, receiver_id, content required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        sender_id,
        receiver_id,
        content,
        is_read: false,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
