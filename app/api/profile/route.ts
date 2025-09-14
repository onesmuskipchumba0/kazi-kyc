import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST( req: Request){
    try{
        const body = await req.json();
        const { 
            email,
            firstName,
            lastName,
            phoneNumber,
            location,
            description,
            jobsCompleted,
            hourlyRate,
            responseTime,
            completionRate,
            experience,
            availability,
            responseRate,
            languages,
            constact,
            coreSkills,
            profileType,
            companyName,
            employeesCount,
            projectsCompleted,
            avatarURL
        } = body;

        const {data, error} = await supabase
        .from("user")
        .insert([{
            email,
            firstName,
            lastName,
            phoneNumber,
            location,
            description,
            jobsCompleted,
            hourlyRate,
            responseTime,
            completionRate,
            experience,
            availability,
            responseRate,
            languages,
            constact,
            coreSkills,
            profileType,
            companyName,
            employeesCount,
            projectsCompleted,
            avatarURL
        }])
        .select();

        if(error) {
            return NextResponse.json({ error: error.message }, {status: 400});
        }

        return NextResponse.json( { data }, { status: 201});
    } catch(error: any){
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}