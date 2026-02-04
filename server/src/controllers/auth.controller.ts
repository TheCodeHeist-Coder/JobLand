import { Request, Response } from "express"
import { RegisterUserSchema, registerUserSchema } from "../validations/signupSchema.js";
import { prisma } from '../lib/prisma.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "../validations/loginSchema.js";

export const signUpController = async (req: Request, res: Response) => {

    const { data, error } = registerUserSchema.safeParse(req.body);

    if (error) {
        return res.status(400).json({
            "success": false,
            "message": error.issues[0].message
        })
    }

    const { name, userName, email, password, role, phoneNumber } = data;

    try {

        //? Check User existed or not
        const ExistedUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { userName },
                    { email }
                ]
            }
        })

        if (ExistedUser) {
            return res.status(401).json({
                "success": false,
                "message": "UserName or Email existed already"
            })
        }

        //? Hash the pasword
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                userName,
                password,
                role,
                phoneNumber
            }
        })


        return res.status(201).json({
            "success": true,
            "message": "You are signedUp successfully",
            "user": user
        })


    } catch (error) {

        console.log(error)
        return res.status(500).json({
            "success": false,
            "message": "Internal Server Error"
        })

    }

}



export const loginController = async (req: Request, res: Response) => {

    const {data, error} = loginSchema.safeParse(req.body);

    if(error){
        return res.status(400).json({
            "success": false,
            "message": error.issues[0].message
        })
    }


   try {
     const {email, password} = data;

    const user = await prisma.user.findUnique({
        where:{
            email
        }
    })

    if(!user){
        return res.status(400).json({
            "success": false,
            "message": "User doesn't exist..."
        })
    }


    const isPasswordMatched = await bcrypt.compare(user.password, password);

    if(isPasswordMatched){
        const token = jwt.sign({
            userId: user.id, userRole: user.role
        },process.env.JWT_SECRET ?? "", {expiresIn: "7d"})
  
         return res.status(200).json({
        "success": false,
        "message": `${user.name}, logged in successfully`,
        "token": token
       })
        
         
    }else{
        return res.status(400).json({
            "success": false,
            "message": "Invalid Credentials"
        })
    }
   } catch (error) {
    
     return res.status(500).json({
            "success": false,
            "message": "Internal Server Error"
        })

   }

   

    



}