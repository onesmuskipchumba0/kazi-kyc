import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import axios from "axios";

export async function GET(req: NextRequest, {params}: { params: Promise<{ id: string }>}) {
    try{
        const {id: application_id} =await params;

        if(!supabaseAdmin) return NextResponse.json({ error: "Supabase client not intialized."}, { status: 401});
        const { data, error } = await supabaseAdmin
        .from("applications")
        .select("*")
        .eq("id", application_id)
        .single()

        if( error ) return NextResponse.json({ error: "An error occured while fetching data"}, { status: 404 });
        return NextResponse.json({ application: data }, { status: 200 });
        
    }   catch(err: any){
        return NextResponse.json({ error: err.message}, { status: 500 })
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

    // fetch the user

    // fetch the application
    const { data: application, error: fetchError } = await supabaseAdmin
    .from("applications")
    .select("applicant_id")
    .eq("id", id)
    .single();

    if (fetchError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.applicant_id !== user.public_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: `Applications for user ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}