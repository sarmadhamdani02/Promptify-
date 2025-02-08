
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/Users.model";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    await dbConnect();


    try {
        const { username, password } = await request.json();
        const doesUserExist = await userModel.findOne({
            username,

        })
        if (!doesUserExist) {
            return Response.json(
                {
                    success: false,
                    message: "Username does not exist.",
                },
                {
                    status: 401,
                }
            )
        }

        else {
            const isPasswordCorrect = await bcrypt.compare(
                password,
                doesUserExist.password
            );

            if (!isPasswordCorrect) {
                return Response.json(
                    {
                        success: false,
                        message: "Wrong password mate!",
                    },
                    {
                        status: 401,
                    }
                )
            }

            else {
                return Response.json(
                    {
                        success: true,
                        message: "Logged in successfully",
                    },
                    {
                        status: 200,
                    }
                )
            }
        }
    } catch (error) {
        console.error("route.tsx", " :: POST() :: Error ❌ : ", error);
    }

}
