"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signupSchema";

import axios from "axios";
import { AxiosError } from "axios";
import { ApiResponce } from "@/types/ApiResponce";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDebounceCallback } from 'usehooks-ts'
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {

  // const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
   const result= await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password
    })
    if(result?.error){
      toast({
        title:"Login Failed",
        description:"Incorrect username or password",

        variant:"destructive"
      })
    }
    if(result?.url){
      router.replace('/dashboard')
    }
   
  };
  return <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md ">
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


                  <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="text"
                 {...field}
                
                 />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
                  <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password"
                 {...field}
                
                 />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />        <Button type="submit" >
        SignIN
        </Button>

                  </form>

                </Form>
            </div>
  </div>;
};

export default page;
