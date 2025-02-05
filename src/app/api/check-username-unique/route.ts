import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/Users.model";
import { z } from "zod";
import { usernameValidate } from "@/schemas/signUpSchema";

const usernameValidateSchema = z.object({
  username: usernameValidate,
});

export async function GET(request: Request) {
 

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = usernameValidateSchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrorMessage =
        result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message: "Invalid username format",
          errors: usernameErrorMessage,
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Check-username-unique/route.ts",
      " :: GET() :: Error ❌ : ",
      error
    );
  }
}
