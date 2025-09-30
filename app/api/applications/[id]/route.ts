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

export async function PATCH(req: NextRequest, {params}: { params: Promise<{ id: string }>}) {
    try {
        const {id: application_id} = await params;
        
        if (!application_id) {
            return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
        }

        // Get the request body
        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        // Validate the status
        const allowedStatuses = ['pending', 'accepted', 'rejected', 'interviewing', 'completed'];
        if (!allowedStatuses.includes(status)) {
            return NextResponse.json({ 
                error: `Invalid status: ${status}. Must be one of: ${allowedStatuses.join(', ')}` 
            }, { status: 400 });
        }

        // Get the current user
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
            headers: Object.fromEntries(req.headers)
        });
        
        if (!userRes.data || !userRes.data.user) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }
        
        const user = userRes.data.user;

        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: "Supabase client not initialized" },
                { status: 500 }
            );
        }

        // First, get the application
        const { data: application, error: fetchError } = await supabaseAdmin
            .from("applications")
            .select("id, job_id, status, applicant_id")
            .eq("id", application_id)
            .single();

        if (fetchError) {
            return NextResponse.json({ error: `Failed to fetch application: ${fetchError.message}` }, { status: 404 });
        }

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Check authorization based on who is making the request and what status they're trying to set
        let isAuthorized = false;

        // If user is the APPLICANT, they can only set status to 'completed'
        if (application.applicant_id === user.public_id) {
            if (status === 'completed') {
                isAuthorized = true;
            } else {
                return NextResponse.json({ 
                    error: "Applicants can only mark applications as completed" 
                }, { status: 403 });
            }
        } 
        // If user is the EMPLOYER, they can set status to other values
        else {
            const { data: job, error: jobError } = await supabaseAdmin
                .from("jobs")
                .select("employer_id")
                .eq("id", application.job_id)
                .single();

            if (jobError) {
                return NextResponse.json({ error: `Failed to fetch job: ${jobError.message}` }, { status: 404 });
            }

            if (!job) {
                return NextResponse.json({ error: "Job not found" }, { status: 404 });
            }

            if (job.employer_id === user.public_id) {
                // Employers can set: pending, accepted, rejected, interviewing
                if (['pending', 'accepted', 'rejected', 'interviewing'].includes(status)) {
                    isAuthorized = true;
                } else {
                    return NextResponse.json({ 
                        error: "Employers cannot mark applications as completed" 
                    }, { status: 403 });
                }
            } else {
                return NextResponse.json({ 
                    error: "You can only update your own applications or applications for your own jobs" 
                }, { status: 403 });
            }
        }

        if (!isAuthorized) {
            return NextResponse.json({ 
                error: "Forbidden: You don't have permission to perform this action" 
            }, { status: 403 });
        }

        // Update the application status
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
            return NextResponse.json({ error: `Failed to update application: ${updateError.message}` }, { status: 500 });
        }

        return NextResponse.json({ 
            message: `Application status updated to ${status}`,
            application: updatedApplication 
        }, { status: 200 });

    } catch (err: any) {
        console.error("PATCH application error:", err);
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