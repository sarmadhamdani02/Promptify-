import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/Users.model";
import { z } from "zod";
import { usernameValidate } from "@/schemas/signUpSchema";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {

    try {

        const { username, code } = await request.json();
        const user = await userModel.findOne({ username });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "Couldn't find User",
                },
                {
                    status: 404,
                }
            );
        }

        const isCodeValid = await user.verifyCode === code;
        const createdAtDate = new Date(user.createdAt);
        const expiryDate = new Date(createdAtDate.setHours(createdAtDate.getHours() + 1));
        const isCodeNotExpired = expiryDate > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "User Verified Successfully",
                },
                {
                    status: 200,
                }
            );
        }

        else if (!isCodeNotExpired) {
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

            const newExpiryDate = new Date();
            newExpiryDate.setHours(newExpiryDate.getHours() + 1);

            user.verifyCode = newOtp;
            user.verifyCodeExpiry = newExpiryDate;
            await user.save();

            const emailResponse = await sendVerificationEmail(
                user.email,
                user.username,
                newOtp
            );


            if (!emailResponse.success) {
                return Response.json(
                    {
                        success: false,
                        message: "OTP was expired. Failed to send new OTP email.",
                    },
                    {
                        status: 500,
                    }
                );
            }

            // Inform the user that a new OTP has been sent
            return Response.json(
                {
                    success: true,
                    message: "OTP expired. A new OTP has been sent to your email.",
                },
                {
                    status: 200,
                }
            );
        }

        else {
            return Response.json(
                {
                    success: false,
                    message: "Invalid OTP.",
                },
                {
                    status: 400,
                }
            );
        }



    } catch (error) {
        console.error(
            "verify-route/route.ts",
            " :: GET() :: Error ❌ : ",
            error
        );

        return Response.json(
            {
                success: false,
                message: "Error verifying user",
            },
            {
                status: 500,
            }
        );

    }
}
