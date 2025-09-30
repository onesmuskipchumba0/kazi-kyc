// api/network/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// api/network/route.ts
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server configuration error: supabaseAdmin not found' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');

    if (!type || !userId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let data: any[] = [];

    if (type === 'connections' || type === 'network') {
      const { data: connections, error } = await supabaseAdmin
        .from('networks')
        .select('*')
        .eq('status', 'accepted')
        .or(`user_id.eq.${userId},target_user_id.eq.${userId}`);

      if (error) throw error;
      data = connections || [];

    } else if (type === 'requests') {
      // FIXED: Return all fields needed by the frontend
      const { data: requests, error } = await supabaseAdmin
        .from('networks')
        .select('*')  // Changed from 'id, user_id' to '*'
        .eq('user_id', userId)
        .eq('status', 'pending');

      if (error) throw error;
      data = requests || [];

    } else if (type === 'discover') {
      // Get existing connections and requests to exclude
      const { data: existingConnections, error: connectionsError } = await supabaseAdmin
        .from('networks')
        .select('user_id, target_user_id')
        .or(`user_id.eq.${userId},target_user_id.eq.${userId}`);

      if (connectionsError) {
        throw connectionsError;
      }

      // Create set of excluded user IDs
      const excludedIds = new Set([userId]);
      existingConnections?.forEach(conn => {
        excludedIds.add(conn.user_id);
        excludedIds.add(conn.target_user_id);
      });

      // Build the query for discover users
      let query = supabaseAdmin
        .from('user')
        .select('public_id, name, avatarUrl, location, experience, coreSkills')
        .neq('public_id', userId)
        .limit(20);

      Array.from(excludedIds).forEach(excludedId => {
        if (excludedId !== userId) {
          query = query.neq('public_id', excludedId);
        }
      });

      const { data: users, error: usersError } = await query;

      if (usersError) {
        throw usersError;
      }

      data = users || [];
      
      if (data.length === 0) {
        const { data: fallbackUsers, error: fallbackError } = await supabaseAdmin
          .from('user')
          .select('public_id, name, avatarUrl, location, experience, coreSkills')
          .neq('public_id', userId)
          .limit(10);
          
        if (!fallbackError) {
          data = fallbackUsers || [];
        }
      }

    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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