import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { currentUser } from "@clerk/nextjs/server";

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, imageURL } = body;

    // Validate required fields
    if (!title || !description || !imageURL) {
      return NextResponse.json({ 
        error: "Missing required fields: title, description, imageURL" 
      }, { status: 400 });
    }

    // Get user from database using email
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
     
    const { data: dbUser, error: userError } = await supabaseAdmin
      .from('user')
      .select('public_id')
      .eq('email', userEmail)
      .single();

    if (userError || !dbUser) {
      console.error('User lookup failed:', userError);
      return NextResponse.json({ 
        error: "User not found in database. Please ensure your account is properly set up.", 
        details: userError?.message 
      }, { status: 404 });
    }

    // Create post
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert([{
        title: title.trim(),
        description: description.trim(),
        imageURL,
        likes: 0,
        comments: 0,
        shares: 0,
        userId: dbUser.public_id,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET - Fetch posts
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Fetch posts
    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
