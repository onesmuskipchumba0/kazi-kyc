import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." 
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 5MB." 
      }, { status: 400 });
    }

    console.log('Portfolio image file received:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `portfolio-${user.id}-${Date.now()}.${fileExt}`;

    console.log('Generated filename:', fileName);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Buffer size:', buffer.length);

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      console.error('supabaseAdmin is not available');
      return NextResponse.json({ error: "Supabase admin client not available" }, { status: 500 });
    }

    // Upload using admin client to portfolio bucket
    console.log('Attempting upload to bucket: portfolio');
    const { data, error } = await supabaseAdmin.storage
      .from('portfolio')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    console.log('Upload result:', { data, error });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('portfolio')
      .getPublicUrl(fileName);

    console.log('Public URL:', publicUrl);

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
