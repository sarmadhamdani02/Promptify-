import mongoose, { Schema, Document, mongo } from "mongoose";

export interface User extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  verifyCode: string;
  createdAt: Date;
  updatedAt: Date;
  role: "admin" | "user";
  isVerified: boolean;
}

const userSchema: Schema<User> = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
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

const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",userSchema);

export default userModel;