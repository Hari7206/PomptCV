import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import {
  GetCurrentUser,
  isAuthenticationFailure,
} from "@/lib/getCurrentUser";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    await connectDB();
    const userId = await GetCurrentUser();
    const resumes = await ResumeModel.find({ userId }).sort({ updatedAt: -1 });

    return NextResponse.json<ApiResponse & { resumes: object[] }>({
      success: true,
      message: "Resumes fetched successfully",
      resumes,
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

    console.error("error in get resumes api", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
