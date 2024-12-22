import mongoose, { Schema, Document, mongo } from "mongoose";

export interface Prompt extends Document {
  id: string;
  userId: string;
  inputText: string;
  responseText: string;
  createdAt: Date;
  updatedAt: Date;
}

const promptSchema: Schema<Prompt> = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  inputText: {
    type: String,
    required: [true, "Prompt text is required"],
    minlength: 1,
  },
  responseText: {
    type: String,
    required: [true, "Response text is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const promptModel = mongoose.Model<Prompt> || mongoose.model<Prompt>("Prompt", promptSchema);

export default promptModel;
