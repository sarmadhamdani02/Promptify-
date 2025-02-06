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

    const prompt = `You are an expert prompt engineer for GPTs. Your task is to generate a high-quality, enhanced prompt based on the user's input. Follow these instructions carefully:

1. **Input Details:**
   - Task: ${userInput}
   - Tone/Style: ${tone}
   - Length: ${length}
   - Specific Focus: ${specific}

2. **Your Task:**
   - Generate a fully formed, clear, and optimized prompt that an AI can use to generate the desired content.
   - Ensure the generated prompt aligns with the user's tone/style preference.
   - Ensure the generated prompt meets the user's length requirement.
   - Ensure the generated prompt focuses on the specific aspects mentioned by the user.

3. **Output Rules:**
   - Output ONLY the enhanced prompt.
   - Do NOT include any additional commentary, explanations, or introductory phrases like "Here is your prompt."
   - Do NOT solve the problem or generate content based on the user's input. Your job is ONLY to write the enhanced prompt.

Now, generate the enhanced prompt based on the user's input. Remember, output ONLY the enhanced prompt.
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
