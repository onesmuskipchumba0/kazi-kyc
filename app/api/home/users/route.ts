import { peopleData } from "@/app/api/home/homePage";
import { NextResponse } from "next/server";


export async function GET(){
    return NextResponse.json(peopleData)
}