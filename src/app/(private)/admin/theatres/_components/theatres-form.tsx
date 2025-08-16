import { ITheatre } from '@/interfaces'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { addTheatre, updateTheatre } from '@/actions/theatres';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';

interface ITheatreFormProps {
    openTheatreForm: boolean
    setOpenTheatreForm: Dispatch<SetStateAction<boolean>>
    reloadData: () => void
    selectedTheatre?: Partial<ITheatre>
    formType: 'add' | 'edit';
}

const thearesFormSchema: any = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  capacity: z.number().min(1, 'Capacity must be greater than 0'),
})

export default function TheatreForm({ openTheatreForm, setOpenTheatreForm, reloadData, selectedTheatre, formType }: ITheatreFormProps) {
    const [ loading, setLoading ] = useState(false)
    const form = useForm<z.infer<typeof thearesFormSchema>>({
    resolver: zodResolver(thearesFormSchema),
    defaultValues: {
        name: selectedTheatre?.name || "",
        address: selectedTheatre?.address || "",
        capacity: selectedTheatre?.capacity || 0,
    }
    });

    async function onSubmit(values: z.infer<typeof thearesFormSchema>) {
        try {
            setLoading(true)
            let response = null

            if (formType === 'add') {
                response = await addTheatre(values);
            } else if (formType === 'edit') {
                response = await updateTheatre(selectedTheatre?.id || '', values)
            }

            if (!response?.success) {
                throw new Error(response?.message || 'failed to add movie')
            }

            toast.success(response.message || 'Movie added successfully')
            reloadData();
            form.reset();
            setOpenTheatreForm(false)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <Dialog open={openTheatreForm} onOpenChange={setOpenTheatreForm}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{formType === 'add' ? 'Add Theatre' : 'Edit Theatre'}</DialogTitle>
                    <DialogDescription>
                        {formType === 'add'
                            ? 'Add a new theatre to the system.'
                            : 'Edit the detail of the selected theatre.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
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
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capacity</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        placeholder="" {...field} 
                                        onChange={(e) => form.setValue('capacity', parseInt(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-3 mt-5">
                        <Button type="button" variant={"outline"} onClick={() => {setOpenTheatreForm(false); form.reset()}}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                        {formType === 'add' ? 'Add Theatre' : 'Update Theatre'}
                        </Button>
                    </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
