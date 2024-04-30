import {z} from 'zod'

export const usernameValidation=z
.string()
.min(2,"Usermane must be atlesast 2 char")
.max(20,"TOO long no more than 20 Char")
.regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special char")

export const signUpSchema=z.object({
   username: usernameValidation,
   email: z.string().email({message:'Invalid Email addresss'}),
   password:z.string().min(6,{message:"TOo short"})

})