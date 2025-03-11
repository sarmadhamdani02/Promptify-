import mongoose, { Schema, Document } from "mongoose";

export interface PromptGallery extends Document {
  username: string;
  description: string;
  title: string;
  prompt: string;
  likes: [{ type: mongoose.Schema.Types.ObjectId; ref: "User" }];
  dislikes: [{ type: mongoose.Schema.Types.ObjectId; ref: "User" }];
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
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    required: true,
  },
});

const PromptGalleryModel =
  mongoose.models.PromptGallery || // Ensure case matches
  mongoose.model<PromptGallery>("PromptGallery", promptGallerySchema);

export default PromptGalleryModel;
