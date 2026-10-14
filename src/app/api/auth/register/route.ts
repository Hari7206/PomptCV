import { connectDB } from "@/lib/mongodb";
import { RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import UserModel from "@/models/User.model";
import { generateToken } from "@/lib/jwt";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        let body: RegisterBody = await req.json();

        let { name, email, password, mobile } = body;

        if (!name || !email || !password) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "All fields are required"
            },
                { status: 400 });
        }


        let isExisted = await UserModel.findOne({ email });

        if (isExisted) {
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "User already exists"
            },
                { status: 409 });
        }

        let newUser = await UserModel.create({
            name,
            email,
            password,
            mobile
        });

     const token = generateToken({
    userid: newUser._id.toString(),
    email: newUser.email
});

const response = NextResponse.json<ApiResponse>({
    success: true,
    message: "User registered successfully",
    data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
    }
}, { status: 201 });

response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === "production",
    path: "/"
});

return response;
    }  catch (error) {
    console.error("Error in register route:", error);

    return NextResponse.json<ApiResponse>({
        success: false,
        message: "Something went wrong"
    }, { status: 500 });
}
}

