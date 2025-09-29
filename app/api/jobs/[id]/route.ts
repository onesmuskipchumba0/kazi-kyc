import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job_id = params.id;

    if(!supabaseAdmin){
        return NextResponse.json({ error: "Supabase client not intialized"}, { status: 500})
    }
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: `An error occurred while fetching job: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ job: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
){
    try {
    const { id } = await params;
    const userRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
        headers: Object.fromEntries(request.headers)
    })
    const user = userRes.data.user;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase client not initialized" },
        { status: 500 }
      );
    }

    // fetch the application
    const { data: job, error: fetchError } = await supabaseAdmin
    .from("jobs")
    .select("employer_id")
    .eq("id", id)
    .single();

    if (fetchError || !job) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (job.employer_id !== user.public_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from("jobs")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: `Jobs made by user ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}