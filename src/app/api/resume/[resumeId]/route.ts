import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import { connectDB } from "@/lib/mongodb";
import { GetCurrentUser } from "@/lib/getCurrentUser";
import ResumeModel from "@/models/Resume.model";




export async function GET(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
    try {
        await connectDB();

        const user = await GetCurrentUser();
        const { resumeId } = await params;

        const resume = await ResumeModel.findOne({ _id: resumeId, userId: user });

        if (!resume) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Resume not found",
            }, { status: 404 })
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume fetched successfully",
            data: { resume },
        }, { status: 200 })


    } catch (error) {
        console.log("error in GET resume", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to fetch resume",
        }, { status: 500 })
    }
}



export async function PATCH(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
    try {
        await connectDB();

        const user = await GetCurrentUser();
        const body = await req.json();

        const { resumeId } = await params;

        const updatedResume = await ResumeModel.findOneAndUpdate(
            {
                _id: resumeId
                , userId: user
            },
             {
                $set: body
             },
            { 
                new: true,
                runValidators: true
             }
        );


        if (!updatedResume) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "updated resume failed to update",
            }, { status: 404 })
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume updated successfully",
            data: { resume: updatedResume },
        }, { status: 200 })


    } catch (error) {
        console.log("error in PATCH resume", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to update resume",
        }, { status: 500 })
    }
}