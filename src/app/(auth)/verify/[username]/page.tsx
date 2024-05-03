"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponce } from '@/types/ApiResponce'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
// import {useForm } from 'react-hook-form'
import * as z from "zod"
const VerifyAccount = () => {

const router =useRouter()
const params=useParams<{username:string}>()
const { toast } = useToast();

const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
 
  });


  const onSubmit =async (data:z.infer<typeof verifySchema>)=>{

    try {
      const response=  await axios.post('/api/verify-code',{username:params.username, code :data.code})
       toast({
        title:"Success",
        description:response.data.message

       })

       router.replace('/sign-in')
    } catch (error) {
        console.error("Error in signup in User");
        const axiosError = error as AxiosError<ApiResponce>;
        let errorMessage = axiosError.response?.data.message;
        toast({
            title: "Signup Failed",
            description: errorMessage,
            variant: "destructive",
          });
    }
  }



  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'> 
    <div>
        

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
           
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>


        </div></div>
  )
}

export default VerifyAccount