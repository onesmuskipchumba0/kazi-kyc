import { NextResponse, NextRequest } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(
    req: NextRequest, 
    { params }: {params: Promise<{job_id: string}>}
) {
    try{
        const { job_id } =await params;
        if(!supabaseAdmin) return NextResponse.json( { error: "Supabase admin not initialized" }, { status: 403 });
        if(!job_id) return NextResponse.json({ error: "No parameters"}, { status: 500 });

        const {data, error } = await supabaseAdmin
        ?.from("applications")
        .select("*")
        .eq("job_id", job_id)

        if(error) return NextResponse.json({ error: error.message}, { status: 500});
        return NextResponse.json({ applications: data }, { status: 200 })
    } catch( err: any ){
        return NextResponse.json( { error: err.message }, { status: 500})
    }
}