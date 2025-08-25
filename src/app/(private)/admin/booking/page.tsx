"use client"

import { getAllBookings } from '@/actions/bookings';
import PageTitle from '@/components/ui/page-title'
import { IBooking, IMovie } from '@/interfaces';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Spinner from '@/components/functional/spinner';
import { formatDate, formatTime } from '@/helpers/date-time-formats';
import NoDataMessage from '@/components/functional/no-data-message';
import { Calendar, Clock, Mail, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function UserBookingsPage() {
  const [bookings, setBookins] = useState<IBooking[]>([])
  const [ loading, setLoading ] = useState<boolean>(true);

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response: any = await getAllBookings();
      if (!response.success) {
        throw new Error(response.message)
      }
      setBookins(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchBookings()
  }, [])

  const columns = [
      'Film dan Teater',
      'Pemesan',
      'Penayangan',
      'Kursi',
      'Jumlah',
      'Status',
      'Waktu Pemesanan'
  ]

  return (
    <div>
        <PageTitle title='Daftar Booking' />

        {loading && <Spinner />}
        
        {!loading && bookings.length === 0 && (
          <NoDataMessage />
        )}

        {!loading && bookings.length > 0 && (
          <Table className='mt-10'>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="text-left">{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className='flex items-center gap-2 w-max'>
                      <img src={booking.movie?.poster_url} alt={booking.movie?.name} className='w-20 rounded-lg'/>
                      <div className='flex flex-col suppercase'>
                        <span className='font-semibold'>{booking.movie?.name}</span>
                        <span className='text-gray-600'>{booking.theatre?.name}</span>
                      </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div className="w-9 h-9 bg-blue-700 text-white rounded-full flex items-center justify-center uppercase font-bold text-xl
                        ">{booking.user?.name[0]}</div>
                      <div>
                        <div className='text-gray-600 flex flex-col'>
                          <div className='flex items-center gap-1'>
                            <User size={15}/>
                            <span>{booking.user?.name}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Mail size={15}/>
                            <span>{booking.user?.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className='flex flex-col text-gray-600'>
                      <span className='flex items-center gap-1'>
                        <Calendar size={15}/>
                        {formatDate(booking.show!.date)}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Clock size={15}/>
                        {formatTime(booking.show!.time)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2 items-center'>
                      {booking.seat_number.map((seat) => (
                        <div key={seat} className='w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center'>{seat}</div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className='text-gray-600'>Rp {booking.total_amount.toFixed(3)}</TableCell>
                  <TableCell>
                    <Badge className={`
                      ${booking.status === 'booked' ? 'bg-yellow-400' : 'bg-red-400'}  
                    `}>
                      {booking.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className='flex items-center gap-1 text-gray-600'>
                      <Calendar size={15}/>
                      {formatDate(booking.created_at)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        )}
    </div>
  )
}
