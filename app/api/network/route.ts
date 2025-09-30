// api/network/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('=== NETWORK API CALLED ===');

    if (!supabaseAdmin) {
      console.error('supabaseAdmin is null');
      return NextResponse.json(
        { error: 'Server configuration error: supabaseAdmin not found' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');

    console.log('Request params - type:', type, 'userId:', userId);

    if (!type || !userId) {
      console.error('Missing parameters');
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let data: any[] = [];

    if (type === 'connections' || type === 'network') {
      console.log('Fetching connections for user:', userId);

      const { data: connections, error } = await supabaseAdmin
        .from('networks')
        .select('*')
        .eq('status', 'accepted')
        .or(`user_id.eq.${userId},target_user_id.eq.${userId}`);

      if (error) throw error;
      data = connections || [];
      console.log('Found connections:', data.length);

    } else if (type === 'requests') {
      console.log('Fetching requests for user:', userId);

      const { data: requests, error } = await supabaseAdmin
        .from('networks')
        .select('id, user_id')
        .eq('target_user_id', userId)
        .eq('status', 'pending');

      if (error) throw error;
      data = requests || [];
      console.log('Found requests:', data.length);

    } else if (type === 'discover') {
      console.log('Fetching discover users for user:', userId);

      // Get existing connections and requests to exclude
      const { data: existingConnections, error: connectionsError } = await supabaseAdmin
        .from('networks')
        .select('user_id, target_user_id')
        .or(`user_id.eq.${userId},target_user_id.eq.${userId}`);

      if (connectionsError) {
        console.error('Error fetching existing connections:', connectionsError);
        throw connectionsError;
      }

      // Create set of excluded user IDs (more efficient)
      const excludedIds = new Set([userId]);
      existingConnections?.forEach(conn => {
        excludedIds.add(conn.user_id);
        excludedIds.add(conn.target_user_id);
      });

      console.log('Excluded IDs count:', excludedIds.size);
      console.log('Excluded IDs:', Array.from(excludedIds));

      // Build the query for discover users
      let query = supabaseAdmin
        .from('user')
        .select('public_id, name, avatarUrl, location, experience, coreSkills')
        .neq('public_id', userId) // Always exclude current user
        .limit(20);

      // If we have other IDs to exclude, add them one by one
      // This is safer than trying to use .not() with complex conditions
      Array.from(excludedIds).forEach(excludedId => {
        if (excludedId !== userId) { // userId already excluded by .neq()
          query = query.neq('public_id', excludedId);
        }
      });

      const { data: users, error: usersError } = await query;

      if (usersError) {
        console.error('Error fetching discover users:', usersError);
        throw usersError;
      }

      data = users || [];
      console.log('Discover users found:', data.length);
      
      // If no users found, try to get some random users excluding current user only
      if (data.length === 0) {
        console.log('No users found with exclusions, trying without connection exclusions...');
        const { data: fallbackUsers, error: fallbackError } = await supabaseAdmin
          .from('user')
          .select('public_id, name, avatarUrl, location, experience, coreSkills')
          .neq('public_id', userId)
          .limit(10);
          
        if (!fallbackError) {
          data = fallbackUsers || [];
          console.log('Fallback users found:', data.length);
        }
      }

    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    console.log('Returning data count:', data.length);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Network table API error:', error);
    
    // More detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('=== NETWORK POST API CALLED ===');

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server configuration error: supabaseAdmin not found' },
        { status: 500 }
      );
    }

    const { currentUserId, targetUserId } = await request.json();
    console.log('Creating connection:', { currentUserId, targetUserId });

    if (!currentUserId || !targetUserId) {
      return NextResponse.json({ error: 'Missing user IDs' }, { status: 400 });
    }

    // Check if connection already exists
    const { data: existingConnection, error: checkError } = await supabaseAdmin
      .from('networks')
      .select('id, status')
      .or(`and(user_id.eq.${currentUserId},target_user_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},target_user_id.eq.${currentUserId})`)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Connection already exists', connection: existingConnection },
        { status: 409 }
      );
    }

    // Create new connection request
    const { data: newConnection, error } = await supabaseAdmin
      .from('networks')
      .insert({
        user_id: currentUserId,
        target_user_id: targetUserId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    
    console.log('Connection created successfully:', newConnection);
    return NextResponse.json(newConnection);

  } catch (error) {
    console.error('Create connection error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }, 
      { status: 500 }
    );
  }
}