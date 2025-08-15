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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { loginUser } from "@/actions/users";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const loginFormSchema: any = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string()
})

export default function LoginForm() {
    const [ loading, setLoading ] = useState(false)
    const router = useRouter();
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
            role: 'user'
        }
    });

    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        try {
            setLoading(true)
            const response = await loginUser(values);
            if (!response.success) {
                throw new Error(response.message)
            }
            toast.success(response.message)
            Cookies.set("jwt_token", response.data!);
            Cookies.set("user_role", values.role);
            form.reset();
            router.push(`/${values.role}/dashboard`)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="w-full px-10">
            <h1 className="text-xl uppercase font-bold text-primary">
                Login to your account
            </h1>
            <hr className="my-5 border-b border-gray-300" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
                     <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-10"
                                >
                                <FormItem className="flex items-center gap-3">
                                    <FormControl>
                                        <RadioGroupItem value="user" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        User
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center gap-3">
                                    <FormControl>
                                        <RadioGroupItem value="admin" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Admin
                                    </FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <h1 className="text-sm text-gray-600 font-semibold">
                                Don't have an account ?
                            </h1>
                            <Link href={"/?form=register"} className="text-sm text-primary underline font-medium">
                                Register
                            </Link>
                        </div>
                    </div>
                    <Button type="submit" disabled={loading}>Login</Button>
                </form>
            </Form>
        </div>
    )
}