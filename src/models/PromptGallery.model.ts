import mongoose, { Schema, Document } from "mongoose";

export interface PromptGallery extends Document {
  username: string;
  description: string;
  title: string;
  prompt: string;
  upVotes: number;
  downVotes: number;
  createdAt: Date;
}

const promptGallerySchema: Schema<PromptGallery> = new Schema({
  username: {
    type: String,
    required: true,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  upVotes: {
    type: Number,
  },
  downVotes: {
    type: Number,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const PromptGalleryModel =
  mongoose.models.promptGallery || mongoose.model<PromptGallery>("promptGallery", promptGallerySchema);

  export default PromptGalleryModel;

