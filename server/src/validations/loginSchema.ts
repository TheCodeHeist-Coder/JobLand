import {z} from 'zod';


export const loginSchema = z.object({
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

})