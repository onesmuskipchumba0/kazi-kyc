//api/network/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('=== NETWORK API CALLED ===');
    
    // Check if supabaseAdmin exists
    if (!supabaseAdmin) {
      console.error('supabaseAdmin is null');
      return NextResponse.json({ error: 'Server configuration error: supabaseAdmin not found' }, { status: 500 });
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

  console.log('Connections query result:', { connections, error });

  if (error) {
    console.error('Error fetching connections:', error);
    throw error;
  }

  data = connections || [];
  console.log('Found connections:', data.length);
} else if (type === 'requests') {
      console.log('Fetching requests for user:', userId);
      // Get pending requests where current user is the target
      const { data: requests, error } = await supabaseAdmin
        .from('networks')
        .select('id, user_id')
        .eq('target_user_id', userId)
        .eq('status', 'pending');

      console.log('Requests query result:', { requests, error });
      
      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }
      data = requests || [];
      console.log('Found requests:', data.length);

    } else if (type === 'discover') {
      console.log('Fetching discover users for user:', userId);
      // Get users not connected to current user
      const { data: existingConnections, error } = await supabaseAdmin
        .from('networks')
        .select('target_user_id')
        .eq('user_id', userId);

      console.log('Existing connections:', existingConnections, error);
      
      if (error) {
        console.error('Error fetching existing connections:', error);
        throw error;
      }

      const excludedIds = [userId, ...(existingConnections?.map(conn => conn.target_user_id) || [])];
      console.log('Excluded IDs:', excludedIds);

      // Get random users not in excluded list
      const { data: users, error: usersError } = await supabaseAdmin
        .from('user')
        .select('public_id')
        .not('public_id', 'in', `(${excludedIds.join(',')})`)
        .limit(10);

      console.log('Discover users query result:', { users, usersError });
      
      if (usersError) {
        console.error('Error fetching discover users:', usersError);
        throw usersError;
      }
      data = users?.map(u => ({ user_id: u.public_id })) || [];
      console.log('Found discover users:', data.length);
    }

    console.log('Returning data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Network table API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('=== NETWORK POST API CALLED ===');
    
    // Check if supabaseAdmin exists
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error: supabaseAdmin not found' }, { status: 500 });
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
      .eq('user_id', currentUserId)
      .eq('target_user_id', targetUserId)
      .single();

    console.log('Existing connection check:', { existingConnection, checkError });

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingConnection) {
      return NextResponse.json({ 
        error: 'Connection already exists', 
        connection: existingConnection 
      }, { status: 409 });
    }

    // Create new connection request
    const { data: newConnection, error } = await supabaseAdmin
      .from('networks')
      .insert({
        user_id: currentUserId,
        target_user_id: targetUserId,
        status: 'pending'
      })
      .select()
      .single();

    console.log('New connection created:', { newConnection, error });

    if (error) throw error;

    return NextResponse.json(newConnection);
  } catch (error) {
    console.error('Create connection error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}