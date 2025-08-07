import { peopleData } from "@/app/api/homePage";
import { NextResponse } from "next/server";


export async function GET(){
    return NextResponse.json(peopleData)
}