import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().regex(/^[a-zA-Z0-9_]{3,20}$/),
  password: z
    .string()
    .min(6, { message: "Password must  be at least 6 characters long" }),
});

export type SignInInput = z.infer<typeof signInSchema>;
