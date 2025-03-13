import dbConnect from "@/lib/dbConnect";
import PromptGalleryModel from "@/models/PromptGallery.model";

export async function POST(request: Request) {
  const { username, description, title, prompt } = await request.json();

  await dbConnect();

  try {
    const promptGallery = new PromptGalleryModel({
      username,
      description,
      title,
      prompt,
      upVotes: [],
      downVotes: [],
      createdAt: new Date(),
    });

    await promptGallery.save();

    return Response.json(
      { success: true, message: "Prompt Gallery saved successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("route.ts", " :: POST() :: Error ❌ : ", error);
    return Response.json(
      { success: false, message: "Failed to upload prompt" },
      {
        status: 500,
      }
    );
  }
}
