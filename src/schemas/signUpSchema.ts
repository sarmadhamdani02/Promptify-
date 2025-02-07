import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

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

// Example usage:
export type SignupInput = z.infer<typeof signupSchema>; // Extracts TypeScript type

// To validate:
const validateSignup = (data: unknown) => {
  const result = signupSchema.safeParse(data); // Validates and provides result
  if (!result.success) {
    throw new Error(result.error.errors.map((err) => err.message).join(", "));
  }
  return result.data; // Returns valid data
};

export const usernameValidate = z
  .string()
  .min(4, "Username must be at least 2 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username must not contain any special character except '_' ."
  );


