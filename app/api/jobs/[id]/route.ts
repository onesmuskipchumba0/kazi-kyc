import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

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
