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
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { loginUser } from "@/actions/users";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { IUser } from "@/interfaces";
import { IUserStore } from "@/store/users-store";

const loginFormSchema: any = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string()
})

export default function LoginForm({
    setForm,
    setUser,
    setOpenSheet
}: {
    setForm: Dispatch<SetStateAction<'login' | 'register'>>,
    setUser: (payload: IUser | null) => void
    setOpenSheet: Dispatch<SetStateAction<boolean>>
}) {
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
            Cookies.set("user_role", response.user.role);
            form.reset();
            setUser(response.user)
            setOpenSheet(false)
            router.push(`/`)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="w-full px-10">
            <h1 className="text-xl uppercase font-bold text-cyan-800">
                Login to your account
            </h1>
            <hr className="my-5 border-b border-cyan-600" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
                                Don't have an account ?
                            </h1>
                            <span onClick={() => setForm('register')} className="text-sm text-cyan-700 underline font-medium cursor-pointer">
                                Register
                            </span>
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="bg-cyan-600">Login</Button>
                </form>
            </Form>
        </div>
    )
}