import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/Users.model";
import bcrypt from "bcryptjs";

const OTP_EXPIRY_HOURS = 1;

export async function POST(request: Request) {
  await dbConnect();

  try {
    
    
    const { name, username, email, password } = await request.json();
    console.log( name, username, email)
    const existingUserVerifiedByUserName = await userModel.findOne({
      username,
      isVerified: true,
    });

    console.log("🔹 Received Data:", { name, username, email, password });

    if (existingUserVerifiedByUserName) {
      return Response.json(
        {
          success: false,
          message: "UserName already taken.",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already verified!",
          },
          {
            status: 500,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = otp;

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + OTP_EXPIRY_HOURS);

      const newUser = new userModel({
        name: name,
        username: username,
        email,
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpiry: expiryDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "user",
        isVerified: false,
      });

      await newUser.save();
    }

    // send verification email

    const emailResponse = await sendVerificationEmail(email, username, otp);

    if (!emailResponse.success) {
      console.error("Email sending failed:", emailResponse.message);
      return Response.json(
        {
          success: false,
          message: "Failed to send verification email. Please try again.",
        },
        {
          status: 400, // ✅ CORRECT STATUS CODE
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully, veryfy your email.",
      },
      {
        status: 201,
      }
    );
  } 
  catch (error) {
    console.error("🔥 Sign-Up API Error:", error);
  
    return Response.json(
      {
        success: false,
        message: error.message || "Something went wrong during sign-up.",
        error: error, // Log the full error for debugging
      },
      {
        status: 500,
      }
    );
  }
  
}
