import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import PromptGalleryModel from "@/models/PromptGallery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { id, userId } = await request.json();

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Fetch the prompt and populate downVotes to ensure it exists
    const prompt = await PromptGalleryModel.findById(id)
      .select("downVotes")
      .lean();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    // Ensure downVotes is an array
    const downVotes = prompt.downVotes || [];

    const alreadyDisliked = downVotes.some((vote) => vote.toString() === userId);

    if (alreadyDisliked) {
      await PromptGalleryModel.findByIdAndUpdate(id, {
        $pull: { downVotes: userId },
      });
    } else {
      await PromptGalleryModel.findByIdAndUpdate(id, {
        $push: { downVotes: userId },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
