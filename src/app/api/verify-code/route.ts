import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
     const {username,code}= await request.json()

  const decodedUsername=  decodeURIComponent(username)
  const user=await UserModel.findOne({username:decodedUsername})

  if(!user){
    return Response.json({
        success:false,
        message:"User not found"
    },{
        status:500
    })
  }

  const isCodeValid=user.verifyCode===code
  const isCodeNotExperied=new Date(user.verifyCodeExpiry)>new Date()

  if(isCodeValid && isCodeNotExperied){
    user.isVerified=true
    await user.save()
    return Response.json({
        success:true,message:"Account verified"
    },{status:200})
  }
else if(!isCodeNotExperied){
    return Response.json({
        success:false,message:"Verification code has Experied plz signup again to get a new code"
    },{status:400})
}else{
    return Response.json({
        success:false,message:"Incorrect Verification code"
    },{status:400})

}
  } catch (error) {
    console.error("Error Verifing username",error)
    return Response.json({
        success:false,
        message:"Error Verifing username"
    },{
        status:500
    })
  }
}
