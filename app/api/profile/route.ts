import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient"; // Use admin client
import { currentUser } from "@clerk/nextjs/server";

export async function GET(){
    try{
        const user = await currentUser();
        if(!user?.emailAddresses[0]?.emailAddress){
            return NextResponse.json({ error: "No email found"}, {status: 400})
        }
        const email = user.emailAddresses[0].emailAddress;

        //Query supabase for the user with that email
        const { data, error } = await supabaseAdmin
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
            coreSkills,
            profileType,
            companyName,
            employeesCount,
            projectsCompleted,
            avatarURL,
        } = body;

        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabaseAdmin
            .from("user")
            .select("id")
            .eq("email", email_)
            .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
            return NextResponse.json({ error: checkError.message }, {status: 500});
        }

        let result;
        if (existingUser) {
            // Update existing user
            const {data, error} = await supabaseAdmin
                .from("user")
                .update({
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
                    coreSkills: coreSkills,
                    profileType: profileType,
                    companyName: companyName,
                    employeesCount: employeesCount,
                    projectsCompleted: projectsCompleted,
                    avatarUrl: avatarURL,
                })
                .eq("email", email_)
                .select();
            
            result = {data, error};
        } else {
            // Insert new user
            const {data, error} = await supabaseAdmin
                .from("user")
                .insert([{
                    email: email_,
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
                    coreSkills: coreSkills,
                    profileType: profileType,
                    companyName: companyName,
                    employeesCount: employeesCount,
                    projectsCompleted: projectsCompleted,
                    avatarUrl: avatarURL,
                }])
                .select();
            
            result = {data, error};
        }

        if(result.error) {
            return NextResponse.json({ error: result.error.message }, {status: 400});
        }

        return NextResponse.json( { data: result.data }, { status: 201});
    } catch(error: any){
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}