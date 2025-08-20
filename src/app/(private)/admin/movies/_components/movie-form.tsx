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
import { uploadFileAndGetUrl } from "@/helpers/file-uploads";
import { addMovie, updateMovie } from "@/actions/movies";
import { IMovie } from "@/interfaces";


interface MovieFormProps {
    formType: 'add' | 'edit';
    initialValues?: Partial<IMovie>
}

const movieFormSchema: any = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  release_date: z.string().min(1, 'Release date is required'),
  genre: z.string().min(1, 'Genre is required'),
  duration: z.string().min(1, 'Duration is required'),
  poster_url: z.string().min(1, 'Poster URL is required'),
})

export default function MovieForm({ formType, initialValues }: MovieFormProps) {
  const [ selectedPosterFile, setSelectedPosterFile ] = useState<File | null>(null)
  const [ loading, setLoading ] = useState(false)
  const router = useRouter();
  const form = useForm<z.infer<typeof movieFormSchema>>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        release_date: initialValues?.release_date || "",
        genre: initialValues?.genre || "",
        duration: initialValues?.duration || "",
        poster_url: initialValues?.poster_url || "",
    }
  });

  async function onSubmit(values: z.infer<typeof movieFormSchema>) {
    try {
      setLoading(true)

      const payload = { ...values }
      if (selectedPosterFile) {
        const uploadResponse = await uploadFileAndGetUrl(selectedPosterFile)
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.message)
        }
        payload.poster_url = uploadResponse.data
      }

      let response = null

      if (formType === 'add') {
        response = await addMovie(payload);
      } else if (formType === 'edit') {
        response = await updateMovie(initialValues?.id || '', payload)
      }

      if (!response?.success) {
        throw new Error(response?.message || 'failed to add movie')
      }

      toast.success(response.message || 'Movie added successfully')
      form.reset();
      router.push(`/admin/movies`)
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
                    <FormLabel>Nama Film</FormLabel>
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
                      <FormLabel>Deskripsi</FormLabel>
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
                    <FormLabel>Tanggal Rilis</FormLabel>
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
                        <SelectValue placeholder="" />
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
                      <FormLabel>Durasi</FormLabel>
                      <FormControl>
                          <Input placeholder="e.g. 120 minutes" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
            />
          </div>
          <div className="flex gap-5">
            {(selectedPosterFile || form.getValues().poster_url ) && (
              <div className="mt-3">
                <img
                  src={selectedPosterFile
                    ? URL.createObjectURL(selectedPosterFile!)
                    : form.getValues().poster_url}
                  alt="Selected poster"
                  className="w-32 rounded-lg"
                />
              </div>
            )}
            <div className="w-max">
              <label htmlFor="file selection">Pilih Poster</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setSelectedPosterFile(file);
                    form.setValue('poster_url', URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <Button type="button" className="bg-transparent" variant={"outline"} onClick={() => router.push('/admin/movies')}>Batal</Button>
            <Button className="bg-cyan-600" type="submit" disabled={loading}>
              {formType === 'add' ? 'Tambah Film' : 'Update Film'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}