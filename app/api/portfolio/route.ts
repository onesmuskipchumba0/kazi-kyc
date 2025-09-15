import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { currentUser } from "@clerk/nextjs/server";

// GET - Fetch portfolio items for current user
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

     // Get user from database using email, handle possible null supabaseAdmin
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

    // Fetch portfolio items
    const { data: portfolioItems, error } = await supabaseAdmin
      .from('portfolio')
      .select('*')
      .eq('userId', dbUser.public_id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching portfolio:', error);
      return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
    }

    return NextResponse.json({ portfolioItems }, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new portfolio item
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, imageUrl, location } = body;

    // Validate required fields
    if (!title || !description || !imageUrl || !location) {
      return NextResponse.json({ 
        error: "Missing required fields: title, description, imageUrl, location" 
      }, { status: 400 });
    }

    // Validate field lengths
    if (title.length > 100) {
      return NextResponse.json({ error: "Title must be less than 100 characters" }, { status: 400 });
    }
    if (description.length > 500) {
      return NextResponse.json({ error: "Description must be less than 500 characters" }, { status: 400 });
    }
    if (location.length > 100) {
      return NextResponse.json({ error: "Location must be less than 100 characters" }, { status: 400 });
    }

     // Get user from database using email
     if (!supabaseAdmin) {
       return NextResponse.json({ error: "Internal server error: Supabase not initialized" }, { status: 500 });
     }

     const userEmail = user.emailAddresses[0]?.emailAddress;
     
     const { data: dbUser, error: userError } = await supabaseAdmin
       .from('user')
       .select('public_id')
       .eq('email', userEmail)
       .single();

     if (userError || !dbUser) {
       console.error('POST: User lookup failed:', userError);
       return NextResponse.json({ 
         error: "User not found in database. Please ensure your account is properly set up.", 
         details: userError?.message 
       }, { status: 404 });
     }

    // Create portfolio item
    const { data: portfolioItem, error } = await supabaseAdmin
      .from('portfolio')
      .insert({
        title: title.trim(),
        description: description.trim(),
        imageURL: imageUrl,
        location: location.trim(),
        userId: dbUser.public_id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating portfolio item:', error);
      return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 });
    }

    return NextResponse.json({ portfolioItem }, { status: 201 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update portfolio item
export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, imageUrl, location } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: "Portfolio item ID is required" }, { status: 400 });
    }

    if (!title || !description || !imageUrl || !location) {
      return NextResponse.json({ 
        error: "Missing required fields: title, description, imageUrl, location" 
      }, { status: 400 });
    }

    // Validate field lengths
    if (title.length > 100) {
      return NextResponse.json({ error: "Title must be less than 100 characters" }, { status: 400 });
    }
    if (description.length > 500) {
      return NextResponse.json({ error: "Description must be less than 500 characters" }, { status: 400 });
    }
    if (location.length > 100) {
      return NextResponse.json({ error: "Location must be less than 100 characters" }, { status: 400 });
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
       console.error('PUT: User lookup failed:', userError);
       return NextResponse.json({ 
         error: "User not found in database. Please ensure your account is properly set up.", 
         details: userError?.message 
       }, { status: 404 });
     }

    // Update portfolio item
    const { data: portfolioItem, error } = await supabaseAdmin
      .from('portfolio')
      .update({
        title: title.trim(),
        description: description.trim(),
        imageURL: imageUrl,
        location: location.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('userId', dbUser.public_id) // Ensure user owns the item
      .select()
      .single();

    if (error) {
      console.error('Error updating portfolio item:', error);
      return NextResponse.json({ error: "Failed to update portfolio item" }, { status: 500 });
    }

    if (!portfolioItem) {
      return NextResponse.json({ error: "Portfolio item not found or not owned by user" }, { status: 404 });
    }

    return NextResponse.json({ portfolioItem }, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete portfolio item
export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Portfolio item ID is required" }, { status: 400 });
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
       console.error('DELETE: User lookup failed:', userError);
       return NextResponse.json({ 
         error: "User not found in database. Please ensure your account is properly set up.", 
         details: userError?.message 
       }, { status: 404 });
     }

    // Delete portfolio item
    const { error } = await supabaseAdmin
      .from('portfolio')
      .delete()
      .eq('id', id)
      .eq('userId', dbUser.public_id); // Ensure user owns the item

    if (error) {
      console.error('Error deleting portfolio item:', error);
      return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
    }

    return NextResponse.json({ message: "Portfolio item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
