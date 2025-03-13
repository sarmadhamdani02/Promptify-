import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import PromptGalleryModel from "@/models/PromptGallery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    console.log("✅ Database connected successfully");

    const { id, userId } = await request.json();
    console.log("🛠️ Received Data:", { id, userId });

    if (!id || !userId) {
      console.log("❌ Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log("❌ Invalid ID format:", { id, userId });
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Fetch the prompt and populate upVotes to ensure it exists
    const prompt = await PromptGalleryModel.findById(id).select("upVotes").lean();
    console.log("🔍 Prompt Found:", prompt);

    if (!prompt) {
      console.log("❌ Prompt not found for ID:", id);
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    // Ensure upVotes is an array
    const upVotes = prompt.upVotes || [];
    console.log("📌 Current upVotes:", upVotes);

    const alreadyLiked = upVotes.some((vote) => vote.toString() === userId);
    console.log("📌 Already Liked?", alreadyLiked);

    if (alreadyLiked) {
      await PromptGalleryModel.findByIdAndUpdate(id, { $pull: { upVotes: userId } });
      console.log("👍 Removed Like");
    } else {
      await PromptGalleryModel.findByIdAndUpdate(id, { $push: { upVotes: userId } });
      console.log("❤️ Added Like");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("🚨 upVotes/route.ts :: POST() :: Error ❌ :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
