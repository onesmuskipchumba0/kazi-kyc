// app/api/jobs/[id]/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.emailAddresses[0].emailAddress;
    const jobId = params.id;

    // Check if user exists and is a worker
    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('public_id, profileType')
      .eq('email', userEmail)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userData.profileType !== 'worker') {
      return NextResponse.json({ error: 'Only workers can apply to jobs' }, { status: 403 });
    }

    // Check if job exists
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if already applied
    const { data: existingApplication } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('worker_id', userData.public_id)
      .single();

    if (existingApplication) {
      return NextResponse.json({ error: 'Already applied to this job' }, { status: 400 });
    }

    // Create application
    const { data: application, error: applicationError } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        worker_id: userData.public_id,
        status: 'pending'
      })
      .select()
      .single();

    if (applicationError) {
      console.error('Application error:', applicationError);
      return NextResponse.json({ error: 'Failed to apply to job' }, { status: 500 });
    }

    // Update applicants count
    await supabase
      .from('jobs')
      .update({ applicants_count: job.applicants_count + 1 })
      .eq('id', jobId);

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}