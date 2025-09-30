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

// Alternative PATCH method without complex join
export async function PATCH(req: NextRequest, {params}: { params: Promise<{ id: string }>}) {
    try {
        console.log("PATCH request received for application update");
        const {id: application_id} = await params;
        console.log("Application ID:", application_id);
        
        // Get the request body
        const body = await req.json();
        const { status } = body;
        console.log("Request body:", body);

        // Validate the status
        const allowedStatuses = ['pending', 'accepted', 'rejected', 'interviewing'];
        if (!status || !allowedStatuses.includes(status)) {
            console.log("Invalid status:", status);
            return NextResponse.json({ 
                error: "Invalid status. Must be one of: pending, accepted, rejected, interviewing" 
            }, { status: 400 });
        }

        // Get the current user (job poster)
        console.log("Fetching user data...");
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
            headers: Object.fromEntries(req.headers)
        });
        const user = userRes.data.user;
        console.log("User data:", user);

        if (!supabaseAdmin) {
            console.error("Supabase client not initialized");
            return NextResponse.json(
                { error: "Supabase client not initialized" },
                { status: 500 }
            );
        }

        // First, get the application with job_id
        console.log("Fetching application data...");
        const { data: application, error: fetchError } = await supabaseAdmin
            .from("applications")
            .select("id, job_id, status")
            .eq("id", application_id)
            .single();

        if (fetchError || !application) {
            console.error("Error fetching application:", fetchError);
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        console.log("Application data:", application);

        // Now get the job to check ownership
        const { data: job, error: jobError } = await supabaseAdmin
            .from("jobs")
            .select("employer_id")
            .eq("id", application.job_id)
            .single();

        if (jobError || !job) {
            console.error("Error fetching job:", jobError);
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        console.log("Job data:", job);

        // Check if the current user is the employer who posted the job
        if (job.employer_id !== user.public_id) {
            console.log("User is not the employer. User:", user.public_id, "Employer:", job.employer_id);
            return NextResponse.json({ 
                error: "Forbidden: You can only update applications for your own jobs" 
            }, { status: 403 });
        }

        // Update the application status
        console.log("Updating application status to:", status);
        const { data: updatedApplication, error: updateError } = await supabaseAdmin
            .from("applications")
            .update({ 
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq("id", application_id)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating application:", updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        console.log("Application updated successfully:", updatedApplication);
        return NextResponse.json({ 
            message: `Application status updated to ${status}`,
            application: updatedApplication 
        }, { status: 200 });

    } catch (err: any) {
        console.error("Unexpected error in PATCH handler:", err);
        return NextResponse.json({ 
            error: err.message || "Unexpected error occurred" 
        }, { status: 500 });
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