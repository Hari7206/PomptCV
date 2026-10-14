import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { GetCurrentUser } from "@/lib/getCurrentUser";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
    try{
        await connectDB();

        let userId = await GetCurrentUser();


        let newResume = await ResumeModel.create({
            userId: userId,
            title: "",
            summary: "",
            personalInfo: {},
            workExperience: [],
            projects: [],
            education: [], 
            certifications: [],
            skills: []
        });

        return NextResponse.json<ApiResponse>({
            success:true,
            message: "Resume created successfully",
            data: newResume
        } , 
    {status: 201}
);

    } catch (error) {
        console.error("error in create resume api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to create resume",
        }, {status: 500})
    }
}
