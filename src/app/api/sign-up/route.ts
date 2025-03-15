import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/Users.model";
import bcrypt from "bcryptjs";

const OTP_EXPIRY_HOURS = 1;

export async function POST(request: Request) {
  console.log("🔹 Step 1: Received sign-up request");

  await dbConnect();
  console.log("🔹 Step 2: Connected to DB");

  try {
    const { name, username, email, password } = await request.json();
    console.log("🔹 Step 3: Parsed JSON:", { name, username, email });

    const existingUserVerifiedByUserName = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUserName) {
      console.log("❌ Username already taken");
      return Response.json(
        { success: false, message: "UserName already taken." },
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        console.log("❌ User already verified!");
        return Response.json(
          { success: false, message: "User already verified!" },
          { status: 400 }
        );
      } else {
        console.log("🔹 Updating existing unverified user...");
        existingUserByEmail.password = await bcrypt.hash(password, 10);
        existingUserByEmail.verifyCode = otp;
        await existingUserByEmail.save();
      }
    } else {
      console.log("🔹 Creating new user...");
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + OTP_EXPIRY_HOURS);

      const newUser = new userModel({
        name,
        username,
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

    console.log("✅ Sending verification email to:", email);
    const emailResponse = await sendVerificationEmail(email, username, otp);

    if (!emailResponse.success) {
      console.error("❌ Email sending failed:", emailResponse.message);
      return Response.json(
        { success: false, message: "Failed to send verification email." },
        { status: 400 }
      );
    }

    console.log("✅ Email sent successfully!");
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 Sign-Up API Error:", error);
    return Response.json(
      {
        success: false,
        message: "Something went wrong during sign-up.",
        error,
      },
      { status: 500 }
    );
  }
}
