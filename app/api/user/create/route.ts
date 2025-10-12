// app/api/user/create/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { currentUser } from "@clerk/nextjs/server";

const DEFAULT_USER_VALUES = {
  phoneNumber: "",
  location: "",
  description: "No description available",
  jobsCompleted: 0,
  hourlyRate: 0,
  responseTime: 24,
  completionRate: 100,
  experience: "",
  availability: "Available",
  responseRate: 100,
  languages: [],
  coreSkills: [],
  profileType: "worker",
  companyName: "",
  employeesCount: 0,
  projectsCompleted: 0,
  rating: 4.5,
  earnings: 0,
  profileViews: 0
};

export async function POST() {
  try {
    const user = await currentUser();
    if (!user?.emailAddresses[0]?.emailAddress) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }
    
    const email = user.emailAddresses[0].emailAddress;
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const clerkId = user.id;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("user")
      .select("id")
      .eq("email", email)
      .single();

    // If user doesn't exist, create one
    if (checkError && checkError.code === 'PGRST116') {
      console.log('Creating new user after sign-in...');
      
      const newUserData = {
        ...DEFAULT_USER_VALUES,
        email: email,
        firstName: firstName,
        lastName: lastName,
        id: clerkId,
        avatarUrl: user.imageUrl || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newUser, error: createError } = await supabaseAdmin
        .from("user")
        .insert([newUserData])
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json({ error: `Failed to create user: ${createError.message}` }, { status: 500 });
      }

      console.log('New user created successfully after sign-in');
      return NextResponse.json({ user: newUser, created: true }, { status: 201 });
    }

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    return NextResponse.json({ user: existingUser, created: false }, { status: 200 });
  } catch (error: any) {
    console.error('Error in user creation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}