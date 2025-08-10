import { NextResponse } from "next/server";
import { featuredJobs } from "./workData";

export default function GET(){
    return NextResponse.json(featuredJobs)
}