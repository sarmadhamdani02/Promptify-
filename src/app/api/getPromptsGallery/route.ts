import dbConnect from "@/lib/dbConnect";
import PromptGalleryModel from "@/models/PromptGallery.model";

export async function GET() {
  await dbConnect();

  try {
    const prompts = await PromptGalleryModel.find();
    console.log(`prompts from route: ${prompts} `);
    // Send the data back in the response
    return Response.json(
      {
        success: true,
        message: prompts || "Got prompts but cannot show.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("route.ts", " :: GET() :: Error ❌ : ", error);
    // Send error response to the client
    return Response.json(
        {
          success: false,
          message: "ERror mate",
        },
        {
          status: 500,
        }
  )}
}
