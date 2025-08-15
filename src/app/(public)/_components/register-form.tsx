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
import Link from "next/link";
import { useState } from "react";
import { registerUser } from "@/actions/users";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const registerFormSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
})

export default function RegisterForm() {
    const [ loading, setLoading ] = useState(false);
    const router = useRouter();
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
            router.push('/?form=login');
        } catch (error: any) {
            toast.error(error.message)            
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="w-full px-10">
            <h1 className="text-xl uppercase font-bold text-primary">
                Register your account
            </h1>
            <hr className="my-5 border-b border-gray-300" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField  
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
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
                                    <Input placeholder="" type="password" {...field} />
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
                            <Link href={"/?form=login"} className="text-sm text-primary underline font-medium">
                                Login
                            </Link>
                        </div>
                    </div>
                    <Button type="submit" disabled={loading}>Register</Button>
                </form>
            </Form>
        </div>
    )
}