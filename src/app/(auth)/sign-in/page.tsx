"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signupSchema"
import axois,{AxiosError} from 'axios'
import axios from "axios"
import { ApiResponce } from "@/types/ApiResponce"
 const page = () => {
const [username,setUsername]=useState('')
const [usernameMessage, setusernameMessage] = useState('')
const [isCheakingUsername, setisCheakingUsername] = useState(false)
const[isSubmitting,setIsSubmitting]=useState(false)

const debouncedUsername= useDebounceValue(username,300)
const { toast } = useToast()
const router=useRouter()
//zod implementation
const form= useForm<z.infer<typeof signUpSchema>>({
  resolver:zodResolver(signUpSchema),
  defaultValues: {
      username:'',
      email:'',
      password:''
  },

})

useEffect(()=>{
  const cheakUsernameUnique=async ()=>{
    if(debouncedUsername){
      setisCheakingUsername(true)
      setusernameMessage('')
      try {
    const response=    await axios.get(`/api/cheak-username-unique?username=${debouncedUsername}`)
        setusernameMessage(response.data.message)
      } catch (error) {
        const AxiosError=error as AxiosError <ApiResponce>;
        setusernameMessage(AxiosError.response?.data.message?? "Error Cheaking Username")

      }
      finally{
        setisCheakingUsername(false)
      }
    }
  }
  cheakUsernameUnique()

},[debouncedUsername])

const onSubmit=async(data:z.infer<typeof signUpSchema>)=>{

  setIsSubmitting(true)
  try {
    const response=await axois.post<ApiResponce>('/api/sign-up',data)
    toast({title:'Success',
      description:response.data.message
    })
    router.replace(`/verify/${username}`)
    setIsSubmitting(false)
    

  } catch (error) {
    console.error("Error in signup in User")
    let errorMessage
  }
}
  return (
    <div>page</div>
  )
}

export default page