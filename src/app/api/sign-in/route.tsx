import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/Users.model";
import bcrypt from "bcryptjs";
import { signJwt } from "@/utils/jwt"; // ✅ JWT function
import { NextResponse } from "next/server"; // ✅ Next.js Response handling

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, password } = await request.json();
        const doesUserExist = await userModel.findOne({ username });

        if (!doesUserExist) {
            return NextResponse.json(
                { success: false, message: "Username does not exist." },
                { status: 401 }
            );
        }

        // ✅ Check if the user is verified
        if (!doesUserExist.isVerified) {
            return NextResponse.json(
                { success: false, message: "Please verify your email before logging in." },
                { status: 403 }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(password, doesUserExist.password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { success: false, message: "Wrong password mate!" },
                { status: 401 }
            );
        }

        // ✅ Generate JWT
        const token = signJwt({
            id: doesUserExist._id,
            username: doesUserExist.username,
            email: doesUserExist.email,
        });

        // ✅ Set JWT in HttpOnly Cookie (7 days expiry)
        const response = NextResponse.json(
            {
                success: true,
                message: "Logged in successfully",
                user: {
                    id: doesUserExist._id,
                    username: doesUserExist.username,
                    email: doesUserExist.email,
                },
            },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;
    } catch (error) {
        console.error("❌ Sign-in API Error:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
