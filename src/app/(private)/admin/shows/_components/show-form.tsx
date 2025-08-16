"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IMovie, IShow, ITheatre } from '@/interfaces'
import React from 'react'
import { addShow, updateShow } from "@/actions/shows";
import { getAllMovies } from "@/actions/movies";
import { getAllTheatres } from "@/actions/theatres";

interface ShowFormProps {
  formType: 'add' | 'edit',
  initialValues?: Partial<IShow>
}

const showFormSchema: any = z.object({
  movie_id: z.string().min(1, 'Movie is required'),
  theatre_id: z.string().min(1, 'Theatre is required'),
  time: z.string().min(1, 'Time is required'),
  date: z.string().min(1, 'Date is required'),
  ticket_price: z.number().min(1, 'Ticket price is required'),
})

export default function ShowForm({ formType, initialValues }: ShowFormProps) {
  const router = useRouter();
  const [ loading, setLoading ] = useState(false)
  const [ movies, setMovies ] = useState<IMovie[]>([])
  const [ theatres, setTheatres ] = useState<ITheatre[]>([])
  const [ fetchingData, setFetchingData ] = useState(false)

  const form = useForm<z.infer<typeof showFormSchema>>({
    resolver: zodResolver(showFormSchema),
    defaultValues: {
        movie_id: initialValues?.movie_id || "",
        theatre_id: initialValues?.theatre_id || "",
        time: initialValues?.time || "",
        date: initialValues?.date || "",
        ticket_price: initialValues?.ticket_price || 0,
    }
  });

  const fetchData = async () => {
    try {
      setFetchingData(true)
      const [movieResponse, theatreResponse] = await Promise.all([
        getAllMovies(),
        getAllTheatres()
      ])
      if (!movieResponse.success || !theatreResponse.success) {
        throw new Error(
          movieResponse.message || theatreResponse.message || 'failed to fetch data'
        )
      }
      setMovies(movieResponse.data || [])
      setTheatres(theatreResponse.data || [])
    } catch (error: any) {
      toast.error(error.message || 'something went wrong while fetching data')
    } finally {
      setFetchingData(false)
    }
  }

  async function onSubmit(values: z.infer<typeof showFormSchema>) {
    try {
      setLoading(true)

      let response = null

      if (formType === 'add') {
        const theatre = theatres.find((theatre) => {
          return theatre.id.toString() === values.theatre_id
        })
        values.available_seats_count = theatre?.capacity || 0;
        values.booked_seats = [];
        response = await addShow(values);
      } else if (formType === 'edit') {
        response = await updateShow(initialValues?.id || '', values)
      }

      if (!response?.success) {
        throw new Error(response?.message || 'failed to add show')
      }

      toast.success(response.message || 'Show added successfully')
      form.reset();
      router.push(`/admin/shows`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full">
          <div className="grid grid-cols-3 gap-5">
            <FormField
              control={form.control}
              name="movie_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value.toString()} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a movie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {movies.map((movie) => (
                        <SelectItem key={movie.id} value={movie.id.toString()}>
                          {movie.name}
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
              name="theatre_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theatre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value.toString()} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a theatre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {theatres.map((theatre) => (
                        <SelectItem key={theatre.id} value={theatre.id.toString()}>
                          {theatre.name}
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
              name="date"
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
              name="time"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                          <Input type="time" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ticket_price"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>Ticket Price</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="" {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value))
                            }}
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <Button type="button" variant={"outline"} onClick={() => router.push('/admin/shows')}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {formType === 'add' ? 'Add Show' : 'Update Show'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
