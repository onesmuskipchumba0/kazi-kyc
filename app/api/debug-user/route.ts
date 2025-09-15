import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    
    // Debug info
    const debugInfo = {
      clerkUser: {
        id: user.id,
        emailAddresses: user.emailAddresses,
        primaryEmailAddress: user.primaryEmailAddress,
      },
      supabaseAdmin: !!supabaseAdmin,
      userEmail
    };

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: "Supabase admin not initialized",
        debug: debugInfo
      }, { status: 500 });
    }

    // Try to find user in database
    const { data: dbUser, error: userError } = await supabaseAdmin
      .from('user')
      .select('*')
      .eq('email', userEmail)
      .single();

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      dbUser,
      userError: userError?.message,
      found: !!dbUser
    }, { status: 200 });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
