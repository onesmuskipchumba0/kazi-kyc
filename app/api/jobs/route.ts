import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

// Get all jobs
export async function GET() {
  if (!supabaseAdmin) {
       return NextResponse.json({ error: "Internal server error" }, { status: 500 });
     }
  const { data, error } = await supabaseAdmin.from("jobs").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ jobs: data }, { status: 200 });
}

// Post a new job
export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    console.error("Supabase admin client not initialized");
    return NextResponse.json(
      { error: "Server configuration error" }, 
      { status: 500 }
    );
  }
  
  try {
    const body = await req.json();
    
    // Add validation for required fields
    if (!body.public_id || !body.job) {
      return NextResponse.json(
        { error: "Missing required fields: public_id and job" },
        { status: 400 }
      );
    }
    
    const { public_id, job } = body;

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .insert({
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        pay_rate: job.pay_rate,
        pay_type: job.pay_type,
        urgent: job.urgent,
        status: job.status,
        location: job.location,
        category: job.category,
        employer_id: public_id,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Job posted successfully", job: data, user_id: public_id },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
