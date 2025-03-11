import { z } from "zod";

export const promptSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID format" }), // Reference to the user who created the prompt
  input: z
    .string()
    .min(1, { message: "Prompt input cannot be empty" })
    .max(500, { message: "Prompt input must not exceed 500 characters" }), // User's original input
  enhancedPrompt: z
    .string()
    .min(1, { message: "Enhanced prompt cannot be empty" })
    .optional(), // Optional, generated after processing
  createdAt: z.date().default(() => new Date()), // Defaults to the current date
  updatedAt: z.date().default(() => new Date()), // Defaults to the current date
  isSaved: z.boolean().default(false), // Flag to check if the prompt is saved
});

export type PromptInput = z.infer<typeof promptSchema>;
