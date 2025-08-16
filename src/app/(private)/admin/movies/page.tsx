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
import { getAllMovies } from '@/actions/movies'
import { Edit2, Trash2 } from 'lucide-react'


export default function AdminMoviesPage() {
  const [ movies, setMovies ] = useState<IMovie[]>([])
  const [ loading, setLoading ] = useState<boolean>(true);

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

  const columns = [
    'Name',
    'Poster',
    'Release Date',
    'Genre',
    'Duration',
    'Actions'
  ]
  return (
    <div className='flex flex-col gap-5'>
        <div className='flex justify-between items-center'>
            <PageTitle title='Movies' />
            <Button>
                <Link href={'/admin/movies/add'}>
                    Add Movie
                </Link>
            </Button>
        </div>

        {loading && <h1>Loading...</h1>}

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
                  <TableCell>{movie.name}</TableCell>
                  <TableCell>
                    <img src={movie.poster_url} alt={movie.name} className='w-20 h-20 object-contain' />
                  </TableCell>
                  <TableCell>{movie.release_date}</TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell>{movie.duration}</TableCell>
                  <TableCell>
                    <div className='flex gap-2 items-center'>
                      <Button variant={"secondary"} size={'icon'}>
                        <Edit2 size={15} />
                      </Button>
                      <Button variant={"secondary"} size={'icon'}>
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
