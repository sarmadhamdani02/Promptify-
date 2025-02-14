import { Resend } from "resend";

console.log(process.env.RESEND_API_KEY)
const resend = new Resend(process.env.RESEND_API_KEY);


async function sendTestEmail() {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // Ensure it's a verified sender
      to: "shahsarmadhamdani@gmail.com",
      subject: "Test Email",
      text: "This is a test email",
    });

    console.log("✅ Test Email Sent:", response);
  } catch (error) {
    console.error("❌ Test Email Failed:", error);
  }
}

sendTestEmail();
