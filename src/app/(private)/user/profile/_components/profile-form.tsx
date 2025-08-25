import { ITheatre, IUser } from '@/interfaces'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
import { addTheatre, updateTheatre } from '@/actions/theatres';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { uploadFileAndGetUrl } from '@/helpers/file-uploads';
import { Label } from '@/components/ui/label';
import { getLoggedInUser, updateUser } from '@/actions/users';

interface IUserFormProps {
    initialValues?: Partial<IUser> | null
    setOpenEdit: Dispatch<SetStateAction<boolean>>
    setUser: (user: IUser) => void
}

const userFormSchema: any = z.object({
  name: z.string().min(1, 'Name is required'),
  gender: z.enum(["male", "female"]).optional(),
  city: z.string().optional(),
  date_of_birth: z.string().optional(),
})

export default function ProfileForm({ initialValues, setOpenEdit, setUser }: IUserFormProps) {
    const [ loading, setLoading ] = useState(false)
    const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
        name: initialValues?.name || "",
        gender: initialValues?.gender || "male",
        city: initialValues?.city || "",
        date_of_birth: initialValues?.date_of_birth || "",
    }
    });

    useEffect(() => {
    if (initialValues) {
        form.reset({
            name: initialValues.name || "",
            gender: initialValues?.gender || "male",
            city: initialValues?.city || "",
            date_of_birth: initialValues?.date_of_birth || "",
        });
    }
    }, [initialValues, form]);

    async function onSubmit(values: z.infer<typeof userFormSchema>) {
        try {
            setLoading(true)
            const response = await updateUser(initialValues?.id || '', values)

            if (!response?.success) {
                throw new Error(response?.message || 'failed to edit user')
            }

            const freshUser = await getLoggedInUser()
            setUser(freshUser.data)

            toast.success(response.message || 'User updated successfully')
            setOpenEdit(false)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-[35px] text-gray-500 capitalize'>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} value={field.value} className='flex'>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="male" id="r1" />
                                        <Label htmlFor="r1">Male</Label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="female" id="r2" />
                                        <Label htmlFor="r2">Female</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type='date' {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-3 mt-5">
                    <Button type="submit" disabled={loading}>
                    Simpan
                    </Button>
                </div>
            </form>
        </Form>
    )
}
