import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const FeedbackModel = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
export default FeedbackModel;
