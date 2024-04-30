import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponce } from "@/types/ApiResponce";

export async function sendVerificationEmail(email:string,
username:string,
verifyCode:string
):Promise<ApiResponce>{
try {


    const data = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'MistryMEssage Verification Code',
        react:VerificationEmail({username:username,otp:verifyCode}),
      });

    return{success:true,message:'Send Email Successfully'}

    
} catch (emailError) {
    console.error("Error sending verification email",emailError)
    return{success:false,message:'failed to sed verification error'}
}
}