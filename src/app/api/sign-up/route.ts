import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request:Request) {
    await dbConnect()
    try {
      const {username,email,password} = await request.json()
     const exsistingUserVerifiedByUsername= await  UserModel.findOne({username,isVerified:true})
if(exsistingUserVerifiedByUsername){
    return Response.json({success:false,
    message:"Username is Already Taken"},{status:400})
}
const exsistingUserbyemail=await UserModel.findOne({email})
const verifyCode=Math.floor(100000+Math.random()*900000).toString()

if(exsistingUserbyemail){

    if(exsistingUserbyemail.isVerified){
        return Response.json({success:false,
        message:"LOL tera account pahele se hee"},{status:400})
    }else{
        const hashedPassword=await bcrypt.hash(password,10)
        exsistingUserbyemail.password=hashedPassword;
        exsistingUserbyemail.verifyCode=verifyCode;
        exsistingUserbyemail.verifyCodeExpiry=new Date(Date.now()+3600000)
        await exsistingUserbyemail.save()

    }
}else{
    const hashedPassword=await bcrypt.hash(password,10)
    const expiryDate=new Date()
    expiryDate.setHours(expiryDate.getHours()+1)

    const newUser =new UserModel({
        username,

        email,
        password:hashedPassword,

        verifyCode,

        verifyCodeExpiry:expiryDate,

        isVerified:false,
        isAcceptingMessage:true,
        messages:[]
    })
    await newUser.save()

}
//send Verification
const emailResponce =await sendVerificationEmail(email,username,verifyCode);
if(!emailResponce.success){
    return Response.json({  success:false,
        message:emailResponce.message},{status:500})
}

return Response.json({  success:true,
    message:"User register SuccessFully PLz verify the email"},{status:200})
    } 
    
    
    catch (error) {
        console.error("Error regstering User",error)
        return Response.json({
            success:false,
            message:"Error registering User"
        },{
            status:500
        })
    }
    
}