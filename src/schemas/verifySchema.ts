import { z } from "zod";

export const verifySchema = z.object({

  verifyCode: z
    .string()
    .length(6, "Verification code must be 6 characters") // Ensures code length is 6
    .nonempty("Verification code is required"), // Ensures code is not empty
});
