import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  firstName: string,
  otp: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code for Promtify⚡",
      react: VerificationEmail({ firstName, otp }),
    });

    return {
      success: true,
      message: "Successfully ✅ sent verification Email.",
    };
  } catch (error) {
    console.error(
      "sendVerificationEmail.ts",
      " :: sendVerificationEmail() :: Error ❌ : ",
      error
    );
    return { success: false, message: "Failed to send verification Email." };
  }
}
