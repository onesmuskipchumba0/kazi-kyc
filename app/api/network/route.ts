import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if supabaseAdmin exists
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error: supabaseAdmin not found' }, { status: 500 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');

    if (!type || !userId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let data: any[] = [];

    if (type === 'connections') {
      // Get accepted connections
      const { data: connections, error } = await supabaseAdmin
        .from('networks')
        .select('target_user_id')
        .eq('user_id', userId)
        .eq('status', 'accepted');

      if (error) throw error;
      data = connections || [];
    } else if (type === 'requests') {
      // Get pending requests where current user is the target
      const { data: requests, error } = await supabaseAdmin
        .from('networks')
        .select('id, user_id')
        .eq('target_user_id', userId)
        .eq('status', 'pending');

      if (error) throw error;
      data = requests || [];
    } else if (type === 'discover') {
      // Get users not connected to current user
      const { data: existingConnections, error } = await supabaseAdmin
        .from('networks')
        .select('target_user_id')
        .eq('user_id', userId);

      if (error) throw error;

      const excludedIds = [userId, ...(existingConnections?.map(c => c.target_user_id) || [])];

      // Get random users not in excluded list
      const { data: users, error: usersError } = await supabaseAdmin
        .from('users')
        .select('public_id')
        .not('public_id', 'in', `(${excludedIds.join(',')})`)
        .limit(10);

      if (usersError) throw usersError;
      data = users?.map(u => ({ userId: u.public_id })) || [];
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Network table API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if supabaseAdmin exists
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error: supabaseAdmin not found' }, { status: 500 });
    }

    const { currentUserId, targetUserId } = await request.json();

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

    if (error) throw error;

    return NextResponse.json(newConnection);
  } catch (error) {
    console.error('Create connection error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}