import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import {
    GetCurrentUser,
    isAuthenticationFailure,
} from "@/lib/getCurrentUser";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
    try{
        await connectDB();

        const userId = await GetCurrentUser();
        const body = await req.json();


        const newResume = await ResumeModel.create({
            userId: userId,
            title: body.title || "",
            jobTitle: body.jobTitle || "",
            experienceLevel: body.experienceLevel || "Fresher",
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
        if (isAuthenticationFailure(error)) {
            const response = NextResponse.json<ApiResponse>(
                { success: false, message: error.message },
                { status: error.statusCode }
            );
            response.cookies.delete("token");
            return response;
        }

        console.error("error in create resume api", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Failed to create resume",
        }, {status: 500})
    }
}
