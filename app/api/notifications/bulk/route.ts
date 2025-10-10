// app/api/notifications/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, read } = body;

    if (!userId || typeof read !== 'boolean') {
      return NextResponse.json(
        { error: 'User ID and read status are required' },
        { status: 400 }
      );
    }

        if(!supabaseAdmin) return NextResponse.json({ error: "Supabase client not initialized"}, { status: 403})

    // Mark all notifications as read
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .update({ read })
      .eq('user_id', userId)
      .eq('read', !read) // Only update ones that need changing
      .select();

    if (error) {
      console.error('Error bulk updating notifications:', error);
      return NextResponse.json(
        { error: 'Failed to update notifications' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      updatedCount: notifications?.length || 0,
      notifications: notifications || []
    });
  } catch (error) {
    console.error('Error in bulk notifications API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}