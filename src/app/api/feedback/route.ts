import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";
import feedbackModel from "@/models/Feedback.model"; // Add a Feedback model

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return Response.json({ success: false, message: "All fields are required." }, { status: 400 });
        }

        // ✅ Check last feedback timestamp in DB
        const lastFeedback = await feedbackModel.findOne({ email }).sort({ createdAt: -1 });
        if (lastFeedback) {
            const elapsedTime = Date.now() - new Date(lastFeedback.createdAt).getTime();
            if (elapsedTime < 10 * 60 * 1000) {
                return Response.json({ success: false, message: "You can send feedback only once every 10 minutes." }, { status: 429 });
            }
        }

        // ✅ Save feedback in DB
        await feedbackModel.create({ name, email, message, createdAt: new Date() });

        // ✅ Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "sarmadfarooqhamdani@gmail.com",
            subject: "New Feedback Submission",
            html: `<h3>New Feedback</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
        });

        return Response.json({ success: true, message: "Feedback sent successfully!" });
    } catch (error) {
        return Response.json({ success: false, message: "Failed to send feedback." }, { status: 500 });
    }
}
