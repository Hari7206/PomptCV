import {
    GetCurrentUser,
    isAuthenticationFailure,
} from "@/lib/getCurrentUser";
import { connectDB } from "@/lib/mongodb";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ resumeId: string }> }
) {
    try {
        await connectDB();

        const userId = await GetCurrentUser();

        const { resumeId } = await params;
        if (!mongoose.isValidObjectId(resumeId)) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Invalid resume ID" },
                { status: 400 }
            );
        }

        const resume = await ResumeModel.findOne({
            _id: resumeId,
            userId,
        });

        if (!resume)
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: "Resume not found",
                },
                { status: 404 }
            );

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                message: "Resume fetched successfully",
                data: resume,
                resume,
            },
            { status: 200 }
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

        console.error("error in get resume api", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ resumeId: string }> }
) {
    try {
        await connectDB();

        const userId = await GetCurrentUser();

        const body = await req.json();
        const { resumeId } = await params;
        if (!mongoose.isValidObjectId(resumeId)) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Invalid resume ID" },
                { status: 400 }
            );
        }

        const updatedResume = await ResumeModel.findOneAndUpdate(
            {
                _id: resumeId,
                userId,
            },
            {
                $set: body,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedResume)
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: "resume failed to update",
                },
                { status: 400 }
            );

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                message: "Resume updated successfully",
                data: updatedResume,
            },
            { status: 200 }
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

        console.error("error in updatedResume api", error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ resumeId: string }> }
) {
    try {
        await connectDB();
        const userId = await GetCurrentUser();
        const { resumeId } = await params;
        if (!mongoose.isValidObjectId(resumeId)) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Invalid resume ID" },
                { status: 400 }
            );
        }

        const deletedResume = await ResumeModel.findOneAndDelete({
            _id: resumeId,
            userId,
        });

        if (!deletedResume) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: "Resume not found" },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume deleted successfully",
            data: deletedResume,
        });
    } catch (error) {
        if (isAuthenticationFailure(error)) {
            const response = NextResponse.json<ApiResponse>(
                { success: false, message: error.message },
                { status: error.statusCode }
            );
            response.cookies.delete("token");
            return response;
        }

        console.error("error in delete resume api", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}