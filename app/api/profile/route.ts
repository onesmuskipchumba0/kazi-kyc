import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { currentUser } from "@clerk/nextjs/server";

export async function Get(){
    try{
        const user = await currentUser();
        if(!user?.emailAddresses[0]?.emailAddress){
            return NextResponse.json({ error: "No email found"}, {status: 400})
        }
        const email = user.emailAddresses[0].emailAddress;


        //Query supabase for the user with that email

        const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("email", email)
        .single()

        if( error ){
            return NextResponse.json({ error: error.message}, { status: 500})
        }

        return NextResponse.json({user: data}, {status: 200})
    }catch(error: any){
        return NextResponse.json({error: error.message},{status: 500})
    }
}
export async function POST( req: Request){
    
    try{
        const user = await currentUser();
        const body = await req.json();

        if(!user){
            return NextResponse.json({ error: "Unauthorized" } , {status: 401})
        }
        const email_ = user.emailAddresses[0].emailAddress; 
        const firstName = user.firstName;
        const lastName = user.lastName;
        const {
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
            contact,
            coreSkills,
            profileType,
            companyName,
            employeesCount,
            projectsCompleted,
            avatarURL,
          } = body;

        const {data, error} = await supabase
        .from("user")
        .insert([{
            mail: email_,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            location,
            description,
            jobsCompleted: jobsCompleted,
            hourlyRate: hourlyRate,
            responseTime: responseTime,
            completionRate: completionRate,
            experience,
            availability,
            responseRate: responseRate,
            languages,
            contact,
            coreSkills: coreSkills,
            profileType: profileType,
            companyName: companyName,
            employeesCount: employeesCount,
            projectsCompleted: projectsCompleted,
            avatarUrl: avatarURL,
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