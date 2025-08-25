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
import { Building2, Calendar, Clock, Edit2, MapPin, Trash2 } from 'lucide-react'
import { formatDate, formatTime } from '@/helpers/date-time-formats'
import NoDataMessage from '@/components/functional/no-data-message'

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
    'Waktu Penayangan',
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
            Tambah Penayangan
          </Link>
        </Button>
      </div>
      {loading && <Spinner />}
      
      {!loading && shows.length === 0 && (
        <NoDataMessage />
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
                  <TableCell>
                    <div className='flex items-center gap-3 py-3'>
                      <img src={show.movie.poster_url} alt={show.movie.name} className='w-20 rounded-lg'/>
                      <div className='flex flex-col'>
                        <span className='font-bold uppercase'>{show.movie.name}</span>
                        <span className='text-gray-500 capitalize'>{show.movie.genre}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col text-gray-600'>
                      <div className='flex items-center gap-1'>
                        <Building2 size={15}/>
                        <span>{show.theatre.name}</span>
                      </div>
                      <div className='flex items-center gap-1 capitalize'>
                        <MapPin size={15}/>
                        <span>{show.theatre.address}</span>
                      </div>
                    </div>
                    
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col text-gray-600'>
                      <span className='flex items-center gap-1'>
                        <Calendar size={15}/>
                        {formatDate(show.date)}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Clock size={15}/>
                        {formatTime(show.time)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-gray-600'>Rp {show.ticket_price.toFixed(3)}</TableCell>
                  <TableCell>
                    <div className='w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center'>
                      {show.available_seats_count}
                    </div>
                  </TableCell>
                  <TableCell>
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
