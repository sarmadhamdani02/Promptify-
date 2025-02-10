import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


const DEEPSEEK_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { userInput, tone, length, specific } = await request.json();



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

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek/deepseek-r1-distill-llama-70b:free",
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

    const enhancedPrompt = response.data.choices[0]?.message?.content;
    if (!enhancedPrompt) {
      console.error("Error: Deepseek API did not return a valid response.");
      return NextResponse.json(
        { success: false, message: "Invalid response from Deepseek API" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, enhancedPrompt });
  } catch (error) {
    console.error("Error enhancing prompt:", error.response?.data || error.message);
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
