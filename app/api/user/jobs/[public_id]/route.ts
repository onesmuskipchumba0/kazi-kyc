import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ public_id: string}>}
){
    const { public_id } = await params;
    try{
        if(!supabaseAdmin) return NextResponse.json({ error: `Supabase admin not initialized`}, { status: 500});
        const { data, error } = await supabaseAdmin
        ?.from("jobs")
        .select("*")
        .eq("employer_id", public_id);

        if( error ) return NextResponse.json({ error: `NO jobs found. ${error.message}`}, { status: 404});

        // returns an array
        return NextResponse.json({ jobs: data }, { status: 200});
    } catch(err: any){
        return NextResponse.json({ error: `An error occured while fetching job for user ${public_id}: ${err.message}`}, { status: 404})
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{public_id: string}>}
) {
    try{
        const { public_id } = await params;
        if(!supabaseAdmin) return NextResponse.json({ error: `Supabase admin not initialized`}, { status: 500});
        const { error } = await supabaseAdmin
        ?.from("jobs")
        .delete()
        .eq("employer_id", public_id);

        if( error ) return NextResponse.json({ error: `Error deleting job. ${error.message}`}, { status: 500});

        // returns an array
        return NextResponse.json({ message: `Job ${public_id} was deleted successfully` }, { status: 200});

    } catch(err: any){
        return NextResponse.json( { error: err.message}, { status: 500 })
    }
    
}