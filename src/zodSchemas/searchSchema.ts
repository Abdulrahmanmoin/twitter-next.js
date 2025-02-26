import { z } from "zod";

export const searchSchema = z.object({
  input: z.string()
})