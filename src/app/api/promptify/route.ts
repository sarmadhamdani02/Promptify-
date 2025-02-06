import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession, User } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import promptModel from "@/models/Prompts.model";
import userModel from "@/models/Users.model";

// Update this URL to the correct Deepseek API endpoint
const DEEPSEEK_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { userInput, tone, length, specific } = await request.json();
    const session = await getServerSession(authOption);
    const user = session?.user;
    console.log("user: ", user);

    // Construct the prompt
    // const prompt = `
    //   Hi Deepseek, you are a professional prompt writer for GPTs.
    //   Your job is to process this user input:

    //   {
    //     userInput: ${userInput},
    //     "Tone/Style Preference": ${tone},
    //     "Length Preference": ${length},
    //     "Specific": ${specific}
    //   }

    //   Ask the AI to perform the task described in userInput, and ensure it adheres to the tone, length, and specific enhancements mentioned above.

    //   Just output the prompt.
    // `;

    const prompt = `
  Hi Deepseek, you are an expert prompt engineer for GPTs. Your task is to generate a high-quality prompt based on the user's input.

  User Input:
  - Task: ${userInput}
  - Tone/Style: ${tone}
  - Length: ${length}
  - Specific Focus: ${specific}

  Please ensure that the generated prompt is:
  - Aligned with the user's tone/style preference.
  - Asks AI to meet the length requirement.
  - Focused on the specific aspects mentioned.

  The result should be a fully formed, clear prompt that an AI can use to generate the desired content. As an output only give me the prompt

   .
`;

    console.log("Sending request to Deepseek API with prompt:", prompt);

    // Send the request to the Deepseek API
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek/deepseek-r1-distill-llama-70b:free", // Ensure this is the correct model name
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    console.log("Received response from Deepseek API:", response.data);
    console.log("Deepseek API Response:", response.data);

    // Extract the enhanced prompt from the response
    const enhancedPrompt = response.data.choices[0].message.content;

    if (enhancedPrompt?.trim() && user) {
      const userFromDB = await userModel.findOne({
        username: user.name,
        isVerified: true,
      });

      if (!userFromDB) {
        console.log("Your either isnt verified");
        if (!userFromDB) {
          console.log("User is not verified");
          return NextResponse.json(
            { success: false, message: "User is not verified" },
            { status: 403 }
          );
        }
      } else {
        try {
          const newPrompt = new promptModel({
            userId: userFromDB._id,
            inputText: userInput,
            responseText: enhancedPrompt,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await newPrompt.save();
        } catch (error) {
          console.error("Error saving prompt to database:", error);
          return NextResponse.json(
            {
              success: false,
              message: "Failed to save prompt to database",
              error: error.message,
            },
            { status: 500 }
          );
        }

      }
    }

    return NextResponse.json({ success: true, enhancedPrompt });
  } catch (error) {
    // Log the full error for debugging
    console.error(
      "Error enhancing prompt:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to enhance prompt",
        error: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
