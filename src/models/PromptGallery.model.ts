import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPromptGallery extends Document {
  username: string;
  description: string;
  title: string;
  prompt: string;
  upVotes: mongoose.Schema.Types.ObjectId[];
  downVotes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

const PromptGallerySchema = new Schema({
  username: { type: String, required: true, ref: "User" },
  description: { type: String, required: true },
  title: { type: String, required: true },
  prompt: { type: String, required: true },
    upVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const PromptGalleryModel =
  (mongoose.models?.PromptGallery as Model<IPromptGallery>) ||
  mongoose.model<IPromptGallery>("PromptGallery", PromptGallerySchema);


export default PromptGalleryModel;
