import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { supabaseAdmin } from "@/lib/supabaseClient";

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