import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User.model";
import { generateToken } from "@/lib/jwt";
import { ApiResponse } from "@/types/api.types";
import { LoginBody, RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        let body: LoginBody = await req.json();

        let { email, password } = body;

        if (!email || !password) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "All fields are required"
            },
                { status: 400 });
        }


        let isExisted = await UserModel.findOne({ email });

        if (!isExisted) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "User not found"
            },
                { status: 409 });
        }



        let matchpass = isExisted.comparePassword(password);

        if(!matchpass){
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "Invalid credentials"
            },
                { status: 401 });
        }

        let token = generateToken({ userid: isExisted._id.toString(), email: isExisted.email });

        let response = NextResponse.json<ApiResponse>({
            success: true,
            message: "user registerd sucessfully",
            data: {
                _id: isExisted._id,
                name: isExisted.name,
                email: isExisted.email
            }
        }, { status: 201 });


        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000, // 1 day
            secure: process.env.NODE_ENV === "production",
        })

        return response;
    } catch (error) {
        console.log("Error in register route", error);
        return NextResponse.json<ApiResponse>({
            success: false,
            message: 'something went wrong',
            error: {
                error
            }
        }, { status: 500 })
    }
}