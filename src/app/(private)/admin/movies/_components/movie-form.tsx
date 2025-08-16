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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { movieGenres } from "@/constants";


interface MovieFormProps {
    formType: 'add' | 'edit';
}

const movieFormSchema: any = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  release_date: z.string().min(1, 'Release date is required'),
  genre: z.string().min(1, 'Genre is required'),
  duration: z.string().min(1, 'Duration is required'),
  poster_url: z.string().min(1, 'Poster URL is required'),
})

export default function MovieForm({ formType }: MovieFormProps) {
  const [ loading, setLoading ] = useState(false)
  const router = useRouter();
  const form = useForm<z.infer<typeof movieFormSchema>>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
        name: "",
        description: "",
        release_date: "",
        genre: "",
        duration: "",
        poster_url: "",
    }
  });

  async function onSubmit(values: z.infer<typeof movieFormSchema>) {
        try {
            setLoading(true)
            form.reset();
            router.push(`/${values.role}/dashboard`)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='mt-5'>
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
              name="description"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                          <Textarea placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
          />
          <div className="grid grid-cols-3 gap-5">
            <FormField
              control={form.control}
              name="release_date"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                        <Input type='date' placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {movieGenres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                          <Input placeholder="e.g. 120 minutes" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <Button type="button" variant={"outline"} onClick={() => router.push('/admin/movies')}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {formType === 'add' ? 'Add Movie' : 'Update Movie'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
