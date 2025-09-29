import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient"; // admin client (service role key)
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const email = user.primaryEmailAddress.emailAddress;
    if (!supabaseAdmin) {
      console.error("Supabase admin client is not initialized.");
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    console.log("Clerk email:", email);

    const { data, error } = await supabaseAdmin
      .from("user")
      .select("public_id, name, email, firstName, lastName, phoneNumber, profileType, location")
      .eq("email", email)
      .single(); // force exactly one row

    if (error) {
      console.error("Supabase query error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // gets user data
    return NextResponse.json({ user: data }, { status: 200 });
  } catch (error: any) {
    console.error("Route error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
