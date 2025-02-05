import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/Users.model";
import bcrypt from "bcryptjs";

const OTP_EXPIRY_HOURS = 1;

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { id, name, username, email, password } = await request.json();
    const existingUserVerifiedByUserName = await userModel.findOne({
      username,
      isVerified: true,
    });

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
        id: id,
        name: name,
        username: username,
        email,
        password: hashedPassword,
        verifyCode: otp,
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
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
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
  } catch (error) {
    console.error("sign-up>route.ts", " :: POST() :: Error ❌ : ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
