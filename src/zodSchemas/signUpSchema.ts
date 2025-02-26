import { z } from "zod";

export const emailSchema = z.string().email();

export const usernameSchema = z
    .string()
    .min(2, "Username can not be less than 2 characters")
    .max(20, "Username can not be more than 20 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can not contain special characters and spaces.")

export const passwordSchema = z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" })
    .max(30, "Password can not be more than 30 characters.")
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@.#$%^&*]{8,30}$/, "Password must contain at least one uppercase letter, one number, and one special character.")

export const signUpSchema = z.object({
    fullName: z.string(),
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema
})