import { z } from "zod";

// ✅ Username validation (used separately and inside `signupSchema`)
export const usernameValidate = z
  .string()
  .min(4, "Username must be at least 4 characters") // ✅ Fixed the incorrect "2 characters" message
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters except '_'.");

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

  username: usernameValidate, // ✅ Added username validation here

  email: z.string().email("Invalid email address format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),

  verifyCode: z
    .string()
    .length(6, "Verification code must be 6 characters")
    .optional(), // Optional if generated internally
});

// ✅ Extracts TypeScript type for use elsewhere
export type SignupInput = z.infer<typeof signupSchema>;
