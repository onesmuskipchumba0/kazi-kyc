import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { currentUser } from "@clerk/nextjs/server";

// Default values for new users
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
  rating: 0,
  earnings: 0,
};

export async function GET() {
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

    // Query supabase for the user with that email
    const { data, error } = await supabaseAdmin
      .from("user")
      .select("*")
      .eq("email", email)
      .single();

    // If user doesn't exist, create one with default values
    if (error && error.code === 'PGRST116') { // PGRST116 = no rows found
      console.log('User not found, creating new user with default values...');
      
      const newUserData = {
        ...DEFAULT_USER_VALUES, // Spread defaults first
        email: email,
        firstName: firstName,
        lastName: lastName,
        avatarUrl: user.imageUrl || "", // Set avatarUrl after spreading defaults
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

      console.log('New user created successfully with default values');
      return NextResponse.json({ user: newUser }, { status: 200 });
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data }, { status: 200 });
  } catch (error: any) {
    console.error('Error in profile GET:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email_ = user.emailAddresses[0].emailAddress;
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const clerkId = user.id;

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
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 });
    }

    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("user")
      .select("id")
      .eq("email", email_)
      .single();

    let result;

    if (checkError && checkError.code === 'PGRST116') {
      // User doesn't exist, create with provided data or defaults
      const userData = {
        ...DEFAULT_USER_VALUES, // Spread defaults first
        email: email_,
        firstName: firstName,
        lastName: lastName,
        id: clerkId,
        avatarUrl: avatarURL || user.imageUrl || "", // Set avatarUrl after spreading defaults
        // Override defaults with provided values
        phoneNumber: phoneNumber !== undefined ? phoneNumber : DEFAULT_USER_VALUES.phoneNumber,
        location: location !== undefined ? location : DEFAULT_USER_VALUES.location,
        description: description !== undefined ? description : DEFAULT_USER_VALUES.description,
        jobsCompleted: jobsCompleted !== undefined ? jobsCompleted : DEFAULT_USER_VALUES.jobsCompleted,
        hourlyRate: hourlyRate !== undefined ? hourlyRate : DEFAULT_USER_VALUES.hourlyRate,
        responseTime: responseTime !== undefined ? responseTime : DEFAULT_USER_VALUES.responseTime,
        completionRate: completionRate !== undefined ? completionRate : DEFAULT_USER_VALUES.completionRate,
        experience: experience !== undefined ? experience : DEFAULT_USER_VALUES.experience,
        availability: availability !== undefined ? availability : DEFAULT_USER_VALUES.availability,
        responseRate: responseRate !== undefined ? responseRate : DEFAULT_USER_VALUES.responseRate,
        languages: languages !== undefined ? languages : DEFAULT_USER_VALUES.languages,
        coreSkills: coreSkills !== undefined ? coreSkills : DEFAULT_USER_VALUES.coreSkills,
        profileType: profileType !== undefined ? profileType : DEFAULT_USER_VALUES.profileType,
        companyName: companyName !== undefined ? companyName : DEFAULT_USER_VALUES.companyName,
        employeesCount: employeesCount !== undefined ? employeesCount : DEFAULT_USER_VALUES.employeesCount,
        projectsCompleted: projectsCompleted !== undefined ? projectsCompleted : DEFAULT_USER_VALUES.projectsCompleted,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabaseAdmin
        .from("user")
        .insert([userData])
        .select();

      result = { data, error };
    } else if (existingUser) {
      // Update existing user
      const updateData: any = {
        firstName: firstName,
        lastName: lastName,
        updated_at: new Date().toISOString()
      };

      // Only update fields that are provided
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (location !== undefined) updateData.location = location;
      if (description !== undefined) updateData.description = description;
      if (jobsCompleted !== undefined) updateData.jobsCompleted = jobsCompleted;
      if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
      if (responseTime !== undefined) updateData.responseTime = responseTime;
      if (completionRate !== undefined) updateData.completionRate = completionRate;
      if (experience !== undefined) updateData.experience = experience;
      if (availability !== undefined) updateData.availability = availability;
      if (responseRate !== undefined) updateData.responseRate = responseRate;
      if (languages !== undefined) updateData.languages = languages;
      if (coreSkills !== undefined) updateData.coreSkills = coreSkills;
      if (profileType !== undefined) updateData.profileType = profileType;
      if (companyName !== undefined) updateData.companyName = companyName;
      if (employeesCount !== undefined) updateData.employeesCount = employeesCount;
      if (projectsCompleted !== undefined) updateData.projectsCompleted = projectsCompleted;
      if (avatarURL !== undefined) updateData.avatarUrl = avatarURL;

      const { data, error } = await supabaseAdmin
        .from("user")
        .update(updateData)
        .eq("email", email_)
        .select();

      result = { data, error };
    } else if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (result?.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({ data: result?.data }, { status: 201 });
  } catch (error: any) {
    console.error('Error in profile POST:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}