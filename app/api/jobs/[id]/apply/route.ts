// app/api/jobs/[id]/apply/route.ts
import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  try {
    const {id: jobId} = await params;
    const body = await req.json();
    const { applicant_id, cover_letter } = body;

    if (!applicant_id) {
      return NextResponse.json({ error: "Applicant ID is required" }, { status: 400 });
    }

    // Check if job exists
    const { data: job, error: jobError } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: `Job not found. ${jobError?.message}` }, { status: 404 });
    }

    // Check if user has already applied
    const { data: existingApplication } = await supabaseAdmin
      .from("applications")
      .select("*")
      .eq("job_id", jobId)
      .eq("applicant_id", applicant_id)
      .single();

    if (existingApplication) {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 400 });
    }

    // Create application
    const { data, error } = await supabaseAdmin
      .from("applications")
      .insert({
        job_id: jobId,
        applicant_id: applicant_id,
        cover_letter: cover_letter || "",
        status: "pending",
        applied_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { 
        message: "Application submitted successfully", 
        application: data 
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}