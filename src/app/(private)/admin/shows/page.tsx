"use client"

import { deleteShow, getAllShows } from '@/actions/shows'
import Spinner from '@/components/functional/spinner'
import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import { IShow } from '@/interfaces'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit2, Trash2 } from 'lucide-react'
import { formatDate, formatTime } from '@/helpers/date-time-formats'

export default function AdminShowsPage() {
  const [ shows, setShows ] = useState<IShow[]>([])
  const [ loading, setLoading ] = useState<boolean>(true);
  const router = useRouter();

  const fetchShows = async () => {
    try {
      setLoading(true)
      const response: any = await getAllShows();
      if (!response.success) {
        throw new Error(response.message)
      }
      setShows(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (showId: string) => {
    try {
      setLoading(true)
      const response = await deleteShow(showId)
      if (!response.success) {
        throw new Error(response.message)
      }
      toast.success(response.message)
      fetchShows()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShows();
  }, [])

  const columns = [
    'Film',
    'Teater',
    'Tangaal',
    'Jam',
    'Harga Tiket',
    'Kursi Tersedia',
    'Actions'
  ]

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex justify-between items-center mb-10'>
        <PageTitle title='Penayangan' />
        <Button>
          <Link href={'/admin/shows/add'}>
            Tambah Show
          </Link>
        </Button>
      </div>
      {loading && <Spinner />}
      
      {!loading && shows.length === 0 && (
        <h1 className='text-center text-lg'>No Show Found</h1>
      )}

      {!loading && shows.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="text-left">{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shows.map((show) => (
                <TableRow key={show.id}>
                  <TableCell>{show.movie.name}</TableCell>
                  <TableCell>{show.theatre.name}</TableCell>
                  <TableCell>{formatDate(show.date)}</TableCell>
                  <TableCell>{formatTime(show.time)}</TableCell>
                  <TableCell>Rp {show.ticket_price.toFixed(3)}</TableCell>
                  <TableCell>{show.available_seats_count}</TableCell>
                  <TableCell className='py-5'>
                    <div className='flex gap-2 items-center'>
                      <Button onClick={() => router.push(`/admin/shows/edit/${show.id}`)} variant={"secondary"} size={'icon'}>
                        <Edit2 size={15} />
                      </Button>
                      <Button onClick={() => handleDelete(show.id)} variant={"secondary"} size={'icon'}>
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
