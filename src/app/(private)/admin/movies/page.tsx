"use client"

import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IMovie } from '@/interfaces'
import toast from 'react-hot-toast'
import { deleteMovie, getAllMovies } from '@/actions/movies'
import { Edit2, Trash2 } from 'lucide-react'
import Spinner from '@/components/functional/spinner'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/helpers/date-time-formats'


export default function AdminMoviesPage() {
  const [ movies, setMovies ] = useState<IMovie[]>([])
  const [ loading, setLoading ] = useState<boolean>(true);
  const router = useRouter();

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const response: any = await getAllMovies();
      if (!response.success) {
        throw new Error(response.message)
      }
      setMovies(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies();
  }, [])

  const handleDelete = async (movieId: string) => {
    try {
      setLoading(true)
      const response = await deleteMovie(movieId)
      if (!response.success) {
        throw new Error(response.message)
      }
      toast.success(response.message)
      fetchMovies()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    'Film',
    'Tanggal Rilis',
    'Durasi',
    'Actions'
  ]
  return (
    <div className='flex flex-col gap-5'>
        <div className='flex justify-between items-center'>
            <PageTitle title='Film' />
            <Button className='bg-cyan-600'>
                <Link href={'/admin/movies/add'}>
                    Tambah Film
                </Link>
            </Button>
        </div>

        {loading && <Spinner />}

        {!loading && movies.length === 0 && (
          <h1 className='text-center text-lg'>No Movie Found</h1>
        )}

        {!loading && movies.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="text-left">{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell className='py-5'>
                    <div className='flex items-center gap-3'>
                      <img src={movie.poster_url} alt={movie.name} className='w-20 rounded-lg'/>
                      <div className='flex flex-col'>
                        <span className='font-bold'>{movie.name}</span>
                        <span className='text-gray-500'>{movie.genre}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(movie.release_date)}</TableCell>
                  <TableCell>{movie.duration}m</TableCell>
                  <TableCell>
                    <div className='flex gap-2 items-center'>
                      <Button onClick={() => router.push(`/admin/movies/edit/${movie.id}`)} variant={"secondary"} size={'icon'}>
                        <Edit2 size={15} />
                      </Button>
                      <Button onClick={() => handleDelete(movie.id)} variant={"secondary"} size={'icon'}>
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

    </div>
  )
}
