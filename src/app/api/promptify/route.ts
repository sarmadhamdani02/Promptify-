import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Update this URL to the correct Deepseek API endpoint
const DEEPSEEK_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { userInput, tone, length, specific } = await request.json();

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
  - Meets the specified length.
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

    // Extract the enhanced prompt from the response
    const enhancedPrompt = response.data.choices[0].message.content;

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
