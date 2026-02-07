import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long.")
    .max(255, "Name must be under 255 characters."),
  userName: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long.")
    .max(255, "Username must not exceed 255 character.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores and hypens.",
    ),
  email: z
    .email("Please provide a valid email adress.")
    .trim()
    .toLowerCase()
    .max(255, "Email must not exceed 255 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 character long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
    ),
  role: z
    .enum(["applicant", "employer"], {
      error: "Role must be applicant or employer",
    })
    .default("applicant"),
});

export type RegisterUserData = z.infer<typeof registerUserSchema>;





export const registerUserWithConfirmSchema = registerUserSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password didn't matched",
    path: ["confirmPassword"],
  });

  
export type RegisterUserWithConfirmData = z.infer<
  typeof registerUserWithConfirmSchema
>;


export const loginUserSchema = z.object({
  email: z.email("Please enter a valid email adress.").trim().max(255, "Email must be under 255 character").toLowerCase(),

  password: z.string().min(8, "Password must be at least 8 character long"),
})

export type LoginUserData = z.infer<typeof loginUserSchema>;