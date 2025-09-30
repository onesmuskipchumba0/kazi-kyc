// api/network/actions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('=== NETWORK ACTIONS API CALLED ===');
    
    // Check if supabaseAdmin exists
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error: supabaseAdmin not found' }, { status: 500 });
    }

    const { action, requestId } = await request.json();
    console.log('Network action:', { action, requestId });

    if (!action || !requestId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (action === 'accept') {
      console.log('Accepting connection request:', requestId);
      // Accept connection request
      const { data: updatedConnection, error } = await supabaseAdmin
        .from('networks')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .select()
        .single();

      console.log('Accept connection result:', { updatedConnection, error });

      if (error) throw error;
      return NextResponse.json(updatedConnection);

    } else if (action === 'reject') {
      console.log('Rejecting connection request:', requestId);
      // Reject connection request (delete it)
      const { error } = await supabaseAdmin
        .from('networks')
        .delete()
        .eq('id', requestId);

      console.log('Reject connection result:', { error });

      if (error) throw error;
      return NextResponse.json({ success: true });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Network action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}