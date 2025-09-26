import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(req: NextRequest, { params }: {params: {public_id: string}}) {
    try{
        const { public_id } =  params;
        const user = await currentUser();

        if(!user) return NextResponse.json({ error: "No user found"}, { status: 400 });
        const email = user.primaryEmailAddress?.emailAddress

        if(!supabaseAdmin){
            console.error("Supabase admin client not found");
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    
        }
        const { data, error } = await supabaseAdmin
        .from("user")
        .select("public_id, email, firstName, lastName, phoneNumber, profileType")
        .eq("public_id", public_id)
        .single(); // force exactly one row

        if (error) {
        console.error("Supabase query error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ user: data}, {status: 500})
    }  catch(err: any){
         console.error("Route error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}