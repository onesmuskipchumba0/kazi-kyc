// app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/jobs - Get all jobs (with filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const urgent = searchParams.get('urgent');

    let query = supabase
      .from('jobs')
      .select(`
        *,
        user:employer_id (
          firstName,
          lastName,
          profileType,
          location,
          connections
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // Apply filters
    if (category && category !== 'All Jobs') {
      query = query.eq('category', category);
    }
    if (location && location !== 'All Locations') {
      query = query.ilike('location', `%${location}%`);
    }
    if (urgent === 'true') {
      query = query.eq('urgent', true);
    }

    const { data: jobs, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/jobs - Create a new job (employers only)
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    // Check if user exists and is an employer
    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('public_id, profileType')
      .eq('email', userEmail)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userData.profileType !== 'employer') {
      return NextResponse.json({ error: 'Only employers can post jobs' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      category,
      location,
      description,
      requirements,
      payRate,
      payType,
      urgent = false
    } = body;

    // Validate required fields
    if (!title || !category || !location || !description || !payRate || !payType) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Create job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        title,
        employer_id: userData.public_id,
        category,
        location,
        description,
        requirements: requirements || [],
        pay_rate: payRate,
        pay_type: payType,
        urgent: urgent || false
      })
      .select()
      .single();

    if (jobError) {
      console.error('Job creation error:', jobError);
      return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}