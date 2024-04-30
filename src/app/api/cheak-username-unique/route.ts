import dbConnect from "@/lib/dbConnect";
import { z } from "zod"; 
import { usernameValidation } from "@/schemas/signupSchema";
import UserModel from "@/model/User";


const UsernameQuerySchema=z.object({
    username: usernameValidation
})

export async function GET(request:Request){
    //TODO use this in all other routes 

    await dbConnect()
    try {
        const { searchParams}=new URL(request.url)
        const queryParam ={username:searchParams.get('username')}

       const result= UsernameQuerySchema.safeParse(queryParam)
    //    console.log(result)//TODO remove
       if(!result.success){
        const usernameErrors=result.error.format().
        username?._errors||[]
        return Response.json({success:false,message:
        usernameErrors.length>0?usernameErrors.join(','):'Invalid Query Params'
        },{status:400})
       }

       const {username}=result.data
      const  existingVerifiedUser= await UserModel.findOne({username,isVerified:true})
      if(existingVerifiedUser){
        return Response.json({
            success:false,
            message:"Username is ALready taken",
        },{status:400})
      }
      return Response.json({
        success:true,
        message:"Username is Unique",
    },{status:400})

    } catch (error) {
        console.error("Error Cheaking username",error)
        return Response.json({
            success:false,
            message:"Error cheaking username"
        },{
            status:500
        })
    }
}