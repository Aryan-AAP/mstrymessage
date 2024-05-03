"use client"

import { useToast } from "@/components/ui/use-toast"
import { Message, User } from "@/model/User"
import { Toast } from "@/components/ui/toast"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponce } from "@/types/ApiResponce"
import { zodResolver } from "@hookform/resolvers/zod"
import { Description, Title } from "@radix-ui/react-toast"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { title } from "process"
import { use, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import { MessageCard } from "@/components/MessageCard"

// import React from 'react'

const message = () => {
    const [messages, setmessages] = useState<Message[]>([])
    const [isloading, setisloading] = useState(false)

    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { toast } = useToast();

    const handleDeleteMessage=(messageId:string)=>{
        setmessages(messages.filter((message)=>message._id!==messageId))
    }
    const {data:session}=useSession();
    const form=useForm({
        resolver:zodResolver(acceptMessageSchema)
    })
    const{register,watch,setValue}=form;

    const acceptMessages=watch('acceptMessages')
    const fetchAcceptMeessage=useCallback(async()=>{
        setIsSwitchLoading(true)

        try {
          const responce=  await axios.get<ApiResponce>('/api/accept-messages')
          setValue('acceptMessages',responce.data.isAcceptingMessage)

        } catch (error) {
            const axiosError=error as AxiosError<ApiResponce>
            // toast({
            //     title:"Login Failed",
            //     description:"Incorrect username or password",
        
            //     variant:"destructive"
            //   })
        }finally{
          setIsSwitchLoading(false);

        }
          
        
    },[setValue])


    const fetchMessage=useCallback(async(refresh:boolean=false)=>{
setisloading(true)
setIsSwitchLoading(false)
try {
  const responce=await axios.get<ApiResponce>('/api/get-messages')
  setmessages(responce.data.messages||[])
  if(refresh){
    toast({
      title:"Message",
      description:"Showing the message"
    })
  }


} catch (error) {
  toast({
    title:"Errors",
    variant:"destructive"
    
  })
}
finally{
  setisloading(false)
  setIsSwitchLoading(false)
}
    },[setisloading,setmessages])

    useEffect(() => {
      if(!session||!session.user)return 
      fetchMessage()
      fetchAcceptMeessage()

    }, [session,setValue,fetchAcceptMeessage,fetchMessage])
    
//handle switch change
const handleSwitchShange=async  () =>{
  try {
    const responce=await axios.post<ApiResponce>('/api/accept-messages',{
      acceptMessages:! acceptMessages
    })
    setValue('acceptMessages',!acceptMessages)
    toast({
      title:responce.data.message,
      
      variant:'default'

    })
  } catch (error) {
    toast({
      title:"Error",
      description:"Failed to fetch the data",
      variant:'default'

    })
    
  }
}
 const {username}=session?.user as User
 //Todo do more reserch to get the url

 const baseUrl=`${window.location.protocol}//${window.location.host}`
 const profileUrl=`${baseUrl}/u/${username}`


 const copyToClipboard=()=>{
navigator.clipboard.writeText(profileUrl)
toast({
  title:"Url Copied ",
  description:"Profile Url has been copied"

})
 }

if(!session||!session.user){
  return <div>Please Login</div>
}

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchShange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessage(true);
        }}
      >
        {isloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>  )
}

export default message