"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction, useState } from "react";
import { registerUser } from "@/actions/users";
import toast from "react-hot-toast";

const registerFormSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
})

export default function RegisterForm({
    setForm,
}: {
    setForm: Dispatch<SetStateAction<'login' | 'register'>>,
}) {
    const [ loading, setLoading ] = useState(false);
    const form = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });

    async function onSubmit(values: z.infer<typeof registerFormSchema>) {
        try {
            setLoading(true)
            const response = await registerUser(values)
            if (!response.success) {
                throw new Error(response.message)
            }
            toast.success(response.message)
            form.reset();
            setForm('login')
        } catch (error: any) {
            toast.error(error.message)            
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="w-full px-10">
            <h1 className="text-xl uppercase font-bold text-cyan-800">
                Register your account
            </h1>
            <hr className="my-5 border-b border-cyan-600" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField  
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-cyan-800">Name</FormLabel>
                                <FormControl>
                                    <Input className="border-cyan-700" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-cyan-800">Email</FormLabel>
                                <FormControl>
                                    <Input className="border-cyan-700" placeholder="" {...field} />
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
                                <FormLabel className="text-cyan-800">Password</FormLabel>
                                <FormControl>
                                    <Input className="border-cyan-700" placeholder="" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <h1 className="text-sm text-gray-600 font-semibold">
                                Already have an account ?
                            </h1>
                            <span onClick={() => setForm('login')} className="text-sm text-cyan-700 underline font-medium cursor-pointer">
                                Login
                            </span>
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="bg-cyan-600">Register</Button>
                </form>
            </Form>
        </div>
    )
}