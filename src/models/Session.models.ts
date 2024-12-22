import mongoose, { Schema, Document } from "mongoose";

export interface Session extends Document {
  id: string;
  userId: string; // Link session to a user
  sessionToken: string; // Unique session token
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date; // When the session expires
}

const sessionSchema: Schema<Session> = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true, // Ensure the session is linked to a user
    ref: "User", // Reference to the User model
  },
  sessionToken: {
    type: String,
    required: true, // Store session token here for validation
    unique: true, // Ensure the session token is unique
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true, // Ensure an expiration time for the session
  },
});

// Automatically expire session after certain period (e.g., 1 hour)
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const sessionModel =
  (mongoose.models.Session as mongoose.Model<Session>) ||
  mongoose.model<Session>("Session", sessionSchema);

export default sessionModel;
