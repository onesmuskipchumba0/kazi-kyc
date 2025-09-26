import { NextResponse, NextRequest } from "next/server";



export async function POST(req: NextRequest) {
  try{
    const body = await req.json();
    const { public_id, email, job } = body;

    return NextResponse.json({ user_id: public_id, email: email, job: job}, {status: 200});

  } catch (err){
    return NextResponse.json({ error: err}, { status: 500})
  }

  
}