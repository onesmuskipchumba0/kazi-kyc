import { NextResponse } from "next/server";
import { recentPosts } from "../homePage"

export async function GET(){
    return NextResponse.json(recentPosts)
}