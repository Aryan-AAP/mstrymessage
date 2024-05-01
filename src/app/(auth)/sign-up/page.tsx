"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signupSchema";
// import axois,{AxiosError} from 'axios'
// import axios from "axios"
import axios from "axios";
import { AxiosError } from "axios";
import { ApiResponce } from "@/types/ApiResponce";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDebounceCallback } from 'usehooks-ts'

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setusernameMessage] = useState("");
  const [isCheakingUsername, setisCheakingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();
  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const cheakUsernameUnique = async () => {
      if (username) {
        setisCheakingUsername(true);
        setusernameMessage("");
        try {
          const response = await axios.get(
            `/api/cheak-username-unique?username=${username}`
          );
          setusernameMessage(response.data.message);
        } catch (error) {
          const AxiosError = error as AxiosError<ApiResponce>;
          setusernameMessage(
            AxiosError.response?.data.message ?? "Error Cheaking Username"
          );
        } finally {
          setisCheakingUsername(false);
        }
      }
    };
    cheakUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponce>("/api/sign-up", data);
      toast({ title: "Success", description: response.data.message });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup in User");
      const axiosError = error as AxiosError<ApiResponce>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  return <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md ">
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


                  <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username"
                 {...field}
                 onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                 }}
                 />
              </FormControl>
                 {isCheakingUsername && <Loader2 className="animate-spin"
                 />}
                 <p>
                    test {usernameMessage }
                 </p>
            
              <FormMessage />
            </FormItem>
          )}
        />

                  <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email"
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
        />        <Button type="submit" disabled={isSubmitting} >
          {
            isSubmitting?(<><Loader2 className="mr-2 h-4 w-4 animate-spin "/> Please Wait</>):('SignUp')
          }
        </Button>

                  </form>

                </Form>
<div>
  Already a member? {' '}
  <Link href="/sign-in" className="text-blue-600 ">Sign In</Link>
</div>

            </div>
  </div>;
};

export default page;
