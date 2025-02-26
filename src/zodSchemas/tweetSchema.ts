import { z } from "zod";

export const tweetSchema = z.object({
    content: z
        .string()
        .max(280, "Content cannot be more than 280 characters.")
})