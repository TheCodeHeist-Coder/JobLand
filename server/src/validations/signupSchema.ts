import { z } from 'zod';


export const registerUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Name must be atleast 3 characters long')
        .max(50, 'Name must not exceed 50 characters'),

    userName: z
        .string()
        .trim()
        .min(3, 'Username must be at least 3 characters long')
        .max(255, 'Username must not exceed 255 characters')
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            'Username can only contain letters, numbers, underscores, and hyphens'
        ),

    email: z
        .email("Please enter a valid email address")
        .trim()
        .max(255, "Email must not exceed 255 characters")
        .toLowerCase(),



    password: z
        .string()
        .min(5, "Password must be at least 8 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one lowercase, one uppercase letter, and a number"
        ),



    role: z
        .enum(["applicant", "employer"], {
            error: "Role must an applicant or employer"
        })
        .default("applicant"),

    phoneNumber: z
                 .string()
                 .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
                    

})

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;

export const registerUserConfirmPassSchema = registerUserSchema.extend({
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password don't match",
        path: ["confirmPassword"],
    });


export type RegisterUserWithConfirmData = z.infer<typeof registerUserConfirmPassSchema>